import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ContextRepository } from "../repositories/ContextRepository";
import {
  type ContextAuditRecord,
  ContextAuthorizationError,
  ContextService,
  ContextValidationError,
} from "../services/ContextService";
import type { AuthenticatedContext } from "../types/iam";

describe("ContextService Authorization, Validation & Audit Boundary", () => {
  const originalEnv = { ...process.env };
  let auditEvents: ContextAuditRecord[] = [];
  let removeListener: (() => void) | null = null;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.DASHBOARD_OPERATOR_USER_IDS = "user_operator_123,allowed_admin";
    auditEvents = [];
    removeListener = ContextService.addAuditListener((rec) => {
      auditEvents.push(rec);
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    if (removeListener) {
      removeListener();
      removeListener = null;
    }
  });

  const mockSearchResult = [
    {
      indexId: "idx-1",
      domain: "strategy",
      subdomain: "acquisition",
      summary: "Acquisition Framework",
      priority: 1,
      isPrimary: true,
      routingKeywords: ["diligence"],
      resource: {
        resourceId: "res-1",
        resourceKey: "res-strategy",
        canonicalResourceKey: "canonical-strategy",
        title: "Strategy",
        resourceType: "DOC",
        purpose: null,
        accessMode: null,
        sourcePageUrl: null,
        locations: [],
      },
    },
  ];

  describe("Operator Caller", () => {
    it("allows authorized dashboard operator and records audit event", async () => {
      const repoSpy = vi
        .spyOn(ContextRepository, "searchContext")
        .mockResolvedValueOnce(mockSearchResult);

      const results = await ContextService.search(
        {
          domain: "strategy",
          subdomain: "acquisition",
          keywords: ["diligence"],
          limit: 3,
        },
        {
          type: "operator",
          userId: "user_operator_123",
        },
      );

      expect(results).toEqual(mockSearchResult);
      expect(repoSpy).toHaveBeenCalledWith({
        domain: "strategy",
        subdomain: "acquisition",
        keywords: ["diligence"],
        limit: 3,
      });

      expect(auditEvents.length).toBe(1);
      expect(auditEvents[0]).toMatchObject({
        actorType: "operator",
        actorId: "user_operator_123",
        action: "context.read",
        resource: "domain:strategy",
        domain: "strategy",
        subdomain: "acquisition",
        decision: "allow",
        resultCount: 1,
      });

      repoSpy.mockRestore();
    });

    it("blocks unauthorized operator and records denied audit event without calling repository", async () => {
      const repoSpy = vi.spyOn(ContextRepository, "searchContext");

      await expect(
        ContextService.search(
          { domain: "strategy" },
          { type: "operator", userId: "unauthorized_user" },
        ),
      ).rejects.toThrow(ContextAuthorizationError);

      expect(repoSpy).not.toHaveBeenCalled();

      expect(auditEvents.length).toBe(1);
      expect(auditEvents[0]).toMatchObject({
        actorType: "operator",
        actorId: "unauthorized_user",
        decision: "deny",
        reason: expect.stringContaining("Operator not in authorized allowlist"),
      });

      repoSpy.mockRestore();
    });
  });

  describe("Agent Caller", () => {
    const validAgentContext: AuthenticatedContext = {
      authenticated: true,
      principal: {
        id: "agent_strat_01",
        key: "agent_key",
        displayName: "Strategy Agent",
        principalType: "agent",
      },
      credential: {
        id: "cred_01",
        keyId: "key_01",
        description: "Prod Key",
        lastRotatedAt: null,
        expiresAt: null,
      },
      principalGrants: [
        {
          grantId: "grant_01",
          action: "context.read",
          resourceType: "SECOND_BRAIN_DOMAIN",
          resourceKey: "domain:strategy",
          effect: "ALLOW",
          constraints: {
            domains: ["strategy"],
          },
          expiresAt: null,
        },
      ],
      credentialScopes: [
        {
          scopeId: "scope_01",
          action: "context.read",
          resourceType: "SECOND_BRAIN_DOMAIN",
          resourceKey: "*",
          effect: "ALLOW",
          constraints: null,
          expiresAt: null,
        },
      ],
    };

    it("allows authorized agent matching domain grant and logs audit", async () => {
      const repoSpy = vi
        .spyOn(ContextRepository, "searchContext")
        .mockResolvedValueOnce(mockSearchResult);

      const results = await ContextService.search(
        { domain: "strategy" },
        { type: "agent", authContext: validAgentContext },
      );

      expect(results).toHaveLength(1);
      expect(repoSpy).toHaveBeenCalled();

      expect(auditEvents.length).toBe(1);
      expect(auditEvents[0]).toMatchObject({
        actorType: "agent",
        actorId: "agent_strat_01",
        decision: "allow",
      });

      repoSpy.mockRestore();
    });

    it("blocks agent when domain is not in grants without calling repository", async () => {
      const repoSpy = vi.spyOn(ContextRepository, "searchContext");

      await expect(
        ContextService.search(
          { domain: "finance" },
          { type: "agent", authContext: validAgentContext },
        ),
      ).rejects.toThrow(ContextAuthorizationError);

      expect(repoSpy).not.toHaveBeenCalled();

      expect(auditEvents.length).toBe(1);
      expect(auditEvents[0]).toMatchObject({
        actorType: "agent",
        actorId: "agent_strat_01",
        decision: "deny",
      });

      repoSpy.mockRestore();
    });
  });

  describe("Validation & Business Rules", () => {
    it("validates domain presence and format", async () => {
      await expect(
        ContextService.search({ domain: "" }, { type: "operator", userId: "user_operator_123" }),
      ).rejects.toThrow(ContextValidationError);

      await expect(
        ContextService.search(
          { domain: "bad domain with spaces!" },
          { type: "operator", userId: "user_operator_123" },
        ),
      ).rejects.toThrow(ContextValidationError);
    });

    it("caps limit to maximum of 10", async () => {
      const repoSpy = vi.spyOn(ContextRepository, "searchContext").mockResolvedValueOnce([]);

      await ContextService.search(
        { domain: "strategy", limit: 50 },
        { type: "operator", userId: "user_operator_123" },
      );

      expect(repoSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
        }),
      );

      repoSpy.mockRestore();
    });
  });
});
