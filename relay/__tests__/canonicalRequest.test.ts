import { describe, expect, it } from "vitest";
import { buildCanonicalRequest, computeHmacSignature, hashRawBody } from "../auth/canonicalRequest";

describe("canonicalRequest utilities", () => {
  it("hashes raw body to lowercase sha256 hex string", () => {
    const raw = '{"hello":"world"}';
    const hash = hashRawBody(Buffer.from(raw));
    expect(hash).toBe("93a23971a914e5eacbf0a8d25154cda309c3c1c72fbb9914d47c60f3cb681588");
  });

  it("constructs newline-separated canonical request correctly", () => {
    const canonical = buildCanonicalRequest({
      version: 1,
      method: "post",
      pathname: "/api/v1/relay",
      relayId: "test-relay",
      deviceId: "dev-123",
      timestamp: "1789582200",
      nonce: "00112233445566778899aabbccddeeff",
      bodyHash: "58444dc5eaab617ecfaec8d0e5138139d48b7a4de47cf11e4f451f28b26e03ea",
    });

    const expected = [
      "1",
      "POST",
      "/api/v1/relay",
      "test-relay",
      "dev-123",
      "1789582200",
      "00112233445566778899aabbccddeeff",
      "58444dc5eaab617ecfaec8d0e5138139d48b7a4de47cf11e4f451f28b26e03ea",
    ].join("\n");

    expect(canonical).toBe(expected);
  });

  it("computes 64-character lowercase HMAC-SHA256 signature", () => {
    const canonical = "test\ncanonical\nstring";
    const secret = "my-secret-key-123";
    const sig = computeHmacSignature(canonical, secret);

    expect(sig).toHaveLength(64);
    expect(sig).toMatch(/^[0-9a-f]{64}$/);
  });
});
