import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { EditorialFaq } from "@/components/public/EditorialFaq";
import { EditorialHero, type MetadataItem } from "@/components/public/EditorialHero";
import { PageEyebrow } from "@/components/public/PageEyebrow";
import { SecondaryProblemPrompt } from "@/components/public/SecondaryProblemPrompt";
import { SetSegment } from "@/components/SetSegment";
import { industries, industryBySlug } from "@/content/industries";
import { pricing } from "@/content/site";
import { breadcrumbJsonLd, industryServiceJsonLd } from "@/lib/structured-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = industryBySlug(slug);
  if (!industry) return {};
  return {
    title: `AI Automation & Systems for ${industry.name} | The Skill Corner`,
    description: industry.metaDescription,
    alternates: { canonical: `/industries/${industry.slug}` },
    openGraph: {
      title: `AI Automation & Systems for ${industry.name} | The Skill Corner`,
      description: industry.metaDescription,
      url: `https://theskillcorner.com/industries/${industry.slug}`,
      type: "article",
    },
  };
}

export default async function IndustryPage({ params }: PageProps) {
  const { slug } = await params;
  const industry = industryBySlug(slug);
  if (!industry) notFound();

  const segmentPricing = pricing[industry.segment];
  const metadataItems: MetadataItem[] = [
    { label: "SECTOR", value: industry.name },
    {
      label: "FOCUS",
      value: industry.segment === "local" ? "Commercial Operations" : "Professional Practice",
    },
  ];

  if (segmentPricing?.anchor) {
    metadataItems.push({ label: "ENGAGEMENT", value: segmentPricing.anchor });
  }

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: industry.name, path: `/industries/${industry.slug}` },
  ]);

  return (
    <>
      <JsonLd data={industryServiceJsonLd(industry)} />
      <JsonLd data={breadcrumbs} />
      <SetSegment segment={industry.segment} />

      {/* Section A: Industry-Specific Headline */}
      <EditorialHero
        eyebrow={`INDUSTRY / ${industry.name.toUpperCase()}`}
        headline={industry.headline}
        supportingCopy={industry.subhead}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Industries", href: "/industries" },
          { label: industry.name, href: `/industries/${industry.slug}` },
        ]}
        metadata={metadataItems}
        primaryAction={{
          label: "Start with a problem →",
          href: "/#start",
        }}
        secondaryAction={{
          label: "View operational scenarios ↓",
          href: "#operational-scenarios",
        }}
      />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-16 py-14 sm:py-20 font-geist">
        <div className="max-w-4xl space-y-20">
          {/* Section B: The Recurring Week */}
          <section aria-labelledby="recurring-week-heading" className="space-y-6">
            <div className="space-y-2">
              <PageEyebrow>01 / THE RECURRING WEEK</PageEyebrow>
              <h2
                id="recurring-week-heading"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]"
              >
                Where time disappears in a typical week.
              </h2>
              <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
                The administrative and coordination friction we repeatedly observe in{" "}
                {industry.name.toLowerCase()}:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {industry.pains.map((pain) => (
                <div
                  key={pain.title}
                  className="p-6 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/30 space-y-2.5"
                >
                  <h3 className="font-semibold text-base text-[var(--tsc-ink)]">{pain.title}</h3>
                  <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                    {pain.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section C: Where Systems Help */}
          <section
            id="operational-scenarios"
            aria-labelledby="systems-help-heading"
            className="pt-16 border-t border-[var(--tsc-line)] space-y-6"
          >
            <div className="space-y-2">
              <PageEyebrow>02 / WHERE SYSTEMS HELP</PageEyebrow>
              <h2
                id="systems-help-heading"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]"
              >
                Targeted automations and workflows.
              </h2>
              <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
                Concrete interventions built to remove repetitive execution:
              </p>
            </div>

            <div className="divide-y divide-[var(--tsc-line)] border-y border-[var(--tsc-line)]">
              {industry.automations.map((automation) => (
                <div
                  key={automation.title}
                  className="py-6 sm:py-7 flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <h3 className="font-semibold text-base sm:text-lg text-[var(--tsc-ink)]">
                      {automation.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                      {automation.body}
                    </p>
                  </div>

                  {/* Metric: source-only with exact framing per Amendment 7 */}
                  {automation.metric && (
                    <div className="pt-1 md:pt-0 md:text-right shrink-0">
                      <span className="font-mono text-[10px] uppercase text-[var(--tsc-muted)] block tracking-wider">
                        TYPICAL IMPACT
                      </span>
                      <span className="font-mono text-xs sm:text-sm font-semibold text-[var(--tsc-action)]">
                        {automation.metric}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Section D: Illustrative Scenario */}
          <section
            aria-labelledby="scenario-heading"
            className="pt-16 border-t border-[var(--tsc-line)] space-y-6"
          >
            <div className="space-y-2">
              <PageEyebrow>03 / ILLUSTRATIVE SCENARIO</PageEyebrow>
              <h2
                id="scenario-heading"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]"
              >
                Walkthrough: {industry.build.business}
              </h2>
              <p className="text-xs sm:text-sm font-mono text-[var(--tsc-muted)]">
                Illustrative scenario demonstrating how this build typically coordinates operations.
              </p>
            </div>

            <div className="p-7 sm:p-8 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/40 space-y-6">
              <div className="space-y-2">
                <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)] uppercase tracking-wider block">
                  THE CONSTRAINT
                </span>
                <p className="text-sm sm:text-base text-[var(--tsc-ink)] leading-relaxed">
                  {industry.build.problem}
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-[var(--tsc-line)]">
                <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)] uppercase tracking-wider block">
                  THE SYSTEM BUILD
                </span>
                <p className="text-sm sm:text-base text-[var(--tsc-ink)] leading-relaxed">
                  {industry.build.automation}
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-[var(--tsc-line)]">
                <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)] uppercase tracking-wider block">
                  ANTICIPATED OUTCOME
                </span>
                <p className="text-base sm:text-lg font-semibold text-[var(--tsc-ink)] leading-relaxed">
                  {industry.build.result}
                </p>
              </div>
            </div>
          </section>

          {/* Section E: What We Would Start With */}
          <section
            aria-labelledby="start-with-heading"
            className="pt-16 border-t border-[var(--tsc-line)] space-y-4"
          >
            <div className="space-y-1">
              <PageEyebrow>04 / PRIORITIZATION</PageEyebrow>
              <h2
                id="start-with-heading"
                className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]"
              >
                What we recommend starting with.
              </h2>
            </div>
            <div className="p-6 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-paper)] space-y-2">
              <p className="text-sm sm:text-base text-[var(--tsc-ink)] leading-relaxed">
                Rather than deploying multiple automations simultaneously, we prioritize the single
                highest-frequency constraint—typically{" "}
                <span className="font-semibold">
                  {industry.automations[0]?.title?.toLowerCase() || "inbound coordination"}
                </span>
                . Once that workflow operates reliably in production, secondary tools can be
                connected.
              </p>
            </div>
          </section>

          {/* Section F: Fit / Constraints (Source-only per Amendment 9) */}
          {segmentPricing?.compliance && (
            <section
              aria-labelledby="compliance-heading"
              className="pt-16 border-t border-[var(--tsc-line)] space-y-3"
            >
              <PageEyebrow>05 / OPERATIONAL CONSTRAINTS</PageEyebrow>
              <h2
                id="compliance-heading"
                className="text-lg sm:text-xl font-bold text-[var(--tsc-ink)]"
              >
                Compliance &amp; Data Safeguards
              </h2>
              <div className="p-6 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/30 text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                {segmentPricing.compliance}
              </div>
            </section>
          )}

          {/* FAQ */}
          {industry.faq && industry.faq.length > 0 && (
            <div className="pt-8 border-t border-[var(--tsc-line)]">
              <EditorialFaq
                eyebrow="SECTOR FAQ"
                title={`Questions ${industry.name.toLowerCase()} ask us.`}
                items={industry.faq}
              />
            </div>
          )}
        </div>
      </div>

      {/* Section G: Next Step */}
      <SecondaryProblemPrompt
        eyebrow="NEXT STEP"
        heading={`Operating a ${industry.name.toLowerCase().replace(/s$/, "")} business?`}
        supportingCopy="Describe where your team spends the most repetitive manual attention. We will assess whether an automation or workflow integration can resolve it."
        secondaryBookingHref="/book"
        secondaryBookingLabel="Or schedule an automation audit"
      />
    </>
  );
}
