// Texture resolution with the placeholder rule (ALETHEIA.md §2.4): try the real
// asset, fall back to assets/_placeholders/<same path>. Missing art never
// blocks; a missing placeholder is a gen-placeholders bug and logs loudly.

import { Assets, Texture } from 'pixi.js';

const cache = new Map<string, Promise<Texture | null>>();

export function loadTexture(relPath: string): Promise<Texture | null> {
  let p = cache.get(relPath);
  if (!p) {
    p = (async () => {
      try {
        return await Assets.load<Texture>(`/${relPath}`);
      } catch {
        try {
          return await Assets.load<Texture>(`/_placeholders/${relPath}`);
        } catch {
          console.warn(`[assets] no texture or placeholder for ${relPath} — run npm run gen:placeholders`);
          return null;
        }
      }
    })();
    cache.set(relPath, p);
  }
  return p;
}

export const locationLayerPath = (locId: string, phase: string, layer: string) =>
  `locations/${locId}/${phase}_${layer}.png`;

export const spritePath = (portraitSet: string, pose: string) =>
  `characters/${portraitSet}/sprite_${pose}.png`;

export const portraitPath = (portraitSet: string, state: string) =>
  `characters/${portraitSet}/portrait_${state}.png`;
