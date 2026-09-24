/**
 * What: /social - digital business card and contact landing page for anyone
 *       scanning The Skill Corner's physical business card or direct QR.
 * Why: Minimal, high-density contact landing providing vCard download, direct reach,
 *      canonical 4-phase methodology, and diagnosis-first links without legacy orphan widgets.
 * How: EditorialHero, direct vCard link, direct channels card, 4-phase summary card,
 *      and diagnosis-first entry points.
 * From Where: TheSkillCorner marketing site editorial redesign, 2026.
 */

import type { Metadata } from "next";
import { CtaLink } from "@/components/CtaLink";
import { EditorialHero } from "@/components/public/EditorialHero";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `${site.name} - Direct Contact & Digital Card`,
  description: `Direct digital business card and contact portal for ${site.name}. Engineering autonomous software and operational automation.`,
  alternates: { canonical: "/social" },
};

export default function SocialPage() {
  const telHref = `tel:${site.phone.replace(/[^+\d]/g, "")}`;

  return (
    <div className="mx-auto max-w-site px-4 py-10 sm:px-6 font-geist">
      <EditorialHero
        eyebrow="DIGITAL CONTACT &amp; PROFILE"
        headline={site.name}
        supportingCopy="Autonomous software systems and workflow engineering. We design, build, and deploy production software so operational bottlenecks run themselves."
      >
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/contact.vcf"
            download="contact.vcf"
            className="inline-flex min-h-11 items-center justify-center rounded-[8px] bg-[var(--tsc-ink)] px-5 font-geist text-sm font-medium text-[var(--tsc-paper)] transition-all hover:opacity-90"
          >
            Save Contact Card (.vcf) &darr;
          </a>
          <CtaLink href="/book" location="social_hero" variant="secondary">
            Book Scoping Audit &rarr;
          </CtaLink>
        </div>
      </EditorialHero>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Direct Contact */}
        <div className="rounded-[8px] border border-[var(--tsc-line)] bg-white p-6">
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--tsc-muted)] font-semibold block mb-2">
            DIRECT CHANNELS
          </span>
          <h2 className="text-lg font-bold text-[var(--tsc-ink)] mb-4">Direct Reach</h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs font-mono text-[var(--tsc-muted)] uppercase block">
                Telephone
              </span>
              <a
                href={telHref}
                className="font-mono font-medium text-[var(--tsc-ink)] hover:underline"
              >
                {site.phone}
              </a>
            </div>
            <div>
              <span className="text-xs font-mono text-[var(--tsc-muted)] uppercase block">
                Inquiries
              </span>
              <a
                href={`mailto:${site.email}`}
                className="font-mono font-medium text-[var(--tsc-ink)] hover:underline"
              >
                {site.email}
              </a>
            </div>
            <div>
              <span className="text-xs font-mono text-[var(--tsc-muted)] uppercase block">
                Response Time
              </span>
              <p className="text-[var(--tsc-muted)]">Within 1 business day guaranteed</p>
            </div>
          </div>
        </div>

        {/* Card 2: Engineering Process */}
        <div className="rounded-[8px] border border-[var(--tsc-line)] bg-white p-6">
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--tsc-accent)] font-semibold block mb-2">
            METHODOLOGY
          </span>
          <h2 className="text-lg font-bold text-[var(--tsc-ink)] mb-4">4-Phase Delivery</h2>
          <div className="space-y-2 text-sm text-[var(--tsc-muted)]">
            <div className="flex items-start gap-2">
              <span className="font-mono text-xs font-bold text-[var(--tsc-ink)]">01</span>
              <span>
                <strong className="text-[var(--tsc-ink)]">Understand:</strong> Direct bottleneck
                scoping &amp; diagnosis.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono text-xs font-bold text-[var(--tsc-ink)]">02</span>
              <span>
                <strong className="text-[var(--tsc-ink)]">Specify:</strong> Deterministic
                architectural specification.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono text-xs font-bold text-[var(--tsc-ink)]">03</span>
              <span>
                <strong className="text-[var(--tsc-ink)]">Integrate:</strong> Turnkey deployment in
                your live stack.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-mono text-xs font-bold text-[var(--tsc-ink)]">04</span>
              <span>
                <strong className="text-[var(--tsc-ink)]">Measure:</strong> Verifiable telemetry
                &amp; ongoing performance.
              </span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--tsc-line)]">
            <CtaLink href="/how-it-works" location="social_process" variant="text">
              Read engineering lifecycle &rarr;
            </CtaLink>
          </div>
        </div>

        {/* Card 3: Diagnosis First */}
        <div className="rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] p-6">
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--tsc-muted)] font-semibold block mb-2">
            START WITH A PROBLEM
          </span>
          <h2 className="text-lg font-bold text-[var(--tsc-ink)] mb-4">Interactive Diagnostic</h2>
          <p className="text-sm text-[var(--tsc-muted)] leading-relaxed mb-6">
            Describe what operational friction is draining your team&apos;s hours. Our live
            diagnostic engine maps the feasibility and architecture immediately.
          </p>
          <div className="flex flex-col gap-2">
            <CtaLink href="/#start" location="social_diagnosis" variant="primary">
              Run live diagnostic &rarr;
            </CtaLink>
            <CtaLink href="/contact" location="social_contact" variant="text">
              Or send written inquiry &rarr;
            </CtaLink>
          </div>
        </div>
      </div>
    </div>
  );
}
