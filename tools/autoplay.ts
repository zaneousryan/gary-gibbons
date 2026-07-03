// autoplay — headless guaranteed-path runner (tech spec §11). Executes the
// content graph with no rendering, asserts gates open, and proves determinism
// (seeded; run twice, identical logs). Phase 0 scope: boot → walk → talk
// (full Dot red-pens conversation, PRESS route) → save → reload → phase-walk
// Day 1 through night into Day 2 (gates are empty until Phase 2 content).
// --curious exercises optional paths (Phase 5+; stub reports NOT RUN for now).

import { loadContentDB } from './lib/nodeContent';
import { useGameStore } from '../app/src/engine/store';
import { useDialogueStore, selectDialogueFor } from '../app/src/systems/dialogue';
import { SaveService, MemoryStorage } from '../app/src/engine/save/saveService';
import { bus } from '../app/src/engine/eventBus';
import type { GameDef } from '../app/src/engine/clock';
import type { Day, Phase } from '../app/src/engine/types';

const curious = process.argv.includes('--curious');

function fail(msg: string): never {
  console.error(`autoplay: FAIL — ${msg}`);
  process.exit(1);
}

async function runOnce(seed: number): Promise<string[]> {
  const log: string[] = [];
  const db = loadContentDB();
  const def: GameDef = {
    startLocation: db.game.startLocation,
    startDay: db.game.startDay as Day,
    startPhase: db.game.startPhase as Phase,
    apartmentLocation: db.game.apartmentLocation,
    days: db.game.days.map((d) => ({
      day: d.day as Day,
      gateDeductions: d.gateDeductions,
      coreCompleteFlag: d.coreCompleteFlag,
      edition: d.edition,
    })),
  };

  const unsub = bus.on('*', (e) => log.push(`${e.type} ${JSON.stringify(e.payload)}`));

  const game = useGameStore.getState();
  game.setGameDef(def);
  game.newGame(seed);
  log.push(`boot day=${useGameStore.getState().state.day} phase=${useGameStore.getState().state.phase} loc=${useGameStore.getState().state.location}`);

  // walk: apartment -> percolator
  game.moveTo('the_percolator');
  if (useGameStore.getState().state.location !== 'the_percolator') fail('moveTo did not move Gary');

  // talk: Dot's red-pens conversation, PRESS route
  const dlgId = selectDialogueFor(db, 'dot');
  if (dlgId !== 'dot_d1_redpens') fail(`expected dot_d1_redpens, got ${dlgId}`);
  const dlgStore = useDialogueStore.getState();
  if (!dlgStore.start(db, dlgId)) fail('dialogue did not start');
  let guard = 0;
  while (useDialogueStore.getState().view && guard++ < 50) {
    const view = useDialogueStore.getState().view!;
    if (view.stances) {
      const observe = view.stances.find((s) => s.stance === 'observe');
      if (observe?.enabled) fail('OBSERVE enabled without noticed_red_ink flag — cond leak');
      useDialogueStore.getState().chooseStance('press');
    } else if (view.choices) {
      useDialogueStore.getState().chooseOption(view.choices[0].index);
    } else {
      useDialogueStore.getState().advance();
    }
  }
  if (guard >= 50) fail('dialogue did not terminate in 50 steps');

  const afterTalk = useGameStore.getState().state;
  if (!afterTalk.cards['dots_missing_pens']) fail('dots_missing_pens card not gained');
  if (afterTalk.cards['dots_missing_pens'].status !== 'unverified') fail('card should start unverified');
  if (!afterTalk.flags['redpens_case_open']) fail('redpens_case_open flag not set');
  if (!afterTalk.notebook.questions.includes('q_who_takes_red_pens')) fail('notebook question missing');
  log.push('talk complete: card + flag + question asserted');

  // oncePerDay enforced
  if (useDialogueStore.getState().start(db, 'dot_d1_redpens')) fail('oncePerDay not enforced');

  // save -> mutate -> reload -> assert identical
  const saves = new SaveService(new MemoryStorage());
  await saves.save('autoplay', useGameStore.getState().state);
  const before = JSON.stringify({ ...useGameStore.getState().state, meta: undefined });
  useGameStore.getState().moveTo('gary_apartment');
  useGameStore.getState().runEffects([{ setFlag: 'scratch_flag' }]);
  const loaded = await saves.load('autoplay');
  if (!loaded) fail('save did not round-trip');
  useGameStore.getState().loadState(loaded);
  const after = JSON.stringify({ ...useGameStore.getState().state, meta: undefined });
  if (before !== after) fail('reloaded state differs from saved state');
  log.push('save/reload verified byte-identical (meta aside)');

  // clock: morning -> midday -> evening -> night -> (gate check) -> day 2
  for (const expected of ['midday', 'evening', 'night'] as Phase[]) {
    if (!useGameStore.getState().advancePhase()) fail(`could not advance to ${expected}`);
    if (useGameStore.getState().state.phase !== expected) fail(`expected ${expected}`);
  }
  if (!useGameStore.getState().advancePhase()) fail('night gate blocked despite empty gateDeductions');
  const d2 = useGameStore.getState().state;
  if (d2.day !== 2 || d2.phase !== 'morning') fail(`expected day 2 morning, got day ${d2.day} ${d2.phase}`);
  log.push(`clock verified through night -> day ${d2.day}`);

  unsub();
  return log;
}

async function main() {
  if (curious) {
    // STUB(phase-5): the curious run exercises optional paths once they exist.
    console.log('autoplay --curious: NOT RUN — no optional-path content until Phase 5. Exiting 0 by design.');
    return;
  }
  const run1 = await runOnce(42);
  const run2 = await runOnce(42);
  if (run1.join('\n') !== run2.join('\n')) {
    fail('two seeded runs produced different logs — determinism broken');
  }
  console.log(run1.map((l) => '  ' + l).join('\n'));
  console.log(`\nautoplay: PASS (${run1.length} log lines, deterministic across 2 runs, seed 42)`);
}

main().catch((e) => fail(String(e)));
