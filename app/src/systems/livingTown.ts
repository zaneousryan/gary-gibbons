// LivingTown (tech spec §6.6, II.14.4, II.27): ambient vignettes on location
// entry (tags, day ranges, weather, no same-day repeats) and the town's own
// running wrong theory, fed by editions and events, expressed through rumor
// barks and the chalkboard.

import type { ContentDB } from '@content/contentDb';
import { evalCondition, type Condition } from '@engine/conditions';
import { useGameStore } from '@engine/store';
import { bus } from '@engine/eventBus';
import { Rng } from '@engine/rng';

/** The town's current wrong theory (II.27), derived from rumor seeds. */
export function townTheory(): string | null {
  const flags = useGameStore.getState().state.flags;
  // latest seeded rumor wins; seeds are set by edition reactions and events
  const rumors = Object.keys(flags).filter((f) => f.startsWith('rumor_') && flags[f]);
  return rumors.length > 0 ? rumors[rumors.length - 1].slice('rumor_'.length) : null;
}

/** Pick a vignette for the location just entered (proximity comes later — entry-triggered now). */
export function vignetteFor(db: ContentDB, locationId: string): string | null {
  const state = useGameStore.getState().state;
  const loc = db.locations[locationId];
  if (!loc?.ambient?.vignetteTags?.length) return null;
  const pool = db.barks['vignettes'];
  if (!pool) return null;
  const theory = townTheory();
  const candidates = pool.barks.filter((b) => {
    if (state.flags[`vignette_seen_${b.id}_d${state.day}`]) return false; // no same-day repeats
    if (!b.tags.some((t) => loc.ambient!.vignetteTags.includes(t) || t === `rumor_${theory}`)) return false;
    if (b.weather && b.weather !== state.weather) return false;
    return evalCondition((b.cond ?? {}) as Condition, state);
  });
  if (candidates.length === 0) return null;
  const rng = new Rng(state.rngSeed + state.day * 131 + locationId.length * 17);
  return rng.pick(candidates).id;
}

export function installVignetteWatcher(db: ContentDB): () => void {
  return bus.on('location:changed', (e) => {
    const game = useGameStore.getState();
    // one-in-three entries get a vignette — texture, not wallpaper
    const rng = new Rng(game.state.rngSeed + game.state.meta.playtimeSec + game.state.day);
    if (!rng.chance(1 / 3)) return;
    const pick = vignetteFor(db, e.payload.location as string);
    if (pick) {
      game.runEffects([{ setFlag: `vignette_seen_${pick}_d${game.state.day}` }, { playBark: pick }]);
    }
  });
}

/** Rumor line for ambient talk, keyed to the town's current theory (II.27). */
export function rumorLineFor(db: ContentDB, charId: string): string | null {
  const theory = townTheory();
  if (!theory) return null;
  const pool = db.barks['rumors'];
  if (!pool) return null;
  const state = useGameStore.getState().state;
  const line = pool.barks.find(
    (b) =>
      (b.speaker === charId || !b.speaker) &&
      b.tags.includes(`rumor_${theory}`) &&
      evalCondition((b.cond ?? {}) as Condition, state),
  );
  return line?.text ?? null;
}
