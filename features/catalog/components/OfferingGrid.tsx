"use client";

import type { Offering } from "../domain/types";
import { OfferingCard } from "./OfferingCard";

export interface OfferingGridProps {
  offerings: readonly Offering[];
  recommendations?: { offeringId: string; reasonText?: string }[];
}

export function OfferingGrid({ offerings, recommendations }: OfferingGridProps) {
  const reasonMap = new Map<string, string | undefined>();
  if (recommendations) {
    for (const r of recommendations) {
      reasonMap.set(r.offeringId, r.reasonText);
    }
  }

  return (
    <div className="divide-y divide-[var(--tsc-line)] border-y border-[var(--tsc-line)]">
      {offerings.map((offering) => (
        <OfferingCard
          key={offering.id}
          offering={offering}
          reasonText={reasonMap.get(offering.id)}
        />
      ))}
    </div>
  );
}
