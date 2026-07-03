// editions/*.json — nightly headline sets + town reactions (tech spec §5.8, II.15.1)

import { z } from 'zod';
import { ConditionSchema, DaySchema, EffectsSchema, IdSchema, RefSchema } from './common';

export const HeadlineSchema = z
  .object({
    id: IdSchema,
    tone: z.enum(['sensational', 'measured', 'compassionate', 'hold']),
    text: z.string(),
    cond: ConditionSchema.optional(),
    effects: EffectsSchema.optional(),
    /** Next-day flavor: bark pack key, chalkboard line, rumor seed. */
    reactions: z
      .object({
        barkPack: IdSchema.optional(),
        chalkboard: z.string().optional(),
        rumorSeed: IdSchema.optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export const KickerSchema = z
  .object({
    id: IdSchema,
    text: z.string(),
    cond: ConditionSchema.optional(),
    effects: EffectsSchema.optional(),
  })
  .strict();

export const EditionSchema = z
  .object({
    id: IdSchema,
    day: DaySchema,
    ref: RefSchema,
    /** Blocks auto-drafted from these cards when verified + on-record (Dot's law). */
    draftCards: z.array(IdSchema),
    headlines: z.array(HeadlineSchema).min(2),
    kickers: z.array(KickerSchema).min(1),
    /** Attribution sub-step fires when a protectable card is in the draft (III.23.2). */
  })
  .strict();

export type Edition = z.infer<typeof EditionSchema>;
