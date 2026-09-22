import Link from "next/link";
import { PageEyebrow } from "./PageEyebrow";

interface FitSectionProps {
  eyebrow?: string;
  title?: string;
  goodFitItems: string[];
  notFitItems?: string[];
  className?: string;
}

export function FitSection({
  eyebrow = "FIT ASSESSMENT",
  title = "Where this capability belongs.",
  goodFitItems,
  notFitItems,
  className = "",
}: FitSectionProps) {
  const defaultNotFit = [
    "The underlying operational bottleneck has not been identified yet.",
    "The existing process changes daily and has not stabilized into a repeatable workflow.",
    "A manual check of the process has not yet been attempted.",
  ];

  const notFitList = notFitItems && notFitItems.length > 0 ? notFitItems : defaultNotFit;

  return (
    <section className={`py-14 sm:py-20 border-b border-[var(--tsc-line)] font-geist ${className}`}>
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <div className="max-w-3xl mb-12 space-y-3">
          <PageEyebrow>{eyebrow}</PageEyebrow>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
          {/* GOOD FIT */}
          <div className="p-7 sm:p-8 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-paper)] space-y-6">
            <div className="space-y-1">
              <span className="font-mono text-xs font-semibold tracking-wider text-[var(--tsc-ink)] uppercase">
                01 / GOOD FIT
              </span>
              <p className="text-sm text-[var(--tsc-muted)]">
                Organizations and workflows engineered for this capability:
              </p>
            </div>

            <ul className="space-y-3.5">
              {goodFitItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[var(--tsc-ink)]">
                  <span className="font-mono text-[var(--tsc-muted)] font-semibold select-none">
                    +
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* NOT A FIT */}
          <div className="p-7 sm:p-8 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/50 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="font-mono text-xs font-semibold tracking-wider text-[var(--tsc-muted)] uppercase">
                  02 / NOT A FIT
                </span>
                <p className="text-sm text-[var(--tsc-muted)]">
                  When a different starting point is recommended:
                </p>
              </div>

              <ul className="space-y-3.5">
                {notFitList.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--tsc-muted)]">
                    <span className="font-mono text-[var(--tsc-muted)] select-none">&times;</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[var(--tsc-line)]">
              <p className="text-xs text-[var(--tsc-muted)] mb-2">
                Unsure if this fits your current bottleneck?
              </p>
              <Link
                href="/#start"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[var(--tsc-ink)] hover:text-[var(--tsc-action)] transition-colors underline underline-offset-4"
              >
                Start with your problem instead &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
