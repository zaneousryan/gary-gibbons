// PuzzleHost — renders the active puzzle module (§6.7 contract). Each module
// is a self-contained overlay; the host only routes.

import { useState } from 'react';
import {
  usePuzzleStore,
  DUST_LIBRARY,
  dustLibraryCheck,
  SEAL_SKETCH,
  sealSketchAccuracy,
  sealSketchResolveEffects,
  THEN_NOW_FOUNDING,
  thenNowAligned,
  TRACE_FERRIS,
  traceOrderCorrect,
  PHOTO_TRIANGULATION,
  FIRE_ESCAPE,
  TORN_LETTER,
  HANDWRITING_MATCH,
  MAP_OVERLAY,
  mapOverlayAligned,
} from '@systems/puzzles';
import { useUiStore } from './uiStore';

export default function PuzzleHost() {
  const active = usePuzzleStore((s) => s.active);
  if (!active) return null;
  switch (active) {
    case 'dust_library':
      return <DustLibrary />;
    case 'sketch_memory_seal':
      return <SealSketch />;
    case 'then_now_founding':
      return (
        <SliderAlign
          kicker="THEN & NOW · WARREN'S FOUNDING PHOTOGRAPH"
          title="Fifty Years, One Frame"
          data={THEN_NOW_FOUNDING}
          aligned={thenNowAligned}
          revealText="The ghost image settles — and the dedication plaque sits a full stride from where it hangs today. It was MOVED. Something was added behind it, ten years ago."
        />
      );
    case 'map_overlay':
      return (
        <SliderAlign
          kicker="THE 1890s SURVEY · ARCHIVE PROPERTY (RECOVERED)"
          title="Ghost Locations"
          data={MAP_OVERLAY}
          aligned={mapOverlayAligned}
          revealText={MAP_OVERLAY.ghosts.join(' · ')}
        />
      );
    case 'trace_ferris':
      return <TraceFollow />;
    case 'photo_triangulation':
      return <SpotPick />;
    case 'fire_escape_sightline':
      return <FireEscape />;
    case 'torn_letter':
      return <TornLetter />;
    case 'handwriting_match':
      return <HandwritingMatch />;
    default:
      return <UnknownPuzzle id={active} />;
  }
}

