import type { ReactNode } from "react";
import Link from "next/link";
import { Inbox, LayoutDashboard, Workflow } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
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
        <nav className="space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <LayoutDashboard size={18} />
            <span className="font-medium text-sm">Overview</span>
          </Link>
          <Link
            href="/dashboard/drafts"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Inbox size={18} />
            <span className="font-medium text-sm">Drafts</span>
          </Link>
          <Link
            href="/dashboard/flows"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-700 transition-colors"
          >
            <Workflow size={18} />
            <span className="font-medium text-sm">Flows</span>
          </Link>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center px-6 sticky top-0 z-10">
          <h2 className="font-semibold text-slate-800">Operator Portal</h2>
        </header>
        <div className="flex-1 p-6 md:p-8 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
