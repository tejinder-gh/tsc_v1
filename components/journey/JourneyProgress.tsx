"use client";

import { useJourney } from "@/lib/journey";

const STAGES = [
  { key: "goal", label: "01 GOAL" },
  { key: "context", label: "02 CONTEXT" },
  { key: "opportunity", label: "03 OPPORTUNITY" },
  { key: "plan", label: "04 PLAN" },
] as const;

export function JourneyProgress() {
  const { journey } = useJourney();

  // Mapping from Ticket 001 §10:
  // new / intent-selected -> 01 GOAL
  // context               -> 02 CONTEXT
  // opportunity / solution -> 03 OPPORTUNITY
  // plan                  -> 04 PLAN
  const activeKey = (() => {
    switch (journey.stage) {
      case "new":
      case "intent-selected":
        return "goal";
      case "context":
        return "context";
      case "opportunity":
      case "solution":
        return "opportunity";
      case "plan":
        return "plan";
      default:
        return "goal";
    }
  })();

  return (
    <nav
      aria-label="Journey progress"
      className="flex flex-wrap items-center gap-x-1.5 sm:gap-x-2 gap-y-1 font-mono text-[10px] sm:text-xs text-[var(--tsc-muted)]"
    >
      {STAGES.map((stage, index) => {
        const isActive = stage.key === activeKey;
        return (
          <span key={stage.key} className="inline-flex items-center gap-1 sm:gap-2">
            {index > 0 && (
              <span
                className="text-[var(--tsc-line)] select-none text-[9px] sm:text-xs"
                aria-hidden="true"
              >
                ──
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 sm:gap-1.5 transition-colors ${
                isActive
                  ? "font-semibold text-[var(--tsc-ink)]"
                  : "text-[var(--tsc-muted)] opacity-70"
              }`}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                className={`inline-block h-2 w-2 rounded-full transition-transform ${
                  isActive
                    ? "bg-[var(--tsc-signal)] ring-2 ring-[var(--tsc-ink)]"
                    : "border border-[var(--tsc-line)] bg-transparent"
                }`}
                aria-hidden="true"
              />
              <span>{stage.label}</span>
            </span>
          </span>
        );
      })}
    </nav>
  );
}
