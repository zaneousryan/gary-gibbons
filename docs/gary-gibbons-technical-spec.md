# GARY GIBBONS: The Empty Capsule
# Technical & Structural Specification — v1.0
### Companion to design doc v1.2 (Parts I–III). Implemented by agent Aletheia. Assets by Ryan.

---

## 1. WHAT WE ARE BUILDING

A data-driven 2D point-and-click mystery adventure platform. One executable "engine" + a `/content` folder that IS the game. Target: 7–9 hour single-player experience, offline, desktop-first (Steam/itch via Tauri), web build for playtesting.

**The platform must support, as first-class systems (design doc references in parens):**
- Location scenes with hotspots, observable details, NPCs on schedules (I.2, II.14, III.24)
- Dialogue with interview stances PRESS/EMPATHIZE/OBSERVE and COLD/PRIMED entries (II.12.1, III.20)
- Evidence **cards** with states: unverified / verified / off-record (II.12.6, III.23.1)
- The **Investigation Board**: pins, strings, deduction recipes, Timeline Rail, Suspect Ledger, Theory Cards, Contradiction Desk (I.6, II.16)
- The **Reporter's Notebook**: auto-journal, Morning Pages, questions, tear-out-and-pin (II.15.3, III.26)
- The **Evening Edition**: nightly headline choice, trust effects, town reactions (II.15.1)
- Day/phase clock (7 days × morning/midday/evening/night), gated by deductions (I.5)
- Verification routes, the Discovery Web (multiple paths per fact) (III.21)
- Living town: schedules, weather routing, ambient vignettes, evolving rhyme, rumor system (II.14, III.27)
- Sketch-from-memory, photo mode + then&now overlay, trace-following, torn-letter reconstruction (II.12.2–12.4, III.25)
- Ask-Grandpa hints, trust-flavored greetings, side stories, collectibles, NG+ commentary (II passim)

---

## 2. STACK & RATIONALE (locked)

**TypeScript + React 19 + PixiJS 8 + Zustand + Zod + Howler + Vite + Tauri 2.**

Why not Godot/Unity: this game is ~70% UI (board, notebook, newspaper, dialogue) and ~30% scene traversal. Web tech makes the UI systems trivial to build and iterate with Claude Code, matches Ryan's daily stack, gives instant hot-reload playtesting, and Tauri produces small native builds for Steam. PixiJS handles the scene layer (parallax, actors, hotspots) with plenty of headroom for a 2D lamplit art style. All content is JSON — the format Claude Code authors best and validators check best.

Rendering split rule: **the world is Pixi; the paper is React.** Locations, characters, and in-world effects render in a Pixi canvas. Everything Gary holds or reads — notebook, board, newspaper, photos, sketches — renders as React DOM layered above, allowing rich text, drag-and-drop, and accessibility for free.

---

## 3. RUNTIME ARCHITECTURE

