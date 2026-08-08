/**
 * What: The draft store - persists AI-drafted messages that require human approval before sending.
 * Why: Some actions (like replying to reviews or sending newsletters) are too sensitive for full
 *       automation. The engine drafts them, but the runtime queues them here for an operator to
 *       review, edit, and approve in a UI.
 * How: A simple interface with an in-memory implementation for tests/demo and a JSON-file backed
 *       store for single-box production. Keys are based on the action's idempotencyKey.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { DraftAction } from "./types";

export interface DraftStore {
  getPending(): DraftAction[];
  save(draft: DraftAction): void;
  remove(idempotencyKey: string): void;
}

/** In-memory store. Use for dry-runs and tests; state is lost on exit. */
export class MemoryDraftStore implements DraftStore {
  private drafts: DraftAction[] = [];

  getPending(): DraftAction[] {
    return [...this.drafts];
  }

  save(draft: DraftAction): void {
    if (!this.drafts.some((d) => d.meta.idempotencyKey === draft.meta.idempotencyKey)) {
      this.drafts.push(draft);
    }
  }

  remove(idempotencyKey: string): void {
    this.drafts = this.drafts.filter((d) => d.meta.idempotencyKey !== idempotencyKey);
  }
}

/** Durable store backed by a JSON file. */
export class FileDraftStore implements DraftStore {
  private drafts: DraftAction[];

  constructor(private readonly path: string) {
    this.drafts = existsSync(path) ? safeRead(path) : [];
  }

  getPending(): DraftAction[] {
    return [...this.drafts];
  }

  save(draft: DraftAction): void {
    if (this.drafts.some((d) => d.meta.idempotencyKey === draft.meta.idempotencyKey)) return;
    this.drafts.push(draft);
    this.flush();
  }

  remove(idempotencyKey: string): void {
    const initialLen = this.drafts.length;
    this.drafts = this.drafts.filter((d) => d.meta.idempotencyKey !== idempotencyKey);
    if (this.drafts.length !== initialLen) {
      this.flush();
    }
  }

  private flush(): void {
    mkdirSync(dirname(this.path), { recursive: true });
    writeFileSync(this.path, JSON.stringify(this.drafts, null, 2));
  }
}

function safeRead(path: string): DraftAction[] {
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Return empty on corrupt read
    return [];
  }
}
