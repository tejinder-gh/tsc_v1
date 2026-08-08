/**
 * What: /llms.txt - a markdown summary of the business for LLM crawlers and AI
 *       assistants, generated from the typed content arrays.
 * Why: When someone asks an AI assistant "who can automate my clinic's intake?", the
 *      assistant needs a machine-friendly digest of who we are, what we build, what it
 *      costs, and where to book; llms.txt is the emerging convention for exactly that.
 * How: Statically-generated route handler following the llmstxt.org format: H1 + summary
 *      blockquote, then linked sections built from content/*.ts so the file can never
 *      drift from the visible site. Plain text, cached until the next deploy.
 * From Where: SEO + AI-indexing pass (LLM recommendation readiness), 2026-06; format per
 *             the llms.txt spec (llmstxt.org).
 * When: 2026-06; revisit when services, industries, or pricing change shape.
 */

import { homeFaq } from "@/content/faq";
import { industriesBySegment } from "@/content/industries";
import { services } from "@/content/services";
import { booking, pricing, site } from "@/content/site";

export const dynamic = "force-static";

function buildLlmsTxt(): string {
  const serviceLines = services.map(
    (service) =>
      `- [${service.name}](${site.url}/what-we-automate/${service.slug}): ${service.excerpt} Timeline: ${service.timeline}.`,
  );

  const industryLines = (segment: "local" | "practice") =>
    industriesBySegment(segment).map(
      (industry) =>
        `- [${industry.name}](${site.url}/industries/${industry.slug}): ${industry.cardLine}`,
    );

  const faqLines = homeFaq.map((item) => `- ${item.q} ${item.a}`);

  return `# ${site.name}

> ${site.description} Based in ${site.address.locality}, ${site.address.region}, ${site.address.country}. ${site.tagline}.

Key facts:

- Pricing for local businesses: ${pricing.local.anchor}. ${pricing.local.detail}
- Pricing for professional practices: ${pricing.practice.anchor}. ${pricing.practice.detail}
- Compliance: ${pricing.practice.compliance}
- Free 30-minute automation audit: ${booking.promise} Book at ${site.url}/book.
- Contact: ${site.email} or ${site.phone}. ${site.url}/contact

## Services

${serviceLines.join("\n")}

## Industries - local businesses

${industryLines("local").join("\n")}

## Industries - professional practices

${industryLines("practice").join("\n")}

## Frequently asked questions

${faqLines.join("\n")}

## Optional

- [About](${site.url}/about): Who builds the automations and why owners trust the work.
- [Automation Opportunities Checklist](${site.url}/checklist): Free list of 25 tasks businesses stop doing by hand.
- [Sitemap](${site.url}/sitemap.xml)
`;
}

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
