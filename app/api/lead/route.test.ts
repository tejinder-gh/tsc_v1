/**
 * What: Unit tests for POST /api/lead - every branch in the route's header diagram:
 *       JSON/schema rejection, honeypot drop, env guard (prod loud / dev friendly),
 *       webhook forward, and both delivery-failure paths.
 * Why: This route is the only server code between a visitor and the CRM; the
 *      /plan-eng-review Engineering Spec mandates full branch coverage, including
 *      the regression test for the dev-friendly missing-env path that the
 *      production guard modifies.
 * How: Stubbed global fetch + stubbed env vars; each test builds a Request and
 *      asserts status, body, and whether the webhook was called.
 * From Where: /plan-eng-review Engineering Spec (test suite), 2026-06-12.
 * When: 2026-06.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetDefaultRateLimiter } from "@/lib/rate-limit";
import { POST } from "./route";

const WEBHOOK_URL = "https://hooks.example.com/catch";

function makeRequest(body: unknown, headers?: Record<string, string>): Request {
  return new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const validLead = { lead_source: "contact_form", email: "a@b.co" };

let fetchMock: ReturnType<typeof vi.fn>;
let savedWebhookUrl: string | undefined;

beforeEach(() => {
  resetDefaultRateLimiter();
  fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  savedWebhookUrl = process.env.LEAD_WEBHOOK_URL;
  delete process.env.LEAD_WEBHOOK_URL;
});

afterEach(() => {
  if (savedWebhookUrl === undefined) {
    delete process.env.LEAD_WEBHOOK_URL;
  } else {
    process.env.LEAD_WEBHOOK_URL = savedWebhookUrl;
  }
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/lead", () => {
  it("rejects oversized declared Content-Length with 413", async () => {
    const req = new Request("http://localhost/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": "40000" },
      body: JSON.stringify(validLead),
    });
    const res = await POST(req);
    expect(res.status).toBe(413);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  it("rejects oversized actual payload with 413", async () => {
    const bigPayload = { ...validLead, message: "x".repeat(35000) };
    const req = new Request("http://localhost/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bigPayload),
    });
    const res = await POST(req);
    expect(res.status).toBe(413);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  it("rejects oversized actual payload when Content-Length is absent with 413", async () => {
    const raw = JSON.stringify({ ...validLead, message: "x".repeat(35000) });
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(raw));
        controller.close();
      },
    });
    const req = new Request("http://localhost/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: stream,
      // @ts-expect-error duplex required for ReadableStream body in Node
      duplex: "half",
    });
    const res = await POST(req);
    expect(res.status).toBe(413);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  it("rejects oversized actual payload when Content-Length claims small value with 413", async () => {
    const raw = JSON.stringify({ ...validLead, message: "x".repeat(35000) });
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(raw));
        controller.close();
      },
    });
    const req = new Request("http://localhost/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": "10" },
      body: stream,
      // @ts-expect-error duplex required for ReadableStream body in Node
      duplex: "half",
    });
    const res = await POST(req);
    expect(res.status).toBe(413);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  it("rejects a malformed JSON body with 400", async () => {
    const res = await POST(makeRequest("not-json{"));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  it("rejects a schema-invalid lead (no email or message) with 400", async () => {
    const res = await POST(makeRequest({ lead_source: "contact_form" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toMatch(/email or a message/);
  });

  it("AC1 & AC3: drops a honeypot-filled submission with fake success and never logs PII", async () => {
    process.env.LEAD_WEBHOOK_URL = WEBHOOK_URL;
    const sensitiveLead = {
      ...validLead,
      name: "Secret Person",
      email: "secret@confidential.com",
      company: "Classified Inc",
      notes: "Extremely private notes",
      website: "http://spam.example",
    };
    const res = await POST(makeRequest(sensitiveLead));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true, delivered: false });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("Honeypot tripped; submission dropped"),
    );

    // Verify no customer PII was logged
    const loggedArgs = (console.warn as ReturnType<typeof vi.fn>).mock.calls.flat().join(" ");
    expect(loggedArgs).not.toContain("Secret Person");
    expect(loggedArgs).not.toContain("secret@confidential.com");
    expect(loggedArgs).not.toContain("Classified Inc");
    expect(loggedArgs).not.toContain("Extremely private notes");
    expect(loggedArgs).not.toContain("http://spam.example");
  });

  it("AC2 & AC3: fails loud (503) when LEAD_WEBHOOK_URL is unset in production and never logs PII", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const sensitiveLead = {
      ...validLead,
      name: "Production Lead Name",
      email: "prod-lead@enterprise.com",
      company: "Enterprise Corp",
      notes: "Internal confidential requirement",
    };
    const res = await POST(makeRequest(sensitiveLead));
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("LEAD_WEBHOOK_URL is not set in production"),
    );

    // Verify no customer PII was logged
    const loggedArgs = (console.error as ReturnType<typeof vi.fn>).mock.calls.flat().join(" ");
    expect(loggedArgs).not.toContain("Production Lead Name");
    expect(loggedArgs).not.toContain("prod-lead@enterprise.com");
    expect(loggedArgs).not.toContain("Enterprise Corp");
    expect(loggedArgs).not.toContain("Internal confidential requirement");
  });

  // REGRESSION (mandatory): the prod guard must not change the dev/preview path.
  it("keeps the dev-friendly path when LEAD_WEBHOOK_URL is unset outside production and does not log PII", async () => {
    const sensitiveLead = {
      ...validLead,
      name: "Dev Lead Name",
      email: "dev-lead@test.com",
    };
    const res = await POST(makeRequest(sensitiveLead));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true, delivered: false });
    expect(fetchMock).not.toHaveBeenCalled();

    const loggedArgs = (console.warn as ReturnType<typeof vi.fn>).mock.calls.flat().join(" ");
    expect(loggedArgs).not.toContain("Dev Lead Name");
    expect(loggedArgs).not.toContain("dev-lead@test.com");
  });

  it("forwards a valid lead, strips the honeypot field, and stamps submitted_at", async () => {
    process.env.LEAD_WEBHOOK_URL = WEBHOOK_URL;
    const res = await POST(makeRequest({ ...validLead, segment: "practice", website: "" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true, delivered: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(WEBHOOK_URL);
    const forwarded = JSON.parse(init.body);
    expect(forwarded.lead_source).toBe("contact_form");
    expect(forwarded.segment).toBe("practice");
    expect(forwarded.submitted_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect("website" in forwarded).toBe(false);
  });

  it("returns 502 when the webhook responds non-2xx", async () => {
    process.env.LEAD_WEBHOOK_URL = WEBHOOK_URL;
    fetchMock.mockResolvedValue(new Response(null, { status: 500 }));
    const res = await POST(makeRequest(validLead));
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toMatch(/try again/i);
  });

  it("returns 502 when the webhook call throws (network failure / timeout)", async () => {
    process.env.LEAD_WEBHOOK_URL = WEBHOOK_URL;
    fetchMock.mockRejectedValue(new Error("network down"));
    const res = await POST(makeRequest(validLead));
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  it("forwards demonstration_architecture_request with validated journey_context to webhook", async () => {
    process.env.LEAD_WEBHOOK_URL = WEBHOOK_URL;
    const reqBody = {
      lead_source: "demonstration_architecture_request",
      email: "engineer@company.com",
      name: "Jordan Lee",
      business: "Acme Logistics",
      journey_context: {
        opportunityId: "systems-integration",
        scenarioId: "sc-01",
        scenarioTitle: "Legacy ERP Integration",
      },
    };
    const res = await POST(makeRequest(reqBody));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true, delivered: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(WEBHOOK_URL);
    const forwarded = JSON.parse(init.body);
    expect(forwarded.lead_source).toBe("demonstration_architecture_request");
    expect(forwarded.name).toBe("Jordan Lee");
    expect(forwarded.email).toBe("engineer@company.com");
    expect(forwarded.business).toBe("Acme Logistics");
    expect(forwarded.journey_context).toEqual({
      opportunityId: "systems-integration",
      scenarioId: "sc-01",
      scenarioTitle: "Legacy ERP Integration",
    });
    expect(forwarded.submitted_at).toBeDefined();
  });

  it("strips unsupported and undeclared fields (e.g. freeformProblem) from forwarded payload", async () => {
    process.env.LEAD_WEBHOOK_URL = WEBHOOK_URL;
    const reqBody = {
      lead_source: "demonstration_architecture_request",
      email: "engineer@company.com",
      freeformProblem: "Internal user sensitive free-text problem description",
      raw_steps: [{ step: 1, internalSecret: "hidden" }],
      journey_context: {
        opportunityId: "systems-integration",
        scenarioId: "sc-01",
        scenarioTitle: "Legacy ERP Integration",
      },
    };
    const res = await POST(makeRequest(reqBody));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true, delivered: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const forwarded = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect("freeformProblem" in forwarded).toBe(false);
    expect("raw_steps" in forwarded).toBe(false);
    expect(forwarded.journey_context).toBeDefined();
  });

  it("rejects schema-invalid journey_context with 400", async () => {
    const res = await POST(
      makeRequest({
        lead_source: "demonstration_architecture_request",
        email: "engineer@company.com",
        journey_context: {
          opportunityId: "",
          scenarioId: "sc-01",
          scenarioTitle: "Legacy ERP Integration",
        },
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  it("throttles excessive requests with 429 and Retry-After header without logging PII", async () => {
    process.env.LEAD_WEBHOOK_URL = WEBHOOK_URL;
    const testIp = "203.0.113.42";
    const headers = { "x-forwarded-for": testIp };

    // Send 10 allowed requests
    for (let i = 0; i < 10; i++) {
      const res = await POST(makeRequest({ ...validLead, email: `user${i}@example.com` }, headers));
      expect(res.status).toBe(200);
    }

    // 11th request should be throttled
    const throttledRes = await POST(
      makeRequest(
        { ...validLead, email: "victim@example.com", name: "Confidential Person" },
        headers,
      ),
    );
    expect(throttledRes.status).toBe(429);
    expect(throttledRes.headers.get("Retry-After")).toBeDefined();
    const throttledBody = await throttledRes.json();
    expect(throttledBody).toEqual({
      ok: false,
      error: "Too many requests. Please try again later.",
    });

    // Verify raw PII was not logged during throttling
    const warnLogs = (console.warn as ReturnType<typeof vi.fn>).mock.calls.flat().join(" ");
    const errorLogs = (console.error as ReturnType<typeof vi.fn>).mock.calls.flat().join(" ");
    expect(warnLogs).not.toContain("victim@example.com");
    expect(warnLogs).not.toContain("Confidential Person");
    expect(errorLogs).not.toContain("victim@example.com");
    expect(errorLogs).not.toContain("Confidential Person");

    // Request from a different IP is still permitted
    const diffIpRes = await POST(makeRequest(validLead, { "x-forwarded-for": "198.51.100.99" }));
    expect(diffIpRes.status).toBe(200);
  });
});
