// EventBus — the one-way rule's messenger (tech spec §3). Systems mutate only
// GameStore and talk to each other through these events.

export type GameEventType =
  | 'flag:set'
  | 'flag:cleared'
  | 'card:gained'
  | 'card:verified'
  | 'card:offrecord'
  | 'deduction:unlocked'
  | 'phase:changed'
  | 'day:changed'
  | 'edition:published'
  | 'trust:changed'
  | 'dialogue:started'
  | 'dialogue:ended'
  | 'dialogue:unlocked'
  | 'notebook:entry'
  | 'notebook:question'
  | 'notebook:doodle'
  | 'bark:play'
  | 'sidestory:started'
  | 'location:changed'
  | 'location:goto'
  | 'phase:advance'
  | 'collectible:gained'
  | 'grape:declined'
  | 'save:written'
  | 'save:loaded'
  | 'puzzle:open'
  | 'puzzle:opened'
  | 'puzzle:resolved'
  | 'weather:changed';

export interface GameEvent {
  type: GameEventType;
  payload: Record<string, unknown>;
}

type Listener = (event: GameEvent) => void;

export class EventBus {
  private listeners = new Map<GameEventType | '*', Set<Listener>>();
  /** Ring buffer of recent events — dev menu + autoplayer assertions read this. */
  readonly history: GameEvent[] = [];
  private historyCap = 500;

  on(type: GameEventType | '*', fn: Listener): () => void {
    let set = this.listeners.get(type);
    if (!set) {
      set = new Set();
      this.listeners.set(type, set);
    }
    set.add(fn);
    return () => set.delete(fn);
  }

  emit(event: GameEvent): void {
    this.history.push(event);
    if (this.history.length > this.historyCap) this.history.shift();
    this.listeners.get(event.type)?.forEach((fn) => fn(event));
    this.listeners.get('*')?.forEach((fn) => fn(event));
  }

  emitAll(events: GameEvent[]): void {
    events.forEach((e) => this.emit(e));
  }
}

/** The game's single bus instance. Tests construct their own. */
export const bus = new EventBus();
