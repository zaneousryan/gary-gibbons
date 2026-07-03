// Condition DSL evaluator (tech spec §4.2). One grammar for ALL content.
// Empty condition = always true. The validator type-checks referenced IDs;
// the evaluator only answers true/false against the current state.

import type { CardStatus, Day, GameState, Phase, Weather } from './types';

export interface NumCmp {
  gte?: number;
  lte?: number;
  gt?: number;
  lt?: number;
  eq?: number;
}

export type Condition =
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition }
  | { flag: string; value?: boolean | number | string }
  | { card: string; status?: CardStatus | 'any' }
  | { day: Day | NumCmp }
  | { phase: Phase | Phase[] }
  | { trust: { char: string } & NumCmp }
  | { weather: Weather }
  | { deduction: string }
  | { collectible: { lanterns?: number; doodles?: number; clippings?: number } }
  | Record<string, never>; // {} = always true

function cmp(value: number, c: NumCmp): boolean {
  if (c.gte !== undefined && !(value >= c.gte)) return false;
  if (c.lte !== undefined && !(value <= c.lte)) return false;
  if (c.gt !== undefined && !(value > c.gt)) return false;
  if (c.lt !== undefined && !(value < c.lt)) return false;
  if (c.eq !== undefined && value !== c.eq) return false;
  return true;
}

export function evalCondition(cond: Condition | undefined | null, state: GameState): boolean {
  if (!cond) return true;
  const keys = Object.keys(cond);
  if (keys.length === 0) return true;

  if ('all' in cond && Array.isArray(cond.all)) {
    return cond.all.every((c) => evalCondition(c, state));
  }
  if ('any' in cond && Array.isArray(cond.any)) {
    return cond.any.some((c) => evalCondition(c, state));
  }
  if ('not' in cond && cond.not !== undefined) {
    return !evalCondition(cond.not as Condition, state);
  }
  if ('flag' in cond && typeof cond.flag === 'string') {
    const v = state.flags[cond.flag];
    if ('value' in cond && cond.value !== undefined) return v === cond.value;
    return v !== undefined && v !== false;
  }
  if ('card' in cond && typeof cond.card === 'string') {
    const c = state.cards[cond.card];
    if (!c) return false;
    const wanted = cond.status ?? 'any';
    return wanted === 'any' ? true : c.status === wanted;
  }
  if ('day' in cond && cond.day !== undefined) {
    const d = cond.day;
    return typeof d === 'number' ? state.day === d : cmp(state.day, d);
  }
  if ('phase' in cond && cond.phase !== undefined) {
    const p = cond.phase;
    return Array.isArray(p) ? p.includes(state.phase) : state.phase === p;
  }
  if ('trust' in cond && cond.trust !== undefined) {
    const t = state.trust[cond.trust.char] ?? 0;
    return cmp(t, cond.trust);
  }
  if ('weather' in cond && cond.weather !== undefined) {
    return state.weather === cond.weather;
  }
  if ('deduction' in cond && typeof cond.deduction === 'string') {
    return state.board.deductions.includes(cond.deduction);
  }
  if ('collectible' in cond && cond.collectible !== undefined) {
    const c = cond.collectible;
    if (c.lanterns !== undefined && state.collectibles.lanterns.length < c.lanterns) return false;
    if (c.doodles !== undefined && state.collectibles.doodles.length < c.doodles) return false;
    if (c.clippings !== undefined && state.collectibles.clippings.length < c.clippings) return false;
    return true;
  }

  throw new Error(`Unknown condition shape: ${JSON.stringify(cond)}`);
}

/** Walk a condition tree and report every content ID it references — the validator's hook. */
export interface ConditionRefs {
  flags: string[];
  cards: string[];
  chars: string[];
  deductions: string[];
}

export function collectConditionRefs(cond: Condition | undefined | null, out?: ConditionRefs): ConditionRefs {
  const refs = out ?? { flags: [], cards: [], chars: [], deductions: [] };
  if (!cond) return refs;
  if ('all' in cond && Array.isArray(cond.all)) cond.all.forEach((c) => collectConditionRefs(c, refs));
  if ('any' in cond && Array.isArray(cond.any)) cond.any.forEach((c) => collectConditionRefs(c, refs));
  if ('not' in cond && cond.not !== undefined) collectConditionRefs(cond.not as Condition, refs);
  if ('flag' in cond && typeof cond.flag === 'string') refs.flags.push(cond.flag);
  if ('card' in cond && typeof cond.card === 'string') refs.cards.push(cond.card);
  if ('trust' in cond && cond.trust !== undefined) refs.chars.push(cond.trust.char);
  if ('deduction' in cond && typeof cond.deduction === 'string') refs.deductions.push(cond.deduction);
  return refs;
}
