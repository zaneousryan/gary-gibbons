// Placeholder app icon for the Tauri bundle (art bible: amber lantern on ink).
// Emits a 256×256 PNG and wraps it as a modern PNG-payload .ico. Replaced by
// real art the same way as every other placeholder — drop a real icon.ico in
// src-tauri/icons/.

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { encodePng } from './lib/png';

const SIZE = 256;
const px = new Uint8Array(SIZE * SIZE * 4);

function put(x: number, y: number, r: number, g: number, b: number, a = 255) {
  if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return;
  const i = (y * SIZE + x) * 4;
  px[i] = r;
  px[i + 1] = g;
  px[i + 2] = b;
  px[i + 3] = a;
}

// ink rounded square
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const rx = Math.min(x, SIZE - 1 - x);
    const ry = Math.min(y, SIZE - 1 - y);
    if (rx + ry < 24) continue; // knock the corners off
    put(x, y, 30, 34, 42);
  }
}
// amber lantern glow (radial)
const cx = 128;
const cy = 118;
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const d = Math.hypot(x - cx, y - cy);
    if (d < 58) {
      const t = 1 - d / 58;
      const i = (y * SIZE + x) * 4;
      if (px[i + 3] === 0) continue;
      px[i] = Math.min(255, px[i] + 220 * t);
      px[i + 1] = Math.min(255, px[i + 1] + 150 * t);
      px[i + 2] = Math.min(255, px[i + 2] + 40 * t);
    }
  }
}
// lantern body: frame + cap
for (let y = 78; y <= 160; y++) {
  for (const x of [104, 152]) for (let w = 0; w < 5; w++) put(x + w, y, 46, 36, 24);
}
for (let y = 78; y <= 83; y++) for (let x = 104; x <= 156; x++) put(x, y, 46, 36, 24);
for (let y = 156; y <= 160; y++) for (let x = 104; x <= 156; x++) put(x, y, 46, 36, 24);
for (let y = 64; y <= 78; y++) for (let x = 124 - (y - 64); x <= 132 + (y - 64); x++) put(x, y, 46, 36, 24);
// ivy strands
for (let t = 0; t < 200; t++) {
  const yy = 92 + t * 0.4;
  put(Math.round(96 + Math.sin(t / 9) * 7), Math.round(yy), 79, 107, 61);
  put(Math.round(163 + Math.sin(t / 9 + 2) * 7), Math.round(yy), 79, 107, 61);
}
// three wax drips (the seal's signature)
for (const [dx, len] of [
  [116, 18],
  [128, 26],
  [140, 14],
] as const) {
  for (let y = 176; y < 176 + len; y++) for (let w = 0; w < 6; w++) put(dx + w, y, 79, 107, 61);
}

const png = encodePng({ width: SIZE, height: SIZE, data: px } as Parameters<typeof encodePng>[0]);

// PNG-payload ICO: ICONDIR (6) + ICONDIRENTRY (16) + png bytes
const ico = Buffer.alloc(6 + 16 + png.length);
ico.writeUInt16LE(0, 0); // reserved
ico.writeUInt16LE(1, 2); // type: icon
ico.writeUInt16LE(1, 4); // count
ico.writeUInt8(0, 6); // width 256 -> 0
ico.writeUInt8(0, 7); // height 256 -> 0
ico.writeUInt8(0, 8); // palette
ico.writeUInt8(0, 9); // reserved
ico.writeUInt16LE(1, 10); // planes
ico.writeUInt16LE(32, 12); // bpp
ico.writeUInt32LE(png.length, 14); // bytes
ico.writeUInt32LE(22, 18); // offset
Buffer.from(png).copy(ico, 22);

const dir = path.resolve('src-tauri', 'icons');
mkdirSync(dir, { recursive: true });
const icoPath = path.join(dir, 'icon.ico');
const pngPath = path.join(dir, 'icon.png');
if (existsSync(icoPath)) {
  console.log('icon.ico already exists (real art?) — not overwriting');
} else {
  writeFileSync(icoPath, ico);
  writeFileSync(pngPath, Buffer.from(png));
  console.log(`wrote ${icoPath} (${ico.length} bytes) + icon.png`);
}
