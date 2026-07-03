// Title → Save slots → Game (tech spec §8). NG+ unlocks once any save has
// finished the story; the stats screen lives here too (II.19.2 — including
// the one line the community will find in a week).

import { useEffect, useState } from 'react';
import type { ContentDB } from '@content/contentDb';
import type { GameState } from '@engine/types';
import { useGameStore } from '@engine/store';
import { useUiStore } from './uiStore';
import { saveService } from './Hud';

export default function TitleScreen({ db }: { db: ContentDB }) {
  const open = useUiStore((s) => s.titleOpen);
  const setTitleOpen = useUiStore((s) => s.setTitleOpen);
  const toggleSettings = useUiStore((s) => s.toggleSettings);
  const [slot, setSlot] = useState<GameState | null>(null);
  const [statsOpen, setStatsOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    void saveService.load('slot1').then(setSlot).catch(() => setSlot(null));
  }, [open]);

  if (!open) return null;
  void db;

  const startNew = (ngPlus: boolean) => {
    useGameStore.getState().newGame(1);
    if (ngPlus) {
      const carriedEditions = slot?.editions ?? [];
      useGameStore.setState((s) => {
        s.state.ngPlus = true;
        // Edition Gallery carryover (II.19.1)
        s.state.editions = [];
        s.state.flags.ng_plus = true;
        s.state.flags.gallery_carryover = carriedEditions.length;
      });
    }
    setTitleOpen(false);
  };

  const continueGame = () => {
    if (slot) {
      useGameStore.getState().loadState(slot);
      setTitleOpen(false);
    }
  };

  const finished = !!slot?.flags?.game_complete;

  return (
    <div className="absolute inset-0 z-[60] bg-ink flex items-center justify-center pointer-events-auto" data-testid="title-screen">
      <div className="text-center max-w-xl px-6">
        <div className="text-amber/70 tracking-[0.5em] text-sm font-bold mb-2">RCUBED STUDIOS</div>
        <h1 className="text-cream text-5xl font-bold mb-1" style={{ fontVariant: 'small-caps' }}>
          Gary Gibbons
        </h1>
        <div className="text-amber text-xl italic mb-10">The Empty Capsule</div>
        <div className="flex flex-col gap-3 items-center">
          <button onClick={() => startNew(false)} data-testid="title-new"
            className="w-64 py-3 border-2 border-amber rounded bg-amber/10 text-cream font-bold tracking-wide cursor-pointer hover:bg-amber/30">
            New Game
          </button>
          {slot && (
            <button onClick={continueGame} data-testid="title-continue"
              className="w-64 py-3 border-2 border-cream/40 rounded text-cream font-bold tracking-wide cursor-pointer hover:bg-cream/10">
              Continue — Day {slot.day}, {slot.phase}
            </button>
          )}
          {finished && (
            <button onClick={() => startNew(true)} data-testid="title-ngplus"
              className="w-64 py-3 border-2 border-plum rounded text-cream font-bold tracking-wide cursor-pointer hover:bg-plum/30"
              title="Replay with Archie's margin notes">
              New Game+ — Archie's Notes
            </button>
          )}
          {finished && (
            <button onClick={() => setStatsOpen(true)} data-testid="title-stats"
              className="w-64 py-2 border border-cream/30 rounded text-cream/70 text-sm cursor-pointer hover:text-cream">
              Your Week in Print
            </button>
          )}
          <button onClick={toggleSettings} data-testid="title-settings"
            className="w-64 py-2 border border-cream/30 rounded text-cream/70 text-sm cursor-pointer hover:text-cream">
            Settings
          </button>
        </div>
        <div className="text-cream/30 text-xs mt-10">a cozy mystery · lamplit · autumnal · never cynical</div>
      </div>
      {statsOpen && slot && (
        <div className="absolute inset-0 bg-ink/80 flex items-center justify-center" onClick={() => setStatsOpen(false)} data-testid="stats-screen">
          <div className="bg-cream border-4 border-ink rounded-lg p-6 w-[min(480px,90vw)]" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-ink font-bold text-xl mb-3">Your Week in Print</h2>
            <ul className="text-ink space-y-1 text-sm">
              <li>Editions published: {slot.editions.length}</li>
              <li>Deductions made: {slot.board.deductions.length}</li>
              <li>Lanterns photographed: {slot.collectibles.lanterns.length} / 47</li>
              <li>Doodles collected: {slot.collectibles.doodles.length}</li>
              <li>Clippings read: {slot.collectibles.clippings.length}</li>
              <li>Playtime: {Math.round(slot.meta.playtimeSec / 60)} min</li>
              <li className="pt-2 text-ink/70">Grapes declined: {slot.collectibles.grapesDeclined}</li>
            </ul>
            <button className="mt-4 px-4 py-1 border-2 border-ink rounded bg-amber font-bold text-ink cursor-pointer" onClick={() => setStatsOpen(false)}>
              done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
