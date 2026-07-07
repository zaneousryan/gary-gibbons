# GARY GIBBONS: The Empty Capsule
## Full Design Document — Version 1.3
### Part I: Narrative Bible (v1.0, LOCKED) · Part II: Gameplay Elevation Pass (v1.1) · Part III: Gameplay & Agency Pass (v1.2) · v1.3: Species Pass (anthropomorphic animal world)

---

## TABLE OF CONTENTS

**PART I — NARRATIVE BIBLE (LOCKED)**
1. Vision & Style Bible
2. The Setting: Lanternside District
3. Master Timeline (Hidden Chronology of the Crime)
4. The Cast — Full Character Bible
5. Day-by-Day Structure & Full Scene Scripts (Days 1–7)
6. The Investigation Board — Nodes, Strings & Deductions
7. Recurring Threads (The Grape Thread, The Grandpa Thread)
8. The Final Act — Complete Scripts
9. Image Generation Prompts (Style Anchor, Characters, Locations, Props, UI)
10. Additions Beyond the Outline & Hooks for Game Two

**PART II — GAMEPLAY ELEVATION PASS**
11. The Unifying Design Thesis: "Detectives Accuse. Reporters Verify."
12. New Core Mechanics (The Reporter's Toolkit)
13. Environmental Puzzles (organic, per-location)
14. Living Lanternside (schedules, weather, ambient life)
15. The Reporter Identity Layer (The Evening Edition, the Morgue, the Notebook)
16. Investigation Board 2.0 (Timeline Rail, Suspect Ledger, Theory Cards, Contradictions)
17. Side Stories of Lanternside (9 optional neighborhood stories)
18. Pacing Pass (day-by-day rhythm chart & fixes)
19. Replay Value, Collectibles & Signature Gary Moments

**PART III — GAMEPLAY & AGENCY PASS**
20. The Agency Doctrine: "Discovered, Then Confirmed"
21. The Discovery Web (redundant paths to every major fact)
22. Authored "Aha!" Deductions (surprise reinterpretations)
23. Journalism Deep Mechanics (Off the Record, Source Protection, Reputation)
24. Environmental Storytelling Pass (the Chekhov Index, per location)
25. New Organic Puzzles (torn letter, photo triangulation, the founding portrait, the floorboards)
26. The Notebook as Thinking Tool (Morning Pages, tear-out-and-pin)
27. Freedom, Reactivity & The Town That Investigates Back
28. Natural Seeds (unremarked mysteries for future games)
29. Protecting the Heart (the cut list & design laws)

---

# 1. VISION & STYLE BIBLE

**Genre:** Cozy conversation-driven mystery adventure (Tangle Tower × Ace Attorney × Professor Layton).

**The world:** Lanternside is an **anthropomorphic animal town** — expressive Disney-quality animal citizens with Zootopia-inspired proportions, set in a warm 1930s–1950s European storybook world rendered in watercolor and gouache (see the Master Style Prompt, §9.1). Species is characterization: every casting choice either echoes a personality or wittily contradicts it. **The Pigeon Rule:** small ordinary wildlife — pigeons, garden birds, fish — remain simple, non-speaking storybook animals, and nobody in town finds this strange. (This preserves Warren's pigeon congregation, the divorced pigeons, and the umbrella's carved duck handle.)

**The promise to the player:** *Every person in Lanternside is worth knowing. Nobody here is evil. The truth, told with compassion, makes things better — not worse.*

**Pillars:**
- **People, not crime.** The mystery is an excuse to fall in love with a neighborhood.
- **Deduction is manual.** The game never solves itself. The player pins, connects, and concludes.
- **The Rule of Three.** Every major suspect: 3 conversations, 3 clues, 3 reveals.
- **Home base rhythm.** Every day ends at Gary's apartment. The board is the campfire. When the player has gathered enough to make the next leap, the game *sends them home* — night falls, Gary makes tea, and the player works the board.
- **Small and dense.** 7–9 hours. One district. ~15 NPCs the player knows by name by the end. 8 locations that each change subtly as days pass.

**Tone words:** Lamplit. Autumnal. Wry. Tender. Never cynical.

**Loop:**
```
MORNING  → Choose locations, talk, observe, sketch, collect
MIDDAY   → Optional side beats, recurring NPC life, grape temptations
EVENING  → Trigger scene closes the day when core clues are found
NIGHT    → Gary's apartment: pin clues, connect strings, unlock deductions
         → Correct deductions unlock tomorrow's conversations
```

---

# 2. THE SETTING: LANTERNSIDE DISTRICT

Lanternside is an old riverside district of the city of Bellbrook — an animal town of cobbled lanes, gas-style lanterns the district refuses to modernize, and rounded storybook houses leaning toward each other like gossiping aunts, everything scaled with gentle chaos to citizens from wren-sized to bear-sized (Ida's door is set inside Otto's doorframe like a letterbox). Fifty years ago it was founded as a self-governing community by **Edmund Vale** and a handful of families. Its charter is quirky: the district elects no mayor; leadership passes within the founding family, confirmed by the district council.

Fifty years ago, at the founding, a **community time capsule** was sealed inside the base of the Founders' Monument. Every family contributed something. Ten years ago, in a famous ceremony called **The Founder's Addition**, a dying Edmund Vale legally reopened the capsule for one hour and placed a single green-wax-sealed envelope inside — his final wishes, to be read at the 50th Anniversary opening. Then he sealed it again, and the whole district has been waiting ever since.

The story begins three days before the opening.

## The Eight Locations

| # | Location | Function | Changes over the week |
|---|----------|----------|----------------------|
| 1 | **Gary's Apartment** (above the Ledger office) | Hub. Investigation board, bed, kettle, grandpa's badge on the desk | Board fills; string multiplies; grape stress ball migrates around the room |
| 2 | **Founders' Square & Monument** | Crime scene. Capsule vault in the monument base | Festival bunting goes up, then sags; flowers accumulate at the monument |
| 3 | **The Percolator** (café) | Social crossroads, rumor engine, Otto | Chalkboard specials track the town mood ("The Empty Espresso — nothing in it, like the capsule") |
| 4 | **The Drowsy Lantern** (inn) | Margie's kingdom; where Ferris stays; where the Guardian was overheard | Ferris's room gets progressively more chaotic |
| 5 | **Lanternside Archive** (museum) | Prudence's domain; district history; seal reference books | Theodora/Jonah exhibit slowly assembled in the corner |
| 6 | **Vale Manor** | The founding family's home. Garden, study, portrait hall | Grows quieter and tenser each visit |
| 7 | **Market Row** | Gino's fruit stall, Wren & Wick locksmith, Evelyn's flower shop | Festival stock → mystery gossip → memorial flowers → celebration stock |
| 8 | **The Old Boathouse** (riverbank) | Vale family boathouse. Childhood puzzle place. Where everything is hidden | Locked/background until Day 4 (Ferris digs nearby); central on Day 7 |

---

# 3. MASTER TIMELINE — THE HIDDEN CHRONOLOGY

*(What actually happened. The player reconstructs this out of order.)*

**50 years ago** — Lanternside founded. Capsule sealed in the monument. Locksmith **Ida Wren** (then an apprentice) forges exactly **two keys**: the Ceremonial Key (council custody) and a Family Backup Key (kept in the Vale Manor study, largely forgotten). Among the items sealed inside: children's drawings and predictions; a letter sealed by **Theodora Vale** (Edmund's sister) that ends her secret romance with **Jonah Croft**; and a package left by a young cub reporter named **Gary Gibbons** — Gary's grandfather and namesake. (Our protagonist is Gary Gibbons Jr. — but NOBODY, including this document, the game, or the credits, ever calls him "Jr." He is Gary. The full name "Gary Gibbons," spoken by the town, always means the grandfather.)

**10 years ago** — The Founder's Addition. Dying Edmund Vale adds his will: leadership shall pass to **both** his children, Julian and Clara, jointly, when Julian comes of age (24) — which falls, by Edmund's design, on the week of the 50th Anniversary. Nobody knows the contents. Everyone *assumes* it names Julian alone.

**8 years ago** — Edmund dies. **Warren Holt** appointed Council Guardian until the heir comes of age.

**Night −5 (before the ceremony)** — In the manor garden, Clara tells her mother: *"It isn't fair. Everyone already knows he'll lead."* Beatrice, who has read the will, answers only: *"You may be surprised."* **Julian overhears half of it** from the study window — enough to conclude the will contains a surprise *that removes him.* He begins to panic.

**Night −3** — Event planner **Poppy Finch**, terrified of her first major event going wrong, borrows the Ceremonial Key and secretly opens the vault to check the contents. Everything is intact. She notices one envelope with a striking **green wax seal — a lantern wreathed in ivy**. She relocks the vault but replaces the key on its hook **backwards**.

**Night −2, ~2 a.m.** — Julian takes the forgotten Family Backup Key from the study, crosses the square under the Vale family umbrella (light rain), opens the vault, and removes *everything* — he means only to read the will first and "figure it out," but panics and can't stop. The old wax seal cracks as he handles it; a fragment lodges in his coat pocket. He hides the contents under the floorboards of the **Old Boathouse** — the place his father gave the children their two-person puzzles. That same night: **Ferris Mott** is skulking near the monument hunting the mythical "Founder's Treasure" (he sees Julian, notes he "used a key like he belonged there"); **Warren Holt** is on his balcony taking a long-exposure night photograph of the square, which accidentally captures Ferris's unmistakable tail — the only weasel tail in the district; and 11-year-old **Milo Tanaka**, sneaking out to test a homemade telescope, sees "a tall figure with the fancy Vale umbrella" crossing the square.

**Day 0 / Day 1 of play** — The 50th Anniversary. The capsule is opened before the whole district. **It is empty.**

---

# 4. THE CAST — FULL CHARACTER BIBLE

Format per character: *Role · Species · Age · Design & silhouette · Voice (how they talk) · Public face / Private truth · Rule of Three (suspects) · Function in the mystery.*

