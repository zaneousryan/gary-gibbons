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
- Project subagent types not registered with the session's Agent tool; reviewer/verifier dispatched via general-purpose agents bound to the .claude/agents/*.md charters — same effect.
