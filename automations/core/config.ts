/**
 * What: The client-configuration schema - the single file an operator writes to onboard a new
 *       paying customer. It names the business, its channels and credentials (by env-var name),
 *       its internal notify destinations, and the list of automations it has bought.
 * Why: This is the commercial core of "write once, sell many". No code changes to add a client:
 *       you author one validated config object. Zod enforces it at the boundary so a malformed
 *       onboarding fails loudly at load, never silently mid-send to a real customer.
 * How: Zod schemas with safe defaults. Secrets are NEVER stored here - channel blocks hold the
 *       NAMES of environment variables that carry the secret (e.g. fromEnv: "RADIANCE_TWILIO_FROM").
 *       Per-automation `config` is left as unknown here and validated later by each recipe's own
 *       schema, so the wrapper stays decoupled from the catalogue.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06; add fields as new channels/integrations are supported.
 */

import { z } from "zod";

/** SMS provider wiring. Holds env-var names, not secrets. */
const smsChannelSchema = z.object({
  provider: z.enum(["twilio", "console"]).default("twilio"),
  /** Env var holding the E.164 sender number. */
  fromEnv: z.string().min(1),
  accountSidEnv: z.string().min(1).optional(),
  authTokenEnv: z.string().min(1).optional(),
});

/** Email provider wiring. Holds env-var names, not secrets. */
const emailChannelSchema = z.object({
  provider: z.enum(["smtp", "sendgrid", "console"]).default("smtp"),
  fromAddress: z.string().email(),
  fromName: z.string().optional(),
  apiKeyEnv: z.string().min(1).optional(),
  /** SMTP only. */
  hostEnv: z.string().min(1).optional(),
  userEnv: z.string().min(1).optional(),
  passEnv: z.string().min(1).optional(),
});

/** "HH:MM" 24h local time. */
const timeOfDay = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use 24h "HH:MM"');

export const clientConfigSchema = z.object({
  id: z.string().min(1),
  business: z.object({
    name: z.string().min(1),
    segment: z.enum(["local", "practice"]),
    timezone: z.string().default("America/Toronto"),
    locale: z.string().default("en-CA"),
    /** A sentence describing tone, injected into AI-draft prompts to keep replies on-brand. */
    brandVoice: z.string().optional(),
    replyTo: z.string().email().optional(),
    bookingLink: z.string().url().optional(),
    reviewLink: z.string().url().optional(),
  }),
  channels: z.object({
    sms: smsChannelSchema.optional(),
    email: emailChannelSchema.optional(),
    /** Don't message between these local times; the runtime defers to the next allowed window. */
    quietHours: z.object({ start: timeOfDay, end: timeOfDay }).optional(),
    /** Force every channel to the console regardless of provider - safe staging/dry-run. */
    dryRun: z.boolean().default(false),
  }),
  /** Internal alert destinations referenced by NotifyAction.to (e.g. "owner", "front-desk"). */
  notify: z
    .record(
      z.string(),
      z.object({ email: z.string().email().optional(), sms: z.string().optional() }),
    )
    .default({}),
  automations: z
    .array(
      z.object({
        id: z.string().min(1),
        recipe: z.string().min(1),
        enabled: z.boolean().default(true),
        /** Recipe-specific; validated by the recipe's own schema at plan time. */
        config: z.unknown(),
      }),
    )
    .default([]),
});

export type ClientConfig = z.infer<typeof clientConfigSchema>;
export type BusinessProfile = ClientConfig["business"];
export type AutomationInstance = ClientConfig["automations"][number];

/** Parse and validate a raw config object. Throws a readable error listing every problem. */
export function loadClientConfig(raw: unknown): ClientConfig {
  const result = clientConfigSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid client config:\n${issues}`);
  }
  return result.data;
}
