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

const SUBSCRIPTION_UNAVAILABLE =
  "Newsletter subscription is temporarily unavailable. Please try again later.";
const DELIVERY_FAILED = "Newsletter delivery failed. Please try again later.";

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

    const isProduction = (process.env.VERCEL_ENV ?? process.env.NODE_ENV) === "production";
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;

    if (!webhookUrl) {
      if (isProduction) {
        console.warn(
          JSON.stringify({
            ts: new Date().toISOString(),
            level: "warn",
            message: "newsletter_delivery_failed",
            reason: "missing_webhook_url",
            route: "/api/newsletter/subscribe",
            newsletterSlug,
          }),
        );
        return NextResponse.json(
          { success: false, error: SUBSCRIPTION_UNAVAILABLE },
          { status: 503 },
        );
      }

      console.info(
        JSON.stringify({
          ts: new Date().toISOString(),
          level: "info",
          message: "newsletter_subscription_simulated",
          route: "/api/newsletter/subscribe",
          newsletterSlug,
          reason: "unconfigured_non_production",
        }),
      );
      return NextResponse.json({
        success: true,
        delivered: false,
        message: `You've been added to the early subscriber list for ${newsletter.name}.`,
        newsletter: {
          slug: newsletter.slug,
          name: newsletter.name,
          cadence: newsletter.cadence,
        },
      });
    }

    const leadRecord = {
      email,
      lead_source: `newsletter:${newsletterSlug}`,
      segment: "newsletter_subscriber",
      page: `/newsletters/${newsletterSlug}`,
      submitted_at: new Date().toISOString(),
      consent_context: "newsletter_signup_form",
      source_context: sourceContext || "web",
    };

    let res: Response;
    try {
      res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadRecord),
        signal: AbortSignal.timeout(8000),
      });
    } catch {
      console.error(
        JSON.stringify({
          ts: new Date().toISOString(),
          level: "error",
          message: "newsletter_delivery_failed",
          reason: "webhook_network_error",
          route: "/api/newsletter/subscribe",
          newsletterSlug,
        }),
      );
      return NextResponse.json({ success: false, error: DELIVERY_FAILED }, { status: 502 });
    }

    if (!res.ok) {
      console.error(
        JSON.stringify({
          ts: new Date().toISOString(),
          level: "error",
          message: "newsletter_delivery_failed",
          reason: "webhook_status_error",
          route: "/api/newsletter/subscribe",
          newsletterSlug,
        }),
      );
      return NextResponse.json({ success: false, error: DELIVERY_FAILED }, { status: 502 });
    }

    console.info(
      JSON.stringify({
        ts: new Date().toISOString(),
        level: "info",
        message: "newsletter_delivery_succeeded",
        route: "/api/newsletter/subscribe",
        newsletterSlug,
      }),
    );

    return NextResponse.json({
      success: true,
      delivered: true,
      message: `You've been added to the early subscriber list for ${newsletter.name}.`,
      newsletter: {
        slug: newsletter.slug,
        name: newsletter.name,
        cadence: newsletter.cadence,
      },
    });
  } catch {
    console.error(
      JSON.stringify({
        ts: new Date().toISOString(),
        level: "error",
        message: "newsletter_subscription_failed",
        reason: "unexpected_error",
        route: "/api/newsletter/subscribe",
      }),
    );
    return NextResponse.json(
      { error: "An unexpected error occurred while subscribing." },
      { status: 500 },
    );
  }
}
