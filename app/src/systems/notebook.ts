// NotebookSystem core (tech spec §6.3): auto-entries from dialogue/effects.
// Effects emit notebook:entry events; this system resolves the entry def from
// content and writes it into GameState so saves carry the journal.

import type { ContentDB } from '@content/contentDb';
import { useGameStore } from '@engine/store';
import { bus } from '@engine/eventBus';

export function installNotebookWatcher(db: ContentDB): () => void {
  return bus.on('notebook:entry', (e) => {
    const entryId = e.payload.entry as string;
    const def = db.notebook.entries.find((n) => n.id === entryId);
    if (!def) {
      console.warn(`[notebook] entry "${entryId}" has no definition in notebook.json`);
      return;
    }
    useGameStore.setState((s) => {
      if (s.state.notebook.entries.some((n) => n.id === entryId)) return;
      s.state.notebook.entries.push({
        id: entryId,
        day: s.state.day,
        phase: s.state.phase,
        tab: def.tab,
        tornOut: false,
      });
    });
  });
}

export function questionText(db: ContentDB, questionId: string): string {
  return db.notebook.questions.find((q) => q.id === questionId)?.text ?? questionId;
}
