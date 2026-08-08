/**
 * What: GET /api/cron - runs one scheduler tick (every enabled automation for every client) and
 *       returns the per-client summary. The serverless way to keep automations running.
 * Why: On Vercel/serverless there's no long-lived process, so a platform cron pings this endpoint on
 *       a schedule. It shares the same stores as /api/inbound, so opt-outs and the contact index are
 *       consistent across both halves of the loop.
 * How: Verifies a bearer secret (CRON_SECRET) - which Vercel Cron sends automatically when the env
 *       var is set - then delegates to runTick. Returns JSON for observability in cron logs.
 *
 *      Vercel setup (vercel.json):
 *        { "crons": [{ "path": "/api/cron", "schedule": "* /5 * * * *" }] }
 *      and set CRON_SECRET in the project env. (Cron cadence depends on your Vercel plan.)
 * From Where: TheSkillCorner automation-engine - scheduler, 2026-06.
 * When: 2026-06.
 */

import { consoleLogger } from "@/automations/core/logger";
import { runTick } from "@/automations/server/run-tick";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const report = await runTick({ logger: consoleLogger });
    return Response.json({ ok: true, ...report });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    consoleLogger.error("cron tick failed", { error: message });
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
