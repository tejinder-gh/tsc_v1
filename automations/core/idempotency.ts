/**
 * What: The idempotency store - a record of which actions have already been dispatched, so a
 *       reminder ladder running every 15 minutes never texts the same person the same step twice.
 * Why: Automations are designed to be re-run on a schedule (cron). Re-running must be safe.
 *       Without a "have I already sent this?" check, every cron tick would re-send. This is the
 *       single most important safety property of the whole system for real customers.
 * How: A small interface (has/markSent) plus two implementations: an in-memory Set for tests
 *       and a JSON-file store for single-box production. Keys are deterministic strings built by
 *       recipes (see buildKey). Swap in Redis/Postgres later without touching any recipe.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06; replace FileIdempotencyStore with a shared DB when running multi-instance.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export interface IdempotencyStore {
  has(key: string): boolean;
  markSent(key: string): void;
}

/** Build a stable idempotency key from its parts. Order matters; keep it consistent. */
export function buildKey(...parts: Array<string | number>): string {
  return parts.map((p) => String(p)).join(":");
}

/** In-memory store. Use for dry-runs and tests; state is lost on exit. */
export class MemoryIdempotencyStore implements IdempotencyStore {
  private readonly seen = new Set<string>();

  constructor(seed: Iterable<string> = []) {
    for (const key of seed) this.seen.add(key);
  }

  has(key: string): boolean {
    return this.seen.has(key);
  }

  markSent(key: string): void {
    this.seen.add(key);
  }

  /** Snapshot of all keys; useful for assertions and persistence. */
  keys(): string[] {
    return [...this.seen];
  }
}

/** Durable store backed by a JSON file. Reads once on construction, writes on every mark. */
export class FileIdempotencyStore implements IdempotencyStore {
  private readonly seen: Set<string>;

  constructor(private readonly path: string) {
    this.seen = new Set(existsSync(path) ? safeRead(path) : []);
  }

  has(key: string): boolean {
    return this.seen.has(key);
  }

  markSent(key: string): void {
    if (this.seen.has(key)) return;
    this.seen.add(key);
    mkdirSync(dirname(this.path), { recursive: true });
    writeFileSync(this.path, JSON.stringify([...this.seen], null, 2));
  }
}

function safeRead(path: string): string[] {
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8"));
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    // A corrupt store must not crash a production run; start empty and overwrite on next mark.
    return [];
  }
}
