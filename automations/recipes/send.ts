/**
 * What: oneShotSend - render a single templated message into a SendAction for trigger-style
 *       recipes (instant lead replies, review requests) that aren't time-laddered.
 * Why: The sequence engine owns laddered sends; trigger recipes need the same render + consent +
 *       idempotency-key discipline for a single immediate touch. One helper keeps that consistent
 *       so no recipe hand-rolls channel selection or forgets a dedupe key.
 * How: Picks a consented channel, renders subject/body, and returns a SendAction with the caller's
 *       idempotency key. Returns an { undeliverable } marker (never throws) when no channel works,
 *       so the recipe can log and move on.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import { pickChannel, undeliverableReason } from "../core/messaging";
import { render, type TemplateVars } from "../core/template";
import type { Channel, Contact, SendAction } from "../core/types";

export interface OneShotSendInput {
  clientId: string;
  automationId: string;
  recipeId: string;
  contact: Contact;
  channel: Channel | "auto";
  subject?: string;
  body: string;
  variables: TemplateVars;
  /** Caller-built idempotency key; the recipe checks ctx.idempotency.has() before calling. */
  idempotencyKey: string;
  tags?: Record<string, string | number>;
}

export type OneShotResult = SendAction | { undeliverable: string };

export function oneShotSend(input: OneShotSendInput): OneShotResult {
  const deliverable = pickChannel(input.contact, input.channel);
  if (!deliverable) return { undeliverable: undeliverableReason(input.contact, input.channel) };

  return {
    kind: "send",
    message: {
      channel: deliverable.channel,
      to: deliverable.to,
      subject:
        deliverable.channel === "email" ? maybeRender(input.subject, input.variables) : undefined,
      body: render(input.body, input.variables),
    },
    meta: {
      clientId: input.clientId,
      automationId: input.automationId,
      recipeId: input.recipeId,
      contactId: input.contact.id,
      idempotencyKey: input.idempotencyKey,
      tags: input.tags,
    },
  };
}

function maybeRender(template: string | undefined, vars: TemplateVars): string | undefined {
  return template === undefined ? undefined : render(template, vars);
}
