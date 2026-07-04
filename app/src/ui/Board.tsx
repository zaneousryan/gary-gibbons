// The Investigation Board (tech spec §6.2, design doc I.6 / II.16).
// Phase 2 scope: PinCanvas (free placement, drag), Strings (select ≤3, tie),
// SuspectLedger, TheoryRack, ContradictionDesk, TimelineRail seating.
// Night-6 rail cinematic and zoom/pan polish arrive in Phase 5.

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ContentDB } from '@content/contentDb';
import { useGameStore } from '@engine/store';
import {
  connectCards,
  layOnDesk,
  ledgerRowComplete,
  movePin,
  pendingDeductions,
  pinCard,
  retireTheory,
  seatRailCard,
  stampCleared,
  checkTheoryRetirements,
} from '@systems/board';
import { useUiStore } from './uiStore';
import { useSettings } from './settingsStore';

/** Bark text from the board_tutorial pool — content stays in /content. */
function tutLine(db: ContentDB, id: string): string {
  return db.barks['board_tutorial']?.barks.find((b) => b.id === id)?.text ?? '';
}

/**
 * Night 1 board tutorial (playtest revision 2, 2026-07-04): first board open
 * ever, Gary teaches the loop in his own voice — pin → string → click — driven
 * by the Red Pen Bandit. Skippable at every step. Action steps advance by
 * watching real state, so the player performs the cycle, not a simulation.
 */
