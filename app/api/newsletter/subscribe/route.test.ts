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
  let savedNodeEnv: string | undefined;
  let savedVercelEnv: string | undefined;
  let infoSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    resetDefaultRateLimiter();
    fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    savedWebhookUrl = process.env.LEAD_WEBHOOK_URL;
    savedNodeEnv = process.env.NODE_ENV;
    savedVercelEnv = process.env.VERCEL_ENV;
    process.env.LEAD_WEBHOOK_URL = "https://hooks.example.com/lead-webhook";
  });

  afterEach(() => {
    if (savedWebhookUrl === undefined) {
      delete process.env.LEAD_WEBHOOK_URL;
    } else {
      process.env.LEAD_WEBHOOK_URL = savedWebhookUrl;
    }
    if (savedNodeEnv === undefined) {
      delete (process.env as Record<string, string | undefined>).NODE_ENV;
    } else {
      (process.env as Record<string, string | undefined>).NODE_ENV = savedNodeEnv;
    }
    if (savedVercelEnv === undefined) {
      delete process.env.VERCEL_ENV;
    } else {
      process.env.VERCEL_ENV = savedVercelEnv;
    }
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("subscribes successfully with 2xx webhook response and returns delivered: true", async () => {
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
    expect(data.delivered).toBe(true);
    expect(data.message).toContain("Tech Founder Briefing");
    expect(data.newsletter.slug).toBe("tech-founder-briefing");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Verify logs do not expose raw or partially masked email
    for (const call of infoSpy.mock.calls) {
      const loggedStr = String(call[0]);
      expect(loggedStr).not.toContain("operator@example.com");
      expect(loggedStr).not.toContain("ope***");
      expect(loggedStr).toContain("newsletter_delivery_succeeded");
    }
  });

  it("returns generic HTTP 503 when LEAD_WEBHOOK_URL is missing in production and logs no PII", async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    delete process.env.LEAD_WEBHOOK_URL;

    const res = await POST(
      makeRequest({
        email: "subscriber@company.com",
        newsletterSlug: "tech-founder-briefing",
      }),
    );

    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("temporarily unavailable");
    expect(fetchMock).not.toHaveBeenCalled();

    // Verify warning log uses safe structured event with reason code, no PII
    expect(warnSpy).toHaveBeenCalledTimes(1);
    const loggedStr = String(warnSpy.mock.calls[0][0]);
    expect(loggedStr).not.toContain("subscriber@company.com");
    expect(loggedStr).toContain('"reason":"missing_webhook_url"');
    expect(loggedStr).toContain('"newsletterSlug":"tech-founder-briefing"');
  });

  it("returns generic HTTP 502 when webhook responds with non-2xx status (5xx/4xx)", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response("CRM Internal Server Error Sensitive Message", { status: 500 }),
    );

    const res = await POST(
      makeRequest({
        email: "subscriber@company.com",
        newsletterSlug: "tech-founder-briefing",
      }),
    );

    expect(res.status).toBe(502);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("Newsletter delivery failed");
    // Ensure upstream sensitive details are not leaked to client
    expect(data.error).not.toContain("CRM Internal Server Error Sensitive Message");

    // Verify log uses stable reason code without raw error or email
    expect(errorSpy).toHaveBeenCalledTimes(1);
    const loggedStr = String(errorSpy.mock.calls[0][0]);
    expect(loggedStr).not.toContain("subscriber@company.com");
    expect(loggedStr).not.toContain("CRM Internal Server Error Sensitive Message");
    expect(loggedStr).toContain('"reason":"webhook_status_error"');
  });

  it("returns generic HTTP 502 when webhook throws network failure or timeout", async () => {
    fetchMock.mockRejectedValueOnce(new Error("ETIMEDOUT: Connection to upstream CRM timed out"));

    const res = await POST(
      makeRequest({
        email: "subscriber@company.com",
        newsletterSlug: "tech-founder-briefing",
      }),
    );

    expect(res.status).toBe(502);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("Newsletter delivery failed");
    expect(data.error).not.toContain("ETIMEDOUT");

    // Verify log uses stable reason code without raw error object or email
    expect(errorSpy).toHaveBeenCalledTimes(1);
    const loggedStr = String(errorSpy.mock.calls[0][0]);
    expect(loggedStr).not.toContain("subscriber@company.com");
    expect(loggedStr).not.toContain("ETIMEDOUT");
    expect(loggedStr).toContain('"reason":"webhook_network_error"');
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
