import { describe, expect, it } from "vitest";
import { DEMO_NOW } from "../clients/demo-clock";
import { radianceSalonConfig, radianceSalonData } from "../clients/radiance-salon";
import { fixedClock } from "../core/clock";
import { MemoryIdempotencyStore } from "../core/idempotency";
import { noopLogger } from "../core/logger";
import { MemoryContactIndex } from "../inbound/contact-index";
import { MemoryConversationStore } from "../inbound/conversation";
import { MemorySuppressionStore } from "../inbound/suppression";
import { inMemoryIntegrations } from "../integrations/memory";
import type { InboundStores } from "../server/inbound-stores";
import { runTick } from "../server/run-tick";

function freshStores(): InboundStores {
  return {
    suppression: new MemorySuppressionStore(),
    conversations: new MemoryConversationStore(),
    idempotency: new MemoryIdempotencyStore(),
    contactIndex: new MemoryContactIndex(),
  };
}

const resolver = (id: string) =>
  id === "radiance-salon" ? inMemoryIntegrations(radianceSalonData) : undefined;

describe("scheduler runTick", () => {
  it("runs each wired client and reports its sends", async () => {
    const stores = freshStores();
    const report = await runTick({
      clients: [radianceSalonConfig],
      resolveIntegrations: resolver,
      storesFor: () => stores,
      applyOverrides: (c) => c, // hermetic: ignore any on-disk operator overrides
      clock: fixedClock(DEMO_NOW),
      logger: noopLogger,
    });

    expect(report.clients).toHaveLength(1);
    expect(report.clients[0].clientId).toBe("radiance-salon");
    expect(report.clients[0].sent).toBe(5);
    expect(report.clients[0].failed).toBe(0);
  });

  it("honours an opt-out written to the shared store within the same tick", async () => {
    const stores = freshStores();
    stores.suppression.optOut("c-noor", "sms"); // as if an inbound STOP arrived earlier

    const report = await runTick({
      clients: [radianceSalonConfig],
      resolveIntegrations: resolver,
      storesFor: () => stores,
      applyOverrides: (c) => c, // hermetic: ignore any on-disk operator overrides
      clock: fixedClock(DEMO_NOW),
      logger: noopLogger,
    });

    expect(report.clients[0].suppressed).toBe(1);
    expect(report.clients[0].sent).toBe(4);
  });

  it("applies operator overrides that disable an automation", async () => {
    const report = await runTick({
      clients: [radianceSalonConfig],
      resolveIntegrations: resolver,
      storesFor: () => freshStores(),
      // Operator toggled win-back off in the dashboard.
      applyOverrides: (c) => ({
        ...c,
        automations: c.automations.map((a) => (a.id === "winback" ? { ...a, enabled: false } : a)),
      }),
      clock: fixedClock(DEMO_NOW),
      logger: noopLogger,
    });
    expect(report.clients[0].sent).toBe(4); // the win-back send is gone
  });

  it("skips a client with no integrations wired", async () => {
    const report = await runTick({
      clients: [radianceSalonConfig],
      resolveIntegrations: () => undefined,
      storesFor: () => freshStores(),
      clock: fixedClock(DEMO_NOW),
      logger: noopLogger,
    });
    expect(report.clients[0].skipped).toBe("no integrations wired");
    expect(report.clients[0].sent).toBe(0);
  });
});
