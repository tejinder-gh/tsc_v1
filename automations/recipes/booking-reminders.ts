/**
 * What: The "Booking & reminders" product (content/services.ts: booking-and-reminders) - a
 *       configurable reminder ladder that fires before each appointment to kill no-shows.
 * Why: This is the single highest-ROI product in the catalogue. Encoding it as config over the
 *       shared sequence engine means a salon, a dental office, and a physio clinic all run it with
 *       different copy and timings but zero bespoke code.
 * How: A sequence recipe. enroll() pulls booked appointments inside the reminder window and anchors
 *       each ladder to the appointment start; offsets are negative ("-24h"). Per-appointment
 *       variables (name, service, when, booking/reschedule links) feed the templates. Because only
 *       "booked" appointments are fetched, a cancellation naturally drops the contact from the
 *       ladder on the next run.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import { z } from "zod";
import { requireIntegration } from "../core/recipe";
import type { Enrollment, SequenceStep } from "../core/sequence";
import { defineSequenceRecipe } from "../core/sequence-recipe";
import { firstName, formatWhen, stepSchema, withDefaultSteps } from "./shared";

const configSchema = z.object({
  /** How many days ahead to look for appointments to remind. */
  reminderWindowDays: z.number().int().min(1).max(60).default(8),
  /** Override the default ladder of touches. Offsets should be negative (before the appointment). */
  steps: z.array(stepSchema).optional(),
});

type Config = z.infer<typeof configSchema>;

const DEFAULT_STEPS: readonly SequenceStep[] = [
  {
    id: "7d",
    offset: { days: -7 },
    channel: "email",
    template: {
      subject: "Reminder: {{service}} on {{date}}",
      body: "Hi {{firstName}}, this is a reminder of your {{service}} with {{business}} on {{when}}. Need to change it? {{rescheduleLink}}",
    },
  },
  {
    id: "24h",
    offset: { hours: -24 },
    channel: "sms",
    template: {
      body: "Hi {{firstName}}, see you tomorrow at {{time}} for your {{service}} with {{business}}. Reply C to confirm or reschedule here: {{rescheduleLink}}",
    },
  },
  {
    id: "2h",
    offset: { hours: -2 },
    channel: "sms",
    template: {
      body: "{{firstName}}, your {{service}} is at {{time}} today. We're looking forward to seeing you! {{rescheduleLink}}",
    },
  },
];

export const bookingRemindersRecipe = defineSequenceRecipe<Config>({
  id: "booking-reminders",
  title: "Booking & reminders",
  summary: "Multi-touch reminder ladder before each appointment to cut no-shows.",
  schema: configSchema,
  graceWindow: { hours: 3 },
  steps: (config) => withDefaultSteps(config.steps, DEFAULT_STEPS),
  async enroll(config, ctx) {
    const calendar = requireIntegration(ctx, "calendar", "booking-reminders");
    const appointments = await calendar.upcomingAppointments(ctx.now, config.reminderWindowDays);
    const { timezone, locale } = ctx.business;

    return appointments.map<Enrollment>((appt) => {
      const when = formatWhen(appt.startAt, timezone, locale);
      const rescheduleLink = ctx.business.bookingLink ?? "call us to change your time";
      return {
        contact: appt.contact,
        anchorAt: appt.startAt,
        // Enrolled now; a step already in the past at enrollment is skipped by the engine.
        startedAt: ctx.now,
        variables: {
          firstName: firstName(appt.contact.name),
          business: ctx.business.name,
          service: appt.service ?? "appointment",
          staff: appt.staff ?? "",
          date: when.date,
          time: when.time,
          when: when.full,
          rescheduleLink,
        },
      };
    });
  },
});
