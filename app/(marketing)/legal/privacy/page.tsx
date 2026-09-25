import type { Metadata } from "next";
import { EditorialHero } from "@/components/public/EditorialHero";
import { PageEyebrow } from "@/components/public/PageEyebrow";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy & Compliance | The Skill Corner",
  description:
    "The Skill Corner's data privacy practices, PIPEDA/PHIPA compliance posture, and how we handle client and operational information.",
  alternates: { canonical: "/legal/privacy" },
};

export default function PrivacyPage() {
  const sections = [
    { id: "information-collected", num: "01", title: "Information We Collect" },
    { id: "data-handling", num: "02", title: "How We Handle Data" },
    { id: "pipeda-phipa", num: "03", title: "PIPEDA & PHIPA Compliance" },
    { id: "third-parties", num: "04", title: "Third-Party Service Providers" },
    { id: "contact", num: "05", title: "Contact Representative" },
  ];

  return (
    <>
      {/* Editorial Hero */}
      <EditorialHero
        eyebrow="GOVERNANCE & DATA PRIVACY"
        headline="Data protection, minimal retention, and compliance."
        supportingCopy="How The Skill Corner handles client operational data, conforms with Canadian privacy regulations (PIPEDA and PHIPA), and enforces transit-focused minimal-retention architectures."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Legal", href: "#" },
          { label: "Privacy Policy", href: "/legal/privacy" },
        ]}
        metadata={[
          { label: "EFFECTIVE DATE", value: "June 12, 2026" },
          { label: "JURISDICTION", value: "Ontario, Canada" },
          { label: "COMPLIANCE", value: "PIPEDA & PHIPA" },
        ]}
      />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-16 py-14 sm:py-20 font-geist">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column: Sticky Table of Contents & Compliance Badges */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="space-y-2">
              <PageEyebrow>POLICY DIRECTORY</PageEyebrow>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]">
                Document sections
              </h2>
            </div>

            <nav aria-label="Privacy Policy Sections" className="space-y-1">
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

            {/* Compliance Guarantee Card */}
            <div className="rounded-[8px] border border-[var(--tsc-line)] bg-white p-5 shadow-[var(--shadow-warm-xs)] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[var(--tsc-line)] pb-2.5">
                <span className="text-[10px] text-[var(--tsc-muted)] uppercase tracking-wider font-semibold">
                  PRIVACY ARCHITECTURE
                </span>
                <span className="text-[10px] text-[var(--tsc-action)] font-bold uppercase">
                  VERIFIED
                </span>
              </div>
              <ul className="space-y-2 text-[11px] text-[var(--tsc-ink)] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--tsc-action)] font-bold select-none">&bull;</span>
                  <span>Zero customer PII database persistence</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--tsc-action)] font-bold select-none">&bull;</span>
                  <span>In-transit API execution with TTL bounded logs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--tsc-action)] font-bold select-none">&bull;</span>
                  <span>Ontario PHIPA Electronic Service Provider standards</span>
                </li>
              </ul>
            </div>
          </aside>

          {/* Right Column: Structured Legal Content */}
          <main className="lg:col-span-8 space-y-12">
            <div className="p-6 sm:p-8 rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-[var(--shadow-warm-xs)] space-y-4 text-sm sm:text-base leading-relaxed text-[var(--tsc-ink)]">
              <p>
                At <strong className="text-[var(--tsc-ink)]">{site.name}</strong>, we engineer AI
                automations and systems that connect your existing business tools. Data privacy,
                confidentiality, and compliance with Canadian privacy legislation (including PIPEDA
                and PHIPA) are structural principles embedded into our software architecture.
              </p>
            </div>

            {/* 01. Information We Collect */}
            <section
              id="information-collected"
              aria-labelledby="info-heading"
              className="scroll-mt-28 space-y-4"
            >
              <div className="space-y-1 border-b border-[var(--tsc-line)] pb-3">
                <PageEyebrow>01 / COLLECTION PARAMETERS</PageEyebrow>
                <h2
                  id="info-heading"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]"
                >
                  1. Information We Collect
                </h2>
              </div>
              <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
                We collect only the technical and operational information strictly necessary to
                fulfill our client service engagements, deliver our diagnostic tools, and respond to
                direct inquiries:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-[var(--shadow-warm-xs)] space-y-2">
                  <span className="font-mono text-xs font-semibold text-[var(--tsc-action)] uppercase tracking-wider block">
                    Prospect Data
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                    Name, email address, phone number, and business name voluntarily submitted when
                    requesting our diagnostic checklist, submitting a contact query, or booking an
                    audit call.
                  </p>
                </div>
                <div className="p-5 rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-[var(--shadow-warm-xs)] space-y-2">
                  <span className="font-mono text-xs font-semibold text-[var(--tsc-action)] uppercase tracking-wider block">
                    Client Operational Data
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                    Scoped API tokens, integration credentials, or webhook endpoints required to
                    connect your active systems (e.g. Cal.com, CRM, phone trunks, or practice
                    software).
                  </p>
                </div>
              </div>
            </section>

            {/* 02. How We Handle Data */}
            <section
              id="data-handling"
              aria-labelledby="handling-heading"
              className="scroll-mt-28 space-y-4 pt-8 border-t border-[var(--tsc-line)]"
            >
              <div className="space-y-1 border-b border-[var(--tsc-line)] pb-3">
                <PageEyebrow>02 / DATA ARCHITECTURE</PageEyebrow>
                <h2
                  id="handling-heading"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]"
                >
                  2. How We Handle Data
                </h2>
              </div>
              <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
                We operate on a{" "}
                <strong className="text-[var(--tsc-ink)]">minimal-retention, done-in-place</strong>{" "}
                data architecture:
              </p>
              <div className="space-y-4">
                <div className="p-5 rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-[var(--shadow-warm-xs)] space-y-1.5">
                  <h3 className="font-semibold text-sm sm:text-base text-[var(--tsc-ink)]">
                    No Central Database of Customer Records
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                    We do not store, compile, or broker database records of your patients, clients,
                    or customers. Your customer database stays exclusively within your existing
                    licensed software.
                  </p>
                </div>

                <div className="p-5 rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-[var(--shadow-warm-xs)] space-y-1.5">
                  <h3 className="font-semibold text-sm sm:text-base text-[var(--tsc-ink)]">
                    Transit-Focused Ephemeral Processing
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                    Automations process information strictly in transit (such as evaluating a
                    webhook payload from a booking system, formatting an SMS reminder, and handing
                    it to Twilio). Serverless operational logs preserve only bounded event statuses,
                    timestamps, and error codes without persisting message bodies.
                  </p>
                </div>

                <div className="p-5 rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-[var(--shadow-warm-xs)] space-y-1.5">
                  <h3 className="font-semibold text-sm sm:text-base text-[var(--tsc-ink)]">
                    Direct System Connectors
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                    We configure AI models and automations to read and write directly to your
                    existing compliant tools (such as EMRs, PMSs, or client intake databases) rather
                    than centralizing records on proprietary secondary servers.
                  </p>
                </div>
              </div>
            </section>

            {/* 03. PIPEDA & PHIPA Compliance */}
            <section
              id="pipeda-phipa"
              aria-labelledby="pipeda-heading"
              className="scroll-mt-28 space-y-4 pt-8 border-t border-[var(--tsc-line)]"
            >
              <div className="space-y-1 border-b border-[var(--tsc-line)] pb-3">
                <PageEyebrow>03 / CANADIAN REGULATORY FRAMEWORK</PageEyebrow>
                <h2
                  id="pipeda-heading"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]"
                >
                  3. PIPEDA &amp; PHIPA Compliance
                </h2>
              </div>
              <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
                For our professional practice clients across healthcare, dental, legal, and
                financial services:
              </p>
              <div className="p-6 rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-[var(--shadow-warm-xs)] space-y-4">
                <div className="space-y-1">
                  <span className="font-mono text-xs font-semibold text-[var(--tsc-action)] uppercase tracking-wider block">
                    PHIPA (Ontario Health Sector)
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                    We operate as an Electronic Service Provider under Ontario&apos;s Personal
                    Health Information Protection Act. We do not access, process, or persist
                    personal health information (PHI) except as strictly required to run your
                    deterministically scoped automation pathways.
                  </p>
                </div>

                <div className="space-y-1 pt-3 border-t border-[var(--tsc-line)]">
                  <span className="font-mono text-xs font-semibold text-[var(--tsc-action)] uppercase tracking-wider block">
                    PIPEDA Ten Principles
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                    We conform to the ten fair information principles of the Personal Information
                    Protection and Electronic Documents Act, ensuring accountability, limiting
                    collection, and guaranteeing strict security safeguards.
                  </p>
                </div>

                <div className="space-y-1 pt-3 border-t border-[var(--tsc-line)]">
                  <span className="font-mono text-xs font-semibold text-[var(--tsc-action)] uppercase tracking-wider block">
                    Data Residency &amp; BAA
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                    We prioritize routing and persisting operational telemetry within Canadian data
                    regions where supported by cloud vendors, and execute formal Data Protection
                    Agreements prior to deployment.
                  </p>
                </div>
              </div>
            </section>

            {/* 04. Third-Party Service Providers */}
            <section
              id="third-parties"
              aria-labelledby="providers-heading"
              className="scroll-mt-28 space-y-4 pt-8 border-t border-[var(--tsc-line)]"
            >
              <div className="space-y-1 border-b border-[var(--tsc-line)] pb-3">
                <PageEyebrow>04 / INFRASTRUCTURE & VENDORS</PageEyebrow>
                <h2
                  id="providers-heading"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]"
                >
                  4. Third-Party Service Providers
                </h2>
              </div>
              <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
                Our automations rely exclusively on vetted enterprise-tier APIs and infrastructure:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-[var(--shadow-warm-xs)] space-y-2">
                  <span className="font-mono text-xs font-semibold text-[var(--tsc-ink)] uppercase tracking-wider block">
                    Enterprise Model APIs
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                    Anthropic &amp; OpenAI API commercial endpoints. Under commercial API terms,
                    data sent through models is{" "}
                    <strong className="text-[var(--tsc-ink)]">never used to train</strong> public
                    models and is retained strictly for ephemeral abuse monitoring.
                  </p>
                </div>
                <div className="p-5 rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-[var(--shadow-warm-xs)] space-y-2">
                  <span className="font-mono text-xs font-semibold text-[var(--tsc-ink)] uppercase tracking-wider block">
                    Communication Gateways
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
                    Telephony and SMS communications are securely routed through Twilio and
                    certified telecom carriers under enterprise data transit terms.
                  </p>
                </div>
              </div>
            </section>

            {/* 05. Contact Representative */}
            <section
              id="contact"
              aria-labelledby="contact-rep-heading"
              className="scroll-mt-28 space-y-4 pt-8 border-t border-[var(--tsc-line)]"
            >
              <div className="space-y-1 border-b border-[var(--tsc-line)] pb-3">
                <PageEyebrow>05 / INQUIRIES & COMPLIANCE</PageEyebrow>
                <h2
                  id="contact-rep-heading"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]"
                >
                  5. Contact Representative
                </h2>
              </div>
              <div className="p-6 rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-[var(--shadow-warm-xs)] space-y-3 text-sm">
                <p className="text-[var(--tsc-muted)] leading-relaxed">
                  For privacy inquiries, audit records, or to request a Data Protection Agreement
                  prior to a practice deployment, contact our compliance officer:
                </p>
                <div className="font-mono text-xs text-[var(--tsc-ink)] space-y-1 pt-2 border-t border-[var(--tsc-line)]">
                  <div className="font-bold">{site.legalName}</div>
                  <div>
                    Email:{" "}
                    <a
                      href={`mailto:${site.email}`}
                      className="text-[var(--tsc-action)] hover:underline"
                    >
                      {site.email}
                    </a>
                  </div>
                  <div>
                    Location: {site.address.locality}, {site.address.region}, {site.address.country}
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
