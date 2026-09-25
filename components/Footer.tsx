import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const automationNav = [
    { label: "Systems Overview", href: "/what-we-automate" },
    { label: "AI Receptionist", href: "/what-we-automate/ai-receptionist" },
    { label: "Booking & Reminders", href: "/what-we-automate/booking-and-reminders" },
    { label: "Intake & Documents", href: "/what-we-automate/intake-and-documents" },
  ];

  const digitalNav = [
    { label: "Digital Capabilities", href: "/digital-services" },
    { label: "AI Agent Development", href: "/digital-services/ai-agent-development" },
    { label: "Website Development", href: "/digital-services/website-development" },
    { label: "Digital Marketing & GEO", href: "/digital-services/digital-marketing" },
  ];

  const insightsNav = [
    { label: "Sectors & Industries", href: "/industries" },
    { label: "Knowledge Library", href: "/library" },
    { label: "Executive Briefings", href: "/newsletters" },
    { label: "About The Practice", href: "/about" },
  ];

  const governanceNav = [
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Terms of Engagement", href: "/legal/terms" },
    { label: "llms.txt (AI Index)", href: "/llms.txt" },
    { label: "pricing.md (Machine Spec)", href: "/pricing.md" },
  ];

  return (
    <footer className="border-t border-[var(--tsc-line)] bg-[var(--tsc-paper)] text-[var(--tsc-ink)] font-geist">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16 py-12 sm:py-16">
        {/* Brand & Direct Contact Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[var(--tsc-line)]">
          {/* Brand & Narrative */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-[0.14em] uppercase text-[var(--tsc-ink)]">
                {site.name}
              </span>
              <span
                role="status"
                className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"
                aria-label="System operational"
              />
            </div>
            <p className="max-w-md text-sm text-[var(--tsc-muted)] leading-relaxed">
              Autonomous workflows, bespoke software, generative engine optimization, and enterprise
              digital engineering for growing businesses and professional practices.
            </p>
          </div>

          {/* Direct Communications Rail */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-[11px] font-mono tracking-wider text-[var(--tsc-muted)] uppercase mb-2">
                North America
              </div>
              <a
                href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                className="font-mono text-xs sm:text-sm text-[var(--tsc-ink)] hover:text-[var(--tsc-action)] transition-colors block"
              >
                {site.phone}
              </a>
              <span className="text-[11px] font-mono text-[var(--tsc-muted)]">
                Direct Desk (EST)
              </span>
            </div>

            <div>
              <div className="text-[11px] font-mono tracking-wider text-[var(--tsc-muted)] uppercase mb-2">
                International / IN
              </div>
              <a
                href={`tel:${site.phoneIndia.replace(/[^+\d]/g, "")}`}
                className="font-mono text-xs sm:text-sm text-[var(--tsc-ink)] hover:text-[var(--tsc-action)] transition-colors block"
              >
                {site.phoneIndia}
              </a>
              <span className="text-[11px] font-mono text-[var(--tsc-muted)]">
                Operations (IST)
              </span>
            </div>

            <div>
              <div className="text-[11px] font-mono tracking-wider text-[var(--tsc-muted)] uppercase mb-2">
                Direct Dispatch
              </div>
              <a
                href={`mailto:${site.email}`}
                className="break-all font-mono text-xs sm:text-sm text-[var(--tsc-ink)] hover:text-[var(--tsc-action)] underline underline-offset-4 transition-colors block"
              >
                {site.email}
              </a>
              <span className="text-[11px] font-mono text-[var(--tsc-muted)]">
                Encrypted Ingestion
              </span>
            </div>
          </div>
        </div>

        {/* 4-Column Directory Index */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-sm border-b border-[var(--tsc-line)]">
          {/* Col 1: Systems & Automations */}
          <div>
            <div className="text-[11px] font-mono tracking-wider text-[var(--tsc-muted)] uppercase mb-4">
              Systems & Automations
            </div>
            <ul className="space-y-2.5">
              {automationNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[var(--tsc-ink)] hover:text-[var(--tsc-action)] transition-colors text-xs sm:text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Digital Capabilities */}
          <div>
            <div className="text-[11px] font-mono tracking-wider text-[var(--tsc-muted)] uppercase mb-4">
              Digital Capabilities
            </div>
            <ul className="space-y-2.5">
              {digitalNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[var(--tsc-ink)] hover:text-[var(--tsc-action)] transition-colors text-xs sm:text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Sectors & Insights */}
          <div>
            <div className="text-[11px] font-mono tracking-wider text-[var(--tsc-muted)] uppercase mb-4">
              Sectors & Insights
            </div>
            <ul className="space-y-2.5">
              {insightsNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[var(--tsc-ink)] hover:text-[var(--tsc-action)] transition-colors text-xs sm:text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Governance & Machine Specs */}
          <div>
            <div className="text-[11px] font-mono tracking-wider text-[var(--tsc-muted)] uppercase mb-4">
              Governance & Specs
            </div>
            <ul className="space-y-2.5">
              {governanceNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)] transition-colors text-xs sm:text-sm font-mono"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Global Offices Locality Rail */}
        <div className="py-8 border-b border-[var(--tsc-line)]">
          <div className="text-[11px] font-mono tracking-wider text-[var(--tsc-muted)] uppercase mb-4">
            Global Locality & Engineering Presence
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {site.offices.map((office) => (
              <div
                key={`${office.city}-${office.country}`}
                className="p-3 border border-[var(--tsc-line)] bg-[var(--tsc-surface)] rounded-sm"
              >
                <div className="font-mono text-xs font-semibold text-[var(--tsc-ink)]">
                  {office.city}
                </div>
                <div className="text-[11px] font-mono text-[var(--tsc-muted)] mt-0.5">
                  {office.region ? `${office.region}, ` : ""}
                  {office.country}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Hairline & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs font-mono text-[var(--tsc-muted)]">
          <div>
            &copy; {currentYear} {site.legalName}. All rights reserved.
          </div>
          <div className="tracking-wider uppercase">
            ENGINEERING &middot; AUTOMATION &middot; SYSTEMS
          </div>
        </div>
      </div>
    </footer>
  );
}
