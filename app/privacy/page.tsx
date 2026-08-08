import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy & Compliance",
  description:
    "The Skill Corner's data privacy practices, PIPEDA/PHIPA compliance posture, and how we handle client and patient information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <header className="mb-10">
        <p className="font-body font-bold text-sm uppercase tracking-widest text-blue">
          Compliance
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.02em] text-navy sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-slate">Last updated: June 12, 2026</p>
      </header>

      <div className="prose prose-slate max-w-none space-y-6 leading-relaxed text-slate">
        <p>
          At <strong>{site.name}</strong>, we build AI automations that connect your existing
          business tools. Data privacy, confidentiality, and compliance with Canadian privacy
          regulations (including PIPEDA and PHIPA) are core to our software design and operational
          practices.
        </p>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold text-navy">1. Information We Collect</h2>
          <p>
            We only collect information necessary to fulfill our service engagements, deliver our
            lead magnets, and respond to your direct queries:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Prospect Data:</strong> Contact details (name, email, phone number, business
              name) provided when requesting our checklist, submitting a contact form, or booking an
              audit.
            </li>
            <li>
              <strong>Client Operational Data:</strong> API tokens, software credentials, or webhook
              endpoints required to integrate your systems (e.g., Cal.com, CRM, SMS/voice gateways).
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold text-navy">2. How We Handle Data</h2>
          <p>
            We operate on a <strong>minimal-retention, done-in-place</strong> data architecture:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>No Central Database:</strong> We do not store or compile database records of
              your customers, patients, or clients.
            </li>
            <li>
              <strong>Transit-Only Processing:</strong> Automations process data in transit (e.g.,
              receiving a webhook payload from your booking system, formatting an SMS reminder, and
              handing it to Twilio). Once successfully delivered, the transit logs are purged.
            </li>
            <li>
              <strong>Use of Existing Systems:</strong> We configure AI models to read and write
              directly to your existing, compliant systems (such as electronic medical records or
              client intake software) rather than hosting your records ourselves.
            </li>
          </ul>
        </section>

        <section className="space-y-3 font-medium border-l-4 border-blue/50 bg-mist/30 p-4 rounded-r-xl">
          <h2 className="font-display text-xl font-bold text-navy">3. PIPEDA & PHIPA Compliance</h2>
          <p>
            For our professional practice clients (medical clinics, dental offices, law firms, and
            accounting practices):
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>
              <strong>PHIPA (Ontario):</strong> We act as a "Health Information Network Provider"
              (HINP) or electronic service provider under Ontario’s Personal Health Information
              Protection Act. We do not use or access personal health information (PHI) except as
              strictly required to run your automation pathways.
            </li>
            <li>
              <strong>PIPEDA:</strong> We conform to the ten fair information principles of the
              Personal Information Protection and Electronic Documents Act.
            </li>
            <li>
              <strong>Data Residency:</strong> We prioritize routing and storing client logs within
              Canadian data centers where available and contractually supported by cloud vendors.
            </li>
            <li>
              <strong>Business Associate Agreements:</strong> For medical practices, we sign
              standard Business Associate Agreements or custom data protection agreements prior to
              beginning any custom build.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold text-navy">
            4. Third-Party Service Providers
          </h2>
          <p>
            Our builds rely on industry-standard infrastructure and APIs. When we implement an
            automation, we use:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>OpenAI / Anthropic APIs:</strong> We use enterprise API developer portals.
              Under enterprise terms, inputs sent to their API are <strong>never</strong> used to
              train their models and are retained for abuse monitoring for a maximum of 30 days.
            </li>
            <li>
              <strong>Communication Gateways:</strong> SMS and voice traffic is routed through
              Twilio or standard carrier APIs under secure data transit terms.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold text-navy">5. Contact Information</h2>
          <p>
            If you have questions about this Privacy Policy or wish to request details about data
            handling for a custom integration, please contact our privacy representative:
          </p>
          <p className="mt-2 text-navy">
            <strong>{site.legalName}</strong>
            <br />
            Email:{" "}
            <a href={`mailto:${site.email}`} className="font-semibold text-blue underline">
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
