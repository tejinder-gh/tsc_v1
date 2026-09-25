import { EditorialDivider, SectionLabel } from "@/components/ui/editorial";

export function FounderPOV() {
  return (
    <section
      aria-labelledby="founder-pov-heading"
      className="bg-[var(--tsc-paper)] border-b border-[var(--tsc-line)] py-16 sm:py-20 lg:py-24 font-geist"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-16 items-start">
          {/* Left Column: Heading & Sub-heading (~5 cols) */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5 lg:sticky lg:top-28 lg:self-start">
            <SectionLabel>04 / POINT OF VIEW</SectionLabel>
            <h2
              id="founder-pov-heading"
              className="text-[32px] sm:text-[44px] lg:text-[50px] font-bold leading-[1.04] tracking-[-0.03em] text-[var(--tsc-ink)]"
            >
              Practical technology,
              <br className="hidden sm:inline" /> applied to real work.
            </h2>
            <p className="text-base sm:text-lg text-[var(--tsc-muted)] leading-relaxed max-w-md">
              Why we build: returning skilled human attention to high-judgment work instead of
              repetitive operational drag.
            </p>
          </div>

          {/* Right Column: Authored Note & Stance (~7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <EditorialDivider />
            {/* Primary Quote / Note */}
            <blockquote className="text-[20px] sm:text-[24px] lg:text-[28px] font-medium leading-[1.25] tracking-[-0.02em] text-[var(--tsc-ink)]">
              &ldquo;The Skill Corner exists because too many businesses spend skilled human
              attention on repetitive operational work.&rdquo;
            </blockquote>

            {/* Practical Stance */}
            <div className="space-y-4 text-base sm:text-lg text-[var(--tsc-ink)]/80 leading-relaxed max-w-xl">
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
                Tejinder &middot; FOUNDER + ENGINEER
              </div>
              <div className="font-mono text-[11px] text-[var(--tsc-muted)] tracking-tight mt-1">
                SYSTEMS ARCHITECTURE &middot; TORONTO
              </div>
            </div>
            <EditorialDivider />
          </div>
        </div>
      </div>
    </section>
  );
}
