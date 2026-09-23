import { ArrowLeft, Shield, Users } from "lucide-react";
import Link from "next/link";
import { getTeamData } from "./actions";
import { TeamManager } from "./team-manager";

export const metadata = {
  title: "Team & Invitations | TheSkillCorner Operator",
};

export default async function TeamPage() {
  const { currentUserId, members, invitations } = await getTeamData();

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back to Command Center</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Team Members & Dashboard Invitations
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Manage authorized operators, configure access roles (Admin, Operator, Reviewer), and
            generate secure single-use invitation links to onboard teammates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-800 border border-purple-200">
            <Shield size={13} className="text-purple-600" />
            <span>Role-Based Access Control</span>
          </span>
        </div>
      </div>

      {/* Main Team Manager */}
      <TeamManager
        initialMembers={members}
        initialInvitations={invitations}
        currentUserId={currentUserId}
      />
    </div>
  );
}
