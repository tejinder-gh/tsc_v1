/**
 * What: Grid of service cards with outcome-first titles, used on the home page and the
 *       /services index.
 * Why: "What we automate" is the secondary-CTA destination; cards must sell the outcome,
 *      not the technology.
 * How: Server component mapping content/services.ts; each card links to its detail page.
 *      Cards scroll-reveal with a RevealCascade stagger and lift on hover, matching the
 *      shadow/ring card style of the segment and industry cards.
 * From Where: TheSkillCorner marketing site build brief (services overview), 2026-06.
 * When: 2026-06.
 */

import Link from "next/link";
import { RevealBlock, RevealContainer, RevealItem } from "@/components/RevealCascade";
import { services } from "@/content/services";

export function ServicesGrid({ id, count }: { id?: string; count?: number }) {
  return (
    <section
      id={id}
      aria-label="Services"
      className="mx-auto max-w-site scroll-mt-20 px-4 py-16 sm:px-6"
    >
      <RevealBlock>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">What we automate</h2>
        <p className="mt-3 max-w-2xl">
          Some builds cover most of what eats an owner's week. Every one connects to the tools you
          already use.
        </p>
      </RevealBlock>
      <RevealContainer className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.slice(0, count || -1).map((service) => (
          <RevealItem key={service.slug} className="h-full">
            <Link
              href={`/services/${service.slug}`}
              className="group flex h-full flex-col rounded-xl bg-white p-6 shadow-sm border-2 border-navy/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate">
                {service.name}
              </p>
              <h3 className="mt-2 font-display text-xl font-bold">{service.title}</h3>
              <p className="mt-2 flex-1 leading-relaxed">{service.excerpt}</p>
              <p className="mt-4 text-sm font-semibold text-blue">
                {service.timeline}
                <span
                  aria-hidden="true"
                  className="ml-2 inline-block transition-transform group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </p>
            </Link>
          </RevealItem>
        ))}
      </RevealContainer>
      {count && services.length > count && (
        <div className="flex justify-center mt-8">
          <Link
            href="/services"
            className="inline-block rounded-full bg-blue px-6 py-3 text-white font-bold hover:bg-blue/90 transition-colors"
          >
            See all services
          </Link>
        </div>
      )}
    </section>
  );
}
