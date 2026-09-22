/**
 * Rotation and Agent Isolation Test Suite
 * Validates multiple simultaneous keys per principal, key rotation overlap,
 * independent key scopes, and strict isolation between agents.
 */

import { describe, expect, it } from "vitest";
import { authorize } from "../auth/authorize";
import type { AuthenticatedContext, CredentialScope, PrincipalGrant } from "../types/iam";

describe("Rotation and Agent Isolation", () => {
  const claudePrincipal = {
    id: "p-claude",
    key: "claude",
    displayName: "Claude",
    principalType: "agent" as const,
  };

  const musePrincipal = {
    id: "p-muse",
    key: "muse",
    displayName: "Muse",
    principalType: "agent" as const,
  };

  const claudeGrants: PrincipalGrant[] = [
    {
      grantId: "g-claude-strategy",
      effect: "ALLOW",
      action: "strategy.read",
      resourceType: "SECOND_BRAIN_DOMAIN",
      resourceKey: "domain:strategy",
      constraints: { domains: ["strategy"] },
      expiresAt: null,
    },
    {
      grantId: "g-claude-deny-social",
      effect: "DENY",
      action: "*",
      resourceType: "SECOND_BRAIN_DOMAIN",
      resourceKey: "domain:social-content",
      constraints: null,
      expiresAt: null,
    },
  ];

  const museGrants: PrincipalGrant[] = [
    {
      grantId: "g-muse-social",
      effect: "ALLOW",
      action: "context.read",
      resourceType: "SECOND_BRAIN_DOMAIN",
      resourceKey: "domain:social-content",
      constraints: { domains: ["social-content"] },
      expiresAt: null,
    },
    {
      grantId: "g-muse-deny-strategy",
      effect: "DENY",
      action: "*",
      resourceType: "SECOND_BRAIN_DOMAIN",
      resourceKey: "domain:strategy",
      constraints: null,
      expiresAt: null,
    },
  ];

  it("supports multiple simultaneous credentials for one principal with independent scopes", () => {
    // Key A: Strategy key
    const claudeKeyA_Scopes: CredentialScope[] = [
      {
        scopeId: "s-keyA",
        effect: "ALLOW",
        action: "strategy.read",
        resourceType: "SECOND_BRAIN_DOMAIN",
        resourceKey: "domain:strategy",
        constraints: null,
        expiresAt: null,
      },
    ];

    // Key B: Research key (has no strategy.read scope)
    const claudeKeyB_Scopes: CredentialScope[] = [
      {
        scopeId: "s-keyB",
        effect: "ALLOW",
        action: "research.read",
        resourceType: "SECOND_BRAIN_DOMAIN",
        resourceKey: "domain:research",
        constraints: null,
        expiresAt: null,
      },
    ];

    const contextKeyA: AuthenticatedContext = {
      authenticated: true,
      principal: claudePrincipal,
      credential: {
        id: "c-keyA",
        keyId: "sb_live_claude_keyA",
        description: "Strategy Key",
        lastRotatedAt: null,
        expiresAt: null,
      },
      principalGrants: claudeGrants,
      credentialScopes: claudeKeyA_Scopes,
    };

    const contextKeyB: AuthenticatedContext = {
      authenticated: true,
      principal: claudePrincipal,
      credential: {
        id: "c-keyB",
        keyId: "sb_live_claude_keyB",
        description: "Research Key",
        lastRotatedAt: null,
        expiresAt: null,
      },
      principalGrants: claudeGrants,
      credentialScopes: claudeKeyB_Scopes,
    };

    // Key A is authorized for strategy.read
    const authA = authorize({
      context: contextKeyA,
      action: "strategy.read",
      resourceType: "SECOND_BRAIN_DOMAIN",
      resourceKey: "domain:strategy",
      evalContext: { domain: "strategy" },
    });
    expect(authA.authorized).toBe(true);

    // Key B is NOT authorized for strategy.read (credential scope restricts it)
    const authB = authorize({
      context: contextKeyB,
      action: "strategy.read",
      resourceType: "SECOND_BRAIN_DOMAIN",
      resourceKey: "domain:strategy",
      evalContext: { domain: "strategy" },
    });
    expect(authB.authorized).toBe(false);
  });

  it("enforces cross-agent isolation: Claude cannot access Muse resources and vice versa", () => {
    const claudeContext: AuthenticatedContext = {
      authenticated: true,
      principal: claudePrincipal,
      credential: {
        id: "c-claude",
        keyId: "sb_live_claude_01",
        description: null,
        lastRotatedAt: null,
        expiresAt: null,
      },
      principalGrants: claudeGrants,
      credentialScopes: [
        {
          scopeId: "cs-c",
          effect: "ALLOW",
          action: "*",
          resourceType: "*",
          resourceKey: "*",
          constraints: null,
          expiresAt: null,
        },
      ],
    };

    const museContext: AuthenticatedContext = {
      authenticated: true,
      principal: musePrincipal,
      credential: {
        id: "c-muse",
        keyId: "sb_live_muse_01",
        description: null,
        lastRotatedAt: null,
        expiresAt: null,
      },
      principalGrants: museGrants,
      credentialScopes: [
        {
          scopeId: "cs-m",
          effect: "ALLOW",
          action: "*",
          resourceType: "*",
          resourceKey: "*",
          constraints: null,
          expiresAt: null,
        },
      ],
    };

    // Claude attempts to read Muse's social-content domain
    const claudeAccessSocial = authorize({
      context: claudeContext,
      action: "context.read",
      resourceType: "SECOND_BRAIN_DOMAIN",
      resourceKey: "domain:social-content",
      evalContext: { domain: "social-content" },
    });
    expect(claudeAccessSocial.authorized).toBe(false);
    expect(claudeAccessSocial.decision).toBe("DENY");

    // Muse attempts to read Claude's strategy domain
    const museAccessStrategy = authorize({
      context: museContext,
      action: "strategy.read",
      resourceType: "SECOND_BRAIN_DOMAIN",
      resourceKey: "domain:strategy",
      evalContext: { domain: "strategy" },
    });
    expect(museAccessStrategy.authorized).toBe(false);
    expect(museAccessStrategy.decision).toBe("DENY");
  });
});
