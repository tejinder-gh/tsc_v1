"use client";

import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Loader2,
  Send,
  Sparkles,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { SectionLabel } from "@/components/ui/editorial";
import type { Newsletter } from "../domain/types";

interface Props {
  newsletters: readonly Newsletter[];
}

type ActiveTab =
  | "tech-founder-briefing"
  | "ontario-opportunity-monitor"
  | "tender-brief"
  | "custom-radar";

interface CustomRadarSpec {
  title: string;
  badge: string;
  description: string;
  outputSpec: string;
}

const CUSTOM_RADAR_SPECS: readonly CustomRadarSpec[] = [
  {
    title: "Autonomous Web & Registry Crawlers",
    badge: "01 // INGEST",
    description:
      "Automated workers crawl opaque portals, municipal databases, bankruptcy filings, and supplier pricing on deterministic crons.",
    outputSpec: "Headless Chromium · Playwright · PDF OCR · TLS Fingerprint Masking",
  },
  {
    title: "Deterministic AI Entity Extraction",
    badge: "02 // EXTRACT",
    description:
      "Strict schema enforcement converts raw text and scans into verified JSON. Guaranteed zero hallucination with rule-based fallback.",
    outputSpec: "Zod Schema Gate · Semantic De-duplication · Strict Input Allowlist",
  },
  {
    title: "Real-Time Multi-Channel Dispatches",
    badge: "03 // DISPATCH",
    description:
      "Instant push alerts to Slack channels, executive SMS, secure webhook receivers, or direct database replication within seconds.",
    outputSpec: "Slack BlockKit · Twilio SMS · Webhook HMAC Signature · Postgres Sync",
  },
];

const MONITORED_DATA_SOURCES = [
  {
    category: "GOVERNMENT & PUBLIC REGISTRIES",
    sources: [
      "Ontario Business Registry (OBR) Filings",
      "MERX Public Sector Tenders",
      "City of Toronto Procurement Bulletin",
      "Biddingo Municipal Notices",
      "Ontario Bankruptcy Trustee Gazettes",
    ],
  },
  {
    category: "APPLIED AI & ENGINEERING",
    sources: [
      "ArXiv Computer Science (AI/ML) Papers",
      "Model Release Documentation & Benchmarks",
      "GitHub Trending Autonomous Agent Repositories",
      "Production Engineering Post-Mortems",
    ],
  },
  {
    category: "COMMERCIAL & ASSET MARKETS",
    sources: [
      "Municipal Surplus Vehicle & Equipment Auctions",
      "Commercial Court Receivership Dockets",
      "Committee of Adjustment Zoning Notices",
      "Commercial Real Estate & Lease Registries",
    ],
  },
];

