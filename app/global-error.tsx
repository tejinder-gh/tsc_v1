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
      <body className="flex min-h-screen items-center justify-center bg-slate-50 p-6 font-sans text-slate-900">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Something unexpected occurred
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            An application error occurred. We have securely logged this event for investigation.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Try again
            </button>
            <a
              href="/"
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              Return Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
