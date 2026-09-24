"use client";

/**
 * What: The site's Button/Link primitive (brief §6) - styled variants plus automatic
 *       cta_clicked analytics with location and segment.
 * Why: Every CTA click must fire an event with consistent properties; one primitive
 *      guarantees no CTA ships untracked and the blue accent stays CTA-only.
 * How: Wraps next/link; fires track() in onClick (navigation proceeds normally). Button
 *      variants (primary/secondary/onDark) match brief §6's radius/height/weight spec;
 *      "text" is the brief's separate Link style (underlined, blue, hover navy) for CTAs
 *      that read as inline text rather than a button.
 * From Where: TheSkillCorner marketing site build brief (analytics + design spec), 2026-06;
 *             brought to the §6 button/link spec 2026-08.
 * When: 2026-06.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { track } from "@/lib/analytics";
import { useSegment } from "@/lib/segment-context";

type Variant = "primary" | "secondary" | "primaryOnDark" | "secondaryOnDark" | "action" | "text";

const buttonBase =
  "inline-flex min-h-11 items-center justify-center rounded-[8px] px-5 font-geist text-sm font-medium transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tsc-action)] select-none";

const variantClasses: Record<Variant, string> = {
  primary: `${buttonBase} bg-[var(--tsc-ink)] text-[var(--tsc-paper)] hover:opacity-90 active:scale-[0.99]`,
  secondary: `${buttonBase} border border-[var(--tsc-line-strong)] bg-transparent text-[var(--tsc-ink)] hover:bg-[var(--tsc-surface)] active:bg-[var(--tsc-line)]`,
  primaryOnDark: `${buttonBase} bg-[var(--tsc-paper)] text-[var(--tsc-ink)] hover:bg-white active:scale-[0.99]`,
  secondaryOnDark: `${buttonBase} border border-white/40 bg-transparent text-white hover:bg-white/10 active:bg-white/20`,
  action: `${buttonBase} bg-[var(--tsc-action)] text-white hover:opacity-95 active:scale-[0.99]`,
  text: "font-mono text-xs text-[var(--tsc-ink)] hover:text-[var(--tsc-action)] underline underline-offset-4 transition-colors",
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
