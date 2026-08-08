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

type Variant = "primary" | "secondary" | "primaryOnDark" | "secondaryOnDark" | "text";

const buttonBase =
  "inline-flex min-h-12 items-center justify-center rounded-control px-6 font-display text-[15px] font-medium leading-5 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500";

const variantClasses: Record<Variant, string> = {
  primary: `${buttonBase} bg-blue-500 text-white shadow-sm hover:bg-blue-700 hover:shadow-md active:bg-navy-700`,
  secondary: `${buttonBase} border-2 border-navy-700 bg-transparent text-navy-700 hover:bg-mist active:bg-line`,
  primaryOnDark: `${buttonBase} bg-blue-500 text-white shadow-sm hover:bg-blue-700 hover:shadow-md active:bg-navy-900`,
  secondaryOnDark: `${buttonBase} border-2 border-white/70 bg-transparent text-white hover:bg-white/10 active:bg-white/20`,
  text: "font-semibold text-blue-500 underline underline-offset-[3px] decoration-[1.5px] transition-colors hover:text-navy-700",
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