```
┌────────────────────────────────────────────────────┐
│ React App Shell                                     │
│  ┌───────────────┐  ┌────────────────────────────┐ │
│  │ Pixi Stage     │  │ UI Overlays (React)        │ │
│  │ SceneRenderer  │  │ DialogueBox · Notebook     │ │
│  │ Actors/Hotspots│  │ Board · Newspaper · HUD    │ │
│  └───────┬───────┘  └──────────┬─────────────────┘ │
│          │      commands/queries│                   │
│  ┌───────▼──────────────────────▼────────────────┐ │
│  │ GameStore (Zustand slices)                     │ │
│  │ flags · cards · board · clock · trust · saves  │ │
│  └───────┬───────────────────────────────────────┘ │
│  ┌───────▼───────────────────────────────────────┐ │
│  │ Engine services                                │ │
│  │ ConditionEval · EventBus · Scheduler · RNG     │ │
│  │ SaveService · HintService · AudioService       │ │
│  └───────┬───────────────────────────────────────┘ │
│  ┌───────▼───────────────────────────────────────┐ │
│  │ ContentDB (Zod-validated, immutable at boot)   │ │
│  └────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

**One-way rule:** ContentDB is read-only truth about *what the game is*; GameStore is the only truth about *what has happened*. Systems consume both, mutate only GameStore, and communicate via EventBus events (`card:gained`, `deduction:unlocked`, `phase:changed`, `edition:published`, `trust:changed`, `flag:set`).

---

## 4. ENGINE CORE

### 4.1 GameState (persisted shape, versioned)
```ts
interface GameState {
  version: number;
  day: 1|2|3|4|5|6|7;
  phase: 'morning'|'midday'|'evening'|'night';
  location: LocationId;
  flags: Record<FlagId, boolean|number|string>;
  cards: Record<CardId, CardState>;        // owned cards + their status
  board: BoardState;                        // pins, strings, rail, ledger, theories
  notebook: NotebookState;                  // entries, questions, tornOut, doodles
  trust: Record<CharacterId, number>;       // -3..+3, never shown as a number
  editions: PublishedEdition[];             // one per night
  weather: 'clear'|'rain';
  rngSeed: number;
  collectibles: { lanterns: string[]; doodles: string[]; clippings: string[]; grapesDeclined: number };
  ngPlus: boolean;
  meta: { playtimeSec: number; savedAt: string };
}
interface CardState {
  status: 'unverified'|'verified'|'offrecord';
  discoveredVia: PathId;                    // which Discovery Web path fired first
  readCount: number;                        // powers re-read lines (III.27)
}
```

### 4.2 Condition DSL (used by ALL content)
Every conditional field in content uses one grammar, evaluated by `ConditionEval`:
```json
{ "all": [
    { "flag": "met_poppy" },
    { "card": "seal_sketch", "status": "verified" },
    { "day": { "gte": 3 } },
    { "phase": "evening" },
    { "trust": { "char": "margie", "gte": 1 } },
    { "not": { "flag": "printed_sensational_d4" } },
    { "any": [ { "weather": "rain" }, { "flag": "sidestory_otto_done" } ] }
] }
```
Empty condition = always true. The validator type-checks every referenced ID.

### 4.3 Effects DSL (what content can DO)
```json
[ { "setFlag": "knows_two_keys" },
  { "giveCard": "idas_ledger", "status": "verified" },
  { "verify": "milos_sighting" },
  { "trust": { "char": "clara", "delta": 1 } },
  { "unlockDialogue": "clara_c3_primed" },
  { "notebook": { "question": "q_why_two_keys" } },
  { "playBark": "gary_inner_two_keys" },
  { "startSidestory": "unclaimed_key" } ]
