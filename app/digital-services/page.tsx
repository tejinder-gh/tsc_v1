/**
 * What: The digital-services overview page - website development, application development,
 *       rebranding/brand design, and digital marketing, in one card grid.
 * Why: Second line of business alongside AI automation, added 2026-08. A standalone
 *      narrative page (like /how-it-works and /results), not a content-array-driven
 *      collection with individual detail pages - see content/digital-services.ts's header
 *      for why (no invented process/timeline/pricing detail for these four lines yet).
 * How: Server page over content/digital-services.ts; card style matches
 *      components/ServicesGrid.tsx's automation-service cards.
 * From Where: Founder request, 2026-08.
 * When: 2026-08.
 */

import type { Metadata } from "next";
import { AbstractVisual } from "@/components/AbstractVisual";
import { CtaLink } from "@/components/CtaLink";
import { FinalCta } from "@/components/FinalCta";
import { digitalServices } from "@/content/digital-services";

export const metadata: Metadata = {
  title: "Digital Services",
  description:
    "Website development, application development, rebranding and brand design, and digital marketing - alongside our AI automation work.",
  alternates: { canonical: "/digital-services" },
};

export default function DigitalServicesPage() {
  return (
    <>
      <section className="mx-auto max-w-site px-4 pb-12 pt-16 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-500">
              Digital services
            </p>
            <h1 className="mt-4 max-w-xl font-display text-4xl font-bold leading-tight sm:text-5xl">
              Beyond automation: the site, the app, the brand, and the marketing behind it.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed">
              Alongside our AI automation work, we build and run the digital side of your business -
              websites, applications, brand identity, and the marketing that gets you found. Scoped
              and quoted after a free audit, same as everything else we build.
            </p>
            <div className="mt-8">
              <CtaLink href="/book" location="digital_services_hero">
                Book a free audit
              </CtaLink>
            </div>
          </div>
          <div className="hidden lg:block h-full">
            <AbstractVisual variant="services" />
          </div>
        </div>
      </section>

      <section aria-label="Digital services" className="bg-mist">
        <div className="mx-auto max-w-site px-4 py-14 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {digitalServices.map((service) => (
              <div
                key={service.slug}
                className="flex h-full flex-col rounded-xl border-2 border-navy/10 bg-white p-6 shadow-sm"
              >
                <h2 className="font-display text-xl font-bold">{service.name}</h2>
                <p className="mt-2 font-medium text-blue-600">{service.tagline}</p>
                <p className="mt-3 flex-1 leading-relaxed">{service.description}</p>
                <ul className="mt-4 space-y-1.5 text-sm">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span aria-hidden="true" className="mt-1 text-blue-500">
                        &bull;
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCta
        location="digital_services"
        heading="Tell us what you're trying to build."
        body="A free 30-minute audit covers automation, your site, your app, or your brand - whatever's actually eating your time or costing you leads."
      />
    </>
  );
}
