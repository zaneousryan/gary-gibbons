import { describe, expect, it } from 'vitest';
import { SaveService, MemoryStorage } from './saveService';
import { migrate } from './migrations';
import { initialGameState, GAME_STATE_VERSION } from '../types';

describe('SaveService', () => {
  it('round-trips GameState losslessly (savedAt aside)', async () => {
    const svc = new SaveService(new MemoryStorage());
    const s = initialGameState('the_percolator', 42);
    s.flags.met_poppy = true;
    s.cards.seal_sketch = { status: 'verified', discoveredVia: 'poppy_c3', readCount: 2 };
    s.board.pins.push({ cardId: 'seal_sketch', x: 120, y: 340 });
    s.trust.margie = 2;
    await svc.save('slot1', s);
    const loaded = await svc.load('slot1');
    expect(loaded).not.toBeNull();
    expect({ ...loaded!, meta: undefined }).toEqual({ ...s, meta: undefined });
    expect(loaded!.meta.savedAt).not.toBe('');
  });

  it('returns null for missing slots and lists existing ones', async () => {
    const svc = new SaveService(new MemoryStorage());
    expect(await svc.load('nope')).toBeNull();
    await svc.save('a', initialGameState('x'));
    await svc.save('b', initialGameState('x'));
    expect((await svc.listSlots()).sort()).toEqual(['a', 'b']);
  });
});

describe('migrations', () => {
  it('passes current-version saves through untouched', () => {
    const s = initialGameState('x');
    expect(migrate(s as unknown as Record<string, unknown>).version).toBe(GAME_STATE_VERSION);
  });

  it('rejects saves from the future', () => {
    expect(() => migrate({ version: GAME_STATE_VERSION + 1 })).toThrow(/newer/);
  });

  it('rejects unknown ancient saves with no path', () => {
    expect(() => migrate({ version: -1 })).toThrow(/No migration path/);
  });
});
