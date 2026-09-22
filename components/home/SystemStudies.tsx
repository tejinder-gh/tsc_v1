"use client";

import { useState } from "react";
import { EditorialDivider, SectionLabel } from "@/components/ui/editorial";

interface SystemStudy {
  id: string;
  index: string;
  title: string;
  location: string;
  problem: string;
  system: string;
  expectedChange: string;
  diagramSteps: readonly string[];
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
      "INCOMING CALL",
      "VOICE INTAKE",
      "BOOKING RULES EVALUATION",
      "RESERVATION COMMITTED",
      "EXCEPTION TO MANAGER",
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
      "WEEKLY ORDER TRIGGER",
      "SALES & STOCK DATA SYNC",
      "DRAFT SUPPLIER ORDERS",
      "MOBILE SUMMARY DISPATCH",
      "ONE-TAP OWNER APPROVAL",
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
      "BOOKING SCHEDULED",
      "7-DAY ADVANCE NOTICE",
      "24-HR SMS CONFIRMATION",
      "2-HR WINDOW REMINDER",
      "ONE-TAP RESCHEDULE OR CONFIRM",
    ],
  },
];

export function SystemStudies() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeStudy = SYSTEM_STUDIES[selectedIndex];

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
                    onClick={() => setSelectedIndex(idx)}
                    aria-pressed={isSelected}
                    className={`w-full group cursor-pointer py-6 transition-colors text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--tsc-action)] rounded-[4px] px-2 -mx-2 ${
                      isSelected ? "bg-[var(--tsc-surface)]" : "hover:bg-[var(--tsc-surface)]/60"
                    }`}
                  >
                    {/* Top Row: Index + Title + Location */}
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)]">
                          {study.index}
                        </span>
                        <h3 className="font-semibold text-base sm:text-lg text-[var(--tsc-ink)] tracking-tight">
                          {study.title}
                        </h3>
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

          {/* Right Column: Dynamic Flow Diagram (~5 cols) */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="rounded-[12px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] p-6 lg:p-7">
              <div className="flex items-center justify-between border-b border-[var(--tsc-line)] pb-3 text-xs font-mono text-[var(--tsc-muted)] uppercase">
                <span className="tracking-wider">SYSTEM EXECUTION FLOW</span>
                <span className="font-medium text-[var(--tsc-ink)]">
                  {activeStudy.index} / {activeStudy.title}
                </span>
              </div>

              <div className="mt-6 space-y-3 font-mono">
                {activeStudy.diagramSteps.map((step, stepIdx) => {
                  const isLast = stepIdx === activeStudy.diagramSteps.length - 1;
                  return (
                    <div key={step} className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] border border-[var(--tsc-line)] bg-white text-[11px] font-bold text-[var(--tsc-ink)]">
                          {stepIdx + 1}
                        </span>
                        <div className="text-xs font-semibold tracking-wide text-[var(--tsc-ink)]">
                          {step}
                        </div>
                      </div>
                      {!isLast && (
                        <div className="ml-3 h-3 w-px bg-[var(--tsc-line)]" aria-hidden="true" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-[var(--tsc-line)] pt-4 flex items-center justify-between font-mono text-xs">
                <span className="text-[var(--tsc-muted)] uppercase tracking-wider">
                  ANTICIPATED OUTCOME
                </span>
                <span className="font-bold text-[var(--tsc-positive)]">
                  {activeStudy.expectedChange}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sequential Stream (No required interaction) */}
        <div className="lg:hidden space-y-8">
          {SYSTEM_STUDIES.map((study) => (
            <div
              key={study.id}
              className="rounded-[10px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] p-5 space-y-4"
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
              <div className="border-t border-[var(--tsc-line)] pt-3 font-mono text-[11px] space-y-1.5 text-[var(--tsc-muted)]">
                {study.diagramSteps.map((step, idx) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="text-[var(--tsc-ink)] font-bold">{idx + 1}.</span>
                    <span>{step}</span>
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
