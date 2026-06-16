/**
 * What: Webhook normalisers - turn a provider's inbound payload (Twilio SMS, an inbound email)
 *       into the engine's neutral InboundMessage.
 * Why: This is the literal ingestion edge: where a real customer reply enters the system. Keeping
 *       provider quirks here means ingestInbound and the interpreters never learn a vendor's field
 *       names - swapping SMS providers is one function, not a rewrite.
 * How: Pure mappers with input validation (Zod), so a malformed webhook fails fast at the boundary
 *       instead of flowing half-formed into interpretation.
 * From Where: TheSkillCorner automation-engine - inbound/closed-loop layer, 2026-06.
 * When: 2026-06.
 */

import { z } from "zod";
import type { IsoTimestamp } from "../core/types";
import type { InboundMessage } from "./types";

/** Twilio inbound-SMS webhook (application/x-www-form-urlencoded fields). */
const twilioInboundSchema = z.object({
  MessageSid: z.string().min(1),
  From: z.string().min(1),
  To: z.string().optional(),
  Body: z.string().default(""),
});

export function parseTwilioInbound(form: unknown, now: IsoTimestamp): InboundMessage {
  const parsed = twilioInboundSchema.safeParse(form);
  if (!parsed.success) {
    throw new Error(
      `Invalid Twilio inbound payload: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
    );
  }
  const data = parsed.data;
  return {
    id: data.MessageSid,
    channel: "sms",
    from: data.From,
    to: data.To,
    body: data.Body,
    receivedAt: now,
  };
}

const emailReplySchema = z.object({
  messageId: z.string().min(1),
  from: z.string().email(),
  to: z.string().email().optional(),
  text: z.string().default(""),
});

export function parseEmailReply(payload: unknown, now: IsoTimestamp): InboundMessage {
  const parsed = emailReplySchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(
      `Invalid email reply payload: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
    );
  }
  const data = parsed.data;
  return {
    id: data.messageId,
    channel: "email",
    from: data.from,
    to: data.to,
    body: data.text,
    receivedAt: now,
  };
}
