import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { DeliverableIndex } from "@/components/public/DeliverableIndex";
import { EditorialFaq } from "@/components/public/EditorialFaq";
import { EditorialHero, type MetadataItem } from "@/components/public/EditorialHero";
import { FitSection } from "@/components/public/FitSection";
import { OutcomeComparison, type OutcomeItem } from "@/components/public/OutcomeComparison";
import { PageEyebrow } from "@/components/public/PageEyebrow";
import { SecondaryProblemPrompt } from "@/components/public/SecondaryProblemPrompt";
import { digitalServices, getDigitalServiceBySlug } from "@/content/digital-services";
import { site } from "@/content/site";
import { breadcrumbJsonLd, digitalServiceJsonLd } from "@/lib/structured-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return digitalServices.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getDigitalServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: `${service.name} | ${site.name}`,
    description: service.metaDescription,
    alternates: { canonical: `/digital-services/${service.slug}` },
    openGraph: {
      title: `${service.name} | ${site.name}`,
      description: service.metaDescription,
      url: `${site.url}/digital-services/${service.slug}`,
      type: "article",
    },
  };
}

export default async function DigitalServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getDigitalServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Work", path: "/digital-services" },
    { name: service.name, path: `/digital-services/${service.slug}` },
  ]);

  const serviceSchema = digitalServiceJsonLd(service);

  // Metadata bar items (Only verified data per Amendment 6)
  const metadataItems: MetadataItem[] = [
    { label: "CAPABILITY", value: service.name },
    { label: "DELIVERY", value: "Custom Architecture & Deployment" },
  ];

  // Derive outcome comparisons from features
  const outcomeItems: OutcomeItem[] = service.features.map((feature, idx) => {
    const fallbackBefore = [
      "Fragmented tools, manual inputs, and inconsistent execution across team members.",
      "Off-the-shelf software requiring team members to adjust their workflow to vendor limits.",
      "Data silos and lack of visibility into system bottlenecks or conversion drops.",
      "Periodic fire-fighting and manual maintenance cycles consuming leadership attention.",
    ];
    return {
      before: fallbackBefore[idx % fallbackBefore.length],
      after: `${feature.title}: ${feature.description}`,
    };
  });

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={serviceSchema} />

      {/* Hero Section */}
      <EditorialHero
        eyebrow="SERVICE SPECIFICATION"
        headline={service.name}
        supportingCopy={`${service.tagline} ${service.description}`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Work", href: "/digital-services" },
          { label: service.name, href: `/digital-services/${service.slug}` },
        ]}
        metadata={metadataItems}
        primaryAction={{
          label: "Start with a problem →",
          href: "/#start",
        }}
        secondaryAction={{
          label: "View deliverables ↓",
          href: "#deliverables",
        }}
      />

      {/* Section B: The Problem */}
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
                Where standard operations break down.
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-5 text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
              {service.overviewText.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="text-[var(--tsc-ink)]">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section C: What Changes */}
      <OutcomeComparison
        eyebrow="WHAT CHANGES"
        title={`How ${service.name.toLowerCase()} alters day-to-day operations.`}
        items={outcomeItems}
      />

      {/* Section D: System / Approach */}
      <section
        aria-labelledby="process-heading"
        className="py-14 sm:py-20 border-b border-[var(--tsc-line)] font-geist bg-[var(--tsc-paper)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="max-w-3xl mb-12 space-y-3">
            <PageEyebrow>SYSTEM &amp; APPROACH</PageEyebrow>
            <h2
              id="process-heading"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]"
            >
              How we execute the build.
            </h2>
            <p className="text-sm text-[var(--tsc-muted)] leading-relaxed">
              A structured four-phase engineering methodology focused on stability and clean
              handoffs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.process.map((step) => {
              const num = String(step.stepNumber).padStart(2, "0");
              return (
                <div
                  key={step.title}
                  className="p-6 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/40 space-y-3"
                >
                  <div className="font-mono text-xs font-semibold text-[var(--tsc-muted)] tracking-wider">
                    {num}
                  </div>
                  <h3 className="font-semibold text-base text-[var(--tsc-ink)]">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section E: Deliverables */}
      <div id="deliverables">
        <DeliverableIndex
          eyebrow="DELIVERABLES"
          title={`What you receive from ${service.name.toLowerCase()}.`}
          items={service.deliverables}
        />
      </div>

      {/* Section F: Fit Assessment */}
      <FitSection
        eyebrow="FIT ASSESSMENT"
        title="Determining if this is the right intervention."
        goodFitItems={service.whoItIsFor}
      />

      {/* Section G: FAQ */}
      <EditorialFaq
        eyebrow="TECHNICAL NOTES &amp; FAQ"
        title={`Questions about ${service.name.toLowerCase()}.`}
        items={service.faq}
      />

      {/* Section H: Next Step */}
      <SecondaryProblemPrompt
        eyebrow="NEXT STEP"
        heading={`Have a challenge requiring ${service.name.toLowerCase()}?`}
        supportingCopy="Describe your current system or constraint. We will review whether this capability solves the root cause."
        secondaryBookingHref="/book"
        secondaryBookingLabel="Or book an engineering audit"
      />
    </>
  );
}
