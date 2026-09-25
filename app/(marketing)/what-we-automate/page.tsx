import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { EditorialHero } from "@/components/public/EditorialHero";
import { SecondaryProblemPrompt } from "@/components/public/SecondaryProblemPrompt";
import { services as automationServices } from "@/content/services";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Automation Index | The Skill Corner",
  description:
    "A focused index of systems for communication, intake, scheduling, documents, reporting, follow-up, and recurring operational work.",
  alternates: { canonical: "/what-we-automate" },
  openGraph: {
    title: "Automation Index | The Skill Corner",
    description:
      "A focused index of concrete systems for communication, intake, scheduling, and follow-up.",
    url: "https://theskillcorner.com/what-we-automate",
  },
};

export default function WhatWeAutomatePage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Automation Index", path: "/what-we-automate" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />

      {/* Hero Section */}
      <EditorialHero
        eyebrow="AUTOMATION INDEX"
        headline="The repeatable parts are usually visible."
        supportingCopy="A focused index of systems for communication, intake, scheduling, documents, reporting, follow-up, and other recurring operational work."
        primaryAction={{
          label: "Start with a problem →",
          href: "/#start",
        }}
        secondaryAction={{
          label: "Browse systems ↓",
          href: "#systems",
        }}
      />

      {/* Focused Editorial Index */}
      <section
        id="systems"
        aria-label="Automation Systems"
        className="py-16 sm:py-24 border-b border-[var(--tsc-line)] font-geist bg-[var(--tsc-paper)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16 space-y-20">
          {[
            {
              index: "01",
              title: "INTAKE & SCHEDULING",
              description:
                "Front-line communication, after-hours call triage, two-way appointment coordination, and automated arrival updates.",
              slugs: [
                "ai-receptionist",
                "booking-and-reminders",
                "lead-qualification",
                "client-notifications",
              ],
            },
            {
              index: "02",
              title: "WORKFLOWS & DISPATCH",
              description:
                "Eliminating manual re-keying, field crew routing, client onboarding friction, and schedule management.",
              slugs: [
                "intake-and-documents",
                "dispatch-and-routing",
                "client-onboarding-portals",
                "contract-automation",
                "staff-scheduling",
              ],
            },
            {
              index: "03",
              title: "RETENTION & REPUTATION",
              description:
                "Post-service feedback loops, automated review generation, dormant account reactivation, and audience briefings.",
              slugs: [
                "reviews-and-reputation",
                "follow-up-automation",
                "customer-win-back",
                "social-media-automation",
                "newsletter-compiler",
              ],
            },
            {
              index: "04",
              title: "FINANCE & REPORTING",
              description:
                "Transaction reconciliation, automated payment reminders, live executive reporting, and automated supplier reordering.",
              slugs: [
                "invoice-and-payments",
                "expense-matching",
                "reporting-dashboards",
                "inventory-and-supplier-ordering",
              ],
            },
          ].map((cluster) => {
            const clusterServices = cluster.slugs
              .map((slug) => automationServices.find((s) => s.slug === slug))
              .filter((s): s is NonNullable<typeof s> => Boolean(s));

            return (
              <div
                key={cluster.title}
                className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start"
              >
                {/* Left Column: Category Description */}
                <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-28 lg:self-start">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)] tracking-wider">
                      {cluster.index}
                    </span>
                    <span className="font-mono text-xs text-[var(--tsc-line)]">/</span>
                    <span className="font-mono text-xs font-semibold text-[var(--tsc-ink)] tracking-wider uppercase">
                      {cluster.title}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
                    {cluster.description}
                  </p>
                  <div className="pt-1">
                    <span className="font-mono text-[11px] text-[var(--tsc-muted)] uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)]">
                      {clusterServices.length} Systems
                    </span>
                  </div>
                </div>

                {/* Right Column: Editorial Listing */}
                <div className="lg:col-span-8">
                  <div className="divide-y divide-[var(--tsc-line)] border-y border-[var(--tsc-line)]">
                    {clusterServices.map((service, index) => {
                      const num = String(index + 1).padStart(2, "0");
                      return (
                        <Link
                          key={service.slug}
                          href={`/what-we-automate/${service.slug}`}
                          className="group py-6 sm:py-7 flex flex-col md:flex-row md:items-center justify-between gap-4 px-3 -mx-3 rounded-[4px] hover:bg-[var(--tsc-surface)]/70 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tsc-action)]"
                        >
                          <div className="flex items-start gap-5 sm:gap-6 max-w-3xl">
                            <span className="font-mono text-sm sm:text-base font-semibold text-[var(--tsc-muted)] tracking-wider shrink-0 pt-0.5">
                              {num}
                            </span>
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="font-semibold text-lg sm:text-xl text-[var(--tsc-ink)] group-hover:text-[var(--tsc-action)] transition-colors">
                                  {service.name}
                                </span>
                                {service.timeline && (
                                  <span className="font-mono text-[11px] text-[var(--tsc-muted)] uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)]">
                                    {service.timeline}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-[var(--tsc-muted)] leading-relaxed">
                                {service.title}. {service.excerpt}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 font-mono text-xs text-[var(--tsc-muted)] group-hover:text-[var(--tsc-ink)] group-hover:translate-x-1 transition-all pl-11 md:pl-0 shrink-0 select-none">
                            <span>View specification</span>
                            <span aria-hidden="true">&rarr;</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Closing Problem Prompt */}
      <SecondaryProblemPrompt
        eyebrow="YOUR OPERATION"
        heading="Have a repeatable task not listed here?"
        supportingCopy="If your team repeats the same set of keystrokes, emails, or data transfers every week, describe the workflow and we will assess whether an automation is practical."
      />
    </>
  );
}
