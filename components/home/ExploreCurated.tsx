"use client";

import { ArrowRight, CheckSquare, Square } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SectionLabel } from "@/components/ui/editorial";

interface SampleAuditTask {
  id: string;
  label: string;
  hours: number;
}

const SAMPLE_AUDIT_TASKS: readonly SampleAuditTask[] = [
  {
    id: "missed-calls",
    label: "After-hours calls going to voicemail / missed bookings",
    hours: 5.5,
  },
  {
    id: "manual-reminders",
    label: "Manual 2-way appointment reminders & schedule adjustments",
    hours: 4.0,
  },
  {
    id: "intake-rekeying",
    label: "Re-keying paper or web forms into CRM / EMR",
    hours: 5.0,
  },
];

type BlueprintPillar = "automate" | "build" | "grow" | "operate";

interface PillarData {
  title: string;
  count: number;
  description: string;
  sampleSystems: readonly {
    name: string;
    spec: string;
  }[];
}

const BLUEPRINT_PILLARS: Record<BlueprintPillar, PillarData> = {
  automate: {
    title: "AUTOMATE",
    count: 18,
    description: "Workflow engines wired into existing POS, EMR & CRM.",
    sampleSystems: [
      { name: "AI Receptionist & Triage", spec: "24/7 Voice & SMS" },
      { name: "Two-Way Recall & Rebook", spec: "Direct PMS Sync" },
      { name: "Intake & Document Routing", spec: "Zero Manual Re-Entry" },
    ],
  },
  build: {
    title: "BUILD",
    count: 7,
    description: "Custom software engineering and deterministic autonomous agents.",
    sampleSystems: [
      { name: "Autonomous Agent Systems", spec: "Multi-Tool Execution" },
      { name: "High-Performance Web", spec: "Next.js & Sub-Second Load" },
      { name: "Internal Operations Portals", spec: "Role-Based Access" },
    ],
  },
  grow: {
    title: "GROW",
    count: 5,
    description: "Lead pipelines, generative search optimization, and reputation engines.",
    sampleSystems: [
      { name: "Review & Reputation Engine", spec: "Automated Feedback Gate" },
      { name: "Generative Engine SEO (GEO)", spec: "Local Search Ingest" },
      { name: "Customer Win-Back Pipeline", spec: "Dormant Client Reactivation" },
    ],
  },
  operate: {
    title: "OPERATE",
    count: 4,
    description: "System documentation, standard operating procedures, and tech staffing.",
    sampleSystems: [
      { name: "Business SOPs & Architecture", spec: "Living Operator Runbooks" },
      { name: "Dedicated Tech Staffing", spec: "Embedded Specialists" },
      { name: "Contract & Billing Audits", spec: "Reconciliation Hooks" },
    ],
  },
};

