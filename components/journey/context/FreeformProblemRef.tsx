"use client";

interface FreeformProblemRefProps {
  problemText?: string;
}

export function FreeformProblemRef({ problemText }: FreeformProblemRefProps) {
  if (!problemText?.trim()) {
    return null;
  }

  const trimmed = problemText.trim();
  const truncated = trimmed.length > 180 ? `${trimmed.slice(0, 177).trimEnd()}...` : trimmed;

  return (
    <section
      aria-label="Submitted problem statement"
      className="mb-4 rounded-[4px] border-l-2 border-[var(--tsc-ink)]/40 bg-[var(--tsc-surface)]/60 px-3.5 py-2 font-geist"
    >
      <div className="text-[10px] font-mono font-semibold tracking-wider text-[var(--tsc-muted)] uppercase">
        YOU TOLD US
      </div>
      <p className="mt-0.5 text-xs sm:text-[13px] italic leading-relaxed text-[var(--tsc-ink)]/85">
        &ldquo;{truncated}&rdquo;
      </p>
    </section>
  );
}
