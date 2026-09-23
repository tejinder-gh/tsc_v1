"use server";

import { revalidatePath } from "next/cache";
import { TeamRepository, type TeamRole } from "@/lib/team/store";
import { assertOperatorAuthenticated } from "../auth-guard";

export async function getTeamData() {
  const { userId } = await assertOperatorAuthenticated();
  const members = TeamRepository.getMembers();
  const invitations = TeamRepository.getInvitations();

  return {
    currentUserId: userId,
    members,
    invitations,
  };
}

export async function createTeamInvitation(formData: { email: string; role: TeamRole }) {
  const { userId } = await assertOperatorAuthenticated();

  if (!formData.email || !formData.email.includes("@")) {
    throw new Error("A valid email address is required to send an invitation");
  }

  const validRoles: TeamRole[] = ["admin", "operator", "reviewer"];
  if (!validRoles.includes(formData.role)) {
    throw new Error("Invalid role specified");
  }

  const invitation = TeamRepository.createInvitation({
    email: formData.email,
    role: formData.role,
    invitedBy: userId === "dev_operator" ? "Dev Operator (Local)" : "Workspace Administrator",
  });

  revalidatePath("/dashboard/team");

  return {
    ok: true,
    invitation,
    inviteUrl: `/invite/${invitation.token}`,
  };
}

export async function revokeTeamInvitation(invitationId: string) {
  await assertOperatorAuthenticated();

  if (!invitationId) {
    throw new Error("Invitation ID is required");
  }

  const success = TeamRepository.revokeInvitation(invitationId);
  if (!success) {
    throw new Error("Invitation not found");
  }

  revalidatePath("/dashboard/team");
  return { ok: true };
}

export async function redeemInvitationAction(token: string, name?: string) {
  if (!token) {
    throw new Error("Invitation token is required");
  }

  const result = TeamRepository.acceptInvitation(token, name);
  if (!result.success) {
    throw new Error(result.error || "Failed to redeem invitation");
  }

  revalidatePath("/dashboard/team");
  return { ok: true, member: result.member };
}
