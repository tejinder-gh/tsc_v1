/**
 * What: A runnable demo entrypoint - executes every demo client through the full engine in
 *       dry-run at a fixed instant, printing what each automation would send today.
 * Why: Proves the whole system end-to-end with no credentials and no real customers touched:
 *       `npx tsx automations/runtime/cli.ts`. It is the fastest way to see "use code once, use for
 *       many" working across two very different businesses.
 * How: Pins a FixedClock to DEMO_NOW and a fresh MemoryIdempotencyStore (so the demo always shows
 *       a full day's plan), then runs each client and prints a per-client report.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import { DEMO_NOW, demoClients } from "../clients";
import { fixedClock } from "../core/clock";
import { MemoryDraftStore } from "../core/drafts";
import { MemoryIdempotencyStore } from "../core/idempotency";
import { consoleLogger } from "../core/logger";
import { applyOverrides } from "../core/overrides";
import { runClient } from "./run";

async function main(): Promise<void> {
  const clock = fixedClock(DEMO_NOW);
  consoleLogger.info("=== Automation demo run ===", { now: DEMO_NOW, clients: demoClients.length });

  for (const client of demoClients) {
    const config = applyOverrides(client.config);
    consoleLogger.info(`--- ${config.business.name} (${config.id}) ---`);
    const result = await runClient(config, {
      integrations: client.integrations,
      clock,
      // Fresh per client so the demo always renders the full plan (nothing pre-marked).
      idempotency: new MemoryIdempotencyStore(),
      draftStore: new MemoryDraftStore(),
      logger: consoleLogger,
    });

    if (result.plan.errors.length > 0) {
      consoleLogger.error("plan errors", { errors: result.plan.errors });
    }
  }

  consoleLogger.info("=== Demo complete ===");
}

main().catch((error: unknown) => {
  consoleLogger.error("demo run failed", {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exitCode = 1;
});
