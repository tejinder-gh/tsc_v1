/**
 * What: runTick - one pass of the scheduler. For every known client it loads the client's
 *       integrations and shared stores and calls runClient, collecting a per-client summary.
 * Why: This is what makes the engine *live*. A cron route or a worker loop calls runTick on an
 *       interval; everything below it is the pure engine. Crucially it uses the SAME file-backed
 *       stores the inbound webhook uses (getInboundStores), so an opt-out a customer just sent is
 *       honoured on this very tick - the outbound and inbound halves share one source of truth.
 * How: Iterates clients sequentially (file stores prefer no concurrent writers), resolves each
 *       client's integrations (skipping any without a wiring), and runs the client. Failures are
 *       isolated per client so one bad integration never stops the rest.
 * From Where: TheSkillCorner automation-engine - scheduler, 2026-06.
 * When: 2026-06.
 */

import { type Clock, systemClock } from "../core/clock";
import type { ClientConfig } from "../core/config";
import { consoleLogger, type Logger } from "../core/logger";
import { knownClients } from "./clients-registry";
import { demoIntegrationsResolver, type IntegrationsResolver } from "./integrations-resolver";
import { getInboundStores, type InboundStores } from "./inbound-stores";

export interface TickOptions {
  clients?: readonly ClientConfig[];
  resolveIntegrations?: IntegrationsResolver;
  /** Override how per-client stores are obtained (tests pass in-memory). */
  storesFor?: (clientId: string) => InboundStores;
  clock?: Clock;
  logger?: Logger;
  env?: Record<string, string | undefined>;
}

export interface ClientTickResult {
  clientId: string;
  skipped?: string;
  planned: number;
  sent: number;
  notified: number;
  drafted: number;
  suppressed: number;
  failed: number;
  errors: string[];
}

export interface TickReport {
  ranAt: string;
  clients: ClientTickResult[];
}

export async function runTick(options: TickOptions = {}): Promise<TickReport> {
  const logger = options.logger ?? consoleLogger;
  const clock = options.clock ?? systemClock;
  const env = options.env ?? process.env;
  const clients = options.clients ?? knownClients;
  const resolveIntegrations = options.resolveIntegrations ?? demoIntegrationsResolver;
  const storesFor = options.storesFor ?? ((id: string) => getInboundStores(id, env));

  const ranAt = clock.now();
  const results: ClientTickResult[] = [];

  // Imported lazily to avoid a cycle (runtime/run -> channels -> ... ) at module load.
  const { runClient } = await import("../runtime/run");

  for (const config of clients) {
    const integrations = resolveIntegrations(config.id);
    if (!integrations) {
      logger.warn("no integrations wired for client; skipping", { clientId: config.id });
      results.push(emptyResult(config.id, "no integrations wired"));
      continue;
    }

    const stores = storesFor(config.id);
    try {
      const result = await runClient(config, {
        integrations,
        idempotency: stores.idempotency,
        suppression: stores.suppression,
        conversations: stores.conversations,
        contactIndex: stores.contactIndex,
        clock,
        logger,
        env,
      });
      results.push({
        clientId: config.id,
        planned: result.plan.actions.length,
        sent: result.dispatch.sent,
        notified: result.dispatch.notified,
        drafted: result.dispatch.drafted,
        suppressed: result.dispatch.suppressed,
        failed: result.dispatch.failed,
        errors: [...result.plan.errors.map((e) => e.message), ...result.dispatch.errors],
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error("client run threw during tick", { clientId: config.id, error: message });
      results.push({ ...emptyResult(config.id), failed: 1, errors: [message] });
    }
  }

  logger.info("scheduler tick complete", {
    ranAt,
    clients: results.length,
    sent: results.reduce((n, r) => n + r.sent, 0),
    suppressed: results.reduce((n, r) => n + r.suppressed, 0),
  });
  return { ranAt, clients: results };
}

function emptyResult(clientId: string, skipped?: string): ClientTickResult {
  return { clientId, skipped, planned: 0, sent: 0, notified: 0, drafted: 0, suppressed: 0, failed: 0, errors: [] };
}
