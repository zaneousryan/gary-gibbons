// Node-side content reader shared by validate-content, autoplay, and
// gen-placeholders. Reads /content recursively into {relPath -> json} and
// hands it to the same buildContentDB the game uses.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildContentDB, type ContentDB } from '../../app/src/content/contentDb';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, '..', '..');
export const CONTENT_DIR = path.join(REPO_ROOT, 'content');
export const ASSETS_DIR = path.join(REPO_ROOT, 'assets');

export function readContentFiles(dir = CONTENT_DIR): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const walk = (d: string) => {
    for (const name of readdirSync(d)) {
      const full = path.join(d, name);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (name.endsWith('.json')) {
        const rel = path.relative(dir, full).replace(/\\/g, '/');
        try {
          out[rel] = JSON.parse(readFileSync(full, 'utf-8'));
        } catch (err) {
          throw new Error(`${rel}: invalid JSON — ${String(err)}`);
        }
      }
    }
  };
  walk(dir);
  return out;
}

export function loadContentDB(): ContentDB {
  return buildContentDB(readContentFiles());
}
