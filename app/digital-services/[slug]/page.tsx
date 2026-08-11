/**
 * What: Dynamic detail page for each digital service (AI Agent Development, Website Development,
 *       Digital Marketing & GEO, Dedicated Staffing, Process Documentation & SOPs, etc.).
 * Why: Text-heavy, keyword-dense canonical landing pages designed for top-band Google Search rankings
 *      and Generative Engine Optimization (GEO/AIO) retrieval by ChatGPT, Claude, Perplexity, and Gemini.
 * How: Next.js App Router server component consuming content/digital-services.ts with full static params.
 * From Where: Updated 2026-08 for client request.
 * When: 2026-08.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AbstractVisual } from "@/components/AbstractVisual";
import { CtaLink } from "@/components/CtaLink";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { JsonLd } from "@/components/JsonLd";
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
    title: `${service.name} Services | ${site.name}`,
    description: service.metaDescription,
    alternates: { canonical: `/digital-services/${service.slug}` },
    openGraph: {
      title: `${service.name} Services | ${site.name}`,
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

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={serviceSchema} />

      {/* Breadcrumb Bar */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-site px-4 pt-6 text-sm text-navy-600 sm:px-6"
      >
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:underline hover:text-navy-900">
              Home
            </Link>
          </li>
          <li aria-hidden="true">&rarr;</li>
          <li>
            <Link href="/digital-services" className="hover:underline hover:text-navy-900">
              Digital Services
            </Link>
          </li>
          <li aria-hidden="true">&rarr;</li>
          <li className="font-semibold text-navy-900">{service.name}</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-site px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
              Digital Service Offering
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl text-navy-900">
              {service.name}
            </h1>
            <p className="mt-3 text-xl font-semibold text-blue-600">{service.tagline}</p>
            <p className="mt-4 text-lg leading-relaxed text-navy-800">{service.description}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <CtaLink href="/book" location={`digital_service_${service.slug}_hero`}>
                Book a free audit
              </CtaLink>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-control border-2 border-navy-700 bg-white px-6 py-3 font-display text-base font-semibold text-navy-700 hover:bg-mist"
              >
                Request a quote
              </Link>
            </div>
          </div>

          <div className="hidden lg:block h-full">
            <AbstractVisual variant="services" />
          </div>
        </div>
      </section>

      {/* Highlights Bar */}
      <section className="border-y border-navy/10 bg-mist/60 py-8">
        <div className="mx-auto max-w-site px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {service.bullets.map((bullet) => (
              <div
                key={bullet}
                className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm"
              >
                <span className="text-blue-500 font-bold text-lg">&check;</span>
                <span className="text-sm font-medium text-navy-900 leading-snug">{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comprehensive Overview */}
      <section className="mx-auto max-w-site px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-bold text-navy-900">
            Overview: Engineering {service.name} for Growth
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-navy-800">
            {service.overviewText.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features & Capabilities Grid */}
      <section className="bg-mist py-16">
        <div className="mx-auto max-w-site px-4 sm:px-6">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl font-bold text-navy-900">
              Key Features & Capabilities
            </h2>
            <p className="mt-3 text-lg text-navy-700">
              Detailed technical and operational components built into our{" "}
              {service.name.toLowerCase()} engagements.
            </p>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {service.features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm"
              >
                <h3 className="font-display text-xl font-bold text-navy-900">{feature.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-navy-700">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Process Timeline */}
      <section className="mx-auto max-w-site px-4 py-16 sm:px-6">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-navy-900">
            How We Execute {service.name}
          </h2>
          <p className="mt-3 text-lg text-navy-700">
            A structured, 4-step engineering methodology ensuring rapid deployment and measurable
            ROI.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {service.process.map((step) => (
            <div
              key={step.stepNumber}
              className="flex flex-col justify-between rounded-xl bg-navy-900 p-6 text-white"
            >
              <div>
                <span className="font-display text-3xl font-extrabold text-blue-400">
                  0{step.stepNumber}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-blue-100">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Deliverables & Target Audience */}
      <section className="bg-mist py-16">
        <div className="mx-auto max-w-site px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Deliverables */}
            <div className="rounded-2xl border border-navy/10 bg-white p-8 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-navy-900">
                Tangible Deliverables
              </h2>
              <p className="mt-2 text-sm text-navy-600">
                What your business receives upon project completion:
              </p>
              <ul className="mt-6 space-y-4">
                {service.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs text-white font-bold">
                      &check;
                    </span>
                    <span className="text-base text-navy-800 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target Audience */}
            <div className="rounded-2xl border border-navy/10 bg-white p-8 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-navy-900">
                Who This Service Is Designed For
              </h2>
              <p className="mt-2 text-sm text-navy-600">
                Ideal organization profiles and business use cases:
              </p>
              <ul className="mt-6 space-y-4">
                {service.whoItIsFor.map((audience) => (
                  <li key={audience} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-700 text-xs text-white font-bold">
                      &rarr;
                    </span>
                    <span className="text-base text-navy-800 font-medium">{audience}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Service Specific FAQ Accordion */}
      <Faq items={service.faq} title={`Frequently Asked Questions About ${service.name}`} />

      {/* Final CTA */}
      <FinalCta
        location={`digital_service_${service.slug}_footer`}
        heading={`Ready to launch ${service.name}?`}
        body={`Book a free 30-minute consultation. We will audit your current requirements and deliver a clear project proposal.`}
      />
    </>
  );
}
