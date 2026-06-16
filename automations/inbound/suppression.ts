/**
 * What: The suppression store - the shared state that closes the loop. Inbound writes to it
 *       (opt-outs, per-automation stops, confirmations); outbound reads it at dispatch to decide
 *       whether a message may go out.
 * Why: This is the single source of truth that makes "reply STOP and we stop" actually true. It is
 *       the most compliance-critical store in the system: a missed opt-out is a legal problem, so
 *       the read happens at the one chokepoint every message passes through (dispatch).
 * How: A narrow interface with in-memory and JSON-file implementations. Opt-outs are per channel
 *       (a customer can keep email but drop SMS). Stops are per (contact, automation) so "stop
 *       chasing me" halts one campaign without unsubscribing the person entirely.
 * From Where: TheSkillCorner automation-engine - inbound/closed-loop layer, 2026-06.
 * When: 2026-06; back with Redis/Postgres when running multi-instance.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { Channel } from "../core/types";

export interface SuppressionStore {
  /** Stop all messages to this contact on a channel (or every channel when omitted). */
  optOut(contactId: string, channel?: Channel): void;
  /** Re-enable messaging (START / resubscribe). */
  optIn(contactId: string, channel?: Channel): void;
  isOptedOut(contactId: string, channel: Channel): boolean;
  /** Halt one automation for one contact without unsubscribing them globally. */
  stopAutomation(contactId: string, automationId: string): void;
  isStopped(contactId: string, automationId: string): boolean;
  /** Record an appointment confirmation (informational; reporting + future stop logic). */
  confirm(contactId: string): void;
  isConfirmed(contactId: string): boolean;
}

interface SuppressionState {
  optOut: Record<string, { sms?: boolean; email?: boolean; all?: boolean }>;
  stopped: Record<string, string[]>; // contactId -> automationIds
  confirmed: string[];
}

const emptyState = (): SuppressionState => ({ optOut: {}, stopped: {}, confirmed: [] });

export class MemorySuppressionStore implements SuppressionStore {
  protected state: SuppressionState = emptyState();

  optOut(contactId: string, channel?: Channel): void {
    const entry = this.state.optOut[contactId] ?? {};
    if (channel) entry[channel] = true;
    else entry.all = true;
    this.state.optOut[contactId] = entry;
    this.persist();
  }

  optIn(contactId: string, channel?: Channel): void {
    const entry = this.state.optOut[contactId];
    if (!entry) return;
    if (channel) entry[channel] = false;
    else {
      entry.all = false;
      entry.sms = false;
      entry.email = false;
    }
    this.persist();
  }

  isOptedOut(contactId: string, channel: Channel): boolean {
    const entry = this.state.optOut[contactId];
    if (!entry) return false;
    return Boolean(entry.all || entry[channel]);
  }

  stopAutomation(contactId: string, automationId: string): void {
    const list = this.state.stopped[contactId] ?? [];
    if (!list.includes(automationId)) list.push(automationId);
    this.state.stopped[contactId] = list;
    this.persist();
  }

  isStopped(contactId: string, automationId: string): boolean {
    return this.state.stopped[contactId]?.includes(automationId) ?? false;
  }

  confirm(contactId: string): void {
    if (!this.state.confirmed.includes(contactId)) this.state.confirmed.push(contactId);
    this.persist();
  }

  isConfirmed(contactId: string): boolean {
    return this.state.confirmed.includes(contactId);
  }

  /** No-op in memory; the file subclass overrides this. */
  protected persist(): void {}
}

/** Durable suppression backed by a JSON file - the safe default for a single-box deployment. */
export class FileSuppressionStore extends MemorySuppressionStore {
  constructor(private readonly path: string) {
    super();
    if (existsSync(path)) {
      try {
        this.state = { ...emptyState(), ...JSON.parse(readFileSync(path, "utf8")) };
      } catch {
        this.state = emptyState();
      }
    }
  }

  protected persist(): void {
    mkdirSync(dirname(this.path), { recursive: true });
    writeFileSync(this.path, JSON.stringify(this.state, null, 2));
  }
}
