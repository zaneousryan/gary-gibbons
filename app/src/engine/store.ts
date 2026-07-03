// GameStore — the only truth about *what has happened* (tech spec §3).
// Zustand + Immer, slice pattern kept deliberately flat: actions live here,
// systems call them, content never touches the store directly.

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Day, GameState, LocationId, Phase } from './types';
import { initialGameState } from './types';
import type { Effect } from './effects';
import { applyEffects } from './effects';
import type { GameDef } from './clock';
import { advance } from './clock';
import { bus } from './eventBus';
import { Rng } from './rng';

export interface GameStore {
  state: GameState;
  /** Immutable at boot; set once by the loader. */
  game: GameDef | null;
  rng: Rng;

  setGameDef(def: GameDef): void;
  newGame(seed?: number): void;
  loadState(state: GameState): void;

  runEffects(effects: Effect[]): void;
  advancePhase(): boolean;
  moveTo(location: LocationId): void;
  unlockDeduction(id: string): void;
  markCardRead(id: string): void;
  tickPlaytime(sec: number): void;
}

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    state: initialGameState('gary_apartment'),
    game: null,
    rng: new Rng(1),

    setGameDef(def) {
      set((s) => {
        s.game = def;
      });
    },

    newGame(seed = 1) {
      const def = get().game;
      set((s) => {
        s.state = initialGameState(def?.startLocation ?? 'gary_apartment', seed);
        if (def) {
          s.state.day = def.startDay;
          s.state.phase = def.startPhase;
        }
        s.rng = new Rng(seed);
      });
      bus.emit({ type: 'day:changed', payload: { day: get().state.day } });
    },

    loadState(state) {
      set((s) => {
        s.state = state;
        s.rng = new Rng(state.rngSeed);
        s.rng.state = state.rngSeed;
      });
      bus.emit({ type: 'save:loaded', payload: { day: state.day, phase: state.phase } });
    },

    runEffects(effects) {
      let raised: ReturnType<typeof applyEffects> = [];
      set((s) => {
        raised = applyEffects(s.state, effects);
      });
      bus.emitAll(raised.map((e) => ({ type: e.type, payload: e.payload })));
      // location/goto and phase/advance are commands to the engine, not just notifications
      for (const e of raised) {
        if (e.type === 'phase:advance') get().advancePhase();
      }
    },

    advancePhase() {
      const { game, state } = get();
      if (!game) return false;
      const result = advance(game, state, {
        editionPublished: state.editions.some((e) => e.day === state.day),
      });
      if (!result.ok || !result.next) return false;
      const dayChanged = result.next.day !== state.day;
      set((s) => {
        s.state.day = result.next!.day as Day;
        s.state.phase = result.next!.phase as Phase;
        // persist the RNG stream position across the transition
        s.state.rngSeed = s.rng.state;
      });
      bus.emit({ type: 'phase:changed', payload: { day: result.next.day, phase: result.next.phase } });
      if (dayChanged) bus.emit({ type: 'day:changed', payload: { day: result.next.day } });
      return true;
    },

    moveTo(location) {
      set((s) => {
        s.state.location = location;
      });
      bus.emit({ type: 'location:changed', payload: { location } });
    },

    unlockDeduction(id) {
      const already = get().state.board.deductions.includes(id);
      if (already) return;
      set((s) => {
        s.state.board.deductions.push(id);
      });
      bus.emit({ type: 'deduction:unlocked', payload: { deduction: id } });
    },

    markCardRead(id) {
      set((s) => {
        const card = s.state.cards[id];
        if (card) card.readCount += 1;
      });
    },

    tickPlaytime(sec) {
      set((s) => {
        s.state.meta.playtimeSec += sec;
      });
    },
  })),
);
