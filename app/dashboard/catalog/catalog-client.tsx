"use client";

import { ArrowUpRight, CheckCircle2, Filter, Layers, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Offering, OfferingKind } from "@/features/catalog/domain/types";

export function CatalogClient({ offerings }: { offerings: readonly Offering[] }) {
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<OfferingKind | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return offerings.filter((o) => {
      if (kindFilter !== "all" && o.kind !== kindFilter) return false;
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        return (
          o.title.toLowerCase().includes(q) ||
          o.slug.toLowerCase().includes(q) ||
          o.tagline.toLowerCase().includes(q) ||
          o.categories.some((c) => c.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [offerings, kindFilter, statusFilter, search]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search offerings by title, slug, category..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[var(--tsc-ink)] focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Kind:</span>
            <select
              value={kindFilter}
              onChange={(e) => setKindFilter(e.target.value as OfferingKind | "all")}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium text-xs focus:outline-none focus:border-[var(--tsc-ink)]"
            >
              <option value="all">All Kinds</option>
              <option value="automation">Automations</option>
              <option value="service">Digital Services</option>
              <option value="newsletter">Newsletters</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium text-xs focus:outline-none focus:border-[var(--tsc-ink)]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="beta">Beta</option>
              <option value="experimental">Experimental</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Offering</th>
                <th className="py-3.5 px-4">Kind &amp; Model</th>
                <th className="py-3.5 px-4">Pricing</th>
                <th className="py-3.5 px-4">Status / Visibility</th>
                <th className="py-3.5 px-4">Source</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{item.title}</div>
                    <div className="text-xs text-slate-400 line-clamp-1">{item.tagline}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium capitalize mb-1">
                      {item.kind}
                    </span>
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider">
                      {item.deliveryModel} · {item.automationLevel.replace("_", " ")}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-900 tabular-nums">
                      {item.priceDisplay}
                    </span>
                    <div className="text-[11px] text-slate-400 capitalize">{item.pricingModel}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.status === "active"
                            ? "bg-emerald-500"
                            : item.status === "beta"
                              ? "bg-amber-500"
                              : "bg-slate-400"
                        }`}
                      />
                      <span className="text-xs font-medium capitalize text-slate-800">
                        {item.status}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">
                      {item.visibility}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-slate-500 font-mono">{item.source}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={item.canonicalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--tsc-ink)] hover:text-[var(--tsc-positive)]"
                    >
                      <span>Public</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-sm">
            No offerings match your current filter query.
          </div>
        )}
      </div>
    </div>
  );
}
