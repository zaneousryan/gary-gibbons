// Effects DSL (tech spec §4.3) — what content can DO. Effects are the only way
// content mutates GameState; each application emits its EventBus event so
// systems can react without content knowing about them.

import type { CardStatus, GameState } from './types';

export type Effect =
  | { setFlag: string; value?: boolean | number | string }
  | { clearFlag: string }
  | { giveCard: string; status?: CardStatus; via?: string }
  | { verify: string }
  | { markOffRecord: string }
  | { trust: { char: string; delta: number } }
  | { trustFloor: { char: string; min: number } }
  | { unlockDialogue: string }
  | { notebook: { entry?: string; question?: string; doodle?: string } }
  | { playBark: string }
  | { startSidestory: string }
  | { goTo: string }
  | { openPuzzle: string }
  | { advancePhase: true }
  | { collect: { lantern?: string; clipping?: string } }
  | { grapeDeclined: true };

export interface EffectEvent {
  type:
    | 'flag:set'
    | 'flag:cleared'
    | 'card:gained'
    | 'card:verified'
    | 'card:offrecord'
    | 'trust:changed'
    | 'dialogue:unlocked'
    | 'notebook:entry'
    | 'notebook:question'
    | 'notebook:doodle'
    | 'bark:play'
    | 'sidestory:started'
    | 'location:goto'
    | 'puzzle:open'
    | 'phase:advance'
    | 'collectible:gained'
    | 'grape:declined';
  payload: Record<string, unknown>;
}

const TRUST_MIN = -3;
const TRUST_MAX = 3;

function clampTrust(v: number): number {
  return Math.max(TRUST_MIN, Math.min(TRUST_MAX, v));
}

/**
 * Apply one effect to state (mutating — callers pass an Immer draft or a
 * plain object they own) and return the events it raised.
 */
export function applyEffect(state: GameState, effect: Effect): EffectEvent[] {
  const events: EffectEvent[] = [];

  if ('setFlag' in effect) {
    const value = effect.value ?? true;
    state.flags[effect.setFlag] = value;
    events.push({ type: 'flag:set', payload: { flag: effect.setFlag, value } });
  } else if ('clearFlag' in effect) {
    delete state.flags[effect.clearFlag];
    events.push({ type: 'flag:cleared', payload: { flag: effect.clearFlag } });
  } else if ('giveCard' in effect) {
    if (!state.cards[effect.giveCard]) {
      state.cards[effect.giveCard] = {
        status: effect.status ?? 'unverified',
        discoveredVia: effect.via ?? 'direct',
        readCount: 0,
      };
      events.push({ type: 'card:gained', payload: { card: effect.giveCard, status: effect.status ?? 'unverified' } });
    } else if (effect.status === 'verified' && state.cards[effect.giveCard].status === 'unverified') {
      state.cards[effect.giveCard].status = 'verified';
      events.push({ type: 'card:verified', payload: { card: effect.giveCard } });
    }
  } else if ('verify' in effect) {
    const card = state.cards[effect.verify];
    if (card && card.status === 'unverified') {
      card.status = 'verified';
      events.push({ type: 'card:verified', payload: { card: effect.verify } });
    }
  } else if ('markOffRecord' in effect) {
    const card = state.cards[effect.markOffRecord];
    if (card) {
      card.status = 'offrecord';
      events.push({ type: 'card:offrecord', payload: { card: effect.markOffRecord } });
    }
  } else if ('trust' in effect) {
    const prev = state.trust[effect.trust.char] ?? 0;
    const next = clampTrust(prev + effect.trust.delta);
    state.trust[effect.trust.char] = next;
    if (next !== prev) {
      events.push({ type: 'trust:changed', payload: { char: effect.trust.char, from: prev, to: next } });
    }
  } else if ('trustFloor' in effect) {
    const prev = state.trust[effect.trustFloor.char] ?? 0;
    const next = clampTrust(Math.max(prev, effect.trustFloor.min));
    state.trust[effect.trustFloor.char] = next;
    state.flags[`trust_floor_${effect.trustFloor.char}`] = effect.trustFloor.min;
    if (next !== prev) {
      events.push({ type: 'trust:changed', payload: { char: effect.trustFloor.char, from: prev, to: next } });
    }
  } else if ('unlockDialogue' in effect) {
    state.flags[`dlg_unlocked_${effect.unlockDialogue}`] = true;
    events.push({ type: 'dialogue:unlocked', payload: { dialogue: effect.unlockDialogue } });
  } else if ('notebook' in effect) {
    if (effect.notebook.entry) {
      events.push({ type: 'notebook:entry', payload: { entry: effect.notebook.entry } });
    }
    if (effect.notebook.question) {
      if (!state.notebook.questions.includes(effect.notebook.question)) {
        state.notebook.questions.push(effect.notebook.question);
      }
      events.push({ type: 'notebook:question', payload: { question: effect.notebook.question } });
    }
    if (effect.notebook.doodle) {
      if (!state.notebook.doodles.includes(effect.notebook.doodle)) {
        state.notebook.doodles.push(effect.notebook.doodle);
        state.collectibles.doodles.push(effect.notebook.doodle);
      }
      events.push({ type: 'notebook:doodle', payload: { doodle: effect.notebook.doodle } });
    }
  } else if ('playBark' in effect) {
    events.push({ type: 'bark:play', payload: { bark: effect.playBark } });
  } else if ('startSidestory' in effect) {
    state.flags[`sidestory_${effect.startSidestory}_started`] = true;
    events.push({ type: 'sidestory:started', payload: { sidestory: effect.startSidestory } });
  } else if ('goTo' in effect) {
    state.location = effect.goTo;
    events.push({ type: 'location:goto', payload: { location: effect.goTo } });
  } else if ('openPuzzle' in effect) {
    events.push({ type: 'puzzle:open', payload: { puzzle: effect.openPuzzle } });
  } else if ('advancePhase' in effect) {
    events.push({ type: 'phase:advance', payload: {} });
  } else if ('collect' in effect) {
    if (effect.collect.lantern && !state.collectibles.lanterns.includes(effect.collect.lantern)) {
      state.collectibles.lanterns.push(effect.collect.lantern);
      events.push({ type: 'collectible:gained', payload: { kind: 'lantern', id: effect.collect.lantern } });
    }
    if (effect.collect.clipping && !state.collectibles.clippings.includes(effect.collect.clipping)) {
      state.collectibles.clippings.push(effect.collect.clipping);
      events.push({ type: 'collectible:gained', payload: { kind: 'clipping', id: effect.collect.clipping } });
    }
  } else if ('grapeDeclined' in effect) {
    state.collectibles.grapesDeclined += 1;
    events.push({ type: 'grape:declined', payload: { total: state.collectibles.grapesDeclined } });
  } else {
    throw new Error(`Unknown effect shape: ${JSON.stringify(effect)}`);
  }

  return events;
}

