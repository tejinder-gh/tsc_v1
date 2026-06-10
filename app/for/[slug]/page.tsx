/**
 * What: Industry landing page - a complete standalone funnel: headline, pains,
 *       automations with savings, proof, segment-correct pricing anchor, FAQ, CTAs.
 * Why: These pages are the SEO and ad-traffic engine; a cold visitor must be able to go
 *      from landing to booked call without visiting any other page.
 * How: Statically generated from content/industries.ts; SetSegment persists the
 *      visitor's segment for the rest of the session. Next 16 async params.
 * From Where: TheSkillCorner marketing site build brief (industry funnel spec), 2026-06.
 * When: 2026-06.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaLink } from "@/components/CtaLink";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { PricingAnchor } from "@/components/PricingAnchor";
import { SetSegment } from "@/components/SetSegment";
import { industries, industryBySlug } from "@/content/industries";

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
    title: `AI automation for ${industry.name.toLowerCase()}`,
    description: industry.metaDescription,
  };
}

export default async function IndustryPage({ params }: PageProps) {
  const { slug } = await params;
  const industry = industryBySlug(slug);
  if (!industry) notFound();

  const audienceWord = industry.segment === "local" ? "owners" : "practices";

  return (
    <>
      <SetSegment segment={industry.segment} />

      <section className="mx-auto max-w-site px-4 pb-12 pt-16 sm:px-6 sm:pt-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-ledger">
          For {industry.name.toLowerCase()}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">
          {industry.headline}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed">{industry.subhead}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <CtaLink href="/book" location={`industry_${industry.slug}_hero`}>
            Book a free automation audit
          </CtaLink>
          <CtaLink
            href="/checklist"
            location={`industry_${industry.slug}_hero`}
            variant="secondary"
          >
            Get the free checklist
          </CtaLink>
        </div>
      </section>

      <section aria-label="The problems" className="bg-mist">
        <div className="mx-auto max-w-site px-4 py-14 sm:px-6">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            The week we keep hearing about from {audienceWord}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {industry.pains.map((pain) => (
              <div key={pain.title} className="rounded-xl bg-white p-6">
                <h3 className="font-display text-lg font-bold">{pain.title}</h3>
                <p className="mt-2 leading-relaxed">{pain.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="What we automate" className="mx-auto max-w-site px-4 py-14 sm:px-6">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">What we automate for you</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {industry.automations.map((automation) => (
            <div
              key={automation.title}
              className="flex flex-col rounded-xl border-2 border-ink/10 bg-white p-6"
            >
              <h3 className="font-display text-xl font-bold">{automation.title}</h3>
              <p className="mt-2 flex-1 leading-relaxed">{automation.body}</p>
              <p className="mt-4 inline-block font-display text-lg font-bold text-ledger">
                {automation.metric}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Recent build" className="bg-mist">
        <div className="mx-auto max-w-site px-4 py-14 sm:px-6">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">A recent build like yours</h2>
          <div className="mt-8 max-w-2xl rounded-xl bg-white p-7">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate">
              {industry.build.business} - anonymized for client privacy
            </p>
            <p className="mt-3 leading-relaxed">
              <span className="font-semibold text-ink">The problem: </span>
              {industry.build.problem}
            </p>
            <p className="mt-2 leading-relaxed">
              <span className="font-semibold text-ink">The build: </span>
              {industry.build.automation}
            </p>
            <p className="mt-4 font-display text-2xl font-bold text-ledger">
              {industry.build.result}
            </p>
          </div>
        </div>
      </section>

      <PricingAnchor fixedSegment={industry.segment} location={`industry_${industry.slug}`} />

      <Faq items={industry.faq} title={`Questions ${industry.name.toLowerCase()} ask us`} />

      <FinalCta
        location={`industry_${industry.slug}`}
        heading={`Find out what ${industry.name.toLowerCase()} get back from automation.`}
      />
    </>
  );
}
