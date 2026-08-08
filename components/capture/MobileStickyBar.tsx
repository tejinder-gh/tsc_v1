"use client";

/**
 * What: Mobile-only sticky bottom bar - "Call" plus "Book".
 * Why: A local-business owner browsing on a phone often wants to dial, not fill a form
 *      (brief §8.2); the two highest-intent actions must stay one thumb-tap away.
 * How: Fixed 56px bar hidden at md and up. "Call" is a plain tel: link (CtaLink wraps
 *      next/link, which is unnecessary for a protocol link) tracked the same way as other
 *      CTAs; "Book" is a tracked CtaLink. The layout adds a spacer so the bar never covers
 *      content. Hidden while the mobile menu is open (brief §8.2) via the "menu-open" body
 *      class Header toggles - see the .mobile-sticky-bar rule in globals.css.
 * From Where: TheSkillCorner marketing site build brief (mobile capture), 2026-06;
 *             call button added 2026-08 once a real phone number existed.
 * When: 2026-06.
 */

import { site } from "@/content/site";
import { track } from "@/lib/analytics";
import { useSegment } from "@/lib/segment-context";
import { CtaLink } from "../CtaLink";

export function MobileStickyBar() {
  const { segment } = useSegment();

  return (
    <div className="mobile-sticky-bar fixed inset-x-0 bottom-0 z-30 flex h-14 items-center bg-paper/95 px-3 shadow-[0_-1px_2px_rgb(8_33_91_/_0.06)] backdrop-blur md:hidden">
      <div className="grid w-full grid-cols-2 gap-2">
        <a
          href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
          onClick={() =>
            track("cta_clicked", {
              location: "mobile_sticky_bar",
              segment: segment ?? "unknown",
              label: "Call",
            })
          }
          className="inline-flex min-h-11 items-center justify-center rounded-control border-2 border-navy-700 bg-transparent text-center text-sm font-display font-medium text-navy-700 transition-colors hover:bg-mist"
        >
          Call
        </a>
        <CtaLink
          href="/book"
          location="mobile_sticky_bar"
          className="!min-h-11 text-center text-sm"
        >
          Book
        </CtaLink>
      </div>
    </div>
  );
}
