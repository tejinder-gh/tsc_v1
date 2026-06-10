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
import { CtaLink } from "@/components/CtaLink";
import { FinalCta } from "@/components/FinalCta";
import { about } from "@/content/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Skill Corner is a founder-led AI automation agency: 15+ years of production software engineering, applied to the businesses big software flies over.",
};

export default function AboutPage() {
  return (
    <>
      <div className="mx-auto max-w-site px-4 py-14 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl">
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
            <div
              role="img"
              aria-label={about.photoCaption}
              className="grid aspect-[4/5] place-items-center rounded-2xl bg-mist text-center"
            >
              <p className="max-w-[14rem] px-4 text-sm">{about.photoCaption}</p>
            </div>
            <div className="mt-6 rounded-xl border-2 border-ink/10 p-6">
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
