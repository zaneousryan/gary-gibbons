// Bark resolution + display routing. Effects emit bark:play with an id; this
// finds the line across pools and hands it to the inner-voice overlay.

import type { ContentDB } from '@content/contentDb';
import type { Bark } from '@content/schemas/misc';
import { bus } from '@engine/eventBus';
import { useUiStore } from '@ui/uiStore';

export function findBark(db: ContentDB, barkId: string): Bark | null {
  for (const pool of Object.values(db.barks)) {
    const bark = pool.barks.find((b) => b.id === barkId);
    if (bark) return bark;
  }
  return null;
}

export function installBarkWatcher(db: ContentDB): () => void {
  return bus.on('bark:play', (e) => {
    const bark = findBark(db, e.payload.bark as string);
    if (!bark) {
      console.warn(`[barks] unknown bark "${String(e.payload.bark)}"`);
      return;
    }
    useUiStore.getState().showInnerVoice({ text: bark.text, speaker: bark.speaker });
  });
}
