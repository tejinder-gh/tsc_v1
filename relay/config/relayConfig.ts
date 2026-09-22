/**
 * What: Core environment configuration for the SMS relay subsystem.
 * Why: Strictly validates security parameters at startup or request time
 *      using Zod. Provider-specific configuration remains isolated inside
 *      the respective delivery adapter modules.
 */

import { z } from "zod";
import { ConfigurationError } from "../errors/RelayError";

const relayConfigSchema = z.object({
  relayId: z.string().min(1, "SMS_RELAY_ID must not be empty"),
  allowedDeviceIds: z
    .array(z.string().min(1))
    .min(1, "At least one device ID must be configured in SMS_RELAY_DEVICE_ID"),
  hmacSecret: z
    .string()
    .min(16, "SMS_RELAY_HMAC_SECRET must be at least 16 characters for security"),
  timestampWindowSeconds: z.number().int().positive().default(300),
  maxBodyBytes: z.number().int().positive().default(16384), // 16 KB max
  deliveryProvider: z.enum(["email", "webhook", "dev-null"]).default("email"),
});

export type RelayConfig = z.infer<typeof relayConfigSchema>;

/**
 * Parses and validates environment variables for the relay subsystem.
 * Supports multiple device IDs via comma-delimited strings (e.g. "dev-1,dev-2")
 * while defaulting to single device usage.
 */
export function parseRelayConfig(
  env: Record<string, string | undefined> = process.env,
): RelayConfig {
  const rawRelayId = env.SMS_RELAY_ID?.trim();
  const rawDeviceId = env.SMS_RELAY_DEVICE_ID?.trim();
  const rawSecret = env.SMS_RELAY_HMAC_SECRET?.trim();
  const rawWindow = env.SMS_RELAY_TIMESTAMP_WINDOW_SECONDS?.trim();
  const rawMaxBytes = env.SMS_RELAY_MAX_BODY_BYTES?.trim();
  const rawProvider = env.SMS_RELAY_DELIVERY_PROVIDER?.trim() || "email";

  const allowedDeviceIds = rawDeviceId
    ? rawDeviceId
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const parsed = relayConfigSchema.safeParse({
    relayId: rawRelayId ?? "",
    allowedDeviceIds,
    hmacSecret: rawSecret ?? "",
    timestampWindowSeconds: rawWindow ? Number.parseInt(rawWindow, 10) : 300,
    maxBodyBytes: rawMaxBytes ? Number.parseInt(rawMaxBytes, 10) : 16384,
    deliveryProvider: rawProvider,
  });

  if (!parsed.success) {
    const messages = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new ConfigurationError(`Invalid relay configuration: ${messages}`);
  }

  return parsed.data;
}

let cachedConfig: RelayConfig | null = null;

export function getRelayConfig(
  env: Record<string, string | undefined> = process.env,
  forceRefresh = false,
): RelayConfig {
  if (forceRefresh || !cachedConfig || env !== process.env) {
    const config = parseRelayConfig(env);
    if (env === process.env && !forceRefresh) {
      cachedConfig = config;
    }
    return config;
  }
  return cachedConfig;
}

export function resetCachedRelayConfig(): void {
  cachedConfig = null;
}
