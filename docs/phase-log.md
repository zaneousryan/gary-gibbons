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
