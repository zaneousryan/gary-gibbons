// Content-graph analysis shared by the validator: which cards/flags/deductions
// are obtainable, from which sources, by which day. Static fixed-point
// reachability — the dynamic guarantee is the autoplayer's job; this catches
// structural impossibilities (a card no effect ever grants, a gate deduction
// whose inputs can't exist by its day).

import type { ContentDB } from '../../app/src/content/contentDb';
import type { ConditionShape } from '../../app/src/content/schemas/common';
import { PUZZLE_RESOLVE_EFFECTS } from '../../app/src/systems/puzzles';

export interface GrantSource {
  file: string;
  where: string;
  /** Earliest day this source can fire (1 if unconstrained). */
  earliestDay: number;
  /** True if the source sits on a guaranteed path (core dialogue/scene, not optional). */
  guaranteed: boolean;
  cond?: ConditionShape;
  offRecord: boolean;
}

export interface EffectSite {
  file: string;
  where: string;
  cond?: ConditionShape;
  offRecord: boolean;
  effects: Record<string, unknown>[];
}

/** Minimum day implied by a condition ({"day":{"gte":3}} -> 3). */
export function condMinDay(cond: ConditionShape | undefined): number {
  if (!cond) return 1;
  let min = 1;
  if (cond.day !== undefined) {
    if (typeof cond.day === 'number') min = Math.max(min, cond.day);
    else if (cond.day.gte !== undefined) min = Math.max(min, cond.day.gte);
    else if (cond.day.gt !== undefined) min = Math.max(min, cond.day.gt + 1);
    else if (cond.day.eq !== undefined) min = Math.max(min, cond.day.eq);
  }
  if (cond.all) for (const c of cond.all) min = Math.max(min, condMinDay(c));
  // any/not deliberately don't tighten the bound
  return min;
}

/** Every effect list in the DB, with provenance. */
export function collectEffectSites(db: ContentDB): EffectSite[] {
  const sites: EffectSite[] = [];
  const push = (
    file: string,
    where: string,
    effects: unknown,
    cond?: ConditionShape,
    offRecord = false,
  ) => {
    if (Array.isArray(effects) && effects.length > 0) {
      sites.push({ file, where, cond, offRecord, effects: effects as Record<string, unknown>[] });
    }
  };

  for (const dlg of Object.values(db.dialogues)) {
    const file = `dialogue/${dlg.id}.dlg.json`;
    for (const [nodeId, node] of Object.entries(dlg.nodes)) {
      push(file, `node ${nodeId}`, node.effects, undefined, node.offRecord ?? false);
      if (node.stances) {
        for (const [stance, opt] of Object.entries(node.stances)) {
          if (opt) push(file, `node ${nodeId}.${stance}`, opt.effects, opt.cond, node.offRecord ?? false);
        }
      }
      if (node.choices) {
        node.choices.forEach((c, i) =>
          push(file, `node ${nodeId}.choice[${i}]`, c.effects, c.cond, node.offRecord ?? false),
        );
      }
    }
  }
  const pushPuzzle = (file: string, where: string, opens: string, cond?: ConditionShape) => {
    const puzzleId = opens.startsWith('puzzle:') ? opens.slice('puzzle:'.length) : opens;
    const effects = PUZZLE_RESOLVE_EFFECTS[puzzleId];
    if (effects) {
      sites.push({ file, where: `${where} -> puzzle ${puzzleId}`, cond, offRecord: false, effects: effects as unknown as Record<string, unknown>[] });
    }
  };

  for (const loc of Object.values(db.locations)) {
    const file = `locations/${loc.id}.json`;
    for (const h of loc.hotspots) {
      for (const it of h.interactions) {
        push(file, `hotspot ${h.id}.${it.id}`, it.effects, mergeCond(h.cond, it.cond));
        if (it.opens) pushPuzzle(file, `hotspot ${h.id}.${it.id}`, it.opens, mergeCond(h.cond, it.cond));
      }
      if (h.detail?.card) {
        // chekhov details grant their card implicitly
        sites.push({
          file,
          where: `hotspot ${h.id}.detail`,
          cond: mergeCond(h.cond, h.detail.cond),
          offRecord: false,
          effects: [{ giveCard: h.detail.card }],
        });
      }
    }
  }
  for (const loc of Object.values(db.locations)) {
    const file = `locations/${loc.id}.json`;
    for (const t of loc.triggers) {
      push(file, `trigger ${t.id}`, t.effects, t.cond);
    }
  }
  for (const ss of Object.values(db.sidestories)) {
    const file = `sidestories/${ss.id}.json`;
    ss.steps.forEach((s) => push(file, `step ${s.id}`, s.effects, s.cond));
  }
  for (const ed of Object.values(db.editions)) {
    const file = `editions/${ed.id}.json`;
    ed.headlines.forEach((h) => push(file, `headline ${h.id}`, h.effects, h.cond));
    ed.kickers.forEach((k) => push(file, `kicker ${k.id}`, k.effects, k.cond));
  }
  for (const ded of db.deductions.deductions) {
    if (ded.produces.card) {
      sites.push({
        file: 'deductions.json',
        where: `deduction ${ded.id}`,
        cond: undefined,
        offRecord: false,
        // unlockDeduction grants produced cards verified (board.ts)
        effects: [{ giveCard: ded.produces.card, status: 'verified' }],
      });
    }
  }

  // openPuzzle effects anywhere (dialogue nodes, triggers, …) grant that
  // puzzle's registered resolve effects
  for (const site of [...sites]) {
    for (const e of site.effects) {
      if (typeof e.openPuzzle === 'string') {
        pushPuzzle(site.file, site.where, e.openPuzzle, site.cond);
      }
    }
  }
  return sites;
}

