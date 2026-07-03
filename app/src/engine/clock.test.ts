import { describe, expect, it } from 'vitest';
import { advance, missingGates, type GameDef } from './clock';
import { initialGameState } from './types';

const game: GameDef = {
  startLocation: 'gary_apartment',
  startDay: 1,
  startPhase: 'morning',
  apartmentLocation: 'gary_apartment',
  days: [
    { day: 1, gateDeductions: ['d1_emptied_before'] },
    { day: 2, gateDeductions: [] },
    { day: 3, gateDeductions: [] },
    { day: 4, gateDeductions: [] },
    { day: 5, gateDeductions: [] },
    { day: 6, gateDeductions: [] },
    { day: 7, gateDeductions: [] },
  ],
};

describe('clock', () => {
  it('advances phases within a day freely', () => {
    const s = initialGameState('x');
    expect(advance(game, s).next).toEqual({ day: 1, phase: 'midday' });
    s.phase = 'midday';
    expect(advance(game, s).next).toEqual({ day: 1, phase: 'evening' });
    s.phase = 'evening';
    expect(advance(game, s).next).toEqual({ day: 1, phase: 'night' });
  });

  it('blocks night -> morning until gate deductions unlock', () => {
    const s = initialGameState('x');
    s.phase = 'night';
    const blocked = advance(game, s);
    expect(blocked.ok).toBe(false);
    expect(blocked.blocked).toEqual({ kind: 'gate', missing: ['d1_emptied_before'] });
    expect(missingGates(game, s)).toEqual(['d1_emptied_before']);

    s.board.deductions.push('d1_emptied_before');
    const open = advance(game, s);
    expect(open.next).toEqual({ day: 2, phase: 'morning' });
  });

  it('blocks the edition night when the day defines one', () => {
    const withEdition: GameDef = {
      ...game,
      days: game.days.map((d) => (d.day === 1 ? { ...d, gateDeductions: [], edition: 'ed_d1' } : d)),
    };
    const s = initialGameState('x');
    s.phase = 'night';
    const blocked = advance(withEdition, s);
    expect(blocked.blocked).toEqual({ kind: 'edition', edition: 'ed_d1' });
    expect(advance(withEdition, s, { editionPublished: true }).ok).toBe(true);
  });

  it('day 7 night ends the game rather than rolling to day 8', () => {
    const s = initialGameState('x');
    s.day = 7;
    s.phase = 'night';
    expect(advance(game, s).blocked).toEqual({ kind: 'end-of-game' });
  });
});
