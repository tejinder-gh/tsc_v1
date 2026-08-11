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
import { booking, pricing, site } from "@/content/site";

export const dynamic = "force-static";

function buildLlmsTxt(): string {
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
- Pricing for local businesses: ${pricing.local.anchor}. ${pricing.local.detail}
- Pricing for practices and custom projects: ${pricing.practice.anchor}. ${pricing.practice.detail}
- Compliance: ${pricing.practice.compliance}
- Free 30-minute consultation/audit: ${booking.promise} Book at ${site.url}/book.
- Direct Contact: Email ${site.email} | Tel ${site.phone} | ${site.url}/contact

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
