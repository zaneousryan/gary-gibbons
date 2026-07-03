// validate-content — the CI-blocking content graph validator (tech spec §11).
// Checks, in order:
//   1. Schema pass (Zod, via buildContentDB)
//   2. ID reference integrity (every referenced card/dialogue/location/character/
//      bark/deduction/edition exists)
//   3. Reachability: every deduction input card has at least one grant source,
//      and gate deductions' inputs are obtainable by their gate day
//   4. Off-record/finale rule: requireOnRecordForFinale deductions never depend
//      on a card obtainable ONLY off-record
//   5. Schedule reachability: every character with dialogue appears in ≥2
//      phases of each day they have scheduled presence (II.14.1)
//   6. ref presence on required-path content
//   7. Orphan flag/card report (warnings, non-blocking)
//
// Static analysis catches structural impossibilities; the dynamic guarantee
// (gates actually open when played) is `npm run autoplay`.

import { ContentValidationError } from '../app/src/content/contentDb';
import type { ContentDB } from '../app/src/content/contentDb';
import type { ConditionShape } from '../app/src/content/schemas/common';
import { loadContentDB } from './lib/nodeContent';
import { analyzeReachability, collectEffectSites, condMinDay } from './lib/graph';

interface Problem {
  level: 'error' | 'warn';
  where: string;
  message: string;
}

const problems: Problem[] = [];
const err = (where: string, message: string) => problems.push({ level: 'error', where, message });
const warn = (where: string, message: string) => problems.push({ level: 'warn', where, message });

function collectCondRefs(cond: ConditionShape | undefined, out: { flags: string[]; cards: string[]; chars: string[]; deductions: string[] }) {
  if (!cond) return out;
  if (cond.all) cond.all.forEach((c) => collectCondRefs(c, out));
  if (cond.any) cond.any.forEach((c) => collectCondRefs(c, out));
  if (cond.not) collectCondRefs(cond.not, out);
  if (cond.flag) out.flags.push(cond.flag);
  if (cond.card) out.cards.push(cond.card);
  if (cond.trust) out.chars.push(cond.trust.char);
  if (cond.deduction) out.deductions.push(cond.deduction);
  return out;
}

