// Weather (tech spec §6.8, II.14.2): scheduled rain (D5 midday) plus one
// seeded random chance per day. Rain swaps location variant layers (scene
// layer) and reroutes schedules via ifRain (already in the scheduler).

import type { ContentDB } from '@content/contentDb';
import { useGameStore } from '@engine/store';
import { bus } from '@engine/eventBus';

/** Decide the weather for the current day/phase. Deterministic per seed+day. */
export function weatherFor(db: ContentDB, day: number, phase: string, seed: number): 'clear' | 'rain' {
  const wx = db.game.weather;
  if (!wx) return 'clear';
  if (wx.scheduledRain.some((r) => r.day === day && r.phase === phase)) return 'rain';
  if (wx.dailyRainChance > 0) {
    // one seeded roll per day, applied to a single random midday phase — no
    // Math.random, reproducible for the autoplayer (ALETHEIA §7)
    const roll = mulberryOnce(seed + day * 7919);
    if (roll < wx.dailyRainChance && phase === 'midday') return 'rain';
  }
  return 'clear';
}

function mulberryOnce(seed: number): number {
  let t = (seed + 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
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
