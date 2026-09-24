/**
 * What: Central Telemetry Facade for TheSkillCorner.
 * Why: Provides a vendor-neutral, typed, fail-open API so product code does not
 *      scatter vendor SDK calls throughout the codebase.
 * How: Routes trackEvent to Plausible CE, captureError to GlitchTip/Sentry,
 *      and startReplayIfAllowed to OpenReplay with strict privacy rules.
 * From Where: Observability Foundation Architecture, 2026-09.
 */

import { getTelemetryConfig } from "./config";
import { captureGlitchTipError, setGlitchTipContext } from "./providers/glitchtip";
import { startOpenReplayIfAllowed } from "./providers/openreplay";
import { trackPlausibleEvent } from "./providers/plausible";
import type {
  ErrorCaptureContext,
  ErrorCategory,
  ProhibitedTelemetryKey,
  TelemetryContext,
  TelemetryEvent,
  TelemetryProps,
  TelemetryStatus,
} from "./types";

export type {
  MetricAvailability,
  MetricValue,
  WeeklyObservabilityReport,
} from "./report";
export type {
  ErrorCaptureContext,
  ErrorCategory,
  ProhibitedTelemetryKey,
  TelemetryContext,
  TelemetryEvent,
  TelemetryProps,
  TelemetryStatus,
};

/**
 * Tracks a named semantic event with optional key-value properties.
 * Vendor-neutral; fails open and never breaks UI or execution.
 */
export function trackEvent(event: TelemetryEvent, props?: TelemetryProps): void {
  try {
    trackPlausibleEvent(event, props);
  } catch {
    // Fail-open: telemetry side-effects must never throw
  }
}

/**
 * Captures an error with sanitized context tags and correlation IDs.
 * Vendor-neutral; fails open.
 */
export function captureError(error: unknown, context?: ErrorCaptureContext): string | undefined {
  try {
    return captureGlitchTipError(error, context);
  } catch {
    // Fail-open
    return undefined;
  }
}

/**
 * Enriches global telemetry context (route, correlation ID, release).
 */
export function setTelemetryContext(context: TelemetryContext): void {
  try {
    setGlitchTipContext(context);
  } catch {
    // Fail-open
  }
}

/**
 * Conditionally starts session replay if enabled, configured, and route is allowlisted.
 */
export async function startReplayIfAllowed(currentPathname?: string): Promise<boolean> {
  try {
    return await startOpenReplayIfAllowed(currentPathname);
  } catch {
    return false;
  }
}

/**
 * Returns factual operational status of all telemetry providers.
 * Used by operator dashboards and health checks.
 */
export function getTelemetryStatus(): TelemetryStatus {
  const config = getTelemetryConfig();

  return {
    analytics: {
      enabled: config.analytics.enabled,
      configured: Boolean(config.analytics.domain && config.analytics.scriptUrl),
      status:
        config.analytics.enabled && config.analytics.domain && config.analytics.scriptUrl
          ? "configured"
          : "unavailable",
      endpointOrDomain: config.analytics.domain,
      details: config.analytics.enabled
        ? `Plausible CE active on ${config.analytics.domain}`
        : "Disabled by default (NEXT_PUBLIC_ANALYTICS_ENABLED)",
    },
    errorMonitoring: {
      enabled: config.errorMonitoring.enabled,
      configured: Boolean(config.errorMonitoring.dsn),
      status:
        config.errorMonitoring.enabled && config.errorMonitoring.dsn ? "configured" : "unavailable",
      endpointOrDomain: config.errorMonitoring.dsn ? "[Configured GlitchTip DSN]" : undefined,
      details: config.errorMonitoring.enabled
        ? "GlitchTip via @sentry/nextjs active"
        : "Disabled by default (NEXT_PUBLIC_ERROR_MONITORING_ENABLED)",
    },
    sessionReplay: {
      enabled: config.sessionReplay.enabled,
      configured: Boolean(config.sessionReplay.projectKey),
      status:
        config.sessionReplay.enabled && config.sessionReplay.projectKey
          ? "configured"
          : "unavailable",
      endpointOrDomain: config.sessionReplay.ingestPoint || "Default OpenReplay Ingest",
      details: config.sessionReplay.enabled
        ? "OpenReplay Private Mode active on allowlisted routes"
        : "Disabled by default (NEXT_PUBLIC_SESSION_REPLAY_ENABLED)",
    },
    releaseId: config.releaseId,
    environment: config.environment,
  };
}
