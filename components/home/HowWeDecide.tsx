import { EditorialDivider, SectionLabel } from "@/components/ui/editorial";

interface Principle {
  number: string;
  label: string;
  copy: string;
}

const PRINCIPLES: readonly Principle[] = [
  {
    number: "01",
    label: "START WITH THE BOTTLENECK",
    copy: "Fix the part that is actually constraining the work, not the part that sounds most sophisticated.",
  },
  {
    number: "02",
    label: "KEEP WHAT ALREADY WORKS",
    copy: "If an existing tool does its job well, connect to it. New software should earn the complexity it introduces.",
  },
  {
    number: "03",
    label: "AUTOMATE THE PREDICTABLE",
    copy: "Rules, routing, repetition, and handoffs are good automation targets. Judgment stays with people until the system has earned more trust.",
  },
  {
    number: "04",
    label: "MEASURE THE CHANGE",
    copy: "A system is useful when something improves: time returned, response speed, fewer misses, better conversion, or clearer decisions.",
  },
];

export function HowWeDecide() {
  return (
    <section
      aria-labelledby="how-we-decide-heading"
      className="bg-[var(--tsc-paper)] border-b border-[var(--tsc-line)] py-16 sm:py-20 lg:py-24 font-geist"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-16 items-start">
          {/* Left Column: Manifesto Headline & Overview (~5 cols) */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            <SectionLabel>03 / HOW WE DECIDE</SectionLabel>
            <h2
              id="how-we-decide-heading"
              className="text-[32px] sm:text-[44px] lg:text-[50px] font-bold leading-[1.04] tracking-[-0.03em] text-[var(--tsc-ink)]"
            >
              Technology is rarely
              <br className="hidden sm:inline" /> the first decision.
            </h2>
            <p className="text-base sm:text-lg text-[var(--tsc-muted)] leading-relaxed max-w-md">
              The useful question is where the operation is losing time, attention, or opportunity —
              and what is small enough to fix without rebuilding everything around it.
            </p>
          </div>

          {/* Right Column: Numbered Principles Stack (~7 cols) */}
          <div className="lg:col-span-7">
            <EditorialDivider />
            <div className="divide-y divide-[var(--tsc-line)]">
              {PRINCIPLES.map((principle) => (
                <div
                  key={principle.number}
                  className="group py-7 sm:py-8 space-y-3 px-3.5 -mx-3.5 rounded-[6px] transition-all duration-200 hover:bg-white hover:shadow-[var(--shadow-warm-sm)]"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)] group-hover:text-[var(--tsc-action)] transition-colors">
                      {principle.number}
                    </span>
                    <h3 className="font-mono text-xs sm:text-[13px] font-bold tracking-wider text-[var(--tsc-ink)] uppercase">
                      {principle.label}
                    </h3>
                  </div>
                  <p className="pl-7 text-base sm:text-[17px] text-[var(--tsc-ink)]/90 leading-relaxed max-w-xl">
                    {principle.copy}
                  </p>
                </div>
              ))}
            </div>
            <EditorialDivider />
          </div>
        </div>
      </div>
    </section>
  );
}
