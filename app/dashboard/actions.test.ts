import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock Clerk auth
let mockUserId: string | null = null;
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(async () => ({ userId: mockUserId })),
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

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
  beforeEach(() => {
    mockUserId = null;
    vi.clearAllMocks();
  });

  describe("assertOperatorAuthenticated", () => {
    it("throws Unauthorized if no Clerk user is authenticated", async () => {
      mockUserId = null;
      await expect(assertOperatorAuthenticated()).rejects.toThrow(/Unauthorized/);
    });

    it("returns userId when user is authenticated", async () => {
      mockUserId = "user_operator_123";
      const result = await assertOperatorAuthenticated();
      expect(result.userId).toBe("user_operator_123");
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

  describe("Flow Actions Guard Enforcement", () => {
    it("rejects getClientsWithFlows if unauthenticated", async () => {
      mockUserId = null;
      await expect(getClientsWithFlows()).rejects.toThrow(/Unauthorized/);
    });

    it("allows getClientsWithFlows if authenticated", async () => {
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

    it("rejects toggleFlow with invalid client even if authenticated", async () => {
      mockUserId = "user_operator_123";
      await expect(toggleFlow("../../malicious", "reminders", false)).rejects.toThrow(/Forbidden/);
    });

    it("rejects toggleFlow with unknown automation ID for known client", async () => {
      mockUserId = "user_operator_123";
      await expect(toggleFlow("radiance-salon", "unknown-flow", false)).rejects.toThrow(
        /Unknown automation ID/,
      );
    });

    it("succeeds toggleFlow with valid client, valid automation ID, and authenticated user", async () => {
      mockUserId = "user_operator_123";
      await expect(toggleFlow("radiance-salon", "reminders", false)).resolves.not.toThrow();
    });
  });

  describe("Dashboard Metrics Matrix Aggregation", () => {
    it("rejects unauthenticated requests to getDashboardOverviewMetrics", async () => {
      mockUserId = null;
      await expect(getDashboardOverviewMetrics()).rejects.toThrow(/Unauthorized/);
    });

    it("returns comprehensive metrics when operator is authenticated", async () => {
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

      it("handles legitimate lead capture delivery simulation", async () => {
        mockUserId = "user_operator_123";
        const result = await triggerSimulatedLead({
          name: "Dr. Jane Smith",
          email: "jane@clinic.ca",
          company: "Smith Practice",
        });

        expect(result.ok).toBe(true);
        expect(result.delivered).toBe(true);
        expect(result.status).toBe("delivered");
      });

      it("silently drops honeypot spam bot submissions", async () => {
        mockUserId = "user_operator_123";
        const result = await triggerSimulatedLead({
          name: "Spam Bot",
          email: "bot@spam.com",
          isHoneypot: true,
        });

        expect(result.ok).toBe(true);
        expect(result.delivered).toBe(false);
        expect(result.status).toBe("dropped");
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

      it("executes context search or provides graceful registry fallback", async () => {
        mockUserId = "user_operator_123";
        const result = await triggerSecondBrainContextSearch({
          domain: "strategy",
          subdomain: "acquisition",
          keywords: ["diligence"],
        });

        expect(result.ok).toBe(true);
        expect(["database", "mock_registry_fallback"]).toContain(result.source);
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
