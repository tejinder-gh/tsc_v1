/**
 * What: 404 page that preserves visitor journey.
 * Why: "No visit ends without a next step" includes dead links or outdated routes.
 * How: Editorial styled error page offering diagnosis-first and booking pathways.
 * From Where: TheSkillCorner marketing site editorial redesign, 2026.
 */

import { CtaLink } from "@/components/CtaLink";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-site px-4 py-24 text-center sm:px-6 font-geist">
      <span className="font-mono text-xs uppercase tracking-wider text-[var(--tsc-muted)] font-semibold block mb-2">
        404 &bull; ROUTE NOT FOUND
      </span>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--tsc-ink)]">
        That page does not exist.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-sm text-[var(--tsc-muted)] leading-relaxed">
        The link may have moved or been retired, but the engineering journey continues. Diagnose a
        workflow bottleneck or book a scoping consultation directly.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <CtaLink href="/#start" location="not_found" variant="primary">
          Diagnose a problem &rarr;
        </CtaLink>
        <CtaLink href="/book" location="not_found" variant="secondary">
          Book technical audit &rarr;
        </CtaLink>
      </div>
    </div>
  );
}
