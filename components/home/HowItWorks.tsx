/**
 * What: The three-step Audit -> Build -> Run process section.
 * Why: Reduces perceived risk before the calculator and booking CTA; numbered markers are
 *      justified here because it is a genuine sequence.
 * How: Server component over content/home.ts steps.
 * From Where: TheSkillCorner marketing site build brief, 2026-06.
 * When: 2026-06.
 */

import { howItWorks } from "@/content/home";

import { Reveal } from "@/components/Reveal";
export function HowItWorks() {
  return (
    <section aria-label="How it works" className="bg-mist">
      <div className="mx-auto max-w-site px-4 py-16 sm:px-6">
        <Reveal>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">How it works</h2>
        </Reveal>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {howItWorks.map((step, index) => (
            <li key={step.number} className="h-full">
              <Reveal delay={index * 110} className="h-full">
                <div className="h-full rounded-xl bg-white p-6 transition-shadow duration-200 hover:shadow-md hover:shadow-ink/5">
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 place-items-center rounded-full bg-ledger font-display text-lg font-bold text-white"
                  >
                    {step.number}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 leading-relaxed">{step.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
