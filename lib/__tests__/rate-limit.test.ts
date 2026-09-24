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
    it("prioritizes x-real-ip over x-forwarded-for to prevent client header spoofing", () => {
      const req = new Request("http://localhost", {
        headers: {
          "x-real-ip": "203.0.113.50",
          "x-forwarded-for": "1.2.3.4, 10.0.0.1",
        },
      });
      expect(getClientIp(req)).toBe("203.0.113.50");
    });

    it("prioritizes x-vercel-ip if x-real-ip is absent", () => {
      const req = new Request("http://localhost", {
        headers: {
          "x-vercel-ip": "203.0.113.99",
          "x-forwarded-for": "1.2.3.4",
        },
      });
      expect(getClientIp(req)).toBe("203.0.113.99");
    });

    it("falls back to first ip from x-forwarded-for header when edge headers are absent", () => {
      const req = new Request("http://localhost", {
        headers: { "x-forwarded-for": "198.51.100.1, 10.0.0.1" },
      });
      expect(getClientIp(req)).toBe("198.51.100.1");
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
      let cleanupRan = false;
      const mockQuery = vi.fn().mockImplementation((sql: string) => {
        if (sql.includes("CREATE TABLE")) {
          return Promise.resolve({ rows: [] });
        }
        if (sql.includes("DELETE FROM public.rate_limits")) {
          cleanupRan = true;
          return Promise.resolve({ rows: [] });
        }
        return Promise.resolve({ rows: [{ count: 1, retry_after: 60 }] });
      });

      const limiter = new PostgresRateLimiter(
        mockQuery as unknown as typeof import("../second-brain/db/client").dbQuery,
      );
      const res = await limiter.consume("ratelimit:/api/lead:hash123", 5, 60);

      expect(res.allowed).toBe(true);
      expect(res.remaining).toBe(4);
      expect(res.resetAfterSeconds).toBe(60);
      expect(mockQuery).toHaveBeenCalled();

      // Wait a tick for async non-blocking cleanup
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(cleanupRan).toBe(true);
    });
  });

  describe("checkPublicRateLimit", () => {
    it("passes through to provided limiter and hashes client IP so raw IP is never persisted", async () => {
      let capturedKey = "";
      const customLimiter = {
        consume: vi.fn().mockImplementation((key: string, limit: number, windowSeconds: number) => {
          capturedKey = key;
          return Promise.resolve({
            allowed: true,
            limit,
            remaining: limit - 1,
            resetAfterSeconds: windowSeconds,
          });
        }),
      };

      const rawClientIp = "203.0.113.88";
      const req = new Request("http://localhost/api/lead", {
        headers: { "x-real-ip": rawClientIp },
      });

      const res = await checkPublicRateLimit(req, {
        route: "/api/lead",
        limit: 5,
        windowSeconds: 30,
        limiter: customLimiter,
      });

      expect(res.allowed).toBe(true);
      // Key format: ratelimit:/api/lead:<hash>
      expect(capturedKey).toBe(`ratelimit:/api/lead:${hashIdentifier(rawClientIp)}`);
      // Crucial: Raw IP is NEVER in the key
      expect(capturedKey).not.toContain(rawClientIp);
    });
  });
});
