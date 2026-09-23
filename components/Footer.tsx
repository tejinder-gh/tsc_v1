import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const mainNav = [
    { label: "Work", href: "/digital-services" },
    { label: "Explore", href: "/library" },
    { label: "Briefings", href: "/newsletters" },
    { label: "About", href: "/about" },
  ];

  const legalNav = [
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Terms", href: "/legal/terms" },
  ];

  return (
    <footer className="border-t border-[var(--tsc-line)] bg-[var(--tsc-paper)] text-[var(--tsc-ink)] font-geist">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Brand & Descriptor (Cols 1-6) */}
          <div className="md:col-span-6 space-y-3">
            <span className="text-sm font-semibold tracking-[0.14em] uppercase text-[var(--tsc-ink)]">
              {site.name}
            </span>
            <p className="max-w-md text-sm text-[var(--tsc-muted)] leading-relaxed">
              Systems, software, automation, and practical digital work.
            </p>
          </div>

          {/* Navigation Columns (Cols 7-12) */}
          <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
            {/* Primary Navigation */}
            <div>
              <div className="text-[11px] font-mono tracking-wider text-[var(--tsc-muted)] uppercase mb-3">
                Index
              </div>
              <ul className="space-y-2">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[var(--tsc-ink)] hover:text-[var(--tsc-action)] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <div className="text-[11px] font-mono tracking-wider text-[var(--tsc-muted)] uppercase mb-3">
                Legal
              </div>
              <ul className="space-y-2">
                {legalNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Email */}
            <div className="col-span-2 min-w-0 sm:col-span-1">
              <div className="text-[11px] font-mono tracking-wider text-[var(--tsc-muted)] uppercase mb-3">
                Direct
              </div>
              <div>
                <a
                  href={`mailto:${site.email}`}
                  className="break-all font-mono text-xs sm:text-sm text-[var(--tsc-ink)] hover:text-[var(--tsc-action)] underline underline-offset-4 transition-colors"
                >
                  {site.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Hairline & Copyright */}
        <div className="mt-12 pt-6 border-t border-[var(--tsc-line)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs font-mono text-[var(--tsc-muted)]">
          <div>
            &copy; {currentYear} {site.legalName}
          </div>
          <div>ENGINEERING &middot; AUTOMATION &middot; SYSTEMS</div>
        </div>
      </div>
    </footer>
  );
}
