// DialogueSystem core (tech spec §6.1). Headless: the same runner drives the
// React DialogueBox and the autoplayer. Entry selection is PRIMED-first (the
// content lists entries in priority order; first passing cond wins).

import { create } from 'zustand';
import type { Dialogue, DialogueNode } from '@content/schemas/dialogue';
import type { ContentDB } from '@content/contentDb';
import { evalCondition, type Condition } from '@engine/conditions';
import type { Effect } from '@engine/effects';
import { useGameStore } from '@engine/store';
import { bus } from '@engine/eventBus';

export type Stance = 'press' | 'empathize' | 'observe';

export interface StanceView {
  stance: Stance;
  line: string;
  /** OBSERVE renders disabled-with-tooltip until its cond passes (§6.1). */
  enabled: boolean;
}

export interface DialogueView {
  dialogueId: string;
  characterId: string;
  nodeId: string;
  speaker: string;
  line?: string;
  stances?: StanceView[];
  choices?: { index: number; line: string }[];
  emote: string;
  offRecord: boolean;
  /** Node path so far — autoplay asserts on this (§6.1). */
  path: string[];
  done: boolean;
}

interface DialogueSession {
  dlg: Dialogue;
  nodeId: string;
  path: string[];
}

export interface DialogueStore {
  view: DialogueView | null;
  session: DialogueSession | null;
  start(db: ContentDB, dialogueId: string): boolean;
  chooseStance(stance: Stance): void;
  chooseOption(index: number): void;
  advance(): void;
  end(): void;
}

function nodeView(session: DialogueSession, done = false): DialogueView {
  const state = useGameStore.getState().state;
  const node = session.dlg.nodes[session.nodeId];
  const stances: StanceView[] | undefined = node.stances
    ? (Object.entries(node.stances) as [Stance, NonNullable<DialogueNode['stances']>['press']][])
        .filter(([, opt]) => opt)
        .map(([stance, opt]) => ({
          stance,
          line: opt!.line,
          enabled: evalCondition((opt!.cond ?? {}) as Condition, state),
        }))
    : undefined;
  const choices = node.choices
    ?.map((c, index) => ({ c, index }))
    .filter(({ c }) => evalCondition((c.cond ?? {}) as Condition, state))
    .map(({ c, index }) => ({ index, line: c.line }));
  return {
    dialogueId: session.dlg.id,
    characterId: session.dlg.character,
    nodeId: session.nodeId,
    speaker: node.speaker,
    line: node.line,
    stances,
    choices,
    emote: node.emote ?? 'neutral',
    offRecord: node.offRecord ?? false,
    path: [...session.path],
    done,
  };
}

/**
 * Off-the-record enforcement (III.23.1): cards gained inside an offRecord node
 * enter play as status "offrecord" — knowledge, not publishable proof.
 */
function applyNodeEffects(effects: Effect[] | undefined, offRecord: boolean) {
  if (!effects) return;
  const adjusted = offRecord
    ? effects.map((e) => ('giveCard' in e ? { ...e, status: 'offrecord' as const } : e))
    : effects;
  useGameStore.getState().runEffects(adjusted);
}

function enterNode(session: DialogueSession) {
  const node = session.dlg.nodes[session.nodeId];
  session.path.push(session.nodeId);
  applyNodeEffects(node.effects as Effect[] | undefined, node.offRecord ?? false);
}

export const useDialogueStore = create<DialogueStore>()((set, get) => ({
  view: null,
  session: null,

  start(db, dialogueId) {
    const dlg = db.dialogues[dialogueId];
    if (!dlg) throw new Error(`unknown dialogue "${dialogueId}"`);
    const game = useGameStore.getState();
    const state = game.state;

    if (dlg.oncePerDay && state.flags[`dlg_done_${dlg.id}_d${state.day}`]) {
      if (dlg.repeatBark) bus.emit({ type: 'bark:play', payload: { bark: dlg.repeatBark } });
      return false;
    }

    const entry = dlg.entries.find((e) => evalCondition((e.cond ?? {}) as Condition, state));
    if (!entry) return false;

    const session: DialogueSession = { dlg, nodeId: entry.node, path: [] };
    enterNode(session);
    set({ session, view: nodeView(session) });
    bus.emit({ type: 'dialogue:started', payload: { dialogue: dlg.id, entry: entry.id } });
    return true;
  },

  chooseStance(stance) {
    const { session } = get();
    if (!session) return;
    const node = session.dlg.nodes[session.nodeId];
    const opt = node.stances?.[stance];
    if (!opt) return;
    const state = useGameStore.getState().state;
    if (!evalCondition((opt.cond ?? {}) as Condition, state)) return;
    applyNodeEffects(opt.effects as Effect[] | undefined, node.offRecord ?? false);
    session.path.push(`${session.nodeId}:${stance}`);
    followNext(get(), set, session, opt.next);
  },

  chooseOption(index) {
    const { session } = get();
    if (!session) return;
    const node = session.dlg.nodes[session.nodeId];
    const choice = node.choices?.[index];
    if (!choice) return;
    const state = useGameStore.getState().state;
    if (!evalCondition((choice.cond ?? {}) as Condition, state)) return;
    applyNodeEffects(choice.effects as Effect[] | undefined, node.offRecord ?? false);
    session.path.push(`${session.nodeId}:choice${index}`);
    followNext(get(), set, session, choice.next);
  },

  advance() {
    const { session } = get();
    if (!session) return;
    const node = session.dlg.nodes[session.nodeId];
    if (node.stances || node.choices) return; // waiting for player input
    followNext(get(), set, session, node.next ?? null);
  },

  end() {
    const { session } = get();
    if (!session) {
      set({ view: null, session: null });
      return;
    }
    const game = useGameStore.getState();
    if (session.dlg.oncePerDay) {
      game.runEffects([{ setFlag: `dlg_done_${session.dlg.id}_d${game.state.day}` }]);
    }
    game.runEffects([{ setFlag: `dlg_done_${session.dlg.id}` }]);
    bus.emit({
      type: 'dialogue:ended',
      payload: { dialogue: session.dlg.id, path: [...session.path] },
    });
    set({ view: null, session: null });
  },
}));

function followNext(
  store: DialogueStore,
  set: (partial: Partial<DialogueStore>) => void,
  session: DialogueSession,
  next: string | null,
) {
  if (next === null) {
    set({ view: nodeView(session, true) });
    store.end();
    return;
  }
  session.nodeId = next;
  enterNode(session);
  set({ view: nodeView(session) });
}

/** Which dialogue would a talk-hotspot open for this character right now? */
export function selectDialogueFor(db: ContentDB, characterId: string): string | null {
  const state = useGameStore.getState().state;
  const candidates = Object.values(db.dialogues)
    .filter((d) => d.character === characterId)
    .sort((a, b) => a.id.localeCompare(b.id));
  for (const dlg of candidates) {
    if (!dlg.reentrant) {
      if (dlg.oncePerDay && state.flags[`dlg_done_${dlg.id}_d${state.day}`]) continue;
      if (state.flags[`dlg_done_${dlg.id}`] && !dlg.oncePerDay) continue;
    }
    if (dlg.entries.some((e) => evalCondition((e.cond ?? {}) as Condition, state))) return dlg.id;
  }
  return null;
}
