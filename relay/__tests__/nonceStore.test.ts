import { describe, expect, it, vi } from "vitest";
import { buildCanonicalRequest, computeHmacSignature, hashRawBody } from "../auth/canonicalRequest";
import {
  buildRelayNonceKey,
  InMemoryNonceDeduplicator,
  PostgresNonceDeduplicator,
} from "../auth/nonceStore";
import { verifyRelayRequest } from "../auth/verifyRelayRequest";
import type { RelayConfig } from "../config/relayConfig";
import { AuthenticationError } from "../errors/RelayError";

describe("SMS Relay Nonce Deduplication & Replay Protection (P0)", () => {
  const relayId = "india-sms";
  const deviceId1 = "phone-1";
  const deviceId2 = "phone-2";
  const nonce1 = "a1c49f6f02d64bcbbca124310e785bc4";
  const nonce2 = "b2d50e7013e75cdcddb235421f896cd5";

  describe("InMemoryNonceDeduplicator", () => {
    it("accepts first request with a unique nonce and rejects duplicate nonce within TTL", async () => {
      const store = new InMemoryNonceDeduplicator();
      const key = buildRelayNonceKey(relayId, deviceId1, nonce1);

      // First request -> accepted
      const first = await store.claimNonce(key, 300);
      expect(first).toBe(true);

      // Same request replayed during TTL -> rejected
      const duplicate = await store.claimNonce(key, 300);
      expect(duplicate).toBe(false);
    });

    it("accepts different nonces for the same device", async () => {
      const store = new InMemoryNonceDeduplicator();
      const key1 = buildRelayNonceKey(relayId, deviceId1, nonce1);
      const key2 = buildRelayNonceKey(relayId, deviceId1, nonce2);

      expect(await store.claimNonce(key1, 300)).toBe(true);
      expect(await store.claimNonce(key2, 300)).toBe(true);
    });

    it("treats same nonce across different allowed device IDs according to the composite key", async () => {
      const store = new InMemoryNonceDeduplicator();
      const keyDevice1 = buildRelayNonceKey(relayId, deviceId1, nonce1);
      const keyDevice2 = buildRelayNonceKey(relayId, deviceId2, nonce1);

      // Device 1 claims nonce1
      expect(await store.claimNonce(keyDevice1, 300)).toBe(true);
      // Device 2 claims nonce1 (different composite key) -> accepted
      expect(await store.claimNonce(keyDevice2, 300)).toBe(true);

      // Replay for device 1 -> rejected
      expect(await store.claimNonce(keyDevice1, 300)).toBe(false);
      // Replay for device 2 -> rejected
      expect(await store.claimNonce(keyDevice2, 300)).toBe(false);
    });
  });

  describe("PostgresNonceDeduplicator", () => {
    it("executes atomic INSERT ... ON CONFLICT RETURNING query", async () => {
      const mockQuery = vi.fn().mockImplementation(async (sql: string, params?: unknown[]) => {
        if (sql.includes("CREATE TABLE")) {
          return { rows: [], rowCount: 0 };
        }
        if (sql.includes("INSERT INTO public.relay_nonces")) {
          // Simulate first claim returning nonce_key
          return { rows: [{ nonce_key: params?.[0] }], rowCount: 1 };
        }
        return { rows: [], rowCount: 0 };
      });

      const store = new PostgresNonceDeduplicator(
        mockQuery as unknown as typeof import("../../lib/second-brain/db/client").dbQuery,
      );
      const key = buildRelayNonceKey(relayId, deviceId1, nonce1);

      const result = await store.claimNonce(key, 300);
      expect(result).toBe(true);
      expect(mockQuery).toHaveBeenCalled();
    });

    it("rejects duplicate when Postgres returns 0 rows (active nonce exists)", async () => {
      let callCount = 0;
      const mockQuery = vi.fn().mockImplementation(async (sql: string, params?: unknown[]) => {
        if (sql.includes("CREATE TABLE")) {
          return { rows: [], rowCount: 0 };
        }
        callCount++;
        if (callCount === 1) {
          return { rows: [{ nonce_key: params?.[0] }], rowCount: 1 };
        }
        // Second call: conflict condition NOT met (not expired), returns 0 rows
        return { rows: [], rowCount: 0 };
      });

      const store = new PostgresNonceDeduplicator(
        mockQuery as unknown as typeof import("../../lib/second-brain/db/client").dbQuery,
      );
      const key = buildRelayNonceKey(relayId, deviceId1, nonce1);

      expect(await store.claimNonce(key, 300)).toBe(true);
      // Replay
      expect(await store.claimNonce(key, 300)).toBe(false);
    });
  });

  describe("verifyRelayRequest integration with Nonce Deduplication", () => {
    const config: RelayConfig = {
      relayId,
      allowedDeviceIds: [deviceId1, deviceId2],
      hmacSecret: "test-secret-min-16-characters-long",
      timestampWindowSeconds: 300,
      maxBodyBytes: 16384,
      deliveryProvider: "dev-null",
    };

    const rawJson = JSON.stringify({
      eventId: "748ffec8-47dd-4acb-a908-63bdbbb1d834",
      sender: "VM-HDFCBK",
      body: "Your OTP is 987654",
      receivedAt: "2026-09-16T17:35:44.291Z",
    });
    const bodyBuffer = Buffer.from(rawJson, "utf-8");
    const bodyHash = hashRawBody(bodyBuffer);
    const nowSeconds = 1789587712;

    function buildSignedRequest(nonce: string, devId: string = deviceId1): Request {
      const canonical = buildCanonicalRequest({
        version: "1",
        method: "POST",
        pathname: "/api/v1/relay",
        relayId,
        deviceId: devId,
        timestamp: String(nowSeconds),
        nonce,
        bodyHash,
      });
      const signature = computeHmacSignature(canonical, config.hmacSecret);

      return new Request("http://localhost:3000/api/v1/relay", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-relay-version": "1",
          "x-relay-id": relayId,
          "x-relay-device": devId,
          "x-relay-timestamp": String(nowSeconds),
          "x-relay-nonce": nonce,
          "x-relay-signature": signature,
        },
        body: bodyBuffer,
      });
    }

    it("accepts first request and rejects replayed request with shielded AuthenticationError", async () => {
      const deduplicator = new InMemoryNonceDeduplicator();

      // First submission
      const req1 = buildSignedRequest(nonce1);
      const verified = await verifyRelayRequest(req1, config, {
        nowSeconds,
        nonceDeduplicator: deduplicator,
      });
      expect(verified.nonce).toBe(nonce1);

      // Replay same request -> throws AuthenticationError
      const req2 = buildSignedRequest(nonce1);
      await expect(
        verifyRelayRequest(req2, config, {
          nowSeconds,
          nonceDeduplicator: deduplicator,
        }),
      ).rejects.toThrow(AuthenticationError);
    });

    it("fails closed when deduplicator throws and failClosed is true", async () => {
      const faultyDeduplicator = {
        claimNonce: vi.fn().mockRejectedValue(new Error("Database connection timeout")),
      };

      const req = buildSignedRequest(nonce1);
      await expect(
        verifyRelayRequest(req, config, {
          nowSeconds,
          nonceDeduplicator: faultyDeduplicator,
          failClosed: true,
        }),
      ).rejects.toThrow(AuthenticationError);
    });

    it("permits request when failClosed is explicitly set to false and backend fails", async () => {
      const faultyDeduplicator = {
        claimNonce: vi.fn().mockRejectedValue(new Error("Database connection timeout")),
      };

      const req = buildSignedRequest(nonce1);
      const verified = await verifyRelayRequest(req, config, {
        nowSeconds,
        nonceDeduplicator: faultyDeduplicator,
        failClosed: false,
      });
      expect(verified.nonce).toBe(nonce1);
    });
  });

  describe("FailClosedNonceDeduplicator & Production Safety", () => {
    it("FailClosedNonceDeduplicator always throws AuthenticationError", async () => {
      const { FailClosedNonceDeduplicator } = await import("../auth/nonceStore");
      const failClosed = new FailClosedNonceDeduplicator();
      let caught: any;
      try {
        await failClosed.claimNonce("test-key", 300);
      } catch (err) {
        caught = err;
      }
      expect(caught).toBeDefined();
      expect(caught.name).toBe("AuthenticationError");
      expect(caught.message).toBe("Authentication failed");
      expect(caught.internalReason).toMatch(/Distributed replay protection database is unconfigured in production/);
    });

    it("prevents silent in-memory fallback in production when database is unconfigured", async () => {
      const {
        getDefaultNonceDeduplicator,
        resetDefaultNonceDeduplicator,
        FailClosedNonceDeduplicator,
      } = await import("../auth/nonceStore");
      resetDefaultNonceDeduplicator();

      const originalEnv = process.env.NODE_ENV;
      const originalVercel = process.env.VERCEL_ENV;
      const originalDb = process.env.DATABASE_URL;
      const originalSbDb = process.env.SECOND_BRAIN_DATABASE_URL;

      try {
        process.env.NODE_ENV = "production";
        process.env.VERCEL_ENV = "production";
        delete process.env.DATABASE_URL;
        delete process.env.SECOND_BRAIN_DATABASE_URL;

        const deduplicator = getDefaultNonceDeduplicator();
        expect(deduplicator).toBeInstanceOf(FailClosedNonceDeduplicator);
      } finally {
        process.env.NODE_ENV = originalEnv;
        process.env.VERCEL_ENV = originalVercel;
        if (originalDb) process.env.DATABASE_URL = originalDb;
        if (originalSbDb) process.env.SECOND_BRAIN_DATABASE_URL = originalSbDb;
        resetDefaultNonceDeduplicator();
      }
    });

    it("opportunistic cleanup deletes expired rows asynchronously", async () => {
      let cleanupRan = false;
      const mockQuery = vi.fn().mockImplementation(async (sql: string, params?: unknown[]) => {
        if (sql.includes("CREATE TABLE")) {
          return { rows: [], rowCount: 0 };
        }
        if (sql.includes("DELETE FROM public.relay_nonces")) {
          cleanupRan = true;
          return { rows: [], rowCount: 5 };
        }
        return { rows: [{ nonce_key: params?.[0] }], rowCount: 1 };
      });

      const store = new PostgresNonceDeduplicator(
        mockQuery as unknown as typeof import("../../lib/second-brain/db/client").dbQuery,
      );
      const key = buildRelayNonceKey(relayId, deviceId1, nonce1);
      await store.claimNonce(key, 300);

      // Wait a tick for async non-blocking cleanup
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(cleanupRan).toBe(true);
    });
  });
});
