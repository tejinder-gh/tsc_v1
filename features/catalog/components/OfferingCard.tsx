"use client";

import Link from "next/link";
import type { Offering } from "../domain/types";

export interface OfferingCardProps {
  offering: Offering;
  reasonText?: string;
}

function getKindBadge(kind: Offering["kind"]) {
  switch (kind) {
    case "automation":
      return "AUTOMATION";
    case "service":
      return "DIGITAL SERVICE";
    case "newsletter":
      return "BRIEFING";
    case "resource":
      return "RESOURCE";
    case "tool":
      return "TOOL";
    default:
      return "SYSTEM";
  }
}

export function OfferingCard({ offering, reasonText }: OfferingCardProps) {
  const kindBadge = getKindBadge(offering.kind);

  return (
    <article className="group py-6 px-3 -mx-3 rounded-[4px] hover:bg-[var(--tsc-surface)]/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 font-geist">
      <div className="space-y-1.5 max-w-3xl">
        {/* Top Badges / Monospace Label */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[11px] font-semibold tracking-wider text-[var(--tsc-muted)] uppercase">
            [{kindBadge}]
          </span>
          {offering.featured && (
            <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-[4px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-[var(--tsc-ink)]">
              Featured
            </span>
          )}
          {offering.status === "beta" && (
            <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-[4px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-[var(--tsc-muted)]">
              Beta
            </span>
          )}
          {offering.deliveryModel && (
            <span className="font-mono text-[11px] text-[var(--tsc-muted)]">
              {offering.deliveryModel}
            </span>
          )}
        </div>

        {/* Title & Tagline */}
        <div className="space-y-0.5">
          <Link
            href={offering.canonicalUrl}
            className="font-semibold text-lg sm:text-xl text-[var(--tsc-ink)] group-hover:text-[var(--tsc-action)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tsc-action)]"
          >
            {offering.title}
          </Link>
          {offering.tagline && (
            <p className="text-xs sm:text-sm font-mono text-[var(--tsc-muted)]">
              {offering.tagline}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--tsc-muted)] leading-relaxed line-clamp-2">
          {offering.shortDescription}
        </p>

        {/* Structured recommendation reason badge */}
        {reasonText && (
          <div className="pt-1">
            <span className="inline-block font-mono text-xs text-[var(--tsc-action)]">
              Match: {reasonText}
            </span>
          </div>
        )}
      </div>

      {/* Action / Arrow */}
      <div className="flex items-center gap-4 shrink-0 pt-2 md:pt-0">
        <Link
          href={offering.canonicalUrl}
          className="inline-flex items-center gap-2 font-mono text-xs font-medium text-[var(--tsc-muted)] group-hover:text-[var(--tsc-ink)] group-hover:translate-x-1 transition-all select-none"
        >
          <span>{offering.cta.label || "View details"}</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </article>
  );
}
