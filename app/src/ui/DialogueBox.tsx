// DialogueBox — the paper layer over the world (tech spec §3, §6.1).
// Phase 0: portrait, typewriter text, stance buttons (OBSERVE disabled with
// tooltip until noticed), choices, off-record badge. Blips land Phase 4 audio.

import { useEffect, useMemo, useState } from 'react';
import type { ContentDB } from '@content/contentDb';
import { useDialogueStore, type Stance } from '@systems/dialogue';
import { portraitPath } from '@scenes/assets';
import { useSettings } from './settingsStore';

const STANCE_LABEL: Record<Stance, string> = {
  press: 'PRESS',
  empathize: 'EMPATHIZE',
  observe: 'OBSERVE',
};

export default function DialogueBox({ db }: { db: ContentDB }) {
  const view = useDialogueStore((s) => s.view);
  const { chooseStance, chooseOption, advance } = useDialogueStore.getState();
  const [shown, setShown] = useState(0);

  const textSpeedSetting = useSettings((s) => s.textSpeed);
  const reduceMotion = useSettings((s) => s.reduceMotion);
  const line = view?.line ?? '';
  useEffect(() => {
    setShown(0);
    if (!line) return;
    if (textSpeedSetting === 0 || reduceMotion) {
      setShown(line.length); // instant text (settings / reduce-motion)
      return;
    }
    const speaker = view ? db.characters[view.speaker] : null;
    const speed = (speaker?.voice.textSpeed ?? 1) * textSpeedSetting;
    const interval = setInterval(() => {
      setShown((n) => {
        if (n >= line.length) {
          clearInterval(interval);
          return n;
        }
        return n + 1;
      });
    }, 18 / speed);
    return () => clearInterval(interval);
  }, [line, view, db, textSpeedSetting, reduceMotion]);

  const speakerDef = view ? db.characters[view.speaker] : null;
  const isNarrator = view?.speaker === 'narrator';
  // interview mode already shows the two-shot — no thumbnail doubling
  const inInterview = !!view && view.characterId !== 'narrator' && view.characterId !== 'gary';
  const portrait = useMemo(() => {
    if (!speakerDef || isNarrator || inInterview) return null;
    return `/${portraitPath(speakerDef.portraitSet, view?.emote ?? 'neutral')}`;
  }, [speakerDef, isNarrator, inInterview, view?.emote]);

  if (!view) return null;
  const typing = shown < line.length;
  const speakerName = isNarrator ? '' : view.speaker === 'gary' ? 'Gary' : (speakerDef?.name ?? view.speaker);

  return (
    <div className="absolute inset-x-0 bottom-0 flex justify-center pb-6 pointer-events-none" data-testid="dialogue-box">
      <div className="pointer-events-auto w-[min(1100px,92vw)] rounded-lg border-4 border-ink bg-cream/95 shadow-2xl p-4 flex gap-4">
        {portrait && (
          <img
            src={portrait}
            alt={speakerName}
            className="h-40 w-32 object-cover rounded border-2 border-ink bg-dusk/20"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              if (!img.src.includes('/_placeholders/')) {
                img.src = `/_placeholders${new URL(img.src).pathname}`;
              } else {
                img.style.visibility = 'hidden';
              }
            }}
          />
        )}
        <div className={'flex-1 min-w-0' + (isNarrator ? ' text-center' : '')}>
          <div className="flex items-center gap-3">
            {speakerName && <span className="font-bold text-ink text-lg">{speakerName}</span>}
            {view.offRecord && (
              <span className="text-xs uppercase tracking-widest bg-plum text-cream px-2 py-0.5 rounded" data-testid="offrecord-badge">
                off the record
              </span>
            )}
          </div>
          {line && (
            <p
              className={
                'text-ink text-xl leading-relaxed mt-1 cursor-pointer select-none' +
                (isNarrator ? ' italic text-ink/75' : '')
              }
              data-testid="dialogue-line"
              onClick={() => (typing ? setShown(line.length) : advance())}
            >
              {line.slice(0, shown)}
              {typing && <span className="opacity-50">▌</span>}
            </p>
          )}
          {!typing && view.stances && (
            <div className="mt-3 flex gap-3" data-testid="stance-row">
              {view.stances.map((s) => (
                <button
                  key={s.stance}
                  disabled={!s.enabled}
                  title={s.enabled ? s.line : "Gary hasn't noticed anything to say here — yet."}
                  data-testid={`stance-${s.stance}`}
                  onClick={() => chooseStance(s.stance)}
                  className={
                    'px-4 py-2 rounded border-2 border-ink font-bold tracking-wide transition ' +
                    (s.enabled
                      ? 'bg-amber text-ink hover:brightness-110 cursor-pointer'
                      : 'bg-cream text-ink/35 border-ink/30 cursor-not-allowed')
                  }
                >
                  {STANCE_LABEL[s.stance]}
                </button>
              ))}
            </div>
          )}
          {!typing && view.choices && (
            <div className="mt-3 flex flex-col gap-2" data-testid="choice-list">
              {view.choices.map((c) => (
                <button
                  key={c.index}
                  onClick={() => chooseOption(c.index)}
                  className="text-left px-4 py-2 rounded border-2 border-ink bg-cream hover:bg-amber/40 text-ink cursor-pointer"
                >
                  {c.line}
                </button>
              ))}
            </div>
          )}
          {!typing && !view.stances && !view.choices && (
            <button
              className="mt-2 text-ink/60 text-sm underline cursor-pointer"
              data-testid="dialogue-advance"
              onClick={advance}
            >
              continue →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
