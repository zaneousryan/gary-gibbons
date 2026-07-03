// Phase 3 systems: verification sweep, edition law, trust tiers, morning pages.

import { beforeEach, describe, expect, it } from 'vitest';
import { useGameStore } from '@engine/store';
import { initialGameState } from '@engine/types';
import type { ContentDB } from '@content/contentDb';
import { sweepVerifications, whyUnverified } from './verify';
import { assembleDraft, pendingAttributions, publishEdition, editionForToday } from './edition';
import { trustTier, greetingFor } from './trust';
import { commitMorningPages, morningCandidates, morningPagesDue, questionOfTheDay } from './morningPages';

function db(): ContentDB {
  return {
    game: {
      startLocation: 'home',
      startDay: 1,
      startPhase: 'morning',
      apartmentLocation: 'home',
      days: [
        { day: 1, gateDeductions: [], edition: 'ed1' },
        { day: 2, gateDeductions: [] },
        { day: 3, gateDeductions: [] },
        { day: 4, gateDeductions: [] },
        { day: 5, gateDeductions: [] },
        { day: 6, gateDeductions: [] },
        { day: 7, gateDeductions: [] },
      ],
    },
    characters: {
      margie: {
        id: 'margie', name: 'Margie', greetings: { cold: 'Mr. Gibbons.', neutral: 'Morning, pet.', warm: 'My favorite headline, love.' },
      },
    } as unknown as ContentDB['characters'],
    locations: {},
    dialogues: {},
    cards: {
      tip: { id: 'tip', ref: 'x', type: 'testimony', title: 'A tip', initialStatus: 'unverified', verifyRoutes: [{ id: 'r1', cond: { flag: 'proof' }, hint: 'find the proof' }], reReadLines: [] },
      fact: { id: 'fact', ref: 'x', type: 'physical', title: 'A fact', initialStatus: 'verified', verifyRoutes: [], reReadLines: [] },
      secret: { id: 'secret', ref: 'x', type: 'testimony', title: 'A secret', initialStatus: 'unverified', verifyRoutes: [], reReadLines: [], attribution: { protectable: true, namedFlag: 'named_kid' } },
    } as unknown as ContentDB['cards'],
    deductions: { deductions: [], theories: [], contradictions: [] } as unknown as ContentDB['deductions'],
    schedules: {},
    editions: {
      ed1: {
        id: 'ed1', day: 1, ref: 'x',
        draftCards: ['tip', 'fact', 'secret'],
        headlines: [
          { id: 'h_sens', tone: 'sensational', text: 'SHOCK!', effects: [{ trust: { char: 'margie', delta: 1 } }] },
          { id: 'h_meas', tone: 'measured', text: 'News Happens' },
        ],
        kickers: [{ id: 'k1', text: 'More tomorrow.' }],
      },
    } as unknown as ContentDB['editions'],
    sidestories: {},
    barks: {},
    timeline: null,
    hints: { gates: {} },
    achievements: { achievements: [] },
    notebook: { entries: [], questions: [{ id: 'q_a', text: 'Who?', ref: 'x' }, { id: 'q_b', text: 'Why?', ref: 'x' }] },
  };
}

function give(id: string, status: 'unverified' | 'verified' | 'offrecord' = 'unverified') {
  useGameStore.setState((s) => {
    s.state.cards[id] = { status, discoveredVia: 'test', readCount: 0 };
  });
}

beforeEach(() => {
  useGameStore.setState((s) => {
    s.state = initialGameState('home', 1);
  });
});

