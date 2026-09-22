/**
 * What: Industry index - all industries grouped into the two segments, with anchors
 *       (#local-businesses, #practices) that the home segment router links to.
 * Why: The router needs a destination per segment, and the index internally links every
 *      industry funnel page for SEO.
 * How: Server component grouping content/industries.ts by segment.
 * From Where: TheSkillCorner marketing site build brief, 2026-06.
 * When: 2026-06.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { AbstractVisual } from "@/components/AbstractVisual";
import { FinalCta } from "@/components/FinalCta";
import { industriesBySegment } from "@/content/industries";

export const metadata: Metadata = {
  title: "Industries we automate",
  description:
    "AI automation for convenience stores, restaurants, salons, gyms, construction, auto repair, pet grooming, medical clinics, dental offices, law firms, accounting, real estate, veterinary clinics, and physiotherapy. Find your industry and see exactly what we automate.",
  alternates: { canonical: "/industries" },
};

function IndustryGroup({
  id,
  title,
  intro,
  segment,
}: {
  id: string;
  title: string;
  intro: string;
  segment: "local" | "practice";
}) {
  const items = industriesBySegment(segment);
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-20">
      <h2
        id={`${id}-heading`}
        className="font-display text-2xl font-bold tracking-[-0.02em] text-navy sm:text-3xl"
      >
        {title}
      </h2>
      <p className="mt-2 max-w-2xl">{intro}</p>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {items.map((industry) => (
          <Link
            key={industry.slug}
            href={`/industries/${industry.slug}`}
            className="group flex flex-col rounded-xl bg-white p-6 shadow-sm border-2 border-navy/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue"
          >
            <h3 className="font-display text-xl font-bold">{industry.name}</h3>
            <p className="mt-2 flex-1 leading-relaxed">{industry.cardLine}</p>
            <p className="mt-4 text-sm font-semibold text-blue">
              See what we automate
              <span
                aria-hidden="true"
                className="ml-2 inline-block transition-transform group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function ForIndexPage() {
  return (
    <>
      <div className="mx-auto max-w-site px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-navy sm:text-5xl">
              Built for how your industry actually works
            </h1>
            <p className="mt-4 text-lg text-slate">
              Same engineering, different vocabulary. Pick your industry and see the exact
              automations, the hours they save, and what they cost.
            </p>
          </div>
          <div className="hidden lg:block h-full">
            <AbstractVisual variant="for" />
          </div>
        </div>
        <div className="mt-12 space-y-14 lg:mt-24">
          <IndustryGroup
            id="local-businesses"
            title="Local businesses"
            intro="Fixed prices, plain talk, fast setup. Automations that start paying for themselves in weeks."
            segment="local"
          />
          <IndustryGroup
            id="practices"
            title="Practices and firms"
            intro="Privacy-first builds that fit how your office already works. PIPEDA/PHIPA-aware by design."
            segment="practice"
          />
        </div>
      </div>
      <FinalCta location="for_index" />
    </>
  );
}
