/**
 * Unit tests for Second Brain PostgreSQL SSL configuration resolver.
 * Validates production enforcement, rejection of unsafe overrides,
 * development fallback, and explicit non-production overrides.
 */

import { describe, expect, it } from "vitest";
import { resolveDatabaseSslConfig } from "../db/client";

describe("Database SSL Configuration Resolver", () => {
  const remoteUrl =
    "postgresql://user:secret@ep-cool-db.us-east-2.aws.neon.tech/neondb?sslmode=require";
  const poolerUrl =
    "postgresql://user:secret@ep-cool-db-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require";
  const localUrl = "postgresql://user:secret@localhost:5432/neondb";
  const disabledUrl = "postgresql://user:secret@db.internal:5432/neondb?sslmode=disable";

  describe("Production environment (NODE_ENV=production)", () => {
    it("enforces rejectUnauthorized: true by default on direct and pooler endpoints", () => {
      const config = resolveDatabaseSslConfig(remoteUrl, {
        NODE_ENV: "production",
      } as NodeJS.ProcessEnv);

      expect(config).toEqual({ rejectUnauthorized: true });

      const poolerConfig = resolveDatabaseSslConfig(poolerUrl, {
        NODE_ENV: "production",
      } as NodeJS.ProcessEnv);

      expect(poolerConfig).toEqual({ rejectUnauthorized: true });
    });

    it("allows explicit SECOND_BRAIN_DB_SSL_REJECT_UNAUTHORIZED=true", () => {
      const config = resolveDatabaseSslConfig(remoteUrl, {
        NODE_ENV: "production",
        SECOND_BRAIN_DB_SSL_REJECT_UNAUTHORIZED: "true",
      } as NodeJS.ProcessEnv);

      expect(config).toEqual({ rejectUnauthorized: true });
    });

    it("throws a configuration error if SECOND_BRAIN_DB_SSL_REJECT_UNAUTHORIZED=false is provided", () => {
      expect(() => {
        resolveDatabaseSslConfig(remoteUrl, {
          NODE_ENV: "production",
          SECOND_BRAIN_DB_SSL_REJECT_UNAUTHORIZED: "false",
        } as NodeJS.ProcessEnv);
      }).toThrow(/Insecure database SSL configuration/);
    });

    it("throws a configuration error if SECOND_BRAIN_DB_SSL_REJECT_UNAUTHORIZED=0 is provided", () => {
      expect(() => {
        resolveDatabaseSslConfig(remoteUrl, {
          NODE_ENV: "production",
          SECOND_BRAIN_DB_SSL_REJECT_UNAUTHORIZED: "0",
        } as NodeJS.ProcessEnv);
      }).toThrow(/Insecure database SSL configuration/);
    });

    it("throws a configuration error if sslmode=disable is in connection string", () => {
      expect(() => {
        resolveDatabaseSslConfig(disabledUrl, {
          NODE_ENV: "production",
        } as NodeJS.ProcessEnv);
      }).toThrow(/sslmode=disable cannot be used in production environments/);
    });
  });

  describe("Vercel production environment (VERCEL_ENV=production)", () => {
    it("enforces rejectUnauthorized: true by default", () => {
      const config = resolveDatabaseSslConfig(remoteUrl, {
        VERCEL_ENV: "production",
      } as unknown as NodeJS.ProcessEnv);

      expect(config).toEqual({ rejectUnauthorized: true });
    });

    it("allows explicit SECOND_BRAIN_DB_SSL_REJECT_UNAUTHORIZED=true", () => {
      const config = resolveDatabaseSslConfig(remoteUrl, {
        VERCEL_ENV: "production",
        SECOND_BRAIN_DB_SSL_REJECT_UNAUTHORIZED: "true",
      } as unknown as NodeJS.ProcessEnv);

      expect(config).toEqual({ rejectUnauthorized: true });
    });

    it("throws a configuration error if SECOND_BRAIN_DB_SSL_REJECT_UNAUTHORIZED=false is provided", () => {
      expect(() => {
        resolveDatabaseSslConfig(remoteUrl, {
          VERCEL_ENV: "production",
          SECOND_BRAIN_DB_SSL_REJECT_UNAUTHORIZED: "false",
        } as unknown as NodeJS.ProcessEnv);
      }).toThrow(/Insecure database SSL configuration/);
    });

    it("throws a configuration error if sslmode=disable is in connection string", () => {
      expect(() => {
        resolveDatabaseSslConfig(disabledUrl, {
          VERCEL_ENV: "production",
        } as unknown as NodeJS.ProcessEnv);
      }).toThrow(/sslmode=disable cannot be used in production environments/);
    });
  });

  describe("Non-production environments (development & test)", () => {
    it("allows rejectUnauthorized: false in development and test environments by default", () => {
      const devConfig = resolveDatabaseSslConfig(remoteUrl, {
        NODE_ENV: "development",
      } as NodeJS.ProcessEnv);

      expect(devConfig).toEqual({ rejectUnauthorized: false });

      const testConfig = resolveDatabaseSslConfig(remoteUrl, {
        NODE_ENV: "test",
      } as NodeJS.ProcessEnv);

      expect(testConfig).toEqual({ rejectUnauthorized: false });
    });

    it("honors explicit SECOND_BRAIN_DB_SSL_REJECT_UNAUTHORIZED=false override in development", () => {
      const config = resolveDatabaseSslConfig(remoteUrl, {
        NODE_ENV: "development",
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
});
