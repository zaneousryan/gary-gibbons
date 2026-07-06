# Board & Clue-Flow Rework — Two Full Options

**Status: PROPOSAL — for discussion with Ryan. Nothing here is implemented.**
Source: Ryan playtest feedback 2026-07-06. Logged as DQ-8.

## The problems being solved

1. **Invisible discovery.** Players finish a conversation not knowing they found anything. A card lands in state silently; there is no moment of "I got something."
2. **The board is abstract furniture.** Cork + string + four sidebar tabs (ledger/theories/desk/rail) is a lot of un-diegetic UI. The Open Questions strip helped strings, but the desk and rail read as empty machinery (Ryan, 2026-07-06: "The rail and the desk don't make sense").
3. **Alignment with the new presentation.** Interview mode (DQ-5), first-person exploration (DQ-7), and the painted-overlay scene direction all point at a *click-and-find discovery game*. The clue pipeline should feel like part of that world, not a systems menu.

Both options below solve #1 the same way at the moment of discovery and then diverge completely on what "the board" is. Both keep the existing data layer (cards, deductions, verify routes, off-record rules) — these are re-skins of the *verbs*, not the mystery graph. That's deliberate: content is done and canon; presentation is what playtesting is challenging.

---

# OPTION A — "The Front Page" (the notebook is the board)

*One sentence: kill the cork board; Gary's reporter notebook captures clues live in conversation, and each night the player literally lays out tomorrow's front page — deductions ARE the stories being typeset.*

## A1. Discovery: the Notation Moment

When a line in conversation carries a clue (any `giveCard` / notebook effect):

- The line finishes typing, then **holds** for a beat. The clue phrase inside it highlights amber, as if underlined by hand.
- Gary's notebook slides up from the bottom-left, open. His pen writes a two-to-four-word summary in visible handwriting ("*second key — MISSING*"), with a pen-scratch sound. ~1.5s, skippable by click.
- A small stamp appears on the page: **☑ NOTED**, plus the card's type glyph (testimony ✎, physical ◆, event ●, off-record 🔒 in plum with "promised" instead of NOTED).
- The HUD notebook button gets a badge count that persists until the notebook is opened.
- OPTIONAL ACTIVE LAYER (recommended): the player can click the highlighted phrase *before* Gary finishes writing to "circle it" themselves — purely cosmetic reward (the entry gets a hand-drawn circle and a margin doodle). Trains the eye to watch for highlights without punishing anyone who misses it.

Off-record moments invert the color scheme (plum wash, pen writes then Gary draws a lock over it) — teaching III.23.1 visually at the moment it happens.

## A2. The nightly loop: Layout Night

The board screen is replaced by **the layout desk at the Ledger** — a paste-up table with tomorrow's front page as a live mock:

- **Story frames** replace deduction recipes. Each pending deduction renders as an empty column on the page mock with its question as a placeholder headline in Gary's pencil ("WHO HAD A KEY?") and die-cut slots showing how many facts the story needs (the Open Questions strip, matured into the core mechanic).
- The player drags notebook entries (not cards — the same data, presented as torn notebook strips) into a frame's slots. Wrong strips physically don't fit — the slot shakes, Gary murmurs a wrong-pair bark. Right combination: the strip **typesets** — handwriting becomes print with a satisfying letterpress *thunk*, the headline inks in, and the deduction fires. That typeset moment is the new gold string.
- **Unverified strips are in pencil** and the frame refuses them with the existing line ("confirm it before it can hold a deduction") — verification status becomes literally visible as pencil vs. ink.
- **Off-record strips can be READ at the desk but never placed** — they're paper-clipped to the inside cover, marked "promised."

## A3. Where the four tabs go

- **Suspect ledger** → the page's masthead sidebar: portrait thumbnails with MOTIVE/MEANS/OPPORTUNITY as three under-portrait checkboxes that ink in. CLEARED prints a diagonal overstamp. Same data, zero new UI ideas to learn.
- **Theories** → "Standing corrections" box on page 2: one line each, stamped DIDN'T HOLD when retired.
- **Contradiction desk** → **the fact-check spike.** Two testimony strips can be spiked together; if they can't both be true, the overlap prints in red with a "?" pulled into the notebook's questions page. Diegetic name: "Check it twice — Archie's rule."
- **Timeline rail** → **the WEEK IN REVIEW column**: four dated column slots; event strips drop in only when an anchoring fact exists (same seating rule). Completing it on Night 6 prints the column and plays the existing silent cinematic as a press run.

## A4. Tutorial fit

Night 1: Dot hands Gary the layout frame for the Red Pen Bandit as a "practice page" — the existing tutorial script ports nearly line-for-line ("pin what you learned" → "get it on the page").

## A5. Costs, risks, keeps

- **Kept:** every card, deduction, verify route, hint, bark, edition system, all content. The matcher (`connectCards`) is untouched — only its trigger UI changes. Editions/Morning Pages already use newspaper fiction, so the metaphor UNIFIES the game: find by day, print by night.
- **Cost: HIGH.** Full replacement of Board.tsx (the largest UI surface) + the Notation Moment layer in DialogueBox + notebook-strip inventory presentation. Estimate: the biggest single UI build of the project, comparable to Phase 2.
- **Risks:** (1) The tactile cork/string fantasy — some players love string; we'd be deleting an entire genre signifier. (2) Drag-and-drop precision on small slots needs careful hitboxes. (3) The newspaper metaphor is already used for editions — front-page-as-board must be visually distinct from the Evening Edition chooser or players will conflate them.
- **Why pick A:** strongest thematic unity (you are a REPORTER; your board is a PAGE), best answer to "the desk and rail don't make sense" (they become newspaper furniture everyone recognizes), and the Notation Moment doubles as the discovery fix.

