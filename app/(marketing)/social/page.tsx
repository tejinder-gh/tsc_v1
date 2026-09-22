/**
 * What: /social - the landing page for anyone scanning The Skill Corner's physical
 *       business card. Company-forward (not an individual): who TSC is, what it builds,
 *       and how it helps - backed by real numbers already published elsewhere on the
 *       site, not new claims invented for this page.
 * Why: A QR code on a physical card needs somewhere real to land - this page exists to
 *      introduce the company and convert that one scan into a saved contact and, ideally,
 *      a lead. First pass (a generic "By the numbers" stat-tile grid + two flat category-
 *      summary cards) tested flat in a real browser pass against the homepage - the
 *      founder confirmed it didn't create "an urge to explore." Root cause, found by
 *      comparing screenshots against home page (/): this site never presents numbers as a
 *      standalone stat block - every number lives inside a specific, individually-titled
 *      card (a service's own timeline badge, the ROI calculator's own figure, a named
 *      pricing tier). This page now reuses those exact components (ServicesGrid,
 *      DigitalServicesTeaser, PricingAnchor) instead of a hand-rolled summary, so it reads
 *      the same way the rest of the site already reads - proven, not a page-specific
 *      alternate design. Every figure still traces to an existing source; nothing here is
 *      a new claim invented for this page (content/proof.ts's no-fabrication discipline).
 * How: Server page composing existing components. ServicesGrid/DigitalServicesTeaser/
 *      RoiCalculator/ProofSection/PricingAnchor are the exact same components the homepage
 *      uses, in the same order they appear there. QuickMessageForm is the one page-specific
 *      client boundary. The "save our contact" link points at /contact.vcf (an organization
 *      vCard). MobileStickyBar/QuickActions/ExitIntentModal are already global via
 *      app/layout.tsx.
 * From Where: Founder request, 2026-08; re-scoped to company-only framing, then to
 *      numerically-backed content, then rebuilt around proven components after a real
 *      browser comparison showed the hand-rolled version read flat, same day.
 * When: 2026-08.
 */

import type { Metadata } from "next";
import { AbstractVisual } from "@/components/AbstractVisual";
import { CtaLink } from "@/components/CtaLink";
import { QuickMessageForm } from "@/components/forms/QuickMessageForm";
import { DigitalServicesTeaser } from "@/components/home/DigitalServicesTeaser";
import { ProofSection } from "@/components/home/ProofSection";
import { RoiCalculator } from "@/components/home/RoiCalculator";
import { PricingAnchor } from "@/components/PricingAnchor";
import { ServicesGrid } from "@/components/ServicesGrid";
import { digitalServices } from "@/content/digital-services";
import { services } from "@/content/services";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `${site.name} - AI Automation & Digital Services`,
  description: `Get in touch with ${site.name} - AI automation, websites, apps, branding, and digital marketing for local businesses and professional practices.`,
  alternates: { canonical: "/social" },
};

export default function SocialPage() {
  const telHref = `tel:${site.phone.replace(/[^+\d]/g, "")}`;

  return (
    <>
      <section className="mx-auto max-w-site px-4 pb-10 pt-16 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-500">
              AI automation &amp; digital services agency
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
              {site.name}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed">
              We build the automations, the software, and the digital presence that run your
              business - so the busywork runs itself.
            </p>
            <p className="mt-3 max-w-xl text-sm text-slate-600">
              {services.length} automations. {digitalServices.length} digital service lines. A free
              30-minute audit to start, no pitch deck.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/contact.vcf"
                download="contact.vcf"
                className="inline-flex min-h-12 items-center justify-center rounded-control bg-blue-500 px-6 font-display text-[15px] font-medium text-white shadow-sm transition-all hover:bg-blue-700"
              >
                Save our contact
              </a>
              <CtaLink href="/book" location="social_hero" variant="secondary">
                Book a free audit
              </CtaLink>
            </div>

            <p className="mt-6 flex flex-col gap-1 text-sm text-slate-600">
              <a href={telHref} className="underline underline-offset-4 hover:text-navy">
                {site.phone}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="underline underline-offset-4 hover:text-navy"
              >
                {site.email}
              </a>
            </p>
          </div>

          <div className="hidden lg:block h-full">
            <AbstractVisual variant="contact" />
          </div>
        </div>
      </section>

      <RoiCalculator />
      <ServicesGrid count={3} />
      <DigitalServicesTeaser />
      <ProofSection />
      <PricingAnchor location="social" />

      <section aria-label="Send a message" className="mx-auto max-w-site px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-lg">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Or just tell us what you need
          </h2>
          <p className="mt-3 leading-relaxed">
            A couple of lines is enough - we reply within one business day.
          </p>
          <div className="mt-6">
            <QuickMessageForm leadSource="social_card" />
          </div>
        </div>
      </section>
    </>
  );
}
