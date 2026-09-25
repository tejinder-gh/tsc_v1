import { ArrowRight, Calendar, FileText, Newspaper, Users } from "lucide-react";
import Link from "next/link";
import { getAllNewsletters } from "@/features/newsletters/data/newsletters";

export const metadata = {
  title: "Newsletter Operations | TheSkillCorner Workspace",
};

export default function DashboardNewslettersPage() {
  const newsletters = getAllNewsletters();

  const totalSubscribers = newsletters.reduce((acc, n) => acc + n.subscriberCount, 0);
  const totalIssues = newsletters.reduce((acc, n) => acc + n.issues.length, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
            Newsletters &amp; Intelligence Radars
          </h1>
          <p className="text-slate-500 text-sm">
            Operational control plane for AI-assisted publication, scheduled generation, and
            editorial issue approval.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Publications</span>
            <Newspaper className="w-4 h-4 text-[var(--tsc-ink)]" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{newsletters.length}</p>
          <span className="text-xs text-slate-400">Active automated radars</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Subscribers (Sample)
            </span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{totalSubscribers}</p>
          <span className="text-xs text-amber-600 font-medium">
            Sample telemetry · DB unapplied
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Curated Editions</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{totalIssues}</p>
          <span className="text-xs text-slate-400">Sample issue archives</span>
        </div>
      </div>

      {/* Publications List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Active Publications</h2>

        <div className="grid grid-cols-1 gap-4">
          {newsletters.map((newsletter) => {
            const isAi = newsletter.generationMode === "ai";
            const isHybrid = newsletter.generationMode === "hybrid";

            return (
              <div
                key={newsletter.id}
                className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition-colors shadow-2xs"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-semibold text-lg text-slate-900">{newsletter.name}</h3>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isAi
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : isHybrid
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-[var(--tsc-surface)] text-[var(--tsc-ink)] border border-[var(--tsc-line)]"
                      }`}
                    >
                      {newsletter.generationMode.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400">• {newsletter.topic}</span>
                  </div>

                  <p className="text-xs text-slate-600 max-w-2xl">{newsletter.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <strong className="text-slate-700">{newsletter.subscriberCount}</strong>{" "}
                      subscribers (Sample)
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <strong className="text-slate-700">{newsletter.issues.length}</strong> sample
                      issues
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Cadence:{" "}
                      <strong className="text-slate-700 capitalize">
                        {newsletter.cadence} (Metadata)
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/newsletters/${newsletter.slug}`}
                    target="_blank"
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Public Page
                  </Link>
                  <Link
                    href={`/dashboard/newsletters/${newsletter.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[var(--tsc-action)] hover:opacity-90 rounded-lg transition-all shadow-xs"
                  >
                    <span>Manage Issues &amp; Drafts</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
