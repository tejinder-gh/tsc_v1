"use client";

import { OPPORTUNITY_TRANSITIONAL_COPY } from "@/lib/journey/context-config";
import { JourneyProgress } from "../JourneyProgress";

interface OpportunityTransitionalProps {
  onBackToContext: () => void;
  onReset: () => void;
}

export function OpportunityTransitional({
  onBackToContext,
  onReset,
}: OpportunityTransitionalProps) {
  return (
    <div className="max-w-[720px] flex flex-col space-y-4 sm:space-y-5 font-geist">
      {/* Journey Progress: Stage 03 active */}
      <div className="pb-2">
        <JourneyProgress />
      </div>

      {/* Eyebrow */}
      <div className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.14em] text-[var(--tsc-muted)] uppercase">
        {OPPORTUNITY_TRANSITIONAL_COPY.eyebrow}
      </div>

      {/* Heading */}
      <h2
        style={{ color: "var(--tsc-ink)" }}
        className="text-[36px] sm:text-[48px] lg:text-[56px] font-bold leading-[1.0] tracking-[-0.03em] text-[var(--tsc-ink)]"
      >
        {OPPORTUNITY_TRANSITIONAL_COPY.heading}
      </h2>

      {/* Body */}
      <p className="text-base sm:text-lg font-normal leading-[1.5] text-[var(--tsc-ink)]/80">
        {OPPORTUNITY_TRANSITIONAL_COPY.body}
      </p>

      {/* Navigation Affordances */}
      <div className="pt-4 flex items-center gap-6 text-xs sm:text-sm font-medium">
        <button
          type="button"
          onClick={onBackToContext}
          className="text-[var(--tsc-ink)] hover:underline flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tsc-ink)]"
        >
          <span>←</span>
          <span>Review context answers</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tsc-ink)]"
        >
          Start fresh
        </button>
      </div>
    </div>
  );
}
