/**
 * What: 404 page that still offers conversion rungs.
 * Why: "No visit ends without a next step" includes dead links from old ads.
 * How: Static page with booking, services, and checklist paths.
 * From Where: TheSkillCorner marketing site build brief (conversion ladder), 2026-06.
 * When: 2026-06.
 */

import { CtaLink } from "@/components/CtaLink";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-site px-4 py-24 text-center sm:px-6">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">That page is not here.</h1>
      <p className="mx-auto mt-4 max-w-md text-lg">
        The link may be old, but the next step still works. Find your industry, or just ask us
        directly.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <CtaLink href="/for" location="not_found" variant="secondary">
          Find your industry
        </CtaLink>
        <CtaLink href="/book" location="not_found">
          Book a free audit
        </CtaLink>
      </div>
    </div>
  );
}
