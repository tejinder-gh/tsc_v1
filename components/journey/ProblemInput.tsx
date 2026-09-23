"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { useJourney } from "@/lib/journey";

interface ProblemInputProps {
  variant?: "default" | "dark";
  placeholder?: string;
  id?: string;
  showMicrocopy?: boolean;
}

export function ProblemInput({
  variant = "default",
  placeholder = "Describe what's wasting time, money, or opportunities…",
  id = "problem-input",
  showMicrocopy = true,
}: ProblemInputProps) {
  const router = useRouter();
  const { journey, setProblem } = useJourney();
  const [value, setValue] = useState(journey.freeformProblem ?? "");
  const [error, setError] = useState<string | null>(null);

  // Sync value if journey.freeformProblem changes externally
  useEffect(() => {
    if (journey.freeformProblem) {
      setValue(journey.freeformProblem);
    }
  }, [journey.freeformProblem]);

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
    } else {
      // Scroll to #start if on homepage, otherwise navigate to /#start
      const target = document.getElementById("start");
      if (target && id !== "problem-input") {
        target.scrollIntoView({ behavior: "smooth" });
      } else if (!target) {
        router.push("/#start");
      }
    }
  };

  const isDark = variant === "dark";
  const isContextStage = journey.stage === "context";
  const hasSavedProblem = Boolean(journey.freeformProblem);

  return (
    <div className="space-y-3 font-geist">
      {hasSavedProblem && isContextStage ? (
        <div
          className={`rounded-[8px] border p-4 ${
            isDark
              ? "border-white/15 bg-white/5 text-white"
              : "border-[var(--tsc-line)] bg-white text-[var(--tsc-ink)]"
          }`}
        >
          <div
            className={`flex items-center justify-between text-xs font-mono ${
              isDark ? "text-white/60" : "text-[var(--tsc-muted)]"
            }`}
          >
            <span className="uppercase tracking-wider">FRAMED PROBLEM</span>
            <button
              type="button"
              onClick={() => {
                const inputEl = document.getElementById(id);
                inputEl?.focus();
              }}
              className={`text-xs font-mono hover:underline ${
                isDark ? "text-[var(--tsc-signal)]" : "text-[var(--tsc-action)]"
              }`}
            >
              Edit
            </button>
          </div>
          <p
            className={`mt-2 text-sm leading-relaxed italic ${
              isDark ? "text-white/90" : "text-[var(--tsc-ink)]"
            }`}
          >
            &ldquo;{journey.freeformProblem}&rdquo;
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative flex items-center">
            <label htmlFor={id} className="sr-only">
              Describe what isn&apos;t working
            </label>
            <input
              id={id}
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError(null);
              }}
              placeholder={placeholder}
              className={`w-full min-h-[52px] rounded-[8px] border py-3 pl-4 pr-14 text-sm sm:text-base transition-colors focus:outline-none focus:ring-1 ${
                isDark
                  ? "border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-white focus:ring-white"
                  : "border-[var(--tsc-line-strong)] bg-white text-[var(--tsc-ink)] placeholder:text-[var(--tsc-muted)]/70 focus:border-[var(--tsc-ink)] focus:ring-[var(--tsc-ink)]"
              }`}
            />
            <button
              type="submit"
              aria-label="Submit problem description"
              className={`absolute right-1.5 top-1.5 bottom-1.5 flex h-[40px] w-[40px] items-center justify-center rounded-[6px] transition-all focus-visible:outline focus-visible:outline-2 ${
                isDark
                  ? "bg-[var(--tsc-paper)] text-[var(--tsc-ink)] hover:bg-white focus-visible:outline-white"
                  : "bg-[var(--tsc-ink)] text-[var(--tsc-paper)] hover:opacity-90 focus-visible:outline-[var(--tsc-action)]"
              }`}
            >
              <span className="text-base font-semibold leading-none" aria-hidden="true">
                →
              </span>
            </button>
          </div>

          {error && (
            <p
              role="alert"
              className={`mt-2 text-xs font-mono ${isDark ? "text-red-400" : "text-red-600"}`}
            >
              {error}
            </p>
          )}
        </form>
      )}

      {/* Supporting microcopy */}
      {showMicrocopy && (
        <div
          className={`text-[11px] font-mono tracking-wider uppercase ${
            isDark ? "text-white/50" : "text-[var(--tsc-muted)]"
          }`}
        >
          NO FORM. NO SALES CALL. FIRST, WE HELP YOU FRAME THE PROBLEM.
        </div>
      )}
    </div>
  );
}
