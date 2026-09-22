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
    { id: "all", label: "All Items", count: counts.all },
    { id: "automation", label: "Automations", count: counts.automation },
    { id: "service", label: "Digital Services", count: counts.service },
    { id: "newsletter", label: "Briefings", count: counts.newsletter },
  ];

  const deliveryOptions = [
    { id: "all", label: "All Delivery Models" },
    { id: "automation", label: "Fully Automated" },
    { id: "ai", label: "AI Generated" },
    { id: "hybrid", label: "Hybrid" },
    { id: "human", label: "Consultative" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 border-b border-[var(--tsc-line)] font-geist">
      {/* Offering Kind Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {kinds.map((k) => {
          const isActive = selectedKind === k.id;
          return (
            <button
              key={k.id}
              type="button"
              onClick={() => onSelectKind(k.id)}
              className={`px-3 py-1.5 rounded-[4px] text-xs font-mono transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-[var(--tsc-ink)] text-[var(--tsc-paper)]"
                  : "bg-[var(--tsc-surface)]/60 text-[var(--tsc-muted)] border border-[var(--tsc-line)] hover:text-[var(--tsc-ink)] hover:border-[var(--tsc-ink)]/30"
              }`}
            >
              <span>{k.label}</span>
              <span
                className={`text-[10px] tabular-nums ${
                  isActive ? "text-white/60" : "text-[var(--tsc-muted)]"
                }`}
              >
                ({k.count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Delivery Model Select */}
      <div className="flex items-center gap-2 text-xs font-mono text-[var(--tsc-muted)]">
        <label htmlFor="delivery-select" className="sr-only">
          Filter by delivery model
        </label>
        <select
          id="delivery-select"
          value={selectedDelivery}
          onChange={(e) => onSelectDelivery(e.target.value)}
          aria-label="Delivery model filter"
          className="bg-[var(--tsc-paper)] text-[var(--tsc-ink)] border border-[var(--tsc-line)] rounded-[4px] px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-[var(--tsc-ink)]"
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
