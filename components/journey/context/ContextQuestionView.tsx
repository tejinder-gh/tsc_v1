"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";
import type { ContextOption } from "@/lib/journey/context-config";
import { JourneyProgress } from "../JourneyProgress";
import { ContextOptionItem } from "./ContextOptionItem";
import { FreeformProblemRef } from "./FreeformProblemRef";

interface ContextQuestionViewProps<T extends string> {
  stepKey: "question1" | "question2";
  eyebrow: string;
  heading: string;
  supporting?: string;
  options: ContextOption<T>[];
  selectedValue?: T;
  freeformProblem?: string;
  onSelect: (value: T) => void;
  onBack?: () => void;
  onChangeGoal: () => void;
}

export function ContextQuestionView<T extends string>({
  stepKey,
  eyebrow,
  heading,
  supporting,
  options,
  selectedValue,
  freeformProblem,
  onSelect,
  onBack,
  onChangeGoal,
}: ContextQuestionViewProps<T>) {
  const [pendingSelection, setPendingSelection] = useState<T | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const headingId = useId();

  const handleOptionClick = (value: T) => {
    // 1. Immediately show selected-state feedback (Ticket 002 §12)
    setPendingSelection(value);

    // 2. Short controlled transition (perceived delay ~240ms)
    window.setTimeout(() => {
      onSelect(value);
      setPendingSelection(null);
    }, 240);
  };

  const activeValue = pendingSelection ?? selectedValue;

  return (
    <motion.div
      key={stepKey}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -8 }}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16 items-start font-geist"
    >
      {/* Left Column: Progress + Question + Narrative (~48%) */}
      <div className="lg:col-span-6 flex flex-col space-y-4 sm:space-y-5">
        {/* Journey Progress */}
        <div className="pb-1">
          <JourneyProgress />
        </div>

        {/* Freeform reference if visitor typed one in Ticket 001 (§18) */}
        {freeformProblem && <FreeformProblemRef problemText={freeformProblem} />}

        {/* Eyebrow */}
        <div className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.14em] text-[var(--tsc-muted)] uppercase">
          {eyebrow}
        </div>

        {/* Question Heading */}
        <h2
          id={headingId}
          style={{ color: "var(--tsc-ink)" }}
          className="text-[34px] sm:text-[44px] lg:text-[54px] font-bold leading-[1.0] tracking-[-0.03em] text-[var(--tsc-ink)] whitespace-pre-line"
        >
          {heading}
        </h2>

        {/* Supporting Copy */}
        {supporting && (
          <p className="max-w-[480px] text-base sm:text-[18px] font-normal leading-[1.48] text-[var(--tsc-ink)]/80">
            {supporting}
          </p>
        )}

        {/* Desktop Navigation Affordances (hidden on mobile, rendered below options on mobile) */}
        <div className="hidden lg:flex pt-3 flex-wrap items-center gap-5 text-xs sm:text-sm">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 font-medium text-[var(--tsc-ink)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tsc-ink)]"
            >
              <span aria-hidden="true">←</span>
              <span>Back</span>
            </button>
          )}

          <button
            type="button"
            onClick={onChangeGoal}
            className="text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tsc-ink)]"
          >
            Change goal
          </button>
        </div>
      </div>

      {/* Right Column: Decision Index (~52%) */}
      <div className="lg:col-span-6">
        <div
          role="radiogroup"
          aria-labelledby={headingId}
          className="rounded-[4px] border border-[var(--tsc-line)] bg-white p-2 sm:p-3 shadow-[0_2px_12px_rgba(18,19,15,0.03)]"
        >
          <div className="px-3 pt-2 pb-2 text-[10px] font-mono tracking-wider text-[var(--tsc-muted)] uppercase border-b border-[var(--tsc-line)]">
            SELECT AN OPTION
          </div>

          <div className="mt-1 flex flex-col">
            {options.map((option, idx) => (
              <ContextOptionItem
                key={option.value}
                name={stepKey}
                value={option.value}
                index={idx}
                label={option.label}
                description={option.description}
                isSelected={activeValue === option.value}
                onSelect={() => handleOptionClick(option.value)}
                disabled={pendingSelection !== null}
              />
            ))}
          </div>
        </div>

        {/* Mobile Navigation Affordances (Ticket 002 §20: Options -> Back / Change goal) */}
        <div className="flex lg:hidden pt-4 items-center gap-5 text-xs sm:text-sm">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 font-medium text-[var(--tsc-ink)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tsc-ink)]"
            >
              <span aria-hidden="true">←</span>
              <span>Back</span>
            </button>
          )}

          <button
            type="button"
            onClick={onChangeGoal}
            className="text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tsc-ink)]"
          >
            Change goal
          </button>
        </div>
      </div>
    </motion.div>
  );
}
