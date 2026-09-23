"use client";

import { Search, X } from "lucide-react";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search systems, automations, or briefing topics…",
}: SearchBarProps) {
  return (
    <div className="relative w-full max-w-lg font-geist">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--tsc-muted)]">
        <Search className="w-4 h-4" strokeWidth={1.5} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[var(--tsc-paper)] pl-9 pr-9 py-2 text-sm rounded-[6px] border border-[var(--tsc-line-strong)] text-[var(--tsc-ink)] placeholder-[var(--tsc-muted)] focus:outline-none focus:border-[var(--tsc-ink)] transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search query"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)]"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
