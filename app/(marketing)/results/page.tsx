/**
 * What: The results page - illustrative scenarios (problem, build, anticipated outcome),
 *       not real case studies.
 * Why: Closes an IA gap - the brief lists /results as a standalone route for case studies.
 *      No permissioned client testimonials or measured results exist yet, and the brief
 *      forbids inventing a statistic or case study, so this page says that plainly up
 *      front rather than let a page literally named "Results" imply otherwise. Reuses the
 *      same recentBuilds content and "Example -" / "Anticipated outcome" framing already
 *      used in ProofSection (home) and the industry pages, so nothing here contradicts
 *      what those pages already say.
 * How: Server page over content/proof.ts.
 * From Where: Brief IA (§7) and proof rules (§12), 2026-08.
 * When: 2026-08.
 */

import type { Metadata } from "next";
import { CtaLink } from "@/components/CtaLink";
import { FinalCta } from "@/components/FinalCta";
import { recentBuilds } from "@/content/proof";

export const metadata: Metadata = {
  title: "Results",
  description:
    "What automation can look like for a business like yours - illustrative scenarios and anticipated outcomes, not published client case studies.",
  alternates: { canonical: "/results" },
};

export default function ResultsPage() {
  return (
    <>
      <section className="mx-auto max-w-site px-4 pb-12 pt-16 sm:px-6 sm:pt-20">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-500">Results</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">
          What this can look like for a business like yours
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed">
          We do not have permissioned client case studies to publish yet. What follows is a set of
          illustrative scenarios - real problems we build for, described honestly as typical
          outcomes for that kind of build, not a specific client's measured results.
        </p>
        <div className="mt-8">
          <CtaLink href="/book" location="results_hero">
            Book a free automation audit
          </CtaLink>
        </div>
      </section>

      <section aria-label="Illustrative scenarios" className="bg-mist">
        <div className="mx-auto max-w-site px-4 py-14 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentBuilds.map((build) => (
              <article
                key={build.business}
                className="flex flex-col rounded-card border-[1.5px] border-line bg-white p-6"
              >
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
                  <span className="font-display text-xl font-bold text-blue-500">
                    {build.result}
                  </span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FinalCta
        location="results"
        heading="Want to know what this looks like for your business specifically?"
        body="The free 30-minute audit is where we get concrete - not hypothetical examples, your actual numbers."
      />
    </>
  );
}
