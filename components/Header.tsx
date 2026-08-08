"use client";

/**
 * What: Sticky site header - logo, primary nav, always-visible "Book a free audit" CTA,
 *       and a full-screen mobile menu overlay.
 * Why: The brief requires the booking CTA visible at all times (top rung of the ladder),
 *      and the mobile menu must be a fully accessible overlay (brief §6/§9: focus trap,
 *      Escape to close, body scroll lock, hamburger/close crossfade).
 * How: position:sticky with a hairline that only renders after 24px of scroll (brief §6).
 *      Mobile menu is a fixed full-screen panel portaled to document.body - the header
 *      itself uses backdrop-blur, and backdrop-filter establishes a new containing block
 *      for position:fixed descendants, which collapsed the overlay to the header's own
 *      72px box when it was nested inline. A small manual focus trap keeps Tab cycling
 *      inside the panel while open, Escape closes and returns focus to the trigger, and
 *      body scroll is locked via overflow:hidden while open.
 * From Where: TheSkillCorner marketing site build brief (CTA system), 2026-06; mobile
 *             overlay brought to §6/§9 spec 2026-08.
 * When: 2026-08.
 */

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { nav, site } from "@/content/site";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { CtaLink } from "./CtaLink";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close whenever the route changes so a link tap never leaves the overlay open underneath.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname drives re-runs by design, not read in the body
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Hides the mobile sticky bar (globals.css) whenever the overlay is open.
    document.body.classList.toggle("menu-open", open);
  }, [open]);

  useFocusTrap(open, panelRef, () => setOpen(false));

  return (
    <header
      className={`sticky top-0 z-40 bg-paper/95 backdrop-blur transition-[border-color] duration-150 ${
        scrolled ? "border-b border-line" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-site items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo-mark.svg"
            alt=""
            aria-hidden="true"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="font-display text-lg font-semibold text-navy">{site.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {nav.map((item) => {
            const current = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`border-b-2 pb-1 text-sm font-medium transition-colors ${
                  current
                    ? "border-blue-500 text-navy-700"
                    : "border-transparent text-slate-600 hover:text-navy-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <CtaLink href="/book" location="header" className="!px-4 text-sm">
              Book a free audit
            </CtaLink>
          </div>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-control border border-navy/15 text-navy md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M2 5h16M2 15h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="origin-center transition-all duration-150"
                style={
                  open
                    ? { opacity: 0, transform: "scale(0.6)" }
                    : { opacity: 1, transform: "scale(1)" }
                }
              />
              <path
                d="M4 4l12 12M16 4L4 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="origin-center transition-all duration-150"
                style={
                  open
                    ? { opacity: 1, transform: "scale(1)" }
                    : { opacity: 0, transform: "scale(0.6)" }
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {open && mounted
        ? createPortal(
            <div
              id="mobile-nav"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="fixed inset-x-0 top-[72px] bottom-0 z-50 flex flex-col overflow-y-auto bg-paper md:hidden"
            >
              <nav aria-label="Mobile" className="flex-1 px-4 py-6 sm:px-6">
                <ul className="flex flex-col gap-1">
                  {nav.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex min-h-11 items-center rounded-control px-2 text-xl font-medium text-navy hover:bg-mist"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/contact"
                      className="flex min-h-11 items-center rounded-control px-2 text-xl font-medium text-navy hover:bg-mist"
                      onClick={() => setOpen(false)}
                    >
                      Send a quick query
                    </Link>
                  </li>
                </ul>
              </nav>
              <div className="border-t border-line px-4 py-4 sm:px-6">
                <CtaLink href="/book" location="header_mobile" className="w-full">
                  Book a free audit
                </CtaLink>
              </div>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}
