"use client";

/**
 * What: Segment-aware pricing anchor card(s).
 * Why: Local businesses must see fixed packages and practices must see engagement ranges
 *      with the compliance note - and never each other's anchor once segment is known.
 * How: fixedSegment (industry pages) wins; otherwise the session segment from context;
 *      if neither is known, both anchors render side by side as an honest default.
 * From Where: TheSkillCorner marketing site build brief (pricing anchor rules), 2026-06.
 * When: 2026-06; update copy in content/site.ts, not here.
 */

import { pricing, type Segment } from "@/content/site";
import { useSegment } from "@/lib/segment-context";
import { CtaLink } from "./CtaLink";

interface PricingAnchorProps {
  fixedSegment?: Segment;
  location: string;
}

function AnchorCard({ segment, location }: { segment: Segment; location: string }) {
  const content = pricing[segment];
  return (
    <div className="flex h-full flex-col rounded-xl border-2 border-navy/10 bg-white p-7">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate">{content.label}</p>
      <p className="mt-2 font-display text-2xl font-bold text-blue sm:text-3xl">
        {content.anchor}
      </p>
      <p className="mt-3 leading-relaxed">{content.detail}</p>
      {content.compliance ? (
        <p className="mt-4 rounded-lg bg-mist p-4 text-sm leading-relaxed text-navy">
          {content.compliance}
        </p>
      ) : null}
      <div className="mt-6">
        <CtaLink href="/book" location={`${location}_pricing`} variant="text">
          Get your exact quote in a free audit
        </CtaLink>
      </div>
    </div>
  );
}

export function PricingAnchor({ fixedSegment, location }: PricingAnchorProps) {
  const { segment: sessionSegment } = useSegment();
  const segment = fixedSegment ?? sessionSegment;

  return (
    <section aria-label="Pricing" className="mx-auto max-w-site px-4 py-16 sm:px-6">
      <h2 className="font-display text-3xl font-bold sm:text-4xl">What it costs</h2>
      <p className="mt-3 max-w-2xl">
        No hourly billing, no open-ended retainers. You always know the number before we build.
      </p>
      <div className={`mt-8 grid gap-6 ${segment ? "max-w-2xl" : "md:grid-cols-2"}`}>
        {segment ? (
          <AnchorCard segment={segment} location={location} />
        ) : (
          <>
            <AnchorCard segment="local" location={location} />
            <AnchorCard segment="practice" location={location} />
          </>
        )}
      </div>
    </section>
  );
}
