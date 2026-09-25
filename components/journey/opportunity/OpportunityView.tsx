"use client";

import { Check, FileText } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Magnetic } from "@/components/ui/MagneticButton";
import { track } from "@/lib/analytics";
import { diagnoseOpportunity } from "@/lib/journey/diagnose-opportunity";
import { useJourney } from "@/lib/journey/journey-context";
import { OPPORTUNITY_DEFINITIONS } from "@/lib/journey/opportunity-config";
import { JourneyProgress } from "../JourneyProgress";
import { OpportunityDeferred } from "./OpportunityDeferred";
import { OpportunityEvidence } from "./OpportunityEvidence";
import { OpportunitySecondary } from "./OpportunitySecondary";

export function OpportunityView() {
  const { journey, setStage, markOpportunityViewed } = useJourney();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [specCopied, setSpecCopied] = useState(false);

  // Safe invalid-state recovery (Ticket 003 amendment 4 & §26)
  // Evaluated in an effect to avoid setting state during render
  useEffect(() => {
    if (!journey.intent) {
      setStage("new");
    } else if (!journey.contextFocus || !journey.contextSituation) {
      setStage("context");
    }
  }, [journey.intent, journey.contextFocus, journey.contextSituation, setStage]);

  // Compute diagnosis deterministically and synchronously
  const diagnosis = useMemo(() => {
    return diagnoseOpportunity({
      intent: journey.intent,
      contextFocus: journey.contextFocus,
      contextSituation: journey.contextSituation,
    });
  }, [journey.intent, journey.contextFocus, journey.contextSituation]);

  // Accessibility: focus primary heading when opportunity is diagnosed
  useEffect(() => {
    if (diagnosis) {
      headingRef.current?.focus();
    }
  }, [diagnosis]);

  // Analytics: Deduplicated per unique diagnosis key across component lifecycle
  useEffect(() => {
    if (!diagnosis || !journey.intent || !journey.contextFocus || !journey.contextSituation) {
      return;
    }

    const diagnosisKey = `${journey.intent}:${journey.contextFocus}:${journey.contextSituation}:${diagnosis.primary}`;
    if (markOpportunityViewed(diagnosisKey)) {
      track("journey_opportunity_viewed", {
        intent: journey.intent,
        focus: journey.contextFocus,
        situation: journey.contextSituation,
        primaryOpportunity: diagnosis.primary,
        secondaryOpportunity: diagnosis.secondary,
        deferredOpportunity: diagnosis.deferred,
      });
    }
  }, [
    diagnosis,
    journey.intent,
    journey.contextFocus,
    journey.contextSituation,
    markOpportunityViewed,
  ]);

  if (!diagnosis || !journey.intent || !journey.contextFocus || !journey.contextSituation) {
    // Safe boundary during recovery transition
    return null;
  }

  const primaryDef = OPPORTUNITY_DEFINITIONS[diagnosis.primary];
  if (!primaryDef) return null;

  const isLearn = journey.intent === "learn";
  const mainEyebrow = isLearn ? "YOUR BEST NEXT STEP" : "YOUR STRONGEST OPPORTUNITY";
  const evidenceLabel = isLearn ? "WHAT YOU'LL GET" : "WHAT IT CHANGES";

  // Composed rationale: canonical immutable explanation + situation rationale modifier (if any)
  const fullRationale = diagnosis.rationaleModifier
    ? `${primaryDef.explanation} ${diagnosis.rationaleModifier}`
    : primaryDef.explanation;

  const handleSolutionStart = () => {
    track("journey_opportunity_solution_started", {
      primaryOpportunity: diagnosis.primary,
    });
    setStage("solution");
  };

  const handleReviewContext = () => {
    track("journey_context_reviewed", {
      from: "opportunity",
    });
    setStage("context");
  };

  const handleExportSpec = () => {
    const spec = [
      `# THE SKILL CORNER // TECHNICAL ARCHITECTURE SPECIFICATION`,
      `Reference: TSC-ARCH-${Date.now().toString(36).toUpperCase()}`,
      `Environment: Production Scoped Blueprint`,
      `Timestamp: ${new Date().toISOString()}`,
      ``,
      `## 1. Context & Operational Diagnosis`,
      `- Strategic Intent: ${journey.intent || "Not specified"}`,
      `- Domain Focus: ${journey.contextFocus || "General Business"}`,
      `- Current Situation: ${journey.contextSituation || "Operational Workflow Optimization"}`,
      ``,
      `## 2. Primary Architectural System`,
      `- System Name: ${primaryDef.title}`,
      `- Primary Target Outcome: ${primaryDef.outcome}`,
      `- Architectural Rationale: ${fullRationale}`,
      ``,
      `## 3. Implementation Deliverables & Capabilities`,
      ...primaryDef.evidence.map((item) => `- ${item}`),
      ``,
      `## 4. Operational Boundaries & Guardrails ("Not Yet")`,
      `${primaryDef.avoidForNow}`,
      ``,
      `## 5. Horizon Roadmap`,
      `- Secondary Priority: ${diagnosis.secondary}`,
      `- Deferred System: ${diagnosis.deferred}`,
      ``,
      `---`,
      `Engineered by TheSkillCorner Studio Engine. Deterministic Architecture Map v2.4.`,
    ].join("\n");

    try {
      navigator.clipboard?.writeText(spec);
      setSpecCopied(true);
      setTimeout(() => setSpecCopied(false), 2000);
      track("journey_architecture_spec_exported", {
        primaryOpportunity: diagnosis.primary,
      });
    } catch {
      // fallback
    }
  };

  return (
    <div className="w-full font-geist">
      {/* Aria live announcement for screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {mainEyebrow}: {primaryDef.title}
      </div>

      {/* Journey Progress: Stage 03 active */}
      <div className="pb-6 sm:pb-8">
        <JourneyProgress />
      </div>

      {/* Main Layout: Desktop Two Columns (Ticket 003 §12) / Mobile Strict Order (Ticket 003 §21) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16 gap-y-8 sm:gap-y-10 items-start">
        {/* Section A: Eyebrow + Primary Title + Outcome */}
        <div className="order-1 lg:col-span-7 lg:row-start-1 flex flex-col space-y-4 sm:space-y-5">
          {/* Eyebrow & Learn Topic */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.14em] text-[var(--tsc-muted)] uppercase">
              {mainEyebrow}
            </div>

            {isLearn && diagnosis.topicLabel && (
              <div className="inline-flex items-center gap-1.5 font-mono text-[11px] sm:text-xs text-[var(--tsc-muted)]">
                <span className="text-[var(--tsc-line)] select-none" aria-hidden="true">
                  ──
                </span>
                <span className="uppercase font-semibold tracking-[0.14em]">TOPIC:</span>
                <span className="text-[var(--tsc-ink)] font-medium">{diagnosis.topicLabel}</span>
              </div>
            )}
          </div>

          {/* Primary Diagnosis Title */}
          <h2
            ref={headingRef}
            tabIndex={-1}
            style={{ color: "var(--tsc-ink)" }}
            className="text-[36px] sm:text-[48px] lg:text-[56px] xl:text-[62px] font-bold leading-[1.02] tracking-[-0.035em] text-[var(--tsc-ink)] focus:outline-none"
          >
            {primaryDef.title}
          </h2>

          {/* Primary Outcome */}
          <p className="max-w-[620px] text-base sm:text-lg lg:text-[19px] font-normal leading-[1.5] text-[var(--tsc-ink)]/85">
            {primaryDef.outcome}
          </p>
        </div>

        {/* Section B: Rationale ("WHY THIS FIRST") + Evidence + "NOT YET" */}
        <div className="order-2 lg:col-span-5 lg:row-start-1 lg:row-span-2 flex flex-col space-y-6 sm:space-y-7 lg:border-l lg:border-[var(--tsc-line)] lg:pl-8 xl:pl-10">
          {/* Rationale / Why This First */}
          <div className="flex flex-col space-y-2">
            <div className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.14em] text-[var(--tsc-muted)] uppercase">
              WHY THIS FIRST
            </div>
            <p className="text-sm sm:text-[15px] leading-[1.55] text-[var(--tsc-ink)]/85">
              {fullRationale}
            </p>
          </div>

          {/* Evidence / What It Changes or What You'll Get */}
          <OpportunityEvidence evidence={primaryDef.evidence} label={evidenceLabel} />

          {/* NOT YET / Strategic Editorial Note */}
          <div className="rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] p-4 sm:p-5 flex flex-col space-y-2">
            <div className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.14em] text-[var(--tsc-muted)] uppercase">
              NOT YET
            </div>
            <p className="text-sm sm:text-[15px] leading-[1.55] text-[var(--tsc-ink)]/80">
              {primaryDef.avoidForNow}
            </p>
          </div>
        </div>

        {/* Section C: Actions (Primary CTA + Export Spec + Review Context) */}
        <div className="order-3 lg:col-span-7 lg:row-start-2 pt-2 sm:pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
          <Magnetic pullFactor={0.16}>
            <button
              type="button"
              onClick={handleSolutionStart}
              className="inline-flex items-center justify-center rounded-[8px] bg-[var(--tsc-ink)] px-6 py-3.5 text-sm sm:text-base font-semibold text-white transition-colors hover:bg-[var(--tsc-ink)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tsc-action)] cursor-pointer"
            >
              <span>See how this would work &rarr;</span>
            </button>
          </Magnetic>

          <button
            type="button"
            onClick={handleExportSpec}
            className="inline-flex items-center gap-2 rounded-[8px] border border-[var(--tsc-line)] bg-white px-4 py-3.5 text-xs sm:text-sm font-mono text-[var(--tsc-ink)] hover:bg-[var(--tsc-surface)] hover:border-[var(--tsc-ink)]/30 transition-colors cursor-pointer shadow-xs"
            title="Export full technical specification as Markdown"
          >
            {specCopied ? (
              <>
                <Check className="h-4 w-4 text-[var(--tsc-positive)]" strokeWidth={1.7} />
                <span className="text-[var(--tsc-positive)] font-semibold">Spec Copied</span>
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 text-[var(--tsc-muted)]" strokeWidth={1.7} />
                <span>Export Arch Spec</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReviewContext}
            className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs sm:text-sm font-medium text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tsc-ink)] cursor-pointer py-2 px-2"
          >
            <span>&larr; Review context</span>
          </button>
        </div>

        {/* Section D: Secondary and Deferred Opportunities */}
        <div className="order-4 lg:col-span-12 border-t border-[var(--tsc-line)] pt-8 sm:pt-10 mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <OpportunitySecondary opportunityId={diagnosis.secondary} />
          <OpportunityDeferred opportunityId={diagnosis.deferred} />
        </div>
      </div>
    </div>
  );
}
