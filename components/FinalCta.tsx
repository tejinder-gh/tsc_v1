/**
 * What: Final CTA banner (book + contact) with the checklist strip underneath - two to
 *       three rungs of the conversion ladder in one block.
 * Why: Every page must end with a next step for both high-intent (book) and low-intent
 *      (checklist) visitors.
 * How: Server component wrapping client CtaLinks; `location` prop differentiates the
 *      analytics source per page.
 * From Where: TheSkillCorner marketing site build brief (conversion ladder), 2026-06.
 * When: 2026-06.
 */

import { CtaLink } from "./CtaLink";

interface FinalCtaProps {
  location: string;
  heading?: string;
  body?: string;
}

export function FinalCta({
  location,
  heading = "Find out what your week looks like with the busywork gone.",
  body = "A free 30-minute audit. You leave with three automation ideas sized to your business - whether you hire us or not.",
}: FinalCtaProps) {
  return (
    <section aria-label="Next steps">
      <div className="bg-ink">
        <div className="mx-auto flex max-w-site flex-col items-start gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-bold !text-white sm:text-4xl">{heading}</h2>
            <p className="mt-3 text-white/80">{body}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CtaLink href="/book" location={`${location}_final`} variant="primaryOnDark">
              Book a free automation audit
            </CtaLink>
            <CtaLink href="/contact" location={`${location}_final`} variant="secondaryOnDark">
              Send a quick query
            </CtaLink>
          </div>
        </div>
      </div>
      <div className="bg-mist">
        <div className="mx-auto flex max-w-site flex-col items-start gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p className="font-medium text-ink">
            Not ready to talk? Grab the free Automation Opportunities Checklist - 25 tasks your
            business can stop doing by hand.
          </p>
          <CtaLink href="/checklist" location={`${location}_checklist_strip`} variant="text">
            Get the checklist
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
