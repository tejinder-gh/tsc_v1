/**
 * What: POST /api/lead - validates lead submissions and forwards them to the configured
 *       webhook (Zapier / Make / n8n) with lead_source and segment on every record.
 * Why: v1 has no database; the webhook is the CRM boundary. Server-side validation is
 *      mandatory because client validation can be bypassed.
 * How: zod-parses the body against leadSchema, stamps submitted_at, forwards JSON to
 *      LEAD_WEBHOOK_URL with an 8s timeout. Missing env logs a warning and reports
 *      delivered:false (keeps local dev working) instead of failing the visitor.
 * From Where: TheSkillCorner marketing site build brief (webhook spec), 2026-06.
 * When: 2026-06; revisit if rate limiting or a second destination is needed.
 */

import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/schemas";

export async function POST(request: Request): Promise<NextResponse> {
  let raw: unknown;
  try {
    raw = await request.json();
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

  const record = {
    ...parsed.data,
    submitted_at: new Date().toISOString(),
  };

  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("[lead] LEAD_WEBHOOK_URL is not set; lead accepted but not delivered:", record);
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
      return NextResponse.json(
        { ok: false, error: "Lead delivery failed. Please try again." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("[lead] Webhook delivery error:", error);
    return NextResponse.json(
      { ok: false, error: "Lead delivery failed. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, delivered: true });
}
