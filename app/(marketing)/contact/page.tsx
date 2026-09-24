/**
 * What: Quick query page - the contact form plus the faster-path booking card.
 * Why: Second rung of the conversion ladder for visitors with a question but no
 *      appetite for a call yet. Hydrates from visitor journey if active.
 * How: Editorial hero, ActiveJourneyBanner for carried context, ContactForm with
 *      sidebar offering the faster-path 30-min audit and checklist.
 * From Where: TheSkillCorner marketing site editorial redesign, 2026.
 */

import type { Metadata } from "next";
import { CtaLink } from "@/components/CtaLink";
import { ContactForm } from "@/components/forms/ContactForm";
import { ActiveJourneyBanner } from "@/components/journey";
import { EditorialHero } from "@/components/public/EditorialHero";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact Us & Free Automation Consultation",
  description:
    "Tell us what's eating your time. We reply within 1 business day with whether (and how) it can be automated.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-site px-4 py-10 sm:px-6 font-geist">
      <ActiveJourneyBanner className="mb-6" />

      <EditorialHero
        eyebrow="CONTACT &amp; DIRECT INQUIRY"
        headline="Tell us what's eating your operational time"
        supportingCopy="Two sentences is plenty. We reply within one business day with technical feasibility, estimated operational impact, and architecture scope."
      >
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--tsc-muted)] uppercase tracking-wider">
          <span>Guaranteed 1-business-day turnaround</span>
          <span>&bull;</span>
          <span>Direct engineer response</span>
        </div>
      </EditorialHero>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-[8px] border border-[var(--tsc-line)] bg-white p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[var(--tsc-ink)] mb-4">
            Send an engineering query
          </h2>
          <ContactForm />
        </div>

        <aside className="space-y-6">
          <div className="rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] p-6">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--tsc-muted)] font-semibold block mb-1">
              THE FASTER PATH
            </span>
            <h3 className="font-bold text-[var(--tsc-ink)] text-base mb-2">
              Book a live 30-minute audit
            </h3>
            <p className="text-sm text-[var(--tsc-muted)] leading-relaxed mb-4">
              A 30-minute technical scoping call answers in one session what email takes a week to
              cover &mdash; and you leave with an architecture roadmap either way.
            </p>
            <CtaLink href="/book" location="contact_sidebar" variant="primary">
              Schedule free audit &rarr;
            </CtaLink>
          </div>

          <div className="rounded-[8px] border border-[var(--tsc-line)] bg-white p-6">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--tsc-muted)] font-semibold block mb-1">
              SELF-ASSESSMENT
            </span>
            <h3 className="font-bold text-[var(--tsc-ink)] text-base mb-2">
              Automation Opportunities Checklist
            </h3>
            <p className="text-sm text-[var(--tsc-muted)] leading-relaxed mb-4">
              Review 25 common operational and engineering processes businesses stop running
              manually.
            </p>
            <CtaLink href="/checklist" location="contact_sidebar" variant="text">
              View the checklist &rarr;
            </CtaLink>
          </div>

          <div className="rounded-[8px] border border-[var(--tsc-line)] bg-white p-6 text-sm text-[var(--tsc-muted)]">
            <p className="font-medium text-[var(--tsc-ink)] mb-1">Direct email inquiries:</p>
            <a
              href={`mailto:${site.email}`}
              className="font-mono text-xs text-[var(--tsc-ink)] underline underline-offset-4 hover:opacity-80"
            >
              {site.email}
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
