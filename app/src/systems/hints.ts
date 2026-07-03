// HintService (tech spec §6.8): stall timer per unmet gate (4 min) → badge
// glint → Ask Grandpa modal with ordered hints (name a node, never a pair —
// design doc §6). Timer state is session-local; hint progress persists via a
// flag so re-asking continues the sequence.

import type { ContentDB } from '@content/contentDb';
import { missingGates, type GameDef } from '@engine/clock';
import { useGameStore } from '@engine/store';

export const STALL_MS = 4 * 60 * 1000;

let stallStart: number | null = null;
let stalledGate: string | null = null;

/** Call on a timer from the UI. Returns true when the badge should glint. */
export function checkStall(game: GameDef, now: number): boolean {
  const state = useGameStore.getState().state;
  if (state.phase !== 'night') {
    stallStart = null;
    stalledGate = null;
    return false;
  }
  const missing = missingGates(game, state);
  if (missing.length === 0) {
    stallStart = null;
    stalledGate = null;
    return false;
  }
  if (stalledGate !== missing[0]) {
    stalledGate = missing[0];
    stallStart = now;
    return false;
  }
  return stallStart !== null && now - stallStart >= STALL_MS;
}

/** Grandpa's next hint for the first unmet gate, advancing the sequence. */
export function askGrandpa(db: ContentDB, game: GameDef): string | null {
  const state = useGameStore.getState().state;
  const missing = missingGates(game, state);
  if (missing.length === 0) return null;
  const gate = missing[0];
  const hints = db.hints.gates[gate];
  if (!hints || hints.length === 0) return null;
  const flag = `hint_progress_${gate}`;
  const progress = typeof state.flags[flag] === 'number' ? (state.flags[flag] as number) : 0;
  const hint = hints[Math.min(progress, hints.length - 1)];
  useGameStore.getState().runEffects([{ setFlag: flag, value: Math.min(progress + 1, hints.length - 1) }]);
  return hint.text;
}

/** Test/session reset. */
export function resetHintSession(): void {
  stallStart = null;
  stalledGate = null;
}
