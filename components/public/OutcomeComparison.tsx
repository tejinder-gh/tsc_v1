import { PageEyebrow } from "./PageEyebrow";

export interface OutcomeItem {
  before: string;
  after: string;
  measure?: string;
}

interface OutcomeComparisonProps {
  eyebrow?: string;
  title?: string;
  items: OutcomeItem[];
  className?: string;
}

export function OutcomeComparison({
  eyebrow = "WHAT CHANGES",
  title = "From manual coordination to quiet operation.",
  items,
  className = "",
}: OutcomeComparisonProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className={`py-14 sm:py-20 border-b border-[var(--tsc-line)] font-geist ${className}`}>
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <div className="max-w-3xl mb-10 space-y-3">
          <PageEyebrow>{eyebrow}</PageEyebrow>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]">
            {title}
          </h2>
        </div>

        <div className="divide-y divide-[var(--tsc-line)] border-y border-[var(--tsc-line)]">
          {items.map((item) => (
            <div
              key={`${item.before}-${item.after}`}
              className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start"
            >
              {/* BEFORE */}
              <div className="md:col-span-5 space-y-2">
                <span className="font-mono text-[11px] font-semibold tracking-wider text-[var(--tsc-muted)] uppercase">
                  BEFORE
                </span>
                <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
                  {item.before}
                </p>
              </div>

              {/* ARROW / CONNECTOR (Desktop) */}
              <div className="hidden md:flex md:col-span-1 justify-center pt-6 text-[var(--tsc-muted)] font-mono">
                &rarr;
              </div>

              {/* AFTER */}
              <div className={`space-y-2 ${item.measure ? "md:col-span-4" : "md:col-span-6"}`}>
                <span className="font-mono text-[11px] font-semibold tracking-wider text-[var(--tsc-ink)] uppercase">
                  AFTER
                </span>
                <p className="text-sm sm:text-base text-[var(--tsc-ink)] font-medium leading-relaxed">
                  {item.after}
                </p>
              </div>

              {/* MEASURE (Rendered only when legitimate data exists per Amendment 7 & 12) */}
              {item.measure && (
                <div className="md:col-span-2 space-y-2 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-[var(--tsc-line)] md:pl-6">
                  <span className="font-mono text-[11px] font-semibold tracking-wider text-[var(--tsc-action)] uppercase">
                    MEASURE
                  </span>
                  <p className="text-xs sm:text-sm font-mono text-[var(--tsc-ink)]">
                    {item.measure}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
