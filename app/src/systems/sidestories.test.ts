// Side-story runner coverage (Phase 6 verifier backlog): auto-start, strict
// step ordering, trust floors — plus the julian_read_it confrontation entry
// (reviewer backlog: previously inspection-only).

import { beforeEach, describe, expect, it } from 'vitest';
import { useGameStore } from '@engine/store';
import { initialGameState } from '@engine/types';
import type { ContentDB } from '@content/contentDb';
import { sweepSidestories, doneFlag, stepFlag } from './sidestories';
import { useDialogueStore } from './dialogue';

function db(): ContentDB {
  return {
    game: {} as ContentDB['game'],
    characters: { otto: { id: 'otto', name: 'Otto' } },
    locations: {},
    dialogues: {
      confrontation_d7: {
        id: 'confrontation_d7',
        character: 'narrator',
        ref: 'I.8.2',
        entries: [
          { id: 'read_it', cond: { flag: 'julian_read_it' }, node: 'n1r' },
          { id: 'main', cond: {}, node: 'n1' },
        ],
        nodes: {
          n1r: { speaker: 'julian', line: 'Front page after all.', next: null },
          n1: { speaker: 'julian', line: 'Front page?', next: null },
        },
      },
    },
    cards: {},
    deductions: { deductions: [], theories: [], contradictions: [] },
    schedules: {},
    editions: {},
    sidestories: {
      story_a: {
        id: 'story_a',
        ref: 'x',
        title: 'A',
        days: [1],
        steps: [
          { id: 's1', cond: { flag: 'hook' } },
          { id: 's2', cond: { flag: 'middle' }, effects: [{ setFlag: 'payoff_fired' }] },
        ],
        trustFloor: { char: 'otto', min: 1 },
      },
    },
    barks: {},
    timeline: null,
    hints: { gates: {} },
    achievements: { achievements: [] },
    notebook: { entries: [], questions: [] },
  } as unknown as ContentDB;
}

beforeEach(() => {
  useGameStore.setState((s) => {
    s.state = initialGameState('x', 1);
  });
  useDialogueStore.setState({ view: null, session: null });
});

describe('side-story runner', () => {
  it('does not start until the first step cond passes', () => {
    const d = db();
    expect(sweepSidestories(d)).toEqual([]);
    expect(useGameStore.getState().state.flags['sidestory_story_a_started']).toBeUndefined();
  });

  it('advances strictly in order and never skips ahead', () => {
    const d = db();
    useGameStore.setState((s) => {
      s.state.flags.middle = true; // step 2's cond true, step 1's not
    });
    expect(sweepSidestories(d)).toEqual([]);
    useGameStore.setState((s) => {
      s.state.flags.hook = true;
    });
    const advanced = sweepSidestories(d);
    expect(advanced).toContain('story_a.s1');
    expect(advanced).toContain('story_a.s2');
    expect(advanced).toContain('story_a.DONE');
    const state = useGameStore.getState().state;
    expect(state.flags[stepFlag('story_a', 's1')]).toBe(true);
    expect(state.flags.payoff_fired).toBe(true);
    expect(state.flags[doneFlag('story_a')]).toBe(true);
  });

  it('applies the trust floor on completion (III.23.3 kindness banked)', () => {
    const d = db();
    useGameStore.setState((s) => {
      s.state.flags.hook = true;
      s.state.flags.middle = true;
      s.state.trust.otto = -2;
    });
    sweepSidestories(d);
    expect(useGameStore.getState().state.trust.otto).toBe(1);
  });

  it('is idempotent — a second sweep advances nothing', () => {
    const d = db();
    useGameStore.setState((s) => {
      s.state.flags.hook = true;
      s.state.flags.middle = true;
    });
    sweepSidestories(d);
    expect(sweepSidestories(d)).toEqual([]);
  });
});

describe('confrontation entry variants (III.25.4 / II.15.1)', () => {
  it('opens with "Front page after all." only when Julian read the sensational page', () => {
    const d = db();
    useDialogueStore.getState().start(d, 'confrontation_d7');
    expect(useDialogueStore.getState().view?.line).toBe('Front page?');
    useDialogueStore.getState().end();
    useGameStore.setState((s) => {
      s.state.flags.julian_read_it = true;
    });
    useDialogueStore.getState().start(d, 'confrontation_d7');
    expect(useDialogueStore.getState().view?.line).toBe('Front page after all.');
  });
});
