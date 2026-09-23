import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import type { ReactNode } from "react";
import { DashboardHeader } from "./dashboard-header";
import { DashboardNav } from "./dashboard-nav";

// Clerk-gated, per-session route tree - never a candidate for static generation,
// and prerendering it at build time throws when Clerk env vars are unset.
export const dynamic = "force-dynamic";

// Clerk is scoped to this layout only - the root layout (app/layout.tsx) stays
// untouched so the marketing site ships zero Clerk JS.
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const hasClerk = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
  );

  const dashboardShell = (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900 font-sans">
      <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white p-6 hidden md:block">
        <div className="flex items-center gap-2 mb-8 font-semibold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            TSC
          </div>
          <span className="bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Workspace
          </span>
        </div>
        <DashboardNav />
      </aside>
      <main id="main" tabIndex={-1} className="focus:outline-none flex-1 flex flex-col min-w-0">
        <DashboardHeader hasClerk={hasClerk} isDevMode={!hasClerk} />
        <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">{children}</div>
      </main>
    </div>
  );

  if (!hasClerk) {
    return dashboardShell;
  }

  return (
    <ClerkProvider>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>{dashboardShell}</SignedIn>
    </ClerkProvider>
  );
}
