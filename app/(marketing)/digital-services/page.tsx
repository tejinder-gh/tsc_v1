/**
 * What: The digital-services hub page presenting all core service pillars:
 *       AI Agent Development, Website Development, Digital Marketing & GEO,
 *       Dedicated Staffing & Tech Talent, Process Documentation & SOPs,
 *       Application Development, and Rebranding & Brand Design.
 * Why: Text-heavy authority page linked to individual detail pages for top SEO and GEO rankings.
 * How: Server component iterating over content/digital-services.ts with rich links and schema markup.
 * From Where: Updated 2026-08 for client request.
 * When: 2026-08.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { AbstractVisual } from "@/components/AbstractVisual";
import { CtaLink } from "@/components/CtaLink";
import { FinalCta } from "@/components/FinalCta";
import { JsonLd } from "@/components/JsonLd";
import { digitalServices } from "@/content/digital-services";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Digital Services & AI Agent Development | The Skill Corner",
  description:
    "End-to-end digital services for businesses and practices: custom AI agent development, website development, digital marketing & GEO, dedicated tech staffing, business SOP documentation, and application builds.",
  alternates: { canonical: "/digital-services" },
  openGraph: {
    title: "Digital Services & AI Agent Development | The Skill Corner",
    description:
      "Full-service B2B digital agency providing AI agent development, website development, digital marketing (SEO & GEO), tech staffing, business SOP documentation, and custom app engineering.",
  },
};

export default function DigitalServicesPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Digital Services", path: "/digital-services" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />

      <section className="mx-auto max-w-site px-4 pb-12 pt-16 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-500">
              Full-Service B2B Digital Agency
            </p>
            <h1 className="mt-4 max-w-xl font-display text-4xl font-bold leading-tight sm:text-5xl">
              AI Agents, Web Dev, Marketing, Staffing & SOP Documentation.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-800">
              The Skill Corner delivers comprehensive digital solutions for growing businesses and
              professional practices. Whether you need autonomous AI voice/chat agents, a
              high-performance Next.js website, top-ranking SEO/GEO marketing campaigns, dedicated
              engineering staff, or standardized SOP documentation, we build and manage systems
              engineered for growth.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <CtaLink href="/book" location="digital_services_hero">
                Book a free audit
              </CtaLink>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-control border-2 border-navy-700 bg-white px-6 py-3 font-display text-base font-semibold text-navy-700 hover:bg-mist"
              >
                Send a quick query
              </Link>
            </div>
          </div>
          <div className="hidden lg:block h-full">
            <AbstractVisual variant="services" />
          </div>
        </div>
      </section>

      <section aria-label="Core digital service categories" className="bg-mist py-16">
        <div className="mx-auto max-w-site px-4 sm:px-6">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl font-bold">
              Explore Our Digital Service Capabilities
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-navy-700">
              Each service is custom-engineered and fully integrated into your business operations.
              Click any category below to read complete technical specifications, implementation
              processes, and deliverables.
            </p>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {digitalServices.map((service) => (
              <div
                key={service.slug}
                className="flex flex-col justify-between rounded-xl border-2 border-navy/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <h3 className="font-display text-xl font-bold text-navy-900">{service.name}</h3>
                  <p className="mt-2 text-sm font-semibold text-blue-600">{service.tagline}</p>
                  <p className="mt-3 text-sm leading-relaxed text-navy-700">
                    {service.description}
                  </p>

                  <ul className="mt-4 space-y-2 text-xs text-navy-800">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <span aria-hidden="true" className="mt-0.5 text-blue-500 font-bold">
                          &check;
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-mist">
                  <Link
                    href={`/digital-services/${service.slug}`}
                    className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-navy-900 group"
                  >
                    View detailed {service.name.toLowerCase()} specs
                    <span
                      aria-hidden="true"
                      className="ml-1 transition-transform group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-site px-4 py-16 sm:px-6">
        <div className="rounded-2xl bg-navy-900 p-8 text-white sm:p-12">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Why Businesses Choose The Skill Corner
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-blue-100">
              We combine deep engineering discipline with practical business execution. You
              don&apos;t get black-box agency promises; you get production-ready software, clear SOP
              documentation, verified SEO/GEO search rankings, and dedicated technical support.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg bg-navy-800 p-5">
                <h3 className="font-display text-lg font-semibold text-white">
                  Full Stack & AI Mastery
                </h3>
                <p className="mt-2 text-sm text-blue-200">
                  Custom LLMs, voice AI agents, Next.js web applications, vector databases, and API
                  integrations built by senior engineers.
                </p>
              </div>
              <div className="rounded-lg bg-navy-800 p-5">
                <h3 className="font-display text-lg font-semibold text-white">
                  100% Code & Asset Ownership
                </h3>
                <p className="mt-2 text-sm text-blue-200">
                  Zero vendor lock-in. You own every line of source code, design file, SOP document,
                  and vector knowledge base.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FinalCta
        location="digital_services"
        heading="Tell us what digital service you need."
        body="Book a free 30-minute consultation. We will audit your current site, marketing, staffing needs, or AI agent workflow and deliver an exact plan."
      />
    </>
  );
}
