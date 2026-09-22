import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { DeliverableIndex } from "@/components/public/DeliverableIndex";
import { EditorialFaq } from "@/components/public/EditorialFaq";
import { EditorialHero, type MetadataItem } from "@/components/public/EditorialHero";
import { FitSection } from "@/components/public/FitSection";
import { OutcomeComparison, type OutcomeItem } from "@/components/public/OutcomeComparison";
import { PageEyebrow } from "@/components/public/PageEyebrow";
import { SecondaryProblemPrompt } from "@/components/public/SecondaryProblemPrompt";
import { industryBySlug } from "@/content/industries";
import { serviceBySlug, services } from "@/content/services";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/structured-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) return {};
  return {
    title: `${service.name} — ${service.title} | The Skill Corner`,
    description: service.excerpt,
    alternates: { canonical: `/what-we-automate/${service.slug}` },
    openGraph: {
      title: `${service.name} — ${service.title} | The Skill Corner`,
      description: service.excerpt,
      url: `https://theskillcorner.com/what-we-automate/${service.slug}`,
      type: "article",
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) notFound();

  const relatedIndustries = service.relatedIndustries
    .map((slug) => industryBySlug(slug))
    .filter((ind): ind is NonNullable<typeof ind> => Boolean(ind));

  const metadataItems: MetadataItem[] = [
    { label: "DELIVERY", value: service.timeline },
    { label: "CONNECTED TOOLS", value: service.tools.join(" · ") },
  ];

  const outcomeItems: OutcomeItem[] = [
    {
      before: service.problem,
      after: service.outcome,
    },
  ];

  const goodFitIndustries = relatedIndustries.map((ind) => `${ind.name}: ${ind.cardLine}`);

  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Automation Index", path: "/what-we-automate" },
          { name: service.name, path: `/what-we-automate/${service.slug}` },
        ])}
      />

      {/* Hero Section */}
      <EditorialHero
        eyebrow="AUTOMATION SPECIFICATION"
        headline={service.name}
        supportingCopy={`${service.title}. ${service.excerpt}`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Automation Index", href: "/what-we-automate" },
          { label: service.name, href: `/what-we-automate/${service.slug}` },
        ]}
        metadata={metadataItems}
        primaryAction={{
          label: "Start with a problem →",
          href: "/#start",
        }}
        secondaryAction={{
          label: "View build specification ↓",
          href: "#specification",
        }}
      />

      {/* The Problem */}
      <section
        aria-labelledby="problem-heading"
        className="py-14 sm:py-20 border-b border-[var(--tsc-line)] font-geist bg-[var(--tsc-paper)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-5 space-y-3">
              <PageEyebrow>THE PROBLEM</PageEyebrow>
              <h2
                id="problem-heading"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]"
              >
                The operational bottleneck.
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-base sm:text-lg text-[var(--tsc-ink)] leading-relaxed">
                {service.problem}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Outcome Comparison */}
      <OutcomeComparison
        eyebrow="WHAT CHANGES"
        title="Material change in your daily operation."
        items={outcomeItems}
      />

      {/* System / Architecture */}
      <section
        id="specification"
        aria-labelledby="architecture-heading"
        className="py-14 sm:py-20 border-b border-[var(--tsc-line)] font-geist bg-[var(--tsc-paper)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="max-w-3xl mb-12 space-y-3">
            <PageEyebrow>SYSTEM ARCHITECTURE</PageEyebrow>
            <h2
              id="architecture-heading"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]"
            >
              How the automation connects.
            </h2>
            <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
              Every build integrates directly into your existing communication channels and booking
              systems with zero workflow disruption.
            </p>
          </div>

          {/* Workflow Diagram */}
          <div className="p-6 sm:p-8 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/40 mb-12">
            <div className="text-[11px] font-mono tracking-wider text-[var(--tsc-muted)] uppercase mb-6">
              FLOW PIPELINE
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-[6px] bg-[var(--tsc-paper)] border border-[var(--tsc-line)] space-y-1">
                <span className="font-mono text-[10px] text-[var(--tsc-muted)] uppercase tracking-wider block">
                  01 · INTAKE
                </span>
                <span className="font-semibold text-sm text-[var(--tsc-ink)] block">
                  Inbound Trigger
                </span>
                <span className="text-xs text-[var(--tsc-muted)] block">
                  Customer message, call, or form submission
                </span>
              </div>

              <div className="p-4 rounded-[6px] bg-[var(--tsc-paper)] border border-[var(--tsc-line)] space-y-1">
                <span className="font-mono text-[10px] text-[var(--tsc-muted)] uppercase tracking-wider block">
                  02 · LOGIC
                </span>
                <span className="font-semibold text-sm text-[var(--tsc-ink)] block">
                  Reasoning &amp; Rules
                </span>
                <span className="text-xs text-[var(--tsc-muted)] block">
                  Filter, validate, and extract structured intent
                </span>
              </div>

              <div className="p-4 rounded-[6px] bg-[var(--tsc-paper)] border border-[var(--tsc-line)] space-y-1">
                <span className="font-mono text-[10px] text-[var(--tsc-muted)] uppercase tracking-wider block">
                  03 · INTEGRATION
                </span>
                <span className="font-semibold text-sm text-[var(--tsc-ink)] block">
                  Connected Tools
                </span>
                <span className="text-xs text-[var(--tsc-muted)] block">
                  {service.tools.slice(0, 2).join(" · ")}
                </span>
              </div>

              <div className="p-4 rounded-[6px] bg-[var(--tsc-paper)] border border-[var(--tsc-line)] space-y-1">
                <span className="font-mono text-[10px] text-[var(--tsc-muted)] uppercase tracking-wider block">
                  04 · OUTPUT
                </span>
                <span className="font-semibold text-sm text-[var(--tsc-ink)] block">
                  Clean Resolution
                </span>
                <span className="text-xs text-[var(--tsc-muted)] block">
                  Slot booked, document filed, or human notified
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables / What We Build */}
      <DeliverableIndex
        eyebrow="DELIVERABLES"
        title="What we build and deploy."
        items={service.whatWeBuild}
      />

      {/* Fit Assessment */}
      <FitSection
        eyebrow="FIT ASSESSMENT"
        title="Where this build is most effective."
        goodFitItems={
          goodFitIndustries.length > 0
            ? goodFitIndustries
            : [
                "Organizations with high inbound call or inquiry volume.",
                "Teams losing 5 to 15 hours weekly to repetitive scheduling or follow-up.",
                "Businesses with established software tools that lack automated coordination.",
              ]
        }
      />

      {/* Related Industries Link Block */}
      {relatedIndustries.length > 0 && (
        <section className="py-12 border-b border-[var(--tsc-line)] font-geist bg-[var(--tsc-paper)]">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
            <div className="text-[11px] font-mono tracking-wider text-[var(--tsc-muted)] uppercase mb-4">
              COMMON SECTOR APPLICATIONS
            </div>
            <div className="flex flex-wrap gap-3">
              {relatedIndustries.map((ind) => (
                <Link
                  key={ind.slug}
                  href={`/industries/${ind.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-[4px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/50 text-[var(--tsc-ink)] hover:border-[var(--tsc-ink)]/40 hover:bg-[var(--tsc-surface)] transition-colors"
                >
                  <span>{ind.name}</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <EditorialFaq
        eyebrow="TECHNICAL NOTES &amp; FAQ"
        title={`Questions about ${service.name.toLowerCase()}.`}
        items={service.faq}
      />

      {/* Next Step */}
      <SecondaryProblemPrompt
        eyebrow="NEXT STEP"
        heading={`Have this problem in your own operation?`}
        supportingCopy="Describe what is taking more time, manual attention, or coordination than it should. We will determine if this automation is the right fit."
        secondaryBookingHref="/book"
        secondaryBookingLabel="Or schedule an automation audit"
      />
    </>
  );
}
