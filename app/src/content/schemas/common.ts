// Shared schema pieces: the Condition DSL, Effects DSL, and the id/ref rules
// every content type carries (tech spec §5 preamble).

import { z } from 'zod';

/** Stable snake_case IDs — the save-referenced contract (ALETHEIA.md §7). */
export const IdSchema = z
  .string()
  .regex(/^[a-z0-9][a-z0-9_]*$/, 'ids are stable snake_case (a-z, 0-9, _)');

/** Design-doc traceability, e.g. "I.5.day2", "II.16.1", "III.23". */
export const RefSchema = z.string().min(1);

export const NumCmpSchema = z
  .object({
    gte: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    lt: z.number().optional(),
    eq: z.number().optional(),
  })
  .strict();

export const CardStatusSchema = z.enum(['unverified', 'verified', 'offrecord']);
export const PhaseSchema = z.enum(['morning', 'midday', 'evening', 'night']);
export const WeatherSchema = z.enum(['clear', 'rain']);
export const DaySchema = z.number().int().min(1).max(7);

// Condition DSL (tech spec §4.2) — recursive.
export type ConditionShape = {
  all?: ConditionShape[];
  any?: ConditionShape[];
  not?: ConditionShape;
  flag?: string;
  value?: boolean | number | string;
  card?: string;
  status?: 'unverified' | 'verified' | 'offrecord' | 'any';
  day?: number | z.infer<typeof NumCmpSchema>;
  phase?: z.infer<typeof PhaseSchema> | z.infer<typeof PhaseSchema>[];
  trust?: { char: string; gte?: number; lte?: number; gt?: number; lt?: number; eq?: number };
  weather?: 'clear' | 'rain';
  deduction?: string;
  collectible?: { lanterns?: number; doodles?: number; clippings?: number };
};

export const ConditionSchema: z.ZodType<ConditionShape> = z.lazy(() =>
  z
    .object({
      all: z.array(ConditionSchema).optional(),
      any: z.array(ConditionSchema).optional(),
      not: ConditionSchema.optional(),
      flag: IdSchema.optional(),
      value: z.union([z.boolean(), z.number(), z.string()]).optional(),
      card: IdSchema.optional(),
      status: z.enum(['unverified', 'verified', 'offrecord', 'any']).optional(),
      day: z.union([DaySchema, NumCmpSchema]).optional(),
      phase: z.union([PhaseSchema, z.array(PhaseSchema)]).optional(),
      trust: z
        .object({ char: IdSchema })
        .merge(NumCmpSchema.partial())
        .optional(),
      weather: WeatherSchema.optional(),
      deduction: IdSchema.optional(),
      collectible: z
        .object({
          lanterns: z.number().int().optional(),
          doodles: z.number().int().optional(),
          clippings: z.number().int().optional(),
        })
        .strict()
        .optional(),
    })
    .strict(),
);

// Effects DSL (tech spec §4.3).
export const EffectSchema = z
  .object({
    setFlag: IdSchema.optional(),
    value: z.union([z.boolean(), z.number(), z.string()]).optional(),
    clearFlag: IdSchema.optional(),
    giveCard: IdSchema.optional(),
    status: CardStatusSchema.optional(),
    via: IdSchema.optional(),
    verify: IdSchema.optional(),
    markOffRecord: IdSchema.optional(),
    trust: z.object({ char: IdSchema, delta: z.number().int() }).strict().optional(),
    trustFloor: z.object({ char: IdSchema, min: z.number().int() }).strict().optional(),
    unlockDialogue: IdSchema.optional(),
    notebook: z
      .object({ entry: IdSchema.optional(), question: IdSchema.optional(), doodle: IdSchema.optional() })
      .strict()
      .optional(),
    playBark: IdSchema.optional(),
    startSidestory: IdSchema.optional(),
    goTo: IdSchema.optional(),
    openPuzzle: IdSchema.optional(),
    advancePhase: z.literal(true).optional(),
    collect: z.object({ lantern: IdSchema.optional(), clipping: IdSchema.optional() }).strict().optional(),
    grapeDeclined: z.literal(true).optional(),
  })
  .strict()
  .refine(
    (e) => {
      const keys = Object.keys(e).filter((k) => k !== 'value' && k !== 'status' && k !== 'via');
      return keys.length === 1;
    },
    { message: 'an effect object carries exactly one verb (plus its modifiers value/status/via)' },
  );

export const EffectsSchema = z.array(EffectSchema);

/** Who wrote a dialogue line — Ryan reviews all agent-written lines with one grep. */
export const AuthoredSchema = z.enum(['verbatim', 'aletheia']);

export const Vec2Schema = z.tuple([z.number(), z.number()]);
