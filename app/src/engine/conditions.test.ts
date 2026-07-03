import { describe, expect, it } from 'vitest';
import { evalCondition, collectConditionRefs, type Condition } from './conditions';
import { initialGameState } from './types';

function state() {
  const s = initialGameState('founders_square', 7);
  s.day = 3;
  s.phase = 'evening';
  s.flags = { met_poppy: true, count: 2, name: 'gary' };
  s.cards = {
    seal_sketch: { status: 'verified', discoveredVia: 'poppy', readCount: 0 },
    milos_sighting: { status: 'unverified', discoveredVia: 'direct', readCount: 1 },
    clara_key: { status: 'offrecord', discoveredVia: 'clara', readCount: 0 },
  };
  s.trust = { margie: 2, clara: -1 };
  s.weather = 'rain';
  s.board.deductions = ['d1_emptied_before'];
  return s;
}

describe('evalCondition', () => {
  const s = state();

  it('treats empty/absent conditions as true', () => {
    expect(evalCondition({}, s)).toBe(true);
    expect(evalCondition(undefined, s)).toBe(true);
    expect(evalCondition(null, s)).toBe(true);
  });

  it('checks flags: existence, truthiness, and explicit value', () => {
    expect(evalCondition({ flag: 'met_poppy' }, s)).toBe(true);
    expect(evalCondition({ flag: 'unset' }, s)).toBe(false);
    expect(evalCondition({ flag: 'count', value: 2 }, s)).toBe(true);
    expect(evalCondition({ flag: 'count', value: 3 }, s)).toBe(false);
    expect(evalCondition({ flag: 'name', value: 'gary' }, s)).toBe(true);
  });

  it('checks cards with and without status', () => {
    expect(evalCondition({ card: 'seal_sketch' }, s)).toBe(true);
    expect(evalCondition({ card: 'seal_sketch', status: 'verified' }, s)).toBe(true);
    expect(evalCondition({ card: 'milos_sighting', status: 'verified' }, s)).toBe(false);
    expect(evalCondition({ card: 'clara_key', status: 'offrecord' }, s)).toBe(true);
    expect(evalCondition({ card: 'nonexistent' }, s)).toBe(false);
  });

  it('compares day and phase', () => {
    expect(evalCondition({ day: 3 }, s)).toBe(true);
    expect(evalCondition({ day: { gte: 3 } }, s)).toBe(true);
    expect(evalCondition({ day: { gte: 4 } }, s)).toBe(false);
    expect(evalCondition({ day: { gt: 2, lte: 3 } }, s)).toBe(true);
    expect(evalCondition({ phase: 'evening' }, s)).toBe(true);
    expect(evalCondition({ phase: ['morning', 'evening'] }, s)).toBe(true);
    expect(evalCondition({ phase: 'night' }, s)).toBe(false);
  });

  it('compares trust with default 0 for unknown characters', () => {
    expect(evalCondition({ trust: { char: 'margie', gte: 1 } }, s)).toBe(true);
    expect(evalCondition({ trust: { char: 'clara', gte: 0 } }, s)).toBe(false);
    expect(evalCondition({ trust: { char: 'stranger', eq: 0 } }, s)).toBe(true);
  });

  it('checks weather and deductions', () => {
    expect(evalCondition({ weather: 'rain' }, s)).toBe(true);
    expect(evalCondition({ deduction: 'd1_emptied_before' }, s)).toBe(true);
    expect(evalCondition({ deduction: 'd13_final' }, s)).toBe(false);
  });

  it('composes all/any/not (the spec §4.2 example shape)', () => {
    const cond: Condition = {
      all: [
        { flag: 'met_poppy' },
        { card: 'seal_sketch', status: 'verified' },
        { day: { gte: 3 } },
        { phase: 'evening' },
        { trust: { char: 'margie', gte: 1 } },
        { not: { flag: 'printed_sensational_d4' } },
        { any: [{ weather: 'rain' }, { flag: 'sidestory_otto_done' }] },
      ],
    };
    expect(evalCondition(cond, s)).toBe(true);
    expect(evalCondition({ all: [{ flag: 'met_poppy' }, { flag: 'unset' }] }, s)).toBe(false);
    expect(evalCondition({ not: { flag: 'met_poppy' } }, s)).toBe(false);
  });

  it('throws on unknown condition shapes rather than guessing', () => {
    expect(() => evalCondition({ frobnicate: true } as unknown as Condition, s)).toThrow();
  });

  it('collects referenced ids for the validator', () => {
    const refs = collectConditionRefs({
      all: [{ flag: 'a' }, { card: 'b' }, { trust: { char: 'c', gte: 1 } }, { not: { deduction: 'd' } }],
    });
    expect(refs.flags).toEqual(['a']);
    expect(refs.cards).toEqual(['b']);
    expect(refs.chars).toEqual(['c']);
    expect(refs.deductions).toEqual(['d']);
  });
});