function Frame({ title, kicker, children }: { title: string; kicker: string; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 bg-ink/70 flex items-center justify-center pointer-events-auto z-40" data-testid="puzzle">
      <div className="w-[min(900px,94vw)] max-h-[92vh] overflow-y-auto bg-cream border-4 border-ink rounded-lg shadow-2xl p-6">
        <div className="text-xs tracking-[0.3em] text-ink/50 font-bold">{kicker}</div>
        <h2 className="text-ink font-bold text-2xl mt-1 mb-3">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function DustLibrary() {
  const resolve = usePuzzleStore((s) => s.resolve);
  const cancel = usePuzzleStore((s) => s.cancel);
  const showToast = useUiStore((s) => s.showToast);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [picking, setPicking] = useState<string | null>(null);

  const submit = () => {
    if (dustLibraryCheck(assignments)) {
      resolve(DUST_LIBRARY.resolveEffects);
    } else {
      showToast('The dust disagrees. Gary re-reads the checklist, patient as Ida.');
    }
  };

  return (
    <Frame kicker="THE VAULT FLOOR · DAY 2" title="The Dust Library">
      <p className="text-ink/70 italic mb-4">
        Fifty years of items left their shapes in the dust. Match each void against Poppy's laminated checklist.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {DUST_LIBRARY.voids.map((v) => (
          <button
            key={v.id}
            data-testid={`void-${v.id}`}
            onClick={() => setPicking(picking === v.id ? null : v.id)}
            className={
              'text-left border-2 rounded p-3 cursor-pointer ' +
              (picking === v.id ? 'border-amber bg-amber/20' : 'border-ink/40 hover:border-ink')
            }
          >
            <div className="text-sm italic text-ink/80">{v.label}</div>
            <div className="text-xs font-bold mt-1 text-ink">
              {assignments[v.id]
                ? DUST_LIBRARY.checklist.find((c) => c.id === assignments[v.id])?.label
                : '— unmatched —'}
            </div>
          </button>
        ))}
      </div>
      {picking && (
        <div className="mb-4 border-2 border-ink rounded p-3 bg-amber/10" data-testid="checklist">
          <div className="text-xs font-bold uppercase tracking-widest text-ink/60 mb-2">Poppy's checklist — item by item, laminated</div>
          <div className="flex flex-wrap gap-2">
            {DUST_LIBRARY.checklist.map((c) => (
              <button
                key={c.id}
                data-testid={`checkitem-${c.id}`}
                className="border border-ink/50 rounded px-2 py-1 text-sm cursor-pointer hover:bg-amber/40 text-ink"
                onClick={() => {
                  setAssignments((a) => ({ ...a, [picking]: c.id }));
                  setPicking(null);
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <button
          onClick={submit}
          disabled={Object.keys(assignments).length < DUST_LIBRARY.voids.length}
          data-testid="puzzle-submit"
          className={
            'flex-1 py-2 border-2 rounded font-bold ' +
            (Object.keys(assignments).length >= DUST_LIBRARY.voids.length
              ? 'border-ink bg-amber text-ink cursor-pointer hover:brightness-110'
              : 'border-ink/20 text-ink/30 cursor-not-allowed')
          }
        >
          Read the dust
        </button>
        <button onClick={cancel} data-testid="puzzle-cancel" className="px-4 border-2 border-ink/40 rounded text-ink/60 cursor-pointer hover:text-ink">
          step away
        </button>
      </div>
    </Frame>
  );
}

function SealSketch() {
  const resolve = usePuzzleStore((s) => s.resolve);
  const [picks, setPicks] = useState<Record<string, string>>({});
  const complete = SEAL_SKETCH.parts.every((p) => picks[p.slot]);

  return (
    <Frame kicker="SKETCH FROM MEMORY · POPPY'S DESCRIPTION" title="The Seal">
      <p className="text-ink/80 italic mb-4">{SEAL_SKETCH.description}</p>
      <div className="space-y-3 mb-4">
        {SEAL_SKETCH.parts.map((part) => (
          <div key={part.slot}>
            <div className="text-xs font-bold uppercase tracking-widest text-ink/60 mb-1">{part.slot}</div>
            <div className="flex gap-2">
              {part.options.map((o) => (
                <button
                  key={o.id}
                  data-testid={`sketch-${o.id}`}
                  onClick={() => setPicks((p) => ({ ...p, [part.slot]: o.id }))}
                  className={
                    'flex-1 border-2 rounded p-2 text-sm cursor-pointer text-ink ' +
                    (picks[part.slot] === o.id ? 'border-amber bg-amber/30 font-bold' : 'border-ink/40 hover:border-ink')
                  }
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => resolve(sealSketchResolveEffects(sealSketchAccuracy(picks)))}
        disabled={!complete}
        data-testid="puzzle-submit"
        className={
          'w-full py-2 border-2 rounded font-bold ' +
          (complete ? 'border-ink bg-amber text-ink cursor-pointer hover:brightness-110' : 'border-ink/20 text-ink/30 cursor-not-allowed')
        }
      >
        Show her the sketch
      </button>
      <p className="text-ink/40 text-xs italic mt-2">An imperfect sketch still pins. Care is its own reward.</p>
    </Frame>
  );
}

interface SliderData {
  description: string;
  target: number;
  tolerance: number;
  resolveEffects: import('@engine/effects').Effect[];
}

function SliderAlign({ kicker, title, data, aligned, revealText }: { kicker: string; title: string; data: SliderData; aligned: (v: number) => boolean; revealText: string }) {
  const resolve = usePuzzleStore((s) => s.resolve);
  const cancel = usePuzzleStore((s) => s.cancel);
  const [value, setValue] = useState(10);
  const [revealed, setRevealed] = useState(false);
  const hit = aligned(value);
  return (
    <Frame kicker={kicker} title={title}>
      <p className="text-ink/70 italic mb-4">{data.description}</p>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        data-testid="align-slider"
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-amber cursor-pointer"
      />
      <div className={'mt-3 p-3 rounded border-2 text-sm italic transition ' + (hit ? 'border-amber bg-amber/20 text-ink' : 'border-ink/20 text-ink/40')}>
        {hit ? (revealed ? revealText : 'The images breathe together. Hold it there.') : 'Blurred — the past and present disagree by inches.'}
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => (revealed ? resolve(data.resolveEffects) : setRevealed(true))}
          disabled={!hit}
          data-testid="puzzle-submit"
          className={'flex-1 py-2 border-2 rounded font-bold ' + (hit ? 'border-ink bg-amber text-ink cursor-pointer hover:brightness-110' : 'border-ink/20 text-ink/30 cursor-not-allowed')}
        >
          {revealed ? 'Note it down' : 'Read the overlay'}
        </button>
        <button onClick={cancel} data-testid="puzzle-cancel" className="px-4 border-2 border-ink/40 rounded text-ink/60 cursor-pointer hover:text-ink">
          step away
        </button>
      </div>
    </Frame>
  );
}

function TraceFollow() {
  const resolve = usePuzzleStore((s) => s.resolve);
  const cancel = usePuzzleStore((s) => s.cancel);
  const showToast = useUiStore((s) => s.showToast);
  const [order, setOrder] = useState<string[]>([]);
  return (
    <Frame kicker="FOLLOWING TRACES · THE HOLED SOLE" title="One Weasel, Four Clues">
      <p className="text-ink/70 italic mb-4">{TRACE_FERRIS.description}</p>
      <div className="space-y-2 mb-4">
        {TRACE_FERRIS.waypoints.map((w) => {
          const idx = order.indexOf(w.id);
          return (
            <button
              key={w.id}
              data-testid={`trace-${w.id}`}
              onClick={() => setOrder((o) => (o.includes(w.id) ? o.filter((x) => x !== w.id) : [...o, w.id]))}
              className={'block w-full text-left border-2 rounded p-2 text-sm cursor-pointer text-ink ' + (idx >= 0 ? 'border-amber bg-amber/20' : 'border-ink/30 hover:border-ink')}
            >
              {idx >= 0 && <span className="font-bold mr-2 text-amber-700">{idx + 1}.</span>}
              {w.label}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            if (traceOrderCorrect(order)) resolve(TRACE_FERRIS.resolveEffects);
            else {
              setOrder([]);
              showToast('The trail goes cold that way. Start from where the digging started.');
            }
          }}
          disabled={order.length < TRACE_FERRIS.waypoints.length}
          data-testid="puzzle-submit"
          className={'flex-1 py-2 border-2 rounded font-bold ' + (order.length >= TRACE_FERRIS.waypoints.length ? 'border-ink bg-amber text-ink cursor-pointer hover:brightness-110' : 'border-ink/20 text-ink/30 cursor-not-allowed')}
        >
          Follow the trail
        </button>
        <button onClick={cancel} data-testid="puzzle-cancel" className="px-4 border-2 border-ink/40 rounded text-ink/60 cursor-pointer hover:text-ink">
          step away
        </button>
      </div>
    </Frame>
  );
}

function SpotPick() {
  const resolve = usePuzzleStore((s) => s.resolve);
  const cancel = usePuzzleStore((s) => s.cancel);
  const showToast = useUiStore((s) => s.showToast);
  return (
    <Frame kicker="PHOTO TRIANGULATION · THE SQUARE AT NIGHT" title="Where the Figure Stood">
      <p className="text-ink/70 italic mb-4">{PHOTO_TRIANGULATION.description}</p>
      <div className="space-y-2 mb-2">
        {PHOTO_TRIANGULATION.spots.map((s) => (
          <button
            key={s.id}
            data-testid={`spot-${s.id}`}
            onClick={() => {
              if (s.id === PHOTO_TRIANGULATION.answer) resolve(PHOTO_TRIANGULATION.resolveEffects);
              else showToast('The lantern smears refuse the match. Not there.');
            }}
            className="block w-full text-left border-2 border-ink/30 rounded p-2 text-sm cursor-pointer text-ink hover:border-ink hover:bg-amber/10"
          >
            {s.label}
          </button>
        ))}
      </div>
      <button onClick={cancel} data-testid="puzzle-cancel" className="mt-2 px-4 py-1 border-2 border-ink/40 rounded text-ink/60 cursor-pointer hover:text-ink">
        step away
      </button>
    </Frame>
  );
}

function FireEscape() {
  const resolve = usePuzzleStore((s) => s.resolve);
  const [seen, setSeen] = useState<string[]>([]);
  const done = seen.length === FIRE_ESCAPE.checks.length;
  return (
    <Frame kicker="THE FIRE-ESCAPE SIGHTLINE · 2 A.M., RECONSTRUCTED" title="Could the Kid Have Seen It?">
      <p className="text-ink/70 italic mb-4">{FIRE_ESCAPE.description}</p>
      <div className="space-y-2 mb-4">
        {FIRE_ESCAPE.checks.map((c) => (
          <button
            key={c.id}
            data-testid={`fe-${c.id}`}
            onClick={() => setSeen((s) => (s.includes(c.id) ? s : [...s, c.id]))}
            className={'block w-full text-left border-2 rounded p-2 text-sm cursor-pointer text-ink ' + (seen.includes(c.id) ? 'border-amber bg-amber/10' : 'border-ink/30 hover:border-ink')}
          >
            <div className="font-bold">{c.label}</div>
            {seen.includes(c.id) && <div className="italic text-ink/70 mt-1">{c.finding}</div>}
          </button>
        ))}
      </div>
      <button
        onClick={() => resolve(FIRE_ESCAPE.resolveEffects)}
        disabled={!done}
        data-testid="puzzle-submit"
        className={'w-full py-2 border-2 rounded font-bold ' + (done ? 'border-ink bg-amber text-ink cursor-pointer hover:brightness-110' : 'border-ink/20 text-ink/30 cursor-not-allowed')}
      >
        The story holds — CONFIRMED
      </button>
    </Frame>
  );
}

function TornLetter() {
  const resolve = usePuzzleStore((s) => s.resolve);
  const cancel = usePuzzleStore((s) => s.cancel);
  const showToast = useUiStore((s) => s.showToast);
  const [order, setOrder] = useState<string[]>([]);
  return (
    <Frame kicker="THE STUDY WASTEBASKET · UNSENT" title="The Torn Letter">
      <p className="text-ink/70 italic mb-4">{TORN_LETTER.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {TORN_LETTER.fragments.map((f) => {
          const idx = order.indexOf(f.id);
          return (
            <button
              key={f.id}
              data-testid={`frag-${f.id}`}
              onClick={() => setOrder((o) => (o.includes(f.id) ? o.filter((x) => x !== f.id) : [...o, f.id]))}
              className={'border-2 rounded p-2 text-sm italic cursor-pointer text-ink ' + (idx >= 0 ? 'border-amber bg-amber/20' : 'border-ink/30 hover:border-ink')}
            >
              {idx >= 0 && <span className="font-bold not-italic mr-1">{idx + 1}</span>}
              {f.text}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            if (TORN_LETTER.order.every((id, i) => order[i] === id)) resolve(TORN_LETTER.resolveEffects);
            else {
              setOrder([]);
              showToast('The hand stutters that way. Follow the flow of the writing, not the tears.');
            }
          }}
          disabled={order.length < TORN_LETTER.fragments.length}
          data-testid="puzzle-submit"
          className={'flex-1 py-2 border-2 rounded font-bold ' + (order.length >= TORN_LETTER.fragments.length ? 'border-ink bg-amber text-ink cursor-pointer hover:brightness-110' : 'border-ink/20 text-ink/30 cursor-not-allowed')}
        >
          Read it whole
        </button>
        <button onClick={cancel} data-testid="puzzle-cancel" className="px-4 border-2 border-ink/40 rounded text-ink/60 cursor-pointer hover:text-ink">
          leave it
        </button>
      </div>
    </Frame>
  );
}

function HandwritingMatch() {
  const resolve = usePuzzleStore((s) => s.resolve);
  const [checked, setChecked] = useState<string[]>([]);
  const done = checked.length === HANDWRITING_MATCH.features.length;
  return (
    <Frame kicker="HANDWRITING COMPARISON · THE MORGUE LEDGERS" title="Three Features, No Guessing">
      <p className="text-ink/70 italic mb-4">{HANDWRITING_MATCH.description}</p>
      <div className="space-y-2 mb-4">
        {HANDWRITING_MATCH.features.map((f) => (
          <button
            key={f.id}
            data-testid={`hw-${f.id}`}
            onClick={() => setChecked((c) => (c.includes(f.id) ? c : [...c, f.id]))}
            className={'block w-full text-left border-2 rounded p-2 text-sm cursor-pointer text-ink ' + (checked.includes(f.id) ? 'border-amber bg-amber/10' : 'border-ink/30 hover:border-ink')}
          >
            {checked.includes(f.id) ? '✓ ' : ''}{f.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => resolve(HANDWRITING_MATCH.resolveEffects)}
        disabled={!done}
        data-testid="puzzle-submit"
        className={'w-full py-2 border-2 rounded font-bold ' + (done ? 'border-ink bg-amber text-ink cursor-pointer hover:brightness-110' : 'border-ink/20 text-ink/30 cursor-not-allowed')}
      >
        Same hand
      </button>
    </Frame>
  );
}

function UnknownPuzzle({ id }: { id: string }) {
  const cancel = usePuzzleStore((s) => s.cancel);
  return (
    <Frame kicker="COMING SOON" title={`Puzzle module "${id}"`}>
      <p className="text-ink/60 italic mb-4">This module lands in a later phase.</p>
      <button onClick={cancel} className="px-4 py-2 border-2 border-ink rounded bg-amber font-bold text-ink cursor-pointer">
        back
      </button>
    </Frame>
  );
}