```

### 4.4 Clock & Gates
`game.json` defines the day/phase graph. Phase transitions: morning→midday→evening auto-advance on core-clue completion or player choice at a sit-spot; evening→night triggers the going-home beat (I.5 "Send Them Home"); night→next-morning requires that day's `gateDeductions` (I.6 table) plus the Evening Edition publish step. Nights are unskippable; days are internally free-order (III.27).

### 4.5 Save System
- Autosave at every phase transition + manual save at the apartment.
- Save = `GameState` JSON, ~50KB, stored via Tauri fs (desktop) / localStorage (web dev).
- `migrations.ts`: ordered version upgraders. Content IDs are save-referenced → ID stability rule (ALETHEIA.md §7).

---

## 5. CONTENT SCHEMAS (the game lives here)

All schemas defined in Zod (`src/content/schemas/`), one JSON file family per type. Every required-path object carries `"ref"` (design-doc traceability) and stable snake_case IDs.

### 5.1 `characters/*.json`
```json
{ "id": "poppy", "name": "Poppy Finch", "ref": "I.4",
  "portraitSet": "poppy",            // asset key, see §10
  "voice": { "textSpeed": 1.2, "blipSound": "blip_poppy" },
  "greetings": {                      // trust-flavored (III.23.3)
    "cold": "Mr. Gibbons.", "neutral": "Oh! Mr. Gibbons, hello—",
    "warm": "Gary! I laminated you a schedule!" },
  "tells": [ { "id": "fogged_glasses", "cond": {"flag":"poppy_nervous"},
               "observeLine": "dlg:poppy_observe_glasses" } ],
  "etiquette": { "note": "accepts questions only after clipboard is down" } }
```

### 5.2 `locations/*.json`
```json
{ "id": "founders_square", "name": "Founders' Square", "ref": "I.2",
  "layers": ["bg","mid","fg"],       // parallax planes, asset keys §10
  "exits": [ {"to":"market_row","at":[1720,540]} ],
  "sitSpot": { "at":[400,700], "monologues":[ {"cond":{"day":{"gte":5}},"bark":"bench_sq_late"} ] },
  "hotspots": [
    { "id":"vault", "poly":[[900,600],[1100,600],[1100,760],[900,760]],
      "kind":"examine", "interactions":[
        { "id":"dust_library", "cond":{"day":{"gte":2}},
          "opens":"puzzle:dust_library", "ref":"II.13.1" },
        { "id":"wax_scrapings", "cond":{"flag":"dust_library_done"},
          "effects":[{"giveCard":"wax_scrapings"}], "ref":"II.12.4" } ] },
    { "id":"founding_portrait_view", "kind":"chekhov", "ref":"III.24",
      "detail":{"tier":"clue","card":"portrait_two_keys","cond":{"day":{"gte":1}}} } ],
  "ambient": { "vignetteTags":["square"], "weatherVariants":true } }
```
**Hotspot kinds:** `examine` (observe text/card), `chekhov` (detail-layer, III.24 tiers texture/character/clue), `talk` (routes to scheduled NPC), `puzzle` (opens a puzzle module), `exit`, `photo` (valid camera subject).

### 5.3 `dialogue/*.dlg.json` — node graph
```json
{ "id": "poppy_c2", "character": "poppy", "ref": "I.5.day2",
  "entries": [
    { "id":"primed", "cond":{"all":[{"card":"dust_sketch"},{"flag":"examined_key_hook"}]}, "node":"p1" },
    { "id":"cold", "cond":{}, "node":"c1" } ],
  "nodes": {
    "c1": { "speaker":"poppy", "line":"Mr. Gibbons! If this is about the bunting…",
            "next":"c2" },
    "c2": { "speaker":"gary", "stances": {
              "press":     { "line":"It's about the key, Poppy.", "next":"c3" },
              "empathize": { "line":"First big event. How are you holding up?", "next":"c3e" },
              "observe":   { "cond":{"flag":"noticed_fogged_glasses"},
                             "line":"Your glasses fog when I say 'key'.", "next":"c3o" } } },
    "c3": { "speaker":"poppy", "line":"...Which key.", "effects":[{"setFlag":"poppy_nervous"}],
            "next":"confession" },
    "confession": { "speaker":"poppy", "line":"…I laminate my alibis.",
            "effects":[ {"giveCard":"poppys_checklist","status":"verified"},
                        {"notebook":{"entry":"nb_poppy_confess"}} ],
            "authored":"verbatim", "next":null } } }
```
Rules: `stances` node = interview beat (II.12.1); plain nodes = normal talk. `offRecord: true` on an effects-giving node marks resulting cards off-record (III.23.1). `oncePerDay`, `repeatBark` supported. Choice nodes (non-stance) use `choices:[{line,next,cond,effects}]` — used for headline picks, Milo attribution (III.23.2), etc.

### 5.4 `cards/*.json`
```json
{ "id":"milos_sighting", "ref":"I.5.day6", "type":"testimony",
  "title":"Milo saw the umbrella — 2 a.m.",
  "sprite":"card_milo_sighting", "source":"milo",
  "initialStatus":"unverified",
  "verifyRoutes":[
    { "id":"sightline", "ref":"III.20", "cond":{"flag":"fire_escape_puzzle_done"} },
    { "id":"voxpop_umbrella", "cond":{"flag":"voxpop_d5_umbrella"} } ],
  "attribution":{ "protectable":true, "namedFlag":"named_milo" },
  "reReadLines":[ {"cond":{"day":{"gte":7}},"bark":"reread_milo_after"} ] }
```
**Card types:** `testimony`, `physical`, `document`, `photo`, `sketch`, `question`, `theory`, `deduction`, `event` (timeline rail).

### 5.5 `deductions.json` — the recipe graph (I.6 table + II.16 + III.22)
```json
{ "deductions":[
  { "id":"D9_means", "ref":"I.6.D9", "kind":"standard",
    "inputs":["clara_key_missing","idas_ledger"],
    "requireVerified":true, "requireOnRecordForFinale":true,
    "produces":{ "card":"ded_means", "ledgerCell":{"suspect":"julian","col":"means"} },
    "garyLine":"bark_ded_means" },
  { "id":"AHA_direction", "ref":"III.22.1", "kind":"aha",
    "inputs":["photo_triangulation_result","milos_sighting"],
    "produces":{ "card":"ded_toward_river", "railFlip":"ev_crossing", "mapMark":"boathouse_q" },
    "cinematic":"aha_direction_flip" } ],
 "wrongPairBarks":"barks/wrong_pairs.json",
 "theories":[ {"id":"th_outsider","retireWhen":{"card":"ded_careful_hands"}} ],
 "contradictions":[ {"id":"cx_two_keys","pair":["ferris_testimony","poppy_only_key"],
                     "producesQuestion":"q_second_key","ref":"II.16.4"} ] }
```
The **validator** proves: every gate deduction reachable from guaranteed paths only; off-record cards never sole inputs to `requireOnRecordForFinale` deductions; every input card obtainable by its gate day.

### 5.6 `timeline.json` — rail slots NIGHT−5→CEREMONY, event cards with `anchor` conditions (II.16.1), the composite overlay pair (III.22.5).

### 5.7 `schedules.json` — placement table
```json
{ "poppy": { "d2": { "morning":{"loc":"founders_square","spot":"stage"},
                     "midday":{"loc":"council_hall"},
                     "evening":{"loc":"percolator","ifRain":"drowsy_lantern"} } } }
```
Validator rule (II.14.1): every required conversation's NPC reachable in ≥2 phases of its day.

### 5.8 `editions/*.json` — per night: auto-draft blocks (from verified cards), 3 headlines with `tone: sensational|measured|compassionate`, kicker options, `effects` (trust deltas, next-day bark packs, chalkboard line, rumor seed). Day 6 includes the `hold_the_page` option; Day 4 includes the Ferris special case (II.15.1).

### 5.9 `sidestories/*.json` — step lists with conds/effects, own mini-edition, `trustFloor` targets (III.23.3).

### 5.10 `barks/*.json` — keyed line pools: ambient vignettes (tags, day ranges, weather), wrong-string lines (≥40), re-read lines, skipping rhymes per day, rumor lines per current-town-theory, grape beats, grandpa memories.

### 5.11 `hints.json` — per stuck-gate: ordered Ask-Grandpa lines (name a node, never a pair — II.6).

---

## 6. SYSTEM SPECS

### 6.1 DialogueSystem
Runs `.dlg.json` graphs. Responsibilities: entry selection (PRIMED-first order), stance UI (three buttons; OBSERVE disabled-with-tooltip until its cond passes; PRESS gets the "wilt" animation flag in Beatrice scenes), typewriter text with per-character blips, effects execution, off-record UI badge, auto-notebook entries. Emits `dialogue:ended` with node path for autoplayer assertions.

### 6.2 BoardSystem (the flagship — budget accordingly)
Sub-modules:
- **PinCanvas:** free placement of owned cards on cork; zoom/pan; 60-pin perf target.
- **Strings:** drag card→card. Match against `deductions.inputs` (order-free, supersets allowed if all inputs present among selection ≤3). Hit → gold flash, deduction card typewriters in, chair-spin trigger. Miss → sag animation + wrong-pair bark (never repeat within session).
- **TimelineRail:** slot row; event cards seat only when `anchor` cond true; final-seat triggers the Night-6 silent chronology cinematic (II.16.1) and any `railFlip` (III.22.1).
- **SuspectLedger:** grid drag-targets; row-complete → CLEARED stamp interaction + line.
- **TheoryRack:** face-up theory cards; retire interaction enabled when `retireWhen` passes → DIDN'T HOLD stamp → graveyard edge strip.
- **ContradictionDesk:** blotter drop-zone for exactly 2 testimony cards; overlap render; produces question cards.
- **Off-record enforcement:** string refusal + "promised" overlay (III.23.1).
Board state fully serialized (pin positions included — the player's mess is theirs).

### 6.3 NotebookSystem
Tabs PEOPLE/PLACES/QUESTIONS (+hidden GRAPES tab unlock D4). Auto-entries from dialogue/effects; Morning Pages modal (pick 3 of ~6 questions → sets voxpop topic + PRIMED weights); tear-out interaction moves a page entity to board inventory, leaves stub; doodle collection; NG+ Archie margin notes (25 authored anchors).

### 6.4 VerificationSystem
Watches flags/cards; when any `verifyRoutes` cond passes → status upgrade + CONFIRMED-G.G. stamp toast (*thock* sfx). Exposes `whyUnverified(cardId)` for UI ("needs: a document, a witness, or your own eyes").

### 6.5 EditionSystem
Night flow: draft assembly (verified, on-record cards only — Dot's law), headline choice, kicker choice, print animation, apply effects, archive to gallery. Attribution sub-step when a protectable card is in the draft (III.23.2) — plain choice, zero UI ceremony.

### 6.6 Scheduler & LivingTown
Places NPC actors per `schedules.json` + weather; runs vignette selector (proximity, tags, no same-day repeats); maintains `townTheory` state fed by editions/events → drives rumor bark pool, rhyme selection, chalkboard line.

### 6.7 PuzzleModules (each a self-contained React overlay, common contract: `open(id) → resolve(effects)`)
`dust_library` (void-matching against checklist), `sketch_memory` (part-assembly with graded accuracy, II.12.2), `then_now` (photo ghost-overlay alignment), `photo_triangulation` (viewfinder match, III.25.2), `fire_escape_sightline` (III.20 showpiece), `torn_letter` (handwriting-flow assembly, III.25.1), `trace_follow` (in-scene highlight-path mode, not an overlay), `handwriting_match` (3-feature comparison), `map_overlay` (survey ghost map). No generic minigame framework — nine bespoke small modules sharing only the contract.

### 6.8 Trust, Hints, Weather, Audio
- Trust: int −3..+3 per NPC; surfaces ONLY via greeting tier + line variants; side-story completion sets `floor=+1`.
- HintService: stall timer per unmet gate (4 min) → badge glint → Ask Grandpa modal, ordered hints.
- Weather: scheduled rain D5-midday + one seeded random chance/day; swaps location variant layers + reroutes schedule `ifRain`.
- Audio: Howler channels (music/ambient/sfx/blips); night triptych stingers (kettle→typewriter→board); the *thock*.

---

## 7. SCENES & INTERACTION (Pixi)

- Side-view 2.5D rooms, 1920×1080 design resolution, 3 parallax layers per location.
- Gary: point-to-walk on a walk-line (1D path with depth scaling — no navmesh needed for this game's rooms).
- Hotspot highlight on proximity + "look" key (accessibility: tab-cycle hotspots).
- Actors from portraitSet idle sprites + 2-frame talk cycles (asset spec §10); schedule-driven placement.
- Photo mode: viewfinder overlay, subjects = `photo` hotspots + lantern collectibles; prints appear at apartment next night.
- Day-phase tint LUTs (morning/midday/evening/night) + rain particle layer.

---

## 8. UI / SCREENS

Title → Save slots → Game. In-game HUD: location name, day/phase dial, notebook button, (from D3) camera button; board accessible only at apartment (fiction) except read-only "pocket recap" of deduction cards. Full-screen overlays: Notebook, Board (night), Newspaper (edition + gallery), Morning Pages, Puzzles, Photo viewer. Dev menu (`~`): scene jump, flag/card editor, phase skip, weather toggle, autoplay-to-here.
Settings: text size, text speed, volume mix, colorblind string patterns, reduce-motion, key rebind, language scaffold (strings all in content — localizable by construction).

---

## 9. NG+ & POST-GAME
NG+ flag unlocks Archie margin notes + Edition Gallery carryover + stats screen (incl. `grapesDeclined`, no fanfare). Post-game free-roam: Day 7-evening state with post-beat lines, collectible completion, STORIES-THAT-GOT-AWAY drawer if clippings complete.

---

## 10. ASSET PIPELINE & NAMING (Ryan's generation contract)

All assets PNG (art) / OGG (audio), dropped into `/assets`; engine hot-reloads in dev. **Placeholders auto-generated for every key the content references** — missing art never blocks.

```
assets/
├── characters/{charId}/
│   ├── portrait_{neutral|happy|worried|surprised|sad}.png   (800×1000)
│   ├── sprite_idle_{1..2}.png  sprite_talk_{1..2}.png       (400×600)
├── locations/{locId}/
│   ├── {phase}_{bg|mid|fg}.png        (2400×1200; phase ∈ morning|midday|evening|night)
│   └── rain_{bg|mid|fg}.png           (optional variants)
├── board/
│   ├── card_{cardId}.png              (500×350, sketch style)
│   ├── cork.png  string_red.png  string_gold.png  stamps_{cleared|didnthold|confirmed}.png
├── notebook/  paper.png  doodle_{id}.png  handwriting font: fonts/gary.ttf
├── newspaper/ masthead.png  paper_texture.png
├── props/ prop_{id}.png  evidence_{id}_closeup.png   (clue props ship twice — see Art Bible Export Rule 3)
├── ui/ …
└── audio/ music_{id}.ogg  amb_{id}.ogg  sfx_{id}.ogg  blip_{charId}.ogg
```
Generation note: the design doc §9 prompts map 1:1 — character prompts → portrait sets; location prompts → per-phase layer sets (generate wide, slice layers); prop/UI prompts → board/props. Keep the STYLE ANCHOR constant; filenames above are the contract.

---

## 11. TESTING & TOOLING

- **validate-content** (CI-blocking): schema pass; ID reference integrity; Discovery Web reachability (every gate deduction satisfiable via guaranteed paths only, by its day); off-record/finale rule; schedule reachability rule; `ref` presence on required path; orphan flag/card report.
- **autoplay** (CI-blocking): headless engine run executing the guaranteed path Day 1→credits via content graph (no rendering); asserts all gates open and finale reachable; seeded, deterministic. Second mode: "curious run" exercising all optional paths for crash coverage.
- **Vitest:** ConditionEval, effects, deduction matcher, save migrations, scheduler.
- **Playwright smoke:** boot, walk, talk, pin, string, save/reload, print an edition.

---

## 12. BUILD PHASES (one Claude Code prompt cycle each)

| Phase | Deliverable | Exit criteria |
|---|---|---|
| **0 — Foundation** | Repo scaffold, schemas, loader, engine core (flags/conditions/effects/clock/save), validator, placeholder gen, seed content | Boot→walk→talk→save→reload; validator green |
| **1 — World & Words** | SceneRenderer full (layers, hotspots, actors, walk), DialogueSystem full (stances, entries, off-record), NotebookSystem core, Scheduler v1 | Day 1 playable through ceremony w/ placeholders |
| **2 — The Board** | BoardSystem all sub-modules, deduction graph, night loop, gates, HintService | Day 1 night + Day 2 gate loop complete; autoplay D1→D2 |
| **3 — The Reporter** | VerificationSystem, EditionSystem, trust/greetings, Morning Pages, vox pop | Full daily loop (morning pages→…→edition→board→sleep) |
| **4 — Vertical Slice: Day 2** | Dust Library + sketch_memory puzzles, all Day 2 content (COLD+PRIMED), grape beat, grandpa beat, audio pass 1 | Day 2 ships complete; playtest build #1 |
| **5 — Systems Completion** | Remaining 7 puzzle modules, photo mode, weather, rumor system, timeline rail cinematic, contradiction desk content | All systems exist; Days 3–4 content |
| **6 — Content Production** | Days 5–7 full content, all side stories, barks/vignettes/rhymes, seeds (III.28), finale + credits sequence | autoplay full game; "curious run" clean |
| **7 — Polish & Ship** | Asset integration, accessibility pass, settings, NG+, Tauri packaging, Steam depot layout, save migration lockdown | RC build |

---

## 13. STEAM & DISTRIBUTION NOTES (PC/web only — no console targets)

- **Targets:** Windows + macOS + Linux via Tauri; web build (Vite static) for itch.io demos and playtest links. Console is explicitly out of scope — do not spend architecture on it.
- **Steamworks integration (Phase 7):** use `steamworks.js` (Node bindings, works in Tauri) behind a thin `PlatformService` interface with a no-op web fallback, so the same build code runs everywhere. Scope: achievements, cloud saves (save JSON is small — trivial to sync), rich presence ("Day 4 — Night, at the board"). Nothing else.
- **Achievements are content:** define them in `content/achievements.json` with the same condition DSL (e.g., `{"flag":"held_the_page_d6"}`, `{"collectible":{"lanterns":47}}`, the hidden `grapes_declined_23`). Validator checks them like everything else.
- **Steam Deck:** treat as a first-class PC target — full controller navigation (already an accessibility floor), 1280×800 UI verification pass, and Proton-friendly Tauri build settings. Verified badge is a realistic Phase 7 goal.
- **Demo strategy:** the Phase 4 Day 2 vertical slice doubles as the Steam Next Fest / itch demo — build a `DEMO` content flag that ends gracefully at Night 2 with a wishlist card.

## 14. RISKS & MITIGATIONS
- **Board perf at 60 pins** → test with generated pins in Phase 2; virtualize strings if needed.
- **Content volume (Days 5–7)** → the schemas + validator are the safety net; transcribe in location-sized batches; `authored:"aletheia"` tags keep review tractable.
- **Puzzle feel** → each module gets a dev-menu instant-launch for isolated tuning.
- **ID churn breaking saves** → ID freeze after Phase 2 + migrations.

---

*This spec plus design doc v1.2 is the complete build contract. Aletheia builds the machine; the content folder is the town; Ryan brings the lamplight.*
