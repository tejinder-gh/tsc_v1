"use client";

/**
 * What: Mobile-only sticky bottom bar - "Book a call" plus "Quick question".
 * Why: Local-business owners browse on phones between customers; the two highest-intent
 *      actions must stay one thumb-tap away at all times.
 * How: Fixed bar hidden at md and up; both buttons are tracked CtaLinks. The layout adds
 *      a spacer so the bar never covers content.
 * From Where: TheSkillCorner marketing site build brief (mobile capture), 2026-06.
 * When: 2026-06.
 */

import { CtaLink } from "../CtaLink";

export function MobileStickyBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-navy/10 bg-paper/95 px-3 py-2.5 backdrop-blur md:hidden">
      <div className="grid grid-cols-2 gap-2">
        <CtaLink
          href="/book"
          location="mobile_sticky_bar"
          className="text-center text-sm !px-3 !py-2.5"
        >
          Book a call
        </CtaLink>
        <CtaLink
          href="/contact"
          location="mobile_sticky_bar"
          variant="secondary"
          className="text-center text-sm !px-3 !py-2"
        >
          Quick question
        </CtaLink>
      </div>
    </div>
  );
}
