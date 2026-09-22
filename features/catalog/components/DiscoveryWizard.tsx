"use client";

export interface DiscoveryWizardProps {
  onSelectGoal: (goalId: string | null) => void;
  selectedGoal: string | null;
}

const GOAL_SHORTCUTS = [
  {
    id: "grow-revenue",
    label: "Capture Leads & Grow Revenue",
    subtext: "24/7 AI receptionists, qualification funnels, and marketing visibility",
  },
  {
    id: "automate-operations",
    label: "Automate Repetitive Operations",
    subtext: "Intake workflows, appointment reminders, document dispatch, staff scheduling",
  },
  {
    id: "stay-informed",
    label: "Stay Ahead on AI & Tech Shifts",
    subtext: "Curated weekly briefings on applied models, architecture playbooks, and case studies",
  },
  {
    id: "find-opportunities",
    label: "Find Off-Market Deals & Tenders",
    subtext: "Monitored deal registries, bankruptcy filings, and municipal contract RFPs",
  },
];

export function DiscoveryWizard({ onSelectGoal, selectedGoal }: DiscoveryWizardProps) {
  return (
    <div className="p-6 sm:p-8 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/30 mb-10 space-y-6 font-geist">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <div className="text-[11px] font-mono font-medium tracking-[0.14em] uppercase text-[var(--tsc-muted)] mb-1">
            OUTCOME FILTER
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]">
            What is your primary focus this week?
          </h2>
        </div>
        {selectedGoal && (
          <button
            type="button"
            onClick={() => onSelectGoal(null)}
            className="text-xs font-mono text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)] underline underline-offset-4 self-start sm:self-auto"
          >
            Clear focus &times;
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {GOAL_SHORTCUTS.map((goal) => {
          const isSelected = selectedGoal === goal.id;
          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => onSelectGoal(isSelected ? null : goal.id)}
              className={`text-left p-4 rounded-[6px] border transition-all flex flex-col justify-between gap-3 ${
                isSelected
                  ? "border-[var(--tsc-ink)] bg-[var(--tsc-paper)] ring-1 ring-[var(--tsc-ink)]"
                  : "border-[var(--tsc-line)] bg-[var(--tsc-paper)] hover:border-[var(--tsc-ink)]/40 hover:bg-[var(--tsc-surface)]/50"
              }`}
            >
              <div className="space-y-1">
                <span className="font-semibold text-sm text-[var(--tsc-ink)] block">
                  {goal.label}
                </span>
                <span className="text-xs text-[var(--tsc-muted)] leading-relaxed block">
                  {goal.subtext}
                </span>
              </div>
              <span className="font-mono text-[11px] text-[var(--tsc-muted)]">
                {isSelected ? "Active filter ✓" : "Filter by focus →"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
