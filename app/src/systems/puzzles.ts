// Puzzle module contract (tech spec §6.7): open(id) → resolve(effects).
// Nine bespoke modules share only this contract — no generic minigame
// framework. Each module also exposes headless solve logic so the autoplayer
// can run the guaranteed path without rendering.

import { create } from 'zustand';
import type { Effect } from '@engine/effects';
import { useGameStore } from '@engine/store';
import { bus } from '@engine/eventBus';

export interface PuzzleStore {
  active: string | null;
  open(id: string): void;
  resolve(effects: Effect[]): void;
  cancel(): void;
}

export const usePuzzleStore = create<PuzzleStore>()((set, get) => ({
  active: null,
  open(id) {
    if (get().active) return;
    set({ active: id });
    bus.emit({ type: 'puzzle:opened', payload: { puzzle: id } });
  },
  resolve(effects) {
    const id = get().active;
    set({ active: null });
    useGameStore.getState().runEffects(effects);
    bus.emit({ type: 'puzzle:resolved', payload: { puzzle: id } });
  },
  cancel() {
    set({ active: null });
  },
}));

export function installPuzzleWatcher(): () => void {
  return bus.on('puzzle:open', (e) => {
    usePuzzleStore.getState().open(e.payload.puzzle as string);
  });
}

// ---------------------------------------------------------------------------
// dust_library (II.13.1) — the Day 2 centerpiece. The empty vault's floor
// holds dust voids; the player matches each void against Poppy's laminated
// checklist. Payoffs: the top void's SHARP edge (removed recently, carefully —
// the thief was gentle, felt before the story says it) and the wax scrapings
// on the lip (unlocked after, II.12.4).

export interface DustVoid {
  id: string;
  label: string; // shape description shown to the player
  answer: string; // checklist item id
}

export const DUST_LIBRARY = {
  voids: [
    { id: 'void_crate', label: 'A long low rectangle, dust-ringed, decades deep', answer: 'item_crates' },
    { id: 'void_bundle', label: 'A soft-edged stack, corners rounded by settling paper', answer: 'item_letter_bundles' },
    { id: 'void_tin', label: 'A small soft-cornered square, pressed deep, off in its own corner', answer: 'item_oilcloth_parcel' },
    { id: 'void_envelope', label: 'A slim rectangle on top of everything — its edge is SHARP', answer: 'item_sealed_envelope' },
  ] as DustVoid[],
  checklist: [
    { id: 'item_crates', label: 'Founding family crates (4)' },
    { id: 'item_letter_bundles', label: "Children's bundles — drawings, predictions, letters" },
    { id: 'item_oilcloth_parcel', label: 'Small parcel in oilcloth, addressee unlisted' },
    { id: 'item_sealed_envelope', label: 'One sealed envelope — added at The Founder’s Addition' },
  ],
  resolveEffects: [
    { setFlag: 'dust_library_done' },
    { giveCard: 'sharp_edged_void', status: 'verified' },
    { notebook: { entry: 'nb_dust_library' } },
    { playBark: 'gary_inner_sharp_edge' },
  ] as Effect[],
};

/** Is this void→item assignment fully correct? */
export function dustLibraryCheck(assignments: Record<string, string>): boolean {
  return DUST_LIBRARY.voids.every((v) => assignments[v.id] === v.answer);
}

/** Headless guaranteed-path solve (autoplay). */
export function solveDustLibrary(): Effect[] {
  const assignments = Object.fromEntries(DUST_LIBRARY.voids.map((v) => [v.id, v.answer]));
  if (!dustLibraryCheck(assignments)) throw new Error('dust library answer key broken');
  return DUST_LIBRARY.resolveEffects;
}

// ---------------------------------------------------------------------------
// sketch_memory (II.12.2) — assemble a sketch from parts while the witness's
// description replays. Graded silently; an imperfect sketch still pins.
// Instance 1: THE SEAL (Day 2, tutorializes): lantern, wreathed in ivy,
// three drips of wax.

