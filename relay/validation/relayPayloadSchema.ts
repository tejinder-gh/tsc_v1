/**
 * What: Strict JSON schema for SMS relay payloads.
 * Why: Enforces precise bounds and prevents unknown property injection using Zod.
 *      Notice: deviceId and version are intentionally omitted from the body because
 *      they are authenticated via X-Relay-Device and X-Relay-Version headers and
 *      cryptographically bound inside the HMAC canonical request.
 */

import { z } from "zod";
import { PayloadValidationError } from "../errors/RelayError";
import type { RelayMessage, RelayPayload } from "../types/relay";

export const simMetadataSchema = z
  .object({
    slotIndex: z.number().int().min(0).optional(),
    subscriptionId: z.number().int().optional(),
  })
  .strict();

export const relayPayloadSchema = z
  .object({
    eventId: z.string().uuid({ message: "eventId must be a valid UUID" }),
    sender: z.string().min(1).max(128, { message: "sender must not exceed 128 characters" }),
    body: z.string().min(1).max(4096, { message: "body must not exceed 4096 characters" }),
    receivedAt: z.string().datetime({ message: "receivedAt must be an ISO 8601 UTC timestamp" }),
    sim: simMetadataSchema.optional(),
  })
  .strict();

/**
 * Parses raw JSON body bytes and validates against the strict Zod schema.
 */
export function validateAndParsePayload(rawBody: Buffer | string): RelayPayload {
  const text = typeof rawBody === "string" ? rawBody : rawBody.toString("utf-8");

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(text);
  } catch {
    throw new PayloadValidationError("Invalid JSON body");
  }

  const result = relayPayloadSchema.safeParse(parsedJson);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `${issue.path.join(".") || "payload"}: ${issue.message}`)
      .join("; ");
    throw new PayloadValidationError(issues);
  }

  return result.data;
}

/**
 * Combines authenticated envelope metadata with the validated event payload
 * into a single normalized RelayMessage for downstream delivery adapters.
 */
export function buildRelayMessage(
  payload: RelayPayload,
  envelope: { relayId: string; deviceId: string },
): RelayMessage {
  return {
    ...payload,
    relayId: envelope.relayId,
    deviceId: envelope.deviceId,
  };
}
