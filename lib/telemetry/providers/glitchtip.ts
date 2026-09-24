/**
 * What: GlitchTip integration adapter using official @sentry/nextjs SDK.
 * Why: GlitchTip is Sentry v7 API compatible. Using the official SDK provides battle-tested
 *      error handling and source-map resolution while beforeSend guarantees defensive sanitization.
 * How: Initializes Sentry with autoSessionTracking: false, conservative performance sampling,
 *      and delegates captureException/captureMessage with enriched tags and sanitized context.
 * From Where: Observability Foundation Architecture, 2026-09.
 */

import * as Sentry from "@sentry/nextjs";
import { getTelemetryConfig } from "../config";
import { sanitizeObject, sanitizeSentryEvent, sanitizeString } from "../scrubber";
import type { ErrorCaptureContext, TelemetryContext } from "../types";

let isInitialized = false;

export function initGlitchTip(): boolean {
  if (isInitialized) return true;

  const config = getTelemetryConfig();
  if (!config.errorMonitoring.enabled || !config.errorMonitoring.dsn) {
    return false;
  }

  try {
    Sentry.init({
      dsn: config.errorMonitoring.dsn,
      environment: config.environment,
      release: config.releaseId,
      // Conservative performance tracing to avoid excessive load
      tracesSampleRate: 0.05,
      // Defensive PII, secret, and payment data scrubbing
      beforeSend: (event) => sanitizeSentryEvent(event),
      // Prevent noisy console output when DSN or network issues arise
      debug: false,
      sendClientReports: false,
      ...({ autoSessionTracking: false } as Record<string, unknown>),
    });
    isInitialized = true;
    return true;
  } catch {
    // Fail-open: initialization error must never crash the application
    return false;
  }
}

export function captureGlitchTipError(
  error: unknown,
  context?: ErrorCaptureContext,
): string | undefined {
  const config = getTelemetryConfig();
  if (!config.errorMonitoring.enabled || !config.errorMonitoring.dsn) {
    return undefined;
  }

  if (!isInitialized) {
    const ok = initGlitchTip();
    if (!ok) return undefined;
  }

  try {
    const errObj =
      error instanceof Error
        ? error
        : new Error(typeof error === "string" ? sanitizeString(error) : "Unknown Error");

    const category = context?.category ?? "unhandled";
    const route = context?.route;
    const correlationId = context?.correlationId;

    return Sentry.captureException(errObj, {
      tags: {
        category,
        ...(route ? { route } : {}),
        ...(correlationId ? { correlationId } : {}),
      },
      extra: context?.extra
        ? (sanitizeObject(context.extra) as Record<string, unknown>)
        : undefined,
    });
  } catch {
    // Fail-open: error monitoring must never break the host application
    return undefined;
  }
}

export function setGlitchTipContext(context: TelemetryContext): void {
  const config = getTelemetryConfig();
  if (!config.errorMonitoring.enabled || !isInitialized) return;

  try {
    if (context.route) {
      Sentry.setTag("route", sanitizeString(context.route));
    }
    if (context.correlationId) {
      Sentry.setTag("correlationId", sanitizeString(context.correlationId));
    }
    if (context.release) {
      Sentry.setTag("release", sanitizeString(context.release));
    }
  } catch {
    // Swallow fail-open
  }
}
