interface OpportunityEvidenceProps {
  evidence: string[];
  label?: string;
}

export function OpportunityEvidence({
  evidence,
  label = "WHAT IT CHANGES",
}: OpportunityEvidenceProps) {
  return (
    <div className="flex flex-col space-y-3">
      <div className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.14em] text-[var(--tsc-muted)] uppercase">
        {label}
      </div>
      <ul className="flex flex-col space-y-2.5">
        {evidence.map((point) => (
          <li
            key={point}
            className="flex items-start gap-2.5 text-sm sm:text-[15px] leading-[1.5] text-[var(--tsc-ink)]"
          >
            <span
              className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--tsc-ink)]"
              aria-hidden="true"
            />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
