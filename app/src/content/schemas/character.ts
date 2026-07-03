// characters/*.json (tech spec §5.1)

import { z } from 'zod';
import { ConditionSchema, IdSchema, RefSchema } from './common';

export const TellSchema = z
  .object({
    id: IdSchema,
    cond: ConditionSchema.optional(),
    /** dlg:{dialogueId} or bark id — the OBSERVE line this tell unlocks. */
    observeLine: z.string(),
    /** Flag set once the player has noticed the tell in-scene. */
    noticedFlag: IdSchema.optional(),
  })
  .strict();

export const CharacterSchema = z
  .object({
    id: IdSchema,
    name: z.string().min(1),
    ref: RefSchema,
    /** Asset key: characters/{portraitSet}/portrait_*.png (spec §10). */
    portraitSet: IdSchema,
    voice: z
      .object({
        textSpeed: z.number().positive().default(1),
        blipSound: IdSchema,
      })
      .strict(),
    /** Trust-flavored greetings (III.23.3): the greeting IS the trust UI. */
    greetings: z
      .object({
        cold: z.string(),
        neutral: z.string(),
        warm: z.string(),
      })
      .strict(),
    tells: z.array(TellSchema).default([]),
    etiquette: z.object({ note: z.string() }).strict().optional(),
    /** Species pass (design doc v1.3) — art/casting note, not gameplay. */
    species: z.string().optional(),
  })
  .strict();

export type Character = z.infer<typeof CharacterSchema>;
