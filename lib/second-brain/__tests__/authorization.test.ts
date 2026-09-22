/**
 * Dual-Layer Authorization Test Suite
 * Validates the strict invariant:
 * Principal Grants ∩ Credential Scopes ∩ Action ∩ Resource ∩ Constraints = Effective Access
 */

import { describe, expect, it } from "vitest";
import { authorize } from "../auth/authorize";
import type { AuthenticatedContext } from "../types/iam";

function createMockContext(overrides: Partial<AuthenticatedContext> = {}): AuthenticatedContext {
  return {
    authenticated: true,
    principal: {
      id: "p-claude",
      key: "claude",
      displayName: "Claude",
      principalType: "agent",
    },
    credential: {
      id: "c-strat-key",
      keyId: "sb_live_claude_strat",
      description: "Strategy key",
      lastRotatedAt: null,
      expiresAt: null,
    },
    principalGrants: [
      {
        grantId: "pg-1",
        effect: "ALLOW",
        action: "context.read",
        resourceType: "SECOND_BRAIN_DOMAIN",
        resourceKey: "domain:strategy",
        constraints: { domains: ["strategy"] },
        expiresAt: null,
      },
      {
        grantId: "pg-2",
        effect: "ALLOW",
        action: "strategy.update",
        resourceType: "SECOND_BRAIN_RESOURCE",
        resourceKey: "resource:strategy-decisions",
        constraints: { allowedFields: ["status", "summary", "next_action"] },
        expiresAt: null,
      },
    ],
    credentialScopes: [
      {
        scopeId: "cs-1",
        effect: "ALLOW",
        action: "context.read",
        resourceType: "SECOND_BRAIN_DOMAIN",
        resourceKey: "domain:strategy",
        constraints: { domains: ["strategy"] },
        expiresAt: null,
      },
      {
        scopeId: "cs-2",
        effect: "ALLOW",
        action: "strategy.update",
        resourceType: "SECOND_BRAIN_RESOURCE",
        resourceKey: "resource:strategy-decisions",
        constraints: { allowedFields: ["status", "summary", "next_action"] },
        expiresAt: null,
      },
    ],
    ...overrides,
  };
}

describe("Dual-Layer Authorization Engine", () => {
  it("allows operation when both Principal Grant and Credential Scope ALLOW it", () => {
    const context = createMockContext();
    const result = authorize({
      context,
      action: "context.read",
      resourceType: "SECOND_BRAIN_DOMAIN",
      resourceKey: "domain:strategy",
      evalContext: { domain: "strategy" },
    });

    expect(result.authorized).toBe(true);
    expect(result.decision).toBe("ALLOW");
    expect(result.matchedGrant?.grantId).toBe("pg-1");
    expect(result.matchedScope?.scopeId).toBe("cs-1");
  });

  it("denies operation when Principal has grant, but Credential Scope omits it (key cannot exceed scope)", () => {
    const context = createMockContext({
      credentialScopes: [], // This particular key has no scopes
    });

    const result = authorize({
      context,
      action: "context.read",
      resourceType: "SECOND_BRAIN_DOMAIN",
      resourceKey: "domain:strategy",
      evalContext: { domain: "strategy" },
    });

    expect(result.authorized).toBe(false);
    expect(result.decision).toBe("DENY");
    expect(result.reason).toContain("Credential scope does not permit action");
  });

  it("denies operation when Credential has scope, but Principal has no grant (key cannot exceed principal)", () => {
    const context = createMockContext({
      principalGrants: [], // Principal has zero grants
    });

    const result = authorize({
      context,
      action: "context.read",
      resourceType: "SECOND_BRAIN_DOMAIN",
      resourceKey: "domain:strategy",
      evalContext: { domain: "strategy" },
    });

    expect(result.authorized).toBe(false);
    expect(result.decision).toBe("DENY");
    expect(result.reason).toContain("No matching principal grant");
  });

  it("denies operation when explicit DENY exists on Principal Grant (explicit DENY > ALLOW)", () => {
    const context = createMockContext({
      principalGrants: [
        {
          grantId: "pg-allow",
          effect: "ALLOW",
          action: "context.read",
          resourceType: "SECOND_BRAIN_DOMAIN",
          resourceKey: "domain:strategy",
          constraints: null,
          expiresAt: null,
        },
        {
          grantId: "pg-deny",
          effect: "DENY",
          action: "context.read",
          resourceType: "SECOND_BRAIN_DOMAIN",
          resourceKey: "domain:strategy",
          constraints: null,
          expiresAt: null,
        },
      ],
    });

    const result = authorize({
      context,
      action: "context.read",
      resourceType: "SECOND_BRAIN_DOMAIN",
      resourceKey: "domain:strategy",
    });

    expect(result.authorized).toBe(false);
    expect(result.decision).toBe("DENY");
    expect(result.reason).toContain("Explicit DENY in principal grant");
  });

  it("denies operation when explicit DENY exists on Credential Scope (explicit DENY > ALLOW)", () => {
    const context = createMockContext({
      credentialScopes: [
        {
          scopeId: "cs-deny",
          effect: "DENY",
          action: "context.read",
          resourceType: "SECOND_BRAIN_DOMAIN",
          resourceKey: "domain:strategy",
          constraints: null,
          expiresAt: null,
        },
      ],
    });

    const result = authorize({
      context,
      action: "context.read",
      resourceType: "SECOND_BRAIN_DOMAIN",
      resourceKey: "domain:strategy",
    });

    expect(result.authorized).toBe(false);
    expect(result.decision).toBe("DENY");
    expect(result.reason).toContain("Explicit DENY in credential scope");
  });

  it("denies operation on domain constraint mismatch", () => {
    const context = createMockContext();
    const result = authorize({
      context,
      action: "context.read",
      resourceType: "SECOND_BRAIN_DOMAIN",
      resourceKey: "domain:strategy",
      evalContext: { domain: "private-financial-records" },
    });

    expect(result.authorized).toBe(false);
    expect(result.decision).toBe("DENY");
  });

  it("allows column updates when fields match allowedFields constraint", () => {
    const context = createMockContext();
    const result = authorize({
      context,
      action: "strategy.update",
      resourceType: "SECOND_BRAIN_RESOURCE",
      resourceKey: "resource:strategy-decisions",
      evalContext: {
        fields: ["status", "summary"],
      },
    });

    expect(result.authorized).toBe(true);
    expect(result.decision).toBe("ALLOW");
  });

  it("denies column updates when requesting forbidden fields (owner, financial_commitment)", () => {
    const context = createMockContext();
    const result = authorize({
      context,
      action: "strategy.update",
      resourceType: "SECOND_BRAIN_RESOURCE",
      resourceKey: "resource:strategy-decisions",
      evalContext: {
        fields: ["status", "owner", "financial_commitment"],
      },
    });

    expect(result.authorized).toBe(false);
    expect(result.decision).toBe("DENY");
    expect(result.reason).toContain("Field 'owner' is not permitted");
  });
});
