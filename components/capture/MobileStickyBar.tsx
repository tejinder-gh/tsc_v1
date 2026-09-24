"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";
import { useSegment } from "@/lib/segment-context";
import { CtaLink } from "../CtaLink";

export function MobileStickyBar() {
  const { segment } = useSegment();
  const pathname = usePathname();

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
    <div className="mobile-sticky-bar fixed inset-x-0 bottom-0 z-30 flex h-14 items-center bg-[var(--tsc-paper)]/95 border-t border-[var(--tsc-line)] px-4 backdrop-blur md:hidden font-geist">
      <div className="grid w-full grid-cols-2 gap-2.5">
        <Link
          href="/#start"
          onClick={(e) => {
            track("cta_clicked", {
              location: "mobile_sticky_bar",
              segment: segment ?? "unknown",
              label: "Start with a problem",
            });
            handleStartClick(e);
          }}
          className="inline-flex min-h-10 items-center justify-center rounded-[8px] border border-[var(--tsc-line-strong)] bg-transparent text-center text-xs font-medium text-[var(--tsc-ink)] transition-colors hover:bg-[var(--tsc-surface)]"
        >
          Start with a problem
        </Link>
        <CtaLink
          href="/book"
          location="mobile_sticky_bar"
          className="!min-h-10 text-center text-xs"
        >
          Book audit →
        </CtaLink>
      </div>
    </div>
  );
}
