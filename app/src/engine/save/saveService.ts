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

// STUB(phase-7): TauriFsStorage lands with Tauri packaging; the interface is
// already the contract, so nothing upstream changes.

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
  if (typeof globalThis.localStorage !== 'undefined') return new LocalStorageStorage();
  return new MemoryStorage();
}
