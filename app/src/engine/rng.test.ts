import { describe, expect, it } from 'vitest';
import { Rng } from './rng';

describe('Rng', () => {
  it('is deterministic per seed', () => {
    const a = new Rng(42);
    const b = new Rng(42);
    const seqA = Array.from({ length: 20 }, () => a.next());
    const seqB = Array.from({ length: 20 }, () => b.next());
    expect(seqA).toEqual(seqB);
  });

  it('differs across seeds', () => {
    const a = new Rng(1);
    const b = new Rng(2);
    expect(a.next()).not.toBe(b.next());
  });

  it('resumes exactly from serialized state', () => {
    const a = new Rng(7);
    a.next();
    a.next();
    const snapshot = a.state;
    const rest = [a.next(), a.next(), a.next()];
    const b = new Rng(1);
    b.state = snapshot;
    expect([b.next(), b.next(), b.next()]).toEqual(rest);
  });

  it('int and pick stay in range', () => {
    const r = new Rng(9);
    for (let i = 0; i < 100; i++) {
      const n = r.int(5);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(5);
    }
    expect(['a', 'b', 'c']).toContain(r.pick(['a', 'b', 'c']));
    expect(() => r.pick([])).toThrow();
  });
});
