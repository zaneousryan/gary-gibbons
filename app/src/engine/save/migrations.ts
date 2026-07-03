// Ordered save migrations (tech spec §4.5). Content IDs are save-referenced,
// so any post-Phase-2 ID change MUST add an upgrader here (ALETHEIA.md §7).

import type { GameState } from '../types';
import { GAME_STATE_VERSION } from '../types';

type Migration = {
  /** Upgrades a save FROM this version to version + 1. */
  from: number;
  up: (save: Record<string, unknown>) => Record<string, unknown>;
};

// Version 1 is the first shipped shape — no migrations yet.
const MIGRATIONS: Migration[] = [];

export function migrate(raw: Record<string, unknown>): GameState {
  let save = raw;
  let version = typeof save.version === 'number' ? save.version : 0;
  if (version > GAME_STATE_VERSION) {
    throw new Error(`Save version ${version} is newer than this build (${GAME_STATE_VERSION}).`);
  }
  while (version < GAME_STATE_VERSION) {
    const step = MIGRATIONS.find((m) => m.from === version);
    if (!step) {
      throw new Error(`No migration path from save version ${version}.`);
    }
    save = step.up(save);
    version = (save.version as number) ?? version + 1;
  }
  return save as unknown as GameState;
}
