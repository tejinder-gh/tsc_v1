/**
 * What: Compact homepage teaser for the digital-services line - a small card grid linking
 *       out to /digital-services, sitting alongside the automation ServicesGrid.
 * Why: The founder asked for the homepage to also reflect the digital-services line
 *      (website dev, app dev, rebranding, digital marketing), added 2026-08. Kept
 *      deliberately compact and separate from the automation narrative rather than
 *      merged into it - two different lines of business, one page each to point at.
 * How: Server component mapping content/digital-services.ts; card style matches
 *      components/ServicesGrid.tsx's automation-service cards.
 * From Where: Founder request, 2026-08.
 * When: 2026-08.
 */

import Link from "next/link";
import { RevealBlock, RevealContainer, RevealItem } from "@/components/RevealCascade";
import { digitalServices } from "@/content/digital-services";

export function DigitalServicesTeaser() {
  return (
    <section aria-label="Digital services" className="mx-auto max-w-site px-4 py-16 sm:px-6">
      <RevealBlock>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          We also build the rest of your digital presence
        </h2>
        <p className="mt-3 max-w-2xl">
          Websites, applications, brand design, and the marketing behind them - alongside our
          automation work.
        </p>
      </RevealBlock>
      <RevealContainer className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {digitalServices.map((service) => (
          <RevealItem key={service.slug} className="h-full">
            <div className="flex h-full flex-col rounded-xl border-2 border-navy/10 bg-white p-6 shadow-sm">
              <h3 className="font-display text-lg font-bold">{service.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed">{service.tagline}</p>
            </div>
          </RevealItem>
        ))}
      </RevealContainer>
      <div className="mt-8 flex justify-center">
        <Link
          href="/digital-services"
          className="inline-block rounded-full bg-blue px-6 py-3 font-bold text-white transition-colors hover:bg-blue/90"
        >
          See digital services
        </Link>
      </div>
    </section>
  );
}
