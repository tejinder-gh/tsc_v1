import { describe, expect, it } from "vitest";
import { MemoryIdempotencyStore } from "../core/idempotency";
import { type Enrollment, planSequence, type SequenceStep } from "../core/sequence";
import type { Contact } from "../core/types";

const identity = { clientId: "c1", automationId: "a1", recipeId: "r1" };

const contact: Contact = {
  id: "k1",
  name: "Amara Okafor",
  phone: "+14165550110",
  email: "amara@example.com",
  consent: { sms: true, email: true },
};

const steps: readonly SequenceStep[] = [
  {
    id: "24h",
    offset: { hours: -24 },
    channel: "sms",
    template: { body: "Tomorrow, {{firstName}}" },
  },
  { id: "2h", offset: { hours: -2 }, channel: "sms", template: { body: "Soon, {{firstName}}" } },
];

function enrollAt(anchorOffsetH: number, startedOffsetH = -100): Enrollment {
  const now = Date.parse("2026-06-15T12:00:00.000Z");
  return {
    contact,
    anchorAt: new Date(now + anchorOffsetH * 3_600_000).toISOString(),
    startedAt: new Date(now + startedOffsetH * 3_600_000).toISOString(),
    variables: { firstName: "Amara" },
  };
}

const NOW = "2026-06-15T12:00:00.000Z";

describe("planSequence", () => {
  it("fires only the steps that are due (within grace)", () => {
    // Appointment in +2h: the -2h step is due now; the -24h step fired 22h ago, beyond a 3h grace.
    const result = planSequence({
      identity,
      steps,
      enrollment: enrollAt(2),
      now: NOW,
      idempotency: new MemoryIdempotencyStore(),
      graceWindow: { hours: 3 },
    });
    const ids = result.actions.map((a) => a.meta.tags?.step);
    expect(ids).toEqual(["2h"]);
  });

  it("does not re-send a step already in the idempotency store", () => {
    const store = new MemoryIdempotencyStore();
    const enrollment = enrollAt(2);
    const grace = { hours: 3 };
    const first = planSequence({
      identity,
      steps,
      enrollment,
      now: NOW,
      idempotency: store,
      graceWindow: grace,
    });
    expect(first.actions).toHaveLength(1);
    // Simulate dispatch marking the key.
    store.markSent(first.actions[0].meta.idempotencyKey);
    const second = planSequence({
      identity,
      steps,
      enrollment,
      now: NOW,
      idempotency: store,
      graceWindow: grace,
    });
    expect(second.actions).toHaveLength(0);
  });

  it("skips steps whose time predates the enrollment (no back-blasting)", () => {
    // Enroll just now for an appointment 1h out: the -24h step's time is long past enrollment.
    const result = planSequence({
      identity,
      steps,
      enrollment: enrollAt(1, 0),
      now: NOW,
      idempotency: new MemoryIdempotencyStore(),
    });
    expect(result.actions).toHaveLength(0);
    expect(result.skipped.some((s) => s.stepId === "24h")).toBe(true);
  });

  it("skips steps past the grace window", () => {
    // Appointment was 100h ago; the -2h step fired 98h ago, far beyond a 3h grace.
    const result = planSequence({
      identity,
      steps,
      enrollment: enrollAt(-100, -200),
      now: NOW,
      idempotency: new MemoryIdempotencyStore(),
      graceWindow: { hours: 3 },
    });
    expect(result.actions).toHaveLength(0);
    expect(result.skipped.length).toBeGreaterThan(0);
  });

  it("halts the whole sequence when stopReason is set", () => {
    const result = planSequence({
      identity,
      steps,
      enrollment: { ...enrollAt(2), stopReason: "cancelled" },
      now: NOW,
      idempotency: new MemoryIdempotencyStore(),
    });
    expect(result.actions).toHaveLength(0);
    expect(result.skipped.every((s) => s.reason === "cancelled")).toBe(true);
  });

  it("skips a step when the contact has no consent on the chosen channel", () => {
    const noSms: Contact = { ...contact, consent: { sms: false, email: true } };
    const result = planSequence({
      identity,
      steps,
      enrollment: { ...enrollAt(2), contact: noSms },
      now: NOW,
      idempotency: new MemoryIdempotencyStore(),
    });
    expect(result.actions).toHaveLength(0);
    expect(result.skipped[0]?.reason).toContain("consent");
  });
});
