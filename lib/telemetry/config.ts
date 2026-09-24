/**
 * What: Telemetry configuration and environment parsing.
 * Why: All observability integrations must be DEFAULT-OFF and fail-open.
 *      No cloud fallback or implicit activation is permitted.
 * How: Reads explicit environment flags and verifies required endpoints before
 *      declaring any provider active.
 * From Where: Observability Foundation Architecture, 2026-09.
 */

export interface TelemetryConfig {
  analytics: {
    enabled: boolean;
    domain: string | undefined;
    scriptUrl: string | undefined;
    apiHost: string | undefined;
  };
  ga: {
    enabled: boolean;
    measurementId: string | undefined;
  };
  errorMonitoring: {
    enabled: boolean;
    dsn: string | undefined;
  };
  sessionReplay: {
    enabled: boolean;
    projectKey: string | undefined;
    ingestPoint: string | undefined;
  };
  releaseId: string;
  environment: string;
}

function parseBool(val: string | undefined): boolean {
  return val === "true" || val === "1";
}

export function getTelemetryConfig(): TelemetryConfig {
  const analyticsFlag = parseBool(process.env.NEXT_PUBLIC_ANALYTICS_ENABLED);
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();
  const plausibleScriptUrl = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL?.trim();
  const plausibleApiHost = process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST?.trim();

  // Plausible CE requires explicit script URL and domain; NO default to plausible.io
  const analyticsValid = Boolean(plausibleDomain && plausibleScriptUrl);

  const gaFlag = parseBool(process.env.NEXT_PUBLIC_GA_ENABLED);
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  const gaValid = Boolean(gaFlag && gaId);

  const errorMonitoringFlag =
    parseBool(process.env.NEXT_PUBLIC_ERROR_MONITORING_ENABLED) ||
    parseBool(process.env.ERROR_MONITORING_ENABLED);
  const glitchtipDsn = (process.env.NEXT_PUBLIC_GLITCHTIP_DSN || process.env.GLITCHTIP_DSN)?.trim();
  const errorMonitoringValid = Boolean(errorMonitoringFlag && glitchtipDsn);

  const sessionReplayFlag = parseBool(process.env.NEXT_PUBLIC_SESSION_REPLAY_ENABLED);
  const openreplayProjectKey = process.env.NEXT_PUBLIC_OPENREPLAY_PROJECT_KEY?.trim();
  const openreplayIngestPoint = process.env.NEXT_PUBLIC_OPENREPLAY_INGEST_POINT?.trim();
  const sessionReplayValid = Boolean(sessionReplayFlag && openreplayProjectKey);

  const releaseId =
    process.env.NEXT_PUBLIC_RELEASE_ID ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.npm_package_version ||
    "0.1.0";

  const environment = process.env.VERCEL_ENV || process.env.NODE_ENV || "development";

  return {
    analytics: {
      enabled: analyticsFlag && analyticsValid,
      domain: plausibleDomain,
      scriptUrl: plausibleScriptUrl,
      apiHost: plausibleApiHost,
    },
    ga: {
      enabled: gaValid,
      measurementId: gaId,
    },
    errorMonitoring: {
      enabled: errorMonitoringValid,
      dsn: glitchtipDsn,
    },
    sessionReplay: {
      enabled: sessionReplayValid,
      projectKey: openreplayProjectKey,
      ingestPoint: openreplayIngestPoint,
    },
    releaseId,
    environment,
  };
}

export function isAnalyticsActive(): boolean {
  return getTelemetryConfig().analytics.enabled;
}

export function isErrorMonitoringActive(): boolean {
  return getTelemetryConfig().errorMonitoring.enabled;
}

export function isSessionReplayActive(): boolean {
  return getTelemetryConfig().sessionReplay.enabled;
}
