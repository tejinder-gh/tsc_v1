import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import type { ReactNode } from "react";
import { DashboardNav } from "./dashboard-nav";

// Clerk-gated, per-session route tree - never a candidate for static generation,
// and prerendering it at build time throws when Clerk env vars are unset.
export const dynamic = "force-dynamic";

// Clerk is scoped to this layout only - the root layout (app/layout.tsx) stays
// untouched so the marketing site ships zero Clerk JS.
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="flex min-h-screen w-full bg-slate-50 text-slate-900 font-sans">
          <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white p-6 hidden md:block">
            <div className="flex items-center gap-2 mb-8 font-semibold text-xl tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                TSC
              </div>
              <span className="bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Workspace
              </span>
            </div>
            <DashboardNav />
          </aside>
          <main id="main" tabIndex={-1} className="focus:outline-none flex-1 flex flex-col min-w-0">
            <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10">
              <h2 className="font-semibold text-slate-800">Operator Portal</h2>
              <UserButton />
            </header>
            <div className="flex-1 p-6 md:p-8 overflow-auto">{children}</div>
          </main>
        </div>
      </SignedIn>
    </ClerkProvider>
  );
}
