import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { EditorialHero } from "@/components/public/EditorialHero";
import { PageEyebrow } from "@/components/public/PageEyebrow";
import { SecondaryProblemPrompt } from "@/components/public/SecondaryProblemPrompt";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Delivery Methodology & Lifecycle | The Skill Corner",
  description:
    "How our systems move from constraint to production: understand, specify, integrate, and measure. A disciplined four-phase lifecycle with zero adoption friction.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: "Delivery Methodology & Lifecycle | The Skill Corner",
    description:
      "A disciplined four-phase engineering lifecycle: understand, specify, integrate, and measure.",
    url: "https://theskillcorner.com/how-it-works",
  },
};

interface Phase {
  index: string;
  name: string;
  headline: string;
  summary: string;
  weHandle: string;
  clientProvides: string;
  cadence: string;
}

const PHASES: readonly Phase[] = [
  {
    index: "01",
    name: "UNDERSTAND",
    headline: "Map the operational constraint.",
    summary:
      "We start by observing where hours, inquiries, or dollars are currently leaking before discussing technology.",
    weHandle:
      "Audit your recurring workflows, trace message/data handoffs, and isolate the single highest-frequency constraint with the fastest payback.",
    clientProvides:
      "A 30-minute discovery conversation. Walk us through where your team loses time every week. You keep the audit findings whether you hire us or not.",
    cadence: "Day 1–3",
  },
  {
    index: "02",
    name: "SPECIFY",
    headline: "Define the smallest useful intervention.",
    summary:
      "We specify a deterministic, scoped system that resolves the bottleneck without introducing unnecessary operational complexity.",
    weHandle:
      "Draft the exact system architecture, data pipeline, connected tools, and deliverable boundaries with a guaranteed delivery timeline.",
    clientProvides:
      "Review and approve the specification. Scope and price are fixed before work begins; nothing is built without your explicit sign-off.",
    cadence: "Week 1",
  },
  {
    index: "03",
    name: "INTEGRATE",
    headline: "Build against existing systems.",
    summary:
      "We connect into the software, phone lines, and databases your business already relies on rather than forcing replacements.",
    weHandle:
      "Develop custom connectors, fallback rules, edge shielding, and automated workflows. Rigorously test against real corner cases in staging.",
    clientProvides:
      "Provide secure API tokens or test access. Participate in a 15-minute live preview before production traffic goes live.",
    cadence: "Weeks 2–3",
  },
  {
    index: "04",
    name: "MEASURE & RUN",
    headline: "Validate the outcome and keep it reliable.",
    summary:
      "Success is evaluated strictly by time recovered, calls captured, or operational velocity gained in production.",
    weHandle:
      "Continuous health monitoring, automated error handling, adaptation to third-party tool API changes, and recurring telemetry reporting.",
    clientProvides:
      "Zero routine maintenance. Review monthly hours-saved reports and notify us if your internal operating rules evolve.",
    cadence: "Ongoing",
  },
];

export default function HowItWorksPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "How It Works", path: "/how-it-works" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />

      {/* Hero Section */}
      <EditorialHero
        eyebrow="METHODOLOGY"
        headline="How an intervention moves from constraint to production."
        supportingCopy="Disciplined engineering, zero speculative consulting. Every build follows a four-phase lifecycle designed to resolve the immediate operational bottleneck with minimal friction."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "How It Works", href: "/how-it-works" },
        ]}
        primaryAction={{
          label: "Start with a problem →",
          href: "/#start",
        }}
        secondaryAction={{
          label: "Review lifecycle phases ↓",
          href: "#phases",
        }}
      />

      {/* 4-Phase Delivery Lifecycle */}
      <section
        id="phases"
        aria-label="Engineering Lifecycle Phases"
        className="py-16 sm:py-24 border-b border-[var(--tsc-line)] font-geist bg-[var(--tsc-paper)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="max-w-3xl mb-14 space-y-3">
            <PageEyebrow>DELIVERY PHASES</PageEyebrow>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]">
              Four disciplined phases. Zero adoption friction.
            </h2>
            <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
              We eliminate the traditional agency project risk: scope is locked up front, tools are
              connected rather than replaced, and nothing goes live without client approval.
            </p>
          </div>

          <div className="divide-y divide-[var(--tsc-line)] border-y border-[var(--tsc-line)]">
            {PHASES.map((phase) => (
              <div
                key={phase.index}
                className="py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start"
              >
                {/* Phase Identification */}
                <div className="lg:col-span-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)] tracking-wider">
                      {phase.index}
                    </span>
                    <span className="font-mono text-xs text-[var(--tsc-line)]">/</span>
                    <span className="font-mono text-xs font-semibold text-[var(--tsc-ink)] tracking-wider uppercase">
                      {phase.name}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--tsc-muted)] uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] ml-auto lg:ml-0">
                      {phase.cadence}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[var(--tsc-ink)] tracking-tight">
                    {phase.headline}
                  </h3>
                  <p className="text-sm text-[var(--tsc-muted)] leading-relaxed">{phase.summary}</p>
                </div>

                {/* Comparative Breakdown: What we do vs What client provides */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* The Skill Corner Responsibility */}
                  <div className="p-6 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/40 space-y-2.5">
                    <div className="text-[11px] font-mono font-semibold tracking-wider text-[var(--tsc-muted)] uppercase">
                      WHAT THE SKILL CORNER HANDLES
                    </div>
                    <p className="text-sm text-[var(--tsc-ink)] leading-relaxed">
                      {phase.weHandle}
                    </p>
                  </div>

                  {/* Client Responsibility */}
                  <div className="p-6 rounded-[8px] border border-[var(--tsc-line)] bg-white space-y-2.5">
                    <div className="text-[11px] font-mono font-semibold tracking-wider text-[var(--tsc-muted)] uppercase">
                      WHAT YOU PROVIDE
                    </div>
                    <p className="text-sm text-[var(--tsc-ink)] leading-relaxed">
                      {phase.clientProvides}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Problem Prompt */}
      <SecondaryProblemPrompt
        eyebrow="YOUR OPERATION"
        heading="Have a bottleneck in your own business?"
        supportingCopy="Describe what is taking more time, manual attention, or coordination than it should. We will assess the root cause and advise what system could address it."
        secondaryBookingHref="/book"
        secondaryBookingLabel="Or schedule an automation audit"
      />
    </>
  );
}
