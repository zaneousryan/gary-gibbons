# GARY GIBBONS — THE ART BIBLE
## The Complete Visual Production Document for *Gary Gibbons: The Empty Capsule* and the Gary Gibbons franchise
### Version 1.1 (production-readiness pass) · Canon-aligned with Design Doc v1.3 (species pass) and Technical Spec §10 (asset naming contract)

> **THE MASTER STYLE PROMPT** — every image-generation prompt in this document begins with this text, verbatim:
>
> *A cozy anthropomorphic animal world inspired by 1930s–1950s Europe, with warm watercolor and gouache storybook illustrations, expressive feature-animation anthropomorphic characters with warm storybook animal-world appeal, hand-drawn ink linework, textured paper, soft golden-hour lighting, rounded architecture, muted earthy color palette, vintage clothing, visible brush strokes, lived-in environments, charming details, and a handcrafted feel. Avoid realism, anime, cyberpunk, noir, glossy rendering, or modern elements. Every scene should feel warm, hopeful, and full of quiet stories waiting to be discovered.*
>
> In every prompt below, the marker **⟨MASTER STYLE PROMPT — expand verbatim on export⟩** must be replaced by the full Master Style Prompt above, word for word, before any prompt is sent to an image generator. The marker is an authoring convenience only; it never appears in a production prompt.

---

## PRODUCTION PROMPT EXPORT RULES

