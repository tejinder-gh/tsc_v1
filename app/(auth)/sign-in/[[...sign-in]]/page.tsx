import { ClerkProvider, SignIn } from "@clerk/nextjs";
import { ArrowRight, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

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
        <div className="min-h-screen bg-[var(--tsc-paper)] flex flex-col items-center justify-center p-4 font-geist">
          <div className="mb-6 flex items-center gap-3">
            <Image
              src="/logo-mark.svg"
              alt=""
              aria-hidden="true"
              width={24}
              height={24}
              className="h-6 w-6 opacity-95"
            />
            <span className="font-semibold text-sm tracking-[0.14em] uppercase text-[var(--tsc-ink)]">
              {site.name} Operator Shell
            </span>
          </div>
          <SignIn routing="path" path="/sign-in" />
        </div>
      </ClerkProvider>
    );
  }

  const isDevAllowed =
    process.env.NODE_ENV === "development" && process.env.ALLOW_DEV_OPERATOR_AUTH === "true";

  if (isDevAllowed) {
    // Graceful local development operator access ONLY in development with explicit opt-in
    return (
      <div className="min-h-screen bg-[var(--tsc-paper)] flex flex-col items-center justify-center p-4 sm:p-6 font-geist">
        <div className="bg-white border border-[var(--tsc-line)] rounded-[8px] p-8 sm:p-10 shadow-sm max-w-md w-full text-center space-y-6">
          <div className="w-12 h-12 rounded-[8px] bg-[var(--tsc-ink)] text-[var(--tsc-paper)] flex items-center justify-center font-mono font-bold text-base mx-auto">
            TSC
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-[4px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] font-mono text-[11px] text-[var(--tsc-ink)]">
              <span className="w-2 h-2 rounded-full bg-[var(--tsc-signal)] ring-2 ring-[var(--tsc-line)]" />
              <span>Dev Environment Session</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--tsc-ink)] tracking-tight">
              Operator Access Portal
            </h1>
            <p className="text-xs text-[var(--tsc-muted)] leading-relaxed max-w-xs mx-auto">
              Clerk API credentials are unconfigured in local development. One-click dev operator
              mode is enabled for zero-friction access.
            </p>
          </div>

          <div className="p-4 rounded-[6px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-left text-xs font-mono space-y-2">
            <div className="flex items-center justify-between text-[var(--tsc-muted)]">
              <span>Privilege Level</span>
              <span className="font-semibold text-[var(--tsc-ink)]">Super Administrator</span>
            </div>
            <div className="flex items-center justify-between text-[var(--tsc-muted)]">
              <span>Workspace</span>
              <span className="text-[var(--tsc-ink)]">theskillcorner:local</span>
            </div>
            <div className="flex items-center justify-between text-[var(--tsc-muted)]">
              <span>Identity</span>
              <span className="text-[var(--tsc-ink)]">operator@local</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/dashboard"
              className="w-full py-2.5 px-5 rounded-[6px] bg-[var(--tsc-ink)] hover:opacity-90 text-[var(--tsc-paper)] font-mono font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer select-none"
            >
              <span>Enter Operator Dashboard</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/"
              className="block text-xs font-mono text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)] transition-colors"
            >
              &larr; Back to Public Website
            </Link>
          </div>

          <div className="pt-3 border-t border-[var(--tsc-line)] flex items-center justify-center gap-1.5 text-[11px] font-mono text-[var(--tsc-muted)]">
            <Shield size={12} className="text-[var(--tsc-positive)]" />
            <span>Production uses Clerk enterprise SSO & MFA</span>
          </div>
        </div>
      </div>
    );
  }

  // In production or unapproved development when Clerk is unconfigured:
  // Show neutral operator access temporarily unavailable message without dashboard links or dev details
  return (
    <div className="min-h-screen bg-[var(--tsc-paper)] flex flex-col items-center justify-center p-4 sm:p-6 font-geist">
      <div className="bg-white border border-[var(--tsc-line)] rounded-[8px] p-8 sm:p-10 shadow-sm max-w-md w-full text-center space-y-6">
        <div className="w-12 h-12 rounded-[8px] bg-[var(--tsc-ink)] text-[var(--tsc-paper)] flex items-center justify-center font-mono font-bold text-base mx-auto">
          TSC
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--tsc-ink)] tracking-tight">
            Operator Access Unavailable
          </h1>
          <p className="text-xs text-[var(--tsc-muted)] leading-relaxed max-w-xs mx-auto">
            Operator access is temporarily unavailable because authentication services are not
            configured.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/"
            className="w-full py-2.5 px-5 rounded-[6px] bg-[var(--tsc-ink)] hover:opacity-90 text-[var(--tsc-paper)] font-mono font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer select-none"
          >
            <span>&larr; Back to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
