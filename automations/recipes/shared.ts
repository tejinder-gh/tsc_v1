/**
 * What: Building blocks shared by every recipe - the Zod schemas for a configurable ladder step
 *       and duration, plus locale/timezone-aware formatters for dates and money used in templates.
 * Why: Recipes must be "highly configurable": an operator tunes offsets, channels, and copy per
 *       client without code. Centralising the step schema means every ladder product validates its
 *       touches identically, and the formatters guarantee a Toronto salon and a Vancouver clinic
 *       both read correct local times in their reminders.
 * How: Plain Zod objects and thin Intl wrappers. defaultSteps() lets a recipe ship a sensible
 *       ladder that config can fully override.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import { z } from "zod";
import type { SequenceStep } from "../core/sequence";

export const durationSchema = z
  .object({
    minutes: z.number().int().optional(),
    hours: z.number().int().optional(),
    days: z.number().int().optional(),
  })
  .refine((d) => d.minutes !== undefined || d.hours !== undefined || d.days !== undefined, {
    message: "A duration needs at least one of minutes, hours, or days",
  });

export const channelSchema = z.enum(["sms", "email", "auto"]);

export const stepSchema = z.object({
  id: z.string().min(1),
  offset: durationSchema,
  channel: channelSchema.default("auto"),
  template: z.object({
    subject: z.string().optional(),
    body: z.string().min(1),
  }),
  tags: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
});

export type StepConfig = z.infer<typeof stepSchema>;

/** Provide a recipe's default ladder; clients override by supplying their own `steps`. */
export function withDefaultSteps(
  steps: readonly StepConfig[] | undefined,
  fallback: readonly SequenceStep[],
): readonly SequenceStep[] {
  if (!steps || steps.length === 0) return fallback;
  return steps.map((s) => ({ ...s }));
}

export interface FormattedWhen {
  /** e.g. "Tue, Jun 16" */
  date: string;
  /** e.g. "2:00 PM" */
  time: string;
  /** e.g. "Tue, Jun 16 at 2:00 PM" */
  full: string;
}

export function formatWhen(iso: string, timezone: string, locale: string): FormattedWhen {
  const date = new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
  const time = new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
  return { date, time, full: `${date} at ${time}` };
}

export function formatMoney(amount: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** First name for friendly greetings; falls back to a safe generic. */
export function firstName(name: string | undefined, fallback = "there"): string {
  if (!name) return fallback;
  return name.trim().split(/\s+/)[0] || fallback;
}
