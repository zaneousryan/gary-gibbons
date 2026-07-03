// schedules.json — NPC placement table (tech spec §5.7)
// { "poppy": { "d2": { "morning": {"loc":"founders_square","spot":"stage"}, ... } } }

import { z } from 'zod';
import { IdSchema } from './common';

export const PlacementSchema = z
  .object({
    loc: IdSchema,
    spot: IdSchema.optional(),
    /** Weather routing (II.14.2): where they go instead when it rains. */
    ifRain: IdSchema.optional(),
  })
  .strict();

export const DayScheduleSchema = z
  .object({
    morning: PlacementSchema.optional(),
    midday: PlacementSchema.optional(),
    evening: PlacementSchema.optional(),
    night: PlacementSchema.optional(),
  })
  .strict();

export const CharacterScheduleSchema = z.record(
  z.string().regex(/^d[1-7]$/, 'schedule keys are d1..d7'),
  DayScheduleSchema,
);

export const SchedulesFileSchema = z.record(IdSchema, CharacterScheduleSchema);

export type SchedulesFile = z.infer<typeof SchedulesFileSchema>;
export type Placement = z.infer<typeof PlacementSchema>;
