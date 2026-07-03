// Dev menu (~): Ryan tunes by playing, not by reading code (ALETHEIA.md §5).
// Phase 0: scene jump, phase/day skip, flag/card grant, weather toggle.

import { useEffect, useState } from 'react';
import type { ContentDB } from '@content/contentDb';
import { useGameStore } from '@engine/store';
import type { Day, Phase } from '@engine/types';
import { useUiStore } from '@ui/uiStore';

export default function DevMenu({ db }: { db: ContentDB }) {
  const open = useUiStore((s) => s.devMenuOpen);
  const toggle = useUiStore((s) => s.toggleDevMenu);
  const state = useGameStore((s) => s.state);
  const [flagName, setFlagName] = useState('');
  const [cardId, setCardId] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') toggle();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle]);

  if (!open) return null;
  const game = useGameStore.getState();

  return (
    <div className="absolute top-16 left-3 w-96 bg-ink/95 text-cream border-2 border-amber rounded-lg p-4 pointer-events-auto text-sm space-y-3 z-50" data-testid="dev-menu">
      <h3 className="font-bold text-amber">DEV — Aletheia's toolbox</h3>

      <div>
        <div className="opacity-70 mb-1">Jump to location</div>
        <div className="flex flex-wrap gap-1">
          {Object.values(db.locations).map((l) => (
            <button key={l.id} className="px-2 py-0.5 border border-cream/40 rounded cursor-pointer hover:bg-dusk"
              onClick={() => game.moveTo(l.id)}>
              {l.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="opacity-70 mb-1">Clock — Day {state.day} · {state.phase}</div>
        <div className="flex flex-wrap gap-1">
          {(['morning', 'midday', 'evening', 'night'] as Phase[]).map((p) => (
            <button key={p} className="px-2 py-0.5 border border-cream/40 rounded cursor-pointer hover:bg-dusk"
              onClick={() => useGameStore.setState((s) => { s.state.phase = p; })}>
              {p}
            </button>
          ))}
          {[1, 2, 3, 4, 5, 6, 7].map((d) => (
            <button key={d} className="px-2 py-0.5 border border-cream/40 rounded cursor-pointer hover:bg-dusk"
              onClick={() => useGameStore.setState((s) => { s.state.day = d as Day; })}>
              D{d}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="opacity-70 mb-1">Weather: {state.weather}</div>
        <button className="px-2 py-0.5 border border-cream/40 rounded cursor-pointer hover:bg-dusk"
          onClick={() => useGameStore.setState((s) => { s.state.weather = s.state.weather === 'rain' ? 'clear' : 'rain'; })}>
          toggle rain
        </button>
      </div>

      <div className="flex gap-1">
        <input value={flagName} onChange={(e) => setFlagName(e.target.value)} placeholder="flag_id"
          className="flex-1 bg-ink border border-cream/40 rounded px-2 py-0.5 text-cream" />
        <button className="px-2 border border-cream/40 rounded cursor-pointer hover:bg-dusk"
          onClick={() => flagName && game.runEffects([{ setFlag: flagName }])}>
          set flag
        </button>
      </div>
      <div className="flex gap-1">
        <input value={cardId} onChange={(e) => setCardId(e.target.value)} placeholder="card_id" list="dev-cards"
          className="flex-1 bg-ink border border-cream/40 rounded px-2 py-0.5 text-cream" />
        <datalist id="dev-cards">
          {Object.keys(db.cards).map((c) => <option key={c} value={c} />)}
        </datalist>
        <button className="px-2 border border-cream/40 rounded cursor-pointer hover:bg-dusk"
          onClick={() => cardId && game.runEffects([{ giveCard: cardId }])}>
          give card
        </button>
      </div>

      <div className="opacity-70">
        flags: {Object.keys(state.flags).length} · cards: {Object.keys(state.cards).length} · questions: {state.notebook.questions.length}
      </div>
    </div>
  );
}
