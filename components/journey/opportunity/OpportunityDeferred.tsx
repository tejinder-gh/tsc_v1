import {
  OPPORTUNITY_DEFINITIONS,
  type OpportunityId,
  STANDARDIZED_DEFERRED_REASON,
} from "@/lib/journey/opportunity-config";

interface OpportunityDeferredProps {
  opportunityId: OpportunityId;
}

export function OpportunityDeferred({ opportunityId }: OpportunityDeferredProps) {
  const definition = OPPORTUNITY_DEFINITIONS[opportunityId];

  if (!definition) return null;

  return (
    <div className="flex flex-col space-y-2">
      <div className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.14em] text-[var(--tsc-muted)] uppercase">
        LATER, IF IT EARNS ITS PLACE
      </div>
      <h3 className="text-base sm:text-lg font-medium text-[var(--tsc-ink)]/90 leading-snug">
        {definition.shortLabel}
      </h3>
      <p className="text-sm sm:text-[15px] leading-[1.5] text-[var(--tsc-muted)] max-w-[480px]">
        {STANDARDIZED_DEFERRED_REASON}
      </p>
    </div>
  );
}
