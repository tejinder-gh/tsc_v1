/**
 * What: Services index - the nine outcome-first service cards plus conversion rungs.
 * Why: Destination of the hero's secondary CTA; visitors comparing "what can actually be
 *      automated" need the full catalogue with paths to book or grab the checklist.
 * How: Reuses the ServicesGrid component over typed content.
 * From Where: TheSkillCorner marketing site build brief, 2026-06.
 * When: 2026-06.
 */

import type { Metadata } from "next";
import { AbstractVisual } from "@/components/AbstractVisual";
import { FinalCta } from "@/components/FinalCta";
import { ServicesGrid } from "@/components/ServicesGrid";

export const metadata: Metadata = {
  title: "What we automate",
  description:
    "From missed-call answering and booking reminders to client onboarding and supplier ordering - the nine automations that give owners their week back.",
  alternates: { canonical: "/services" },
};

export default function ServicesIndexPage() {
  return (
    <>
      <div className="mx-auto max-w-site px-4 pt-16 sm:px-6 lg:pt-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-ink sm:text-5xl">
              Nine automations that give you your week back
            </h1>
            <p className="mt-4 text-lg text-slate">
              Every build connects to the tools you already use, goes live in days to weeks, and is
              monitored so it keeps working after launch.
            </p>
          </div>
          <div className="hidden lg:block h-full">
            <AbstractVisual variant="services" />
          </div>
        </div>
      </div>
      <ServicesGrid />
      <FinalCta location="services_index" />
    </>
  );
}
