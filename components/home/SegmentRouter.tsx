"use client";

/**
 * What: The two-card segment router under the hero - "I run a local business" vs
 *       "I run a practice or firm".
 * Why: The two audiences need different language, proof, and pricing; this is where a
 *      visitor self-identifies. The choice persists in sessionStorage and personalizes
 *      problems, proof, and pricing anchors across the site.
 * How: Cards are links to the segmented /for index; onClick stores the segment via
 *      context and fires cta_clicked before navigation.
 * From Where: TheSkillCorner marketing site build brief (segment router spec), 2026-06.
 * When: 2026-06.
 */

import Link from "next/link";
import { segmentCards } from "@/content/home";
import { track } from "@/lib/analytics";
import { useSegment } from "@/lib/segment-context";

export function SegmentRouter() {
  const { segment, setSegment } = useSegment();

  return (
    <section
      aria-label="Choose your business type"
      className="mx-auto max-w-site px-4 pb-16 sm:px-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {segmentCards.map((card) => {
          const selected = segment === card.segment;
          return (
            <Link
              key={card.segment}
              href={card.href}
              onClick={() => {
                setSegment(card.segment);
                track("cta_clicked", {
                  location: "segment_router",
                  segment: card.segment,
                  label: card.title,
                });
              }}
              aria-current={selected ? "true" : undefined}
              className={`group rounded-xl border-2 bg-white p-7 transition-colors ${
                selected ? "border-ledger" : "border-ink/10 hover:border-ledger"
              }`}
            >
              <h2 className="font-display text-xl font-bold sm:text-2xl">
                {card.title}
                <span
                  aria-hidden="true"
                  className="ml-2 inline-block text-ledger transition-transform group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </h2>
              <p className="mt-2 leading-relaxed">{card.body}</p>
              <p className="mt-4 text-sm font-medium text-slate">
                <span className="text-ledger">We handle:</span> {card.examples}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