export function ExploreCurated() {
  // Specimen 1: Interactive sample diagnostic calculator
  const [checkedTaskIds, setCheckedTaskIds] = useState<string[]>([
    "missed-calls",
    "manual-reminders",
  ]);

  // Specimen 2: Interactive blueprint pillar tab
  const [activePillar, setActivePillar] = useState<BlueprintPillar>("automate");

  const toggleTask = (taskId: string) => {
    setCheckedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId],
    );
  };

  const calculatedHours = SAMPLE_AUDIT_TASKS.reduce((sum, task) => {
    return checkedTaskIds.includes(task.id) ? sum + task.hours : sum;
  }, 0);

  const activePillarData = BLUEPRINT_PILLARS[activePillar];

  return (
    <section
      aria-labelledby="explore-heading"
      className="bg-[var(--tsc-paper)] border-b border-[var(--tsc-line)] py-16 sm:py-20 lg:py-24 font-geist"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        {/* Section Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--tsc-line)] pb-5 mb-10 sm:mb-14">
          <div className="flex items-center gap-3">
            <span
              className="inline-block h-2 w-2 rounded-full bg-[var(--tsc-action)] ring-4 ring-[var(--tsc-action)]/20"
              aria-hidden="true"
            />
            <SectionLabel>05 / EXPLORE &middot; CURATED FIELD KIT</SectionLabel>
          </div>
          <span className="font-mono text-xs text-[var(--tsc-muted)] tracking-wider uppercase">
            3 Self-Service Artifacts &middot; Zero Paywall
          </span>
        </div>

        {/* Section Headline & Editorial Lead */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <h2
            id="explore-heading"
            className="text-[34px] sm:text-[46px] lg:text-[54px] font-bold leading-[1.02] tracking-[-0.035em] text-[var(--tsc-ink)]"
          >
            Useful artifacts,
            <br />
            without the catalog dump.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--tsc-muted)] leading-relaxed">
            Practical diagnostics, open system blueprints, and weekly technical briefs. Published
            openly to clarify automation choices and calculate return before touching a line of
            code.
          </p>
        </div>

        {/* 3-Column Editorial Specimen Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Card 1: Diagnostic Tool */}
          <div className="rounded-[10px] border border-[var(--tsc-line)] bg-white p-6 sm:p-7 flex flex-col justify-between shadow-[var(--shadow-warm-xs)] hover:border-[var(--tsc-action)] hover:shadow-[var(--shadow-warm-sm)] transition-all duration-200 group">
            <div className="space-y-4">
              {/* Card Meta Top Bar */}
              <div className="flex items-center justify-between gap-2 border-b border-[var(--tsc-line)]/70 pb-3">
                <span className="font-mono text-[11px] font-bold tracking-wider text-[var(--tsc-action)] uppercase">
                  [TOOL &middot; DIAGNOSTIC]
                </span>
                <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-[4px] bg-[var(--tsc-action)]/10 text-[var(--tsc-action)] border border-[var(--tsc-action)]/20 uppercase tracking-wider">
                  FREE &middot; 5 MIN
                </span>
              </div>

              {/* Title & Value Prop */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)] group-hover:text-[var(--tsc-action)] transition-colors">
                  Automation Opportunities Checklist
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                  A 25-task diagnostic to identify operational bottlenecks across intake,
                  scheduling, and billing, calculating hours returned in real time.
                </p>
              </div>

              {/* Interactive Specimen Box: Live Hours Calculator Teaser */}
              <div className="rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/70 p-4 space-y-3 font-mono">
                <div className="flex items-center justify-between text-[11px] border-b border-[var(--tsc-line)]/70 pb-2">
                  <span className="text-[var(--tsc-muted)] uppercase tracking-wider">
                    SAMPLE DIAGNOSTIC AUDIT
                  </span>
                  <span className="text-[var(--tsc-action)] font-bold tabular-nums">
                    {calculatedHours.toFixed(1)} HRS/WK RETURNED
                  </span>
                </div>

                <div className="space-y-2 pt-0.5">
                  {SAMPLE_AUDIT_TASKS.map((task) => {
                    const isChecked = checkedTaskIds.includes(task.id);
                    return (
                      <button
                        type="button"
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`w-full flex items-center justify-between gap-2.5 p-2 rounded-[5px] border text-left text-xs transition-colors cursor-pointer ${
                          isChecked
                            ? "bg-white border-[var(--tsc-action)]/40 text-[var(--tsc-ink)] shadow-2xs"
                            : "bg-transparent border-transparent text-[var(--tsc-muted)] hover:bg-white/50"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isChecked ? (
                            <CheckSquare className="h-3.5 w-3.5 text-[var(--tsc-action)] shrink-0" />
                          ) : (
                            <Square className="h-3.5 w-3.5 text-[var(--tsc-line-strong)] shrink-0" />
                          )}
                          <span className="truncate">{task.label}</span>
                        </div>
                        <span className="shrink-0 text-[10px] font-semibold text-[var(--tsc-muted)] tabular-nums">
                          +{task.hours.toFixed(1)}h
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] text-[var(--tsc-muted)]">
                  <span>Click tasks to simulate recovery</span>
                  <span className="text-[var(--tsc-action)] font-semibold">
                    25 tasks in full tool
                  </span>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-6 mt-6 border-t border-[var(--tsc-line)]/70">
              <Link
                href="/checklist"
                className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-[6px] bg-[var(--tsc-ink)] text-white text-xs font-mono font-semibold tracking-wider uppercase hover:bg-[var(--tsc-action)] transition-colors"
              >
                <span>Launch Full Diagnostic</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-1" />
              </Link>
              <p className="mt-2 text-[11px] text-[var(--tsc-muted)] font-mono text-center">
                Instant wasted-hours calculation &middot; No login needed
              </p>
            </div>
          </div>

          {/* Card 2: Architectural Repository */}
          <div className="rounded-[10px] border border-[var(--tsc-line)] bg-white p-6 sm:p-7 flex flex-col justify-between shadow-[var(--shadow-warm-xs)] hover:border-[var(--tsc-action)] hover:shadow-[var(--shadow-warm-sm)] transition-all duration-200 group">
            <div className="space-y-4">
              {/* Card Meta Top Bar */}
              <div className="flex items-center justify-between gap-2 border-b border-[var(--tsc-line)]/70 pb-3">
                <span className="font-mono text-[11px] font-bold tracking-wider text-[var(--tsc-muted)] uppercase">
                  [REPOSITORY &middot; BLUEPRINTS]
                </span>
                <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-[4px] bg-[var(--tsc-surface)] text-[var(--tsc-ink)] border border-[var(--tsc-line)] uppercase tracking-wider">
                  34 VERIFIED SYSTEMS
                </span>
              </div>

              {/* Title & Value Prop */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)] group-hover:text-[var(--tsc-action)] transition-colors">
                  The Skill Corner Library
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                  Productized automations, digital engineering pillars, and open reference
                  architectures organized by operational constraint.
                </p>
              </div>

              {/* Interactive Specimen Box: Blueprint Pillar Browser */}
              <div className="rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/70 p-4 space-y-3 font-mono">
                {/* Pillar Switcher Tabs */}
                <div className="grid grid-cols-4 gap-1 border-b border-[var(--tsc-line)]/70 pb-2.5">
                  {(["automate", "build", "grow", "operate"] as const).map((pillarKey) => {
                    const pillar = BLUEPRINT_PILLARS[pillarKey];
                    const isActive = activePillar === pillarKey;
                    return (
                      <button
                        type="button"
                        key={pillarKey}
                        onClick={() => setActivePillar(pillarKey)}
                        className={`px-1 py-1 rounded-[4px] text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          isActive
                            ? "bg-[var(--tsc-ink)] text-white shadow-2xs"
                            : "bg-transparent text-[var(--tsc-muted)] hover:bg-white/60"
                        }`}
                      >
                        {pillar.title}
                      </button>
                    );
                  })}
                </div>

                {/* Pillar Systems List */}
                <div className="space-y-2 pt-0.5 min-h-[96px]">
                  {activePillarData.sampleSystems.map((system) => (
                    <div
                      key={system.name}
                      className="flex items-center justify-between gap-2 p-1.5 rounded-[4px] bg-white border border-[var(--tsc-line)]/60 text-xs"
                    >
                      <span className="font-medium text-[var(--tsc-ink)] truncate text-[11px]">
                        {system.name}
                      </span>
                      <span className="text-[10px] text-[var(--tsc-muted)] font-mono shrink-0">
                        {system.spec}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] text-[var(--tsc-muted)] border-t border-[var(--tsc-line)]/70">
                  <span>Stack: Twilio &middot; Toast &middot; Jane &middot; Clio</span>
                  <span className="text-[var(--tsc-ink)] font-semibold">
                    {activePillarData.count} Blueprints
                  </span>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-6 mt-6 border-t border-[var(--tsc-line)]/70">
              <Link
                href="/library"
                className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-[6px] bg-[var(--tsc-ink)] text-white text-xs font-mono font-semibold tracking-wider uppercase hover:bg-[var(--tsc-action)] transition-colors"
              >
                <span>Browse 34 System Blueprints</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-1" />
              </Link>
              <p className="mt-2 text-[11px] text-[var(--tsc-muted)] font-mono text-center">
                Transparent scope &middot; Architecture schemas
              </p>
            </div>
          </div>

          {/* Card 3: Market Intelligence & Briefings */}
          <div className="rounded-[10px] border border-[var(--tsc-line)] bg-white p-6 sm:p-7 flex flex-col justify-between shadow-[var(--shadow-warm-xs)] hover:border-[var(--tsc-action)] hover:shadow-[var(--shadow-warm-sm)] transition-all duration-200 group">
            <div className="space-y-4">
              {/* Card Meta Top Bar */}
              <div className="flex items-center justify-between gap-2 border-b border-[var(--tsc-line)]/70 pb-3">
                <span className="font-mono text-[11px] font-bold tracking-wider text-[var(--tsc-muted)] uppercase">
                  [INTELLIGENCE &middot; DISPATCH]
                </span>
                <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-[4px] bg-[var(--tsc-surface)] text-[var(--tsc-ink)] border border-[var(--tsc-line)] uppercase tracking-wider">
                  WEEKLY &middot; MON 11:00
                </span>
              </div>

              {/* Title & Value Prop */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)] group-hover:text-[var(--tsc-action)] transition-colors">
                  Tech Founder Briefing
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                  Actionable AI and engineering shifts, distilled weekly for founders, CTOs, and
                  technical software operators. Zero sponsored noise.
                </p>
              </div>

              {/* Interactive Specimen Box: Latest Dispatch Excerpt */}
              <div className="rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/70 p-4 space-y-2.5 font-mono">
                <div className="flex items-center justify-between text-[11px] border-b border-[var(--tsc-line)]/70 pb-2">
                  <span className="text-[var(--tsc-muted)] uppercase tracking-wider">
                    LATEST DISPATCH &middot; ISSUE #001
                  </span>
                  <span className="text-[var(--tsc-action)] font-semibold text-[10px]">
                    4-MIN READ
                  </span>
                </div>

                <div className="space-y-1.5 pt-0.5">
                  <h4 className="font-bold text-xs text-[var(--tsc-ink)] leading-snug">
                    Production Agent Harnesses &amp; In-Memory RAG
                  </h4>
                  <ul className="space-y-1 text-[11px] text-[var(--tsc-muted)] leading-relaxed">
                    <li className="flex items-start gap-1.5">
                      <span className="text-[var(--tsc-action)]">&bull;</span>
                      <span>State machines beat free-form loops by 40% in predictability</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[var(--tsc-action)]">&bull;</span>
                      <span>In-memory scoring outperforms vector DBs for &lt;50k items</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-[var(--tsc-action)]">&bull;</span>
                      <span>Strict schema allowlists prevent production prompt injection</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] text-[var(--tsc-muted)] border-t border-[var(--tsc-line)]/70">
                  <span>Audience: CTOs &middot; Operators</span>
                  <span className="text-[var(--tsc-ink)] font-semibold">100% Signal</span>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-6 mt-6 border-t border-[var(--tsc-line)]/70">
              <Link
                href="/newsletters/tech-founder-briefing"
                className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-[6px] bg-[var(--tsc-ink)] text-white text-xs font-mono font-semibold tracking-wider uppercase hover:bg-[var(--tsc-action)] transition-colors"
              >
                <span>Read Latest Issue &amp; Subscribe</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-1" />
              </Link>
              <p className="mt-2 text-[11px] text-[var(--tsc-muted)] font-mono text-center">
                Free weekly dispatch &middot; Unsubscribe anytime
              </p>
            </div>
          </div>
        </div>

        {/* Sector Artifact Matrices Fast-Jump Bar */}
        <div className="mt-12 sm:mt-16 rounded-[10px] border border-[var(--tsc-line)] bg-white/70 backdrop-blur-xs p-5 sm:p-6 shadow-[var(--shadow-warm-xs)]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-[var(--tsc-muted)] uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--tsc-action)]" />
                <span>SECTOR ARTIFACT MATRICES</span>
                <span>&middot;</span>
                <span className="text-[var(--tsc-action)]">24 TAILORED VERTICALS</span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--tsc-ink)] font-medium">
                Looking for automation architectures tailored to your specific field or practice?
              </p>
            </div>

            {/* Fast Jump Links */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/industries/dental-offices"
                className="px-3 py-1.5 rounded-[4px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] hover:bg-white hover:border-[var(--tsc-action)] text-xs font-mono font-medium text-[var(--tsc-ink)] transition-colors"
              >
                Dental Practices &rarr;
              </Link>
              <Link
                href="/industries/law-firms"
                className="px-3 py-1.5 rounded-[4px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] hover:bg-white hover:border-[var(--tsc-action)] text-xs font-mono font-medium text-[var(--tsc-ink)] transition-colors"
              >
                Law Firms &rarr;
              </Link>
              <Link
                href="/industries/restaurants"
                className="px-3 py-1.5 rounded-[4px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] hover:bg-white hover:border-[var(--tsc-action)] text-xs font-mono font-medium text-[var(--tsc-ink)] transition-colors"
              >
                Restaurants &rarr;
              </Link>
              <Link
                href="/industries/salons-spas"
                className="px-3 py-1.5 rounded-[4px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] hover:bg-white hover:border-[var(--tsc-action)] text-xs font-mono font-medium text-[var(--tsc-ink)] transition-colors"
              >
                Salons &amp; Spas &rarr;
              </Link>
              <Link
                href="/industries"
                className="px-3 py-1.5 rounded-[4px] border border-[var(--tsc-action)] bg-[var(--tsc-action)]/10 hover:bg-[var(--tsc-action)] hover:text-white text-xs font-mono font-semibold text-[var(--tsc-action)] transition-colors"
              >
                All 24 Sectors &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
