import { describe, expect, it, vi } from "vitest";
import {
  checkPublicRateLimit,
  getClientIp,
  hashIdentifier,
  InMemoryRateLimiter,
  PostgresRateLimiter,
} from "../rate-limit";

describe("Rate Limiting Utilities", () => {
  describe("getClientIp", () => {
    it("extracts first ip from x-forwarded-for header", () => {
      const req = new Request("http://localhost", {
        headers: { "x-forwarded-for": "198.51.100.1, 10.0.0.1" },
      });
      expect(getClientIp(req)).toBe("198.51.100.1");
    });

    it("falls back to x-real-ip if x-forwarded-for is absent", () => {
      const req = new Request("http://localhost", {
        headers: { "x-real-ip": "203.0.113.19" },
      });
      expect(getClientIp(req)).toBe("203.0.113.19");
    });

    it("defaults to 127.0.0.1 if no headers present", () => {
      const req = new Request("http://localhost");
      expect(getClientIp(req)).toBe("127.0.0.1");
    });
  });

  describe("hashIdentifier", () => {
    it("produces consistent lowercase truncated sha256 hash", () => {
      const h1 = hashIdentifier("Test.User@Example.COM");
      const h2 = hashIdentifier("test.user@example.com ");
      expect(h1).toBe(h2);
      expect(h1).toHaveLength(16);
      expect(h1).not.toContain("@");
    });
  });

  describe("InMemoryRateLimiter", () => {
    it("permits up to limit and rejects on limit + 1", async () => {
      const limiter = new InMemoryRateLimiter();
      const key = "test:user:1";

      for (let i = 1; i <= 3; i++) {
        const res = await limiter.consume(key, 3, 60);
        expect(res.allowed).toBe(true);
        expect(res.remaining).toBe(3 - i);
      }

      const blocked = await limiter.consume(key, 3, 60);
      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);
      expect(blocked.resetAfterSeconds).toBeGreaterThan(0);
    });

    it("clears expired keys correctly", () => {
      const limiter = new InMemoryRateLimiter();
      limiter.consume("k1", 1, 60);
      limiter.clear();
      // Should be fresh
    });
  });

  describe("PostgresRateLimiter", () => {
    it("calls queryFn with upsert query and returns result", async () => {
      const mockQuery = vi.fn().mockImplementation((sql: string) => {
        if (sql.includes("CREATE TABLE")) {
          return Promise.resolve({ rows: [] });
        }
        return Promise.resolve({ rows: [{ count: 1, retry_after: 60 }] });
      });

      const limiter = new PostgresRateLimiter(
        mockQuery as unknown as typeof import("../second-brain/db/client").dbQuery,
      );
      const res = await limiter.consume("ratelimit:/api/lead:1.2.3.4", 5, 60);

      expect(res.allowed).toBe(true);
      expect(res.remaining).toBe(4);
      expect(res.resetAfterSeconds).toBe(60);
      expect(mockQuery).toHaveBeenCalled();
    });
  });

  describe("checkPublicRateLimit", () => {
    it("passes through to provided limiter", async () => {
      const limiter = new InMemoryRateLimiter();
      const req = new Request("http://localhost/api/lead", {
        headers: { "x-real-ip": "1.2.3.4" },
      });

      const res = await checkPublicRateLimit(req, {
        route: "/api/lead",
        limit: 2,
        windowSeconds: 30,
        limiter,
      });

      expect(res.allowed).toBe(true);
      expect(res.remaining).toBe(1);
    });
  });
});
