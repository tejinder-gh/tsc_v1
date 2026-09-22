import { JourneyProgress } from "../JourneyProgress";

export function SolutionPlaceholder() {
  return (
    <div className="max-w-[720px] flex flex-col space-y-4 sm:space-y-5 font-geist">
      {/* Journey Progress: Stage 03 active */}
      <div className="pb-2">
        <JourneyProgress />
      </div>

      {/* Eyebrow */}
      <div className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.14em] text-[var(--tsc-muted)] uppercase">
        SOLUTION
      </div>

      {/* Heading */}
      <h2
        style={{ color: "var(--tsc-ink)" }}
        className="text-[36px] sm:text-[48px] lg:text-[56px] font-bold leading-[1.0] tracking-[-0.03em] text-[var(--tsc-ink)]"
      >
        Let&apos;s make it concrete.
      </h2>

      {/* Body */}
      <p className="text-base sm:text-lg font-normal leading-[1.5] text-[var(--tsc-ink)]/80">
        The interactive demonstration is the next part of this experience.
      </p>
    </div>
  );
}
