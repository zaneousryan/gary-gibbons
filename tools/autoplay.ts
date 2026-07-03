// autoplay — headless guaranteed-path runner (tech spec §11). Executes the
// content graph with no rendering, asserts gates open, and proves determinism
// (seeded; run twice, identical logs).
//
// Phase 1 scope: full Day 1 — boot → Dot (red pens) → Market Row (Gino grape
// beat, Ida, Evelyn, Milo) → Founders' Square (Poppy, Warren, Julian, Clara) →
// evening ceremony set-piece (auto-trigger) → save/reload → night → Day 2.
// --curious exercises optional paths (Phase 5+; explicit NOT RUN until then).

import { loadContentDB } from './lib/nodeContent';
import { useGameStore } from '../app/src/engine/store';
import { useDialogueStore, selectDialogueFor } from '../app/src/systems/dialogue';
import { installTriggerWatcher } from '../app/src/systems/triggers';
import { installNotebookWatcher } from '../app/src/systems/notebook';
import { connectCards, pinCard, resetBoardSession } from '../app/src/systems/board';
import { askGrandpa } from '../app/src/systems/hints';
import { installVerificationWatcher } from '../app/src/systems/verify';
import { publishEdition, editionForToday, assembleDraft } from '../app/src/systems/edition';
import { commitMorningPages, morningPagesDue, voxPopLineFor } from '../app/src/systems/morningPages';
import { greetingFor } from '../app/src/systems/trust';
import { SaveService, MemoryStorage } from '../app/src/engine/save/saveService';
import { bus } from '../app/src/engine/eventBus';
import type { ContentDB } from '../app/src/content/contentDb';
import type { GameDef } from '../app/src/engine/clock';
import type { Day, Phase } from '../app/src/engine/types';

const curious = process.argv.includes('--curious');

function fail(msg: string): never {
  console.error(`autoplay: FAIL — ${msg}`);
  process.exit(1);
}

function driveDialogue(maxSteps = 60): string[] {
  let guard = 0;
  const path: string[] = [];
  while (useDialogueStore.getState().view && guard++ < maxSteps) {
    const view = useDialogueStore.getState().view!;
    if (view.stances) {
      const enabled = view.stances.filter((s) => s.enabled);
      if (enabled.length === 0) fail(`node ${view.nodeId}: no enabled stances`);
      // deterministic: prefer press, then empathize, then observe
      const pick = ['press', 'empathize', 'observe'].find((s) => enabled.some((e) => e.stance === s))!;
      useDialogueStore.getState().chooseStance(pick as 'press' | 'empathize' | 'observe');
    } else if (view.choices) {
      if (view.choices.length === 0) fail(`node ${view.nodeId}: choice node with zero passing choices`);
      useDialogueStore.getState().chooseOption(view.choices[0].index);
    } else {
      useDialogueStore.getState().advance();
    }
    path.push(view.nodeId);
  }
  if (guard >= maxSteps) fail('dialogue did not terminate');
  return path;
}

function talkTo(db: ContentDB, characterId: string, expectDialogue?: string): void {
  const dlgId = selectDialogueFor(db, characterId);
  if (!dlgId) fail(`no dialogue available for ${characterId}`);
  if (expectDialogue && dlgId !== expectDialogue) fail(`expected ${expectDialogue} for ${characterId}, got ${dlgId}`);
  if (!useDialogueStore.getState().start(db, dlgId)) fail(`dialogue ${dlgId} did not start`);
  driveDialogue();
}

function assertFlag(flag: string) {
  if (!useGameStore.getState().state.flags[flag]) fail(`flag "${flag}" not set`);
}

