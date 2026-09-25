import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { EditorialHero } from "@/components/public/EditorialHero";
import { PageEyebrow } from "@/components/public/PageEyebrow";
import { SecondaryProblemPrompt } from "@/components/public/SecondaryProblemPrompt";
import { about } from "@/content/about";
import { site } from "@/content/site";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "About Us | The Skill Corner",
  description:
    "The Skill Corner is built around a simple idea: skilled people should spend less of their attention moving information, repeating routine decisions, and compensating for disconnected systems.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us | The Skill Corner",
    description:
      "Practical technology, applied to real work. Founder story, operating principles, and engineering point of view.",
    url: "https://www.theskillcorner.com/about",
  },
};

export default function AboutPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />

      {/* Hero Section */}
      <EditorialHero
        eyebrow="ABOUT"
        headline="Practical technology, applied to real work."
        supportingCopy="The Skill Corner is built around a simple idea: skilled people should spend less of their attention moving information, repeating routine decisions, and compensating for disconnected systems."
        primaryAction={{
          label: "Start with a problem →",
          href: "/#start",
        }}
        secondaryAction={{
          label: "View our capabilities",
          href: "/digital-services",
        }}
      />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-16 py-16 sm:py-24 font-geist">
        <div className="space-y-20">
          {/* Section A: Why This Exists */}
          <section
            aria-labelledby="why-exists-heading"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start"
          >
            <div className="lg:col-span-4 space-y-2 lg:sticky lg:top-28 lg:self-start">
              <PageEyebrow>01 / WHY THIS EXISTS</PageEyebrow>
              <h2
                id="why-exists-heading"
                className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]"
              >
                The administrative bottleneck.
              </h2>
            </div>
            <div className="lg:col-span-8 space-y-5 text-base sm:text-lg text-[var(--tsc-muted)] leading-relaxed">
              <p className="text-[var(--tsc-ink)] font-medium">{about.story[0]}</p>
              <p>{about.story[1]}</p>
            </div>
          </section>

          {/* Section B: Point of View */}
          <section
            aria-labelledby="pov-heading"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start pt-16 border-t border-[var(--tsc-line)]"
          >
            <div className="lg:col-span-4 space-y-2 lg:sticky lg:top-28 lg:self-start">
              <PageEyebrow>02 / POINT OF VIEW</PageEyebrow>
              <h2
                id="pov-heading"
                className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]"
              >
                Boring technology that works.
              </h2>
            </div>
            <div className="lg:col-span-8 space-y-5 text-base sm:text-lg text-[var(--tsc-muted)] leading-relaxed">
              <p className="text-[var(--tsc-ink)]">{about.story[2]}</p>
            </div>
          </section>

          {/* Section C: Operating Principles */}
          <section
            aria-labelledby="principles-heading"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start pt-16 border-t border-[var(--tsc-line)]"
          >
            <div className="lg:col-span-4 space-y-2 lg:sticky lg:top-28 lg:self-start">
              <PageEyebrow>03 / HOW WE WORK</PageEyebrow>
              <h2
                id="principles-heading"
                className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]"
              >
                Engineering principles.
              </h2>
              <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                Rules governing every system design, integration, and deployment.
              </p>
            </div>
            <div className="lg:col-span-8">
              <div className="divide-y divide-[var(--tsc-line)] border-y border-[var(--tsc-line)]">
                {about.credibility.map((principle, index) => {
                  const num = String(index + 1).padStart(2, "0");
                  return (
                    <div key={principle} className="py-5 flex items-start gap-5 sm:gap-6">
                      <span className="font-mono text-sm sm:text-base font-semibold text-[var(--tsc-muted)] tracking-wider">
                        {num}
                      </span>
                      <span className="text-sm sm:text-base font-medium text-[var(--tsc-ink)] leading-relaxed">
                        {principle}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Section D: Founder Profile */}
          <section
            aria-labelledby="founder-heading"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start pt-16 border-t border-[var(--tsc-line)]"
          >
            <div className="lg:col-span-4 space-y-2 lg:sticky lg:top-28 lg:self-start">
              <PageEyebrow>04 / LEADERSHIP</PageEyebrow>
              <h2
                id="founder-heading"
                className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]"
              >
                Founder &amp; Engineering.
              </h2>
            </div>
            <div className="lg:col-span-8 space-y-4">
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold text-[var(--tsc-ink)]">
                  {about.founder.name}
                </div>
                <div className="font-mono text-xs uppercase tracking-wider text-[var(--tsc-muted)]">
                  {about.founder.title} · {site.name}
                </div>
              </div>
              <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
                Senior software engineer with over fifteen years building production software
                platforms, integrations, and automation systems. Leads system architecture,
                integration design, and client implementations directly.
              </p>
            </div>
          </section>

          {/* Section E: What We Work On (Compact link into Work, NO taxonomy dump) */}
          <section
            aria-labelledby="work-link-heading"
            className="pt-16 border-t border-[var(--tsc-line)]"
          >
            <div className="p-8 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1 max-w-xl">
                <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)] uppercase tracking-wider">
                  05 / CAPABILITIES
                </span>
                <h3 id="work-link-heading" className="text-lg font-bold text-[var(--tsc-ink)]">
                  Explore the Work capability index.
                </h3>
                <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                  Review systems across Automate, Build, Grow, and Operate organized for operational
                  bottlenecks.
                </p>
              </div>

              <Link
                href="/digital-services"
                className="inline-flex items-center gap-2 font-mono text-xs font-medium text-[var(--tsc-ink)] hover:text-[var(--tsc-action)] transition-colors underline underline-offset-4 self-start sm:self-auto shrink-0"
              >
                <span>Browse Work index</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Section F: Open Problem Prompt */}
      <SecondaryProblemPrompt
        eyebrow="06 / YOUR TURN"
        heading="Have a bottleneck in your own business?"
        supportingCopy="Describe what is taking more time, manual attention, or coordination than it should. We will assess the root cause and advise what system could address it."
      />
    </>
  );
}
