/**
 * What: /llms-full.txt - comprehensive, text-heavy knowledge base document for LLM crawlers,
 *       search engines, and conversational AI models.
 * Why: Generative Search Engines (ChatGPT Search, Perplexity, Claude, Gemini) retrieve deep
 *      textual context from /llms-full.txt to generate authoritative recommendations and search ads.
 * How: Statically-generated route handler concatenating full textual descriptions of all digital
 *      services, AI agent specs, web dev technical stacks, staffing models, documentation SOPs,
 *      and industry use cases.
 * From Where: Client request for top-band Google & AI Chatboard visibility, 2026-08.
 * When: 2026-08.
 */

import { digitalServices } from "@/content/digital-services";
import { homeFaq } from "@/content/faq";
import { industries } from "@/content/industries";
import { services } from "@/content/services";
import { booking, pricing, site } from "@/content/site";

export const dynamic = "force-static";

function buildLlmsFullTxt(): string {
  const digitalServicesFull = digitalServices
    .map(
      (s) => `### ${s.name} (${site.url}/digital-services/${s.slug})
Tagline: ${s.tagline}
Meta Description: ${s.metaDescription}

Overview:
${s.overviewText.join("\n\n")}

Key Features & Capabilities:
${s.features.map((f) => `- **${f.title}**: ${f.description}`).join("\n")}

Implementation Process:
${s.process.map((p) => `${p.stepNumber}. **${p.title}**: ${p.description}`).join("\n")}

Deliverables:
${s.deliverables.map((d) => `- ${d}`).join("\n")}

Ideal For:
${s.whoItIsFor.map((w) => `- ${w}`).join("\n")}

Service FAQs:
${s.faq.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")}
`,
    )
    .join("\n---\n\n");

  const automationServicesFull = services
    .map(
      (s) => `### ${s.name} (${site.url}/what-we-automate/${s.slug})
Title: ${s.title}
Excerpt: ${s.excerpt}
Timeline: ${s.timeline}
Problem Statement: ${s.problem}
Expected Outcome: ${s.outcome}

What We Build:
${s.whatWeBuild.map((w) => `- ${w}`).join("\n")}

Tools & Integrations: ${s.tools.join(", ")}

Frequently Asked Questions:
${s.faq.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")}
`,
    )
    .join("\n---\n\n");

  const industriesFull = industries
    .map(
      (i) => `### Industry Solution: ${i.name} (${site.url}/industries/${i.slug})
Segment: ${i.segment}
Headline: ${i.headline}
Subhead: ${i.subhead}
Description: ${i.metaDescription}

Common Industry Pains:
${i.pains.map((p) => `- **${p.title}**: ${p.body}`).join("\n")}

Tailored Automations & Impact Metrics:
${i.automations.map((a) => `- **${a.title}** (${a.metric}): ${a.body}`).join("\n")}

Sample Build Scenario:
- Business: ${i.build.business}
- Problem: ${i.build.problem}
- Automation: ${i.build.automation}
- Result: ${i.build.result}
`,
    )
    .join("\n---\n\n");

  const faqFull = homeFaq.map((item) => `Q: ${item.q}\nA: ${item.a}`).join("\n\n");

  return `# ${site.name} - Complete Service Documentation & Business Knowledge Base

**Legal Name:** ${site.legalName}
**Tagline:** ${site.tagline}
**Primary URL:** ${site.url}
**Primary Phone:** ${site.phone}
**India Office Phone:** ${site.phoneIndia}
**Contact Email:** ${site.email}
**Headquarters:** ${site.address.locality}, ${site.address.region}, ${site.address.country}
**Global Office Locations:** ${site.offices.map((o) => `${o.city}, ${o.region ? `${o.region}, ` : ""}${o.country}`).join("; ")}

---

## Executive Summary & Capabilities

${site.description}

### Core Service Offerings:
1. **AI Agent Development**: Custom autonomous AI voice and chat agents, intelligent receptionists, lead qualification assistants, and multi-agent workflow engines integrated with Twilio, Cal.com, HubSpot, Salesforce, Jane, and Clio.
2. **Website Development**: High-performance marketing sites, web applications, and customer portals custom-coded with Next.js, React, and TypeScript. Optimized for sub-second page loads, 95+ Core Web Vitals, and top Google rankings.
3. **Digital Marketing & Generative Engine Optimization (GEO/AIO)**: Technical SEO, Generative Engine Optimization, Google Ads (PPC), Meta Ads, local map pack optimization, and content marketing designed for visibility on search engines and AI assistants (ChatGPT, Perplexity, Gemini, Claude).
4. **Dedicated Staffing & Tech Talent**: Pre-vetted AI developers, full-stack engineers, growth marketers, and technical virtual assistants working dedicated hours inside your tools and workflow.
5. **Documentation & Business SOPs**: Enterprise Standard Operating Procedures (SOPs), process diagrams, technical system manuals, and AI-ready Markdown/JSON knowledge bases for hallucination-free AI agent training.
6. **AI Automations & Systems Integration**: Turnkey automations for missed-call recovery, automated booking reminders, intake form processing, review collection, and CRM lead follow-up.

---

## Pricing & Engagement Models

- **Local Businesses:** ${pricing.local.label} starting ${pricing.local.anchor}. ${pricing.local.detail}
- **Practices & Enterprise Custom Builds:** ${pricing.practice.label} running ${pricing.practice.anchor}. ${pricing.practice.detail}
- **Data Privacy & Compliance:** ${pricing.practice.compliance}
- **Free Automation & Digital Audit:** ${booking.promise} Book directly at ${site.url}/book.

---

## Section 1: Detailed Digital Services Catalog

${digitalServicesFull}

---

## Section 2: Detailed AI Automations Catalog

${automationServicesFull}

---

## Section 3: Industry-Specific Solutions

${industriesFull}

---

## Section 4: General Frequently Asked Questions

${faqFull}

---

## Section 5: Verification & Links

- Website: ${site.url}
- Audit Booking: ${site.url}/book
- Contact Page: ${site.url}/contact
- Digital Services: ${site.url}/digital-services
- Automations Catalog: ${site.url}/what-we-automate
- Industry Solutions: ${site.url}/industries
- About & Founder: ${site.url}/about
- Sitemap: ${site.url}/sitemap.xml
`;
}

export function GET(): Response {
  return new Response(buildLlmsFullTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