function main() {
  console.log('validate-content — Gary Gibbons content graph validator\n');

  // ---- 1. schema pass ----
  let db: ContentDB;
  try {
    db = loadContentDB();
  } catch (e) {
    if (e instanceof ContentValidationError) {
      console.error('SCHEMA FAIL:\n' + e.message);
    } else {
      console.error('SCHEMA FAIL:\n' + String(e));
    }
    process.exit(1);
  }
  console.log(
    `  schema ok: ${Object.keys(db.characters).length} characters, ${Object.keys(db.locations).length} locations, ` +
      `${Object.keys(db.dialogues).length} dialogues, ${Object.keys(db.cards).length} cards, ` +
      `${db.deductions.deductions.length} deductions, ${Object.keys(db.editions).length} editions, ` +
      `${Object.keys(db.sidestories).length} sidestories, ${Object.keys(db.barks).length} bark pools`,
  );

  const barkIds = new Set<string>();
  for (const pool of Object.values(db.barks)) pool.barks.forEach((b) => barkIds.add(b.id));

  const reach = analyzeReachability(db);
  const sites = collectEffectSites(db);

  // ---- 2. ID reference integrity ----
  const checkCard = (id: string, where: string) => {
    if (!db.cards[id]) err(where, `references unknown card "${id}"`);
  };
  const checkChar = (id: string, where: string) => {
    if (!db.characters[id]) err(where, `references unknown character "${id}"`);
  };
  const checkLoc = (id: string, where: string) => {
    if (!db.locations[id]) err(where, `references unknown location "${id}"`);
  };
  const checkBark = (id: string, where: string) => {
    if (!barkIds.has(id)) err(where, `references unknown bark "${id}"`);
  };
  const checkDeduction = (id: string, where: string) => {
    if (!db.deductions.deductions.some((d) => d.id === id)) err(where, `references unknown deduction "${id}"`);
  };
  const checkDialogue = (id: string, where: string) => {
    if (!db.dialogues[id]) err(where, `references unknown dialogue "${id}"`);
  };

  const referencedFlags = new Set<string>();
  const referencedCards = new Set<string>();

  const checkCond = (cond: ConditionShape | undefined, where: string) => {
    const refs = collectCondRefs(cond, { flags: [], cards: [], chars: [], deductions: [] });
    refs.cards.forEach((c) => {
      referencedCards.add(c);
      checkCard(c, where);
    });
    refs.chars.forEach((c) => checkChar(c, where));
    refs.deductions.forEach((d) => checkDeduction(d, where));
    refs.flags.forEach((f) => referencedFlags.add(f));
  };

  const notebookEntryIds = new Set(db.notebook.entries.map((n) => n.id));
  const notebookQuestionIds = new Set(db.notebook.questions.map((q) => q.id));

  const checkEffects = (effects: Record<string, unknown>[] | undefined, where: string) => {
    if (!effects) return;
    for (const e of effects) {
      if (e.notebook && typeof e.notebook === 'object') {
        const nb = e.notebook as { entry?: string; question?: string };
        if (nb.entry && !notebookEntryIds.has(nb.entry)) {
          err(where, `references unknown notebook entry "${nb.entry}" (define it in notebook.json)`);
        }
        if (nb.question && !notebookQuestionIds.has(nb.question)) {
          err(where, `references unknown notebook question "${nb.question}" (define it in notebook.json)`);
        }
      }
      if (typeof e.giveCard === 'string') checkCard(e.giveCard, where);
      if (typeof e.verify === 'string') checkCard(e.verify, where);
      if (typeof e.markOffRecord === 'string') checkCard(e.markOffRecord, where);
      if (typeof e.playBark === 'string') checkBark(e.playBark, where);
      if (typeof e.goTo === 'string') checkLoc(e.goTo, where);
      if (typeof e.unlockDialogue === 'string') checkDialogue(e.unlockDialogue, where);
      if (e.trust && typeof e.trust === 'object') checkChar((e.trust as { char: string }).char, where);
      if (e.trustFloor && typeof e.trustFloor === 'object') checkChar((e.trustFloor as { char: string }).char, where);
      if (typeof e.startSidestory === 'string' && !db.sidestories[e.startSidestory]) {
        err(where, `references unknown sidestory "${e.startSidestory}"`);
      }
      if (typeof e.setFlag === 'string') referencedFlags.add(e.setFlag);
    }
  };

  // walk every conditional/effectful surface
  for (const site of sites) {
    checkCond(site.cond, `${site.file} ${site.where}`);
    checkEffects(site.effects, `${site.file} ${site.where}`);
  }
  for (const dlg of Object.values(db.dialogues)) {
    const file = `dialogue/${dlg.id}`;
    // 'narrator' owns set-piece dialogues (scene triggers) — not a real character
    if (dlg.character !== 'narrator') checkChar(dlg.character, file);
    for (const entry of dlg.entries) {
      checkCond(entry.cond, `${file} entry ${entry.id}`);
      if (!dlg.nodes[entry.node]) err(`${file} entry ${entry.id}`, `points at missing node "${entry.node}"`);
    }
    for (const [nodeId, node] of Object.entries(dlg.nodes)) {
      const where = `${file} node ${nodeId}`;
      if (node.speaker !== 'gary' && node.speaker !== 'narrator') checkChar(node.speaker, where);
      const nexts: (string | null | undefined)[] = [node.next];
      if (node.stances) Object.values(node.stances).forEach((s) => s && nexts.push(s.next));
      if (node.choices) node.choices.forEach((c) => nexts.push(c.next));
      for (const n of nexts) {
        if (n && !dlg.nodes[n]) err(where, `next points at missing node "${n}"`);
      }
      if (node.stances) {
        Object.entries(node.stances).forEach(([k, s]) => s?.cond && checkCond(s.cond, `${where}.${k}`));
      }
      if (node.choices) node.choices.forEach((c, i) => checkCond(c.cond, `${where}.choice[${i}]`));
    }
  }
  for (const loc of Object.values(db.locations)) {
    const file = `locations/${loc.id}`;
    loc.exits.forEach((e) => checkLoc(e.to, `${file} exits`));
    for (const h of loc.hotspots) {
      const where = `${file} hotspot ${h.id}`;
      if (h.to) checkLoc(h.to, where);
      if (h.character) checkChar(h.character, where);
      checkCond(h.cond, where);
      if (h.detail?.card) checkCard(h.detail.card, `${where} detail`);
      h.interactions.forEach((it) => checkCond(it.cond, `${where}.${it.id}`));
    }
    loc.sitSpot?.monologues.forEach((m) => {
      checkCond(m.cond, `${file} sitSpot`);
      checkBark(m.bark, `${file} sitSpot`);
    });
    for (const t of loc.triggers) {
      checkCond(t.cond, `${file} trigger ${t.id}`);
      if (t.dialogue) checkDialogue(t.dialogue, `${file} trigger ${t.id}`);
      if (!t.dialogue && !t.effects) err(`${file} trigger ${t.id}`, 'trigger does nothing (no dialogue, no effects)');
    }
  }
  for (const card of Object.values(db.cards)) {
    const file = `cards/${card.id}`;
    if (card.source && !db.characters[card.source] && !db.locations[card.source]) {
      warn(file, `source "${card.source}" is neither a character nor a location`);
    }
    card.verifyRoutes.forEach((r) => checkCond(r.cond, `${file} verifyRoute ${r.id}`));
    card.reReadLines.forEach((r) => {
      checkCond(r.cond, `${file} reRead`);
      checkBark(r.bark, `${file} reRead`);
    });
    if (card.anchor) checkCond(card.anchor, `${file} anchor`);
    if (card.railSlot && db.timeline && !db.timeline.slots.some((s) => s.id === card.railSlot)) {
      err(file, `railSlot "${card.railSlot}" not in timeline.json`);
    }
  }
  if (db.timeline?.compositePair) {
    for (const c of db.timeline.compositePair) {
      checkCard(c, 'timeline.json compositePair');
      if (db.cards[c] && db.cards[c].type !== 'event') {
        err('timeline.json compositePair', `"${c}" must be an event card`);
      }
    }
    const [a, b] = db.timeline.compositePair;
    if (db.cards[a] && db.cards[b] && db.cards[a].railSlot !== db.cards[b].railSlot) {
      err('timeline.json compositePair', 'pair members must share a rail slot (III.22.5 — same minute, two vantages)');
    }
  }
  for (const ded of db.deductions.deductions) {
    const where = `deductions.json ${ded.id}`;
    ded.inputs.forEach((c) => {
      referencedCards.add(c);
      checkCard(c, where);
    });
    if (ded.produces.card) checkCard(ded.produces.card, where);
    if (ded.produces.ledgerCell) checkChar(ded.produces.ledgerCell.suspect, where);
    if (ded.garyLine) checkBark(ded.garyLine, where);
  }
  db.deductions.theories.forEach((t) => checkCond(t.retireWhen, `deductions.json theory ${t.id}`));
  db.deductions.contradictions.forEach((cx) => {
    cx.pair.forEach((c) => checkCard(c, `deductions.json contradiction ${cx.id}`));
  });
  for (const [charId, sched] of Object.entries(db.schedules)) {
    checkChar(charId, `schedules.json ${charId}`);
    for (const [dayKey, day] of Object.entries(sched)) {
      for (const [phase, placement] of Object.entries(day)) {
        if (placement) {
          checkLoc(placement.loc, `schedules.json ${charId}.${dayKey}.${phase}`);
          if (placement.ifRain) checkLoc(placement.ifRain, `schedules.json ${charId}.${dayKey}.${phase}.ifRain`);
        }
      }
    }
  }
  for (const ed of Object.values(db.editions)) {
    ed.draftCards.forEach((c) => checkCard(c, `editions/${ed.id}`));
  }
  for (const [gateId, hintList] of Object.entries(db.hints.gates)) {
    checkDeduction(gateId, `hints.json ${gateId}`);
    if (hintList.length < 1) err(`hints.json ${gateId}`, 'empty hint list');
  }
  db.game.days.forEach((d) => d.gateDeductions.forEach((g) => checkDeduction(g, `game.json day ${d.day}`)));
  db.achievements.achievements.forEach((a) => checkCond(a.cond, `achievements.json ${a.id}`));

  // ---- 3. reachability ----
  for (const ded of db.deductions.deductions) {
    for (const input of ded.inputs) {
      if (db.cards[input] && !reach.cardSources.has(input)) {
        err(`deductions.json ${ded.id}`, `input card "${input}" has NO grant source anywhere in content`);
      }
    }
  }
  for (const dayDef of db.game.days) {
    for (const gateId of dayDef.gateDeductions) {
      const ded = db.deductions.deductions.find((d) => d.id === gateId);
      if (!ded) continue;
      for (const input of ded.inputs) {
        const sources = reach.cardSources.get(input) ?? [];
        if (sources.length === 0) continue; // already reported above
        const earliest = Math.min(...sources.map((s) => s.earliestDay));
        if (earliest > dayDef.day) {
          err(
            `game.json day ${dayDef.day} gate ${gateId}`,
            `input card "${input}" is first obtainable day ${earliest} — after its gate day`,
          );
        }
      }
      if (ded.requireVerified) {
        for (const input of ded.inputs) {
          if (db.cards[input] && !reach.verifiableCards.has(input)) {
            err(
              `deductions.json ${gateId}`,
              `requireVerified but input "${input}" has no verify route and is never granted verified`,
            );
          }
        }
      }
    }
  }

  // ---- 4. off-record / finale rule ----
  // An off-record-only grant is fine IF the card carries a verifyRoute — that
  // route is the on-record corroboration path (III.23.1 know-it→prove-it).
  for (const ded of db.deductions.deductions.filter((d) => d.requireOnRecordForFinale)) {
    for (const input of ded.inputs) {
      const sources = reach.cardSources.get(input) ?? [];
      const hasRoute = (db.cards[input]?.verifyRoutes.length ?? 0) > 0;
      if (sources.length > 0 && sources.every((s) => s.offRecord) && !hasRoute) {
        err(
          `deductions.json ${ded.id}`,
          `finale deduction input "${input}" is obtainable ONLY off-record and has no corroboration route (III.23.1 violation)`,
        );
      }
    }
  }

  // ---- 5. schedule reachability (II.14.1) ----
  const talkableChars = new Set(
    Object.values(db.dialogues).map((d) => d.character).filter((c) => c !== 'narrator'),
  );
  for (const charId of talkableChars) {
    const sched = db.schedules[charId];
    if (!sched) {
      warn(`schedules.json`, `character "${charId}" has dialogue but no schedule (ok pre-Phase-1, gap after)`);
      continue;
    }
    for (const [dayKey, day] of Object.entries(sched)) {
      const present = Object.values(day).filter(Boolean).length;
      if (present < 2) {
        err(`schedules.json ${charId}.${dayKey}`, `reachable in only ${present} phase(s) — rule is ≥2 (II.14.1)`);
      }
    }
  }

  // ---- 6. ref presence (required-path traceability) ----
  for (const c of Object.values(db.characters)) if (!c.ref) err(`characters/${c.id}`, 'missing ref');
  for (const l of Object.values(db.locations)) if (!l.ref) err(`locations/${l.id}`, 'missing ref');
  for (const d of Object.values(db.dialogues)) if (!d.ref) err(`dialogue/${d.id}`, 'missing ref');
  for (const c of Object.values(db.cards)) if (!c.ref) err(`cards/${c.id}`, 'missing ref');
  for (const d of db.deductions.deductions) if (!d.ref) err(`deductions.json ${d.id}`, 'missing ref');

  // ---- 7. orphan report (warnings) ----
  for (const [flag, sources] of reach.flagSources) {
    if (!referencedFlags.has(flag) && !flag.startsWith('dlg_unlocked_') && !flag.startsWith('trust_floor_') && !flag.startsWith('sidestory_')) {
      warn(sources[0].file, `flag "${flag}" is set but never read`);
    }
  }
  for (const cardId of Object.keys(db.cards)) {
    const usedAsInput = db.deductions.deductions.some((d) => d.inputs.includes(cardId) || d.produces.card === cardId);
    const usedInCond = referencedCards.has(cardId);
    const usedInEdition = Object.values(db.editions).some((e) => e.draftCards.includes(cardId));
    const usedOnRail = !!db.cards[cardId].railSlot;
    if (!usedAsInput && !usedInCond && !usedInEdition && !usedOnRail) {
      warn(`cards/${cardId}`, 'card is granted but feeds nothing (no deduction, condition, edition, or rail)');
    }
  }

  // ---- report ----
  const errors = problems.filter((p) => p.level === 'error');
  const warnings = problems.filter((p) => p.level === 'warn');
  for (const w of warnings) console.log(`  WARN  ${w.where}: ${w.message}`);
  for (const e2 of errors) console.log(`  ERROR ${e2.where}: ${e2.message}`);
  console.log(`\n${errors.length} error(s), ${warnings.length} warning(s).`);
  if (errors.length > 0) {
    console.error('validate-content: FAIL');
    process.exit(1);
  }
  console.log('validate-content: PASS');
}

main();
