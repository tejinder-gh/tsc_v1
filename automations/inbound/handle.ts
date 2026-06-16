/**
 * What: ingestInbound - the inbound pipeline. It dedupes the delivery, resolves the contact,
 *       interprets the message, applies the resulting effects to the shared stores, and returns the
 *       outbound actions (replies + human handoffs) for the runtime to dispatch.
 * Why: This is where the loop closes. A customer's reply changes system state - opt-out, stop a
 *       campaign, confirm - that the outbound engine then honours on its next run. It is the inbound
 *       mirror of core/engine.ts: decide effects and actions; let the runtime do the I/O.
 * How: Idempotent on the provider message id (re-delivered webhooks are no-ops). Effects are
 *       derived from the interpreted intent and applied to the suppression + conversation stores;
 *       replies are built as transactional sends (solicited, so they bypass quiet-hours and
 *       suppression at dispatch); low-confidence or unanswerable messages become human handoffs.
 * From Where: TheSkillCorner automation-engine - inbound/closed-loop layer, 2026-06.
 * When: 2026-06.
 */

import type { BusinessProfile } from "../core/config";
import { buildKey, type IdempotencyStore } from "../core/idempotency";
import type { Logger } from "../core/logger";
import { render } from "../core/template";
import type { Action, Channel, NotifyAction, SendAction } from "../core/types";
import type { ConversationStore } from "./conversation";
import type { SuppressionStore } from "./suppression";
import type { InboundEffect, InboundMessage, Interpretation, Interpreter } from "./types";

/** Operator-overridable reply copy; every value supports {{firstName}}/{{business}} templating. */
export interface ReplyTexts {
  optOut: string;
  optIn: string;
  confirm: string;
  notInterested: string;
  reschedule: string;
}

const DEFAULT_REPLIES: ReplyTexts = {
  optOut:
    "You're unsubscribed from {{business}} and won't get more texts. Reply START to opt back in.",
  optIn: "You're re-subscribed to {{business}} - welcome back!",
  confirm: "Thanks - you're confirmed. See you soon! - {{business}}",
  notInterested: "No problem, we won't reach out about this again. Thanks! - {{business}}",
  reschedule: "Happy to help you find a new time: {{bookingLink}}",
};

export interface IngestDeps {
  clientId: string;
  business: BusinessProfile;
  interpreter: Interpreter;
  suppression: SuppressionStore;
  conversations: ConversationStore;
  idempotency: IdempotencyStore;
  notify: Record<string, { email?: string; sms?: string }>;
  /** Resolve a sender address to a known contact id (e.g. via the CRM). */
  resolveContact?: (channel: Channel, address: string) => string | undefined;
  /** Notify destination (name in `notify`) for handoffs/reschedules. */
  handoffTo?: string;
  replies?: Partial<ReplyTexts>;
  logger: Logger;
}

export interface IngestResult {
  message: InboundMessage;
  contactId: string;
  interpretation: Interpretation;
  effects: InboundEffect[];
  actions: Action[];
  /** True when this delivery was already processed (a duplicate webhook). */
  deduped: boolean;
}

export async function ingestInbound(
  message: InboundMessage,
  deps: IngestDeps,
): Promise<IngestResult> {
  const contactId = resolveContactId(message, deps);
  const inboundKey = buildKey("inbound", deps.clientId, message.id);

  if (deps.idempotency.has(inboundKey)) {
    return {
      message,
      contactId,
      interpretation: dedupRead(),
      effects: [],
      actions: [],
      deduped: true,
    };
  }

  deps.conversations.append(contactId, {
    direction: "in",
    channel: message.channel,
    body: message.body,
    at: message.receivedAt,
  });

  const interpretation = await deps.interpreter.interpret(message, {
    businessName: deps.business.name,
    brandVoice: deps.business.brandVoice,
    history: deps.conversations.recent(contactId),
    lastOutboundAutomationId: deps.conversations.lastOutboundAutomationId(contactId),
  });

  const { effects, actions } = applyIntent(message, contactId, interpretation, deps);

  deps.idempotency.markSent(inboundKey);
  deps.logger.info("inbound processed", {
    clientId: deps.clientId,
    contact: contactId,
    intent: interpretation.intent,
    confidence: interpretation.confidence,
    source: interpretation.source,
    actions: actions.length,
  });

  return { message, contactId, interpretation, effects, actions, deduped: false };
}

