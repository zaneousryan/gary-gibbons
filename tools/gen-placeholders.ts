// gen-placeholders — generates labeled placeholder art for EVERY asset key the
// content references (spec §10: "missing art never blocks"). Output mirrors the
// real asset paths under assets/_placeholders/; the engine falls back there
// when the real file is absent. Colors come from the art bible master palette
// so even placeholders read lamplit, not programmer-grey.

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { Canvas, encodePng, type RGB } from './lib/png';
import { loadContentDB, ASSETS_DIR } from './lib/nodeContent';

const OUT = path.join(ASSETS_DIR, '_placeholders');

// Art bible §2.4 — the Lanternside Master Palette.
const AMBER: RGB = [232, 163, 76];
const TEAL: RGB = [51, 96, 93];
const PLUM: RGB = [110, 68, 104];
const CREAM: RGB = [244, 234, 211];
const IVY: RGB = [79, 107, 61];
const INK: RGB = [44, 38, 32];

const PHASE_TINT: Record<string, RGB> = {
  morning: [214, 196, 160],
  midday: [230, 214, 170],
  evening: [190, 140, 90],
  night: [60, 80, 84],
};

let written = 0;
let skipped = 0;
let preserved = 0;

// --force regenerates existing placeholder files; the default NEVER overwrites
// an existing file, so anything a human dropped in (even into _placeholders by
// mistake) survives. Lesson of 2026-07-06.
const FORCE = process.argv.includes('--force');

function save(relPath: string, canvas: Canvas) {
  const realAsset = path.join(ASSETS_DIR, relPath);
  const file = path.join(OUT, relPath);
  if (existsSync(realAsset)) {
    skipped++; // real art exists — placeholder unnecessary but generated anyway? No: skip.
    return;
  }
  if (existsSync(file) && !FORCE) {
    preserved++; // never clobber an existing file without --force
    return;
  }
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, encodePng(canvas));
  written++;
}

function label(c: Canvas, text: string, color: RGB, y?: number) {
  const scale = Math.max(2, Math.floor(c.width / (text.length * 8)));
  const w = Canvas.textWidth(text, scale);
  c.text(text, Math.floor((c.width - w) / 2), y ?? Math.floor(c.height / 2 - scale * 3.5), scale, color);
}

function portrait(charId: string, state: string, tint: RGB): Canvas {
  const c = new Canvas(800, 1000, CREAM);
  c.border(0, 0, 800, 1000, INK, 6);
  // silhouette: head + shoulders blob in the character's tint
  c.ellipse(400, 380, 190, 230, tint);
  c.rect(180, 580, 440, 420, tint);
  c.ellipse(400, 580, 220, 120, tint);
  label(c, charId, INK, 60);
  label(c, state, INK, 900);
  return c;
}

function sprite(charId: string, pose: string, tint: RGB): Canvas {
  const c = new Canvas(400, 600, [0, 0, 0, 0]);
  c.ellipse(200, 150, 80, 95, tint);
  c.rect(120, 240, 160, 320, tint);
  // talk frames get an open "mouth" notch so the two frames visibly differ
  if (pose.startsWith('talk')) c.ellipse(200, 180, 26, pose.endsWith('2') ? 20 : 8, CREAM);
  if (pose === 'idle_2') c.rect(120, 236, 160, 8, [0, 0, 0, 0]); // subtle bob
  label(c, charId, INK, 20);
  return c;
}

function locationLayer(locId: string, phase: string, layer: string, rain: boolean): Canvas {
  const base = PHASE_TINT[phase] ?? CREAM;
  const tint: RGB = rain ? [base[0] * 0.7, base[1] * 0.75, base[2] * 0.85].map(Math.round) as unknown as RGB : base;
  const c = new Canvas(2400, 1200, layer === 'bg' ? tint : [0, 0, 0, 0]);
  if (layer !== 'bg') {
    if (layer === 'mid') {
      c.rect(0, 800, 2400, 400, tint);
      // a few "building" blocks
      for (let i = 0; i < 5; i++) c.rect(120 + i * 470, 520, 320, 300, [tint[0] * 0.85, tint[1] * 0.85, tint[2] * 0.85].map(Math.round) as unknown as RGB);
    } else {
      c.rect(0, 1080, 2400, 120, [tint[0] * 0.7, tint[1] * 0.7, tint[2] * 0.7].map(Math.round) as unknown as RGB);
    }
  } else {
    // bg: sky band + distant skyline
    c.rect(0, 700, 2400, 500, [tint[0] * 0.9, tint[1] * 0.9, tint[2] * 0.95].map(Math.round) as unknown as RGB);
  }
  if (rain) {
    for (let i = 0; i < 400; i++) {
      const x = (i * 97) % 2400;
      const y = (i * 211) % 1200;
      c.rect(x, y, 2, 14, TEAL);
    }
  }
  if (layer === 'bg') {
    label(c, `${locId} ${phase}${rain ? ' rain' : ''}`, INK, 80);
  }
  return c;
}

