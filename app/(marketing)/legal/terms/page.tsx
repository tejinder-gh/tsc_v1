import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Standard terms of service, client responsibilities, and service delivery parameters for The Skill Corner.",
  alternates: { canonical: "/legal/terms" },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 font-geist">
      <header className="mb-10 pb-6 border-b border-[var(--tsc-line)]">
        <span className="font-mono text-xs uppercase tracking-wider text-[var(--tsc-muted)] font-semibold block mb-2">
          AGREEMENT &amp; TERMS
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--tsc-ink)]">
          Terms of Service
        </h1>
        <p className="mt-2 font-mono text-xs text-[var(--tsc-muted)]">
          Last updated: June 12, 2026
        </p>
      </header>

      <div className="space-y-6 text-sm leading-relaxed text-[var(--tsc-ink-subtle)]">
        <p>
          Welcome to the website of <strong className="text-[var(--tsc-ink)]">{site.name}</strong>.
          By accessing this site, requesting our checklist, or scheduling an audit, you agree to
          comply with and be bound by the following terms and conditions.
        </p>

        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-bold text-[var(--tsc-ink)]">
            1. Service Scope &amp; Engagements
          </h2>
          <p>
            {site.name} is an automation and systems engineering agency providing software
            development, configuration, and integration services.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[var(--tsc-ink)]">Starter Packages:</strong> Provided on a
              month-to-month basis. Setup is included as part of onboarding. You may cancel at any
              time prior to your next monthly billing cycle.
            </li>
            <li>
              <strong className="text-[var(--tsc-ink)]">Custom Practice Builds:</strong> Scoped,
              quoted, and governed by a separate signed Statement of Work (SOW). Custom engagements
              require explicit client approval of the scope and deliverables before development
              begins.
            </li>
          </ul>
        </section>

        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-bold text-[var(--tsc-ink)]">2. Client Responsibilities</h2>
          <p>To deploy and run our automation systems, you agree to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Provide timely and secure access to your software platforms (e.g., booking portals,
              EMRs, CRMs) via API keys, developer logins, or webhook setup.
            </li>
            <li>
              Maintain active and fully paid subscriptions for all third-party platforms utilized in
              your automations (e.g., Twilio, OpenAI, Cal.com, CRMs).
            </li>
            <li>
              Promptly notify us of any layout, configuration, or API changes in your internal tools
              that might affect active automation endpoints.
            </li>
          </ul>
        </section>

        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-bold text-[var(--tsc-ink)]">3. Intellectual Property</h2>
          <p>
            All custom components, custom configurations, and integrations built specifically for
            your business under a paid SOW belong to you upon final payment, unless otherwise
            specified in the SOW. Generic connectors, reusable utility scripts, and pre-existing
            templates remain the intellectual property of {site.name}.
          </p>
        </section>

        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-bold text-[var(--tsc-ink)]">4. Limitation of Liability</h2>
          <p>While we build, test, and monitor all automations to ensure stability and accuracy:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              We are not liable for any downtime, missed booking opportunities, communication
              failures, or billing discrepancies caused by third-party API service interruptions
              (e.g., OpenAI API outages, carrier-level SMS delays, or booking platform crashes).
            </li>
            <li>
              We do not guarantee specific monetary gains or business outcomes. Case studies and
              scenarios shown on this site represent modeled estimates or specific historical cases
              and do not constitute direct guarantees.
            </li>
          </ul>
        </section>

        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-bold text-[var(--tsc-ink)]">5. Governing Law</h2>
          <p>
            These Terms of Service and any separate agreements under which we provide you services
            shall be governed by and construed in accordance with the laws of the{" "}
            <strong className="text-[var(--tsc-ink)]">Province of Ontario</strong> and the federal
            laws of Canada applicable therein.
          </p>
        </section>

        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-bold text-[var(--tsc-ink)]">6. Modifications</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be posted to this
            page with an updated &ldquo;Last updated&rdquo; date. Your continued use of the website
            or our services following modifications constitutes acceptance of the updated terms.
          </p>
        </section>
      </div>
    </article>
  );
}
