/**
 * What: /social - the landing page for anyone scanning The Skill Corner's physical
 *       business card. Company-forward (not an individual) - "save our contact" first,
 *       then the full range of what The Skill Corner builds (AI automation and digital
 *       services), then a fast way to reach out.
 * Why: A QR code on a physical card needs somewhere real to land - this page exists to
 *      convert that one scan into a saved contact and, ideally, a lead. Deliberately
 *      company-branded rather than founder-branded per explicit direction: this is TSC's
 *      card, not a personal one. See the plan file (partitioned-moseying-shamir.md) for
 *      the full scope rationale.
 * How: Server page; the "save our contact" link points at /contact.vcf
 *      (app/contact.vcf/route.ts, itself an organization vCard, not a personal one).
 *      QuickMessageForm is the one client boundary, reusing the existing lead pipeline with
 *      lead_source "social_card". MobileStickyBar/QuickActions/ExitIntentModal are already
 *      global via app/layout.tsx and need no changes to appear here.
 * From Where: Founder request, 2026-08; re-scoped to company-only framing same day.
 * When: 2026-08.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { AbstractVisual } from "@/components/AbstractVisual";
import { CtaLink } from "@/components/CtaLink";
import { QuickMessageForm } from "@/components/forms/QuickMessageForm";
import { digitalServices } from "@/content/digital-services";
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
              Thanks for stopping by
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
              {site.name}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed">{site.description}</p>

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

      <section aria-label="What we build" className="bg-mist">
        <div className="mx-auto max-w-site px-4 py-14 sm:px-6">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">What we build</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Link
              href="/what-we-automate"
              className="group flex flex-col rounded-xl border-2 border-navy/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue hover:shadow-md"
            >
              <h3 className="font-display text-xl font-bold">AI Automation</h3>
              <p className="mt-2 flex-1 leading-relaxed">
                Missed-call answering, booking reminders, intake processing, review responses, and
                follow-up that never slips.
              </p>
              <p className="mt-4 text-sm font-semibold text-blue">
                See what we automate
                <span
                  aria-hidden="true"
                  className="ml-2 inline-block transition-transform group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </p>
            </Link>

            <Link
              href="/digital-services"
              className="group flex flex-col rounded-xl border-2 border-navy/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue hover:shadow-md"
            >
              <h3 className="font-display text-xl font-bold">Digital Services</h3>
              <p className="mt-2 flex-1 leading-relaxed">
                {digitalServices.map((service) => service.name).join(", ")}.
              </p>
              <p className="mt-4 text-sm font-semibold text-blue">
                See digital services
                <span
                  aria-hidden="true"
                  className="ml-2 inline-block transition-transform group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </p>
            </Link>
          </div>
        </div>
      </section>

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
