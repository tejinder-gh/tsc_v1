import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetDefaultRateLimiter } from "@/lib/rate-limit";
import { POST } from "./route";

function makeRequest(body: unknown, headers?: Record<string, string>): Request {
  return new Request("http://localhost/api/newsletter/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/newsletter/subscribe", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let savedWebhookUrl: string | undefined;

  beforeEach(() => {
    resetDefaultRateLimiter();
    fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    savedWebhookUrl = process.env.LEAD_WEBHOOK_URL;
    process.env.LEAD_WEBHOOK_URL = "https://hooks.example.com/lead-webhook";
  });

  afterEach(() => {
    if (savedWebhookUrl === undefined) {
      delete process.env.LEAD_WEBHOOK_URL;
    } else {
      process.env.LEAD_WEBHOOK_URL = savedWebhookUrl;
    }
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("subscribes successfully to a valid newsletter publication", async () => {
    const res = await POST(
      makeRequest({
        email: "operator@example.com",
        newsletterSlug: "tech-founder-briefing",
        sourceContext: "test-runner",
      }),
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain("Tech Founder Briefing");
    expect(data.newsletter.slug).toBe("tech-founder-briefing");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid email formats with 400", async () => {
    const res = await POST(
      makeRequest({
        email: "invalid-email-no-at",
        newsletterSlug: "tech-founder-briefing",
      }),
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Validation failed");
  });

  it("returns 404 for unknown newsletter publication slugs", async () => {
    const res = await POST(
      makeRequest({
        email: "operator@example.com",
        newsletterSlug: "non-existent-publication",
      }),
    );

    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toContain("not found");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("drops honeypot bot submissions silently without calling the webhook", async () => {
    const res = await POST(
      makeRequest({
        email: "bot@spammer.com",
        newsletterSlug: "tech-founder-briefing",
        botField: "I am a scraper bot",
      }),
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects oversized request bodies (> 32KB) with 413", async () => {
    const hugePayload = {
      email: "operator@example.com",
      newsletterSlug: "tech-founder-briefing",
      sourceContext: "x".repeat(35 * 1024),
    };

    const res = await POST(makeRequest(hugePayload));
    expect(res.status).toBe(413);
    const data = await res.json();
    expect(data.error).toBe("Payload too large");
  });

  it("rejects malformed JSON payloads with 400", async () => {
    const res = await POST(makeRequest("NOT_VALID_JSON{"));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Malformed JSON payload");
  });

  it("throttles excessive requests with 429 and Retry-After header", async () => {
    const testIp = "198.51.100.12";
    const headers = { "x-forwarded-for": testIp };

    for (let i = 0; i < 10; i++) {
      const res = await POST(
        makeRequest(
          {
            email: `operator${i}@example.com`,
            newsletterSlug: "tech-founder-briefing",
          },
          headers,
        ),
      );
      expect(res.status).toBe(200);
    }

    const throttledRes = await POST(
      makeRequest(
        {
          email: "victim@example.com",
          newsletterSlug: "tech-founder-briefing",
        },
        headers,
      ),
    );
    expect(throttledRes.status).toBe(429);
    expect(throttledRes.headers.get("Retry-After")).toBeDefined();
    const throttledData = await throttledRes.json();
    expect(throttledData.success).toBe(false);
    expect(throttledData.error).toContain("Too many requests");

    // Request from another IP should still pass
    const diffIpRes = await POST(
      makeRequest(
        {
          email: "another@example.com",
          newsletterSlug: "tech-founder-briefing",
        },
        { "x-forwarded-for": "203.0.113.88" },
      ),
    );
    expect(diffIpRes.status).toBe(200);
  });
});
