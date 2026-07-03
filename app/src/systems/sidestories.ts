// Side stories of Lanternside (tech spec §5.9, design doc II.17): step lists
// with conds/effects. Steps advance in order as their conditions come true;
// completion applies the trustFloor (III.23.3 — kindness banked is kindness
// kept) and marks the story done.

import type { ContentDB } from '@content/contentDb';
import { evalCondition, type Condition } from '@engine/conditions';
import type { Effect } from '@engine/effects';
import { useGameStore } from '@engine/store';
import { bus } from '@engine/eventBus';

export function stepFlag(storyId: string, stepId: string): string {
  return `ss_${storyId}_${stepId}`;
}

export function doneFlag(storyId: string): string {
  return `sidestory_${storyId}_done`;
}

/** Advance every started (or auto-start) story whose next step's cond passes. */
export function sweepSidestories(db: ContentDB): string[] {
  const advanced: string[] = [];
  for (const story of Object.values(db.sidestories)) {
    const game = useGameStore.getState();
    const state = game.state;
    if (state.flags[doneFlag(story.id)]) continue;
    if (!state.flags[`sidestory_${story.id}_started`]) {
      // stories auto-start when their first step's condition is met
      const first = story.steps[0];
      if (!evalCondition((first.cond ?? {}) as Condition, state)) continue;
      game.runEffects([{ startSidestory: story.id }]);
    }
    for (const step of story.steps) {
      const s = useGameStore.getState().state;
      if (s.flags[stepFlag(story.id, step.id)]) continue;
      if (!evalCondition((step.cond ?? {}) as Condition, s)) break; // strictly in order
      const effects: Effect[] = [{ setFlag: stepFlag(story.id, step.id) }, ...((step.effects ?? []) as Effect[])];
      useGameStore.getState().runEffects(effects);
      advanced.push(`${story.id}.${step.id}`);
    }
    const after = useGameStore.getState().state;
    if (story.steps.every((st) => after.flags[stepFlag(story.id, st.id)]) && !after.flags[doneFlag(story.id)]) {
      const effects: Effect[] = [{ setFlag: doneFlag(story.id) }];
      if (story.trustFloor) {
        effects.push({ trustFloor: { char: story.trustFloor.char, min: story.trustFloor.min } });
      }
      useGameStore.getState().runEffects(effects);
      bus.emit({ type: 'sidestory:started', payload: { sidestory: story.id, completed: true } });
      advanced.push(`${story.id}.DONE`);
    }
  }
  return advanced;
}

export function installSidestoryWatcher(db: ContentDB): () => void {
  const sweep = () => sweepSidestories(db);
  const un1 = bus.on('flag:set', sweep);
  const un2 = bus.on('card:gained', sweep);
  const un3 = bus.on('deduction:unlocked', sweep);
  const un4 = bus.on('phase:changed', sweep);
  return () => {
    un1();
    un2();
    un3();
    un4();
  };
}
