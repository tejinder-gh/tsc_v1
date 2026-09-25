import type { Metadata } from "next";
import { EditorialHero } from "@/components/public/EditorialHero";
import { PageEyebrow } from "@/components/public/PageEyebrow";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms of Service | The Skill Corner",
  description:
    "Standard terms of service, client responsibilities, and service delivery parameters for The Skill Corner.",
  alternates: { canonical: "/legal/terms" },
};

export default function TermsPage() {
  const sections = [
    { id: "scope", num: "01", title: "Service Scope & Engagements" },
    { id: "responsibilities", num: "02", title: "Client Responsibilities" },
    { id: "ip", num: "03", title: "Intellectual Property" },
    { id: "liability", num: "04", title: "Limitation of Liability" },
    { id: "governing-law", num: "05", title: "Governing Law" },
    { id: "modifications", num: "06", title: "Modifications" },
  ];

  return (
    <>
      {/* Editorial Hero */}
      <EditorialHero
        eyebrow="LEGAL & COMMERCIAL TERMS"
        headline="Terms of service and delivery parameters."
        supportingCopy="Operating standards, client responsibilities, and intellectual property terms governing custom automation builds and system software delivered by The Skill Corner."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Legal", href: "#" },
          { label: "Terms of Service", href: "/legal/terms" },
        ]}
        metadata={[
          { label: "EFFECTIVE DATE", value: "June 12, 2026" },
          { label: "JURISDICTION", value: "Ontario, Canada" },
          { label: "ENGAGEMENT", value: "Fixed-Scope SOW & Retainers" },
        ]}
      />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-16 py-14 sm:py-20 font-geist">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column: Sticky Table of Contents & Commercial Guarantees */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="space-y-2">
              <PageEyebrow>AGREEMENT DIRECTORY</PageEyebrow>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]">
                Terms outline
              </h2>
            </div>

            <nav aria-label="Terms of Service Sections" className="space-y-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-3 py-2 px-3 -mx-3 rounded-[6px] text-xs font-mono text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)] hover:bg-[var(--tsc-surface)] transition-colors group"
                >
                  <span className="font-semibold text-[var(--tsc-muted)] group-hover:text-[var(--tsc-action)]">
                    {section.num}
                  </span>
                  <span className="text-[var(--tsc-line)]">&middot;</span>
                  <span className="truncate">{section.title}</span>
                </a>
              ))}
            </nav>

            {/* Commercial Policy Guarantee Card */}
            <div className="rounded-[8px] border border-[var(--tsc-line)] bg-white p-5 shadow-[var(--shadow-warm-xs)] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[var(--tsc-line)] pb-2.5">
                <span className="text-[10px] text-[var(--tsc-muted)] uppercase tracking-wider font-semibold">
                  COMMERCIAL ASSURANCES
                </span>
                <span className="text-[10px] text-[var(--tsc-action)] font-bold uppercase">
                  STANDARD
                </span>
              </div>
              <ul className="space-y-2 text-[11px] text-[var(--tsc-ink)] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--tsc-action)] font-bold select-none">&bull;</span>
                  <span>Fixed scope &amp; fixed pricing approved in advance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--tsc-action)] font-bold select-none">&bull;</span>
                  <span>You own bespoke code and configurations upon payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--tsc-action)] font-bold select-none">&bull;</span>
                  <span>Ontario legal jurisdiction &amp; commercial standards</span>
                </li>
              </ul>
            </div>
          </aside>

          {/* Right Column: Structured Legal Clauses */}
          <main className="lg:col-span-8 space-y-12">
            <div className="p-6 sm:p-8 rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-[var(--shadow-warm-xs)] space-y-4 text-sm sm:text-base leading-relaxed text-[var(--tsc-ink)]">
              <p>
                Welcome to the website and service directory of{" "}
                <strong className="text-[var(--tsc-ink)]">{site.name}</strong>. By accessing this
                website, requesting diagnostic audit materials, or entering into an engineering
                engagement, you agree to comply with and be bound by the following commercial terms
                and delivery standards.
              </p>
            </div>

            {/* 01. Service Scope & Engagements */}
            <section id="scope" aria-labelledby="scope-heading" className="scroll-mt-28 space-y-4">
              <div className="space-y-1 border-b border-[var(--tsc-line)] pb-3">
                <PageEyebrow>01 / ENGAGEMENT STRUCTURE</PageEyebrow>
                <h2
                  id="scope-heading"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]"
                >
                  1. Service Scope &amp; Engagements
                </h2>
              </div>
              <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
                {site.name} is a software and systems engineering studio delivering custom software
                development, API integration, and autonomous automation pipelines:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-[var(--shadow-warm-xs)] space-y-2">
                  <span className="font-mono text-xs font-semibold text-[var(--tsc-action)] uppercase tracking-wider block">
                    Diagnostic &amp; Starter Tiers
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                    Managed service tiers provided on a monthly agreement. Onboarding, maintenance,
                    and monitoring are included. You may cancel prior to the next billing cycle
                    without long-term lock-in.
                  </p>
                </div>
                <div className="p-5 rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-[var(--shadow-warm-xs)] space-y-2">
                  <span className="font-mono text-xs font-semibold text-[var(--tsc-action)] uppercase tracking-wider block">
                    Custom Practice Builds
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                    Scoped, quoted, and executed under a signed Statement of Work (SOW). Scope,
                    timelines, and deliverable specifications require written client approval before
                    code is written.
                  </p>
                </div>
              </div>
            </section>

            {/* 02. Client Responsibilities */}
            <section
              id="responsibilities"
              aria-labelledby="resp-heading"
              className="scroll-mt-28 space-y-4 pt-8 border-t border-[var(--tsc-line)]"
            >
              <div className="space-y-1 border-b border-[var(--tsc-line)] pb-3">
                <PageEyebrow>02 / OPERATIONAL PREREQUISITES</PageEyebrow>
                <h2
                  id="resp-heading"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]"
                >
                  2. Client Responsibilities
                </h2>
              </div>
              <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
                To build, test, and maintain operational systems against your live workflows, you
                agree to:
              </p>
              <div className="p-6 rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-[var(--shadow-warm-xs)] space-y-4">
                <div className="space-y-1">
                  <span className="font-mono text-xs font-semibold text-[var(--tsc-action)] uppercase tracking-wider block">
                    Secure Platform Access
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                    Provide timely and secure access to required third-party tools (booking portals,
                    EMRs, practice management systems, and CRMs) via scoped API tokens or delegated
                    developer credentials.
                  </p>
                </div>
                <div className="space-y-1 pt-3 border-t border-[var(--tsc-line)]">
                  <span className="font-mono text-xs font-semibold text-[var(--tsc-action)] uppercase tracking-wider block">
                    Active Vendor Subscriptions
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                    Maintain active, funded accounts for third-party platforms utilized in your
                    infrastructure (e.g., Twilio, OpenAI/Anthropic API portals, Cal.com, or CRMs).
                  </p>
                </div>
                <div className="space-y-1 pt-3 border-t border-[var(--tsc-line)]">
                  <span className="font-mono text-xs font-semibold text-[var(--tsc-action)] uppercase tracking-wider block">
                    Change Notifications
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                    Notify our engineering team promptly of internal configuration, field schema, or
                    API changes that could impact active automation endpoints.
                  </p>
                </div>
              </div>
            </section>

            {/* 03. Intellectual Property */}
            <section
              id="ip"
              aria-labelledby="ip-heading"
              className="scroll-mt-28 space-y-4 pt-8 border-t border-[var(--tsc-line)]"
            >
              <div className="space-y-1 border-b border-[var(--tsc-line)] pb-3">
                <PageEyebrow>03 / OWNERSHIP & LICENSING</PageEyebrow>
                <h2
                  id="ip-heading"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]"
                >
                  3. Intellectual Property
                </h2>
              </div>
              <div className="p-6 rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-[var(--shadow-warm-xs)] space-y-3">
                <p className="text-sm sm:text-base text-[var(--tsc-ink)] leading-relaxed">
                  All custom components, automation scripts, and workflow pipelines built
                  specifically for your business under an approved Statement of Work belong fully to
                  you upon receipt of final payment.
                </p>
                <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed pt-2 border-t border-[var(--tsc-line)]">
                  Generic library connectors, pre-existing orchestration engines, and proprietary
                  diagnostic utilities remain the intellectual property of {site.name} and are
                  licensed to you on a perpetual, royalty-free basis for the continued operation of
                  your systems.
                </p>
              </div>
            </section>

            {/* 04. Limitation of Liability */}
            <section
              id="liability"
              aria-labelledby="liability-heading"
              className="scroll-mt-28 space-y-4 pt-8 border-t border-[var(--tsc-line)]"
            >
              <div className="space-y-1 border-b border-[var(--tsc-line)] pb-3">
                <PageEyebrow>04 / RISK ALLOCATION & WARRANTIES</PageEyebrow>
                <h2
                  id="liability-heading"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]"
                >
                  4. Limitation of Liability
                </h2>
              </div>
              <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
                While we build, test in staging, and monitor all automations for uptime and
                deterministic behavior:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-[var(--shadow-warm-xs)] space-y-2">
                  <span className="font-mono text-xs font-semibold text-[var(--tsc-ink)] uppercase tracking-wider block">
                    Third-Party Upstream Outages
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                    We are not liable for communication delays, missed appointments, or operational
                    interruptions caused by upstream provider outages (e.g. carrier SMS drops, model
                    provider downtime, or third-party CRM failures).
                  </p>
                </div>
                <div className="p-5 rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-[var(--shadow-warm-xs)] space-y-2">
                  <span className="font-mono text-xs font-semibold text-[var(--tsc-ink)] uppercase tracking-wider block">
                    Outcome Disclosures
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                    All case studies, diagnostic calculators, and scenario models on this website
                    represent illustrative estimates or historical baselines and do not constitute
                    contractual financial guarantees.
                  </p>
                </div>
              </div>
            </section>

            {/* 05. Governing Law */}
            <section
              id="governing-law"
              aria-labelledby="law-heading"
              className="scroll-mt-28 space-y-4 pt-8 border-t border-[var(--tsc-line)]"
            >
              <div className="space-y-1 border-b border-[var(--tsc-line)] pb-3">
                <PageEyebrow>05 / JURISDICTION</PageEyebrow>
                <h2
                  id="law-heading"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]"
                >
                  5. Governing Law
                </h2>
              </div>
              <div className="p-6 rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-[var(--shadow-warm-xs)] space-y-2 text-sm sm:text-base text-[var(--tsc-ink)] leading-relaxed">
                <p>
                  These Terms of Service and any separate Statement of Work shall be governed by,
                  construed, and enforced in accordance with the laws of the{" "}
                  <strong className="text-[var(--tsc-action)]">Province of Ontario</strong> and the
                  federal laws of Canada applicable therein.
                </p>
              </div>
            </section>

            {/* 06. Modifications */}
            <section
              id="modifications"
              aria-labelledby="mod-heading"
              className="scroll-mt-28 space-y-4 pt-8 border-t border-[var(--tsc-line)]"
            >
              <div className="space-y-1 border-b border-[var(--tsc-line)] pb-3">
                <PageEyebrow>06 / POLICY EVOLUTION</PageEyebrow>
                <h2
                  id="mod-heading"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]"
                >
                  6. Modifications
                </h2>
              </div>
              <div className="p-6 rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-[var(--shadow-warm-xs)] space-y-2 text-sm text-[var(--tsc-muted)] leading-relaxed">
                <p>
                  We reserve the right to modify these commercial terms as engineering standards
                  evolve. Updated terms will be published to this URL with a revised effective date.
                  Continued use of our systems following modifications constitutes agreement to the
                  updated terms.
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
