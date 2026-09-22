/**
 * Authentication Test Suite
 * Validates key parsing, validation against database, and error codes.
 */

import { describe, expect, it } from "vitest";
import { AuthenticationError, authenticateAgent, parseApiKey } from "../auth/authenticate";
import { setMockQueryHandler } from "../db/client";

describe("Agent Authentication", () => {
  it("parses valid raw key and Bearer header correctly", () => {
    const raw = parseApiKey("sb_live_claude_123.secret_456");
    expect(raw.keyId).toBe("sb_live_claude_123");
    expect(raw.secret).toBe("secret_456");

    const bearer = parseApiKey("Bearer sb_live_claude_123.secret_456");
    expect(bearer.keyId).toBe("sb_live_claude_123");
    expect(bearer.secret).toBe("secret_456");
  });

  it("rejects missing, empty, or malformed keys", () => {
    expect(() => parseApiKey("")).toThrow(AuthenticationError);
    expect(() => parseApiKey(null)).toThrow(AuthenticationError);
    expect(() => parseApiKey("no_dot_secret")).toThrow(AuthenticationError);
    expect(() => parseApiKey(".only_secret")).toThrow(AuthenticationError);
    expect(() => parseApiKey("only_key.")).toThrow(AuthenticationError);
  });

  it("authenticates a valid key and returns safe context", async () => {
    setMockQueryHandler(async () => ({
      rows: [
        {
          auth_result: {
            authenticated: true,
            principal: {
              id: "p-1",
              key: "claude",
              displayName: "Claude",
              principalType: "agent",
            },
            credential: {
              id: "c-1",
              keyId: "sb_live_claude_123",
              description: "Primary key",
              lastRotatedAt: null,
              expiresAt: null,
            },
            principalGrants: [
              {
                grantId: "g-1",
                action: "strategy.read",
                resourceType: "SECOND_BRAIN_DOMAIN",
                resourceKey: "domain:strategy",
                effect: "ALLOW",
                constraints: null,
                expiresAt: null,
              },
            ],
            credentialScopes: [
              {
                scopeId: "s-1",
                action: "strategy.read",
                resourceType: "SECOND_BRAIN_DOMAIN",
                resourceKey: "domain:strategy",
                effect: "ALLOW",
                constraints: null,
                expiresAt: null,
              },
            ],
          },
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    }));

    const ctx = await authenticateAgent("Bearer sb_live_claude_123.valid_secret");
    expect(ctx.authenticated).toBe(true);
    expect(ctx.principal.key).toBe("claude");
    expect(ctx.credential.keyId).toBe("sb_live_claude_123");
    expect(ctx.principalGrants).toHaveLength(1);
    expect(ctx.credentialScopes).toHaveLength(1);

    // Verify secrets are absent
    expect((ctx as any).secret).toBeUndefined();
    expect((ctx as any).secret_hash).toBeUndefined();
    expect((ctx as any).secretHash).toBeUndefined();
  });

  it("rejects wrong secret with INVALID_CREDENTIALS", async () => {
    setMockQueryHandler(async () => ({
      rows: [
        {
          auth_result: {
            authenticated: false,
            error: "INVALID_CREDENTIALS",
          },
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    }));

    await expect(authenticateAgent("sb_live_claude_123.wrong_secret")).rejects.toThrow(
      /Invalid API key or secret/,
    );
  });

  it("rejects revoked key with KEY_REVOKED", async () => {
    setMockQueryHandler(async () => ({
      rows: [
        {
          auth_result: {
            authenticated: false,
            error: "KEY_REVOKED",
          },
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    }));

    await expect(authenticateAgent("sb_live_claude_123.secret")).rejects.toMatchObject({
      code: "KEY_REVOKED",
    });
  });

  it("rejects disabled key with KEY_DISABLED", async () => {
    setMockQueryHandler(async () => ({
      rows: [
        {
          auth_result: {
            authenticated: false,
            error: "KEY_DISABLED",
          },
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    }));

    await expect(authenticateAgent("sb_live_claude_123.secret")).rejects.toMatchObject({
      code: "KEY_DISABLED",
    });
  });

  it("rejects expired key with KEY_EXPIRED", async () => {
    setMockQueryHandler(async () => ({
      rows: [
        {
          auth_result: {
            authenticated: false,
            error: "KEY_EXPIRED",
          },
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    }));

    await expect(authenticateAgent("sb_live_claude_123.secret")).rejects.toMatchObject({
      code: "KEY_EXPIRED",
    });
  });

  it("rejects disabled principal with PRINCIPAL_DISABLED", async () => {
    setMockQueryHandler(async () => ({
      rows: [
        {
          auth_result: {
            authenticated: false,
            error: "PRINCIPAL_DISABLED",
          },
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    }));

    await expect(authenticateAgent("sb_live_claude_123.secret")).rejects.toMatchObject({
      code: "PRINCIPAL_DISABLED",
      statusCode: 403,
    });
  });
});
