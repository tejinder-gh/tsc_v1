/**
 * What: The conversation store - a short, per-contact message history plus the id of the
 *       automation that sent the most recent outbound message.
 * Why: Two jobs. (1) It gives the LLM interpreter the recent back-and-forth so it reads a reply in
 *       context ("yes" means different things after a reminder vs after a win-back). (2) It lets the
 *       handler attribute an inbound reply to the campaign it answers, so "not interested" stops the
 *       right automation.
 * How: A narrow interface with an in-memory implementation that keeps the last N entries per
 *       contact. Bounded so it never grows without limit; swap for a DB-backed store in production.
 * From Where: TheSkillCorner automation-engine - inbound/closed-loop layer, 2026-06.
 * When: 2026-06.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { ConversationEntry } from "./types";

export interface ConversationStore {
  append(contactId: string, entry: ConversationEntry): void;
  recent(contactId: string, limit?: number): ConversationEntry[];
  /** The automation id of the last outbound message to this contact, if any. */
  lastOutboundAutomationId(contactId: string): string | undefined;
}

export class MemoryConversationStore implements ConversationStore {
  protected byContact = new Map<string, ConversationEntry[]>();

  constructor(protected readonly maxPerContact = 20) {}

  append(contactId: string, entry: ConversationEntry): void {
    const list = this.byContact.get(contactId) ?? [];
    list.push(entry);
    // Keep only the most recent maxPerContact entries (immutable-friendly slice).
    this.byContact.set(contactId, list.slice(-this.maxPerContact));
    this.persist();
  }

  recent(contactId: string, limit = 10): ConversationEntry[] {
    const list = this.byContact.get(contactId) ?? [];
    return list.slice(-limit);
  }

  lastOutboundAutomationId(contactId: string): string | undefined {
    const list = this.byContact.get(contactId) ?? [];
    for (let i = list.length - 1; i >= 0; i -= 1) {
      if (list[i].direction === "out" && list[i].automationId) return list[i].automationId;
    }
    return undefined;
  }

  /** No-op in memory; the file subclass overrides this. */
  protected persist(): void {}
}

/** Durable conversation history backed by a JSON file (one map of contactId -> entries). */
export class FileConversationStore extends MemoryConversationStore {
  constructor(
    private readonly path: string,
    maxPerContact = 20,
  ) {
    super(maxPerContact);
    if (existsSync(path)) {
      try {
        const raw = JSON.parse(readFileSync(path, "utf8")) as Record<string, ConversationEntry[]>;
        this.byContact = new Map(Object.entries(raw));
      } catch {
        this.byContact = new Map();
      }
    }
  }

  protected persist(): void {
    mkdirSync(dirname(this.path), { recursive: true });
    writeFileSync(this.path, JSON.stringify(Object.fromEntries(this.byContact), null, 2));
  }
}
