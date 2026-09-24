import { NextResponse } from "next/server";
import { z } from "zod";
import { getNewsletterBySlug } from "@/features/newsletters/data/newsletters";
import { checkPublicRateLimit } from "@/lib/rate-limit";
import { readBoundedBody } from "@/lib/request-limit";

export const runtime = "nodejs";

const SubscribeSchema = z.object({
  email: z.string().email("Invalid email address").max(254),
  newsletterSlug: z.string().min(1),
  sourceContext: z.string().optional(),
  botField: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const rateLimit = await checkPublicRateLimit(request, {
      route: "/api/newsletter/subscribe",
      limit: 10,
      windowSeconds: 60,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.resetAfterSeconds),
          },
        },
      );
    }

    // Enforce 32KB payload boundary against oversized requests
    const bounded = await readBoundedBody(request, 32 * 1024);
    if (!bounded.ok) {
      return NextResponse.json({ error: bounded.error }, { status: bounded.status });
    }

    let body: unknown;
    try {
      body = JSON.parse(bounded.text);
    } catch {
      return NextResponse.json({ error: "Malformed JSON payload" }, { status: 400 });
    }

    const parseResult = SubscribeSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.flatten() },
        { status: 400 },
      );
    }

    const { email, newsletterSlug, sourceContext, botField } = parseResult.data;

    // Silent honeypot drop for bot prevention
    if (botField) {
      return NextResponse.json({ success: true, message: "Subscription confirmed." });
    }

    // Verify newsletter exists in canonical registry
    const newsletter = getNewsletterBySlug(newsletterSlug);
    if (!newsletter) {
      return NextResponse.json(
        { error: `Newsletter '${newsletterSlug}' not found.` },
        { status: 404 },
      );
    }

    // Never print full raw email PII to log streams
    const atIndex = email.indexOf("@");
    const domainPart = atIndex > -1 ? email.slice(atIndex) : "";
    const maskedPrefix = email.length > 3 ? `${email.slice(0, 3)}***` : "***";
    const maskedEmail = `${maskedPrefix}${domainPart}`;

    console.info(
      JSON.stringify({
        ts: new Date().toISOString(),
        level: "info",
        message: "newsletter_subscription_received",
        email: maskedEmail,
        newsletterSlug,
        sourceContext: sourceContext || "web",
      }),
    );

    // Forward to CRM webhook if configured (Option B: early subscriber capture)
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    let delivered = false;

    if (webhookUrl) {
      try {
        const leadRecord = {
          email,
          lead_source: `newsletter:${newsletterSlug}`,
          segment: "newsletter_subscriber",
          page: `/newsletters/${newsletterSlug}`,
          submitted_at: new Date().toISOString(),
          consent_context: "newsletter_signup_form",
          source_context: sourceContext || "web",
        };

        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadRecord),
          signal: AbortSignal.timeout(8000),
        });
        delivered = res.ok;
      } catch (webhookErr) {
        console.warn("[newsletter-subscribe] Webhook forwarding deferred/failed:", webhookErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `You've been added to the early subscriber list for ${newsletter.name}.`,
      delivered,
      newsletter: {
        slug: newsletter.slug,
        name: newsletter.name,
        cadence: newsletter.cadence,
      },
    });
  } catch (err: unknown) {
    console.error("Subscription error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while subscribing." },
      { status: 500 },
    );
  }
}
