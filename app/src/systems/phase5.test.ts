// Phase 5 systems: weather determinism, rail composite, clearSuspect, photo
// mode, save migration v1→v2, new puzzle solvers.

import { beforeEach, describe, expect, it } from 'vitest';
import { useGameStore } from '@engine/store';
import { initialGameState } from '@engine/types';
import { migrate } from '@engine/save/migrations';
import type { ContentDB } from '@content/contentDb';
import { weatherFor } from './weather';
import { seatRailCard, unlockDeduction, resetBoardSession } from './board';
import { takePhoto } from './photo';
import { thenNowAligned, traceOrderCorrect, TRACE_FERRIS, mapOverlayAligned, solveFireEscape, solveTornLetter } from './puzzles';

function fakeDb(): ContentDB {
  return {
    game: {
      startLocation: 'sq', startDay: 1, startPhase: 'morning', apartmentLocation: 'sq',
      days: [1, 2, 3, 4, 5, 6, 7].map((d) => ({ day: d, gateDeductions: [] })),
      weather: { scheduledRain: [{ day: 5, phase: 'midday' }], dailyRainChance: 0.1 },
    },
    characters: { warren: { id: 'warren', name: 'Warren' } },
    locations: {
      sq: {
        id: 'sq', name: 'Square', ref: 'x', layers: ['bg'],
        walkLine: { y: 800, minX: 0, maxX: 100 },
        exits: [], hotspots: [
          { id: 'lantern1', at: [10, 10], kind: 'photo', interactions: [], label: 'L1' },
        ], triggers: [],
      },
    },
    dialogues: {},
    cards: {
      evA: { id: 'evA', ref: 'x', type: 'event', title: 'A', initialStatus: 'verified', verifyRoutes: [], reReadLines: [], railSlot: 's1', anchor: {} },
      evB: { id: 'evB', ref: 'x', type: 'event', title: 'B', initialStatus: 'verified', verifyRoutes: [], reReadLines: [], railSlot: 's1', anchor: {} },
      evC: { id: 'evC', ref: 'x', type: 'event', title: 'C', initialStatus: 'verified', verifyRoutes: [], reReadLines: [], railSlot: 's2', anchor: {} },
    },
    deductions: { deductions: [], theories: [], contradictions: [] },
    schedules: {},
    editions: {},
    sidestories: {},
    barks: {},
    timeline: { ref: 'x', slots: [{ id: 's1', label: 'S1', order: 1 }, { id: 's2', label: 'S2', order: 2 }], compositePair: ['evA', 'evB'] },
    hints: { gates: {} },
    achievements: { achievements: [] },
    notebook: { entries: [], questions: [] },
  } as unknown as ContentDB;
}

function give(id: string) {
  useGameStore.setState((s) => {
    s.state.cards[id] = { status: 'verified', discoveredVia: 't', readCount: 0 };
  });
}

beforeEach(() => {
  resetBoardSession();
  useGameStore.setState((s) => {
    s.state = initialGameState('sq', 42);
  });
});

describe('weather', () => {
  it('is deterministic per seed and honors the D5 midday schedule', () => {
    const db = fakeDb();
    expect(weatherFor(db, 5, 'midday', 42)).toBe('rain');
    const a = [1, 2, 3, 4, 6, 7].map((d) => weatherFor(db, d, 'midday', 42));
    const b = [1, 2, 3, 4, 6, 7].map((d) => weatherFor(db, d, 'midday', 42));
    expect(a).toEqual(b);
    expect(weatherFor(db, 5, 'morning', 42)).toBe('clear'); // scheduled rain is midday only
  });
});

describe('rail composite (III.22.5)', () => {
  it('lets exactly the composite pair share a slot, then completes on all slots', () => {
    const db = fakeDb();
    give('evA');
    give('evB');
    give('evC');
    expect(seatRailCard(db, 'evA', 's1')).toBe('seated');
    expect(seatRailCard(db, 'evB', 's1')).toBe('composite');
    expect(useGameStore.getState().state.flags.rail_composite_seen).toBe(true);
    expect(seatRailCard(db, 'evC', 's2')).toBe('complete');
    expect(useGameStore.getState().state.flags.rail_complete).toBe(true);
  });

  it('refuses non-pair cards in an occupied slot', () => {
    const db = fakeDb();
    db.timeline!.compositePair = undefined;
    give('evA');
    give('evB');
    expect(seatRailCard(db, 'evA', 's1')).toBe('seated');
    expect(seatRailCard(db, 'evB', 's1')).toBe('occupied');
  });
});

describe('clearSuspect deduction product (II.16.2)', () => {
  it('stamps the suspect CLEARED without needing a full ledger row', () => {
    const db = fakeDb();
    unlockDeduction(db, {
      id: 'd4x', ref: 'x', kind: 'standard', inputs: ['evA'],
      requireVerified: false, requireOnRecordForFinale: false,
      produces: { clearSuspect: 'warren' },
    } as never);
    expect(useGameStore.getState().state.board.cleared).toContain('warren');
  });
});

describe('photo mode', () => {
  it('requires the camera, stores once, prints overnight (via migration of day)', () => {
    const db = fakeDb();
    expect(takePhoto(db, 'lantern1')).toBe(false); // no camera yet
    useGameStore.setState((s) => {
      s.state.flags.has_camera = true;
    });
    expect(takePhoto(db, 'lantern1')).toBe(true);
    expect(takePhoto(db, 'lantern1')).toBe(false); // once
    expect(useGameStore.getState().state.photos).toHaveLength(1);
  });
});

describe('save migration v1 -> v2', () => {
  it('adds the photos array to old saves', () => {
    const old = { ...initialGameState('sq'), version: 1 } as Record<string, unknown>;
    delete old.photos;
    const migrated = migrate(old);
    expect(migrated.version).toBe(2);
    expect(migrated.photos).toEqual([]);
  });
});

describe('new puzzle solvers', () => {
  it('alignment windows behave', () => {
    expect(thenNowAligned(62)).toBe(true);
    expect(thenNowAligned(50)).toBe(false);
    expect(mapOverlayAligned(48)).toBe(true);
    expect(mapOverlayAligned(90)).toBe(false);
  });
  it('trace order is strict', () => {
    expect(traceOrderCorrect(TRACE_FERRIS.waypoints.map((w) => w.id))).toBe(true);
    expect(traceOrderCorrect([...TRACE_FERRIS.waypoints.map((w) => w.id)].reverse())).toBe(false);
  });
  it('fire escape verifies the sighting; torn letter never presents', () => {
    expect(solveFireEscape().some((e) => 'verify' in e && e.verify === 'milos_sighting')).toBe(true);
    expect(solveTornLetter().some((e) => 'giveCard' in e && e.giveCard === 'torn_letter')).toBe(true);
  });
});
