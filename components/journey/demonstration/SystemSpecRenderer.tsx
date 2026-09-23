"use client";

import { useEffect, useState } from "react";
import type { DemonstrationScenario } from "@/lib/journey/demonstration-config";

interface SystemSpecRendererProps {
  scenario: DemonstrationScenario;
  onStarted?: () => void;
  onCompleted?: () => void;
}

export function SystemSpecRenderer({ scenario, onStarted, onCompleted }: SystemSpecRendererProps) {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (scenario.id) {
      setActiveStepIndex(-1);
      setIsRunning(false);
      setHasStarted(false);
    }
  }, [scenario.id]);

  const totalSteps = scenario.steps.length;

  const handleNext = () => {
    if (!hasStarted) {
      setHasStarted(true);
      onStarted?.();
    }
    if (activeStepIndex < totalSteps - 1) {
      const nextIndex = activeStepIndex + 1;
      setActiveStepIndex(nextIndex);
      if (nextIndex === totalSteps - 1) {
        onCompleted?.();
      }
    }
  };

  const handleReplay = () => {
    setActiveStepIndex(-1);
    setIsRunning(false);
    setHasStarted(false);
  };

  const handleRunAll = () => {
    if (!hasStarted) {
      setHasStarted(true);
      onStarted?.();
    }
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setActiveStepIndex(totalSteps - 1);
      onCompleted?.();
      return;
    }
    setIsRunning(true);
    let current = activeStepIndex;
    const interval = setInterval(() => {
      current++;
      if (current >= totalSteps) {
        clearInterval(interval);
        setIsRunning(false);
        onCompleted?.();
      } else {
        setActiveStepIndex(current);
      }
    }, 450);
  };

  return (
    <div className="w-full flex flex-col space-y-6 font-geist">
      <div className="rounded-[4px] border border-[var(--tsc-line)] bg-white p-5 sm:p-6 lg:p-7 shadow-[0_2px_12px_rgba(18,19,15,0.03)]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--tsc-line)] pb-4">
          <div className="flex items-center gap-2.5">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                scenario.isException
                  ? "bg-amber-500 ring-4 ring-amber-500/20"
                  : "bg-[var(--tsc-signal)] ring-4 ring-[var(--tsc-signal)]/30"
              }`}
              aria-hidden="true"
            />
            <span className="font-mono text-xs font-semibold tracking-wider text-[var(--tsc-ink)] uppercase">
              {scenario.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-[var(--tsc-muted)] uppercase">
              {activeStepIndex < 0
                ? "READY TO RUN"
                : `SPEC LAYER ${activeStepIndex + 1} OF ${totalSteps}`}
            </span>
          </div>
        </div>

        {/* Narrative */}
        <div className="pt-3 pb-5 text-sm sm:text-[15px] text-[var(--tsc-ink)]/80 leading-relaxed">
          {scenario.description}
        </div>

        {/* Architecture Layer Progression */}
        <div className="space-y-4 pt-2">
          {scenario.steps.map((step, idx) => {
            const isCompleted = idx <= activeStepIndex;
            const isCurrent = idx === activeStepIndex;

            return (
              <div
                key={step.id}
                className={`relative rounded-[3px] border transition-all duration-200 p-4 ${
                  isCurrent
                    ? "border-[var(--tsc-ink)] bg-[var(--tsc-surface)] ring-1 ring-[var(--tsc-ink)]/15"
                    : isCompleted
                      ? "border-[var(--tsc-line)] bg-white"
                      : "border-[var(--tsc-line)]/50 bg-[var(--tsc-paper)]/40 opacity-50"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-[2px] ${
                        isCurrent
                          ? "bg-[var(--tsc-ink)] text-white"
                          : isCompleted
                            ? "bg-[var(--tsc-line)] text-[var(--tsc-ink)]"
                            : "bg-[var(--tsc-line)]/50 text-[var(--tsc-muted)]"
                      }`}
                    >
                      {step.phase}
                    </span>
                    <h4 className="text-sm sm:text-base font-semibold text-[var(--tsc-ink)]">
                      {step.title}
                    </h4>
                  </div>

                  {step.statusTag && isCompleted && (
                    <span className="font-mono text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-[2px] border border-[var(--tsc-line)] text-[var(--tsc-muted)] bg-white">
                      {step.statusTag}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--tsc-ink)]/80">
                  {step.description}
                </p>

                {step.dataPayload && isCompleted && (
                  <div className="mt-3 rounded-[3px] border border-[var(--tsc-line)] bg-[var(--tsc-ink)] p-3 text-white font-mono text-[11px] leading-relaxed overflow-x-auto">
                    <div className="text-[10px] text-[var(--tsc-signal)] font-semibold tracking-wider uppercase mb-1.5 opacity-90">
                      CONTRACT / SYSTEM PARAMETERS
                    </div>
                    {Object.entries(step.dataPayload).map(([key, val]) => (
                      <div key={key} className="flex gap-2">
                        <span className="text-white/50">{key}:</span>
                        <span className="text-white/90">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {step.annotation && isCompleted && (
                  <div className="mt-2 text-[11px] font-mono text-[var(--tsc-muted)]">
                    ↳ {step.annotation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--tsc-line)] pt-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleNext}
              disabled={activeStepIndex >= totalSteps - 1 || isRunning}
              className="inline-flex items-center justify-center rounded-[3px] bg-[var(--tsc-ink)] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[var(--tsc-ink)]/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {activeStepIndex < 0
                ? "Run example →"
                : activeStepIndex >= totalSteps - 1
                  ? "Completed"
                  : "Inspect Next Layer →"}
            </button>

            <button
              type="button"
              onClick={handleRunAll}
              disabled={activeStepIndex >= totalSteps - 1 || isRunning}
              className="inline-flex items-center justify-center rounded-[3px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] px-3 py-2 text-xs sm:text-sm font-medium text-[var(--tsc-ink)] transition-colors hover:bg-[var(--tsc-paper)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isRunning ? "Verifying..." : "Run all steps"}
            </button>

            <button
              type="button"
              onClick={handleReplay}
              disabled={isRunning}
              className="text-xs sm:text-sm font-medium text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)] transition-colors cursor-pointer py-1"
            >
              Replay ↺
            </button>
          </div>

          {activeStepIndex === totalSteps - 1 && (
            <div className="text-xs sm:text-sm font-medium text-[var(--tsc-positive)]">
              ✓ {scenario.summaryOutcome}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
