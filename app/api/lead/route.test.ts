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
import { POST } from "./route";

const WEBHOOK_URL = "https://hooks.example.com/catch";

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const validLead = { lead_source: "contact_form", email: "a@b.co" };

let fetchMock: ReturnType<typeof vi.fn>;
let savedWebhookUrl: string | undefined;

beforeEach(() => {
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

  it("drops a honeypot-filled submission with fake success and never calls the webhook", async () => {
    process.env.LEAD_WEBHOOK_URL = WEBHOOK_URL;
    const res = await POST(makeRequest({ ...validLead, website: "http://spam.example" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true, delivered: false });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("Honeypot"),
      expect.any(String),
    );
  });

  it("fails loud (503) when LEAD_WEBHOOK_URL is unset in production", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const res = await POST(makeRequest(validLead));
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  // REGRESSION (mandatory): the prod guard must not change the dev/preview path.
  it("keeps the dev-friendly path when LEAD_WEBHOOK_URL is unset outside production", async () => {
    const res = await POST(makeRequest(validLead));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true, delivered: false });
    expect(fetchMock).not.toHaveBeenCalled();
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
});
