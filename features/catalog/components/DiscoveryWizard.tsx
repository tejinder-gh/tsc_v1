"use client";

import { ArrowRight, Bot, Compass, Sparkles, TrendingUp, Workflow } from "lucide-react";

export interface DiscoveryWizardProps {
  onSelectGoal: (goalId: string | null) => void;
  selectedGoal: string | null;
}

const GOAL_SHORTCUTS = [
  {
    id: "grow-revenue",
    label: "Capture Leads & Grow Revenue",
    subtext: "24/7 AI receptionists, sales prospect shortlists, qualification funnels",
    icon: TrendingUp,
    badge: "High ROI",
  },
  {
    id: "automate-operations",
    label: "Automate Repetitive Operations",
    subtext: "Intake workflows, appointment reminders, document dispatch, staff scheduling",
    icon: Workflow,
    badge: "Save 15+ hrs/wk",
  },
  {
    id: "stay-informed",
    label: "Stay Ahead on AI & Tech Shifts",
    subtext: "Curated weekly briefings on applied models, architecture playbooks, and case studies",
    icon: Bot,
    badge: "Free Briefing",
  },
  {
    id: "find-opportunities",
    label: "Find Off-Market Deals & Tenders",
    subtext: "Monitored deal registries, bankruptcy filings, and municipal contract RFPs",
    icon: Compass,
    badge: "Market Intel",
  },
];

export function DiscoveryWizard({ onSelectGoal, selectedGoal }: DiscoveryWizardProps) {
  return (
    <div className="bg-gradient-to-b from-blue-tint/50 to-white rounded-2xl p-6 md:p-8 border border-blue-200/60 shadow-xs mb-10">
      <div className="max-w-2xl mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue text-white text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Discovery</span>
        </div>
        <h2 className="font-display font-semibold text-2xl md:text-3xl text-navy">
          What is your primary focus this week?
        </h2>
        <p className="text-slate text-sm mt-1.5">
          Select an outcome to view tailored automations, managed research feeds, and digital
          engineering services.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {GOAL_SHORTCUTS.map((goal) => {
          const Icon = goal.icon;
          const isSelected = selectedGoal === goal.id;
          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => onSelectGoal(isSelected ? null : goal.id)}
              className={`text-left p-5 rounded-xl border-2 transition-all flex flex-col justify-between ${
                isSelected
                  ? "bg-white border-blue shadow-md ring-2 ring-blue/20"
                  : "bg-white/80 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isSelected ? "bg-blue text-white" : "bg-blue-tint text-blue"
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.8} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {goal.badge}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-sm text-navy mb-1.5 line-clamp-1">
                  {goal.label}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {goal.subtext}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
                <span className={isSelected ? "text-blue font-semibold" : "text-muted"}>
                  {isSelected ? "Filter active" : "Filter by goal"}
                </span>
                <ArrowRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isSelected ? "text-blue translate-x-1" : "text-muted"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
