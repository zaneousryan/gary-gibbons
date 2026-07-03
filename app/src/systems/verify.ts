// VerificationSystem (tech spec §6.4): watches flags/cards; when any of a
// card's verifyRoutes passes, the card upgrades to VERIFIED with the
// CONFIRMED — G.G. stamp toast. Exposes whyUnverified(cardId) for UI.
// "Detectives accuse. Reporters verify." (II.11)

import type { ContentDB } from '@content/contentDb';
import { evalCondition, type Condition } from '@engine/conditions';
import { useGameStore } from '@engine/store';
import { bus } from '@engine/eventBus';
import { useUiStore } from '@ui/uiStore';

/** Scan every owned unverified card; upgrade those whose routes now pass. */
export function sweepVerifications(db: ContentDB): string[] {
  const state = useGameStore.getState().state;
  const upgraded: string[] = [];
  for (const [cardId, cardState] of Object.entries(state.cards)) {
    if (cardState.status !== 'unverified') continue;
    const def = db.cards[cardId];
    if (!def || def.verifyRoutes.length === 0) continue;
    const route = def.verifyRoutes.find((r) => evalCondition(r.cond as Condition, state));
    if (route) {
      useGameStore.getState().runEffects([{ verify: cardId }]);
      upgraded.push(cardId);
      useGameStore.getState().runEffects([{ setFlag: `verified_via_${cardId}`, value: route.id }]);
    }
  }
  return upgraded;
}

/** UI copy: what would it take to verify this card? (§6.4) */
export function whyUnverified(db: ContentDB, cardId: string): string {
  const def = db.cards[cardId];
  if (!def) return 'Unknown card.';
  if (def.verifyRoutes.length === 0) {
    return 'No route yet — needs a document, a witness, or your own eyes.';
  }
  const hints = def.verifyRoutes.map((r) => r.hint).filter(Boolean);
  return hints.length > 0 ? hints.join(' — or — ') : 'Needs: a document, a witness, or your own eyes.';
}

export function installVerificationWatcher(db: ContentDB): () => void {
  const sweep = () => {
    const upgraded = sweepVerifications(db);
    for (const cardId of upgraded) {
      const title = db.cards[cardId]?.title ?? cardId;
      useUiStore.getState().showToast(`✓ CONFIRMED — G.G. · ${title}`);
      // the *thock* itself plays via audio.ts on card:verified
    }
  };
  const un1 = bus.on('flag:set', sweep);
  const un2 = bus.on('card:gained', sweep);
  const un3 = bus.on('phase:changed', sweep);
  const un4 = bus.on('deduction:unlocked', sweep);
  return () => {
    un1();
    un2();
    un3();
    un4();
  };
}