export interface SketchPart {
  slot: string;
  options: { id: string; label: string }[];
  answer: string;
}

export const SEAL_SKETCH = {
  description: '“The wax was green, and the seal was — a lantern? Wrapped in leaves. Ivy, maybe. Three little drips at the bottom. It looked... important on purpose.”',
  parts: [
    {
      slot: 'center',
      options: [
        { id: 'part_lantern', label: 'A lantern' },
        { id: 'part_candle', label: 'A candle' },
        { id: 'part_bell', label: 'A bell' },
      ],
      answer: 'part_lantern',
    },
    {
      slot: 'wreath',
      options: [
        { id: 'part_ivy', label: 'Ivy leaves' },
        { id: 'part_laurel', label: 'Laurel sprigs' },
        { id: 'part_rope', label: 'A rope border' },
      ],
      answer: 'part_ivy',
    },
    {
      slot: 'drips',
      options: [
        { id: 'part_two_drips', label: 'Two drips of wax' },
        { id: 'part_three_drips', label: 'Three drips of wax' },
        { id: 'part_four_drips', label: 'Four drips of wax' },
      ],
      answer: 'part_three_drips',
    },
  ] as SketchPart[],
};

export function sealSketchAccuracy(picks: Record<string, string>): number {
  return SEAL_SKETCH.parts.filter((p) => picks[p.slot] === p.answer).length;
}

export function sealSketchResolveEffects(accuracy: number): Effect[] {
  return [
    { giveCard: 'seal_sketch', status: 'verified' },
    { setFlag: 'seal_sketch_accuracy', value: accuracy },
    { setFlag: 'sketch_seal_done' },
    { notebook: { entry: 'nb_seal_sketch' } },
  ];
}

/** Headless perfect solve (autoplay). */
export function solveSealSketch(): Effect[] {
  const picks = Object.fromEntries(SEAL_SKETCH.parts.map((p) => [p.slot, p.answer]));
  const accuracy = sealSketchAccuracy(picks);
  if (accuracy !== 3) throw new Error('seal sketch answer key broken');
  return sealSketchResolveEffects(accuracy);
}

// ---------------------------------------------------------------------------
// then_now (II.13.2) — align an old photograph over the modern viewpoint.
// Instance 1: the founding photograph (Day 3, REQUIRED): the ghost image
// reveals the dedication plaque was MOVED for The Founder's Addition.

export const THEN_NOW_FOUNDING = {
  description: "Warren's fifty-year-old founding-day photograph, held against the modern square. Slide it until the monument lines up — then read what changed.",
  /** Alignment target on a 0–100 slider; a tolerance band keeps it cozy. */
  target: 62,
  tolerance: 6,
  resolveEffects: [
    { setFlag: 'then_now_founding_done' },
    { giveCard: 'plaque_moved', status: 'verified' },
    { notebook: { entry: 'nb_plaque_moved' } },
    { playBark: 'gary_inner_plaque' },
  ] as Effect[],
};

export function thenNowAligned(value: number): boolean {
  return Math.abs(value - THEN_NOW_FOUNDING.target) <= THEN_NOW_FOUNDING.tolerance;
}

export function solveThenNow(): Effect[] {
  if (!thenNowAligned(THEN_NOW_FOUNDING.target)) throw new Error('then_now target broken');
  return THEN_NOW_FOUNDING.resolveEffects;
}

// ---------------------------------------------------------------------------
// trace_follow (II.12.4) — follow physical traces in order. Instance 1: Ferris's
// distinctive holed-sole boot prints, garden to riverbank (Day 4, REQUIRED,
// comedic teacher).

