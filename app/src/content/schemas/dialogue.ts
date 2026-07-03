// dialogue/*.dlg.json — node graph (tech spec §5.3).
// stances node = interview beat (II.12.1); plain nodes = normal talk;
// choices = headline picks, Milo attribution, etc.

import { z } from 'zod';
import { AuthoredSchema, ConditionSchema, EffectsSchema, IdSchema, RefSchema } from './common';

export const EntrySchema = z
  .object({
    id: IdSchema,
    cond: ConditionSchema.optional(),
    node: IdSchema,
  })
  .strict();

const NextSchema = IdSchema.nullable();

export const StanceOptionSchema = z
  .object({
    line: z.string(),
    next: NextSchema,
    cond: ConditionSchema.optional(),
    effects: EffectsSchema.optional(),
    authored: AuthoredSchema.optional(),
  })
  .strict();

export const ChoiceSchema = z
  .object({
    line: z.string(),
    next: NextSchema,
    cond: ConditionSchema.optional(),
    effects: EffectsSchema.optional(),
    authored: AuthoredSchema.optional(),
  })
  .strict();

export const DialogueNodeSchema = z
  .object({
    speaker: IdSchema,
    line: z.string().optional(),
    /** Interview beat (II.12.1): press / empathize / observe. */
    stances: z
      .object({
        press: StanceOptionSchema.optional(),
        empathize: StanceOptionSchema.optional(),
        observe: StanceOptionSchema.optional(),
      })
      .strict()
      .optional(),
    choices: z.array(ChoiceSchema).optional(),
    effects: EffectsSchema.optional(),
    next: NextSchema.optional(),
    /** Cards gained from this node are off the record (III.23.1). */
    offRecord: z.boolean().optional(),
    authored: AuthoredSchema.optional(),
    /** Emote key for the speaker portrait (neutral|happy|worried|surprised|sad). */
    emote: z.enum(['neutral', 'happy', 'worried', 'surprised', 'sad']).optional(),
    ref: RefSchema.optional(),
  })
  .strict()
  .refine((n) => n.line !== undefined || n.stances !== undefined || n.choices !== undefined, {
    message: 'node needs a line, stances, or choices',
  });

export const DialogueSchema = z
  .object({
    id: IdSchema,
    character: IdSchema,
    ref: RefSchema,
    /** Entry selection is PRIMED-first: first entry whose cond passes wins (III.20). */
    entries: z.array(EntrySchema).min(1),
    nodes: z.record(IdSchema, DialogueNodeSchema),
    oncePerDay: z.boolean().optional(),
    /**
     * Re-entrant scenes (II.12.1 cozy failure model): completion never blocks
     * re-selection — entry conds alone decide availability. Use for scenes a
     * wrong stance can exit early (the fact resurfaces at higher cost).
     */
    reentrant: z.boolean().optional(),
    /** Bark played if the dialogue is re-approached after exhaustion. */
    repeatBark: IdSchema.optional(),
  })
  .strict();

export type Dialogue = z.infer<typeof DialogueSchema>;
export type DialogueNode = z.infer<typeof DialogueNodeSchema>;
