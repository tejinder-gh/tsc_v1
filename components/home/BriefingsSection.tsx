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
import { CUSTOM_RADAR_FEATURES, DISCOVERY_VECTORS, PROVEN_PIPELINES } from "@/content/briefings";
import { CANONICAL_NEWSLETTERS } from "@/features/newsletters/data/newsletters";

type ActiveTab =
  | "tech-founder-briefing"
  | "ontario-opportunity-monitor"
  | "tender-brief"
  | "custom-radar";

export function BriefingsSection() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("tech-founder-briefing");
  const [selectedIssueIdx, setSelectedIssueIdx] = useState<number>(0);
  const [isExcerptExpanded, setIsExcerptExpanded] = useState<boolean>(false);

  // In-line subscription form state
  const [email, setEmail] = useState("");
  const [botField, setBotField] = useState("");
  const [subscribeAll, setSubscribeAll] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [subscribedPubName, setSubscribedPubName] = useState("");

  const formId = useId();

  // Active newsletter data
  const activeNewsletter = CANONICAL_NEWSLETTERS.find((n) => n.slug === activeTab);
  const currentIssues = activeNewsletter?.issues || [];
  const currentIssue = currentIssues[selectedIssueIdx] || currentIssues[0];

  const handleTabChange = (newTab: ActiveTab) => {
    setActiveTab(newTab);
    setSelectedIssueIdx(0);
    setIsExcerptExpanded(false);
    setStatus("idle");
    setErrorMessage("");
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email?.includes("@")) {
      setStatus("error");
      setErrorMessage("Please enter a valid work email address.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const primarySlug = activeTab === "custom-radar" ? "tech-founder-briefing" : activeTab;
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newsletterSlug: primarySlug,
          sourceContext: `home-briefings-section:${activeTab}`,
          botField,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Subscription request failed.");
      }

      // If user chose "all publications", subscribe them to remaining publications
      if (subscribeAll) {
        const remainingSlugs = CANONICAL_NEWSLETTERS.map((n) => n.slug).filter(
          (s) => s !== primarySlug,
        );
        for (const remSlug of remainingSlugs) {
          try {
            await fetch("/api/newsletter/subscribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email,
                newsletterSlug: remSlug,
                sourceContext: `home-briefings-section:multi-subscribe`,
                botField,
              }),
            });
          } catch {
            // Non-critical secondary enrollments continue silently
          }
        }
      }

      setSubscribedPubName(
        subscribeAll
          ? "All Executive Briefings & Radars"
          : activeNewsletter?.name || "The Skill Corner Briefing",
      );
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  };

  const totalSubscribers = CANONICAL_NEWSLETTERS.reduce(
    (sum, n) => sum + (n.subscriberCount || 0),
    0,
  );

  return (
    <section
      id="briefings"
      aria-labelledby="briefings-heading"
      className="relative bg-[var(--tsc-paper)] border-b border-[var(--tsc-line)] py-16 sm:py-20 lg:py-24 font-geist"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        {/* Section Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--tsc-line)] pb-5 mb-10 sm:mb-14">
          <div className="flex items-center gap-3">
            <span
              className="inline-block h-2 w-2 rounded-full bg-[var(--tsc-action)] ring-4 ring-[var(--tsc-action)]/20 animate-pulse"
              aria-hidden="true"
            />
            <SectionLabel>04 / EXECUTIVE BRIEFINGS &middot; MARKET INTELLIGENCE</SectionLabel>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs text-[var(--tsc-muted)] tracking-wider uppercase">
            <span>3 Canonical Radars</span>
            <span className="text-[var(--tsc-line)]">&middot;</span>
            <span>14 Monitored Registries</span>
            <span className="text-[var(--tsc-line)]">&middot;</span>
            <span className="text-[var(--tsc-action)] font-semibold">100% Signal</span>
          </div>
        </div>

        {/* Section Headline & Editorial Lead */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-end mb-12 sm:mb-16">
          <div className="lg:col-span-8 space-y-4">
            <h2
              id="briefings-heading"
              className="text-[34px] sm:text-[46px] lg:text-[54px] font-bold leading-[1.02] tracking-[-0.035em] text-[var(--tsc-ink)]"
            >
              Field intelligence,
              <br />
              distilled for operators.
            </h2>
            <p className="text-base sm:text-lg text-[var(--tsc-muted)] leading-relaxed max-w-2xl">
              We run automated ingestion and synthesis pipelines across public filings, model
              releases, and commercial registries. Read our free dispatches below, subscribe
              directly, or commission a private monitoring pipeline for your company.
            </p>
          </div>

          <div className="lg:col-span-4 lg:text-right space-y-2">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-[4px] bg-white border border-[var(--tsc-line)] text-xs font-mono text-[var(--tsc-ink)] shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--tsc-action)]" />
              <span>
                Verified Readership:{" "}
                <strong className="text-[var(--tsc-action)] font-semibold">
                  {totalSubscribers}+ Operators
                </strong>
              </span>
            </div>
            <p className="text-[11px] font-mono text-[var(--tsc-muted)]">
              Senior engineers &middot; Business buyers &middot; Municipal contractors
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE INTELLIGENCE TERMINAL                                         */}
        {/* ========================================================================= */}
        <div className="rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-[var(--shadow-warm-sm)] overflow-hidden">
          {/* Top Publication Channel Switcher Tabs */}
          <div
            role="tablist"
            aria-label="Executive Briefing Publications"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-[var(--tsc-line)] bg-[var(--tsc-surface)]/60 divide-y sm:divide-y-0 sm:divide-x divide-[var(--tsc-line)]"
          >
            {/* Tab 1: Tech Founder Briefing */}
            <button
              type="button"
              role="tab"
              id="tab-tech-founder"
              aria-selected={activeTab === "tech-founder-briefing"}
              aria-controls="panel-briefing"
              onClick={() => handleTabChange("tech-founder-briefing")}
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
              aria-controls="panel-briefing"
              onClick={() => handleTabChange("ontario-opportunity-monitor")}
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
              aria-controls="panel-briefing"
              onClick={() => handleTabChange("tender-brief")}
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
              aria-controls="panel-briefing"
              onClick={() => handleTabChange("custom-radar")}
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

          {/* ========================================================================= */}
          {/* TAB CONTENT PANEL: PUBLIC PUBLICATIONS (TABS 1-3)                          */}
          {/* ========================================================================= */}
          {activeTab !== "custom-radar" && activeNewsletter && currentIssue && (
            <div
              role="tabpanel"
              id="panel-briefing"
              aria-labelledby={`tab-${activeTab}`}
              className="p-6 sm:p-8 lg:p-10 space-y-8"
            >
              {/* Publication Top Telemetry & Ingestion Meta */}
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
                      <span>
                        PUBLISHED{" "}
                        {new Date(currentIssue.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span>&middot;</span>
                    </>
                  )}
                  <span>{currentIssue.sourceItemCount ?? 18} INGESTION RECORDS SYNTHESIZED</span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[var(--tsc-ink)] tracking-tight leading-snug">
                  {currentIssue.title}
                </h3>

                <p className="text-base text-[var(--tsc-ink)]/80 leading-relaxed max-w-4xl">
                  {currentIssue.summary}
                </p>
              </div>

              {/* 3 Key Takeaways / Operational Invariants */}
              <div className="space-y-3">
                <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--tsc-muted)] flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-[var(--tsc-action)]" />
                  <span>ACTIONABLE OPERATIONAL TAKEAWAYS</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentIssue.keyTakeaways.map((takeaway, idx) => (
                    <div
                      key={takeaway}
                      className="p-4 rounded-[6px] bg-[var(--tsc-surface)]/80 border border-[var(--tsc-line)] space-y-2 hover:border-[var(--tsc-action)]/50 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-[var(--tsc-action)]">KEY #{idx + 1}</span>
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

              {/* Expandable Editorial Excerpt */}
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

              {/* In-Line Acquisition Subscription Box */}
              <div className="pt-6 border-t border-[var(--tsc-line)]">
                <div className="rounded-[8px] bg-[var(--tsc-surface)]/80 border border-[var(--tsc-line-strong)]/40 p-5 sm:p-6">
                  {status === "success" ? (
                    <div className="flex items-start sm:items-center gap-3.5 font-mono text-xs">
                      <CheckCircle2 className="h-5 w-5 text-[var(--tsc-action)] shrink-0 mt-0.5 sm:mt-0" />
                      <div className="space-y-1">
                        <div className="font-bold text-sm text-[var(--tsc-ink)]">
                          Subscription Confirmed.
                        </div>
                        <p className="text-xs text-[var(--tsc-muted)]">
                          You are enrolled in{" "}
                          <strong className="text-[var(--tsc-ink)]">{subscribedPubName}</strong>.
                          Next dispatch will arrive directly in your inbox on schedule.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="space-y-4">
                      {/* Honeypot field */}
                      <div className="hidden" aria-hidden="true">
                        <input
                          type="text"
                          name="botField"
                          value={botField}
                          onChange={(e) => setBotField(e.target.value)}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="font-bold text-sm sm:text-base text-[var(--tsc-ink)] flex items-center gap-2">
                            <span>Subscribe to {activeNewsletter.name}</span>
                            <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-[3px] bg-[var(--tsc-action)]/10 text-[var(--tsc-action)] uppercase">
                              Zero Spam
                            </span>
                          </div>
                          <p className="text-xs text-[var(--tsc-muted)]">
                            Delivered every{" "}
                            {activeNewsletter.cadence === "daily" ? "morning at 07:00 AM" : "week"}.
                            Direct to your inbox. Unsubscribe anytime.
                          </p>
                        </div>

                        {/* Input Row */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 min-w-[320px] lg:min-w-[420px]">
                          <input
                            id={`${formId}-email`}
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter work email..."
                            className="flex-1 bg-white px-3.5 py-2.5 rounded-[6px] border border-[var(--tsc-line-strong)] text-[var(--tsc-ink)] text-xs sm:text-sm placeholder-[var(--tsc-muted)] focus:outline-none focus:border-[var(--tsc-action)] focus:ring-1 focus:ring-[var(--tsc-action)]"
                          />
                          <button
                            type="submit"
                            disabled={status === "loading"}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[6px] bg-[var(--tsc-ink)] hover:bg-[var(--tsc-action)] text-white text-xs font-mono font-semibold tracking-wider uppercase transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                          >
                            {status === "loading" ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span>Joining...</span>
                              </>
                            ) : (
                              <>
                                <span>Get Dispatches</span>
                                <Send className="h-3.5 w-3.5" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Multi-subscribe preference checkbox */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-[11px] text-[var(--tsc-muted)] border-t border-[var(--tsc-line)]/60">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={subscribeAll}
                            onChange={(e) => setSubscribeAll(e.target.checked)}
                            className="rounded-[4px] border-[var(--tsc-line-strong)] text-[var(--tsc-action)] focus:ring-[var(--tsc-action)]"
                          />
                          <span>
                            Also enroll me in all 3 executive radars (Tech Founder + Dealflow +
                            Municipal RFPs)
                          </span>
                        </label>
                        <Link
                          href={`/newsletters/${activeNewsletter.slug}`}
                          className="hover:text-[var(--tsc-action)] transition-colors inline-flex items-center gap-1"
                        >
                          <span>Full publication archive &rarr;</span>
                        </Link>
                      </div>

                      {status === "error" && (
                        <p className="text-xs font-mono text-red-600">{errorMessage}</p>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB CONTENT PANEL: CUSTOM PRIVATE RADAR (TAB 4 - COMMERCIAL ACQUISITION)  */}
          {/* ========================================================================= */}
          {activeTab === "custom-radar" && (
            <div
              role="tabpanel"
              id="panel-briefing"
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
                    Stop paying skilled staff to manually search 30 fragmented portals, registries,
                    and PDF gazettes every day. We build bespoke ingestion, OCR, and deterministic
                    alerting engines wired directly into your operations.
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
                {CUSTOM_RADAR_FEATURES.map((feature) => (
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

              {/* Live Use-Case Specimen Matrix */}
              <div className="rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] p-5 space-y-4">
                <div className="flex items-center justify-between font-mono text-xs border-b border-[var(--tsc-line)] pb-3">
                  <span className="font-bold text-[var(--tsc-ink)] uppercase">
                    PROVEN CLIENT PIPELINE ARCHITECTURES
                  </span>
                  <span className="text-[var(--tsc-action)] font-semibold">
                    100% AUTOMATED EXECUTION
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                  {PROVEN_PIPELINES.map((pipeline) => (
                    <div
                      key={pipeline.title}
                      className="p-3 bg-white rounded-[6px] border border-[var(--tsc-line)] space-y-1.5"
                    >
                      <span className="text-[10px] font-bold text-[var(--tsc-action)] uppercase">
                        {pipeline.category}
                      </span>
                      <div className="font-bold text-[var(--tsc-ink)]">{pipeline.title}</div>
                      <p className="text-[11px] text-[var(--tsc-muted)] leading-relaxed">
                        {pipeline.description}
                      </p>
                    </div>
                  ))}
                </div>
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

        {/* ========================================================================= */}
        {/* THE COMMERCIAL ACQUISITION BRIDGE: 3 COMPANION DISCOVERY VECTORS          */}
        {/* ========================================================================= */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {DISCOVERY_VECTORS.map((vector) => (
            <div
              key={vector.title}
              className="rounded-[8px] border border-[var(--tsc-line)] bg-white p-6 flex flex-col justify-between shadow-2xs hover:border-[var(--tsc-action)] transition-colors group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[var(--tsc-action)] uppercase">
                    [{vector.tag}]
                  </span>
                  <span className="text-[var(--tsc-muted)] font-mono">{vector.badge}</span>
                </div>
                <h4 className="text-lg font-bold text-[var(--tsc-ink)] group-hover:text-[var(--tsc-action)] transition-colors">
                  {vector.title}
                </h4>
                <p className="text-xs text-[var(--tsc-muted)] leading-relaxed">
                  {vector.description}
                </p>
              </div>
              <div className="pt-5 mt-5 border-t border-[var(--tsc-line)]/70">
                <Link
                  href={vector.href}
                  className="w-full inline-flex items-center justify-between text-xs font-mono font-semibold text-[var(--tsc-ink)] group-hover:text-[var(--tsc-action)] uppercase tracking-wider"
                >
                  <span>{vector.cta}</span>
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-1"
                    strokeWidth={1.7}
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Industry Navigation Matrix */}
        <div className="mt-8 rounded-[8px] border border-[var(--tsc-line)] bg-white/70 backdrop-blur-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-[var(--tsc-muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--tsc-action)]" />
            <span className="font-semibold text-[var(--tsc-ink)] uppercase">
              EXPLORE BY VERTICAL:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/industries/dental-offices"
              className="px-2.5 py-1 rounded-[4px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] hover:bg-white hover:border-[var(--tsc-action)] text-[var(--tsc-ink)] transition-colors"
            >
              Dental Practices &rarr;
            </Link>
            <Link
              href="/industries/law-firms"
              className="px-2.5 py-1 rounded-[4px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] hover:bg-white hover:border-[var(--tsc-action)] text-[var(--tsc-ink)] transition-colors"
            >
              Law Firms &rarr;
            </Link>
            <Link
              href="/industries/restaurants"
              className="px-2.5 py-1 rounded-[4px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] hover:bg-white hover:border-[var(--tsc-action)] text-[var(--tsc-ink)] transition-colors"
            >
              Restaurants &rarr;
            </Link>
            <Link
              href="/industries/salons-spas"
              className="px-2.5 py-1 rounded-[4px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] hover:bg-white hover:border-[var(--tsc-action)] text-[var(--tsc-ink)] transition-colors"
            >
              Salons &amp; Spas &rarr;
            </Link>
            <Link
              href="/industries"
              className="px-2.5 py-1 rounded-[4px] border border-[var(--tsc-action)] bg-[var(--tsc-action)]/10 text-[var(--tsc-action)] font-semibold hover:bg-[var(--tsc-action)] hover:text-white transition-colors"
            >
              All 24 Verticals &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
