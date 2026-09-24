import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getTelemetryConfig,
  isAnalyticsActive,
  isErrorMonitoringActive,
  isSessionReplayActive,
} from "../config";

describe("Telemetry Configuration & No-Fallback Invariants", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_ANALYTICS_ENABLED;
    delete process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    delete process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL;
    delete process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST;
    delete process.env.NEXT_PUBLIC_GA_ENABLED;
    delete process.env.NEXT_PUBLIC_GA_ID;
    delete process.env.NEXT_PUBLIC_ERROR_MONITORING_ENABLED;
    delete process.env.ERROR_MONITORING_ENABLED;
    delete process.env.NEXT_PUBLIC_GLITCHTIP_DSN;
    delete process.env.GLITCHTIP_DSN;
    delete process.env.NEXT_PUBLIC_SESSION_REPLAY_ENABLED;
    delete process.env.NEXT_PUBLIC_OPENREPLAY_PROJECT_KEY;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("does NOT activate Plausible when scriptUrl is missing (no cloud fallback)", () => {
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED = "true";
    process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN = "theskillcorner.com";
    // NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL is omitted

    expect(isAnalyticsActive()).toBe(false);
    const config = getTelemetryConfig();
    expect(config.analytics.enabled).toBe(false);
  });

  it("does NOT activate Plausible when domain is missing", () => {
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED = "true";
    process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL = "https://stats.example.com/js/script.js";

    expect(isAnalyticsActive()).toBe(false);
  });

  it("activates Plausible when explicitly enabled with domain and self-hosted script URL", () => {
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED = "true";
    process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN = "theskillcorner.com";
    process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL = "https://stats.example.com/js/script.js";

    expect(isAnalyticsActive()).toBe(true);
    const config = getTelemetryConfig();
    expect(config.analytics.domain).toBe("theskillcorner.com");
    expect(config.analytics.scriptUrl).toBe("https://stats.example.com/js/script.js");
  });

  it("does NOT activate GA4 implicitly when Plausible is unconfigured", () => {
    process.env.NEXT_PUBLIC_GA_ID = "G-XXXXXXX";
    // NEXT_PUBLIC_GA_ENABLED is unset

    const config = getTelemetryConfig();
    expect(config.ga.enabled).toBe(false);
  });

  it("activates GA4 only when explicitly enabled with GA_ENABLED=true", () => {
    process.env.NEXT_PUBLIC_GA_ENABLED = "true";
    process.env.NEXT_PUBLIC_GA_ID = "G-1234567";

    const config = getTelemetryConfig();
    expect(config.ga.enabled).toBe(true);
    expect(config.ga.measurementId).toBe("G-1234567");
  });

  it("does NOT activate GlitchTip when DSN is missing", () => {
    process.env.NEXT_PUBLIC_ERROR_MONITORING_ENABLED = "true";

    expect(isErrorMonitoringActive()).toBe(false);
  });

  it("activates GlitchTip when enabled with client DSN", () => {
    process.env.NEXT_PUBLIC_ERROR_MONITORING_ENABLED = "true";
    process.env.NEXT_PUBLIC_GLITCHTIP_DSN = "https://key@glitchtip.example.com/1";

    expect(isErrorMonitoringActive()).toBe(true);
    const config = getTelemetryConfig();
    expect(config.errorMonitoring.dsn).toBe("https://key@glitchtip.example.com/1");
  });

  it("does NOT activate OpenReplay when projectKey is missing", () => {
    process.env.NEXT_PUBLIC_SESSION_REPLAY_ENABLED = "true";

    expect(isSessionReplayActive()).toBe(false);
  });

  it("activates OpenReplay when enabled with projectKey", () => {
    process.env.NEXT_PUBLIC_SESSION_REPLAY_ENABLED = "true";
    process.env.NEXT_PUBLIC_OPENREPLAY_PROJECT_KEY = "proj_key_123";

    expect(isSessionReplayActive()).toBe(true);
    const config = getTelemetryConfig();
    expect(config.sessionReplay.projectKey).toBe("proj_key_123");
  });
});
