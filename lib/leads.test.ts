/**
 * What: Unit tests for the submitLead client helper - presentable error paths and
 *       the delivered-flag analytics condition.
 * Why: Five capture surfaces share this helper; the delivered !== false condition
 *      is what keeps honeypot-caught bots and undelivered dev submissions out of
 *      the lead_captured conversion goal.
 * How: Mocked ./analytics and stubbed global fetch; node environment (no window,
 *      so `page` stays undefined).
 * From Where: /plan-eng-review Engineering Spec (test suite), 2026-06-12.
 * When: 2026-06.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { track } from "./analytics";
import { submitLead } from "./leads";

vi.mock("./analytics", () => ({ track: vi.fn() }));

const lead = { lead_source: "contact_form", segment: "local" as const, email: "a@b.co" };

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("submitLead", () => {
  it("throws a presentable error when the network is unreachable", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    await expect(submitLead(lead)).rejects.toThrow(/Check your connection/);
    expect(track).not.toHaveBeenCalled();
  });

  it("throws a presentable error on a non-2xx response", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 502 }));
    await expect(submitLead(lead)).rejects.toThrow(/try again, or email us/);
    expect(track).not.toHaveBeenCalled();
  });

  it("fires lead_captured when the lead is delivered", async () => {
    fetchMock.mockResolvedValue(Response.json({ ok: true, delivered: true }));
    await submitLead(lead);
    expect(track).toHaveBeenCalledExactlyOnceWith("lead_captured", {
      location: "contact_form",
      segment: "local",
    });
  });

  it("does NOT fire lead_captured when delivered is false (honeypot drop / dev mode)", async () => {
    fetchMock.mockResolvedValue(Response.json({ ok: true, delivered: false }));
    await submitLead(lead);
    expect(track).not.toHaveBeenCalled();
  });

  it("assumes delivered on a non-JSON success body so analytics still fire", async () => {
    fetchMock.mockResolvedValue(new Response("", { status: 200 }));
    await submitLead({ ...lead, segment: undefined });
    expect(track).toHaveBeenCalledExactlyOnceWith("lead_captured", {
      location: "contact_form",
      segment: "unknown",
    });
  });
});
