import {
  OPPORTUNITY_DEFINITIONS,
  type OpportunityId,
  SECONDARY_RELATION_COPY,
} from "@/lib/journey/opportunity-config";

interface OpportunitySecondaryProps {
  opportunityId: OpportunityId;
}

export function OpportunitySecondary({ opportunityId }: OpportunitySecondaryProps) {
  const definition = OPPORTUNITY_DEFINITIONS[opportunityId];
  const relationSentence = SECONDARY_RELATION_COPY[opportunityId];

  if (!definition) return null;

  return (
    <div className="flex flex-col space-y-2">
      <div className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.14em] text-[var(--tsc-muted)] uppercase">
        ALSO WORTH LOOKING AT
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-[var(--tsc-ink)] leading-snug">
        {definition.shortLabel}
      </h3>
      {relationSentence && (
        <p className="text-sm sm:text-[15px] leading-[1.5] text-[var(--tsc-ink)]/75 max-w-[480px]">
          {relationSentence}
        </p>
      )}
    </div>
  );
}