export function NewslettersHubView({ newsletters }: Props) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("tech-founder-briefing");
  const [selectedIssueIdx, setSelectedIssueIdx] = useState<number>(0);
  const [isExcerptExpanded, setIsExcerptExpanded] = useState<boolean>(false);

  // Master enrollment form state
  const [masterEmail, setMasterEmail] = useState("");
  const [masterBotField, setMasterBotField] = useState("");
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([
    "tech-founder-briefing",
    "ontario-opportunity-monitor",
    "tender-brief",
  ]);
  const [masterStatus, setMasterStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [masterErrorMessage, setMasterErrorMessage] = useState("");

  const formId = useId();

  // Active newsletter data
  const activeNewsletter = newsletters.find((n) => n.slug === activeTab);
  const currentIssues = activeNewsletter?.issues || [];
  const currentIssue = currentIssues[selectedIssueIdx] || currentIssues[0];

  const totalSubscribers = newsletters.reduce((sum, n) => sum + (n.subscriberCount || 0), 0);

  const toggleSlug = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const handleMasterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterEmail?.includes("@")) {
      setMasterStatus("error");
      setMasterErrorMessage("Please enter a valid work email address.");
      return;
    }

    if (selectedSlugs.length === 0) {
      setMasterStatus("error");
      setMasterErrorMessage("Please select at least one briefing to receive.");
      return;
    }

    setMasterStatus("loading");
    setMasterErrorMessage("");

    try {
      for (const slug of selectedSlugs) {
        await fetch("/api/newsletter/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: masterEmail,
            newsletterSlug: slug,
            sourceContext: "newsletters-hub-master-enrollment",
            botField: masterBotField,
          }),
        });
      }

      setMasterStatus("success");
    } catch (err: unknown) {
      setMasterStatus("error");
      setMasterErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="bg-[var(--tsc-paper)] font-geist">
      {/* ========================================================================= */}
      {/* 01. EDITORIAL INTELLIGENCE HERO                                           */}
      {/* ========================================================================= */}
      <section
        aria-labelledby="briefings-hero-heading"
        className="border-b border-[var(--tsc-line)] pt-16 pb-14 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-20"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumbs"
            className="mb-6 flex items-center gap-2 font-mono text-xs text-[var(--tsc-muted)]"
          >
            <Link href="/" className="hover:text-[var(--tsc-ink)] transition-colors">
              Home
            </Link>
            <span className="text-[var(--tsc-line)]">/</span>
            <span className="text-[var(--tsc-ink)] font-semibold uppercase">
              Executive Briefings
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-end">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <span
                  className="inline-block h-2 w-2 rounded-full bg-[var(--tsc-action)] ring-4 ring-[var(--tsc-action)]/20 animate-pulse"
                  aria-hidden="true"
                />
                <SectionLabel>MARKET INTELLIGENCE &middot; EXECUTIVE RADARS</SectionLabel>
              </div>

              <h1
                id="briefings-hero-heading"
                className="text-[38px] sm:text-[52px] lg:text-[64px] font-bold leading-[1.0] tracking-[-0.035em] text-[var(--tsc-ink)]"
              >
                High-density field intelligence.
                <br />
                Zero promotional noise.
              </h1>

              <p className="text-base sm:text-lg text-[var(--tsc-muted)] leading-relaxed max-w-2xl">
                We build automated ingestion and synthesis pipelines that scan 14+ public
                registries, model releases, and municipal tenders every day. Published openly for
                founders, investors, and operators who require signal without the social feed.
              </p>
            </div>

            {/* Live Telemetry Card */}
            <div className="lg:col-span-4 space-y-3">
              <div className="p-5 rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-2xs space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-[var(--tsc-line)] pb-2.5">
                  <span className="text-[var(--tsc-muted)] uppercase">AUDIENCE VERIFICATION</span>
                  <span className="text-[var(--tsc-action)] font-bold">
                    {totalSubscribers}+ READERS
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] text-[var(--tsc-ink)]">
                  <div className="flex justify-between">
                    <span className="text-[var(--tsc-muted)]">Active Radars:</span>
                    <span className="font-semibold">3 Canonical Dispatches</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--tsc-muted)]">Registries Scanned:</span>
                    <span className="font-semibold">14 Official Portals</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--tsc-muted)]">Signal-to-Noise:</span>
                    <span className="text-[var(--tsc-action)] font-bold">100% Uncompromised</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--tsc-muted)]">Lead Architect:</span>
                    <span>Reviewed &amp; Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 02. MASTER EXECUTIVE ALL-ACCESS SUBSCRIPTION WELL                          */}
          {/* ========================================================================= */}
          <div className="mt-10 sm:mt-12 p-6 sm:p-8 rounded-[10px] border border-[var(--tsc-line-strong)]/40 bg-white shadow-[var(--shadow-warm-xs)]">
            {masterStatus === "success" ? (
              <div className="flex items-start sm:items-center gap-3.5 font-mono text-xs">
                <CheckCircle2 className="h-5 w-5 text-[var(--tsc-action)] shrink-0 mt-0.5 sm:mt-0" />
                <div className="space-y-1">
                  <div className="font-bold text-sm sm:text-base text-[var(--tsc-ink)]">
                    All-Access Executive Enrollment Confirmed.
                  </div>
                  <p className="text-xs text-[var(--tsc-muted)]">
                    You will receive the selected briefings directly in your inbox according to
                    their respective broadcast schedules. Unsubscribe anytime with 1 click.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleMasterSubscribe} className="space-y-5">
                {/* Honeypot field */}
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    name="botField"
                    value={masterBotField}
                    onChange={(e) => setMasterBotField(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--tsc-action)] uppercase tracking-wider">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--tsc-action)]" />
                      <span>EXECUTIVE ALL-ACCESS ENROLLMENT</span>
                      <span>&middot;</span>
                      <span>ZERO PAYWALL</span>
                    </div>
                    <div className="text-base sm:text-lg font-bold text-[var(--tsc-ink)]">
                      Receive weekly and daily intelligence directly in your inbox.
                    </div>
                    <p className="text-xs text-[var(--tsc-muted)]">
                      Select which radars you want to subscribe to. Delivered on schedule with zero
                      promotional noise.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 min-w-[320px] lg:min-w-[440px]">
                    <input
                      id={`${formId}-master-email`}
                      type="email"
                      required
                      value={masterEmail}
                      onChange={(e) => setMasterEmail(e.target.value)}
                      placeholder="Enter work email..."
                      className="flex-1 bg-[var(--tsc-surface)] px-4 py-2.5 rounded-[6px] border border-[var(--tsc-line-strong)] text-[var(--tsc-ink)] text-xs sm:text-sm placeholder-[var(--tsc-muted)] focus:outline-none focus:border-[var(--tsc-action)] focus:ring-1 focus:ring-[var(--tsc-action)]"
                    />
                    <button
                      type="submit"
                      disabled={masterStatus === "loading"}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-[6px] bg-[var(--tsc-ink)] hover:bg-[var(--tsc-action)] text-white text-xs font-mono font-semibold tracking-wider uppercase transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                    >
                      {masterStatus === "loading" ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Enrolling...</span>
                        </>
                      ) : (
                        <>
                          <span>Enroll Now</span>
                          <Send className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Radar Checkbox Selector Pills */}
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[var(--tsc-line)]/70 font-mono text-xs">
                  <span className="text-[var(--tsc-muted)] uppercase text-[10px] tracking-wider">
                    SELECT RADARS:
                  </span>
                  {newsletters.map((nl) => {
                    const isChecked = selectedSlugs.includes(nl.slug);
                    return (
                      <button
                        type="button"
                        key={nl.slug}
                        onClick={() => toggleSlug(nl.slug)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border text-xs transition-colors cursor-pointer select-none ${
                          isChecked
                            ? "bg-[var(--tsc-action)]/10 border-[var(--tsc-action)]/40 text-[var(--tsc-action)] font-semibold shadow-2xs"
                            : "bg-[var(--tsc-surface)] border-[var(--tsc-line)] text-[var(--tsc-muted)] hover:bg-white"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${isChecked ? "bg-[var(--tsc-action)]" : "bg-[var(--tsc-line)]"}`}
                        />
                        <span>{nl.name}</span>
                        <span className="text-[10px] text-[var(--tsc-muted)] uppercase">
                          ({nl.cadence})
                        </span>
                      </button>
                    );
                  })}
                </div>

                {masterStatus === "error" && (
                  <p className="text-xs font-mono text-red-600">{masterErrorMessage}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03. INTERACTIVE DISPATCH TERMINAL & LIVE SPECIMEN INSPECTOR               */}
      {/* ========================================================================= */}
      <section
        id="briefings-terminal"
        aria-labelledby="briefings-terminal-heading"
        className="py-16 sm:py-20 lg:py-24 border-b border-[var(--tsc-line)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--tsc-line)] pb-5">
            <div className="space-y-1">
              <SectionLabel>ACTIVE DISPATCH TERMINAL</SectionLabel>
              <h2
                id="briefings-terminal-heading"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]"
              >
                Inspect current publications &amp; sample dispatches.
              </h2>
            </div>
            <span className="font-mono text-xs text-[var(--tsc-muted)] uppercase">
              Click tabs to switch publication specimen
            </span>
          </div>

          <div className="rounded-[10px] border border-[var(--tsc-line)] bg-white shadow-[var(--shadow-warm-sm)] overflow-hidden">
            {/* Top Publication Channel Switcher Tabs */}
            <div
              role="tablist"
              aria-label="Executive Briefing Channels"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-[var(--tsc-line)] bg-[var(--tsc-surface)]/60 divide-y sm:divide-y-0 sm:divide-x divide-[var(--tsc-line)]"
            >
              {/* Tab 1: Tech Founder Briefing */}
              <button
                type="button"
                role="tab"
                id="tab-tech-founder"
                aria-selected={activeTab === "tech-founder-briefing"}
                aria-controls="panel-hub-briefing"
                onClick={() => {
                  setActiveTab("tech-founder-briefing");
                  setSelectedIssueIdx(0);
                  setIsExcerptExpanded(false);
                }}
                className={`p-4 sm:p-5 text-left transition-all cursor-pointer relative ${
                  activeTab === "tech-founder-briefing"
                    ? "bg-white text-[var(--tsc-ink)] shadow-2xs"
                    : "text-[var(--tsc-muted)] hover:bg-white/60 hover:text-[var(--tsc-ink)]"
                }`}
              >
                {activeTab === "tech-founder-briefing" && (
                  <span className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--tsc-action)]" />
                )}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-[var(--tsc-action)]">
                    [01 &middot; APPLIED AI]
                  </span>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-[3px] bg-[var(--tsc-action)]/10 text-[var(--tsc-action)] font-semibold uppercase">
                    WEEKLY &middot; MON 11:00
                  </span>
                </div>
                <div className="font-bold text-sm sm:text-base text-[var(--tsc-ink)]">
                  Tech Founder Briefing
                </div>
                <p className="mt-1 text-xs text-[var(--tsc-muted)] line-clamp-1">
                  Agent harnesses, RAG limits &amp; engineering shifts
                </p>
              </button>

              {/* Tab 2: Ontario Opportunity Monitor */}
              <button
                type="button"
                role="tab"
                id="tab-opportunity-monitor"
                aria-selected={activeTab === "ontario-opportunity-monitor"}
                aria-controls="panel-hub-briefing"
                onClick={() => {
                  setActiveTab("ontario-opportunity-monitor");
                  setSelectedIssueIdx(0);
                  setIsExcerptExpanded(false);
                }}
                className={`p-4 sm:p-5 text-left transition-all cursor-pointer relative ${
                  activeTab === "ontario-opportunity-monitor"
                    ? "bg-white text-[var(--tsc-ink)] shadow-2xs"
                    : "text-[var(--tsc-muted)] hover:bg-white/60 hover:text-[var(--tsc-ink)]"
                }`}
              >
                {activeTab === "ontario-opportunity-monitor" && (
                  <span className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--tsc-action)]" />
                )}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-[var(--tsc-muted)]">
                    [02 &middot; DEAL RADAR]
                  </span>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-[3px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-[var(--tsc-ink)] font-semibold uppercase">
                    DAILY &middot; 07:00 AM
                  </span>
                </div>
                <div className="font-bold text-sm sm:text-base text-[var(--tsc-ink)]">
                  Ontario Opportunity Monitor
                </div>
                <p className="mt-1 text-xs text-[var(--tsc-muted)] line-clamp-1">
                  Distressed assets, auctions &amp; owner transitions
                </p>
              </button>

              {/* Tab 3: Municipal Tender Brief */}
              <button
                type="button"
                role="tab"
                id="tab-tender-brief"
                aria-selected={activeTab === "tender-brief"}
                aria-controls="panel-hub-briefing"
                onClick={() => {
                  setActiveTab("tender-brief");
                  setSelectedIssueIdx(0);
                  setIsExcerptExpanded(false);
                }}
                className={`p-4 sm:p-5 text-left transition-all cursor-pointer relative ${
                  activeTab === "tender-brief"
                    ? "bg-white text-[var(--tsc-ink)] shadow-2xs"
                    : "text-[var(--tsc-muted)] hover:bg-white/60 hover:text-[var(--tsc-ink)]"
                }`}
              >
                {activeTab === "tender-brief" && (
                  <span className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--tsc-action)]" />
                )}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-[var(--tsc-muted)]">
                    [03 &middot; PUBLIC RFPS]
                  </span>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-[3px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-[var(--tsc-ink)] font-semibold uppercase">
                    WEEKLY &middot; FRI 14:00
                  </span>
                </div>
                <div className="font-bold text-sm sm:text-base text-[var(--tsc-ink)]">
                  Municipal Tender Brief
                </div>
                <p className="mt-1 text-xs text-[var(--tsc-muted)] line-clamp-1">
                  Sub-$150k Ontario public tenders &amp; digital bids
                </p>
              </button>

              {/* Tab 4: Custom Private Radar */}
              <button
                type="button"
                role="tab"
                id="tab-custom-radar"
                aria-selected={activeTab === "custom-radar"}
                aria-controls="panel-hub-briefing"
                onClick={() => {
                  setActiveTab("custom-radar");
                  setSelectedIssueIdx(0);
                  setIsExcerptExpanded(false);
                }}
                className={`p-4 sm:p-5 text-left transition-all cursor-pointer relative ${
                  activeTab === "custom-radar"
                    ? "bg-white text-[var(--tsc-ink)] shadow-2xs"
                    : "text-[var(--tsc-muted)] hover:bg-white/60 hover:text-[var(--tsc-ink)]"
                }`}
              >
                {activeTab === "custom-radar" && (
                  <span className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--tsc-ink)]" />
                )}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-[var(--tsc-ink)] flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-[var(--tsc-action)]" />
                    [04 &middot; CUSTOM PIPELINE]
                  </span>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-[3px] bg-[var(--tsc-ink)] text-white font-semibold uppercase">
                    ENTERPRISE
                  </span>
                </div>
                <div className="font-bold text-sm sm:text-base text-[var(--tsc-ink)]">
                  Commission Private Radar
                </div>
                <p className="mt-1 text-xs text-[var(--tsc-muted)] line-clamp-1">
                  Dedicated scraping &amp; synthesis for your firm
                </p>
              </button>
            </div>

            {/* Panel 1-3: Public Publications */}
            {activeTab !== "custom-radar" && activeNewsletter && currentIssue && (
              <div
                role="tabpanel"
                id="panel-hub-briefing"
                aria-labelledby={`tab-${activeTab}`}
                className="p-6 sm:p-8 lg:p-10 space-y-8"
              >
                {/* Meta Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[var(--tsc-line)]">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[var(--tsc-ink)] uppercase">
                        MONITORED REGISTRIES:
                      </span>
                      {activeNewsletter.sourceInputs.map((source) => (
                        <span
                          key={source}
                          className="font-mono text-[11px] px-2 py-0.5 rounded-[3px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-[var(--tsc-muted)]"
                        >
                          {source}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-[var(--tsc-muted)]">
                      Audience:{" "}
                      <strong className="text-[var(--tsc-ink)]">{activeNewsletter.audience}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Issue Selector Pills */}
                    {currentIssues.length > 1 && (
                      <div className="flex items-center gap-1 bg-[var(--tsc-surface)] p-1 rounded-[6px] border border-[var(--tsc-line)]">
                        <span className="font-mono text-[10px] uppercase text-[var(--tsc-muted)] px-2">
                          ISSUE:
                        </span>
                        {currentIssues.map((issue, idx) => (
                          <button
                            key={issue.id}
                            type="button"
                            onClick={() => {
                              setSelectedIssueIdx(idx);
                              setIsExcerptExpanded(false);
                            }}
                            className={`px-2.5 py-1 rounded-[4px] font-mono text-xs font-semibold transition-colors cursor-pointer ${
                              selectedIssueIdx === idx
                                ? "bg-[var(--tsc-ink)] text-white shadow-2xs"
                                : "text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)]"
                            }`}
                          >
                            #{String(issue.issueNumber).padStart(3, "0")}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[var(--tsc-action)]/10 text-[var(--tsc-action)] border border-[var(--tsc-action)]/20 font-mono text-[11px] font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--tsc-action)] animate-pulse" />
                      <span>VERIFIED BY SENIOR ENGINEER</span>
                    </div>
                  </div>
                </div>

                {/* Main Issue Header */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--tsc-muted)]">
                    <span className="font-bold text-[var(--tsc-action)] uppercase">
                      ISSUE #{String(currentIssue.issueNumber).padStart(3, "0")}
                    </span>
                    <span>&middot;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      4-MIN READ
                    </span>
                    {currentIssue.publishedAt && (
                      <>
                        <span>&middot;</span>
                        <span>
                          PUBLISHED{" "}
                          {new Date(currentIssue.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </>
                    )}
                    <span>&middot;</span>
                    <span>{currentIssue.sourceItemCount ?? 18} INGESTION RECORDS SYNTHESIZED</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[var(--tsc-ink)] tracking-tight leading-snug">
                    {currentIssue.title}
                  </h3>

                  <p className="text-base text-[var(--tsc-ink)]/80 leading-relaxed max-w-4xl">
                    {currentIssue.summary}
                  </p>
                </div>

                {/* 3 Key Takeaways */}
                <div className="space-y-3">
                  <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--tsc-muted)] flex items-center gap-2">
                    <Terminal className="h-3.5 w-3.5 text-[var(--tsc-action)]" />
                    <span>OPERATIONAL INVARIANTS &amp; KEY FINDINGS</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentIssue.keyTakeaways.map((takeaway, idx) => (
                      <div
                        key={takeaway}
                        className="p-4 rounded-[6px] bg-[var(--tsc-surface)]/80 border border-[var(--tsc-line)] space-y-2 hover:border-[var(--tsc-action)]/50 transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-[var(--tsc-action)]">
                            TAKEAWAY #{idx + 1}
                          </span>
                          <span className="text-[10px] text-[var(--tsc-muted)] uppercase">
                            VERIFIED
                          </span>
                        </div>
                        <p className="text-xs sm:text-[13px] text-[var(--tsc-ink)] leading-relaxed font-medium">
                          {takeaway}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expandable Deep-Dive */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsExcerptExpanded(!isExcerptExpanded)}
                    className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[var(--tsc-ink)] hover:text-[var(--tsc-action)] transition-colors cursor-pointer"
                  >
                    {isExcerptExpanded ? (
                      <>
                        <span>Collapse Full Editorial Analysis</span>
                        <ChevronUp className="h-3.5 w-3.5" />
                      </>
                    ) : (
                      <>
                        <span>Read Deep-Dive Analysis Specimen</span>
                        <ChevronDown className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>

                  {isExcerptExpanded && (
                    <div className="mt-4 p-5 rounded-[6px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-xs sm:text-sm text-[var(--tsc-ink)] leading-relaxed space-y-4 font-mono">
                      <div className="flex items-center justify-between border-b border-[var(--tsc-line)] pb-2 text-[11px] text-[var(--tsc-muted)]">
                        <span>VERIFIED SYNTHESIS ENGINE &middot; {activeNewsletter.name}</span>
                        <span className="text-[var(--tsc-action)] font-bold">100% SIGNAL</span>
                      </div>
                      <div className="whitespace-pre-line text-[var(--tsc-ink)]/90 leading-normal">
                        {currentIssue.contentMarkdown}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Action Links */}
                <div className="pt-6 border-t border-[var(--tsc-line)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                  <div className="text-[var(--tsc-muted)]">
                    Cadence:{" "}
                    <strong className="text-[var(--tsc-ink)]">{activeNewsletter.cadence}</strong>{" "}
                    publication &middot; Delivered to inboxes
                  </div>
                  <Link
                    href={`/newsletters/${activeNewsletter.slug}`}
                    className="inline-flex items-center gap-1.5 text-[var(--tsc-action)] hover:underline font-semibold"
                  >
                    <span>Browse all back issues of {activeNewsletter.name}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Panel 4: Custom Private Radar */}
            {activeTab === "custom-radar" && (
              <div
                role="tabpanel"
                id="panel-hub-briefing"
                aria-labelledby="tab-custom-radar"
                className="p-6 sm:p-8 lg:p-10 space-y-8 bg-gradient-to-b from-white to-[var(--tsc-surface)]/40"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[var(--tsc-line)]">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold text-[var(--tsc-action)] uppercase">
                      PROPRIETARY ENTERPRISE INFRASTRUCTURE
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[var(--tsc-ink)] tracking-tight">
                      Commission a Dedicated Intelligence Pipeline
                    </h3>
                    <p className="text-sm text-[var(--tsc-muted)] max-w-2xl leading-relaxed">
                      Stop paying skilled staff to manually search 30 fragmented portals,
                      registries, and PDF gazettes every day. We build bespoke ingestion, OCR, and
                      deterministic alerting engines wired directly into your operations.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                    <div className="px-3 py-1.5 rounded-[4px] bg-[var(--tsc-ink)] text-white font-mono text-xs font-semibold">
                      DEPLOYMENT: 5 BUSINESS DAYS
                    </div>
                    <Link
                      href="/book"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] bg-[var(--tsc-action)] hover:opacity-90 text-white font-mono text-xs font-semibold tracking-wider uppercase transition-colors"
                    >
                      <span>Book Scoping Call</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                {/* 3 Pipeline Capabilities */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {CUSTOM_RADAR_SPECS.map((feature) => (
                    <div
                      key={feature.title}
                      className="p-5 rounded-[8px] border border-[var(--tsc-line)] bg-white space-y-3 shadow-2xs hover:border-[var(--tsc-action)] transition-colors"
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

                {/* Bottom Conversion Box */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[8px] bg-[var(--tsc-ink)] text-white">
                  <div className="space-y-1">
                    <div className="font-bold text-sm sm:text-base">
                      Ready to build an automated radar for your organization?
                    </div>
                    <p className="text-xs text-white/70">
                      We review your target data sources, model extraction schemas, and deliver a
                      functioning proof-of-concept in 5 days.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      href="/contact?topic=custom-radar"
                      className="px-4 py-2.5 rounded-[6px] bg-white text-[var(--tsc-ink)] hover:bg-[var(--tsc-paper)] text-xs font-mono font-semibold tracking-wider uppercase transition-colors"
                    >
                      Submit Radar Spec &rarr;
                    </Link>
                    <Link
                      href="/book"
                      className="px-4 py-2.5 rounded-[6px] bg-[var(--tsc-action)] hover:opacity-90 text-white text-xs font-mono font-semibold tracking-wider uppercase transition-colors"
                    >
                      Book Call
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04. COMPLETE PUBLICATION DIRECTORY & COMPARISON                           */}
      {/* ========================================================================= */}
      <section
        id="directory"
        aria-labelledby="directory-heading"
        className="py-16 sm:py-20 lg:py-24 border-b border-[var(--tsc-line)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16 space-y-10">
          <div className="max-w-3xl space-y-2">
            <SectionLabel>ACTIVE PUBLICATIONS &amp; RADARS</SectionLabel>
            <h2
              id="directory-heading"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]"
            >
              Authored briefings &amp; monitored radars.
            </h2>
            <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
              Curated by senior systems architects and operational researchers with zero
              sensationalism.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {newsletters.map((newsletter, idx) => (
              <article
                key={newsletter.id}
                className="rounded-[8px] border border-[var(--tsc-line)] bg-white p-6 sm:p-7 flex flex-col justify-between shadow-2xs hover:border-[var(--tsc-action)] transition-all group"
              >
                <div className="space-y-4">
                  {/* Top Eyebrow */}
                  <div className="flex items-center justify-between border-b border-[var(--tsc-line)]/70 pb-3 font-mono text-[11px]">
                    <span className="font-bold text-[var(--tsc-action)] uppercase">
                      [0{idx + 1} &middot; {newsletter.cadence.toUpperCase()}]
                    </span>
                    <span className="font-semibold px-2 py-0.5 rounded-[3px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-[var(--tsc-ink)] uppercase">
                      {newsletter.priceDisplay}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[var(--tsc-ink)] group-hover:text-[var(--tsc-action)] transition-colors">
                      <Link href={`/newsletters/${newsletter.slug}`}>{newsletter.name}</Link>
                    </h3>
                    <p className="mt-1 text-xs font-mono text-[var(--tsc-muted)]">
                      {newsletter.tagline}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                    {newsletter.description}
                  </p>

                  {/* Metadata Specs */}
                  <div className="p-3 bg-[var(--tsc-surface)] rounded-[6px] border border-[var(--tsc-line)]/60 space-y-2 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-[var(--tsc-muted)] uppercase block">
                        AUDIENCE:
                      </span>
                      <span className="text-[11px] font-medium text-[var(--tsc-ink)]">
                        {newsletter.audience}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--tsc-muted)] uppercase block">
                        PRIMARY SOURCES:
                      </span>
                      <span className="text-[11px] text-[var(--tsc-muted)]">
                        {newsletter.sourceInputs.slice(0, 2).join(", ")} + more
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-[var(--tsc-line)]/70 flex items-center justify-between">
                  <span className="font-mono text-xs text-[var(--tsc-muted)]">
                    {newsletter.subscriberCount} Subscribers
                  </span>
                  <Link
                    href={`/newsletters/${newsletter.slug}`}
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--tsc-ink)] group-hover:text-[var(--tsc-action)] uppercase tracking-wider"
                  >
                    <span>Read Issues</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05. DATA PROVENANCE & MONITORED REGISTRIES RADAR                          */}
      {/* ========================================================================= */}
      <section
        id="provenance"
        aria-labelledby="provenance-heading"
        className="py-16 sm:py-20 lg:py-24 border-b border-[var(--tsc-line)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16 space-y-10">
          <div className="max-w-3xl space-y-2">
            <SectionLabel>DATA PROVENANCE &amp; PIPELINE ARCHITECTURE</SectionLabel>
            <h2
              id="provenance-heading"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]"
            >
              14+ Monitored Registries &amp; Ingestion Streams
            </h2>
            <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
              Our briefings are not drafted from social feeds or aggregated listicles. Every
              dispatch originates from automated crawlers evaluating official public data stores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MONITORED_DATA_SOURCES.map((stream) => (
              <div
                key={stream.category}
                className="p-6 rounded-[8px] border border-[var(--tsc-line)] bg-white space-y-4"
              >
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--tsc-action)] uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--tsc-action)]" />
                  <span>{stream.category}</span>
                </div>

                <ul className="space-y-2 font-mono text-xs text-[var(--tsc-ink)]">
                  {stream.sources.map((source) => (
                    <li
                      key={source}
                      className="flex items-start gap-2 p-2 rounded-[4px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)]/50"
                    >
                      <span className="text-[var(--tsc-action)] font-bold">&bull;</span>
                      <span className="text-[11px]">{source}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Three-Tier Verification Engine */}
          <div className="p-6 rounded-[8px] border border-[var(--tsc-line)] bg-white space-y-4">
            <div className="font-mono text-xs font-bold uppercase text-[var(--tsc-ink)] tracking-wider">
              HOW OUR INGESTION ENGINE OPERATES
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="space-y-1.5 p-3 rounded-[6px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)]/60">
                <span className="text-[10px] font-bold text-[var(--tsc-action)] uppercase">
                  STEP 01 {"//"} CRAWL &amp; OCR
                </span>
                <div className="font-bold text-[var(--tsc-ink)]">Automated Extraction</div>
                <p className="text-[11px] text-[var(--tsc-muted)]">
                  Headless browser workers run on scheduled crons to ingest PDF filings, municipal
                  tables, and pre-print papers.
                </p>
              </div>

              <div className="space-y-1.5 p-3 rounded-[6px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)]/60">
                <span className="text-[10px] font-bold text-[var(--tsc-action)] uppercase">
                  STEP 02 {"//"} SCHEMA GATING
                </span>
                <div className="font-bold text-[var(--tsc-ink)]">Deterministic Zod Validation</div>
                <p className="text-[11px] text-[var(--tsc-muted)]">
                  LLMs extract key entities against strict schemas. Outputs failing invariant checks
                  drop to rule-based fallback.
                </p>
              </div>

              <div className="space-y-1.5 p-3 rounded-[6px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)]/60">
                <span className="text-[10px] font-bold text-[var(--tsc-action)] uppercase">
                  STEP 03 {"//"} ARCHITECT GATE
                </span>
                <div className="font-bold text-[var(--tsc-ink)]">Senior Engineer Sign-Off</div>
                <p className="text-[11px] text-[var(--tsc-muted)]">
                  Every public dispatch is reviewed and verified by a human Lead Systems Architect
                  prior to email transmission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06. THE COMMERCIAL BRIDGE: CROSS-DISCOVERY VECTORS                        */}
      {/* ========================================================================= */}
      <section
        id="cross-discovery"
        aria-labelledby="cross-discovery-heading"
        className="py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--tsc-line)] pb-5">
            <div className="space-y-1">
              <SectionLabel>PLATFORM DISCOVERY &middot; FIELD KITS</SectionLabel>
              <h2
                id="cross-discovery-heading"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]"
              >
                Explore systems beyond the briefings.
              </h2>
            </div>
            <span className="font-mono text-xs text-[var(--tsc-muted)] uppercase">
              Transparent tools &amp; verified architectures
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Diagnostic Checklist */}
            <div className="rounded-[8px] border border-[var(--tsc-line)] bg-white p-6 flex flex-col justify-between shadow-2xs hover:border-[var(--tsc-action)] transition-colors group">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[var(--tsc-action)] uppercase">
                    [ASSESSMENT &middot; 5 MIN]
                  </span>
                  <span className="text-[var(--tsc-muted)]">ZERO PAYWALL</span>
                </div>
                <h4 className="text-lg font-bold text-[var(--tsc-ink)] group-hover:text-[var(--tsc-action)] transition-colors">
                  Automation Opportunities Checklist
                </h4>
                <p className="text-xs text-[var(--tsc-muted)] leading-relaxed">
                  Calculate wasted hours across intake, scheduling, and billing before writing a
                  line of code.
                </p>
              </div>
              <div className="pt-5 mt-5 border-t border-[var(--tsc-line)]/70">
                <Link
                  href="/checklist"
                  className="w-full inline-flex items-center justify-between text-xs font-mono font-semibold text-[var(--tsc-ink)] group-hover:text-[var(--tsc-action)] uppercase tracking-wider"
                >
                  <span>Launch Diagnostic</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Card 2: Systems Blueprint Library */}
            <div className="rounded-[8px] border border-[var(--tsc-line)] bg-white p-6 flex flex-col justify-between shadow-2xs hover:border-[var(--tsc-action)] transition-colors group">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[var(--tsc-muted)] uppercase">
                    [REPOSITORY &middot; SCHEMAS]
                  </span>
                  <span className="text-[var(--tsc-ink)] font-semibold font-mono">34 VERIFIED</span>
                </div>
                <h4 className="text-lg font-bold text-[var(--tsc-ink)] group-hover:text-[var(--tsc-action)] transition-colors">
                  The Skill Corner Systems Library
                </h4>
                <p className="text-xs text-[var(--tsc-muted)] leading-relaxed">
                  Open reference architectures for AI receptionists, 2-way scheduling, and
                  autonomous workflow engines.
                </p>
              </div>
              <div className="pt-5 mt-5 border-t border-[var(--tsc-line)]/70">
                <Link
                  href="/library"
                  className="w-full inline-flex items-center justify-between text-xs font-mono font-semibold text-[var(--tsc-ink)] group-hover:text-[var(--tsc-action)] uppercase tracking-wider"
                >
                  <span>Browse 34 Blueprints</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Card 3: 24 Sector Radars */}
            <div className="rounded-[8px] border border-[var(--tsc-line)] bg-white p-6 flex flex-col justify-between shadow-2xs hover:border-[var(--tsc-action)] transition-colors group">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[var(--tsc-action)] uppercase">
                    [SECTORS &middot; MATRICES]
                  </span>
                  <span className="text-[var(--tsc-action)] font-semibold font-mono">
                    24 VERTICALS
                  </span>
                </div>
                <h4 className="text-lg font-bold text-[var(--tsc-ink)] group-hover:text-[var(--tsc-action)] transition-colors">
                  Industry-Specific Automation Radars
                </h4>
                <p className="text-xs text-[var(--tsc-muted)] leading-relaxed">
                  Explore tailored automation blueprints for dental offices, law firms, restaurants,
                  and trade contractors.
                </p>
              </div>
              <div className="pt-5 mt-5 border-t border-[var(--tsc-line)]/70">
                <Link
                  href="/industries"
                  className="w-full inline-flex items-center justify-between text-xs font-mono font-semibold text-[var(--tsc-ink)] group-hover:text-[var(--tsc-action)] uppercase tracking-wider"
                >
                  <span>View All 24 Sectors</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
