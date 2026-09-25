"use client";

import {
  ArrowRight,
  Check,
  Clock,
  Copy,
  DollarSign,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  calculateEnterpriseRoi,
  ENTERPRISE_ROI_BOUNDS,
  type EnterpriseRoiInputs,
  formatCurrency,
} from "@/lib/roi";

interface Preset {
  label: string;
  tagline: string;
  inputs: EnterpriseRoiInputs;
}

const PRESETS: readonly Preset[] = [
  {
    label: "Boutique Firm",
    tagline: "3-5 operators",
    inputs: { teamSize: 3, hourlyWage: 55, weeklyHoursPerPerson: 10 },
  },
  {
    label: "Multi-Provider Clinic",
    tagline: "8-12 staff",
    inputs: { teamSize: 8, hourlyWage: 45, weeklyHoursPerPerson: 15 },
  },
  {
    label: "Mid-Market Enterprise",
    tagline: "20-30 staff",
    inputs: { teamSize: 25, hourlyWage: 40, weeklyHoursPerPerson: 18 },
  },
] as const;

export function RoiCalculator() {
  const [inputs, setInputs] = useState<EnterpriseRoiInputs>({
    teamSize: ENTERPRISE_ROI_BOUNDS.teamSize.default,
    hourlyWage: ENTERPRISE_ROI_BOUNDS.hourlyWage.default,
    weeklyHoursPerPerson: ENTERPRISE_ROI_BOUNDS.weeklyHoursPerPerson.default,
  });

  const [copied, setCopied] = useState(false);

  const outputs = useMemo(() => calculateEnterpriseRoi(inputs), [inputs]);

  const bookingHref = useMemo(() => {
    const params = new URLSearchParams({
      team: inputs.teamSize.toString(),
      wage: inputs.hourlyWage.toString(),
      hours: inputs.weeklyHoursPerPerson.toString(),
      savings: outputs.annualWageSavings.toString(),
      payback: outputs.paybackMonths.toString(),
    });
    return `/book?${params.toString()}`;
  }, [inputs, outputs]);

  const copySummary = () => {
    const text = `The Skill Corner - Operational ROI Model:
• Team Size: ${inputs.teamSize} staff
• Loaded Wage: $${inputs.hourlyWage}/hr
• Repetitive Hours: ${inputs.weeklyHoursPerPerson} hrs/person/wk
• Annual Capacity Recaptured: ${outputs.annualHoursRecaptured.toLocaleString()} hours
• Net Annual Wage Savings: ${formatCurrency(outputs.annualWageSavings)}
• Estimated Deployment: ${formatCurrency(outputs.estimatedDeploymentCost)}
• Modeled Payback: ${outputs.paybackMonths} months (~${outputs.paybackDays} days)
• 3-Year Value Multiple: ${outputs.threeYearNetRoiMultiple}x Net ROI`;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const resetDefaults = () => {
    setInputs({
      teamSize: ENTERPRISE_ROI_BOUNDS.teamSize.default,
      hourlyWage: ENTERPRISE_ROI_BOUNDS.hourlyWage.default,
      weeklyHoursPerPerson: ENTERPRISE_ROI_BOUNDS.weeklyHoursPerPerson.default,
    });
  };

  return (
    <div className="w-full rounded-[14px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] p-6 sm:p-8 lg:p-10 font-geist space-y-8 shadow-[var(--shadow-warm-sm)]">
      {/* Header & Controls Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--tsc-line)] pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold tracking-wider text-[var(--tsc-muted)] uppercase">
              OPERATIONAL VALUE MODEL
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-[var(--tsc-action)]/10 px-2 py-0.5 text-[10px] font-mono font-medium text-[var(--tsc-action)]">
              <Sparkles className="h-3 w-3" />
              Dynamic Payback Engine
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]">
            Calculate your organizational efficiency and payback timeline.
          </h3>
          <p className="text-xs sm:text-sm text-[var(--tsc-muted)] max-w-xl">
            Conservative deterministic modeling based on 50 working weeks/year and a verified 75%
            reduction in routine clerical, booking, and administrative workflows.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setInputs(preset.inputs)}
              className="text-left px-3 py-1.5 rounded-[6px] border border-[var(--tsc-line)] bg-white text-xs font-medium text-[var(--tsc-ink)] hover:border-[var(--tsc-action)] hover:text-[var(--tsc-action)] transition-all cursor-pointer"
            >
              <div className="font-semibold">{preset.label}</div>
              <div className="text-[10px] text-[var(--tsc-muted)] font-mono">{preset.tagline}</div>
            </button>
          ))}
          <button
            type="button"
            onClick={resetDefaults}
            title="Reset to default assumptions"
            className="p-2 rounded-[6px] border border-[var(--tsc-line)] bg-white text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)] transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs Left (7 cols), Financial Metrics Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Sliders */}
        <div className="lg:col-span-7 space-y-7">
          {/* Slider 1: Team Size */}
          <div className="space-y-3 p-4 rounded-[8px] border border-[var(--tsc-line)] bg-white">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-semibold text-[var(--tsc-ink)] uppercase tracking-wider flex items-center gap-2">
                <Users className="h-4 w-4 text-[var(--tsc-muted)]" />
                Team Size (Clerical & Practice Staff)
              </span>
              <span className="font-bold text-sm text-[var(--tsc-action)] tabular-nums px-2.5 py-0.5 rounded bg-[var(--tsc-surface)] border border-[var(--tsc-line)]">
                {inputs.teamSize} {inputs.teamSize === 1 ? "person" : "people"}
              </span>
            </div>
            <input
              type="range"
              min={ENTERPRISE_ROI_BOUNDS.teamSize.min}
              max={ENTERPRISE_ROI_BOUNDS.teamSize.max}
              value={inputs.teamSize}
              onChange={(e) => setInputs((prev) => ({ ...prev, teamSize: Number(e.target.value) }))}
              className="w-full accent-[var(--tsc-action)] cursor-pointer"
              aria-label="Team Size"
            />
            <div className="flex justify-between text-[11px] font-mono text-[var(--tsc-muted)]">
              <span>1 sole practitioner</span>
              <span>25 regional team</span>
              <span>50 enterprise branch</span>
            </div>
          </div>

          {/* Slider 2: Average Loaded Hourly Wage */}
          <div className="space-y-3 p-4 rounded-[8px] border border-[var(--tsc-line)] bg-white">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-semibold text-[var(--tsc-ink)] uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[var(--tsc-muted)]" />
                Blended Loaded Hourly Wage
              </span>
              <span className="font-bold text-sm text-[var(--tsc-action)] tabular-nums px-2.5 py-0.5 rounded bg-[var(--tsc-surface)] border border-[var(--tsc-line)]">
                ${inputs.hourlyWage} / hr CAD
              </span>
            </div>
            <input
              type="range"
              min={ENTERPRISE_ROI_BOUNDS.hourlyWage.min}
              max={ENTERPRISE_ROI_BOUNDS.hourlyWage.max}
              value={inputs.hourlyWage}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, hourlyWage: Number(e.target.value) }))
              }
              className="w-full accent-[var(--tsc-action)] cursor-pointer"
              aria-label="Average Hourly Loaded Wage"
            />
            <div className="flex justify-between text-[11px] font-mono text-[var(--tsc-muted)]">
              <span>$25/hr (Reception / Admin)</span>
              <span>$75/hr (Practice Manager)</span>
              <span>$150/hr (Senior Consultant / Clinician)</span>
            </div>
          </div>

          {/* Slider 3: Repetitive Tasks Handled */}
          <div className="space-y-3 p-4 rounded-[8px] border border-[var(--tsc-line)] bg-white">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-semibold text-[var(--tsc-ink)] uppercase tracking-wider flex items-center gap-2">
                <Clock className="h-4 w-4 text-[var(--tsc-muted)]" />
                Manual Workflow Hours / Person / Week
              </span>
              <span className="font-bold text-sm text-[var(--tsc-action)] tabular-nums px-2.5 py-0.5 rounded bg-[var(--tsc-surface)] border border-[var(--tsc-line)]">
                {inputs.weeklyHoursPerPerson} hrs / person / wk
              </span>
            </div>
            <input
              type="range"
              min={ENTERPRISE_ROI_BOUNDS.weeklyHoursPerPerson.min}
              max={ENTERPRISE_ROI_BOUNDS.weeklyHoursPerPerson.max}
              value={inputs.weeklyHoursPerPerson}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  weeklyHoursPerPerson: Number(e.target.value),
                }))
              }
              className="w-full accent-[var(--tsc-action)] cursor-pointer"
              aria-label="Repetitive Tasks Handled Hours per Week"
            />
            <div className="flex justify-between text-[11px] font-mono text-[var(--tsc-muted)]">
              <span>5 hrs (Minor follow-up)</span>
              <span>20 hrs (Heavy booking & billing)</span>
              <span>40 hrs (Full-time manual intake)</span>
            </div>
          </div>
        </div>

        {/* Right Column: High-End Financial Projection Card */}
        <div className="lg:col-span-5 rounded-[12px] border border-[var(--tsc-line)] bg-white p-6 sm:p-7 space-y-6 shadow-[var(--shadow-warm-md)]">
          <div className="flex items-center justify-between border-b border-[var(--tsc-line)] pb-3">
            <span className="font-mono text-[11px] font-semibold text-[var(--tsc-ink)] uppercase tracking-wider">
              FINANCIAL JUSTIFICATION
            </span>
            <span className="text-[10px] font-mono text-[var(--tsc-muted)] uppercase">
              Annual Modeled Projection
            </span>
          </div>

          {/* Primary Savings Hero Box */}
          <div className="p-5 rounded-[10px] bg-[var(--tsc-action)] text-white space-y-2 shadow-[var(--shadow-warm-sm)]">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-white/80">
              <span>Net Annual Wage Recapture</span>
              <span className="px-2 py-0.5 rounded bg-white/20 text-white font-semibold text-[10px]">
                75% Automated
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--tsc-signal)] tabular-nums">
              {formatCurrency(outputs.annualWageSavings)}
              <span className="text-xs font-normal text-white/80 ml-1.5">/ year</span>
            </div>
            <p className="text-xs text-white/90 pt-1">
              Directly reclaims ~
              <strong className="text-white font-semibold tabular-nums">
                {outputs.annualHoursRecaptured.toLocaleString()} hours
              </strong>{" "}
              of high-cost labor every year.
            </p>
          </div>

          {/* Sub Metrics: Payback & ROI Multiple */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] space-y-1">
              <span className="text-[10px] uppercase text-[var(--tsc-muted)] block">
                Estimated Payback
              </span>
              <div className="text-lg font-bold text-[var(--tsc-ink)] tabular-nums">
                {outputs.paybackMonths} Months
              </div>
              <span className="text-[10px] text-[var(--tsc-muted)] block">
                ~{outputs.paybackDays} calendar days
              </span>
            </div>

            <div className="p-3.5 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] space-y-1">
              <span className="text-[10px] uppercase text-[var(--tsc-muted)] block flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-600" />
                3-Year Multiple
              </span>
              <div className="text-lg font-bold text-emerald-700 tabular-nums">
                {outputs.threeYearNetRoiMultiple}x Net ROI
              </div>
              <span className="text-[10px] text-[var(--tsc-muted)] block">Net of deployment</span>
            </div>
          </div>

          {/* Deployment Tier Note */}
          <div className="flex items-center justify-between text-xs font-mono border-t border-[var(--tsc-line)] pt-3 text-[var(--tsc-muted)]">
            <span>Modeled Investment Tier:</span>
            <span className="font-semibold text-[var(--tsc-ink)]">
              {formatCurrency(outputs.estimatedDeploymentCost)} (One-time build)
            </span>
          </div>

          {/* Conversion Action Rail */}
          <div className="space-y-3 pt-2">
            <Link
              href={bookingHref}
              className="group flex w-full items-center justify-between rounded-[8px] bg-[var(--tsc-ink)] px-5 py-3.5 text-sm font-medium text-[var(--tsc-paper)] transition-all hover:bg-[var(--tsc-action)] shadow-[var(--shadow-warm-sm)]"
            >
              <span>Book an Audit with this Model</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <button
              type="button"
              onClick={copySummary}
              className="flex w-full items-center justify-center gap-2 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] px-4 py-2.5 text-xs font-medium text-[var(--tsc-ink)] hover:bg-white transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">
                    Financial Summary Copied to Clipboard
                  </span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-[var(--tsc-muted)]" />
                  <span>Copy Financial Summary for Leadership</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
