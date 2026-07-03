// Settings overlay (tech spec §8). Renders ABOVE the title screen (z-70 vs
// z-60) so it is usable from both entry points; Escape closes it.

import { useEffect } from 'react';
import { useSettings } from './settingsStore';
import { useUiStore } from './uiStore';

export default function SettingsPanel() {
  const open = useUiStore((s) => s.settingsOpen);
  const toggle = useUiStore((s) => s.toggleSettings);
  const settings = useSettings();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggle();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, toggle]);

  if (!open) return null;

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-ink/10">
      <span className="text-ink font-bold text-sm">{label}</span>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );

  return (
    <div className="absolute inset-0 bg-ink/60 flex items-center justify-center pointer-events-auto z-[70]" data-testid="settings" onClick={toggle}>
      <div className="w-[min(520px,92vw)] bg-cream border-4 border-ink rounded-lg shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-ink font-bold text-2xl mb-3">Settings</h2>
        <Row label="Text size">
          {[0.85, 1, 1.2, 1.4].map((v) => (
            <button key={v} onClick={() => settings.set('textScale', v)} data-testid={`set-textscale-${v}`}
              className={'px-2 py-1 border-2 rounded cursor-pointer text-ink ' + (settings.textScale === v ? 'border-amber bg-amber/30 font-bold' : 'border-ink/30')}>
              {v === 0.85 ? 'S' : v === 1 ? 'M' : v === 1.2 ? 'L' : 'XL'}
            </button>
          ))}
        </Row>
        <Row label="Text speed">
          {[
            [0.5, 'slow'],
            [1, 'normal'],
            [2, 'fast'],
            [0, 'instant'],
          ].map(([v, label]) => (
            <button key={String(v)} onClick={() => settings.set('textSpeed', v as number)}
              className={'px-2 py-1 border-2 rounded cursor-pointer text-ink text-xs ' + (settings.textSpeed === v ? 'border-amber bg-amber/30 font-bold' : 'border-ink/30')}>
              {label}
            </button>
          ))}
        </Row>
        <Row label="Master volume">
          <input type="range" min={0} max={1} step={0.1} value={settings.masterVolume}
            onChange={(e) => settings.set('masterVolume', Number(e.target.value))} className="accent-amber cursor-pointer" />
        </Row>
        <Row label="Music volume">
          <input type="range" min={0} max={1} step={0.1} value={settings.musicVolume}
            onChange={(e) => settings.set('musicVolume', Number(e.target.value))} className="accent-amber cursor-pointer" />
        </Row>
        <Row label="Sound effects">
          <input type="range" min={0} max={1} step={0.1} value={settings.sfxVolume}
            onChange={(e) => settings.set('sfxVolume', Number(e.target.value))} className="accent-amber cursor-pointer" />
        </Row>
        <Row label="Colorblind string patterns">
          <button onClick={() => settings.set('colorblindStrings', !settings.colorblindStrings)} data-testid="set-colorblind"
            className={'px-3 py-1 border-2 rounded cursor-pointer text-ink ' + (settings.colorblindStrings ? 'border-amber bg-amber/30 font-bold' : 'border-ink/30')}>
            {settings.colorblindStrings ? 'on' : 'off'}
          </button>
        </Row>
        <Row label="Reduce motion">
          <button onClick={() => settings.set('reduceMotion', !settings.reduceMotion)} data-testid="set-reduce-motion"
            className={'px-3 py-1 border-2 rounded cursor-pointer text-ink ' + (settings.reduceMotion ? 'border-amber bg-amber/30 font-bold' : 'border-ink/30')}>
            {settings.reduceMotion ? 'on' : 'off'}
          </button>
        </Row>
        <button className="mt-4 w-full py-2 border-2 border-ink rounded bg-amber font-bold text-ink cursor-pointer" onClick={toggle} data-testid="settings-close">
          done
        </button>
      </div>
    </div>
  );
}
