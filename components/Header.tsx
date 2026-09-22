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
import { site } from "@/content/site";
import { useFocusTrap } from "@/lib/use-focus-trap";

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

  const primaryNav = [
    { label: "Work", href: "/digital-services" },
    { label: "Explore", href: "/library" },
    { label: "Briefings", href: "/newsletters" },
  ];

  const handleStartClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      const target = document.getElementById("start");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        const focusable = target.querySelector<HTMLElement>("input, button");
        focusable?.focus();
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-[var(--tsc-paper)]/95 backdrop-blur transition-[border-color] duration-150 ${
        scrolled ? "border-b border-[var(--tsc-line)]" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-4 px-6 lg:px-16">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo-mark.svg"
            alt=""
            aria-hidden="true"
            width={28}
            height={28}
            className="h-7 w-7 opacity-95"
          />
          <span className="font-geist text-sm sm:text-[15px] font-semibold tracking-wider text-[var(--tsc-ink)] uppercase">
            {site.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {primaryNav.map((item) => {
            const current = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`text-[13px] font-medium tracking-tight transition-colors ${
                  current
                    ? "text-[var(--tsc-ink)] font-semibold"
                    : "text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <Link
              href="/#start"
              onClick={handleStartClick}
              className="inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--tsc-ink)]/30 px-3.5 py-1.5 text-[13px] font-medium text-[var(--tsc-ink)] transition-all hover:bg-[var(--tsc-ink)] hover:text-[var(--tsc-paper)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tsc-action)]"
            >
              <span>Start with a problem</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-[4px] border border-[var(--tsc-line)] text-[var(--tsc-ink)] md:hidden"
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
              className="fixed inset-x-0 top-20 bottom-0 z-50 flex flex-col overflow-y-auto bg-[var(--tsc-paper)] md:hidden"
            >
              <nav aria-label="Mobile" className="flex-1 px-6 py-8">
                <ul className="flex flex-col gap-2">
                  {primaryNav.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex min-h-11 items-center rounded-[4px] px-2 text-lg font-medium text-[var(--tsc-ink)] hover:bg-[var(--tsc-surface)]"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="border-t border-[var(--tsc-line)] px-6 py-6">
                <Link
                  href="/#start"
                  onClick={(e) => {
                    setOpen(false);
                    handleStartClick(e);
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-[4px] border border-[var(--tsc-ink)] bg-[var(--tsc-ink)] px-4 py-3 text-sm font-medium text-[var(--tsc-paper)]"
                >
                  <span>Start with a problem</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}
