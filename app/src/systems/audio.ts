// AudioService pass 1 (tech spec §6.8): Howler channels (music/ambient/sfx/
// blips). Real OGGs drop into /assets/audio per the §10 contract; until they
// land, sfx fall back to tiny synthesized WebAudio cues so the game is never
// silent-broken and never blocked (placeholder rule).

import { Howl, Howler } from 'howler';
import { bus } from '@engine/eventBus';

type Channel = 'music' | 'ambient' | 'sfx' | 'blips';

const volumes: Record<Channel, number> = { music: 0.7, ambient: 0.6, sfx: 0.9, blips: 0.8 };
const current: Partial<Record<'music' | 'ambient', Howl>> = {};
const failed = new Set<string>();

function url(id: string): string {
  return `/audio/${id}.ogg`;
}

/** Tiny synthesized fallback — a soft 'thock' or blip via WebAudio. */
function synth(kind: 'thock' | 'blip' | 'chime') {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    if (kind === 'thock') {
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (kind === 'blip') {
      osc.frequency.setValueAtTime(520, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else {
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.setValueAtTime(880, now + 0.09);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch {
    // audio context unavailable (headless) — silence is acceptable
  }
}

let ctx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null;
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export function playSfx(id: string, fallback: 'thock' | 'blip' | 'chime' = 'chime'): void {
  if (failed.has(id)) {
    synth(fallback);
    return;
  }
  const howl = new Howl({
    src: [url(id)],
    volume: volumes.sfx,
    onloaderror: () => {
      failed.add(id);
      synth(fallback);
    },
  });
  howl.play();
}

export function playLoop(channel: 'music' | 'ambient', id: string): void {
  current[channel]?.stop();
  const howl = new Howl({
    src: [url(id)],
    volume: volumes[channel],
    loop: true,
    onloaderror: () => {
      failed.add(id);
    },
  });
  current[channel] = howl;
  howl.play();
}

export function stopLoop(channel: 'music' | 'ambient'): void {
  current[channel]?.stop();
  delete current[channel];
}

export function setChannelVolume(channel: Channel, v: number): void {
  volumes[channel] = v;
  if (channel === 'music' || channel === 'ambient') current[channel]?.volume(v);
}

export function setMasterVolume(v: number): void {
  Howler.volume(v);
}

/** Wire the signature cues (§6.8): the *thock*, deduction chime, dialogue blips. */
export function installAudioWatcher(): () => void {
  const un1 = bus.on('card:verified', () => playSfx('sfx_thock', 'thock'));
  const un2 = bus.on('deduction:unlocked', () => playSfx('sfx_deduction', 'chime'));
  const un3 = bus.on('dialogue:started', () => playSfx('sfx_page', 'blip'));
  return () => {
    un1();
    un2();
    un3();
  };
}
