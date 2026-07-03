// Browser-side content loader: Vite eagerly imports every JSON under /content
// at build time; buildContentDB validates and freezes it.

import { buildContentDB, type ContentDB } from './contentDb';

let db: ContentDB | null = null;

export function loadContent(): ContentDB {
  if (db) return db;
  const modules = import.meta.glob('../../../content/**/*.json', {
    eager: true,
    import: 'default',
  }) as Record<string, unknown>;
  db = buildContentDB(modules);
  return db;
}

export function getContent(): ContentDB {
  if (!db) throw new Error('Content not loaded — call loadContent() at boot.');
  return db;
}
