"use client";

import {
  ArrowRight,
  ArrowUpRight,
  BadgePercent,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { SectionLabel } from "@/components/ui/editorial";
import {
  COMMERCIAL_TIERS,
  type PairingRule,
  type ServiceBundle,
  type SingleBriefingItem,
} from "@/features/catalog/domain/bundles";

interface Props {
  readonly bundles: readonly ServiceBundle[];
  readonly pairings: readonly PairingRule[];
  readonly singleBriefings: readonly SingleBriefingItem[];
}

type FilterTab =
  | "headline"
  | "vertical_os"
  | "complete_stack"
  | "all"
  | "pairings"
  | "single";

export function BriefingsCatalogView({
  bundles,
  pairings,
  singleBriefings,
}: Props) {
  const [activeTab, setActiveTab] = useState<FilterTab>("headline");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBundleIds, setExpandedBundleIds] = useState<Record<string, boolean>>({});
  const [pairingCategoryFilter, setPairingCategoryFilter] = useState<string>("all");
  const searchInputId = useId();

  const toggleExpand = (id: string) => {
    setExpandedBundleIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filtered bundles calculation
  const filteredBundles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return bundles.filter((bundle) => {
      // 1. Tab criteria
      if (activeTab === "headline" && !bundle.headlineLaunch) return false;
      if (activeTab === "vertical_os" && bundle.tier !== "vertical_os") return false;
      if (
        activeTab === "complete_stack" &&
        bundle.tier !== "business_os" &&
        bundle.tier !== "complete_stack" &&
        bundle.tier !== "custom"
      ) {
        return false;
      }

      // 2. Search query criteria
      if (!q) return true;

      const inName = bundle.name.toLowerCase().includes(q);
      const inTagline = bundle.tagline.toLowerCase().includes(q);
      const inDesc = bundle.description.toLowerCase().includes(q);
      const inAudience = bundle.targetAudience.some((a) => a.toLowerCase().includes(q));
      const inRoles = bundle.roles.some(
        (r) =>
          r.roleTitle.toLowerCase().includes(q) ||
          r.automationName.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q),
      );
      const inDeliverable = bundle.deliverable.title.toLowerCase().includes(q);
      const inPairing = bundle.bestPairedWith.pairWith.toLowerCase().includes(q);

      return inName || inTagline || inDesc || inAudience || inRoles || inDeliverable || inPairing;
    });
  }, [bundles, activeTab, searchQuery]);

  // Filtered pairings calculation
  const filteredPairings = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return pairings.filter((p) => {
      if (pairingCategoryFilter !== "all" && p.category !== pairingCategoryFilter) {
        return false;
      }
      if (!q) return true;

      return (
        p.ifBuying.toLowerCase().includes(q) ||
        p.pairWith.toLowerCase().includes(q) ||
        p.because.toLowerCase().includes(q) ||
        p.strategicValue.toLowerCase().includes(q)
      );
    });
  }, [pairings, pairingCategoryFilter, searchQuery]);

  // Filtered single briefings
  const filteredSingleBriefings = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return singleBriefings;

    return singleBriefings.filter(
      (sb) =>
        sb.name.toLowerCase().includes(q) ||
        sb.roleTitle.toLowerCase().includes(q) ||
        sb.summary.toLowerCase().includes(q) ||
        sb.targetAudience.toLowerCase().includes(q),
    );
  }, [singleBriefings, searchQuery]);

  return (
    <div className="bg-[var(--tsc-paper)] min-h-screen text-[var(--tsc-ink)] font-geist pb-24">
      {/* ===================================================================== */}
      {/* 1. HERO & COMMERCIAL PHILOSOPHY SECTION                                */}
      {/* ===================================================================== */}
      <section className="relative border-b border-[var(--tsc-line)] pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16 px-6 lg:px-16 overflow-hidden">
        <div className="mx-auto max-w-[1440px]">
          {/* Eyebrow & Status Rail */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--tsc-line)] pb-4 mb-8 sm:mb-10">
            <div className="flex items-center gap-3">
              <span
                className="inline-block h-2 w-2 rounded-full bg-[var(--tsc-signal)] ring-4 ring-[var(--tsc-line)]"
                aria-hidden="true"
              />
              <SectionLabel>COMMERCIAL ARCHITECTURE &middot; THE BRIEFINGS CATALOG</SectionLabel>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs text-[var(--tsc-muted)] tracking-wider uppercase">
              <span>8 Headline Packs</span>
              <span className="text-[var(--tsc-line)]">&middot;</span>
              <span>20 Vertical OS &amp; Stacks</span>
              <span className="text-[var(--tsc-line)]">&middot;</span>
              <span className="text-[var(--tsc-action)] font-semibold">Expansion Engine Active</span>
            </div>
          </div>

          {/* Main Title & Editorial Positioning */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-end mb-12 sm:mb-14">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="text-[36px] sm:text-[50px] lg:text-[62px] font-bold leading-[1.0] tracking-[-0.035em] text-[var(--tsc-ink)]">
                The Briefings &amp;
                <br />
                Automation Catalog.
              </h1>
              <p className="text-base sm:text-lg text-[var(--tsc-muted)] leading-relaxed max-w-3xl">
                We organize our systems around a disciplined commercial hierarchy:
                <strong className="text-[var(--tsc-ink)] font-semibold">
                  {" "}Single Automation &rarr; Purpose-Built Bundle &rarr; Vertical OS &rarr; Complete Automation Stack.
                </strong>{" "}
                Bundles are not mere discounts—our automations feed each other to produce single, unified
                executive briefings rather than dozens of noisy, disconnected notifications.
              </p>
            </div>

            <div className="lg:col-span-4 lg:text-right space-y-3">
              <div className="inline-flex flex-col p-4 rounded-[6px] bg-white border border-[var(--tsc-line)] shadow-2xs text-left">
                <span className="text-[11px] font-mono tracking-widest text-[var(--tsc-muted)] uppercase mb-1">
                  COMMERCIAL RULE
                </span>
                <p className="text-xs text-[var(--tsc-ink)] font-medium leading-normal">
                  Every offer explicitly declares <strong>what it includes</strong> and{" "}
                  <strong>what it is best paired with</strong>, generating natural expansion synergy.
                </p>
              </div>
            </div>
          </div>

          {/* Value Ladder Step Strip */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 border-t border-[var(--tsc-line)]">
            {COMMERCIAL_TIERS.map((tier, idx) => (
              <div
                key={tier.tier}
                className="p-3.5 rounded-[4px] bg-white/70 border border-[var(--tsc-line)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--tsc-muted)] uppercase tracking-wider mb-1">
                    <span>{`0${idx + 1}`}</span>
                    <span className="text-[var(--tsc-action)] font-semibold">{tier.indicativeCadRange}</span>
                  </div>
                  <h2 className="text-xs font-bold text-[var(--tsc-ink)] leading-snug line-clamp-1">
                    {tier.name}
                  </h2>
                </div>
                <p className="text-[11px] text-[var(--tsc-muted)] mt-2 line-clamp-2 leading-tight">
                  {tier.scopeSummary}
                </p>
              </div>
            ))}
          </div>

          {/* Money-Back Guarantee Risk Reversal Strip */}
          <div className="mt-8 p-4 sm:p-5 rounded-[6px] border border-[var(--tsc-action)]/30 bg-gradient-to-r from-white via-[var(--tsc-surface)]/80 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-[4px] bg-[var(--tsc-action)]/10 border border-[var(--tsc-action)]/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5 text-[var(--tsc-action)]" />
              </div>
              <div>
                <span className="font-bold text-[var(--tsc-ink)] text-sm">
                  100% Money-Back Guarantee &mdash; If Not Completely Satisfied
                </span>
                <p className="text-[11px] text-[var(--tsc-muted)] mt-0.5">
                  Try any package or vertical OS for 30 days. If it does not save you hours and deliver verified commercial signal, request an immediate 100% refund.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 font-mono text-[10px] text-[var(--tsc-muted)]">
              <span className="flex items-center gap-1 text-[var(--tsc-action)] font-semibold">
                <Check className="w-3.5 h-3.5" /> 30-Day Window
              </span>
              <span>&middot;</span>
              <span className="flex items-center gap-1 text-[var(--tsc-action)] font-semibold">
                <Check className="w-3.5 h-3.5" /> Full Refund
              </span>
              <span>&middot;</span>
              <span>Zero Risk</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. CATALOG CONTROLS (TABS & SEARCH)                                   */}
      {/* ===================================================================== */}
      <section className="sticky top-[65px] z-30 bg-[var(--tsc-paper)]/95 backdrop-blur-md border-b border-[var(--tsc-line)] py-4 px-6 lg:px-16 transition-all">
        <div className="mx-auto max-w-[1440px] flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div
            role="tablist"
            aria-label="Briefings Catalog Views"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "headline"}
              onClick={() => setActiveTab("headline")}
              className={`px-3.5 py-1.5 rounded-[4px] text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "headline"
                  ? "bg-[var(--tsc-ink)] text-white shadow-2xs"
                  : "bg-white text-[var(--tsc-muted)] border border-[var(--tsc-line)] hover:text-[var(--tsc-ink)]"
              }`}
            >
              Headline 8 Packs
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "vertical_os"}
              onClick={() => setActiveTab("vertical_os")}
              className={`px-3.5 py-1.5 rounded-[4px] text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "vertical_os"
                  ? "bg-[var(--tsc-ink)] text-white shadow-2xs"
                  : "bg-white text-[var(--tsc-muted)] border border-[var(--tsc-line)] hover:text-[var(--tsc-ink)]"
              }`}
            >
              Vertical OS ($299–$499)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "complete_stack"}
              onClick={() => setActiveTab("complete_stack")}
              className={`px-3.5 py-1.5 rounded-[4px] text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "complete_stack"
                  ? "bg-[var(--tsc-ink)] text-white shadow-2xs"
                  : "bg-white text-[var(--tsc-muted)] border border-[var(--tsc-line)] hover:text-[var(--tsc-ink)]"
              }`}
            >
              Complete Stacks ($999–$2,999+)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "all"}
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-[4px] text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "all"
                  ? "bg-[var(--tsc-ink)] text-white shadow-2xs"
                  : "bg-white text-[var(--tsc-muted)] border border-[var(--tsc-line)] hover:text-[var(--tsc-ink)]"
              }`}
            >
              All 20 Packages
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "pairings"}
              onClick={() => setActiveTab("pairings")}
              className={`px-3.5 py-1.5 rounded-[4px] text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === "pairings"
                  ? "bg-[var(--tsc-action)] text-white shadow-2xs"
                  : "bg-white text-[var(--tsc-action)] border border-[var(--tsc-action)]/30 hover:bg-[var(--tsc-action)]/10"
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              Pairing Matrix (20)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "single"}
              onClick={() => setActiveTab("single")}
              className={`px-3.5 py-1.5 rounded-[4px] text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "single"
                  ? "bg-[var(--tsc-ink)] text-white shadow-2xs"
                  : "bg-white text-[var(--tsc-muted)] border border-[var(--tsc-line)] hover:text-[var(--tsc-ink)]"
              }`}
            >
              Single Briefings ($29–$149)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px] md:w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--tsc-muted)] pointer-events-none" />
            <input
              id={searchInputId}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search role, deal, tier..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-[var(--tsc-line-strong)] rounded-[4px] text-xs text-[var(--tsc-ink)] placeholder:text-[var(--tsc-muted)] focus:outline-2 focus:outline-[var(--tsc-action)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)]"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. MAIN CATALOG GRID OR PAIRING MATRIX VIEW                          */}
      {/* ===================================================================== */}
      <main className="mx-auto max-w-[1440px] px-6 lg:px-16 pt-10 sm:pt-12">
        {/* VIEW A: "BETTER PAIRED WITH" EXPANSION MATRIX */}
        {activeTab === "pairings" ? (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--tsc-line)] pb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--tsc-ink)] tracking-tight">
                  The &ldquo;Better Paired With&rdquo; Expansion Matrix
                </h2>
                <p className="text-xs sm:text-sm text-[var(--tsc-muted)] mt-1">
                  Cross-sell architecture mapping natural expansion vectors. Discovery without diligence is reckless;
                  lead signals without CRM are wasted.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { key: "all", label: "All Synergies" },
                  { key: "deals", label: "Deal Sourcing" },
                  { key: "commerce", label: "Commerce" },
                  { key: "growth", label: "B2B Growth" },
                  { key: "operations", label: "Operations" },
                  { key: "engineering", label: "Engineering" },
                  { key: "executive", label: "Executive" },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setPairingCategoryFilter(cat.key)}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-[3px] transition-all cursor-pointer ${
                      pairingCategoryFilter === cat.key
                        ? "bg-[var(--tsc-action)] text-white"
                        : "bg-white border border-[var(--tsc-line)] text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPairings.map((pair) => (
                <div
                  key={pair.id}
                  className="rounded-[6px] border border-[var(--tsc-line)] bg-white p-5 shadow-2xs hover:border-[var(--tsc-line-strong)] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[var(--tsc-muted)] uppercase">
                      <span className="px-1.5 py-0.5 rounded-[2px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)]">
                        {pair.category}
                      </span>
                      <span className="text-[var(--tsc-action)] font-semibold uppercase">
                        {pair.because}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-xs font-mono text-[var(--tsc-muted)]">IF PURCHASING:</div>
                      <div className="text-sm font-bold text-[var(--tsc-ink)]">
                        {pair.ifBuying}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[var(--tsc-line)] space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--tsc-action)] font-semibold">
                        <span>&rarr; BEST PAIRED WITH:</span>
                      </div>
                      <div className="text-sm font-bold text-[var(--tsc-ink)] bg-[var(--tsc-surface)] p-2 rounded-[4px] border border-[var(--tsc-line)]">
                        {pair.pairWith}
                      </div>
                    </div>

                    <p className="text-xs text-[var(--tsc-muted)] leading-relaxed pt-2">
                      {pair.strategicValue}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[var(--tsc-line)] flex items-center justify-between">
                    <Link
                      href="/book"
                      className="text-xs font-semibold text-[var(--tsc-action)] hover:underline inline-flex items-center gap-1"
                    >
                      Audit This Workflow <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === "single" ? (
          /* VIEW B: SINGLE SUBSCRIBABLE BRIEFINGS ($29–$149/MO) */
          <div className="space-y-8">
            <div className="border-b border-[var(--tsc-line)] pb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--tsc-ink)] tracking-tight">
                Single Subscribable Briefings &amp; Autonomous Radars
              </h2>
              <p className="text-xs sm:text-sm text-[var(--tsc-muted)] mt-1">
                Subscribe to individual standalone intelligence dispatches without committing to an entire
                multidisciplinary bundle. Ideal for focused operators solving a single bottleneck.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSingleBriefings.map((briefing) => (
                <div
                  key={briefing.id}
                  className="rounded-[6px] border border-[var(--tsc-line)] bg-white p-6 shadow-2xs flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="px-2 py-0.5 rounded-[3px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-[var(--tsc-muted)] uppercase">
                        {briefing.cadence}
                      </span>
                      <span className="font-bold text-[var(--tsc-ink)] text-sm">
                        {briefing.priceDisplay}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-mono text-[var(--tsc-action)] uppercase font-semibold">
                        [{briefing.roleTitle}]
                      </span>
                      <h3 className="text-lg font-bold text-[var(--tsc-ink)] mt-0.5">
                        {briefing.name}
                      </h3>
                      <p className="text-xs text-[var(--tsc-muted)] mt-2 leading-relaxed">
                        {briefing.summary}
                      </p>
                    </div>

                    <div className="p-3 rounded-[4px] bg-[var(--tsc-surface)]/70 border border-[var(--tsc-line)] space-y-1">
                      <div className="text-[10px] font-mono text-[var(--tsc-muted)] uppercase">
                        DELIVERABLE FORMAT
                      </div>
                      <div className="text-xs font-medium text-[var(--tsc-ink)]">
                        {briefing.deliverable}
                      </div>
                    </div>

                    <div className="text-xs text-[var(--tsc-muted)] flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--tsc-action)] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-[var(--tsc-ink)]">Best Paired With:</strong>{" "}
                        {briefing.bestPairedWith}
                      </span>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-[var(--tsc-line)] flex items-center justify-between">
                    <Link
                      href={`/newsletters/${briefing.slug}`}
                      className="text-xs font-semibold text-[var(--tsc-ink)] hover:text-[var(--tsc-action)] inline-flex items-center gap-1"
                    >
                      Read Sample Issue <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/book"
                      className="px-3 py-1.5 rounded-[4px] bg-[var(--tsc-action)] text-white text-xs font-medium hover:bg-[var(--tsc-action)]/90 transition-all"
                    >
                      Subscribe
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* VIEW C: STANDARD BUNDLES & OPERATING SYSTEMS GRID */
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--tsc-line)] pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--tsc-muted)]">
                  SHOWING {filteredBundles.length} OF {bundles.length} PACKAGES
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--tsc-ink)] tracking-tight mt-0.5">
                  {activeTab === "headline"
                    ? "Headline Launch Packages (The 8 Flagships)"
                    : activeTab === "vertical_os"
                    ? "Vertical Operating Systems (End-to-End Workflows)"
                    : activeTab === "complete_stack"
                    ? "Complete Enterprise Automation Stacks"
                    : "Complete Package & OS Inventory"}
                </h2>
              </div>
              <div className="text-xs font-mono text-[var(--tsc-muted)]">
                All prices in CAD &middot; Zero lock-in &middot; Unified deliverables
              </div>
            </div>

            {/* Zero Results State */}
            {filteredBundles.length === 0 && (
              <div className="py-16 text-center border border-dashed border-[var(--tsc-line)] rounded-[8px] bg-white p-8">
                <Search className="w-8 h-8 mx-auto text-[var(--tsc-muted)] mb-3" />
                <h3 className="text-base font-bold text-[var(--tsc-ink)]">No matching packages found</h3>
                <p className="text-xs text-[var(--tsc-muted)] mt-1 max-w-sm mx-auto">
                  Try adjusting your search terms or switch to &ldquo;All 20 Packages&rdquo; to browse the full catalog.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveTab("all");
                  }}
                  className="mt-4 px-4 py-2 bg-[var(--tsc-ink)] text-white text-xs font-medium rounded-[4px] hover:bg-black transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBundles.map((bundle) => {
                const isExpanded = expandedBundleIds[bundle.id] ?? false;

                return (
                  <article
                    key={bundle.id}
                    className={`rounded-[8px] border transition-all flex flex-col justify-between ${
                      bundle.headlineLaunch
                        ? "bg-white border-[var(--tsc-line-strong)]/80 shadow-[var(--shadow-warm-sm)]"
                        : "bg-white border-[var(--tsc-line)] shadow-2xs hover:border-[var(--tsc-line-strong)]"
                    }`}
                  >
                    {/* Top Tier Strip */}
                    <div className="p-6 pb-4 border-b border-[var(--tsc-line)]/70">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono tracking-wider uppercase font-semibold text-[var(--tsc-action)] px-2 py-0.5 rounded-[3px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)]">
                          {bundle.tierLabel}
                        </span>
                        {bundle.headlineLaunch && (
                          <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-[3px] bg-[var(--tsc-signal)] text-[var(--tsc-ink)] font-bold">
                            LAUNCH HEADLINE
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-[var(--tsc-ink)] tracking-tight">
                        {bundle.name}
                      </h3>
                      <p className="text-xs text-[var(--tsc-muted)] mt-1.5 leading-relaxed line-clamp-2">
                        {bundle.tagline}
                      </p>

                      {/* Pricing Tag */}
                      <div className="mt-4 pt-3 border-t border-[var(--tsc-line)]/60 flex items-baseline justify-between">
                        <div>
                          <div className="text-2xl font-bold text-[var(--tsc-ink)] tabular-nums">
                            {bundle.priceDisplay}
                          </div>
                          {bundle.originalPriceAmountCents > bundle.priceAmountCents && (
                            <div className="text-[11px] font-mono text-[var(--tsc-muted)]">
                              Standalone total:{" "}
                              <span className="line-through">
                                CAD ${(bundle.originalPriceAmountCents / 100).toFixed(0)}/mo
                              </span>{" "}
                              <span className="text-[var(--tsc-action)] font-semibold">
                                ({bundle.savingsPercentage}% savings)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Included AI Workers (Roles) */}
                    <div className="p-6 py-4 space-y-4 flex-1">
                      {/* Pipeline tag if present */}
                      {bundle.pipeline && (
                        <div className="text-[10px] font-mono p-2 rounded-[3px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-[var(--tsc-muted)]">
                          <strong className="text-[var(--tsc-ink)] font-semibold">PIPELINE:</strong>{" "}
                          {bundle.pipeline}
                        </div>
                      )}

                      {/* Unified Deliverable Highlight */}
                      <div className="p-3 rounded-[4px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--tsc-action)] uppercase font-semibold">
                          <Clock className="w-3 h-3" />
                          <span>UNIFIED CUSTOMER DELIVERABLE</span>
                        </div>
                        <div className="text-xs font-bold text-[var(--tsc-ink)]">
                          {bundle.deliverable.title}
                        </div>
                        <p className="text-[11px] text-[var(--tsc-muted)] leading-tight">
                          {bundle.deliverable.description}
                        </p>
                      </div>

                      {/* Included Roles List */}
                      <div>
                        <div className="text-[11px] font-mono text-[var(--tsc-muted)] uppercase tracking-wider mb-2 flex items-center justify-between">
                          <span>INCLUDES {bundle.roles.length} AI WORKERS (ROLES):</span>
                          <button
                            type="button"
                            onClick={() => toggleExpand(bundle.id)}
                            className="text-[10px] text-[var(--tsc-action)] hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            {isExpanded ? "Collapse" : "View Details"}
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                        </div>

                        <ul className="space-y-1.5">
                          {bundle.roles.slice(0, isExpanded ? bundle.roles.length : 3).map((role) => (
                            <li
                              key={role.automationName}
                              className="text-xs p-2 rounded-[3px] bg-white border border-[var(--tsc-line)]/80 space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[var(--tsc-ink)]">
                                  {role.roleTitle}
                                </span>
                                <span className="text-[10px] font-mono text-[var(--tsc-muted)]">
                                  {role.automationName}
                                </span>
                              </div>
                              {isExpanded && (
                                <p className="text-[11px] text-[var(--tsc-muted)] leading-relaxed pt-1 border-t border-[var(--tsc-line)]/50">
                                  {role.description}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>

                        {!isExpanded && bundle.roles.length > 3 && (
                          <div className="text-[10px] font-mono text-[var(--tsc-muted)] mt-1.5 text-right">
                            + {bundle.roles.length - 3} more coordinated agents included
                          </div>
                        )}
                      </div>

                      {/* "Best Paired With" Synergy Callout */}
                      <div className="p-3 rounded-[4px] bg-[var(--tsc-action)]/5 border border-[var(--tsc-action)]/20 space-y-1">
                        <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--tsc-action)] font-bold uppercase">
                          <Network className="w-3 h-3" />
                          <span>BEST PAIRED WITH</span>
                        </div>
                        <div className="text-xs font-bold text-[var(--tsc-ink)]">
                          {bundle.bestPairedWith.pairWith}
                        </div>
                        <p className="text-[11px] text-[var(--tsc-muted)] leading-tight">
                          {bundle.bestPairedWith.rationale}
                        </p>
                      </div>

                      {/* Upsell Pro Tier Option if exists */}
                      {bundle.upsellPro && (
                        <div className="p-2.5 rounded-[4px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-[var(--tsc-ink)]">
                              {bundle.upsellPro.name}
                            </span>
                            <div className="text-[10px] text-[var(--tsc-muted)]">
                              {bundle.upsellPro.summary}
                            </div>
                          </div>
                          <span className="font-mono text-xs font-bold text-[var(--tsc-action)] shrink-0 ml-2">
                            {bundle.upsellPro.priceCadDisplay}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom CTA Row */}
                    <div className="p-6 pt-4 border-t border-[var(--tsc-line)]/70 bg-[var(--tsc-surface)]/30 flex items-center justify-between gap-3">
                      <Link
                        href={`/book?package=${bundle.slug}`}
                        className="flex-1 py-2 px-3 rounded-[4px] bg-[var(--tsc-action)] text-white text-xs font-semibold text-center hover:bg-[var(--tsc-action)]/90 transition-all shadow-2xs"
                      >
                        Schedule Audit
                      </Link>
                      <Link
                        href={`/contact?package=${bundle.slug}`}
                        className="py-2 px-3 rounded-[4px] bg-white border border-[var(--tsc-line)] text-xs font-medium text-[var(--tsc-ink)] hover:border-[var(--tsc-line-strong)] transition-all text-center"
                      >
                        Inquire
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* 4. CUSTOM & MANAGED ENTERPRISE CALLOUT                                */}
        {/* ===================================================================== */}
        <div className="mt-16 sm:mt-20 p-8 sm:p-10 rounded-[8px] bg-white border border-[var(--tsc-line-strong)] shadow-[var(--shadow-warm-sm)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-[10px] font-mono tracking-wider uppercase text-[var(--tsc-action)] font-bold">
                06 // BESPOKE OPERATIONAL INFRASTRUCTURE
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--tsc-ink)] tracking-tight">
                Need bespoke autonomous workers or multi-user office infrastructure?
              </h2>
              <p className="text-sm text-[var(--tsc-muted)] leading-relaxed max-w-2xl">
                We engineer sovereign data ingestion pipelines, private RAG harnesses, and multi-tenant
                workflow engines for healthcare practices, legal partnerships, and commercial logistics firms.
                All custom engagements begin with an engineering constraint audit ($2,500–$5,000, credited 100%
                toward production deployment).
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right space-y-3">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[4px] bg-[var(--tsc-ink)] text-white text-xs font-semibold hover:bg-black transition-all shadow-sm"
              >
                Book 30-Min Engineering Audit <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-[11px] font-mono text-[var(--tsc-muted)]">
                Direct Technical Line: +1 (647) 948-9104
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
