/**
 * What: The standalone scheduler worker - a long-running process that calls runTick on an interval.
 * Why: For self-hosted deployments (a small VM, a container, a Render/Fly worker) this is the
 *       simplest way to keep automations running: one process, file-backed stores, no external cron.
 *       (On Vercel/serverless, use the /api/cron route with a platform cron instead.)
 * How: A non-overlapping loop (await the tick, then sleep) so a slow tick never stacks. Interval is
 *       SCHEDULER_INTERVAL_MS (default 5 minutes). Exits cleanly on SIGINT/SIGTERM after the current
 *       tick. Runs in dry-run unless the client configs have dryRun:false and live credentials are set.
 * From Where: TheSkillCorner automation-engine - scheduler, 2026-06.
 * When: 2026-06.
 */

import { consoleLogger } from "../core/logger";
import { runTick } from "../server/run-tick";

const DEFAULT_INTERVAL_MS = 300_000;
const intervalMs = Math.max(
  15_000,
  Number(process.env.SCHEDULER_INTERVAL_MS ?? DEFAULT_INTERVAL_MS),
);

let stopped = false;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main(): Promise<void> {
  consoleLogger.info("scheduler starting", { intervalMs });
  while (!stopped) {
    try {
      await runTick({ logger: consoleLogger });
    } catch (error: unknown) {
      consoleLogger.error("scheduler tick failed", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
    if (stopped) break;
    await sleep(intervalMs);
  }
  consoleLogger.info("scheduler stopped");
}

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    consoleLogger.info("scheduler received stop signal", { signal });
    stopped = true;
  });
}

main().catch((error: unknown) => {
  consoleLogger.error("scheduler crashed", {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exitCode = 1;
});
