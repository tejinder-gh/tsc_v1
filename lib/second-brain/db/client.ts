/**
 * Database client for Second Brain Agent IAM & Repositories.
 * Uses least-privilege runtime role (skill_corner_runtime).
 * Supports pluggable query handler for deterministic, network-free unit tests.
 */

import { Pool, type QueryResult, type QueryResultRow } from "pg";

let pool: Pool | null = null;
let mockQueryHandler: ((text: string, params?: unknown[]) => Promise<QueryResult<any>>) | null =
  null;

export function resolveDatabaseSslConfig(
  connectionString: string,
  env: NodeJS.ProcessEnv = process.env,
): boolean | { rejectUnauthorized: boolean } {
  // If connection URL explicitly disables SSL or targets local loopback without override:
  const isLocalOrDisabled =
    connectionString.includes("sslmode=disable") ||
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1");

  if (isLocalOrDisabled && !env.SECOND_BRAIN_DB_SSL_REJECT_UNAUTHORIZED) {
    return false;
  }

  // Explicit override takes precedence if set
  if (env.SECOND_BRAIN_DB_SSL_REJECT_UNAUTHORIZED !== undefined) {
    const override = env.SECOND_BRAIN_DB_SSL_REJECT_UNAUTHORIZED.toLowerCase().trim();
    if (override === "false" || override === "0") {
      return { rejectUnauthorized: false };
    }
    if (override === "true" || override === "1") {
      return { rejectUnauthorized: true };
    }
  }

  // Production environments enforce certificate authority verification by default
  const isProd = env.NODE_ENV === "production" || env.VERCEL_ENV === "production";
  if (isProd) {
    return { rejectUnauthorized: true };
  }

  // Development and test defaults
  return { rejectUnauthorized: false };
}

export function getDatabasePool(): Pool {
  if (pool) return pool;

  const connectionString = process.env.SECOND_BRAIN_DATABASE_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "SECOND_BRAIN_DATABASE_URL is not configured. Runtime database operations require the least-privilege connection string.",
    );
  }

  const ssl = resolveDatabaseSslConfig(connectionString);

  pool = new Pool({
    connectionString,
    ssl,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  pool.on("error", (err) => {
    console.error("Unexpected error on idle PostgreSQL client", err);
  });

  return pool;
}

export function setMockQueryHandler(
  handler: ((text: string, params?: unknown[]) => Promise<QueryResult<any>>) | null,
): void {
  mockQueryHandler = handler;
}

export async function dbQuery<T extends QueryResultRow = any>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  if (mockQueryHandler) {
    return mockQueryHandler(text, params);
  }

  const p = getDatabasePool();
  return p.query<T>(text, params);
}

export async function closeDatabasePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
