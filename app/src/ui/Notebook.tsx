// The Reporter's Notebook (tech spec §6.3, §8). Phase 1 core: tabs
// PEOPLE/PLACES/QUESTIONS, auto-entries, question cards. Hidden GRAPES tab,
// Morning Pages, tear-out, and doodles land with their owning phases.

import { useState } from 'react';
import type { ContentDB } from '@content/contentDb';
import { useGameStore } from '@engine/store';
import { useUiStore } from './uiStore';
import { questionText } from '@systems/notebook';

const TABS = [
  { key: 'people', label: 'PEOPLE' },
  { key: 'places', label: 'PLACES' },
  { key: 'questions', label: 'QUESTIONS' },
] as const;

export default function Notebook({ db }: { db: ContentDB }) {
  const open = useUiStore((s) => s.notebookOpen);
  const toggle = useUiStore((s) => s.toggleNotebook);
  const entries = useGameStore((s) => s.state.notebook.entries);
  const questions = useGameStore((s) => s.state.notebook.questions);
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('people');

  if (!open) return null;

  const tabEntries = entries.filter((e) => e.tab === tab);

  return (
    <div className="absolute inset-0 bg-ink/50 flex items-center justify-center pointer-events-auto" data-testid="notebook" onClick={toggle}>
      <div
        className="w-[min(900px,92vw)] h-[min(640px,86vh)] bg-cream border-4 border-ink rounded-lg shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b-2 border-ink/30">
          {TABS.map((t) => (
            <button
              key={t.key}
              data-testid={`notebook-tab-${t.key}`}
              onClick={() => setTab(t.key)}
              className={
                'px-6 py-3 font-bold tracking-widest text-sm cursor-pointer ' +
                (tab === t.key ? 'bg-amber text-ink' : 'text-ink/60 hover:text-ink')
              }
            >
              {t.label}
            </button>
          ))}
          <div className="flex-1" />
          <button className="px-4 text-ink/60 hover:text-ink cursor-pointer text-xl" onClick={toggle} data-testid="notebook-close">
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {tab !== 'questions' && tabEntries.length === 0 && (
            <p className="italic text-ink/40">Blank pages. For now.</p>
          )}
          {tab !== 'questions' &&
            tabEntries.map((e) => {
              const def = db.notebook.entries.find((n) => n.id === e.id);
              return (
                <div key={e.id} className="border-b border-ink/15 pb-3" data-testid={`notebook-entry-${e.id}`}>
                  {def?.title && <div className="font-bold text-ink">{def.title}</div>}
                  <p className="text-ink/90 italic leading-relaxed">{def?.text ?? e.id}</p>
                  <div className="text-xs text-ink/40 mt-1">Day {e.day} · {e.phase}</div>
                </div>
              );
            })}
          {tab === 'questions' && questions.length === 0 && (
            <p className="italic text-ink/40">No open questions. That never lasts.</p>
          )}
          {tab === 'questions' &&
            questions.map((q) => (
              <div key={q} className="border-2 border-ink/30 rounded p-3 bg-cream shadow" data-testid={`notebook-question-${q}`}>
                <span className="text-plum font-bold mr-2">?</span>
                <span className="text-ink italic">{questionText(db, q)}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
