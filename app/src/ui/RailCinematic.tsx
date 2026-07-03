// The silent chronology (II.16.1): when the rail's last card seats, the week
// the player reconstructed plays back — no words, just the slots in order.
// The biggest "I did this" moment in the game.

import { useEffect, useState } from 'react';
import type { ContentDB } from '@content/contentDb';
import { useGameStore } from '@engine/store';
import { bus } from '@engine/eventBus';

export default function RailCinematic({ db }: { db: ContentDB }) {
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    return bus.on('puzzle:opened', (e) => {
      if (e.payload.kind === 'rail-complete') {
        setStep(0);
        setPlaying(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!playing || !db.timeline) return;
    if (step >= db.timeline.slots.length) {
      const t = setTimeout(() => setPlaying(false), 2200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 1800);
    return () => clearTimeout(t);
  }, [playing, step, db]);

  if (!playing || !db.timeline) return null;
  const rail = useGameStore.getState().state.board.rail;
  const slots = [...db.timeline.slots].sort((a, b) => a.order - b.order);

  return (
    <div className="absolute inset-0 bg-ink/95 z-50 flex flex-col items-center justify-center pointer-events-auto" data-testid="rail-cinematic" onClick={() => setPlaying(false)}>
      <div className="text-cream/40 text-xs tracking-[0.4em] font-bold mb-8">THE WEEK, AS IT ACTUALLY HAPPENED</div>
      <div className="flex gap-4 items-stretch px-8">
        {slots.map((slot, i) => {
          const card = rail[slot.id] ? db.cards[rail[slot.id]] : null;
          const lit = i < step;
          return (
            <div
              key={slot.id}
              className={'w-44 rounded border-2 p-3 transition-all duration-700 ' + (lit ? 'border-amber bg-cream text-ink opacity-100 translate-y-0' : 'border-cream/10 text-cream/20 opacity-40 translate-y-2')}
            >
              <div className="text-[10px] font-bold tracking-widest">{slot.label}</div>
              <div className="text-sm font-bold mt-2 leading-tight">{lit ? (card?.title ?? '—') : ''}</div>
            </div>
          );
        })}
      </div>
      {step >= slots.length && (
        <div className="text-cream mt-10 italic text-lg animate-pulse">…and now the whole town knows what Gary knows.</div>
      )}
    </div>
  );
}
