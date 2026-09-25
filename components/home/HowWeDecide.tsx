"use client";

import {
  ArrowUp,
  CheckCircle2,
  ChevronRight,
  LineChart,
  type LucideIcon,
  ShieldCheck,
  Target,
  Workflow,
} from "lucide-react";
import { useState } from "react";
import { EditorialDivider, SectionLabel } from "@/components/ui/editorial";
import { PRINCIPLES, type Principle } from "@/content/principles";

const ICON_MAP: Record<Principle["iconName"], LucideIcon> = {
  Target,
  Workflow,
  ShieldCheck,
  LineChart,
};

export function HowWeDecide() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <section
      id="how-we-decide"
      aria-labelledby="how-we-decide-heading"
      className="relative bg-[var(--tsc-paper)] border-b border-[var(--tsc-line)] pt-8 pb-16 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-24 font-geist"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        {/* Section Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--tsc-line)] pb-5 mb-10 sm:mb-14">
          <div className="flex items-center gap-3">
            <span
              className="inline-block h-2 w-2 rounded-full bg-[var(--tsc-action)] ring-4 ring-[var(--tsc-action)]/20"
              aria-hidden="true"
            />
            <SectionLabel>02 / HOW WE DECIDE &middot; OPERATING MANIFESTO</SectionLabel>
          </div>
          <span className="font-mono text-xs text-[var(--tsc-muted)] tracking-wider uppercase">
            4 Architectural Guardrails
          </span>
        </div>

        {/* Asymmetric 5 / 7 Layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-16 items-start">
          {/* Left Column: Manifesto Headline & Overview (~5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="space-y-4">
              <h2
                id="how-we-decide-heading"
                className="text-[34px] sm:text-[46px] lg:text-[54px] font-bold leading-[1.02] tracking-[-0.035em] text-[var(--tsc-ink)]"
              >
                Technology is rarely
                <br />
                the first decision.
              </h2>
              <p className="text-base sm:text-lg text-[var(--tsc-muted)] leading-relaxed max-w-md">
                Before recommending a tool or writing code, we isolate where an operation leaks
                time, attention, or revenue — and design the smallest reliable system that solves it
                without disrupting the floor.
              </p>
            </div>

            {/* Operating Contrast Artifact */}
            <div className="rounded-[8px] border border-[var(--tsc-line)] bg-white/70 backdrop-blur-sm p-5 shadow-[var(--shadow-warm-xs)] space-y-3.5 font-mono">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-wider border-b border-[var(--tsc-line)] pb-2.5">
                <span className="text-[var(--tsc-muted)]">OPERATING POSTURE</span>
                <span className="text-[var(--tsc-action)] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3" strokeWidth={1.7} />
                  STUDIO DISCIPLINE
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs leading-relaxed">
                <div className="space-y-1">
                  <span className="text-[10px] text-[var(--tsc-muted)] font-semibold uppercase tracking-wider block">
                    THE COMMON PITFALL
                  </span>
                  <p className="text-[var(--tsc-muted)] text-[11px]">
                    Buy complex platforms first; force staff to fit the software; guess the return.
                  </p>
                </div>
                <div className="space-y-1 sm:border-l sm:border-[var(--tsc-line)] sm:pl-3.5">
                  <span className="text-[10px] text-[var(--tsc-action)] font-semibold uppercase tracking-wider block">
                    OUR GUARDRAIL
                  </span>
                  <p className="text-[var(--tsc-ink)] text-[11px] font-medium">
                    Find the constraint; wire existing tools; automate only the predictable.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Navigation to Start / Diagnosis */}
            <div className="pt-1">
              <a
                href="#start"
                className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[var(--tsc-ink)] hover:text-[var(--tsc-action)] transition-colors group"
              >
                <span>Diagnose your own workflow</span>
                <ArrowUp
                  className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-y-0.5 text-[var(--tsc-action)]"
                  strokeWidth={1.7}
                />
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Guardrail Cards (~7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <EditorialDivider className="mb-6 hidden lg:block" />

            {PRINCIPLES.map((principle, idx) => {
              const isActive = activeIdx === idx;
              const Icon = ICON_MAP[principle.iconName];

              return (
                <button
                  type="button"
                  key={principle.number}
                  aria-expanded={isActive}
                  onClick={() => setActiveIdx((prev) => (prev === idx ? null : idx))}
                  className={`group w-full text-left cursor-pointer rounded-[8px] border p-5 sm:p-6 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--tsc-action)] ${
                    isActive
                      ? "border-[var(--tsc-action)] bg-white shadow-[var(--shadow-warm-sm)]"
                      : "border-[var(--tsc-line)] bg-white/60 hover:bg-white hover:border-[var(--tsc-line-strong)]"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-3 border-b border-[var(--tsc-line)]/70 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-[var(--tsc-muted)]">
                        RULE {principle.number}
                      </span>
                      <span className="text-[var(--tsc-line-strong)]">&middot;</span>
                      <span className="font-mono text-[10px] tracking-widest text-[var(--tsc-muted)] uppercase">
                        {principle.tag}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span
                        className={`px-2 py-0.5 rounded-[4px] border text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                          isActive
                            ? "bg-[var(--tsc-action)]/10 text-[var(--tsc-action)] border-[var(--tsc-action)]/30"
                            : "bg-[var(--tsc-surface)] text-[var(--tsc-muted)] border-[var(--tsc-line)]"
                        }`}
                      >
                        {principle.metric}
                      </span>
                      <ChevronRight
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          isActive
                            ? "rotate-90 text-[var(--tsc-action)]"
                            : "text-[var(--tsc-muted)] group-hover:translate-x-0.5"
                        }`}
                        strokeWidth={1.7}
                      />
                    </div>
                  </div>

                  {/* Title & Icon */}
                  <div className="mt-4 flex items-start gap-3.5">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border transition-colors ${
                        isActive
                          ? "bg-[var(--tsc-action)] text-white border-[var(--tsc-action)]"
                          : "bg-[var(--tsc-surface)] text-[var(--tsc-ink)] border-[var(--tsc-line)] group-hover:border-[var(--tsc-ink)]/30"
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.7} />
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-base sm:text-lg text-[var(--tsc-ink)] tracking-tight">
                        {principle.label}
                      </h3>
                      <p className="text-xs sm:text-[13px] font-medium text-[var(--tsc-action)] leading-normal">
                        {principle.headline}
                      </p>
                    </div>
                  </div>

                  {/* Core Thesis Copy */}
                  <p className="mt-3 text-xs sm:text-sm text-[var(--tsc-ink)]/85 leading-relaxed pl-0 sm:pl-[49px]">
                    {principle.thesis}
                  </p>

                  {/* Expanded Detail Drawer (Active State) */}
                  {isActive && (
                    <div className="mt-4 pt-4 border-t border-[var(--tsc-line)]/80 pl-0 sm:pl-[49px] space-y-3.5 animate-fadeIn">
                      {/* In Practice Scenario */}
                      <div className="rounded-[6px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] p-3 text-xs leading-relaxed">
                        <span className="font-mono text-[10px] font-bold text-[var(--tsc-muted)] uppercase tracking-wider block mb-1">
                          IN PRACTICE &middot; REAL OPERATING SCENARIO
                        </span>
                        <p className="text-[var(--tsc-ink)]">{principle.inPractice}</p>
                      </div>

                      {/* Studio Guardrail Rule */}
                      <div className="flex items-baseline gap-2 text-xs font-mono text-[var(--tsc-muted)]">
                        <span className="text-[var(--tsc-action)] font-bold uppercase tracking-wider shrink-0 text-[10px]">
                          GUARDRAIL:
                        </span>
                        <span className="italic text-[var(--tsc-ink)]/90">
                          {principle.guardrail}
                        </span>
                      </div>

                      {/* Technical Architecture Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {principle.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block px-2 py-0.5 rounded-[3px] bg-white border border-[var(--tsc-line)] text-[9px] font-mono tracking-wider text-[var(--tsc-muted)] uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}

            <EditorialDivider className="mt-6 hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
