import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

vi.mock("@/automations/server/run-tick");
vi.mock("@/automations/core/logger", () => ({
  consoleLogger: {
    error: vi.fn(),
  },
}));

import { runTick } from "@/automations/server/run-tick";

describe("GET /api/cron", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.CRON_SECRET;
  });

  it("rejects request when CRON_SECRET is unset", async () => {
    delete process.env.CRON_SECRET;

    const request = new Request("http://localhost:3000/api/cron", {
      method: "GET",
    });

    const response = await GET(request);
    expect(response.status).toBe(401);
    expect(runTick).not.toHaveBeenCalled();
  });

  it("accepts and runs the tick with correct authorization header", async () => {
    process.env.CRON_SECRET = "test-secret";
    const runTickMock = vi.mocked(runTick);
    runTickMock.mockResolvedValue({
      ranAt: "2026-08-08T10:00:00Z",
      clients: [],
    });

    const request = new Request("http://localhost:3000/api/cron", {
      method: "GET",
      headers: {
        authorization: "Bearer test-secret",
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(200);
    expect(runTickMock).toHaveBeenCalledWith({
      logger: expect.any(Object),
    });

    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.ranAt).toBe("2026-08-08T10:00:00Z");
    expect(body.clients).toEqual([]);
  });

  it("rejects request with missing authorization header when CRON_SECRET is set", async () => {
    process.env.CRON_SECRET = "test-secret";

    const request = new Request("http://localhost:3000/api/cron", {
      method: "GET",
    });

    const response = await GET(request);
    expect(response.status).toBe(401);
    expect(runTick).not.toHaveBeenCalled();
  });

  it("rejects request with incorrect authorization header when CRON_SECRET is set", async () => {
    process.env.CRON_SECRET = "test-secret";

    const request = new Request("http://localhost:3000/api/cron", {
      method: "GET",
      headers: {
        authorization: "Bearer wrong-secret",
      },
    });

    const response = await GET(request);
    expect(response.status).toBe(401);
    expect(runTick).not.toHaveBeenCalled();
  });
});
