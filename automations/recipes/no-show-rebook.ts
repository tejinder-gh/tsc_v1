/**
 * What: The no-show rebooking ladder (content/services.ts checklist item 11) - when someone
 *       misses an appointment, gently and persistently invite them to grab a new time.
 * Why: A missed slot is recoverable revenue, but only if something chases it the same day. Reusing
 *       the sequence engine means this product is a short config, not a new system.
 * How: A sequence recipe anchored to the *missed* appointment time, with positive offsets (after).
 *       It enrolls no-show appointments from a configurable lookback and sets stopReason when the
 *       contact already has a future booking (they rebooked - don't keep nudging).
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import { z } from "zod";
import { requireIntegration } from "../core/recipe";
import type { Enrollment, SequenceStep } from "../core/sequence";
import { defineSequenceRecipe } from "../core/sequence-recipe";
import { firstName, stepSchema, withDefaultSteps } from "./shared";

const configSchema = z.object({
  /** How far back to scan for missed appointments. */
  lookbackDays: z.number().int().min(1).max(30).default(7),
  steps: z.array(stepSchema).optional(),
});

type Config = z.infer<typeof configSchema>;

const DEFAULT_STEPS: readonly SequenceStep[] = [
  {
    id: "same-day",
    offset: { hours: 2 },
    channel: "sms",
    template: {
      body: "Hi {{firstName}}, sorry we missed you for your {{service}} today. Life happens! Grab a new time whenever works: {{bookingLink}}",
    },
  },
  {
    id: "day-3",
    offset: { days: 3 },
    channel: "sms",
    template: {
      body: "{{firstName}}, still happy to get you back in for your {{service}} at {{business}}. Book here: {{bookingLink}}",
    },
  },
];

export const noShowRebookRecipe = defineSequenceRecipe<Config>({
  id: "no-show-rebook",
  title: "No-show rebooking",
  summary: "Same-day and follow-up nudges to rebook customers who missed an appointment.",
  schema: configSchema,
  graceWindow: { days: 2 },
  steps: (config) => withDefaultSteps(config.steps, DEFAULT_STEPS),
  async enroll(config, ctx) {
    const calendar = requireIntegration(ctx, "calendar", "no-show-rebook");
    const since = new Date(
      new Date(ctx.now).getTime() - config.lookbackDays * 86_400_000,
    ).toISOString();
    const missed = await calendar.missedAppointments(since);
    const bookingLink = ctx.business.bookingLink ?? "reply to this message and we'll set it up";

    const enrollments: Enrollment[] = [];
    for (const appt of missed) {
      const rebooked = await calendar.hasUpcomingFor(appt.contact.id, ctx.now);
      enrollments.push({
        contact: appt.contact,
        anchorAt: appt.startAt,
        startedAt: appt.startAt,
        stopReason: rebooked ? "already rebooked" : undefined,
        variables: {
          firstName: firstName(appt.contact.name),
          business: ctx.business.name,
          service: appt.service ?? "appointment",
          bookingLink,
        },
      });
    }
    return enrollments;
  },
});
