"use client";

/**
 * What: Accessible error boundary for the Operator Command Center.
 * Why: Catches authorization barriers (401/403) and runtime rendering failures gracefully,
 *      preventing unhandled 500 crashes and providing clear operator remediation steps.
 * How: Renders an in-shell boundary with dev bypass instructions and retry triggers.
 * From Where: Operator Dashboard Resilience Audit, 2026-09.
 */

import { AlertTriangle, Lock, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { captureError } from "@/lib/telemetry";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isAuthError =
    error.message?.includes("Unauthorized") ||
    error.message?.includes("Forbidden") ||
    error.message?.includes("Operator session required");

  useEffect(() => {
    // Only capture unexpected non-auth runtime failures to error monitoring
    if (!isAuthError) {
      captureError(error, {
        category: "client_render",
        extra: { digest: error.digest },
      });
    }
  }, [error, isAuthError]);

  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-[var(--tsc-line)] rounded-2xl shadow-sm text-center font-geist">
      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
        {isAuthError ? <Lock size={22} /> : <AlertTriangle size={22} />}
      </div>

      <span className="font-mono text-xs uppercase tracking-wider text-[var(--tsc-muted)] font-semibold block mb-1">
        {isAuthError ? "Security & Access Boundary" : "Dashboard Exception"}
      </span>

      <h2 className="text-xl font-bold tracking-tight text-[var(--tsc-ink)]">
        {isAuthError ? "Operator Session Required" : "Something went wrong in Dashboard"}
      </h2>

      <p className="mt-3 text-sm leading-relaxed text-[var(--tsc-muted)]">
        {isAuthError ? (
          <>
            Access to the Operator Command Center requires an authorized session.
            <br className="hidden sm:inline" /> For local development, ensure{" "}
            <code className="px-1.5 py-0.5 rounded bg-[var(--tsc-surface)] border border-[var(--tsc-line)] font-mono text-xs text-[var(--tsc-ink)]">
              ALLOW_DEV_OPERATOR_AUTH=true
            </code>{" "}
            is present in your <code className="font-mono text-xs">.env.local</code> file.
          </>
        ) : (
          error.message || "An unexpected error occurred while rendering the dashboard view."
        )}
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--tsc-action)] text-white text-xs font-medium hover:opacity-90 transition-all cursor-pointer shadow-sm"
        >
          <RefreshCw size={14} />
          <span>Try again</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--tsc-line-strong)] bg-white text-xs font-medium text-[var(--tsc-ink)] hover:bg-[var(--tsc-surface)] transition-all"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
