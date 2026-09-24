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

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { booking, site } from "@/content/site";
import { trackEvent } from "@/lib/telemetry";
import { CtaLink } from "./CtaLink";

export function BookingEmbed() {
  useEffect(() => {
    if (!booking.calLink) return;

    trackEvent("booking_viewed", { location: "booking_embed" });

    let unmounted = false;
    (async () => {
      try {
        const cal = await getCalApi();
        if (unmounted) return;

        // Interaction started: user selected an event type / slot
        cal("on", {
          action: "eventTypeSelected",
          callback: () => {
            trackEvent("booking_started", { location: "booking_embed" });
          },
        });

        // Authoritative booking completion callback
        cal("on", {
          action: "bookingSuccessful",
          callback: () => {
            trackEvent("booking_completed", { location: "booking_embed" });
          },
        });
      } catch {
        // Fail-open: booking telemetry must never disrupt embed
      }
    })();

    return () => {
      unmounted = true;
    };
  }, []);

  if (!booking.calLink) {
    return (
      <div className="rounded-[8px] border border-dashed border-[var(--tsc-line-strong)] bg-[var(--tsc-surface)]/50 p-8 text-center font-geist">
        <p className="text-lg font-bold text-[var(--tsc-ink)]">
          Booking calendar is being initialized
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--tsc-muted)] leading-relaxed">
          Online scheduling is being configured. In the meantime, email{" "}
          <a
            href={`mailto:${site.email}`}
            className="font-medium text-[var(--tsc-action)] underline underline-offset-4"
          >
            {site.email}
          </a>{" "}
          and we will coordinate times with you directly.
        </p>
        <div className="mt-5">
          <CtaLink href="/contact" location="book_fallback" variant="secondary">
            Send a direct query instead
          </CtaLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[640px] overflow-hidden rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-sm">
      <Cal
        calLink={booking.calLink}
        style={{ width: "100%", height: "100%", minHeight: "640px" }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
}
