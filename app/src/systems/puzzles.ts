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

/**
 * What each module's resolution grants — the content-graph validator reads
 * this so puzzle-granted cards count as reachable (tools/lib/graph.ts).
 * Every new module MUST register here.
 */
export const PUZZLE_RESOLVE_EFFECTS: Record<string, Effect[]> = {
  dust_library: DUST_LIBRARY.resolveEffects,
  sketch_memory_seal: sealSketchResolveEffects(3),
};
