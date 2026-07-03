// The Evening Edition (tech spec §6.5, II.15.1). Night ritual, first movement:
// draft (auto, Dot's law), headline (the tone axis), kicker, attribution
// sub-step when a protectable source is in the draft, print.

import { useMemo, useState } from 'react';
import type { ContentDB } from '@content/contentDb';
import { useGameStore } from '@engine/store';
import {
  alreadyPublishedToday,
  assembleDraft,
  availableHeadlines,
  availableKickers,
  editionForToday,
  pendingAttributions,
  publishEdition,
} from '@systems/edition';
import { useUiStore } from './uiStore';

export default function Newspaper({ db }: { db: ContentDB }) {
  const open = useUiStore((s) => s.newspaperOpen);
  const toggle = useUiStore((s) => s.toggleNewspaper);
  const showToast = useUiStore((s) => s.showToast);
  const editions = useGameStore((s) => s.state.editions);
  const day = useGameStore((s) => s.state.day);
  const [headlineId, setHeadlineId] = useState<string | null>(null);
  const [kickerId, setKickerId] = useState<string | null>(null);
  const [attributions, setAttributions] = useState<Record<string, boolean>>({});
  const [tab, setTab] = useState<'compose' | 'gallery'>('compose');

  const edition = editionForToday(db);
  const published = alreadyPublishedToday();
  const draft = useMemo(() => (edition ? assembleDraft(db, edition) : []), [db, edition, editions.length, day]);
  const pending = edition ? pendingAttributions(db, draft) : [];

  if (!open) return null;

  const doPublish = () => {
    if (!edition || !headlineId || !kickerId) return;
    const ok = publishEdition(db, { headlineId, kickerId, attributions });
    if (ok) {
      showToast('The press downstairs starts its late shift. Tomorrow, the town reads.');
      setHeadlineId(null);
      setKickerId(null);
      setAttributions({});
    } else {
      showToast('Dot would bounce this draft — something’s missing.');
    }
  };

  return (
    <div className="absolute inset-0 bg-ink/70 flex items-center justify-center pointer-events-auto z-40" data-testid="newspaper" onClick={toggle}>
      <div className="w-[min(880px,94vw)] h-[min(760px,92vh)] bg-cream border-4 border-ink shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="border-b-4 border-ink px-6 py-3 flex items-center">
          <div>
            <div className="font-bold text-3xl tracking-tight text-ink" style={{ fontVariant: 'small-caps' }}>
              The Lanternside Ledger
            </div>
            <div className="text-ink/60 text-xs tracking-widest uppercase">Evening Edition · Day {day}</div>
          </div>
          <div className="flex-1" />
          <button className={'px-3 py-1 text-xs font-bold uppercase cursor-pointer ' + (tab === 'compose' ? 'bg-amber' : '')} onClick={() => setTab('compose')} data-testid="paper-tab-compose">
            tonight
          </button>
          <button className={'px-3 py-1 text-xs font-bold uppercase cursor-pointer ' + (tab === 'gallery' ? 'bg-amber' : '')} onClick={() => setTab('gallery')} data-testid="paper-tab-gallery">
            gallery
          </button>
          <button className="ml-3 text-ink/60 hover:text-ink cursor-pointer text-xl" onClick={toggle} data-testid="paper-close">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 text-ink">
          {tab === 'gallery' && (
            <div className="space-y-3">
              {editions.length === 0 && <p className="italic opacity-50">No front pages yet. The week is young and so is the story.</p>}
              {editions.map((e) => {
                const ed = Object.values(db.editions).find((x) => x.day === e.day);
                const h = ed?.headlines.find((x) => x.id === e.headlineId);
                return (
                  <div key={e.day} className="border-2 border-ink p-3">
                    <div className="text-xs uppercase tracking-widest opacity-60">Day {e.day} · {e.tone}</div>
                    <div className="font-bold text-xl">{h?.text ?? e.headlineId}</div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'compose' && !edition && (
            <p className="italic opacity-60">No edition is due tonight.</p>
          )}
          {tab === 'compose' && edition && published && (
            <p className="italic opacity-60" data-testid="paper-published">Tonight's page is set and printing. See the gallery.</p>
          )}
          {tab === 'compose' && edition && !published && (
            <>
              <div className="mb-4">
                <div className="text-xs font-bold tracking-widest uppercase opacity-60 mb-1">The draft — what we know, not what we suspect</div>
                {draft.length === 0 && <p className="italic opacity-50">Nothing verified and on the record yet. Dot's law holds.</p>}
                <ul className="list-disc ml-5 text-sm">
                  {draft.map((c) => (
                    <li key={c}>{db.cards[c]?.title ?? c}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <div className="text-xs font-bold tracking-widest uppercase opacity-60 mb-1">The headline</div>
                <div className="space-y-2">
                  {availableHeadlines(edition).map((h) => (
                    <button
                      key={h.id}
                      data-testid={`headline-${h.id}`}
                      onClick={() => setHeadlineId(h.id)}
                      className={
                        'block w-full text-left border-2 p-2 cursor-pointer ' +
                        (headlineId === h.id ? 'border-amber bg-amber/30 font-bold' : 'border-ink/30 hover:border-ink')
                      }
                    >
                      <span className="text-lg">{h.text}</span>
                      <span className="block text-[10px] uppercase tracking-widest opacity-50">{h.tone}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs font-bold tracking-widest uppercase opacity-60 mb-1">The kicker</div>
                <div className="space-y-1">
                  {availableKickers(edition).map((k) => (
                    <button
                      key={k.id}
                      data-testid={`kicker-${k.id}`}
                      onClick={() => setKickerId(k.id)}
                      className={
                        'block w-full text-left border-2 p-2 text-sm italic cursor-pointer ' +
                        (kickerId === k.id ? 'border-amber bg-amber/30 font-bold' : 'border-ink/30 hover:border-ink')
                      }
                    >
                      {k.text}
                    </button>
                  ))}
                </div>
              </div>

              {pending.length > 0 && (
                <div className="mb-4" data-testid="attribution-step">
                  <div className="text-xs font-bold tracking-widest uppercase opacity-60 mb-1">Sourcing</div>
                  {pending.map((c) => (
                    <div key={c} className="border border-ink/30 p-2 text-sm flex items-center gap-3">
                      <span className="flex-1">{db.cards[c]?.title ?? c}</span>
                      <button
                        className={'border-2 px-2 py-0.5 cursor-pointer ' + (attributions[c] === false ? 'border-amber bg-amber/30 font-bold' : 'border-ink/30')}
                        onClick={() => setAttributions((a) => ({ ...a, [c]: false }))}
                        data-testid={`attr-witness-${c}`}
                      >
                        “a witness”
                      </button>
                      <button
                        className={'border-2 px-2 py-0.5 cursor-pointer ' + (attributions[c] === true ? 'border-amber bg-amber/30 font-bold' : 'border-ink/30')}
                        onClick={() => setAttributions((a) => ({ ...a, [c]: true }))}
                        data-testid={`attr-named-${c}`}
                      >
                        name them
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={doPublish}
                disabled={!headlineId || !kickerId || pending.some((c) => attributions[c] === undefined)}
                data-testid="paper-publish"
                className={
                  'w-full py-3 border-4 font-bold text-lg tracking-widest uppercase ' +
                  (headlineId && kickerId && pending.every((c) => attributions[c] !== undefined)
                    ? 'border-ink bg-amber cursor-pointer hover:brightness-110'
                    : 'border-ink/20 opacity-40 cursor-not-allowed')
                }
              >
                🗞 Put the page to bed
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