function assertCard(card: string, status?: string) {
  const c = useGameStore.getState().state.cards[card];
  if (!c) fail(`card "${card}" not gained`);
  if (status && c.status !== status) fail(`card "${card}" is ${c.status}, expected ${status}`);
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

  const unsubLog = bus.on('*', (e) => log.push(`${e.type} ${JSON.stringify(e.payload)}`));
  const unsubTriggers = installTriggerWatcher(db);
  const unsubNotebook = installNotebookWatcher(db);
  const unsubVerify = installVerificationWatcher(db);
  resetBoardSession();

  const game = useGameStore.getState();
  game.setGameDef(def);
  game.newGame(seed);
  const s0 = useGameStore.getState().state;
  log.push(`boot day=${s0.day} phase=${s0.phase} loc=${s0.location}`);

  // --- morning: apartment (notice the red ink) then the Percolator ---
  game.runEffects([{ setFlag: 'noticed_red_ink' }]); // stair-rail examine, guaranteed-path equivalent
  game.moveTo('the_percolator');
  talkTo(db, 'dot', 'dot_d1_redpens');
  // the VerificationSystem sweeps on card:gained: noticed_red_ink was set at the
  // stair rail, so Dot's testimony verifies the moment Gary holds it (§6.4)
  assertCard('dots_missing_pens', 'verified');
  if (useGameStore.getState().state.flags['verified_via_dots_missing_pens'] !== 'red_ink_trail') {
    fail('dots_missing_pens did not verify via the red_ink_trail route');
  }
  assertFlag('redpens_case_open');
  if (!useGameStore.getState().state.notebook.questions.includes('q_who_takes_red_pens')) {
    fail('red-pens notebook question missing');
  }
  talkTo(db, 'otto', 'otto_d1');
  talkTo(db, 'margie', 'margie_d1');
  assertFlag('heard_of_lodger');
  talkTo(db, 'tuck', 'tuck_d1');
  if (useDialogueStore.getState().start(db, 'dot_d1_redpens')) fail('oncePerDay not enforced');
  log.push('percolator complete');

  // --- market row ---
  game.moveTo('market_row');
  const grapesBefore = useGameStore.getState().state.collectibles.grapesDeclined;
  talkTo(db, 'gino', 'gino_d1');
  if (useGameStore.getState().state.collectibles.grapesDeclined !== grapesBefore + 1) {
    fail('grape beat 1 did not count a declined grape');
  }
  talkTo(db, 'ida', 'ida_d1');
  talkTo(db, 'evelyn', 'evelyn_d1');
  talkTo(db, 'milo', 'milo_d1');
  assertCard('milos_crimes_notebook', 'verified');
  log.push('market row complete (grape declined, red notebook seen)');

  // --- founders' square ---
  game.moveTo('founders_square');
  talkTo(db, 'poppy', 'poppy_d1');
  talkTo(db, 'warren', 'warren_d1');
  // observe Julian's ring first (chekhov detail), so OBSERVE is earnable
  game.runEffects([{ setFlag: 'noticed_julian_ring' }]);
  talkTo(db, 'julian', 'julian_d1');
  talkTo(db, 'clara', 'clara_d1');
  log.push('square complete, all of day 1 cast met');

  // --- evening: the ceremony auto-triggers at the square ---
  if (!game.advancePhase()) fail('morning->midday advance failed');
  if (!game.advancePhase()) fail('midday->evening advance failed');
  if (!useDialogueStore.getState().view) fail('ceremony trigger did not fire at evening');
  driveDialogue();
  assertFlag('ceremony_done');
  assertCard('empty_vault', 'verified');
  assertCard('unforced_lock', 'verified');
  assertCard('fifty_years_of_items', 'verified');
  assertCard('grandpas_package', 'verified');
  if (!useGameStore.getState().state.notebook.questions.includes('q_who_emptied_the_capsule')) {
    fail('ceremony notebook question missing');
  }
  if (!useGameStore.getState().state.notebook.entries.some((e) => e.id === 'nb_empty_vault')) {
    fail('ceremony notebook entry missing');
  }
  log.push('ceremony complete: 4 verified cards, question, entry');

  // ceremony must not re-fire
  useDialogueStore.getState().end();
  game.moveTo('market_row');
  game.moveTo('founders_square');
  if (useDialogueStore.getState().view) fail('once-trigger re-fired on revisit');

  // --- save / reload integrity ---
  const saves = new SaveService(new MemoryStorage());
  await saves.save('autoplay', useGameStore.getState().state);
  const before = JSON.stringify({ ...useGameStore.getState().state, meta: undefined });
  game.moveTo('gary_apartment');
  game.runEffects([{ setFlag: 'scratch_flag' }]);
  const loaded = await saves.load('autoplay');
  if (!loaded) fail('save did not round-trip');
  game.loadState(loaded);
  const after = JSON.stringify({ ...useGameStore.getState().state, meta: undefined });
  if (before !== after) fail('reloaded state differs from saved state');
  log.push('save/reload verified byte-identical (meta aside)');

  // --- night 1: Send Them Home + the tutorial board (I.5 night 1, I.6.D1) ---
  if (!game.advancePhase()) fail('evening->night advance failed');
  if (useGameStore.getState().state.location !== db.game.apartmentLocation) {
    fail('night did not send Gary home (I.5 Send Them Home)');
  }
  if (game.advancePhase()) fail('night gate opened without d1_emptied_before');

  // pin the night-1 cards
  for (const [i, card] of ['empty_vault', 'unforced_lock', 'fifty_years_of_items', 'grandpas_package'].entries()) {
    if (!pinCard(card, 200 + i * 240, 220)) fail(`could not pin ${card}`);
  }
  // Ask Grandpa produces ordered hints while the gate is unmet — and per the
  // design doc §6 rule, every hint names a node, never a pair
  const hint = askGrandpa(db, def);
  if (!hint || !hint.includes('room told everyone')) fail(`unexpected first grandpa hint: ${hint}`);
  askGrandpa(db, def);
  const lastHint = askGrandpa(db, def);
  if (!lastHint || !lastHint.includes('The lock')) fail(`unexpected last grandpa hint: ${lastHint}`);

  // wrong pair first: red string + bark, never a deduction
  const miss = connectCards(db, ['empty_vault', 'grandpas_package']);
  if (miss.kind !== 'miss') fail(`expected miss on wrong pair, got ${miss.kind}`);

  // red pen tutorial deduction (unverified inputs allowed by recipe)
  pinCard('dots_missing_pens', 900, 420);
  pinCard('milos_crimes_notebook', 1100, 420);
  const pens = connectCards(db, ['dots_missing_pens', 'milos_crimes_notebook']);
  if (pens.kind !== 'deduction' || pens.deduction.id !== 'red_pen_bandit') {
    fail(`red pen recipe failed: ${JSON.stringify(pens)}`);
  }
  assertCard('ded_red_pen_bandit', 'verified');

  // D1 — the gate deduction
  const d1 = connectCards(db, ['empty_vault', 'unforced_lock']);
  if (d1.kind !== 'deduction' || d1.deduction.id !== 'd1_emptied_before') {
    fail(`D1 recipe failed: ${JSON.stringify(d1)}`);
  }
  assertCard('ded_emptied_before', 'verified');
  const goldStrings = useGameStore.getState().state.board.strings.filter((s) => s.kind === 'gold');
  if (goldStrings.length < 2) fail('gold strings not tied for both deductions');
  log.push('night 1 board: hint, wrong-pair bark, red-pen tutorial, D1 unlocked');

  // the edition still blocks the night (Dot's page must go to bed — II.15.1)
  if (game.advancePhase()) fail('night opened without the Evening Edition published');
  const edition = editionForToday(db);
  if (!edition || edition.id !== 'ed_d1') fail('ed_d1 not due on night 1');
  const draft = assembleDraft(db, edition);
  if (draft.join(',') !== 'empty_vault,unforced_lock,fifty_years_of_items') {
    fail(`unexpected day-1 draft: ${draft.join(',')}`);
  }
  const trustBefore = { ...useGameStore.getState().state.trust };
  if (!publishEdition(db, { headlineId: 'h_d1_measured', kickerId: 'k_d1_facts' })) {
    fail('publishing the measured day-1 edition failed');
  }
  if (JSON.stringify(useGameStore.getState().state.trust) !== JSON.stringify(trustBefore)) {
    fail('measured headline moved trust — it must be the neutral play');
  }
  if (publishEdition(db, { headlineId: 'h_d1_sensational', kickerId: 'k_d1_facts' })) {
    fail('published twice in one night');
  }
  assertFlag('printed_measured_d1');
  log.push('evening edition published: measured, draft = 3 verified on-record cards');

  // gate now opens into day 2
  if (!game.advancePhase()) fail('night gate still blocked after D1 + edition');
  const d2 = useGameStore.getState().state;
  if (d2.day !== 2 || d2.phase !== 'morning') fail(`expected day 2 morning, got day ${d2.day} ${d2.phase}`);
  log.push(`clock verified through gated night -> day ${d2.day}`);

  // --- day 2 morning: Morning Pages + vox pop (III.26, II.15.5) ---
  if (!morningPagesDue()) fail('morning pages not due on day 2 morning');
  if (!commitMorningPages(['q_who_emptied_the_capsule'])) fail('morning pages commit failed');
  assertFlag('morning_focus_q_who_emptied_the_capsule');
  const vox = voxPopLineFor(db, 'otto');
  if (!vox || !vox.includes('Smooth hands')) fail(`unexpected otto vox pop: ${vox}`);
  const greetingNeutral = greetingFor(db, 'margie');
  if (!greetingNeutral || !greetingNeutral.includes('pet')) fail('margie neutral greeting lost its "pet"');
  log.push('day 2 morning: pages committed, vox pop live, greetings tiered');

  unsubLog();
  unsubTriggers();
  unsubNotebook();
  unsubVerify();
  useDialogueStore.setState({ view: null, session: null });
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