## Casting Philosophy — Species as Character
- **Species echoes or contradicts the role, never randomly.** A heron curator (patient, precise, strikes suddenly at what she wants). A basset hound constable (built for waiting). A raccoon kid (born wearing a detective's mask).
- **Founding families are species lines.** The **Vales are red deer**; the **Crofts are red foxes** — which turns the Theodora & Jonah romance into the district's oldest storybook rivalry: the deer and the fox.
- **One species per named resident wherever possible** — silhouettes must identify anyone at a glance across a busy square.
- **Ferris is the only weasel in Lanternside.** This is load-bearing: it's why one blurred tail in a night photograph can point at a single resident.
- **Julian's antlers are still in velvet** — a stag not yet hardened into his crown. The art must keep this subtle and never mention it in dialogue; it's the whole character, drawn.
- **The Vale umbrella hides antlers.** Seen from above or behind, the canopy conceals the most identifiable silhouette in town — the physical reason nobody could name an otherwise unmistakable stag crossing the square (pays off in the fire-escape sightline puzzle, II.12.6).

---

## GARY GIBBONS — Protagonist
**Investigative reporter, The Lanternside Ledger · Gibbon · 28**

- **Species & Design:** A **gibbon** — long-limbed and lanky by nature, built for leaning in doorframes, reaching high shelves, and draping over café chairs. Sandy-brown fur, dark expressive face, scruffy cheek fur of a gibbon who forgot to be vain. Slightly rumpled tweed jacket with elbow patches, loosened knit tie, satchel heavy with notebooks, pencil tucked behind one small round ear. Grandpa's tarnished brass **press badge** pinned inside his lapel — he touches it when thinking. His long arms are an animation gift: gesturing, note-scribbling at distance, hanging a lantern-high pin on the board without a stool.
- **Voice:** Earnest, self-deprecating internal monologue; polite and genuinely curious out loud. Asks "and how did that make you feel?" in a town that isn't used to being asked.
- **Core wound:** Raised by his grandfather — the first Gary Gibbons, a legendary reporter —, after his father left. Gary measures every choice against a ghost. His internal refrains: *"What would Grandpa do?" "Remember who you are." "Do it for Grandpa."*
- **The grape thing:** Gary is quietly, absurdly, seriously fighting an addiction to grapes. Never a punchline the game underlines. A pattern the *player* discovers. (Full beat schedule: Section 7.) The species makes the joke quieter and truer — he's a gibbon; of course it's grapes. Fruit is his birthright and his nemesis.
- **Diegetic hint system — "Ask Grandpa":** When stuck, the player can have Gary touch the press badge. He remembers a piece of Gary Gibbons's advice, phrased as a nudge, never a solution. *"Grandpa always said: when a story stalls, go back to the person who was most embarrassed."*

---

## THE VALE FAMILY

### JULIAN VALE — The Brother (the culprit) · Red deer (stag) · 23, turns 24 this week
- **Species & Design:** A young **red deer stag**, tall and handsome in a slightly untested way — and his **antlers are still in velvet**: soft, unfinished, a crown not yet hardened. (Never referenced in dialogue. Always visible. It IS the character.) Expensive navy coat worn like a costume; his father's signet ring, too loose on a deer's slim finger, which he spins when nervous (KEY TELL — animate this). Carries the elegant **Vale family umbrella** everywhere, rain or shine — and from above or behind, its canopy completely hides his antlers.
- **Voice:** Rehearsed warmth. Speaks in almost-speeches, then deflates in private. Deflects with charm; when cornered, goes quiet rather than sharp.
- **Public face:** The golden heir, ready to lead.
- **Private truth:** Certain he isn't good enough — *and simultaneously* terrified of losing the role. He overheard half a conversation and concluded the will disinherits him. He emptied the capsule in a panic, meaning only to read the will first. He never opened it. It sits under the boathouse floor, still sealed except for the crack he caused. He has barely slept since.
- **Not a villain because:** He hid *everything*, not just the will — protecting every family's memories from being opened without him understanding his own fate first. Even his crime is a child holding his breath.

### CLARA VALE — The Sister · Red deer (doe) · 21
- **Species & Design:** A young **doe** — poised without trying, in the way Julian tries. Practical oatmeal cardigan over inherited elegance; a drafting pencil tucked behind one tall ear; always carrying a book of logic puzzles. Sharp, watchful dark eyes that soften around her brother.
- **Voice:** Precise, dry, economical. Answers questions with better questions. The only person in town who out-interviews Gary.
- **Public face:** The overlooked one, resigned.
- **Private truth:** She's hurt — *"It isn't fair"* — but her love for Julian is bedrock. Her three clues (Day 6) are the moral spine of the endgame: Julian's fear, the two-person puzzles, and the missing backup key.

### BEATRICE VALE — The Mother · Red deer (doe) · 56
- **Species & Design:** An elegant older **doe**, muzzle silvered, posture of absolute composure. Dark plum dress, gardening gloves tucked in her belt, mourning brooch containing pressed ivy — the same ivy as the wax seal (players who notice this early feel like geniuses).
- **Voice:** Serene, exact. **She never lies.** She declines. *"That is not mine to tell you, Mr. Gibbons."* Every sentence is true; the silences carry the secrets.
- **Function:** She read the will. She knows Edmund's plan. Her vague reassurance to Clara — *"You may be surprised"* — is the accidental spark of the entire mystery. Her Day 6 conversation is the emotional summit of the game.

---

## THE SUSPECTS

### POPPY FINCH — The Event Planner · Goldfinch · 24
- **Species & Design:** A tiny **goldfinch**, vibrating with energy, head-feathers permanently frazzled with three pens stuck through them; clipboard held like armor; lanyard with fourteen laminated contingency cards ("PLAN F: SWANS"). Oversized round glasses that fog when she panics — and her feathers fluff a full size when startled (animation gift; the fog-and-fluff double tell is her OBSERVE hook).
- **Voice:** Run-on sentences, self-interrupting, apologizes to furniture.
- **Rule of Three:**
  1. **Suspicion:** Gary notices the Ceremonial Key returned **backwards** on its hook; the dust outline in the council cabinet proves it was removed recently. Poppy cracks in eleven seconds and confesses she checked the capsule three nights early.
  2. **Gift:** She saw the contents *intact* — and remembers one envelope with a **green wax seal, a lantern wreathed in ivy**. Gary sketches it from her description. (Permanent board item: THE SEAL SKETCH.)
  3. **Cleared:** She locked everything back, has a timestamped checklist proving it ("I laminate my alibis"), and removed nothing. Her testimony narrows the theft window to the final two nights.
- **Arc:** From "I've ruined my entire career" to co-running the recovery ceremony on Day 7, competent and glowing.

### WARREN HOLT — The Council Guardian · Badger · 63
- **Species & Design:** A sturdy, barrel-chested **badger**, grey-streaked with magnificent whiskers, reading glasses on a chain, ceremonial sash he clearly finds embarrassing. Always with an antique bellows camera or a portfolio of photographs. (A badger guardian: an animal that holds ground. He held it eight years for someone else.)
- **Voice:** Measured, kind, faintly melancholy; the cadence of a man who has given too many speeches and meant all of them.
- **Rule of Three:**
  1. **Suspicion:** Innkeeper Margie overheard him say, late one night, *"I'm not certain the boy is ready."* Town whispers: the Guardian stole the will to keep his seat.
  2. **Cleared (heart):** He shows Gary his prepared speech — genuinely joyful about handing over power — and his **travel folio**: tickets and maps to photograph all forty-seven lighthouses of the Meridian Coast, a dream deferred for eight years. *"I wasn't afraid of losing the chair, Mr. Gibbons. I was afraid of the boy losing himself in it."*
  3. **Gift:** His long-exposure night photograph of the square, taken Night −2, accidentally caught a figure by the monument — only a **tail** visible at frame's edge, long and low and unmistakably a weasel's. → Sends Gary to the stranger at the inn.

### FERRIS MOTT — The Treasure Weasel · Weasel · 41
- **Species & Design:** A wiry **weasel** — the only weasel in Lanternside, a fact with consequences — all angles and low fast lines, with a magnificent russet tail he grooms mid-conversation and refers to as "heritage couture." Brass goggles on a battered hat; coat lined with maps, trowels, and a divining rod that is obviously a bent curtain rail. That tail is what Warren's night photograph catches.
- **Voice:** Conspiratorial whisper at all times, even ordering soup. Refers to himself in third person when excited: *"Ferris Mott smells destiny."*
- **The red herring, played big:** Newcomer at the inn, obsessed with the legend that Edmund hid a **treasure map** in the capsule. Caught digging at night on Day 4 — the whole town believes it's solved. It isn't.
- **His actual crimes:** Excavated the community garden (six holes, one prize marrow casualty) and "borrowed" Prudence's 1890s survey map from the Archive.
- **His gift (the pivot):** He was at the monument on Night −2 and saw the real culprit: *"Tall. Dry under a posh umbrella. Didn't pick the lock — used a key, smooth as butter. Moved like the square belonged to him."* → **The thief was an insider with a key.**
- **Arc:** Sentenced by Constable Tuck to repair the garden; by Day 7 the town has adopted him. He plants grapes. Gary suffers.

### PRUDENCE MARLOWE — The Curator · Grey heron · 58
- **Species & Design:** A tall **grey heron** — patient, precise, motionless for minutes and then sudden. Ink-stained wingtip fingers, magnifying loupe worn as a pendant, cardigan with more patches than original wool. The Archive's reeds are her shelves.
- **Voice:** Lecture-mode that melts into girlish excitement about dead people's love lives.
- **Her stake:** Twenty years reconstructing the forbidden romance of **Theodora Vale and Jonah Croft** — a doe and a fox, the rival founding species-lines of the district. The town thinks it's nonsense. The final proof, Theodora's last letter, is *inside the capsule*. She has waited two decades for opening day.
- **Rule of Three:**
  1. **Suspicion:** Motive on a plate — steal the capsule, publish first, be vindicated.
  2. **Cleared:** Night −2 alibi: she was with **Evelyn Croft** (florist, Jonah's great-niece) cataloguing the Croft side of the letters until 3 a.m. Evelyn confirms, blushing — the two rival-family descendants have quietly become friends (and maybe more; the game never says).
  3. **Gift (expertise):** Shown the seal sketch, she identifies it instantly: *"That's no council seal. That is Edmund Vale's personal signet — the lantern in ivy. The ring never left the family."* → **Whoever handled that envelope was Vale, or had access to Vale Manor.**

---

## THE NEIGHBORHOOD (Recurring NPCs)

### MARGIE PLUM — Innkeeper, The Drowsy Lantern · 61
A plump, flour-dusted **hen**, terrifyingly perceptive; gossip is her love language but she's never cruel; runs the inn like a warm wing over the whole street. Source of the Warren rumor (reveal 1) and general intel on Ferris. Voice: everything ends in "love" or "pet."

### OTTO KESSLER — The Percolator · 45
An enormous gentle **brown bear**, tiny espresso cups vanishing in his paws. Speaks in coffee metaphors. The café is the rumor exchange; Otto's chalkboard tracks the town's mood daily. Witness to the **seal fragment drop** (Day 6). Keeps a bowl of grapes on the counter, which is Gary's personal Everest.

### DOT RAMIREZ — Editor, The Lanternside Ledger · 55
A grey-muzzled **wire-haired terrier**, Gary's boss, downstairs from his apartment. Gravel voice, red pen, secret heart of gold, and a bite reserved exclusively for lazy paragraphs. Daily function: each morning she pressure-tests Gary's theory — a diegetic recap system. *"Sell me the story, Gibbons. In one sentence."* Knew the first Gary Gibbons; drops one Grandpa memory per day.

### IDA WREN — Locksmith, Wren & Wick · 74
A tiny **wren** (the shop sign was inevitable), magnifying visor, workshop of ten thousand labeled drawers scaled to wren hands — which is why her locks are the finest in the district. Forged the capsule's keys fifty years ago as an apprentice. **Her ledger proves exactly two keys exist** — the linchpin of the "means" chain. Voice: talks to locks like they're shy animals.

### GINO PUGLISI — Fruit Vendor · 66
A big operatic **boar**, generous, devastating: his stall is 40% grapes. Greets Gary daily by holding up "the good ones, just in." Has no idea he is the villain of Gary's private war. Voice: everything is *bellissimo* or a tragedy, no middle.

### MILO TANAKA — Neighbor Kid · 11
A **raccoon kit** — born wearing a detective's mask, and he knows it. Junior detective energy; homemade telescope, notebook labeled "CRIMES?"; idolizes Gary. **The opportunity witness:** sneaking out on Night −2, he saw "a tall figure with the fancy Vale umbrella" cross the square at 2 a.m. — but he's scared to say it because he'd be confessing to sneaking out. Gary must trade a secret for a secret.

### EVELYN CROFT — Florist · 49
A calm, wry **red fox**, paws always in stems, one ivy sprig tucked behind an ear. Descendant of Jonah Croft — the fox line of the old deer-and-fox rivalry. Prudence's alibi and quiet companion. Her Day 5 scene reframes the romance subplot from gossip to grief to hope.

### CONSTABLE BRAM TUCK — District Constable · 52
A magnificently unhurried **basset hound**; solves most crime by waiting near pastry; ears deputized as separate officers. Not an antagonist to Gary — a fond skeptic. *"You reporters. Always making three clues do the work of a nap."* Handles Ferris's sentencing; formally recovers the capsule contents Day 7 so Gary never plays cop.

**Count of named NPCs: 15** (Julian, Clara, Beatrice, Poppy, Warren, Ferris, Prudence, Margie, Otto, Dot, Ida, Gino, Milo, Evelyn, Tuck) — matching the "know everyone by the end" target.

---

# 5. DAY-BY-DAY STRUCTURE & SCENE SCRIPTS

**Design rule — "Send Them Home":** Each day has a set of CORE CLUES. When the last core clue is collected, the day soft-closes: light shifts to dusk, NPCs begin closing up, and Gary says a going-home line (*"That's enough thread for one day. Time to see what it ties to."*). Optional content remains available until the player sleeps. Night = board phase. Required deductions gate the next morning.

Dialogue format: **G:** Gary · other initials per character · *(stage directions in italics)* · `[BOARD]` = item pinned · `[DEDUCE]` = deduction unlocked at night.

---

## DAY 1 — "An Ordinary Thursday" (Prologue → Inciting Incident)

**Goals:** Teach movement, talk, observe, sketch. Meet 10+ NPCs in their natural habitat. Make Lanternside lovable *before* breaking it.

**Beats:**
1. **Wake up in the apartment.** Tutorialize the board with a harmless mini-mystery: *"Who keeps stealing Dot's red pens?"* (Answer, solvable in 4 pins: Milo, for his CRIMES? notebook. Resolution is Gary buying Milo his own pens.)
2. **The Percolator.** Otto, Margie, festival buzz. First grape beat (§7).
3. **Market Row.** Gino's aria of grapes. Ida oiling the Ceremonial Key's lock "one last time." Evelyn arranging fifty years of flowers.
4. **Founders' Square.** Poppy mid-crisis (bunting emergency). Meet Warren rehearsing his speech to pigeons. Meet Julian and Clara doing press-friendly heir things — plant Julian's ring-spinning tell here, unremarked.
5. **THE CEREMONY (evening, unskippable).** Full district assembled. Warren's speech. Julian is handed the Ceremonial Key. The vault opens.

*(The crowd leans in. Silence. The camera holds on the empty vault for a full three seconds.)*

**POPPY:** *(whisper)* That's... that's not one of my contingency cards.
**WARREN:** *(quietly, to no one)* Fifty years.
**JULIAN:** *(the ring spins; he stares into the vault a beat too long — replayable tell)* Perhaps... perhaps there's been some mistake with the— the masonry.
**CLARA:** *(flat)* The masonry.
**DOT:** *(materializing at Gary's shoulder)* Gibbons. Front page. Go.
**G:** *(touching the badge, inner voice)* Okay, Grandpa. Remember who you are.

**Night 1 (tutorial board):** Pin THE EMPTY VAULT, THE CEREMONIAL KEY, 50 YEARS OF ITEMS, GRANDPA'S PACKAGE (personal stake, gold string). `[DEDUCE: "The capsule was emptied BEFORE the ceremony — the lock wasn't forced."]` → unlocks Day 2 question: *who had key access?*

---

## DAY 2 — "The Backwards Key" (Poppy's Day)

**Core clues:** Key hung backwards → dust outline → Poppy's confession → **THE SEAL SKETCH** → Poppy's checklist alibi.

### Scene: Council Hall key cabinet
**G:** *(observe mode on the key hook)* Grandpa always said: rooms remember. This key's been hung facing the wall. Someone put it back in a hurry — or in the dark. *(dust outline shimmer)* And the dust says: recently.
`[BOARD: KEY HUNG BACKWARDS · DUST OUTLINE]`

### Scene: Poppy, Conversation 2 (the confession) — Founders' Square
**P:** Mr. Gibbons! If this is about the bunting, the bunting has been *addressed*—
**G:** It's about the key, Poppy.
**P:** *(glasses fog instantly)* ...Which key.
**G:** The one you hung back facing the wall.
**P:** *(eleven-second pause, then a dam bursts)* I checked it I checked the capsule three nights before the ceremony because what if the seal had degraded or MICE Mr. Gibbons what if MICE and it was my FIRST major event so I borrowed the key and I opened it and everything was FINE, it was all there, all of it, I counted, I have a *checklist*—
**G:** Wait. All there? Three nights before?
**P:** Item by item. Laminated. *(produces it, trembling)* Time-stamped. I laminate my alibis.
**G:** *(inner)* Which means the theft happened in a two-night window. The story just got smaller. Grandpa liked small stories. Small stories have doors.
`[BOARD: POPPY'S CHECKLIST — CONTENTS INTACT NIGHT −3]`

### Scene: Poppy, Conversation 3 (the seal)
**P:** There was one thing I keep thinking about. An envelope, on top. The wax was green, and the seal was — a lantern? Wrapped in leaves. Ivy, maybe. It was beautiful. It looked... important on purpose.
**G:** *(sketch minigame: player traces the seal from her description — lantern, ivy ring, three drips of wax)* Like this?
**P:** *(small gasp)* Exactly like that. How did you—
**G:** Grandpa drew everything. Photographs show what a thing looks like. A sketch shows what it *means*.
`[BOARD: THE SEAL SKETCH — permanent gold-bordered item]`

**Day 2 grape beat:** the grape stress ball debuts (§7).
**Night 2 deductions:** CHECKLIST + EMPTY VAULT → `[DEDUCE: "Theft window: the final two nights."]` · KEY BACKWARDS + CHECKLIST → `[DEDUCE: "Poppy opened it — but Poppy didn't empty it."]` Dot's morning pressure-test (Day 3) requires both.

---

## DAY 3 — "The Man Who Counts Lighthouses" (Warren's Day)

**Core clues:** Margie's overheard remark → Warren's speech → the travel folio → **THE NIGHT PHOTOGRAPH.**

### Scene: The Drowsy Lantern — Margie
**M:** I don't like saying it, pet. But three nights back, His Guardianship sat in that corner nursing one (1) sherry and said — and I quote, because I always quote — *"I'm not certain the boy is ready."* Now what does a man mean by that, the week the boy takes his chair?
**G:** *(inner)* Or the week a man wonders if he's spent eight years building something a boy could drop.
`[BOARD: MARGIE'S TESTIMONY]`

### Scene: Warren, Conversation 2 — his office
**W:** You've heard, then. That I doubted him. *(takes off glasses, cleans them slowly)* I did. I do. That is not the same as wanting his chair, Mr. Gibbons. Here. *(slides over handwritten pages, crossed out and rewritten)* My speech. Read the third draft. I couldn't get the joy right in the first two.
**G:** *(reading)* "...the happiest sentence I will ever say: the waiting is over."
**W:** Eight years I've kept a seat warm for someone else. Do you know what I've kept cold? *(opens a leather folio: tickets, tide tables, a map of the Meridian Coast pinned with 47 tiny lighthouses)* Forty-seven of them. I intend to photograph every one before my knees give out. I wasn't afraid of losing the chair. I was afraid of the boy losing himself in it.
`[BOARD: WARREN'S SPEECH · THE LIGHTHOUSE FOLIO]`

### Scene: Warren, Conversation 3 — the photograph
**W:** Since you're here — a curiosity. I take long exposures of the square at night. The lanterns smear like honey; it's the only art I have. This one's from two nights before the ceremony. *(hands over a print)* Look at the monument. Bottom left.
**G:** *(zoom-and-observe: the frame's edge — a blurred TAIL, mid-stride)* ...Is that a tail?
**W:** A weasel's tail, unless my lenses lie. And Lanternside hasn't had a weasel on the district rolls in fifty years of records, Mr. Gibbons. I checked twice.
**G:** *(inner)* The Drowsy Lantern took in a new lodger last week. Margie said he asks about treasure at breakfast. *(beat)* ...Oh no. I know exactly whose tail that is.
`[BOARD: THE NIGHT PHOTOGRAPH — THE WEASEL TAIL]`

**Night 3:** PHOTOGRAPH + MARGIE'S GOSSIP re: the strange new lodger → `[DEDUCE: "The figure at the monument is the stranger at the Drowsy Lantern."]` → unlocks Day 4 stakeout.

---

## DAY 4 — "The Weasel Digs at Midnight" (Ferris's Day — the Grand Red Herring)

**Core clues:** Ferris's treasure obsession → THE STAKEOUT → caught digging → his crimes are the wrong crimes → **THE INSIDER TESTIMONY.**

### Scene: The Drowsy Lantern — Ferris, Conversation 1
**F:** *(leaning in before Gary says anything)* You have the look of a man who knows about the map.
**G:** ...The map.
**F:** *(whisper achieving new depths)* Edmund Vale's treasure. Sealed in the capsule, waiting fifty years. Ferris Mott has followed this legend across four counties and one regrettable marsh. And now the capsule is "empty"? *(air quotes, wink, second wink)* Empty. Sure. SURE.
**G:** *(inner)* He winked twice. Innocent men don't wink twice. ...Or they wink exactly twice. I need more data.

### Scene: THE STAKEOUT (night set-piece, Founders' Square → riverbank)
*(Mechanics: stay-hidden-and-observe. Comic tension: Ferris "stealth" involves humming. He ends up digging holes by the old boathouse fence. Constable Tuck ambles out of the dark eating a pastry.)*
**TUCK:** Evening, Mott. That'd be hole number six.
**F:** Ferris Mott can explain everything using this map!
**PRUDENCE:** *(arriving in dressing gown, vibrating with fury)* That is MY map. That is an 1890s survey document and it has JAM on it.
*(Crowd gathers. The town exhales: solved! The music goes triumphant — then deflates as Tuck upends Ferris's sack: trowels, jam, no capsule contents.)*
**TUCK:** *(sighs)* Wrong crimes, folks. Right weasel, wrong crimes.

### Scene: The lockup — Ferris, Conversation 3 (the pivot)
**F:** *(deflated, honest for the first time)* Ferris Mott didn't take your memories, reporter. But two nights before the ceremony, Ferris Mott saw who might have. I was — surveying — by the monument. A figure came across the square. Tall. Rain falling, and him dry under a great posh umbrella. And here's the thing that itched me: he didn't pick that lock. He used a *key*. Smooth as butter. Didn't look around once. Moved like the square belonged to him.
**G:** *(inner, quiet)* Like it belonged to him.
`[BOARD: FERRIS'S TESTIMONY — TALL FIGURE, POSH UMBRELLA, USED A KEY]`

**Night 4:** FERRIS'S TESTIMONY + KEY FACTS → `[DEDUCE: "The thief was an insider with legitimate key access."]` But Poppy had the ONLY council key and her window is closed... → the deduction glows with a question mark: *"...is it the only key?"* → unlocks Ida Wren (Day 5/6) and the Archive's seal expertise (Day 5).

---

## DAY 5 — "The Lantern in Ivy" (Prudence's Day)

**Core clues:** Prudence's motive → the Theodora/Jonah romance → Evelyn alibi → **SEAL IDENTIFIED AS THE VALE SIGNET.**

### Scene: Lanternside Archive — Prudence, Conversation 2 (the romance)
**PR:** Twenty years, Mr. Gibbons, they have called it my "little theory." Theodora Vale and Jonah Croft. Rival families, one river between their houses, and letters — I have thirty-one of them — that would make a stone weep. The last letter, the one where she ends it or doesn't, Theodora sealed into the capsule herself. Fifty years I couldn't touch it; three days I've been unable to sleep for wanting to. So yes. Suspect me. I would suspect me.
**G:** Where were you, night before last-but-one?
**PR:** *(a beat; the faintest color)* Cataloguing. With Evelyn Croft. Until three in the morning. We have been... reconstructing both sides of the correspondence. *(dry)* You may verify with the florist. Bring context; she is armed with shears.

### Scene: Conversation 3 (the expertise pivot)
**G:** One more thing. *(shows THE SEAL SKETCH)* Ever seen this seal?
**PR:** *(loupe up; total stillness; then, softly)* Where did you get this.
**G:** A witness saw it on an envelope in the capsule. I drew it.
**PR:** Then your witness saw Edmund Vale's *personal signet*. The lantern in ivy. Not the council seal — the family's. That ring never left the family, Mr. Gibbons. It sits, as far as I know, on his son's finger to this day.
**G:** *(inner, cold drop)* The loose ring. The one Julian spins when he's nervous.
`[BOARD: SEAL = VALE FAMILY SIGNET]`

**Day 5 side scene — Evelyn's flower shop:** alibi confirmed; Evelyn reframes the romance (*"They weren't scandal, Mr. Gibbons. They were two people the town decided about before they'd decided about themselves."* — thematic rhyme with Julian). Evelyn quietly asks Gary: if the letter is ever found, *"let Prudence read it first. She's earned first."*

**Night 5:** SEAL SKETCH + PRUDENCE'S ID + FERRIS'S TESTIMONY → `[DEDUCE: "The trail leads to Vale Manor."]` Gary sits back. The gold string now touches the family portrait. **G:** *(inner)* Careful now, Gibbons. Grandpa's rule: the closer a story gets to a family, the gentler your hands.

---

## DAY 6 — "The Two-Person Puzzle" (The Family's Day — heaviest day, 6 core clues)

### Scene: Vale Manor garden — Clara, Conversations 1–3
**C:** You've come to ask if I stole my father's will. Efficient. Ask.
**G:** Actually — I came to ask what your brother's afraid of.
**C:** *(the first crack in her composure)* ...That's a better question than the constable managed. *(sits)* Everyone thinks Julian is dying to take the chair. He's terrified of it. He told me once — years ago, before he learned to give speeches — "What if I'm only the *shape* of Father?" He doesn't think he can do it alone. And everyone, including me, keeps telling him he'll be doing it alone.
`[BOARD: CLARA CLUE 1 — JULIAN'S FEAR]`

**C:** *(Conversation 2 — by the old garden table)* Father used to give us puzzles. Every birthday, one puzzle, one box, two children. And they were *designed*, Mr. Gibbons — designed so neither of us could solve them alone. Julian would find the mad sideways idea; I'd find the flaw in it; between us, the box opened. Every single time. I used to think it was a game. *(quiet)* Lately I think it was a syllabus.
`[BOARD: CLARA CLUE 2 — THE TWO-PERSON PUZZLES]` *(flagged: SAVE FOR CONFRONTATION)*

**C:** *(Conversation 3 — she's decided to trust him)* One more thing, and I am trusting you with the family in my hands. There have always been two keys to the capsule. The council's — and ours. A backup, from the founding, kept in Father's study. I looked last night. *(meets his eyes)* It's gone.
`[BOARD: CLARA CLUE 3 — FAMILY BACKUP KEY MISSING]`

### Scene: Wren & Wick — Ida (corroboration)
**I:** *(ledger open, visor down)* Fifty years ago, two keys, my own apprentice hands. One to the council, one to Edmund. *(taps the entry)* No copies since — this lock would tell me if a copy had ever been tried. Locks are terrible gossips, Mr. Gibbons. This one's only ever known its two.
`[BOARD: IDA'S LEDGER — EXACTLY TWO KEYS EXIST]`

### Scene: The Percolator — THE FRAGMENT (staged accident)
*(Julian at the counter, paying, rehearsing his public smile. He pulls coins from his coat pocket. Something small skitters across the floor to Gary's shoe: a fragment of GREEN WAX. Observe mode: the player overlays THE SEAL SKETCH — the ivy leaves align. A soft, terrible chime.)*
**OTTO:** *(quietly, sliding Gary an espresso)* You look like a man who found something he was hoping not to find.
**G:** *(inner)* The seal was intact when Poppy saw it. Broken wax means it was handled after. And it was handled by that coat.
`[BOARD: THE WAX FRAGMENT — MATCHES SKETCH]`

### Scene: Milo's fire escape — the witness trade
**MILO:** I can't tell you. Because then YOU'D know I was out at two in the morning, and then MOM would know, and journalism has ETHICS, I read about it.
**G:** Trade you. A secret for a secret. *(beat)* I'm scared of grapes, Milo. Not scared — it's... we have a complicated history. Nobody knows that.
**MILO:** *(awed silence)* ...That's so weird. Deal. *(whisper)* Two nights before the ceremony. A tall figure crossed the square. I couldn't see his face — couldn't see ears or antlers or ANYTHING, the umbrella was in the way of the whole him. But I saw the umbrella. THE umbrella. The fancy Vale one with the silver duck handle. Nobody else has that umbrella.
`[BOARD: MILO'S SIGHTING — THE VALE UMBRELLA, 2 A.M.]`

### Scene: Vale Manor parlor — BEATRICE (the emotional summit; full script in §8)
Core yield: `[BOARD: THE OVERHEARD CONVERSATION — "You may be surprised" · BEATRICE READ THE WILL]`

**Night 6 — the big board night** (extended music, rain on the window, all strings available):
- FEAR (Clara 1) + OVERHEARD CONVERSATION → `[DEDUCE: MOTIVE — "Julian believed the will would take everything from him."]`
- MISSING BACKUP KEY + IDA'S LEDGER → `[DEDUCE: MEANS — "Julian had the only unaccounted key."]`
- MILO'S SIGHTING + FERRIS'S TESTIMONY → `[DEDUCE: OPPORTUNITY — "Julian crossed the square with a key at 2 a.m."]`
- WAX FRAGMENT + SEAL SKETCH → `[DEDUCE: PHYSICAL PROOF — "Julian handled the will after the theft."]`
- MOTIVE + MEANS + OPPORTUNITY + PROOF → **`[FINAL DEDUCTION: "It was Julian. And he wasn't stealing a future — he was hiding from one."]`**
*(Gary sits a long time. He picks up the grape stress ball. Puts it down. Touches the badge.)*
**G:** *(inner)* Grandpa... how do I write a story that doesn't break the person it's about? *(beat)* ...Right. You don't write it yet. First you go talk to him. Truth with compassion — in that order and no other.

---

## DAY 7 — "The Boathouse" (Confrontation, Resolution, Ending — full scripts in §8)

Morning: Dot's final pressure-test (she quietly says, *"Gary Gibbons would run it exactly the way you're about to."*). Clara insists on coming as far as the riverbank. Confrontation at the Old Boathouse → confession → recovery (Tuck formalizes; Gary never plays cop) → the will is read in the square → shared leadership revealed → reconciliation → Warren's joyful handover and departure line → Gary writes the story → CREDITS CAPSULE SCENE (Grandpa's letter).

---

# 6. THE INVESTIGATION BOARD — FULL SPEC

**Fiction:** A corkboard wall in Gary's apartment. Items are mostly Gary's own sketches (graphite + one accent color each) plus a few photographs and physical clues in pinned evidence bags. Red string for player-made connections; gold string for confirmed deductions; a single green string for the grape thread (players who notice this feel like geniuses).

**Node types:** PEOPLE (sketch portraits) · PLACES (sketch vignettes) · OBJECTS (sketches or bagged physical clues) · TESTIMONY (notebook pages, Gary's shorthand) · PHOTOGRAPHS (Warren's, plus Gary's own) · QUESTIONS (index cards in Gary's handwriting — these are the "sockets" deductions plug into).

**Connection mechanic:** Drag string between any two nodes. Wrong pairs: the string sags and Gary murmurs a gentle nope (*"No... those two don't rhyme."* — never punishing, occasionally funny, 40+ unique wrong-pair barks). Right pairs: string pulls taut, gold flash, deduction card typewriters itself onto the board.

**Master deduction list (gates in bold):**

| # | Inputs | Deduction | Gates |
|---|--------|-----------|-------|
| D1 | Empty Vault + Unforced Lock | Emptied before ceremony, by key | **Day 2** |
| D2 | Backwards Key + Dust Outline | Someone borrowed the council key recently | Poppy convo 2 |
| D3 | Poppy's Checklist + Empty Vault | Theft window = final two nights | **Day 3** |
| D4 | Margie's Testimony + Warren's Speech + Lighthouse Folio | Warren wanted OUT, not power — cleared | Warren convo 3 |
| D5 | Night Photograph + Margie's lodger gossip | Figure at monument = the inn's stranger | **Day 4 stakeout** |
| D6 | Ferris's Testimony + D1 | Insider with legitimate key access | **Day 5** |
| D7 | Seal Sketch + Prudence's ID | The sealed envelope bears the Vale family signet | Manor access |
| D8 | Prudence + Evelyn's confirmation | Curator cleared; romance thread opens | Evelyn scene |
| D9 | Clara Clue 3 + Ida's Ledger | MEANS — one key unaccounted for, family-held | Night 6 |
| D10 | Clara Clue 1 + The Overheard Conversation | MOTIVE — fear of disinheritance, not greed | Night 6 |
| D11 | Milo's Sighting + Ferris's Testimony | OPPORTUNITY — the umbrella crossing, 2 a.m. | Night 6 |
| D12 | Wax Fragment + Seal Sketch | PHYSICAL PROOF — he handled the will | Night 6 |
| D13 | D9 + D10 + D11 + D12 | **FINAL: It was Julian — hiding, not stealing** | **Day 7** |

**Anti-frustration:** If the player stalls >4 minutes on a required night, the badge glints (Ask Grandpa available). Grandpa hints name a *node*, never a pair: *"Grandpa always said: when you're lost, re-read the witness who was most embarrassed."*

---

# 7. RECURRING THREADS

## 7.1 The Grape Thread (one beat per day, never underlined)
| Day | Beat |
|-----|------|
| 1 | Gino hoists a flawless bunch: "The good ones, just in!" Gary, walking past, a half-second too slow: "...Not today." |
| 2 | The grape-shaped stress ball debuts on Gary's desk. It migrates around the apartment nightly. Examining it: "It's therapeutic. It's THERAPEUTIC." |
| 3 | Otto's counter bowl. Gary, to no one: "Raisins count. Everyone acts like raisins don't count. Raisins count." |
| 4 | Stakeout. Ferris, sharing rations in the dark: "Grape?" Longest silence in the game. "...I'm working." |
| 5 | The Archive: a 200-year-old still life, *Grapes in Lamplight*. Gary stands before it slightly too long. Prudence: "It's not for sale." Gary: "I know what it is." |
| 6 | Vale Manor fruit basket during the hardest interview of his life. The camera keeps it in frame. Gary keeps it in peripheral vision. He does not break. |
| 7 | Victory beat: Gino offers the celebratory bunch. Gary takes ONE grape, looks at it, and hands it to Milo. "You earned it, kid." (He is at peace. Ish.) |
| Credits | Grandpa's capsule package contains, among the treasures, a sealed jar of homemade grape jam labeled in Gary Gibbons's hand: **"For emergencies."** It's hereditary. Gary laughs until he cries, for several reasons at once. |

## 7.2 The Grandpa Thread
- **The badge** = diegetic hint system ("Ask Grandpa") and Gary's thinking tell.
- **One Grandpa memory per day**, mostly via Dot: Day 1 "Gary Gibbons filed from a rowboat once." → Day 6 "You know what your grandfather never did? Publish angry." 
- **Payoff:** the credits letter (§8.4). Grandpa's keepsake — a brass magnifying glass engraved ***"Look closer, then look kinder."*** — becomes Gary's series-permanent tool: in future games, the "observe" mode UI is literally this magnifying glass.

---

# 8. THE FINAL ACT — COMPLETE SCRIPTS

## 8.1 Beatrice — "Not Mine to Tell" (Day 6, Vale Manor parlor)

*(Tea already poured. Two cups. She was expecting him.)*

**B:** Sit, Mr. Gibbons. You've been walking a spiral all week, and spirals end at their center. Ask.
**G:** Did you take the contents of the capsule?
**B:** No.
**G:** Do you know who did?
**B:** *(a pause exactly one breath long)* I have a fear. A fear is not knowledge. I won't dress it up as one for your notebook.
**G:** Then tell me about the will.
**B:** I read it. Ten years ago, the night before Edmund sealed it away. *(she turns her cup a quarter turn)* That is all the further I will go. It is not mine to tell. It was his last act, and I will not spend it for him.
**G:** *(gently)* Mrs. Vale. Something started this. Something small. In my experience it's always something small.
**B:** *(long look; she decides he's earned a true thing)* ...Five nights before the ceremony, in the garden, my daughter said something to me that broke my heart a little. She said, "It isn't fair. Everyone already knows he'll lead." And because I could not tell her what I knew, I gave her the only true thing I had that wasn't a secret. I said: *"You may be surprised."*
**G:** *(inner, everything clicking at once)* A comfort to one child. A verdict overheard by the other.
**B:** *(watching his face)* You've just understood something. I can see it land. *(quietly)* Be careful with it, Mr. Gibbons. Whatever it is — it's carrying one of my children.
**G:** *(stands; at the door, he stops)* Mrs. Vale. My grandfather had a rule about stories like this one. "Truth with compassion. In that order — and no other."
**B:** *(the first small smile)* Then Gary Gibbons raised you correctly. Good evening.

`[BOARD: THE OVERHEARD CONVERSATION · BEATRICE READ THE WILL]`

---

## 8.2 The Boathouse — Confrontation (Day 7)

*(River morning. Mist. Clara waits at the bank — "I'll be here. For after." Gary goes in alone. Julian is already there, sitting on the floor, umbrella against the wall, spinning the ring. He doesn't look up.)*

**J:** You knock on every door in the district for a week, and then you find the one place without a door. *(hollow half-laugh)* Front page?
**G:** Not yet. Not maybe.
**J:** Then present your case, reporter. I've watched you build it all week. You may as well perform it.

*(EVIDENCE PRESENTATION — the player presents in any order; each lands with quiet weight, no Ace Attorney bombast:)*
- **THE WAX FRAGMENT:** "Green wax, from your coat pocket. It matches a seal a witness saw intact three nights before the ceremony. Whoever broke it, handled the will after the capsule was checked."
- **THE BACKUP KEY:** "Two keys in fifty years. Ida Wren's ledger. The council's key is accounted for every hour. The family's key is missing from your father's study."
- **THE SIGHTING:** "Two in the morning, night before the ceremony. A tall figure crossed the square, dry under one particular umbrella." *(Julian glances at it against the wall. The silver duck handle. He closes his eyes.)*

**J:** *(very quietly)* You're missing why.
**G:** No. I'm not. *(sits down on the floor across from him — this staging matters)* You heard your sister in the garden. "It isn't fair." And your mother said, "You may be surprised." And you stood at the study window and did the arithmetic of half a conversation, and the answer you got was: *I'm about to lose everything.*
**J:** *(the composure finally goes)* I wasn't going to KEEP it. Any of it. I was going to read the will — just read it, just KNOW, before the whole district watched my face while a stranger's future was read out over my head. And then I had it in my hands and I couldn't— I couldn't even open it. I've had it for five days and I can't open an envelope, Gary. Some leader. *(laughs, awful)* You know the joke? Half of me was terrified of losing it. The other half was terrified I'd have to do it. Alone. I am not enough for that chair alone, and everyone keeps saying "alone" like it's a coronation—

**G:** Julian. Can I tell you a story your sister told me?
**J:** ...What?
**G:** The birthday puzzles. One box, two children. Your father built every single one so that neither of you could open it alone. Your mad sideways ideas. Her logic finding the flaw. Every year. Every box. Clara said she used to think it was a game. *(beat)* She thinks now it was a syllabus.
**J:** *(stillness; the ring stops spinning)* ...He was teaching us to—
**G:** I haven't read the will. Nobody has. But I've spent a week learning who your father was from everyone who loved him, and I'd stake Grandpa's badge on this: that envelope doesn't take the future away from either of you. I think it refuses to give it to only one of you.
**J:** *(breaks — quietly, face in his hands)* I emptied fifty years of this town's heart into a hole in the floor because I couldn't finish overhearing a conversation.
**G:** *(gently)* Yeah. And tomorrow that can be the worst thing you ever did — behind you, and getting smaller.

*(Julian pries up the floorboards. Everything is there — the crates, the children's bundles, and on top, the green-sealed envelope, cracked but unopened.)*

**J:** *(handing it up, not letting go for one second)* You could have led with the constable.
**G:** Grandpa's rule. Truth with compassion. In that order — and no other.

*(Outside: Clara on the bank. Brother and sister look at each other. Nobody scripts this part; a long shot, the river, and she walks to him. Tuck arrives, formally "recovers" the contents, and — after a look at the siblings and at Gary — writes in his notebook, out loud: "Contents located. Returned intact. The rest is district business, not police business.")*

---

## 8.3 The Reading & Reconciliation (Founders' Square, evening)

*(The whole cast assembled — every NPC gets a reaction beat. Warren opens the envelope, scans it, and — beautifully — starts to laugh, then hands it to Beatrice: "It should be your voice.")*

**BEATRICE:** *(reading)* "To my district, and to my children, who will hear this together, which is the entire point. Julian: you are the lantern — you make people believe the dark is temporary. Clara: you are the ivy — you hold what would otherwise fall. I never once built a puzzle either of you could solve alone. I was never going to start with the hardest one. Lead together. Argue often. Decide once. — Edmund Vale."

*(Reaction cascade: Clara's composure finally cracking; Julian looking at his sister like the answer to a puzzle; Warren already mentally at lighthouse #1; Poppy sobbing into contingency card PLAN A: JOY; Ferris nodding sagely, "Ferris Mott suspected co-treasure"; Prudence clutching a second envelope Tuck has quietly passed her — Theodora's letter, at last; Evelyn's hand on her shoulder.)*

**WARREN:** *(to the square, glowing)* Then it is my genuine honor to say the happiest sentence I will ever say: **the waiting is over.** *(beat, softer)* I hear the coast is lovely this time of year.

## 8.4 Credits Sequence — The Capsule, Properly Opened

*(Days later. Small gathering. Items are drawn out one by one over the credits — the town's children of fifty years ago: a drawing of "LANTERNSIDE IN THE FUTURE (flying trams, a mayor who is a dog)"; a prediction card: "In 50 years everyone will have a personal robot. If not, we apologize."; a kid's lost tooth "for science"; Theodora's letter, which Prudence reads privately, and the game shows us only her face, and Evelyn's hand.)*

*(Last: a small parcel in oilcloth, addressed in strong pencil: FOR THE GIBBONS WHO COMES NEXT.)*

**THE FIRST GARY GIBBONS'S LETTER (voice-over, warm gravel):**
"If you're reading this, then one of mine grew up curious, and the badge found its way to you. Good. Now listen: the truth is not a trophy. It's a lantern. You don't win it — you carry it, and you mind whose eyes you shine it in. Ask the question under the question. Believe people are more than their worst night. And when the story is about someone's heart — and son, it is always, eventually, about someone's heart — tell the truth with compassion. In that order. And no other. — A.G."

*(In the parcel: Gary Gibbons's field notebook; a brass magnifying glass engraved "Look closer, then look kinder" — Gary's series-permanent tool; and the jar of grape jam, "For emergencies." Gary laughs until he cries. Final shot: the board, cleared of string, and in the center one fresh index card in Gary's hand: "NEXT STORY?" — cut to black.)*

**Post-credits stinger:** Ferris, tending the repaired community garden, unearths something with a metallic *clink*. He looks left. He looks right. "...Ferris Mott smells destiny." SMASH TO LOGO: *GARY GIBBONS WILL RETURN.*

---

# 9. IMAGE GENERATION PROMPTS

## 9.1 The Master Style Prompt (begin EVERY prompt with this, verbatim)

> **MASTER STYLE PROMPT:** A cozy anthropomorphic animal world inspired by 1930s–1950s Europe, with warm watercolor and gouache storybook illustrations, expressive Disney-quality animal characters (Zootopia-inspired proportions), hand-drawn ink linework, textured paper, soft golden-hour lighting, rounded architecture, muted earthy color palette, vintage clothing, visible brush strokes, lived-in environments, charming details, and a handcrafted feel. Avoid realism, anime, cyberpunk, noir, glossy rendering, or modern elements. Every scene should feel warm, hopeful, and full of quiet stories waiting to be discovered.

For character sheets append: *"Character reference sheet: full-body front view, 3/4 view, and three facial expressions (neutral, surprised, warm smile), plain warm-cream textured-paper background, no environment."*
For locations append: *"Wide establishing shot, no characters unless specified."*

## 9.2 Character Prompts

**GARY GIBBONS:** [MASTER STYLE PROMPT] An anthropomorphic gibbon investigative reporter, late 20s — long-limbed and lanky, sandy-brown fur, dark expressive face with scruffy cheek fur, warm tired brown eyes, kind and slightly anxious expression. Rumpled brown tweed jacket with elbow patches, loosened mustard knit tie, heavy leather satchel stuffed with notebooks, a pencil tucked behind one small round ear, a tarnished brass vintage press badge pinned inside the lapel. Color story: browns and mustard with a plum accent.

**JULIAN VALE:** [MASTER STYLE PROMPT] An anthropomorphic young red deer stag, early 20s, tall and handsome in an untested way, **antlers still covered in soft velvet**, sleepless shadows under the eyes behind a rehearsed confident smile. Immaculate navy wool coat worn slightly like a costume, a silver signet ring too loose on one finger, holding an elegant black umbrella with a carved silver duck-head handle. Color story: navy and silver with a guilty green accent.

**CLARA VALE:** [MASTER STYLE PROMPT] An anthropomorphic young red deer doe, early 20s, sharp watchful dark eyes with warmth underneath, a drafting pencil tucked behind one tall ear. Practical oatmeal cardigan over an elegant inherited forest-green dress, holding a small book of logic puzzles, dry knowing expression. Color story: oatmeal and forest green.

**BEATRICE VALE:** [MASTER STYLE PROMPT] An anthropomorphic elderly red deer doe, silvered muzzle, serene unreadable kind expression, posture of absolute composure. Dark plum dress, gardening gloves tucked in her belt, a small mourning brooch containing pressed ivy leaves. Color story: plum and silver.

**POPPY FINCH:** [MASTER STYLE PROMPT] An anthropomorphic tiny goldfinch, mid 20s, yellow-and-black feathers slightly frazzled, three pens stuck through her head-feathers, oversized round glasses fogged with panic, cheerful overwhelmed expression. Clipboard held like a shield, lanyard of laminated colored contingency cards. Color story: goldfinch yellow, coral, and sky blue.

**WARREN HOLT:** [MASTER STYLE PROMPT] An anthropomorphic sturdy badger, early 60s, barrel-chested, grey-streaked fur with magnificent whiskers, kind melancholy eyes, reading glasses on a chain. Tweed waistcoat under a slightly embarrassing ceremonial gold sash, holding an antique wooden bellows camera. Color story: slate grey and ceremonial gold.

**FERRIS MOTT:** [MASTER STYLE PROMPT] An anthropomorphic wiry weasel, early 40s, long low silhouette, delighted conspiratorial grin, magnificent groomed russet tail carried like a prize. Brass goggles pushed up on a battered hat, long coat lined with rolled maps and trowels, holding a bent curtain rail like a divining rod. Color story: rust and moss.

**PRUDENCE MARLOWE:** [MASTER STYLE PROMPT] An anthropomorphic tall grey heron, late 50s, patient precise bearing, expression of stern scholarship melting into romantic excitement. Ink-stained wingtip fingers, a jeweler's loupe worn as a pendant, a much-patched fern-green cardigan, arms full of ribbon-tied letter bundles. Color story: heron grey, fern green, ink blue.

**MARGIE PLUM:** [MASTER STYLE PROMPT] An anthropomorphic plump hen, early 60s, warm feathers dusted with flour, terrifyingly perceptive fond smirk, wings on hips. Apron over a plum dress, tea towel over one shoulder. Color story: plum and flour white.

**OTTO KESSLER:** [MASTER STYLE PROMPT] An anthropomorphic enormous gentle brown bear, mid 40s, serene half-smile, holding a comically tiny espresso cup in one huge paw. Canvas apron with coffee-plant embroidery. Color story: espresso brown and cream.

**DOT RAMIREZ:** [MASTER STYLE PROMPT] An anthropomorphic compact wire-haired terrier, mid 50s, grey-muzzled, expression of affectionate impatience, reading glasses pushed up between her ears, a red pen behind each ear, rolled shirt sleeves with ink smudges. Color story: newsprint grey and editor red.

**IDA WREN:** [MASTER STYLE PROMPT] An anthropomorphic tiny wren, mid 70s, bright clever eyes, magnifying visor flipped up, leather work apron full of miniature locksmith tools, holding an ornate antique key up to the light as if soothing a shy animal. Color story: brass and walnut.

**GINO PUGLISI:** [MASTER STYLE PROMPT] An anthropomorphic big boar, mid 60s, joy incarnate, mid-gesture of operatic triumph, striped market apron, holding aloft a flawless bunch of green grapes like a sacred offering. Color story: market-stripe green and tomato red.

**MILO TANAKA:** [MASTER STYLE PROMPT] An anthropomorphic raccoon kit, 11 years old, natural mask markings, gap-toothed determined grin, homemade cardboard-and-brass telescope under one arm, notebook labeled "CRIMES?" in marker, magnifying glass in breast pocket, sneakers with mismatched laces. Color story: raccoon grey with primary red and blue.

**EVELYN CROFT:** [MASTER STYLE PROMPT] An anthropomorphic red fox, late 40s, calm wry amused expression, russet fur, a single ivy sprig tucked behind one ear. Canvas work apron, secateurs holstered like a gunslinger, paws in a bundle of autumn flower stems. Color story: fox russet, sage, and dusty rose.

**CONSTABLE BRAM TUCK:** [MASTER STYLE PROMPT] An anthropomorphic basset hound constable, early 50s, magnificently unhurried, heavy-lidded eyes that miss nothing, long ears, slightly rumpled vintage constable uniform, half-eaten pastry in paw, leaning on a gas lamppost as a lifestyle. Color story: constable blue and pastry gold.

**GARY GIBBONS THE FIRST (flashback/portrait):** [MASTER STYLE PROMPT] Sepia-toned memory illustration, softer dreamlike watercolor edges: a weathered charismatic elderly gibbon reporter, silver-flecked fur, fedora with a brass press badge on the hat band, rolled shirtsleeves, laughing mid-story, warm gravelly presence.

## 9.3 Location Prompts

**GARY'S APARTMENT (hub):** [MASTER STYLE PROMPT] Interior, night: a cozy cluttered attic apartment above a newspaper office. Sloped ceiling, rain on a round window, desk lamp pooling amber light, kettle steaming, a wall-sized corkboard covered in pinned graphite sketches connected by red string, a grape-shaped stress ball on the desk, a brass press badge in a place of honor. Warm, safe, thinking-space atmosphere.

**FOUNDERS' SQUARE & MONUMENT:** [MASTER STYLE PROMPT] Exterior, golden hour: a cobbled town square ringed by leaning old houses and unlit gas lanterns, festival bunting overhead, a stone monument with an open brass vault door at its base revealing an empty dusty chamber, scattered confetti, a crowd's absence felt. Bittersweet festive-gone-wrong atmosphere.

**THE PERCOLATOR:** [MASTER STYLE PROMPT] Interior, morning: a snug café with mismatched wooden chairs, a gleaming copper espresso machine, chalkboard menu reading "THE EMPTY ESPRESSO — nothing in it, like the capsule," steam and window light, a bowl of green grapes on the counter catching the light ominously.

**THE DROWSY LANTERN:** [MASTER STYLE PROMPT] Interior, evening: a low-beamed inn common room, crackling hearth, brass lanterns, a curved bar with one sherry glass, a guest register open on the counter, stairs up to lodger rooms, one door slightly ajar spilling maps and rope into the hallway.

**LANTERNSIDE ARCHIVE:** [MASTER STYLE PROMPT] Interior, afternoon shafts of dusty light: a small museum-archive with towering document shelves, glass display cases, ribbon-tied letter bundles, a half-assembled exhibit of two portraits facing each other across a gap, a 200-year-old still-life oil painting of grapes in lamplight on one wall.

**VALE MANOR:** [MASTER STYLE PROMPT] Interior, late afternoon: a dignified but lived-in manor parlor, ancestral portraits, tea service for two already poured, tall windows onto a walled garden with an old stone table, a fruit basket prominent on a sideboard, an atmosphere of held breath.

**MARKET ROW:** [MASTER STYLE PROMPT] Exterior, midday bustle: a narrow cobbled market street — a fruit stall overflowing with grapes, a tiny locksmith shopfront ("WREN & WICK") with ten thousand labeled drawers visible inside, a flower shop spilling autumn blooms, striped awnings, string lights between buildings.

**THE OLD BOATHOUSE:** [MASTER STYLE PROMPT] Exterior + interior, misty river morning: a weathered wooden boathouse on a quiet riverbank, pale mist on the water, reeds; inside, dust motes in slatted light, an upturned rowboat, pried-up floorboards revealing carefully stacked crates and bundles, one green-wax-sealed envelope on top. Melancholy, tender atmosphere.

## 9.4 Key Props & UI

**THE SEAL SKETCH:** [MASTER STYLE PROMPT] A graphite pencil sketch on a torn notebook page, pinned to cork: a wax seal design of a lantern encircled by ivy leaves with three wax drips, drawn with reporter's urgency, one corner coffee-stained. Single accent color: deep green on the wax.

**THE WAX FRAGMENT:** [MASTER STYLE PROMPT] Macro illustration: a small broken fragment of deep green sealing wax in a pinned evidence bag, showing partial ivy-leaf impression, lit dramatically by lamplight against cork board texture.

**THE NIGHT PHOTOGRAPH:** [MASTER STYLE PROMPT] A vintage long-exposure photograph, silver-print tones: a night square with lantern light smeared like honey, the monument in shadow, and at the frame's bottom-left edge a motion-blurred weasel tail mid-stride. Mysterious, accidental-evidence feel.

**THE INVESTIGATION BOARD (full UI mock):** [MASTER STYLE PROMPT] Game UI illustration: a wall-sized corkboard filled with graphite character sketches, location vignettes, evidence bags, index cards with typewriter text, connected by taut red string and a few glowing gold strings, one lone green string leading to a tiny sketch of grapes in the corner. Warm desk-lamp lighting from below.

**THE VALE UMBRELLA / GRANDPA'S PARCEL / GRAPE STRESS BALL:** individual prop cards in the same format — silhouette-first, one accent color, cork background.

---

# 10. BEYOND THE OUTLINE — ADDITIONS & GAME TWO HOOKS

**Additions made (and why):**
1. **"The Founder's Addition" ceremony (10 years ago)** — fixes the timeline (a 50-year-old capsule can't contain a will naming children who are only now of age) and gives the town a shared memory to reference.
2. **"Ask Grandpa" badge hint system** — turns the hint button into characterization.
3. **Dot's morning pressure-test** — a diegetic recap/save-summary so returning players re-orient in 20 seconds.
4. **Milo's secret-for-a-secret trade** — makes the opportunity witness a scene about trust, and pays the grape thread into the plot exactly once.
5. **The Theodora/Jonah letter payoff** — the capsule's recovery matters to someone besides the Vales; Prudence's 20-year vindication lands during credits, wordlessly.
6. **Tuck's "district business, not police business"** — keeps the cozy contract: no arrest, consequences are communal and restorative (Ferris repairs the garden; Julian faces the town, not a court).
7. **Edmund's will as lantern/ivy metaphor** — the seal itself encodes the answer (lantern = Julian, ivy = Clara, inseparable). Sharp-eyed players can solve the THEME from Day 2.
8. **The animal world (v1.3 species pass)** — Lanternside is an anthropomorphic animal district (Zootopia proportions, 1930s–50s European storybook, watercolor/gouache). Species assigned throughout §4; the weasel photo clue is now literal (Ferris is the district's only weasel); Julian's velvet antlers and the umbrella that hides them are canon; the Vale/Croft rivalry is deer/fox; the Pigeon Rule governs ambient wildlife.

**Game Two hooks planted:** Ferris's post-credits *clink* in the garden · Warren's postcards from lighthouses (returning pen-pal NPC) · Gary Gibbons's field notebook contains one unfinished story marked "COULDN'T CRACK IT — MAYBE YOU" · the magnifying glass as the new observe-mode UI · Prudence & Evelyn's joint exhibition opening "next spring."

---

*End of document — Gary Gibbons: The Empty Capsule, v1.0.*

---
---

# PART II — GAMEPLAY ELEVATION PASS (v1.1)

*Scope note: nothing in Part I changes. The mystery, culprit, ending, themes, board concept, grandfather thread, grape thread, and tone are locked. Everything below is additive: mechanics, texture, pacing, and systems. Every item uses the production format: **Why · Where · Pacing · Status (Required/Optional) · Example.***

---

# 11. THE UNIFYING DESIGN THESIS

> ### "Detectives accuse. Reporters verify."

Every new mechanic in this pass answers one question: *what does a reporter do that a detective doesn't?* A detective's verbs are interrogate, deduce, accuse. A reporter's verbs are **listen, observe, research, verify, and publish.** Those five verbs are the game's five mechanical families:

| Verb | Mechanical family | Section |
|------|-------------------|---------|
| LISTEN | Interview system, testimony cards, cross-checking | §12.1, §16.4 |
| OBSERVE | Sketch-from-memory, photography, environmental reading | §12.2–12.4, §13 |
| RESEARCH | The Ledger Morgue (newspaper archive), handwriting, old maps | §12.5, §15.2 |
| VERIFY | Source verification — the signature system of the whole game | §12.6 |
| PUBLISH | The Evening Edition, headlines, town reaction | §15.1 |

**The one-sentence pitch to the team:** In every other mystery game, evidence is true the moment you pick it up. In Gary Gibbons, *testimony is a rumor until you verify it* — and verification is where the puzzles live.

---

# 12. NEW CORE MECHANICS — THE REPORTER'S TOOLKIT

## 12.1 The Interview System — "Three Ways to Ask"

- **Why:** Conversations are 60% of the runtime; they must be *play*, not menus. This adds texture without branching hell, and characterizes Gary as a listener.
- **Where:** All flagged interviews (2–4 per day). Casual chats stay simple.
- **Pacing:** Turns the longest activity into the most active one. No change to scene length; large change to engagement.
- **Status:** REQUIRED (core).
- **Design:** During interviews Gary can respond in one of three stances, each with its own button and notebook icon:
  - **PRESS** (the direct question) — fastest route to facts; some characters shut down. Poppy melts, Clara respects it, Beatrice deflects it perfectly every time (running gag: the PRESS button visibly *wilts* in her scenes).
  - **EMPATHIZE** (the personal question) — unlocks the personal layer; the only route to Clue-3-tier reveals for Warren, Clara, Julian.
  - **OBSERVE** (say what you see) — Gary names a physical tell instead of asking. Requires the player to have *noticed* the tell in the scene (ring-spinning, fogged glasses, the quarter-turned teacup). The most rewarding stance; never required, always the best line in the scene.
- **Failure model:** cozy. Wrong stance never loses information permanently — it reroutes it. Press Beatrice and she ends the interview politely; the same fact resurfaces later at higher emotional cost (you get the fact from Clara instead, and Clara now knows you pressed her mother).
- **Example (Warren, Day 3):**
  - PRESS: "Did you want to keep the chair?" → W: "No." *(true, closed, scene ends colder)*
  - EMPATHIZE: "Eight years is a long time to keep someone else's seat warm." → unlocks the lighthouse folio.
  - OBSERVE *(if player noticed him cleaning already-clean glasses)*: "You've cleaned those glasses three times since I said his name." → W: *(long pause)* "...You're Gary Gibbons's, all right. Sit down, Mr. Gibbons."

## 12.2 Sketch From Memory (expanded from Part I's seal minigame)

- **Why:** It's already the game's most distinctive beat (the seal). Promote it from one scene to a system: Gary's sketches ARE his evidence format, mechanically as well as visually.
- **Where:** 6–8 instances: the seal (Day 2, tutorializes), Ferris's boot tread (Day 4), the umbrella's duck handle from Milo's description (Day 6), the vault's dust layout (Day 2, §13.2), plus side-story uses.
- **Design:** Witness describes; the player assembles the sketch from a small palette of shape-parts while the description replays ("the lantern was *inside* the ivy, not on top of it"). Accuracy is graded silently (2–4 salient features). An imperfect sketch still pins to the board — but later *matching* puzzles are easier with better sketches, so care is its own reward. Never fail-state.
- **Pacing:** A 60–90 second hands-on beat that lands mid-conversation — the single best tool for breaking up talk-heavy stretches.
- **Status:** REQUIRED (core).
- **Example (Day 6, Milo):** Milo describes the umbrella handle: "It was a duck. But a FANCY duck. Like a duck that owns a boat." Player sketches from parts; picking the plain duck gets Milo's gentle correction: "No no — fancier. Boat-owning."

## 12.3 Photography — Warren's Loaner Camera

- **Why:** Deepens Warren's arc (his art becomes Gary's tool), adds a second evidence format (photos = objective, sketches = interpretive — a quiet theme), and powers the then-and-now environmental puzzles (§13.3) and the lantern collectibles (§19.2).
- **Where:** Warren lends Gary the bellows camera at the end of Day 3, Conversation 3: *"You have your grandfather's eye for people. Borrow mine for places."* Available Days 4–7 and post-game.
- **Design:** A framed photo mode with three uses: (1) capture evidence states (Ferris's holes, the pried floorboards); (2) THEN & NOW overlay puzzles — align an old photograph with the modern viewpoint (ghost-image slides into place, satisfying *thunk*); (3) collectible lanterns. Photos print overnight on the apartment line (nice ambience: Night phase now has photos drying above the board).
- **Pacing:** Optional in most uses; required for exactly two puzzles (§13.3, §13.4). Adds a "heads-up, look-around" verb to outdoor traversal.
- **Status:** REQUIRED (light) — camera exists and gates two puzzles; everything else optional.

## 12.4 Following Physical Traces

- **Why:** The outline promised "observing small details"; this makes detail-reading a verb, always diegetic, never CSI.
- **Where:** Three authored sequences: boot-tread tracking (Day 4 stakeout — follow Ferris's distinctive holed-sole prints from garden to riverbank; teaches the mechanic comedically); wax scrapings on the vault lip (Day 2 — observing where green wax flaked proves the sealed envelope came out *last*, i.e., handled deliberately); ivy transfer (Day 6, optional — crushed ivy on the boathouse path matches the manor garden's variety; a bonus corroboration for thorough players, foreshadowing the hiding place a day early).
- **Pacing:** Short (2–3 min) traversal-with-attention beats between conversations.
- **Status:** Ferris sequence REQUIRED; others OPTIONAL corroboration (they pre-verify Night 6 cards, softening the hardest board night for players who did the legwork — invisible difficulty tuning).

## 12.5 Old Maps, Old Papers (research verbs)

- **Why:** Reporters live in archives. Also the delivery vehicle for lore, side stories, and the Theodora thread.
- **Where:** Two venues: the **Ledger Morgue** (§15.2, newspaper archive under the office) and the **Lanternside Archive** (Prudence's domain — maps, ledgers, letters).
- **Design highlights:** Ferris's stolen 1890s survey map (recovered Day 4) becomes a *player tool*: overlay it on the modern district map to find three "ghost locations" that no longer exist — one is the original Vale boat landing, which is how a thorough player can find the boathouse's significance before Day 7. Handwriting comparison lives here too (side story §17.5): match a signature across ledger pages by three authored features (the looped G, the crossed double-t, the pressure of the pen), not pixel-hunting.
- **Pacing:** Self-paced, quiet, cozy — the "rainy afternoon" activity. Deliberately unhurried music.
- **Status:** OPTIONAL venues with one REQUIRED touch each (Day 5 seal reference lookup; Day 3 morgue lookup of The Founder's Addition coverage, which is how the player learns the 10-years-ago ceremony existed).

## 12.6 SOURCE VERIFICATION — the signature system

- **Why:** This is the mechanical identity of the franchise. Testimony enters the board as an UNVERIFIED card (pencil sketch border, slightly askew). Verifying it — with a document, a second witness, or an environmental check — upgrades it to VERIFIED (inked border, gold pin, satisfying stamp animation: Gary's own rubber stamp, "CONFIRMED — G.G."). **Final deductions require verified cards.** Detectives accuse; reporters verify.
- **Where:** Everywhere, from Day 2 on. Each core testimony has exactly one authored verification route (some have a second, optional, for flexibility).
- **The showpiece — Verifying Milo (Day 6):** Milo claims he saw the umbrella from his fire escape at 2 a.m. A good reporter checks whether the kid *could have*. Environmental puzzle: stand on Milo's fire escape at night, use the camera's viewfinder, and check the sightline — a chimney blocks half the square... but not the lantern-lit strip by the monument. The player confirms the vantage works *and* discovers why Milo saw only the umbrella, never the face: from above, the canopy hides everything — including what would otherwise be the most identifiable silhouette in Lanternside, a stag's antlers. Verification and explanation in one puzzle. Milo's card upgrades; Milo, watching Gary check his story instead of dismissing it, gets his best line: **"You believed me enough to check. That's better than just believing me."** *(This sentence is the whole game.)*
- **Pacing:** Converts "collect clue → walk home" into "collect claim → earn it." Every verification is a small puzzle, so puzzle density rises exactly where talk density is highest.
- **Status:** REQUIRED (core, franchise-defining).

---

# 13. ENVIRONMENTAL PUZZLES (organic, per location)

*Rule for all: the puzzle must be something a real person in that spot could genuinely reason about. No sliding tiles, no colored levers.*

1. **The Vault's Dust Library (Founders' Square, Day 2 — REQUIRED).** The empty vault's floor holds dust voids — clean rectangles where items sat for decades. Player matches voids against Poppy's laminated checklist (crate here, letter bundle there). Two payoffs: the topmost void has a *sharp* edge (removed recently and carefully — not ransacked: this thief was gentle, an early tonal clue that the player feels before the story says it), and the wax scrapings sit on the lip (§12.4). *Pacing:* the Day 2 centerpiece between Poppy conversations.
2. **Then & Now: The Founding Photograph (Square, Day 3 — REQUIRED, teaches photo overlay).** Align Warren's 50-year-old founding-day photograph with the modern square. The ghost image reveals the monument's dedication plaque was later *moved* to accommodate The Founder's Addition — which is the environmental breadcrumb that sends Gary to the morgue to read about that ceremony. Lore delivered by aligning a camera, not by a lecture.
3. **The Fire-Escape Sightline (Milo's alley, Day 6 — REQUIRED).** §12.6 showpiece.
4. **The Ghost Landing (Archive map overlay, Day 4+ — OPTIONAL).** Ferris's recovered survey map over the modern map exposes the original Vale boat landing. Players who chase it get the boathouse a day early as a *location* (it's locked; Gary muses: "A family place. The kind of place you'd go to feel safe.") — brilliant-feeling foreshadowing, zero spoilage.
5. **Reading the Boathouse (Day 7 — REQUIRED, no UI).** The confrontation room is itself environmental storytelling to be read before Julian speaks: two child-height initials carved in a beam (J+C), a shelf of small wooden puzzle boxes, one recent scuff line where floorboards were dragged, one dry umbrella. Observing all four before initiating dialogue adds Gary's quiet inner line: *"He didn't hide it somewhere clever. He hid it somewhere loved."* (Missable; devastating; replay bait.)
6. **The Percolator Chalkboard (daily — ambient puzzle-adjacent).** Otto's specials encode the town's mood and occasionally a soft hint ("Today: The Two-Key Cortado"). Sharp players learn to read it like a stock ticker.
7. **The Manor Garden Table (Day 6 — OPTIONAL).** The stone table where the overheard conversation happened. Standing at the study window above it demonstrates the acoustics: you can hear the garden *only when the wind drops* — physically explaining the half-heard conversation. Verification puzzle for Beatrice's account; upgrades the MOTIVE chain before Night 6.

---

# 14. LIVING LANTERNSIDE

- **Why:** The player must love the district by Day 3 so the empty capsule feels like *their* loss too. Life is texture + schedules + weather.
- **Status:** REQUIRED as a system; individual vignettes optional content.

## 14.1 The District Clock & NPC Schedules
Three day-states (Morning / Midday / Evening) with authored NPC placement — not simulation, *rotation*. Every named NPC has a 3-slot daily routine that shifts as the week progresses (schedule sheet per character in production appendix). Examples: Ida opens late Tuesdays ("the drawers need alphabetizing — they get ideas"); Warren feeds pigeons at 8 a.m. sharp, and by Day 6 the pigeons wait for him on the council rail; Margie beats rugs at noon, gossip radius 20 meters; Milo's schedule is school → CRIMES? patrol → fire escape. **Design rule:** every required conversation is reachable in at least two day-states, so schedules create life, never lockout frustration.

## 14.2 Weather as a Social Router
Light rain reroutes the district: outdoor NPCs pack into the Percolator and the Drowsy Lantern, creating unique crowded-room conversations that exist only in rain (Gino and Prudence arguing about whether grapes are "history"; Poppy laminating in a corner). One scheduled rain per run (Day 5 afternoon) plus one random-day chance. Rain remixes ambient dialogue — 30% of optional barks are weather-gated (replay value, §19).

## 14.3 The Skipping-Rope Rhyme (signature ambient storytelling)
Children skip rope in Market Row daily. **Their rhyme evolves with the town's gossip** — a Greek chorus in pigtails:
- Day 1: "Fifty years inside the stone / fifty treasures coming home—"
- Day 3: "Guardian, Guardian, whatcha gonna keep? / Empty box and a district to sweep—"
- Day 5 (post-Ferris): "Weasel dug a hole, hole had jam / weasel said sorry to the garden ma'am—"
- Day 7: "Lantern and the ivy grow / side by side in a see-saw row—"
Players who stop to listen each day get the mystery's emotional weather report. Missable, memorable, cheap to produce.

## 14.4 Ambient Vignette Library (production target: 40)
Two-line unscripted scenes on rotation, examples: Otto teaching Poppy to breathe using espresso timing; Tuck "testing" pastry vendors for compliance; Evelyn leaving a single flower on the Archive step each morning (players who track it: it's for Prudence — the game never says); Warren photographing the same lamppost daily ("It's a very consistent lamppost. I respect that."); two pigeons who have clearly divorced. Delivery: proximity-triggered, never repeated same-day.

## 14.5 Festival Decay & Recovery Arc (environmental pacing)
The bunting sags a little more each day the mystery stays open; flowers accumulate at the monument; shop windows shift from FESTIVAL! to hand-lettered support notes ("WE STILL LOVE YOU, LANTERNSIDE"). Day 7 flips it: the district re-decorates *during* the final act, so walking to the reading is a victory lap the player earned. The town is the mood ring.

---

# 15. THE REPORTER IDENTITY LAYER

## 15.1 The Evening Edition (headline system) — the second signature mechanic

- **Why:** Nothing differentiates Gary from every detective faster than this: **each night, before the board, Gary files copy.** The player's daily output isn't an accusation — it's an *article*. Publishing is the reporter's verb, and it gives the town a reason to visibly react to the player.
- **Where:** Every night, apartment, before the board phase (kettle → typewriter → board becomes the nightly ritual triptych). Takes 60–90 seconds.
- **Design:** Gary's draft is auto-assembled from the day's verified findings (another quiet reward for verification: unverified claims *cannot be printed* — Dot's iron law, stated Day 1: "We print what we know, Gibbons, not what we suspect"). The player makes exactly two choices:
  1. **The headline** — always three options on one axis: SENSATIONAL / MEASURED / COMPASSIONATE. ("GUARDIAN UNDER SUSPICION!" / "Questions Remain After Capsule Shock" / "A District Holds Its Breath, Together")
  2. **The kicker** — one closing line from three, which sets tomorrow's tone.
- **Consequence model (cozy, never punitive):** Headlines adjust a hidden per-NPC **Trust** value that flavors greetings, unlocks optional lines, and changes vignettes — it never gates required content. Sensational headlines make Margie thrilled and Clara frosty; compassionate ones do the reverse; the town *quotes your headlines back at you* the next morning (the payoff that makes the system feel alive: Otto's chalkboard riffs on whatever you printed).
  - Day 4 special case: after Ferris's arrest, the SENSATIONAL option ("WEASEL CAUGHT RED-PAWED!") is deliberately tempting and wrong — print it and Day 5 opens with Ferris quietly asking Gary to read it aloud to him in the lockup. He's not angry. That's worse. A gentle systems-taught lesson in the game's theme.
  - Day 7: the final article is composed from ALL week's choices — the game's ending "grade," expressed as journalism. (Replay driver, §19.)
- **Pacing:** Gives every day a narrative exhale before the board's inhale.
- **Status:** REQUIRED (core).
- **Example (Day 6 night — the hardest headline in the game):** The player now knows it's Julian. Options: "HEIR SUSPECTED IN CAPSULE THEFT" / "Investigation Nears Its End" / "Hold Tomorrow's Front Page." Choosing the third — printing *nothing* — is the correct compassionate play, and Dot's Day 7 morning line acknowledges it: "You held the page. Gary Gibbons held the page once too. I'll tell you about it when you're back." *(Players who print the sensational one still reach the same ending — but Julian has read it before Gary arrives at the boathouse, and his opening line changes: "Front page after all." Same scene, heavier heart. Replay conversation piece.)*

## 15.2 The Ledger Morgue (newspaper archive)

- **Why:** Fifty years of the district's life in bound volumes and clipping drawers — the lore delivery room, three side-story engines, and the home of Grandpa's ghost.
- **Where:** Basement under the Ledger office; unlocked Day 3 (Dot sends Gary down for The Founder's Addition coverage — REQUIRED touch); free access after.
- **Design:** Search by YEAR + SUBJECT drawers (deliberately tactile: pull drawer, thumb cards, unfold clippings). Authored contents, not procedural: ~35 readable clippings including the founding, the Addition, Theodora-era society columns ("Miss T.V. seen AGAIN at the Croft landing — we say nothing, we merely report"), decades of the first Gary Gibbons's bylines, and one drawer labeled in Gary Gibbons's handwriting: "STORIES THAT GOT AWAY" (Game Two hook, §10). Finding Gary Gibbons's clippings triggers optional badge-touch memories — the morgue is where the Grandpa thread lives spatially.
- **Pacing:** The game's designated quiet room. No music; just the clock and paper sounds. Players will spend an hour here voluntarily.
- **Status:** REQUIRED room, mostly OPTIONAL contents.

## 15.3 The Reporter's Notebook (auto-journal with a soul)

- **Why:** Recap tool that characterizes. Everything Gary learns is rendered in his handwriting with margin doodles; the notebook IS the quest log.
- **Design:** Auto-writes per scene; doodles unlock by witnessing optional moments (the divorced pigeons; Tuck asleep standing up; forty distinct unflattering pigeon caricatures — a collectible set, §19). Tabs: PEOPLE / PLACES / QUESTIONS / (hidden tab, discovered Day 4: GRAPES I HAVE KNOWN — the player finding this tab is the grape thread's mid-game laugh).
- **Status:** REQUIRED (UI backbone); doodles OPTIONAL.

## 15.4 Press Privileges (the badge as a verb)
Three authored moments where flashing the press badge (grandpa's badge — every use is a small invocation) opens a door politeness wouldn't: the council records room (Day 2), the lockup visit (Day 4), the archive's restricted cabinet (Day 5). Each use plays the same tiny ritual — Gary straightens it first. **Status:** REQUIRED, trivial cost, high identity value.

## 15.5 Vox Pop (street interviews)
Optional lightweight verb: ask any ambient NPC the Question of the Day (auto-set by the current Edition). Three-line micro-interviews; occasionally one contains a real lead (one vox pop on Day 5 mentions "the Vales' posh umbrella" unprompted — an alternate, missable route into Milo's thread). **Status:** OPTIONAL; converts the ambient crowd from scenery into sources.

---

# 16. INVESTIGATION BOARD 2.0

*The board grows physically across the week — Gary adds a second cork panel Day 4 ("borrowed" from the Ledger's break room; Dot's sticky note on it: "RETURN THIS. — D."). By Day 6 it wraps the corner of the room. Signature image of the game.*

## 16.1 The Timeline Rail — REQUIRED
A horizontal rail beneath the cork: slots from NIGHT −5 to CEREMONY. Event cards (from testimony) must be *placed in order* — and several arrive ambiguous ("a figure crossed the square... but which night?"). Placing a card requires an anchoring fact (Ferris: "night before the ceremony — Ferris Mott remembers because the moon was a coin"). **Night 6's centerpiece is completing the rail:** when the last card seats, the full hidden chronology (§3) plays as a silent animated sequence over the board — the player literally watches the week they reconstructed. Biggest "I did this" moment in the game.

## 16.2 The Suspect Ledger — REQUIRED
A ledger page pinned to the board's left edge: rows = suspects, columns = MOTIVE / MEANS / OPPORTUNITY, filled by dragging verified cards into cells. Clearing a suspect (Warren, Day 3) lets the player **stamp the row — "CLEARED — G.G."** — with Gary's inner line per stamp (*Warren: "Go count your lighthouses."*). Elimination made tactile and kind: clearing people feels as good as accusing. By Night 6 one row remains unstamped, and the player must sit with that for a moment before the final deduction. The ledger does the emotional work of the accusation without an accusation.

## 16.3 Theory Cards (competing hypotheses) — REQUIRED (light)
From Night 2, the board holds 2–3 face-up THEORY cards in Gary's hand-lettering ("AN OUTSIDER STOLE IT FOR PROFIT" / "SOMEONE PROTECTING A SECRET" / "IT WAS NEVER THERE AT ALL"). New verified evidence lets the player *retire* theories — a red stamp, "DIDN'T HOLD," and the card flips to the board's growing graveyard edge. **Why it matters:** wrong theories aren't punished, they're *honored as process* — the graveyard is a visible record of the player thinking like a journalist. Retiring the last wrong theory on Night 6 is the quiet click before the loud one.

## 16.4 Contradiction Desk — REQUIRED (used 3×)
Lay any two testimony cards on the desk blotter below the board; overlapping claims highlight. Three authored contradictions drive it: (Margie vs Warren's speech — resolved by the folio), (Ferris's "used a key" vs "Poppy had the only key" — resolved by Ida's ledger: *there are two*), (Milo's "2 a.m." vs an ambiguous rail placement). Finding a contradiction never says "OBJECTION!" — Gary just murmurs, *"These two can't both be the whole truth,"* and a QUESTION card is born. Contradictions *generate questions*, not gotchas: the reporter's version of the mechanic.

## 16.5 The Relationship Web — OPTIONAL panel
Second panel (Day 4+): portrait pins and relationship strings the player labels from a small verb set (LOVES / RESENTS / PROTECTS / OWES). Purely for the player's own modeling — with one exception: correctly stringing JULIAN—PROTECTS→? and being unable to fill the target until Day 6 is an authored ache. When the answer turns out to be EVERYONE'S MEMORIES (he hid it all, not just the will), the string relabels itself in the finale. One string. Huge payoff.

## 16.6 Morning Pitch (board-driven recap) — REQUIRED
Dot's daily pressure-test (Part I) becomes systemic: she asks two questions each morning and the player answers by *selecting board items* ("Sell me the window." → player picks Poppy's checklist + the empty vault). Diegetic recap, save-summary, and comprehension check in one scene, 45 seconds, fully skippable after first playthrough.

---

# 17. SIDE STORIES OF LANTERNSIDE (all OPTIONAL; one filed as a mini-Edition each)

*Format: Hook · Mechanics taught · Payoff · Fits where.*

**17.1 "The Red Pen Bandit" (Day 1 — the tutorial story, formalized).** Dot's red pens keep vanishing. Teaches: board basics, 4 pins, first deduction. Payoff: Milo's CRIMES? notebook, written entirely in red; Gary buys him his own pens; Milo becomes Gary's "junior stringer" for the week. *(This is also the missable setup that makes the Day 6 secret-trade land harder.)*

**17.2 "The Nose of Otto Kessler" (Days 2–3).** Otto's entering the regional roasting fair — with a head cold. He can't smell his own blends. Gary becomes his nose: an OBSERVE-stance interview where the player matches Otto's poetic descriptors to aromas ("tell me if it's more 'rain on warm brick' or 'library in autumn'"). Teaches: observation vocabulary used later in real evidence description. Payoff: the fair, a ribbon, and a permanent menu item — THE GIBBONS: "notes of tweed and stubbornness."

**17.3 "The Anonymous Handyman" (Days 3–5, emotional flagship).** For eight years, small things around Lanternside get quietly fixed overnight — a gate hinge, a cracked step, Milo's bike chain. Gary tracks the repairs (physical-trace mechanic: the same distinctive brass screws). It's Warren. He's been anonymously maintaining the district he wasn't sure he had the right to lead. **The payoff is a choice:** publish the heartwarming scoop, or keep his secret. Both endings are written; keeping it earns no reward except Warren, at the dock on Day 7, pressing a brass screw into Gary's hand: "For your board. File under 'stories that didn't need telling.'" *(Teaches the player the Day 6 "hold the page" instinct three days early — this side story is secretly a rehearsal for the game's hardest choice.)*

**17.4 "The Marrow Affair" (Day 4 morning).** Ferris's digging killed Gino's prize marrow — but Gino's rival gardener is suspiciously unbereaved. A ten-minute comic whodunit inside the whodunit (the rival had watered the marrow to death *weeks* ago; Ferris's hole merely exposed the crime). Teaches: footprint/trace reading BEFORE the stakeout needs it. Payoff: Gino's operatic forgiveness aria; the rivals co-plant a memorial vine. (Grapes. Of course it's grapes. Gary's face.)

**17.5 "The Unclaimed Key" (Days 3–6, the tearjerker).** Drawer 400 of Wren & Wick: a key, 40 years unclaimed, ticket signed illegibly. Handwriting-matching in the morgue's ledgers finds the owner: Margie's late husband. The key opens a music box he'd left for repair the month he died. Teaches: handwriting comparison, morgue search. Payoff: Margie, alone in the inn after close, letting it play; Gary quietly not filing this one either. Ida: "Locks are patient, Mr. Gibbons. So am I."

**17.6 "Milo's First Byline" (Days 5–6).** Someone's leaving fresh vegetables on doorsteps of struggling neighbors. Milo investigates; Gary mentors — the player runs the verification mechanic *as teacher*, approving or challenging Milo's claims. The doorstep gardener is **Beatrice Vale** — warming the player to her one day before her big scene. Payoff: Milo's two-sentence piece runs in the real Evening Edition with his name on it. He frames it.

**17.7 "The Whistler's Tune" (any day).** A street musician plays one melody nobody can name. Morgue research: it's "Theodora's Air," written for her fifty years ago — the Whistler learned it from his grandfather, who learned it from Jonah Croft. Feeds the curator thread; on Day 7, the Whistler plays it while Prudence reads the letter. No dialogue needed.

**17.8 "Plan Z" (Days 5–7).** Help Poppy design the Recovery Ceremony — three small logistics choices (route, music, who speaks first) that visibly manifest in the Day 7 finale. The player literally decorates their own ending. Payoff: Poppy's final contingency card, framed at her stall: "PLAN A: JOY."

**17.9 "The Divorced Pigeons" (running, Days 1–7).** Two pigeons, one lamppost, escalating silent drama tracked in notebook doodles. Day 7: reconciliation. One nest. Warren photographs it. The notebook's final doodle is Gary drawing them wearing tiny lantern and ivy costumes. Costs a week of an animator's affection; buys the internet.

---

# 18. PACING PASS — DAY RHYTHM CHART & FIXES

**The Rhythm Rule (production law):** never three flagged conversations back-to-back without an interaction beat (puzzle, traversal-with-attention, sketch, photo, or quiet moment) between them.

| Day | Talk | Puzzle/Interact | Quiet beat | Fixes applied |
|-----|------|------------------|------------|----------------|
| 1 | HIGH | Red Pen tutorial, ceremony | apartment intro | Front-loads charm; ceremony is a set-piece, not a chat |
| 2 | HIGH → MED | Dust Library, seal sketch, wax traces | first kettle-typewriter-board ritual | Was talkiest day; now owns two core puzzles |
| 3 | MED | Then&Now overlay, morgue unlock, camera handoff | pigeon feeding with Warren (playable, wordless, 40s) | Morgue gives Day 3 a second half that isn't dialogue |
| 4 | LOW | STAKEOUT set-piece, trace tracking, Marrow Affair | lockup silence beat | Already the action day; side stories keep morning full |
| 5 | HIGH → MED | Archive research, map overlay, rain remix | Evelyn's shop (slow scene by design) | **Was the problem day (3 suspect convos).** Fix: seal lookup is now a hands-on archive puzzle; scheduled rain remixes the whole district mid-day |
| 6 | VERY HIGH → HIGH | Fire-escape sightline, fragment observe, garden acoustics, umbrella sketch | Beatrice's tea (the quiet IS the scene) | **Heaviest day by design.** Fix: alternate every conversation with a verification puzzle; the six core clues now come as talk-puzzle pairs |
| 7 | MED | Boathouse environmental read, Plan Z payoffs | the river walk with Clara (no dialogue options; just walking) | Finale should breathe, not sprint |

**Quiet-moment system ("Bench Time"):** Every location has one sit-spot (bench, stool, crate). Sitting triggers a 20–40s ambient inner monologue reflecting current progress, then optionally nothing — the player may just watch the district run its schedules. Cheap, cozy, and the thing reviewers will screenshot with the caption "this game gets it."

---

# 19. REPLAY VALUE, COLLECTIBLES & SIGNATURE MOMENTS

## 19.1 Replay systems (mystery unchanged, experience remixed)
- **The Edition Gallery:** all 7 published front pages archived per save; 3 headline choices/day = wildly different-reading papers. Post-game screen: "Your Week in Print." Social-share bait.
- **Trust-flavored dialogue:** ~15% of lines vary by headline history; the Day 7 boathouse opener has three versions (§15.1).
- **Interview stances:** OBSERVE lines require noticing tells — most players miss half on run one.
- **Weather-gated barks & rain-room scenes** (§14.2).
- **NG+ — "Grandpa's Notes":** replay with grandpa's margin commentary appearing in the notebook at 25 authored moments — jokes, pride, one line at the boathouse ("Sit on the floor with him. Good lad."). Turns a replay into a duet with the ghost the whole game is about. *(Franchise signature; carry NG+ commentary forward every game.)*

## 19.2 Collectibles (all diegetic)
- **The 47 Lanterns:** photograph every gas lantern in the district (Warren's checklist in the camera case). Reward: Warren's first lighthouse postcard arrives post-game addressed to "The Lantern Counter."
- **Pigeon Portraits:** 40 unflattering doodles.
- **Clipping Collection:** all 35 morgue clippings read → unlocks the "STORIES THAT GOT AWAY" drawer contents (Game Two teaser).
- **Willpower (hidden):** the game silently tracks every resisted grape. The post-game stats screen includes one line, no fanfare: "Grapes declined: 23." The community will find it in a week.

## 19.3 Signature Gary Moments (the memorable-forever list)
1. The kettle → typewriter → board nightly triptych (the game's heartbeat).
2. "CONFIRMED — G.G." stamp *(thock)* — the tactile sound of journalism.
3. Gary narrating himself in headlines under stress: *"LOCAL REPORTER OPENS DOOR, IMMEDIATELY REGRETS IT — sources."*
4. The pencil physics: tucked behind ear in conversation; drops when genuinely shocked (exactly 4 scripted drops all game — players will count them).
5. Badge-straighten before every press-privileges use.
6. The deduction chair-spin (one full rotation, only on gold-string connections).
7. "Not today." — and its Day 7 inversion, one grape, given away.
8. Grandpa's rule said aloud exactly three times all game (Beatrice's door, the boathouse, the credits letter) — a refrain, never a catchphrase.
9. The PRESS button wilting in Beatrice scenes.
10. Milo's line: "You believed me enough to check." *(Put it on the box.)*

---

*End of Part II. — Gary Gibbons: The Empty Capsule, v1.1. Narrative locked; toolkit loaded; go make the cozy one.*

---
---

# PART III — GAMEPLAY & AGENCY PASS (v1.2)

*Scope note: Parts I and II are canon. Nothing below changes the mystery, culprit, ending, or emotional pacing. Every entry answers one question: **"How does the PLAYER discover this, rather than being told?"** Format per entry: **Why · Where · Status · Example · Pacing.***

---

# 20. THE AGENCY DOCTRINE — "DISCOVERED, THEN CONFIRMED"

**The rule, stated for the whole team:** For every major clue, the player should be able to *find the thing* before an NPC *explains the thing*. Conversations shift from information faucets to **confirmation ceremonies** — the moment where a person reacts to what the player already suspects. This is also correct journalism: you don't ask a source a question you haven't researched.

**The implementation pattern (used everywhere below):**
1. The clue exists in the world as an observable state.
2. Observing it creates a QUESTION card in the notebook (not an answer).
3. Bringing the question to the right person converts it into VERIFIED testimony — with better dialogue than the passive version, because Gary walks in already knowing.
4. Players who don't discover it still get the clue through the original Part I conversation. **No one is locked out; the curious are rewarded with superior scenes.**

**Systemic expression — "Walked In Knowing":** Every flagged interview has two entry states: COLD (Part I script as written) and PRIMED (player discovered the relevant thing first). PRIMED versions are shorter, sharper, and give the NPC a moment of respect or alarm. Production cost: one alternate opening exchange per flagged interview (~25 total). Payoff: the entire game's dialogue rewards player initiative.

- **Example (Poppy, Day 2):**
  - COLD: as scripted in §5 (Gary raises the backwards key; Poppy melts in eleven seconds).
  - PRIMED (player already examined the key hook AND found the vault's dust library on their own): Gary doesn't ask a question at all. He sets his sketch of the dust layout on her clipboard. Poppy looks at it for three seconds. **P:** "...You drew the inside of the vault." **G:** "You checked it, didn't you? Before the ceremony. Everything was still there." **P:** *(smallest voice)* "I laminate my alibis." *(Same information. Half the length. Twice the scene.)*
- **Status:** REQUIRED (doctrine + PRIMED variants for all core interviews).
- **Pacing:** Compresses talk time for proactive players exactly when they've spent time exploring — self-balancing.

---

# 21. THE DISCOVERY WEB — REDUNDANT PATHS TO EVERY MAJOR FACT

**Why:** Linearity dies when facts have multiple doors. Each core fact below gets 2–4 authored paths. **One is guaranteed** (usually the Part I conversation, which cannot be missed); the others are exploration rewards. Whichever path lands first "owns" the discovery; later paths become corroboration (auto-verifying the card — the redundancy IS the verification system's fuel).

**Status:** REQUIRED (the web); individual optional paths as marked. **Pacing:** turns any "what now?" moment into three viable directions.

### FACT: *A second key exists* (the game's canonical example)
| Path | How | Type |
|------|-----|------|
| A (guaranteed) | Clara, Conversation 3 — Day 6 | Testimony |
| B | **Ida's ledger** — the player may visit Wren & Wick any day from Day 2 and simply ask about the capsule lock; Ida proudly shows the 50-year-old entry: *"Two keys, apprentice work, my best hanging stroke on the 7s."* | Research (any day — the earliest possible path) |
| C | **The Founding Portrait** (Council Hall, Day 1 onward): Edmund Vale at the sealing ceremony, one key raised — **and a second key visible on a ribbon at his belt.** Observable from the game's first hour; means nothing until it means everything. Observing it post-Day 4 spawns the question card: "WHY TWO KEYS?" | Environmental |
| D | **Morgue clipping, founding coverage**: "...Mr. Vale entrusted the ceremonial key to the council, retaining the family copy 'in case the future forgets us.'" | Research |

Whichever path fires first, the Night 4 board question ("...is it the only key?") already glows answered — and Clara's Day 6 reveal becomes a PRIMED scene where Gary respectfully tells *her* the key is missing before she can decide whether to trust him. She notices. **C:** "You knew, and you let me choose to say it. *(beat)* Father would have hired you."

### FACT: *The seal is the Vale family signet*
- A (guaranteed): Prudence's ID, Day 5.
- B: **The manor's front door** — the signet design is carved into the lintel (observable Day 1; players walk under the answer all week).
- C: **Beatrice's mourning brooch** — pressed ivy in the same wreath arrangement (OBSERVE stance in any Beatrice scene).
- D: Morgue society column announcing The Founder's Addition, with a photograph of Edmund pressing the seal.

### FACT: *The theft window is the final two nights*
- A (guaranteed): Poppy's checklist.
- B: **The Dust Library** itself — undisturbed dust *inside* the item voids vs. the sharp top edge lets an attentive player bound the window physically.
- C: **Otto's rain gauge / the Ledger's weather column** — it rained only on Night −2 between roughly 1 and 3 a.m.; combined with any "dry under an umbrella" account, the window collapses to a single hour. *(This path is the strongest — and entirely optional. Players who find it feel like meteorologist-detectives. Reporters check the weather. It's literally on page 2.)*

### FACT: *The figure went TOWARD THE RIVER* (feeds §22.1, the direction aha)
- A: Photo triangulation puzzle (§25.2).
- B: Ferris, PRIMED-only detail: pressed on *which way* the figure went, "Away from Ferris Mott. Toward the water. Ferris Mott remembers because Ferris Mott was hiding in the direction he came FROM."
- C: The ivy transfer trace on the river path (§12.4, now upgraded from flavor to a web path).

### FACT: *Julian's motive (the overheard conversation)*
- A (guaranteed): Beatrice, Day 6 (§8.1 — unchanged; this is the heart, and the heart stays a conversation).
- B: **The garden acoustics puzzle** (§13.7) — discoverable *before* the Beatrice interview, making her scene PRIMED: Gary doesn't ask what was said; he asks "Who was at the window?" and Beatrice goes very still. *(The one PRIMED variant that makes a scene HEAVIER, not lighter — deliberate.)*
- C: **The torn letter** (§25.1) — Julian's unsent, crumpled letter to Clara. Corroboration only; the emotional delivery stays face-to-face.

*(Production appendix will carry the full 14-fact web matrix; the five above are the template.)*

---

# 22. AUTHORED "AHA!" DEDUCTIONS — SURPRISE REINTERPRETATIONS

**Why:** Part II's board confirms; v1.2 makes it *reinterpret*. Each of these is a two-clue collision that changes the meaning of something the player thought they already understood. They are the moments players describe to friends.

### 22.1 "He Wasn't Coming From the Manor." — REQUIRED (Night 6)
Everyone (including Gary, including the player, including the board's default string layout) has assumed the figure crossed the square *from the manor toward the monument*. Combining the photo-triangulation result (§25.2) with Milo's verified sightline reveals the figure was seen *after* the vault — walking **toward the river.** The rail card physically flips direction with a soft *snap*.
**G:** *(inner)* We've all been reading the sentence backwards. The question was never where he came from. It's where he was *carrying everything to.* — and the map's riverbank quietly gains a question mark. The player now knows where Day 7 happens because *they* turned the arrow around. **Pacing:** the adrenaline spike of the game's heaviest board night.

### 22.2 "The Photograph Never Showed the Thief." — REQUIRED (Day 4, lockup)
The player has spent two days treating Warren's night photo as an image of the culprit. Ferris's testimony + the tail = **the photo shows the WITNESS.** The evidence that drove Days 3–4 was never a picture of the thief — it was a picture of the man watching the thief. The board animates it: the photo card slides from the SUSPECT column to a brand-new column Gary hand-letters on the spot: **WITNESSES.**
**G:** *(inner)* Grandpa's first rule of photographs: they always show the truth. Just almost never the truth you developed them for. **Pacing:** converts the Day 4 red-herring deflation into a payoff — the herring wasn't a dead end, it was a lens.

### 22.3 "Careful Hands." — OPTIONAL discovery, REQUIRED emotional landing (Day 2 → Night 6)
The Dust Library's sharp-edged top void + Poppy's "everything was orderly" + (much later) the fragment. Combined on the desk: *the thief removed fifty years of a town's memories without disturbing a single dust line.* This wasn't a ransacking. It was someone being **gentle with things he thought he was losing.** The board's THEORY card "AN OUTSIDER STOLE IT FOR PROFIT" visibly curls at the corner when this deduction lands — the player *feels* the truth before Day 6 names it. **Pacing:** a quiet chill placed early; the game's compassion, delivered as inference.

### 22.4 "He's Been Carrying It." — REQUIRED (Day 6, café)
Poppy saw the seal *intact* Night −3. The vault shows careful removal. So the wax didn't break during the theft — it broke **afterward, in a coat pocket, from being handled again and again.** The fragment isn't evidence of a crime being committed; it's evidence of five days of a man taking an envelope out, turning it over, and failing to open it.
**G:** *(inner, the coldest-warmest line in the game)* He's not hiding it from the town. He's carrying it. There's a difference, and the difference is the whole story. **Pacing:** lands minutes before Beatrice's tea — the two scenes now rhyme.

### 22.5 "Two Witnesses, One Minute." — OPTIONAL (Night 6 rail polish)
Seating Ferris's card and Milo's card at the same rail slot triggers an overlay: Ferris saw the figure's front (key, no fumbling); Milo, from above, saw only the umbrella. Different testimonies, same sixty seconds, assembled into one complete figure — the rail plays a brief composite: the crossing rendered from BOTH vantages simultaneously, split-screen. The player has literally reconstructed a moment of time from two imperfect eyewitness angles. That's journalism as a game mechanic. **Pacing:** the flourish before the final deduction.

---

# 23. JOURNALISM DEEP MECHANICS

### 23.1 "Off the Record" — REQUIRED (used ~6 times)
- **Why:** The single most journalist mechanic that exists. Some truths are shared only if Gary agrees they can't be printed — and off-record facts **cannot be used in the Evening Edition or presented at the confrontation.** They can only *guide* the investigation toward on-record corroboration. Knowledge and publishable proof become two different resources.
- **Where:** Margie's Warren quote is the tutorial ("That's between us and the sherry, pet"). Clara's Clue 3 (the missing key) is offered off the record — the player must then earn an on-record version (Ida's ledger, path B) to use it Night 6. Beatrice's entire tea is off the record, always, and the game never even offers the toggle — the UI element is simply absent in her parlor, which players will notice and love.
- **Example:** Attempting to pin an off-record card to a deduction: the string refuses, and the card shows Gary's handwriting across it — *"promised."* **G:** *(inner)* A reporter who burns a source gets one story. A reporter who keeps a promise gets a town.
- **Pacing:** Adds a mid-game research loop (know it → prove it) exactly where Days 5–6 need texture.

### 23.2 Protecting the Source — REQUIRED (one high-stakes instance)
Milo's sighting is the case's opportunity pillar — and attributing it in print or at the confrontation exposes an 11-year-old who snuck out. The Day 6 Edition and the boathouse presentation both offer attribution choices: **"a witness" vs. "Milo Tanaka."** Naming him changes nothing mechanically (the deduction stands) and everything humanly: Day 7 Milo is grounded, watching the ceremony from his window; his framed-byline side-story payoff quietly doesn't happen. Protecting him costs a sliver of the article's punch (Dot: "Thin sourcing, Gibbons." **G:** "Thick enough." **D:** *(beat)* "...Yeah. Run it.") — and Day 7 Milo is front-row. **No prompt, no warning, no gold star. The game just remembers.** This is the agency version of "truth with compassion."

### 23.3 Reputation — "How the Town Says Good Morning" — REQUIRED (systematizing Part II's Trust)
Trust (Part II) gets a readable surface without a meter: NPC **greetings** are the UI. High trust: first names, doors held, Otto's espresso waiting on the counter unasked. Low trust after a sensational streak: "Mr. Gibbons." (Margie switching from "pet" to "Mr. Gibbons" is the entire feedback system in two words.) One systemic rule: **completed side stories permanently floor an NPC's trust at warm** — kindness banked is kindness kept, whatever the headlines do.

### 23.4 Interview Etiquette — OPTIONAL micro-layer
Small learnable manners per NPC that reorder scenes, never gate them: Ida won't talk while holding a lock mid-pick (wait, or lose the OBSERVE window); Prudence answers better if Gary signs the visitor ledger first (she checks — it's an archive); accepting Margie's tea before questions upgrades her first answer; interviewing Gino means holding whatever fruit he hands you for the duration. Holding it. The whole time. *(Yes, on grape days. The player must hold grapes for a full interview. The community will clip it.)*

---

# 24. ENVIRONMENTAL STORYTELLING PASS — THE CHEKHOV INDEX

**Why:** Every location gets an observable-detail layer with a defined ratio: roughly **⅓ pure texture, ⅓ character deepening, ⅓ future clue** — so noticing details stays intermittently load-bearing and players learn to look at everything. **Status:** REQUIRED layer; every individual detail missable. **Pacing:** ambient; observation is the between-conversations activity.

Selected entries (full index in level-design appendix; ★ = becomes a clue):

- **Council Hall:** ★The Founding Portrait (two keys, §21). The Guardian's chair with eight years of the same coat's wear on one armrest. A drawer of retired PLAN cards from festivals past — Poppy is a dynasty, not a novelty.
- **Founders' Square:** ★Wax scrapings on the vault lip. ★The moved dedication plaque (then & now). Worn cobbles tracing fifty years of the same shortcut diagonally across the square — the town's habits, visible as erosion. Kids' chalk hopscotch that adds a square each day.
- **Vale Manor:** ★Lintel signet carving. ★The garden's stone table under the study window. The portrait hall: Edmund's portrait hangs between spaces left for TWO future portraits — the will, painted on a wall, hiding in plain sight from Day 1. A doorframe with two columns of childhood height-marks, "J" and "C," ending the same year.
- **The Boathouse (Day 7):** the four reads from §13.5 plus one more: ★the floorboard nails — every nail dull with age except six, shining, recently re-driven. The player can find the hiding place *before Julian offers it* (§25.4).
- **The Drowsy Lantern:** ★Guest register (Ferris's check-in date clears him of anything earlier — a redundancy path). One sherry glass kept upside-down at the corner seat: Margie's quiet reservation for Warren, standing hospitality for a lonely man. Room keys on hooks — Ferris's is never on its hook at night (observable Days 2–3, before the stakeout formally begins: the player can catch the pattern first).
- **The Percolator:** ★Chalkboard hints. A wall of fifty years of festival photos — young Margie, young Warren, and in the earliest frame, ★a young gibbon reporter with a familiar badge, arm-in-arm with a young doe who is unmistakably Beatrice. Unlabeled. Unremarked. (See §28.)
- **The Ledger Morgue:** ★weather column (§21). Gary Gibbons's desk, preserved, one drawer locked (§28). The wall of front pages with one conspicuous gap — a missing week, fifty years ago, unexplained (§28).
- **Wren & Wick:** ★the ledger. Drawer 400 (§17.5). A child's first practice lock mounted like a diploma, engraved "I.W., age 9."

---

# 25. NEW ORGANIC PUZZLES

### 25.1 The Torn Letter — OPTIONAL (Day 6, Vale Manor study wastebasket)
Reconstruct Julian's crumpled, torn, unsent letter to Clara from eight fragments — assembled by matching his handwriting's flow, not jigsaw edges (the writing itself is the guide; teaches players to *read* him). Recovered text, incomplete by design: *"—not what you think. When I know what it says I'll— / —should have been yours anyway, it was always— / —can't open it. Isn't that funny. I can't even—"* It answers nothing and confirms everything. **Board rule:** it pins as motive corroboration but Gary will not present it at the boathouse — examine it there and he thinks: *"No. He gets to say this part out loud himself."* (Protecting the heart, §29 — mechanically enforced.) **Pacing:** a silent 3-minute puzzle in the middle of the game's talkiest day.

### 25.2 Photo Triangulation — REQUIRED (Day 5 or 6, Founders' Square, feeds §22.1)
Using Warren's balcony (known camera position) and the tail's position in frame, the player stands in the square at night with the loaner camera and matches the photo's lantern-smear pattern to find the exact spot the figure occupied — then reads the cobbles: the worn shortcut runs manor→monument, but this spot sits on the *river-side* line. Where someone stood, derived from light and habit. Fully diegetic; zero UI abstraction.

### 25.3 The Founding Portrait Examination — OPTIONAL (any day; retroactive detonation Day 4+)
Free-look on the portrait with the loupe (Prudence lends it after her Day 5 scene — or earlier, if the player has done side story 17.7). Finding the belt key *before* the "second key" question exists files it as a dormant notebook sketch; when the question card spawns, the sketch **animates itself across the notebook to dock with the question** — the notebook visibly having the aha with you. Players who observed early get the game's best solo-discovery moment: no NPC involved at any step.

### 25.4 Finding the Floorboards — OPTIONAL override of a scripted beat (Day 7)
Part I scripts Julian prying up the boards. v1.2 addition: if the player reads the boathouse first (§24) and interacts with the six shining nails *before* triggering the final exchange, Gary kneels, and Julian watches him find it. The confession script gains one altered line — **J:** "You'd have found it without me." **G:** "I'd rather you'd shown me." — then rejoins the canonical scene. Same ending; the player *earned* the room. **This is the v1.2 thesis in one beat: agency that changes the discovering, never the discovered.**

---

# 26. THE NOTEBOOK AS THINKING TOOL — REQUIRED

- **Morning Pages:** Each day opens with Gary's half-written morning page and the player choosing **Today's Three Questions** from ~6 candidates. Choices set the day's vox-pop topic, prime relevant PRIMED variants, and add margin weight to related clues — a soft planning layer, never a lockout. Unchosen questions remain tomorrow. *(The player begins each day deciding what kind of reporter to be for it.)*
- **Crossed-Out Theories:** The board's theory graveyard mirrors into the notebook as struck-through lines with Gary's marginalia ("outsider-for-profit — WRONG, and I'm glad").
- **Tear-Out-and-Pin:** The physical bridge between notebook and board: promoting a notebook page (a sketch, a question, an interview note) tears it out — with the sound, the ragged edge, and a permanent stub left in the notebook's gutter. By Day 7 the notebook is visibly thinner and the board visibly fuller: **the investigation has a conservation of mass.** End-game, the notebook is mostly stubs and doodles — Gary's week, spent onto a wall.
- **Loose papers:** Clippings, Poppy's laminate, Warren's print, the brass screw taped to a page — foreign objects accumulate between pages; the notebook fattens sideways as it thins forward.
- **Pacing:** Morning Pages give each day a 30-second intention beat; tear-out moments punctuate discoveries physically.

---

# 27. FREEDOM, REACTIVITY & THE TOWN THAT INVESTIGATES BACK

- **In-day free order — REQUIRED:** Within each day, core clues land in any order; scenes reference discovery state via PRIMED variants. Day gates (night deductions) remain the only hard sequence — the spine keeps its vertebrae, the days get cartilage.
- **Post-beat revisit lines — REQUIRED (2 per NPC per major beat):** Every named NPC has fresh lines after the ceremony, the stakeout, and the reading. Talking to everyone after Day 4 is its own reward tour (Gino has composed a short opera about the marrow. It has a part for Gary. It is not optional to Gino.)
- **The Town Investigates Back — REQUIRED (rumor system):** Lanternside runs its *own* wrong theory at all times, seeded by the player's headlines and the day's events, expressed through ambient gossip, the skipping rhyme, and Otto's chalkboard. Print sensational Guardian coverage and by afternoon two neighbors are auditing Warren's window boxes. The player watches their reporting move a town in real time — the responsibility theme taught by the crowd sim, not a cutscene. One authored payoff: on Day 6, whatever the town's current wrong theory is, Gary passes two neighbors confidently explaining it, and can only walk on, knowing. *(Inner: "Tomorrow, folks. Tomorrow it'll be true instead of loud.")*
- **Curiosity rewards:** re-examining ANY board item after its meaning changes yields a new Gary line (~60 authored re-reads). The photo card alone has four readings across the week.

---

# 28. NATURAL SEEDS — UNREMARKED MYSTERIES (all OPTIONAL, none resolved, none signposted)

1. **The locked drawer** in Gary Gibbons's preserved desk. No key in this game. Ida, if asked: "I made that lock for Gary Gibbons — the first one. He asked for one even I couldn't sweet-talk. *(pause)* He was smiling when he asked."
2. **The missing week** — a gap in the morgue's front-page wall, fifty years ago. The bound volume for that week is simply absent from the shelf. Dot, if asked: "Before my time. Ask the shelf."
3. **The festival photo** at the Percolator: a young Gary Gibbons arm-in-arm with young Beatrice, unlabeled. If Gary OBSERVES it in a late-game Beatrice scene, she looks at it a long moment. **B:** "Your grandfather took terrible photographs and wonderful ones. That one is both." *(Nothing further. Ever. This game.)*
4. **"& Wick"** — the shop is Wren & Wick. There is no Wick, no second workbench, one small covered chair in the back corner. Ida never mentions it. The sign is freshly repainted every spring.
5. **Warren's one photograph** he turns face-down when Gary visits — visible in exactly two scenes, never if you look directly.
6. **Gary Gibbons's "STORIES THAT GOT AWAY" drawer** (Part II) — the readable contents (clipping-collection reward) include one folder that is only a title: *"THE LIGHTHOUSE THAT WASN'T THERE."* Warren is going to the lighthouses. The game says nothing.
7. **Ferris's post-credits clink** (Part I) — unchanged, still the loudest seed; everything above whispers.

**Design law for seeds:** no quest markers, no journal entries, no NPC saying "how mysterious!" A seed that announces itself is an advertisement; a seed that just *sits there* is a world.

---

# 29. PROTECTING THE HEART — DESIGN LAWS & THE CUT LIST

**Laws (print above every designer's desk):**
1. **Discovered, then confirmed — but some things are only ever confirmed.** The overheard conversation, the will's contents, and the confession are delivered face to face, heart to heart, forever. Puzzles may lead *to* those doors; puzzles never open them.
2. **Agency changes the discovering, never the discovered** (§25.4 is the reference implementation).
3. When a puzzle and a character moment compete for the same beat, the puzzle moves. (§25.1's torn letter is playable; *presenting* it is forbidden — the mechanic itself defers to Julian's right to speak.)
4. Off the record is sacred, in fiction and in code (§23.1).
5. The game never scores compassion (§23.2: no prompt, no reward icon — "the game just remembers").

**The Cut List (considered for v1.2 and rejected, recorded so they stay rejected):**
- ❌ A lockpicking minigame (Gary is not that kind of protagonist; also Ida would be disappointed, and we fear her).
- ❌ Trust as a visible meter (numbers make kindness a currency; greetings already carry it).
- ❌ Multiple endings (one ending, arrived at more or less gently — the variance lives in HOW, per §15.1/§23.2).
- ❌ A stealth-follow mission tailing Julian (turns a frightened man into content; the direction-reversal aha (§22.1) delivers the same revelation as *thought* instead of *surveillance*).
- ❌ Timed dialogue choices (nobody in Lanternside is in a hurry except Poppy, and she's working on it).

---

*End of Part III. — Gary Gibbons: The Empty Capsule, v1.2. The story is the same. The player found it themselves.*

