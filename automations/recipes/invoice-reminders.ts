/**
 * What: The "Invoice & payments" dunning ladder (content/services.ts: invoice-and-payments) -
 *       polite, spaced reminders after an invoice's due date until it's paid.
 * Why: Owners hate the awkward "you still owe us" call, so it never happens and AR balloons. A
 *       reliable, friendly ladder recovers cash without anyone making the call - and it's the same
 *       sequence engine, so building it cost almost nothing.
 * How: A sequence recipe anchored to the invoice due date with positive offsets (3/7/14/30 days
 *       past due by default). Crucially, enroll() checks live payment status and sets stopReason
 *       the instant an invoice is paid, so no one is ever chased for money they already sent.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import { z } from "zod";
import { requireIntegration } from "../core/recipe";
import type { Enrollment, SequenceStep } from "../core/sequence";
import { defineSequenceRecipe } from "../core/sequence-recipe";
import { firstName, formatMoney, stepSchema, withDefaultSteps } from "./shared";

const configSchema = z.object({
  steps: z.array(stepSchema).optional(),
});

type Config = z.infer<typeof configSchema>;

const DEFAULT_STEPS: readonly SequenceStep[] = [
  {
    id: "due-plus-3",
    offset: { days: 3 },
    channel: "email",
    template: {
      subject: "A quick reminder about invoice {{number}}",
      body: "Hi {{firstName}}, just a friendly note that invoice {{number}} for {{amount}} is now due. You can pay in one tap here: {{payLink}}. Thank you! - {{business}}",
    },
  },
  {
    id: "due-plus-7",
    offset: { days: 7 },
    channel: "sms",
    template: {
      body: "Hi {{firstName}}, invoice {{number}} ({{amount}}) from {{business}} is still open. Pay securely here: {{payLink}}",
    },
  },
  {
    id: "due-plus-14",
    offset: { days: 14 },
    channel: "email",
    template: {
      subject: "Invoice {{number}} is past due",
      body: "Hi {{firstName}}, invoice {{number}} for {{amount}} is now two weeks past due. If you've already paid, thank you - otherwise here's the link: {{payLink}}. Reply if you'd like to arrange something. - {{business}}",
    },
  },
];

export const invoiceRemindersRecipe = defineSequenceRecipe<Config>({
  id: "invoice-reminders",
  title: "Invoice & payment reminders",
  summary: "Friendly dunning ladder after an invoice's due date; stops the moment it's paid.",
  schema: configSchema,
  graceWindow: { days: 3 },
  steps: (config) => withDefaultSteps(config.steps, DEFAULT_STEPS),
  async enroll(_config, ctx) {
    const payments = requireIntegration(ctx, "payments", "invoice-reminders");
    const open = await payments.openInvoices(ctx.now);
    const { locale } = ctx.business;

    const enrollments: Enrollment[] = [];
    for (const invoice of open) {
      const paid = await payments.isPaid(invoice.id);
      enrollments.push({
        contact: invoice.contact,
        anchorAt: invoice.dueAt,
        startedAt: invoice.issuedAt,
        stopReason: paid ? "invoice paid" : undefined,
        variables: {
          firstName: firstName(invoice.contact.name),
          business: ctx.business.name,
          number: invoice.number,
          amount: formatMoney(invoice.amount, invoice.currency, locale),
          payLink: invoice.payLink ?? ctx.business.bookingLink ?? "contact us to pay",
        },
      });
    }
    return enrollments;
  },
});
