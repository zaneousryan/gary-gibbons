import { describe, expect, it } from 'vitest';
import { applyEffect, applyEffects, collectEffectRefs, type Effect } from './effects';
import { initialGameState } from './types';

describe('applyEffect', () => {
  it('setFlag defaults to true and supports values', () => {
    const s = initialGameState('x');
    const ev = applyEffect(s, { setFlag: 'knows_two_keys' });
    expect(s.flags.knows_two_keys).toBe(true);
    expect(ev[0]).toMatchObject({ type: 'flag:set' });
    applyEffect(s, { setFlag: 'grape_count', value: 3 });
    expect(s.flags.grape_count).toBe(3);
  });

  it('giveCard is idempotent but can upgrade unverified -> verified', () => {
    const s = initialGameState('x');
    applyEffect(s, { giveCard: 'idas_ledger' });
    expect(s.cards.idas_ledger.status).toBe('unverified');
    const ev = applyEffect(s, { giveCard: 'idas_ledger' });
    expect(ev).toHaveLength(0);
    const ev2 = applyEffect(s, { giveCard: 'idas_ledger', status: 'verified' });
    expect(s.cards.idas_ledger.status).toBe('verified');
    expect(ev2[0].type).toBe('card:verified');
  });

  it('verify upgrades only unverified cards', () => {
    const s = initialGameState('x');
    applyEffect(s, { giveCard: 'milos_sighting' });
    applyEffect(s, { verify: 'milos_sighting' });
    expect(s.cards.milos_sighting.status).toBe('verified');
    expect(applyEffect(s, { verify: 'milos_sighting' })).toHaveLength(0);
    expect(applyEffect(s, { verify: 'never_given' })).toHaveLength(0);
  });

  it('trust clamps at ±3 and reports transitions only', () => {
    const s = initialGameState('x');
    applyEffect(s, { trust: { char: 'clara', delta: 2 } });
    applyEffect(s, { trust: { char: 'clara', delta: 5 } });
    expect(s.trust.clara).toBe(3);
    const ev = applyEffect(s, { trust: { char: 'clara', delta: 1 } });
    expect(ev).toHaveLength(0); // already at cap
  });

  it('trustFloor lifts but never lowers', () => {
    const s = initialGameState('x');
    s.trust.margie = 2;
    applyEffect(s, { trustFloor: { char: 'margie', min: 1 } });
    expect(s.trust.margie).toBe(2);
    s.trust.otto = -2;
    applyEffect(s, { trustFloor: { char: 'otto', min: 1 } });
    expect(s.trust.otto).toBe(1);
  });

  it('notebook questions and doodles dedupe', () => {
    const s = initialGameState('x');
    applyEffects(s, [
      { notebook: { question: 'q_why_two_keys' } },
      { notebook: { question: 'q_why_two_keys' } },
      { notebook: { doodle: 'divorced_pigeons_1' } },
    ]);
    expect(s.notebook.questions).toEqual(['q_why_two_keys']);
    expect(s.collectibles.doodles).toEqual(['divorced_pigeons_1']);
  });

  it('grapeDeclined counts quietly (no fanfare — II.19.2)', () => {
    const s = initialGameState('x');
    applyEffect(s, { grapeDeclined: true });
    applyEffect(s, { grapeDeclined: true });
    expect(s.collectibles.grapesDeclined).toBe(2);
  });

  it('throws on unknown effect shapes', () => {
    const s = initialGameState('x');
    expect(() => applyEffect(s, { explode: true } as unknown as Effect)).toThrow();
  });

  it('collects referenced ids for the validator', () => {
    const refs = collectEffectRefs([
      { giveCard: 'a' },
      { verify: 'b' },
      { playBark: 'c' },
      { startSidestory: 'd' },
      { unlockDialogue: 'e' },
      { goTo: 'f' },
    ]);
    expect(refs.cards).toEqual(['a', 'b']);
    expect(refs.barks).toEqual(['c']);
    expect(refs.sidestories).toEqual(['d']);
    expect(refs.dialogues).toEqual(['e']);
    expect(refs.locations).toEqual(['f']);
  });
});
