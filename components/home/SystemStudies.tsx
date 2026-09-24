"use client";

import { Check, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { EditorialDivider, SectionLabel } from "@/components/ui/editorial";

interface SystemStudy {
  id: string;
  index: string;
  title: string;
  location: string;
  problem: string;
  system: string;
  expectedChange: string;
  diagramSteps: readonly {
    name: string;
    latency: string;
    subtext: string;
  }[];
}

const SYSTEM_STUDIES: readonly SystemStudy[] = [
  {
    id: "restaurant",
    index: "01",
    title: "FAMILY RESTAURANT",
    location: "Mississauga",
    problem: "Phone went unanswered through every dinner rush; reservations went to voicemail.",
    system: "Voice intake → booking rules → reservation → exception sent to manager.",
    expectedChange: "30+ calls/month captured",
    diagramSteps: [
      { name: "INCOMING CALL", latency: "0ms", subtext: "Twilio voice gateway trigger" },
      { name: "VOICE INTAKE & ASR", latency: "180ms", subtext: "Whisper speech-to-text model" },
      {
        name: "BOOKING RULES EVALUATION",
        latency: "42ms",
        subtext: "Table availability & cover check",
      },
      {
        name: "RESERVATION COMMITTED",
        latency: "110ms",
        subtext: "Direct POS/Calendar write & SMS",
      },
      { name: "EXCEPTION TO MANAGER", latency: "65ms", subtext: "Staff push alert for party > 6" },
    ],
  },
  {
    id: "convenience",
    index: "02",
    title: "CONVENIENCE STORE",
    location: "East Toronto",
    problem: "Owner spent Sunday nights building supplier orders from memory and a notebook.",
    system:
      "Sales and stock data draft weekly orders for each supplier; owner approves via mobile.",
    expectedChange: "5 hrs/week back",
    diagramSteps: [
      { name: "WEEKLY ORDER TRIGGER", latency: "0ms", subtext: "Sunday 21:00 scheduled cron" },
      {
        name: "SALES & STOCK DATA SYNC",
        latency: "340ms",
        subtext: "POS velocity & reorder levels",
      },
      { name: "DRAFT SUPPLIER ORDERS", latency: "95ms", subtext: "Vendor SKU batch generation" },
      { name: "MOBILE SUMMARY DISPATCH", latency: "120ms", subtext: "Interactive WhatsApp digest" },
      { name: "ONE-TAP OWNER APPROVAL", latency: "50ms", subtext: "One-click webhook dispatch" },
    ],
  },
  {
    id: "salon",
    index: "03",
    title: "HAIR SALON",
    location: "Two Locations",
    problem: "No-shows ran 4 to 6 per week per location; confirmation texts were sent by hand.",
    system:
      "Automated reminder ladder at 7 days, 24 hours, and 2 hours, with one-tap reschedule links.",
    expectedChange: "No-shows down roughly half",
    diagramSteps: [
      { name: "BOOKING SCHEDULED", latency: "0ms", subtext: "Client appointment created" },
      { name: "7-DAY ADVANCE NOTICE", latency: "80ms", subtext: "Preparation instructions sent" },
      { name: "24-HR SMS CONFIRMATION", latency: "95ms", subtext: "Two-way confirmation prompt" },
      { name: "2-HR WINDOW REMINDER", latency: "70ms", subtext: "Stylist station preparation" },
      {
        name: "ONE-TAP RESCHEDULE OR CONFIRM",
        latency: "35ms",
        subtext: "Automated slot reallocation",
      },
    ],
  },
];

export function SystemStudies() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(2);
  const [isSimulating, setIsSimulating] = useState(false);
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
  };

  const triggerSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
  };

  return (
    <section
      aria-labelledby="system-studies-heading"
      className="bg-[var(--tsc-paper)] border-b border-[var(--tsc-line)] py-16 sm:py-20 lg:py-24 font-geist"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <SectionLabel className="mb-4">02 / SYSTEM STUDIES</SectionLabel>
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
            <EditorialDivider />
          </div>

          {/* Right Column: Dynamic Living Flow Diagram (~5 cols) */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="rounded-[14px] border border-[var(--tsc-line)] bg-white p-6 lg:p-7 shadow-[var(--shadow-warm-md)] transition-all duration-300">
              <div className="flex items-center justify-between border-b border-[var(--tsc-line)] pb-3 text-xs font-mono text-[var(--tsc-muted)] uppercase">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--tsc-positive)] animate-pulse" />
                  <span className="tracking-wider text-[11px] font-semibold text-[var(--tsc-ink)]">
                    EXECUTION PIPELINE
                  </span>
                </div>

                {/* Simulation Control */}
                <button
                  type="button"
                  onClick={triggerSimulation}
                  disabled={isSimulating}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-[4px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] hover:bg-[var(--tsc-paper)] text-[10px] font-mono uppercase text-[var(--tsc-ink)] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSimulating ? (
                    <>
                      <RotateCcw className="h-2.5 w-2.5 animate-spin text-[var(--tsc-action)]" />
                      <span>Running…</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-2.5 w-2.5 fill-current text-[var(--tsc-action)]" />
                      <span>Simulate Flow</span>
                    </>
                  )}
                </button>
              </div>

              {/* Animated Pipeline Nodes */}
              <div className="mt-6 space-y-3 font-mono">
                {activeStudy.diagramSteps.map((step, stepIdx) => {
                  const isLast = stepIdx === activeStudy.diagramSteps.length - 1;
                  const isCompleted = stepIdx < activeStepIndex;
                  const isCurrent = stepIdx === activeStepIndex;

                  return (
                    <div key={step.name} className="space-y-2">
                      <div
                        className={`flex items-start justify-between gap-3 p-2.5 rounded-[6px] border transition-all duration-300 ${
                          isCurrent
                            ? "border-[var(--tsc-action)] bg-[var(--tsc-surface)] shadow-[var(--shadow-warm-sm)]"
                            : isCompleted
                              ? "border-[var(--tsc-line)]/70 bg-white"
                              : "border-transparent bg-transparent opacity-60"
                        }`}
                      >
                        <div className="flex items-start gap-3">
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
                              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                            ) : (
                              stepIdx + 1
                            )}
                          </span>

                          <div>
                            <div
                              className={`text-xs font-semibold tracking-wide transition-colors ${
                                isCurrent
                                  ? "text-[var(--tsc-ink)]"
                                  : isCompleted
                                    ? "text-[var(--tsc-ink)]/90"
                                    : "text-[var(--tsc-muted)]"
                              }`}
                            >
                              {step.name}
                            </div>
                            <div className="text-[10px] text-[var(--tsc-muted)] font-normal mt-0.5">
                              {step.subtext}
                            </div>
                          </div>
                        </div>

                        {/* Step Telemetry Status */}
                        <div className="text-right shrink-0">
                          <span
                            className={`inline-block text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                              isCurrent
                                ? "text-[var(--tsc-action)] border-[var(--tsc-action)]/30 bg-[var(--tsc-action)]/5"
                                : isCompleted
                                  ? "text-[var(--tsc-positive)] border-[var(--tsc-positive)]/20 bg-green-50/50"
                                  : "text-[var(--tsc-muted)]/60 border-[var(--tsc-line)]/50"
                            }`}
                          >
                            {isCurrent ? "RUNNING" : isCompleted ? "PASS" : "IDLE"}
                          </span>
                          <div className="text-[9px] text-[var(--tsc-muted)] tabular-nums mt-0.5">
                            {step.latency}
                          </div>
                        </div>
                      </div>

                      {!isLast && (
                        <div
                          className="relative ml-5 h-4 w-px bg-[var(--tsc-line)]"
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
                <span className="font-bold text-sm text-[var(--tsc-positive)] px-2.5 py-1 rounded bg-[var(--tsc-surface)] border border-[var(--tsc-line)]">
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
              className="rounded-[12px] border border-[var(--tsc-line)] bg-white p-5 space-y-4 shadow-[var(--shadow-warm-sm)]"
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
              <div className="border-t border-[var(--tsc-line)] pt-3 font-mono text-[11px] space-y-2 text-[var(--tsc-muted)]">
                {study.diagramSteps.map((step, idx) => (
                  <div key={step.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-4 w-4 items-center justify-center rounded-[3px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-[9px] font-bold text-[var(--tsc-ink)]">
                        {idx + 1}
                      </span>
                      <span className="text-[var(--tsc-ink)] text-xs">{step.name}</span>
                    </div>
                    <span className="text-[10px] text-[var(--tsc-muted)]">{step.latency}</span>
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
