// HUD (tech spec §8): location name, day/phase dial, save/load. Notebook and
// camera buttons land with their systems.

import { useState } from 'react';
import type { ContentDB } from '@content/contentDb';
import { useGameStore } from '@engine/store';
import { SaveService, defaultStorage } from '@engine/save/saveService';
import { askGrandpa } from '@systems/hints';
import { useUiStore } from './uiStore';

const saveService = new SaveService(defaultStorage());
export { saveService };

export default function Hud({ db }: { db: ContentDB }) {
  const day = useGameStore((s) => s.state.day);
  const phase = useGameStore((s) => s.state.phase);
  const location = useGameStore((s) => s.state.location);
  const game = useGameStore((s) => s.game);
  const showToast = useUiStore((s) => s.showToast);
  const [busy, setBusy] = useState(false);

  const locName = db.locations[location]?.name ?? location;
  const dayTitle = db.game.days.find((d) => d.day === day)?.title;

  const doSave = async () => {
    setBusy(true);
    await saveService.save('slot1', useGameStore.getState().state);
    setBusy(false);
    showToast('Saved.');
  };

  const doLoad = async () => {
    setBusy(true);
    const loaded = await saveService.load('slot1');
    setBusy(false);
    if (loaded) {
      useGameStore.getState().loadState(loaded);
      showToast('Loaded.');
    } else {
      showToast('No save yet.');
    }
  };

  const doAdvance = () => {
    const ok = useGameStore.getState().advancePhase();
    if (!ok) showToast('The night holds — the board (or the gate) isn’t done with you.');
  };

  return (
    <div className="absolute top-0 inset-x-0 flex items-center justify-between p-3 pointer-events-none select-none">
      <div className="pointer-events-auto bg-ink/85 text-cream rounded px-4 py-2 border-2 border-amber/60">
        <div className="text-lg font-bold" data-testid="hud-location">{locName}</div>
        <div className="text-sm opacity-80" data-testid="hud-clock">
          Day {day}{dayTitle ? ` — ${dayTitle}` : ''} · {phase}
        </div>
      </div>
      <div className="pointer-events-auto flex gap-2">
        <button
          onClick={() => useUiStore.getState().toggleNotebook()}
          data-testid="hud-notebook"
          className="bg-cream text-ink border-2 border-ink rounded px-3 py-2 font-bold cursor-pointer hover:brightness-95"
        >
          📓 Notebook
        </button>
        {phase === 'night' && location === game?.apartmentLocation ? (
          <>
            <button
              onClick={() => useUiStore.getState().toggleNewspaper()}
              data-testid="hud-edition"
              className="bg-cream text-ink border-2 border-ink rounded px-3 py-2 font-bold cursor-pointer hover:brightness-95"
            >
              🗞 Edition
            </button>
            <button
              onClick={() => useUiStore.getState().toggleBoard()}
              data-testid="hud-board"
              className="bg-amber text-ink border-2 border-ink rounded px-3 py-2 font-bold cursor-pointer hover:brightness-110"
            >
              📌 The Board
            </button>
          </>
        ) : (
          <button
            onClick={() => useUiStore.getState().toggleRecap()}
            data-testid="hud-recap"
            className="bg-cream text-ink border-2 border-ink rounded px-3 py-2 font-bold cursor-pointer hover:brightness-95"
          >
            🗂 Recap
          </button>
        )}
        {phase === 'night' && game && (
          <button
            onClick={() => {
              const hint = askGrandpa(db, game);
              if (hint) useUiStore.getState().showGrandpaHint(hint);
              else showToast('The badge is quiet. Gary already knows what to do — he just has to do it.');
            }}
            data-testid="hud-badge"
            className="bg-ink/85 text-amber border-2 border-amber/70 rounded px-3 py-2 font-bold cursor-pointer hover:brightness-125"
            title="Ask Grandpa"
          >
            🎖
          </button>
        )}
        <button
          onClick={doAdvance}
          data-testid="hud-advance"
          className="bg-dusk text-cream border-2 border-amber/60 rounded px-3 py-2 font-bold cursor-pointer hover:brightness-110"
        >
          Later ⏭
        </button>
        <button
          onClick={doSave}
          disabled={busy}
          data-testid="hud-save"
          className="bg-ink/85 text-cream border-2 border-amber/60 rounded px-3 py-2 font-bold cursor-pointer hover:brightness-110"
        >
          Save
        </button>
        <button
          onClick={doLoad}
          disabled={busy}
          data-testid="hud-load"
          className="bg-ink/85 text-cream border-2 border-amber/60 rounded px-3 py-2 font-bold cursor-pointer hover:brightness-110"
        >
          Load
        </button>
      </div>
    </div>
  );
}
