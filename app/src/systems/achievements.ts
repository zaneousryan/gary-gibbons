// Achievements are content (tech spec §13): defined in content/achievements.json
// with the same condition DSL, validated like everything else. The watcher
// evaluates on world-state changes; Steamworks sync is a PlatformService
// concern (no-op on web).

import type { ContentDB } from '@content/contentDb';
import { evalCondition, type Condition } from '@engine/conditions';
import { useGameStore } from '@engine/store';
import { bus } from '@engine/eventBus';
import { useUiStore } from '@ui/uiStore';

export function achievementFlag(id: string): string {
  return `ach_${id}`;
}

export function sweepAchievements(db: ContentDB): string[] {
  const unlocked: string[] = [];
  for (const ach of db.achievements.achievements) {
    const state = useGameStore.getState().state;
    if (state.flags[achievementFlag(ach.id)]) continue;
    if (!evalCondition(ach.cond as Condition, state)) continue;
    useGameStore.getState().runEffects([{ setFlag: achievementFlag(ach.id) }]);
    unlocked.push(ach.id);
    if (!ach.hidden) {
      useUiStore.getState().showToast(`🏅 ${ach.name}`);
    }
    // STUB(steam): PlatformService.unlock(ach.id) once steamworks.js lands (spec §13)
  }
  return unlocked;
}

export function installAchievementWatcher(db: ContentDB): () => void {
  const sweep = () => sweepAchievements(db);
  const un1 = bus.on('flag:set', sweep);
  const un2 = bus.on('deduction:unlocked', sweep);
  const un3 = bus.on('edition:published', sweep);
  const un4 = bus.on('grape:declined', sweep);
  const un5 = bus.on('collectible:gained', sweep);
  return () => {
    [un1, un2, un3, un4, un5].forEach((u) => u());
  };
}
