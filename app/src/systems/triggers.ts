// Scene triggers — auto-firing set-pieces (Day 1 ceremony, going-home beats).
// Checked whenever the player's location or the clock changes. `once` triggers
// remember themselves via a flag so saves carry them.

import type { ContentDB } from '@content/contentDb';
import { evalCondition, type Condition } from '@engine/conditions';
import type { Effect } from '@engine/effects';
import { useGameStore } from '@engine/store';
import { bus } from '@engine/eventBus';
import { useDialogueStore } from './dialogue';

function firedFlag(locId: string, triggerId: string): string {
  return `trigger_done_${locId}_${triggerId}`;
}

/** Run the first eligible trigger for the current location. Returns its id or null. */
export function checkTriggers(db: ContentDB): string | null {
  const game = useGameStore.getState();
  const state = game.state;
  if (useDialogueStore.getState().view) return null; // never interrupt a conversation

  const loc = db.locations[state.location];
  if (!loc) return null;

  for (const trigger of loc.triggers) {
    if (trigger.once && state.flags[firedFlag(loc.id, trigger.id)]) continue;
    if (!evalCondition(trigger.cond as Condition, state)) continue;

    if (trigger.once) game.runEffects([{ setFlag: firedFlag(loc.id, trigger.id) }]);
    if (trigger.effects) game.runEffects(trigger.effects as Effect[]);
    if (trigger.dialogue) useDialogueStore.getState().start(db, trigger.dialogue);
    bus.emit({ type: 'puzzle:opened', payload: { kind: 'trigger', id: trigger.id, location: loc.id } });
    return trigger.id;
  }
  return null;
}

/** Wire trigger checks to location/phase changes. Returns unsubscribe. */
export function installTriggerWatcher(db: ContentDB): () => void {
  const un1 = bus.on('location:changed', () => checkTriggers(db));
  const un2 = bus.on('phase:changed', () => checkTriggers(db));
  const un3 = bus.on('dialogue:ended', () => checkTriggers(db)); // chained set-pieces
  // check the boot location too
  queueMicrotask(() => checkTriggers(db));
  return () => {
    un1();
    un2();
    un3();
  };
}
