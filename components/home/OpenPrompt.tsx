"use client";

import { ProblemInput } from "@/components/journey/ProblemInput";
import { SectionLabel } from "@/components/ui/editorial";

export function OpenPrompt() {
  return (
    <section
      aria-labelledby="open-prompt-heading"
      className="bg-[var(--tsc-ink)] text-[var(--tsc-paper)] py-20 sm:py-24 lg:py-28 font-geist"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16 items-start">
          {/* Left Column: Heading & Body (~5 cols) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-28 lg:self-start">
            <SectionLabel dark>06 / YOUR TURN</SectionLabel>
            <h2
              id="open-prompt-heading"
              className="text-[32px] sm:text-[44px] lg:text-[50px] font-bold leading-[1.04] tracking-[-0.03em] text-white"
            >
              Have a problem
              <br className="hidden sm:inline" /> we haven&apos;t covered?
            </h2>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-sm">
              Describe what keeps repeating, getting missed, or taking more attention than it
              should.
            </p>
          </div>

          {/* Right Column: Dark Variant Problem Input (~7 cols) */}
          <div className="lg:col-span-7 pt-2">
            <div className="max-w-xl">
              <ProblemInput
                id="open-prompt-input"
                variant="dark"
                placeholder="Describe what's wasting time, money, or opportunities…"
                showMicrocopy={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
