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
import { connectCards, pinCard, resetBoardSession, retireTheory, checkTheoryRetirements, layOnDesk, seatRailCard } from '../app/src/systems/board';
import { solveDustLibrary, solveSealSketch, solveThenNow, solveMapOverlay, solveTraceFerris } from '../app/src/systems/puzzles';
import { takePhoto } from '../app/src/systems/photo';
import { askGrandpa } from '../app/src/systems/hints';
import { installVerificationWatcher } from '../app/src/systems/verify';
import { publishEdition, editionForToday, assembleDraft } from '../app/src/systems/edition';
import { commitMorningPages, morningPagesDue, voxPopLineFor } from '../app/src/systems/morningPages';
import { greetingFor } from '../app/src/systems/trust';
import { SaveService, MemoryStorage } from '../app/src/engine/save/saveService';
import { evalCondition } from '../app/src/engine/conditions';
import { bus } from '../app/src/engine/eventBus';
import type { ContentDB } from '../app/src/content/contentDb';
import type { GameDef } from '../app/src/engine/clock';
import type { Day, Phase } from '../app/src/engine/types';

const curious = process.argv.includes('--curious');

function fail(msg: string): never {
  console.error(`autoplay: FAIL — ${msg}`);
  process.exit(1);
}

function driveDialogue(maxSteps = 60, stanceOrder: string[] = ['press', 'empathize', 'observe']): string[] {
  let guard = 0;
  const path: string[] = [];
  while (useDialogueStore.getState().view && guard++ < maxSteps) {
    const view = useDialogueStore.getState().view!;
    if (view.stances) {
      const enabled = view.stances.filter((s) => s.enabled);
      if (enabled.length === 0) fail(`node ${view.nodeId}: no enabled stances`);
      const pick = stanceOrder.find((s) => enabled.some((e) => e.stance === s))!;
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

function talkTo(db: ContentDB, characterId: string, expectDialogue?: string, stanceOrder?: string[]): void {
  const dlgId = selectDialogueFor(db, characterId);
  if (!dlgId) fail(`no dialogue available for ${characterId}`);
  if (expectDialogue && dlgId !== expectDialogue) fail(`expected ${expectDialogue} for ${characterId}, got ${dlgId}`);
  if (!useDialogueStore.getState().start(db, dlgId)) fail(`dialogue ${dlgId} did not start`);
  driveDialogue(60, stanceOrder);
}

function assertFlag(flag: string) {
  if (!useGameStore.getState().state.flags[flag]) fail(`flag "${flag}" not set`);
}

const HEADLESS_PUZZLES: Record<string, () => import('../app/src/engine/effects').Effect[]> = {
  dust_library: solveDustLibrary,
  sketch_memory_seal: solveSealSketch,
  then_now_founding: solveThenNow,
  trace_ferris: solveTraceFerris,
  map_overlay: solveMapOverlay,
};

/** Run a location hotspot's first passing interaction, exactly as the scene layer would. */
function runHotspot(db: ContentDB, locationId: string, hotspotId: string) {
  const game = useGameStore.getState();
  const state = game.state;
  const loc = db.locations[locationId];
  const hotspot = loc?.hotspots.find((h) => h.id === hotspotId);
  if (!hotspot) fail(`no hotspot ${hotspotId} at ${locationId}`);
  for (const it of hotspot.interactions) {
    if (!evalCondition((it.cond ?? {}) as never, state)) continue;
    if (it.once && state.flags[`done_${hotspot.id}_${it.id}`]) continue;
    if (it.oncePerDay && state.flags[`done_${hotspot.id}_${it.id}_d${state.day}`]) continue;
    if (it.effects) game.runEffects(it.effects as import('../app/src/engine/effects').Effect[]);
    if (it.once) game.runEffects([{ setFlag: `done_${hotspot.id}_${it.id}` }]);
    if (it.oncePerDay) game.runEffects([{ setFlag: `done_${hotspot.id}_${it.id}_d${state.day}` }]);
    if (it.opens) {
      const puzzleId = it.opens.startsWith('puzzle:') ? it.opens.slice('puzzle:'.length) : it.opens;
      const solve = HEADLESS_PUZZLES[puzzleId];
      if (!solve) fail(`no headless solver for puzzle ${puzzleId}`);
      game.runEffects(solve());
    }
    return it.id;
  }
  fail(`no passing interaction on ${locationId}/${hotspotId}`);
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

  // --- day 2: The Backwards Key (I.5.day2) ---
  game.moveTo('the_percolator');
  talkTo(db, 'dot', 'dot_d2_pitch'); // driveDialogue picks choice[0]: the sharp pitch
  assertFlag('pitch_d2_done');

  // Poppy before the key: the brush-off, not the confession
  game.moveTo('founders_square');
  talkTo(db, 'poppy', 'poppy_d2_pre');

  // council hall: the key hook (verbatim observe beat)
  game.moveTo('council_hall');
  runHotspot(db, 'council_hall', 'key_cabinet');
  assertCard('key_backwards', 'verified');
  assertCard('dust_outline', 'verified');
  assertFlag('examined_key_hook');

  // the vault: Dust Library puzzle (II.13.1), then the wax scrapings (II.12.4)
  game.moveTo('founders_square');
  runHotspot(db, 'founders_square', 'monument'); // opens + solves dust_library
  assertFlag('dust_library_done');
  assertCard('sharp_edged_void', 'verified');
  runHotspot(db, 'founders_square', 'monument'); // now yields the wax scrapings
  assertCard('wax_scrapings', 'verified');

  // Poppy: PRIMED confession (III.20 — the sketch does the asking)
  talkTo(db, 'poppy', 'poppy_d2_confession');
  assertFlag('poppy_confessed');
  assertFlag('poppy_confessed_primed');
  assertCard('poppys_checklist', 'verified');

  // the seal: describe -> sketch_memory puzzle -> confirm
  talkTo(db, 'poppy', 'poppy_d2_seal');
  game.runEffects(solveSealSketch()); // the puzzle:open effect resolves headless
  assertCard('seal_sketch', 'verified');
  talkTo(db, 'poppy', 'poppy_d2_seal_after');
  assertFlag('seal_after_done');
  log.push('day 2 core: key hook, dust library, PRIMED confession, seal sketch — complete');

  // --- night 2: theories, deductions, edition, gate ---
  if (!game.advancePhase()) fail('day2 morning->midday failed');
  if (!game.advancePhase()) fail('day2 midday->evening failed');
  if (!game.advancePhase()) fail('day2 evening->night failed');
  if (useGameStore.getState().state.location !== db.game.apartmentLocation) fail('night 2 did not send Gary home');

  // theory rack (II.16.3): "IT WAS NEVER THERE AT ALL" retires against the checklist
  const retirable = checkTheoryRetirements(db);
  if (!retirable.includes('th_never_there')) fail('th_never_there should be retirable after the checklist');
  if (retirable.includes('th_outsider')) fail('th_outsider must still stand before careful_hands');
  if (!retireTheory(db, 'th_never_there')) fail('retiring th_never_there failed');

  for (const [i, card] of ['key_backwards', 'dust_outline', 'poppys_checklist', 'sharp_edged_void'].entries()) {
    pinCard(card, 200 + i * 240, 420);
  }
  const d2ded = connectCards(db, ['key_backwards', 'dust_outline']);
  if (d2ded.kind !== 'deduction' || d2ded.deduction.id !== 'd2_borrowed_recently') fail('D2 recipe failed');
  const d3ded = connectCards(db, ['poppys_checklist', 'empty_vault']);
  if (d3ded.kind !== 'deduction' || d3ded.deduction.id !== 'd3_theft_window') fail('D3 recipe failed');
  const popded = connectCards(db, ['key_backwards', 'poppys_checklist']);
  if (popded.kind !== 'deduction' || popded.deduction.id !== 'poppy_opened_not_emptied') fail('poppy recipe failed');
  const aha = connectCards(db, ['sharp_edged_void', 'poppys_checklist']);
  if (aha.kind !== 'deduction' || aha.deduction.id !== 'careful_hands') fail('careful_hands aha failed');
  if (!checkTheoryRetirements(db).includes('th_outsider')) fail('careful_hands should make th_outsider retirable (III.22.3)');
  if (!retireTheory(db, 'th_outsider')) fail('retiring th_outsider failed');

  if (game.advancePhase()) fail('night 2 opened without the edition');
  if (!publishEdition(db, { headlineId: 'h_d2_measured', kickerId: 'k_d2_window' })) fail('publishing ed_d2 failed');
  if (!game.advancePhase()) fail('night 2 gate still blocked after deductions + edition');
  const d3state = useGameStore.getState().state;
  if (d3state.day !== 3 || d3state.phase !== 'morning') fail(`expected day 3 morning, got ${d3state.day} ${d3state.phase}`);
  log.push('night 2: theories retired, 4 deductions incl. careful-hands aha, edition, gate -> day 3');

  // --- day 3: The Man Who Counts Lighthouses (I.5.day3) ---
  if (!commitMorningPages(useGameStore.getState().state.notebook.questions.slice(0, 2))) fail('day 3 pages failed');
  game.moveTo('the_percolator');
  talkTo(db, 'dot', 'dot_d3_morgue');
  assertFlag('morgue_unlocked');
  game.moveTo('ledger_morgue');
  runHotspot(db, 'ledger_morgue', 'addition_drawer');
  assertCard('founders_addition_clipping', 'verified');
  if (useGameStore.getState().state.collectibles.clippings.length !== 1) fail('clipping not collected');

  game.moveTo('drowsy_lantern');
  talkTo(db, 'margie', 'margie_d3');
  assertCard('margies_testimony', 'verified');
  assertCard('lodger_gossip', 'verified');

  // contradiction desk (II.16.4): Margie vs the speech — a question is born
  game.moveTo('council_hall');
  talkTo(db, 'warren', 'warren_d3_speech'); // press/empathize path (driveDialogue prefers press: c4p cold exit)
  // pressed Warren: "No." — true, closed; the folio comes back via the longer door (II.12.1 reroute)
  if (!useGameStore.getState().state.flags['warren_pressed']) fail('press route should have closed the scene');
  talkTo(db, 'warren', 'warren_d3_speech', ['empathize', 'press']); // return with better manners
  assertCard('warrens_speech', 'verified');
  assertCard('lighthouse_folio', 'verified');
  const cx1 = layOnDesk(db, 'margies_testimony', 'warrens_speech');
  if (cx1.kind !== 'contradiction' || cx1.id !== 'cx_warren') fail('cx_warren did not fire');
  talkTo(db, 'warren', 'warren_d3_photo');
  assertCard('night_photograph', 'verified');
  assertFlag('has_camera');
  assertCard('founding_photograph', 'verified');

  // then & now (II.13.2): the plaque moved — runHotspot solves the opened puzzle
  game.moveTo('founders_square');
  runHotspot(db, 'founders_square', 'dedication_plaque');
  assertFlag('then_now_founding_done');
  assertCard('plaque_moved', 'verified');

  // photo mode: the square's oldest lantern (II.19.2)
  if (!takePhoto(db, 'square_lantern_photo')) fail('photo mode capture failed');
  if (useGameStore.getState().state.photos.length !== 1) fail('photo not stored');

  // night 3: D4 clears Warren (CLEARED stamp via clearSuspect), D5 gates
  if (!game.advancePhase() || !game.advancePhase() || !game.advancePhase()) fail('day 3 clock failed');
  for (const [i, card] of ['margies_testimony', 'warrens_speech', 'lighthouse_folio', 'night_photograph', 'lodger_gossip'].entries()) {
    pinCard(card, 180 + i * 200, 300);
  }
  const d4ded = connectCards(db, ['margies_testimony', 'warrens_speech', 'lighthouse_folio']);
  if (d4ded.kind !== 'deduction' || d4ded.deduction.id !== 'd4_warren_cleared') fail('D4 recipe failed');
  if (!useGameStore.getState().state.board.cleared.includes('warren')) fail('warren not CLEARED by D4');
  const d5ded = connectCards(db, ['night_photograph', 'lodger_gossip']);
  if (d5ded.kind !== 'deduction' || d5ded.deduction.id !== 'd5_lodger') fail('D5 recipe failed');
  if (!publishEdition(db, { headlineId: 'h_d3_compassionate', kickerId: 'k_d3_folio' })) fail('ed_d3 publish failed');
  if ((useGameStore.getState().state.trust.warren ?? 0) < 1) fail('compassionate d3 headline should warm Warren');
  if (!game.advancePhase()) fail('night 3 gate blocked');
  log.push('day 3 complete: morgue, testimony, folio via reroute, photograph, camera, then&now, D4 CLEARED + D5');

  // --- day 4: The Weasel Digs at Midnight (I.5.day4) ---
  if (!commitMorningPages(useGameStore.getState().state.notebook.questions.slice(0, 3))) fail('day 4 pages failed');
  game.moveTo('the_percolator');
  talkTo(db, 'dot', 'dot_d4_pitch');
  game.moveTo('drowsy_lantern');
  talkTo(db, 'ferris', 'ferris_d4_inn');
  assertFlag('met_ferris');

  // trace the boot prints (II.12.4), then the evening stakeout fires at the riverbank
  game.moveTo('riverbank');
  runHotspot(db, 'riverbank', 'boot_prints');
  assertFlag('ferris_tracks_followed');
  assertCard('ferris_tracks', 'verified');
  if (!game.advancePhase()) fail('d4 morning->midday failed');
  if (!game.advancePhase()) fail('d4 midday->evening failed');
  game.moveTo('riverbank'); // evening: the stakeout trigger
  if (!useDialogueStore.getState().view) fail('stakeout trigger did not fire');
  const grapesBeforeStakeout = useGameStore.getState().state.collectibles.grapesDeclined;
  driveDialogue();
  if (useGameStore.getState().state.collectibles.grapesDeclined !== grapesBeforeStakeout + 1) {
    fail('grape beat 4 (the longest silence) did not count');
  }
  assertFlag('stakeout_done');
  assertCard('survey_map', 'verified');

  // the lockup pivot + map overlay foreshadowing (II.13.4)
  game.moveTo('lockup');
  talkTo(db, 'ferris', 'ferris_d4_lockup');
  assertCard('ferris_testimony', 'verified');
  game.runEffects(solveMapOverlay());
  assertFlag('found_ghost_landing');

  // night 4: rail seating incl. the composite pair, aha 22.2, D6, edition
  if (!game.advancePhase()) fail('d4 evening->night failed');
  if (seatRailCard(db, 'ev_poppy_check', 'night_minus_3') !== 'seated') fail('ev_poppy_check refused');
  if (seatRailCard(db, 'ev_ceremony', 'ceremony') !== 'seated') fail('ev_ceremony refused');
  if (seatRailCard(db, 'ev_photo_night', 'night_minus_2') !== 'seated') fail('ev_photo_night refused');
  if (seatRailCard(db, 'ev_crossing', 'night_minus_2') !== 'composite') fail('composite pair did not seat (III.22.5)');
  assertFlag('rail_composite_seen');
  const cx2 = layOnDesk(db, 'ferris_testimony', 'poppys_checklist');
  if (cx2.kind !== 'contradiction' || cx2.id !== 'cx_two_keys') fail('cx_two_keys did not fire');
  pinCard('ferris_testimony', 900, 300);
  pinCard('ded_emptied_before', 1100, 300);
  const aha22 = connectCards(db, ['night_photograph', 'ferris_testimony']);
  if (aha22.kind !== 'deduction' || aha22.deduction.id !== 'photo_witness') fail('photo_witness aha failed');
  const d6ded = connectCards(db, ['ferris_testimony', 'ded_emptied_before']);
  if (d6ded.kind !== 'deduction' || d6ded.deduction.id !== 'd6_insider') fail('D6 recipe failed');
  if (game.advancePhase()) fail('night 4 opened without edition');
  if (!publishEdition(db, { headlineId: 'h_d4_measured', kickerId: 'k_d4_witness' })) fail('ed_d4 publish failed');
  if (!game.advancePhase()) fail('night 4 gate blocked');
  const d5state = useGameStore.getState().state;
  if (d5state.day !== 5) fail(`expected day 5, got ${d5state.day}`);
  log.push('day 4 complete: stakeout, pivot, tracks, rail composite, photo-witness aha, D6, gate -> day 5');

  unsubLog();
  unsubTriggers();
  unsubNotebook();
  unsubVerify();
  useDialogueStore.setState({ view: null, session: null });
  return log;
}

/**
 * The curious run (spec §11): after the guaranteed path, sweep every location,
 * poke every passing hotspot interaction and chekhov detail, talk to everyone
 * who'll talk (OBSERVE-first), and pull every vox pop — crash coverage for the
 * optional graph. Any throw is a FAIL.
 */
async function runCurious(seed: number): Promise<void> {
  await runOnce(seed);
  const db = loadContentDB();
  const game = useGameStore.getState();
  let interactions = 0;
  let conversations = 0;
  let voxpops = 0;

  for (const loc of Object.values(db.locations)) {
    game.moveTo(loc.id);
    // drain any trigger that fired on entry
    if (useDialogueStore.getState().view) {
      driveDialogue(80, ['observe', 'empathize', 'press']);
      conversations++;
    }
    for (const hotspot of loc.hotspots) {
      const state = useGameStore.getState().state;
      if (!evalCondition((hotspot.cond ?? {}) as never, state)) continue;
      if (hotspot.kind === 'examine' || hotspot.kind === 'puzzle' || hotspot.kind === 'photo') {
        for (const it of hotspot.interactions) {
          if (!evalCondition((it.cond ?? {}) as never, useGameStore.getState().state)) continue;
          if (it.effects) game.runEffects(it.effects as never);
          if (it.opens) {
            const pid = it.opens.startsWith('puzzle:') ? it.opens.slice('puzzle:'.length) : it.opens;
            const solve = HEADLESS_PUZZLES[pid];
            if (solve) game.runEffects(solve());
          }
          interactions++;
          break;
        }
      } else if (hotspot.kind === 'chekhov' && hotspot.detail) {
        const state2 = useGameStore.getState().state;
        if (!evalCondition((hotspot.detail.cond ?? {}) as never, state2)) continue;
        const effects: import('../app/src/engine/effects').Effect[] = [];
        if (hotspot.detail.card) effects.push({ giveCard: hotspot.detail.card });
        if (hotspot.detail.question) effects.push({ notebook: { question: hotspot.detail.question } });
        if (effects.length) game.runEffects(effects);
        interactions++;
      } else if (hotspot.kind === 'talk' && hotspot.character) {
        const dlgId = selectDialogueFor(db, hotspot.character);
        if (dlgId) {
          useDialogueStore.getState().start(db, dlgId);
          driveDialogue(80, ['observe', 'empathize', 'press']);
          conversations++;
        } else if (voxPopLineFor(db, hotspot.character)) {
          voxpops++;
        }
      }
    }
  }
  console.log(
    `autoplay --curious: PASS — guaranteed path + optional sweep (${interactions} interactions, ${conversations} conversations, ${voxpops} vox pops) with zero crashes`,
  );
}

async function main() {
  if (curious) {
    await runCurious(42);
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
