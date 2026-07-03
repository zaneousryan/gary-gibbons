// Weather (tech spec §6.8, II.14.2): scheduled rain (D5 midday) plus one
// seeded random chance per day. Rain swaps location variant layers (scene
// layer) and reroutes schedules via ifRain (already in the scheduler).

import type { ContentDB } from '@content/contentDb';
import { useGameStore } from '@engine/store';
import { bus } from '@engine/eventBus';
import { Rng } from '@engine/rng';

/** Decide the weather for the current day/phase. Deterministic per seed+day. */
export function weatherFor(db: ContentDB, day: number, phase: string, seed: number): 'clear' | 'rain' {
  const wx = db.game.weather;
  if (!wx) return 'clear';
  if (wx.scheduledRain.some((r) => r.day === day && r.phase === phase)) return 'rain';
  if (wx.dailyRainChance > 0) {
    // one seeded roll per day, landing on midday — the engine Rng, reproducible
    // for the autoplayer (ALETHEIA §7)
    const roll = new Rng(seed + day * 7919).next();
    if (roll < wx.dailyRainChance && phase === 'midday') return 'rain';
  }
  return 'clear';
}

export function installWeatherWatcher(db: ContentDB): () => void {
  const apply = () => {
    const s = useGameStore.getState().state;
    const next = weatherFor(db, s.day, s.phase, s.rngSeed);
    if (next !== s.weather) {
      useGameStore.setState((st) => {
        st.state.weather = next;
      });
      bus.emit({ type: 'weather:changed', payload: { weather: next } });
    }
  };
  const un = bus.on('phase:changed', apply);
  queueMicrotask(apply);
  return un;
}
