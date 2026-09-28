/**
 * What: /pricing.md - a markdown summary of pricing and value ladders for AI agents,
 *       generated dynamically from typed content configurations.
 * Why: Autonomous buying agents and AI engines need structured pricing info.
 *      Generating it from content/site.ts and features/catalog/domain/bundles.ts
 *      ensures it never drifts from visible site copy.
 * How: Statically-generated route handler returning text/plain (markdown formatted).
 * From Where: AI search optimization spec & Briefings Catalog architecture, 2026.
 * When: 2026.
 */

import { booking, pricing, site } from "@/content/site";
import {
  COMMERCIAL_TIERS,
  getHeadlineBundles,
  getTopTierStacks,
  PAIRING_MATRIX,
  SINGLE_BRIEFINGS,
} from "@/features/catalog/domain/bundles";
import {
  CUSTOM_ENGINEERING_ENGAGEMENT_POLICY,
  SUBSCRIPTION_30_DAY_GUARANTEE,
} from "@/lib/commercial/refund-policy";

export const dynamic = "force-static";

function buildPricingMd(): string {
  const headlineBundles = getHeadlineBundles();
  const topTierStacks = getTopTierStacks();

  const tiersTable = COMMERCIAL_TIERS.map(
    (t) => `| **${t.name}** | ${t.indicativeCadRange} | ${t.description} |`,
  ).join("\n");

  const headlineSections = headlineBundles
    .map((b) => {
      const rolesList = b.roles
        .map((r) => `- **${r.roleTitle}** (${r.automationName}): ${r.description}`)
        .join("\n");

      const pairingText = `- **Best Paired With**: ${b.bestPairedWith.pairWith} — *${b.bestPairedWith.rationale}*`;
      const upsellText = b.upsellPro
        ? `- **Pro Upsell**: ${b.upsellPro.name} (${b.upsellPro.priceCadDisplay}) — ${b.upsellPro.summary}`
        : "";

      return `### ${b.name} — ${b.priceDisplay}
**Tier:** ${b.tierLabel}  
**Unified Deliverable:** ${b.deliverable.title} (${b.deliverable.cadence})  
**Target:** ${b.targetAudience.join(", ")}  

**Included AI Workers (Roles):**
${rolesList}

${pairingText}
${upsellText ? `${upsellText}\n` : ""}`;
    })
    .join("\n\n");

  const topTierSections = topTierStacks
    .map((b) => {
      const rolesList = b.roles
        .map((r) => `- **${r.roleTitle}** (${r.automationName}): ${r.description}`)
        .join("\n");

      return `### ${b.name} — ${b.priceDisplay}
**Tier:** ${b.tierLabel}  
**Deliverable:** ${b.deliverable.title} (${b.deliverable.format})  
**Summary:** ${b.description}  

**Core Operating Clusters:**
${rolesList}

- **Best Paired With**: ${b.bestPairedWith.pairWith} — *${b.bestPairedWith.rationale}*`;
    })
    .join("\n\n");

  const pairingsTable = PAIRING_MATRIX.map(
    (p) => `| **${p.ifBuying}** | **${p.pairWith}** | ${p.because} | ${p.strategicValue} |`,
  ).join("\n");

  const singleBriefingsTable = SINGLE_BRIEFINGS.map(
    (sb) => `| **${sb.name}** | ${sb.priceDisplay} | ${sb.cadence} | ${sb.summary} |`,
  ).join("\n");

  return `# Pricing & Commercial Architecture — ${site.name}

> Commercial Hierarchy: **Single Automation (CAD $49–99/mo) → Purpose-Built Bundle (CAD $99–199/mo) → Vertical OS (CAD $249–499/mo) → Business OS (CAD $999/mo) → Complete Automation Stack (CAD $1,499–1,999/mo) → Custom / Managed Infrastructure (From CAD $2,500/mo + setup)**

---

## 1. Commercial Pricing Architecture & Tiers

| Tier | Indicative Pricing (CAD) | Scope & Architecture |
| :--- | :--- | :--- |
${tiersTable}

---

## 2. Headline Launch Packages (Launch Lineup)

${headlineSections}

---

## 3. Complete Enterprise Operating Stacks

${topTierSections}

---

## 4. Single Subscribable Briefings ($49–$99/mo)

Clients can subscribe to individual autonomous briefings and radars without committing to a full package:

| Briefing / Radar | Price (CAD) | Cadence | Focus |
| :--- | :--- | :--- | :--- |
${singleBriefingsTable}

---

## 5. "Better Paired With" Expansion Matrix

Our commercial model creates natural expansion revenue by pairing discovery with execution, intelligence with pipeline, and signals with diligence:

| If Buying... | Pair With... | Synergy | Strategic Expansion Rationale |
| :--- | :--- | :--- | :--- |
${pairingsTable}

---

## 6. Risk Reversal: ${SUBSCRIPTION_30_DAY_GUARANTEE.name}

${SUBSCRIPTION_30_DAY_GUARANTEE.summary}

- **Eligible Offers**: All monthly subscription packages, turnkey bundles, and autonomous operating systems.
- **Guarantee Window**: ${SUBSCRIPTION_30_DAY_GUARANTEE.guaranteePeriodDays} calendar days from initial subscription start date.
- **Refund Scope**: ${SUBSCRIPTION_30_DAY_GUARANTEE.refundPercentage}% full refund of recurring subscription fees paid for the initial 30-day evaluation period.
- **Claim Process**: ${SUBSCRIPTION_30_DAY_GUARANTEE.claimMethod}
- **Initiation & Settlement**: ${SUBSCRIPTION_30_DAY_GUARANTEE.businessInitiationTimeline}. ${SUBSCRIPTION_30_DAY_GUARANTEE.externalSettlementNote}

---

## 7. Enterprise Engagement Framework (Bespoke Builds)

For enterprise organizations requiring bespoke agentic software development, sovereign RAG infrastructure, or custom workflows:

### Diagnostic & Technical Blueprint
- **Investment**: $2,500 – $5,000 preliminary architecture discovery
- **Scope**: Complete operational constraint audit, system architecture diagram, security/compliance evaluation, and scoped technical execution options.
- **Milestone Policy**: ${CUSTOM_ENGINEERING_ENGAGEMENT_POLICY.summary}

### Core Operational Deployments
- **Tier**: ${pricing.local.label}
- **Investment**: ${pricing.local.anchor}
- **Scope**: Single high-impact operational bottleneck (e.g. 24/7 AI Receptionist, multi-channel appointment recall, automated intake routing).
- **Details**: ${pricing.local.detail}

### Bespoke Practice Infrastructure
- **Tier**: ${pricing.practice.label}
- **Investment**: ${pricing.practice.anchor}
- **Managed AI Operations**: From $2,500/month (Continuous tuning, model fine-tuning, uptime SLAs, and engineer-led monitoring)
- **Details**: ${pricing.practice.detail}
- **Compliance & Sovereignty**: ${pricing.practice.compliance}

### Enterprise Digital Transformation
- **Investment**: $100,000 – $250,000+
- **Scope**: Multi-location clinics, regional logistics, and commercial firms deploying multi-agent autonomous infrastructure, custom Next.js web applications, and internal tool operating systems.

---

## 8. Booking & Scoping Consultation

- **Engineering Discovery Audit**: ${booking.promise}
- **Calendar Reservation**: ${site.url}/book
- **Briefings Catalog**: ${site.url}/briefings
- **Direct Technical Line**: ${site.email} | ${site.phone}
- **Terms & Legal**: ${site.url}/legal/terms
- **Website**: ${site.url}
`;
}

export function GET(): Response {
  return new Response(buildPricingMd(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