export const TRACE_FERRIS = {
  description: 'Boot prints with a hole worn through the left sole — distinctive as a signature. Follow them in order, garden to riverbank.',
  waypoints: [
    { id: 'tr_garden', label: 'The community garden — six fresh holes, one deceased marrow' },
    { id: 'tr_fence', label: 'The fence stile — print on the crossbar, going over' },
    { id: 'tr_lane', label: 'The river lane — long strides now, hurrying' },
    { id: 'tr_reeds', label: 'The reeds by the old boathouse fence — trampled flat in a watching-spot' },
  ],
  resolveEffects: [
    { setFlag: 'ferris_tracks_followed' },
    { giveCard: 'ferris_tracks', status: 'verified' },
    { notebook: { entry: 'nb_ferris_tracks' } },
  ] as Effect[],
};

export function traceOrderCorrect(order: string[]): boolean {
  return TRACE_FERRIS.waypoints.every((w, i) => order[i] === w.id);
}

export function solveTraceFerris(): Effect[] {
  return TRACE_FERRIS.resolveEffects;
}

// ---------------------------------------------------------------------------
// photo_triangulation (III.25.2) — from Warren's balcony position and the
// tail's place in frame, find where the figure stood, then read the cobbles.
// Content lands Day 5/6; module + solver ship now (Phase 5).

export const PHOTO_TRIANGULATION = {
  description: "Warren shot from his balcony — a fixed, known eye. Match the lantern smears in the print against the square at night, and the frame tells you exactly where the figure stood.",
  spots: [
    { id: 'spot_manor_line', label: 'On the worn shortcut — the manor-to-monument line' },
    { id: 'spot_river_line', label: 'Off the shortcut — on the river-side line' },
    { id: 'spot_stage', label: 'By the ceremony stage' },
  ],
  answer: 'spot_river_line',
  resolveEffects: [
    { setFlag: 'photo_triangulation_done' },
    { giveCard: 'triangulation_result', status: 'verified' },
    { notebook: { entry: 'nb_triangulation' } },
  ] as Effect[],
};

export function solvePhotoTriangulation(): Effect[] {
  return PHOTO_TRIANGULATION.resolveEffects;
}

// ---------------------------------------------------------------------------
// fire_escape_sightline (III.20/II.12.6 showpiece) — stand where Milo stood,
// check whether the kid COULD have seen it. Content lands Day 6.

export const FIRE_ESCAPE = {
  description: "Milo's fire escape, at night, through the loaner camera. A chimney blocks half the square — but not the lantern-lit strip by the monument. Check the sightline; check the story.",
  checks: [
    { id: 'fe_chimney', label: 'The chimney line — what does it hide?', finding: 'It hides the manor side entirely. Milo could never have seen where the figure came FROM.' },
    { id: 'fe_strip', label: 'The lantern-lit strip — what does it show?', finding: 'The monument strip, clear as a stage. The crossing itself: fully visible.' },
    { id: 'fe_angle', label: 'The downward angle — what does it do to a walker?', finding: 'From above, an umbrella canopy hides everything under it. Ears, face — antlers, if a walker had them. The whole him.' },
  ],
  resolveEffects: [
    { setFlag: 'fire_escape_puzzle_done' },
    { verify: 'milos_sighting' },
    { notebook: { entry: 'nb_fire_escape' } },
    { playBark: 'milo_believed_enough' },
  ] as Effect[],
};

export function solveFireEscape(): Effect[] {
  return FIRE_ESCAPE.resolveEffects;
}

// ---------------------------------------------------------------------------
// torn_letter (III.25.1) — reassemble by handwriting FLOW, not jigsaw edges.
// Julian's unsent letter to Clara. Content lands Day 6; OPTIONAL.

