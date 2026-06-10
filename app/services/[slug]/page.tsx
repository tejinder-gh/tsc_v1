/**
 * What: Service detail page - problem, what we build, tools, timeline, expected outcome,
 *       mini-FAQ, related industries, and booking CTA.
 * Why: Visitors arriving from the services grid are evaluating a specific fix; the page
 *      must answer "what exactly do I get" and hand them a booking path.
 * How: Statically generated from content/services.ts; related industry links cross-feed
 *      the SEO funnel pages. Next 16 async params.
 * From Where: TheSkillCorner marketing site build brief (services spec), 2026-06.
 * When: 2026-06.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaLink } from "@/components/CtaLink";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { industryBySlug } from "@/content/industries";
import { serviceBySlug, services } from "@/content/services";

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
    title: service.title,
    description: service.excerpt,
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) notFound();

  const related = service.relatedIndustries
    .map((s) => industryBySlug(s))
    .filter((i) => i !== undefined);

  return (
    <>
      <section className="mx-auto max-w-site px-4 pb-12 pt-16 sm:px-6 sm:pt-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-ledger">
          {service.name}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">
          {service.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed">{service.problem}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <CtaLink href="/book" location={`service_${service.slug}_hero`}>
            Book a free automation audit
          </CtaLink>
          <CtaLink href="/contact" location={`service_${service.slug}_hero`} variant="secondary">
            Ask about this build
          </CtaLink>
        </div>
      </section>

      <section aria-label="What we build" className="bg-mist">
        <div className="mx-auto max-w-site px-4 py-14 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="font-display text-3xl font-bold">What we build</h2>
              <ul className="mt-6 space-y-4">
                {service.whatWeBuild.map((item) => (
                  <li key={item} className="flex gap-3 rounded-xl bg-white p-5">
                    <span aria-hidden="true" className="mt-1 shrink-0 text-ledger">
                      <svg
                        aria-hidden="true"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M2 8.5L6 12l8-8"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <div className="rounded-xl bg-white p-5">
                <h3 className="font-display font-bold">Timeline</h3>
                <p className="mt-1 font-display text-xl font-bold text-ledger">
                  {service.timeline}
                </p>
              </div>
              <div className="rounded-xl bg-white p-5">
                <h3 className="font-display font-bold">Built on</h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {service.tools.map((tool) => (
                    <li
                      key={tool}
                      className="rounded-full bg-mist px-3 py-1 text-sm font-medium text-ink"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-white p-5">
                <h3 className="font-display font-bold">What to expect</h3>
                <p className="mt-2 leading-relaxed">{service.outcome}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Faq items={service.faq} title="Common questions about this build" />

      {related.length > 0 ? (
        <section aria-label="Related industries" className="mx-auto max-w-site px-4 pb-16 sm:px-6">
          <h2 className="font-display text-2xl font-bold">Who uses this most</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {related.map((industry) => (
              <Link
                key={industry.slug}
                href={`/for/${industry.slug}`}
                className="rounded-lg border-2 border-ink/10 bg-white px-4 py-2.5 font-medium text-ink transition-colors hover:border-ledger"
              >
                {industry.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <FinalCta location={`service_${service.slug}`} />
    </>
  );
}
