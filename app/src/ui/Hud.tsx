// HUD (tech spec §8): location name, day/phase dial, save/load. Notebook and
// camera buttons land with their systems.

import { useState } from 'react';
import type { ContentDB } from '@content/contentDb';
import { useGameStore } from '@engine/store';
import { SaveService, defaultStorage } from '@engine/save/saveService';
import { useUiStore } from './uiStore';

const saveService = new SaveService(defaultStorage());
export { saveService };

export default function Hud({ db }: { db: ContentDB }) {
  const day = useGameStore((s) => s.state.day);
  const phase = useGameStore((s) => s.state.phase);
  const location = useGameStore((s) => s.state.location);
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
