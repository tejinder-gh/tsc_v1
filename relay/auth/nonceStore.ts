/**
 * What: Distributed atomic nonce deduplication for the SMS Relay subsystem.
 * Why: Enforces P0 replay protection across serverless/multi-instance deployments
 *      by atomically recording and rejecting duplicate (relayId, deviceId, nonce)
 *      combinations within the timestamp freshness window (300-360 seconds).
 * How: Preferred semantics:
 *      Key: relay:nonce:<relayId>:<deviceId>:<nonce>
 *      Authoritative atomic check-and-set in Postgres with in-memory process optimization.
 *      Never stores SMS contents, OTP codes, or sender details.
 */

import { dbQuery } from "@/lib/second-brain/db/client";
import { AuthenticationError } from "../errors/RelayError";

export interface NonceDeduplicator {
  /**
   * Attempts to atomically claim a nonce key with a given TTL.
   * Returns true if successfully claimed (first time seen),
   * false if already seen and still active within TTL.
   * Throws if backend datastore fails.
   */
  claimNonce(key: string, ttlSeconds: number): Promise<boolean>;
}

export function buildRelayNonceKey(relayId: string, deviceId: string, nonce: string): string {
  return `relay:nonce:${relayId}:${deviceId}:${nonce}`;
}

/**
 * Process-local in-memory deduplicator used as L1 fast-path cache and for standalone testing/dev.
 */
export class InMemoryNonceDeduplicator implements NonceDeduplicator {
  private cache = new Map<string, number>();

  async claimNonce(key: string, ttlSeconds: number): Promise<boolean> {
    const now = Date.now();
    const expiresAt = this.cache.get(key);

    if (expiresAt !== undefined && expiresAt > now) {
      return false; // Active duplicate within TTL
    }

    this.cache.set(key, now + ttlSeconds * 1000);

    // Housekeeping: purge expired entries if cache grows
    if (this.cache.size > 5000) {
      for (const [k, exp] of this.cache.entries()) {
        if (exp <= now) this.cache.delete(k);
      }
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Authoritative distributed atomic deduplicator backed by PostgreSQL.
 * Executes atomic INSERT ON CONFLICT DO UPDATE conditional on expiration.
 */
export class PostgresNonceDeduplicator implements NonceDeduplicator {
  private localL1 = new InMemoryNonceDeduplicator();
  private tableEnsured = false;
  private lastCleanup = 0;

  constructor(private readonly queryFn = dbQuery) {}

  private async ensureTable(): Promise<void> {
    if (this.tableEnsured) return;
    try {
      await this.queryFn(`
        CREATE TABLE IF NOT EXISTS public.relay_nonces (
          nonce_key VARCHAR(255) PRIMARY KEY,
          expires_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `);
      this.tableEnsured = true;
    } catch {
      // Table already exists or schema managed by migrations
    }
  }

  private async opportunisticCleanup(): Promise<void> {
    const now = Date.now();
    if (now - this.lastCleanup < 60_000) return;
    this.lastCleanup = now;

    try {
      await this.queryFn(`
        DELETE FROM public.relay_nonces
        WHERE expires_at < now() - INTERVAL '5 minutes';
      `);
    } catch {
      // Best-effort non-blocking cleanup
    }
  }

  async claimNonce(key: string, ttlSeconds: number): Promise<boolean> {
    await this.ensureTable();

    const query = `
      INSERT INTO public.relay_nonces (nonce_key, expires_at)
      VALUES ($1, now() + ($2 || ' seconds')::interval)
      ON CONFLICT (nonce_key) DO UPDATE
        SET expires_at = EXCLUDED.expires_at, created_at = now()
        WHERE public.relay_nonces.expires_at < now()
      RETURNING nonce_key;
    `;

    const res = await this.queryFn(query, [key, ttlSeconds]);
    this.opportunisticCleanup().catch(() => {});

    const claimed = (res.rowCount ?? res.rows?.length ?? 0) > 0;

    if (claimed) {
      await this.localL1.claimNonce(key, ttlSeconds);
    }

    return claimed;
  }
}

/**
 * Fail-closed deduplicator for production environments where database configuration is missing.
 * Prevents silent fallback to process-local state across multi-instance serverless deployments.
 */
export class FailClosedNonceDeduplicator implements NonceDeduplicator {
  async claimNonce(_key: string, _ttlSeconds: number): Promise<boolean> {
    throw new AuthenticationError(
      "Distributed replay protection database is unconfigured in production",
    );
  }
}

let defaultDeduplicator: NonceDeduplicator | null = null;

export function getDefaultNonceDeduplicator(): NonceDeduplicator {
  if (defaultDeduplicator) return defaultDeduplicator;

  const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
  const hasDb = Boolean(process.env.SECOND_BRAIN_DATABASE_URL || process.env.DATABASE_URL);

  if (hasDb && process.env.NODE_ENV !== "test") {
    defaultDeduplicator = new PostgresNonceDeduplicator();
  } else if (isProd && process.env.NODE_ENV !== "test") {
    // In production, never silently fall back to in-memory process-local state
    defaultDeduplicator = new FailClosedNonceDeduplicator();
  } else {
    defaultDeduplicator = new InMemoryNonceDeduplicator();
  }

  return defaultDeduplicator;
}

export function setDefaultNonceDeduplicator(deduplicator: NonceDeduplicator | null): void {
  defaultDeduplicator = deduplicator;
}

export function resetDefaultNonceDeduplicator(): void {
  defaultDeduplicator = null;
}
