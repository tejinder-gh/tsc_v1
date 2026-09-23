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
      <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileNavOpen((prev) => !prev)}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-dashboard-drawer"
            aria-label={mobileNavOpen ? "Close dashboard navigation" : "Open dashboard navigation"}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Operator Command Center
            </h1>
            {isDevMode ? (
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[11px] font-mono font-medium text-amber-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Dev Session
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-mono font-medium text-emerald-800">
                <Shield size={12} className="text-emerald-600" />
                Clerk Verified
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasClerk ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-600 font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
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
          className="fixed inset-0 z-40 md:hidden flex"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white border-r border-slate-200 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-2 font-semibold text-lg tracking-tight">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  TSC
                </div>
                <span className="text-slate-900">Workspace</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close menu"
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
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