export function mergeCond(a?: ConditionShape, b?: ConditionShape): ConditionShape | undefined {
  if (!a) return b;
  if (!b) return a;
  return { all: [a, b] };
}

export interface Reachability {
  /** cardId -> grant sites */
  cardSources: Map<string, GrantSource[]>;
  /** flagId -> set sites */
  flagSources: Map<string, GrantSource[]>;
  /** cards granted verified somewhere or carrying at least one verifyRoute */
  verifiableCards: Set<string>;
}

export function analyzeReachability(db: ContentDB): Reachability {
  const cardSources = new Map<string, GrantSource[]>();
  const flagSources = new Map<string, GrantSource[]>();
  const verifiableCards = new Set<string>();

  const add = (map: Map<string, GrantSource[]>, id: string, src: GrantSource) => {
    const arr = map.get(id) ?? [];
    arr.push(src);
    map.set(id, arr);
  };

  for (const site of collectEffectSites(db)) {
    const day = condMinDay(site.cond);
    for (const e of site.effects) {
      const src: GrantSource = {
        file: site.file,
        where: site.where,
        earliestDay: day,
        guaranteed: true, // refined in Phase 2 when optional-path tagging lands
        cond: site.cond,
        offRecord: site.offRecord,
      };
      if (typeof e.giveCard === 'string') {
        add(cardSources, e.giveCard, { ...src, offRecord: site.offRecord });
        if (e.status === 'verified') verifiableCards.add(e.giveCard);
      }
      if (typeof e.verify === 'string') verifiableCards.add(e.verify);
      if (typeof e.setFlag === 'string') add(flagSources, e.setFlag, src);
      if (typeof e.startSidestory === 'string') {
        add(flagSources, `sidestory_${e.startSidestory}_started`, src);
      }
      if (typeof e.unlockDialogue === 'string') {
        add(flagSources, `dlg_unlocked_${e.unlockDialogue}`, src);
      }
      if (typeof e.trustFloor === 'object' && e.trustFloor !== null) {
        const tf = e.trustFloor as { char: string };
        add(flagSources, `trust_floor_${tf.char}`, src);
      }
    }
  }

  for (const card of Object.values(db.cards)) {
    if (card.verifyRoutes.length > 0) verifiableCards.add(card.id);
  }

  return { cardSources, flagSources, verifiableCards };
}
