/**
 * What: Zod schemas shared by client forms (react-hook-form resolvers) and the /api/lead route.
 * Why: One source of truth for validation at both system boundaries - the brief and house
 *      rules require schema-based validation of all user input, client and server.
 * How: leadSchema is the server-side superset every submission must satisfy; the per-form
 *      schemas below it drive react-hook-form. segment is a closed enum including "unknown".
 * From Where: TheSkillCorner marketing site build brief (forms and webhook spec), 2026-06.
 * When: 2026-06; extend when new forms or webhook fields are added.
 */

import { z } from "zod";

export const segmentField = z.enum(["local", "practice", "unknown"]);

const email = z.string().trim().email("Enter a valid email address").max(254);
const shortText = z.string().trim().max(200);

/**
 * Honeypot field. Humans never see or fill it (HoneypotField renders it
 * off-screen); bots auto-fill it. It MUST be declared on every per-form schema,
 * not just leadSchema: zodResolver hands react-hook-form only the parsed output,
 * so a field missing from the form schema is stripped client-side and the
 * server check would never see it.
 */
export const honeypotField = z.string().trim().max(200).optional();

/** Extends a form schema with the shared honeypot field. */
export function withHoneypot<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return schema.extend({ website: honeypotField });
}

/** Server-side schema for every webhook submission. */
export const leadSchema = z
  .object({
    lead_source: z.string().trim().min(1).max(64),
    segment: segmentField.default("unknown"),
    page: z.string().trim().max(300).optional(),
    name: shortText.optional(),
    email: email.optional(),
    business: shortText.optional(),
    business_type: shortText.optional(),
    phone: shortText.optional(),
    message: z.string().trim().max(3000).optional(),
    budget: shortText.optional(),
    roi_hours_per_week: z.number().min(0).max(200).optional(),
    roi_hourly_cost: z.number().min(0).max(1000).optional(),
    roi_annual_cost: z.number().min(0).max(10_000_000).optional(),
    website: honeypotField,
  })
  .refine((data) => Boolean(data.email) || Boolean(data.message), {
    message: "A lead needs at least an email or a message",
  });

export type LeadPayload = z.input<typeof leadSchema>;

/**
 * /contact - the two-step quick query form (brief §8.3). Step one (name, business,
 * email, business type) is required and enables submit on its own; step two (phone,
 * free text) is optional and skippable, so both are optional at the schema level.
 */
export const contactFormSchema = withHoneypot(
  z.object({
    name: z.string().trim().min(1, "Tell us your name").max(120),
    business: z.string().trim().min(1, "Tell us your business name").max(120),
    email: email.min(1, "We need an email to reply to"),
    businessType: z.string().trim().min(1, "Pick the closest match"),
    phone: z.string().trim().max(40).optional(),
    message: z.string().trim().max(3000).optional(),
    budget: z.string().trim().max(60).optional(),
  }),
);

export type ContactFormValues = z.infer<typeof contactFormSchema>;

/** Interactive checklist and exit-intent modal - the lead magnet gate. */
export const checklistFormSchema = withHoneypot(
  z.object({
    email: email.min(1, "Enter the email to send it to"),
    businessType: z.string().trim().min(1, "Pick the closest match"),
  }),
);

export type ChecklistFormValues = z.infer<typeof checklistFormSchema>;

/** Floating widget - one question plus a reply address. */
export const quickQuestionSchema = withHoneypot(
  z.object({
    email: email.min(1, "We need an email to reply to"),
    message: z.string().trim().min(5, "Type your question first").max(1000),
  }),
);

export type QuickQuestionValues = z.infer<typeof quickQuestionSchema>;

/** ROI calculator - email capture for the report. */
export const roiReportSchema = withHoneypot(
  z.object({
    email: email.min(1, "Enter the email to send the report to"),
  }),
);

export type RoiReportValues = z.infer<typeof roiReportSchema>;
