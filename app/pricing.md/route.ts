/**
 * What: /pricing.md - a markdown summary of pricing and value ladders for AI agents,
 *       generated dynamically from typed content configurations.
 * Why: Autonomous buying agents and AI engines need structured pricing info.
 *      Generating it from content/site.ts ensures it never drifts from visible site copy.
 * How: Statically-generated route handler returning text/plain (markdown formatted).
 * From Where: AI search optimization spec, 2026-06.
 * When: 2026-06.
 */

import { booking, pricing, site } from "@/content/site";

export const dynamic = "force-static";

function buildPricingMd(): string {
  return `# Pricing — ${site.name}

## Local Business Automations

- **Tier**: ${pricing.local.label}
- **Price**: ${pricing.local.anchor}
- **Commitments**: Cancel any month, setup included.
- **Details**: ${pricing.local.detail}

## Professional Practice Automations

- **Tier**: ${pricing.practice.label}
- **Price**: ${pricing.practice.anchor}
- **Monitoring & Support**: From $1,500/month
- **Details**: ${pricing.practice.detail}
- **Compliance**: ${pricing.practice.compliance || "PIPEDA/PHIPA-aware data handling."}

## Booking & Contact

- **Free Automation Audit**: ${booking.promise} Book at ${site.url}/book
- **Contact Email**: ${site.email}
- **Contact Phone**: ${site.phone}
- **Contact Page**: ${site.url}/contact
- **Website**: ${site.url}
`;
}

export function GET(): Response {
  return new Response(buildPricingMd(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
