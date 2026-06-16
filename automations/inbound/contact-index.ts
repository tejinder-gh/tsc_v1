/**
 * What: The contact index - a learned map from a channel address (phone/email) back to the CRM
 *       contact id.
 * Why: This is the identity bridge that makes the closed loop work in production. Outbound actions
 *       carry a CRM contactId; an inbound reply only carries the sender's phone number. To suppress
 *       the *right* contact, the inbound side must turn that number back into the same id the
 *       outbound side used. The system already knows both at send time - so it records the pairing
 *       as it dispatches, and inbound reads it back. No extra CRM lookup required.
 * How: A narrow interface (link/lookup) with in-memory and JSON-file implementations. Dispatch
 *       calls link(message.to, contactId) on every successful send; the inbound route's
 *       resolveContact calls lookup(message.from).
 * From Where: TheSkillCorner automation-engine - inbound/closed-loop layer, 2026-06.
 * When: 2026-06; for multi-instance, back this with the same DB as suppression.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export interface ContactIndex {
  link(address: string, contactId: string): void;
  lookup(address: string): string | undefined;
}

export class MemoryContactIndex implements ContactIndex {
  protected map = new Map<string, string>();

  link(address: string, contactId: string): void {
    if (this.map.get(address) === contactId) return;
    this.map.set(address, contactId);
    this.persist();
  }

  lookup(address: string): string | undefined {
    return this.map.get(address);
  }

  protected persist(): void {}
}

export class FileContactIndex extends MemoryContactIndex {
  constructor(private readonly path: string) {
    super();
    if (existsSync(path)) {
      try {
        this.map = new Map(Object.entries(JSON.parse(readFileSync(path, "utf8"))));
      } catch {
        this.map = new Map();
      }
    }
  }

  protected persist(): void {
    mkdirSync(dirname(this.path), { recursive: true });
    writeFileSync(this.path, JSON.stringify(Object.fromEntries(this.map), null, 2));
  }
}
