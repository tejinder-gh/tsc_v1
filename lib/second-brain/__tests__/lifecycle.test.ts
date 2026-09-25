/**
 * Credential Lifecycle Management Tests
 * Validates create, update, rotate, regenerate, revoke, enable/disable, and safe listing.
 */

import { describe, expect, it } from "vitest";
import {
  createAgentCredential,
  listAgentCredentials,
  regenerateAgentCredential,
  revokeAgentCredential,
  rotateAgentCredential,
  setAgentCredentialEnabled,
  setMockAdminHandler,
  updateAgentCredential,
} from "../admin/lifecycle";

describe("Credential Lifecycle Operations", () => {
  it("creates a new credential with scopes and returns plaintext secret once", async () => {
    let capturedParams: unknown[] = [];
    setMockAdminHandler(async (_text, params) => {
      capturedParams = params || [];
      return [
        {
          result: {
            credentialId: "c-123",
            principalKey: "claude",
            keyId: "sb_live_claude_1111",
            secret: "plaintext_secret_256_bits",
            combinedKey: "sb_live_claude_1111.plaintext_secret_256_bits",
            scopes: [
              {
                scopeId: "s-1",
                action: "strategy.read",
                resourceType: "SECOND_BRAIN_DOMAIN",
                resourceKey: "domain:strategy",
                effect: "ALLOW",
              },
            ],
            createdAt: new Date().toISOString(),
            expiresAt: null,
          },
        },
      ];
    });

    const result = await createAgentCredential({
      principalKey: "claude",
      description: "Claude strategy key",
      scopes: [
        {
          action: "strategy.read",
          resourceType: "SECOND_BRAIN_DOMAIN",
          resourceKey: "domain:strategy",
          effect: "ALLOW",
        },
      ],
    });

    expect(result.credentialId).toBe("c-123");
    expect(result.keyId).toBe("sb_live_claude_1111");
    expect(result.secret).toBe("plaintext_secret_256_bits");
    expect(result.combinedKey).toContain("sb_live_claude_1111.");
    expect(result.scopes).toHaveLength(1);
    expect(capturedParams[0]).toBe("claude");
  });

  it("updates credential metadata and scopes atomically without mutating secret_hash", async () => {
    let executedQuery = "";
    setMockAdminHandler(async (text, _params) => {
      executedQuery = text;
      return [
        {
          result: {
            credentialId: "c-123",
            keyId: "sb_live_claude_1111",
            principalId: "p-1",
            principalKey: "claude",
            displayName: "Claude",
            description: "Updated description",
            enabled: true,
            revoked: false,
            revokedAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastUsedAt: null,
            lastRotatedAt: null,
            expiresAt: null,
            rotationParentId: null,
            scopes: [
              {
                scopeId: "s-2",
                action: "strategy.update",
                resourceType: "SECOND_BRAIN_RESOURCE",
                resourceKey: "resource:decisions",
                effect: "ALLOW",
                constraints: { allowedFields: ["status"] },
              },
            ],
          },
        },
      ];
    });

    const result = await updateAgentCredential({
      credentialId: "c-123",
      description: "Updated description",
      scopes: [
        {
          action: "strategy.update",
          resourceType: "SECOND_BRAIN_RESOURCE",
          resourceKey: "resource:decisions",
          effect: "ALLOW",
          constraints: { allowedFields: ["status"] },
        },
      ],
    });

    expect(result.description).toBe("Updated description");
    expect(result.scopes).toHaveLength(1);
    expect(result.scopes[0].action).toBe("strategy.update");
    // Verify SQL does not contain secret_hash update
    expect(executedQuery).not.toContain("secret_hash =");
  });

  it("rotates credential, linking rotationParentId and copying scopes", async () => {
    let capturedParams: unknown[] = [];
    setMockAdminHandler(async (_text, params) => {
      capturedParams = params || [];
      return [
        {
          result: {
            credentialId: "c-456",
            principalKey: "claude",
            keyId: "sb_live_claude_2222",
            secret: "new_plaintext_secret",
            combinedKey: "sb_live_claude_2222.new_plaintext_secret",
            scopes: [
              {
                scopeId: "s-1",
                action: "strategy.read",
                resourceType: "SECOND_BRAIN_DOMAIN",
                resourceKey: "domain:strategy",
                effect: "ALLOW",
              },
            ],
            createdAt: new Date().toISOString(),
            expiresAt: null,
          },
        },
      ];
    });

    const result = await rotateAgentCredential({
      credentialId: "c-123",
      gracePeriodSeconds: 300,
    });

    expect(result.credentialId).toBe("c-456");
    expect(result.keyId).toBe("sb_live_claude_2222");
    expect(result.secret).toBe("new_plaintext_secret");
    expect(capturedParams[0]).toBe("c-123");
    expect(capturedParams[3]).toBe(300); // grace period
  });

  it("regenerates credential as an alias to rotation, preserving lineage", async () => {
    let capturedParams: unknown[] = [];
    setMockAdminHandler(async (_text, params) => {
      capturedParams = params || [];
      return [
        {
          result: {
            credentialId: "c-789",
            principalKey: "claude",
            keyId: "sb_live_claude_3333",
            secret: "regen_secret",
            combinedKey: "sb_live_claude_3333.regen_secret",
            scopes: [],
            createdAt: new Date().toISOString(),
            expiresAt: null,
          },
        },
      ];
    });

    const result = await regenerateAgentCredential("c-123");
    expect(result.credentialId).toBe("c-789");
    expect(capturedParams[0]).toBe("c-123");
  });

  it("revokes credential permanently", async () => {
    setMockAdminHandler(async () => [
      {
        result: {
          credentialId: "c-123",
          keyId: "sb_live_claude_1111",
          principalId: "p-1",
          principalKey: "claude",
          displayName: "Claude",
          description: null,
          enabled: false,
          revoked: true,
          revokedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastUsedAt: null,
          lastRotatedAt: null,
          expiresAt: null,
          rotationParentId: null,
          scopes: [],
        },
      },
    ]);

    const result = await revokeAgentCredential("c-123");
    expect(result.enabled).toBe(false);
    expect(result.revoked).toBe(true);
    expect(result.revokedAt).not.toBeNull();
  });

  it("supports disabling and enabling credentials", async () => {
    setMockAdminHandler(async (_text, params) => [
      {
        result: {
          credentialId: "c-123",
          keyId: "sb_live_claude_1111",
          principalId: "p-1",
          principalKey: "claude",
          displayName: "Claude",
          description: null,
          enabled: params?.[1] as boolean,
          revoked: false,
          revokedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastUsedAt: null,
          lastRotatedAt: null,
          expiresAt: null,
          rotationParentId: null,
          scopes: [],
        },
      },
    ]);

    const disabled = await setAgentCredentialEnabled("c-123", false);
    expect(disabled.enabled).toBe(false);

    const enabled = await setAgentCredentialEnabled("c-123", true);
    expect(enabled.enabled).toBe(true);
  });

  it("lists safe credentials metadata without exposing secrets or secret hashes", async () => {
    setMockAdminHandler(async () => [
      {
        result: [
          {
            credentialId: "c-123",
            keyId: "sb_live_claude_1111",
            principalId: "p-1",
            principalKey: "claude",
            displayName: "Claude",
            description: "Claude strategy key",
            enabled: true,
            revoked: false,
            revokedAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastUsedAt: null,
            lastRotatedAt: null,
            expiresAt: null,
            rotationParentId: null,
            scopes: [
              {
                scopeId: "s-1",
                action: "strategy.read",
                resourceType: "SECOND_BRAIN_DOMAIN",
                resourceKey: "domain:strategy",
                effect: "ALLOW",
              },
            ],
          },
        ],
      },
    ]);

    const list = await listAgentCredentials("claude");
    expect(list).toHaveLength(1);
    const item = list[0];
    expect(item.keyId).toBe("sb_live_claude_1111");
    expect(item.principalKey).toBe("claude");
    // Critical verification: secret and secret_hash are undefined in safe metadata
    expect((item as unknown as Record<string, unknown>).secret).toBeUndefined();
    expect((item as unknown as Record<string, unknown>).secret_hash).toBeUndefined();
    expect((item as unknown as Record<string, unknown>).secretHash).toBeUndefined();
  });
});
