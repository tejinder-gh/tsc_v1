"use client";

import { RotateCcw, SearchX } from "lucide-react";

export interface ZeroResultsStateProps {
  onReset: () => void;
  query?: string;
}

export function ZeroResultsState({ onReset, query }: ZeroResultsStateProps) {
  return (
    <div className="text-center py-16 px-4 bg-white rounded-[8px] border border-dashed border-[var(--tsc-line-strong)] font-geist">
      <div className="w-12 h-12 rounded-full bg-[var(--tsc-surface)] flex items-center justify-center mx-auto mb-4 text-[var(--tsc-muted)]">
        <SearchX className="w-6 h-6" strokeWidth={1.7} />
      </div>
      <h3 className="font-geist font-bold text-lg text-[var(--tsc-ink)] mb-1">
        No matching offerings found
      </h3>
      <p className="text-sm text-[var(--tsc-muted)] max-w-md mx-auto mb-6">
        {query ? (
          <>
            We couldn&apos;t find any services or automations matching{" "}
            <span className="font-semibold text-[var(--tsc-ink)]">&ldquo;{query}&rdquo;</span>.
          </>
        ) : (
          "No offerings match the current filter criteria."
        )}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] bg-[var(--tsc-ink)] hover:opacity-90 text-[var(--tsc-paper)] text-xs font-medium transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.7} />
        <span>Reset Filters</span>
      </button>
    </div>
  );
}
