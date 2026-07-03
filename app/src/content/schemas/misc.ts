// Remaining content families: timeline.json (§5.6), sidestories/*.json (§5.9),
// barks/*.json (§5.10), hints.json (§5.11), achievements.json (§13).

import { z } from 'zod';
import { ConditionSchema, DaySchema, EffectsSchema, IdSchema, RefSchema } from './common';

// ---- timeline.json (§5.6) ----
export const RailSlotSchema = z
  .object({
    id: IdSchema,
    label: z.string(),
    /** Order along the rail, NIGHT−5 → CEREMONY. */
    order: z.number().int(),
  })
  .strict();

export const TimelineFileSchema = z
  .object({
    slots: z.array(RailSlotSchema).min(2),
    /** The composite overlay pair (III.22.5). */
    compositePair: z.tuple([IdSchema, IdSchema]).optional(),
    /** Cinematic key played when the final card seats (II.16.1). */
    completionCinematic: IdSchema.optional(),
    ref: RefSchema,
  })
  .strict();

// ---- sidestories/*.json (§5.9) ----
export const SidestoryStepSchema = z
  .object({
    id: IdSchema,
    cond: ConditionSchema.optional(),
    effects: EffectsSchema.optional(),
    /** Journal copy for the step. */
    text: z.string().optional(),
  })
  .strict();

export const SidestorySchema = z
  .object({
    id: IdSchema,
    ref: RefSchema,
    title: z.string(),
    days: z.array(DaySchema).min(1),
    steps: z.array(SidestoryStepSchema).min(1),
    /** Completion floors this NPC's trust at warm (III.23.3). */
    trustFloor: z.object({ char: IdSchema, min: z.number().int() }).strict().optional(),
    /** Filed as a mini-edition on completion (II.17). */
    miniEdition: IdSchema.optional(),
  })
  .strict();

// ---- barks/*.json (§5.10) ----
export const BarkSchema = z
  .object({
    id: IdSchema,
    text: z.string(),
    speaker: IdSchema.optional(),
    cond: ConditionSchema.optional(),
    /** Vignette selection tags (II.14.4). */
    tags: z.array(IdSchema).default([]),
    weather: z.enum(['clear', 'rain']).optional(),
    authored: z.enum(['verbatim', 'aletheia']).optional(),
    ref: RefSchema.optional(),
  })
  .strict();

export const BarksFileSchema = z
  .object({
    /** Pool key, e.g. "wrong_pairs", "vignettes", "rhymes", "rumors". */
    pool: IdSchema,
    barks: z.array(BarkSchema),
  })
  .strict();

// ---- hints.json (§5.11) ----
export const HintsFileSchema = z
  .object({
    /** Per stuck gate: ordered Ask-Grandpa lines. Name a node, never a pair (II.6). */
    gates: z.record(
      IdSchema,
      z.array(z.object({ text: z.string(), ref: RefSchema.optional() }).strict()).min(1),
    ),
  })
  .strict();

// ---- notebook.json (spec §6.3 — auto-journal entry texts) ----
export const NotebookEntryDefSchema = z
  .object({
    id: IdSchema,
    tab: z.enum(['people', 'places', 'questions', 'grapes']),
    text: z.string(),
    /** Title line in Gary's hand. */
    title: z.string().optional(),
    authored: z.enum(['verbatim', 'aletheia']).optional(),
    ref: RefSchema,
  })
  .strict();

export const NotebookFileSchema = z
  .object({
    entries: z.array(NotebookEntryDefSchema),
    /** Question card texts (id -> prompt in Gary's handwriting). */
    questions: z.array(
      z.object({ id: IdSchema, text: z.string(), ref: RefSchema }).strict(),
    ).default([]),
  })
  .strict();

// ---- achievements.json (spec §13) ----
export const AchievementSchema = z
  .object({
    id: IdSchema,
    name: z.string(),
    description: z.string(),
    cond: ConditionSchema,
    hidden: z.boolean().default(false),
    ref: RefSchema.optional(),
  })
  .strict();

export const AchievementsFileSchema = z
  .object({ achievements: z.array(AchievementSchema) })
  .strict();

export type TimelineFile = z.infer<typeof TimelineFileSchema>;
export type NotebookFile = z.infer<typeof NotebookFileSchema>;
export type NotebookEntryDef = z.infer<typeof NotebookEntryDefSchema>;
export type Sidestory = z.infer<typeof SidestorySchema>;
export type BarksFile = z.infer<typeof BarksFileSchema>;
export type Bark = z.infer<typeof BarkSchema>;
export type HintsFile = z.infer<typeof HintsFileSchema>;
export type AchievementsFile = z.infer<typeof AchievementsFileSchema>;
