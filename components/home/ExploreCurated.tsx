import Link from "next/link";
import { EditorialDivider, SectionLabel } from "@/components/ui/editorial";

interface CuratedItem {
  type: string;
  title: string;
  description: string;
  href: string;
}

const CURATED_ITEMS: readonly CuratedItem[] = [
  {
    type: "GUIDE / RESOURCE",
    title: "The Skill Corner Library",
    description:
      "Explore 30+ productized automations, digital engineering pillars, and practical blueprints designed to eliminate operational friction.",
    href: "/library",
  },
  {
    type: "TOOL",
    title: "Automation Opportunities Checklist",
    description:
      "A 25-task diagnostic to identify repetitive operational drag and calculate hours returned across your business.",
    href: "/checklist",
  },
  {
    type: "BRIEFING",
    title: "Tech Founder Briefing",
    description:
      "Actionable AI & engineering shifts, distilled weekly for founders, CTOs, and software operators.",
    href: "/newsletters/tech-founder-briefing",
  },
];

export function ExploreCurated() {
  return (
    <section
      aria-labelledby="explore-heading"
      className="bg-[var(--tsc-paper)] border-b border-[var(--tsc-line)] py-16 sm:py-20 lg:py-24 font-geist"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16 items-start">
          {/* Left Column: Heading (~5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <SectionLabel>05 / EXPLORE</SectionLabel>
            <h2
              id="explore-heading"
              className="text-[32px] sm:text-[44px] lg:text-[50px] font-bold leading-[1.04] tracking-[-0.03em] text-[var(--tsc-ink)]"
            >
              Useful things,
              <br className="hidden sm:inline" /> without the catalog dump.
            </h2>
            <p className="text-base sm:text-lg text-[var(--tsc-muted)] leading-relaxed max-w-sm">
              Practical artifacts, self-service tools, and technical briefs we publish to clarify
              automation choices before entering an engagement.
            </p>
          </div>

          {/* Right Column: Editorial Contents List (~7 cols) */}
          <div className="lg:col-span-7">
            <EditorialDivider />
            <div className="divide-y divide-[var(--tsc-line)]">
              {CURATED_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group block py-7 sm:py-8 transition-colors hover:bg-[var(--tsc-surface)]/60 px-2 -mx-2 rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tsc-action)]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[11px] font-semibold tracking-wider text-[var(--tsc-muted)] uppercase">
                      [{item.type}]
                    </span>
                    <span
                      className="font-mono text-base text-[var(--tsc-ink)] transition-transform duration-150 group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      &rarr;
                    </span>
                  </div>

                  <h3 className="mt-2 text-lg sm:text-xl font-semibold text-[var(--tsc-ink)] tracking-tight group-hover:text-[var(--tsc-action)] transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-[var(--tsc-muted)] leading-relaxed max-w-xl">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
            <EditorialDivider />
          </div>
        </div>
      </div>
    </section>
  );
}
