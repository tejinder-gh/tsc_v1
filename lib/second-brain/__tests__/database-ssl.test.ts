/**
 * Unit tests for Second Brain PostgreSQL SSL configuration resolver.
 * Validates production enforcement, development fallback, and explicit overrides.
 */

import { describe, expect, it } from "vitest";
import { resolveDatabaseSslConfig } from "../db/client";

describe("Database SSL Configuration Resolver", () => {
  const remoteUrl =
    "postgresql://user:secret@ep-cool-db.us-east-2.aws.neon.tech/neondb?sslmode=require";
  const localUrl = "postgresql://user:secret@localhost:5432/neondb";
  const disabledUrl = "postgresql://user:secret@db.internal:5432/neondb?sslmode=disable";

  it("enforces rejectUnauthorized: true in production by default (NODE_ENV=production)", () => {
    const config = resolveDatabaseSslConfig(remoteUrl, {
      NODE_ENV: "production",
    } as NodeJS.ProcessEnv);

    expect(config).toEqual({ rejectUnauthorized: true });
  });

  it("enforces rejectUnauthorized: true in Vercel production by default (VERCEL_ENV=production)", () => {
    const config = resolveDatabaseSslConfig(remoteUrl, {
      VERCEL_ENV: "production",
    } as unknown as NodeJS.ProcessEnv);

    expect(config).toEqual({ rejectUnauthorized: true });
  });

  it("allows rejectUnauthorized: false in development and test environments", () => {
    const devConfig = resolveDatabaseSslConfig(remoteUrl, {
      NODE_ENV: "development",
    } as NodeJS.ProcessEnv);

    expect(devConfig).toEqual({ rejectUnauthorized: false });

    const testConfig = resolveDatabaseSslConfig(remoteUrl, {
      NODE_ENV: "test",
    } as NodeJS.ProcessEnv);

    expect(testConfig).toEqual({ rejectUnauthorized: false });
  });

  it("honors explicit SECOND_BRAIN_DB_SSL_REJECT_UNAUTHORIZED=false override in production", () => {
    const config = resolveDatabaseSslConfig(remoteUrl, {
      NODE_ENV: "production",
      SECOND_BRAIN_DB_SSL_REJECT_UNAUTHORIZED: "false",
    } as NodeJS.ProcessEnv);

    expect(config).toEqual({ rejectUnauthorized: false });
  });

  it("honors explicit SECOND_BRAIN_DB_SSL_REJECT_UNAUTHORIZED=true override in development", () => {
    const config = resolveDatabaseSslConfig(remoteUrl, {
      NODE_ENV: "development",
      SECOND_BRAIN_DB_SSL_REJECT_UNAUTHORIZED: "true",
    } as NodeJS.ProcessEnv);

    expect(config).toEqual({ rejectUnauthorized: true });
  });

  it("disables SSL for localhost and sslmode=disable in development when unoverridden", () => {
    const localConfig = resolveDatabaseSslConfig(localUrl, {
      NODE_ENV: "development",
    } as NodeJS.ProcessEnv);

    expect(localConfig).toBe(false);

    const disabledConfig = resolveDatabaseSslConfig(disabledUrl, {
      NODE_ENV: "development",
    } as NodeJS.ProcessEnv);

    expect(disabledConfig).toBe(false);
  });
});
