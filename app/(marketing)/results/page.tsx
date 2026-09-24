import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { EditorialHero } from "@/components/public/EditorialHero";
import { SecondaryProblemPrompt } from "@/components/public/SecondaryProblemPrompt";
import { ResultsInteractiveView } from "@/components/results/ResultsInteractiveView";
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

      {/* Interactive Scenarios & ROI Estimator Section */}
      <section
        aria-label="Modeled Scenarios and Value Estimation"
        className="py-16 sm:py-24 border-b border-[var(--tsc-line)] font-geist bg-[var(--tsc-paper)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <ResultsInteractiveView recentBuilds={recentBuilds} />
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
