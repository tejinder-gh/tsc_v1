import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  captureError,
  getTelemetryStatus,
  setTelemetryContext,
  startReplayIfAllowed,
  trackEvent,
} from "../index";

describe("Telemetry Disabled State & Fail-Open Behavior", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_ANALYTICS_ENABLED;
    delete process.env.NEXT_PUBLIC_ERROR_MONITORING_ENABLED;
    delete process.env.ERROR_MONITORING_ENABLED;
    delete process.env.NEXT_PUBLIC_SESSION_REPLAY_ENABLED;
    delete process.env.NEXT_PUBLIC_GA_ENABLED;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it("reports all providers as unavailable/disabled by default", () => {
    const status = getTelemetryStatus();
    expect(status.analytics.enabled).toBe(false);
    expect(status.analytics.status).toBe("unavailable");
    expect(status.errorMonitoring.enabled).toBe(false);
    expect(status.errorMonitoring.status).toBe("unavailable");
    expect(status.sessionReplay.enabled).toBe(false);
    expect(status.sessionReplay.status).toBe("unavailable");
  });

  it("trackEvent no-ops silently without throwing when disabled", () => {
    expect(() => {
      trackEvent("cta_clicked", { location: "test_location" });
      trackEvent("form_started", { form: "test_form" });
      trackEvent("lead_submit_attempted", { location: "test_location" });
    }).not.toThrow();
  });

  it("captureError no-ops cleanly without throwing when disabled", () => {
    expect(() => {
      const result = captureError(new Error("Test failure"), {
        category: "network",
        route: "/test",
      });
      expect(result).toBeUndefined();
    }).not.toThrow();
  });

  it("startReplayIfAllowed returns false without throwing when disabled", async () => {
    const result = await startReplayIfAllowed("/");
    expect(result).toBe(false);
  });

  it("setTelemetryContext no-ops cleanly without throwing when disabled", () => {
    expect(() => {
      setTelemetryContext({ route: "/results", correlationId: "req_123" });
    }).not.toThrow();
  });
});
