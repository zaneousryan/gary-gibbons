# Phase Log — Gary Gibbons: The Empty Capsule

Running build log. One entry per session/phase, appended by Aletheia. Each phase entry must include: what shipped, gg-content-reviewer verdict (or "no content in phase"), gg-verifier evidence verbatim, stubs, and open DESIGN-QUESTIONs.

---

## 2026-07-02 — Session start: repo bootstrap

- Git repo initialized in place; remote `zaneousryan/gary-gibbons`.
- `CLAUDE.md.md` renamed to `ALETHEIA.md` (repo-layout §4); `CLAUDE.md` pointer added.
- `Docs/` normalized to `docs/`; `design-questions.md` and `phase-log.md` created.
- Environment: Node v24.13.0, npm 11.6.2. Rust not yet installed — Ryan installing in parallel; required for Phase 7 Tauri packaging only.
- Ryan's directive (2026-07-02): run all phases 0→7 in order, gates binding, autonomously overnight.

---

## 2026-07-02 — PHASE 0: Foundation — DONE

### What shipped
- **Engine core** (`app/src/engine/`): GameState (spec §4.1), Condition DSL evaluator + Effects DSL (spec §4.2–4.3), EventBus with history ring, seeded mulberry32 RNG (only randomness source), day/phase clock with gate/edition blocking (spec §4.4), SaveService with pluggable storage (localStorage/memory; Tauri fs stubbed for Phase 7) + ordered migrations, Zustand+Immer GameStore.
- **Content pipeline** (`app/src/content/`): Zod schemas for all §5 families (characters, locations, dialogue, cards, deductions, game, schedules, editions, timeline, sidestories, barks, hints, achievements); pure `buildContentDB` shared by app, validator, and autoplayer; Vite glob loader.
- **Tools** (`tools/`): `validate-content` (schema, ID integrity, reachability, off-record/finale rule, schedule ≥2-phase rule, ref presence, orphan report), `autoplay` (headless run, determinism proven via double-run diff), `gen-placeholders` (dependency-free RGBA PNG encoder + 5×7 bitmap font; 74 assets in master-palette colors).
- **App shell**: Pixi 8 stage (parallax layers, point-to-walk with depth scaling, hotspot markers with proximity highlight, scheduled NPC actors), DialogueBox (typewriter, PRESS/EMPATHIZE/OBSERVE with disabled-tooltip OBSERVE, choices, off-record badge), HUD (location, day/phase, save/load, advance), examine panel, toast, dev menu (`~`: scene jump, clock, weather, flag/card grant).
- **Seed content**: 7-day game graph with titles+refs; gary/dot/otto/milo; gary_apartment + the_percolator; `dot_d1_redpens` (Red Pen Bandit hook II.17.1, COLD+PRIMED entries, earnable OBSERVE via stair-rail red-ink hotspot, Day 1 Archie rowboat memory I.7.2); card + verify route; 4 barks; schedules.
- **e2e**: Playwright smoke — boot→walk→talk→save→reload and examine+phase-advance, both green on a dedicated port with scene-ready synchronization.

