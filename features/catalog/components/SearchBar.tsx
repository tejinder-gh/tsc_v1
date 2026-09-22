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
  placeholder = "Search services, automations, or newsletter topics...",
}: SearchBarProps) {
  return (
    <div className="relative w-full max-w-lg">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
        <Search className="w-4 h-4" strokeWidth={1.7} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white pl-10 pr-9 py-2.5 text-sm rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue transition-colors shadow-2xs"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search query"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-slate-700"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
