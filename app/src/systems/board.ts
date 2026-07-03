// BoardSystem (tech spec §6.2) — the flagship. Pure logic + store actions;
// the React Board renders what this decides. Sub-modules: pins, strings
// (deduction matcher), timeline rail, suspect ledger, theory rack,
// contradiction desk, off-record enforcement.

import type { ContentDB } from '@content/contentDb';
import type { Deduction } from '@content/schemas/deductions';
import { evalCondition, type Condition } from '@engine/conditions';
import { useGameStore } from '@engine/store';
import { bus } from '@engine/eventBus';
import { Rng } from '@engine/rng';

// ---------- pins ----------

export function pinCard(cardId: string, x: number, y: number): boolean {
  const game = useGameStore.getState();
  if (!game.state.cards[cardId]) return false;
  if (game.state.board.pins.some((p) => p.cardId === cardId)) return false;
  useGameStore.setState((s) => {
    s.state.board.pins.push({ cardId, x, y });
  });
  return true;
}

export function movePin(cardId: string, x: number, y: number): void {
  useGameStore.setState((s) => {
    const pin = s.state.board.pins.find((p) => p.cardId === cardId);
    if (pin) {
      pin.x = x;
      pin.y = y;
    }
  });
}

export function unpinCard(cardId: string): void {
  useGameStore.setState((s) => {
    s.state.board.pins = s.state.board.pins.filter((p) => p.cardId !== cardId);
    s.state.board.strings = s.state.board.strings.filter(
      (st) => st.from !== cardId && st.to !== cardId,
    );
  });
}

// ---------- strings & the deduction matcher ----------

export type StringResult =
  | { kind: 'deduction'; deduction: Deduction }
  | { kind: 'refused-offrecord'; card: string }
  | { kind: 'refused-unverified'; card: string; deduction: Deduction }
  | { kind: 'duplicate' }
  | { kind: 'miss'; bark: string | null };

/**
 * Order-free matching (spec §6.2): the player's selected cards satisfy a
 * deduction when every input is present among the selection (supersets allowed
 * up to 3 cards). Off-record cards refuse the string outright (III.23.1).
 */
export function matchDeduction(db: ContentDB, selected: string[]): Deduction | null {
  const owned = useGameStore.getState().state.board.deductions;
  const set = new Set(selected);
  for (const ded of db.deductions.deductions) {
    if (owned.includes(ded.id)) continue;
    if (ded.inputs.every((i) => set.has(i)) && selected.length <= Math.max(3, ded.inputs.length)) {
      return ded;
    }
  }
  return null;
}

/** Session-scoped wrong-pair bark memory — never repeat within a session (§6.2). */
const usedWrongPairBarks = new Set<string>();

function wrongPairBark(db: ContentDB): string | null {
  const pool = db.barks['wrong_pairs'];
  if (!pool) return null;
  const state = useGameStore.getState().state;
  const fresh = pool.barks.filter(
    (b) => !usedWrongPairBarks.has(b.id) && evalCondition((b.cond ?? {}) as Condition, state),
  );
  if (fresh.length === 0) return null;
  const rng = new Rng(state.rngSeed + usedWrongPairBarks.size);
  const pick = rng.pick(fresh);
  usedWrongPairBarks.add(pick.id);
  return pick.id;
}

export function connectCards(db: ContentDB, selected: string[]): StringResult {
  const game = useGameStore.getState();
  const state = game.state;

  // off-record refusal — the string will not take (III.23.1)
  for (const id of selected) {
    if (state.cards[id]?.status === 'offrecord') {
      bus.emit({ type: 'bark:play', payload: { bark: 'gary_inner_promised' } });
      return { kind: 'refused-offrecord', card: id };
    }
  }

  const ded = matchDeduction(db, selected);
  if (!ded) {
    // record the red string anyway if it's a novel pair — the mess is the player's
    if (selected.length === 2) {
      const [a, b] = selected;
      const exists = state.board.strings.some(
        (s) => (s.from === a && s.to === b) || (s.from === b && s.to === a),
      );
      if (exists) return { kind: 'duplicate' };
      useGameStore.setState((s) => {
        s.state.board.strings.push({ from: a, to: b, kind: 'red' });
      });
    }
    const bark = wrongPairBark(db);
    if (bark) bus.emit({ type: 'bark:play', payload: { bark } });
    return { kind: 'miss', bark };
  }

  // verified requirement
  if (ded.requireVerified) {
    for (const input of ded.inputs) {
      if (state.cards[input]?.status !== 'verified') {
        return { kind: 'refused-unverified', card: input, deduction: ded };
      }
    }
  }

  unlockDeduction(db, ded);
  return { kind: 'deduction', deduction: ded };
}

