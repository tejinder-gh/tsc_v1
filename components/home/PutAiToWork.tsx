"use client";

import { ArrowRight, CheckCircle2, Clock, FileText, Network, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SectionLabel } from "@/components/ui/editorial";
import { CUSTOM_RADAR_FEATURES, PROVEN_PIPELINES } from "@/content/briefings";
import { getBundleBySlug, type ServiceBundle } from "@/features/catalog/domain/bundles";
import { trackEvent } from "@/lib/telemetry";

const FEATURED_PACKAGE_SLUGS = [
  "business-buyer-os",
  "deal-hunter",
  "founder-growth-os",
  "small-business-coo",
  "ecommerce-intelligence",
] as const;

type FeaturedSlug = (typeof FEATURED_PACKAGE_SLUGS)[number];

const SAMPLE_DELIVERABLES: Record<FeaturedSlug, { type: string; sample: string }> = {
  "business-buyer-os": {
    type: "SYNTHETIC SAMPLE MEMO · MON 07:00 AM",
    sample:
      "ACQUISITION MEMO [07:00 AM] · 3 Off-Market Targets Ingested · Target #1: HVAC Mechanical Services (GTA) · Asking $1.4M · Normalized SDE $480k (2.9x) · Key-Person Dependency: LOW · Debt Service Coverage: 1.84x · Preliminary LOI Terms Generated.",
  },
  "deal-hunter": {
    type: "SYNTHETIC SAMPLE ALERT · REAL-TIME DISPATCH",
    sample:
      "ASSET RADAR ALERT [14:22 PM] · 2023 Kubota SVL75-2 Compact Track Loader · Asking $42,500 (Market comp: $58,000) · 620 Hours · Calculated resale margin: +$11,200 · Recommended offer ceiling: $39,500.",
  },
  "founder-growth-os": {
    type: "SYNTHETIC SAMPLE DOSSIER · MON 08:00 AM",
    sample:
      "PROSPECT DOSSIER [08:00 AM] · 28 Verified Accounts · Apex Logistics Inc. · Contact: VP of Dispatch · Tech: Samsara + QBO · Identified Gap: No automated after-hours driver check-in · Drafted Outreach Opener Ready.",
  },
  "small-business-coo": {
    type: "SYNTHETIC SAMPLE DIGEST · DAILY 17:30 PM",
    sample:
      "COO RECONCILIATION [17:30 PM] · 18 Inbound Calls Answered (0 Missed) · 6 New Appointments Confirmed · 4 Overdue Invoices Paid via SMS Link ($3,200 collected) · Zero Manual Rescheduling Required.",
  },
  "ecommerce-intelligence": {
    type: "SYNTHETIC SAMPLE MATRIX · DAILY 06:30 AM",
    sample:
      "SOURCING RADAR [06:30 AM] · 42 Distributor SKUs Released at Volume Tier-3 · Competitor Stockout Detected on 3 High-Volume ASINs · Recommended Reorder: 120 Units (Estimated Gross Margin: 34.2%).",
  },
};

