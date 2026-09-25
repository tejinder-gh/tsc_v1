import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { DeliverableIndex } from "@/components/public/DeliverableIndex";
import { EditorialFaq } from "@/components/public/EditorialFaq";
import { EditorialHero, type MetadataItem } from "@/components/public/EditorialHero";
import { FitSection } from "@/components/public/FitSection";
import { SecondaryProblemPrompt } from "@/components/public/SecondaryProblemPrompt";
import { ServiceArchitectureSchematic } from "@/components/services/ServiceArchitectureSchematic";
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
    { name: "Digital Services", path: "/digital-services" },
    { name: service.name, path: `/digital-services/${service.slug}` },
  ]);

  const serviceSchema = digitalServiceJsonLd(service);

  const metadataItems: MetadataItem[] = [
    { label: "PILLAR", value: service.categoryLabel },
    { label: "GUARANTEE", value: service.primaryMetric },
    { label: "DELIVERY", value: "Production Deployment" },
    { label: "OWNERSHIP", value: "100% Client Source Code" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={serviceSchema} />

      {/* Hero Section */}
      <EditorialHero
        eyebrow="CAPABILITY SPECIFICATION"
        headline={service.name}
        supportingCopy={`${service.tagline} ${service.description}`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Digital Services", href: "/digital-services" },
          { label: service.name, href: `/digital-services/${service.slug}` },
        ]}
        metadata={metadataItems}
        primaryAction={{
          label: "Start with a problem →",
          href: "/#start",
        }}
        secondaryAction={{
          label: "Inspect architecture ↓",
          href: "#architecture",
        }}
      />

      {/* Section 01: The Bottleneck */}
      <section
        aria-labelledby="problem-heading"
        className="py-16 sm:py-24 border-b border-[var(--tsc-line)] font-geist bg-[var(--tsc-paper)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-5 space-y-3 lg:sticky lg:top-28 lg:self-start">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)] tracking-wider">
                  01
                </span>
                <span className="font-mono text-xs text-[var(--tsc-line)]">/</span>
                <span className="font-mono text-xs font-semibold text-[var(--tsc-ink)] tracking-wider uppercase">
                  THE OPERATIONAL BOTTLENECK
                </span>
              </div>
              <h2
                id="problem-heading"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]"
              >
                Where standard workflows break down.
              </h2>
              <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                Why off-the-shelf tools and manual administrative burden constrain performance.
              </p>
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

      {/* Section 02: Deep System Architecture Diagram & Event Flow */}
      <section
        id="architecture"
        aria-label="System Architecture Pipeline"
        className="py-16 sm:py-24 border-b border-[var(--tsc-line)] font-geist bg-[var(--tsc-paper)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16 space-y-6">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)] tracking-wider">
                02
              </span>
              <span className="font-mono text-xs text-[var(--tsc-line)]">/</span>
              <span className="font-mono text-xs font-semibold text-[var(--tsc-ink)] tracking-wider uppercase">
                ENGINEERED PIPELINE SCHEMATIC
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]">
              Architecture &amp; execution flow.
            </h2>
            <p className="text-sm text-[var(--tsc-muted)] leading-relaxed">
              Every system is engineered as an event-driven state machine with strict exception
              isolation and human escalation fallback.
            </p>
          </div>

          <ServiceArchitectureSchematic
            serviceName={service.name}
            primaryMetric={service.primaryMetric}
            techStack={service.techStack}
            flow={service.architectureFlow}
          />
        </div>
      </section>

      {/* Section 03: Core Capabilities & Tool Integrations */}
      <section
        aria-labelledby="capabilities-heading"
        className="py-16 sm:py-24 border-b border-[var(--tsc-line)] font-geist bg-[var(--tsc-paper)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            {/* Left Column: Eyebrow & Title */}
            <div className="lg:col-span-5 space-y-3 lg:sticky lg:top-28 lg:self-start">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)] tracking-wider">
                  03
                </span>
                <span className="font-mono text-xs text-[var(--tsc-line)]">/</span>
                <span className="font-mono text-xs font-semibold text-[var(--tsc-ink)] tracking-wider uppercase">
                  SYSTEM SPECIFICATIONS
                </span>
              </div>
              <h2
                id="capabilities-heading"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]"
              >
                Core technical capabilities.
              </h2>
              <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                Functional components, API tool executions, and security guardrails included in this
                service.
              </p>
            </div>

            {/* Right Column: Dense Editorial Index */}
            <div className="lg:col-span-7">
              <div className="divide-y divide-[var(--tsc-line)] border-y border-[var(--tsc-line)]">
                {service.features.map((feature, idx) => {
                  const num = String(idx + 1).padStart(2, "0");
                  return (
                    <div key={feature.title} className="py-7 sm:py-8 space-y-2">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)] tracking-wider">
                          {num}
                        </span>
                        <h3 className="font-semibold text-base sm:text-lg text-[var(--tsc-ink)]">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="pl-7 text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 04: System / Approach */}
      <section
        aria-labelledby="process-heading"
        className="py-16 sm:py-24 border-b border-[var(--tsc-line)] font-geist bg-[var(--tsc-paper)]"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
          <div className="max-w-3xl mb-12 space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)] tracking-wider">
                04
              </span>
              <span className="font-mono text-xs text-[var(--tsc-line)]">/</span>
              <span className="font-mono text-xs font-semibold text-[var(--tsc-ink)] tracking-wider uppercase">
                ENGINEERING EXECUTION
              </span>
            </div>
            <h2
              id="process-heading"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]"
            >
              How we execute the build.
            </h2>
            <p className="text-sm text-[var(--tsc-muted)] leading-relaxed">
              A structured four-phase engineering methodology focused on stability, automated
              testing, and clean client handoffs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.process.map((step) => {
              const num = String(step.stepNumber).padStart(2, "0");
              return (
                <div
                  key={step.title}
                  className="p-6 rounded-[10px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/40 space-y-3 shadow-xs"
                >
                  <div className="font-mono text-xs font-semibold text-[var(--tsc-action)] tracking-wider">
                    PHASE {num}
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

      {/* Section 05: Deliverables */}
      <div id="deliverables">
        <DeliverableIndex
          eyebrow="05 / CONCRETE DELIVERABLES"
          title={`What you receive from ${service.name.toLowerCase()}.`}
          items={service.deliverables}
        />
      </div>

      {/* Section 06: Fit Assessment */}
      <FitSection
        eyebrow="06 / FIT ASSESSMENT"
        title="Determining if this is the right intervention."
        goodFitItems={service.whoItIsFor}
      />

      {/* Section 07: FAQ */}
      <EditorialFaq
        eyebrow="07 / TECHNICAL NOTES &amp; FAQ"
        title={`Questions about ${service.name.toLowerCase()}.`}
        items={service.faq}
      />

      {/* Section 08: Next Step */}
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
