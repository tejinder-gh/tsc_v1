import { AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TeamRepository } from "@/lib/team/store";
import { InviteCard } from "./invite-card";

export const metadata = {
  title: "Accept Workspace Invitation | TheSkillCorner",
};

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const validation = TeamRepository.validateInvitation(token);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6">
      {validation.valid && validation.invitation ? (
        <InviteCard invitation={validation.invitation} />
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl max-w-md w-full text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Invalid or Expired Invitation
            </h1>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              {validation.reason ||
                "This invitation link could not be verified or has already been used."}
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors w-full"
            >
              <ArrowLeft size={16} />
              <span>Return to TheSkillCorner Home</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
