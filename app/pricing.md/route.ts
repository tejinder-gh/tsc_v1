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
  return `# Pricing & Investment Architecture — ${site.name}

## Enterprise Engagement Framework

The Skill Corner delivers production-grade digital systems, custom AI autonomous agents, and enterprise workflow infrastructure. We do not bill hourly. All builds are scoped around verifiable operational return and high-conviction outcomes.

### 1. Diagnostic & Technical Blueprint
- **Investment**: $2,500 – $5,000 (Credited 100% toward subsequent system deployment)
- **Scope**: Complete operational constraint audit, system architecture diagram, security/compliance evaluation, and 3 scoped technical execution options.
- **Timeline**: 5 business days from intake.

### 2. Core Operational Deployments
- **Tier**: ${pricing.local.label}
- **Investment**: ${pricing.local.anchor}
- **Scope**: Single high-impact operational bottleneck (e.g. 24/7 AI Receptionist, multi-channel appointment recall, automated intake routing).
- **Details**: ${pricing.local.detail}

### 3. Bespoke Practice Infrastructure
- **Tier**: ${pricing.practice.label}
- **Investment**: ${pricing.practice.anchor}
- **Managed AI Operations**: From $2,500/month (Continuous tuning, model fine-tuning, uptime SLAs, and engineer-led monitoring)
- **Details**: ${pricing.practice.detail}
- **Compliance & Sovereignty**: ${pricing.practice.compliance}

### 4. Enterprise Digital Transformation
- **Investment**: $100,000 – $250,000+
- **Scope**: Multi-location clinics, regional logistics, and commercial firms deploying multi-agent autonomous infrastructure, custom Next.js web applications, and internal tool operating systems.

## Booking & Scoping Consultation

- **Engineering Discovery Audit**: ${booking.promise}
- **Calendar Reservation**: ${site.url}/book
- **Direct Technical Line**: ${site.email} | ${site.phone}
- **Website**: ${site.url}
`;
}

export function GET(): Response {
  return new Response(buildPricingMd(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
