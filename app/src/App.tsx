// App shell (tech spec §3): Pixi stage below, React paper above, one store
// between. Boot: load + validate content, set the game def, start (or resume).

import { useEffect, useMemo, useState } from 'react';
import { loadContent } from '@content/loader';
import type { ContentDB } from '@content/contentDb';
import { useGameStore } from '@engine/store';
import type { GameDef } from '@engine/clock';
import type { Day, Phase } from '@engine/types';
import PixiStage from '@scenes/PixiStage';
import Board from '@ui/Board';
import { PocketRecap, GrandpaModal } from '@ui/BoardExtras';
import DialogueBox from '@ui/DialogueBox';
import Hud from '@ui/Hud';
import Notebook from '@ui/Notebook';
import Newspaper from '@ui/Newspaper';
import MorningPages from '@ui/MorningPages';
import InnerVoice from '@ui/InnerVoice';
import { ExaminePanel, GreetingBubble, Toast } from '@ui/Overlays';
import DevMenu from '@dev/DevMenu';
import { installTriggerWatcher } from '@systems/triggers';
import { installBarkWatcher } from '@systems/barks';
import { installNotebookWatcher } from '@systems/notebook';
import { installVerificationWatcher } from '@systems/verify';

export default function App() {
  const [db, setDb] = useState<ContentDB | null>(null);
  const [bootError, setBootError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const content = loadContent();
      const def: GameDef = {
        startLocation: content.game.startLocation,
        startDay: content.game.startDay as Day,
        startPhase: content.game.startPhase as Phase,
        apartmentLocation: content.game.apartmentLocation,
        days: content.game.days.map((d) => ({
          day: d.day as Day,
          gateDeductions: d.gateDeductions,
          coreCompleteFlag: d.coreCompleteFlag,
          edition: d.edition,
        })),
      };
      useGameStore.getState().setGameDef(def);
      useGameStore.getState().newGame(1);
      setDb(content);
      const un1 = installBarkWatcher(content);
      const un2 = installNotebookWatcher(content);
      const un3 = installTriggerWatcher(content);
      const un4 = installVerificationWatcher(content);
      return () => {
        un1();
        un2();
        un3();
        un4();
      };
    } catch (err) {
      setBootError(String(err));
    }
  }, []);

  const stage = useMemo(() => (db ? <PixiStage db={db} /> : null), [db]);

  if (bootError) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <pre className="text-cream bg-ink border-2 border-plum rounded p-6 max-w-4xl overflow-auto whitespace-pre-wrap">
          CONTENT FAILED TO LOAD{'\n\n'}{bootError}
        </pre>
      </div>
    );
  }
  if (!db) {
    return <div className="h-full flex items-center justify-center text-cream text-2xl">Lighting the lanterns…</div>;
  }

  return (
    <div className="relative h-full w-full" data-testid="app-root">
      {stage}
      <Hud db={db} />
      <DialogueBox db={db} />
      <Notebook db={db} />
      <Board db={db} />
      <Newspaper db={db} />
      <MorningPages db={db} />
      <PocketRecap db={db} />
      <GrandpaModal />
      <InnerVoice />
      <GreetingBubble />
      <ExaminePanel />
      <Toast />
      <DevMenu db={db} />
    </div>
  );
}