describe('VerificationSystem', () => {
  it('upgrades a card when its route cond passes, and records the route', () => {
    const d = db();
    give('tip');
    expect(sweepVerifications(d)).toEqual([]);
    useGameStore.setState((s) => {
      s.state.flags.proof = true;
    });
    expect(sweepVerifications(d)).toEqual(['tip']);
    expect(useGameStore.getState().state.cards.tip.status).toBe('verified');
    expect(useGameStore.getState().state.flags.verified_via_tip).toBe('r1');
    expect(sweepVerifications(d)).toEqual([]); // idempotent
  });

  it('whyUnverified surfaces the authored hint', () => {
    const d = db();
    expect(whyUnverified(d, 'tip')).toContain('find the proof');
    expect(whyUnverified(d, 'fact')).toContain('own eyes');
  });
});

describe('EditionSystem', () => {
  it("Dot's law: only verified cards make the draft", () => {
    const d = db();
    give('tip'); // unverified
    give('fact', 'verified');
    give('secret', 'offrecord');
    const ed = editionForToday(d)!;
    expect(assembleDraft(d, ed)).toEqual(['fact']);
  });

  it('protectable cards demand an attribution choice before publish', () => {
    const d = db();
    give('secret', 'verified');
    const ed = editionForToday(d)!;
    const draft = assembleDraft(d, ed);
    expect(pendingAttributions(d, draft)).toEqual(['secret']);
    expect(publishEdition(d, { headlineId: 'h_meas', kickerId: 'k1' })).toBe(false);
    expect(publishEdition(d, { headlineId: 'h_meas', kickerId: 'k1', attributions: { secret: false } })).toBe(true);
    const state = useGameStore.getState().state;
    expect(state.editions).toHaveLength(1);
    expect(state.flags.named_kid).toBe(false); // the game just remembers (III.23.2)
    expect(state.flags.printed_measured_d1).toBe(true);
  });

  it('headline effects land and publishing is once per day', () => {
    const d = db();
    give('fact', 'verified');
    expect(publishEdition(d, { headlineId: 'h_sens', kickerId: 'k1' })).toBe(true);
    expect(useGameStore.getState().state.trust.margie).toBe(1);
    expect(publishEdition(d, { headlineId: 'h_meas', kickerId: 'k1' })).toBe(false);
  });
});

describe('trust tiers', () => {
  it('maps trust to cold/neutral/warm greetings', () => {
    const d = db();
    expect(trustTier('margie')).toBe('neutral');
    expect(greetingFor(d, 'margie')).toBe('Morning, pet.');
    useGameStore.setState((s) => {
      s.state.trust.margie = -1;
    });
    expect(greetingFor(d, 'margie')).toBe('Mr. Gibbons.');
    useGameStore.setState((s) => {
      s.state.trust.margie = 2;
    });
    expect(greetingFor(d, 'margie')).toBe('My favorite headline, love.');
  });
});

describe('Morning Pages', () => {
  it('is due from day 2 mornings, once', () => {
    const d = db();
    expect(morningPagesDue()).toBe(false); // day 1
    useGameStore.setState((s) => {
      s.state.day = 2;
      s.state.notebook.questions = ['q_a', 'q_b'];
    });
    expect(morningPagesDue()).toBe(true);
    expect(morningCandidates(d).map((c) => c.id)).toEqual(['q_a', 'q_b']);
    expect(commitMorningPages(['q_a'])).toBe(true);
    expect(morningPagesDue()).toBe(false);
    expect(useGameStore.getState().state.flags.morning_focus_q_a).toBe(true);
    expect(questionOfTheDay(d)?.id).toBe('q_a');
    expect(commitMorningPages(['q_b'])).toBe(false); // once per day
  });

  it('clears yesterday’s focus when a new day commits', () => {
    useGameStore.setState((s) => {
      s.state.day = 2;
      s.state.notebook.questions = ['q_a', 'q_b'];
    });
    commitMorningPages(['q_a']);
    useGameStore.setState((s) => {
      s.state.day = 3;
    });
    commitMorningPages(['q_b']);
    const flags = useGameStore.getState().state.flags;
    expect(flags.morning_focus_q_a).toBeUndefined();
    expect(flags.morning_focus_q_b).toBe(true);
  });
});
