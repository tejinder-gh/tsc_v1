/**
 * What: All home-page copy - hero, segment router cards, problem strips, and how-it-works steps.
 * Why: Keeps the highest-churn marketing copy in one editable file, separate from layout code.
 * How: Typed const objects; problem strips are keyed "neutral" | "local" | "practice" so the
 *      page can swap copy based on the visitor's chosen segment.
 * From Where: TheSkillCorner marketing site build brief, 2026-06.
 * When: 2026-06; revisit after first round of message testing.
 */

import type { Segment } from "./site";

export const hero = {
  eyebrow: "AI automation & digital services agency",
  headline: "Your business runs on repetitive work. We make it run itself.",
  subhead:
    "The Skill Corner builds AI automations for local businesses and professional practices - from missed-call answering to patient intake. You keep the work only you can do; the rest runs on its own.",
  primaryCta: { label: "Book a free automation audit", href: "/book" },
  secondaryCta: { label: "See what we automate", href: "#what-we-automate" },
  trustLine: "Serving storefronts, clinics, and firms across Canada - built and supported locally.",
} as const;

export interface SegmentCard {
  segment: Segment;
  title: string;
  body: string;
  href: string;
  examples: string;
}

export const segmentCards: readonly SegmentCard[] = [
  {
    segment: "local",
    title: "I run a local business",
    body: "Stores, restaurants, salons, gyms. Fixed prices, plain talk, and automations that start paying for themselves in weeks.",
    href: "/for#local-businesses",
    examples: "Missed calls, supplier orders, reviews, no-shows",
  },
  {
    segment: "practice",
    title: "I run a practice or firm",
    body: "Clinics, dental offices, law firms, accountants. Privacy-first builds that fit how your office already works.",
    href: "/for#practices",
    examples: "No-shows, intake paperwork, after-hours inquiries, follow-ups",
  },
] as const;

export interface Problem {
  title: string;
  body: string;
}

export const problems: Record<"neutral" | Segment, readonly Problem[]> = {
  neutral: [
    {
      title: "The phone rings at the worst times",
      body: "Calls land while you are with a customer, a patient, or a client. Whoever does not get an answer calls the next place on the list.",
    },
    {
      title: "Admin eats your evenings",
      body: "Orders, paperwork, reviews, reminders - hours every week of work that keeps the lights on but never grows the business.",
    },
    {
      title: "Follow-ups slip through the cracks",
      body: "The quote you meant to chase, the lapsed customer you meant to win back. Nobody dropped the ball on purpose; there was just no system.",
    },
  ],
  local: [
    {
      title: "Missed calls are missed sales",
      body: "Every call that hits voicemail while you are at the register or on the floor is a customer who phones the place down the street.",
    },
    {
      title: "Ordering and inventory eat your week",
      body: "Supplier emails, stock counts, reorder spreadsheets - four to six hours every week that never grow the business.",
    },
    {
      title: "Reviews and socials never get done",
      body: "You know you should answer every review and post regularly. It is 9 p.m. and you still have not.",
    },
  ],
  practice: [
    {
      title: "No-shows burn staffed hours",
      body: "Every empty chair or unfilled slot is revenue you scheduled staff for and never see - often thousands of dollars a month.",
    },
    {
      title: "Intake paperwork slows everyone down",
      body: "Patients and clients fill out forms by hand; your staff re-types them into the system. Twice the work, double the errors.",
    },
    {
      title: "After-hours inquiries go cold",
      body: "People look for a doctor, dentist, or lawyer at 9 p.m. If nobody answers, they book whoever answers first.",
    },
  ],
};

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
