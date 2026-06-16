/**
 * What: runClient - the top-level entry a scheduler calls once per client per tick. It plans every
 *       due action and dispatches it, returning a combined report.
 * Why: This is the seam between "the engine" and "the outside world" (cron, real integrations,
 *       real provider credentials). Everything below it is pure and testable; everything above is
 *       just scheduling. Sensible defaults make a live run a few lines; tests inject fakes.
 * How: Resolves the registry, senders (from config + env), idempotency, clock, and logger, then
 *       calls planClient followed by dispatch. Integrations are injected by the caller because they
 *       carry credentials and vary per client (Jane vs Fresha vs QuickBooks).
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import { buildSenders } from "../channels";
import { type Clock, systemClock } from "../core/clock";
import type { ClientConfig } from "../core/config";
import { type EngineResult, planClient } from "../core/engine";
import { FileIdempotencyStore, type IdempotencyStore } from "../core/idempotency";
import { consoleLogger, type Logger } from "../core/logger";
import type { RecipeRegistry } from "../core/registry";
import type { ContactIndex } from "../inbound/contact-index";
import type { ConversationStore } from "../inbound/conversation";
import type { SuppressionStore } from "../inbound/suppression";
import type { Integrations } from "../integrations/types";
import { createRegistry } from "../recipes";
import { type DispatchReport, type DraftSink, dispatch } from "./dispatch";

export interface RunOptions {
  integrations: Integrations;
  registry?: RecipeRegistry;
  idempotency?: IdempotencyStore;
  clock?: Clock;
  logger?: Logger;
  draftSink?: DraftSink;
  env?: NodeJS.ProcessEnv;
  /** Closes the loop: outbound respects opt-outs and per-automation stops written by inbound. */
  suppression?: SuppressionStore;
  /** Logs every successful outbound so inbound replies can be attributed to a campaign. */
  conversations?: ConversationStore;
  /** Learns address->contactId on each send so inbound replies resolve to the right contact. */
  contactIndex?: ContactIndex;
}

export interface RunResult {
  plan: EngineResult;
  dispatch: DispatchReport;
}

export async function runClient(config: ClientConfig, options: RunOptions): Promise<RunResult> {
  const logger = options.logger ?? consoleLogger;
  const clock = options.clock ?? systemClock;
  const registry = options.registry ?? createRegistry();
  const idempotency =
    options.idempotency ?? new FileIdempotencyStore(`.automations/idempotency/${config.id}.json`);
  const senders = buildSenders(config, logger, options.env);

  const plan = await planClient(config, {
    registry,
    integrations: options.integrations,
    idempotency,
    clock,
    logger,
  });

  const report = await dispatch(plan.actions, {
    config,
    senders,
    idempotency,
    clock,
    logger,
    draftSink: options.draftSink,
    suppression: options.suppression,
    conversations: options.conversations,
    contactIndex: options.contactIndex,
  });

  logger.info("client run complete", {
    clientId: config.id,
    planned: plan.actions.length,
    sent: report.sent,
    notified: report.notified,
    drafted: report.drafted,
    deferred: report.deferred,
    suppressed: report.suppressed,
    failed: report.failed,
    planErrors: plan.errors.length,
  });

  return { plan, dispatch: report };
}