export function unlockDeduction(db: ContentDB, ded: Deduction): void {
  const game = useGameStore.getState();
  if (game.state.board.deductions.includes(ded.id)) return;

  useGameStore.setState((s) => {
    s.state.board.deductions.push(ded.id);
    // gold strings between all input pairs
    for (let i = 0; i < ded.inputs.length; i++) {
      for (let j = i + 1; j < ded.inputs.length; j++) {
        s.state.board.strings = s.state.board.strings.filter(
          (st) =>
            !(st.from === ded.inputs[i] && st.to === ded.inputs[j]) &&
            !(st.from === ded.inputs[j] && st.to === ded.inputs[i]),
        );
        s.state.board.strings.push({ from: ded.inputs[i], to: ded.inputs[j], kind: 'gold' });
      }
    }
    // ledger cell
    if (ded.produces.ledgerCell) {
      const { suspect, col } = ded.produces.ledgerCell;
      s.state.board.ledger[`${suspect}.${col}`] = ded.produces.card ?? ded.id;
    }
  });

  if (ded.produces.card) {
    game.runEffects([{ giveCard: ded.produces.card, status: 'verified' }]);
    // auto-pin the produced deduction card near the top of the cork
    const count = useGameStore.getState().state.board.pins.length;
    pinCard(ded.produces.card, 240 + (count % 6) * 260, 130);
  }
  if (ded.garyLine) game.runEffects([{ playBark: ded.garyLine }]);
  bus.emit({ type: 'deduction:unlocked', payload: { deduction: ded.id, kind: ded.kind } });
  checkTheoryRetirements(db);
}

// ---------- timeline rail (II.16.1) ----------

export type RailResult = 'seated' | 'no-anchor' | 'occupied' | 'not-event' | 'complete';

export function seatRailCard(db: ContentDB, cardId: string, slotId: string): RailResult {
  const state = useGameStore.getState().state;
  const card = db.cards[cardId];
  if (!card || card.type !== 'event') return 'not-event';
  if (card.railSlot !== slotId) return 'no-anchor';
  if (!evalCondition((card.anchor ?? {}) as Condition, state)) return 'no-anchor';
  if (state.board.rail[slotId]) return 'occupied';
  useGameStore.setState((s) => {
    s.state.board.rail[slotId] = cardId;
  });
  const slots = db.timeline?.slots ?? [];
  const filled = Object.keys(useGameStore.getState().state.board.rail).length;
  bus.emit({ type: 'card:gained', payload: { rail: slotId, card: cardId } });
  if (slots.length > 0 && filled === slots.length) {
    // STUB(phase-5): the Night-6 silent chronology cinematic plays here (II.16.1)
    bus.emit({ type: 'puzzle:opened', payload: { kind: 'rail-complete' } });
    return 'complete';
  }
  return 'seated';
}

// ---------- suspect ledger (II.16.2) ----------

const LEDGER_COLS = ['motive', 'means', 'opportunity'] as const;

export function ledgerRowComplete(suspect: string): boolean {
  const ledger = useGameStore.getState().state.board.ledger;
  return LEDGER_COLS.every((c) => ledger[`${suspect}.${c}`]);
}

export function stampCleared(db: ContentDB, suspect: string): boolean {
  const game = useGameStore.getState();
  if (game.state.board.cleared.includes(suspect)) return false;
  useGameStore.setState((s) => {
    s.state.board.cleared.push(suspect);
  });
  const bark = `stamp_cleared_${suspect}`;
  if (Object.values(db.barks).some((p) => p.barks.some((b) => b.id === bark))) {
    game.runEffects([{ playBark: bark }]);
  }
  return true;
}

// ---------- theory rack (II.16.3) ----------

export function checkTheoryRetirements(db: ContentDB): string[] {
  const state = useGameStore.getState().state;
  return db.deductions.theories
    .filter((t) => !state.board.retiredTheories.includes(t.id))
    .filter((t) => evalCondition(t.retireWhen as Condition, state))
    .map((t) => t.id);
}

export function retireTheory(db: ContentDB, theoryId: string): boolean {
  const theory = db.deductions.theories.find((t) => t.id === theoryId);
  const state = useGameStore.getState().state;
  if (!theory || state.board.retiredTheories.includes(theoryId)) return false;
  if (!evalCondition(theory.retireWhen as Condition, state)) return false;
  useGameStore.setState((s) => {
    s.state.board.retiredTheories.push(theoryId);
  });
  bus.emit({ type: 'flag:set', payload: { flag: `theory_retired_${theoryId}` } });
  useGameStore.getState().runEffects([{ setFlag: `theory_retired_${theoryId}` }]);
  return true;
}

// ---------- contradiction desk (II.16.4) ----------

export type DeskResult = { kind: 'contradiction'; id: string; question: string } | { kind: 'nothing' };

export function layOnDesk(db: ContentDB, a: string, b: string): DeskResult {
  const state = useGameStore.getState().state;
  for (const cx of db.deductions.contradictions) {
    const pair = new Set(cx.pair);
    if (pair.has(a) && pair.has(b) && a !== b) {
      if (state.board.contradictionsFound.includes(cx.id)) return { kind: 'nothing' };
      useGameStore.setState((s) => {
        s.state.board.contradictionsFound.push(cx.id);
      });
      useGameStore.getState().runEffects([{ notebook: { question: cx.producesQuestion } }]);
      bus.emit({ type: 'notebook:question', payload: { question: cx.producesQuestion, from: 'contradiction' } });
      return { kind: 'contradiction', id: cx.id, question: cx.producesQuestion };
    }
  }
  return { kind: 'nothing' };
}

/** Reset session-scoped memory (tests + new sessions). */
export function resetBoardSession(): void {
  usedWrongPairBarks.clear();
}
