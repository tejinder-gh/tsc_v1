import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { EditorialHero } from "@/components/public/EditorialHero";
import { PageEyebrow } from "@/components/public/PageEyebrow";
import { SecondaryProblemPrompt } from "@/components/public/SecondaryProblemPrompt";
import { recentBuilds } from "@/content/proof";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Illustrative Operational Scenarios | The Skill Corner",
  description:
    "Real operational constraints, automated system architectures, and anticipated outcome ranges. Transparent modeled scenarios, not synthetic case studies.",
  alternates: { canonical: "/results" },
  openGraph: {
    title: "Illustrative Operational Scenarios | The Skill Corner",
    description:
      "Operational constraints, system architectures, and anticipated outcome ranges across commercial businesses and professional practices.",
    url: "https://theskillcorner.com/results",
  },
};

export default function ResultsPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Results", path: "/results" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />

      {/* Hero Section */}
      <EditorialHero
        eyebrow="SYSTEM SCENARIOS"
        headline="What these systems change in day-to-day operations."
        supportingCopy="Concrete architectural breakdowns showing how targeted automations resolve routine operational bottlenecks. All examples below represent modeled scenarios and anticipated outcome ranges, not measured client case studies."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Results", href: "/results" },
        ]}
        primaryAction={{
          label: "Start with a problem →",
          href: "/#start",
        }}
        secondaryAction={{
          label: "Explore scenarios ↓",
          href: "#scenarios",
        }}
      />

      {/* Evidence Disclosure Banner */}
      <section
        aria-label="Evidence & Methodology Disclosure"
        className="border-b border-[var(--tsc-line)] bg-[var(--tsc-surface)]/60 font-geist py-8"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-6 text-xs text-[var(--tsc-muted)]">
            <span className="font-mono font-semibold uppercase tracking-wider text-[var(--tsc-ink)] shrink-0">
              EVIDENCE DISCIPLINE:
            </span>
            <p className="leading-relaxed">
              We do not fabricate client testimonials or publish synthetic ROI figures. The
              scenarios below illustrate typical constraints we engineer systems for and their
              modeled operational impact. In every custom engagement, success is measured strictly
              against baseline hours established during your initial discovery audit.
            </p>
          </div>
        </div>
      </section>

      {/* Illustrative Scenarios Grid */}
      <section
        id="scenarios"
        aria-label="Modeled Scenarios"
        className="py-16 sm:py-24 border-b border-[var(--tsc-line)] font-geist bg-[var(--tsc-paper)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="max-w-3xl mb-14 space-y-3">
            <PageEyebrow>MODELED SYSTEM STUDIES</PageEyebrow>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]">
              Real constraints, engineered systems, anticipated returns.
            </h2>
            <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
              Examine the bottleneck pattern: high manual repetition, an identifiable trigger, and a
              system that handles the predictable portion with human exception escalation.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentBuilds.map((build) => (
              <article
                key={build.business}
                className="flex flex-col rounded-[8px] border border-[var(--tsc-line)] bg-white p-7 sm:p-8 space-y-5 justify-between"
              >
                <div className="space-y-4">
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between border-b border-[var(--tsc-line)] pb-3">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)]">
                      MODELED SCENARIO
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-[var(--tsc-muted)]">
                      {build.segment === "local" ? "Commercial" : "Practice"}
                    </span>
                  </div>

                  {/* Operation Title */}
                  <h3 className="font-semibold text-lg text-[var(--tsc-ink)]">{build.business}</h3>

                  {/* Constraint */}
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)] block">
                      OPERATIONAL CONSTRAINT
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--tsc-ink)] leading-relaxed">
                      {build.problem}
                    </p>
                  </div>

                  {/* System Architecture */}
                  <div className="space-y-1 pt-2 border-t border-[var(--tsc-line)]">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)] block">
                      SYSTEM INTERVENTION
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                      {build.automation}
                    </p>
                  </div>
                </div>

                {/* Anticipated Outcome Metric (Truthfully Labeled) */}
                <div className="pt-4 border-t border-[var(--tsc-line)] bg-[var(--tsc-surface)]/40 -mx-7 sm:-mx-8 -mb-7 sm:-mb-8 p-5 rounded-b-[7px]">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)] block">
                    TARGET / EXPECTED RANGE
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-[var(--tsc-action)] block mt-0.5">
                    {build.result}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Problem Prompt */}
      <SecondaryProblemPrompt
        eyebrow="YOUR OPERATION"
        heading="Want to know what this looks like for your business?"
        supportingCopy="The free 30-minute audit is where we evaluate your actual workflows and calculate your specific hours-recoverable potential."
        secondaryBookingHref="/book"
        secondaryBookingLabel="Or schedule an automation audit"
      />
    </>
  );
}