---

# OPTION B — "The Evidence Wall, Physicalized" (keep the cork, make it real)

*One sentence: keep the corkboard fantasy but make every step physical and visible — clues visibly fly into Gary's satchel during conversations, the board becomes a zoomable wall where strings are dragged by hand, and recipes are case-file folders with die-cut windows.*

## B1. Discovery: Card Minting

When a conversation line carries a clue:

- The line holds; the clue phrase highlights.
- A physical index card **prints itself in-line** — the quote typewriters onto a card that rises out of the dialogue box, spins once, and flies to a **satchel icon** (bottom-right) with a leather *thump* and a badge count ("3 new").
- Card face shows: title, type glyph, and a big rubber-stamp status — UNVERIFIED (grey, angled) / CONFIRMED — G.G. (ivy) / PROMISED (plum, with the lock).
- The stance that earned it flashes on the card edge (PRESS/EMPATHIZE/OBSERVE) — teaching that stances produce different evidence.
- Same off-record inversion as Option A.

In-scene discoveries (examine/chekhov, aligning with the painted-overlay click-and-find direction): the found detail **lifts out of the painting** as a card with the same flight — one identical feedback verb everywhere: *find it → card flies to satchel.*

## B2. The board: a wall, not a modal

The board becomes **Gary's apartment wall, full-screen and zoomable** (drag to pan, wheel to zoom — the existing 60-pin perf work already supports this):

- **The satchel empties onto a desk tray** at the bottom (current tray, restyled as a physical desk).
- **Strings are drawn by hand:** press on a pinned card and DRAG a string to another card — it follows the pointer as a real sagging thread. Release on a matching card: the thread snaps taut and gold with the click sound. Release on a wrong card: the thread sags red and Gary barks (existing behavior, now physical). No more select-two-then-press-a-button.
- **Case folders replace the invisible recipe list:** the Open Questions strip matures into a row of manila folders pinned along the wall's bottom edge. Each folder front has die-cut windows — card-shaped holes showing silhouettes of what the case still needs (count visible, contents blank; pencil-hatched when a matching card is held but unverified — exactly the strip's slot states, physicalized). Cards near a folder's window glow softly when they'd fit. When all windows fill: the folder **closes with a stamp** (deduction fires) and gets filed in a drawer (the trophy shelf of solved cases).
- **Suspect ledger** → wanted-poster style portraits pinned top-center with three brass hooks under each (motive/means/opportunity); deduction cards physically hang on hooks. CLEARED = a green sash across the portrait.
- **Contradiction desk** → **the light table**: an actual glowing table at the wall's right. Lay two testimonies on the glass; they overlay like film negatives, and irreconcilable claims literally glow red where they overlap. Pull the red glow = a question card tears off into the notebook.
- **Timeline rail** → **the clothesline**: a real string across the top of the wall with four wooden pegs labeled by night. Event cards peg on only when anchored (same rule); the composite pair pegs TWO cards to one peg, clipped together. Completing the line on Night 6 = existing cinematic, staged as the camera walking the line.

## B3. Tutorial fit

The existing Night-1 tutorial survives almost intact; "pin → string → click" becomes "pin → drag the thread → click," and the folder row replaces the strip in `tut_questions`.

## B4. Costs, risks, keeps

- **Kept:** the whole current board information architecture, all logic (`board.ts` untouched except a drag-string entry point), the tutorial, the strip logic (re-skinned into folders), all content, AND the cork/string fantasy.
- **Cost: MEDIUM.** Board.tsx restyle + pan/zoom + drag-thread interaction + Card Minting in DialogueBox + satchel HUD. Light table and clothesline are re-skins of existing desk/rail logic. Roughly half of Option A's build.
- **Risks:** (1) Pan/zoom on a wall must not bury the folders — they should stay screen-fixed while the cork pans. (2) Drag-a-thread needs a fallback for accessibility (keep click-two-cards as the keyboard path). (3) It's still "a board" — if the playtest problem is deeper than legibility (players don't LIKE boards), B polishes what A replaces.
- **Why pick B:** maximum reuse, keeps a beloved genre fantasy, every confusing element becomes a physical object whose use is visually self-evident, and it lands sooner. The satchel/card-minting feedback alone likely fixes complaint #1 regardless of what the board looks like.

---

# Shared recommendation (whichever option wins)

1. **The discovery feedback (A1 or B1) should ship first and separately** — it's the highest-value fix, it's compatible with BOTH options, and it de-risks the board decision by letting us re-playtest with feedback in place. If players still bounce off the cork after Card Minting exists, that's the signal to go full Option A.
2. **Desk and rail stay hidden until first usable** regardless of option (rail appears with the first event card, desk with the second testimony), each with one authored Gary line.
3. Reviewer pass required on all new authored strings (notation summaries in Gary's hand are new content — probably ~60 two-to-four-word summaries, one per card).

| | Option A — Front Page | Option B — Evidence Wall |
|---|---|---|
| Fantasy | Reporter typesetting the truth | Detective wall, made tactile |
| Discovery verb | Notebook writes itself | Card mints & flies to satchel |
| Deduction verb | Story typesets on the page | Folder windows fill & close |
| Desk/rail answer | Newspaper furniture (spike, column) | Physical objects (light table, clothesline) |
| Build cost | High (new UI surface) | Medium (deep restyle) |
| Content kept | 100% | 100% |
| Biggest risk | Metaphor collision with editions | Might polish a disliked core |
