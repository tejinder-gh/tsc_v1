import { describe, expect, it } from "vitest";
import { buildCanonicalRequest, computeHmacSignature, hashRawBody } from "../auth/canonicalRequest";
import { verifyRelayRequest } from "../auth/verifyRelayRequest";
import type { RelayConfig } from "../config/relayConfig";

describe("Interoperability Deterministic Test Vector", () => {
  // Test Vector inputs documented in docs/relay-api-contract.md
  const VERSION = "1";
  const METHOD = "POST";
  const PATH = "/api/v1/relay";
  const RELAY_ID = "india-sms";
  const DEVICE_ID = "india-phone-primary";
  const TIMESTAMP = "1789587712";
  const NONCE = "a1c49f6f02d64bcbbca124310e785bc4";
  const SECRET = "super-secure-shared-hmac-secret-32b";
  const RAW_BODY =
    '{"eventId":"748ffec8-47dd-4acb-a908-63bdbbb1d834","sender":"VM-HDFCBK","body":"Your OTP is 123456","receivedAt":"2026-09-16T17:35:44.291Z","sim":{"slotIndex":0}}';

  // Expected intermediate & final outputs
  const EXPECTED_BODY_SHA256 = "b33b2661fcb8580fcb7d7413bc80969689abaca5b5615e21640d87b588a59505";
  const EXPECTED_CANONICAL = [
    "1",
    "POST",
    "/api/v1/relay",
    "india-sms",
    "india-phone-primary",
    "1789587712",
    "a1c49f6f02d64bcbbca124310e785bc4",
    "b33b2661fcb8580fcb7d7413bc80969689abaca5b5615e21640d87b588a59505",
  ].join("\n");
  const EXPECTED_SIGNATURE = "ccca291cbc7a51b49a461d06957dd6b8ea2f388caee8557352f4b180c011cd28";

  it("calculates exact SHA-256 body hash matching documented test vector", () => {
    const hash = hashRawBody(RAW_BODY);
    expect(hash).toBe(EXPECTED_BODY_SHA256);
  });

  it("constructs exact canonical string matching documented test vector", () => {
    const canonical = buildCanonicalRequest({
      version: VERSION,
      method: METHOD,
      pathname: PATH,
      relayId: RELAY_ID,
      deviceId: DEVICE_ID,
      timestamp: TIMESTAMP,
      nonce: NONCE,
      bodyHash: EXPECTED_BODY_SHA256,
    });
    expect(canonical).toBe(EXPECTED_CANONICAL);
  });

  it("calculates exact HMAC-SHA256 signature matching documented test vector", () => {
    const signature = computeHmacSignature(EXPECTED_CANONICAL, SECRET);
    expect(signature).toBe(EXPECTED_SIGNATURE);
  });

  it("successfully verifies standard Request created with the test vector", async () => {
    const config: RelayConfig = {
      relayId: RELAY_ID,
      allowedDeviceIds: [DEVICE_ID],
      hmacSecret: SECRET,
      timestampWindowSeconds: 300,
      maxBodyBytes: 16384,
      deliveryProvider: "email",
    };

    const request = new Request(`https://www.theskillcorner.com${PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Relay-Version": VERSION,
        "X-Relay-ID": RELAY_ID,
        "X-Relay-Device": DEVICE_ID,
        "X-Relay-Timestamp": TIMESTAMP,
        "X-Relay-Nonce": NONCE,
        "X-Relay-Signature": EXPECTED_SIGNATURE,
      },
      body: RAW_BODY,
    });

    // Pass nowSeconds equal to timestamp to verify window logic
    const verified = await verifyRelayRequest(request, config, {
      nowSeconds: Number.parseInt(TIMESTAMP, 10),
    });

    expect(verified.relayId).toBe(RELAY_ID);
    expect(verified.deviceId).toBe(DEVICE_ID);
    expect(verified.timestamp).toBe(TIMESTAMP);
    expect(verified.nonce).toBe(NONCE);
    expect(verified.signature).toBe(EXPECTED_SIGNATURE);
    expect(verified.bodyHash).toBe(EXPECTED_BODY_SHA256);
    expect(verified.rawBody.toString("utf-8")).toBe(RAW_BODY);
  });
});
