import { describe, expect, it } from "vitest";
import { fixedClock } from "../core/clock";
import { loadClientConfig } from "../core/config";
import { planClient } from "../core/engine";
import { MemoryIdempotencyStore } from "../core/idempotency";
import { noopLogger } from "../core/logger";
import { inMemoryIntegrations } from "../integrations/memory";
import { createRegistry } from "../recipes";

const baseClient = {
  id: "x",
  business: { name: "X", segment: "local" as const },
  channels: { dryRun: true },
};

describe("loadClientConfig", () => {
  it("accepts a minimal valid config and applies defaults", () => {
    const config = loadClientConfig(baseClient);
    expect(config.business.timezone).toBe("America/Toronto");
    expect(config.channels.dryRun).toBe(true);
    expect(config.automations).toEqual([]);
  });

  it("rejects a config missing the business name", () => {
    expect(() => loadClientConfig({ ...baseClient, business: { segment: "local" } })).toThrow(
      /business\.name/,
    );
  });
});

describe("engine error isolation", () => {
  const deps = () => ({
    registry: createRegistry(),
    integrations: inMemoryIntegrations({}),
    idempotency: new MemoryIdempotencyStore(),
    clock: fixedClock("2026-06-15T15:00:00.000Z"),
    logger: noopLogger,
  });

  it("captures an unknown recipe as a per-automation error without throwing", async () => {
    const config = loadClientConfig({
      ...baseClient,
      automations: [{ id: "a1", recipe: "does-not-exist", config: {} }],
    });
    const result = await planClient(config, deps());
    expect(result.actions).toEqual([]);
    expect(result.errors[0].message).toContain("Unknown recipe");
  });

  it("captures an invalid recipe config as a readable error", async () => {
    const config = loadClientConfig({
      ...baseClient,
      automations: [
        { id: "a1", recipe: "win-back", config: { inactiveDays: 2 } }, // below the min of 7
      ],
    });
    const result = await planClient(config, deps());
    expect(result.errors[0].message).toContain('Invalid config for recipe "win-back"');
  });
});