export const TORN_LETTER = {
  description: 'Eight fragments from the study wastebasket. The writing itself is the guide — follow the hand, not the tear lines.',
  fragments: [
    { id: 'tl_1', text: '—not what you think. When' },
    { id: 'tl_2', text: 'I know what it says I’ll—' },
    { id: 'tl_3', text: '—should have been yours' },
    { id: 'tl_4', text: 'anyway, it was always—' },
    { id: 'tl_5', text: '—can’t open it.' },
    { id: 'tl_6', text: 'Isn’t that funny.' },
    { id: 'tl_7', text: 'I can’t even—' },
    { id: 'tl_8', text: '(unsigned)' },
  ],
  order: ['tl_1', 'tl_2', 'tl_3', 'tl_4', 'tl_5', 'tl_6', 'tl_7', 'tl_8'],
  resolveEffects: [
    { setFlag: 'torn_letter_done' },
    { giveCard: 'torn_letter', status: 'verified' },
    { notebook: { entry: 'nb_torn_letter' } },
    { playBark: 'gary_inner_torn_letter' },
  ] as Effect[],
};

export function solveTornLetter(): Effect[] {
  return TORN_LETTER.resolveEffects;
}

// ---------------------------------------------------------------------------
// handwriting_match (II.12.5) — three authored features, never pixel-hunting.
// Content lands with side story 17.5 (Phase 6).

export const HANDWRITING_MATCH = {
  description: 'Match the ticket signature against the ledger pages — three features, the way Archie taught: the looped G, the crossed double-t, the pressure of the pen.',
  features: [
    { id: 'hw_loop', label: 'The looped G' },
    { id: 'hw_crosst', label: 'The crossed double-t' },
    { id: 'hw_pressure', label: 'The pen pressure, heavy on the downstroke' },
  ],
  resolveEffects: [
    { setFlag: 'handwriting_match_done' },
    { notebook: { entry: 'nb_handwriting' } },
  ] as Effect[],
};

export function solveHandwritingMatch(): Effect[] {
  return HANDWRITING_MATCH.resolveEffects;
}

// ---------------------------------------------------------------------------
// map_overlay (II.12.5 / II.13.4) — Ferris's recovered 1890s survey map over
// the modern district: three ghost locations, one of them the original Vale
// boat landing. OPTIONAL foreshadowing; available Day 4+ once the map is
// recovered.

export const MAP_OVERLAY = {
  description: 'The 1890s survey map (jam stains courtesy of F. Mott) laid over the modern district. Line up the river bend and the ghosts appear.',
  target: 48,
  tolerance: 7,
  ghosts: [
    'The old mill race — filled in, forty years gone',
    'The first market cross — now the Percolator’s corner',
    'THE VALE BOAT LANDING — private, unmarked, straight below the old boathouse',
  ],
  resolveEffects: [
    { setFlag: 'map_overlay_done' },
    { setFlag: 'found_ghost_landing' },
    { notebook: { entry: 'nb_ghost_landing' } },
    { playBark: 'gary_inner_ghost_landing' },
  ] as Effect[],
};

export function mapOverlayAligned(value: number): boolean {
  return Math.abs(value - MAP_OVERLAY.target) <= MAP_OVERLAY.tolerance;
}

export function solveMapOverlay(): Effect[] {
  return MAP_OVERLAY.resolveEffects;
}

/**
 * What each module's resolution grants — the content-graph validator reads
 * this so puzzle-granted cards count as reachable (tools/lib/graph.ts).
 * Every new module MUST register here.
 */
export const PUZZLE_RESOLVE_EFFECTS: Record<string, Effect[]> = {
  dust_library: DUST_LIBRARY.resolveEffects,
  sketch_memory_seal: sealSketchResolveEffects(3),
  then_now_founding: THEN_NOW_FOUNDING.resolveEffects,
  trace_ferris: TRACE_FERRIS.resolveEffects,
  photo_triangulation: PHOTO_TRIANGULATION.resolveEffects,
  fire_escape_sightline: FIRE_ESCAPE.resolveEffects,
  torn_letter: TORN_LETTER.resolveEffects,
  handwriting_match: HANDWRITING_MATCH.resolveEffects,
  map_overlay: MAP_OVERLAY.resolveEffects,
};
