import { beforeEach, describe, expect, it } from "vitest";
import { buildCanonicalRequest, computeHmacSignature, hashRawBody } from "../auth/canonicalRequest";
import { resetDefaultNonceDeduplicator } from "../auth/nonceStore";
import { verifyRelayRequest } from "../auth/verifyRelayRequest";
import type { RelayConfig } from "../config/relayConfig";
import {
  AuthenticationError,
  InvalidContentTypeError,
  MissingHeaderError,
  PayloadTooLargeError,
  TimestampError,
} from "../errors/RelayError";

describe("verifyRelayRequest", () => {
  beforeEach(() => {
    resetDefaultNonceDeduplicator();
  });
  const DEFAULT_CONFIG: RelayConfig = {
    relayId: "india-sms",
    allowedDeviceIds: ["phone-primary", "phone-secondary"],
    hmacSecret: "strong-random-test-secret-key-32chars",
    timestampWindowSeconds: 300,
    maxBodyBytes: 16384,
    deliveryProvider: "email",
  };

  function createSignedRequest(
    overrides: {
      method?: string;
      url?: string;
      version?: string;
      relayId?: string;
      deviceId?: string;
      timestamp?: string;
      nonce?: string;
      secret?: string;
      body?: string;
      headers?: Record<string, string>;
      contentType?: string | null;
    } = {},
  ): Request {
    const method = overrides.method ?? "POST";
    const url = overrides.url ?? "https://www.theskillcorner.com/api/v1/relay";
    const version = overrides.version ?? "1";
    const relayId = overrides.relayId ?? DEFAULT_CONFIG.relayId;
    const deviceId = overrides.deviceId ?? DEFAULT_CONFIG.allowedDeviceIds[0];
    const timestamp = overrides.timestamp ?? String(Math.floor(Date.now() / 1000));
    const nonce = overrides.nonce ?? crypto.randomUUID().replace(/-/g, "");
    const secret = overrides.secret ?? DEFAULT_CONFIG.hmacSecret;
    const body =
      overrides.body ??
      '{"eventId":"748ffec8-47dd-4acb-a908-63bdbbb1d834","sender":"VM-HDFCBK","body":"OTP is 1234","receivedAt":"2026-09-16T17:35:44.291Z"}';

    const bodyHash = hashRawBody(body);
    const pathname = new URL(url).pathname;
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
      "X-Relay-Version": version,
      "X-Relay-ID": relayId,
      "X-Relay-Device": deviceId,
      "X-Relay-Timestamp": timestamp,
      "X-Relay-Nonce": nonce,
      "X-Relay-Signature": signature,
      ...overrides.headers,
    };

    if (overrides.contentType !== null) {
      headers["Content-Type"] = overrides.contentType ?? "application/json";
    }

    return new Request(url, {
      method,
      headers,
      body,
    });
  }

  it("verifies a valid signed request within the timestamp freshness window", async () => {
    const req = createSignedRequest({ timestamp: "1000" });
    const verified = await verifyRelayRequest(req, DEFAULT_CONFIG, { nowSeconds: 1050 });

    expect(verified.relayId).toBe("india-sms");
    expect(verified.deviceId).toBe("phone-primary");
    expect(verified.version).toBe(1);
    expect(verified.rawBody.toString("utf-8")).toContain("VM-HDFCBK");
  });

  it("accepts application/json with charset=utf-8", async () => {
    const req = createSignedRequest({
      timestamp: "1000",
      contentType: "application/json; charset=utf-8",
    });
    const verified = await verifyRelayRequest(req, DEFAULT_CONFIG, { nowSeconds: 1000 });
    expect(verified).toBeDefined();
  });

  it("rejects request with unsupported content type", async () => {
    const req = createSignedRequest({ contentType: "text/plain" });
    await expect(verifyRelayRequest(req, DEFAULT_CONFIG)).rejects.toThrow(InvalidContentTypeError);
  });

  it("rejects request with missing required header", async () => {
    const req = createSignedRequest({
      headers: { "X-Relay-ID": "" },
    });
    await expect(verifyRelayRequest(req, DEFAULT_CONFIG)).rejects.toThrow(MissingHeaderError);
  });

  it("rejects unsupported relay version", async () => {
    const req = createSignedRequest({ version: "2" });
    await expect(verifyRelayRequest(req, DEFAULT_CONFIG)).rejects.toThrow(AuthenticationError);
  });

  it("rejects malformed nonce (not 32 hex chars)", async () => {
    const req = createSignedRequest({ nonce: "short-nonce" });
    await expect(verifyRelayRequest(req, DEFAULT_CONFIG)).rejects.toThrow(AuthenticationError);
  });

  it("rejects unknown relay ID", async () => {
    const req = createSignedRequest({ relayId: "foreign-relay" });
    await expect(verifyRelayRequest(req, DEFAULT_CONFIG)).rejects.toThrow(AuthenticationError);
  });

  it("rejects unauthorized device ID", async () => {
    const req = createSignedRequest({ deviceId: "unauthorized-phone" });
    await expect(verifyRelayRequest(req, DEFAULT_CONFIG)).rejects.toThrow(AuthenticationError);
  });

  it("rejects stale timestamp outside freshness window (> 300s past)", async () => {
    const req = createSignedRequest({ timestamp: "1000" });
    await expect(verifyRelayRequest(req, DEFAULT_CONFIG, { nowSeconds: 1301 })).rejects.toThrow(
      TimestampError,
    );
  });

  it("rejects future timestamp outside freshness window (> 300s future)", async () => {
    const req = createSignedRequest({ timestamp: "1500" });
    await expect(verifyRelayRequest(req, DEFAULT_CONFIG, { nowSeconds: 1100 })).rejects.toThrow(
      TimestampError,
    );
  });

  it("rejects non-numeric timestamp format", async () => {
    const req = createSignedRequest({ timestamp: "not-a-timestamp" });
    await expect(verifyRelayRequest(req, DEFAULT_CONFIG)).rejects.toThrow(TimestampError);
  });

  it("rejects payload exceeding max body bytes (16 KB)", async () => {
    const bigBody = "x".repeat(16385);
    const req = createSignedRequest({ body: bigBody });
    await expect(verifyRelayRequest(req, DEFAULT_CONFIG)).rejects.toThrow(PayloadTooLargeError);
  });

  it("rejects when signature was computed with a different secret", async () => {
    const req = createSignedRequest({ secret: "wrong-secret-key-32chars" });
    await expect(
      verifyRelayRequest(req, DEFAULT_CONFIG, { nowSeconds: 1789587712 }),
    ).rejects.toThrow(AuthenticationError);
  });

  describe("raw byte immutability", () => {
    it("fails verification if a space is inserted after signing", async () => {
      const originalBody =
        '{"eventId":"748ffec8-47dd-4acb-a908-63bdbbb1d834","sender":"VM-HDFCBK","body":"OTP 1234","receivedAt":"2026-09-16T17:35:44.291Z"}';
      const bodyHash = hashRawBody(originalBody);
      const canonical = buildCanonicalRequest({
        version: 1,
        method: "POST",
        pathname: "/api/v1/relay",
        relayId: DEFAULT_CONFIG.relayId,
        deviceId: DEFAULT_CONFIG.allowedDeviceIds[0],
        timestamp: "1000",
        nonce: "a1c49f6f02d64bcbbca124310e785bc4",
        bodyHash,
      });
      const signature = computeHmacSignature(canonical, DEFAULT_CONFIG.hmacSecret);

      // Mutate body by adding whitespace
      const tamperedBody =
        '{"eventId": "748ffec8-47dd-4acb-a908-63bdbbb1d834","sender":"VM-HDFCBK","body":"OTP 1234","receivedAt":"2026-09-16T17:35:44.291Z"}';

      const req = new Request("https://www.theskillcorner.com/api/v1/relay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Relay-Version": "1",
          "X-Relay-ID": DEFAULT_CONFIG.relayId,
          "X-Relay-Device": DEFAULT_CONFIG.allowedDeviceIds[0],
          "X-Relay-Timestamp": "1000",
          "X-Relay-Nonce": "a1c49f6f02d64bcbbca124310e785bc4",
          "X-Relay-Signature": signature,
        },
        body: tamperedBody,
      });

      await expect(verifyRelayRequest(req, DEFAULT_CONFIG, { nowSeconds: 1000 })).rejects.toThrow(
        AuthenticationError,
      );
    });

    it("fails verification if JSON key order is swapped after signing", async () => {
      const originalBody = '{"a":"1","b":"2"}';
      const bodyHash = hashRawBody(originalBody);
      const canonical = buildCanonicalRequest({
        version: 1,
        method: "POST",
        pathname: "/api/v1/relay",
        relayId: DEFAULT_CONFIG.relayId,
        deviceId: DEFAULT_CONFIG.allowedDeviceIds[0],
        timestamp: "1000",
        nonce: "a1c49f6f02d64bcbbca124310e785bc4",
        bodyHash,
      });
      const signature = computeHmacSignature(canonical, DEFAULT_CONFIG.hmacSecret);

      const reorderedBody = '{"b":"2","a":"1"}';
      const req = new Request("https://www.theskillcorner.com/api/v1/relay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Relay-Version": "1",
          "X-Relay-ID": DEFAULT_CONFIG.relayId,
          "X-Relay-Device": DEFAULT_CONFIG.allowedDeviceIds[0],
          "X-Relay-Timestamp": "1000",
          "X-Relay-Nonce": "a1c49f6f02d64bcbbca124310e785bc4",
          "X-Relay-Signature": signature,
        },
        body: reorderedBody,
      });

      await expect(verifyRelayRequest(req, DEFAULT_CONFIG, { nowSeconds: 1000 })).rejects.toThrow(
        AuthenticationError,
      );
    });

    it("correctly signs and verifies multibyte Unicode (Punjabi and Hindi text)", async () => {
      const unicodeBody = JSON.stringify({
        eventId: "748ffec8-47dd-4acb-a908-63bdbbb1d834",
        sender: "VM-HDFCBK",
        body: "ਤੁਹਾਡਾ OTP 123456 ਹੈ / आपका ओटीपी 123456 है 🔒",
        receivedAt: "2026-09-16T17:35:44.291Z",
      });

      const req = createSignedRequest({
        body: unicodeBody,
        timestamp: "1000",
      });

      const verified = await verifyRelayRequest(req, DEFAULT_CONFIG, { nowSeconds: 1000 });
      expect(verified.rawBody.toString("utf-8")).toBe(unicodeBody);
    });
  });
});