1. **Every exported prompt begins with the full Master Style Prompt, verbatim.** No abbreviations, no paraphrase, no bracket markers. Consistency of the opening text is what holds the visual identity together across hundreds of generations.
2. **One prompt generates one asset type only.** Never combine a character and their environment, a prop and its board card, or an establishing shot and a close-up in a single prompt. Mixed prompts produce mixed results.
3. **Clue props get separate close-up prompts.** Any prop that carries gameplay-readable detail (the seal, the two keys, the boot tread, the founding portrait's belt key, the shining nails) is generated twice: once in context per its location/prop sheet, once as a dedicated close-up at evidence fidelity (see the Evidence close-up row in Output Specs; delivered as `props/evidence_{id}_closeup.png`).
4. **Each asset family has its own prompt format** (see Output Specs below): character reference sheets, portrait busts, environment establishing shots, parallax layer sets, props, board/evidence card sketches, UI sheets, and marketing/key art are separate formats with separate suffixes. Do not reuse a character-sheet suffix on an environment, or vice versa.
5. **Suffix discipline:** character sheets append the turnaround/expressions suffix; environments append "wide establishing shot, no characters unless specified"; props append "on a warm cork-and-paper background"; board cards append "sketch-style evidence card, graphite with one accent color, on cork."

## OUTPUT SPECS BY ASSET TYPE

| Asset type | Target output | Delivery (per Tech Spec §10) |
|---|---|---|
| Character reference sheet | 3072×2048 landscape, front + 3/4 + back + 3 expressions, warm-cream ground | Reference only; sliced into production assets below |
| Portrait bust | 800×1000 portrait, chest-up, honest-intensity expression | `characters/{id}/portrait_{state}.png`, set of 5 (+scheduled unguarded one-offs) |
| Character sprite source | 400×600 full body, neutral stance, clean silhouette | `characters/{id}/sprite_*.png` (idle ×2, talk ×2) |
| Environment establishing shot | 2400×1350 wide, the location's "postcard composition" | Concept/marketing reference; parents the layer set |
| Parallax environment layers | 2400×1200 per plane, PNG with alpha on mid/fg, one set per phase (+rain variants) | `locations/{id}/{phase}_{bg|mid|fg}.png` |
| Prop sheet | 1024×1024, single prop (or one authored still-life set), cork-and-paper ground | `props/prop_{id}.png` |
| Evidence close-up | 1600×1200 or 1024×1024, gameplay-readable detail, single clue or clue-detail isolated | `props/evidence_{id}_closeup.png` |
| Board/evidence card | 500×350 landscape, graphite sketch style, one accent color | `board/card_{id}.png` |
| UI sheet | 2048×2048 component sheet, paper-diegetic elements only | `ui/…` per component |
| Marketing / key art | Steam sizes per Ch.11.10 (main capsule 616×353, library 600×900, hero 3840×1240) | Marketing pipeline |

Generate large, downscale in the pipeline; never upscale. All art PNG; all values within the Master Palette (§2.4).

## ⚠ DO NOT OVERPRODUCE FROM THIS BIBLE

This document is the **master canon and style bible for the franchise — it is not a sprint asset list.** Producing everything in Chapter 11 before the game needs it is how cozy projects die warm deaths. Production works from **extracted milestone packs** (e.g., "First 30 Minutes," "Day 2 Vertical Slice / Demo") that pull the minimum asset set for their milestone, at the specs above, flagged by the Prototype Priority field (Ch.11). The bible answers *what everything looks like*; the milestone pack answers *what we paint this month.*

---

# CHAPTER 1 — VISUAL PHILOSOPHY

## 1.1 The Vision in One Sentence

**Lanternside should look like a memory of a town you never actually visited but somehow miss.**

Every frame of Gary Gibbons is a page from a storybook that has been read a hundred times by lamplight — loved, thumbed, a little soft at the corners. The player is not looking at a screen; they are looking *into* a warm, hand-painted world where every window glows because someone is home, every object has been owned by somebody, and every street corner is in the middle of a small story whether the player stops to notice or not.

## 1.2 Core Design Pillars

**PILLAR ONE — Painted, Never Rendered.** Everything in the game looks like it was made by hands: watercolor washes, gouache body color, ink lines that wobble the honest way a real nib wobbles. If an asset looks like a computer made it, the asset is wrong. Visible brush strokes are not a flaw to hide; they are the signature of the world.

**PILLAR TWO — Lamplight Is the Protagonist's Co-Star.** Lanternside refuses to modernize its gas lanterns, and the art direction agrees with the town. Warm pooled light against soft cool shadow is the game's fundamental visual chord. We light scenes the way a storybook illustrator does: to tell you where the warmth is, not to simulate photons.

**PILLAR THREE — Species Is Silhouette Is Character.** In a game about knowing your neighbors, every citizen must be identifiable across a busy square in a quarter of a second, in shadow, from behind. Species selection, costume, and posture combine into one unmistakable silhouette per character. If two characters could be confused at thumbnail size, one of them is redesigned.

**PILLAR FOUR — Lived-In, Never Cluttered.** Every environment carries the archaeology of daily life — the worn diagonal path across the square's cobbles, the dust voids in the vault, the height-marks on the manor doorframe. Detail exists to say *someone lives here*, never to fill space. Every prop earns its place by implying a habit, a history, or a person.

**PILLAR FIVE — Warmth Without Saccharine.** The palette is muted and earthy; the faces are sincere; the humor is drawn with affection. We are cozy the way an autumn kitchen is cozy — which includes shadow, rain, melancholy, and dust. Sweetness with no weight underneath is as off-brand as cynicism.

**PILLAR SIX — The Mystery Is Drawn in the World.** Visual storytelling carries clues (Julian's velvet antlers, the two keys in the founding portrait, the ivy-and-lantern seal carved over the manor door). The art team is a co-author of the investigation: players who *look* are rewarded before players who ask.

## 1.3 Things That Define Gary Gibbons Visually

- Watercolor + gouache on visibly textured paper; ink linework with hand pressure variation.
- Golden-hour and lamplight warmth as the default emotional temperature.
- 1930s–1950s European storybook architecture: rounded, leaning, gently crooked, human-scaled (animal-scaled) streets.
- Anthropomorphic animal citizens with expressive feature-animation faces and a wide storybook proportion range — a wren and a bear share the same sidewalk and the same tailor.
- Vintage clothing: tweed, knits, aprons, sashes, watch chains. Nothing synthetic, nothing branded, nothing after ~1955.
- Paper as a sacred material: newsprint, notebook pages, letters, wax seals, index cards, red string. The game's UI *is* Gary's paper.
- Autumn as the permanent season of the heart (see 2.15 for the literal seasonal rules).
- Charming background micro-stories (the divorced pigeons, the chalkboard specials, the evolving hopscotch grid).

## 1.4 Things That Must NEVER Appear

- Photorealism, 3D-render sheen, gradients that look airbrushed, lens flares, bokeh, chromatic aberration.
- Anime styling, cel-shade gloss, chibi proportions.
- Noir high-contrast lighting, desaturated "gritty" grading, horror shadow language. (We do mystery by candlelight, not by menace.)
- Modern elements: cars, phones, screens, plastics, zippers as visible features, sneaker brands (Milo's sneakers are 1950s canvas), contemporary typography.
- Weapons of any kind. Constable Tuck carries a whistle and a notebook.
- Villain-coding: no sickly greens, no dramatic under-lighting, no rat/snake/vulture "evil species" shorthand. There are no villains in Lanternside, and the art never argues otherwise. Julian at his lowest is lit with the same warmth as everyone else — that is the whole point of the game.
- Grime played for squalor. Wear is love; dirt is neglect. Lanternside is worn, never neglected.
- Cynical or ironic visual jokes. The humor is fond.

## 1.5 Mood, Themes, Emotional Goals

**Mood words (print these above every art desk):** Lamplit. Autumnal. Thumbed. Fond. Held-breath. Homecoming.

**Themes the art must carry:** Legacy (objects outliving their owners, gently), family (two of everything in the Vale world — two keys, two portrait spaces, two children's height-marks), fear softened by understanding (shadow always adjacent to warm light, never winning), truth with compassion (revelation staged in warm light, faces given dignity in their worst moments).

**Emotional goals, by play phase:** Daytime exploration should feel like being welcome somewhere. Interviews should feel like sitting close to someone. Night board sessions should feel like the good kind of alone — lamplight, tea steam, rain on the window. The finale should feel like the sun coming out on a street you now know by heart.

---

# CHAPTER 2 — MASTER STYLE GUIDE

## 2.1 Rendering Style

The finished look is **gouache body color over watercolor washes, on cold-press paper texture, with ink linework**. Build order for every painted asset: (1) light pencil-tone underdrawing, (2) broad watercolor wash establishing local color and light temperature, (3) gouache opaque passes for form and costume, (4) ink line pass, (5) dry-brush texture accents, (6) a single unifying warm glaze in lamplit scenes. Edges stay soft except where the ink line takes over. Paper texture must remain faintly visible in every flat area — nothing in the game is perfectly flat.

## 2.2 Brushes

Digital artists standardize on a small kit to keep hands consistent across the team: a granulating watercolor round (washes), a dry gouache flat (body color, visible stroke direction), a soft mop (skies, light bloom), an ink nib with pressure-mapped width (line), and one dry-brush splatter/texture brush used sparingly for stone, flour, and dust. No airbrush anywhere in the pipeline. Stroke direction follows form on characters and follows weather on environments (vertical rain-day strokes, diagonal golden-hour strokes).

## 2.3 Lighting

Lighting is emotional first, physical second. Rules: one warm key source per scene (sun, lantern, hearth, desk lamp) with cool ambient fill (teal-grey, never black); shadows are painted as transparent cool washes with soft edges — occlusion shadows only under feet and props; lantern pools are drawn as soft-edged amber ellipses on the ground, and characters passing through them warm up by two palette steps; windows at dusk always glow (someone is home in every home); rim light is reserved for emotional emphasis — a character being truly *seen* gets a fine warm rim.

## 2.4 Color Palette — The Lanternside Master Palette

**Core (hex values are the pipeline reference):**
- **Lantern Amber** `#E8A34C` — light, warmth, hope. The signature color.
- **Dusk Teal** `#33605D` — shadow, night, mystery-that-isn't-menace.
- **Vale Plum** `#6E4468` — the founding family, dignity, mourning.
- **Paper Cream** `#F4EAD3` — paper, UI ground, daylight walls.
- **Ivy Green** `#4F6B3D` — the seal, growth, the Croft/garden world.
- **Ink Brown-Black** `#2C2620` — linework and text. Never pure black anywhere in the game.

**Support:** Brick Rust `#B25A33`, Mustard Knit `#C9932F`, Fog Blue `#8FA6A3`, Flour White `#F7F2E6`, Autumn Leaf `#C97435`, Grape Green `#9FB35C` (reserved: appears only on actual grapes and the grape-thread props — a private joke in the pipeline).

**Usage law:** every scene is keyed amber-vs-teal; character accent colors (per §4) must read against both. Saturation ceiling ~70% except Lantern Amber highlights and festival bunting. No pure white, no pure black, ever.

## 2.5 Line Work

Ink lines are warm brown-black (`#2C2620`), pressure-varied, slightly broken at highlights (lost-and-found line). Characters get the heaviest line weight, mid-ground props medium, backgrounds light-to-none (backgrounds may dissolve into wash entirely at distance — atmospheric perspective by line disappearance). Lines wobble honestly; ruler-straight lines are allowed only on paper props (the one thing in Lanternside made with a straightedge is the Ledger's column rules).

## 2.6 Texture

Three sanctioned textures, used everywhere and nothing else: cold-press paper grain (global, faint), dry-brush drag (stone, wood, fur ends, flour), and granulating wash bloom (skies, water, steam). Texture density increases with age of the object — the time capsule vault is the most textured surface in the game; Poppy's laminated cards are the least (and the joke is that lamination is the closest thing Lanternside has to plastic).

## 2.7 Material Rendering

Brass (badge, keys, camera): warm two-tone with a single painted highlight, never specular sparkle. Wood: visible grain strokes, edges rounded by decades of hands. Wool/tweed: dry-brush nap, tiny flecks. Fur: see §3.5. Glass: implied by what it reflects (one soft amber shape), never by transparency effects. Wax: matte, slightly translucent at edges — the green seal must look breakable. Paper: the hero material — deckled edges, fold shadows, ink bleed-through on thin stock. Water (river): horizontal granulated washes with lantern reflections as vertical amber ribbons.

## 2.8 Perspective

Locations are built in **gentle storybook perspective**: essentially side-on stage sets with 10–15° of downward tilt, parallel lines allowed to diverge slightly the way children's-book illustration does. No hard vanishing-point grids; buildings lean toward each other by 2–4°. Interiors show floor generously (the game plays on the floor plane). Depth comes from three painted parallax layers (bg/mid/fg, per tech spec §10), atmospheric line-loss, and warm/cool separation — never from 3D geometry.

## 2.9 Camera Philosophy

The camera is a fond, patient observer at the town's eye level — never dramatic angles, no dutch tilts, no low hero shots. It moves like someone strolling: slow lateral tracking with parallax, gentle push-ins (5–8%) for emotional beats, and exactly three big slow push-ins in the whole game (the empty vault, Beatrice's tea, the boathouse floor). Interviews frame two characters sharing space, slightly off-center, with breathing room above. The camera never looks down on a character in their vulnerable moment — when Julian breaks, we are on the floor with him, because Gary is.

## 2.10 Composition

Compositions are built on warmth-targets: the eye should land on the warmest, most textured point, which is always the story point. Rule of thirds loosely; horizon low in exteriors (Lanternside has sky and gulls); frames-within-frames constantly (doorways, windows, the umbrella, the board) because this is a game about looking into people's lives with permission. Every location has one "postcard composition" — the establishing angle used in marketing and location-transition cards.

## 2.11 Silhouettes

The one-glance law: every named character readable at 48 pixels, in flat black, from front, side, AND back. Silhouette drivers per character are listed in §4; the team-wide test is the **Silhouette Sheet** (all 17 silhouettes on one page, updated whenever any costume changes) — if any two are confusable, the newer design changes.

## 2.12 Animation Philosophy

(Expanded in Chapter 8.) Headline: **animation is punctuation, not spectacle.** 2D puppet/cut-out animation with hand-drawn substitution frames for signature moments. Low frame counts worn proudly (8–12 fps character cycles feel storybook-right); ease and settle do the emotional work. Ears, tails, and feathers are the emotional subtitles of the animal world and get animation budget before limbs do.

## 2.13 Facial Expression Philosophy

Faces are the game's primary gameplay surface — the OBSERVE mechanic depends on readable tells. Expressions are staged in three intensities (social face → honest face → unguarded face) and the game's drama lives in the transitions between them. Eyes get the most detail in any face (painted iris, single highlight); mouths are simple; **species features carry the subtext**: Poppy's fluffing feathers, Julian's ring-spin plus one slow ear-turn, Beatrice's stillness (her tell is the *absence* of motion — one quarter-turn of a teacup). Never exaggerate past sincerity: no anime sweat drops, no popping veins; the biggest take in the game is Gary's pencil falling.

## 2.14 Character & Environmental Proportions

Characters: 2.5–3.5 heads tall for small species, 3–4 for mid, 4–4.5 for large; heads and hands oversized (hands ~face-sized) for expression; feet simple and grounded (digitigrade suggested, drawn comfortable, always shod or neatly furred — never detailed animal feet). **The Lanternside Scale:** Gary (gibbon) is the 1.0 reference at ~170cm story-scale. Ida (wren) 0.35, Poppy (goldfinch) 0.45, Milo (raccoon kit) 0.65, Dot 0.8, Ferris 0.85 (long, low), Evelyn 0.9, Clara 0.95, Margie 0.95 (wide), Tuck 0.95 (mostly ears), Prudence 1.15 (mostly neck), Beatrice 1.05, Warren 1.1 (wide), Julian 1.25 (1.45 to antler-tips), Gino 1.2, Otto 1.5. Doors, counters, and furniture are built to the mid-scale with charming accommodations everywhere: Ida's letterbox door inside Otto's doorframe, Poppy's stepped podium, the Percolator's three counter heights. Architecture is 85% "real" scale so the town feels huggable, not miniature.

## 2.15 Weather, Seasons, Day/Night

The game lives in one **perpetual early autumn** — golden trees just past peak, first fallen leaves, no snow. Weather states: CLEAR (default; golden-hour bias even at midday) and RAIN (soft vertical wash-strokes, amber window-glow doubled, umbrella bloom, cobbles reflecting lantern ellipses). Day-phase palettes (shipped as per-phase painted layers, per tech spec): **Morning** — cream light, long cool shadows, fog blue in the distance; **Midday** — fullest local color, shortest shadows, busiest streets; **Evening** — the signature look: Lantern Amber key, Dusk Teal shadow, every window on; **Night** — teal-dominant with amber lantern pools; never darker than "readable storybook night." The mystery-week festival decay (bunting sag, accumulating monument flowers) is an authored per-day overlay set, not a shader.

## 2.16 Visual Storytelling Rules

1. Every clue that can be drawn is drawn before it is spoken (design doc Part III doctrine — art is the discovery layer).
2. Two-ness follows the Vales everywhere: two keys in the portrait, two portrait spaces, two height-mark columns, two-person puzzle boxes. Artists seed it; the game never points at it.
3. Wear patterns tell the truth: the worn shortcut across the square, Warren's one polished armrest, the shining boathouse nails.
4. Julian's velvet antlers are never mentioned and never absent.
5. Green wax and Grape Green never share a frame (pipeline superstition, enforced anyway: the will and the vice stay in separate color stories).
6. When a character lies (rare, and only ever to themselves), the light never changes. Lanternside does not punish with lighting.

---

# CHAPTER 3 — CHARACTER DESIGN RULES

## 3.1 Species Selection Philosophy
Species is cast the way a director casts an actor: to echo the soul of the role or to wittily contradict it — never randomly, never as a pun alone (though we take the pun when the soul agrees: Gary Gibbons the gibbon, Ida Wren the wren). Rules: **(a)** founding families are species lines (Vales = red deer; Crofts = red foxes), making lineage visible at a glance and the Theodora/Jonah romance a storybook fable; **(b)** one species per named resident wherever possible — the crowd may repeat species, principals never do; **(c)** no "evil species" shorthand exists in this world: the weasel is a delight, and the fox is the kindest florist in three districts; **(d)** Ferris is the town's only weasel — a canonical, plot-load-bearing fact; **(e)** The Pigeon Rule: ordinary small wildlife (pigeons, garden birds, fish, the duck carved on the umbrella handle) remains simple non-speaking storybook fauna, and no one finds this strange.

## 3.2 How Animals Relate to Personalities
The species supplies the *nature*; the character supplies the *choice* — and the drama lives in the gap. Warren is a badger (holds ground) who spent eight years holding someone else's; Prudence is a heron (waits motionless, strikes suddenly) who has waited twenty years for one letter; Julian is a stag whose crown literally hasn't hardened; Tuck is a basset built for the patience he weaponizes; Milo is a raccoon born wearing the mask he aspires to. When designing new characters (sequels, crowd promotions), write the personality first, then cast the species that makes the personality *visible*.

## 3.3 Clothing Rules
Vintage 1930s–1950s Europe, tailored to anatomy with visible love (slits for tails, brims shaped around ears, Julian's collars cut for a stag's neck). Fabric hierarchy: working folk in wool/canvas/aprons; the Vales in finer cloth that is *older* — inherited elegance, softly worn. Maximum three garment colors per character plus one accent (§4 palettes). No logos, no zippers on display, buttons and toggles everywhere. Shoes simple and period; small species may go trouserless-with-apron in the classic storybook manner (Ida, Poppy) — dignity is in the tailoring, not the coverage. Weathering on all clothing: elbow shine, hem fade, one mend per working garment.

## 3.4 Expressions
Three-intensity system per character (social / honest / unguarded) built on a shared FACS-lite sheet: brow unit, eye aperture, ear/feather attitude, mouth unit, head tilt. Portrait sets (tech spec: neutral, happy, worried, surprised, sad) are painted at the *honest* intensity; scripted key moments earn one-off *unguarded* portraits (Julian at the boathouse, Beatrice at the photograph, Margie with the music box). The OBSERVE mechanic requires each principal's tell to be readable in their idle loop — tells are animation deliverables, not paint deliverables.

## 3.5 Fur & Feather Rendering
Fur is painted as **mass, not strands**: silhouette-edge tufts (5–9 per character view), interior fur suggested by two-tone gouache and dry-brush at form turns. Feathers as layered simple shapes with one ink tick per visible feather-group. Muzzle/cheek fur gets the most love (it frames expression). Fur never renders glossy; wet fur (rain) is shown by clumped silhouette tufts and darkened value, never by shine.

## 3.6 Hands
Four-fingered, glove-soft, face-sized. Hands are the second face: each principal has a signature hand habit (Gary's pencil-spin, Julian's ring-spin, Ida's key-cradle, Otto's cup-engulf, Prudence's page-turn from the top corner). Wing-hands (Poppy, Ida, Margie, Prudence) keep three working "fingers" of primaries and are drawn fully capable — the world has no clumsy species.

## 3.7 Feet
Simple, grounded, mostly shod. Digitigrade stance suggested through boot shape rather than anatomy. Barefoot only in specific storybook cases (Otto in the café after hours — a bear's prerogative). Footwear tells class and job: Gary's scuffed brogues, Poppy's buttoned boots, Tuck's regulation shoes gone comfortably shapeless, Ferris's soles with the distinctive hole (a canonical Day 4 clue — the tread sheet is a design deliverable).

## 3.8 Eyes
Painted iris in a warm brown/amber/green range, one soft highlight, ink-line lids. Eye size scales with youth and openness: Milo largest relative, Beatrice most lidded. Blink rate and gaze targets are animation-spec'd per character (Chapter 8). Nobody has pure-black bead eyes except background wildlife (Pigeon Rule fauna).

## 3.9 Ears
The loudest emotional channel in the game. Every mammal's ears are rigged for attitude (alert / soft / pinned / one-turned); Tuck's ears are practically co-protagonists. Bird crests substitute (Poppy's frazzle, Ida's flick). Rule: ears react a beat *before* the face — the player's subconscious learns to watch them, which is exactly what the OBSERVE mechanic needs.

## 3.10 Tails
Tails are truth. Characters can manage their faces; tails leak (Ferris's tail is vainer than he is; Evelyn's does one slow curl when she's amused; Dot's gives one involuntary wag when Gary files good copy — she'd deny it). Deer tails are small and mostly still — the Vales are the composed family, which makes Julian's single tail-flick at the boathouse a scripted, devastating frame. Tail slots are tailored into all clothing.

## 3.11 Age Progression
Age is shown by: fur/feather silvering (muzzle first), posture settle, eye lid weight, and *object wear* (the older the character, the more loved their props). Flashback/sepia versions (young Archie, young Beatrice, Theodora, Jonah) use the same silhouettes with lighter line weight and dreamier wash — memory is drawn softer, not younger-prettier.

## 3.12 Accessories
One signature accessory per principal, load-bearing for silhouette and story (badge, umbrella, clipboard, camera, loupe, visor, telescope, sash, secateurs, pastry). Accessories are drawn at slightly hero scale (110%) and receive their own prop sheets (Chapter 6). No character gains or loses their signature accessory without a story reason — when Warren *hands over* the camera, the silhouette change is the story.

## 3.13 Silhouette Rules & Instant Recognition
Drivers, by character: Gary = arm length + satchel diagonal; Julian = antler crown + umbrella verticals; Clara = ear-pencil + book; Beatrice = braided-rope stillness + long neck line; Poppy = round glasses + clipboard + fluff; Warren = width + sash diagonal + camera box; Ferris = long low S-curve + tail plume; Prudence = neck + loupe pendant; Margie = round + towel over shoulder; Otto = mountain + tiny cup; Dot = compact bristle + double pens; Ida = tiny + visor halo; Gino = bulk + raised grapes; Milo = telescope + mask; Evelyn = brush of tail + apron + the pruning-sheath hip line; Tuck = ears + lean. The 48-pixel flat-black test (§2.11) is a gate on every character sheet before approval.

---

# CHAPTER 4 — COMPLETE CHARACTER BIBLE

*Template per character (asset-template compliant): Purpose · Description · Personality · Species · Height (Lanternside Scale, Gary = 1.0 ≈ 170cm) · Clothing · Color Palette · Props · Facial Expressions (portrait set + signature) · Turnaround notes (Front/Side/Back) · Action Poses · Animation Notes (walk, talk, idle, gestures) · Key Visual Storytelling Notes · Variations Required · Dependencies · Priority · Complexity · GPT Images Prompt.*

---

## GARY GIBBONS — The Reporter (Player Character)
**Purpose:** Protagonist; the player's eyes, hands, and conscience. **Priority: Critical. Complexity: Very High** (largest animation set in the game).
**Description:** A late-20s gibbon investigative reporter — long-limbed, gently rumpled, radiating earnest curiosity. Sandy-brown fur, dark expressive face with scruffy cheek fur, warm tired brown eyes. Moves like a question mark that learned manners.
**Personality:** Earnest, self-deprecating, relentlessly curious, kind under pressure. Measures himself against his grandfather's ghost; quietly at war with grapes.
**Species:** Gibbon. **Height:** 1.0 (the town's reference scale).
**Clothing:** Brown tweed jacket, elbow patches (one mended in slightly-wrong thread — Dot's stitching), mustard knit tie forever loosened, soft-collared shirt, brown trousers, scuffed brogues. Leather satchel worn cross-body (the silhouette diagonal). Grandpa's brass press badge inside the lapel.
**Color Palette:** Tweed brown `#7A5C3E`, Mustard Knit `#C9932F`, cream shirt, Vale Plum tie-pin accent, satchel `#5B4630`.
**Props:** Pencil (behind ear; drops when shocked — 4 scripted drops), notebook, satchel, badge, grape stress ball (apartment), loaner bellows camera (Day 3+), Archie's magnifying glass (credits → franchise tool).
**Facial Expressions:** Portrait set of 5 + unguarded set: "listening with his whole face," the badge-touch half-smile, the grape thousand-yard stare, the Night-6 quiet.
**Turnaround:** Front — open, slightly forward-leaning; arms hang past mid-thigh (draw the length proudly). Side — the satchel diagonal + question-mark spine. Back — jacket wrinkle map + tail-less gibbon seat, satchel strap X.
**Action Poses:** Note-scribbling at arm's length; door-frame lean; floor-sit (boathouse); board-reach (no stool needed — arms); umbrella-less rain trot with newspaper hat.
**Animation Notes:** *Walk* — loose-limbed amble, arms swinging a half-beat behind, 10fps, slight bounce. *Talk* — hands narrate; pencil conducts. *Idle* — badge touch (rare, meaningful), pencil spin, satchel re-shoulder, distant grape-stall glance if one is in frame. *Signature gestures* — the sit-down-on-the-floor (used twice, both scripted), the chair spin on gold deductions, the kettle-typewriter-board night triptych.
**Key Visual Storytelling:** He is the only character whose costume never changes — Gary is the constant the town revolves around. His badge is drawn one value brighter than physics allows.
**Variations Required:** Base; rain (newspaper hat); night apartment (jacket off, tie fully undone); sepia child (credits letter); camera-equipped (Day 3+).
**Dependencies:** Press badge prop sheet; satchel prop sheet; apartment set.

### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Character reference sheet: an anthropomorphic gibbon investigative reporter, late 20s — long-limbed and lanky, sandy-brown fur, dark expressive face with scruffy cheek fur, warm tired brown eyes, kind and slightly anxious expression. Rumpled brown tweed jacket with elbow patches, loosened mustard knit tie, heavy leather satchel worn cross-body and stuffed with notebooks, a pencil tucked behind one small round ear, a tarnished brass vintage press badge pinned inside the lapel. Full-body front view, 3/4 view, and back view, plus three facial expressions (neutral, surprised, warm smile), plain warm-cream textured-paper background, no environment.

---

## JULIAN VALE — The Brother
**Purpose:** The heart of the mystery; the frightened heir. **Priority: Critical. Complexity: High.**
**Description:** A young red deer stag, tall and handsome in an untested way, **antlers still in velvet** — soft, unfinished, a crown not yet hardened. Sleepless shadows behind a rehearsed smile. Carries the elegant Vale umbrella everywhere; from above or behind, its canopy hides his antlers completely.
**Personality:** Rehearsed warmth over private terror; charming in public, quiet when cornered; never cruel, deeply loved, deeply afraid.
**Species:** Red deer (stag). **Height:** 1.25 (1.45 to antler tips).
**Clothing:** Immaculate navy wool coat worn slightly like a costume, dove-grey scarf, fine gloves he removes when honest (a visual tell to spend carefully), polished shoes losing their polish as the week goes on (per-day wear overlay — a whole arc in shoe leather).
**Color Palette:** Navy `#2F3E5C`, silver-grey, guilty green accent `#4F6B3D` (the wax), velvet-antler brown.
**Props:** THE umbrella (silver duck-head handle — hero prop), Edmund's loose signet ring (the tell), the unopened will (only ever in his hands in the boathouse frame).
**Facial Expressions:** Public smile / private hollow / the boathouse break — the widest social-to-unguarded gap in the cast; his portrait set is really two characters and the sheet is labeled that way.
**Turnaround:** Front — vertical elegance, umbrella as cane. Side — the antler-umbrella double crown reads clearly. Back — canopy-over-antlers concealment demonstrated (this back view is literally a clue diagram; keep it in canon files).
**Action Poses:** Ceremony handshake; late-night crossing (hunched under umbrella); floor-sit despair; floorboard reveal; sibling reconciliation at the riverbank (shoulders finally down).
**Animation Notes:** *Walk* — public: measured, chin level; private: faster, head down, umbrella tight. *Talk* — almost-speeches with hand flourishes that die mid-air when he deflates. *Idle* — THE RING SPIN (the game's most important tell — 3-frame loop, subtle, always on when nervous), one slow ear-turn toward exits. *Signature* — the single tail-flick at the boathouse (one frame, scripted, devastating).
**Key Visual Storytelling:** Velvet antlers never mentioned, never absent. He is lit warmly in every frame including his worst — the art direction's thesis statement.
**Variations Required:** Base; night-crossing; boathouse (coat off — first time ever); finale (gloves off, standing beside Clara at equal frame weight).
**Dependencies:** Umbrella hero prop; signet ring prop; boathouse set.

### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Character reference sheet: an anthropomorphic young red deer stag, early 20s, tall and handsome in an untested way, antlers still covered in soft brown velvet, sleepless shadows under the eyes behind a rehearsed confident smile. Immaculate navy wool coat worn slightly like a costume, dove-grey scarf, a silver signet ring too loose on one finger, holding an elegant black umbrella with a carved silver duck-head handle. Full-body front view, 3/4 view, and back view showing the open umbrella canopy concealing the antlers from behind, plus three facial expressions (public smile, private worry, quiet grief), plain warm-cream textured-paper background, no environment.

---

## CLARA VALE — The Sister
**Purpose:** The overlooked heir; the moral spine of the endgame. **Priority: Critical. Complexity: Medium-High.**
**Description:** A young doe — poised without trying, in exactly the way Julian tries. Sharp watchful dark eyes that soften only for her brother. A drafting pencil lives behind one tall ear.
**Personality:** Precise, dry, economical; answers questions with better questions; hurt and loyal in the same breath.
**Species:** Red deer (doe). **Height:** 0.95.
**Clothing:** Oatmeal cardigan over an inherited forest-green dress (fine cloth, older than she is), practical flat boots, no jewelry except a plain hairpin that was her father's drafting clip.
**Color Palette:** Oatmeal `#D9C9A8`, Forest `#3E5A3C`, warm doe russet.
**Props:** Book of logic puzzles (dog-eared), the drafting pencil, one of the childhood two-person puzzle boxes (Day 6 garden scene — set dressing that becomes a prop in her hands).
**Facial Expressions:** Level gaze / the first crack ("that's a better question…") / riverbank tears she doesn't wipe. Her tell is a stillness like her mother's, one generation less practiced.
**Turnaround:** Front — upright, arms often folded around the book. Side — the ear-pencil is the ID. Back — cardigan hangs straight; she doesn't fidget.
**Action Poses:** Garden bench interview; puzzle-box turn; the walk to Julian at the riverbank (the game's most important eleven steps — hand-animated).
**Animation Notes:** *Walk* — efficient, quiet, no bounce. *Talk* — minimal gesture; one raised brow does the work of paragraphs. *Idle* — page turn, pencil re-seat. *Signature* — offering the puzzle box with both hands.
**Key Visual Storytelling:** Framed at equal visual weight with Julian from Day 6 onward — the composition argues the will's verdict before it's read.
**Variations Required:** Base; garden; finale (father's drafting clip visible at last).
**Dependencies:** Puzzle-box prop; Vale garden set.

### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Character reference sheet: an anthropomorphic young red deer doe, early 20s, poised and watchful, sharp intelligent dark eyes with warmth underneath, a drafting pencil tucked behind one tall ear. Practical oatmeal cardigan over an elegant inherited forest-green vintage dress, holding a small dog-eared book of logic puzzles, dry knowing expression. Full-body front view, 3/4 view, and back view, plus three facial expressions (level composure, wry almost-smile, quiet emotion), plain warm-cream textured-paper background, no environment.

---

## BEATRICE VALE — The Mother
**Purpose:** Keeper of the will's secret; the emotional summit. **Priority: Critical. Complexity: Medium.**
**Description:** An elegant older doe, muzzle silvered, composure absolute. She never lies; her stillness is a language.
**Personality:** Serene, exact, fiercely private, kind at depth. Every sentence true; every silence load-bearing.
**Species:** Red deer (doe). **Height:** 1.05.
**Clothing:** Dark plum dress with a high soft collar, gardening gloves tucked in the belt (she works the garden herself — the doorstep-vegetables side story lives in those gloves), mourning brooch of pressed ivy.
**Color Palette:** Vale Plum `#6E4468`, silver, ivy.
**Props:** Tea service for two (always already poured), the brooch, gardening basket.
**Facial Expressions:** Portrait set biased toward micro-shifts: her five portraits differ by millimeters, deliberately. Signature unguarded: the long look at the Percolator photograph.
**Turnaround:** Front — rope-braid posture, hands folded. Side — the long neck line, chin level. Back — the straightest back in the cast.
**Action Poses:** Pouring tea (already done before Gary arrives — animate the *aftermath*); quarter-turning the cup; garden kneel.
**Animation Notes:** *Walk* — gliding, unhurried. *Talk* — near-motionless; the teacup quarter-turn is her only tell. *Idle* — she does not fidget; her idle is attentive stillness (technically: 2-frame breathing loop and blinks — the cheapest idle in the game and the most characterful).
**Key Visual Storytelling:** The brooch's pressed ivy matches the wax seal's wreath — seeded from Day 1, never remarked.
**Variations Required:** Base; garden; finale reading (she wears one lantern-amber shawl detail — the only warm accent she allows all game).
**Dependencies:** Manor parlor set; brooch prop.

### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Character reference sheet: an anthropomorphic elderly red deer doe, silvered muzzle, serene unreadable kind expression, posture of absolute composure. Dark plum vintage dress with a high soft collar, gardening gloves tucked into her belt, a small mourning brooch containing pressed ivy leaves. Full-body front view, 3/4 view, and back view, plus three facial expressions (serene, faintly warm, quietly sorrowful — differing only subtly), plain warm-cream textured-paper background, no environment.

---

## ARCHIE GIBBONS — The Grandfather (memory)
**Purpose:** The ghost the game is about; flashback/portrait/credits presence. **Priority: Important. Complexity: Low-Medium** (no gameplay rig; illustration set only).
**Description/Personality:** A weathered, charismatic elderly gibbon reporter — silver-flecked fur, fedora with the brass badge on the band, rolled sleeves, laughing mid-story. Warm gravel made visible.
**Species:** Gibbon. **Height:** 1.0 (Gary inherited the frame along with everything else).
**Clothing/Palette/Props:** Sepia memory palette (desaturated ambers); fedora, badge, field notebook, and — revealed at credits — the engraved magnifying glass and a jar of grape jam.
**Appearances:** Percolator wall photo (young, arm-in-arm with young Beatrice — unlabeled, unexplained); morgue clippings byline portraits; NG+ margin-note doodle avatar; credits parcel.
**Variations Required:** Young (founding-era photo), prime (byline portrait), elderly (Gary's memory), doodle avatar.

### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Sepia-toned memory illustration, softer dreamlike watercolor edges: an anthropomorphic weathered charismatic elderly gibbon reporter, silver-flecked sandy fur, wearing a vintage fedora with a brass press badge on the hat band, rolled shirtsleeves and suspenders, laughing mid-story with warm knowing eyes, holding a worn field notebook. Plain aged-paper background with faint coffee-ring stains.

---

## POPPY FINCH — The Event Planner
**Purpose:** Day 2 suspect; comic engine; recovery-ceremony co-lead. **Priority: Critical. Complexity: Medium-High** (feather-fluff rig).
**Description:** A tiny goldfinch vibrating at the frequency of responsibility. Yellow-and-black feathers permanently frazzled, three pens through the head-feathers, oversized round glasses that fog on cue.
**Personality:** Anxious, competent, over-prepared, apologizes to furniture; grows into calm authority by Day 7.
**Species:** European goldfinch. **Height:** 0.45.
**Clothing:** Neat coral cardigan-vest tailored for wings, laminated-card lanyard (fourteen colored contingency cards — each card is legible set dressing: "PLAN F: SWANS"), buttoned boots, clipboard held like a shield.
**Color Palette:** Goldfinch yellow/black/red face patch, Coral `#E0796A`, Sky `#9CB8C9`.
**Props:** Clipboard (hero prop — the checklist IS evidence), lanyard cards, whistle she has never once dared to blow.
**Facial Expressions:** The fog-and-fluff double tell (glasses fog + feathers fluff one size) is her OBSERVE hook and must read in idle. Day 7 set adds "competent and glowing."
**Turnaround:** Front — round glasses + clipboard = instant ID. Side — head-feather pens. Back — tail feathers + lanyard bow.
**Action Poses:** Bunting crisis (tangled, dignified); the eleven-second confession wilt; conducting the recovery ceremony with two wings and a checklist.
**Animation Notes:** *Walk* — quick hop-step, 12fps, busiest cycle in the cast. *Talk* — run-on gestures, self-interrupting freeze. *Idle* — card-shuffle, glasses wipe, fluff-settle. *Signature* — the full-body deflate-and-refluff when a plan survives contact with reality.
**Variations Required:** Base; ceremony formal sash; Day 7 calm (feathers finally smooth — the arc, drawn).
**Dependencies:** Clipboard/checklist prop; Founders' Square set.

### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Character reference sheet: an anthropomorphic tiny goldfinch event planner, mid 20s, yellow and black feathers with a red face patch, feathers slightly frazzled with three pens stuck through her head-feathers, oversized round glasses fogged with panic, cheerful overwhelmed expression. Neat coral cardigan-vest tailored for wings, a lanyard of laminated colored contingency cards, holding a clipboard like a shield. Full-body front view, 3/4 view, and back view, plus three facial expressions (overwhelmed cheer, wide-eyed panic with fogged glasses, proud calm), plain warm-cream textured-paper background, no environment.

---

## WARREN HOLT — The Council Guardian
**Purpose:** Day 3 suspect; the town's steward; camera-lender; the anonymous handyman. **Priority: Critical. Complexity: Medium.**
**Description:** A sturdy grey-streaked badger, barrel-chested, magnificent whiskers, kind melancholy eyes behind chained reading glasses. An animal that holds ground, who held it eight years for someone else.
**Personality:** Measured, dutiful, quietly yearning; joy deferred and finally claimed.
**Species:** European badger. **Height:** 1.1 (wide).
**Clothing:** Tweed waistcoat with watch chain, the ceremonial gold sash he finds embarrassing (worn slightly askew on purpose — his one rebellion), sturdy boots.
**Color Palette:** Slate `#5A6168`, badger black/white stripe, ceremonial gold `#C9A23F`.
**Props:** Antique wooden bellows camera (hero prop — becomes Gary's tool), lighthouse folio, photograph portfolio, one brass screw (the handyman side story).
**Facial Expressions:** Glasses-cleaning as displacement (his tell); the "happiest sentence" beam at the finale — the widest smile budgeted in the game.
**Turnaround:** Front — width + sash diagonal. Side — camera box at hip. Back — sash knot + stripe over the collar.
**Action Poses:** Speech at podium; balcony long-exposure (holding still like a professional); pigeon congregation; the dock departure wave.
**Animation Notes:** *Walk* — deliberate, planted, slight roll. *Talk* — measured with paragraph-sized pauses. *Idle* — glasses polish, watch check, whisker settle. *Signature* — the camera hand-off (two hands, small bow — a knighting).
**Variations Required:** Base; ceremony; travel coat (finale/postcards).
**Dependencies:** Bellows camera prop; council hall + balcony sets; pigeon fauna set.

### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Character reference sheet: an anthropomorphic sturdy badger, early 60s, barrel-chested with grey-streaked black and white fur and magnificent whiskers, kind melancholy eyes, reading glasses on a chain. Tweed waistcoat with a watch chain, a slightly embarrassing ceremonial gold sash worn askew, holding an antique wooden bellows camera. Full-body front view, 3/4 view, and back view, plus three facial expressions (measured calm, wistful, beaming joy), plain warm-cream textured-paper background, no environment.

---

## FERRIS MOTT — The Treasure Weasel
**Purpose:** Day 4 grand red herring; the pivot witness; the town's adopted rascal. **Priority: Critical. Complexity: High** (most elastic body in the cast).
**Description:** A wiry weasel — the only weasel in Lanternside — all low fast S-curves, with a magnificent groomed russet tail he refers to as "heritage couture." Brass goggles on a battered hat; coat lined with maps and trowels; divining rod that is obviously a bent curtain rail.
**Personality:** Conspiratorial, theatrical, third-person when excited, secretly lonely, ultimately dear.
**Species:** Least weasel (drawn at 0.85 scale — storybook license). **Height:** 0.85 long-and-low.
**Clothing:** Long map-lined coat (interior is a prop sheet of its own), battered hat, fingerless gloves, the boots with THE hole in the left sole (canonical tread — clue sheet required).
**Color Palette:** Rust `#B25A33`, moss `#6B7245`, map-paper cream.
**Props:** Divining rod, rolled maps, trowel set, jam jar (evidence, regrettably), the stolen-then-returned 1890s survey map.
**Facial Expressions:** Double-wink; destiny-smelling nose lift; the lockup honesty (goggles off for the first time — schedule an unguarded portrait).
**Turnaround:** Front — S-curve crouch-lean. Side — THE TAIL (the photograph clue; this side view is canon evidence reference). Back — tail plume + coat hem full of tool bulges.
**Action Poses:** Skulk (humming); dig; caught-mid-dig freeze; garden penance with watering can; post-credits *clink* discovery.
**Animation Notes:** *Walk* — liquid lope, body arriving in sections. *Talk* — whisper-lean regardless of distance. *Idle* — tail grooming (his vanity outranks his stealth), map consult. *Signature* — the two-wink; the tail-first exit around corners.
**Variations Required:** Base; night skulk; lockup (hatless, smaller); gardener (Day 7 — apron over the coat, tail still immaculate).
**Dependencies:** Boot-tread clue sheet; night photograph asset (tail must match this side view exactly); survey map prop.

### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Character reference sheet: an anthropomorphic wiry weasel treasure hunter, early 40s, long low sinuous silhouette, delighted conspiratorial grin, a magnificent groomed russet tail carried like a prize. Brass goggles pushed up on a battered hat, a long coat lined inside with rolled maps and small trowels, fingerless gloves, holding a bent curtain rail like a divining rod. Full-body front view, full side view clearly showing the tail, and back view, plus three facial expressions (conspiratorial delight, caught-in-the-act freeze, deflated honesty), plain warm-cream textured-paper background, no environment.

---

## PRUDENCE MARLOWE — The Curator
**Purpose:** Day 5 suspect; seal expert; keeper of the Theodora/Jonah romance. **Priority: Critical. Complexity: Medium.**
**Description:** A tall grey heron — patient, precise, motionless for minutes and then sudden. Ink-stained wingtip fingers, jeweler's loupe pendant, a cardigan with more patches than original wool.
**Personality:** Stern scholarship over romantic fire; twenty years of vindication deferred; melts around Evelyn.
**Species:** Grey heron. **Height:** 1.15 (mostly neck).
**Clothing:** Fern-green patched cardigan, long grey skirt, archive gloves in a pocket (worn only for THE letters), loupe on a ribbon.
**Color Palette:** Heron grey `#8C959B`, Fern `#4F6B3D`, ink blue `#3A4A6B`.
**Props:** Loupe (hero prop — lent to Gary for the portrait examination), ribbon-tied letter bundles, the visitor ledger she makes everyone sign.
**Facial Expressions:** The stillness-then-strike when shown the seal sketch ("Where did you get this."); girlish excitement leaking through scholarly deadpan; the credits letter-reading face (wordless scene — her most important portrait).
**Turnaround:** Front — vertical neck line + loupe. Side — heron profile, reading posture like a question mark reversed from Gary's. Back — cardigan patch map (each patch a different decade — set dressing as biography).
**Action Poses:** Ladder reach; letter cradle; the loupe lean; standing beside Evelyn not-quite-touching (framed at hand-distance; the game never closes it, the epilogue exhibition poster does).
**Animation Notes:** *Walk* — long slow strides, head steady as a gimbal. *Talk* — lecture cadence with sudden tempo breaks. *Idle* — page turn from the top corner, loupe polish. *Signature* — the freeze (full stop, three seconds) when evidence surprises her.
**Variations Required:** Base; archive gloves; exhibition-opening best cardigan (epilogue).
**Dependencies:** Archive set; letters prop set; Evelyn.

### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Character reference sheet: an anthropomorphic tall grey heron archivist, late 50s, patient precise bearing, long neck, expression of stern scholarship melting into romantic excitement. Ink-stained wingtip fingers, a jeweler's loupe worn as a pendant on a ribbon, a much-patched fern-green cardigan over a long grey skirt, arms full of ribbon-tied letter bundles. Full-body front view, 3/4 view, and back view, plus three facial expressions (stern focus, sudden stillness of surprise, radiant scholarly joy), plain warm-cream textured-paper background, no environment.

---

## MARGIE PLUM — The Innkeeper
**Purpose:** Rumor engine; Warren-testimony source; the unclaimed-key tearjerker. **Priority: Important. Complexity: Medium.**
**Description:** A plump flour-dusted hen, terrifyingly perceptive, warmth with a wingspan. Runs The Drowsy Lantern like a weather system of care.
**Personality:** Gossip as love language, never cruel; everything ends in "pet" or "love"; grief kept in a drawer, literally.
**Species:** Hen (buff Orpington coloring). **Height:** 0.95 (wide).
**Clothing:** Plum dress, flour-dusted apron, tea towel over shoulder (the silhouette flag), tiny spectacles she wears only for the guest register.
**Color Palette:** Vale Plum (coincidence she'd deny enjoying), Flour White, buff feather gold.
**Props:** Tea towel, guest register, sherry glass kept upside-down at the corner seat, the music box (side story — one unguarded portrait scheduled).
**Animation Notes:** *Walk* — bustling glide, feathers settling behind. *Talk* — hands-on-hips lean-in. *Idle* — towel flick, counter polish. *Signature* — the eyebrow that hears everything; the "pet"→"Mr. Gibbons" temperature drop (delivered entirely by posture — reputation system UI, drawn).
**Variations Required:** Base; evening (candlelit bar); music-box scene (spectacles off).
**Dependencies:** Inn set; music box prop.

### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Character reference sheet: an anthropomorphic plump hen innkeeper, early 60s, warm buff-gold feathers dusted with flour, terrifyingly perceptive fond smirk, wings on hips. Vintage plum dress with an apron, a tea towel over one shoulder, tiny spectacles tucked into the apron pocket. Full-body front view, 3/4 view, and back view, plus three facial expressions (fond smirk, scandalized delight, tender grief), plain warm-cream textured-paper background, no environment.

---

## OTTO KESSLER — The Café Owner
**Purpose:** Social crossroads; the chalkboard oracle; witness to the fragment. **Priority: Important. Complexity: Medium** (scale rig with tiny props).
**Description:** An enormous gentle brown bear; tiny espresso cups vanish into his paws. Serenity with an apron.
**Personality:** Speaks in coffee metaphors; steadiness incarnate; the town's unofficial confessor.
**Species:** Brown bear. **Height:** 1.5 (the scale ceiling).
**Clothing:** Canvas apron with coffee-plant embroidery, rolled sleeves over massive forearms, soft house shoes after hours (barefoot bear's prerogative reserved for one late-night scene).
**Color Palette:** Espresso `#4A3527`, cream, apron canvas.
**Props:** Tiny cup (the visual gag is load-bearing — always 40% too small), chalk, the grape bowl (Gary's Everest), the copper machine (environment-prop hybrid, see Chapter 5/6).
**Animation Notes:** *Walk* — unhurried mass, floorboard-creak sync. *Talk* — slow nods, cup gestures of surgical delicacy. *Idle* — cup polish, chalk tap. *Signature* — sliding an espresso exactly one coaster-length with one claw.
**Variations Required:** Base; competition day (best apron, nose red from the cold — side story); after-hours.
**Dependencies:** Percolator set; chalkboard content system (daily text layer).

### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Character reference sheet: an anthropomorphic enormous gentle brown bear barista, mid 40s, serene half-smile, holding a comically tiny white espresso cup delicately in one huge paw. Canvas apron with embroidered coffee plants, rolled shirt sleeves. Full-body front view, 3/4 view, and back view, plus three facial expressions (serene, quietly amused, gently concerned), plain warm-cream textured-paper background, no environment.

---

## DOT RAMIREZ — The Editor
**Purpose:** Morning pressure-test; Archie's colleague; the Ledger's spine. **Priority: Important. Complexity: Medium.**
**Description:** A compact grey-muzzled wire-haired terrier, affectionate impatience in a rolled-sleeve shirt, a red pen behind each ear.
**Personality:** Gravel and gold; bites only lazy paragraphs; holds Archie's memory in a drawer she doesn't open.
**Species:** Wire fox terrier. **Height:** 0.8.
**Clothing:** Ink-smudged shirt, sleeve garters, waistcoat, reading glasses pushed up between her ears.
**Color Palette:** Newsprint grey, editor red `#B03A2E`, terrier wire-white.
**Props:** Red pens (two — the Day 1 tutorial mystery), copy spike, the front-page wall behind her desk (with its one gap — a Chapter 5 set note).
**Animation Notes:** *Walk* — brisk trot, papers in wake. *Talk* — pen conducts; verdicts land with a chin drop. *Idle* — copy-mark scribble, glasses push. *Signature* — the single involuntary tail wag when Gary files good copy (1-frame, she'd deny it, players will clip it).
**Variations Required:** Base; late-night (visor, sleeves fully rolled).
**Dependencies:** Ledger office set; morgue set.

### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Character reference sheet: an anthropomorphic compact wire-haired fox terrier newspaper editor, mid 50s, grey-muzzled with bristling white wire fur, expression of affectionate impatience, reading glasses pushed up between her ears, a red pen behind each ear. Ink-smudged rolled-sleeve shirt with sleeve garters and a waistcoat. Full-body front view, 3/4 view, and back view, plus three facial expressions (impatient, grudging approval, rare soft pride), plain warm-cream textured-paper background, no environment.

---

## IDA WREN — The Locksmith
**Purpose:** Keeper of the two-keys fact; the unclaimed-key side story; the smallest citizen with the finest hands. **Priority: Important. Complexity: Medium** (miniature-scale interactions).
**Description:** A tiny wren, mid-70s, bright clever eyes under a magnifying visor, leather apron of miniature tools. Talks to locks like shy animals.
**Personality:** Patient, precise, drily fond; institutional memory of the whole district in brass.
**Species:** Eurasian wren. **Height:** 0.35 (the scale floor).
**Clothing:** Leather work apron over a russet feather-coat, visor (flipped up = talking, down = working — a two-state rig), sleeve cuffs.
**Color Palette:** Brass `#B8863B`, walnut `#5C4326`, wren russet.
**Props:** The ledger (hero document prop), ornate key held to the light, ten-thousand-drawer wall (set), drawer 400.
**Animation Notes:** *Walk* — quick precise hops along her counter-rail (her shop is rigged with wren-scale rails and perches — a set design signature). *Talk* — visor flip, head tilts. *Idle* — key-soothing cradle, drawer alphabetizing. *Signature* — holding a key to the lamplight like a vet checking a bird's wing.
**Variations Required:** Base; visor-down working.
**Dependencies:** Wren & Wick set (rail system!); ledger prop; the covered chair in the back corner (seed — never explained, always painted).

### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Character reference sheet: an anthropomorphic tiny wren locksmith, mid 70s, round russet-brown feathered body, bright clever eyes, a magnifying visor flipped up on her head, leather work apron fitted with loops of miniature locksmith tools, holding an ornate antique brass key up to the light with both wing-hands as if soothing a shy animal. Full-body front view, 3/4 view, and back view, plus three facial expressions (bright focus, dry amusement, tender memory), plain warm-cream textured-paper background, no environment.

---

## GINO PUGLISI — The Fruit Vendor
**Purpose:** The grape thread's unwitting antagonist; Market Row's opera. **Priority: Important. Complexity: Low-Medium.**
**Description:** A big operatic boar, joy incarnate, forever mid-aria of produce. His stall is 40% grapes, which is 100% of Gary's problem.
**Personality:** Everything is *bellissimo* or a tragedy; generosity as performance and truth.
**Species:** Wild boar (silver-bristled). **Height:** 1.2.
**Clothing:** Striped market apron, rolled sleeves, neckerchief, tiny hat that has given up.
**Color Palette:** Market-stripe green, tomato red, boar silver-bristle.
**Props:** The Grapes (hero prop, Grape Green `#9FB35C` reserved), scale-and-weights, the memorial marrow vine (Day 7).
**Animation Notes:** *Walk* — prow-first sail through crowds. *Talk* — full-arm opera; produce presented like relics. *Idle* — fruit polishing, stack adjusting. *Signature* — the two-handed grape elevation directly into Gary's eyeline (scheduled daily; the animation team's favorite cruelty).
**Variations Required:** Base; festival stall; mourning band (the Marrow Affair — one day only).
**Dependencies:** Market Row set; grape prop set.

### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Character reference sheet: an anthropomorphic big wild boar fruit vendor, mid 60s, silver-bristled, joy incarnate, mid-gesture of operatic triumph. Striped green market apron, rolled sleeves, red neckerchief, a tiny hat, holding aloft a flawless bunch of green grapes in both hands like a sacred offering. Full-body front view, 3/4 view, and back view, plus three facial expressions (operatic joy, theatrical tragedy, tender pride), plain warm-cream textured-paper background, no environment.

---

## MILO TANAKA — The Junior Detective
**Purpose:** The opportunity witness; Gary's junior stringer; the game's future. **Priority: Critical. Complexity: Medium.**
**Description:** An 11-year-old raccoon kit — born wearing a detective's mask and fully aware of it. Homemade telescope, notebook labeled "CRIMES?", mismatched laces.
**Personality:** Earnest, brave in the way of kids who read about bravery; ethics learned from newspapers; the line "You believed me enough to check" belongs to him.
**Species:** Raccoon. **Height:** 0.65.
**Clothing:** Knit vest over a school shirt, shorts, 1950s canvas sneakers (laces mismatched — one red, one blue), satchel imitating Gary's (spot the hero-worship).
**Color Palette:** Raccoon grey + primary red/blue.
**Props:** Cardboard-and-brass telescope (hero prop), CRIMES? notebook, magnifying glass in breast pocket, framed two-sentence byline (epilogue).
**Animation Notes:** *Walk* — scamper with sudden professional composure when observed. *Talk* — whole-body emphasis; whisper mode for CRIMES. *Idle* — telescope polish, notebook flip, tail curl on the fire-escape rail. *Signature* — the salute he gives Gary that Gary always returns seriously.
**Variations Required:** Base; pajamas + blanket cape (fire-escape night scene); front-row ceremony best vest OR grounded-at-window (the attribution-choice fork — both must be built).
**Dependencies:** Fire-escape set; telescope prop; the sightline puzzle asset.

### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Character reference sheet: an anthropomorphic raccoon kit, 11 years old, natural bandit-mask markings, gap-toothed determined grin, a homemade cardboard-and-brass telescope under one arm, a small notebook labeled "CRIMES?" in a paw, a magnifying glass in the breast pocket of a knit vest, shorts, and 1950s canvas sneakers with mismatched red and blue laces. Full-body front view, 3/4 view, and back view, plus three facial expressions (determined, awed, proud), plain warm-cream textured-paper background, no environment.

---

## EVELYN CROFT — The Florist
**Purpose:** Prudence's alibi and quiet companion; the fox line of the old rivalry; the ivy thread. **Priority: Important. Complexity: Low-Medium.**
**Description:** A calm, wry red fox, paws always in stems, secateurs riding a worn leather pruning sheath at her hip with a craftsman's easy readiness, one ivy sprig behind an ear.
**Personality:** Unhurried warmth; wit at low volume; grief and hope composted into flowers.
**Species:** Red fox. **Height:** 0.9.
**Clothing:** Sage canvas work apron over a dusty-rose dress, sleeve cuffs, the secateurs' worn leather pruning sheath at her hip (part of her silhouette — the fastest pruner in the district).
**Color Palette:** Fox russet, Sage `#8A9B7A`, dusty rose.
**Props:** Secateurs, stem bundles, the single morning flower for the Archive step (a daily ambient prop with a secret).
**Animation Notes:** *Walk* — soft-footed, tail as counterweight. *Talk* — works while talking; points with a stem. *Idle* — one slow tail curl when amused (her tell). *Signature* — hand landing on Prudence's shoulder at the credits reading, drawn once, worth the whole rig.
**Variations Required:** Base; exhibition-opening (epilogue).
**Dependencies:** Flower shop set; Archive step ambient.

### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Character reference sheet: an anthropomorphic red fox florist, late 40s, calm wry amused expression, russet fur, a single ivy sprig tucked behind one ear. Sage-green canvas work apron over a dusty-rose vintage dress, garden secateurs resting in a worn leather pruning sheath at her hip, paws holding a bundle of autumn flower stems. Full-body front view, 3/4 view, and back view, plus three facial expressions (wry calm, quiet amusement, tender warmth), plain warm-cream textured-paper background, no environment.

---

## CONSTABLE BRAM TUCK — The Constable
**Purpose:** Cozy law; Ferris's sentencer; the finale's official hands. **Priority: Important. Complexity: Low-Medium.**
**Description:** A magnificently unhurried basset hound; heavy-lidded eyes that miss nothing; ears deputized as separate officers; leaning on lampposts as a lifestyle.
**Personality:** Solves most crime by waiting near pastry; fond skeptic of journalism; kindness wearing a uniform.
**Species:** Basset hound. **Height:** 0.95 (60% ears by silhouette).
**Clothing:** Slightly rumpled 1940s constable uniform (no weapon — whistle and notebook), custodian-style helmet resting at an angle no regulation approves.
**Color Palette:** Constable blue `#3E5266`, pastry gold, basset tricolor.
**Props:** Half-eaten pastry (persistent — it regenerates between scenes and one achievement notices), whistle, notebook ("district business" line gets a close-up insert of this notebook — schedule the prop art).
**Animation Notes:** *Walk* — the slowest cycle in the game, and somehow always already there. *Talk* — minimal; ears do the reacting. *Idle* — lamppost lean (his sit-spot equivalent), pastry consideration. *Signature* — the standing nap that isn't (one eye opens exactly when it matters).
**Variations Required:** Base; ceremony helmet-straightened (his version of formal).
**Dependencies:** Lamppost props; lockup set.

### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Character reference sheet: an anthropomorphic basset hound constable, early 50s, magnificently unhurried, heavy-lidded knowing eyes, very long ears, slightly rumpled vintage 1940s constable uniform with a custodian helmet tilted at a comfortable angle, a half-eaten pastry in one paw, a brass whistle on a chain. Full-body front view, 3/4 view, and back view, plus three facial expressions (drowsy patience, one-eye-open alertness, warm approval), plain warm-cream textured-paper background, no environment.

---

## THE CROWD & FAUNA KIT
**Purpose:** Living-town population + Pigeon Rule wildlife. **Priority: Important. Complexity: Medium (as a set).**
**Contents — exact census:** **12 adult background citizens** built on 4 shared body rigs with swap heads/costumes: hedgehog schoolteacher, otter postman, mole gardener, squirrel twins (2), goat baker, beaver ferrywoman, mouse choir (3), elderly tortoise who has opinions about the monument, and the Whistler — a song thrush street musician. Plus the **skipping-rope children set (3)** — kit total: **15 anthropomorphic figures.** (The ferrywoman is a beaver, not a duck: under the Pigeon Rule, ducks are river fauna, and the kit never contradicts the rule.) **Fauna (non-anthropomorphic, Pigeon Rule):** pigeons (including THE divorced pair — two distinct paint jobs), sparrows, river ducks, gulls, one heroic goldfish in the Percolator window.
### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ A character lineup sheet of fifteen anthropomorphic background townsfolk of a cozy 1930s–1950s European animal town — a hedgehog schoolteacher, an otter postman in uniform, a mole gardener, squirrel twins, a goat baker, a beaver ferrywoman, three mouse choir singers, an elderly tortoise with a cane, a song thrush street musician with a tin whistle, and three children of mixed species with a skipping rope — all in vintage working clothes, varied heights from tiny to large, full-body, plain warm-cream textured-paper background.

---

# CHAPTER 5 — ENVIRONMENT BIBLE

*Ten locations (design-doc canon; the brief's "Museum" and "Library" are unified as the Lanternside Archive, and "Harbor" is the Riverbank & Old Boathouse). Template per location: Purpose · Mood · Architecture · Lighting · Props · Textures · Colors · Ambient Life · Animation Ideas · Gameplay Interactions · Variations Required · Priority · Complexity · GPT Images Prompt. Every location ships as per-phase parallax layer sets (morning/midday/evening/night × bg/mid/fg) plus rain variants per tech spec §10.*

---

## 5.1 GARY'S APARTMENT (The Hub)
**Purpose:** Home base; nightly board phase; the kettle-typewriter-board ritual; save point. **Priority: Critical. Complexity: Very High** (most states of any set).
**Mood:** The good kind of alone. Lamplight, tea steam, rain on the round window.
**Architecture:** Attic room above the Ledger — sloped ceiling, exposed beams, one round window facing the square, narrow bed, desk under the eave, THE BOARD wall (grows a second panel Day 4, wraps the corner by Day 6 — three authored wall states).
**Lighting:** Desk lamp amber pool as the composition anchor; window supplies phase color; night = the signature amber-vs-teal chord at maximum.
**Props:** Investigation board (see Ch.6/7), typewriter, kettle + one honest mug, grape stress ball (migrates nightly — authored positions), Archie's badge stand, photo line (prints drying, Day 3+), narrow bookshelf of Archie's clippings, coat hook, notebook on the pillow.
**Textures:** Warm wood, wool blanket, paper everywhere, cork.
**Colors:** Tweed browns, Paper Cream, amber pool, teal window night.
**Ambient Life:** Rain on glass; steam; curtain breath; the Ledger's muffled typewriter percussion from below (audio-visual pairing anchor); pigeon silhouettes on the sill.
**Animation Ideas:** Kettle rattle-to-whistle; typewriter carriage ding; string tautening; lamp moth (one, polite); board shadow growth across the week.
**Gameplay Interactions:** Board phase, Evening Edition desk, Morning Pages at the window seat, save (bed), photo line review, stress-ball examine (grape thread), badge examine (Ask Grandpa home anchor).
**Variations Required:** 3 board-wall states × 4 phases + rain; Day 7 morning (board complete — the postcard shot); post-game (board cleared, one card: "NEXT STORY?").
### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Interior wide establishing shot, no characters: a cozy cluttered attic apartment above a newspaper office at night — sloped ceiling with exposed beams, rain on a round window glowing teal, a desk lamp pooling warm amber light over a vintage typewriter, a kettle steaming on a small stove, and one wall covered by a large cork investigation board full of pinned pencil sketches, index cards, photographs, and taut red string, a small grape-shaped stress ball on the desk, a brass press badge displayed on a little stand, prints drying on a string line.

## 5.2 THE LANTERNSIDE LEDGER — Office & Morgue
**Purpose:** Dot's pressure-tests; press identity; the Morgue research room (quietest room in the game). **Priority: Critical. Complexity: High.**
**Mood:** Office — brisk ink-and-deadline warmth. Morgue — held-breath paper cathedral.
**Architecture:** Ground floor beneath Gary's attic: press room with the small proofing press, Dot's desk fortress, the front-page wall (fifty years of history — WITH ONE GAP, unexplained, seed §III.28); basement Morgue: bound-volume shelves, clipping drawers (YEAR × SUBJECT), Archie's preserved desk with the locked drawer, one green-shaded lamp per table.
**Lighting:** Office — daylight through gold-lettered windows; Morgue — green-gold lamp pools in soft dark (the one room where teal deepens — reverently, not ominously).
**Props:** Copy spike, pneumatic message tube to upstairs (Gary's alarm clock, canonically), red pen cup (minus two — tutorial mystery), the missing bound volume's gap on the shelf, weather-column ledgers, "STORIES THAT GOT AWAY" drawer.
**Ambient Life:** Type percussion, proof pages on lines, ink smell drawn as faint blue haze, dust motes in lamp cones.
**Animation Ideas:** Drawer pull + card-thumb loop (the research verb, made tactile); volume slide; the tube's *thunk-rattle-thunk*.
**Gameplay Interactions:** Morning Pitch (Dot), Morgue search (drawer UI), weather-column clue path, handwriting-ledger comparisons, clipping collectibles, Archie memory triggers.
**Variations Required:** Office 4 phases; Morgue single timeless state (it has no weather and no hour — deliberate).
### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Interior wide establishing shot, no characters: the basement newspaper archive of a small-town paper — tall shelves of huge leather-bound newspaper volumes, wooden card-catalog drawers labeled by year and subject, long reading tables with green-shaded brass lamps casting warm pools in soft shadow, one preserved antique reporter's desk with a locked drawer and a dusty typewriter, dust motes in the lamplight, one conspicuous gap in a wall of framed front pages.

## 5.3 THE PERCOLATOR (Café)
**Purpose:** Social crossroads; chalkboard oracle; the fragment scene; rain refuge. **Priority: Critical. Complexity: High** (crowd states).
**Mood:** Steam-warm murmur; the town's living room.
**Architecture:** Snug corner shop, bay window with the heroic goldfish, mismatched chairs (each one belongs to somebody — regulars' chairs are set-dressing biography), three counter heights (bear/standard/wren), the copper machine as the room's gleaming heart.
**Lighting:** Morning gold through steam; evening candle-jars per table.
**Props:** THE CHALKBOARD (daily text layer — a content-driven asset), copper machine, grape bowl (Grape Green, always in Gary's eyeline — composition rule), fifty years of festival photos on the wall (including the young-Archie-and-Beatrice frame: painted, unlabeled, canon), tiny cup shelf.
**Ambient Life:** Steam bloom, cup clinks, the goldfish's opinions, rain-day crowd compression (unique scenes per design doc II.14.2).
**Animation Ideas:** Machine hiss-and-shudder; chalk being rewritten (Otto's paw, morning ambient); steam letters briefly legible (once, Easter egg).
**Gameplay Interactions:** Vox pop hub, rumor readings, fragment observe-scene (Day 6 — the floor gets a clean spotlight-ish warmth that day, subtly), Otto side story, rain remix scenes, grape bowl (Willpower tracker beat).
**Variations Required:** 4 phases + rain-crowded + competition-day bunting + Day 6 fragment staging.
### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Interior wide establishing shot, no characters: a snug cozy café in a 1940s European animal town — a gleaming copper espresso machine on a wooden counter with three different counter heights for different-sized patrons, mismatched well-loved wooden chairs, a large chalkboard menu with hand-lettered specials, a bay window with a goldfish bowl, steam in warm morning light, a wall of small framed festival photographs spanning fifty years, a bowl of green grapes on the counter catching the light.

## 5.4 MARKET ROW
**Purpose:** Commerce street: Gino's stall, Wren & Wick, Evelyn's flowers; skipping-rope chorus; the town's pulse. **Priority: Critical. Complexity: High** (busiest exterior).
**Mood:** Striped-awning bustle; the street that smells like everything at once.
**Architecture:** Narrow cobbled lane, leaning shopfronts, string lights between buildings, Ida's letterbox door set beside a full-size one, hopscotch chalk grid (grows one square per day — authored overlay).
**Lighting:** Midday is Market Row's hero phase (fullest local color in the game); evening string-light constellation.
**Props:** Gino's produce architecture (grape pyramid = hero), Wren & Wick's drawer-wall visible through glass, flower buckets, the community garden gate (Marrow Affair site), lamppost (Tuck's).
**Ambient Life:** Skipping children (evolving rhyme — subtitle-adjacent lyric cards), crowd kit rotation, awning flap, produce-stack wobble physics (implied, 2-frame).
**Animation Ideas:** Awning shadows crawling with phases; petal drift from Evelyn's; the hopscotch chalk being drawn (child, morning ambient).
**Gameplay Interactions:** Daily grape gauntlet, vox pops, garden trace-tutorial (Marrow Affair), Ida's shop entry, flower-language side beats, rain reroute (street empties INTO Percolator/Inn — paired crowd states).
**Variations Required:** 4 phases + rain-empty + festival + memorial-vine (Day 7).
### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Exterior wide establishing shot, no characters: a narrow cobbled market lane in a 1930s–1950s European animal town at golden midday — leaning shopfronts with striped awnings, a fruit stall overflowing with a pyramid of green grapes, a tiny locksmith shopfront with a wall of ten thousand small labeled brass drawers visible through the window and a small letterbox-sized door beside the main door, a flower shop spilling autumn blooms from buckets, string lights between buildings, a children's chalk hopscotch grid on the cobbles.

## 5.5 FOUNDERS' SQUARE & MONUMENT
**Purpose:** Ceremony stage; crime scene; then-&-now puzzle; the finale. **Priority: Critical. Complexity: Very High** (most narrative states).
**Mood:** The town's held breath — festive, then bruised, then triumphant.
**Architecture:** Cobbled square ringed by the town's proudest leaning facades; the Founders' Monument (stone, ivy-carved base, brass vault door); Warren's balcony (photo origin — sightline canon); Milo's alley fire escape at the corner; the worn diagonal shortcut in the cobbles (visual-storytelling law).
**Lighting:** Golden hour is this square's identity; night = lantern-pool constellation (the triangulation puzzle depends on exact lantern placement — LOCK the lantern map early, it is gameplay data).
**Props:** Vault door + interior (dust-void library — a puzzle asset painted with archaeological care), bunting (5 decay states), monument flowers (accumulating), dedication plaque (moved — then&now delta), chalk hopscotch spillover, podium.
**Ambient Life:** Pigeon congregation (8am, Warren's), gull flyovers, festival prep evolving daily.
**Animation Ideas:** Bunting sag progression; vault door swing (the game's heaviest sound-sync moment); confetti (Day 7); the three-second empty-vault hold (a camera event, not an animation — protect it).
**Gameplay Interactions:** Ceremony set-piece, dust library puzzle, wax scrapings, then&now overlay, night triangulation, sit-spot bench, finale reading.
**Variations Required:** 4 phases + rain + festival-eve + ceremony + post-ceremony decay ×3 + recovery-decorated finale + night-puzzle state.
### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Exterior wide establishing shot, no characters: a cobbled town square in a 1930s–1950s European animal town at golden hour — ringed by proud leaning storybook facades, festival bunting overhead, a stone founders' monument with an ivy-carved base and an open brass vault door at its bottom revealing a small empty dusty chamber, unlit gas lanterns around the square, one visibly worn diagonal path polished into the cobblestones by fifty years of footsteps, a corner alley with an iron fire escape.

## 5.6 VALE MANOR (House & Garden)
**Purpose:** The family's world: parlor (Beatrice), garden (Clara; the overheard-conversation acoustics), study (torn letter; missing key), portrait hall. **Priority: Critical. Complexity: Very High.**
**Mood:** Dignified held breath; grief kept tidy; love kept in objects.
**Architecture:** Modest manor by founder standards — lived-in, not grand; walled garden with the stone table directly below the study window (the acoustic geometry is canon — build to the diagram); portrait hall with Edmund between TWO empty frames; doorframe with two columns of height-marks ending the same year.
**Lighting:** Late-afternoon amber through tall windows; the garden gets the game's softest light.
**Props:** Tea service, fruit basket (in frame during Day 6 — composition law: peripheral, never centered), Edmund's portrait (two keys at the belt — clue canon, paint precisely), puzzle-box shelf, the study's empty key hook, wastebasket (torn letter), the lintel signet carving over the front door.
**Ambient Life:** Garden birds (Pigeon Rule), ivy breathing on the wall, one gardener's barrow (Beatrice's, mid-task always).
**Animation Ideas:** Curtain breath in the study window (the eavesdropping wind, literalized); tea steam; ivy shadow lace.
**Gameplay Interactions:** All three Clara scenes, Beatrice's tea, garden acoustics puzzle, torn-letter puzzle, portrait examinations, height-mark observe, key-hook observe.
**Variations Required:** Parlor/garden/study/hall × relevant phases; finale-open-doors state.
### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Interior wide establishing shot, no characters: a dignified lived-in manor parlor in a 1930s–1950s European animal town — ancestral portraits including one of a great red deer stag with two brass keys at his belt, between two empty picture frames, tall windows overlooking a walled autumn garden with an old stone table, a tea service for two already poured on a low table, a fruit basket on a sideboard, warm late-afternoon light, a doorframe bearing two faded columns of children's height marks.

## 5.7 THE DROWSY LANTERN (Inn)
**Purpose:** Margie's kingdom; Ferris's lodging; the Warren rumor; rain refuge #2. **Priority: Critical. Complexity: High.**
**Mood:** Hearth-warm low-beamed refuge; secrets kept in sherry glasses.
**Architecture:** Low beams (Otto ducks — a standing sight gag), curved bar, inglenook hearth, stairs to lodger rooms, Ferris's room (chaos in five authored escalations), the corner seat with the upside-down sherry glass.
**Lighting:** Hearth amber forever; the inn is the game's warmest interior at night.
**Props:** Guest register (clue), key hooks (Ferris's conspicuously empty at night — pre-stakeout observable), sherry glass, the music box (drawer, then table, then played — three states), map of the Meridian Coast someone pinned by the door (Warren's dream, leaking).
**Ambient Life:** Hearth crackle, mug steam, rain-crowd compression scenes, and a hedgehog regular asleep on the guest register — fully anthropomorphic, fully asleep, all week; a running vignette. (No cats sleep on this register; the sleeper is, canonically and eternally, the hedgehog.)
**Animation Ideas:** Fire flicker on beams; register page lift in door-draft; Ferris's door light under-spill at odd hours.
**Gameplay Interactions:** Margie interviews, guest-register examine, Ferris conversations, key-hook observe, unclaimed-key payoff scene, rain remixes.
**Variations Required:** Common room 4 phases + rain-crowd; Ferris's room ×3 chaos states; music-box night state.
### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Interior wide establishing shot, no characters: a low-beamed cozy inn common room in a 1930s–1950s European animal town at evening — a curved wooden bar with brass lanterns, an inglenook hearth with a crackling fire, a guest register open on the counter, a wall of numbered brass room keys with one hook conspicuously empty, one corner table with a single sherry glass turned upside-down, stairs leading up to lodger rooms with warm light spilling under one door.

## 5.8 THE LANTERNSIDE ARCHIVE (Museum & Library)
**Purpose:** Prudence's domain; district memory; seal expertise; the romance exhibit; research verbs. **Priority: Critical. Complexity: High.**
**Mood:** Dust motes and devotion; a building that remembers.
**Architecture:** Former chapel-of-records: tall document shelves with ladder rails, glass display cases, reading alcoves, the restricted cabinet (press-badge door), the slowly-assembling Theodora & Jonah exhibit corner (two portraits facing each other across a deliberate gap — the gap closes in the epilogue poster, not the game).
**Lighting:** Afternoon shafts (the game's most painted light); reverent lamp-green alcoves.
**Props:** Ribbon-tied letter bundles, seal reference folios, the 1890s survey map (stolen/returned/overlay tool), visitor ledger, *Grapes in Lamplight* (a 200-year-old still life — grape thread beat; paint it beautifully, it must genuinely tempt), Theodora's portrait, Jonah's portrait.
**Ambient Life:** Dust motes, ladder glide, Evelyn's daily flower on the step (exterior ambient).
**Animation Ideas:** Shaft-light drift with the hour; ladder roll; page-lift under breath.
**Gameplay Interactions:** Seal identification, map overlay puzzle, handwriting comparisons, restricted cabinet (badge), Whistler's-tune research payoff, clipping cross-references, exhibit progression (per-day set delta).
**Variations Required:** 4 phases; exhibit ×4 assembly states; epilogue exhibition-opening.
### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Interior wide establishing shot, no characters: a small town archive-museum inside a former chapel of records — towering wooden document shelves with rolling ladders, glass display cases with ribbon-tied letter bundles, dusty afternoon light shafts, a half-assembled exhibit corner with two vintage portraits (a red deer doe and a red fox gentleman) facing each other across a deliberate gap, an antique oil still-life painting of green grapes in lamplight on one wall, a visitor ledger open on a stand by the door.

## 5.9 THE RIVERBANK & OLD BOATHOUSE (Harbor)
**Purpose:** The hiding place; the confrontation; the childhood shrine; Ferris's dig site; the ghost landing. **Priority: Critical. Complexity: High.**
**Mood:** Mist, reeds, and tenderness; the game's quietest hurt and gentlest resolution.
**Architecture:** Reeded bank, short dock, the weathered Vale boathouse (padlocked until Day 7): inside — upturned rowboat, puzzle-box shelf, carved J+C initials in a beam, the floorboards (six shining nails among dull ones — the find-it-first override asset), one dry umbrella against the wall.
**Lighting:** Morning mist pearl-grey warmed by one low sun shaft through the slats — the confrontation is lit like forgiveness, per Pillar Five.
**Props:** Floorboards + the recovered contents (crates, children's bundles, the green-sealed envelope — hero prop moment), Ferris's holes (exterior, six, one memorial marrow), the old survey landing stones.
**Ambient Life:** River granulation, reed sway, non-anthro ducks, gulls; the Whistler sometimes practices here (audio seed).
**Animation Ideas:** Mist drift layers; slat-light bars crawling; the floorboard lift (hand-animated, 24 frames, the budget is approved in advance because it is the game).
**Gameplay Interactions:** Stakeout finale (D4), trace-follow, environmental read (four observables + nails), confrontation + evidence presentation, floorboard override, riverbank walk with Clara (no-input walk — build the long lateral bg for it).
**Variations Required:** Bank day/night/mist; boathouse exterior locked/unlocked; interior pre/post-reveal; D4 dig-night state.
### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Exterior and interior establishing shot, no characters: a weathered wooden boathouse on a quiet misty riverbank at early morning — pale pearl mist over the water, reeds, a short old dock; through the open door, dust motes in low slatted sunlight, an upturned rowboat, a small shelf of handmade wooden puzzle boxes, two children's initials carved into a beam, floorboards with a few conspicuously new shining nails, and one elegant dry black umbrella leaning against the wall.

## 5.10 COUNCIL HALL
**Purpose:** Civic anchor: key cabinet (backwards key), founding portrait (two keys), Warren's office, records room (badge door). **Priority: Important. Complexity: Medium-High.**
**Mood:** Municipal warmth — official the way a grandfather's watch is official.
**Architecture:** Modest hall with the founding portrait over the stair, key cabinet in the clerk's nook, Warren's office (one polished armrest; the face-down photograph on the shelf — seed, paint it twice, never straighten it), records room.
**Props:** Key cabinet + dust outline (clue asset), founding portrait (KEY CLUE — Edmund with ceremonial key raised AND family key on the belt ribbon; commission this painting first, it gates a Discovery Web path), retired PLAN cards drawer, the Guardian's chair.
**Gameplay Interactions:** Key-hook observe, dust outline, portrait loupe examination, press-badge records access, Warren interviews, morning speech-rehearsal ambient.
**Variations Required:** 3 phases (closed at night except Day 1); ceremony-day dressed state.
### GPT Images Prompt
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Interior wide establishing shot, no characters: a modest civic council hall in a 1930s–1950s European animal town — warm wood paneling, a grand founding-day oil portrait above the staircase showing a great red deer stag raising one ceremonial brass key aloft while a second key hangs from a ribbon at his belt, a small clerk's nook with a glass-front key cabinet, a dignified worn leather chair with one armrest polished lighter than the other, afternoon light through tall windows.

---

# CHAPTER 6 — PROP BIBLE

*Template: Purpose · Scale · Material · Aging · Gameplay Use · Animation Notes · Priority · GPT Images Prompt. All props render on the cork/paper ground per tech spec (`props/prop_{id}.png`); board evidence versions additionally render as sketch-style cards (`board/card_{id}.png`).*

**6.1 THE REPORTER'S NOTEBOOK** — Purpose: Gary's thinking tool; the UI backbone. Scale: palm+. Material: cloth-bound, elastic strap, deckled pages. Aging: fattens sideways (tucked clippings) while thinning forward (torn pages — stubs remain). Gameplay: journal, Morning Pages, tear-out-and-pin. Animation: page flips, tear (with sound), doodle draw-on. **Critical.**
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ A well-loved cloth-bound reporter's notebook, warm brown with a mustard elastic strap, deckled cream pages, corners soft with use, a pencil resting in the gutter, several loose clippings and a pressed leaf tucked between pages, small torn-out page stubs visible in the binding, on a warm cork-and-paper background.

**6.2 THE PRESS BADGE (Archie's)** — Purpose: Gary's inheritance; press-privileges verb; Ask-Grandpa anchor. Scale: palm-small, drawn 110% + one value brighter than physics. Material: brass, worn to soft gold at the rim. Aging: fifty years of thumb-polish; pin replaced twice (Ida knows). Gameplay: 3 door-opens; hint ritual. Animation: the straighten, the glint. **Critical.**
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ A tarnished brass vintage press badge engraved with "THE LANTERNSIDE LEDGER — PRESS", worn to soft warm gold at the rim from decades of thumb polish, a sturdy old pin clasp, painted with one gentle gleam of lamplight, on a warm cork-and-paper background.

**6.3 THE MESSENGER SATCHEL** — Leather, brass buckles, strap darkened at the shoulder; Gary's silhouette diagonal. Contents spill sheet required (notebooks, pencils, string, one emergency raisin box he pretends isn't there). **Critical.**
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ A worn brown leather reporter's messenger satchel with brass buckles, the shoulder strap darkened from years of wear, overstuffed with notebooks and loose papers, a pencil loop on the side, honest scuffs and one careful stitch repair, on a warm cork-and-paper background.

**6.4 THE TIME CAPSULE VAULT & CONTENTS** — Purpose: the mystery's heart. Vault: brass door, ivy-relief frame, interior dust-void library (a puzzle painting). Contents (revealed Day 7/credits): crates, children's bundles, drawings, prediction cards, a tooth "for science," Theodora's letter, Archie's oilcloth parcel. Aging: fifty years sealed — the most textured surfaces in the game. **Critical.**
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ An open brass vault door set into carved stone with an ivy relief frame, revealing a small stone chamber whose dusty floor shows clean rectangular voids where objects long rested; beside it, the recovered contents arranged with care — small wooden crates, cloth bundles tied with string, children's drawings, a folded prediction card, and one green-wax-sealed envelope on top, on a warm cork-and-paper background.

**6.5 THE WAX SEAL (intact) & THE FRAGMENT** — Vale signet: lantern wreathed in ivy, deep green wax, three drips. Fragment: one broken curl showing partial ivy impression, evidence-bagged. Pipeline law: Grape Green never shares a frame with seal green. **Critical.**
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Two studies side by side: an intact deep-green wax seal impressed with a lantern encircled by ivy leaves with three wax drips on cream paper, and a small broken fragment of the same green wax in a pinned wax-paper evidence sleeve showing a partial ivy impression, painted matte and slightly translucent at the edges, on a warm cork-and-paper background.

**6.6 THE SEAL SKETCH** — Gary's graphite reconstruction on a torn notebook page, one coffee ring, single green accent. The board's first gold-bordered item. **Critical.**
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ A graphite pencil sketch on a torn notebook page pinned to cork: a wax seal design of a lantern encircled by ivy leaves with three drips, drawn with quick confident reporter's strokes and small margin notes, one corner stained by a coffee ring, the wax indicated with a single deep-green watercolor touch.

**6.7 THE TWO KEYS** — Ceremonial (ornate bow, council ribbon) and Family Backup (plainer twin, ribbon long lost). Ida's apprentice work: "my best hanging stroke on the 7s" implies engraved numbering — include it. **Critical.**
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Two antique brass keys side by side, clearly siblings from the same maker's hand: one ornate ceremonial key with a decorated bow and a faded council ribbon, one plainer twin with a worn engraved number, both with fifty years of gentle patina, on a warm cork-and-paper background.

**6.8 THE VALE UMBRELLA** — Black silk, carved silver duck-head handle ("a duck that owns a boat"), canopy engineered (canonically) to hide antlers. Two hero states: furled-elegant, open-from-above (the concealment diagram). **Critical.**
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ An elegant vintage black silk umbrella shown twice: furled and leaning with its carved silver duck-head handle in detail, and open viewed from above as a full concealing canopy, fine craftsmanship, quietly expensive, on a warm cork-and-paper background.

**6.9 THE INVESTIGATION BOARD (object)** — Cork panels (1→2→corner-wrap states), red string, gold string, one green string, brass pins, Gary's rubber stamps (CONFIRMED — G.G. / CLEARED / DIDN'T HOLD), the borrowed second panel with Dot's sticky note ("RETURN THIS. — D."). **Critical.**
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ A wall-mounted cork investigation board built from two mismatched panels (one bearing a small handwritten sticky note), covered with pencil-sketch portrait cards, location vignettes, index cards with typewriter text, small evidence sleeves, brass push pins, taut red string, two gold strings, and one lone green string leading to a tiny sketch of grapes in the lower corner, lit warmly from a desk lamp below.

**6.10 THE BELLOWS CAMERA** — Warren's antique: walnut body, brass fittings, leather bellows, plate holders; later Gary's loaner (strap added — the hand-off drawn in hardware). Lantern-checklist card tucked in the case lid (47 boxes). **Critical.**
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ An antique wooden bellows camera with a warm walnut body, brass fittings, and folded oxblood leather bellows, resting on its worn leather case whose open lid holds a small hand-ruled checklist card of forty-seven tiny boxes, a newly added simple carry strap, on a warm cork-and-paper background.

**6.11 THE NIGHT PHOTOGRAPH** — Silver-print long exposure: lantern smears like honey, monument in shadow, the blurred weasel tail at frame's edge. Must match Ferris's canonical side-view tail exactly. **Critical.**
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ A vintage silver-print long-exposure night photograph with a white border and one thumb tack hole: a town square at night with gas-lantern light smeared like ribbons of honey, a stone monument in soft shadow, and at the bottom-left edge a motion-blurred long low animal tail mid-stride, mysterious and accidental.

**6.12 THE TYPEWRITER & THE EVENING EDITION** — Gary's portable (one sticky E — audible signature); the printed Ledger front page template (masthead, column rules — the ONLY ruler-straight lines in Lanternside). **Critical.**
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ A vintage portable typewriter with warm black enamel and round keys, a fresh sheet mid-page, beside a folded small-town newspaper with an ornate masthead reading "THE LANTERNSIDE LEDGER", hand-set headline type and clean column rules, warm lamplight, on a warm cork-and-paper background.

**6.13 THE GRAPE KIT** — The stress ball (squeezed matte rubber, thumb dents), Gino's hero bunch, the raisin box, the jam jar ("For emergencies." in Archie's hand), the memorial vine. Grape Green reserved. **Important.**
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ A small still-life set: a grape-shaped rubber stress ball with visible thumb dents, a flawless bunch of green grapes, a modest vintage raisin box, and a sealed jar of homemade grape jam with a handwritten label reading "For emergencies.", painted with affectionate restraint, on a warm cork-and-paper background.

**6.14 GRANDPA'S PARCEL** — Oilcloth, twine, pencil address "FOR THE GIBBONS WHO COMES NEXT"; contents: field notebook, the engraved magnifying glass ("Look closer, then look kinder."), the jam. The credits' hero prop. **Critical.**
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ A small oilcloth parcel tied with twine, addressed in strong pencil handwriting "FOR THE GIBBONS WHO COMES NEXT", opened beside its contents: a weathered field notebook, a brass magnifying glass engraved along the handle with the words "Look closer, then look kinder.", warm reverent lamplight, on a warm cork-and-paper background.

**6.15 FESTIVAL & TOWN DRESSING KIT** — Bunting (5 decay states), paper lanterns, monument flowers (accumulating), PLAN cards, hopscotch chalk, shop support-notes ("WE STILL LOVE YOU, LANTERNSIDE"), confetti. **Important.**
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ A prop sheet of small-town festival dressing: triangle bunting in muted autumn colors shown in five states from crisp to gently sagging, round paper lanterns, small bouquets, hand-lettered laminated planning cards, a chalk stick, a shop-window support note reading "WE STILL LOVE YOU, LANTERNSIDE", and drifting confetti pieces, on a warm cork-and-paper background.

**6.16 SMALL HERO SET** — Milo's telescope (cardboard + brass, string focus), Prudence's loupe, Ida's key-in-progress + visor, Tuck's pastry (regenerating) + whistle, Otto's tiny cup, Margie's music box, the puzzle boxes (two-person mechanisms visible), the survey map (jam stain canonical). **Important.**
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ A prop sheet of beloved small objects from a cozy animal town: a homemade cardboard-and-brass child's telescope, a jeweler's loupe on a ribbon, a delicate brass key beside a locksmith's magnifying visor, a half-eaten pastry and a brass whistle, a tiny espresso cup, a small walnut music box, two handmade wooden puzzle boxes with paired mechanisms, and an old rolled survey map with a small jam stain, on a warm cork-and-paper background.

---

# CHAPTER 7 — UI BIBLE

**The governing law: the UI is Gary's paper.** Every interface element is diegetic stationery — notebook pages, index cards, newsprint, cork, brass. No panels, no glass, no glow. Fonts: **"Gary" hand font** (dialogue names, notebook — commissioned from consistent hand-lettering), **Ledger Serif** (newspaper, headers — a warm oldstyle like Caslon), **Typewriter** (deduction cards, editions). Ink Brown-Black on Paper Cream throughout; text at 4.5:1 contrast minimum; every animation ≤300ms and skippable (accessibility floor, tech spec).

**7.1 DIALOGUE BOX** — Torn-paper strip along the bottom, portrait left in a pinned-photo frame, name in hand font on a paper tab, typewriter text reveal with per-character blips. Stance buttons (PRESS/EMPATHIZE/OBSERVE) as three brass pins with hand-drawn icons — nib / open hand / eye. The wilting PRESS pin (Beatrice scenes) droops on hover. OBSERVE disabled = the eye closed.
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Game UI illustration: a dialogue interface as a strip of torn cream notebook paper across the lower screen, a character portrait in a small pinned-photograph frame at left, the speaker's name hand-lettered on a paper tab, warm typewriter-style text, and three small brass pin buttons drawn with tiny ink icons of a pen nib, an open hand, and an eye, over a softly blurred watercolor town scene.

**7.2 THE NOTEBOOK (full screen)** — Two-page spread, tabs as fabric bookmarks (PEOPLE/PLACES/QUESTIONS + the hidden GRAPES ribbon, discovered Day 4), margin doodles, torn stubs in the gutter, loose clippings that shift when pages turn. Tear-out interaction: page lifts, tears with ragged edge, flies to board inventory.
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Game UI illustration: an open cloth-bound reporter's notebook filling the screen — a two-page spread of warm cream paper with handwritten notes, small ink doodles in the margins, fabric bookmark tabs on the right edge, a torn page stub in the gutter, a loose newspaper clipping and a pressed leaf tucked in, a pencil resting across the spread.

**7.3 THE INVESTIGATION BOARD (full screen)** — The flagship. Cork ground, drag-pin cards, string physics (sag = wrong, taut+gold = deduction), Timeline Rail as a wooden ruler slotted beneath, Suspect Ledger as a pinned ledger page, Theory cards face-up with the DIDN'T-HOLD graveyard strip on the right edge, Contradiction Desk as the blotter below. Off-record cards show Gary's handwriting: "promised."
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Game UI illustration: a full-screen cork investigation board interface — sketch-style evidence cards pinned with brass pins connected by taut red string and one glowing gold string, a wooden ruler timeline rail with slotted event cards along the bottom, a pinned ledger page grid at the left with two rubber-stamped rows reading "CLEARED", theory cards on the right edge with one stamped "DIDN'T HOLD", warm desk-lamp light from below, rain visible on a round window in the top corner.

**7.4 THE EVENING EDITION (newspaper screen)** — Full-page Ledger mock: masthead, auto-drafted columns, three headline slugs to choose (physically swapped into the headline slot), kicker line choices, the PRINT lever. Published page rolls off with a press animation. Gallery = a bound archive volume.
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Game UI illustration: a vintage newspaper composing interface — a full front page of "THE LANTERNSIDE LEDGER" with ornate masthead, three alternative headline strips of movable type resting above the empty headline slot, hand-set columns of warm typewriter text, an ink roller and a brass print lever at the side, on a wooden press-room table.

**7.5 MORNING PAGES** — The notebook at the window seat: six candidate questions in Gary's hand, player circles three (pencil-circle animation), tea ring optional and canonical.
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Game UI illustration: an open notebook page in morning window light titled "Today" in hand lettering, six short handwritten questions listed with three of them circled in soft pencil, a faint tea ring on the page corner, a warm cream palette.

**7.6 MAP OF LANTERNSIDE** — Hand-drawn district map in Gary's style (commissioned as if Archie drew the original and Gary annotates it): building vignettes, the river, walking routes as dotted pencil, location pins as tiny sketches, the survey-map overlay mode (ghost 1890s linework slides over). Question marks appear where deductions point (the boathouse ?).
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Game UI illustration: a charming hand-drawn map of a small riverside district on aged cream paper — tiny ink-and-watercolor building vignettes, a winding river, dotted pencil walking routes, small pins and handwritten labels, a compass rose doodled with a pigeon on it, and a faint older ghost-map layer of 1890s survey linework showing through in places.

**7.7 MENUS (Title / Pause / Settings / Saves)** — Title: the apartment window at night, board silhouette, menu as items on Gary's desk (NEW STORY = fresh notebook; CONTINUE = the current notebook; SETTINGS = the desk drawer; QUIT = the coat hook). Pause: the notebook closes softly over the scene. Saves: the bound Edition Gallery shelf, one spine per save.
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Game UI illustration: a title screen composed as a reporter's desk at night — a warm desk lamp, a fresh notebook, a well-used notebook, a small drawer slightly open, and a coat hook on the wall, each object subtly readable as a menu option with tiny hand-lettered labels, rain on a round window above, an investigation board in soft shadow behind.

**7.8 PHOTO MODE & VIEWFINDER** — The bellows camera's ground glass: soft-cornered frame, brass edge, bubble level doodle, THEN&NOW overlay as a ghost print sliding to alignment with a satisfying registration *thunk* mark.
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Game UI illustration: a vintage camera viewfinder interface — a soft-cornered ground-glass frame with brass edges over a watercolor town square, a faint older sepia photograph of the same square overlaid slightly misaligned as a ghost image, small hand-drawn alignment tick marks at the corners.

**7.9 ICONS, CURSOR, PROMPTS** — Icon set (~40) as single-weight ink doodles on tiny paper chits: eye (observe), speech curl (talk), boot prints (exit), pin (board), camera, kettle (save), bench (sit), grape (never labeled). Cursor: Gary's pencil (tilts when draggable; becomes the loupe over examinables). Interaction prompts: paper tags on string.
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Game UI illustration: an icon sheet of about forty small hand-inked doodle icons on tiny torn paper chits — an eye, a speech curl, boot prints, a brass pin, a camera, a kettle, a bench, a magnifying glass, a grape, arrows, and gentle miscellany — warm ink on cream, slightly irregular, charming and consistent.

**7.10 LOADING & TRANSITIONS** — Loading screens: single margin-doodles from the notebook (the pigeon saga in 40 installments) with one-line Gary thoughts. Scene transitions: a soft page-turn wipe; day transitions: the lamplight iris (amber circle closes on the lamp, opens on morning). Night-phase entry: the kettle-whistle smash cut, always.
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Game UI illustration: a loading screen as a mostly blank cream notebook page with one charming ink doodle of two pigeons pointedly ignoring each other on a lamppost, a small handwritten caption line beneath, soft paper texture, warm and quiet.

**7.11 THE POCKET RECAP** — In-world mini-board: Gary's folded index card in the HUD corner showing current deduction cards read-only; unfolds on hover.

**7.12 ACHIEVEMENT / STAMP TOASTS** — Steam achievements surface as the CONFIRMED-stamp motif on a card sliding in from the board edge, with the *thock*. The hidden Willpower stat never toasts; it only ever appears on the post-game stats page, one quiet line.

---

# CHAPTER 8 — ANIMATION BIBLE

## 8.1 Philosophy
Animation is punctuation, not spectacle. 2D puppet/cut-out rigs with hand-drawn substitution frames for signature moments. Cycles run 8–12fps and wear it proudly — storybook cadence, with ease-and-settle carrying the feeling. The emotional order of operations in the animal world: **ears/feathers first, tail second, face third, limbs last.** Ears react one beat before faces (the OBSERVE mechanic's foundation); tails leak the truth faces manage to hide.

## 8.2 Character Movement Standards
- **Walks (one per named character — walks ARE characterization):** Gary's loose amble (arms a half-beat late) · Julian's public-measured vs. private-hunched pair · Clara's efficient quiet · Beatrice's glide · Poppy's 12fps hop-bustle · Warren's planted roll · Ferris's liquid sectional lope · Prudence's gimbal-headed stride · Margie's bustling settle · Otto's floor-creak mass · Dot's brisk trot · Ida's counter-rail hops · Gino's prow-first sail · Milo's scamper-with-composure · Evelyn's soft-foot · Tuck's slowest-cycle-in-the-game.
- **Runs:** Gary only (late-for-ceremony, stakeout scramble) + Milo. Nobody else runs; Lanternside is not in a hurry.
- **Idles:** two layers each — breathing base + signature fidget on a randomized 6–14s timer (ring-spin, glasses-polish, tail-groom, card-shuffle, key-cradle, cup-polish, towel-flick, stem-trim, pastry-consideration, telescope-polish, page-turn, produce-polish, ledger-glance, board-stare). Beatrice's idle is the cheapest and most characterful: breathing and blinks only.
- **Talk cycles:** 2-frame mouth + gesture layer per stance (PRESS leans in, EMPATHIZE opens, OBSERVE stills).

## 8.3 Specific Action Set (required)
Writing (Gary's arm-length scribble), drinking (per species — Otto's cup engulf, Gary's mug two-hand, Margie's teapot pour), thinking (badge-touch, pencil-tap, board-stare with weight shift), looking around (head lead → ears follow → body commits), sitting (bench settles per character), the floor-sit (Gary ×2, Julian ×1 — hand-animated), the eleven steps (Clara to Julian, riverbank — fully hand-drawn, the animation budget's crown jewel), the floorboard lift (24 hand-drawn frames), the camera hand-off, the tear-out, the stamp *thock*, the chair spin (one full rotation, gold deductions only), the pencil drop (4 scripted instances, identical timing — players will count).

## 8.4 Ears / Tails / Eyes / Facial Timing
Ears: 4 attitudes (alert/soft/pinned/one-turned) blendable; scripted ear beats precede face beats by 4–6 frames. Tails: per-species rigs; the canonical tail moments — Ferris's ceaseless plume, Dot's one denied wag, Evelyn's slow amused curl, Julian's single boathouse flick (one frame, scripted). Eyes: blink sets (single/double/slow-close); gaze targets are directable (interview eye contact vs. evasive drift is a dialogue-data-driven parameter). Facial timing law: transitions between the three intensities (social→honest→unguarded) take 8–12 frames and are never popped — the *change* is the performance.

## 8.5 Environmental & Interactive Animation
Per-location ambient loops (steam, hearth, mist, awnings, string-lights, dust motes, river granulation, curtain breath); interactive punctuations (vault door swing + weight, drawer pulls, ladder glides, page lifts, the pneumatic tube, bunting sag states, chalk being written); crowd-kit shared cycles (4 rigs × swap parts); fauna set (pigeon congregation, the divorced pair's 7-day silent drama in 8 poses, gulls, ducks, the goldfish's opinions — 3 expressions).

## 8.6 Required Animation List (production census)
17 named characters × (walk, talk×3 stances, idle×2 layers, portrait-blink) + 14 unique signature actions + 16 scripted one-offs (ceremony reveal hold, confession wilt, stakeout freeze, lockup honesty, tea quarter-turn, photograph long-look, fragment skitter, sightline check, rail-flip, board cinematic, floorboard lift, the eleven steps, reading cascade, handover beam, credits parcel, post-credits clink) + crowd kit + fauna kit + 10 locations' ambient sets + UI motion set (page turn, tear, pin, string, stamp, print, iris). **Total tracked deliverables: ~240 — the census lives in the production sheet (Ch.11) and nothing ships untracked.**

---

# CHAPTER 9 — VFX BIBLE

All VFX are painterly particles — hand-drawn sprite sheets (4–8 frames), never engine-shader gloss. The rule: **effects are weather for feelings.**

- **DUST:** mote drift in light shafts (Archive, Morgue, boathouse) — slow, sparse, reverent; the vault's disturbed-dust puff (one scripted, tiny, terrible).
- **RAIN:** vertical wash-strokes in three depths, cobble-splash ticks, window-run rivulets; lantern pools double their bloom in rain; umbrella patter ring on the Vale umbrella only (a quiet spotlight of guilt the player reads later).
- **STEAM & COFFEE:** kettle jet (ritual cue), cup curls (one lazy S per cup), the Percolator's ambient bloom; steam is always slightly amber — warmth made visible.
- **LANTERN GLOW:** soft-edged amber ellipse pools + halo bloom; characters warm two palette steps inside pools; the 47 lanterns share one glow family with per-lantern flicker offsets (collectible identity).
- **WIND & LEAVES:** gust bands that bow reeds, lift page corners, and carry 3–5 autumn leaves on painted arcs; the curtain-breath at the manor study window is the wind's most important job.
- **PAPER:** the tear (fiber-edge burst, 6 frames), the print-press roll, confetti of the Day 7 recovery (paper-only confetti — this town would), notebook page-flutter.
- **FOG/MIST:** riverbank pearl layers (3 parallax scrims) that thin as the confrontation resolves — literally clearing air; never used indoors.
- **SUNLIGHT:** god-ray shafts (Archive, boathouse slats) as painted translucent wedges; the finale's sun-out moment is a full-screen warm glaze fade-up over four seconds — the game's only screen-wide effect.
- **FESTIVAL CONFETTI & BUNTING FLUTTER:** finale kit; confetti settles and *stays* in the epilogue streets (the town keeps the evidence of joy).
- **SIGNATURE MICRO-FX:** the gold-string flash, the stamp *thock* ink-spread, the badge glint (hint available), the fragment skitter sparkle-less slide (deliberately effectless — it must feel like an accident, not a pickup).

---

# CHAPTER 10 — AUDIO-VISUAL PAIRING

*Per location: visual mood → expected music → ambience → key SFX → how visuals reinforce audio.*

- **APARTMENT:** Lamplit solitude → solo piano + soft brushes, the "Gary theme" in its gentlest voicing → rain, kettle, distant press percussion → typewriter dings, string tautening, stamp *thock*. The board grows visually as the night theme adds instruments across the week — the room and the score fill up together.
- **LEDGER & MORGUE:** Ink-and-deadline vs. paper cathedral → office: brisk pizzicato; morgue: near-silence, one held warm drone → type percussion / clock and paper only → drawer wood, page thumps, the tube's thunk. The morgue's visual hush (green lamp pools) licenses the game's only silence — players should hear their own turning pages.
- **PERCOLATOR:** Steam-warm murmur → café jazz trio, brushes and upright bass → cup clinks, murmur walla (animal-voiced, wordless), machine hiss → the espresso slide, chalk squeak. The copper machine's gleam is the visual downbeat; its hiss syncs to the trio's phrase ends.
- **MARKET ROW:** Striped-awning bustle → accordion-forward street waltz; the Whistler's diegetic tin whistle floats over (and is secretly Theodora's Air — the score confesses days before the archive does) → vendor calls, skipping-rope slap + the children's evolving rhyme (the game's Greek chorus, mixed just legible) → produce thumps, Ida's ten thousand tiny drawers.
- **FOUNDERS' SQUARE:** The held breath → the "Lanternside theme" — full warmth for festival, thinned to a music-box variation after the empty vault (same melody, hollowed: the score performs the theft) → pigeons, bunting flap, crowd states → the vault door's weight (the biggest sound in the game), the three-second silence after (protected: no music, no walla, one gull).
- **VALE MANOR:** Dignified held breath → string quartet, Vale family theme built on TWO interleaved voices (viola = Julian, violin = Clara — they only play in unison at the reading; the orchestration is the will) → garden birds, clock, tea → cup quarter-turn (a real recorded porcelain turn — Beatrice's tell gets its own sound), the curtain breath.
- **DROWSY LANTERN:** Hearth refuge → fiddle-and-squeezebox embers, after-hours solo fiddle → fire crackle, mug thumps, stair creaks → register page, key hooks, the music box (its real melody is the fiddle tune slowed — Margie's husband wrote it; the game never says; the sheet music prop does).
- **ARCHIVE:** Dust and devotion → harp + celesta, sparse; the Theodora/Jonah love theme grows one instrument per exhibit-assembly state → ladder rolls, page turns → the loupe click, ledger scratch. Light shafts visually meter the music's sparseness — notes arrive like motes.
- **RIVERBANK & BOATHOUSE:** Mist and tenderness → the game's quietest cue: solo cello over water granulation; the confrontation is UNDERSCORED BY ALMOST NOTHING until Julian breaks, then the two-voice Vale theme enters — viola alone, then violin joining as Clara is revealed at the bank → reeds, water, one distant gull → floorboard lift (hand-foley, long), the umbrella set gently down.
- **COUNCIL HALL:** Municipal warmth → woodwind civic march played slightly fondly-ragged → clock, chair creak (the polished armrest has a specific creak) → key cabinet glass, the portrait examination's paper-on-canvas whisper.
- **GLOBAL MOTIFS:** The kettle whistle = night-phase key change, every time. The gold-string deduction chord (same three notes, new instrument each day). Archie's theme = Gary's theme at half speed on an older piano — first heard complete under the credits letter, and players will realize they've been hearing half of it all game.

---

# CHAPTER 11 — ASSET PRODUCTION LIST

*The shipping census. Naming per Technical Spec §10 — filenames in that contract are the pipeline's law. Priorities: **C**ritical / **I**mportant / **N**ice-to-have. This list is the source of truth for "done."*

**PROTOTYPE PRIORITY FLAG (new field, all categories):** every asset row in the production sheet carries a milestone flag with one of four values — **Prototype** (needed to prove the loop), **Demo** (needed for the Day 2 vertical slice / public demo), **Full Game** (needed to ship 1.0), **Franchise** (needed for marketing, sequels, or brand). Flags default to **TBD** in this bible; they are assigned during milestone-pack extraction (see the Do-Not-Overproduce warning, top of document), starting with the First 30 Minutes pack. The bible defines the field; the packs decide the values.

## 11.1 Characters (17 named + kits) · *Prototype Flag: per-asset, TBD at extraction*
Per named character: portrait set ×5 (+unguarded one-offs where scheduled: Julian ×2, Beatrice, Prudence, Margie, Ferris, Milo) · sprite idle ×2 + talk ×2 · walk cycle · costume variations per §4 · silhouette-sheet entry. [All principals **C**; Archie set **I**] · Crowd kit (4 adult rigs, 12 adult dress sets + skipping-rope children set of 3 — 15 anthropomorphic figures total) [**I**] · Fauna kit (pigeons incl. divorced pair, gulls, ducks, goldfish) [**I**] · Turnaround sheets ×17 [**C**] · The Silhouette Sheet (living document) [**C**].

## 11.2 Buildings & Exteriors · *Prototype Flag: per-asset, TBD at extraction*
Founders' Square (all narrative states — the largest single environment package) [**C**] · Market Row (phases + rain + festival + memorial) [**C**] · Riverbank/boathouse exterior [**C**] · Street connective facades + skybox washes + the lantern map (gameplay data!) [**C**] · Marketing "postcard composition" per location ×10 [**I**].

## 11.3 Interiors · *Prototype Flag: per-asset, TBD at extraction*
Apartment (3 board-wall states × phases + rain + post-game) [**C**] · Percolator [**C**] · Drowsy Lantern common + Ferris's room ×3 [**C**] · Vale Manor: parlor/garden/study/portrait hall [**C**] · Archive (+ exhibit ×4) [**C**] · Ledger office + Morgue [**C**] · Council Hall + Warren's office [**C**] · Boathouse interior pre/post [**C**] · Lockup (one wall, one afternoon) [**I**].

## 11.4 Furniture & Set Dressing · *Prototype Flag: per-asset, TBD at extraction*
Per-interior dressing sheets (regulars' chairs, drawer walls, shelf biographies) [**I**] · Chekhov-detail paintings (founding portrait, lintel carving, height-marks, worn shortcut, shining nails, face-down photo, the sleeping hedgehog regular on the register, upside-down sherry glass, front-page gap, covered chair) [**C** — these are clues] · Festival dressing kit ×5 states [**C**].

## 11.5 Props · *Prototype Flag: per-asset, TBD at extraction*
Ch.6 census: 16 hero prop sheets [**C/I** as marked] + board-card sketch versions of all evidence (~45 cards, `board/card_{id}.png`) [**C**] + notebook doodle set (40 pigeons + 20 misc) [**I**] + morgue clipping art ×35 [**I**] + Edition front-page template + per-night mastheads [**C**].

## 11.6 UI · *Prototype Flag: per-asset, TBD at extraction*
Ch.7 census: dialogue kit, notebook spread kit, full board kit (cork/pins/strings/stamps/rail/ledger/blotter), newspaper composer, morning pages, map (+ghost overlay), menu desk, viewfinder, icon sheet (~40), cursor set, prompt tags, loading doodles, transition masks, pocket recap, toast kit. [**C** except loading doodles **I**]

## 11.7 Icons & Collectibles · *Prototype Flag: per-asset, TBD at extraction*
Location pins, card-type icons, achievement stamp art (~20), lantern collectible states ×47 (shared family, per-lantern offsets), clipping collection UI, pigeon-portrait gallery, Willpower stat line art. [**I**]

## 11.8 Animations · *Prototype Flag: per-asset, TBD at extraction*
Ch.8 census (~240 tracked): character cycles, 14 signatures, 16 scripted one-offs (the eleven steps and floorboard lift flagged hand-drawn), environment ambients ×10, crowd/fauna cycles, UI motion set. [**C** core; fauna drama **I**; steam-letters egg **N**]

## 11.9 Effects · *Prototype Flag: per-asset, TBD at extraction*
Ch.9 census: rain kit, steam kit, lantern glow family, dust/mote kit, wind-leaf kit, paper kit, mist scrims, sun shafts + finale glaze, confetti, micro-FX (gold flash, thock, glint, skitter). [**C** except confetti-persistence **I**]

## 11.10 Marketing, Capsule & Meta Art · *Prototype Flag: per-asset, TBD at extraction (demo end-card is Demo by definition)*
Steam capsule set (main 616×353 / small / header / library 600×900 + hero): **the composition** — Gary at the board at night, lamplight, the town visible through the round window, one red string leading off-frame toward the viewer [**C**] · Key art (the full cast on Founders' Square at golden hour, arranged so every silhouette reads — the Silhouette Sheet as a poster) [**C**] · Screenshot dressing set [**C**] · Animated capsule/GIF loops ×3 (kettle-board ritual, grape refusal, string connection) [**I**] · Press kit sheet [**I**] · Demo end-card ("wishlist" as a CONFIRMED stamp) [**C** — ships with the Phase 4 demo].
### GPT Images Prompt (Steam main capsule)
⟨MASTER STYLE PROMPT — expand verbatim on export⟩ Key art composition: an anthropomorphic gibbon reporter in a rumpled tweed jacket seen from behind at three-quarter angle, standing at a lamplit cork investigation board covered in sketches and taut red string in a cozy attic at night, one red string leading dramatically toward the viewer's corner of the frame, a round window behind him glowing with the warm lantern-lit rooftops of a small storybook European animal town, title space reserved in the upper third, warm amber and deep teal palette.

## 11.11 Loading Screens, Portraits, Expressions · *Prototype Flag: per-asset, TBD at extraction*
40 pigeon-saga loading doodles [**I**] · full portrait census (17×5 + 7 unguarded + young/sepia set: Archie×3, Beatrice, Theodora, Jonah) [**C**] · epilogue exhibition poster (the two portraits, gap closed) [**I**].

## 11.12 The Shipping Gate
Nothing on this list ships untracked; the production sheet mirrors this chapter 1:1 with status columns and the Prototype Priority Flag column, and **the Chekhov-detail paintings and the lantern map are flagged gameplay-blocking** — they are clue data wearing paint, and the content validator's world will reference them by name.

---

*End of the Art Bible v1.1. Paint it thumbed, light it amber, and let the tails tell the truth. — For Lanternside.*
