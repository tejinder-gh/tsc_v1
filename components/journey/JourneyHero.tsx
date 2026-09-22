"use client";

import { useJourney } from "@/lib/journey";
import { IntentSelector } from "./IntentSelector";
import { JourneyProgress } from "./JourneyProgress";
import { LiveSystemExample } from "./LiveSystemExample";
import { ProblemInput } from "./ProblemInput";

export function JourneyHero() {
  const { hasExistingProgress, journey, continueJourney, resetJourney } = useJourney();

  return (
    <section
      id="start"
      aria-label="Studio introduction and intent router"
      className="relative overflow-hidden bg-[var(--tsc-paper)] border-b border-[var(--tsc-line)] pt-6 pb-12 sm:pt-8 sm:pb-14 lg:pt-10 lg:pb-16 font-geist"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        {/* Returning visitor continuation banner (Ticket 001 §27) */}
        {hasExistingProgress && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-[var(--tsc-ink)]/20 bg-white px-4 py-3 text-xs sm:text-sm">
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

        {/* 2-column Desktop (~58% / ~42%), single-column Mobile */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16 items-start">
          {/* Left Column: Intent Router & Editorial Narrative (~58%) */}
          <div className="lg:col-span-7 flex flex-col space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Eyebrow */}
            <div className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.14em] text-[var(--tsc-muted)] uppercase">
              A DIGITAL SYSTEMS STUDIO
            </div>

            {/* Main Headline (deliberate line break on desktop) */}
            <h1
              style={{ color: "var(--tsc-ink)" }}
              className="text-[42px] sm:text-[58px] lg:text-[72px] xl:text-[80px] font-bold leading-[0.96] tracking-[-0.035em] text-[var(--tsc-ink)]"
            >
              Tell us what
              <br className="hidden sm:inline" /> should work better.
            </h1>

            {/* Supporting Copy */}
            <p className="max-w-[580px] text-base sm:text-[18px] lg:text-[19px] font-normal leading-[1.48] text-[var(--tsc-ink)]/80">
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

          {/* Right Column: Live System Demonstration (~42%) - normal flow, not sticky (Ticket 001A §8) */}
          <div className="lg:col-span-5">
            <LiveSystemExample />
          </div>
        </div>
      </div>
    </section>
  );
}