function BoardTutorial({ db }: { db: ContentDB }) {
  const state = useGameStore((s) => s.state);
  const [step, setStep] = useState(0);

  const havePens = !!state.cards['dots_missing_pens'];
  const haveNotebook = !!state.cards['milos_crimes_notebook'];
  const pensPinned = state.board.pins.some((p) => p.cardId === 'dots_missing_pens');
  const notebookPinned = state.board.pins.some((p) => p.cardId === 'milos_crimes_notebook');
  const redPenSolved = state.board.deductions.includes('red_pen_bandit');

  // if the tutorial cards aren't in hand (shouldn't happen on the golden
  // path), teach the model in words only rather than blocking the night
  const wordsOnly = !havePens || !haveNotebook;

  const steps: { bark: string; waitFor?: boolean; testid: string }[] = wordsOnly
    ? [
        { bark: 'tut_sit', testid: 'tut-sit' },
        { bark: 'tut_string', testid: 'tut-string' },
        { bark: 'tut_questions', testid: 'tut-questions' },
      ]
    : [
        { bark: 'tut_sit', testid: 'tut-sit' },
        { bark: 'tut_pin', waitFor: pensPinned, testid: 'tut-pin' },
        { bark: 'tut_pin2', waitFor: notebookPinned, testid: 'tut-pin2' },
        { bark: 'tut_string', waitFor: redPenSolved, testid: 'tut-string' },
        { bark: 'tut_click', testid: 'tut-click' },
        { bark: 'tut_questions', testid: 'tut-questions' },
      ];

  const current = steps[Math.min(step, steps.length - 1)];
  const isAction = current.waitFor !== undefined;

  // action steps advance themselves the moment the player does the thing
  useEffect(() => {
    if (isAction && current.waitFor) setStep((s) => s + 1);
  }, [isAction, current.waitFor]);

  const finish = (skipped: boolean) => {
    const game = useGameStore.getState();
    game.runEffects([{ setFlag: 'board_tutorial_done' }]);
    if (skipped) game.runEffects([{ playBark: 'tut_skip_ack' }]);
  };

  const last = step >= steps.length - 1;

  return (
    <div
      className="absolute top-2 left-1/2 -translate-x-1/2 z-10 w-[min(680px,80%)] bg-cream border-4 border-ink rounded-lg shadow-2xl p-3 rotate-[-0.5deg]"
      data-testid="board-tutorial"
    >
      <div className="text-[10px] tracking-[0.3em] font-bold text-ink/50 uppercase">Grandpa's board — first night</div>
      <p className="text-ink italic leading-snug mt-1" data-testid={current.testid}>
        {tutLine(db, current.bark)}
      </p>
      <div className="flex items-center gap-2 mt-2">
        {!isAction &&
          (last ? (
            <button
              className="px-3 py-1 rounded border-2 border-ink bg-amber font-bold text-ink text-sm cursor-pointer"
              data-testid="tut-done"
              onClick={() => finish(false)}
            >
              got it
            </button>
          ) : (
            <button
              className="px-3 py-1 rounded border-2 border-ink bg-amber font-bold text-ink text-sm cursor-pointer"
              data-testid="tut-next"
              onClick={() => setStep((s) => s + 1)}
            >
              →
            </button>
          ))}
        {isAction && <span className="text-ink/50 text-xs italic">(go on — the board's right there)</span>}
        <div className="flex-1" />
        <button
          className="px-2 py-1 rounded border border-ink/40 text-ink/60 text-xs cursor-pointer hover:text-ink"
          data-testid="tut-skip"
          onClick={() => finish(true)}
        >
          I know the drill
        </button>
      </div>
    </div>
  );
}

const CORK_W = 1280;
const CORK_H = 640;

type SideTab = 'ledger' | 'theories' | 'desk' | 'rail';

export default function Board({ db }: { db: ContentDB }) {
  const open = useUiStore((s) => s.boardOpen);
  const toggle = useUiStore((s) => s.toggleBoard);
  const showToast = useUiStore((s) => s.showToast);
  const colorblind = useSettings((s) => s.colorblindStrings);
  const state = useGameStore((s) => s.state);
  const [selected, setSelected] = useState<string[]>([]);
  const [tab, setTab] = useState<SideTab>('ledger');
  const [deskSlots, setDeskSlots] = useState<(string | null)[]>([null, null]);
  const [railPick, setRailPick] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [stripHint, setStripHint] = useState(false);
  const corkRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ cardId: string; dx: number; dy: number } | null>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pinned = new Set(state.board.pins.map((p) => p.cardId));
  const trayCards = Object.keys(state.cards).filter((c) => !pinned.has(c));
  const game = useGameStore((s) => s.game);
  const gateIds = game?.days.find((d) => d.day === state.day)?.gateDeductions ?? [];
  const openQuestions = pendingDeductions(db, gateIds);
  const tutorialActive = !state.flags['board_tutorial_done'];
  const suspects = useMemo(
    () => [...new Set(db.deductions.deductions.flatMap((d) => (d.produces.ledgerCell ? [d.produces.ledgerCell.suspect] : [])))],
    [db],
  );
  const eventCards = Object.keys(state.cards).filter((c) => db.cards[c]?.type === 'event');
  const seatedCards = new Set(Object.values(state.board.rail));

  if (!open) return null;

  const cardTitle = (id: string) => db.cards[id]?.title ?? id;
  const cardStatus = (id: string) => state.cards[id]?.status ?? 'unverified';

  const toggleSelect = (cardId: string) => {
    setSelected((sel) =>
      sel.includes(cardId) ? sel.filter((s) => s !== cardId) : sel.length < 3 ? [...sel, cardId] : sel,
    );
  };

  const tieString = () => {
    if (selected.length < 2) return;
    const result = connectCards(db, selected);
    setSelected([]);
    switch (result.kind) {
      case 'deduction': {
        const title = result.deduction.produces.card
          ? cardTitle(result.deduction.produces.card)
          : result.deduction.id;
        setFlash(title);
        setTimeout(() => setFlash(null), 2600);
        break;
      }
      case 'refused-offrecord':
        showToast('The string refuses. Across the card, in Gary’s hand: “promised.”');
        break;
      case 'refused-unverified':
        showToast(`“${cardTitle(result.card)}” is still unverified — confirm it before it can hold a deduction.`);
        break;
      case 'duplicate':
        showToast('Those two are already tied.');
        break;
      case 'miss':
        // the wrong-pair bark speaks for itself — but Gary glances at the
        // Open Questions strip so the player knows where to reorient
        setStripHint(true);
        if (hintTimer.current) clearTimeout(hintTimer.current);
        hintTimer.current = setTimeout(() => setStripHint(false), 4500);
        break;
    }
  };

  const onCorkPointerDown = (e: React.PointerEvent, cardId: string) => {
    const pin = state.board.pins.find((p) => p.cardId === cardId);
    const rect = corkRef.current!.getBoundingClientRect();
    if (!pin) return;
    dragRef.current = {
      cardId,
      dx: e.clientX - rect.left - (pin.x / CORK_W) * rect.width,
      dy: e.clientY - rect.top - (pin.y / CORK_H) * rect.height,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onCorkPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const rect = corkRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left - drag.dx) / rect.width) * CORK_W;
    const y = ((e.clientY - rect.top - drag.dy) / rect.height) * CORK_H;
    movePin(drag.cardId, Math.max(20, Math.min(CORK_W - 20, x)), Math.max(20, Math.min(CORK_H - 40, y)));
  };

  const onCorkPointerUp = () => {
    dragRef.current = null;
  };

  const pinFromTray = (cardId: string) => {
    const n = state.board.pins.length;
    pinCard(cardId, 160 + (n % 5) * 230, 180 + Math.floor(n / 5) * 160);
  };

  const layCard = (slot: number, cardId: string | null) => {
    setDeskSlots((s) => {
      const next = [...s] as (string | null)[];
      next[slot] = cardId;
      return next;
    });
  };

  const compareDesk = () => {
    const [a, b] = deskSlots;
    if (!a || !b) return;
    const result = layOnDesk(db, a, b);
    if (result.kind === 'contradiction') {
      showToast('“These two can’t both be the whole truth.” A question card is born.');
      setDeskSlots([null, null]);
    } else {
      showToast('They overlap fine. No contradiction here.');
    }
  };

  const retirable = new Set(checkTheoryRetirements(db));

  return (
    <div className="absolute inset-0 bg-ink/70 flex items-center justify-center pointer-events-auto z-40" data-testid="board">
      <div className="relative w-[min(1500px,97vw)] h-[min(860px,95vh)] bg-[#8a6a48] border-4 border-ink rounded-lg shadow-2xl flex flex-col p-3 gap-2">
        {tutorialActive && <BoardTutorial db={db} />}
        <div className="flex items-center gap-3 text-cream">
          <h2 className="font-bold text-2xl tracking-wide">THE BOARD</h2>
          <span className="opacity-70 text-sm">
            {selected.length > 0 ? `${selected.length} card(s) held — tie a string or click to release` : 'click pins to hold cards; drag to rearrange'}
          </span>
          <div className="flex-1" />
          <button
            onClick={tieString}
            disabled={selected.length < 2}
            data-testid="board-tie"
            className={
              'px-4 py-1.5 rounded border-2 font-bold ' +
              (selected.length >= 2
                ? 'bg-amber text-ink border-ink cursor-pointer hover:brightness-110'
                : 'bg-ink/30 text-cream/40 border-cream/20 cursor-not-allowed')
            }
          >
            🧵 Tie string
          </button>
          <button onClick={toggle} data-testid="board-close" className="px-3 py-1.5 rounded border-2 border-cream/50 text-cream cursor-pointer hover:bg-ink/40">
            ✕
          </button>
        </div>

        <div className="flex gap-2 flex-1 min-h-0">
          {/* cork */}
          <div
            ref={corkRef}
            data-testid="board-cork"
            className="relative flex-1 rounded border-2 border-ink overflow-hidden select-none"
            style={{ background: 'repeating-conic-gradient(#b28c5c 0% 25%, #a5825a 0% 50%) 0 0/28px 28px' }}
            onPointerMove={onCorkPointerMove}
            onPointerUp={onCorkPointerUp}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${CORK_W} ${CORK_H}`} preserveAspectRatio="none">
              {state.board.strings.map((st, i) => {
                const a = state.board.pins.find((p) => p.cardId === st.from);
                const b = state.board.pins.find((p) => p.cardId === st.to);
                if (!a || !b) return null;
                const midX = (a.x + b.x) / 2;
                const midY = (a.y + b.y) / 2 + (st.kind === 'red' ? 34 : 0); // red sags, gold is taut
                const color = st.kind === 'gold' ? '#e8a34c' : st.kind === 'green' ? '#4f6b3d' : '#b23a2c';
                // never color alone (ALETHEIA §7): distinct dash per kind when
                // colorblind patterns are on, plus a mid-string glyph
                const dash = colorblind
                  ? st.kind === 'gold'
                    ? undefined
                    : st.kind === 'green'
                      ? '2 8'
                      : '10 6'
                  : st.kind === 'green'
                    ? '8 6'
                    : undefined;
                return (
                  <g key={i}>
                    <path
                      d={`M ${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`}
                      stroke={color}
                      strokeWidth={st.kind === 'gold' ? 4 : 3}
                      strokeDasharray={dash}
                      fill="none"
                    />
                    {colorblind && (
                      <text x={midX} y={midY - 6} textAnchor="middle" fontSize={20} fill={color} data-testid={`string-glyph-${st.kind}`}>
                        {st.kind === 'gold' ? '★' : st.kind === 'green' ? '❦' : '●'}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
            {state.board.pins.map((pin) => {
              const status = cardStatus(pin.cardId);
              const isSel = selected.includes(pin.cardId);
              return (
                <div
                  key={pin.cardId}
                  data-testid={`pin-${pin.cardId}`}
                  className={
                    'absolute w-[210px] -translate-x-1/2 -translate-y-1/2 rounded p-2 shadow-lg cursor-grab active:cursor-grabbing border-2 ' +
                    (isSel ? 'border-amber ring-4 ring-amber/60 ' : 'border-ink ') +
                    (status === 'offrecord' ? 'bg-plum/90 text-cream' : 'bg-cream text-ink')
                  }
                  style={{
                    left: `${(pin.x / CORK_W) * 100}%`,
                    top: `${(pin.y / CORK_H) * 100}%`,
                    transform: `translate(-50%,-50%) rotate(${((pin.x * 7 + pin.y * 13) % 5) - 2}deg)`,
                  }}
                  onPointerDown={(e) => onCorkPointerDown(e, pin.cardId)}
                  onClick={() => toggleSelect(pin.cardId)}
                >
                  <div className="absolute left-1/2 -top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-[#b23a2c] border border-ink" />
                  <div className="text-[13px] font-bold leading-tight">{cardTitle(pin.cardId)}</div>
                  <div className="text-[10px] uppercase tracking-wider mt-1 opacity-70">
                    {status === 'verified' ? '✓ confirmed — g.g.' : status === 'offrecord' ? 'promised' : 'unverified'}
                  </div>
                </div>
              );
            })}
            {flash && (
              <div className="absolute inset-0 flex items-center justify-center bg-amber/20 pointer-events-none" data-testid="deduction-flash">
                <div className="bg-cream border-4 border-amber rounded-lg px-8 py-5 shadow-2xl rotate-[-1deg]">
                  <div className="text-xs tracking-[0.3em] text-ink/60 font-bold">DEDUCTION</div>
                  <div className="text-2xl font-bold text-ink mt-1">{flash}</div>
                </div>
              </div>
            )}
          </div>

          {/* sidebar */}
          <div className="w-[330px] flex flex-col rounded border-2 border-ink bg-cream/95 min-h-0">
            <div className="flex border-b-2 border-ink/20">
              {(['ledger', 'theories', 'desk', 'rail'] as SideTab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  data-testid={`board-tab-${t}`}
                  className={
                    'flex-1 py-2 text-xs font-bold tracking-widest uppercase cursor-pointer ' +
                    (tab === t ? 'bg-amber text-ink' : 'text-ink/50 hover:text-ink')
                  }
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-3 text-ink text-sm space-y-3">
              {tab === 'ledger' && (
                <>
                  {suspects.length === 0 && <p className="italic opacity-50">No suspects on the ledger yet. Give it a day.</p>}
                  {suspects.map((suspect) => (
                    <div key={suspect} className="border border-ink/30 rounded p-2" data-testid={`ledger-row-${suspect}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{db.characters[suspect]?.name ?? suspect}</span>
                        {state.board.cleared.includes(suspect) ? (
                          <span className="text-ivy font-bold rotate-[-6deg] border-2 border-ivy rounded px-1 text-xs">CLEARED — G.G.</span>
                        ) : ledgerRowComplete(suspect) ? (
                          <button
                            className="text-xs border-2 border-ivy text-ivy rounded px-2 py-0.5 font-bold cursor-pointer hover:bg-ivy hover:text-cream"
                            onClick={() => stampCleared(db, suspect)}
                          >
                            stamp
                          </button>
                        ) : null}
                      </div>
                      <div className="flex gap-1 mt-1">
                        {(['motive', 'means', 'opportunity'] as const).map((col) => (
                          <div key={col} className={'flex-1 rounded border px-1 py-0.5 text-[10px] uppercase tracking-wide text-center ' + (state.board.ledger[`${suspect}.${col}`] ? 'bg-amber/50 border-ink font-bold' : 'border-ink/20 opacity-50')}>
                            {col}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
              {tab === 'theories' && (
                <>
                  {db.deductions.theories.length === 0 && <p className="italic opacity-50">Theories go up from Night 2.</p>}
                  {db.deductions.theories.map((t) => {
                    const retired = state.board.retiredTheories.includes(t.id);
                    return (
                      <div key={t.id} className={'border-2 rounded p-2 ' + (retired ? 'border-ink/20 opacity-50' : 'border-ink')} data-testid={`theory-${t.id}`}>
                        <div className="font-bold">{t.title}</div>
                        {retired ? (
                          <div className="text-[#b23a2c] font-bold text-xs mt-1 rotate-[-4deg] inline-block border-2 border-[#b23a2c] rounded px-1">DIDN'T HOLD</div>
                        ) : retirable.has(t.id) ? (
                          <button className="mt-1 text-xs border-2 border-[#b23a2c] text-[#b23a2c] rounded px-2 py-0.5 font-bold cursor-pointer hover:bg-[#b23a2c] hover:text-cream" onClick={() => retireTheory(db, t.id)}>
                            stamp: didn't hold
                          </button>
                        ) : (
                          <div className="text-xs opacity-50 mt-1">still standing</div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
              {tab === 'desk' && (
                <>
                  <p className="italic opacity-60">Lay two testimonies on the blotter. Overlapping claims will show themselves.</p>
                  {[0, 1].map((slot) => (
                    <div key={slot} className="border-2 border-dashed border-ink/40 rounded p-2 min-h-[52px]" data-testid={`desk-slot-${slot}`}>
                      {deskSlots[slot] ? (
                        <button className="text-left w-full cursor-pointer" onClick={() => layCard(slot, null)}>
                          <span className="font-bold text-xs">{cardTitle(deskSlots[slot]!)}</span>
                          <span className="opacity-50 text-[10px] block">click to remove</span>
                        </button>
                      ) : (
                        <div className="text-xs opacity-40">empty blotter slot</div>
                      )}
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-1">
                    {Object.keys(state.cards)
                      .filter((c) => db.cards[c]?.type === 'testimony')
                      .map((c) => (
                        <button key={c} className="text-[10px] border border-ink/40 rounded px-1.5 py-0.5 cursor-pointer hover:bg-amber/40" onClick={() => layCard(deskSlots[0] ? 1 : 0, c)}>
                          {cardTitle(c)}
                        </button>
                      ))}
                  </div>
                  <button
                    onClick={compareDesk}
                    disabled={!deskSlots[0] || !deskSlots[1]}
                    data-testid="desk-compare"
                    className={'w-full py-1.5 rounded border-2 font-bold ' + (deskSlots[0] && deskSlots[1] ? 'border-ink bg-amber cursor-pointer' : 'border-ink/20 opacity-40 cursor-not-allowed')}
                  >
                    compare
                  </button>
                </>
              )}
              {tab === 'rail' && (
                <>
                  {!db.timeline && <p className="italic opacity-50">The rail goes up when the week starts making sense.</p>}
                  {db.timeline && (
                    <>
                      <p className="italic opacity-60 text-xs">Pick an event card, then seat it where it belongs. Cards only seat when something anchors them.</p>
                      <div className="flex flex-wrap gap-1">
                        {eventCards.filter((c) => !seatedCards.has(c)).map((c) => (
                          <button
                            key={c}
                            className={'text-[10px] border rounded px-1.5 py-0.5 cursor-pointer ' + (railPick === c ? 'border-amber bg-amber/40 font-bold' : 'border-ink/40 hover:bg-amber/20')}
                            onClick={() => setRailPick(railPick === c ? null : c)}
                          >
                            {cardTitle(c)}
                          </button>
                        ))}
                      </div>
                      <div className="space-y-1">
                        {[...db.timeline.slots].sort((a, b) => a.order - b.order).map((slot) => (
                          <button
                            key={slot.id}
                            data-testid={`rail-slot-${slot.id}`}
                            className="w-full flex items-center gap-2 border border-ink/30 rounded px-2 py-1 text-left cursor-pointer hover:bg-amber/20"
                            onClick={() => {
                              if (!railPick) return;
                              const r = seatRailCard(db, railPick, slot.id);
                              if (r === 'seated' || r === 'complete') {
                                setRailPick(null);
                                if (r === 'complete') showToast('The rail is complete. The week holds together.');
                              } else if (r === 'no-anchor') {
                                showToast('It won’t seat — nothing anchors it to that night yet.');
                              } else if (r === 'occupied') {
                                showToast('That slot already holds a card.');
                              }
                            }}
                          >
                            <span className="text-[10px] font-bold uppercase tracking-wide w-20">{slot.label}</span>
                            <span className="text-xs flex-1">
                              {state.board.rail[slot.id] ? cardTitle(state.board.rail[slot.id]) : <span className="opacity-30">—</span>}
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Open Questions strip (playtest revision 2): index cards in Gary's
            hand — each pending recipe's question + silhouette slots. */}
        <div
          className={
            'h-[118px] rounded border-2 flex items-stretch gap-2 px-3 py-2 overflow-x-auto transition-colors ' +
            (stripHint ? 'border-amber bg-amber/20 animate-pulse' : 'border-ink bg-cream/90')
          }
          data-testid="open-questions"
        >
          {stripHint && (
            <div className="absolute -mt-8 text-cream bg-ink/90 rounded px-3 py-1 text-sm italic" data-testid="strip-glance">
              {tutLine(db, 'gary_glance_questions')}
            </div>
          )}
          {openQuestions.length === 0 && (
            <span className="text-ink/40 italic text-sm self-center">
              No open questions on the desk. Either the night is done, or tomorrow will bring new ones.
            </span>
          )}
          {openQuestions.map((pq) => (
            <div
              key={pq.id}
              data-testid={`open-q-${pq.id}`}
              className={
                'shrink-0 w-[230px] rounded border-2 p-2 rotate-[-0.6deg] flex flex-col justify-between ' +
                (pq.gate ? 'border-amber bg-cream shadow-[0_0_8px_rgba(232,163,76,0.5)]' : 'border-ink/50 bg-cream')
              }
            >
              <div className="text-[12px] italic leading-tight text-ink">
                {pq.gate && <span className="not-italic font-bold text-amber-700 mr-1" title="tonight's page needs this">★</span>}
                {pq.question}
              </div>
              <div className="flex gap-1.5 mt-1">
                {pq.slots.map((slot, i) => (
                  <div
                    key={i}
                    data-testid={`open-q-slot-${slot}`}
                    title={slot === 'empty' ? 'still missing a piece' : slot === 'unverified' ? 'in pencil — needs verifying' : 'ready'}
                    className={
                      'w-8 h-10 rounded-sm border-2 ' +
                      (slot === 'ready'
                        ? 'border-ink bg-amber/70'
                        : slot === 'unverified'
                          ? 'border-ink/60 border-dashed bg-cream [background-image:repeating-linear-gradient(45deg,transparent,transparent_3px,rgba(30,34,42,0.15)_3px,rgba(30,34,42,0.15)_5px)]'
                          : 'border-ink/25 border-dashed bg-ink/5')
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* evidence tray */}
        <div className="h-[92px] rounded border-2 border-ink bg-ink/30 flex items-center gap-2 px-3 overflow-x-auto" data-testid="board-tray">
          {trayCards.length === 0 && <span className="text-cream/50 italic text-sm">Every card you hold is on the board.</span>}
          {trayCards.map((c) => (
            <button
              key={c}
              data-testid={`tray-${c}`}
              onClick={() => pinFromTray(c)}
              className={
                'shrink-0 w-[170px] rounded border-2 border-ink p-1.5 text-left cursor-pointer hover:-translate-y-1 transition ' +
                (cardStatus(c) === 'offrecord' ? 'bg-plum text-cream' : 'bg-cream text-ink')
              }
            >
              <div className="text-[11px] font-bold leading-tight">{cardTitle(c)}</div>
              <div className="text-[9px] uppercase tracking-wider opacity-60">pin to board</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