export function applyEffects(state: GameState, effects: Effect[] | undefined): EffectEvent[] {
  if (!effects) return [];
  return effects.flatMap((e) => applyEffect(state, e));
}

/** Every content ID an effect list references — the validator's hook. */
export interface EffectRefs {
  flags: string[];
  cards: string[];
  chars: string[];
  dialogues: string[];
  barks: string[];
  sidestories: string[];
  locations: string[];
  notebookEntries: string[];
  questions: string[];
}

export function collectEffectRefs(effects: Effect[] | undefined, out?: EffectRefs): EffectRefs {
  const refs: EffectRefs = out ?? {
    flags: [], cards: [], chars: [], dialogues: [], barks: [], sidestories: [],
    locations: [], notebookEntries: [], questions: [],
  };
  if (!effects) return refs;
  for (const e of effects) {
    if ('setFlag' in e) refs.flags.push(e.setFlag);
    else if ('clearFlag' in e) refs.flags.push(e.clearFlag);
    else if ('giveCard' in e) refs.cards.push(e.giveCard);
    else if ('verify' in e) refs.cards.push(e.verify);
    else if ('markOffRecord' in e) refs.cards.push(e.markOffRecord);
    else if ('trust' in e) refs.chars.push(e.trust.char);
    else if ('trustFloor' in e) refs.chars.push(e.trustFloor.char);
    else if ('unlockDialogue' in e) refs.dialogues.push(e.unlockDialogue);
    else if ('notebook' in e) {
      if (e.notebook.entry) refs.notebookEntries.push(e.notebook.entry);
      if (e.notebook.question) refs.questions.push(e.notebook.question);
    } else if ('playBark' in e) refs.barks.push(e.playBark);
    else if ('startSidestory' in e) refs.sidestories.push(e.startSidestory);
    else if ('goTo' in e) refs.locations.push(e.goTo);
  }
  return refs;
}
