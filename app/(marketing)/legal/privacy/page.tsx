import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy & Compliance",
  description:
    "The Skill Corner's data privacy practices, PIPEDA/PHIPA compliance posture, and how we handle client and operational information.",
  alternates: { canonical: "/legal/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 font-geist">
      <header className="mb-10 pb-6 border-b border-[var(--tsc-line)]">
        <span className="font-mono text-xs uppercase tracking-wider text-[var(--tsc-muted)] font-semibold block mb-2">
          COMPLIANCE &amp; DATA PRIVACY
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--tsc-ink)]">
          Privacy Policy
        </h1>
        <p className="mt-2 font-mono text-xs text-[var(--tsc-muted)]">
          Last updated: June 12, 2026
        </p>
      </header>

      <div className="space-y-6 text-sm leading-relaxed text-[var(--tsc-ink)]/85">
        <p>
          At <strong className="text-[var(--tsc-ink)]">{site.name}</strong>, we build AI automations
          that connect your existing business tools. Data privacy, confidentiality, and compliance
          with Canadian privacy regulations (including PIPEDA and PHIPA) are core to our software
          design and operational practices.
        </p>

        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-bold text-[var(--tsc-ink)]">1. Information We Collect</h2>
          <p>
            We only collect information necessary to fulfill our service engagements, deliver our
            lead magnets, and respond to your direct queries:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[var(--tsc-ink)]">Prospect Data:</strong> Contact details
              (name, email, phone number, business name) provided when requesting our checklist,
              submitting a contact form, or booking an audit.
            </li>
            <li>
              <strong className="text-[var(--tsc-ink)]">Client Operational Data:</strong> API
              tokens, software credentials, or webhook endpoints required to integrate your systems
              (e.g., Cal.com, CRM, SMS/voice gateways).
            </li>
          </ul>
        </section>

        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-bold text-[var(--tsc-ink)]">2. How We Handle Data</h2>
          <p>
            We operate on a{" "}
            <strong className="text-[var(--tsc-ink)]">minimal-retention, done-in-place</strong> data
            architecture:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[var(--tsc-ink)]">No Central Database:</strong> We do not
              store or compile database records of your customers, patients, or clients.
            </li>
            <li>
              <strong className="text-[var(--tsc-ink)]">Transit-Focused Processing:</strong>{" "}
              Automations process data in transit (e.g., receiving a webhook payload from your
              booking system, formatting an SMS reminder, and handing it to Twilio). Hosting server
              logs retain only bounded operational event metadata (such as event status, delivery
              timestamps, and error codes) without persisting customer lead bodies.
            </li>
            <li>
              <strong className="text-[var(--tsc-ink)]">Use of Existing Systems:</strong> We
              configure AI models to read and write directly to your existing, compliant systems
              (such as electronic medical records or client intake software) rather than hosting
              your records ourselves.
            </li>
          </ul>
        </section>

        <section className="space-y-3 font-normal border-l-2 border-[var(--tsc-action)] bg-[var(--tsc-surface)] p-4 rounded-[6px]">
          <h2 className="text-base font-bold text-[var(--tsc-ink)]">
            3. PIPEDA &amp; PHIPA Compliance
          </h2>
          <p>
            For our professional practice clients (medical clinics, dental offices, law firms, and
            accounting practices):
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs">
            <li>
              <strong className="text-[var(--tsc-ink)]">PHIPA (Ontario):</strong> We act as an
              electronic service provider under Ontario&apos;s Personal Health Information
              Protection Act. We do not use or access personal health information (PHI) except as
              strictly required to run your automation pathways.
            </li>
            <li>
              <strong className="text-[var(--tsc-ink)]">PIPEDA:</strong> We conform to the ten fair
              information principles of the Personal Information Protection and Electronic Documents
              Act.
            </li>
            <li>
              <strong className="text-[var(--tsc-ink)]">Data Residency:</strong> We prioritize
              routing and storing client logs within Canadian data centers where available and
              contractually supported by cloud vendors.
            </li>
            <li>
              <strong className="text-[var(--tsc-ink)]">Business Associate Agreements:</strong> For
              professional practices, we sign standard data protection agreements prior to beginning
              any custom build.
            </li>
          </ul>
        </section>

        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-bold text-[var(--tsc-ink)]">
            4. Third-Party Service Providers
          </h2>
          <p>
            Our builds rely on industry-standard infrastructure and APIs. When we implement an
            automation, we use:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[var(--tsc-ink)]">OpenAI / Anthropic APIs:</strong> We use
              enterprise API developer portals. Under enterprise terms, inputs sent to their API are{" "}
              <strong className="text-[var(--tsc-ink)]">never</strong> used to train their models
              and are retained for abuse monitoring for a maximum of 30 days.
            </li>
            <li>
              <strong className="text-[var(--tsc-ink)]">Communication Gateways:</strong> SMS and
              voice traffic is routed through Twilio or standard carrier APIs under secure data
              transit terms.
            </li>
          </ul>
        </section>

        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-bold text-[var(--tsc-ink)]">5. Contact Information</h2>
          <p>
            If you have questions about this Privacy Policy or wish to request details about data
            handling for a custom integration, please contact our privacy representative:
          </p>
          <p className="mt-2 text-[var(--tsc-ink)]">
            <strong>{site.legalName}</strong>
            <br />
            Email:{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-mono font-medium text-[var(--tsc-ink)] underline underline-offset-4"
            >
              {site.email}
            </a>
            <br />
            Location: {site.address.locality}, {site.address.region}, {site.address.country}
          </p>
        </section>
      </div>
    </article>
  );
}
