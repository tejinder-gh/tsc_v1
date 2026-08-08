/**
 * What: Lead magnet page - the email-gated Automation Opportunities Checklist.
 * Why: The lowest-commitment rung; destination for exit traffic, the floating widget,
 *      and every "not ready to talk?" strip.
 * How: Renders the stateful InteractiveChecklist component, which embeds the calculations
 *      and the lead form.
 * From Where: TheSkillCorner marketing site build brief (lead magnet spec), 2026-06.
 * When: 2026-06.
 */

import type { Metadata } from "next";
import { AbstractVisual } from "@/components/AbstractVisual";
import { InteractiveChecklist } from "@/components/checklist/InteractiveChecklist";
import { checklist } from "@/content/site";

export const metadata: Metadata = {
  title: checklist.title,
  description: `${checklist.subtitle}. ${checklist.description}`,
  alternates: { canonical: "/checklist" },
};

export default function ChecklistPage() {
  return (
    <div className="mx-auto max-w-site px-4 py-14 sm:px-6">
      <div className="relative mb-12 max-w-3xl">
        <div className="absolute -inset-10 -z-10 hidden lg:block opacity-40">
          <AbstractVisual variant="checklist" />
        </div>
        <p className="font-mono text-sm font-semibold uppercase tracking-widest text-blue">
          Interactive Audit
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-[-0.02em] text-navy sm:text-5xl">
          {checklist.title}
        </h1>
        <p className="mt-3 font-display text-xl font-semibold text-navy">{checklist.subtitle}</p>
        <p className="mt-4 text-lg leading-relaxed text-slate">{checklist.description}</p>
      </div>

      <InteractiveChecklist />
    </div>
  );
}
