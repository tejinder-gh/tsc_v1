"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Code2, Copy, Play, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EditorialDivider, SectionLabel } from "@/components/ui/editorial";
import { Magnetic } from "@/components/ui/MagneticButton";

import { SYSTEM_STUDIES } from "@/content/system-studies";

export function SystemStudies() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(2);
  const [isSimulating, setIsSimulating] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const activeStudy = SYSTEM_STUDIES[selectedIndex];

  // Run automated pipeline animation when simulation is triggered
  useEffect(() => {
    if (!isSimulating) return;

    let current = 0;
    setActiveStepIndex(0);

    const interval = setInterval(() => {
      current += 1;
      if (current >= activeStudy.diagramSteps.length) {
        setIsSimulating(false);
        setActiveStepIndex(activeStudy.diagramSteps.length - 1);
        clearInterval(interval);
      } else {
        setActiveStepIndex(current);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [isSimulating, activeStudy]);

  const handleStudyChange = (idx: number) => {
    setSelectedIndex(idx);
    setActiveStepIndex(SYSTEM_STUDIES[idx].diagramSteps.length - 1);
    setIsSimulating(false);
    setExpandedStep(null);
  };

  const handleCopyPayload = (
    e: React.MouseEvent,
    stepIdx: number,
    payload: Record<string, string | number | boolean>,
  ) => {
    e.stopPropagation();
    try {
      navigator.clipboard?.writeText(JSON.stringify(payload, null, 2));
      setCopiedStep(stepIdx);
      setTimeout(() => setCopiedStep(null), 1500);
    } catch {
      // ignore clipboard failures
    }
  };

  const triggerSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setExpandedStep(null);
  };

  return (
    <section
      aria-labelledby="system-studies-heading"
      className="bg-[var(--tsc-paper)] border-b border-[var(--tsc-line)] py-16 sm:py-20 lg:py-24 font-geist"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <SectionLabel className="mb-4">03 / SYSTEM STUDIES</SectionLabel>
          <h2
            id="system-studies-heading"
            className="text-[32px] sm:text-[44px] lg:text-[52px] font-bold leading-[1.04] tracking-[-0.03em] text-[var(--tsc-ink)]"
          >
            A few examples of where
            <br className="hidden sm:inline" /> small systems change the work.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--tsc-muted)] leading-relaxed">
            These are illustrative scenarios, not client case studies. The point is the shape of the
            problem: repetitive work, a clear trigger, and a system that handles the predictable
            part.
          </p>
          <div className="mt-6"></div>
        </div>

        {/* Desktop Layout: Asymmetric 7 / 5 Editorial Index */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-14 xl:gap-16 items-start">
          {/* Left Column: Interactive Editorial Rows (~7 cols) */}
          <div className="lg:col-span-7">
            <EditorialDivider />
            <div className="divide-y divide-[var(--tsc-line)]">
              {SYSTEM_STUDIES.map((study, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={study.id}
                    type="button"
                    onClick={() => handleStudyChange(idx)}
                    aria-pressed={isSelected}
                    className={`w-full group cursor-pointer py-6 transition-all duration-200 text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--tsc-action)] rounded-[6px] px-3.5 -mx-3.5 border-l-[3px] ${
                      isSelected
                        ? "bg-white border-[var(--tsc-action)] shadow-[var(--shadow-warm-sm)]"
                        : "border-transparent hover:bg-white/60"
                    }`}
                  >
                    {/* Top Row: Index + Title + Location + Live Badge */}
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)]">
                          {study.index}
                        </span>
                        <h3 className="font-semibold text-base sm:text-lg text-[var(--tsc-ink)] tracking-tight">
                          {study.title}
                        </h3>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-[var(--tsc-signal)]/15 border border-[var(--tsc-signal)]/40 text-[10px] font-mono text-[var(--tsc-ink)] font-semibold uppercase tracking-wider">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--tsc-action)] animate-pulse" />
                            Active Pipeline
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs text-[var(--tsc-muted)]">
                        {study.location}
                      </span>
                    </div>

                    {/* Content Columns */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-[13px] leading-relaxed">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)] mb-1">
                          PROBLEM
                        </div>
                        <p className="text-[var(--tsc-ink)]/90">{study.problem}</p>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)] mb-1">
                          SYSTEM
                        </div>
                        <p className="text-[var(--tsc-ink)]/90">{study.system}</p>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)] mb-1">
                          EXPECTED CHANGE
                        </div>
                        <p className="font-semibold text-[var(--tsc-action)]">
                          {study.expectedChange}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {/* Section Footer: See more examples across industries */}
            <div className="mt-12 lg:mt-16 pt-8 border-t border-[var(--tsc-line)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="font-mono text-xs font-semibold tracking-wider text-[var(--tsc-muted)] uppercase">
                  SECTOR DIRECTORY &middot; 24 INDUSTRIES
                </div>
                <p className="text-sm text-[var(--tsc-muted)]">
                  Explore concrete systems tailored for local businesses and professional practices.
                </p>
              </div>
              <Link
                href="/industries"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--tsc-ink)] hover:text-[var(--tsc-action)] transition-colors group"
              >
                <span>See more examples</span>
                <span
                  className="font-mono transition-transform duration-150 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  &rarr;
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: Dynamic Living Flow Diagram (~5 cols) */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="rounded-[8px] border border-[var(--tsc-line)] bg-white p-6 lg:p-7 shadow-[var(--shadow-warm-md)] transition-all duration-300">
              <div className="flex items-center justify-between border-b border-[var(--tsc-line)] pb-3 text-xs font-mono text-[var(--tsc-muted)] uppercase">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--tsc-positive)] animate-pulse" />
                  <span className="tracking-wider text-[11px] font-semibold text-[var(--tsc-ink)]">
                    EXECUTION PIPELINE
                  </span>
                </div>

                {/* Simulation Control */}
                <Magnetic pullFactor={0.16}>
                  <button
                    type="button"
                    onClick={triggerSimulation}
                    disabled={isSimulating}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] hover:bg-[var(--tsc-paper)] text-[10px] font-mono uppercase text-[var(--tsc-ink)] transition-colors disabled:opacity-50 cursor-pointer shadow-[var(--shadow-warm-xs)]"
                  >
                    {isSimulating ? (
                      <>
                        <RotateCcw
                          className="h-2.5 w-2.5 animate-spin text-[var(--tsc-action)]"
                          strokeWidth={1.7}
                        />
                        <span>Running…</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-2.5 w-2.5 fill-current text-[var(--tsc-action)]" />
                        <span>Simulate Flow</span>
                      </>
                    )}
                  </button>
                </Magnetic>
              </div>

              {/* Animated Pipeline Nodes */}
              <div className="mt-6 space-y-3 font-mono">
                {activeStudy.diagramSteps.map((step, stepIdx) => {
                  const isLast = stepIdx === activeStudy.diagramSteps.length - 1;
                  const isCompleted = stepIdx < activeStepIndex;
                  const isCurrent = stepIdx === activeStepIndex;
                  const isExpanded = expandedStep === stepIdx;

                  return (
                    <div key={step.name} className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() => setExpandedStep(isExpanded ? null : stepIdx)}
                        className={`w-full text-left group/step flex items-start justify-between gap-3 p-2.5 rounded-[6px] border transition-all duration-300 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--tsc-action)] ${
                          isCurrent
                            ? "border-[var(--tsc-action)] bg-[var(--tsc-surface)] shadow-[var(--shadow-warm-sm)]"
                            : isCompleted
                              ? "border-[var(--tsc-line)]/70 bg-white hover:border-[var(--tsc-ink)]/30"
                              : "border-transparent bg-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] border text-[11px] font-bold transition-all duration-300 ${
                              isCurrent
                                ? "border-[var(--tsc-action)] bg-[var(--tsc-action)] text-white"
                                : isCompleted
                                  ? "border-[var(--tsc-positive)]/40 bg-[var(--tsc-positive)]/10 text-[var(--tsc-positive)]"
                                  : "border-[var(--tsc-line)] bg-white text-[var(--tsc-muted)]"
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="h-3.5 w-3.5" strokeWidth={1.7} />
                            ) : (
                              stepIdx + 1
                            )}
                          </span>

                          <div className="min-w-0">
                            <div
                              className={`text-xs font-semibold tracking-wide transition-colors truncate ${
                                isCurrent
                                  ? "text-[var(--tsc-ink)]"
                                  : isCompleted
                                    ? "text-[var(--tsc-ink)]/90"
                                    : "text-[var(--tsc-muted)]"
                              }`}
                            >
                              {step.name}
                            </div>
                            <div className="text-[10px] text-[var(--tsc-muted)] font-normal mt-0.5 truncate">
                              {step.subtext}
                            </div>
                          </div>
                        </div>

                        {/* Step Telemetry Status & Trace Trigger */}
                        <div className="text-right shrink-0 flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1.5">
                            {step.telemetryPayload && (
                              <span
                                className={`flex items-center gap-0.5 text-[9px] font-mono px-1 py-0.5 rounded-[4px] transition-colors ${
                                  isExpanded
                                    ? "text-[var(--tsc-action)] bg-[var(--tsc-action)]/10 font-medium"
                                    : "text-[var(--tsc-muted)] group-hover/step:text-[var(--tsc-ink)]"
                                }`}
                              >
                                <Code2 className="h-2.5 w-2.5" strokeWidth={1.7} />
                                <span>{isExpanded ? "close" : "trace"}</span>
                              </span>
                            )}
                            <span
                              className={`inline-block text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-[4px] border ${
                                isCurrent
                                  ? "text-[var(--tsc-action)] border-[var(--tsc-action)]/30 bg-[var(--tsc-action)]/5"
                                  : isCompleted
                                    ? "text-[var(--tsc-positive)] border-[var(--tsc-positive)]/20 bg-[var(--tsc-positive)]/10"
                                    : "text-[var(--tsc-muted)]/60 border-[var(--tsc-line)]/50"
                              }`}
                            >
                              {isCurrent ? "RUNNING" : isCompleted ? "PASS" : "IDLE"}
                            </span>
                          </div>
                          <div className="text-[9px] text-[var(--tsc-muted)] tabular-nums">
                            {step.latency}
                          </div>
                        </div>
                      </button>

                      {/* Expandable Technical Telemetry Inspector */}
                      <AnimatePresence>
                        {isExpanded && step.telemetryPayload && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <div className="rounded-[6px] border border-[var(--tsc-line)] bg-[var(--tsc-ink)] text-[#E2E8F0] p-3 text-[11px] font-mono shadow-inner my-1">
                              <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2 text-[10px] text-zinc-400">
                                <div className="flex items-center gap-1.5">
                                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--tsc-action)] animate-pulse" />
                                  <span className="uppercase tracking-wider font-semibold text-zinc-300">
                                    {"EVENT TRACE // "}
                                    {step.name}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    if (step.telemetryPayload) {
                                      handleCopyPayload(e, stepIdx, step.telemetryPayload);
                                    }
                                  }}
                                  className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white transition-colors px-1.5 py-0.5 rounded-[4px] hover:bg-white/10 cursor-pointer"
                                  title="Copy JSON Payload"
                                >
                                  {copiedStep === stepIdx ? (
                                    <>
                                      <Check
                                        className="h-3 w-3 text-[var(--tsc-positive)]"
                                        strokeWidth={1.7}
                                      />
                                      <span className="text-[var(--tsc-positive)]">Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" strokeWidth={1.7} />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="text-[10px] leading-relaxed text-zinc-300 overflow-x-auto whitespace-pre font-mono p-2 rounded-[4px] bg-black/30">
                                {JSON.stringify(step.telemetryPayload, null, 2)}
                              </pre>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {!isLast && (
                        <div
                          className="relative ml-5 h-3.5 w-px bg-[var(--tsc-line)]"
                          aria-hidden="true"
                        >
                          {isCurrent && (
                            <span className="absolute -left-[2px] top-0 h-1.5 w-1.5 rounded-full bg-[var(--tsc-action)] animate-ping" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Anticipated Outcome Bar */}
              <div className="mt-6 border-t border-[var(--tsc-line)] pt-4 flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-[var(--tsc-muted)] uppercase tracking-wider text-[11px] block">
                    ANTICIPATED OUTCOME
                  </span>
                  <span className="text-[10px] text-[var(--tsc-muted)]/80">
                    Engineered operational return
                  </span>
                </div>
                <span className="font-bold text-sm text-[var(--tsc-positive)] px-2.5 py-1 rounded-[4px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)]">
                  {activeStudy.expectedChange}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sequential Stream */}
        <div className="lg:hidden space-y-8">
          {SYSTEM_STUDIES.map((study) => (
            <div
              key={study.id}
              className="rounded-[8px] border border-[var(--tsc-line)] bg-white p-5 space-y-4 shadow-[var(--shadow-warm-sm)]"
            >
              {/* Header */}
              <div className="flex items-baseline justify-between border-b border-[var(--tsc-line)] pb-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)]">
                    {study.index}
                  </span>
                  <h3 className="font-semibold text-base text-[var(--tsc-ink)]">{study.title}</h3>
                </div>
                <span className="font-mono text-xs text-[var(--tsc-muted)]">{study.location}</span>
              </div>

              {/* Data Rows */}
              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)]">
                    PROBLEM
                  </div>
                  <p className="mt-0.5 text-[var(--tsc-ink)]">{study.problem}</p>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)]">
                    SYSTEM
                  </div>
                  <p className="mt-0.5 text-[var(--tsc-ink)]">{study.system}</p>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)]">
                    EXPECTED CHANGE
                  </div>
                  <p className="mt-0.5 font-semibold text-[var(--tsc-action)]">
                    {study.expectedChange}
                  </p>
                </div>
              </div>

              {/* Sequential Flow */}
              <div className="border-t border-[var(--tsc-line)] pt-3 font-mono text-[11px] space-y-2.5 text-[var(--tsc-muted)]">
                {study.diagramSteps.map((step, idx) => (
                  <div key={step.name} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-[9px] font-bold text-[var(--tsc-ink)]">
                        {idx + 1}
                      </span>
                      <span className="text-[var(--tsc-ink)] text-xs truncate">{step.name}</span>
                    </div>
                    <span className="text-[10px] text-[var(--tsc-muted)] shrink-0 tabular-nums">
                      {step.latency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
