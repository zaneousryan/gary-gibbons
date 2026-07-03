// cards/*.json (tech spec §5.4)

import { z } from 'zod';
import { CardStatusSchema, ConditionSchema, IdSchema, RefSchema } from './common';

export const CardTypeSchema = z.enum([
  'testimony',
  'physical',
  'document',
  'photo',
  'sketch',
  'question',
  'theory',
  'deduction',
  'event', // timeline rail
]);

export const VerifyRouteSchema = z
  .object({
    id: IdSchema,
    ref: RefSchema.optional(),
    cond: ConditionSchema,
    /** UI copy for whyUnverified(): "a document, a witness, or your own eyes". */
    hint: z.string().optional(),
  })
  .strict();

export const CardSchema = z
  .object({
    id: IdSchema,
    ref: RefSchema,
    type: CardTypeSchema,
    title: z.string().min(1),
    /** Board sprite asset key: board/card_{sprite}.png (spec §10). */
    sprite: IdSchema.optional(),
    /** Character or venue this came from. */
    source: IdSchema.optional(),
    initialStatus: CardStatusSchema.default('unverified'),
    verifyRoutes: z.array(VerifyRouteSchema).default([]),
    /** Source protection (III.23.2). */
    attribution: z
      .object({ protectable: z.boolean(), namedFlag: IdSchema })
      .strict()
      .optional(),
    /** Re-read lines (III.27) — new Gary line when meaning changes. */
    reReadLines: z
      .array(z.object({ cond: ConditionSchema.optional(), bark: IdSchema }).strict())
      .default([]),
    /** For type=event: rail anchor condition (II.16.1). */
    anchor: ConditionSchema.optional(),
    /** For type=event: which rail slot this card belongs in. */
    railSlot: IdSchema.optional(),
    /** Body text shown when the card is examined. */
    text: z.string().optional(),
  })
  .strict();

export type Card = z.infer<typeof CardSchema>;
