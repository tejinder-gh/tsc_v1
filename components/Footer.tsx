/**
 * What: Site footer - service and industry link columns, contact details, compliance line.
 * Why: Footer links give every page paths to the conversion ladder and feed internal SEO
 *      links to the industry pages (the ad/SEO engine).
 * How: Server component; link lists derive from typed content so new industries appear
 *      automatically.
 * From Where: TheSkillCorner marketing site build brief, 2026-06.
 * When: 2026-06.
 */

import Image from "next/image";
import Link from "next/link";
import { industries } from "@/content/industries";
import { services } from "@/content/services";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="mx-auto grid max-w-site gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <Image
            src="/logo-full-on-navy.png"
            alt={site.name}
            width={160}
            height={40}
            className="h-8 w-auto"
          />
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            AI automations for local businesses and professional practices. Audit, build, run - and
            your week gets shorter.
          </p>
          <p className="mt-4 flex flex-col gap-1 text-sm">
            <a
              href={`mailto:${site.email}`}
              className="underline underline-offset-4 hover:text-white"
            >
              {site.email}
            </a>
            <a
              href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
              className="underline underline-offset-4 hover:text-white"
            >
              {site.phone}
            </a>
            <a
              href={`tel:${site.phoneIndia.replace(/[^+\d]/g, "")}`}
              className="underline underline-offset-4 hover:text-white"
            >
              {site.phoneIndia}
            </a>
          </p>
        </div>

        <nav aria-label="Services">
          <p className="font-display font-semibold text-white">What we automate</p>
          <ul className="mt-3 space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/what-we-automate/${s.slug}`} className="hover:text-white">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Industries">
          <p className="font-display font-semibold text-white">Who we work with</p>
          <ul className="mt-3 space-y-2 text-sm">
            {industries.map((i) => (
              <li key={i.slug}>
                <Link href={`/industries/${i.slug}`} className="hover:text-white">
                  {i.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <p className="font-display font-semibold text-white">Next step</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/book" className="hover:text-white">
                Book a free automation audit
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Send a quick query
              </Link>
            </li>
            <li>
              <Link href="/checklist" className="hover:text-white">
                Free automation checklist
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-site flex-col gap-4 px-4 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <p>
              &copy; {new Date().getFullYear()} {site.legalName}. {site.address.locality},{" "}
              {site.address.region}.
            </p>
            <Link href="/legal/privacy" className="hover:text-white underline underline-offset-2">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="hover:text-white underline underline-offset-2">
              Terms of Service
            </Link>
          </div>
          <p>PIPEDA/PHIPA-aware data handling for clinics, dental offices, and law firms.</p>
        </div>
      </div>
      <div className="bg-navy-900">
        <p className="mx-auto max-w-site px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.16em] text-white sm:px-6">
          {site.offices.map((office) => office.city).join(" · ")}
        </p>
      </div>
    </footer>
  );
}
