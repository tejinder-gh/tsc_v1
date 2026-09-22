import { SectionLabel } from "@/components/ui/editorial";

export function FounderPOV() {
  return (
    <section
      aria-labelledby="founder-pov-heading"
      className="bg-[var(--tsc-paper)] border-b border-[var(--tsc-line)] py-16 sm:py-20 lg:py-24 font-geist"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16 items-start">
          {/* Left Column: Label (~4 cols) */}
          <div className="lg:col-span-4">
            <SectionLabel id="founder-pov-heading">04 / POINT OF VIEW</SectionLabel>
          </div>

          {/* Right Column: Authored Note & Stance (~8 cols) */}
          <div className="lg:col-span-8 space-y-8 lg:space-y-10">
            {/* Primary Quote / Note */}
            <blockquote className="text-[26px] sm:text-[34px] lg:text-[40px] font-medium leading-[1.18] tracking-[-0.025em] text-[var(--tsc-ink)]">
              &ldquo;The Skill Corner exists because too many businesses spend skilled human
              attention on repetitive operational work.&rdquo;
            </blockquote>

            {/* Practical Stance */}
            <div className="space-y-4 text-base sm:text-lg text-[var(--tsc-ink)]/80 leading-relaxed max-w-2xl">
              <p>
                We are deliberately practical about technology. We use proven platforms, work
                directly with what you already have in place, and avoid expensive science projects.
              </p>
              <p>
                A build is only valuable if it returns hours to your week, eliminates missed
                inquiries, or gives your team the room to focus on high-judgment work.
              </p>
            </div>

            {/* Signature & Role */}
            <div className="pt-4 border-t border-[var(--tsc-line)] inline-block">
              <div className="font-mono text-xs sm:text-[13px] font-semibold tracking-wider text-[var(--tsc-ink)] uppercase">
                TEJINDER PAL SINGH &middot; FOUNDER + ENGINEER
              </div>
              <div className="font-mono text-[11px] text-[var(--tsc-muted)] tracking-tight mt-1">
                SYSTEMS ARCHITECTURE &middot; TORONTO
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
