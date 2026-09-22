"use client";

import { RotateCcw, SearchX } from "lucide-react";

export interface ZeroResultsStateProps {
  onReset: () => void;
  query?: string;
}

export function ZeroResultsState({ onReset, query }: ZeroResultsStateProps) {
  return (
    <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-200">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
        <SearchX className="w-6 h-6" strokeWidth={1.5} />
      </div>
      <h3 className="font-display font-semibold text-lg text-navy mb-1">
        No matching offerings found
      </h3>
      <p className="text-sm text-slate max-w-md mx-auto mb-6">
        {query ? (
          <>
            We couldn't find any services or automations matching{" "}
            <span className="font-semibold text-slate-800">"{query}"</span>.
          </>
        ) : (
          "No offerings match the current filter criteria."
        )}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-navy hover:bg-blue text-white text-xs font-semibold transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset Filters</span>
      </button>
    </div>
  );
}
