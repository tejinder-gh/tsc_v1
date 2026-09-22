"use client";

import { useMemo, useState } from "react";
import { getRecommendedOfferings } from "../data/registry";
import type { Offering, OfferingKind } from "../domain/types";
import { DiscoveryWizard } from "./DiscoveryWizard";
import { FilterBar } from "./FilterBar";
import { OfferingGrid } from "./OfferingGrid";
import { SearchBar } from "./SearchBar";
import { ZeroResultsState } from "./ZeroResultsState";

export interface LibraryClientProps {
  initialOfferings: readonly Offering[];
}

export function LibraryClient({ initialOfferings }: LibraryClientProps) {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedKind, setSelectedKind] = useState<OfferingKind | "all">("all");
  const [selectedDelivery, setSelectedDelivery] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [showAll, setShowAll] = useState(false);

  const hasActiveFilters =
    selectedGoal !== null ||
    selectedKind !== "all" ||
    selectedDelivery !== "all" ||
    searchQuery.trim().length > 0;

  // Counts for filter pills
  const counts = useMemo(() => {
    return {
      all: initialOfferings.length,
      automation: initialOfferings.filter((o) => o.kind === "automation").length,
      service: initialOfferings.filter((o) => o.kind === "service").length,
      newsletter: initialOfferings.filter((o) => o.kind === "newsletter").length,
    };
  }, [initialOfferings]);

  // Recommendations when a goal is selected
  const recommendations = useMemo(() => {
    if (!selectedGoal && !searchQuery) return [];
    return getRecommendedOfferings({
      goalId: selectedGoal || undefined,
      searchQuery: searchQuery || undefined,
      limit: 15,
    }).map((r) => ({
      offeringId: r.offering.id,
      reasonText: r.reasonText,
    }));
  }, [selectedGoal, searchQuery]);

  // Filtered offerings
  const filteredOfferings = useMemo(() => {
    return initialOfferings.filter((offering) => {
      // Kind filter
      if (selectedKind !== "all" && offering.kind !== selectedKind) {
        return false;
      }

      // Delivery format filter
      if (selectedDelivery !== "all" && offering.deliveryModel !== selectedDelivery) {
        return false;
      }

      // Goal shortcut filter
      if (selectedGoal && !offering.goals.includes(selectedGoal)) {
        return false;
      }

      // Search query filter
      if (searchQuery?.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesText =
          offering.title.toLowerCase().includes(q) ||
          offering.tagline.toLowerCase().includes(q) ||
          offering.shortDescription.toLowerCase().includes(q) ||
          offering.tags.some((t) => t.toLowerCase().includes(q)) ||
          offering.categories.some((c) => c.toLowerCase().includes(q));
        if (!matchesText) return false;
      }

      return true;
    });
  }, [initialOfferings, selectedKind, selectedDelivery, selectedGoal, searchQuery]);

  // Progressive disclosure: On clean initial load, present 6 curated highlights first
  const displayedOfferings = useMemo(() => {
    if (hasActiveFilters || showAll) {
      return filteredOfferings;
    }
    // Initial curated highlight: top 6 featured offerings
    const featured = initialOfferings.filter((o) => o.featured);
    return featured.length >= 6 ? featured.slice(0, 6) : initialOfferings.slice(0, 6);
  }, [hasActiveFilters, showAll, filteredOfferings, initialOfferings]);

  const handleResetFilters = () => {
    setSelectedGoal(null);
    setSelectedKind("all");
    setSelectedDelivery("all");
    setSearchQuery("");
    setShowAll(false);
  };

  const isShowingCuratedSubset = !hasActiveFilters && !showAll;

  return (
    <div className="space-y-8">
      {/* Interactive Discovery Wizard */}
      <DiscoveryWizard
        selectedGoal={selectedGoal}
        onSelectGoal={(goalId) => {
          setSelectedGoal(goalId);
          setShowAll(true);
        }}
      />

      {/* Search & Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              if (val.trim()) setShowAll(true);
            }}
            placeholder="Search by keywords, outcome, industry, or technology..."
          />
          <div className="text-xs text-muted font-medium self-end md:self-center">
            {isShowingCuratedSubset ? (
              <span>
                Showing{" "}
                <span className="font-semibold text-slate-800">{displayedOfferings.length}</span>{" "}
                curated highlights of{" "}
                <span className="font-semibold text-slate-800">{initialOfferings.length}</span>{" "}
                total
              </span>
            ) : (
              <span>
                Showing{" "}
                <span className="font-semibold text-slate-800">{filteredOfferings.length}</span> of{" "}
                <span className="font-semibold text-slate-800">{initialOfferings.length}</span>{" "}
                offerings
              </span>
            )}
          </div>
        </div>

        <FilterBar
          selectedKind={selectedKind}
          onSelectKind={(kind) => {
            setSelectedKind(kind);
            setShowAll(true);
          }}
          selectedDelivery={selectedDelivery}
          onSelectDelivery={(delivery) => {
            setSelectedDelivery(delivery);
            setShowAll(true);
          }}
          counts={counts}
        />
      </div>

      {/* Grid or Empty State */}
      {displayedOfferings.length > 0 ? (
        <div className="space-y-8">
          <OfferingGrid offerings={displayedOfferings} recommendations={recommendations} />

          {/* Progressive disclosure CTA when viewing initial curated highlights */}
          {isShowingCuratedSubset && (
            <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-white p-8 text-center space-y-3">
              <h3 className="text-base font-semibold text-slate-900">
                Looking for something specific?
              </h3>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                Explore all {initialOfferings.length} automations, advisory services, and industry
                monitors, or use the goal wizard and filters above to pinpoint exact capabilities.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                >
                  Explore All {initialOfferings.length} Offerings
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <ZeroResultsState query={searchQuery} onReset={handleResetFilters} />
      )}
    </div>
  );
}