function boardCard(cardId: string, accent: RGB): Canvas {
  const c = new Canvas(500, 350, CREAM);
  c.border(0, 0, 500, 350, INK, 4);
  c.border(10, 10, 480, 330, accent, 3);
  c.ellipse(250, 40, 12, 12, accent); // the pin
  label(c, cardId.slice(0, 20), INK);
  return c;
}

const CHAR_TINTS: RGB[] = [AMBER, TEAL, PLUM, IVY, [163, 92, 60], [96, 108, 128], [148, 120, 72]];
function tintFor(id: string): RGB {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return CHAR_TINTS[h % CHAR_TINTS.length];
}

function main() {
  const db = loadContentDB();
  const states = ['neutral', 'happy', 'worried', 'surprised', 'sad'];
  const poses = ['idle_1', 'idle_2', 'talk_1', 'talk_2'];

  for (const ch of Object.values(db.characters)) {
    const tint = tintFor(ch.id);
    for (const s of states) save(`characters/${ch.portraitSet}/portrait_${s}.png`, portrait(ch.id, s, tint));
    for (const p of poses) save(`characters/${ch.portraitSet}/sprite_${p}.png`, sprite(ch.id, p, tint));
  }

  const phases = ['morning', 'midday', 'evening', 'night'];
  for (const loc of Object.values(db.locations)) {
    for (const phase of phases) {
      for (const layer of loc.layers) {
        save(`locations/${loc.id}/${phase}_${layer}.png`, locationLayer(loc.id, phase, layer, false));
      }
    }
    if (loc.ambient?.weatherVariants) {
      for (const layer of loc.layers) {
        save(`locations/${loc.id}/rain_${layer}.png`, locationLayer(loc.id, 'midday', layer, true));
      }
    }
    // scene-composite overlays (art bible v1.2): transparent full-frame
    // states — the placeholder is a small labeled panel on an otherwise
    // clear frame, so a missing painting is visible but never blocking
    for (const ov of loc.overlays) {
      const c = new Canvas(2400, 1200, [0, 0, 0, 0] as unknown as RGB);
      c.rect(300, 760, 700, 340, TEAL);
      c.border(300, 760, 700, 340, INK, 6);
      c.text(`OVERLAY`, 330, 800, 6, CREAM);
      c.text(ov.id.toUpperCase().slice(0, 16), 330, 900, 5, CREAM);
      save(`locations/${loc.id}/overlay_${ov.id}.png`, c);
    }
  }

  for (const card of Object.values(db.cards)) {
    // sprite keys are full basenames per spec §5.4/§10: "card_{cardId}"
    const sprite = card.sprite ?? `card_${card.id}`;
    const accent = card.type === 'question' ? PLUM : card.type === 'deduction' ? AMBER : card.type === 'theory' ? TEAL : IVY;
    save(`board/${sprite}.png`, boardCard(card.id, accent));
  }

  // board furniture
  const cork = new Canvas(2048, 1280, [186, 140, 92]);
  for (let i = 0; i < 3000; i++) {
    const x = (i * 131) % 2048;
    const y = (i * 197) % 1280;
    cork.rect(x, y, 3, 3, [172, 128, 82]);
  }
  save('board/cork.png', cork);
  for (const [name, color] of [
    ['string_red', [178, 58, 44]],
    ['string_gold', AMBER],
    ['string_green', IVY],
  ] as [string, RGB][]) {
    const s = new Canvas(64, 8, [0, 0, 0, 0]);
    s.rect(0, 2, 64, 4, color);
    save(`board/${name}.png`, s);
  }
  for (const stamp of ['cleared', 'didnthold', 'confirmed']) {
    const s = new Canvas(300, 120, [0, 0, 0, 0]);
    s.border(0, 0, 300, 120, stamp === 'didnthold' ? ([178, 58, 44] as RGB) : IVY, 6);
    label(s, stamp, stamp === 'didnthold' ? ([178, 58, 44] as RGB) : IVY);
    save(`board/stamps_${stamp}.png`, s);
  }

  // notebook & newspaper grounds
  const paper = new Canvas(1600, 1200, CREAM);
  for (let y = 120; y < 1200; y += 56) paper.rect(80, y, 1440, 2, [206, 196, 172]);
  save('notebook/paper.png', paper);
  const masthead = new Canvas(1600, 220, CREAM);
  masthead.border(0, 0, 1600, 220, INK, 6);
  label(masthead, 'THE LANTERNSIDE LEDGER', INK);
  save('newspaper/masthead.png', masthead);
  const texture = new Canvas(1600, 2000, CREAM);
  save('newspaper/paper_texture.png', texture);

  console.log(
    `gen-placeholders: ${written} placeholder(s) written, ${skipped} skipped (real asset exists), ${preserved} preserved (existing file, no --force).`,
  );
}

main();
