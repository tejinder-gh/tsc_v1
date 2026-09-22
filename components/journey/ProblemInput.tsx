"use client";

import { type FormEvent, useState } from "react";
import { useJourney } from "@/lib/journey";

export function ProblemInput() {
  const { journey, setProblem } = useJourney();
  const [value, setValue] = useState(journey.freeformProblem ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) {
      setError("Please describe what isn't working before continuing.");
      return;
    }

    setError(null);
    const success = setProblem(value);
    if (!success) {
      setError("Please describe what isn't working before continuing.");
    }
  };

  const isContextStage = journey.stage === "context";
  const hasSavedProblem = Boolean(journey.freeformProblem);

  return (
    <div className="space-y-3 font-geist">
      {hasSavedProblem && isContextStage ? (
        <div className="rounded-[4px] border border-[var(--tsc-line)] bg-white p-4">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--tsc-muted)]">
            <span className="uppercase tracking-wider">FRAMED PROBLEM</span>
            <button
              type="button"
              onClick={() => {
                // Focus edit mode by keeping value
                const inputEl = document.getElementById("problem-input");
                inputEl?.focus();
              }}
              className="text-xs font-mono text-[var(--tsc-action)] hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="mt-2 text-sm text-[var(--tsc-ink)] leading-relaxed italic">
            &ldquo;{journey.freeformProblem}&rdquo;
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative flex items-center">
            <label htmlFor="problem-input" className="sr-only">
              Describe what isn&apos;t working
            </label>
            <input
              id="problem-input"
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Describe what's wasting time, money, or opportunities…"
              className="w-full min-h-[52px] rounded-[4px] border border-[var(--tsc-line)] bg-white py-3 pl-4 pr-14 text-sm sm:text-base text-[var(--tsc-ink)] placeholder:text-[var(--tsc-muted)]/70 transition-colors focus:border-[var(--tsc-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--tsc-ink)]"
            />
            <button
              type="submit"
              aria-label="Submit problem description"
              className="absolute right-1.5 top-1.5 bottom-1.5 flex h-[40px] w-[40px] items-center justify-center rounded-[3px] bg-[var(--tsc-ink)] text-[var(--tsc-paper)] transition-all hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tsc-action)]"
            >
              <span className="text-base font-semibold leading-none" aria-hidden="true">
                →
              </span>
            </button>
          </div>

          {error && (
            <p role="alert" className="mt-2 text-xs font-mono text-red-600">
              {error}
            </p>
          )}
        </form>
      )}

      {/* Supporting microcopy (Ticket 001 §4) */}
      <div className="text-[11px] font-mono tracking-wider text-[var(--tsc-muted)] uppercase">
        NO FORM. NO SALES CALL. FIRST, WE HELP YOU FRAME THE PROBLEM.
      </div>
    </div>
  );
}
