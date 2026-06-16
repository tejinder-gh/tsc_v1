import { describe, expect, it } from "vitest";
import { brightSmileDentalConfig, brightSmileDentalData } from "../clients/brightsmile-dental";
import { DEMO_NOW } from "../clients/demo-clock";
import { radianceSalonConfig, radianceSalonData } from "../clients/radiance-salon";
import { fixedClock } from "../core/clock";
import { planClient } from "../core/engine";
import { MemoryIdempotencyStore } from "../core/idempotency";
import { noopLogger } from "../core/logger";
import type { Action } from "../core/types";
import { inMemoryIntegrations } from "../integrations/memory";
import { createRegistry } from "../recipes";
import { runClient } from "../runtime/run";

function countKinds(actions: readonly Action[]): Record<Action["kind"], number> {
  const counts = { send: 0, notify: 0, draft: 0 };
  for (const a of actions) counts[a.kind] += 1;
  return counts;
}

function deps(integrations: ReturnType<typeof inMemoryIntegrations>) {
  return {
    registry: createRegistry(),
    integrations,
    idempotency: new MemoryIdempotencyStore(),
    clock: fixedClock(DEMO_NOW),
    logger: noopLogger,
  };
}

describe("Radiance Salon (local segment) plan", () => {
  it("fires the four enabled automations with the expected sends", async () => {
    const result = await planClient(
      radianceSalonConfig,
      deps(inMemoryIntegrations(radianceSalonData)),
    );
    expect(result.errors).toEqual([]);
    const counts = countKinds(result.actions);
    // 2 reminders (24h + 2h) + 1 review request + 1 no-show nudge + 1 win-back = 5 sends.
    expect(counts).toEqual({ send: 5, notify: 0, draft: 0 });
    expect(result.actions.every((a) => a.kind === "send" && a.message.channel === "sms")).toBe(
      true,
    );
    expect(
      result.actions.some((a) => a.kind === "send" && a.message.body.includes("Radiance Salon")),
    ).toBe(true);
  });
});

describe("BrightSmile Dental (practice segment) plan", () => {
  it("runs a different recipe mix on the same engine", async () => {
    const result = await planClient(
      brightSmileDentalConfig,
      deps(inMemoryIntegrations(brightSmileDentalData)),
    );
    expect(result.errors).toEqual([]);
    const counts = countKinds(result.actions);
    // booking reminder + invoice email + lead reply = 3 sends; lead + review alerts = 2 notify; 2 review drafts.
    expect(counts).toEqual({ send: 3, notify: 2, draft: 2 });

    const draft = result.actions.find((a) => a.kind === "draft");
    expect(draft?.kind === "draft" && draft.content.body).toContain("BrightSmile Dental");

    const hotLead = result.actions.find(
      (a) => a.kind === "notify" && a.summary.startsWith("Hot lead"),
    );
    expect(hotLead).toBeDefined();

    const invoice = result.actions.find(
      (a) => a.kind === "send" && a.message.subject?.includes("1042"),
    );
    expect(invoice).toBeDefined();
  });
});

describe("idempotency across runs", () => {
  it("dispatches once, then nothing on a second identical run", async () => {
    const shared = new MemoryIdempotencyStore();
    const clock = fixedClock(DEMO_NOW);
    const options = {
      integrations: inMemoryIntegrations(radianceSalonData),
      idempotency: shared,
      clock,
      logger: noopLogger,
    };

    const first = await runClient(radianceSalonConfig, options);
    expect(first.dispatch.sent).toBe(5);
    expect(first.dispatch.failed).toBe(0);

    const second = await runClient(radianceSalonConfig, options);
    expect(second.dispatch.sent).toBe(0);
    expect(second.plan.actions).toHaveLength(0);
  });
});
