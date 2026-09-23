/**
 * What: Team members and invitations store for TheSkillCorner dashboard.
 * Why: Allows operators to invite collaborators (admins, automation engineers, reviewers),
 *      track pending invitations with cryptographic tokens, and manage dashboard access.
 * How: Uses a file-backed JSON store in `.automations/team/invitations.json` with an in-memory
 *      fallback for clean testing and serverless compatibility.
 */

import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export type TeamRole = "admin" | "operator" | "reviewer";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  joinedAt: string;
  status: "active" | "suspended";
}

export interface TeamInvitation {
  id: string;
  email: string;
  role: TeamRole;
  invitedBy: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  status: "pending" | "accepted" | "revoked";
}

interface TeamStoreData {
  members: TeamMember[];
  invitations: TeamInvitation[];
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: "mem_lead_operator",
    name: "Tejinder Singh",
    email: "tejinder@theskillcorner.com",
    role: "admin",
    joinedAt: "2026-01-01T00:00:00.000Z",
    status: "active",
  },
  {
    id: "mem_dev_operator",
    name: "Local Dev Operator",
    email: "operator@local",
    role: "operator",
    joinedAt: "2026-06-01T00:00:00.000Z",
    status: "active",
  },
];

const STORE_PATH = ".automations/team/team-data.json";

function loadStoreData(): TeamStoreData {
  try {
    if (existsSync(STORE_PATH)) {
      const raw = readFileSync(STORE_PATH, "utf-8");
      return JSON.parse(raw);
    }
  } catch {
    // fallback to initial
  }

  return {
    members: DEFAULT_MEMBERS,
    invitations: [],
  };
}

function saveStoreData(data: TeamStoreData): void {
  try {
    mkdirSync(dirname(STORE_PATH), { recursive: true });
    writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // In environments with read-only filesystems, data remains in memory
  }
}

export class TeamRepository {
  public static getMembers(): TeamMember[] {
    const data = loadStoreData();
    return data.members;
  }

  public static getInvitations(): TeamInvitation[] {
    const data = loadStoreData();
    return data.invitations;
  }

  public static createInvitation(params: {
    email: string;
    role: TeamRole;
    invitedBy?: string;
  }): TeamInvitation {
    const data = loadStoreData();
    const normalizedEmail = params.email.trim().toLowerCase();

    // Invalidate any existing pending invitation for this email
    for (const inv of data.invitations) {
      if (inv.email.toLowerCase() === normalizedEmail && inv.status === "pending") {
        inv.status = "revoked";
      }
    }

    const token = randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    const invitation: TeamInvitation = {
      id: `inv_${Date.now()}_${randomBytes(4).toString("hex")}`,
      email: normalizedEmail,
      role: params.role,
      invitedBy: params.invitedBy || "Workspace Administrator",
      token,
      createdAt: new Date().toISOString(),
      expiresAt,
      status: "pending",
    };

    data.invitations.unshift(invitation);
    saveStoreData(data);
    return invitation;
  }

  public static revokeInvitation(invitationId: string): boolean {
    const data = loadStoreData();
    const inv = data.invitations.find((i) => i.id === invitationId);
    if (!inv) return false;

    inv.status = "revoked";
    saveStoreData(data);
    return true;
  }

  public static validateInvitation(token: string): {
    valid: boolean;
    reason?: string;
    invitation?: TeamInvitation;
  } {
    if (!token) {
      return { valid: false, reason: "Invitation token is required" };
    }

    const data = loadStoreData();
    const inv = data.invitations.find((i) => i.token === token);

    if (!inv) {
      return { valid: false, reason: "Invitation not found" };
    }

    if (inv.status === "revoked") {
      return { valid: false, reason: "This invitation has been revoked" };
    }

    if (inv.status === "accepted") {
      return { valid: false, reason: "This invitation has already been accepted" };
    }

    if (new Date(inv.expiresAt).getTime() < Date.now()) {
      return { valid: false, reason: "This invitation has expired" };
    }

    return { valid: true, invitation: inv };
  }

  public static acceptInvitation(
    token: string,
    name?: string,
  ): {
    success: boolean;
    member?: TeamMember;
    error?: string;
  } {
    const validation = TeamRepository.validateInvitation(token);
    if (!validation.valid || !validation.invitation) {
      return { success: false, error: validation.reason || "Invalid invitation" };
    }

    const data = loadStoreData();
    const inv = data.invitations.find((i) => i.token === token)!;
    inv.status = "accepted";

    const member: TeamMember = {
      id: `mem_${Date.now()}_${randomBytes(4).toString("hex")}`,
      name: name?.trim() || inv.email.split("@")[0],
      email: inv.email,
      role: inv.role,
      joinedAt: new Date().toISOString(),
      status: "active",
    };

    data.members.push(member);
    saveStoreData(data);

    return { success: true, member };
  }
}
