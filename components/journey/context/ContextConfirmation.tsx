"use client";

import { CONTEXT_COMPLETION_COPY, getContextConfig } from "@/lib/journey/context-config";
import type { ContextFocus, ContextSituation, PrimaryIntent } from "@/lib/journey/types";

interface ContextConfirmationProps {
  intent: PrimaryIntent;
  focus?: ContextFocus;
  situation?: ContextSituation;
  onShowOpportunity: () => void;
  onReviewAnswers: () => void;
}

export function ContextConfirmation({
  intent,
  focus,
  situation,
  onShowOpportunity,
  onReviewAnswers,
}: ContextConfirmationProps) {
  const config = getContextConfig(intent);
  const selectedFocus = config.question1.options.find((o) => o.value === focus);
  const selectedSituation = config.question2.options.find((o) => o.value === situation);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-start font-geist">
      {/* Left Column: Confirmation Prompt & Actions */}
      <div className="lg:col-span-6 flex flex-col space-y-4 sm:space-y-5">
        {/* Eyebrow */}
        <div className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.14em] text-[var(--tsc-muted)] uppercase">
          {CONTEXT_COMPLETION_COPY.eyebrow}
        </div>

        {/* Heading */}
        <h2
          style={{ color: "var(--tsc-ink)" }}
          className="text-[34px] sm:text-[44px] lg:text-[52px] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--tsc-ink)]"
        >
          {CONTEXT_COMPLETION_COPY.heading}
        </h2>

        {/* Supporting Copy */}
        <p className="max-w-[500px] text-base sm:text-lg font-normal leading-[1.48] text-[var(--tsc-ink)]/80">
          {CONTEXT_COMPLETION_COPY.supporting}
        </p>

        {/* Actions */}
        <div className="pt-3 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onShowOpportunity}
            className="inline-flex items-center justify-center rounded-[4px] bg-[var(--tsc-ink)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--tsc-ink)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tsc-ink)] focus-visible:ring-offset-2"
          >
            {CONTEXT_COMPLETION_COPY.primaryAction}
          </button>

          <button
            type="button"
            onClick={onReviewAnswers}
            className="text-xs sm:text-sm font-medium text-[var(--tsc-muted)] transition-colors hover:text-[var(--tsc-ink)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tsc-ink)]"
          >
            {CONTEXT_COMPLETION_COPY.secondaryAction}
          </button>
        </div>
      </div>

      {/* Right Column: Captured Shape of the Problem */}
      <div className="lg:col-span-6">
        <div className="rounded-[4px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] p-5 sm:p-6 shadow-[0_2px_12px_rgba(18,19,15,0.03)]">
          <div className="border-b border-[var(--tsc-line)] pb-3 text-[11px] font-mono tracking-wider text-[var(--tsc-muted)] uppercase">
            CAPTURED CONTEXT
          </div>

          <div className="mt-4 space-y-4">
            {/* Focus Item */}
            <div>
              <div className="text-[10px] font-mono font-semibold tracking-wider text-[var(--tsc-muted)] uppercase">
                01 FOCUS
              </div>
              <div className="mt-1 text-sm sm:text-base font-semibold text-[var(--tsc-ink)]">
                {selectedFocus?.label ?? focus}
              </div>
              {selectedFocus?.description && (
                <p className="mt-0.5 text-xs text-[var(--tsc-muted)] leading-relaxed">
                  {selectedFocus.description}
                </p>
              )}
            </div>

            {/* Situation Item */}
            <div className="border-t border-[var(--tsc-line)] pt-3">
              <div className="text-[10px] font-mono font-semibold tracking-wider text-[var(--tsc-muted)] uppercase">
                02 CONDITION
              </div>
              <div className="mt-1 text-sm sm:text-base font-semibold text-[var(--tsc-ink)]">
                {selectedSituation?.label ?? situation}
              </div>
              {selectedSituation?.description && (
                <p className="mt-0.5 text-xs text-[var(--tsc-muted)] leading-relaxed">
                  {selectedSituation.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
