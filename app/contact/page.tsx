/**
 * What: Quick query page - the contact form plus the faster-path booking card.
 * Why: Second rung of the conversion ladder for visitors with a question but no
 *      appetite for a call yet.
 * How: Server page composing the client ContactForm; sidebar surfaces booking and the
 *      checklist so two more rungs are always visible.
 * From Where: TheSkillCorner marketing site build brief (quick query spec), 2026-06.
 * When: 2026-06.
 */

import type { Metadata } from "next";
import { CtaLink } from "@/components/CtaLink";
import { ContactForm } from "@/components/forms/ContactForm";
import { AbstractVisual } from "@/components/AbstractVisual";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Send a quick query",
  description:
    "Tell us what's eating your time. We reply within 1 business day with whether (and how) it can be automated.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-site px-4 py-14 sm:px-6">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <div>
          <h1 className="max-w-3xl font-display text-4xl font-bold tracking-[-0.02em] text-ink sm:text-5xl">
            Tell us what&apos;s eating your time
          </h1>
          <p className="mt-4 text-lg text-slate">
            Two sentences is plenty. We reply within one business day with a straight answer: what can
            be automated, roughly what it saves, and what it costs.
          </p>
        </div>
        <div className="hidden lg:flex justify-end">
          <AbstractVisual variant="contact" />
        </div>
      </div>
      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
        <aside className="space-y-5">
          <div className="rounded-2xl bg-mist p-6 shadow-sm ring-1 ring-ink/5">
            <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-ink">The faster path</h2>
            <p className="mt-2 leading-relaxed">
              The free 30-minute audit usually answers in one call what email takes a week to cover
              - and you leave with three automation ideas either way.
            </p>
            <div className="mt-4">
              <CtaLink href="/book" location="contact_sidebar">
                Book the free audit
              </CtaLink>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5">
            <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-ink">Just browsing?</h2>
            <p className="mt-2 leading-relaxed">
              The Automation Opportunities Checklist lists 25 tasks businesses stop doing by hand.
            </p>
            <div className="mt-4">
              <CtaLink href="/checklist" location="contact_sidebar" variant="text">
                Get the free checklist
              </CtaLink>
            </div>
          </div>
          <p className="text-sm">
            Prefer plain email?{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-semibold text-ledger underline underline-offset-4"
            >
              {site.email}
            </a>
          </p>
        </aside>
      </div>
    </div>
  );
}
