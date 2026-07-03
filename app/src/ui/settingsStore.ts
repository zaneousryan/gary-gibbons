// Settings (tech spec §8): text size, text speed, volume mix, colorblind
// string patterns, reduce-motion. Persisted outside saves — they're the
// player's, not Gary's. Language scaffold: all strings live in /content, so
// localization is by construction; a locale switch lands with a second
// content set.

import { create } from 'zustand';
import { setChannelVolume, setMasterVolume } from '@systems/audio';

export interface Settings {
  textScale: number; // 0.85 | 1 | 1.2 | 1.4
  textSpeed: number; // typewriter multiplier: 0.5 slow .. 2 fast .. 0 = instant
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  /** Strings get dash patterns + glyphs, never color alone (ALETHEIA §7). */
  colorblindStrings: boolean;
  reduceMotion: boolean;
}

const DEFAULTS: Settings = {
  textScale: 1,
  textSpeed: 1,
  masterVolume: 1,
  musicVolume: 0.7,
  sfxVolume: 0.9,
  colorblindStrings: false,
  reduceMotion: false,
};

const LS_KEY = 'gg_settings';

function load(): Settings {
  try {
    const raw = globalThis.localStorage?.getItem(LS_KEY);
    return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

export interface SettingsStore extends Settings {
  set<K extends keyof Settings>(key: K, value: Settings[K]): void;
}

export const useSettings = create<SettingsStore>()((set, get) => ({
  ...load(),
  set(key, value) {
    set({ [key]: value } as Partial<Settings>);
    const { set: _set, ...rest } = get();
    try {
      globalThis.localStorage?.setItem(LS_KEY, JSON.stringify({ ...rest, [key]: value }));
    } catch {
      // storage unavailable — settings live for the session only
    }
    if (key === 'masterVolume') setMasterVolume(value as number);
    if (key === 'musicVolume') setChannelVolume('music', value as number);
    if (key === 'sfxVolume') setChannelVolume('sfx', value as number);
  },
}));
