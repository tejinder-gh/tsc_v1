import { ArrowLeft, PlayCircle, Shield } from "lucide-react";
import Link from "next/link";
import { getDashboardOverviewMetrics } from "../actions";
import { WorkflowConsole } from "./workflow-console";

export const metadata = {
  title: "Workflow Feature Triggers | TheSkillCorner Operator",
};

interface WorkflowsPageProps {
  searchParams?: Promise<{ tab?: string }>;
}

export default async function WorkflowsPage({ searchParams }: WorkflowsPageProps) {
  const [params, metrics] = await Promise.all([
    searchParams,
    getDashboardOverviewMetrics(),
  ]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back to Command Center</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manual Feature Workflows &amp; Trigger Console
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Execute and verify application capabilities on-demand with execution telemetry:
            scheduler tick, Twilio SMS inbound simulation, lead intake simulation, hardware SMS
            relay HMAC verification, Second Brain RAG &amp; IAM registry inspection, and catalog
            integrity audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Shield size={13} className="text-emerald-600" />
            <span>Operator Privileges Verified</span>
          </span>
        </div>
      </div>

      {/* Main Interactive Console */}
      <WorkflowConsole
        clients={metrics.clients}
        initialTab={params?.tab}
        telemetry={metrics.telemetry}
      />
    </div>
  );
}
