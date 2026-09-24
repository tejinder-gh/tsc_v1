"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CommandPalette } from "@/components/command/CommandPalette";
import { Magnetic } from "@/components/ui/MagneticButton";
import { site } from "@/content/site";
import { useFocusTrap } from "@/lib/use-focus-trap";

export function Header() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [studioTime, setStudioTime] = useState<string>("TORONTO");
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      try {
        const timeStr = new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Toronto",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date());
        setStudioTime(`${timeStr} TORONTO`);
      } catch {
        setStudioTime("TORONTO");
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close whenever the route changes so a link tap never leaves the overlay open underneath.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname drives re-runs by design
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Toggles class for body scroll locking and mobile bar coordination
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
    <>
      <CommandPalette />
      <header className="sticky top-0 z-40 bg-[var(--tsc-paper)] border-b border-[var(--tsc-line)] font-geist">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-4 px-6 lg:px-16">
          {/* Brand / Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tsc-action)] rounded-[4px]"
          >
            <Image
              src="/logo-mark.svg"
              alt=""
              aria-hidden="true"
              width={24}
              height={24}
              className="h-6 w-6 opacity-95 transition-opacity group-hover:opacity-100"
            />
            <span className="font-geist text-sm sm:text-[15px] font-semibold tracking-[0.14em] text-[var(--tsc-ink)] uppercase">
              {site.name}
            </span>
          </Link>

          {/* Desktop Primary Nav & Studio HUD */}
          <div className="hidden md:flex items-center gap-8">
            <nav aria-label="Primary" className="flex items-center gap-8">
              {primaryNav.map((item) => {
                const current = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={`text-[13px] tracking-tight transition-colors ${
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

            {/* Studio Telemetry Pill & Search Trigger */}
            <div className="hidden xl:flex items-center gap-3 pl-4 border-l border-[var(--tsc-line)]">
              <div className="flex items-center gap-2 rounded-full border border-[var(--tsc-line)] bg-white/70 px-3 py-1 text-[11px] font-mono text-[var(--tsc-muted)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--tsc-action)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--tsc-action)]" />
                </span>
                <span className="tabular-nums font-medium text-[var(--tsc-ink)]">
                  {mounted ? studioTime : "TORONTO"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
                className="group flex items-center gap-2 rounded-[6px] border border-[var(--tsc-line)] bg-white/60 px-2.5 py-1 text-xs font-mono text-[var(--tsc-muted)] transition-all hover:border-[var(--tsc-line-strong)] hover:text-[var(--tsc-ink)] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tsc-action)]"
                aria-label="Open command palette (Press Command K)"
              >
                <Search className="h-3 w-3 text-[var(--tsc-muted)] group-hover:text-[var(--tsc-ink)]" />
                <span className="text-[11px]">Search</span>
                <kbd className="rounded border border-[var(--tsc-line)] bg-[var(--tsc-surface)] px-1 py-0.5 text-[10px] text-[var(--tsc-muted)] group-hover:text-[var(--tsc-ink)]">
                  ⌘K
                </kbd>
              </button>
            </div>
          </div>

          {/* Right Action & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Quick search button for smaller desktop / tablet */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="xl:hidden flex h-10 w-10 items-center justify-center rounded-[8px] border border-[var(--tsc-line)] text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)] hover:bg-[var(--tsc-surface)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tsc-action)]"
              aria-label="Search site (Press Command K)"
            >
              <Search className="h-4 w-4" />
            </button>

            <div className="hidden md:block">
              <Magnetic pullFactor={0.18}>
                <Link
                  href="/#start"
                  onClick={handleStartClick}
                  className="group inline-flex items-center gap-2 rounded-[8px] border border-[var(--tsc-ink)]/30 bg-white/70 px-4 py-2 text-[13px] font-medium text-[var(--tsc-ink)] shadow-[var(--shadow-warm-sm)] transition-all hover:bg-[var(--tsc-ink)] hover:text-[var(--tsc-paper)] hover:shadow-[var(--shadow-warm-md)] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tsc-action)]"
                >
                  <span>Start with a problem</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
              </Magnetic>
            </div>

            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-[8px] border border-[var(--tsc-line)] text-[var(--tsc-ink)] hover:bg-[var(--tsc-surface)] md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tsc-action)]"
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

        {/* Mobile Navigation Sheet */}
        {open && mounted
          ? createPortal(
              <div
                id="mobile-nav"
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation"
                className="fixed inset-x-0 top-20 bottom-0 z-50 flex flex-col bg-[var(--tsc-paper)] border-t border-[var(--tsc-line)] md:hidden font-geist"
              >
                <nav aria-label="Mobile" className="flex-1 px-6 py-8">
                  <ul className="flex flex-col divide-y divide-[var(--tsc-line)]">
                    {primaryNav.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="flex min-h-12 items-center text-base font-medium text-[var(--tsc-ink)] hover:text-[var(--tsc-action)]"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="border-t border-[var(--tsc-line)] p-6 bg-[var(--tsc-surface)]">
                  <Link
                    href="/#start"
                    onClick={(e) => {
                      setOpen(false);
                      handleStartClick(e);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-[8px] border border-[var(--tsc-ink)] bg-[var(--tsc-ink)] px-4 py-3 text-sm font-medium text-[var(--tsc-paper)] transition-opacity hover:opacity-90"
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
    </>
  );
}
