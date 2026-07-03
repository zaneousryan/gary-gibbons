// Morning Pages (III.26): pick Today's Three Questions. Auto-opens each
// morning from Day 2; choices set vox-pop topic + PRIMED weights.

import { useEffect, useState } from 'react';
import type { ContentDB } from '@content/contentDb';
import { useGameStore } from '@engine/store';
import { commitMorningPages, morningCandidates, morningPagesDue, MAX_PICKS } from '@systems/morningPages';

export default function MorningPages({ db }: { db: ContentDB }) {
  const day = useGameStore((s) => s.state.day);
  const phase = useGameStore((s) => s.state.phase);
  const flags = useGameStore((s) => s.state.flags);
  const [picks, setPicks] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState(false);

  const due = morningPagesDue();
  useEffect(() => {
    setDismissed(false);
    setPicks([]);
  }, [day, phase]);

  if (!due || dismissed) return null;
  void flags; // subscribe: re-render when morning_pages_done flag lands

  const candidates = morningCandidates(db);
  const togglePick = (id: string) =>
    setPicks((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length < MAX_PICKS ? [...p, id] : p));

  return (
    <div className="absolute inset-0 bg-ink/60 flex items-center justify-center pointer-events-auto z-40" data-testid="morning-pages">
      <div className="w-[min(680px,92vw)] bg-cream border-4 border-ink rounded-lg shadow-2xl p-6">
        <div className="text-xs tracking-[0.3em] text-ink/50 font-bold">MORNING PAGES · DAY {day}</div>
        <h2 className="text-ink font-bold text-2xl mt-1">What kind of reporter am I today?</h2>
        <p className="text-ink/60 italic text-sm mb-4">
          Gary's half-written page waits. Circle up to three questions to carry into the day — the rest keep.
        </p>
        {candidates.length === 0 && (
          <p className="italic text-ink/40 mb-4">No open questions this morning. A rare kind of peace.</p>
        )}
        <div className="space-y-2 mb-5">
          {candidates.map((q) => (
            <button
              key={q.id}
              data-testid={`mp-q-${q.id}`}
              onClick={() => togglePick(q.id)}
              className={
                'block w-full text-left border-2 rounded p-2 text-ink cursor-pointer ' +
                (picks.includes(q.id) ? 'border-amber bg-amber/30 font-bold' : 'border-ink/30 hover:border-ink')
              }
            >
              <span className="text-plum font-bold mr-2">?</span>
              {q.text}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            commitMorningPages(picks);
            setDismissed(true);
          }}
          data-testid="mp-commit"
          className="w-full py-2 border-2 border-ink rounded bg-amber font-bold text-ink cursor-pointer hover:brightness-110"
        >
          Start the day
        </button>
      </div>
    </div>
  );
}
