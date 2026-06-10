"use client";

/**
 * What: The site's only CTA button/link primitive - styled variants plus automatic
 *       cta_clicked analytics with location and segment.
 * Why: Every CTA click must fire an event with consistent properties; one primitive
 *      guarantees no CTA ships untracked and the accent color stays CTA-only.
 * How: Wraps next/link; fires track() in onClick (navigation proceeds normally).
 *      Variants: primary (ledger), secondary (ink outline), onDark variants for ink bands.
 * From Where: TheSkillCorner marketing site build brief (analytics + design spec), 2026-06.
 * When: 2026-06.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { track } from "@/lib/analytics";
import { useSegment } from "@/lib/segment-context";

type Variant = "primary" | "secondary" | "primaryOnDark" | "secondaryOnDark" | "text";

const variantClasses: Record<Variant, string> = {
  primary:
    "inline-block rounded-lg bg-ledger px-6 py-3.5 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-ledger-dark hover:shadow-lg hover:shadow-ledger/25 active:translate-y-0 active:scale-[0.98]",
  secondary:
    "inline-block rounded-lg border-2 border-ink px-6 py-3 font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-ink hover:text-white hover:shadow-lg hover:shadow-ink/15 active:translate-y-0 active:scale-[0.98]",
  primaryOnDark:
    "inline-block rounded-lg bg-ledger px-6 py-3.5 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-ledger-dark hover:shadow-lg hover:shadow-black/30 active:translate-y-0 active:scale-[0.98]",
  secondaryOnDark:
    "inline-block rounded-lg border-2 border-white/70 px-6 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-ink active:translate-y-0 active:scale-[0.98]",
  text: "font-semibold text-ledger underline underline-offset-4 transition-colors hover:text-ledger-dark",
};

interface CtaLinkProps {
  href: string;
  location: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  label?: string;
}

export function CtaLink({
  href,
  location,
  children,
  variant = "primary",
  className = "",
  label,
}: CtaLinkProps) {
  const { segment } = useSegment();

  function handleClick() {
    track("cta_clicked", {
      location,
      segment: segment ?? "unknown",
      label: label ?? (typeof children === "string" ? children : href),
    });
  }

  return (
    <Link href={href} onClick={handleClick} className={`${variantClasses[variant]} ${className}`}>
      {children}
    </Link>
  );
}
