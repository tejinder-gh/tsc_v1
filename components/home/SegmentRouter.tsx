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

import { Briefcase, Store } from "lucide-react";
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
      <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
        {segmentCards.map((card) => {
          const selected = segment === card.segment;
          const Icon = card.segment === "local" ? Store : Briefcase;
          const exampleTags = card.examples.split(",").map((s) => s.trim());

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
              className={`group flex flex-col justify-between rounded-xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                selected
                  ? "border-2 border-ledger"
                  : "border-2 border-ink/10 hover:border-ledger"
              }`}
            >
              <div>
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-mist text-ledger">
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  {card.title}
                  <span
                    aria-hidden="true"
                    className="ml-2 inline-block text-ledger transition-transform duration-300 group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </h2>
                <p className="mt-3 text-lg leading-relaxed text-slate">{card.body}</p>
              </div>

              <div className="mt-8">
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate/80">
                  We handle:
                </p>
                <div className="flex flex-wrap gap-2">
                  {exampleTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-mist px-3 py-1 text-sm font-medium text-slate transition-colors group-hover:bg-ledger/10 group-hover:text-ledger-dark"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
