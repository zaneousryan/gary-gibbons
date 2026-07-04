// Interview mode (playtest revision 1, 2026-07-04): real conversations leave
// the scene for a composed close-up two-shot — NPC portrait one side, Gary the
// other, over a softly blurred backdrop of the current location. Purely
// visual: DialogueBox (rendered above this) keeps all input. Narrator-led
// set-pieces (ceremony, reading, credits) stay full-scene; ambient
// greetings/vox pops never enter here at all.

import { useEffect, useState } from 'react';
import type { ContentDB } from '@content/contentDb';
import { useDialogueStore } from '@systems/dialogue';
import { useGameStore } from '@engine/store';
import { locationLayerPath, portraitPath } from '@scenes/assets';
import { useSettings } from './settingsStore';

function PortraitImg({ set, emote, alt, active }: { set: string; emote: string; alt: string; active: boolean }) {
  return (
    <img
      src={`/${portraitPath(set, emote)}`}
      alt={alt}
      className={
        'h-[52vh] max-h-[480px] w-auto object-contain rounded-lg border-4 border-ink bg-dusk/30 shadow-2xl transition-all duration-200 ' +
        (active ? 'opacity-100 scale-100' : 'opacity-55 scale-95')
      }
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        if (!img.src.includes('/_placeholders/')) {
          img.src = `/_placeholders${new URL(img.src).pathname}`;
        } else {
          img.style.visibility = 'hidden';
        }
      }}
    />
  );
}

export default function InterviewMode({ db }: { db: ContentDB }) {
  const view = useDialogueStore((s) => s.view);
  const location = useGameStore((s) => s.state.location);
  const phase = useGameStore((s) => s.state.phase);
  const reduceMotion = useSettings((s) => s.reduceMotion);
  const [entered, setEntered] = useState(false);

  const characterId = view?.characterId;
  const isInterview = !!view && !!characterId && characterId !== 'narrator' && characterId !== 'gary';

  // fade in on entry (soft zoom via scale), instant under reduce-motion
  useEffect(() => {
    if (!isInterview) {
      setEntered(false);
      return;
    }
    if (reduceMotion) {
      setEntered(true);
      return;
    }
    const t = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(t);
  }, [isInterview, reduceMotion]);

  if (!isInterview || !view) return null;

  const npc = db.characters[characterId];
  const gary = db.characters['gary'];
  if (!npc) return null;

  const npcSpeaking = view.speaker === characterId;
  const garySpeaking = view.speaker === 'gary';
  const backdrop = `/${locationLayerPath(location, phase, 'mid')}`;

  return (
    <div
      className={
        'absolute inset-0 z-30 pointer-events-none overflow-hidden ' +
        (reduceMotion ? '' : 'transition-opacity duration-300 ') +
        (entered ? 'opacity-100' : 'opacity-0')
      }
      data-testid="interview-mode"
    >
      {/* blurred location backdrop + ink wash */}
      <img
        src={backdrop}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'blur(14px) brightness(0.55) saturate(0.8)', transform: 'scale(1.06)' }}
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          if (!img.src.includes('/_placeholders/')) {
            img.src = `/_placeholders${new URL(img.src).pathname}`;
          } else {
            img.style.visibility = 'hidden';
          }
        }}
      />
      <div className="absolute inset-0 bg-ink/45" />

      {/* the two-shot: NPC left, Gary right; the speaker leans in */}
      <div
        className={
          'absolute inset-x-0 top-0 bottom-[220px] flex items-end justify-between px-[8vw] ' +
          (reduceMotion ? '' : 'transition-transform duration-300 ') +
          (entered ? 'scale-100' : 'scale-[1.03]')
        }
      >
        <PortraitImg set={npc.portraitSet} emote={npcSpeaking ? view.emote : 'neutral'} alt={npc.name} active={npcSpeaking} />
        {gary && (
          <div className="-scale-x-100">
            <PortraitImg set={gary.portraitSet} emote={garySpeaking ? view.emote : 'neutral'} alt="Gary" active={garySpeaking} />
          </div>
        )}
      </div>
    </div>
  );
}
