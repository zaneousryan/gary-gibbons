// EditionSystem (tech spec §6.5, design doc II.15.1): the nightly Evening
// Edition. Draft auto-assembles from VERIFIED, ON-RECORD cards only (Dot's
// law: "We print what we know, Gibbons, not what we suspect"). Two player
// choices: headline (tone axis) and kicker. Attribution sub-step when a
// protectable card is in the draft — plain choice, zero ceremony (III.23.2).

import type { ContentDB } from '@content/contentDb';
import type { Edition } from '@content/schemas/edition';
import { evalCondition, type Condition } from '@engine/conditions';
import type { Effect } from '@engine/effects';
import type { Day } from '@engine/types';
import { useGameStore } from '@engine/store';
import { bus } from '@engine/eventBus';

export function editionForToday(db: ContentDB): Edition | null {
  const state = useGameStore.getState().state;
  const dayDef = db.game.days.find((d) => d.day === state.day);
  if (!dayDef?.edition) return null;
  return db.editions[dayDef.edition] ?? null;
}

export function alreadyPublishedToday(): boolean {
  const state = useGameStore.getState().state;
  return state.editions.some((e) => e.day === state.day);
}

/** Dot's law: only verified, on-record cards make the draft. */
export function assembleDraft(_db: ContentDB, edition: Edition): string[] {
  const state = useGameStore.getState().state;
  return edition.draftCards.filter((c) => state.cards[c]?.status === 'verified');
}

/** Protectable cards in the draft that still need the attribution choice (III.23.2). */
export function pendingAttributions(db: ContentDB, draft: string[]): string[] {
  const state = useGameStore.getState().state;
  return draft.filter((c) => {
    const def = db.cards[c];
    return def?.attribution?.protectable && state.flags[def.attribution.namedFlag] === undefined;
  });
}

export function availableHeadlines(edition: Edition) {
  const state = useGameStore.getState().state;
  return edition.headlines.filter((h) => evalCondition((h.cond ?? {}) as Condition, state));
}

export function availableKickers(edition: Edition) {
  const state = useGameStore.getState().state;
  return edition.kickers.filter((k) => evalCondition((k.cond ?? {}) as Condition, state));
}

export interface PublishChoice {
  headlineId: string;
  kickerId: string;
  /** cardId -> named (true) or "a witness" (false). Required for every pending attribution. */
  attributions?: Record<string, boolean>;
}

export function publishEdition(db: ContentDB, choice: PublishChoice): boolean {
  const edition = editionForToday(db);
  if (!edition || alreadyPublishedToday()) return false;
  const game = useGameStore.getState();
  const state = game.state;

  const headline = edition.headlines.find((h) => h.id === choice.headlineId);
  const kicker = edition.kickers.find((k) => k.id === choice.kickerId);
  if (!headline || !kicker) return false;
  if (!evalCondition((headline.cond ?? {}) as Condition, state)) return false;

  const draft = assembleDraft(db, edition);
  const pending = pendingAttributions(db, draft);
  for (const cardId of pending) {
    if (choice.attributions?.[cardId] === undefined) return false; // choice not made
  }

  // attribution flags — the game just remembers (III.23.2)
  const effects: Effect[] = [];
  for (const [cardId, named] of Object.entries(choice.attributions ?? {})) {
    const flag = db.cards[cardId]?.attribution?.namedFlag;
    if (flag) effects.push({ setFlag: flag, value: named });
  }
  if (headline.effects) effects.push(...(headline.effects as Effect[]));
  if (kicker.effects) effects.push(...(kicker.effects as Effect[]));
  if (headline.reactions?.rumorSeed) {
    effects.push({ setFlag: `rumor_${headline.reactions.rumorSeed}` });
  }
  effects.push({ setFlag: `printed_${headline.tone}_d${state.day}` });

  useGameStore.setState((s) => {
    s.state.editions.push({
      day: s.state.day as Day,
      headlineId: headline.id,
      tone: headline.tone,
      kickerId: kicker.id,
      ran: draft,
      attributions: choice.attributions ?? {},
    });
  });
  game.runEffects(effects);
  bus.emit({
    type: 'edition:published',
    payload: { day: state.day, headline: headline.id, tone: headline.tone },
  });
  return true;
}
