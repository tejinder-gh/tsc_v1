"use client";

import { useEffect, useMemo, useState } from "react";
import { track } from "@/lib/analytics";
import {
  DEMONSTRATION_DISCLAIMER,
  getDemonstrationConfig,
} from "@/lib/journey/demonstration-config";
import { diagnoseOpportunity } from "@/lib/journey/diagnose-opportunity";
import { useJourney } from "@/lib/journey/journey-context";
import { JourneyProgress } from "../JourneyProgress";
import { DecisionRouterRenderer } from "./DecisionRouterRenderer";
import { EducationalArtifactRenderer } from "./EducationalArtifactRenderer";
import { PipelineStreamRenderer } from "./PipelineStreamRenderer";
import { SystemSpecRenderer } from "./SystemSpecRenderer";

export function DemonstrationView() {
  const { journey, setStage, markDemonstrationViewed } = useJourney();

  // Compute active diagnosis deterministically
  const diagnosis = useMemo(() => {
    return diagnoseOpportunity({
      intent: journey.intent,
      contextFocus: journey.contextFocus,
      contextSituation: journey.contextSituation,
    });
  }, [journey.intent, journey.contextFocus, journey.contextSituation]);

  // If missing context or diagnosis, safely recover
  useEffect(() => {
    if (!journey.intent) {
      setStage("new");
    } else if (!journey.contextFocus || !journey.contextSituation) {
      setStage("context");
    }
  }, [journey.intent, journey.contextFocus, journey.contextSituation, setStage]);

  const primaryOpportunity = diagnosis?.primary;
  const config = useMemo(() => {
    if (!primaryOpportunity) return null;
    return getDemonstrationConfig(primaryOpportunity);
  }, [primaryOpportunity]);

  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);

  // Reset scenario when diagnosis changes
  useEffect(() => {
    if (primaryOpportunity) {
      setSelectedScenarioIndex(0);
    }
  }, [primaryOpportunity]);

  const activeScenario = config?.scenarios[selectedScenarioIndex] || config?.scenarios[0];

  // Analytics: Track demonstration viewed (deduplicated)
  useEffect(() => {
    if (!config || !activeScenario || !primaryOpportunity) return;
    if (markDemonstrationViewed(primaryOpportunity)) {
      track("journey_demonstration_viewed", {
        intent: journey.intent,
        opportunityId: primaryOpportunity,
        archetype: config.archetype,
        scenario: activeScenario.id,
      });
    }
  }, [config, activeScenario, journey.intent, markDemonstrationViewed, primaryOpportunity]);

  if (!diagnosis || !config || !activeScenario || !primaryOpportunity) {
    return null;
  }

  const isLearn = journey.intent === "learn";
  const eyebrowLabel = isLearn ? "EDUCATIONAL ARTIFACT" : "SYSTEM DEMONSTRATION";

  const handleScenarioChange = (index: number) => {
    setSelectedScenarioIndex(index);
    const newScenario = config.scenarios[index];
    if (newScenario) {
      track("journey_demonstration_scenario_changed", {
        intent: journey.intent,
        opportunityId: primaryOpportunity,
        archetype: config.archetype,
        scenario: newScenario.id,
      });
    }
  };

  const handleDemonstrationCompleted = () => {
    track("journey_demonstration_completed", {
      intent: journey.intent,
      opportunityId: primaryOpportunity,
      archetype: config.archetype,
      scenario: activeScenario.id,
    });
  };

  const handleDemonstrationStarted = () => {
    track("journey_demonstration_started", {
      intent: journey.intent,
      opportunityId: primaryOpportunity,
      archetype: config.archetype,
      scenario: activeScenario.id,
    });
  };

  const handleReturnToOpportunity = () => {
    track("journey_demonstration_returned_to_opportunity", {
      intent: journey.intent,
      opportunityId: primaryOpportunity,
      archetype: config.archetype,
      scenario: activeScenario.id,
    });
    setStage("opportunity");
  };

  return (
    <div className="w-full font-geist">
      {/* Aria live announcement for screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {eyebrowLabel}: {config.title}
      </div>

      {/* Stepper Navigation: Stage 03 active */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 sm:pb-8">
        <JourneyProgress />

        <button
          type="button"
          onClick={handleReturnToOpportunity}
          className="text-xs sm:text-sm font-medium text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tsc-ink)] cursor-pointer"
        >
          ← Return to opportunity diagnosis
        </button>
      </div>

      {/* Demonstration Header */}
      <div className="flex flex-col space-y-3 sm:space-y-4 max-w-[840px]">
        {/* Eyebrow & Badge */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.14em] text-[var(--tsc-muted)] uppercase">
            {eyebrowLabel}
          </div>
          <span className="text-[var(--tsc-line)] select-none hidden sm:inline">──</span>
          <div className="text-[10px] sm:text-[11px] font-mono tracking-wider text-[var(--tsc-ink)] uppercase font-semibold bg-[var(--tsc-surface)] border border-[var(--tsc-line)] px-2 py-0.5 rounded-[2px]">
            {config.systemBadge}
          </div>
        </div>

        {/* Main Headline */}
        <h2
          style={{ color: "var(--tsc-ink)" }}
          className="text-[32px] sm:text-[44px] lg:text-[50px] font-bold leading-[1.05] tracking-[-0.035em] text-[var(--tsc-ink)]"
        >
          {config.title}
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[var(--tsc-ink)]/80 leading-relaxed">
          {config.subtitle}
        </p>

        {/* Truthfulness & Illustrative Disclaimer Banner */}
        <div className="rounded-[4px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] px-3.5 py-2.5 sm:px-4 sm:py-3 text-[11px] sm:text-xs text-[var(--tsc-muted)] leading-relaxed font-mono">
          {DEMONSTRATION_DISCLAIMER}
        </div>
      </div>

      {/* Scenario Selection Tabs */}
      {config.scenarios.length > 1 && (
        <div className="mt-8 mb-6 flex flex-wrap items-center gap-2 border-b border-[var(--tsc-line)] pb-3">
          <span className="text-[11px] font-mono text-[var(--tsc-muted)] uppercase tracking-wider mr-2">
            TRY ANOTHER EXAMPLE:
          </span>
          {config.scenarios.map((sc, index) => {
            const isSelected = index === selectedScenarioIndex;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleScenarioChange(index)}
                className={`px-3 py-1.5 rounded-[3px] text-xs sm:text-[13px] font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[var(--tsc-ink)] text-white"
                    : "bg-white text-[var(--tsc-ink)] border border-[var(--tsc-line)] hover:bg-[var(--tsc-paper)]"
                }`}
              >
                {sc.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Archetype Renderer Mount */}
      <div className="mt-6">
        {config.archetype === "pipeline-stream" && (
          <PipelineStreamRenderer
            scenario={activeScenario}
            onStarted={handleDemonstrationStarted}
            onCompleted={handleDemonstrationCompleted}
          />
        )}

        {config.archetype === "decision-router" && (
          <DecisionRouterRenderer
            scenario={activeScenario}
            onStarted={handleDemonstrationStarted}
            onCompleted={handleDemonstrationCompleted}
          />
        )}

        {config.archetype === "system-spec" && (
          <SystemSpecRenderer
            scenario={activeScenario}
            onStarted={handleDemonstrationStarted}
            onCompleted={handleDemonstrationCompleted}
          />
        )}

        {config.archetype === "educational-artifact" && (
          <EducationalArtifactRenderer
            config={config}
            activeScenario={activeScenario}
            topicLabel={diagnosis.topicLabel}
            onStarted={handleDemonstrationStarted}
            onCompleted={handleDemonstrationCompleted}
          />
        )}
      </div>

      {/* Bottom Return Affordance */}
      <div className="mt-10 pt-6 border-t border-[var(--tsc-line)] flex items-center justify-between">
        <button
          type="button"
          onClick={handleReturnToOpportunity}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tsc-ink)] cursor-pointer py-2"
        >
          <span>← Return to opportunity diagnosis</span>
        </button>
      </div>
    </div>
  );
}
