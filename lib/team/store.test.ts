import { beforeEach, describe, expect, it } from "vitest";
import { TeamRepository } from "./store";

describe("TeamRepository and Invitation Workflow", () => {
  it("loads default team members including the lead operator", () => {
    const members = TeamRepository.getMembers();
    expect(members.length).toBeGreaterThanOrEqual(1);
    expect(members.some((m) => m.email === "tejinder@theskillcorner.com")).toBe(true);
  });

  it("creates a valid tokenized invitation with 7-day expiration", () => {
    const inv = TeamRepository.createInvitation({
      email: "engineer@enterprise.ca",
      role: "operator",
      invitedBy: "Tejinder Singh",
    });

    expect(inv.id).toBeTruthy();
    expect(inv.token).toHaveLength(48); // 24 bytes hex = 48 chars
    expect(inv.email).toBe("engineer@enterprise.ca");
    expect(inv.role).toBe("operator");
    expect(inv.status).toBe("pending");

    const expiresAtMs = new Date(inv.expiresAt).getTime();
    expect(expiresAtMs).toBeGreaterThan(Date.now() + 6 * 24 * 60 * 60 * 1000);
  });

  it("validates an active invitation token successfully", () => {
    const inv = TeamRepository.createInvitation({
      email: "reviewer@clinic.ca",
      role: "reviewer",
    });

    const validation = TeamRepository.validateInvitation(inv.token);
    expect(validation.valid).toBe(true);
    expect(validation.invitation?.email).toBe("reviewer@clinic.ca");
  });

  it("revokes an invitation and blocks redemption", () => {
    const inv = TeamRepository.createInvitation({
      email: "temp@partner.ca",
      role: "operator",
    });

    const revoked = TeamRepository.revokeInvitation(inv.id);
    expect(revoked).toBe(true);

    const validation = TeamRepository.validateInvitation(inv.token);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain("revoked");

    const accept = TeamRepository.acceptInvitation(inv.token, "Temp User");
    expect(accept.success).toBe(false);
  });

  it("accepts a valid invitation and registers the new team member", () => {
    const inv = TeamRepository.createInvitation({
      email: "new_operator@agency.ca",
      role: "operator",
    });

    const accept = TeamRepository.acceptInvitation(inv.token, "Alex Operator");
    expect(accept.success).toBe(true);
    expect(accept.member?.name).toBe("Alex Operator");
    expect(accept.member?.email).toBe("new_operator@agency.ca");
    expect(accept.member?.role).toBe("operator");

    // Token cannot be re-used
    const secondValidation = TeamRepository.validateInvitation(inv.token);
    expect(secondValidation.valid).toBe(false);
    expect(secondValidation.reason).toContain("already been accepted");

    // Member is in the roster
    const allMembers = TeamRepository.getMembers();
    expect(allMembers.some((m) => m.email === "new_operator@agency.ca")).toBe(true);
  });
});
