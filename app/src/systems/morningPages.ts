// Morning Pages (III.26): each day opens with Gary choosing Today's Three
// Questions from up to ~6 candidates (his open notebook questions). Picks set
// the day's vox-pop topic and prime PRIMED weights via morning_focus_* flags.
// Unchosen questions remain tomorrow. Soft planning, never a lockout.

import type { ContentDB } from '@content/contentDb';
import { evalCondition, type Condition } from '@engine/conditions';
import { useGameStore } from '@engine/store';
import { bus } from '@engine/eventBus';

export const MAX_CANDIDATES = 6;
export const MAX_PICKS = 3;

export function morningPagesDue(): boolean {
  const state = useGameStore.getState().state;
  // Day 1 opens scripted (the ordinary Thursday) — pages start Day 2.
  if (state.day < 2 || state.phase !== 'morning') return false;
  return !state.flags[`morning_pages_done_d${state.day}`];
}

export function morningCandidates(db: ContentDB): { id: string; text: string }[] {
  const state = useGameStore.getState().state;
  return state.notebook.questions
    .slice(0, MAX_CANDIDATES)
    .map((id) => ({ id, text: db.notebook.questions.find((q) => q.id === id)?.text ?? id }));
}

export function commitMorningPages(picks: string[]): boolean {
  const game = useGameStore.getState();
  const state = game.state;
  if (state.flags[`morning_pages_done_d${state.day}`]) return false;
  const chosen = picks.slice(0, MAX_PICKS);
  // clear yesterday's focus, set today's
  const effects = Object.keys(state.flags)
    .filter((f) => f.startsWith('morning_focus_'))
    .map((f) => ({ clearFlag: f }) as const);
  game.runEffects([
    ...effects,
    ...chosen.map((q) => ({ setFlag: `morning_focus_${q}` }) as const),
    { setFlag: `morning_pages_done_d${state.day}` },
  ]);
  useGameStore.setState((s) => {
    s.state.notebook.morningQuestions = chosen;
  });
  bus.emit({ type: 'flag:set', payload: { flag: 'morning_pages_committed', day: state.day, picks: chosen } });
  return true;
}

/** The vox-pop Question of the Day: first focused morning question (II.15.5). */
export function questionOfTheDay(db: ContentDB): { id: string; text: string } | null {
  const state = useGameStore.getState().state;
  const focused = state.notebook.morningQuestions[0];
  if (!focused || !state.flags[`morning_focus_${focused}`]) return null;
  return { id: focused, text: db.notebook.questions.find((q) => q.id === focused)?.text ?? focused };
}

/** A scheduled NPC's vox-pop answer for the current focus, if authored. */
export function voxPopLineFor(db: ContentDB, charId: string): string | null {
  const state = useGameStore.getState().state;
  const pool = db.barks['voxpop'];
  if (!pool) return null;
  const focus = state.notebook.morningQuestions;
  for (const bark of pool.barks) {
    if (bark.speaker !== charId) continue;
    const topicTag = bark.tags.find((t) => t.startsWith('q_'));
    if (topicTag && !focus.includes(topicTag)) continue;
    if (!evalCondition((bark.cond ?? {}) as Condition, state)) continue;
    return bark.text;
  }
  return null;
}
