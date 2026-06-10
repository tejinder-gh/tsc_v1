/**
 * What: Services index - the six outcome-first service cards plus conversion rungs.
 * Why: Destination of the hero's secondary CTA; visitors comparing "what can actually be
 *      automated" need the full catalogue with paths to book or grab the checklist.
 * How: Reuses the ServicesGrid component over typed content.
 * From Where: TheSkillCorner marketing site build brief, 2026-06.
 * When: 2026-06.
 */

import type { Metadata } from "next";
import { FinalCta } from "@/components/FinalCta";
import { ServicesGrid } from "@/components/ServicesGrid";

export const metadata: Metadata = {
  title: "What we automate",
  description:
    "Missed-call answering, booking and reminders, intake and documents, reviews, follow-up, and reporting dashboards - the six automations that give owners their week back.",
};

export default function ServicesIndexPage() {
  return (
    <>
      <div className="mx-auto max-w-site px-4 pt-16 sm:px-6">
        <h1 className="max-w-3xl font-display text-4xl font-bold sm:text-5xl">
          Six automations that give you your week back
        </h1>
        <p className="mt-4 max-w-2xl text-lg">
          Every build connects to the tools you already use, goes live in days to weeks, and is
          monitored so it keeps working after launch.
        </p>
      </div>
      <ServicesGrid />
      <FinalCta location="services_index" />
    </>
  );
}
