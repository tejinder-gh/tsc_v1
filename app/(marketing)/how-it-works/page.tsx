/**
 * What: The process page - Audit / Build / Run, each split into what The Skill Corner
 *       does and what the client has to do, plus a timeline note.
 * Why: Closes an IA gap - the brief lists /how-it-works as a standalone route, but the
 *      process previously only existed as a home-page section. Reuses content/home.ts's
 *      real, already-published copy rather than inventing new claims; restructures the
 *      existing prose into explicit "we do" / "you do" halves per brief §7 item 4, which
 *      is the detail that kills the "this will be a project" objection.
 * How: Server page over content/home.ts's howItWorks array.
 * From Where: Brief IA (§7), 2026-08.
 * When: 2026-08.
 */

import type { Metadata } from "next";
import { CtaLink } from "@/components/CtaLink";
import { FinalCta } from "@/components/FinalCta";
import { howItWorks } from "@/content/home";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Audit, build, run. A free 30-minute audit, a two to four week build connected to your existing tools, then ongoing monitoring and a monthly report of hours saved.",
  alternates: { canonical: "/how-it-works" },
};

const whatYouDo: Record<number, string> = {
  1: "Take the 30-minute call and tell us where your time goes. You get the list of automation ideas whether you hire us or not.",
  2: "Review what we build and approve it before it goes live - nothing ships without your sign-off.",
  3: "Nothing. It runs on its own; you get a monthly report of hours saved and a way to reach us if something looks off.",
};

export default function HowItWorksPage() {
  return (
    <>
      <section className="mx-auto max-w-site px-4 pb-12 pt-16 sm:px-6 sm:pt-20">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-500">How it works</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">
          Three steps, and only one of them needs much from you.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed">
          Most builds are live in two to four weeks. You approve the scope up front and the result
          before it ships - after that, it runs without you.
        </p>
        <div className="mt-8">
          <CtaLink href="/book" location="how_it_works_hero">
            Book a free automation audit
          </CtaLink>
        </div>
      </section>

      <section aria-label="The process" className="bg-mist">
        <div className="mx-auto max-w-site px-4 py-14 sm:px-6">
          <ol className="grid gap-6 md:grid-cols-3">
            {howItWorks.map((step) => (
              <li
                key={step.number}
                className="rounded-card border-[1.5px] border-line bg-white p-6"
              >
                <span
                  aria-hidden="true"
                  className="grid h-10 w-10 place-items-center rounded-pill bg-blue-500 font-display text-lg font-bold text-white shadow-sm"
                >
                  {step.number}
                </span>
                <h2 className="mt-4 font-display text-xl font-bold text-navy">{step.title}</h2>
                <p className="mt-3">
                  <span className="block text-xs font-bold uppercase tracking-wide text-slate">
                    What we do
                  </span>
                  <span className="leading-relaxed">{step.body}</span>
                </p>
                <p className="mt-4">
                  <span className="block text-xs font-bold uppercase tracking-wide text-slate">
                    What you do
                  </span>
                  <span className="leading-relaxed">{whatYouDo[step.number]}</span>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FinalCta location="how_it_works" />
    </>
  );
}
