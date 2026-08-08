"use client";

/**
 * What: "What this can look like" proof grid - problem, automation, anticipated outcome -
 *       reordered so the visitor's segment appears first.
 * Why: No permissioned testimonials or measured client results exist at launch; these are
 *      illustrative scenarios, not real clients, and the numbers are anticipated outcomes
 *      for that kind of build, not measured data - framed that way rather than presented
 *      as fact. Segment ordering keeps a dentist from reading about lottery tickets first.
 * How: buildsForSegment() sorts the typed content; the first three render prominently,
 *      the rest in a compact row.
 * From Where: TheSkillCorner marketing site build brief (proof rules: no invented
 *             statistics or case studies), 2026-06; reframed 2026-08.
 * When: 2026-06; swap to named testimonials as soon as real ones are permissioned.
 */

import { buildsForSegment } from "@/content/proof";
import { useSegment } from "@/lib/segment-context";

export function ProofSection() {
  const { segment } = useSegment();
  const builds = buildsForSegment(segment);
  const featured = builds.slice(0, 3);

  return (
    <section aria-labelledby="proof-heading" className="bg-mist">
      <div className="mx-auto max-w-site px-4 py-16 sm:px-6">
        <h2 id="proof-heading" className="font-display text-3xl font-bold sm:text-4xl">
          What this can look like
        </h2>
        <p className="mt-3 max-w-2xl">
          Illustrative scenarios, not specific clients. Problem in, automation built, anticipated
          outcome.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {featured.map((build) => (
            <article key={build.business} className="flex flex-col rounded-xl bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate">
                Example - {build.business}
              </p>
              <p className="mt-3 leading-relaxed">
                <span className="font-semibold text-navy">The problem: </span>
                {build.problem}
              </p>
              <p className="mt-2 flex-1 leading-relaxed">
                <span className="font-semibold text-navy">The build: </span>
                {build.automation}
              </p>
              <p className="mt-4">
                <span className="block text-xs font-semibold uppercase tracking-wide text-slate">
                  Anticipated outcome
                </span>
                <span className="font-display text-xl font-bold text-blue">{build.result}</span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
