import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createDeliveryAdapter } from "../adapters/createDeliveryAdapter";
import { DevNullDeliveryAdapter } from "../adapters/DevNullDeliveryAdapter";
import { EmailDeliveryAdapter } from "../adapters/EmailDeliveryAdapter";
import { WebhookDeliveryAdapter } from "../adapters/WebhookDeliveryAdapter";
import type { RelayConfig } from "../config/relayConfig";
import type { DeliveryContext, RelayMessage } from "../types/relay";

describe("Delivery Adapters", () => {
  const sampleMessage: RelayMessage = {
    eventId: "748ffec8-47dd-4acb-a908-63bdbbb1d834",
    sender: "VM-HDFCBK",
    body: "OTP is 123456",
    receivedAt: "2026-09-16T17:35:44.291Z",
    relayId: "india-sms",
    deviceId: "phone-1",
    sim: { slotIndex: 0 },
  };

  const sampleContext: DeliveryContext = {
    relayId: "india-sms",
    deviceId: "phone-1",
    eventId: "748ffec8-47dd-4acb-a908-63bdbbb1d834",
    receivedAt: "2026-09-16T17:35:44.291Z",
  };

  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("DevNullDeliveryAdapter", () => {
    it("returns success without persistence or side effects", async () => {
      const adapter = new DevNullDeliveryAdapter();
      const result = await adapter.deliver(sampleMessage, sampleContext);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.provider).toBe("dev-null");
      }
    });
  });

  describe("EmailDeliveryAdapter", () => {
    it("delivers mock email in test mode", async () => {
      const adapter = new EmailDeliveryAdapter({
        to: "recipient@example.com",
        from: "sms-relay@theskillcorner.com",
        provider: "mock",
      });

      const result = await adapter.deliver(sampleMessage, sampleContext);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.provider).toBe("email-mock");
      }
    });

    it("sends via SendGrid and parses message ID on 202", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(
        new Response(null, {
          status: 202,
          headers: { "x-message-id": "sg-msg-999" },
        }),
      );

      const adapter = new EmailDeliveryAdapter({
        to: "recipient@example.com",
        from: "sms-relay@theskillcorner.com",
        apiKey: "SG.test-key",
        provider: "sendgrid",
      });

      const result = await adapter.deliver(sampleMessage, sampleContext);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.provider).toBe("sendgrid");
        expect(result.providerMessageId).toBe("sg-msg-999");
      }
    });

    it("classifies SendGrid 500 as retryable", async () => {
      globalThis.fetch = vi
        .fn()
        .mockResolvedValue(new Response("Internal Server Error", { status: 500 }));

      const adapter = new EmailDeliveryAdapter({
        to: "recipient@example.com",
        from: "sms-relay@theskillcorner.com",
        apiKey: "SG.test-key",
        provider: "sendgrid",
      });

      const result = await adapter.deliver(sampleMessage, sampleContext);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.retryable).toBe(true);
        expect(result.code).toBe("DELIVERY_TEMPORARILY_UNAVAILABLE");
      }
    });

    it("classifies SendGrid 401 as non-retryable", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(new Response("Unauthorized", { status: 401 }));

      const adapter = new EmailDeliveryAdapter({
        to: "recipient@example.com",
        from: "sms-relay@theskillcorner.com",
        apiKey: "SG.test-key",
        provider: "sendgrid",
      });

      const result = await adapter.deliver(sampleMessage, sampleContext);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.retryable).toBe(false);
        expect(result.code).toBe("DELIVERY_REJECTED");
      }
    });

    it("handles network fetch failure as retryable", async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error("Connection reset"));

      const adapter = new EmailDeliveryAdapter({
        to: "recipient@example.com",
        from: "sms-relay@theskillcorner.com",
        apiKey: "SG.test-key",
        provider: "sendgrid",
      });

      const result = await adapter.deliver(sampleMessage, sampleContext);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.retryable).toBe(true);
      }
    });
  });

  describe("WebhookDeliveryAdapter", () => {
    it("delivers to webhook with idempotency headers", async () => {
      let capturedHeaders: Headers | undefined;
      globalThis.fetch = vi.fn().mockImplementation((_url, init) => {
        capturedHeaders = new Headers(init.headers);
        return Promise.resolve(
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "x-delivery-id": "downstream-123" },
          }),
        );
      });

      const adapter = new WebhookDeliveryAdapter({
        webhookUrl: "https://example.com/webhook",
        authToken: "secret-token",
      });

      const result = await adapter.deliver(sampleMessage, sampleContext);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.provider).toBe("webhook");
        expect(result.providerMessageId).toBe("downstream-123");
      }

      expect(capturedHeaders?.get("Idempotency-Key")).toBe(sampleContext.eventId);
      expect(capturedHeaders?.get("Authorization")).toBe("Bearer secret-token");
    });

    it("classifies downstream 503 as retryable", async () => {
      globalThis.fetch = vi
        .fn()
        .mockResolvedValue(new Response("Service Unavailable", { status: 503 }));

      const adapter = new WebhookDeliveryAdapter({
        webhookUrl: "https://example.com/webhook",
      });

      const result = await adapter.deliver(sampleMessage, sampleContext);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.retryable).toBe(true);
        expect(result.code).toBe("DELIVERY_TEMPORARILY_UNAVAILABLE");
      }
    });

    it("classifies downstream 400 as permanent rejection", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(new Response("Bad Request", { status: 400 }));

      const adapter = new WebhookDeliveryAdapter({
        webhookUrl: "https://example.com/webhook",
      });

      const result = await adapter.deliver(sampleMessage, sampleContext);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.retryable).toBe(false);
        expect(result.code).toBe("DELIVERY_REJECTED");
      }
    });
  });

  describe("createDeliveryAdapter factory", () => {
    const baseConfig: RelayConfig = {
      relayId: "india-sms",
      allowedDeviceIds: ["phone-1"],
      hmacSecret: "test-secret-min-16-characters",
      timestampWindowSeconds: 300,
      maxBodyBytes: 16384,
      deliveryProvider: "dev-null",
    };

    it("creates DevNullDeliveryAdapter when provider is dev-null", () => {
      const adapter = createDeliveryAdapter({ ...baseConfig, deliveryProvider: "dev-null" });
      expect(adapter).toBeInstanceOf(DevNullDeliveryAdapter);
    });

    it("creates WebhookDeliveryAdapter when provider is webhook", () => {
      const adapter = createDeliveryAdapter(
        { ...baseConfig, deliveryProvider: "webhook" },
        { SMS_RELAY_WEBHOOK_URL: "https://example.com/webhook" },
      );
      expect(adapter).toBeInstanceOf(WebhookDeliveryAdapter);
    });

    it("creates EmailDeliveryAdapter when provider is email", () => {
      const adapter = createDeliveryAdapter(
        { ...baseConfig, deliveryProvider: "email" },
        {
          SMS_RELAY_EMAIL_TO: "dest@example.com",
          SENDGRID_API_KEY: "SG.key",
        },
      );
      expect(adapter).toBeInstanceOf(EmailDeliveryAdapter);
    });
  });
});
