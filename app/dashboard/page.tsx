import {
  Activity,
  AlertCircle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  Layers,
  Library,
  MessageSquare,
  PlayCircle,
  RefreshCw,
  Shield,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { getDashboardOverviewMetrics } from "./actions";

export const metadata = {
  title: "Command Center & Metrics Matrix | TheSkillCorner Operator",
};

export default async function DashboardRootPage() {
  const metrics = await getDashboardOverviewMetrics();
  const { summary, clients, subsystems } = metrics;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Masthead Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              Configuration Overview
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Rendered: {new Date(metrics.lastUpdated).toLocaleTimeString()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Executive Command Center
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            System configuration overview, client automation recipe matrix, pending
            human-in-the-loop review queues, and manual execution triggers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/workflows"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--tsc-action)] text-white font-medium text-sm hover:opacity-90 shadow-sm transition-all"
          >
            <PlayCircle size={16} />
            <span>Workflow Triggers</span>
          </Link>
          <Link
            href="/dashboard/drafts"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              summary.totalPendingDrafts > 0
                ? "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <MessageSquare size={16} />
            <span>Review Queue</span>
            {summary.totalPendingDrafts > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-xs font-bold font-mono">
                {summary.totalPendingDrafts}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* KPI Metrics Matrix Grid */}
      <section aria-labelledby="kpi-matrix-heading">
        <h2 id="kpi-matrix-heading" className="sr-only">
          Platform KPI Matrix
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Metric 1: Automations */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Configured Automations
              </span>
              <div className="p-2 rounded-lg bg-[var(--tsc-surface)] text-[var(--tsc-ink)] border border-[var(--tsc-line)]">
                <Workflow size={18} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono">
                  {summary.activeAutomations}
                </span>
                <span className="text-sm font-medium text-slate-500 font-mono">
                  / {summary.totalAutomations} Enabled
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Across {summary.totalClients} client workspaces ({summary.disabledAutomations}{" "}
                disabled)
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                <Clock size={13} />
                Scheduled (Unprobed)
              </span>
              <Link
                href="/dashboard/flows"
                className="text-[var(--tsc-ink)] hover:text-[var(--tsc-positive)] font-medium flex items-center gap-1"
              >
                <span>Flows</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Metric 2: Review Queue */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                AI Review Queue
              </span>
              <div
                className={`p-2 rounded-lg ${
                  summary.totalPendingDrafts > 0
                    ? "bg-amber-50 text-amber-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                <Bot size={18} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono">
                  {summary.totalPendingDrafts}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {summary.totalPendingDrafts === 1 ? "Draft Pending" : "Drafts Pending"}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Human-in-the-loop review before customer dispatch
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              {summary.totalPendingDrafts > 0 ? (
                <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                  <AlertCircle size={13} />
                  Action Required
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 size={13} />
                  Inbox Zero
                </span>
              )}
              <Link
                href="/dashboard/drafts"
                className="text-[var(--tsc-ink)] hover:text-[var(--tsc-positive)] font-medium flex items-center gap-1"
              >
                <span>Review</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Metric 3: Digital Catalog */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Catalog & Offerings
              </span>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Library size={18} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono">
                  {summary.totalOfferings}
                </span>
                <span className="text-xs font-medium text-slate-500">Entities</span>
              </div>
              <p className="text-xs text-slate-600">
                {summary.offeringsBreakdown.automations} Automations,{" "}
                {summary.offeringsBreakdown.services} Services,{" "}
                {summary.offeringsBreakdown.newsletters} Radars
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <Shield size={13} />
                100% Invariants
              </span>
              <Link
                href="/dashboard/catalog"
                className="text-[var(--tsc-ink)] hover:text-[var(--tsc-positive)] font-medium flex items-center gap-1"
              >
                <span>Catalog</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Metric 4: Second Brain Engine */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Second Brain OS
              </span>
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <Sparkles size={18} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono">
                  {summary.registeredInternalEndpoints}
                </span>
                <span className="text-xs font-medium text-slate-500">IAM Routes</span>
              </div>
              <p className="text-xs text-slate-600">
                Context RAG, Job Leases, Occurrences & Claim Manager
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                <Shield size={13} />
                Registry Configured
              </span>
              <Link
                href="/dashboard/workflows"
                className="text-[var(--tsc-ink)] hover:text-[var(--tsc-positive)] font-medium flex items-center gap-1"
              >
                <span>Test RAG</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Client Automation Health Matrix */}
      <section
        aria-labelledby="client-matrix-heading"
        className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2
              id="client-matrix-heading"
              className="text-lg font-bold text-slate-900 tracking-tight"
            >
              Client Automation Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Active automation recipes, quiet hours windows, and pending human review queues per
              workspace.
            </p>
          </div>
          <Link
            href="/dashboard/flows"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--tsc-ink)] hover:text-[var(--tsc-positive)]"
          >
            <span>Configure All Flows</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th scope="col" className="px-6 py-3.5">
                  Client Workspace
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Segment / Timezone
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Quiet Hours Window
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Active Recipes
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Review Queue
                </th>
                <th scope="col" className="px-6 py-3.5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{client.name}</div>
                    <div className="text-xs font-mono text-slate-400">{client.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                      {client.segment}
                    </span>
                    <div className="text-xs font-mono text-slate-500 mt-1">{client.timezone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-mono">
                      <Clock size={13} className="text-slate-400" />
                      <span>
                        {client.quietHours.start} – {client.quietHours.end}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Compliant suppression</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {client.automations.map((a) => (
                        <span
                          key={a.id}
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            a.enabled
                              ? "bg-[var(--tsc-surface)] text-[var(--tsc-ink)] border border-[var(--tsc-line)]"
                              : "bg-slate-100 text-slate-400 border border-slate-200 line-through"
                          }`}
                        >
                          {a.recipe}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {client.pendingDraftsCount > 0 ? (
                      <Link
                        href={`/dashboard/drafts?client=${client.id}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>{client.pendingDraftsCount} Drafts Pending</span>
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span>All Clear</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href="/dashboard/flows"
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        Configure
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Subsystem Capabilities & Registry Matrix */}
      <section aria-labelledby="subsystems-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="subsystems-heading" className="text-lg font-bold text-slate-900 tracking-tight">
              Platform Subsystems & Registry State
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Protocol specifications, runtime drivers, and configuration status of backend
              services.
            </p>
          </div>
          <Link
            href="/dashboard/workflows"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--tsc-ink)] hover:text-[var(--tsc-positive)]"
          >
            <span>Open Feature Trigger Console</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subsystems.map((sub) => {
            const workflowLinks: Record<string, { href: string; label: string }> = {
              scheduler: { href: "/dashboard/workflows?tab=scheduler", label: "Run Tick" },
              "inbound-sms": { href: "/dashboard/workflows?tab=inbound", label: "Simulate Inbound" },
              "lead-relay": { href: "/dashboard/workflows?tab=relay", label: "Test Relay" },
              "second-brain": { href: "/dashboard/workflows?tab=second-brain", label: "Test RAG" },
              "catalog-engine": { href: "/dashboard/catalog", label: "Manage" },
              observability: { href: "/dashboard/workflows?tab=observability", label: "Inspect" },
            };
            const link = workflowLinks[sub.id];

            return (
              <div
                key={sub.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-medium text-slate-500">
                      {sub.protocol}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                        sub.status === "configured"
                          ? "bg-slate-50 text-slate-700 border-slate-200"
                          : sub.status === "registered"
                            ? "bg-[var(--tsc-surface)] text-[var(--tsc-ink)] border-[var(--tsc-line-strong)]"
                            : sub.status === "unverified"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          sub.status === "configured"
                            ? "bg-slate-400"
                            : sub.status === "registered"
                              ? "bg-[var(--tsc-positive)]"
                              : sub.status === "unverified"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                        }`}
                      />
                      {sub.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{sub.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{sub.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                  {sub.lastTelemetry ? (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono truncate max-w-[65%]">
                      <Activity size={12} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{sub.lastTelemetry}</span>
                    </div>
                  ) : (
                    <div />
                  )}
                  {link && (
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-1 text-[var(--tsc-action)] hover:opacity-90 font-medium text-xs whitespace-nowrap ml-auto"
                    >
                      <span>{link.label}</span>
                      <ArrowRight size={11} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Manual Workflow Action Launcher */}
      <section
        aria-labelledby="quick-launcher-heading"
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20">
              <Zap size={13} className="text-[var(--tsc-signal)]" />
              Manual Feature Workflows
            </div>
            <h2
              id="quick-launcher-heading"
              className="text-xl sm:text-2xl font-bold tracking-tight text-white"
            >
              Execute & Inspect Features On-Demand
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Trigger scheduler cycles, simulate inbound Twilio customer SMS replies, run simulated
              lead intake, query Second Brain RAG knowledge, or run deep catalog diagnostics with
              execution telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/workflows"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-white/90 text-[var(--tsc-ink)] font-semibold text-sm transition-all flex items-center gap-2"
            >
              <PlayCircle size={16} />
              <span>Open Workflows Console</span>
            </Link>
            <Link
              href="/dashboard/catalog"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors border border-white/15"
            >
              Catalog Audit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
