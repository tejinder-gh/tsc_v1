/**
 * What: POST /api/lead - validates lead submissions and forwards them to the configured
 *       webhook (Zapier / Make / n8n) with lead_source and segment on every record.
 * Why: v1 has no database; the webhook is the CRM boundary. Server-side validation is
 *      mandatory because client validation can be bypassed.
 * How: zod-parses the body against leadSchema, stamps submitted_at, forwards JSON to
 *      LEAD_WEBHOOK_URL with an 8s timeout. Branches:
 *
 *        POST /api/lead
 *          ├─ invalid JSON ──────────────▶ 400
 *          ├─ schema fails ──────────────▶ 400 (first zod issue)
 *          ├─ honeypot filled ───────────▶ 200 {ok, delivered:false} - drop + warn;
 *          │                               webhook never called, bot sees success
 *          ├─ env unset, production ─────▶ 503 - loud misconfig (VERCEL_ENV, with
 *          │                               NODE_ENV fallback off-Vercel)
 *          ├─ env unset, dev/preview ────▶ 200 {ok, delivered:false} - dev-friendly
 *          └─ forward to webhook
 *               ├─ 2xx ──────────────────▶ 200 {ok, delivered:true}
 *               └─ non-2xx / throw ──────▶ 502
 *
 *      The honeypot `website` field is stripped before forwarding so real-lead
 *      payloads are byte-identical to the pre-honeypot shape.
 *      Spam escalation trigger: the honeypot only stops form-rendering bots. If
 *      Zapier task history shows quota burn with ZERO honeypot warns in the logs
 *      (= direct curl-level POSTs), add a Vercel WAF rate-limit rule or Turnstile
 *      within 24h. Decided in /plan-eng-review Issue 9A, 2026-06-12.
 * From Where: TheSkillCorner marketing site build brief (webhook spec), 2026-06;
 *      honeypot + env guard per /plan-eng-review Engineering Spec, 2026-06-12.
 * When: 2026-06; revisit if the escalation trigger above fires.
 */

import { NextResponse } from "next/server";
import { checkPublicRateLimit } from "@/lib/rate-limit";
import { readBoundedBody } from "@/lib/request-limit";
import { leadSchema } from "@/lib/schemas";
import { captureError, trackEvent } from "@/lib/telemetry";

const DELIVERY_FAILED = "Lead delivery failed. Please try again, or email us directly.";

export async function POST(request: Request): Promise<NextResponse> {
  const rateLimit = await checkPublicRateLimit(request, {
    route: "/api/lead",
    limit: 10,
    windowSeconds: 60,
  });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.resetAfterSeconds),
        },
      },
    );
  }

  const bounded = await readBoundedBody(request, 32 * 1024);
  if (!bounded.ok) {
    return NextResponse.json({ ok: false, error: bounded.error }, { status: bounded.status });
  }

  let raw: unknown;
  try {
    raw = JSON.parse(bounded.text);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, error: issue ? issue.message : "Invalid submission" },
      { status: 400 },
    );
  }

  const { website, ...lead } = parsed.data;
  if (website) {
    console.warn("[lead] Honeypot tripped; submission dropped silently");
    return NextResponse.json({ ok: true, delivered: false });
  }

  const record = {
    ...lead,
    submitted_at: new Date().toISOString(),
  };

  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (!webhookUrl) {
    const env = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
    if (env === "production") {
      console.error("[lead] LEAD_WEBHOOK_URL is not set in production; lead rejected");
      trackEvent("lead_delivery_failed", {
        location: lead.lead_source,
        segment: lead.segment,
        reason: "missing_webhook_url",
      });
      captureError(new Error("LEAD_WEBHOOK_URL is not set in production"), {
        category: "lead_delivery",
        route: "/api/lead",
      });
      return NextResponse.json({ ok: false, error: DELIVERY_FAILED }, { status: 503 });
    }
    console.warn(
      "[lead] LEAD_WEBHOOK_URL is not set; lead accepted but not delivered (non-production)",
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.error("[lead] Webhook responded with status", response.status);
      trackEvent("lead_delivery_failed", {
        location: lead.lead_source,
        segment: lead.segment,
        reason: "webhook_status_error",
      });
      captureError(new Error(`Lead webhook delivery failed with HTTP ${response.status}`), {
        category: "lead_delivery",
        route: "/api/lead",
        extra: { status: response.status },
      });
      return NextResponse.json({ ok: false, error: DELIVERY_FAILED }, { status: 502 });
    }
  } catch (error) {
    console.error("[lead] Webhook delivery error: network_or_timeout");
    trackEvent("lead_delivery_failed", {
      location: lead.lead_source,
      segment: lead.segment,
      reason: "webhook_network_error",
    });
    captureError(error, {
      category: "lead_delivery",
      route: "/api/lead",
    });
    return NextResponse.json({ ok: false, error: DELIVERY_FAILED }, { status: 502 });
  }

  trackEvent("lead_delivery_succeeded", {
    location: lead.lead_source,
    segment: lead.segment,
  });

  return NextResponse.json({ ok: true, delivered: true });
}