export function PutAiToWork() {
  const [selectedSlug, setSelectedSlug] = useState<FeaturedSlug>("business-buyer-os");

  const activeBundle: ServiceBundle =
    getBundleBySlug(selectedSlug) || (getBundleBySlug("business-buyer-os") as ServiceBundle);
  const sampleSpecimen = SAMPLE_DELIVERABLES[selectedSlug];

  return (
    <section
      id="put-ai-to-work"
      aria-labelledby="put-ai-to-work-heading"
      className="relative bg-[var(--tsc-paper)] border-b border-[var(--tsc-line)] py-16 sm:py-20 lg:py-24 font-geist"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        {/* =================================================================== */}
        {/* SECTION HEADER ROW                                                  */}
        {/* =================================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--tsc-line)] pb-5 mb-10 sm:mb-14">
          <div className="flex items-center gap-3">
            <span
              className="inline-block h-2 w-2 rounded-full bg-[var(--tsc-action)] ring-4 ring-[var(--tsc-action)]/20 animate-pulse"
              aria-hidden="true"
            />
            <SectionLabel>
              04 / PUT AI TO WORK &middot; AUTOMATION WORKERS &amp; OPERATING SYSTEMS
            </SectionLabel>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs text-[var(--tsc-muted)] tracking-wider uppercase">
            <span>Role-Based AI Workers</span>
            <span className="text-[var(--tsc-line)]">&middot;</span>
            <span className="text-[var(--tsc-action)] font-semibold">
              100% Money-Back Guarantee
            </span>
            <span className="text-[var(--tsc-line)]">&middot;</span>
            <span>Zero Lock-In</span>
          </div>
        </div>

        {/* =================================================================== */}
        {/* SECTION HEADLINE & VALUE THESIS                                     */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-end mb-12 sm:mb-16">
          <div className="lg:col-span-8 space-y-4">
            <h2
              id="put-ai-to-work-heading"
              className="text-[34px] sm:text-[48px] lg:text-[56px] font-bold leading-[1.0] tracking-[-0.035em] text-[var(--tsc-ink)]"
            >
              Put AI to work.
              <br />
              Operating real business roles.
            </h2>
            <p className="text-base sm:text-lg text-[var(--tsc-muted)] leading-relaxed max-w-2xl">
              We do not sell vague chat prompts or generic AI assistants. We organize coordinated
              autonomous workers into strict operational roles—
              <strong className="text-[var(--tsc-ink)] font-semibold">
                Scouts, Financial Analysts, Diligence Agents, CRMs, and Capital Controllers
              </strong>
              . Bundles aren&apos;t just discounts: every worker feeds the next to produce one
              unified executive deliverable.
            </p>
          </div>

          <div className="lg:col-span-4 lg:text-right space-y-2">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-[4px] bg-white border border-[var(--tsc-action)]/40 text-xs font-mono text-[var(--tsc-ink)] shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[var(--tsc-action)]" />
              <span>
                Risk Reversal:{" "}
                <strong className="text-[var(--tsc-action)] font-semibold">
                  30-Day Money-Back Guarantee
                </strong>
              </span>
            </div>
            <p className="text-[11px] font-mono text-[var(--tsc-muted)]">
              If not completely satisfied, receive a 100% refund. Zero friction.
            </p>
          </div>
        </div>

        {/* =================================================================== */}
        {/* INTERACTIVE PACKAGE & ROLE TERMINAL                                 */}
        {/* =================================================================== */}
        <div className="rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-[var(--shadow-warm-sm)] overflow-hidden">
          {/* Top Package Switcher Tabs */}
          <div
            role="tablist"
            aria-label="Headline Commercial Operating Systems"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 border-b border-[var(--tsc-line)] bg-[var(--tsc-surface)]/60 divide-x divide-y md:divide-y-0 divide-[var(--tsc-line)]"
          >
            {[
              {
                slug: "business-buyer-os" as const,
                title: "Business Buyer OS",
                price: "$249/mo",
                badge: "FLAGSHIP M&A",
              },
              {
                slug: "deal-hunter" as const,
                title: "Deal Hunter Pack",
                price: "$149/mo",
                badge: "ASSET ARBITRAGE",
              },
              {
                slug: "founder-growth-os" as const,
                title: "Founder Growth OS",
                price: "$299/mo",
                badge: "B2B PIPELINE",
              },
              {
                slug: "small-business-coo" as const,
                title: "Small Business COO",
                price: "$499/mo",
                badge: "OPERATIONS",
              },
              {
                slug: "ecommerce-intelligence" as const,
                title: "E-Commerce Launch",
                price: "$199/mo",
                badge: "SOURCING",
              },
            ].map((tab) => {
              const isSelected = selectedSlug === tab.slug;
              return (
                <button
                  key={tab.slug}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => {
                    setSelectedSlug(tab.slug);
                    trackEvent("package_selected", { package_id: tab.slug, price: tab.price });
                  }}
                  className={`p-4 text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? "bg-white text-[var(--tsc-ink)] shadow-2xs"
                      : "text-[var(--tsc-muted)] hover:bg-white/60 hover:text-[var(--tsc-ink)]"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--tsc-action)]" />
                  )}
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="font-bold text-[var(--tsc-action)] uppercase">
                      {tab.badge}
                    </span>
                    <span className="font-bold text-[var(--tsc-ink)]">{tab.price}</span>
                  </div>
                  <div className="font-bold text-sm text-[var(--tsc-ink)] line-clamp-1">
                    {tab.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Package Showcase Panel */}
          <div className="p-6 sm:p-8 lg:p-10 space-y-8 bg-white">
            {/* Header Meta Row */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-[var(--tsc-line)]">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-[3px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-[10px] font-mono uppercase font-semibold text-[var(--tsc-action)]">
                    {activeBundle.tierLabel}
                  </span>
                  {activeBundle.pipeline && (
                    <span className="px-2 py-0.5 rounded-[3px] bg-[var(--tsc-surface)] text-[10px] font-mono text-[var(--tsc-muted)]">
                      {activeBundle.pipeline}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[var(--tsc-ink)] tracking-tight">
                  {activeBundle.name}
                </h3>
                <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
                  {activeBundle.description}
                </p>
              </div>

              {/* Price Tag & Action */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
                <div className="text-left lg:text-right">
                  <div className="text-3xl font-bold text-[var(--tsc-ink)] tabular-nums">
                    {activeBundle.priceDisplay}
                  </div>
                  {activeBundle.originalPriceAmountCents > activeBundle.priceAmountCents && (
                    <div className="text-xs font-mono text-[var(--tsc-muted)]">
                      Standalone total:{" "}
                      <span className="line-through">
                        CAD ${(activeBundle.originalPriceAmountCents / 100).toFixed(0)}/mo
                      </span>{" "}
                      <span className="text-[var(--tsc-action)] font-semibold">
                        ({activeBundle.savingsPercentage}% savings)
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/book?package=${activeBundle.slug}`}
                    onClick={() => {
                      trackEvent("cta_clicked", {
                        cta: "deploy_this_stack",
                        package_id: activeBundle.slug,
                        destination: "/book",
                      });
                    }}
                    className="px-4 py-2 rounded-[4px] bg-[var(--tsc-action)] hover:bg-[var(--tsc-action)]/90 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-all shadow-2xs"
                  >
                    Deploy This Stack
                  </Link>
                  <Link
                    href="/briefings"
                    onClick={() => {
                      trackEvent("cta_clicked", {
                        cta: "view_all_packages",
                        destination: "/briefings",
                      });
                    }}
                    className="px-3 py-2 rounded-[4px] bg-white border border-[var(--tsc-line)] text-xs font-mono font-medium text-[var(--tsc-ink)] hover:border-[var(--tsc-line-strong)] transition-all"
                  >
                    View All 20 &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* AI Workers (Roles) Breakdown */}
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-[var(--tsc-ink)] uppercase">
                  INCLUDED AI WORKERS (COORDINATED OPERATIONAL ROLES):
                </span>
                <span className="text-[var(--tsc-action)] font-semibold">
                  {activeBundle.roles.length} Specialized Workers Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeBundle.roles.map((role) => (
                  <div
                    key={role.automationName}
                    className="p-4 rounded-[6px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/40 hover:bg-white hover:border-[var(--tsc-action)] transition-all space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-[var(--tsc-muted)] uppercase mb-1">
                        <span className="text-[var(--tsc-action)] font-bold">
                          [{role.roleTitle}]
                        </span>
                        <span>AI WORKER</span>
                      </div>
                      <div className="font-bold text-sm text-[var(--tsc-ink)]">
                        {role.automationName}
                      </div>
                      <p className="text-xs text-[var(--tsc-muted)] leading-relaxed mt-1.5">
                        {role.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[var(--tsc-line)]/50 flex flex-wrap gap-1">
                      {role.capabilities.slice(0, 3).map((cap) => (
                        <span
                          key={cap}
                          className="px-1.5 py-0.5 rounded-[2px] bg-white border border-[var(--tsc-line)] text-[9px] font-mono text-[var(--tsc-muted)]"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Unified Deliverable & Best Paired With Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Deliverable Box */}
              <div className="p-4 rounded-[6px] border border-[var(--tsc-line)] bg-white space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--tsc-action)] uppercase font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>UNIFIED CUSTOMER DELIVERABLE</span>
                </div>
                <div className="text-sm font-bold text-[var(--tsc-ink)]">
                  {activeBundle.deliverable.title} &middot;{" "}
                  <span className="text-xs font-normal text-[var(--tsc-muted)]">
                    {activeBundle.deliverable.cadence}
                  </span>
                </div>
                <p className="text-xs text-[var(--tsc-muted)] leading-relaxed">
                  {activeBundle.deliverable.description}
                </p>
                {sampleSpecimen && (
                  <div className="mt-3 pt-2.5 border-t border-[var(--tsc-line)]">
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-[var(--tsc-muted)] uppercase tracking-wider mb-1">
                      <FileText className="w-3 h-3 text-[var(--tsc-action)]" />
                      <span>{sampleSpecimen.type}</span>
                    </div>
                    <div className="p-2.5 rounded-[4px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] font-mono text-[11px] text-[var(--tsc-ink)] leading-relaxed">
                      {sampleSpecimen.sample}
                    </div>
                  </div>
                )}
              </div>

              {/* Pairing Expansion Box */}
              <div className="p-4 rounded-[6px] border border-[var(--tsc-action)]/20 bg-[var(--tsc-action)]/5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--tsc-action)] font-bold uppercase">
                  <Network className="w-3.5 h-3.5" />
                  <span>BEST PAIRED WITH</span>
                </div>
                <div className="text-sm font-bold text-[var(--tsc-ink)]">
                  {activeBundle.bestPairedWith.pairWith}
                </div>
                <p className="text-xs text-[var(--tsc-muted)] leading-relaxed">
                  {activeBundle.bestPairedWith.rationale}
                </p>
              </div>
            </div>

            {/* Upsell Pro Tier Banner if exists */}
            {activeBundle.upsellPro && (
              <div className="p-4 rounded-[6px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--tsc-ink)]">
                      Upgrade to {activeBundle.upsellPro.name}
                    </span>
                    <span className="font-mono text-xs font-bold text-[var(--tsc-action)]">
                      {activeBundle.upsellPro.priceCadDisplay}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--tsc-muted)] mt-0.5">
                    {activeBundle.upsellPro.summary}
                  </p>
                </div>
                <Link
                  href="/book"
                  className="text-xs font-semibold text-[var(--tsc-action)] hover:underline inline-flex items-center gap-1 shrink-0"
                >
                  Configure Pro Tier <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* MONEY-BACK GUARANTEE CALLOUT (HIGH-TRUST RISK REVERSAL)             */}
        {/* =================================================================== */}
        <div className="mt-8 rounded-[8px] border-2 border-[var(--tsc-action)]/30 bg-gradient-to-r from-white via-[var(--tsc-surface)]/60 to-white p-6 sm:p-8 shadow-[var(--shadow-warm-sm)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-[6px] bg-[var(--tsc-action)]/10 border border-[var(--tsc-action)]/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-6 w-6 text-[var(--tsc-action)]" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-[var(--tsc-action)] px-2 py-0.5 rounded-[3px] bg-[var(--tsc-action)]/10">
                    100% RISK REVERSAL
                  </span>
                  <span className="font-mono text-[10px] text-[var(--tsc-muted)] uppercase">
                    30-DAY EVALUATION
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--tsc-ink)] tracking-tight">
                  Money-Back Guarantee &mdash; If Not Completely Satisfied
                </h3>
                <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed max-w-2xl">
                  Deploy any automation package or vertical operating system for 30 days. If the
                  system does not demonstrably return hours to your week and deliver verified
                  commercial opportunities, email us for an immediate, unconditional 100% refund. No
                  friction. No awkward questions. We only get paid when our AI workers genuinely
                  perform.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--tsc-ink)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--tsc-action)]" />
                <span>Zero Long-Term Lock-in</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--tsc-ink)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--tsc-action)]" />
                <span>100% Full Refund Policy</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--tsc-ink)]">
                <CheckCircle2 className="w-4 h-4 text-[var(--tsc-action)]" />
                <span>Human Architect Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* PROVEN AUTOMATION PIPELINES (MOVED FROM BRIEFINGS SECTION)          */}
        {/* =================================================================== */}
        <div className="mt-12 sm:mt-16 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--tsc-line)] pb-4">
            <div>
              <span className="font-mono text-[10px] font-bold text-[var(--tsc-muted)] uppercase tracking-wider">
                INFRASTRUCTURE &middot; PROVEN PRODUCTION RUNS
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--tsc-ink)] tracking-tight mt-0.5">
                Bespoke Scraping, Extraction &amp; Real-Time Dispatch Engines
              </h3>
            </div>
            <Link
              href="/briefings"
              className="text-xs font-semibold text-[var(--tsc-action)] hover:underline inline-flex items-center gap-1 font-mono"
            >
              Browse 20 Coordinated Packages &rarr;
            </Link>
          </div>

          {/* 3 Technical Execution Phases */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CUSTOM_RADAR_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="p-5 rounded-[6px] border border-[var(--tsc-line)] bg-white space-y-3 shadow-2xs hover:border-[var(--tsc-line-strong)] transition-all"
              >
                <div className="font-mono text-[10px] font-bold text-[var(--tsc-action)] tracking-wider">
                  {feature.badge}
                </div>
                <h4 className="text-base font-bold text-[var(--tsc-ink)] leading-snug">
                  {feature.title}
                </h4>
                <p className="text-xs text-[var(--tsc-muted)] leading-relaxed">
                  {feature.description}
                </p>
                <div className="pt-2 border-t border-[var(--tsc-line)]/70">
                  <div className="font-mono text-[10px] text-[var(--tsc-muted)] uppercase tracking-wider mb-1">
                    TECH SPECIFICATION:
                  </div>
                  <div className="font-mono text-[11px] font-medium text-[var(--tsc-ink)] bg-[var(--tsc-surface)] p-2 rounded-[4px] border border-[var(--tsc-line)]/60">
                    {feature.outputSpec}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 3 Production Run Specimens */}
          <div className="rounded-[8px] border border-[var(--tsc-line)] bg-white p-5 space-y-4">
            <div className="flex items-center justify-between font-mono text-xs border-b border-[var(--tsc-line)] pb-3">
              <span className="font-bold text-[var(--tsc-ink)] uppercase">
                PROVEN CLIENT PIPELINE ARCHITECTURES
              </span>
              <span className="text-[var(--tsc-action)] font-semibold">
                DETERMINISTIC SCHEMA GATE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              {PROVEN_PIPELINES.map((pipeline) => (
                <div
                  key={pipeline.title}
                  className="p-3.5 bg-[var(--tsc-surface)]/60 rounded-[4px] border border-[var(--tsc-line)] space-y-1.5"
                >
                  <span className="text-[10px] font-bold text-[var(--tsc-action)] uppercase">
                    {pipeline.category}
                  </span>
                  <div className="font-bold text-[var(--tsc-ink)] text-sm">{pipeline.title}</div>
                  <p className="text-[11px] text-[var(--tsc-muted)] leading-relaxed">
                    {pipeline.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
