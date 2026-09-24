/**
 * What: Lead magnet page - the email-gated Automation Opportunities Checklist.
 * Why: The lowest-commitment rung; destination for visitors auditing manual workflow tasks.
 * How: EditorialHero with interactive checklist tool.
 * From Where: TheSkillCorner marketing site editorial redesign, 2026.
 */

import type { Metadata } from "next";
import { InteractiveChecklist } from "@/components/checklist/InteractiveChecklist";
import { EditorialHero } from "@/components/public/EditorialHero";
import { checklist } from "@/content/site";

export const metadata: Metadata = {
  title: checklist.title,
  description: `${checklist.subtitle}. ${checklist.description}`,
  alternates: { canonical: "/checklist" },
};

export default function ChecklistPage() {
  return (
    <div className="mx-auto max-w-site px-4 py-10 sm:px-6 font-geist">
      <EditorialHero
        eyebrow="INTERACTIVE AUDIT &amp; SELF-ASSESSMENT"
        headline={checklist.title}
        supportingCopy={`${checklist.subtitle} — ${checklist.description}`}
      >
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--tsc-muted)] uppercase tracking-wider">
          <span>25 benchmarked workflows</span>
          <span>&bull;</span>
          <span>Live wasted-hours calculation</span>
        </div>
      </EditorialHero>

      <div className="mt-8">
        <InteractiveChecklist />
      </div>
    </div>
  );
}
