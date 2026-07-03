// Core engine types — the persisted GameState shape (tech spec §4.1) and the
// branded content-ID aliases used across engine, systems, and content accessors.

export type Day = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Phase = 'morning' | 'midday' | 'evening' | 'night';
export type Weather = 'clear' | 'rain';

export type FlagId = string;
export type CardId = string;
export type CharacterId = string;
export type LocationId = string;
export type DialogueId = string;
export type DeductionId = string;
export type PathId = string;
export type BarkId = string;

export type FlagValue = boolean | number | string;

export type CardStatus = 'unverified' | 'verified' | 'offrecord';

export interface CardState {
  status: CardStatus;
  /** Which Discovery Web path fired first (III.21). */
  discoveredVia: PathId;
  /** Powers re-read lines (III.27). */
  readCount: number;
}

export interface PinPlacement {
  cardId: CardId;
  x: number;
  y: number;
}

export interface StringConnection {
  from: CardId;
  to: CardId;
  kind: 'red' | 'gold' | 'green';
}

export interface BoardState {
  pins: PinPlacement[];
  strings: StringConnection[];
  /** Deductions unlocked so far. */
  deductions: DeductionId[];
  /** Timeline Rail: slotId -> cardId seated there (II.16.1). */
  rail: Record<string, CardId>;
  /** Suspect Ledger: `${suspect}.${col}` -> cardId (II.16.2). */
  ledger: Record<string, CardId>;
  /** Suspect rows stamped CLEARED. */
  cleared: CharacterId[];
  /** Theory cards stamped DIDN'T HOLD (II.16.3). */
  retiredTheories: string[];
  /** Contradictions found on the desk (II.16.4). */
  contradictionsFound: string[];
}

export interface NotebookEntry {
  id: string;
  day: Day;
  phase: Phase;
  tab: 'people' | 'places' | 'questions' | 'grapes';
  /** Torn out and pinned to the board (III.26). */
  tornOut: boolean;
}

export interface NotebookState {
  entries: NotebookEntry[];
  /** Open question card ids. */
  questions: string[];
  /** Morning Pages picks for the current day (III.26). */
  morningQuestions: string[];
  doodles: string[];
}

export interface PublishedEdition {
  day: Day;
  headlineId: string;
  tone: 'sensational' | 'measured' | 'compassionate' | 'hold';
  kickerId: string;
  /** Card ids that ran in the article. */
  ran: CardId[];
  /** Attribution choices made (III.23.2): cardId -> named? */
  attributions: Record<CardId, boolean>;
}

export interface GameState {
  version: number;
  day: Day;
  phase: Phase;
  location: LocationId;
  flags: Record<FlagId, FlagValue>;
  cards: Record<CardId, CardState>;
  board: BoardState;
  notebook: NotebookState;
  /** -3..+3 per NPC; surfaced only through greetings (III.23.3). */
  trust: Record<CharacterId, number>;
  editions: PublishedEdition[];
  weather: Weather;
  rngSeed: number;
  /** Photo mode (II.12.3): subjects captured; prints appear at the apartment the next night. */
  photos: { id: string; day: Day; printed: boolean }[];
  collectibles: {
    lanterns: string[];
    doodles: string[];
    clippings: string[];
    grapesDeclined: number;
  };
  ngPlus: boolean;
  meta: { playtimeSec: number; savedAt: string };
}

export const GAME_STATE_VERSION = 2;

export function initialBoardState(): BoardState {
  return {
    pins: [],
    strings: [],
    deductions: [],
    rail: {},
    ledger: {},
    cleared: [],
    retiredTheories: [],
    contradictionsFound: [],
  };
}

export function initialNotebookState(): NotebookState {
  return { entries: [], questions: [], morningQuestions: [], doodles: [] };
}

export function initialGameState(startLocation: LocationId, seed = 1): GameState {
  return {
    version: GAME_STATE_VERSION,
    day: 1,
    phase: 'morning',
    location: startLocation,
    flags: {},
    cards: {},
    board: initialBoardState(),
    notebook: initialNotebookState(),
    trust: {},
    editions: [],
    weather: 'clear',
    rngSeed: seed,
    photos: [],
    collectibles: { lanterns: [], doodles: [], clippings: [], grapesDeclined: 0 },
    ngPlus: false,
    meta: { playtimeSec: 0, savedAt: '' },
  };
}
