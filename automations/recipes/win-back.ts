/**
 * What: The "Customer win-back" campaign (content/services.ts: customer-win-back) - re-engage
 *       customers who've lapsed past their usual visit interval with a friendly, optionally
 *       discounted, invitation to return.
 * Why: Regulars drift away quietly; recovering even 8-15% of them keeps the calendar full. The
 *       same ladder engine handles it - the only new idea is the anchor (the moment they "go cold")
 *       and the exclusion (don't message anyone who already has a future booking).
 * How: A sequence recipe whose anchor is lastVisitAt + inactiveDays (when they cross the lapsed
 *       threshold). enroll() excludes anyone with an upcoming appointment via stopReason and
 *       injects the offer code so a non-engineer can change the promo in config.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import { z } from "zod";
import { addDuration } from "../core/duration";
import { requireIntegration } from "../core/recipe";
import type { Enrollment, SequenceStep } from "../core/sequence";
import { defineSequenceRecipe } from "../core/sequence-recipe";
import { firstName, stepSchema, withDefaultSteps } from "./shared";

const configSchema = z.object({
  /** Days since last visit before a customer is considered lapsed. */
  inactiveDays: z.number().int().min(7).max(730).default(90),
  /** Optional promo code injected as {{offerCode}}; leave blank for a plain check-in. */
  offerCode: z.string().optional(),
  steps: z.array(stepSchema).optional(),
});

type Config = z.infer<typeof configSchema>;

const DEFAULT_STEPS: readonly SequenceStep[] = [
  {
    id: "check-in",
    offset: { days: 0 },
    channel: "sms",
    template: {
      body: "Hi {{firstName}}, it's been a while! We'd love to see you back at {{business}} for your {{topService}}. Book anytime: {{bookingLink}}",
    },
  },
  {
    id: "offer",
    offset: { days: 7 },
    channel: "sms",
    template: {
      body: "{{firstName}}, here's a little nudge: use {{offerCode}} on your next {{topService}} at {{business}}. Grab a time: {{bookingLink}}",
    },
  },
];

export const winBackRecipe = defineSequenceRecipe<Config>({
  id: "win-back",
  title: "Customer win-back",
  summary: "Re-engage lapsed customers with a check-in and an optional return offer.",
  schema: configSchema,
  graceWindow: { days: 3 },
  steps: (config) => withDefaultSteps(config.steps, DEFAULT_STEPS),
  async enroll(config, ctx) {
    const crm = requireIntegration(ctx, "crm", "win-back");
    const calendar = ctx.integrations.calendar;
    const lapsed = await crm.lapsedCustomers(ctx.now, config.inactiveDays);

    const enrollments: Enrollment[] = [];
    for (const customer of lapsed) {
      // If we can see the calendar, skip anyone who's already rebooked.
      const hasUpcoming = calendar
        ? await calendar.hasUpcomingFor(customer.contact.id, ctx.now)
        : false;
      const anchorAt = addDuration(customer.lastVisitAt, { days: config.inactiveDays });
      enrollments.push({
        contact: customer.contact,
        anchorAt,
        startedAt: anchorAt,
        stopReason: hasUpcoming ? "already rebooked" : undefined,
        variables: {
          firstName: firstName(customer.contact.name),
          business: ctx.business.name,
          topService: customer.topService ?? "next visit",
          offerCode: config.offerCode ?? "",
          bookingLink: ctx.business.bookingLink ?? "reply and we'll set you up",
        },
      });
    }
    return enrollments;
  },
});
