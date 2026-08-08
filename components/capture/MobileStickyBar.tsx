"use client";

/**
 * What: Mobile-only sticky bottom bar - "Call" plus "Book".
 * Why: A local-business owner browsing on a phone often wants to dial, not fill a form
 *      (brief §8.2); the two highest-intent actions must stay one thumb-tap away.
 * How: Fixed bar hidden at md and up. "Call" is a plain tel: link (CtaLink wraps next/link,
 *      which is unnecessary for a protocol link) tracked the same way as other CTAs; "Book"
 *      is a tracked CtaLink. The layout adds a spacer so the bar never covers content.
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
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-navy/10 bg-paper/95 px-3 py-2.5 backdrop-blur md:hidden">
      <div className="grid grid-cols-2 gap-2">
        <a
          href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
          onClick={() =>
            track("cta_clicked", {
              location: "mobile_sticky_bar",
              segment: segment ?? "unknown",
              label: "Call",
            })
          }
          className="inline-flex items-center justify-center rounded-lg border border-navy bg-transparent px-3 py-2.5 text-center text-sm font-semibold text-navy transition-colors hover:bg-mist"
        >
          Call
        </a>
        <CtaLink
          href="/book"
          location="mobile_sticky_bar"
          className="text-center text-sm !px-3 !py-2.5"
        >
          Book
        </CtaLink>
      </div>
    </div>
  );
}
