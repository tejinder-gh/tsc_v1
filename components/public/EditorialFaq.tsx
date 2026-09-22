import { PageEyebrow } from "./PageEyebrow";

export interface FaqEntry {
  q: string;
  a: string;
}

interface EditorialFaqProps {
  eyebrow?: string;
  title?: string;
  items?: readonly FaqEntry[];
  className?: string;
}

export function EditorialFaq({
  eyebrow = "TECHNICAL NOTES & FAQ",
  title = "Frequently addressed questions.",
  items,
  className = "",
}: EditorialFaqProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className={`py-14 sm:py-20 border-b border-[var(--tsc-line)] font-geist ${className}`}>
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-5 space-y-3">
            <PageEyebrow>{eyebrow}</PageEyebrow>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]">
              {title}
            </h2>
            <p className="text-sm text-[var(--tsc-muted)] leading-relaxed max-w-sm">
              Implementation details, operational constraints, and practical questions.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="divide-y divide-[var(--tsc-line)] border-y border-[var(--tsc-line)]">
              {items.map((item) => (
                <details
                  key={item.q}
                  className="group py-5 transition-colors focus-within:outline-none"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[var(--tsc-ink)] group-hover:text-[var(--tsc-action)] transition-colors list-none">
                    <span>{item.q}</span>
                    <span className="font-mono text-xs text-[var(--tsc-muted)] transition-transform duration-200 group-open:rotate-45 shrink-0 select-none">
                      +
                    </span>
                  </summary>
                  <div className="mt-3 text-sm text-[var(--tsc-muted)] leading-relaxed max-w-2xl">
                    <p>{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
