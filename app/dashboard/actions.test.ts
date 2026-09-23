import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock Clerk auth
let mockUserId: string | null = null;
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(async () => ({ userId: mockUserId })),
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { ContextRepository } from "../../lib/second-brain/repositories/ContextRepository";
import {
  getDashboardOverviewMetrics,
  triggerCatalogDiagnostic,
  triggerManualSchedulerTick,
  triggerSecondBrainContextSearch,
  triggerSimulatedInboundSms,
  triggerSimulatedLead,
} from "./actions";
import { assertOperatorAuthenticated, assertValidClientId } from "./auth-guard";
import { getClientsWithFlows, toggleFlow } from "./flows/actions";

describe("Dashboard Server Action Authorization & Workflows", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    mockUserId = null;
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.DASHBOARD_OPERATOR_USER_IDS = "user_operator_123,user_allowed";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  const setNodeEnv = (val: string) => {
    (process.env as Record<string, string | undefined>).NODE_ENV = val;
  };

  describe("assertOperatorAuthenticated (T-016 Allowlist & Dev Bypass)", () => {
    it("AC1: resolves userId when user is in DASHBOARD_OPERATOR_USER_IDS in production", async () => {
      setNodeEnv("production");
      process.env.DASHBOARD_OPERATOR_USER_IDS = "user_allowed,user_second";
      mockUserId = "user_allowed";

      const result = await assertOperatorAuthenticated();
      expect(result.userId).toBe("user_allowed");
    });

    it("AC2: rejects with Forbidden when Clerk user is not in allowlist in production", async () => {
      setNodeEnv("production");
      process.env.DASHBOARD_OPERATOR_USER_IDS = "user_allowed";
      mockUserId = "user_not_allowed";

      await expect(assertOperatorAuthenticated()).rejects.toThrow(/Forbidden|Unauthorized/);
    });

    it("AC3: rejects signed-in Clerk user when DASHBOARD_OPERATOR_USER_IDS is missing or blank", async () => {
      setNodeEnv("production");
      process.env.DASHBOARD_OPERATOR_USER_IDS = "   ";
      mockUserId = "user_allowed";

      await expect(assertOperatorAuthenticated()).rejects.toThrow(/Forbidden|Unauthorized/);
    });

    it("AC4: ALLOW_DEV_OPERATOR_AUTH=true returns dev_operator only in development with no Clerk user", async () => {
      // In development without Clerk user
      setNodeEnv("development");
      process.env.ALLOW_DEV_OPERATOR_AUTH = "true";
      mockUserId = null;

      const result = await assertOperatorAuthenticated();
      expect(result.userId).toBe("dev_operator");

      // In production without Clerk user, identical flag MUST reject
      setNodeEnv("production");
      await expect(assertOperatorAuthenticated()).rejects.toThrow(/Unauthorized/);
    });

    it("throws Unauthorized if no Clerk user and dev bypass is not active", async () => {
      setNodeEnv("development");
      process.env.ALLOW_DEV_OPERATOR_AUTH = "false";
      mockUserId = null;

      await expect(assertOperatorAuthenticated()).rejects.toThrow(/Unauthorized/);
    });
  });

  describe("assertValidClientId", () => {
    it("rejects path traversal attempts", () => {
      expect(() => assertValidClientId("../../etc/passwd")).toThrow(/Forbidden/);
      expect(() => assertValidClientId("client/subpath")).toThrow(/Forbidden/);
      expect(() => assertValidClientId("..\\windows\\path")).toThrow(/Forbidden/);
    });

    it("rejects unknown client IDs", () => {
      expect(() => assertValidClientId("unauthorized-client-999")).toThrow(/Forbidden/);
    });

    it("accepts known configured client IDs", () => {
      expect(assertValidClientId("radiance-salon")).toBe("radiance-salon");
      expect(assertValidClientId("brightsmile-dental")).toBe("brightsmile-dental");
    });
  });

  describe("Flow Actions Guard Enforcement (T-016 AC5)", () => {
    it("rejects getClientsWithFlows if unauthenticated", async () => {
      mockUserId = null;
      await expect(getClientsWithFlows()).rejects.toThrow(/Unauthorized/);
    });

    it("rejects getClientsWithFlows if authenticated but unallowlisted", async () => {
      mockUserId = "user_unallowlisted";
      process.env.DASHBOARD_OPERATOR_USER_IDS = "user_allowed";
      await expect(getClientsWithFlows()).rejects.toThrow(/Forbidden/);
    });

    it("allows getClientsWithFlows if authenticated and allowlisted", async () => {
      mockUserId = "user_operator_123";
      const clients = await getClientsWithFlows();
      expect(clients.length).toBeGreaterThan(0);
      expect(clients[0]).toHaveProperty("id");
      expect(clients[0]).toHaveProperty("name");
    });

    it("rejects toggleFlow if unauthenticated", async () => {
      mockUserId = null;
      await expect(toggleFlow("radiance-salon", "appointment-reminder", false)).rejects.toThrow(
        /Unauthorized/,
      );
    });

    it("AC5: rejects toggleFlow if authenticated but unallowlisted", async () => {
      mockUserId = "user_not_allowed";
      process.env.DASHBOARD_OPERATOR_USER_IDS = "user_allowed";
      await expect(toggleFlow("radiance-salon", "reminders", false)).rejects.toThrow(/Forbidden/);
    });

    it("rejects toggleFlow with invalid client even if authenticated and allowlisted", async () => {
      mockUserId = "user_operator_123";
      await expect(toggleFlow("../../malicious", "reminders", false)).rejects.toThrow(/Forbidden/);
    });

    it("rejects toggleFlow with unknown automation ID for known client", async () => {
      mockUserId = "user_operator_123";
      await expect(toggleFlow("radiance-salon", "unknown-flow", false)).rejects.toThrow(
        /Unknown automation ID/,
      );
    });

    it("AC5: succeeds toggleFlow with valid client, valid automation ID, and allowlisted user", async () => {
      mockUserId = "user_operator_123";
      await expect(toggleFlow("radiance-salon", "reminders", false)).resolves.not.toThrow();
    });
  });

  describe("Dashboard Metrics Matrix Aggregation", () => {
    it("rejects unauthenticated requests to getDashboardOverviewMetrics", async () => {
      mockUserId = null;
      await expect(getDashboardOverviewMetrics()).rejects.toThrow(/Unauthorized/);
    });

    it("rejects authenticated but unallowlisted requests to getDashboardOverviewMetrics", async () => {
      mockUserId = "user_not_allowed";
      process.env.DASHBOARD_OPERATOR_USER_IDS = "user_allowed";
      await expect(getDashboardOverviewMetrics()).rejects.toThrow(/Forbidden/);
    });

    it("returns comprehensive metrics when operator is authenticated and allowlisted", async () => {
      mockUserId = "user_operator_123";
      const metrics = await getDashboardOverviewMetrics();

      expect(metrics.clients.length).toBeGreaterThan(0);
      expect(metrics.summary.totalClients).toBe(metrics.clients.length);
      expect(metrics.summary.totalOfferings).toBe(34);
      expect(metrics.summary.offeringsBreakdown.automations).toBe(18);
      expect(metrics.summary.offeringsBreakdown.services).toBe(13);
      expect(metrics.summary.offeringsBreakdown.newsletters).toBe(3);
      expect(metrics.summary.registeredInternalEndpoints).toBeGreaterThan(0);
      expect(metrics.subsystems.length).toBe(5);

      // T-020 AC2 & AC5: Subsystems must reflect configuration/registered/unverified state, never false operational health
      const validStates = ["configured", "registered", "unverified", "unavailable"];
      for (const sub of metrics.subsystems) {
        expect(validStates).toContain(sub.status);
        expect(sub.status).not.toBe("operational");
        expect(sub.status).not.toBe("active");
        expect(sub.lastTelemetry).not.toMatch(/Ready for live customer inquiries/i);
      }
    });
  });

  describe("Manual Feature Workflow Triggers", () => {
    describe("triggerManualSchedulerTick", () => {
      it("rejects unauthenticated calls", async () => {
        mockUserId = null;
        await expect(triggerManualSchedulerTick()).rejects.toThrow(/Unauthorized/);
      });

      it("executes scheduler tick and returns execution telemetry", async () => {
        mockUserId = "user_operator_123";
        const result = await triggerManualSchedulerTick("radiance-salon");
        expect(result.ok).toBe(true);
        expect(result.durationMs).toBeGreaterThanOrEqual(0);
        expect(result.results.length).toBe(1);
        expect(result.results[0].clientId).toBe("radiance-salon");
      });
    });

    describe("triggerSimulatedInboundSms", () => {
      it("rejects unauthenticated calls", async () => {
        mockUserId = null;
        await expect(
          triggerSimulatedInboundSms({
            clientId: "brightsmile-dental",
            fromPhone: "+14165550114",
            messageBody: "CONFIRM",
          }),
        ).rejects.toThrow(/Unauthorized/);
      });

      it("processes simulated inbound SMS message and returns classification", async () => {
        mockUserId = "user_operator_123";
        const result = await triggerSimulatedInboundSms({
          clientId: "brightsmile-dental",
          fromPhone: "+14165550114",
          messageBody: "CONFIRM",
        });

        expect(result.ok).toBe(true);
        expect(result.clientId).toBe("brightsmile-dental");
        expect(result.intent).toBe("confirm");
        expect(result.confidence).toBe(1);
        expect(result.disposition).toBeTruthy();
      });

      it("handles opt-out STOP simulation correctly", async () => {
        mockUserId = "user_operator_123";
        const result = await triggerSimulatedInboundSms({
          clientId: "radiance-salon",
          fromPhone: "+14165550114",
          messageBody: "STOP",
        });

        expect(result.ok).toBe(true);
        expect(result.intent).toBe("opt_out");
        expect(result.disposition).toContain("Opted Out");
      });
    });

    describe("triggerSimulatedLead", () => {
      it("rejects unauthenticated calls", async () => {
        mockUserId = null;
        await expect(
          triggerSimulatedLead({
            name: "Test",
            email: "test@example.com",
          }),
        ).rejects.toThrow(/Unauthorized/);
      });

      it("AC1 & AC2: handles legitimate lead capture as simulation with delivered: false and no external dispatch", async () => {
        mockUserId = "user_operator_123";
        const fetchSpy = vi.spyOn(globalThis, "fetch");

        const result = await triggerSimulatedLead({
          name: "Dr. Jane Smith",
          email: "jane@clinic.ca",
          company: "Smith Practice",
        });

        expect(result.ok).toBe(true);
        expect(result.delivered).toBe(false);
        expect(result.status).toBe("simulated");
        expect(result.simulation).toBe(true);
        expect(result.status).not.toBe("delivered");
        expect(result.message).not.toMatch(/queued for webhook delivery/i);
        expect(result.message).toMatch(/simulation/i);
        expect(fetchSpy).not.toHaveBeenCalled();

        fetchSpy.mockRestore();
      });

      it("silently drops honeypot spam bot submissions with delivered: false", async () => {
        mockUserId = "user_operator_123";
        const result = await triggerSimulatedLead({
          name: "Spam Bot",
          email: "bot@spam.com",
          isHoneypot: true,
        });

        expect(result.ok).toBe(true);
        expect(result.delivered).toBe(false);
        expect(result.status).toBe("dropped");
        expect(result.simulation).toBe(true);
      });
    });

    describe("triggerSecondBrainContextSearch", () => {
      it("rejects unauthenticated calls", async () => {
        mockUserId = null;
        await expect(
          triggerSecondBrainContextSearch({
            domain: "strategy",
          }),
        ).rejects.toThrow(/Unauthorized/);
      });

      it("executes context search when repository succeeds", async () => {
        mockUserId = "user_operator_123";
        const searchSpy = vi.spyOn(ContextRepository, "searchContext").mockResolvedValueOnce([
          {
            indexId: "ctx-1",
            domain: "strategy",
            subdomain: "acquisition",
            summary: "Acquisition Strategy",
            priority: 1,
            isPrimary: true,
            routingKeywords: ["diligence"],
            resource: {
              resourceId: "res-1",
              resourceKey: "res-strategy",
              canonicalResourceKey: "canonical-strategy",
              title: "Strategy Document",
              resourceType: "DOC",
              purpose: null,
              accessMode: null,
              sourcePageUrl: null,
              locations: [],
            },
          },
        ]);

        const result = await triggerSecondBrainContextSearch({
          domain: "strategy",
          subdomain: "acquisition",
          keywords: ["diligence"],
        });

        expect(result.ok).toBe(true);
        expect(result.status).toBe("operational");
        expect(result.source).toBe("database");
        expect(result.resultCount).toBe(1);

        searchSpy.mockRestore();
      });

      it("AC3: handles context repository failure with ok: false, safe message, and no dbError", async () => {
        mockUserId = "user_operator_123";
        const searchSpy = vi
          .spyOn(ContextRepository, "searchContext")
          .mockRejectedValueOnce(
            new Error(
              "FATAL: connection to server at secret-neon-host.internal failed: password authentication failed",
            ),
          );

        const result = await triggerSecondBrainContextSearch({
          domain: "strategy",
          subdomain: "acquisition",
          keywords: ["diligence"],
        });

        expect(result.ok).toBe(false);
        expect(result.status).toBe("unavailable");
        expect(result.source).toBe("unavailable");
        expect(result.message).toBe(
          "Second Brain database context search is currently unavailable.",
        );
        expect(result).not.toHaveProperty("dbError");
        expect(result).not.toHaveProperty("registeredRoutes");
        expect(JSON.stringify(result)).not.toContain("secret-neon-host");
        expect(JSON.stringify(result)).not.toContain("password authentication failed");

        searchSpy.mockRestore();
      });
    });

    describe("triggerCatalogDiagnostic", () => {
      it("rejects unauthenticated calls", async () => {
        mockUserId = null;
        await expect(triggerCatalogDiagnostic()).rejects.toThrow(/Unauthorized/);
      });

      it("validates all 34 canonical catalog entities and confirms 100% invariants", async () => {
        mockUserId = "user_operator_123";
        const result = await triggerCatalogDiagnostic();

        expect(result.ok).toBe(true);
        expect(result.totalOfferings).toBe(34);
        expect(result.countsByKind.automation).toBe(18);
        expect(result.countsByKind.service).toBe(13);
        expect(result.countsByKind.newsletter).toBe(3);
        expect(result.issues).toEqual([]);
      });
    });
  });
});