function applyIntent(
  message: InboundMessage,
  contactId: string,
  interpretation: Interpretation,
  deps: IngestDeps,
): { effects: InboundEffect[]; actions: Action[] } {
  const texts = { ...DEFAULT_REPLIES, ...deps.replies };
  const vars = { business: deps.business.name, bookingLink: deps.business.bookingLink ?? "" };
  const effects: InboundEffect[] = [];
  const actions: Action[] = [];

  const reply = (body: string) => {
    const action = transactionalReply(message, contactId, deps.clientId, render(body, vars));
    effects.push({ kind: "reply", message: action.message });
    actions.push(action);
  };
  const handoff = (summary: string) => {
    const action = handoffNotify(message, contactId, deps, summary);
    if (action) {
      effects.push({ kind: "handoff", to: action.to, summary });
      actions.push(action);
    }
  };

  switch (interpretation.intent) {
    case "opt_out":
      deps.suppression.optOut(contactId, message.channel);
      effects.push({ kind: "opt_out", channel: message.channel });
      reply(texts.optOut);
      break;
    case "opt_in":
      deps.suppression.optIn(contactId, message.channel);
      effects.push({ kind: "opt_in", channel: message.channel });
      reply(texts.optIn);
      break;
    case "confirm":
      deps.suppression.confirm(contactId);
      effects.push({ kind: "confirm" });
      reply(texts.confirm);
      break;
    case "not_interested": {
      const automationId = deps.conversations.lastOutboundAutomationId(contactId);
      if (automationId) {
        deps.suppression.stopAutomation(contactId, automationId);
        effects.push({ kind: "stop_automation", automationId });
      }
      reply(texts.notInterested);
      break;
    }
    case "reschedule":
      if (deps.business.bookingLink) reply(texts.reschedule);
      else handoff(`Reschedule request from ${message.from}: "${message.body}"`);
      break;
    case "question":
      if (interpretation.suggestedReply && interpretation.confidence >= 0.6) {
        reply(interpretation.suggestedReply);
      } else {
        handoff(`Question needs a human from ${message.from}: "${message.body}"`);
      }
      break;
    case "handoff":
      handoff(`Needs attention from ${message.from}: "${message.body}"`);
      break;
    case "positive":
      // A friendly "thanks!" needs no action.
      break;
    default:
      handoff(`Unclassified reply from ${message.from}: "${message.body}"`);
  }

  return { effects, actions };
}

function resolveContactId(message: InboundMessage, deps: IngestDeps): string {
  return message.contactId ?? deps.resolveContact?.(message.channel, message.from) ?? message.from;
}

function transactionalReply(
  message: InboundMessage,
  contactId: string,
  clientId: string,
  body: string,
): SendAction {
  return {
    kind: "send",
    message: { channel: message.channel, to: message.from, body },
    meta: {
      clientId,
      automationId: "inbound",
      recipeId: "inbound-handler",
      contactId,
      idempotencyKey: buildKey("inbound-reply", clientId, message.id),
      // Solicited reply: bypasses quiet-hours and suppression at dispatch.
      tags: { transactional: 1 },
    },
  };
}

function handoffNotify(
  message: InboundMessage,
  contactId: string,
  deps: IngestDeps,
  summary: string,
): NotifyAction | null {
  if (!deps.handoffTo || !deps.notify[deps.handoffTo]) {
    deps.logger.warn("no handoff destination configured for inbound", { clientId: deps.clientId });
    return null;
  }
  return {
    kind: "notify",
    to: deps.handoffTo,
    summary,
    meta: {
      clientId: deps.clientId,
      automationId: "inbound",
      recipeId: "inbound-handler",
      contactId,
      idempotencyKey: buildKey("inbound-notify", deps.clientId, message.id),
    },
  };
}

function dedupRead(): Interpretation {
  return { intent: "unknown", confidence: 0, source: "rules" };
}
