import { ClerkProvider, SignIn } from "@clerk/nextjs";
import { ArrowRight, Lock, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Operator Sign In | TheSkillCorner",
};

export default function SignInPage() {
  const hasClerk = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
  );

  if (hasClerk) {
    return (
      <ClerkProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
          <div className="mb-6 flex items-center gap-2 font-semibold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              TSC
            </div>
            <span className="text-slate-900">TheSkillCorner Workspace</span>
          </div>
          <SignIn routing="path" path="/sign-in" />
        </div>
      </ClerkProvider>
    );
  }

  // Graceful local development / self-hosted operator access
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl max-w-md w-full text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md shadow-blue-500/20">
          TSC
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Dev Environment Session</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Operator Access Portal
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            Clerk API credentials are unconfigured in local development. One-click dev operator mode
            is enabled for zero-friction access.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span>Privilege Level</span>
            <span className="font-semibold text-slate-800">Super Administrator</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>Workspace</span>
            <span className="font-mono text-slate-800">theskillcorner:local</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>Identity</span>
            <span className="font-mono text-slate-800">operator@local</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/dashboard"
            className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Enter Operator Dashboard</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/"
            className="block text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            Back to Public Website
          </Link>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] text-slate-400">
          <Shield size={12} className="text-emerald-500" />
          <span>Production uses Clerk enterprise SSO & MFA</span>
        </div>
      </div>
    </div>
  );
}
