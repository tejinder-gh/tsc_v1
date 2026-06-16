/**
 * What: The dispatcher - executes the Actions the engine planned, then records idempotency so the
 *       next scheduled run never repeats them. The one place sends actually happen.
 * Why: Separating "decide" (engine) from "do" (dispatch) is what makes the system safe and
 *       testable: dry-runs use the same plan, and idempotency is marked only after a real delivery
 *       succeeds - so a crash mid-batch resumes cleanly instead of double-texting customers.
 * How: Walks actions by kind. Sends respect quiet hours (deferred, not marked, retried next run).
 *       Notifies resolve an internal destination and bypass quiet hours (staff alerts). Drafts go
 *       to a sink for human approval. Every successful action is marked in the idempotency store.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import type { SenderMap } from "../channels";
import type { Clock } from "../core/clock";
import type { ClientConfig } from "../core/config";
import type { IdempotencyStore } from "../core/idempotency";
import type { Logger } from "../core/logger";
import type { Action, DraftAction, NotifyAction, OutboundMessage, SendAction } from "../core/types";
import type { ContactIndex } from "../inbound/contact-index";
import type { ConversationStore } from "../inbound/conversation";
import type { SuppressionStore } from "../inbound/suppression";
import { isQuietHours } from "./quiet-hours";

export type DraftSink = (draft: DraftAction) => void;

export interface DispatchDeps {
  config: ClientConfig;
  senders: SenderMap;
  idempotency: IdempotencyStore;
  clock: Clock;
  logger: Logger;
  draftSink?: DraftSink;
  /** When present, no message goes to an opted-out contact or a stopped automation (the closed loop). */
  suppression?: SuppressionStore;
  /** When present, every successful outbound is logged so inbound replies can be attributed. */
  conversations?: ConversationStore;
  /** When present, learns address->contactId on each send so inbound can resolve the sender. */
  contactIndex?: ContactIndex;
}

export interface DispatchReport {
  sent: number;
  failed: number;
  deferred: number;
  drafted: number;
  notified: number;
  /** Sends withheld because the contact opted out or stopped the automation. */
  suppressed: number;
  errors: string[];
}

const EMPTY_REPORT = (): DispatchReport => ({
  sent: 0,
  failed: 0,
  deferred: 0,
  drafted: 0,
  notified: 0,
  suppressed: 0,
  errors: [],
});

export async function dispatch(
  actions: readonly Action[],
  deps: DispatchDeps,
): Promise<DispatchReport> {
  const report = EMPTY_REPORT();
  for (const action of actions) {
    if (action.kind === "send") await dispatchSend(action, deps, report);
    else if (action.kind === "notify") await dispatchNotify(action, deps, report);
    else dispatchDraft(action, deps, report);
  }
  return report;
}

async function dispatchSend(
  action: SendAction,
  deps: DispatchDeps,
  report: DispatchReport,
): Promise<void> {
  // Solicited replies (inbound confirmations, opt-out acks) bypass quiet hours and suppression.
  const transactional = action.meta.tags?.transactional === 1;
  const { channel, to } = action.message;
  const { contactId, automationId } = action.meta;

  if (!transactional && deps.suppression) {
    if (deps.suppression.isOptedOut(contactId, channel)) {
      report.suppressed += 1;
      deps.logger.debug("send suppressed: contact opted out", { contact: contactId, channel });
      return;
    }
    if (deps.suppression.isStopped(contactId, automationId)) {
      report.suppressed += 1;
      deps.logger.debug("send suppressed: automation stopped for contact", {
        contact: contactId,
        automation: automationId,
      });
      return;
    }
  }

  const quiet = deps.config.channels.quietHours;
  if (
    !transactional &&
    quiet &&
    isQuietHours(deps.clock.now(), deps.config.business.timezone, quiet)
  ) {
    report.deferred += 1;
    deps.logger.debug("send deferred for quiet hours", { to });
    return;
  }

  const sender = deps.senders[channel];
  if (!sender) {
    report.failed += 1;
    const msg = `No ${channel} sender configured for client ${deps.config.id}`;
    report.errors.push(msg);
    deps.logger.error(msg, { automation: automationId });
    return;
  }

  const result = await sender.send(action.message);
  if (result.ok) {
    deps.idempotency.markSent(action.meta.idempotencyKey);
    deps.conversations?.append(contactId, {
      direction: "out",
      channel,
      body: action.message.body,
      at: deps.clock.now(),
      automationId,
    });
    // Learn the address->contact pairing so a future inbound reply resolves to this contact.
    if (!transactional) deps.contactIndex?.link(to, contactId);
    report.sent += 1;
  } else {
    report.failed += 1;
    report.errors.push(result.error ?? "unknown send error");
    deps.logger.error("send failed", { to, error: result.error });
  }
}

async function dispatchNotify(
  action: NotifyAction,
  deps: DispatchDeps,
  report: DispatchReport,
): Promise<void> {
  const destination = deps.config.notify[action.to];
  if (!destination) {
    report.failed += 1;
    report.errors.push(`Notify destination "${action.to}" is not defined in client config`);
    return;
  }

  const message = notifyMessage(destination, action, deps);
  if (!message) {
    report.failed += 1;
    report.errors.push(`Notify destination "${action.to}" has no usable sms/email address`);
    return;
  }

  const sender = deps.senders[message.channel];
  if (!sender) {
    report.failed += 1;
    report.errors.push(`No ${message.channel} sender for notify to "${action.to}"`);
    return;
  }

  const result = await sender.send(message);
  if (result.ok) {
    deps.idempotency.markSent(action.meta.idempotencyKey);
    report.notified += 1;
  } else {
    report.failed += 1;
    report.errors.push(result.error ?? "notify send failed");
  }
}

function notifyMessage(
  destination: { email?: string; sms?: string },
  action: NotifyAction,
  deps: DispatchDeps,
): OutboundMessage | null {
  if (destination.sms && deps.senders.sms) {
    return { channel: "sms", to: destination.sms, body: action.summary };
  }
  if (destination.email && deps.senders.email) {
    return {
      channel: "email",
      to: destination.email,
      subject: `[${deps.config.business.name}] ${action.summary.slice(0, 60)}`,
      body: action.summary,
    };
  }
  return null;
}

function dispatchDraft(action: DraftAction, deps: DispatchDeps, report: DispatchReport): void {
  const sink =
    deps.draftSink ??
    ((d: DraftAction) =>
      deps.logger.info("[draft for approval]", {
        purpose: d.purpose,
        contact: d.meta.contactId,
        body: d.content.body,
      }));
  sink(action);
  deps.idempotency.markSent(action.meta.idempotencyKey);
  report.drafted += 1;
}
