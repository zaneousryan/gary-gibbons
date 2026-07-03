// Pocket recap (read-only deduction cards away from the apartment — spec §8)
// and the Ask Grandpa modal (§6.8 / design doc §6).

import type { ContentDB } from '@content/contentDb';
import { useGameStore } from '@engine/store';
import { useUiStore } from './uiStore';

export function PocketRecap({ db }: { db: ContentDB }) {
  const open = useUiStore((s) => s.recapOpen);
  const toggle = useUiStore((s) => s.toggleRecap);
  const deductions = useGameStore((s) => s.state.board.deductions);
  if (!open) return null;
  return (
    <div className="absolute inset-0 bg-ink/50 flex items-center justify-center pointer-events-auto z-40" data-testid="pocket-recap" onClick={toggle}>
      <div className="w-[min(560px,90vw)] bg-cream border-4 border-ink rounded-lg shadow-2xl p-5" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-bold text-ink text-xl mb-1">Pocket recap</h2>
        <p className="text-ink/60 italic text-sm mb-3">What the board knows so far. The board itself waits at home.</p>
        {deductions.length === 0 && <p className="italic text-ink/40">No deductions yet. The string is willing; the evidence isn't.</p>}
        <ul className="space-y-2">
          {deductions.map((id) => {
            const ded = db.deductions.deductions.find((d) => d.id === id);
            const card = ded?.produces.card ? db.cards[ded.produces.card] : null;
            return (
              <li key={id} className="border-2 border-amber rounded p-2 text-ink font-bold text-sm bg-amber/20">
                {card?.title ?? id}
              </li>
            );
          })}
        </ul>
        <button className="mt-4 px-4 py-1 border-2 border-ink rounded bg-amber font-bold text-ink cursor-pointer" onClick={toggle}>
          done
        </button>
      </div>
    </div>
  );
}

export function GrandpaModal() {
  const hint = useUiStore((s) => s.grandpaHint);
  const show = useUiStore((s) => s.showGrandpaHint);
  if (!hint) return null;
  return (
    <div className="absolute inset-0 bg-ink/50 flex items-center justify-center pointer-events-auto z-50" data-testid="grandpa-modal" onClick={() => show(null)}>
      <div className="w-[min(520px,90vw)] bg-cream border-4 border-amber rounded-lg shadow-2xl p-6 rotate-[-0.5deg]" onClick={(e) => e.stopPropagation()}>
        <div className="text-xs tracking-[0.3em] text-ink/50 font-bold mb-2">THE BADGE, WARM UNDER HIS THUMB</div>
        <p className="text-ink text-lg italic leading-relaxed">“{hint}”</p>
        <button className="mt-4 px-4 py-1 border-2 border-ink rounded bg-amber font-bold text-ink cursor-pointer" onClick={() => show(null)} data-testid="grandpa-close">
          okay, grandpa
        </button>
      </div>
    </div>
  );
}
