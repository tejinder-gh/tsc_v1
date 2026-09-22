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

import { assertOperatorAuthenticated, assertValidClientId } from "./auth-guard";
import { getClientsWithFlows, toggleFlow } from "./flows/actions";

describe("Dashboard Server Action Authorization", () => {
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
});
