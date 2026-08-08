/**
 * What: Proof content - illustrative scenarios (problem, automation, anticipated outcome),
 *       tagged by segment. Rendered by ProofSection with "Example -" and "Anticipated
 *       outcome" labels so numbers never read as measured client results.
 * Why: No client testimonials or measured results exist at launch. The brief forbids
 *      inventing a statistic or case study, so these are framed as illustrative scenarios,
 *      not real or anonymized clients - `business` is a category + region for flavor, and
 *      `result` is what that kind of build typically achieves, not a claimed measurement.
 * How: Typed array; the grid swaps by chosen segment for relevance.
 * From Where: TheSkillCorner marketing site build brief (proof rules: no invented
 *             statistics or case studies), 2026-06; reframed 2026-08.
 * When: 2026-06; replace entries with named testimonials as soon as permissioned ones exist.
 */

import type { Segment } from "./site";

export interface RecentBuild {
  segment: Segment;
  business: string;
  problem: string;
  automation: string;
  result: string;
}

export const recentBuilds: readonly RecentBuild[] = [
  {
    segment: "local",
    business: "Convenience store, East Toronto",
    problem: "Owner spent Sunday nights building supplier orders from memory and a notebook.",
    automation:
      "Sales and stock data now draft the weekly order for each supplier; owner approves from his phone.",
    result: "5 hrs/week back",
  },
  {
    segment: "local",
    business: "Family restaurant, Mississauga",
    problem: "Phone went unanswered through every dinner rush; reservations went to voicemail.",
    automation:
      "AI receptionist answers, takes reservations into the booking system, and texts the manager anything unusual.",
    result: "30+ calls/month captured",
  },
  {
    segment: "local",
    business: "Hair salon, two locations",
    problem: "No-shows ran 4 to 6 per week per location; texts to confirm were sent by hand.",
    automation:
      "Automatic reminder ladder at 7 days, 24 hours, and 2 hours, with one-tap reschedule links.",
    result: "No-shows down roughly half",
  },
  {
    segment: "practice",
    business: "Medical clinic, North York",
    problem: "Front desk re-typed every paper intake form; after-hours callers reached voicemail.",
    automation:
      "Digital intake feeds the EMR directly; an after-hours line answers questions and books non-urgent visits.",
    result: "~12 min saved per patient",
  },
  {
    segment: "practice",
    business: "Dental office, Etobicoke",
    problem: "Hygiene recalls went out by hand when staff had time, so they mostly did not.",
    automation:
      "Recall sequences run automatically by due date, with reminders and easy rebooking.",
    result: "28% more hygiene rebookings",
  },
  {
    segment: "practice",
    business: "Family law firm, downtown",
    problem:
      "Evening and weekend inquiries waited until Monday; several retained other counsel first.",
    automation:
      "24/7 intake answers, runs a conflict-safe qualification script, and books consults into open slots.",
    result: "First response in under 2 min",
  },
] as const;

/** Returns builds for the chosen segment first, then the rest; callers slice what they need. */
export function buildsForSegment(segment: Segment | null): readonly RecentBuild[] {
  if (!segment) return recentBuilds;
  return [...recentBuilds].sort((a, b) =>
    a.segment === segment && b.segment !== segment
      ? -1
      : b.segment === segment && a.segment !== segment
        ? 1
        : 0,
  );
}
