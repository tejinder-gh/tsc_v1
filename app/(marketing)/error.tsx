"use client";

/**
 * What: Marketing route group error boundary.
 * Why: Catches unhandled client or server exceptions within (marketing) pages,
 *      logs them securely to telemetry, and provides a branded, high-trust recovery path.
 * How: Renders an editorial recovery card with retry button and direct engineering contact.
 */

import { useEffect } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import { captureError } from "@/lib/telemetry";

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureError(error, {
      category: "client_render",
      extra: { digest: error.digest },
    });
  }, [error]);

  return (
    <div className="mx-auto max-w-site px-6 py-20 sm:py-28 text-center font-geist">
      <div className="mx-auto max-w-lg rounded-[10px] border border-[var(--tsc-line-strong)] bg-white p-8 sm:p-10 shadow-[var(--shadow-warm-sm)]">
        <span className="font-mono text-xs uppercase tracking-wider text-[var(--tsc-action)] font-semibold block mb-2">
          SYSTEM EXCEPTION &bull; RECOVERY
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]">
          An unexpected interruption occurred.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--tsc-muted)]">
          The requested system view experienced an error. Our engineering telemetry has captured this
          event for triage.
        </p>

        {error.digest && (
          <div className="mt-4 p-2 bg-[var(--tsc-surface)] rounded border border-[var(--tsc-line)] font-mono text-[11px] text-[var(--tsc-muted)]">
            Trace ID: {error.digest}
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-11 items-center justify-center rounded-[8px] bg-[var(--tsc-ink)] px-5 font-geist text-xs font-mono font-medium text-[var(--tsc-paper)] transition-all hover:bg-[var(--tsc-action)] focus:outline-none focus:ring-2 focus:ring-[var(--tsc-action)] cursor-pointer"
          >
            Try again &rarr;
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-[8px] border border-[var(--tsc-line)] bg-white px-5 font-geist text-xs font-mono font-medium text-[var(--tsc-ink)] hover:bg-[var(--tsc-surface)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--tsc-action)]"
          >
            Studio Overview
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--tsc-line)] text-xs text-[var(--tsc-muted)] font-mono">
          Urgent assistance:{" "}
          <a href={`mailto:${site.email}`} className="text-[var(--tsc-action)] underline">
            {site.email}
          </a>
        </div>
      </div>
    </div>
  );
}
