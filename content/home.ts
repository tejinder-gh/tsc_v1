/**
 * What: How-it-works process steps copy.
 * Why: Keeps the process marketing copy in one editable file, separate from layout code.
 * How: Typed const objects consumed by /how-it-works.
 * From Where: TheSkillCorner marketing site build brief, 2026-06.
 * When: 2026-06.
 */

export interface Step {
  number: number;
  title: string;
  body: string;
}

export const howItWorks: readonly Step[] = [
  {
    number: 1,
    title: "Audit",
    body: "A free 30-minute call. We map where your hours go and pick the two or three automations with the fastest payback. You get the list whether you hire us or not.",
  },
  {
    number: 2,
    title: "Build",
    body: "We build and test in two to four weeks, connected to the tools you already use. You approve everything before it goes live.",
  },
  {
    number: 3,
    title: "Run",
    body: "It runs every day. We monitor it, fix it when a connected tool changes, and send you a monthly report of hours saved.",
  },
] as const;
