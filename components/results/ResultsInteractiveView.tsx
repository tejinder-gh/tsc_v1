"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Calculator, CheckCircle2, Clock, DollarSign } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PageEyebrow } from "@/components/public/PageEyebrow";
import type { RecentBuild } from "@/content/proof";
import { annualCost, formatCurrency, ROI_BOUNDS, type RoiInputs } from "@/lib/roi";

interface ResultsInteractiveViewProps {
  recentBuilds: readonly RecentBuild[];
}

type FilterCategory = "all" | "local" | "practice";

const PRESETS = [
  { label: "Restaurant Rush", hours: 12, rate: 25 },
  { label: "Clinic Intake Desk", hours: 20, rate: 35 },
  { label: "Trade / Dispatch", hours: 15, rate: 45 },
  { label: "Professional Practice", hours: 10, rate: 75 },
];

export function ResultsInteractiveView({ recentBuilds }: ResultsInteractiveViewProps) {
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [roiInputs, setRoiInputs] = useState<RoiInputs>({
    hoursPerWeek: 12,
    hourlyCost: 35,
  });

  const filteredBuilds = recentBuilds.filter((build) => {
    if (filter === "all") return true;
    return build.segment === filter;
  });

  const countAll = recentBuilds.length;
  const countCommercial = recentBuilds.filter((b) => b.segment === "local").length;
  const countPractice = recentBuilds.filter((b) => b.segment === "practice").length;

  const totalAnnualDrag = annualCost(roiInputs);
  const annualHoursLost = Math.round(roiInputs.hoursPerWeek * 52);
  const estimatedSavings = Math.round(totalAnnualDrag * 0.7); // ~70% manual reduction via automation
  const estimatedHoursReturned = Math.round(annualHoursLost * 0.7);

  return (
    <div className="space-y-24">
      {/* 01. Modeled Scenarios Section */}
      <section id="scenarios" aria-label="Modeled Scenarios" className="space-y-10">
        {/* Header & Category Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--tsc-line)] pb-8">
          <div className="max-w-2xl space-y-3">
            <PageEyebrow>MODELED SYSTEM STUDIES</PageEyebrow>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--tsc-ink)]">
              Real constraints, engineered systems, anticipated returns.
            </h2>
            <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
              Examine the bottleneck pattern: high manual repetition, an identifiable trigger, and a
              system that handles the predictable portion with human exception escalation.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 p-1 rounded-[8px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setFilter("all")}
              aria-pressed={filter === "all"}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-mono tracking-tight transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-white text-[var(--tsc-ink)] font-bold shadow-[var(--shadow-warm-sm)]"
                  : "text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)]"
              }`}
            >
              All ({countAll})
            </button>
            <button
              type="button"
              onClick={() => setFilter("local")}
              aria-pressed={filter === "local"}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-mono tracking-tight transition-all cursor-pointer ${
                filter === "local"
                  ? "bg-white text-[var(--tsc-ink)] font-bold shadow-[var(--shadow-warm-sm)]"
                  : "text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)]"
              }`}
            >
              Commercial ({countCommercial})
            </button>
            <button
              type="button"
              onClick={() => setFilter("practice")}
              aria-pressed={filter === "practice"}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-mono tracking-tight transition-all cursor-pointer ${
                filter === "practice"
                  ? "bg-white text-[var(--tsc-ink)] font-bold shadow-[var(--shadow-warm-sm)]"
                  : "text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)]"
              }`}
            >
              Practices ({countPractice})
            </button>
          </div>
        </div>

        {/* Dynamic Scenarios Grid with Motion */}
        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredBuilds.map((build) => (
              <motion.article
                key={build.business}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="group flex flex-col rounded-[8px] border border-[var(--tsc-line)] bg-white p-7 sm:p-8 space-y-6 justify-between shadow-[var(--shadow-warm-sm)] hover:shadow-[var(--shadow-warm-md)] hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="space-y-4">
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between border-b border-[var(--tsc-line)] pb-3">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)]">
                      MODELED SCENARIO
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-[var(--tsc-muted)] font-semibold">
                      {build.segment === "local" ? "Commercial" : "Practice"}
                    </span>
                  </div>

                  {/* Operation Title */}
                  <h3 className="font-semibold text-lg text-[var(--tsc-ink)] group-hover:text-[var(--tsc-action)] transition-colors">
                    {build.business}
                  </h3>

                  {/* Constraint */}
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)] block">
                      OPERATIONAL CONSTRAINT
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--tsc-ink)] leading-relaxed">
                      {build.problem}
                    </p>
                  </div>

                  {/* System Architecture */}
                  <div className="space-y-1 pt-3 border-t border-[var(--tsc-line)]">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)] block">
                      SYSTEM INTERVENTION
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                      {build.automation}
                    </p>
                  </div>
                </div>

                {/* Anticipated Outcome Metric */}
                <div className="pt-4 border-t border-[var(--tsc-line)] bg-[var(--tsc-surface)]/60 -mx-7 sm:-mx-8 -mb-7 sm:-mb-8 p-5 rounded-b-[7px] flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)] block">
                      TARGET / EXPECTED RANGE
                    </span>
                    <span className="font-mono text-sm sm:text-base font-bold text-[var(--tsc-action)] block mt-0.5">
                      {build.result}
                    </span>
                  </div>
                  <span
                    className="h-2 w-2 rounded-full bg-[var(--tsc-positive)]/60"
                    aria-hidden="true"
                  />
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 02. Interactive Hours & ROI Calculator */}
      <section
        id="calculator"
        aria-label="Hours and Value Calculator"
        className="rounded-[8px] border border-[var(--tsc-line)] bg-white p-8 sm:p-10 lg:p-12 shadow-[var(--shadow-warm-md)]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Sliders and Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-[var(--tsc-signal)]/15 border border-[var(--tsc-signal)]/40 font-mono text-[11px] text-[var(--tsc-ink)] font-semibold uppercase tracking-wider">
                <Calculator className="h-3.5 w-3.5 text-[var(--tsc-action)]" strokeWidth={1.7} />
                <span>Interactive Cost & Recovery Estimator</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]">
                Calculate what repetitive work is costing your operation.
              </h3>
              <p className="text-sm text-[var(--tsc-muted)] leading-relaxed">
                Adjust the sliders to match your current operational bottleneck. See the annual time
                drag and estimated return an automated system recaptures.
              </p>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)] block">
                Quick Scenario Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() =>
                      setRoiInputs({ hoursPerWeek: preset.hours, hourlyCost: preset.rate })
                    }
                    className="px-2.5 py-1 rounded-[4px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] hover:bg-[var(--tsc-paper)] text-xs font-mono text-[var(--tsc-ink)] transition-colors cursor-pointer"
                  >
                    {preset.label} ({preset.hours}h @ ${preset.rate}/h)
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-6 pt-2">
              {/* Slider 1: Hours */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-[var(--tsc-ink)] uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[var(--tsc-muted)]" strokeWidth={1.7} />
                    Hours spent on routine admin / intake / calls per week
                  </span>
                  <span className="font-bold text-sm text-[var(--tsc-action)] tabular-nums px-2 py-0.5 rounded-[4px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)]">
                    {roiInputs.hoursPerWeek} hrs / week
                  </span>
                </div>
                <input
                  type="range"
                  min={ROI_BOUNDS.hoursPerWeek.min}
                  max={ROI_BOUNDS.hoursPerWeek.max}
                  value={roiInputs.hoursPerWeek}
                  onChange={(e) =>
                    setRoiInputs((prev) => ({
                      ...prev,
                      hoursPerWeek: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                  aria-label="Hours spent on routine work per week"
                />
                <div className="flex justify-between text-[10px] font-mono text-[var(--tsc-muted)]">
                  <span>1 hr/wk</span>
                  <span>30 hrs/wk</span>
                  <span>60 hrs/wk</span>
                </div>
              </div>

              {/* Slider 2: Rate */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-[var(--tsc-ink)] uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-[var(--tsc-muted)]" strokeWidth={1.7} />
                    Blended hourly labor / opportunity cost
                  </span>
                  <span className="font-bold text-sm text-[var(--tsc-action)] tabular-nums px-2 py-0.5 rounded-[4px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)]">
                    ${roiInputs.hourlyCost} / hr CAD
                  </span>
                </div>
                <input
                  type="range"
                  min={ROI_BOUNDS.hourlyCost.min}
                  max={ROI_BOUNDS.hourlyCost.max}
                  value={roiInputs.hourlyCost}
                  onChange={(e) =>
                    setRoiInputs((prev) => ({
                      ...prev,
                      hourlyCost: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                  aria-label="Blended hourly cost"
                />
                <div className="flex justify-between text-[10px] font-mono text-[var(--tsc-muted)]">
                  <span>$15/hr (Entry admin)</span>
                  <span>$100/hr (Manager)</span>
                  <span>$200/hr (Professional)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Impact Telemetry Card (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--tsc-line)] pb-3">
              <span className="font-mono text-[11px] font-semibold text-[var(--tsc-ink)] uppercase tracking-wider">
                ESTIMATED ANNUAL IMPACT
              </span>
              <span className="text-[10px] font-mono text-[var(--tsc-muted)] uppercase">
                52-Week Projection
              </span>
            </div>

            <div className="space-y-5">
              {/* Cost Drain Metric */}
              <div className="p-4 rounded-[8px] bg-white border border-[var(--tsc-line)] space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)] block">
                  Current Annual Operational Drain
                </span>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)] tabular-nums">
                  {formatCurrency(totalAnnualDrag)}
                </div>
                <span className="text-[11px] text-[var(--tsc-muted)] block font-mono">
                  {annualHoursLost} hours diverted to manual repetition
                </span>
              </div>

              {/* Target Automation Return */}
              <div className="p-4 rounded-[8px] bg-[var(--tsc-action)] text-white space-y-1 shadow-[var(--shadow-warm-sm)]">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-white/80">
                  <span>Anticipated Recovery (~70%)</span>
                  <span className="px-1.5 py-0.5 rounded-[4px] bg-white/20 text-white font-semibold">
                    Target
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-signal)] tabular-nums">
                  {formatCurrency(estimatedSavings)}
                  <span className="text-xs font-normal text-white/70 ml-1">/ year</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/90 pt-1">
                  <CheckCircle2
                    className="h-3.5 w-3.5 text-[var(--tsc-signal)] shrink-0"
                    strokeWidth={1.7}
                  />
                  <span>~{estimatedHoursReturned} hours returned to revenue work</span>
                </div>
              </div>

              {/* Action Prompt */}
              <div className="pt-2">
                <Link
                  href="/book"
                  className="group flex w-full items-center justify-between rounded-[8px] bg-[var(--tsc-ink)] px-5 py-3 text-sm font-medium text-[var(--tsc-paper)] transition-all hover:bg-[var(--tsc-action)] shadow-[var(--shadow-warm-sm)]"
                >
                  <span>Audit this in a 30-min call</span>
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={1.7}
                  />
                </Link>
                <span className="mt-2 block text-center font-mono text-[10px] text-[var(--tsc-muted)]">
                  Free discovery call &middot; Leave with 3 scoped system options
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
