/**
 * What: Distributed rate limiting for public ingestion endpoints (/api/lead, /api/newsletter/subscribe).
 * Why: Protects downstream CRM webhooks (Zapier/Make/n8n) from headless bot flood and execution quota exhaustion (P0).
 * How: Evaluates sliding/fixed window by client IP and route (with optional privacy-safe SHA256 identifier hashing).
 *      Backed by Postgres in production with an in-memory fallback for local dev/testing.
 *      Never logs raw lead/newsletter PII during throttling.
 */

import { createHash } from "node:crypto";
import { dbQuery } from "./second-brain/db/client";

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAfterSeconds: number;
}

export interface RateLimiter {
  consume(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult>;
}

export class InMemoryRateLimiter implements RateLimiter {
  private store = new Map<string, { count: number; resetAt: number }>();

  async consume(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || entry.resetAt <= now) {
      const resetAt = now + windowSeconds * 1000;
      this.store.set(key, { count: 1, resetAt });
      return {
        allowed: true,
        limit,
        remaining: limit - 1,
        resetAfterSeconds: windowSeconds,
      };
    }

    entry.count += 1;
    const remaining = Math.max(0, limit - entry.count);
    const resetAfterSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));

    if (this.store.size > 5000) {
      for (const [k, v] of this.store.entries()) {
        if (v.resetAt <= now) this.store.delete(k);
      }
    }

    return {
      allowed: entry.count <= limit,
      limit,
      remaining,
      resetAfterSeconds,
    };
  }

  clear(): void {
    this.store.clear();
  }
}

export class PostgresRateLimiter implements RateLimiter {
  private lastCleanup = 0;

  constructor(private readonly queryFn = dbQuery) {}

  private async opportunisticCleanup(): Promise<void> {
    const now = Date.now();
    if (now - this.lastCleanup < 60_000) return;
    this.lastCleanup = now;

    try {
      await this.queryFn(`
        DELETE FROM public.rate_limits
        WHERE reset_at < now() - INTERVAL '5 minutes';
      `);
    } catch {
      // Best-effort non-blocking maintenance
    }
  }

  async consume(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {

    const query = `
      INSERT INTO public.rate_limits (limit_key, count, reset_at)
      VALUES ($1, 1, now() + ($2 || ' seconds')::interval)
      ON CONFLICT (limit_key) DO UPDATE
        SET 
          count = CASE 
            WHEN public.rate_limits.reset_at < now() THEN 1 
            ELSE public.rate_limits.count + 1 
          END,
          reset_at = CASE 
            WHEN public.rate_limits.reset_at < now() THEN now() + ($2 || ' seconds')::interval 
            ELSE public.rate_limits.reset_at 
          END
      RETURNING count, EXTRACT(EPOCH FROM (reset_at - now()))::int AS retry_after;
    `;

    const res = await this.queryFn(query, [key, windowSeconds]);
    this.opportunisticCleanup().catch(() => {});

    const row = res.rows[0];
    const count = Number(row?.count || 1);
    const resetAfterSeconds = Math.max(1, Number(row?.retry_after || windowSeconds));
    const allowed = count <= limit;
    const remaining = Math.max(0, limit - count);

    return {
      allowed,
      limit,
      remaining,
      resetAfterSeconds,
    };
  }
}

/**
 * Forwarded IP extraction with platform trust boundaries.
 * 1. Checks 'x-real-ip': Injected authoritatively by Vercel edge / reverse proxy (cannot be spoofed by callers).
 * 2. Checks 'x-vercel-ip': Vercel edge IP header.
 * 3. Falls back to first entry of 'x-forwarded-for' for standard reverse proxy setups and local test suites.
 * 4. Defaults to '127.0.0.1'.
 */
export function getClientIp(request: Request): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const vercelIp = request.headers.get("x-vercel-ip")?.trim();
  if (vercelIp) return vercelIp;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }

  return "127.0.0.1";
}

export function hashIdentifier(val: string): string {
  return createHash("sha256").update(val.toLowerCase().trim()).digest("hex").slice(0, 16);
}

let defaultRateLimiter: RateLimiter | null = null;

export function getDefaultRateLimiter(): RateLimiter {
  if (defaultRateLimiter) return defaultRateLimiter;

  const hasDb = Boolean(process.env.SECOND_BRAIN_DATABASE_URL || process.env.DATABASE_URL);
  if (hasDb && process.env.NODE_ENV !== "test") {
    defaultRateLimiter = new PostgresRateLimiter();
  } else {
    defaultRateLimiter = new InMemoryRateLimiter();
  }

  return defaultRateLimiter;
}

export function setDefaultRateLimiter(limiter: RateLimiter | null): void {
  defaultRateLimiter = limiter;
}

export function resetDefaultRateLimiter(): void {
  defaultRateLimiter = null;
}

export interface CheckRateLimitOptions {
  route: string;
  limit?: number;
  windowSeconds?: number;
  limiter?: RateLimiter;
  targetIdentity?: string;
}

export async function checkPublicRateLimit(
  request: Request,
  options: CheckRateLimitOptions,
): Promise<RateLimitResult> {
  const clientIp = getClientIp(request);
  const route = options.route;
  const limit = options.limit ?? 10;
  const windowSeconds = options.windowSeconds ?? 60;
  const limiter = options.limiter ?? getDefaultRateLimiter();

  // One-way SHA256 truncated hash of client IP ensures NO raw IP address is stored in the database
  let key = `ratelimit:${route}:${hashIdentifier(clientIp)}`;
  if (options.targetIdentity) {
    key = `${key}:${hashIdentifier(options.targetIdentity)}`;
  }

  return limiter.consume(key, limit, windowSeconds);
}
