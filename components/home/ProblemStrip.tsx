"use client";

/**
 * What: Three-pain problem strip that swaps copy based on the visitor's chosen segment.
 * Why: Recognition beats persuasion; a store owner and a clinic manager need to see their
 *      own week described, not generic "efficiency" talk.
 * How: Reads segment from context; falls back to segment-neutral copy until a choice is
 *      made. Content lives in content/home.ts keyed by segment.
 * From Where: TheSkillCorner marketing site build brief (problem strip spec), 2026-06.
 * When: 2026-06.
 */

import { problems } from "@/content/home";
import { useSegment } from "@/lib/segment-context";

import { Reveal } from "@/components/Reveal";
export function ProblemStrip() {
  const { segment } = useSegment();
  const items = problems[segment ?? "neutral"];

  return (
    <section aria-label="The problems we solve" className="bg-mist">
      <div className="mx-auto max-w-site px-4 py-16 sm:px-6">
        <Reveal>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Sound familiar?</h2>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {items.map((p, index) => (
            <Reveal key={p.title} delay={index * 80} className="h-full">
              <div className="h-full rounded-xl bg-white p-6 transition-shadow duration-200 hover:shadow-md hover:shadow-ink/5">
                <h3 className="font-display text-lg font-bold">{p.title}</h3>
                <p className="mt-2 leading-relaxed">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
