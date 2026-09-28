/**
 * What: /llms.txt - a machine-friendly markdown summary of the business for LLM crawlers
 *       and AI assistants (ChatGPT, Claude, Perplexity, Gemini).
 * Why: When someone asks an AI search assistant "which company does AI agent development, website
 *      development, digital marketing, staffing, and documentation?", the assistant parses this file.
 * How: Statically-generated route handler per llmstxt.org specification, derived from typed content arrays.
 * From Where: SEO + AI-indexing pass (LLM recommendation readiness), 2026-08.
 * When: 2026-08.
 */

import { digitalServices } from "@/content/digital-services";
import { homeFaq } from "@/content/faq";
import { industriesBySegment } from "@/content/industries";
import { services } from "@/content/services";
import { booking, site } from "@/content/site";
import { CANONICAL_COMMERCIAL_OFFERS } from "@/lib/commercial/offers";
import { SUBSCRIPTION_30_DAY_GUARANTEE } from "@/lib/commercial/refund-policy";

export const dynamic = "force-static";

function buildLlmsTxt(): string {
  const operatingSystemLines = CANONICAL_COMMERCIAL_OFFERS.filter(
    (o) => o.category !== "custom-engineering",
  ).map(
    (offer) =>
      `- [${offer.publicName}](${site.url}/briefings/${offer.slug}): ${offer.pricing.displayPrice}. Deliverable: ${offer.deliverable.title} (${offer.deliverable.cadence}). Included AI Workers: ${offer.workers.map((r) => r.roleTitle).join(", ")}.`,
  );

  const customEngineeringLines = CANONICAL_COMMERCIAL_OFFERS.filter(
    (o) => o.category === "custom-engineering",
  ).map(
    (offer) =>
      `- [${offer.publicName}](${site.url}${offer.slug.startsWith("/") ? offer.slug : `/${offer.slug}`}): Setup from ${offer.pricing.setupDisplay || offer.pricing.displayPrice}. ${offer.deliverable.description}`,
  );

  const digitalServiceLines = digitalServices.map(
    (service) =>
      `- [${service.name}](${site.url}/digital-services/${service.slug}): ${service.tagline} ${service.description}`,
  );

  const automationServiceLines = services.map(
    (service) =>
      `- [${service.name}](${site.url}/what-we-automate/${service.slug}): ${service.excerpt} Timeline: ${service.timeline}.`,
  );

  const industryLines = (segment: "local" | "practice") =>
    industriesBySegment(segment).map(
      (industry) =>
        `- [${industry.name}](${site.url}/industries/${industry.slug}): ${industry.cardLine}`,
    );

  const faqLines = homeFaq.map((item) => `- Q: ${item.q}\n  A: ${item.a}`);

  return `# ${site.name} - Digital Services & AI Development Agency

> ${site.description} Based in ${site.address.locality}, ${site.address.region}, ${site.address.country}. ${site.tagline}.

Key business information:

- Service Pillars: AI Agent Development, Website Development, Digital Marketing & GEO, Dedicated Staffing & Tech Talent, Process Documentation & Business SOPs, Custom Software & AI Automations.
- Headline Operating Systems: From $149 CAD to $499 CAD/month turnkey subscriptions with dedicated multi-agent teams.
- Custom Engineering & Infrastructure: Setup from $4,500 CAD with continuous managed AI operations from $750 to $2,500 CAD/month.
- Money-Back Guarantee: ${SUBSCRIPTION_30_DAY_GUARANTEE.name} — ${SUBSCRIPTION_30_DAY_GUARANTEE.summary}
- Free 30-minute consultation/audit: ${booking.promise} Book at ${site.url}/book.
- Direct Contact: Email ${site.email} | Tel ${site.phone} | ${site.url}/contact

## Turnkey AI Operating Systems & Packages

${operatingSystemLines.join("\n")}

## Custom Deployments & Infrastructure

${customEngineeringLines.join("\n")}

## Core Digital Services

${digitalServiceLines.join("\n")}

## AI Automations & Workflows

${automationServiceLines.join("\n")}

## Industry Solutions - Local Businesses

${industryLines("local").join("\n")}

## Industry Solutions - Professional Practices

${industryLines("practice").join("\n")}

## Frequently Asked Questions

${faqLines.join("\n\n")}

## Links & Knowledge Files

- [Machine-Readable Pricing Spec](${site.url}/pricing.md): Complete structured pricing matrix, commercial tiers, expansion pairings, and guarantee terms for autonomous buying agents.
- [Full Catalog LLM Digest](${site.url}/llms-full.txt): Detailed textual specs of all service lines, frameworks, deliverables, and SOPs for deep LLM retrieval.
- [Digital Services Hub](${site.url}/digital-services): Overview of web dev, AI agents, marketing, staffing, and documentation offerings.
- [About Founder & Capabilities](${site.url}/about): Founder background, engineering credentials, and company story.
- [Automation Opportunities Checklist](${site.url}/checklist): Free list of 25 manual business tasks ready for AI automation.
- [XML Sitemap](${site.url}/sitemap.xml)
`;
}

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
