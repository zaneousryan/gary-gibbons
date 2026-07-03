// Scheduler v0 (tech spec §6.6): who is where right now. Weather routing via
// ifRain (II.14.2). Vignettes and townTheory land in later phases.

import type { ContentDB } from '@content/contentDb';
import type { GameState } from '@engine/types';

export interface ActorPlacement {
  characterId: string;
  locationId: string;
  spot?: string;
}

export function placementsFor(db: ContentDB, state: GameState): ActorPlacement[] {
  const out: ActorPlacement[] = [];
  for (const [characterId, sched] of Object.entries(db.schedules)) {
    const day = sched[`d${state.day}`];
    const placement = day?.[state.phase];
    if (!placement) continue;
    const locationId =
      state.weather === 'rain' && placement.ifRain ? placement.ifRain : placement.loc;
    out.push({ characterId, locationId, spot: placement.spot });
  }
  return out;
}

export function actorsAt(db: ContentDB, state: GameState, locationId: string): ActorPlacement[] {
  return placementsFor(db, state).filter((p) => p.locationId === locationId);
}

export function isCharacterAt(db: ContentDB, state: GameState, characterId: string, locationId: string): boolean {
  return actorsAt(db, state, locationId).some((p) => p.characterId === characterId);
}
