import { describe, expect, it } from 'vitest';
import {
  DUST_LIBRARY,
  dustLibraryCheck,
  solveDustLibrary,
  SEAL_SKETCH,
  sealSketchAccuracy,
  sealSketchResolveEffects,
  solveSealSketch,
  PUZZLE_RESOLVE_EFFECTS,
} from './puzzles';

describe('dust_library', () => {
  it('accepts only the full correct mapping', () => {
    const right = Object.fromEntries(DUST_LIBRARY.voids.map((v) => [v.id, v.answer]));
    expect(dustLibraryCheck(right)).toBe(true);
    expect(dustLibraryCheck({ ...right, void_tin: 'item_crates' })).toBe(false);
    expect(dustLibraryCheck({})).toBe(false);
  });

  it('solves headless with the registered resolve effects', () => {
    const effects = solveDustLibrary();
    expect(effects).toEqual(DUST_LIBRARY.resolveEffects);
    expect(effects.some((e) => 'setFlag' in e && e.setFlag === 'dust_library_done')).toBe(true);
    expect(effects.some((e) => 'giveCard' in e && e.giveCard === 'sharp_edged_void')).toBe(true);
  });
});

describe('sketch_memory (the seal)', () => {
  it('grades silently, 0..3, never fail-state', () => {
    expect(sealSketchAccuracy({})).toBe(0);
    expect(sealSketchAccuracy({ center: 'part_lantern' })).toBe(1);
    expect(sealSketchAccuracy({ center: 'part_lantern', wreath: 'part_ivy', drips: 'part_two_drips' })).toBe(2);
    const perfect = Object.fromEntries(SEAL_SKETCH.parts.map((p) => [p.slot, p.answer]));
    expect(sealSketchAccuracy(perfect)).toBe(3);
  });

  it('an imperfect sketch still pins the card (II.12.2)', () => {
    const effects = sealSketchResolveEffects(1);
    expect(effects.some((e) => 'giveCard' in e && e.giveCard === 'seal_sketch')).toBe(true);
    expect(effects.some((e) => 'setFlag' in e && e.setFlag === 'seal_sketch_accuracy' && e.value === 1)).toBe(true);
  });

  it('headless solve is perfect', () => {
    const effects = solveSealSketch();
    expect(effects.some((e) => 'setFlag' in e && e.setFlag === 'seal_sketch_accuracy' && e.value === 3)).toBe(true);
  });
});

describe('puzzle registry', () => {
  it('all nine §6.7 modules register their resolve effects for the validator', () => {
    expect(Object.keys(PUZZLE_RESOLVE_EFFECTS).sort()).toEqual([
      'dust_library',
      'fire_escape_sightline',
      'handwriting_match',
      'map_overlay',
      'photo_triangulation',
      'sketch_memory_seal',
      'then_now_founding',
      'torn_letter',
      'trace_ferris',
    ]);
  });
});
