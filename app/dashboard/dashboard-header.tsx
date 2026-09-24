"use client";

import { UserButton } from "@clerk/nextjs";
import { Menu, Shield, X } from "lucide-react";
import { useState } from "react";
import { DashboardNav } from "./dashboard-nav";

interface DashboardHeaderProps {
  isDevMode?: boolean;
  hasClerk?: boolean;
}

export function DashboardHeader({ isDevMode = false, hasClerk = false }: DashboardHeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-[var(--tsc-line)] bg-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 font-geist">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileNavOpen((prev) => !prev)}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-dashboard-drawer"
            aria-label={mobileNavOpen ? "Close dashboard navigation" : "Open dashboard navigation"}
            className="md:hidden p-2 rounded-[6px] text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)] hover:bg-[var(--tsc-surface)] transition-colors cursor-pointer"
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-bold text-[var(--tsc-ink)] tracking-tight">
              Operator Command Center
            </h1>
            {isDevMode ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-[4px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] px-2.5 py-0.5 text-[11px] font-mono text-[var(--tsc-ink)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--tsc-signal)] ring-2 ring-[var(--tsc-line)]" />
                Dev Session
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-[4px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] px-2.5 py-0.5 text-[11px] font-mono text-[var(--tsc-positive)]">
                <Shield size={12} className="text-[var(--tsc-positive)]" />
                Clerk Verified
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasClerk ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <div className="flex items-center gap-2 text-xs text-[var(--tsc-muted)] font-mono bg-[var(--tsc-surface)] px-3 py-1.5 rounded-[4px] border border-[var(--tsc-line)]">
              <span className="w-2 h-2 rounded-full bg-[var(--tsc-signal)] ring-2 ring-[var(--tsc-line)]" />
              <span>operator@local</span>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Slide-Over Navigation Drawer */}
      {mobileNavOpen && (
        <div
          id="mobile-dashboard-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Dashboard Navigation"
          className="fixed inset-0 z-40 md:hidden flex font-geist"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white border-r border-[var(--tsc-line)] p-6 shadow-xl">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[var(--tsc-line)]">
              <div className="flex items-center gap-2.5 font-semibold text-sm tracking-[0.14em] uppercase text-[var(--tsc-ink)]">
                <div className="w-7 h-7 rounded-[4px] bg-[var(--tsc-ink)] flex items-center justify-center text-[var(--tsc-paper)] font-mono font-bold text-xs">
                  TSC
                </div>
                <span>Workspace</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close menu"
                className="p-1.5 rounded-[4px] text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)] hover:bg-[var(--tsc-surface)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <DashboardNav onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
