import { PageEyebrow } from "./PageEyebrow";

interface DeliverableIndexProps {
  eyebrow?: string;
  title?: string;
  items: string[];
  className?: string;
}

export function DeliverableIndex({
  eyebrow = "DELIVERABLES",
  title = "What your operation receives.",
  items,
  className = "",
}: DeliverableIndexProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className={`py-14 sm:py-20 border-b border-[var(--tsc-line)] font-geist ${className}`}>
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column: Heading */}
          <div className="lg:col-span-5 space-y-3">
            <PageEyebrow>{eyebrow}</PageEyebrow>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]">
              {title}
            </h2>
            <p className="text-sm text-[var(--tsc-muted)] leading-relaxed max-w-sm">
              Concrete system artifacts, configurations, and working documentation handed over upon
              completion.
            </p>
          </div>

          {/* Right Column: Specification List */}
          <div className="lg:col-span-7">
            <div className="divide-y divide-[var(--tsc-line)] border-y border-[var(--tsc-line)]">
              {items.map((item, index) => {
                const num = String(index + 1).padStart(2, "0");
                return (
                  <div key={item} className="py-5 flex items-start gap-5 sm:gap-6 group">
                    <span className="font-mono text-sm sm:text-base font-semibold text-[var(--tsc-muted)] tracking-wider">
                      {num}
                    </span>
                    <span className="text-sm sm:text-base font-medium text-[var(--tsc-ink)] leading-relaxed">
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
