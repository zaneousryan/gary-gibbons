// deductions.json — the recipe graph (tech spec §5.5; design doc I.6, II.16, III.22)

import { z } from 'zod';
import { ConditionSchema, IdSchema, RefSchema } from './common';

export const DeductionSchema = z
  .object({
    id: IdSchema,
    ref: RefSchema,
    kind: z.enum(['standard', 'aha']),
    /** Input card ids — string-matching is order-free (spec §6.2). */
    inputs: z.array(IdSchema).min(1),
    requireVerified: z.boolean().default(true),
    /** Off-record cards can never be sole inputs when this is set (III.23.1). */
    requireOnRecordForFinale: z.boolean().default(false),
    produces: z
      .object({
        card: IdSchema.optional(),
        ledgerCell: z.object({ suspect: IdSchema, col: z.enum(['motive', 'means', 'opportunity']) }).strict().optional(),
        /** Elimination deductions (D4, D8): the row stamps CLEARED (II.16.2). */
        clearSuspect: IdSchema.optional(),
        railFlip: IdSchema.optional(),
        mapMark: IdSchema.optional(),
      })
      .strict(),
    /** Gary's line when the string goes gold. */
    garyLine: IdSchema.optional(),
    /** Aha deductions get a cinematic key (III.22). */
    cinematic: IdSchema.optional(),
  })
  .strict();

export const TheorySchema = z
  .object({
    id: IdSchema,
    ref: RefSchema.optional(),
    title: z.string(),
    retireWhen: ConditionSchema,
  })
  .strict();

export const ContradictionSchema = z
  .object({
    id: IdSchema,
    pair: z.tuple([IdSchema, IdSchema]),
    producesQuestion: IdSchema,
    ref: RefSchema,
    /** Gary's murmur when the overlap highlights. */
    line: z.string().optional(),
  })
  .strict();

export const DeductionsFileSchema = z
  .object({
    deductions: z.array(DeductionSchema),
    /** Path to the wrong-pair bark pool file key. */
    wrongPairBarks: z.string().optional(),
    theories: z.array(TheorySchema).default([]),
    contradictions: z.array(ContradictionSchema).default([]),
  })
  .strict();

export type Deduction = z.infer<typeof DeductionSchema>;
export type DeductionsFile = z.infer<typeof DeductionsFileSchema>;
