"use client";

import { CANONICAL_INTENTS, INTENT_LABELS, type PrimaryIntent, useJourney } from "@/lib/journey";

export function IntentSelector() {
  const { journey, selectIntent, setStage, resetJourney } = useJourney();
  const selectedIntent = journey.intent;
  const isIntentSelectedState = journey.stage === "intent-selected";

  // Post-selection state (Ticket 001 §9)
  if (isIntentSelectedState && selectedIntent) {
    return (
      <div className="rounded-[6px] border border-[var(--tsc-line)] bg-white p-5 sm:p-6 transition-all font-geist">
        <div className="flex items-center justify-between text-xs font-mono text-[var(--tsc-muted)]">
          <span className="uppercase tracking-wider">SELECTED GOAL</span>
          <span className="font-medium text-[var(--tsc-ink)]">{INTENT_LABELS[selectedIntent]}</span>
        </div>

        <div className="mt-3 text-lg sm:text-xl font-semibold text-[var(--tsc-ink)]">
          Good. Let&apos;s narrow that down.
        </div>
        <p className="mt-1 text-sm text-[var(--tsc-muted)] leading-relaxed">
          A few details will help us avoid showing you things that aren&apos;t relevant.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setStage("context")}
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-[4px] bg-[var(--tsc-ink)] px-5 py-2.5 text-sm font-medium text-[var(--tsc-paper)] transition-all hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tsc-action)]"
          >
            <span>Continue</span>
            <span aria-hidden="true">→</span>
          </button>
          <button
            type="button"
            onClick={resetJourney}
            className="inline-flex min-h-[44px] items-center justify-center rounded-[4px] border border-[var(--tsc-line)] px-4 py-2.5 text-sm font-medium text-[var(--tsc-muted)] hover:border-[var(--tsc-ink)] hover:text-[var(--tsc-ink)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tsc-action)]"
          >
            Change answer
          </button>
        </div>
      </div>
    );
  }

  // Pre-selection or Context stage
  return (
    <div className="space-y-3 font-geist">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono tracking-wider text-[var(--tsc-muted)] uppercase">
          WHAT BROUGHT YOU HERE?
        </span>
        {selectedIntent && journey.stage !== "new" && (
          <button
            type="button"
            onClick={resetJourney}
            className="text-xs font-mono text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)] underline underline-offset-2"
          >
            Reset
          </button>
        )}
      </div>

      <fieldset className="border-0 p-0 m-0 flex flex-wrap gap-2.5">
        <legend className="sr-only">Primary intent options</legend>
        {CANONICAL_INTENTS.map((intent: PrimaryIntent) => {
          const isSelected = selectedIntent === intent;
          return (
            <button
              key={intent}
              type="button"
              aria-pressed={isSelected}
              onClick={() => selectIntent(intent)}
              className={`inline-flex min-h-[44px] items-center rounded-[4px] border px-4 py-2 text-sm font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tsc-action)] ${
                isSelected
                  ? "border-[var(--tsc-ink)] bg-[var(--tsc-ink)] text-[var(--tsc-paper)] shadow-sm"
                  : "border-[var(--tsc-line)] bg-white text-[var(--tsc-ink)] hover:border-[var(--tsc-ink)]/50 hover:bg-[var(--tsc-surface)]"
              }`}
            >
              {INTENT_LABELS[intent]}
            </button>
          );
        })}
      </fieldset>
    </div>
  );
}
