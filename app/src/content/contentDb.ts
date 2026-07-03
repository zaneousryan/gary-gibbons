// ContentDB — Zod-validated, immutable at boot (tech spec §3). buildContentDB
// is pure: it takes {relativePath -> parsed json} and returns the typed DB, so
// the Vite loader, the validator, and the headless autoplayer all share it.

import { z } from 'zod';
import { CharacterSchema, type Character } from './schemas/character';
import { LocationSchema, type LocationDef } from './schemas/location';
import { DialogueSchema, type Dialogue } from './schemas/dialogue';
import { CardSchema, type Card } from './schemas/card';
import { DeductionsFileSchema, type DeductionsFile } from './schemas/deductions';
import { GameFileSchema, type GameFile } from './schemas/game';
import { SchedulesFileSchema, type SchedulesFile } from './schemas/schedule';
import { EditionSchema, type Edition } from './schemas/edition';
import {
  AchievementsFileSchema,
  BarksFileSchema,
  HintsFileSchema,
  NotebookFileSchema,
  SidestorySchema,
  TimelineFileSchema,
  type AchievementsFile,
  type BarksFile,
  type HintsFile,
  type NotebookFile,
  type Sidestory,
  type TimelineFile,
} from './schemas/misc';

export interface ContentDB {
  game: GameFile;
  characters: Record<string, Character>;
  locations: Record<string, LocationDef>;
  dialogues: Record<string, Dialogue>;
  cards: Record<string, Card>;
  deductions: DeductionsFile;
  schedules: SchedulesFile;
  editions: Record<string, Edition>;
  sidestories: Record<string, Sidestory>;
  barks: Record<string, BarksFile>; // keyed by pool
  timeline: TimelineFile | null;
  hints: HintsFile;
  achievements: AchievementsFile;
  notebook: NotebookFile;
}

export interface ContentIssue {
  file: string;
  message: string;
}

export class ContentValidationError extends Error {
  constructor(public issues: ContentIssue[]) {
    super(
      `Content failed schema validation (${issues.length} issue${issues.length === 1 ? '' : 's'}):\n` +
        issues.map((i) => `  ${i.file}: ${i.message}`).join('\n'),
    );
    this.name = 'ContentValidationError';
  }
}

function fmtZod(err: z.ZodError): string {
  return err.issues
    .map((i) => `${i.path.length ? i.path.join('.') + ': ' : ''}${i.message}`)
    .join('; ');
}

/** Normalize windows/posix and strip any leading path up to and incl. "content/". */
export function contentRelPath(p: string): string {
  const norm = p.replace(/\\/g, '/');
  const idx = norm.lastIndexOf('content/');
  return idx >= 0 ? norm.slice(idx + 'content/'.length) : norm;
}

export function buildContentDB(files: Record<string, unknown>): ContentDB {
  const issues: ContentIssue[] = [];
  const db: ContentDB = {
    game: undefined as unknown as GameFile,
    characters: {},
    locations: {},
    dialogues: {},
    cards: {},
    deductions: { deductions: [], theories: [], contradictions: [] },
    schedules: {},
    editions: {},
    sidestories: {},
    barks: {},
    timeline: null,
    hints: { gates: {} },
    achievements: { achievements: [] },
    notebook: { entries: [], questions: [] },
  };

  const put = <T extends { id: string }>(
    map: Record<string, T>,
    parsed: T,
    file: string,
    family: string,
  ) => {
    if (map[parsed.id]) {
      issues.push({ file, message: `duplicate ${family} id "${parsed.id}"` });
    }
    map[parsed.id] = parsed;
  };

  for (const [rawPath, json] of Object.entries(files)) {
    const file = contentRelPath(rawPath);
    try {
      if (file === 'game.json') {
        db.game = GameFileSchema.parse(json);
      } else if (file.startsWith('characters/')) {
        put(db.characters, CharacterSchema.parse(json), file, 'character');
      } else if (file.startsWith('locations/')) {
        put(db.locations, LocationSchema.parse(json), file, 'location');
      } else if (file.startsWith('dialogue/')) {
        put(db.dialogues, DialogueSchema.parse(json), file, 'dialogue');
      } else if (file.startsWith('cards/')) {
        put(db.cards, CardSchema.parse(json), file, 'card');
      } else if (file === 'deductions.json') {
        db.deductions = DeductionsFileSchema.parse(json);
      } else if (file === 'schedules.json') {
        db.schedules = SchedulesFileSchema.parse(json);
      } else if (file.startsWith('editions/')) {
        put(db.editions, EditionSchema.parse(json), file, 'edition');
      } else if (file.startsWith('sidestories/')) {
        put(db.sidestories, SidestorySchema.parse(json), file, 'sidestory');
      } else if (file.startsWith('barks/')) {
        const parsed = BarksFileSchema.parse(json);
        if (db.barks[parsed.pool]) {
          issues.push({ file, message: `duplicate bark pool "${parsed.pool}"` });
        }
        db.barks[parsed.pool] = parsed;
      } else if (file === 'timeline.json') {
        db.timeline = TimelineFileSchema.parse(json);
      } else if (file === 'hints.json') {
        db.hints = HintsFileSchema.parse(json);
      } else if (file === 'notebook.json') {
        db.notebook = NotebookFileSchema.parse(json);
      } else if (file === 'achievements.json') {
        db.achievements = AchievementsFileSchema.parse(json);
      } else {
        issues.push({ file, message: 'unrecognized content path — no schema family matches' });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        issues.push({ file, message: fmtZod(err) });
      } else {
        issues.push({ file, message: String(err) });
      }
    }
  }

  if (!db.game) {
    issues.push({ file: 'game.json', message: 'missing — game.json is required' });
  }
  if (issues.length > 0) {
    throw new ContentValidationError(issues);
  }
  return Object.freeze(db);
}
