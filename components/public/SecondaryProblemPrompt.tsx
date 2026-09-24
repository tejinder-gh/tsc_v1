"use client";

import Link from "next/link";
import { ProblemInput } from "@/components/journey/ProblemInput";
import { PageEyebrow } from "./PageEyebrow";

interface SecondaryProblemPromptProps {
  eyebrow?: string;
  heading?: string;
  supportingCopy?: string;
  secondaryBookingHref?: string;
  secondaryBookingLabel?: string;
  className?: string;
}

export function SecondaryProblemPrompt({
  eyebrow = "NEXT STEP",
  heading = "Have this problem in your own operation?",
  supportingCopy = "Describe what keeps repeating, getting missed, or taking more attention than it should. We will assess the bottleneck and propose the smallest useful fix.",
  secondaryBookingHref = "/book",
  secondaryBookingLabel = "Or schedule an engineering audit",
  className = "",
}: SecondaryProblemPromptProps) {
  return (
    <section
      aria-labelledby="secondary-problem-heading"
      className={`bg-[var(--tsc-ink)] text-[var(--tsc-paper)] py-16 sm:py-20 lg:py-24 font-geist ${className}`}
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16 items-start">
          {/* Left Column: Heading & Body */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-28 lg:self-start">
            <PageEyebrow dark>{eyebrow}</PageEyebrow>
            <h2
              id="secondary-problem-heading"
              className="text-[28px] sm:text-[38px] lg:text-[44px] font-bold leading-[1.06] tracking-[-0.03em] text-white"
            >
              {heading}
            </h2>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-sm">
              {supportingCopy}
            </p>

            {/* Subtle secondary booking/contact link if present */}
            {secondaryBookingHref && (
              <div className="pt-2">
                <Link
                  href={secondaryBookingHref}
                  className="text-xs font-mono text-white/50 hover:text-white transition-colors underline underline-offset-4"
                >
                  {secondaryBookingLabel} &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Dark Problem Input */}
          <div className="lg:col-span-7 pt-1">
            <div className="max-w-xl">
              <ProblemInput
                id="secondary-prompt-input"
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