### gg-content-reviewer verdict
**LGTM** (after 2 fix rounds; 7 gaps total found and closed: unearnable `noticed_red_ink` PRIMED/OBSERVE/verify-route, Day-1 timeline contradiction in Dot's c1, wrong ref II.7.2→I.7.2, missing Day-1 Archie memory, pen-count arithmetic, sprite naming convention, literal "(beat)" stage direction). Reviewer note for Ryan: 17 aletheia-authored lines all in voice; one judgment call — Dot's cold greeting stays "Gibbons" (not "Mr. Gibbons"), read as correct voice adaptation.

### gg-verifier verdict (evidence verbatim)
**PASS** — Phase 0 (Foundation), verified 2026-07-02.
1. `npm run validate:content` — exit 0; "0 error(s), 1 warning(s)" (known: dots_missing_pens feeds nothing until Phase 2).
2. `npm run test` — exit 0; Test Files 5 passed, Tests 31 passed.
3. `npm run autoplay` — ran twice; Compare-Object on full logs: RUNS IDENTICAL; "autoplay: PASS (23 log lines, deterministic across 2 runs, seed 42)"; asserts dialogue path c1→c2:press→c3→c4→c5, card+flag+question, save/reload byte-identical, clock night→day 2.
4. `npm run autoplay -- --curious` — exit 0 with explicit "NOT RUN — no optional-path content until Phase 5" notice.
5. `npm run build` — exit 0 (✓ built in 4.75s); advisory: index chunk 608 kB — code-split look by Phase 7.
6. `npm run test:e2e` — exit 0, 2 passed (38.3s).
Hand inspections: 3 STUB markers (phase-4 puzzles, phase-5 curious, phase-7 TauriFs), none claimed complete; Math.random only in rng.ts comment; placeholder fallback proven empirically (all 74 assets are placeholders and e2e boots); no Cut List mechanic implemented.

### Runtime verification (Aletheia, real browser drive)
Boot → stair-rail examine (flag set) → walk → PRIMED entry fired ("You've got that look…") → OBSERVE enabled and taken → oncePerDay repeat toast → save → load → 4 phase advances into Day 2 → dev menu. Zero page errors. Screenshots in session scratchpad.

### Stubs (open, honest)
- `STUB(phase-4)`: puzzle modules open via §6.7 contract (PixiStage toast placeholder).
- `STUB(phase-5)`: autoplay --curious.
- `STUB(phase-7)`: TauriFsStorage.

### Open DESIGN-QUESTIONs
- DQ-1 (spec says v1.2, doc is v1.3 species pass — building against v1.3). No new questions this phase.

### Notes for later phases
- Vite chunk >500 kB — plan manualChunks split in Phase 7.
- Project subagent types not registered with the session's Agent tool; reviewer/verifier dispatched via general-purpose agents bound to the .claude/agents/*.md charters — same effect. (Resolved mid-session: gg-* agent types registered from Phase 1 on.)

---

## 2026-07-02 — PHASE 1: World & Words — DONE

### What shipped
- **SceneRenderer full** (`app/src/scenes/PixiStage.tsx`): parallax layers, hotspots incl. chekhov detail layer (III.24), scheduled NPC actors with 2-frame idle/talk cycles, point-to-walk with depth scaling, day-phase tint LUT-lite, sit-spots with Bench Time monologues (II.18), Tab-cycle keyboard hotspot focus + Enter (accessibility floor).
- **DialogueSystem full** (`app/src/systems/dialogue.ts`): PRIMED-first entries (III.20), three stances with OBSERVE disabled-with-tooltip (II.12.1), choices, off-record card enforcement in code (III.23.1 — content arrives Day 2+), oncePerDay/repeatBark, narrator set-piece speaker.
- **NotebookSystem core** (§6.3): notebook.json content family (entries + question texts), auto-entries via bus, PEOPLE/PLACES/QUESTIONS overlay. GRAPES tab, Morning Pages, tear-out: later phases.
- **Scheduler v1** (§6.6): day/phase placement + ifRain routing.
- **Scene triggers**: location-level auto-firing set-pieces; Day 1 ceremony fires once at founders_square evening.
- **Inner-voice bark overlay**; **Content**: 9 new characters, market_row + founders_square, 11 new Day 1 dialogues (ceremony verbatim), 5 new cards, notebook.json, full d1 schedules, ~20 new barks.

### gg-content-reviewer verdict
**LGTM** (after 1 fix round; 4 gaps: two mislabeled authored:"verbatim" stage-direction adaptations in ceremony_d1, invented "Arthur" first name for Archie (removed — no lore not traceable to the doc), orphaned milo_red_ink flag replaced with milos_crimes_notebook card scaffolding the Phase 2 Red Pen recipe). Reviewer note for Ryan: ~84 aletheia-authored Day 1 lines all read in-voice; spot-check Poppy's run-ons and Gino's bellissimo/tragedy binary by ear.

### gg-verifier verdict (evidence summary; full report in session log)
**PASS** — all 6 gates:
1. validate:content — exit 0; 13 characters, 4 locations, 13 dialogues, 6 cards; 0 errors, 6 known warnings (cards feed Phase 2's graph).
2. test — 31/31.
3. autoplay ×2 — RUNS IDENTICAL; "PASS (103 log lines, deterministic across 2 runs, seed 42)"; full Day 1 path incl. grape:declined total 1, ceremony trigger + 4 verified cards + question, no-refire assert, save/reload byte-identical, night→day 2.
4. --curious — explicit NOT RUN notice (Phase 5).
5. build — exit 0 (chunk-size advisory carried to Phase 7).
6. test:e2e — 3/3 incl. "day 1 ceremony set-piece fires at the square" (1.1m).
Hand inspections: 3 honest STUBs (phase-4/5/7); Math.random clean; off-record mechanism live but content-untested (correct for Day 1); 190 placeholder files, zero real assets, boots green; no Cut List violations; SceneRenderer/Dialogue/Notebook/Scheduler claims verified in code line-by-line.

### Stubs (open)
- STUB(phase-4) puzzle modules · STUB(phase-5) curious run · STUB(phase-7) TauriFsStorage.

### Open DESIGN-QUESTIONs
- DQ-1 only (carried). No new questions.

---

## 2026-07-02/03 — PHASE 2: The Board — DONE

### What shipped
- **BoardSystem** (`app/src/systems/board.ts` + `app/src/ui/Board.tsx`): PinCanvas (drag, free placement, positions in the save — the player's mess is theirs), string matcher (order-free, supersets ≤3, requireVerified refusal, off-record refusal + "promised" III.23.1), gold-string promotion + ledger cell fill, TimelineRail seating with anchor conditions, SuspectLedger + CLEARED stamps, TheoryRack retirement, ContradictionDesk → question cards, session-unique wrong-pair barks.
- **Night loop**: "Send Them Home" (night transition relocates Gary home — I.5), I.6 gate blocking, HintService (4-min stall + ordered Ask-Grandpa hints, node-not-pair rule), pocket recap away from home, badge button + grandpa modal.
- **Content**: d1_emptied_before (I.6.D1, gates Day 1) + red_pen_bandit tutorial recipes, 2 deduction cards, timeline slots NIGHT−5→CEREMONY, d1 hint ladder, 15 wrong-pair barks (of the eventual ≥40 — Phase 6 owns the rest).
- **Dev menu**: 60-pin stress case, clear stress, replay deductions.
- **ID convention locked**: recipe ids = I.6 row label (dN_*) or plain snake for non-table recipes; produced card = ded_ + recipe suffix.

### gg-content-reviewer verdict
**LGTM** (after 1 fix round; 2 gaps: a wrong-pair bark pre-echoed Archie's credits-letter phrase "the question under the question" (§8.4/§19.3 — reserved payoff, replaced entirely), deduction id convention inconsistency fixed before the freeze). Reviewer verified fixes independently via grep + gate re-runs. For Ryan's skim: d1 hints 2–3 are both lock-centric — flat escalation, quality note only.

### gg-verifier verdict (evidence summary)
**PASS** — all 6 gates: validator 0 errors/2 known warnings; 40/40 tests (9 board suites); autoplay ×2 process-level IDENTICAL, 114 lines, full night-1 assertions (Send-Them-Home, gate-blocked-before-deduction, hint ladder, wrong-pair miss, both recipes, gold strings, gate opens to Day 2); --curious explicit NOT RUN; build exit 0; e2e 3/3 incl. board flow.
**60-pin perf (spec §14)**: headed Chromium on GTX 1660 SUPER @1080p — empty board 56.36 avg / 53.48 worst fps; 60 pins + strings 56.52 avg / 52.91 worst fps. Delta <1fps = zero measurable regression. The ~56fps ceiling exists with zero pins (virtualized-display artifact — "Meta Virtual Monitor" present); **Ryan: spot-check on bare metal**, not chargeable to the board.
Hand inspections: 4 honest STUBs (now incl. phase-5 rail cinematic), Math.random clean, full board state in the save shape, Cut List clean, id convention verified, no stale ids repo-wide.

### ⚠ ID FREEZE IN EFFECT (ALETHEIA §7)
From this point, any content ID rename requires a migration entry in `app/src/engine/save/migrations.ts`.

### Stubs (open)
- STUB(phase-4) puzzle modules · STUB(phase-5) curious run + rail-complete cinematic · STUB(phase-7) TauriFsStorage.

### Open DESIGN-QUESTIONs
- DQ-1 only (carried).

---

## 2026-07-03 — PHASE 3: The Reporter — DONE

### What shipped
- **VerificationSystem** (§6.4): route sweep on flag/card/phase/deduction events; CONFIRMED — G.G. toast; verified_via_* provenance flags; whyUnverified() copy.
- **EditionSystem** (§6.5, II.15.1): Dot's-law draft (verified on-record only — off-record mathematically cannot print), tone-axis headlines with conds/effects, kickers, attribution sub-step with zero ceremony (III.23.2 — two plain buttons, no reward), once-per-night, printed_{tone}_d{N} flags, chalkboard/rumor reactions, gallery. Night gate now requires the published page.
- **Trust surface** (III.23.3): cold/neutral/warm tiers via greetings only (greeting bubble on talk); verifier grepped the UI — no numeric trust anywhere.
- **Morning Pages** (III.26): Day 2+ mornings, pick ≤3 open questions, morning_focus_* flags, prior focus cleared daily.
- **Vox pop** (II.15.5): ambient scheduled NPCs answer the focused Question of the Day from the voxpop pool when they have no fresh dialogue.
- **Content**: editions/ed_d1 (canon example headlines on the tone axis, II.15.1 trust doctrine deltas, THE EMPTY ESPRESSO chalkboard verbatim, outsider_thief rumor seed), voxpop pool (5 NPCs), day-1 edition wiring.

### gg-content-reviewer verdict
**LGTM — first pass, zero gaps.** Rulings: doc example headlines apt for Day 1; chalkboard lands Day 2 morning correctly; Otto "smooth hands" / Evelyn "couldn't wait for the future" are §27 town-speculation, NOT Discovery Web leaks. For Ryan's skim: (a) sensational + measured share one chalkboard riff — consider distinct riffs per tone in later editions; (b) the 5 vox-pop lines are a taste call on foreshadowing, canon-safe per reviewer.

### gg-verifier verdict (evidence summary)
**PASS** — validator 0 errors/1 known warning; 48/48 tests; autoplay ×2 process-level byte-identical (123 lines) with real assertions verified in source (verification route provenance, edition-blocked night, zero-trust measured play, publish-twice refusal, day-2 pages + vox pop + greeting tier); --curious explicit NOT RUN; build clean; e2e 3/3 with full compose flow. Hand inspections: 4 honest STUBs, Math.random clean, no visible trust meter (Cut List), Dot's law structurally airtight, attribution zero-ceremony confirmed, save shape correct, ID freeze respected (diff touches no frozen ids — no migration needed), no silent narrative decisions.

### Stubs (open)
- STUB(phase-4) puzzle modules + thock sfx · STUB(phase-5) curious run + rail cinematic · STUB(phase-7) TauriFsStorage.

### Open DESIGN-QUESTIONs
- DQ-1 only (carried).

---

## 2026-07-03 — PHASE 4: Vertical Slice Day 2 — DONE (playtest build #1)

### What shipped
- **Puzzle framework** (§6.7): open(id)→resolve(effects) contract, PuzzleHost, openPuzzle effect, headless solvers, PUZZLE_RESOLVE_EFFECTS registry consumed by the validator (puzzle-granted cards are graph-visible). PixiStage puzzle STUB retired.
- **dust_library** (II.13.1): void↔checklist matching, canon items incl. Archie's oilcloth parcel (the player unknowingly matches Grandpa's void), sharp-edge payoff, wax scrapings follow-up.
- **sketch_memory: the seal** (II.12.2): parts assembly with replaying description, silent 0–3 grading, imperfect sketches still pin.
- **AudioService pass 1** (§6.8): Howler channels + synthesized thock/blip/chime fallbacks — zero OGGs required (placeholder rule holds for audio).
- **DEMO groundwork** (§13): demo.endAfterDay schema + clock blocker, inert in shipping game.json.
- **Day 2 content**: council_hall (key-cabinet verbatim beat, founding-portrait Discovery Web path C, guardian's chair), Poppy arc COLD verbatim + III.20 PRIMED variant + seal pre/puzzle/after chain, dot_d2 pitch + Archie memory, brush-off scene preserving in-day free order (§27), 10 cards, recipes D2/D3/poppy_opened_not_emptied/careful_hands (aha), theories th_outsider + th_never_there, ed_d2, d2 schedules, hint ladders (node-not-pair), grape beat 2 verbatim.
- **Routing fix**: day:1 conds retrofitted on all Day-1 dialogue entries (dot_d1_redpens was selectable on Day 2).

### gg-content-reviewer verdict
**LGTM** (after 1 fix round). Rulings: card-cond entry gating for the confession is the faithful smallest-reasonable reading of I.6.D2 (no DQ needed); early 2-input careful_hands IS the doc's "quiet chill placed early" — **Phase 6 note: the doc's full sentence adds the fragment; confirm Night 6 authoring doesn't assume ded_careful_hands is un-produced**; 2 of 2–3 theories in range; identifiable-sensational ed_d2 headline matches the doc's own pattern. Gaps fixed: invented "keepsake tin" → canon oilcloth parcel; trembling stage direction restored (c7n + worried emote); Morning Pitch board-picker gap logged as DQ-2. Nit for later: rename void_tin → void_parcel on next touch. Ryan skim: ~18 authored lines (Poppy deflection, Dot's pitch reactions).

### gg-verifier verdict (evidence summary)
**PASS** — validator PASS (5 locations/18 dialogues/18 cards/6 deductions/2 editions); 54/54 tests (brief said 57 — brief arithmetic error, flagged by verifier); autoplay ×2 byte-identical, 195 lines, all Day-2 assertions verified line-by-line in source; --curious explicit NOT RUN; build clean; e2e 4/4 incl. dust-library browser drive. Hand inspections: STUB set correct after PixiStage retirement (one stale thock STUB comment found in verify.ts — deleted); Math.random clean; zero OGGs + synthesized fallback proven; puzzles organic per §13; ID freeze respected (addition-only diff, no migration needed); GameState untouched.

### Open DESIGN-QUESTIONs
- DQ-1 (carried) · **DQ-2 (new)**: Morning Pitch board-item picker vs dialogue-choice interim (II.16.6).

---

## 2026-07-03 — PHASE 5: Systems Completion — DONE

### What shipped
- **All 9 puzzle modules exist** (§6.7): then_now (plaque moved), trace_follow (holed sole), photo_triangulation, fire_escape_sightline, torn_letter, handwriting_match, map_overlay (ghost landing) join dust_library + sketch_memory — each with UI, headless solver, registry entry (validator-visible grants).
- **Photo mode** (II.12.3): camera from Warren D3, viewfinder, lantern collectibles, overnight prints. GameState v2 + tested migration.
- **Weather** (II.14.2): seeded deterministic roll + D5-midday schedule, rain variants + particles, ifRain rerouting.
- **LivingTown** (II.14.4/II.27): vignette selector, townTheory from rumor seeds, rumor pool.
- **Rail**: completion cinematic (RailCinematic), composite-pair support (III.22.5 — content arrives Phase 6 with milos_sighting), clearSuspect deduction product (D4/D8 pattern).
- **Off-the-record system LIVE** (III.23.1, via review): Margie's sherry quote is the tutorial — off-record card, string refusal ("promised" + verbatim inner line), on-record corroboration through Warren's own admission; sweep upgrades off-record via routes (the know-it→prove-it loop Phase 6 builds on).
- **OBSERVE tells wired project-wide**: chekhov detail flag field; Julian's ring, Warren's glasses, Poppy's fog all earnable.
- **Reentrant dialogues** (II.12.1 cozy failure): pressing Warren closes the scene; returning with better manners reopens it (with an in-voice callout).
- **Days 3–4 content**: ferris + prudence; drowsy_lantern, ledger_morgue, riverbank, lockup; verbatim Margie/Warren/Ferris/stakeout/lockup scenes; grape beat 4 (the longest silence); 20 cards incl. 3 rail events; recipes D4 (CLEARED stamp)/D5/D6/photo-witness aha; contradictions cx_warren + cx_two_keys; ed_d3/ed_d4 (WEASEL CAUGHT RED-PAWED! as the tempting-wrong); morgue + Founder's Addition beat; hints; 3 new bark pools.

### gg-content-reviewer verdict
**LGTM** (after 1 major fix round — 3 real gaps): (1) the REQUIRED off-record tutorial was missing entirely → implemented in full, engine + content + autoplay assertions; (2) composite rail pair was wired to the wrong cards (Warren's photo is evidence of the WATCHER) → ev_photo_night deleted, pair deferred to Phase 6 with a new validator rule; (3) OBSERVE tells were unearnable project-wide → wired. Rulings: press-reroute acceptable; d6 deduction-card input faithful to "Ferris's Testimony + D1"; timeline 4-slot trim correct (§3 names exactly four event nights); Prudence market placement acceptable interim (decorative until Phase 6); Dot's authored Archie memories in voice. Ryan note: Warren's glasses tell fires with the scene's mandatory narration (softer than the doc's "noticed" gating — engine has no portrait-click affordance yet).

### gg-verifier verdict (evidence summary)
**PASS** — validator 0 errors/5 by-design warnings (15 chars, 9 locations, 26 dialogues, 39 cards, 10 deductions, 4 editions, 6 bark pools); 63/63 tests; autoplay ×2 byte-identical, 344 lines, Days 1–4 assertions verified line-by-line; **curious run LIVE** (optional sweep, zero crashes); build clean; e2e 4/4. Hand inspections: ONE remaining STUB repo-wide (TauriFs, phase-7); Math.random clean (weather has its own seeded mulberry — consolidation nit for Phase 7); GameState v2 migration proven; timeline trim needs no migration; stakeout is watch-and-dialogue, NOT stealth-follow (Cut List clean); vignette watcher not in autoplay path (determinism safe). Verifier notes fixed: autoplay double-fire removed, stale composite log line fixed.

### Stubs (open)
- STUB(phase-7) TauriFsStorage — the only one left.

### Open DESIGN-QUESTIONs
- DQ-1, DQ-2 (carried). No new questions.

### Notes for Phase 6
- compositePair = [ev_crossing, ev_milo_sighting] once milos_sighting exists; rail completes Night 6 via ev_garden (night_minus_5).
- careful_hands already produced — Night 6 authoring must not assume it un-produced (reviewer continuity note from Phase 4).
- Day 5 opens with the Ferris lockup read-aloud consequence if printed_sensational_d4.

---

## 2026-07-03 — PHASE 6: Content Production — DONE (the game is completable)

### What shipped
- **Days 5–7 complete**: Prudence's day (romance/alibi/SEAL=VALE SIGNET verbatim, Evelyn confirmation, Ferris read-aloud consequence branch, grape beat 5), the heaviest day (Clara ×3 verbatim with off-record clue 3 → Ida's ledger corroboration + PRIMED trust variant, Ida's ledger, the fragment set-piece, Milo's secret trade + protectable sighting + fire-escape verification + voxpop second route, Beatrice's tea FULL VERBATIM off-record with a PRIMED "Who was at the window?" variant, garden acoustics per §13.7, torn letter), and the finale (Dot's blessing + Thin Sourcing exchange, the river walk, boathouse four-reads + shining nails, confrontation FULL VERBATIM with any-order evidence presentation + "Front page after all." variant + III.25.4 floorboards variant, the reading with the complete will, grape 7 with the grounded-Milo consequence branch, credits with the complete Archie letter).
- **The Discovery Web at scale**: off-record know-it→prove-it proven for Clara (ledger route) and Beatrice (acoustics route per §13.7); beatrice_read_will stays a promise forever.
- **Night 6**: rail COMPLETES + Two-Witnesses-One-Minute composite, D9–D12 fill Julian's ledger row, D13 FINAL (4 inputs, all on-record), direction aha (railFlip + mapMark), th_secret retires, Hold The Page + Milo attribution (refuse-then-choose, "the game just remembers").
- **Side stories**: runner system + all 9 arcs with trust floors, payoff barks, doodles — incl. the handyman publish-or-keep CHOICE (both endings written, the Hold-The-Page rehearsal).
- **Texture**: 4 canon skipping-rhyme verses, 40 wrong-pair barks (spec ≥40 met), festival-photo + locked-drawer + missing-week + &Wick seeds placed unremarked, Beatrice + 4 locations, 26 cards, 8 recipes, editions d5–d7, hints.
- Totals: 16 characters, 13 locations, 46 dialogues, 61 cards, 18 deductions, 7 editions, 9 sidestories, 9 bark pools.

### gg-content-reviewer verdict
**LGTM** (after 1 major round — 9 gaps, the strictest review of the project): verbatim clause drop restored (Theodora's letter, at last); Milo attribution consequences and the handyman choice — both REQUIRED features — implemented in full; "Front page after all." wired; a 4th "truth with compassion" recitation removed (exactly 3 game-wide, grep-verified); voxpop umbrella route added per spec §5.4; festival seed placed. Two findings the reviewer RETRACTED with evidence after my citations: the garden-acoustics verification route (§13.7 verbatim authority; delivery-vs-printability distinction holds) and the hold-flag mismatch (engine's generic printed_{tone}_d{day} flag — false positive from content-only scope).

### gg-verifier verdict (evidence summary)
**PASS** — validator 0 errors/5 by-design warnings; 63/63 tests; **autoplay FULL GAME boot→credits, 595 lines, deterministic ×2** (all 18 recipes, six gated nights, primed tea, hold ack, thin-sourcing, end-of-game blocker traced to engine code); curious sweep 38 interactions zero crashes; build clean; e2e 4/4. Independent hand-verification of the side-story runner via a throwaway harness (all 9 stories, trust floors correct). ID freeze respected (addition-only diff). Cut List: single ending confirmed (the floorboards/read-it variants change one exchange each, never the outcome).

### Phase 7 backlog (from both gates)
- Side-story runner has no automated coverage (verified by hand only) — add sidestories.test.ts or wire into autoplay.
- julian_read_it branch rides on inspection alone — add an assertion.
- Wrong-pair barks: 40 exactly (commit message said 42 — arithmetic slip, target met).
- weather.ts mulberry duplication → consolidate on Rng.
- Beatrice festival-photo payoff line (seen_festival_photo) — post-game/NG+ scope.
- Vite chunk 925 kB — code-split.

### Open DESIGN-QUESTIONs
- DQ-1, DQ-2 (carried) · **DQ-3 (new)**: side stories ship as observational arcs; four interactive centerpieces flagged for Ryan (handyman choice since implemented — the other three stand).

---

## 2026-07-03 — PHASE 7: Polish & Ship — DONE (RC, web build; native build transfers to Ryan)

### What shipped
- **Title → Save slots → Game** (spec §8): New Game / Continue (slot + day/phase) / New Game+ (post-completion) / "Your Week in Print" stats — last line "Grapes declined: N", plain, no fanfare (II.19.2).
- **Settings** (persisted outside saves): text size, text speed incl. instant, master/music/sfx volumes, colorblind string patterns (per-kind dash + mid-string glyphs ★/❦/● — never color alone), reduce motion (instant text + rain particles off). Reachable from title AND the HUD gear.
- **NG+** (II.19.1): 25 Archie margin notes rendered against their notebook entries (post-review: no invented lore, canon address terms), gallery-carryover scaffold, ngPlus state.
- **Achievements are content** (spec §13): content/achievements.json on the condition DSL (validator-checked); watcher on 5 event types; hidden ones silent (grapes_declined_23 tracks the real 23-grape tally via new collectible.grapesDeclined DSL support). **10 ship** — two CUT on §29 Law 5 doctrine (an achievement is the forbidden gold star for compassion); DQ-4 for Ryan.
- **Code-split**: entry 188 kB (was 595 kB) — pixi/react/howler/content chunks.
- **Tauri 2 scaffold complete**: src-tauri/ (Cargo.toml, tauri.conf.json with fs scope $APPDATA/saves/*, main.rs, build.rs), npm run tauri:build, TauriFsStorage (dynamic import, selected only under __TAURI_INTERNALS__) — **the last engine STUB is retired**. Native build blocked ONLY on Rust not being installed on this box (verifier confirmed cargo absent).
- Backlog closed: sidestories.test.ts + julian_read_it coverage (5 tests), weather.ts on engine Rng, ConditionShape type alignment.

### gg-content-reviewer verdict
**LGTM** (after 1 round — 7 gaps, all fixed and independently re-verified): grapes_declined_23 wrong condition -> real tally; kept_promises + held_the_page cut per Law 5 ruling; "Truth With Compassion" achievement retitled "The Waiting Is Over" (3x-only rarity law respected); Archie notes de-invented (no grandmother lineage, Edmund's eleven words stay his, "kid"->"son", §28.3 seed ambiguity preserved).

### gg-verifier verdict (evidence summary)
**FAIL then PASS.** The RC hand-drive caught a genuine ship-blocker no automated gate covered: SettingsPanel (z-50) rendered under TitleScreen (z-60) — every control click intercepted, no Escape, and no in-game entry point existed. Fixed (z-70 + Escape + HUD gear) and the verifier's exact reproduction is now a permanent e2e test. Final: validator 0 errors/5 by-design warnings; 68/68 tests; autoplay full-game 595 lines deterministic x2; curious sweep clean; build clean (chunk table verified); e2e 5/5; Cut List sweep clean (no trust numbers anywhere incl. stats); save-shape lockdown (types.ts diff empty, GAME_STATE_VERSION 2); stub grep = exactly one honest forward-stub (STUB(steam) in achievements.ts, unlock call only).

### Ship notes for Ryan (the RC handoff)
1. **Native build**: install Rust (winget install Rustlang.Rustup, then rustup default stable), then `npm run tauri:build` — everything else is in place and verified to the limit of a cargo-less box. Output lands in src-tauri/target/release/bundle/ (msi + nsis).
2. **Steam depot layout** (spec §13): depot = the bundle output; achievements sync needs steamworks.js wired at the STUB(steam) call site in app/src/systems/achievements.ts with the 10 achievement ids from content/achievements.json; grapes_declined_23 and any future hidden ones should be marked hidden in Steamworks too.
3. **Art**: 386 placeholders are the asset contract — filenames + sizes in assets/ are the drop-in targets; gen:placeholders never overwrites a real file.
4. **Decisions waiting**: DQ-1 (spec/doc version), DQ-2 (board-picker pitch), DQ-3 (three side-story interactive centerpieces), DQ-4 (the two Law-5 achievements).
5. Cleanup nits, non-blocking: gallery_carryover flag is written but unread; ed_d1..d7 could carry per-day vox pools.

### Project status: ALL PHASES 0–7 COMPLETE
Full game playable boot->credits in the browser (npm run dev), deterministic, gated, canon-reviewed. 46 dialogues, 61 cards, 18 deductions, 7 editions, 9 side stories, 10 achievements, 9 puzzle modules, 4 save-tested days x 7 playable days.

### Addendum 2026-07-03 (morning) — Native build VERIFIED
Rust + MSVC Build Tools installed by Ryan. Two packaging fixes landed: productName colon (Windows filename rule) and the startup panic (v1-style plugins.fs.scope -> Tauri 2 capabilities/default.json scoped to $APPDATA/saves). Placeholder icon generated (tools/gen-icon.ts — lantern in ivy, wax drips). **Evidence: release gary-gibbons.exe (4.6 MB) alive 10s+ and closed cleanly; bundles produced: msi (2.8 MB) + nsis setup (2.3 MB) under src-tauri/target/release/bundle/. The game is now a shippable Windows app.**

---

## 2026-07-04 — PLAYTEST REVISION ROUND 1 — DONE (canon changes, Ryan-directed)

Source: Ryan playtest directive 2026-07-04. Logged as **DQ-5 + DQ-6, both RESOLVED** in design-questions.md.

### Revision 1 — Interview presentation (replaces walk-to-talk)
Conversations are no longer spatial. Talk-clicks (mouse and keyboard) enter INTERVIEW MODE immediately from anywhere in the room - composed close-up two-shot (NPC portrait left, Gary mirrored right) over the current location's phase-correct art, blurred + ink-washed; the speaker leans in (opacity + scale), emotes track dialogue data; fade/soft-zoom entry honors reduce-motion; exit restores the scene exactly (Gary never moved; clock untouched). Narrator set-pieces stay full-scene; ambient greetings/vox pops stay in-scene. DialogueBox suppresses its thumbnail during interviews. Walking remains for traversal + examinables only.

### Revision 2 — Board legibility (tutorial + visible recipes)
(a) NIGHT 1 BOARD TUTORIAL - first board open ever, Gary teaches pin -> string -> click in his own voice (8 aletheia lines, board_tutorial pool), performed FOR REAL on the Red Pen Bandit; action steps advance by watching game state; skippable at every step; words-only degradation if the tutorial cards are missing; completion flag persists in saves.
(b) OPEN QUESTIONS strip - index cards along the board's bottom edge: 15 authored recipe questions in Gary's words (schema gains optional `question`), silhouette input slots (empty / pencil-needs-verifying / ready), tonight's gate starred and sorted first, non-gate questions appear once partially owned, retire when the story clicks. The 3 aha recipes carry no question and never surface - surprises stay surprises. Wrong pairs keep sag + bark and now pulse the strip with Gary's glance line. Ask-Grandpa gating unchanged.

### gg-content-reviewer verdict
**LGTM** (after 1 round - 3 gaps, all fixed and independently re-verified in the diff): invented Archie board-ownership lore removed from tut_sit + Board header (only the sanctioned "Grandpa always said: X" device remains); "kid" -> "son" in the quoted Grandpa line per the standing address-term ruling; d5_lodger's question no longer leaks the 2 a.m. hour that belongs to Milo's Day 6 disclosure. Note for Ryan: read tut_sit aloud once for rhythm ("Time to see one.").

### gg-verifier verdict (evidence summary)
**PASS** - validator 0 errors/5 known warnings (11 bark pools); 70/70 tests (2 new open-questions cases); autoplay 595 lines deterministic x2 (unchanged - diff provably touches no autoplay-driven path); curious sweep clean; build clean; e2e 5/5 including the rewritten ceremony test that plays Night 1 unaided through the tutorial. HAND-DRIVE: clicked Milo from 590px away - interview mode in <200ms, before/after screenshots pixel-identical on Gary's position, clock string-equal, keyboard path identical; tutorial soft-lock impossible (skip rendered on every step, words-only fallback, flag via runEffects); engine/save layer untouched (no migration needed); ID freeze additive-only; Math.random clean; Cut List clean.

### Acceptance vs. directive
- Start a conversation from anywhere / no pathing / clean enter+exit / scene+time preserved: verified by hand-drive and e2e.
- First-time player completes Night 1 unaided: the ceremony e2e now does exactly this (tutorial cycle on red pens, then D1 via the starred open question).
- Autoplayer passes, validator green, reviewer LGTM, verifier PASS: all above.

### Addendum 2026-07-06 — Playtest hotfixes + first-person exploration (DQ-7)
- BUG (found by Ryan, missed by e2e): InterviewMode (z-30) painted OVER the un-z-indexed DialogueBox - text invisible, conversation looked locked (clicks still worked underneath, which is why Playwright stayed green: toBeVisible doesn't test occlusion). Fix: DialogueBox z-35. Lesson: visibility assertions don't catch paint-order regressions.
- BUG: Gary's interview portrait was mirrored (-scale-x-100), flipping baked-in detail in the real art. Mirroring removed; interview backdrop got a solid dusk backing so placeholder transparency can't leak the scene through.
- CANON (DQ-7 RESOLVED): first-person exploration - Gary never drawn, nothing walks, interactions immediate, hotspot labels on hover/keyboard focus. Walk-line data stays (NPC placement) but drives no movement.
- Gates: build clean, 70/70 tests, autoplay 595 deterministic x2, e2e 5/5.
