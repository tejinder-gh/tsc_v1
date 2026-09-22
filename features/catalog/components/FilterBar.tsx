"use client";

import type { OfferingKind } from "../domain/types";

export interface FilterBarProps {
  selectedKind: OfferingKind | "all";
  onSelectKind: (kind: OfferingKind | "all") => void;
  selectedDelivery: string;
  onSelectDelivery: (delivery: string) => void;
  counts: {
    all: number;
    automation: number;
    service: number;
    newsletter: number;
  };
}

export function FilterBar({
  selectedKind,
  onSelectKind,
  selectedDelivery,
  onSelectDelivery,
  counts,
}: FilterBarProps) {
  const kinds: { id: OfferingKind | "all"; label: string; count: number }[] = [
    { id: "all", label: "All Offerings", count: counts.all },
    { id: "automation", label: "Automations", count: counts.automation },
    { id: "service", label: "Digital Services", count: counts.service },
    { id: "newsletter", label: "Newsletters & Intelligence", count: counts.newsletter },
  ];

  const deliveryOptions = [
    { id: "all", label: "All Delivery Models" },
    { id: "automation", label: "Fully Automated" },
    { id: "ai", label: "AI Generated" },
    { id: "hybrid", label: "Human Verified / Hybrid" },
    { id: "human", label: "Expert Consultative" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 border-b border-line">
      {/* Offering Kind Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {kinds.map((k) => {
          const isActive = selectedKind === k.id;
          return (
            <button
              key={k.id}
              type="button"
              onClick={() => onSelectKind(k.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? "bg-navy text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {k.label}
              <span
                className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] tabular-nums ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {k.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Delivery filter dropdown */}
      <div className="flex items-center gap-2 text-xs">
        <label htmlFor="delivery-select" className="text-muted font-medium">
          Format:
        </label>
        <select
          id="delivery-select"
          value={selectedDelivery}
          onChange={(e) => onSelectDelivery(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-blue"
        >
          {deliveryOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
