import { beforeEach, describe, expect, it } from 'vitest';
import { useGameStore } from '@engine/store';
import { initialGameState } from '@engine/types';
import type { ContentDB } from '@content/contentDb';
import {
  connectCards,
  layOnDesk,
  ledgerRowComplete,
  matchDeduction,
  pinCard,
  resetBoardSession,
  retireTheory,
  seatRailCard,
  stampCleared,
  unpinCard,
} from './board';

function fakeDb(): ContentDB {
  return {
    game: {} as ContentDB['game'],
    characters: { julian: { id: 'julian', name: 'Julian Vale' } as ContentDB['characters'][string] },
    locations: {},
    dialogues: {},
    cards: {
      a: { id: 'a', ref: 'x', type: 'testimony', title: 'A', initialStatus: 'unverified', verifyRoutes: [], reReadLines: [] },
      b: { id: 'b', ref: 'x', type: 'testimony', title: 'B', initialStatus: 'unverified', verifyRoutes: [], reReadLines: [] },
      c: { id: 'c', ref: 'x', type: 'physical', title: 'C', initialStatus: 'unverified', verifyRoutes: [], reReadLines: [] },
      ded_ab: { id: 'ded_ab', ref: 'x', type: 'deduction', title: 'A+B', initialStatus: 'verified', verifyRoutes: [], reReadLines: [] },
      ev1: { id: 'ev1', ref: 'x', type: 'event', title: 'Event 1', initialStatus: 'unverified', verifyRoutes: [], reReadLines: [], railSlot: 's1', anchor: { flag: 'anchored' } },
    } as unknown as ContentDB['cards'],
    deductions: {
      deductions: [
        {
          id: 'd_ab',
          ref: 'x',
          kind: 'standard',
          inputs: ['a', 'b'],
          requireVerified: true,
          requireOnRecordForFinale: false,
          produces: { card: 'ded_ab', ledgerCell: { suspect: 'julian', col: 'means' } },
        },
      ],
      wrongPairBarks: 'wrong_pairs',
      theories: [{ id: 'th_x', title: 'Theory X', retireWhen: { card: 'ded_ab' } }],
      contradictions: [{ id: 'cx_ab', pair: ['a', 'b'], producesQuestion: 'q_x', ref: 'x' }],
    } as unknown as ContentDB['deductions'],
    schedules: {},
    editions: {},
    sidestories: {},
    barks: {
      wrong_pairs: {
        pool: 'wrong_pairs',
        barks: [
          { id: 'wp1', text: 'no', tags: [] },
          { id: 'wp2', text: 'nope', tags: [] },
        ],
      },
    } as unknown as ContentDB['barks'],
    timeline: { ref: 'x', slots: [{ id: 's1', label: 'S1', order: 1 }, { id: 's2', label: 'S2', order: 2 }] } as ContentDB['timeline'],
    hints: { gates: {} },
    achievements: { achievements: [] },
    notebook: { entries: [], questions: [{ id: 'q_x', text: 'why?', ref: 'x' }] },
  };
}

function giveCard(id: string, status: 'unverified' | 'verified' | 'offrecord' = 'unverified') {
  useGameStore.setState((s) => {
    s.state.cards[id] = { status, discoveredVia: 'test', readCount: 0 };
  });
}

beforeEach(() => {
  resetBoardSession();
  useGameStore.setState((s) => {
    s.state = initialGameState('gary_apartment', 1);
  });
});

describe('pins', () => {
  it('pins owned cards once and unpin removes its strings', () => {
    const db = fakeDb();
    expect(pinCard('a', 10, 10)).toBe(false); // not owned
    giveCard('a');
    giveCard('b');
    expect(pinCard('a', 10, 10)).toBe(true);
    expect(pinCard('a', 20, 20)).toBe(false); // already pinned
    pinCard('b', 30, 30);
    connectCards(db, ['a', 'b']); // unverified -> refused, but red string only ties on miss
    unpinCard('a');
    const board = useGameStore.getState().state.board;
    expect(board.pins.map((p) => p.cardId)).toEqual(['b']);
    expect(board.strings.filter((s) => s.from === 'a' || s.to === 'a')).toHaveLength(0);
  });
});

