"use client";

/**
 * What: Root global error boundary for Next.js App Router.
 * Why: Catches unhandled client rendering errors that occur within the root layout,
 *      logs them securely to GlitchTip via captureError, and presents an accessible recovery state.
 * How: Renders an emergency fallback with retry button; scrubs error details before capture.
 * From Where: Observability Foundation Architecture, 2026-09.
 */

import { useEffect } from "react";
import { captureError } from "@/lib/telemetry";

export default function GlobalError({
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
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[var(--tsc-paper)] p-6 font-geist text-[var(--tsc-ink)]">
        <div className="max-w-md rounded-[8px] border border-[var(--tsc-line)] bg-white p-8 text-center shadow-sm">
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--tsc-muted)] font-semibold block mb-2">
            SYSTEM NOTICE
          </span>
          <h2 className="text-xl font-bold tracking-tight text-[var(--tsc-ink)]">
            Something unexpected occurred
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--tsc-muted)]">
            An application error occurred. We have securely logged this event for investigation.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex min-h-11 items-center justify-center rounded-[8px] bg-[var(--tsc-ink)] px-5 font-geist text-xs font-mono font-medium text-[var(--tsc-paper)] transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--tsc-action)] cursor-pointer"
            >
              Try again
            </button>
            <a
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-[8px] border border-[var(--tsc-line-strong)] bg-white px-5 font-geist text-xs font-mono font-medium text-[var(--tsc-ink)] hover:bg-[var(--tsc-surface)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--tsc-action)]"
            >
              Return Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
