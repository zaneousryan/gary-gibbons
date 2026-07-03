// Photo mode (II.12.3): Warren lends the bellows camera at the end of Day 3.
// Three uses: evidence states, then&now overlays (a puzzle module), and the
// 47 lantern collectibles. Prints dry on the apartment line the next night.

import type { ContentDB } from '@content/contentDb';
import type { Day } from '@engine/types';
import { useGameStore } from '@engine/store';
import { bus } from '@engine/eventBus';

export const CAMERA_FLAG = 'has_camera';

export function hasCamera(): boolean {
  return !!useGameStore.getState().state.flags[CAMERA_FLAG];
}

/** Photo subjects at the current location: photo-kind hotspots whose cond passes. */
export function subjectsHere(db: ContentDB): { id: string; label: string; lantern?: string }[] {
  const state = useGameStore.getState().state;
  const loc = db.locations[state.location];
  if (!loc) return [];
  return loc.hotspots
    .filter((h) => h.kind === 'photo')
    .map((h) => ({ id: h.id, label: h.label ?? h.id, lantern: h.detail?.card }));
}

export function takePhoto(db: ContentDB, subjectId: string): boolean {
  const game = useGameStore.getState();
  const state = game.state;
  if (!state.flags[CAMERA_FLAG]) return false;
  if (state.photos.some((p) => p.id === subjectId)) return false;
  const loc = db.locations[state.location];
  const hotspot = loc?.hotspots.find((h) => h.id === subjectId && h.kind === 'photo');
  if (!hotspot) return false;
  useGameStore.setState((s) => {
    s.state.photos.push({ id: subjectId, day: s.state.day as Day, printed: false });
  });
  // lantern collectibles ride photo hotspots that declare one (II.19.2)
  const lanternId = hotspot.interactions.find((i) => i.id.startsWith('lantern_'))?.id;
  if (lanternId) game.runEffects([{ collect: { lantern: lanternId } }]);
  const effects = hotspot.interactions.find((i) => i.id === 'on_photo')?.effects;
  if (effects) game.runEffects(effects as never);
  bus.emit({ type: 'collectible:gained', payload: { kind: 'photo', id: subjectId } });
  return true;
}

/** Overnight: photos taken today come off the line printed (nice night ambience). */
export function installPhotoPrinter(): () => void {
  return bus.on('day:changed', () => {
    useGameStore.setState((s) => {
      for (const p of s.state.photos) {
        if (p.day < s.state.day) p.printed = true;
      }
    });
  });
}
