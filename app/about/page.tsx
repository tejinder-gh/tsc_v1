/**
 * What: About page - founder-led story, credibility markers, photo placeholder, and CTAs.
 * Why: Both segments (especially practices) buy from people; the page converts trust
 *      into a booked audit.
 * How: Server page over content/about.ts; photo is a labeled placeholder block until a
 *      real image lands in /public/founder.jpg.
 * From Where: TheSkillCorner marketing site build brief, 2026-06.
 * When: 2026-06; swap in the real founder photo and name before launch.
 */

import type { Metadata } from "next";
import { AbstractVisual } from "@/components/AbstractVisual";
import { CtaLink } from "@/components/CtaLink";
import { FinalCta } from "@/components/FinalCta";
import { about } from "@/content/about";

export const metadata: Metadata = {
  title: "About Us - Toronto AI Automation Agency",
  description:
    "The Skill Corner is a founder-led AI automation agency: 15+ years of production software engineering, applied to the businesses big software flies over.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <div className="mx-auto max-w-site px-4 py-14 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight tracking-[-0.02em] text-ink sm:text-5xl">
              {about.headline}
            </h1>
            <div className="mt-6 max-w-2xl space-y-5 text-lg leading-relaxed">
              {about.story.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8">
              <CtaLink href="/book" location="about_page">
                Book a free automation audit
              </CtaLink>
            </div>
          </div>
          <aside>
            <div className="relative overflow-hidden rounded-xl bg-white shadow-sm border-2 border-ink/10">
              <AbstractVisual variant="about" />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white/90 to-transparent pt-12 pb-4 text-center">
                <p className="max-w-[14rem] mx-auto px-4 text-sm font-medium text-slate">
                  {about.photoCaption}
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-xl bg-white p-6 shadow-sm border-2 border-ink/10">
              <h2 className="font-display text-lg font-bold">Why owners trust the work</h2>
              <ul className="mt-3 space-y-2.5">
                {about.credibility.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed">
                    <span aria-hidden="true" className="mt-0.5 shrink-0 text-ledger">
                      <svg
                        aria-hidden="true"
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M2 8.5L6 12l8-8"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
      <FinalCta location="about" />
    </>
  );
}
