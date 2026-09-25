/**
 * What: POST /api/inbound - the webhook Twilio calls when a customer replies to one of our texts.
 *       It verifies the request, normalises it, and runs it through the inbound pipeline
 *       (parseTwilioInbound -> ingestInbound -> dispatch), which may opt the contact out, stop a
 *       campaign, confirm an appointment, or text back an AI-drafted answer.
 * Why: This is the public ingestion edge that closes the loop. Configure this URL as the
 *       "A MESSAGE COMES IN" webhook on the Twilio number, and every customer reply lands here.
 * How: Reads the urlencoded form, verifies the X-Twilio-Signature (when TWILIO_AUTH_TOKEN is set),
 *       resolves which client the destination number belongs to, then delegates to processInbound
 *       (which uses the shared, file-backed stores so opt-outs persist and outbound honours them).
 *       Replies to Twilio with empty TwiML - the customer-facing SMS reply is sent by our own
 *       dispatch through Twilio, not via this response. Branches:
 *
 *        POST /api/inbound
 *          ├─ bad signature (token set) ──▶ 403
 *          ├─ malformed payload ──────────▶ 400
 *          ├─ unknown destination number ─▶ 200 empty TwiML (nothing to do)
 *          ├─ processing error ───────────▶ 500 (Twilio retries; ingestion is idempotent)
 *          └─ ok ─────────────────────────▶ 200 empty TwiML
 * From Where: TheSkillCorner automation-engine - inbound/closed-loop layer, 2026-06.
 * When: 2026-06; mirror this as /api/inbound/email for an inbound-email-parse provider.
 */

import { consoleLogger } from "@/automations/core/logger";
import { validateTwilioSignature } from "@/automations/inbound/twilio-signature";
import type { InboundMessage } from "@/automations/inbound/types";
import { parseTwilioInbound } from "@/automations/inbound/webhook";
import { resolveClientByNumber } from "@/automations/server/clients-registry";
import { processInbound } from "@/automations/server/process-inbound";
import { readBoundedBody } from "@/lib/request-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMPTY_TWIML = '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';

function twiml(status: number): Response {
  return new Response(EMPTY_TWIML, { status, headers: { "content-type": "text/xml" } });
}

export async function POST(request: Request): Promise<Response> {
  const bounded = await readBoundedBody(request, 32 * 1024);
  if (!bounded.ok) {
    return new Response(bounded.error, { status: bounded.status });
  }

  const record: Record<string, string> = {};
  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const params = new URLSearchParams(bounded.text);
      for (const [key, value] of params.entries()) record[key] = value;
    } else {
      const formRes = new Response(Buffer.from(bounded.buffer), {
        headers: { "content-type": contentType },
      });
      const form = await formRes.formData();
      for (const [key, value] of form.entries()) record[key] = String(value);
    }
  } catch {
    return new Response("Invalid form body", { status: 400 });
  }

  // Verify the request really came from Twilio.
  // In production, missing credentials fail closed immediately.
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";

  if (isProd && !authToken) {
    consoleLogger.error("inbound rejected: TWILIO_AUTH_TOKEN missing in production");
    return new Response("Configuration error", { status: 500 });
  }

  if (authToken) {
    const signature = request.headers.get("x-twilio-signature") ?? "";
    const url = process.env.PUBLIC_INBOUND_URL ?? request.url;
    if (!signature || !validateTwilioSignature(url, record, signature, authToken)) {
      consoleLogger.warn("inbound rejected: bad Twilio signature");
      return new Response("Invalid signature", { status: 403 });
    }
  } else {
    if (process.env.ALLOW_UNSIGNED_TWILIO_WEBHOOKS_DEV !== "true") {
      consoleLogger.error(
        "inbound rejected: TWILIO_AUTH_TOKEN is missing and ALLOW_UNSIGNED_TWILIO_WEBHOOKS_DEV is not set",
      );
      return new Response("Configuration error", { status: 500 });
    }
    consoleLogger.warn(
      "inbound processing without Twilio signature verification (dev opt-in enabled)",
    );
  }

  let message: InboundMessage;
  try {
    message = parseTwilioInbound(record, new Date().toISOString());
  } catch {
    consoleLogger.warn("inbound rejected: malformed payload", {
      reason: "parse_error",
    });
    return new Response("Bad payload", { status: 400 });
  }

  const client = resolveClientByNumber(message.to);
  if (!client) {
    consoleLogger.warn("inbound for unknown destination number", {
      reason: "unmatched_destination",
    });
    return twiml(200); // nothing to process, but acknowledge so Twilio doesn't retry
  }

  try {
    const result = await processInbound(message, client);
    consoleLogger.info("inbound handled", {
      clientId: client.id,
      intent: result.ingest.interpretation.intent,
      sent: result.dispatch.sent,
      notified: result.dispatch.notified,
    });
    return twiml(200);
  } catch {
    consoleLogger.error("inbound processing failed", {
      clientId: client.id,
      reason: "internal_error",
    });
    return twiml(500); // let Twilio retry; ingestInbound dedupes on the message id
  }
}