describe('deduction matcher', () => {
  it('matches order-free with supersets up to 3', () => {
    const db = fakeDb();
    giveCard('a');
    giveCard('b');
    giveCard('c');
    expect(matchDeduction(db, ['b', 'a'])?.id).toBe('d_ab');
    expect(matchDeduction(db, ['c', 'b', 'a'])?.id).toBe('d_ab');
    expect(matchDeduction(db, ['a', 'c'])).toBeNull();
  });

  it('requireVerified refuses until inputs are verified, then unlocks and fills the ledger', () => {
    const db = fakeDb();
    giveCard('a');
    giveCard('b');
    const refused = connectCards(db, ['a', 'b']);
    expect(refused.kind).toBe('refused-unverified');

    giveCard('a', 'verified');
    giveCard('b', 'verified');
    const hit = connectCards(db, ['a', 'b']);
    expect(hit.kind).toBe('deduction');
    const state = useGameStore.getState().state;
    expect(state.board.deductions).toContain('d_ab');
    expect(state.cards.ded_ab.status).toBe('verified');
    expect(state.board.ledger['julian.means']).toBe('ded_ab');
    expect(state.board.strings.some((s) => s.kind === 'gold')).toBe(true);
    // same deduction never re-fires
    expect(matchDeduction(db, ['a', 'b'])).toBeNull();
  });

  it('off-record cards refuse the string outright (III.23.1)', () => {
    const db = fakeDb();
    giveCard('a', 'offrecord');
    giveCard('b', 'verified');
    const result = connectCards(db, ['a', 'b']);
    expect(result.kind).toBe('refused-offrecord');
    expect(useGameStore.getState().state.board.deductions).toHaveLength(0);
  });

  it('misses tie a red string, never repeat a wrong-pair bark in-session, and dedupe', () => {
    const db = fakeDb();
    giveCard('a', 'verified');
    giveCard('c', 'verified');
    const miss1 = connectCards(db, ['a', 'c']);
    expect(miss1.kind).toBe('miss');
    const strings = useGameStore.getState().state.board.strings;
    expect(strings).toHaveLength(1);
    expect(strings[0].kind).toBe('red');
    const miss2 = connectCards(db, ['a', 'c']);
    expect(miss2.kind).toBe('duplicate');
    if (miss1.kind === 'miss' && miss1.bark) {
      giveCard('b', 'verified');
      const miss3 = connectCards(db, ['c', 'b']);
      if (miss3.kind === 'miss' && miss3.bark) {
        expect(miss3.bark).not.toBe(miss1.bark);
      }
    }
  });
});

describe('ledger + theories + desk + rail', () => {
  it('ledger row completes only with all three columns, then stamps', () => {
    const db = fakeDb();
    expect(ledgerRowComplete('julian')).toBe(false);
    useGameStore.setState((s) => {
      s.state.board.ledger['julian.motive'] = 'x';
      s.state.board.ledger['julian.means'] = 'y';
      s.state.board.ledger['julian.opportunity'] = 'z';
    });
    expect(ledgerRowComplete('julian')).toBe(true);
    expect(stampCleared(db, 'julian')).toBe(true);
    expect(stampCleared(db, 'julian')).toBe(false);
  });

  it('theories retire only when retireWhen passes', () => {
    const db = fakeDb();
    expect(retireTheory(db, 'th_x')).toBe(false);
    giveCard('ded_ab', 'verified');
    expect(retireTheory(db, 'th_x')).toBe(true);
    expect(retireTheory(db, 'th_x')).toBe(false);
    expect(useGameStore.getState().state.board.retiredTheories).toEqual(['th_x']);
  });

  it('contradiction desk produces a question card exactly once', () => {
    const db = fakeDb();
    giveCard('a');
    giveCard('b');
    const hit = layOnDesk(db, 'b', 'a');
    expect(hit.kind).toBe('contradiction');
    expect(useGameStore.getState().state.notebook.questions).toContain('q_x');
    expect(layOnDesk(db, 'a', 'b').kind).toBe('nothing');
  });

  it('rail seats event cards only with anchor + right slot', () => {
    const db = fakeDb();
    giveCard('ev1');
    expect(seatRailCard(db, 'a', 's1')).toBe('not-event');
    expect(seatRailCard(db, 'ev1', 's2')).toBe('no-anchor'); // wrong slot
    expect(seatRailCard(db, 'ev1', 's1')).toBe('no-anchor'); // anchor cond not met
    useGameStore.setState((s) => {
      s.state.flags.anchored = true;
    });
    expect(seatRailCard(db, 'ev1', 's1')).toBe('seated');
    expect(seatRailCard(db, 'ev1', 's1')).toBe('occupied');
  });
});
