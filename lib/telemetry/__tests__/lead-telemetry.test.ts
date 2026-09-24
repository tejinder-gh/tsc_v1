import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from "vitest";
import { POST } from "@/app/api/lead/route";
import { submitLead } from "@/lib/leads";
import * as telemetry from "../index";

describe("Lead Telemetry Semantics: Client Submission vs Server Delivery", () => {
  const originalEnv = { ...process.env };
  let trackEventSpy: MockInstance<typeof telemetry.trackEvent>;
  let captureErrorSpy: MockInstance<typeof telemetry.captureError>;

  beforeEach(() => {
    trackEventSpy = vi.spyOn(telemetry, "trackEvent");
    captureErrorSpy = vi.spyOn(telemetry, "captureError");
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  describe("Client-side submitLead", () => {
    it("emits lead_submit_attempted and lead_submit_accepted on successful request", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify({ ok: true, delivered: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        ),
      );

      await submitLead({
        lead_source: "contact_form",
        name: "Test User",
        email: "test@example.com",
        segment: "local",
      });

      expect(trackEventSpy).toHaveBeenCalledWith("lead_submit_attempted", {
        location: "contact_form",
        segment: "local",
      });

      expect(trackEventSpy).toHaveBeenCalledWith("lead_submit_accepted", {
        location: "contact_form",
        segment: "local",
      });

      vi.unstubAllGlobals();
    });

    it("captures error and throws when fetch fails", async () => {
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network offline")));

      await expect(
        submitLead({
          lead_source: "quick_actions",
          name: "Test User",
          email: "test@example.com",
        }),
      ).rejects.toThrow(/Could not reach the server/);

      expect(trackEventSpy).toHaveBeenCalledWith("lead_submit_attempted", {
        location: "quick_actions",
        segment: "unknown",
      });

      expect(captureErrorSpy).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({ category: "lead_delivery" }),
      );

      vi.unstubAllGlobals();
    });
  });

  describe("Server-side POST /api/lead Authoritative Delivery", () => {
    it("emits lead_delivery_succeeded when downstream webhook returns 200", async () => {
      process.env.LEAD_WEBHOOK_URL = "https://hooks.zapier.com/catch/test/test/";

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 200 })));

      const request = new Request("http://localhost/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_source: "contact_page",
          name: "Owner",
          email: "owner@clinic.ca",
          segment: "practice",
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);

      expect(trackEventSpy).toHaveBeenCalledWith("lead_delivery_succeeded", {
        location: "contact_page",
        segment: "practice",
      });

      vi.unstubAllGlobals();
    });

    it("emits lead_delivery_failed when downstream webhook returns 502", async () => {
      process.env.LEAD_WEBHOOK_URL = "https://hooks.zapier.com/catch/test/test/";

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 502 })));

      const request = new Request("http://localhost/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_source: "contact_page",
          name: "Owner",
          email: "owner@clinic.ca",
          segment: "practice",
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(502);

      expect(trackEventSpy).toHaveBeenCalledWith("lead_delivery_failed", {
        location: "contact_page",
        segment: "practice",
        reason: "webhook_status_error",
      });

      expect(captureErrorSpy).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({ category: "lead_delivery" }),
      );

      vi.unstubAllGlobals();
    });

    it("emits lead_delivery_failed when LEAD_WEBHOOK_URL is unset in production", async () => {
      delete process.env.LEAD_WEBHOOK_URL;
      process.env.VERCEL_ENV = "production";

      const request = new Request("http://localhost/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_source: "contact_page",
          name: "Owner",
          email: "owner@clinic.ca",
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(503);

      expect(trackEventSpy).toHaveBeenCalledWith("lead_delivery_failed", {
        location: "contact_page",
        segment: "unknown",
        reason: "missing_webhook_url",
      });

      expect(captureErrorSpy).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({ category: "lead_delivery" }),
      );
    });
  });
});
