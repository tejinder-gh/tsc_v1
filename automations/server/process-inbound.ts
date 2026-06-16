/**
 * What: processInbound - the framework-agnostic core the webhook route delegates to. Given a
 *       normalised InboundMessage and the client it belongs to, it interprets, applies effects,
 *       and dispatches the reply/handoff - then returns the result.
 * Why: Keeping this out of the Next.js route makes the whole pipeline unit-testable without an HTTP
 *       layer, and reusable from a queue worker or a CLI. The route becomes a thin Request->Response
 *       adapter around this.
 * How: Assembles the composite interpreter (rules + the configured ChatModel), wires the shared
 *       file-backed stores (so inbound and outbound see the same opt-outs and contact index), runs
 *       ingestInbound, then dispatch. Every dependency is overridable for tests/dev.
 * From Where: TheSkillCorner automation-engine - inbound/closed-loop layer, 2026-06.
 * When: 2026-06.
 */

import { buildSenders, type SenderMap } from "../channels";
import { type Clock, systemClock } from "../core/clock";
import type { ClientConfig } from "../core/config";
import { consoleLogger, type Logger } from "../core/logger";
import { type IngestResult, ingestInbound } from "../inbound/handle";
import { compositeInterpreter } from "../inbound/interpreter";
import { LlmInterpreter } from "../inbound/llm-interpreter";
import { type ChatModel, createChatModel } from "../inbound/models";
import { rulesInterpreter } from "../inbound/rules-interpreter";
import type { InboundMessage } from "../inbound/types";
import { type DispatchReport, dispatch } from "../runtime/dispatch";
import { defaultHandoffTo } from "./clients-registry";
import { getInboundStores, type InboundStores } from "./inbound-stores";

export interface ProcessInboundOptions {
  env?: Record<string, string | undefined>;
  logger?: Logger;
  /** Override the interpreter model (defaults to createChatModel from env: Claude / Ollama / ...). */
  model?: ChatModel;
  /** Override the shared stores (tests pass in-memory). */
  stores?: InboundStores;
  /** Override the channel senders (tests/dev pass dry-run). */
  senders?: SenderMap;
  clock?: Clock;
}

export interface ProcessInboundResult {
  ingest: IngestResult;
  dispatch: DispatchReport;
}

export async function processInbound(
  message: InboundMessage,
  config: ClientConfig,
  options: ProcessInboundOptions = {},
): Promise<ProcessInboundResult> {
  const env = options.env ?? process.env;
  const logger = options.logger ?? consoleLogger;
  const stores = options.stores ?? getInboundStores(config.id, env);
  const model = options.model ?? createChatModel({}, env);
  const interpreter = compositeInterpreter(rulesInterpreter, new LlmInterpreter({ model }), {
    logger,
  });

  const ingest = await ingestInbound(message, {
    clientId: config.id,
    business: config.business,
    interpreter,
    suppression: stores.suppression,
    conversations: stores.conversations,
    idempotency: stores.idempotency,
    notify: config.notify,
    resolveContact: (_channel, address) => stores.contactIndex.lookup(address),
    handoffTo: defaultHandoffTo(config),
    logger,
  });

  const senders = options.senders ?? buildSenders(config, logger, env);
  const report = await dispatch(ingest.actions, {
    config,
    senders,
    idempotency: stores.idempotency,
    clock: options.clock ?? systemClock,
    logger,
    suppression: stores.suppression,
    conversations: stores.conversations,
    contactIndex: stores.contactIndex,
  });

  return { ingest, dispatch: report };
}
