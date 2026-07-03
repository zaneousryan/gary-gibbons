// locations/*.json (tech spec §5.2)

import { z } from 'zod';
import { ConditionSchema, EffectsSchema, IdSchema, RefSchema, Vec2Schema } from './common';

export const HotspotKindSchema = z.enum(['examine', 'chekhov', 'talk', 'puzzle', 'exit', 'photo']);

export const InteractionSchema = z
  .object({
    id: IdSchema,
    cond: ConditionSchema.optional(),
    /** "puzzle:{puzzleId}" opens a puzzle module (spec §6.7). */
    opens: z.string().optional(),
    effects: EffectsSchema.optional(),
    /** Observe text shown in the examine panel. */
    text: z.string().optional(),
    oncePerDay: z.boolean().optional(),
    once: z.boolean().optional(),
    ref: RefSchema.optional(),
  })
  .strict();

/** Chekhov detail layer (III.24): ⅓ texture, ⅓ character, ⅓ clue. */
export const ChekhovDetailSchema = z
  .object({
    tier: z.enum(['texture', 'character', 'clue']),
    text: z.string().optional(),
    card: IdSchema.optional(),
    question: IdSchema.optional(),
    /** Set when observed — the OBSERVE-stance fuel (II.12.1 tells). */
    flag: IdSchema.optional(),
    cond: ConditionSchema.optional(),
  })
  .strict();

export const HotspotSchema = z
  .object({
    id: IdSchema,
    poly: z.array(Vec2Schema).min(3).optional(),
    at: Vec2Schema.optional(),
    kind: HotspotKindSchema,
    /** For kind=talk: which character this routes to (via schedule). */
    character: IdSchema.optional(),
    /** For kind=exit. */
    to: IdSchema.optional(),
    interactions: z.array(InteractionSchema).default([]),
    detail: ChekhovDetailSchema.optional(),
    cond: ConditionSchema.optional(),
    ref: RefSchema.optional(),
    label: z.string().optional(),
  })
  .strict()
  .refine((h) => h.poly || h.at, { message: 'hotspot needs poly or at' })
  .refine((h) => h.kind !== 'exit' || !!h.to, { message: 'exit hotspot needs "to"' })
  .refine((h) => h.kind !== 'talk' || !!h.character, { message: 'talk hotspot needs "character"' });

export const SitSpotSchema = z
  .object({
    at: Vec2Schema,
    monologues: z
      .array(z.object({ cond: ConditionSchema.optional(), bark: IdSchema }).strict())
      .default([]),
  })
  .strict();

/**
 * Scene triggers: auto-fire when the player is in the location and the cond
 * passes (checked on enter and on phase change). Carries set-pieces like the
 * Day 1 ceremony (I.5.day1 beat 5 — unskippable).
 */
export const SceneTriggerSchema = z
  .object({
    id: IdSchema,
    cond: ConditionSchema,
    /** Dialogue to run (multi-speaker set-pieces use per-node speakers). */
    dialogue: IdSchema.optional(),
    effects: EffectsSchema.optional(),
    once: z.boolean().default(true),
    ref: RefSchema,
  })
  .strict();

export const LocationSchema = z
  .object({
    id: IdSchema,
    name: z.string().min(1),
    ref: RefSchema,
    /** Parallax planes, back to front — asset keys per spec §10. */
    layers: z.array(z.enum(['bg', 'mid', 'fg'])).min(1),
    /** Walk-line: y position and x extent Gary can walk (spec §7 — 1D path). */
    walkLine: z
      .object({ y: z.number(), minX: z.number(), maxX: z.number(), depthScale: z.tuple([z.number(), z.number()]).optional() })
      .strict(),
    exits: z.array(z.object({ to: IdSchema, at: Vec2Schema }).strict()).default([]),
    sitSpot: SitSpotSchema.optional(),
    hotspots: z.array(HotspotSchema).default([]),
    triggers: z.array(SceneTriggerSchema).default([]),
    ambient: z
      .object({
        vignetteTags: z.array(IdSchema).default([]),
        weatherVariants: z.boolean().default(false),
        music: IdSchema.optional(),
        ambience: IdSchema.optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export type LocationDef = z.infer<typeof LocationSchema>;
export type Hotspot = z.infer<typeof HotspotSchema>;
