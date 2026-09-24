import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isRouteEligibleForReplay, startOpenReplayIfAllowed } from "../providers/openreplay";

describe("OpenReplay Deny-by-Default Route Protection", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SESSION_REPLAY_ENABLED;
    delete process.env.NEXT_PUBLIC_OPENREPLAY_PROJECT_KEY;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe("isRouteEligibleForReplay", () => {
    it("allows explicitly allowlisted public marketing routes", () => {
      expect(isRouteEligibleForReplay("/")).toBe(true);
      expect(isRouteEligibleForReplay("/about")).toBe(true);
      expect(isRouteEligibleForReplay("/how-it-works")).toBe(true);
      expect(isRouteEligibleForReplay("/results")).toBe(true);
      expect(isRouteEligibleForReplay("/book")).toBe(true);
      expect(isRouteEligibleForReplay("/contact")).toBe(true);
      expect(isRouteEligibleForReplay("/what-we-automate")).toBe(true);
      expect(isRouteEligibleForReplay("/what-we-automate/ai-receptionist")).toBe(true);
      expect(isRouteEligibleForReplay("/industries/dental-offices")).toBe(true);
    });

    it("strictly rejects operator dashboard routes", () => {
      expect(isRouteEligibleForReplay("/dashboard")).toBe(false);
      expect(isRouteEligibleForReplay("/dashboard/workflows")).toBe(false);
      expect(isRouteEligibleForReplay("/dashboard/drafts")).toBe(false);
      expect(isRouteEligibleForReplay("/dashboard/flows")).toBe(false);
    });

    it("strictly rejects authentication and internal routes", () => {
      expect(isRouteEligibleForReplay("/sign-in")).toBe(false);
      expect(isRouteEligibleForReplay("/login")).toBe(false);
      expect(isRouteEligibleForReplay("/api/lead")).toBe(false);
      expect(isRouteEligibleForReplay("/api/inbound")).toBe(false);
      expect(isRouteEligibleForReplay("/dev/components")).toBe(false);
    });

    it("denies unallowlisted arbitrary paths by default", () => {
      expect(isRouteEligibleForReplay("/secret-admin")).toBe(false);
      expect(isRouteEligibleForReplay("/unregistered-page")).toBe(false);
    });
  });

  describe("startOpenReplayIfAllowed", () => {
    it("returns false immediately on unallowlisted or operator routes even if enabled", async () => {
      process.env.NEXT_PUBLIC_SESSION_REPLAY_ENABLED = "true";
      process.env.NEXT_PUBLIC_OPENREPLAY_PROJECT_KEY = "test_project_key";

      const operatorResult = await startOpenReplayIfAllowed("/dashboard");
      expect(operatorResult).toBe(false);

      const authResult = await startOpenReplayIfAllowed("/sign-in");
      expect(authResult).toBe(false);
    });

    it("returns false when session replay is disabled", async () => {
      process.env.NEXT_PUBLIC_SESSION_REPLAY_ENABLED = "false";
      process.env.NEXT_PUBLIC_OPENREPLAY_PROJECT_KEY = "test_project_key";

      const result = await startOpenReplayIfAllowed("/");
      expect(result).toBe(false);
    });
  });
});
