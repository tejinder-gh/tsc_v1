/**
 * What: The "Review booster" product (content/services.ts: feedback-and-reviews) - text a review
 *       request shortly after each completed visit, when the customer is happiest.
 * Why: Happy customers forget to review; asking every time, automatically, is what doubles Google
 *       volume and moves map rank. It's a one-touch ladder, so the sequence engine handles it.
 * How: A sequence recipe anchored to the completed appointment, with a short positive offset so the
 *       ask lands a couple of hours later (configurable). The review link comes from the business
 *       profile; copy is fully overridable in config.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import { z } from "zod";
import { requireIntegration } from "../core/recipe";
import type { Enrollment, SequenceStep } from "../core/sequence";
import { defineSequenceRecipe } from "../core/sequence-recipe";
import { firstName, stepSchema, withDefaultSteps } from "./shared";

const configSchema = z.object({
  /** How far back to scan for completed visits to ask about. */
  lookbackDays: z.number().int().min(1).max(14).default(2),
  steps: z.array(stepSchema).optional(),
});

type Config = z.infer<typeof configSchema>;

const DEFAULT_STEPS: readonly SequenceStep[] = [
  {
    id: "ask",
    offset: { hours: 2 },
    channel: "sms",
    template: {
      body: "Hi {{firstName}}, thanks for visiting {{business}} today! If we did a good job, a quick review means the world to us: {{reviewLink}}",
    },
  },
];

export const reviewBoosterRecipe = defineSequenceRecipe<Config>({
  id: "review-booster",
  title: "Review booster",
  summary: "Automatic post-visit review requests by text, timed for when customers are happiest.",
  schema: configSchema,
  graceWindow: { days: 2 },
  steps: (config) => withDefaultSteps(config.steps, DEFAULT_STEPS),
  async enroll(config, ctx) {
    const calendar = requireIntegration(ctx, "calendar", "review-booster");
    const since = new Date(
      new Date(ctx.now).getTime() - config.lookbackDays * 86_400_000,
    ).toISOString();
    const completed = await calendar.completedAppointments(since);
    const reviewLink = ctx.business.reviewLink ?? ctx.business.bookingLink ?? "";

    return completed.map<Enrollment>((appt) => ({
      contact: appt.contact,
      anchorAt: appt.startAt,
      startedAt: appt.startAt,
      variables: {
        firstName: firstName(appt.contact.name),
        business: ctx.business.name,
        service: appt.service ?? "visit",
        reviewLink,
      },
    }));
  },
});
