import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { EditorialHero } from "@/components/public/EditorialHero";
import { PageEyebrow } from "@/components/public/PageEyebrow";
import { SecondaryProblemPrompt } from "@/components/public/SecondaryProblemPrompt";
import { ArchitectureVisualizer } from "@/components/services/ArchitectureVisualizer";
import { digitalServices } from "@/content/digital-services";
import { services as automationServices } from "@/content/services";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Work & Capabilities | The Skill Corner",
  description:
    "End-to-end digital services, automation systems, software, and operational support chosen for the bottleneck, not because a category happens to be fashionable.",
  alternates: { canonical: "/digital-services" },
  openGraph: {
    title: "Work & Capabilities | The Skill Corner",
    description:
      "Automation, software, digital growth, and operational systems — chosen for the bottleneck.",
    url: "https://theskillcorner.com/digital-services",
  },
};

export default function DigitalServicesPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Work", path: "/digital-services" },
  ]);

  // Editorial Band 01: Automate (18 canonical automations from content/services.ts)
  const automateOfferings = automationServices.map((s) => ({
    name: s.name,
    tagline: s.title,
    href: `/what-we-automate/${s.slug}`,
  }));

  // Editorial Band 02: Build (Websites, Apps, AI Agents from content/digital-services.ts)
  const buildSlugs = new Set([
    "ai-agent-development",
    "website-development",
    "application-development",
  ]);
  const buildOfferings = digitalServices
    .filter((s) => buildSlugs.has(s.slug))
    .map((s) => ({
      name: s.name,
      tagline: s.tagline,
      href: `/digital-services/${s.slug}`,
    }));

  // Editorial Band 03: Grow (Marketing/GEO, Rebranding from content/digital-services.ts)
  const growSlugs = new Set(["digital-marketing", "rebranding"]);
  const growOfferings = digitalServices
    .filter((s) => growSlugs.has(s.slug))
    .map((s) => ({
      name: s.name,
      tagline: s.tagline,
      href: `/digital-services/${s.slug}`,
    }));

  // Editorial Band 04: Operate (Staffing, Documentation from content/digital-services.ts)
  const operateSlugs = new Set(["staffing", "documentation"]);
  const operateOfferings = digitalServices
    .filter((s) => operateSlugs.has(s.slug))
    .map((s) => ({
      name: s.name,
      tagline: s.tagline,
      href: `/digital-services/${s.slug}`,
    }));

  const bands = [
    {
      index: "01",
      title: "AUTOMATE",
      description:
        "Systems that remove repetitive execution, routing, coordination, communication, and handoffs.",
      offerings: automateOfferings,
    },
    {
      index: "02",
      title: "BUILD",
      description: "Websites, applications, internal tools, integrations, and custom software.",
      offerings: buildOfferings,
    },
    {
      index: "03",
      title: "GROW",
      description:
        "Digital acquisition, search, conversion, brand/digital presence, and customer-growth work.",
      offerings: growOfferings,
    },
    {
      index: "04",
      title: "OPERATE",
      description:
        "Technical staffing, operational documentation, SOPs, and other capabilities concerned with running and scaling the organization.",
      offerings: operateOfferings,
    },
  ];

  const engagementSteps = [
    {
      step: "01",
      title: "Understand the constraint",
      body: "We start by observing where hours, inquiries, or dollars are currently leaking before discussing technology.",
    },
    {
      step: "02",
      title: "Define the smallest useful intervention",
      body: "We specify the single highest-leverage system that resolves the bottleneck with minimal disruption.",
    },
    {
      step: "03",
      title: "Build against existing systems where possible",
      body: "We connect into the software, phone lines, and databases your business already relies on rather than forcing replacements.",
    },
    {
      step: "04",
      title: "Measure whether the intervention changed the work",
      body: "Success is evaluated strictly by time recovered, calls captured, or operational velocity gained.",
    },
  ];

  return (
    <>
      <JsonLd data={breadcrumbs} />

      {/* Hero Section */}
      <EditorialHero
        eyebrow="WORK"
        headline="Systems that make the work lighter."
        supportingCopy="Automation, software, digital growth, and operational systems — chosen for the bottleneck, not because a category happens to be fashionable."
        primaryAction={{
          label: "Start with a problem →",
          href: "/#start",
        }}
        secondaryAction={{
          label: "Browse capabilities",
          href: "#capabilities",
        }}
      />

      {/* Capability Index (4 Editorial Bands) */}
      <section
        id="capabilities"
        aria-label="Capabilities Index"
        className="py-16 sm:py-24 border-b border-[var(--tsc-line)] font-geist bg-[var(--tsc-paper)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16 space-y-20">
          {bands.map((band) => (
            <div
              key={band.index}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start"
            >
              {/* Left Column: Band Category Description */}
              <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-28 lg:self-start">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)] tracking-wider">
                    {band.index}
                  </span>
                  <span className="font-mono text-xs text-[var(--tsc-line)]">/</span>
                  <span className="font-mono text-xs font-semibold text-[var(--tsc-ink)] tracking-wider uppercase">
                    {band.title}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
                  {band.description}
                </p>
              </div>

              {/* Right Column: Editorial Capability Listing */}
              <div className="lg:col-span-8">
                <div className="divide-y divide-[var(--tsc-line)] border-y border-[var(--tsc-line)]">
                  {band.offerings.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex items-start sm:items-center justify-between gap-4 py-5 px-3 -mx-3 rounded-[4px] hover:bg-[var(--tsc-surface)]/70 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tsc-action)]"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="font-semibold text-base sm:text-lg text-[var(--tsc-ink)] group-hover:text-[var(--tsc-action)] transition-colors">
                          {item.name}
                        </div>
                        <div className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                          {item.tagline}
                        </div>
                      </div>
                      <span
                        className="font-mono text-sm text-[var(--tsc-muted)] group-hover:text-[var(--tsc-ink)] group-hover:translate-x-1 transition-all pt-1 sm:pt-0 shrink-0 select-none"
                        aria-hidden="true"
                      >
                        &rarr;
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive System Architecture Comparison */}
      <section
        aria-label="System Architecture Comparison"
        className="py-16 sm:py-24 border-b border-[var(--tsc-line)] font-geist bg-[var(--tsc-paper)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <ArchitectureVisualizer />
        </div>
      </section>

      {/* How an Engagement Starts */}
      <section
        aria-labelledby="how-engagement-starts"
        className="py-16 sm:py-24 border-b border-[var(--tsc-line)] font-geist bg-[var(--tsc-paper)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="max-w-3xl mb-12 space-y-3">
            <PageEyebrow>PROCESS</PageEyebrow>
            <h2
              id="how-engagement-starts"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]"
            >
              How an engagement starts.
            </h2>
            <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
              We deploy disciplined interventions rather than open-ended consulting cycles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {engagementSteps.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/30 space-y-3"
              >
                <div className="font-mono text-xs font-semibold text-[var(--tsc-muted)] tracking-wider">
                  {step.step}
                </div>
                <h3 className="font-semibold text-base text-[var(--tsc-ink)]">{step.title}</h3>
                <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Problem Prompt */}
      <SecondaryProblemPrompt
        eyebrow="START HERE"
        heading="Not sure which category your problem belongs in?"
        supportingCopy="Good. Start with the problem instead. Describe what is taking more time, attention, or manual effort than it should."
      />
    </>
  );
}
