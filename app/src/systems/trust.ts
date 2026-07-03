// Trust surfaces ONLY through greetings and line variants (III.23.3) —
// never a number, never a meter (Cut List §29).

import type { ContentDB } from '@content/contentDb';
import { useGameStore } from '@engine/store';

export type TrustTier = 'cold' | 'neutral' | 'warm';

export function trustTier(charId: string): TrustTier {
  const t = useGameStore.getState().state.trust[charId] ?? 0;
  if (t <= -1) return 'cold';
  if (t >= 2) return 'warm';
  return 'neutral';
}

export function greetingFor(db: ContentDB, charId: string): string | null {
  const ch = db.characters[charId];
  if (!ch) return null;
  return ch.greetings[trustTier(charId)] ?? null;
}
