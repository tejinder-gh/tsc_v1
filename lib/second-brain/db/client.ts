/**
 * Database client for Second Brain Agent IAM & Repositories.
 * Uses least-privilege runtime role (skill_corner_runtime).
 * Supports pluggable query handler for deterministic, network-free unit tests.
 */

import { Pool, type QueryResult, type QueryResultRow } from "pg";

let pool: Pool | null = null;
let mockQueryHandler: ((text: string, params?: unknown[]) => Promise<QueryResult<any>>) | null =
  null;

export function getDatabasePool(): Pool {
  if (pool) return pool;

  const connectionString = process.env.SECOND_BRAIN_DATABASE_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "SECOND_BRAIN_DATABASE_URL is not configured. Runtime database operations require the least-privilege connection string.",
    );
  }

  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
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
