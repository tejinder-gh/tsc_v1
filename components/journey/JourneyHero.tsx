"use client";

import dynamic from "next/dynamic";
import { SectionLabel } from "@/components/ui/editorial";
import { useJourney } from "@/lib/journey";
import { ContextEngine } from "./context/ContextEngine";
import { IntentSelector } from "./IntentSelector";
import { JourneyProgress } from "./JourneyProgress";
import { LiveSystemExample } from "./LiveSystemExample";
import { OpportunityView } from "./opportunity";
import { ProblemInput } from "./ProblemInput";

const DemonstrationView = dynamic(
  () => import("./demonstration/DemonstrationView").then((mod) => mod.DemonstrationView),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full min-h-[420px] flex flex-col items-center justify-center p-8 rounded-[4px] border border-[var(--tsc-line)] bg-white/60 text-[var(--tsc-muted)]"
        aria-busy="true"
        aria-live="polite"
      >
        <span
          className="inline-block h-3 w-3 rounded-full bg-[var(--tsc-ink)] ring-4 ring-[var(--tsc-line)] animate-pulse mb-3"
          aria-hidden="true"
        />
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--tsc-ink)] font-semibold">
          Loading System Demonstration…
        </p>
      </div>
    ),
  },
);

export function JourneyHero() {
  const { hasExistingProgress, journey, continueJourney, resetJourney } = useJourney();

  return (
    <section
      id="start"
      aria-label="Studio introduction and intent router"
      className="relative bg-[var(--tsc-paper)] border-b border-[var(--tsc-line)] pt-6 pb-10 sm:pt-7 sm:pb-12 lg:pt-8 lg:pb-14 font-geist"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        {/* Returning visitor continuation banner (Ticket 001 §27) */}
        {hasExistingProgress && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-[var(--tsc-ink)]/20 bg-white px-4 py-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--tsc-positive)]" aria-hidden="true" />
              <span className="text-[var(--tsc-ink)] font-medium">
                You have an active session in progress ({journey.stage}).
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={continueJourney}
                className="font-medium text-[var(--tsc-action)] hover:underline"
              >
                Continue where you left off →
              </button>
              <button
                type="button"
                onClick={resetJourney}
                className="text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)]"
              >
                Start fresh
              </button>
            </div>
          </div>
        )}

        {/* Stage 02: Context Engine (Ticket 002) */}
        {journey.stage === "context" && <ContextEngine />}

        {/* Stage 03: Opportunity Diagnostic (Ticket 003) */}
        {journey.stage === "opportunity" && <OpportunityView />}

        {/* Stage 03 Substage: Solution Interactive Demonstration (Ticket 004) */}
        {journey.stage === "solution" && <DemonstrationView />}

        {/* Stage 01: Initial Arrival & Intent Selection Hero (Ticket 001) */}
        {(journey.stage === "new" || journey.stage === "intent-selected") && (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-16 items-start">
            {/* Left Column: Intent Router & Editorial Narrative (~58% / 7 cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-5 lg:space-y-6">
              {/* Eyebrow */}
              <SectionLabel>A DIGITAL SYSTEMS STUDIO</SectionLabel>

              {/* Main Headline (Editorial cover scale) */}
              <h1 className="text-[44px] sm:text-[62px] lg:text-[74px] xl:text-[84px] font-bold leading-[0.95] tracking-[-0.035em] text-[var(--tsc-ink)]">
                Tell us what
                <br className="hidden sm:inline" /> should work better.
              </h1>

              {/* Supporting Copy */}
              <p className="max-w-[560px] text-base sm:text-[18px] lg:text-[19px] font-normal leading-[1.5] text-[var(--tsc-ink)]/80">
                We design and build the systems behind growing businesses — but you shouldn&apos;t
                need to understand our service catalog to know where to start.
              </p>

              {/* Journey Progress Indicator */}
              <div className="pt-1">
                <JourneyProgress />
              </div>

              {/* Intent Router (Choices or Post-Selection) */}
              <div className="pt-1">
                <IntentSelector />
              </div>

              {/* Natural-Language Input Field */}
              <div className="pt-1">
                <ProblemInput />
              </div>
            </div>

            {/* Right Column: Live System Demonstration (~42% / 5 cols) */}
            <div className="lg:col-span-5 lg:pt-2">
              <LiveSystemExample />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
