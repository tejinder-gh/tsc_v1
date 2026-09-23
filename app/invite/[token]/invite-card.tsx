"use client";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  RefreshCw,
  Shield,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { TeamInvitation } from "@/lib/team/store";
import { redeemInvitationAction } from "@/app/dashboard/team/actions";

interface InviteCardProps {
  invitation: TeamInvitation;
}

export function InviteCard({ invitation }: InviteCardProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAccept = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        await redeemInvitationAction(invitation.token, name);
        router.push("/dashboard");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      }
    });
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "admin":
        return "Complete administrative control over all clients, automations, team invitations, and IAM credentials.";
      case "operator":
        return "Standard operator access: configure client flows, execute manual feature triggers, and monitor systems.";
      case "reviewer":
        return "Reviewer access: inspect and approve AI-drafted messages in the human-in-the-loop review queue.";
      default:
        return "Access to TheSkillCorner Operator Command Center.";
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl max-w-lg w-full space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md shadow-blue-500/20">
          TSC
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Sparkles size={12} className="text-blue-500" />
          <span>Operator Workspace Invitation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Join TheSkillCorner
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          You have been invited by{" "}
          <span className="font-semibold text-slate-800">{invitation.invitedBy}</span> to join the
          operator team.
        </p>
      </div>

      {/* Invitation Details Summary */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200/80">
          <span className="font-medium text-slate-500">Invited Email</span>
          <span className="font-semibold font-mono text-slate-900">{invitation.email}</span>
        </div>
        <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200/80">
          <span className="font-medium text-slate-500">Assigned Privilege</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 capitalize">
            <Shield size={12} />
            <span>{invitation.role}</span>
          </span>
        </div>
        <div className="text-xs text-slate-600 leading-relaxed pt-1">
          {getRoleDescription(invitation.role)}
        </div>
      </div>

      {/* Accept Form */}
      <form onSubmit={handleAccept} className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="member-name"
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
          >
            Your Full Name (Optional)
          </label>
          <input
            id="member-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sarah Jenkins"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle size={14} className="text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          {isPending ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Activating Account...</span>
            </>
          ) : (
            <>
              <span>Accept Invitation & Enter Dashboard</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <Lock size={11} />
          <span>Encrypted single-use authorization token</span>
        </p>
      </div>
    </div>
  );
}
