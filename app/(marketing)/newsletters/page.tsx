import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { EditorialHero } from "@/components/public/EditorialHero";
import { PageEyebrow } from "@/components/public/PageEyebrow";
import { SecondaryProblemPrompt } from "@/components/public/SecondaryProblemPrompt";
import { getAllNewsletters } from "@/features/newsletters/data/newsletters";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Briefings & Field Notes | The Skill Corner",
  description:
    "Recurring, opinionated summaries for subjects where keeping up should not require watching everything.",
  alternates: { canonical: "/newsletters" },
  openGraph: {
    title: "Briefings & Field Notes | The Skill Corner",
    description:
      "Signal, without the feed. Actionable AI engineering shifts, regional asset radars, and public tenders.",
    url: "https://theskillcorner.com/newsletters",
  },
};

export default function NewslettersHubPage() {
  const newsletters = getAllNewsletters();

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Briefings", path: "/newsletters" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />

      {/* Hero Section */}
      <EditorialHero
        eyebrow="BRIEFINGS"
        headline="Signal, without the feed."
        supportingCopy="Recurring, opinionated summaries for subjects where keeping up should not require watching everything."
        primaryAction={{
          label: "Start with a problem →",
          href: "/#start",
        }}
        secondaryAction={{
          label: "Browse publications ↓",
          href: "#briefings",
        }}
      />

      {/* Briefings Publication Index */}
      <section
        id="briefings"
        aria-label="Active Publications"
        className="py-16 sm:py-24 border-b border-[var(--tsc-line)] font-geist bg-[var(--tsc-paper)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="max-w-3xl mb-12 space-y-3">
            <PageEyebrow>CURRENT PUBLICATIONS</PageEyebrow>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]">
              Authored briefings &amp; monitored radars.
            </h2>
            <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
              Curated by senior engineers and operational researchers with zero sensationalism.
            </p>
          </div>

          <div className="divide-y divide-[var(--tsc-line)] border-y border-[var(--tsc-line)]">
            {newsletters.map((newsletter, index) => {
              const num = String(index + 1).padStart(2, "0");
              return (
                <article
                  key={newsletter.id}
                  className="py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start"
                >
                  {/* Left Column: Number & Title */}
                  <div className="lg:col-span-5 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-semibold text-[var(--tsc-muted)] tracking-wider">
                        {num}
                      </span>
                      <span className="font-mono text-xs text-[var(--tsc-line)]">/</span>
                      <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)] tracking-wider uppercase">
                        {newsletter.cadence ? `${newsletter.cadence} publication` : "BRIEFING"}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-[var(--tsc-ink)] tracking-tight">
                      <Link
                        href={`/newsletters/${newsletter.slug}`}
                        className="hover:text-[var(--tsc-action)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tsc-action)]"
                      >
                        {newsletter.name}
                      </Link>
                    </h3>

                    {newsletter.tagline && (
                      <p className="text-xs sm:text-sm font-mono text-[var(--tsc-muted)]">
                        {newsletter.tagline}
                      </p>
                    )}
                  </div>

                  {/* Middle Column: Metadata & Description */}
                  <div className="lg:col-span-5 space-y-4 text-sm text-[var(--tsc-muted)]">
                    <p className="leading-relaxed text-[var(--tsc-ink)]">
                      {newsletter.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-[var(--tsc-line)] text-xs">
                      {newsletter.topic && (
                        <div>
                          <span className="font-mono uppercase text-[var(--tsc-muted)] block text-[10px] tracking-wider">
                            TOPIC
                          </span>
                          <span className="text-[var(--tsc-ink)] font-medium">
                            {newsletter.topic}
                          </span>
                        </div>
                      )}

                      {newsletter.audience && (
                        <div>
                          <span className="font-mono uppercase text-[var(--tsc-muted)] block text-[10px] tracking-wider">
                            FOR
                          </span>
                          <span className="text-[var(--tsc-ink)] font-medium">
                            {newsletter.audience}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Action */}
                  <div className="lg:col-span-2 pt-2 lg:pt-0 lg:text-right">
                    <Link
                      href={`/newsletters/${newsletter.slug}`}
                      className="inline-flex items-center gap-2 font-mono text-xs font-medium text-[var(--tsc-ink)] hover:text-[var(--tsc-action)] transition-colors underline underline-offset-4"
                    >
                      <span>View briefing</span>
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing Problem Prompt */}
      <SecondaryProblemPrompt
        eyebrow="CUSTOM RADAR"
        heading="Need an automated monitor for your own industry?"
        supportingCopy="If your team tracks procurement tenders, municipal filings, or sector developments manually, describe what you monitor and we will assess whether an automated intelligence pipeline makes sense."
      />
    </>
  );
}
