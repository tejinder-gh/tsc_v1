"use client";

import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Mail,
  Plus,
  RefreshCw,
  Shield,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import type { TeamInvitation, TeamMember, TeamRole } from "@/lib/team/store";
import { createTeamInvitation, revokeTeamInvitation } from "./actions";

interface TeamManagerProps {
  initialMembers: TeamMember[];
  initialInvitations: TeamInvitation[];
  currentUserId: string;
}

export function TeamManager({
  initialMembers,
  initialInvitations,
  currentUserId,
}: TeamManagerProps) {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [invitations, setInvitations] = useState<TeamInvitation[]>(initialInvitations);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("operator");
  const [isPending, startTransition] = useTransition();
  const [generatedInvite, setGeneratedInvite] = useState<{
    email: string;
    url: string;
    token: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setGeneratedInvite(null);

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    startTransition(async () => {
      try {
        const res = await createTeamInvitation({ email, role });
        if (res.ok && res.invitation) {
          const origin = typeof window !== "undefined" ? window.location.origin : "";
          const fullInviteUrl = `${origin}${res.inviteUrl}`;
          setGeneratedInvite({
            email: res.invitation.email,
            url: fullInviteUrl,
            token: res.invitation.token,
          });
          setInvitations((prev) => [res.invitation, ...prev]);
          setEmail("");
        }
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : String(err));
      }
    });
  };

  const handleRevoke = (id: string) => {
    startTransition(async () => {
      try {
        await revokeTeamInvitation(id);
        setInvitations((prev) =>
          prev.map((inv) => (inv.id === id ? { ...inv, status: "revoked" } : inv)),
        );
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : String(err));
      }
    });
  };

  const copyInviteLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Invite Member Section */}
      <section
        aria-labelledby="invite-section-heading"
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <UserPlus size={18} />
          </div>
          <div>
            <h2
              id="invite-section-heading"
              className="text-lg font-bold text-slate-900 tracking-tight"
            >
              Invite Operator or Collaborator
            </h2>
            <p className="text-xs text-slate-500">
              Generate a single-use tokenized invitation link to onboard team members to
              TheSkillCorner dashboard.
            </p>
          </div>
        </div>

        <form onSubmit={handleSendInvite} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-7">
              <label
                htmlFor="invite-email"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
              >
                Collaborator Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  id="invite-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="collaborator@enterprise.ca"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="invite-role"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
              >
                Assigned Role
              </label>
              <select
                id="invite-role"
                value={role}
                onChange={(e) => setRole(e.target.value as TeamRole)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="operator">Operator (Full Flows & Workflows)</option>
                <option value="admin">Administrator (Complete Workspace Access)</option>
                <option value="reviewer">Reviewer (AI Draft Review Queue Only)</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                {isPending ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <>
                    <Plus size={15} />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle size={14} className="text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {generatedInvite && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Invitation Generated for {generatedInvite.email}</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700">Valid for 7 Days</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Share this direct onboarding link with your collaborator. They can use it to view
                the workspace invitation and activate their account.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  readOnly
                  value={generatedInvite.url}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-emerald-300 bg-white text-xs font-mono text-slate-800 select-all"
                />
                <button
                  type="button"
                  onClick={() => copyInviteLink(generatedInvite.url)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copied ? "Copied" : "Copy Link"}</span>
                </button>
                <Link
                  href={`/invite/${generatedInvite.token}`}
                  target="_blank"
                  className="p-1.5 rounded-lg border border-emerald-300 hover:bg-emerald-100 text-emerald-800"
                  title="Preview invitation page"
                >
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          )}
        </form>
      </section>

      {/* Active Team Members Roster */}
      <section
        aria-labelledby="members-section-heading"
        className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Users size={18} />
            </div>
            <div>
              <h2
                id="members-section-heading"
                className="text-lg font-bold text-slate-900 tracking-tight"
              >
                Active Workspace Members
              </h2>
              <p className="text-xs text-slate-500">
                Authorized operators and administrators with access to TheSkillCorner dashboard.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {members.length} {members.length === 1 ? "Member" : "Members"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th scope="col" className="px-6 py-3.5">
                  Member
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Role
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Joined Date
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      <span>{m.name}</span>
                      {m.id === "mem_lead_operator" && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          Founder
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">{m.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        m.role === "admin"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : m.role === "operator"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      <Shield size={11} />
                      <span>{m.role}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">
                    {new Date(m.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Active</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Invitations History & Management */}
      <section
        aria-labelledby="invitations-section-heading"
        className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock size={18} />
            </div>
            <div>
              <h2
                id="invitations-section-heading"
                className="text-lg font-bold text-slate-900 tracking-tight"
              >
                Invitations & Onboarding Links
              </h2>
              <p className="text-xs text-slate-500">
                Pending and past invitations dispatched for dashboard access.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {invitations.length} Total
          </span>
        </div>

        {invitations.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-sm">
            <UserCheck size={28} className="mx-auto text-slate-400 mb-2" />
            <p>No invitations dispatched yet. Use the form above to generate an invitation link.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th scope="col" className="px-6 py-3.5">
                    Invited Email
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Expires
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invitations.map((inv) => {
                  const isExpired = new Date(inv.expiresAt).getTime() < Date.now();
                  const origin = typeof window !== "undefined" ? window.location.origin : "";
                  const inviteUrl = `${origin}/invite/${inv.token}`;

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{inv.email}</div>
                        <div className="text-[11px] text-slate-400">Invited by {inv.invitedBy}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                          {inv.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-500">
                        {new Date(inv.expiresAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {inv.status === "accepted" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                            <CheckCircle2 size={13} className="text-emerald-500" />
                            <span>Accepted</span>
                          </span>
                        ) : inv.status === "revoked" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                            <X size={13} />
                            <span>Revoked</span>
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                            <Clock size={13} className="text-amber-500" />
                            <span>Expired</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {inv.status === "pending" && !isExpired && (
                            <>
                              <button
                                type="button"
                                onClick={() => copyInviteLink(inviteUrl)}
                                className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-1"
                                title="Copy invitation link"
                              >
                                <Copy size={12} />
                                <span>Copy Link</span>
                              </button>
                              <Link
                                href={`/invite/${inv.token}`}
                                target="_blank"
                                className="p-1 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                title="Open invitation page"
                              >
                                <ExternalLink size={13} />
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleRevoke(inv.id)}
                                className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                                title="Revoke invitation"
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
