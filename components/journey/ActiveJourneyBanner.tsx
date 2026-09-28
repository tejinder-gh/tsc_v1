"use client";

import Link from "next/link";
import { getCommercialOfferBySlug } from "@/lib/commercial/offers";
import { useActiveJourneySummary } from "@/lib/journey";

export interface ActiveJourneyBannerProps {
  className?: string;
  packageSlug?: string;
}

export function ActiveJourneyBanner({ className, packageSlug }: ActiveJourneyBannerProps = {}) {
  const { hasActiveJourney, problemText, intentLabel } = useActiveJourneySummary();
  const offer = packageSlug ? getCommercialOfferBySlug(packageSlug) : undefined;

  if (offer) {
    return (
      <div
        className={`p-4 rounded-[8px] border border-[var(--tsc-action)]/30 bg-[var(--tsc-action)]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm font-geist shadow-xs ${className ?? "mb-8"}`}
      >
        <div className="flex items-start gap-2.5">
          <span
            className="h-2 w-2 rounded-full bg-[var(--tsc-action)] mt-1.5 shrink-0 animate-pulse"
            aria-hidden="true"
          />
          <div className="space-y-0.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-action)] font-bold block">
              ACTIVE COMMERCIAL EVALUATION &middot; {offer.tierLabel.toUpperCase()}
            </span>
            <p className="text-[var(--tsc-ink)] font-medium">
              Evaluating: <strong>{offer.publicName}</strong> ({offer.pricing.displayPrice}) &mdash;{" "}
              <span className="text-[var(--tsc-muted)]">{offer.tagline}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
          <Link href="/briefings" className="text-[var(--tsc-action)] hover:underline">
            Compare packages &rarr;
          </Link>
        </div>
      </div>
    );
  }

  if (!hasActiveJourney || (!problemText && !intentLabel)) {
    return null;
  }

  return (
    <div
      className={`p-4 rounded-[8px] border border-[var(--tsc-line)] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm font-geist shadow-xs ${className ?? "mb-8"}`}
    >
      <div className="flex items-start gap-2.5">
        <span
          className="h-2 w-2 rounded-full bg-[var(--tsc-positive)] mt-1.5 shrink-0"
          aria-hidden="true"
        />
        <div className="space-y-0.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)] block">
            CARRIED-OVER JOURNEY CONTEXT
          </span>
          <p className="text-[var(--tsc-ink)] font-medium">
            {problemText ? `“${problemText}”` : intentLabel}
          </p>
        </div>
      </div>
      <Link
        href="/#start"
        className="font-mono text-xs text-[var(--tsc-action)] hover:underline shrink-0"
      >
        Edit context in journey &rarr;
      </Link>
    </div>
  );
}
