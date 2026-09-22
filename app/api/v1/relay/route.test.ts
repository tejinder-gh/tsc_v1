import { describe, expect, it } from "vitest";
import type { DeliveryAdapter } from "@/relay/adapters/DeliveryAdapter";
import {
  buildCanonicalRequest,
  computeHmacSignature,
  hashRawBody,
} from "@/relay/auth/canonicalRequest";
import type { RelayConfig } from "@/relay/config/relayConfig";
import { handleRelayRequest } from "@/relay/handler";
import { DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT } from "./route";

describe("POST /api/v1/relay Route Handler", () => {
  const TEST_CONFIG: RelayConfig = {
    relayId: "india-sms",
    allowedDeviceIds: ["primary-phone"],
    hmacSecret: "test-shared-hmac-secret-key-32b",
    timestampWindowSeconds: 300,
    maxBodyBytes: 16384,
    deliveryProvider: "dev-null",
  };

  const validPayload = {
    eventId: "748ffec8-47dd-4acb-a908-63bdbbb1d834",
    sender: "VM-HDFCBK",
    body: "Your OTP is 123456",
    receivedAt: "2026-09-16T17:35:44.291Z",
    sim: { slotIndex: 0 },
  };

  function createSignedRequest(
    options: {
      method?: string;
      body?: string;
      timestamp?: string;
      secret?: string;
      headers?: Record<string, string>;
      contentType?: string;
    } = {},
  ): Request {
    const method = options.method ?? "POST";
    const body = options.body ?? JSON.stringify(validPayload);
    const version = "1";
    const pathname = "/api/v1/relay";
    const relayId = TEST_CONFIG.relayId;
    const deviceId = TEST_CONFIG.allowedDeviceIds[0];
    const timestamp = options.timestamp ?? String(Math.floor(Date.now() / 1000));
    const nonce = "a1c49f6f02d64bcbbca124310e785bc4";
    const secret = options.secret ?? TEST_CONFIG.hmacSecret;

    const bodyHash = hashRawBody(body);
    const canonical = buildCanonicalRequest({
      version,
      method,
      pathname,
      relayId,
      deviceId,
      timestamp,
      nonce,
      bodyHash,
    });
    const signature = computeHmacSignature(canonical, secret);

    const headers: Record<string, string> = {
      "Content-Type": options.contentType ?? "application/json",
      "X-Relay-Version": version,
      "X-Relay-ID": relayId,
      "X-Relay-Device": deviceId,
      "X-Relay-Timestamp": timestamp,
      "X-Relay-Nonce": nonce,
      "X-Relay-Signature": signature,
      ...options.headers,
    };

    return new Request(`https://theskillcorner.com${pathname}`, {
      method,
      headers,
      body,
    });
  }

  describe("HTTP Method restrictions", () => {
    it("returns 405 with Allow: POST for GET", async () => {
      const res = await GET();
      expect(res.status).toBe(405);
      expect(res.headers.get("Allow")).toBe("POST");
      expect(res.headers.get("Cache-Control")).toBe("no-store");
      const json = await res.json();
      expect(json.code).toBe("METHOD_NOT_ALLOWED");
    });

    it("returns 405 for PUT, DELETE, PATCH, HEAD, OPTIONS", async () => {
      const handlers = [PUT, DELETE, PATCH, HEAD, OPTIONS];
      for (const handler of handlers) {
        const res = await handler();
        expect(res.status).toBe(405);
        expect(res.headers.get("Allow")).toBe("POST");
      }
    });

    it("delegates to handler via POST route export", async () => {
      process.env.SMS_RELAY_ID = "india-sms";
      process.env.SMS_RELAY_DEVICE_ID = "primary-phone";
      process.env.SMS_RELAY_HMAC_SECRET = "test-shared-hmac-secret-key-32b";
      process.env.SMS_RELAY_DELIVERY_PROVIDER = "dev-null";

      const req = new Request("https://theskillcorner.com/api/v1/relay", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: "bad",
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });
  });

  describe("Successful delivery", () => {
    it("authenticates, validates schema, and returns 200 with eventId", async () => {
      const mockAdapter: DeliveryAdapter = {
        deliver: async () => ({
          success: true,
          provider: "test-adapter",
          providerMessageId: "msg-123",
        }),
      };

      const req = createSignedRequest({ timestamp: "1000" });
      const res = await handleRelayRequest(req, {
        config: TEST_CONFIG,
        adapter: mockAdapter,
        verifyOptions: { nowSeconds: 1000 },
      });

      expect(res.status).toBe(200);
      expect(res.headers.get("Cache-Control")).toBe("no-store");
      expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.eventId).toBe(validPayload.eventId);
      expect(json.provider).toBe("test-adapter");
    });
  });

  describe("Authentication failures (401)", () => {
    it("returns generic 401 AUTHENTICATION_FAILED on signature mismatch", async () => {
      const req = createSignedRequest({
        timestamp: "1000",
        secret: "wrong-secret-key-32-characters-x",
      });

      const res = await handleRelayRequest(req, {
        config: TEST_CONFIG,
        verifyOptions: { nowSeconds: 1000 },
      });

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.code).toBe("AUTHENTICATION_FAILED");
    });

    it("returns generic 401 AUTHENTICATION_FAILED on expired timestamp", async () => {
      const req = createSignedRequest({ timestamp: "1000" });
      const res = await handleRelayRequest(req, {
        config: TEST_CONFIG,
        verifyOptions: { nowSeconds: 1400 }, // 400s difference > 300s
      });

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.code).toBe("AUTHENTICATION_FAILED");
    });

    it("returns 401 when a required header is missing", async () => {
      const req = createSignedRequest({
        headers: { "X-Relay-Nonce": "" },
      });

      const res = await handleRelayRequest(req, { config: TEST_CONFIG });
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.code).toBe("AUTHENTICATION_FAILED");
    });
  });

  describe("Content-Type & Size validation", () => {
    it("returns 400 on invalid Content-Type", async () => {
      const req = createSignedRequest({ contentType: "text/plain" });
      const res = await handleRelayRequest(req, { config: TEST_CONFIG });

      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.code).toBe("INVALID_CONTENT_TYPE");
    });

    it("returns 413 when body exceeds max allowed bytes", async () => {
      const oversized = "x".repeat(16385);
      const req = createSignedRequest({ body: oversized });
      const res = await handleRelayRequest(req, { config: TEST_CONFIG });

      expect(res.status).toBe(413);
      const json = await res.json();
      expect(json.code).toBe("PAYLOAD_TOO_LARGE");
    });
  });

  describe("Payload schema validation (422)", () => {
    it("returns 422 INVALID_PAYLOAD when body contains unknown properties", async () => {
      const bodyWithExtra = JSON.stringify({
        ...validPayload,
        unauthorizedField: "attack",
      });

      // Sign the body with the extra field to pass HMAC, testing schema rejection
      const req = createSignedRequest({
        body: bodyWithExtra,
        timestamp: "1000",
      });

      const res = await handleRelayRequest(req, {
        config: TEST_CONFIG,
        verifyOptions: { nowSeconds: 1000 },
      });

      expect(res.status).toBe(422);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.code).toBe("INVALID_PAYLOAD");
    });

    it("returns 422 when eventId is not a valid UUID", async () => {
      const bodyWithBadUuid = JSON.stringify({
        ...validPayload,
        eventId: "not-a-uuid",
      });

      const req = createSignedRequest({
        body: bodyWithBadUuid,
        timestamp: "1000",
      });

      const res = await handleRelayRequest(req, {
        config: TEST_CONFIG,
        verifyOptions: { nowSeconds: 1000 },
      });

      expect(res.status).toBe(422);
      const json = await res.json();
      expect(json.code).toBe("INVALID_PAYLOAD");
    });
  });

  describe("Downstream failure mapping", () => {
    it("maps retryable adapter failure to 503 with retryable: true", async () => {
      const mockAdapter: DeliveryAdapter = {
        deliver: async () => ({
          success: false,
          retryable: true,
          code: "DELIVERY_TEMPORARILY_UNAVAILABLE",
        }),
      };

      const req = createSignedRequest({ timestamp: "1000" });
      const res = await handleRelayRequest(req, {
        config: TEST_CONFIG,
        adapter: mockAdapter,
        verifyOptions: { nowSeconds: 1000 },
      });

      expect(res.status).toBe(503);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.retryable).toBe(true);
      expect(json.code).toBe("DELIVERY_TEMPORARILY_UNAVAILABLE");
    });

    it("maps permanent adapter failure to 502 with retryable: false", async () => {
      const mockAdapter: DeliveryAdapter = {
        deliver: async () => ({
          success: false,
          retryable: false,
          code: "DELIVERY_REJECTED",
        }),
      };

      const req = createSignedRequest({ timestamp: "1000" });
      const res = await handleRelayRequest(req, {
        config: TEST_CONFIG,
        adapter: mockAdapter,
        verifyOptions: { nowSeconds: 1000 },
      });

      expect(res.status).toBe(502);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.retryable).toBe(false);
      expect(json.code).toBe("DELIVERY_REJECTED");
    });
  });
});
