"use client";

/**
 * What: Sticky site header - logo, primary nav, always-visible "Book a free audit" CTA,
 *       and a mobile menu.
 * Why: The brief requires the booking CTA visible at all times (top rung of the ladder).
 * How: position:sticky with backdrop blur; mobile menu is a simple disclosure managed
 *      with useState, closing on navigation.
 * From Where: TheSkillCorner marketing site build brief (CTA system), 2026-06.
 * When: 2026-06.
 */

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { nav, site } from "@/content/site";
import { CtaLink } from "./CtaLink";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-site items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image src="/logo-mark.svg" alt="" aria-hidden="true" width={32} height={32} className="h-8 w-8" />
          <span className="font-display text-lg font-semibold text-navy">{site.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate transition-colors hover:text-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <CtaLink href="/book" location="header" className="!px-4 !py-2 text-sm">
            Book a free audit
          </CtaLink>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-md border border-navy/15 text-navy md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg aria-hidden="true" width="18" height="14" viewBox="0 0 18 14" fill="none">
              {open ? (
                <path
                  d="M2 2l14 10M16 2L2 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M1 1h16M1 7h16M1 13h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-navy/10 bg-paper px-4 py-3 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-2 py-2.5 font-medium text-navy hover:bg-mist"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="block rounded-md px-2 py-2.5 font-medium text-navy hover:bg-mist"
                onClick={() => setOpen(false)}
              >
                Send a quick query
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
