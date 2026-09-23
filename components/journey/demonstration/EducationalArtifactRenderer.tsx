"use client";

import { useEffect, useState } from "react";
import type {
  DemonstrationConfig,
  DemonstrationScenario,
} from "@/lib/journey/demonstration-config";

interface EducationalArtifactRendererProps {
  config: DemonstrationConfig;
  activeScenario: DemonstrationScenario;
  topicLabel?: string;
  onStarted?: () => void;
  onCompleted?: () => void;
}

export function EducationalArtifactRenderer({
  config,
  activeScenario,
  topicLabel,
  onStarted,
  onCompleted,
}: EducationalArtifactRendererProps) {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    config.educationalSections?.[0]?.id || "",
  );

  useEffect(() => {
    if (activeScenario.id) {
      setActiveStepIndex(-1);
      setHasStarted(false);
    }
  }, [activeScenario.id]);

  const totalSteps = activeScenario.steps.length;

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
    setHasStarted(false);
  };

  const activeSection = config.educationalSections?.find((s) => s.id === selectedSectionId);

  return (
    <div className="w-full flex flex-col space-y-6 font-geist">
      {/* Educational Document Container */}
      <div className="rounded-[4px] border border-[var(--tsc-line)] bg-white p-5 sm:p-6 lg:p-7 shadow-[0_2px_12px_rgba(18,19,15,0.03)]">
        {/* Document Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--tsc-line)] pb-4">
          <div className="flex items-center gap-2.5">
            <span
              className="inline-block h-2 w-2 rounded-full bg-[var(--tsc-ink)] ring-4 ring-[var(--tsc-line)]"
              aria-hidden="true"
            />
            <span className="font-mono text-xs font-semibold tracking-wider text-[var(--tsc-ink)] uppercase">
              EDUCATIONAL BLUEPRINT
            </span>

            {topicLabel && (
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--tsc-muted)]">
                <span className="text-[var(--tsc-line)] select-none">──</span>
                <span className="uppercase font-semibold tracking-wider">TOPIC:</span>
                <span className="text-[var(--tsc-ink)] font-medium">{topicLabel}</span>
              </span>
            )}
          </div>

          <div className="font-mono text-[11px] text-[var(--tsc-muted)] uppercase">
            {"FORMAT // SELF-SERVE ARTIFACT"}
          </div>
        </div>

        {/* Narrative Intro */}
        <div className="pt-3 pb-5 text-sm sm:text-[15px] text-[var(--tsc-ink)]/80 leading-relaxed">
          {activeScenario.description}
        </div>

        {/* Curated Educational Sections (if defined) */}
        {config.educationalSections && config.educationalSections.length > 0 && (
          <div className="mb-6 rounded-[3px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] p-4 sm:p-5">
            <div className="text-[10px] font-mono font-semibold tracking-wider text-[var(--tsc-muted)] uppercase mb-3">
              CURATED FRAMEWORK SECTIONS
            </div>

            {/* Section Tab Buttons */}
            <div className="flex flex-wrap gap-2 border-b border-[var(--tsc-line)] pb-3">
              {config.educationalSections.map((sec) => {
                const isSelected = sec.id === selectedSectionId;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={`px-3 py-1.5 rounded-[2px] font-mono text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[var(--tsc-ink)] text-white"
                        : "bg-white text-[var(--tsc-ink)] border border-[var(--tsc-line)] hover:bg-[var(--tsc-paper)]"
                    }`}
                  >
                    {sec.title}
                  </button>
                );
              })}
            </div>

            {/* Active Section Content */}
            {activeSection && (
              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-[2px] bg-white border border-[var(--tsc-line)] text-[var(--tsc-muted)]">
                    {activeSection.badge}
                  </span>
                  <h4 className="text-sm sm:text-base font-semibold text-[var(--tsc-ink)]">
                    {activeSection.title}
                  </h4>
                </div>

                <p className="text-xs sm:text-sm text-[var(--tsc-ink)]/85 leading-relaxed">
                  {activeSection.summary}
                </p>

                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-[var(--tsc-ink)]/80 pt-1">
                  {activeSection.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>

                {activeSection.callout && (
                  <div className="mt-3 rounded-[3px] border-l-2 border-[var(--tsc-ink)] bg-white p-3 text-xs sm:text-[13px] italic text-[var(--tsc-ink)]/85">
                    ↳ {activeSection.callout}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step-by-Step Educational Modules */}
        <div className="space-y-4 pt-2">
          <div className="text-[10px] font-mono font-semibold tracking-wider text-[var(--tsc-muted)] uppercase">
            STRUCTURED BLUEPRINT STEPS
          </div>

          {activeScenario.steps.map((step, idx) => {
            const isCompleted = idx <= activeStepIndex;
            const isCurrent = idx === activeStepIndex;

            return (
              <div
                key={step.id}
                className={`relative rounded-[3px] border transition-all duration-200 p-4 ${
                  isCurrent
                    ? "border-[var(--tsc-ink)] bg-[var(--tsc-surface)] ring-1 ring-[var(--tsc-ink)]/10"
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
                  <div className="mt-3 rounded-[3px] border border-[var(--tsc-line)] bg-[var(--tsc-paper)] p-3 text-[var(--tsc-ink)] font-mono text-[11px] leading-relaxed">
                    <div className="text-[10px] text-[var(--tsc-muted)] font-semibold tracking-wider uppercase mb-1.5">
                      CURRICULUM SPECIFICATION
                    </div>
                    {Object.entries(step.dataPayload).map(([key, val]) => (
                      <div key={key} className="flex gap-2">
                        <span className="text-[var(--tsc-muted)]">{key}:</span>
                        <span className="font-medium text-[var(--tsc-ink)]">{String(val)}</span>
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
              disabled={activeStepIndex >= totalSteps - 1}
              className="inline-flex items-center justify-center rounded-[3px] bg-[var(--tsc-ink)] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[var(--tsc-ink)]/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {activeStepIndex < 0
                ? "Run example →"
                : activeStepIndex >= totalSteps - 1
                  ? "Completed"
                  : "Next Module →"}
            </button>

            <button
              type="button"
              onClick={handleReplay}
              className="text-xs sm:text-sm font-medium text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)] transition-colors cursor-pointer py-1"
            >
              Review from Start ↺
            </button>
          </div>

          {activeStepIndex === totalSteps - 1 && (
            <div className="text-xs sm:text-sm font-medium text-[var(--tsc-positive)]">
              ✓ {activeScenario.summaryOutcome}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
