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
