/**
 * What: Lead magnet page - the email-gated Automation Opportunities Checklist.
 * Why: The lowest-commitment rung; destination for exit traffic, the floating widget,
 *      and every "not ready to talk?" strip.
 * How: Server page composing the client ChecklistForm; booking remains visible as the
 *      higher rung.
 * From Where: TheSkillCorner marketing site build brief (lead magnet spec), 2026-06.
 * When: 2026-06.
 */

import type { Metadata } from "next";
import { AbstractVisual } from "@/components/AbstractVisual";
import { CtaLink } from "@/components/CtaLink";
import { ChecklistForm } from "@/components/forms/ChecklistForm";
import { checklist } from "@/content/site";

export const metadata: Metadata = {
  title: checklist.title,
  description: `${checklist.subtitle}. ${checklist.description}`,
  alternates: { canonical: "/checklist" },
};

export default function ChecklistPage() {
  return (
    <div className="mx-auto max-w-site px-4 py-14 sm:px-6">
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div className="relative">
          <div className="absolute -inset-10 -z-10 hidden lg:block opacity-40">
            <AbstractVisual variant="checklist" />
          </div>
          <p className="font-mono text-sm font-semibold uppercase tracking-widest text-ledger">
            Free checklist
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-[-0.02em] text-ink sm:text-5xl">
            {checklist.title}
          </h1>
          <p className="mt-3 font-display text-xl font-semibold text-ink">{checklist.subtitle}</p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed">{checklist.description}</p>
          <ul className="mt-7 space-y-3">
            {checklist.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3">
                <span aria-hidden="true" className="mt-1 shrink-0 text-ledger">
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 8.5L6 12l8-8"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="leading-relaxed">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-white p-7 shadow-sm border-2 border-ink/10 sm:p-8">
          <h2 className="font-display text-xl font-bold tracking-[-0.02em] text-ink">
            Where should we send it?
          </h2>
          <div className="mt-5">
            <ChecklistForm />
          </div>
          <p className="mt-5 border-t border-ink/10 pt-5 text-sm">
            Ready for the bigger step?{" "}
            <CtaLink href="/book" location="checklist_page" variant="text" className="text-sm">
              Book a free automation audit
            </CtaLink>
          </p>
        </div>
      </div>
    </div>
  );
}
