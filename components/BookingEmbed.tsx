"use client";

/**
 * What: Cal.com inline booking embed with a graceful fallback when no event link is set.
 * Why: Booking is the top rung of the conversion ladder; the embed keeps it on-site.
 *      The fallback keeps /book useful before Cal.com is configured (and documents the
 *      Calendly swap path in the README).
 * How: @calcom/embed-react inline component reading NEXT_PUBLIC_CAL_LINK; fallback card
 *      offers email + quick query so the page never dead-ends.
 * From Where: TheSkillCorner marketing site build brief (booking spec), 2026-06.
 * When: 2026-06.
 */

import Cal from "@calcom/embed-react";
import { booking, site } from "@/content/site";
import { CtaLink } from "./CtaLink";

export function BookingEmbed() {
  if (!booking.calLink) {
    return (
      <div className="rounded-xl border-2 border-dashed border-navy/20 bg-mist p-8 text-center">
        <p className="font-display text-xl font-bold text-navy">Booking is almost ready</p>
        <p className="mx-auto mt-2 max-w-md leading-relaxed">
          Online scheduling is being set up (set NEXT_PUBLIC_CAL_LINK). In the meantime, email{" "}
          <a
            href={`mailto:${site.email}`}
            className="font-semibold text-blue underline underline-offset-4"
          >
            {site.email}
          </a>{" "}
          and we will send you times within one business day.
        </p>
        <div className="mt-5">
          <CtaLink href="/contact" location="book_fallback" variant="secondary">
            Send a quick query instead
          </CtaLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[640px] overflow-hidden rounded-xl border border-navy/10 bg-white">
      <Cal
        calLink={booking.calLink}
        style={{ width: "100%", height: "100%", minHeight: "640px" }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
}
