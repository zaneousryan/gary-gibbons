// PuzzleHost — renders the active puzzle module (§6.7 contract). Each module
// is a self-contained overlay; the host only routes.

import { useState } from 'react';
import { usePuzzleStore, DUST_LIBRARY, dustLibraryCheck, SEAL_SKETCH, sealSketchAccuracy, sealSketchResolveEffects } from '@systems/puzzles';
import { useUiStore } from './uiStore';

export default function PuzzleHost() {
  const active = usePuzzleStore((s) => s.active);
  if (!active) return null;
  if (active === 'dust_library') return <DustLibrary />;
  if (active === 'sketch_memory_seal') return <SealSketch />;
  // STUB(phase-5): the remaining seven modules register here as they land.
  return <UnknownPuzzle id={active} />;
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
