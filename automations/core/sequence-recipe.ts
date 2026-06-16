/**
 * What: defineSequenceRecipe - a factory that turns "how do I find who to enroll" + "what are the
 *       touches" into a complete, registry-ready Recipe. Every ladder product is built with it.
 * Why: Booking reminders, no-show rebooking, invoice dunning, win-back and contract chasing are
 *       the same machine with different anchors, copy, and stop conditions. This factory captures
 *       that machine once; a new ladder product becomes ~30 lines of config-derivation, not a new
 *       engine. That is the project's "use code once, use for many" thesis made concrete.
 * How: The caller supplies a Zod schema, a steps(config) function (the ladder, usually straight
 *       from config), and an async enroll(config, ctx) that reads integrations and returns one
 *       Enrollment per contact (with its anchor time, variables, and any stopReason). The factory
 *       runs planSequence per enrollment, logs skips for observability, and returns the actions.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import type { z } from "zod";
import type { Duration } from "./duration";
import { defineRecipe, type Recipe, type RecipeContext } from "./recipe";
import { type Enrollment, planSequence, type SequenceStep } from "./sequence";
import type { Action } from "./types";

export interface SequenceRecipeSpec<TConfig> {
  id: string;
  title: string;
  summary: string;
  schema: z.ZodType<TConfig, z.ZodTypeDef, unknown>;
  /** The ladder of touches. Usually derived straight from the client's config. */
  steps(config: TConfig): readonly SequenceStep[];
  /** Read integrations and decide who is enrolled, at what anchor, with what variables. */
  enroll(config: TConfig, ctx: RecipeContext): Promise<Enrollment[]>;
  /** How stale a touch may be and still fire (default 24h). */
  graceWindow?: Duration;
}

export function defineSequenceRecipe<TConfig>(spec: SequenceRecipeSpec<TConfig>): Recipe<TConfig> {
  return defineRecipe<TConfig>({
    id: spec.id,
    title: spec.title,
    summary: spec.summary,
    schema: spec.schema,
    async plan(config, ctx) {
      const steps = spec.steps(config);
      const enrollments = await spec.enroll(config, ctx);
      const actions: Action[] = [];

      for (const enrollment of enrollments) {
        const result = planSequence({
          identity: { clientId: ctx.clientId, automationId: ctx.automationId, recipeId: spec.id },
          steps,
          enrollment,
          now: ctx.now,
          idempotency: ctx.idempotency,
          graceWindow: spec.graceWindow,
        });
        actions.push(...result.actions);

        for (const skip of result.skipped) {
          ctx.logger.debug("sequence step skipped", {
            clientId: ctx.clientId,
            automation: ctx.automationId,
            recipe: spec.id,
            contact: enrollment.contact.id,
            step: skip.stepId,
            reason: skip.reason,
          });
        }
      }

      ctx.logger.info("sequence recipe planned", {
        clientId: ctx.clientId,
        automation: ctx.automationId,
        recipe: spec.id,
        enrollments: enrollments.length,
        actions: actions.length,
      });
      return actions;
    },
  });
}
