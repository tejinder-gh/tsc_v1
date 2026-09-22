import { CheckCircle2, Layers, Sparkles, Workflow } from "lucide-react";
import { getAllOfferings } from "@/features/catalog/data/registry";
import { CatalogClient } from "./catalog-client";

export const metadata = {
  title: "Catalog Management | TheSkillCorner Workspace",
};

export default function CatalogManagementPage() {
  const offerings = getAllOfferings();

  const totalCount = offerings.length;
  const automationCount = offerings.filter((o) => o.kind === "automation").length;
  const serviceCount = offerings.filter((o) => o.kind === "service").length;
  const newsletterCount = offerings.filter((o) => o.kind === "newsletter").length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
          Catalog Management
        </h1>
        <p className="text-slate-500 text-sm">
          Unified control plane for all public offerings, automations, digital service pillars, and
          research products.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Offerings</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{totalCount}</p>
          <span className="text-xs text-slate-400">Canonical registry</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Automations</span>
            <Workflow className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{automationCount}</p>
          <span className="text-xs text-slate-400">Turnkey workflows</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Digital Services</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{serviceCount}</p>
          <span className="text-xs text-slate-400">Consultative pillars</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Newsletters &amp; Intel
            </span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{newsletterCount}</p>
          <span className="text-xs text-slate-400">Publications &amp; radars</span>
        </div>
      </div>

      {/* Catalog Table */}
      <CatalogClient offerings={offerings} />
    </div>
  );
}
