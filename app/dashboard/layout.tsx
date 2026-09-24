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
    <div className="flex min-h-screen w-full bg-[var(--tsc-paper)] text-[var(--tsc-ink)] font-geist">
      <aside className="w-64 flex-shrink-0 border-r border-[var(--tsc-line)] bg-white p-6 hidden md:block">
        <div className="flex items-center gap-3 mb-8 font-semibold text-sm tracking-[0.14em] uppercase text-[var(--tsc-ink)]">
          <div className="w-7 h-7 rounded-[4px] bg-[var(--tsc-ink)] flex items-center justify-center text-[var(--tsc-paper)] font-mono font-bold text-xs">
            TSC
          </div>
          <span>Workspace</span>
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
