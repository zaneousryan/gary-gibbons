// game.json — day/phase graph and gates (tech spec §4.4, §5 preamble)

import { z } from 'zod';
import { DaySchema, IdSchema, PhaseSchema, RefSchema } from './common';

export const DayDefSchema = z
  .object({
    day: DaySchema,
    /** Gate deductions required before night -> next morning (I.6). */
    gateDeductions: z.array(IdSchema),
    coreCompleteFlag: IdSchema.optional(),
    /** Edition published this night (§5.8). Optional until Phase 3 content lands. */
    edition: IdSchema.optional(),
    ref: RefSchema.optional(),
    title: z.string().optional(),
  })
  .strict();

export const GameFileSchema = z
  .object({
    startLocation: IdSchema,
    startDay: DaySchema.default(1),
    startPhase: PhaseSchema.default('morning'),
    apartmentLocation: IdSchema,
    days: z.array(DayDefSchema).length(7),
    /** Rain scheduling (spec §6.8): scheduled day+phase plus one seeded random chance/day. */
    weather: z
      .object({
        scheduledRain: z.array(z.object({ day: DaySchema, phase: PhaseSchema }).strict()).default([]),
        dailyRainChance: z.number().min(0).max(1).default(0),
      })
      .strict()
      .optional(),
    /** DEMO build (spec §13): ends gracefully after this day with a wishlist card. */
    demo: z.object({ endAfterDay: DaySchema }).strict().optional(),
  })
  .strict();

export type GameFile = z.infer<typeof GameFileSchema>;
