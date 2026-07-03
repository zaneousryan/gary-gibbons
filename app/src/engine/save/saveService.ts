// SaveService (tech spec §4.5): GameState JSON via Tauri fs on desktop /
// localStorage on web dev. Autosave at every phase transition; manual save at
// the apartment. Storage backend is pluggable so the autoplayer and tests can
// run headless with an in-memory store.

import type { GameState } from '../types';
import { migrate } from './migrations';

export interface SaveStorage {
  read(slot: string): Promise<string | null>;
  write(slot: string, data: string): Promise<void>;
  list(): Promise<string[]>;
  remove(slot: string): Promise<void>;
}

export class MemoryStorage implements SaveStorage {
  private map = new Map<string, string>();
  async read(slot: string) {
    return this.map.get(slot) ?? null;
  }
  async write(slot: string, data: string) {
    this.map.set(slot, data);
  }
  async list() {
    return [...this.map.keys()];
  }
  async remove(slot: string) {
    this.map.delete(slot);
  }
}

const LS_PREFIX = 'gg_save_';

export class LocalStorageStorage implements SaveStorage {
  async read(slot: string) {
    return globalThis.localStorage.getItem(LS_PREFIX + slot);
  }
  async write(slot: string, data: string) {
    globalThis.localStorage.setItem(LS_PREFIX + slot, data);
  }
  async list() {
    const out: string[] = [];
    for (let i = 0; i < globalThis.localStorage.length; i++) {
      const key = globalThis.localStorage.key(i);
      if (key?.startsWith(LS_PREFIX)) out.push(key.slice(LS_PREFIX.length));
    }
    return out;
  }
  async remove(slot: string) {
    globalThis.localStorage.removeItem(LS_PREFIX + slot);
  }
}

/**
 * Tauri desktop storage: saves as JSON files under $APPDATA/saves via the fs
 * plugin. The plugin modules are dynamic imports so the web build never pulls
 * them; defaultStorage() only selects this backend inside a Tauri window.
 */
export class TauriFsStorage implements SaveStorage {
  private async fs() {
    // dynamic import: the web bundle only loads this inside a Tauri window
    return await import('@tauri-apps/plugin-fs');
  }

  private async ensureDir() {
    const fs = await this.fs();
    const opts = { baseDir: fs.BaseDirectory.AppData };
    if (!(await fs.exists('saves', opts))) await fs.mkdir('saves', opts);
    return { fs, opts };
  }

  async read(slot: string) {
    try {
      const { fs, opts } = await this.ensureDir();
      return await fs.readTextFile(`saves/${slot}.json`, opts);
    } catch {
      return null;
    }
  }

  async write(slot: string, data: string) {
    const { fs, opts } = await this.ensureDir();
    await fs.writeTextFile(`saves/${slot}.json`, data, opts);
  }

  async list() {
    const { fs, opts } = await this.ensureDir();
    const entries = await fs.readDir('saves', opts);
    return entries.filter((e) => e.name.endsWith('.json')).map((e) => e.name.slice(0, -'.json'.length));
  }

  async remove(slot: string) {
    const { fs, opts } = await this.ensureDir();
    await fs.remove(`saves/${slot}.json`, opts);
  }
}

function inTauri(): boolean {
  return typeof globalThis !== 'undefined' && '__TAURI_INTERNALS__' in globalThis;
}

export class SaveService {
  constructor(private storage: SaveStorage) {}

  async save(slot: string, state: GameState): Promise<void> {
    const stamped: GameState = {
      ...state,
      meta: { ...state.meta, savedAt: new Date().toISOString() },
    };
    await this.storage.write(slot, JSON.stringify(stamped));
  }

  async load(slot: string): Promise<GameState | null> {
    const raw = await this.storage.read(slot);
    if (raw === null) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return migrate(parsed);
  }

  async listSlots(): Promise<string[]> {
    return this.storage.list();
  }

  async delete(slot: string): Promise<void> {
    return this.storage.remove(slot);
  }
}

export function defaultStorage(): SaveStorage {
  if (inTauri()) return new TauriFsStorage();
  if (typeof globalThis.localStorage !== 'undefined') return new LocalStorageStorage();
  return new MemoryStorage();
}
