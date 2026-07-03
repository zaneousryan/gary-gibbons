// Day/phase clock (tech spec §4.4). game.json defines the 7-day graph and each
// day's gateDeductions (design doc I.6). The clock itself is pure: given state
// and the game definition, what transition is legal?

import type { Day, GameState, Phase } from './types';

export const PHASES: Phase[] = ['morning', 'midday', 'evening', 'night'];

export interface DayDef {
  day: Day;
  /** Deduction ids required before night -> next morning (I.6 gate table). */
  gateDeductions: string[];
  /** Flag set when the day's core clues are complete (drives "Send Them Home"). */
  coreCompleteFlag?: string;
  /** Edition id that must be published on this night (Phase 3+; optional until then). */
  edition?: string;
}

export interface GameDef {
  startLocation: string;
  startDay: Day;
  startPhase: Phase;
  apartmentLocation: string;
  days: DayDef[];
  /** DEMO build (spec §13): night of this day ends the demo gracefully. */
  demoEndAfterDay?: Day;
}

export type ClockBlocker =
  | { kind: 'gate'; missing: string[] }
  | { kind: 'edition'; edition: string }
  | { kind: 'demo-end' }
  | { kind: 'end-of-game' };

export interface ClockResult {
  ok: boolean;
  next?: { day: Day; phase: Phase };
  blocked?: ClockBlocker;
}

export function dayDef(game: GameDef, day: Day): DayDef {
  const def = game.days.find((d) => d.day === day);
  if (!def) throw new Error(`game.json has no day ${day}`);
  return def;
}

/**
 * Compute the next day/phase from the current state.
 * morning→midday→evening are free advances (core-clue completion or player
 * choice at a sit-spot — the caller decides when to ask). evening→night is the
 * going-home beat. night→next morning requires the day's gateDeductions and,
 * once editions exist, the published edition. Nights are unskippable.
 */
export function advance(game: GameDef, state: GameState, opts?: { editionPublished?: boolean }): ClockResult {
  const { day, phase } = state;
  const idx = PHASES.indexOf(phase);

  if (phase !== 'night') {
    return { ok: true, next: { day, phase: PHASES[idx + 1] } };
  }

  // night -> next morning: check the gate
  const def = dayDef(game, day);
  const missing = def.gateDeductions.filter((d) => !state.board.deductions.includes(d));
  if (missing.length > 0) {
    return { ok: false, blocked: { kind: 'gate', missing } };
  }
  if (def.edition && !opts?.editionPublished && !state.editions.some((e) => e.day === day)) {
    return { ok: false, blocked: { kind: 'edition', edition: def.edition } };
  }
  if (game.demoEndAfterDay !== undefined && day >= game.demoEndAfterDay) {
    return { ok: false, blocked: { kind: 'demo-end' } };
  }
  if (day === 7) {
    return { ok: false, blocked: { kind: 'end-of-game' } };
  }
  return { ok: true, next: { day: (day + 1) as Day, phase: 'morning' } };
}

/** Which gate deductions are still missing for the current day (HintService + UI). */
export function missingGates(game: GameDef, state: GameState): string[] {
  return dayDef(game, state.day).gateDeductions.filter((d) => !state.board.deductions.includes(d));
}
