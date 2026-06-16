/**
 * What: The sequence (ladder) engine - the single piece of logic that powers every timed,
 *       multi-touch automation: appointment reminders, no-show rebooking, invoice dunning,
 *       win-back, contract chasing, lead nurture. Built once, configured per client.
 * Why: These products look different in the brochure but are mechanically identical: enroll a
 *       contact at an anchor time, then send templated touches at fixed offsets until a stop
 *       condition fires. Encoding that once is the literal "use code once, use for many" payoff.
 * How: planSequence is a pure function of (steps, enrollment, now, idempotency). For each step it
 *       checks: not already sent, the step's fire time has arrived, the step wasn't already past
 *       when we enrolled (no back-blasting late enrollees), and within an optional grace window.
 *       It renders the template, resolves a consented channel, and emits a SendAction. It never
 *       sends - it decides. The runtime dispatches and marks idempotency only after a real send.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import { addDuration, type Duration, diffMillis, label } from "./duration";
import { buildKey, type IdempotencyStore } from "./idempotency";
import { pickChannel, undeliverableReason } from "./messaging";
import { render, type TemplateVars } from "./template";
import type { Action, Channel, Contact, IsoTimestamp } from "./types";

/** One touch in a ladder. Pure data so it can live in a client config file. */
export interface SequenceStep {
  /** Stable id, unique within the sequence; part of the idempotency key. Never reuse. */
  id: string;
  /** Offset from the anchor. Negative = before (e.g. {hours:-24}); positive = after. */
  offset: Duration;
  channel: Channel | "auto";
  template: { subject?: string; body: string };
  tags?: Record<string, string | number>;
}

/** A contact's enrollment into a sequence. */
export interface Enrollment {
  contact: Contact;
  /** The t0 the offsets are measured from (appointment time, invoice due date, last visit...). */
  anchorAt: IsoTimestamp;
  /** When this contact entered the sequence. Steps already past at this instant are skipped. */
  startedAt: IsoTimestamp;
  variables: TemplateVars;
  /** When set, the sequence is halted for this contact (paid, cancelled, replied, booked...). */
  stopReason?: string;
}

/** Identity used to build idempotency keys and action provenance. */
export interface SequenceIdentity {
  clientId: string;
  automationId: string;
  recipeId: string;
}

export interface PlanSequenceParams {
  identity: SequenceIdentity;
  steps: readonly SequenceStep[];
  enrollment: Enrollment;
  now: IsoTimestamp;
  idempotency: IdempotencyStore;
  /**
   * How late a step may fire and still be useful. A "2 hours before" reminder is worthless once
   * the appointment has passed. Default 24h. Set per recipe.
   */
  graceWindow?: Duration;
}

export interface SkippedStep {
  stepId: string;
  reason: string;
}

export interface PlanSequenceResult {
  actions: Action[];
  skipped: SkippedStep[];
}

const DEFAULT_GRACE: Duration = { hours: 24 };

/**
 * Decide which sequence steps are due for one enrollment right now. Pure; no I/O, no sending.
 */
export function planSequence(params: PlanSequenceParams): PlanSequenceResult {
  const { identity, steps, enrollment, now, idempotency } = params;
  const grace = params.graceWindow ?? DEFAULT_GRACE;
  const actions: Action[] = [];
  const skipped: SkippedStep[] = [];

  const stopReason = enrollment.stopReason;
  if (stopReason) {
    return { actions, skipped: steps.map((s) => ({ stepId: s.id, reason: stopReason })) };
  }

  for (const step of steps) {
    const fireAt = addDuration(enrollment.anchorAt, step.offset);
    const key = buildKey(
      identity.clientId,
      identity.automationId,
      enrollment.contact.id,
      step.id,
      enrollment.anchorAt,
    );

    if (idempotency.has(key)) continue; // already sent on a previous run

    // Don't fire steps whose scheduled time predates this contact's enrollment (no back-blast).
    if (diffMillis(enrollment.startedAt, fireAt) < 0) {
      skipped.push({ stepId: step.id, reason: "step time predates enrollment" });
      continue;
    }
    // Not due yet.
    if (diffMillis(now, fireAt) > 0) continue;
    // Due, but too stale to be worth sending.
    if (diffMillis(fireAt, now) > Math.abs(durationMs(grace))) {
      skipped.push({ stepId: step.id, reason: `past grace window (${label(grace)})` });
      continue;
    }

    const deliverable = pickChannel(enrollment.contact, step.channel);
    if (!deliverable) {
      skipped.push({
        stepId: step.id,
        reason: undeliverableReason(enrollment.contact, step.channel),
      });
      continue;
    }

    actions.push(renderSendAction({ identity, step, deliverable, enrollment, key }));
  }

  return { actions, skipped };
}

function renderSendAction(args: {
  identity: SequenceIdentity;
  step: SequenceStep;
  deliverable: { channel: Channel; to: string };
  enrollment: Enrollment;
  key: string;
}): Action {
  const { identity, step, deliverable, enrollment, key } = args;
  const body = render(step.template.body, enrollment.variables);
  const subject =
    step.template.subject !== undefined
      ? render(step.template.subject, enrollment.variables)
      : undefined;

  return {
    kind: "send",
    message: {
      channel: deliverable.channel,
      to: deliverable.to,
      subject: deliverable.channel === "email" ? subject : undefined,
      body,
    },
    meta: {
      clientId: identity.clientId,
      automationId: identity.automationId,
      recipeId: identity.recipeId,
      contactId: enrollment.contact.id,
      idempotencyKey: key,
      tags: { step: step.id, offset: label(step.offset), ...step.tags },
    },
  };
}

function durationMs(d: Duration): number {
  return (d.minutes ?? 0) * 60_000 + (d.hours ?? 0) * 3_600_000 + (d.days ?? 0) * 86_400_000;
}
