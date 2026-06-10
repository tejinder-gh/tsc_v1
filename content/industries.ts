/**
 * What: The six industry landing pages - complete standalone funnel content per industry.
 * Why: /for/[slug] pages are the SEO and ad-traffic engine; each must be a full funnel
 *      (pains, automations with savings, proof, pricing anchor, FAQ, CTA) in the
 *      industry's own vocabulary. Typed content makes adding industry #7 a copy job.
 * How: One Industry interface; pages statically generate from this array. segment drives
 *      which pricing anchor renders and which vocabulary ("customers" vs "patients/clients").
 * From Where: TheSkillCorner marketing site build brief (industry funnel spec), 2026-06.
 * When: 2026-06; revisit as ad campaigns reveal which industries convert.
 */

import type { FaqItem } from "./faq";
import type { Segment } from "./site";

export interface IndustryAutomation {
  title: string;
  body: string;
  metric: string;
}

export interface IndustryBuild {
  business: string;
  problem: string;
  automation: string;
  result: string;
}

export interface Industry {
  slug: string;
  segment: Segment;
  name: string;
  cardLine: string;
  headline: string;
  subhead: string;
  pains: { title: string; body: string }[];
  automations: IndustryAutomation[];
  build: IndustryBuild;
  faq: FaqItem[];
  metaDescription: string;
}

export const industries: readonly Industry[] = [
  {
    slug: "convenience-stores",
    segment: "local",
    name: "Convenience stores",
    cardLine: "Supplier orders, missed calls, and reviews - handled while you run the floor.",
    headline: "Run the store without being chained to it.",
    subhead:
      "Supplier orders that draft themselves, a phone that always gets answered, and reviews that never sit ignored. Built for owners who are already doing three jobs.",
    pains: [
      {
        title: "Sunday nights belong to supplier orders",
        body: "Walking the aisles with a notepad, cross-checking what sold, emailing four suppliers before the cutoff. Every single week.",
      },
      {
        title: "The phone rings while the line is six deep",
        body: '"Are you open?" "Do you have lottery?" "How late tonight?" Every unanswered call is a customer who went somewhere else for the answer.',
      },
      {
        title: "Reviews pile up unanswered",
        body: "One bad review sits at the top of your Google page for months because there was never a free minute to respond properly.",
      },
    ],
    automations: [
      {
        title: "Supplier orders that draft themselves",
        body: "Your sales and stock data draft each supplier order on schedule. You review it on your phone, tweak, and approve - the email goes out formatted the way each supplier wants it.",
        metric: "4-6 hrs/week back",
      },
      {
        title: "A phone that always answers",
        body: "An AI receptionist answers hours, stock, and price questions instantly, around the clock, and texts you anything that actually needs you.",
        metric: "30+ calls/month captured",
      },
      {
        title: "Reviews answered within a day",
        body: "Every Google review gets a drafted response in your voice for one-tap approval. Happy customers get asked for reviews automatically at the till.",
        metric: "2 hrs/week back",
      },
    ],
    build: {
      business: "Convenience store, East Toronto",
      problem: "Owner rebuilt supplier orders from memory and a notebook every Sunday night.",
      automation: "Sales data now drafts each weekly order; he approves from his phone in minutes.",
      result: "5 hrs/week back",
    },
    faq: [
      {
        q: "How much does this cost for a store like mine?",
        a: "Starter packages run from $395/month, setup included, fixed price. Most stores start with one automation - usually ordering or the phone - and add the next once the first pays for itself.",
      },
      {
        q: "Does it work with my POS?",
        a: "Almost certainly. Square, Clover, Lightspeed, and most modern POS systems connect directly. If yours is older, we work from its exports - we have yet to meet a till we could not read.",
      },
      {
        q: "I am not technical. Who keeps this running?",
        a: "We do. Everything is monitored, and fixes are included in the monthly price. You approve orders and review replies from your phone; that is the whole job.",
      },
      {
        q: "How fast can the phone answering start?",
        a: "Within a week. We forward your existing number - no new hardware, no number change, and you can switch it off any time.",
      },
    ],
    metaDescription:
      "AI automation for convenience stores: supplier orders that draft themselves, 24/7 phone answering, and automatic review responses. Fixed prices from $395/month.",
  },
  {
    slug: "restaurants",
    segment: "local",
    name: "Restaurants",
    cardLine: "Reservations answered during the rush, no-shows cut, reviews handled.",
    headline: "Fill tables, not voicemail boxes.",
    subhead:
      "The phone answered during every rush, reservations confirmed automatically, and reviews responded to before they fester. Run service; let the admin run itself.",
    pains: [
      {
        title: "The phone rings hardest during service",
        body: "Friday, 7 p.m.: the room is full, the phone is ringing, and tomorrow's bookings are going to whoever picks up. Usually that is nobody.",
      },
      {
        title: "No-show tables are paid-for dead air",
        body: "A four-top that does not show on a Saturday is food ordered, staff scheduled, and revenue gone - and a table you turned other guests away from.",
      },
      {
        title: "Reviews and socials always lose to service",
        body: "You meant to respond to that two-star review and post this week's special. Then service happened, like it does every day.",
      },
    ],
    automations: [
      {
        title: "Reservations answered 24/7",
        body: "An AI host answers calls, takes reservations straight into your booking system, answers menu and hours questions, and texts the manager anything unusual - even at peak.",
        metric: "$800+/month in saved bookings",
      },
      {
        title: "Confirmations that kill no-shows",
        body: "Every reservation gets a confirm text and a day-of reminder with a one-tap cancel/rebook link, so dead tables become open inventory you can refill.",
        metric: "No-shows down ~40%",
      },
      {
        title: "Reviews and socials on autopilot",
        body: "Drafted responses to every review for one-tap approval, plus a weekly batch of post drafts from your specials - you approve, it publishes.",
        metric: "3 hrs/week back",
      },
    ],
    build: {
      business: "Family restaurant, Mississauga",
      problem: "Phone went unanswered through every dinner rush; reservations went to voicemail.",
      automation:
        "AI host answers, books into the reservation system, and texts the manager anything unusual.",
      result: "30+ calls/month captured",
    },
    faq: [
      {
        q: "What does this cost for a single-location restaurant?",
        a: "Fixed packages from $395/month, setup included. The phone-answering build is usually the fastest payback: a handful of saved bookings covers it.",
      },
      {
        q: "Does it work with OpenTable or my reservation system?",
        a: "Yes - OpenTable, Resy, Libro, and most booking systems connect directly. If you run on a paper book, we will set up something simple as part of the build.",
      },
      {
        q: "Can the AI handle a complicated caller?",
        a: "It handles the routine 80 percent - bookings, hours, menu, directions - and passes anything else to a human immediately, with a text summary so your team has context.",
      },
      {
        q: "How long does setup take?",
        a: "Phone answering inside a week. Reminders and review automation, one to two weeks. Nothing goes live until you have heard it and tested it yourself.",
      },
    ],
    metaDescription:
      "AI automation for restaurants: reservation calls answered 24/7, no-show reminders, and review responses on autopilot. Fixed prices from $395/month.",
  },
  {
    slug: "salons-spas",
    segment: "local",
    name: "Salons & spas",
    cardLine: "No-shows cut in half, bookings taken mid-cut, lapsed clients won back.",
    headline: "Your chairs stay full. Your evenings stay yours.",
    subhead:
      "Reminders that actually stop no-shows, bookings taken while your hands are busy, and lapsed clients invited back automatically. More time behind the chair, less on the phone.",
    pains: [
      {
        title: "No-shows leave chairs empty and stylists idle",
        body: "Four no-shows a week at $80 each is over $16,000 a year - walking out the door because a reminder text did not go out.",
      },
      {
        title: "Calls and DMs land while your hands are busy",
        body: "You are mid-colour and the phone rings. Instagram DMs pile up between clients. Every slow reply is a booking that drifted to another salon.",
      },
      {
        title: "Regulars quietly stop coming",
        body: "The client who came every six weeks has not been in for four months. Nobody noticed, because nobody was counting.",
      },
    ],
    automations: [
      {
        title: "A reminder ladder that ends no-shows",
        body: "Confirm at booking, reminder at 7 days, 24 hours, and 2 hours, each with one-tap reschedule. Cancelled slots get offered to your waitlist automatically.",
        metric: "No-shows down 30-60%",
      },
      {
        title: "Bookings taken while you work",
        body: "An AI receptionist answers calls and messages, checks real availability, and books clients in - while you stay with the client in the chair.",
        metric: "Books while you're mid-cut",
      },
      {
        title: "Win-back campaigns for lapsed clients",
        body: "Anyone overdue by their usual rhythm gets a friendly nudge from you with a booking link - automatically, at the right moment.",
        metric: "8-12% of lapsed clients rebook",
      },
    ],
    build: {
      business: "Hair salon, two locations",
      problem:
        "No-shows ran 4 to 6 per week per location; confirmation texts were sent by hand when staff had time.",
      automation:
        "Automatic reminder ladder with one-tap reschedule links, plus waitlist autofill for cancellations.",
      result: "No-shows down roughly half",
    },
    faq: [
      {
        q: "What does it cost?",
        a: "Fixed packages from $395/month, setup included. The reminder ladder usually pays for itself with the first two or three prevented no-shows.",
      },
      {
        q: "Does it work with Fresha, Square Appointments, or Jane?",
        a: "Yes, all three, plus most other booking systems. We connect to what you already use - your clients book the same way they always have.",
      },
      {
        q: "Will automated messages feel impersonal to my regulars?",
        a: "Messages go out in your name and your voice, and you set the tone. Most clients experience it as the salon being more on top of things, not less personal.",
      },
      {
        q: "What if a client replies to a reminder with a question?",
        a: "Simple questions get answered automatically; anything else is forwarded to you or your front desk with the full context.",
      },
    ],
    metaDescription:
      "AI automation for salons and spas: reminder ladders that cut no-shows 30-60%, bookings taken while you work, and lapsed-client win-backs. From $395/month.",
  },
  {
    slug: "medical-clinics",
    segment: "practice",
    name: "Medical clinics",
    cardLine: "Fewer no-shows, intake without re-typing, after-hours calls captured.",
    headline: "Less admin between you and your patients.",
    subhead:
      "Reminders and waitlists that keep the schedule full, intake that flows into your EMR without re-typing, and after-hours inquiries answered safely. PIPEDA/PHIPA-aware by design.",
    pains: [
      {
        title: "No-shows burn clinical hours you staffed for",
        body: "Every unfilled slot is a clinician and room you paid for. At typical rates, a clinic losing 8 to 10 slots a week is losing thousands of dollars a month.",
      },
      {
        title: "Paper intake means everything is typed twice",
        body: "Patients fill out forms on a clipboard; your staff re-type them into the EMR. Ten minutes per patient, plus the transcription errors that follow them through their chart.",
      },
      {
        title: "After-hours callers reach voicemail",
        body: "Patients call at 8 p.m. to book, reschedule, or ask a simple question. Voicemail answers. Some of them do not call back.",
      },
    ],
    automations: [
      {
        title: "Reminders and waitlist autofill",
        body: "A reminder sequence with easy confirm/reschedule, and automatic waitlist offers when slots open - so cancellations become filled appointments instead of gaps.",
        metric: "$3,000-$8,000/month in recovered slots",
      },
      {
        title: "Digital intake straight into the EMR",
        body: "Patients complete intake before arriving; answers and document photos (health cards, insurance) land in the chart as structured data. Staff review exceptions, not everything.",
        metric: "~12-15 min saved per patient",
      },
      {
        title: "After-hours answering, triage-safe",
        body: "An after-hours line answers questions, books and reschedules non-urgent visits, and follows your script for anything urgent - directing callers appropriately, never improvising medical advice.",
        metric: "Every inquiry captured",
      },
    ],
    build: {
      business: "Medical clinic, North York",
      problem:
        "Front desk re-typed every paper intake form; after-hours callers reached voicemail.",
      automation:
        "Digital intake feeds the EMR directly; an after-hours line answers questions and books non-urgent visits.",
      result: "~12 min saved per patient",
    },
    faq: [
      {
        q: "How do you handle patient privacy and PHIPA?",
        a: "We design for PIPEDA and PHIPA from the start: minimal collection, processing inside your EMR and existing systems wherever possible, Canadian data residency where required, and no patient records stored by us without a signed agreement. You get the data-flow diagram in plain English before we build.",
      },
      {
        q: "Will the after-hours line give medical advice?",
        a: "No. It answers administrative questions, books non-urgent appointments, and follows your clinic's script for anything urgent - including directing callers to emergency services when your protocol says so.",
      },
      {
        q: "What does an engagement cost?",
        a: "Clinic builds are custom: typical engagements run $7,500 to $25,000 depending on scope, with monitoring and support from $750/month. The audit is free and you get the scoped quote before deciding anything.",
      },
      {
        q: "Does it work with our EMR?",
        a: "We work with most Canadian EMRs - directly where there is an API, and through compliant structured workflows where there is not. We will confirm the integration path during the audit, before any commitment.",
      },
    ],
    metaDescription:
      "PIPEDA/PHIPA-aware automation for medical clinics: no-show reduction, digital intake into your EMR, and after-hours answering. Custom builds, free audit.",
  },
  {
    slug: "dental-offices",
    segment: "practice",
    name: "Dental offices",
    cardLine: "Hygiene recalls that fill themselves, insurance prep, intake before arrival.",
    headline: "A full schedule without the front-desk grind.",
    subhead:
      "Recall and reminder automation that keeps hygiene booked, insurance verification prepped before the patient sits down, and new-patient paperwork done before they arrive.",
    pains: [
      {
        title: "Hygiene recalls go out when staff have time - so they don't",
        body: "Every overdue recall is a cleaning that did not happen and production that did not occur. Manual recall lists lose to the front desk's other forty jobs every day.",
      },
      {
        title: "Insurance verification eats the morning",
        body: "Checking coverage, predeterminations, and limits patient by patient - 30 to 60 minutes a day of phone-and-portal work before treatment can even be discussed confidently.",
      },
      {
        title: "New patients spend their first visit on a clipboard",
        body: "Medical history, insurance details, consents - filled out in the waiting room, re-typed by staff, and rushed when the schedule is behind.",
      },
    ],
    automations: [
      {
        title: "Recall sequences that fill hygiene",
        body: "Patients are invited by due date automatically - text and email, with self-booking into real availability and escalating nudges for the overdue.",
        metric: "20-35% more hygiene rebookings",
      },
      {
        title: "Insurance verification prep",
        body: "Tomorrow's patients are checked against portals and records overnight; your treatment coordinator starts the day with a coverage summary instead of a phone queue.",
        metric: "45 min/day back",
      },
      {
        title: "New-patient intake before arrival",
        body: "Forms, history, and insurance photos completed at home, landing in your practice software as structured data. The first visit starts with dentistry, not paperwork.",
        metric: "~15 min saved per new patient",
      },
    ],
    build: {
      business: "Dental office, Etobicoke",
      problem: "Hygiene recalls went out by hand when staff had time, so they mostly did not.",
      automation:
        "Recall sequences run automatically by due date, with reminders and easy rebooking.",
      result: "28% more hygiene rebookings",
    },
    faq: [
      {
        q: "How is patient data handled?",
        a: "PIPEDA/PHIPA-aware by design: we work inside your practice management software wherever possible, store no patient records without a signed agreement, and document the data flow before building.",
      },
      {
        q: "Does this work with Dentrix, ABELDent, or our PMS?",
        a: "We integrate with most practice management systems - via API where available, via compliant structured workflows where not. The integration path is confirmed in the free audit.",
      },
      {
        q: "What is the investment?",
        a: "Custom builds typically run $7,500 to $25,000 depending on scope, with support from $750/month. Recall automation alone usually shows up in hygiene production within the first two months.",
      },
      {
        q: "Will recall messages annoy patients?",
        a: "Sequences are spaced, polite, and stop the moment someone books or opts out. Practices consistently find patients respond well - a recall text is easier to act on than a missed phone call.",
      },
    ],
    metaDescription:
      "Automation for dental offices: hygiene recall sequences, overnight insurance verification prep, and digital new-patient intake. PIPEDA/PHIPA-aware. Free audit.",
  },
  {
    slug: "law-firms",
    segment: "practice",
    name: "Law firms",
    cardLine: "After-hours intake captured, documents summarized, follow-ups billed not chased.",
    headline: "Bill more hours. Chase fewer.",
    subhead:
      "Potential clients answered the moment they reach out - including at 9 p.m. - intake and documents handled without paralegal hours, and follow-ups that run themselves. Confidentiality-first.",
    pains: [
      {
        title: "After-hours inquiries retain whoever answers first",
        body: "Someone searching for a lawyer at night is in a decision moment. If your firm responds Monday and another firm responds in five minutes, the retainer follows the five minutes.",
      },
      {
        title: "Intake and conflict checks consume billable time",
        body: "Qualifying the matter, collecting details, running the conflict check, scheduling the consult - an hour of admin scattered across people who bill by the hour.",
      },
      {
        title: "Unbilled follow-up work piles up",
        body: "Chasing documents from clients, nudging unpaid invoices, confirming consults - necessary work nobody can bill, done late or not at all.",
      },
    ],
    automations: [
      {
        title: "24/7 inquiry intake and qualification",
        body: "Every call and web inquiry is answered immediately. A qualification script collects matter type, urgency, and contact details, books qualified consults into open slots, and flags conflicts for review.",
        metric: "First response in under 2 min",
      },
      {
        title: "Document intake and summarization",
        body: "Clients upload documents through a secure link; files are organized to the matter and summarized for first review, with key dates and parties extracted.",
        metric: "3-5 paralegal hrs/week back",
      },
      {
        title: "Follow-up sequences for consults and invoices",
        body: "Document requests, consult confirmations, and invoice reminders run automatically in the firm's voice - persistent, professional, and logged.",
        metric: "Faster payment, fewer write-offs",
      },
    ],
    build: {
      business: "Family law firm, downtown",
      problem:
        "Evening and weekend inquiries waited until Monday; several prospects retained other counsel first.",
      automation:
        "24/7 intake answers, runs a conflict-safe qualification script, and books consults into open slots.",
      result: "First response in under 2 min",
    },
    faq: [
      {
        q: "How do you handle confidentiality and privilege?",
        a: "Intake scripts collect only what qualification requires, client documents move through secure, access-controlled channels, and nothing is stored by us without a signed agreement. We will walk your managing partner through the data flow before anything is built.",
      },
      {
        q: "Will an automated intake put off potential clients?",
        a: "The opposite, in practice: they get an immediate, competent response instead of voicemail. The script identifies itself, gathers the essentials respectfully, and a human follows up fast.",
      },
      {
        q: "What does an engagement cost?",
        a: "Custom builds typically run $7,500 to $25,000 depending on scope, with support from $750/month. One additional retained matter usually covers the intake build on its own.",
      },
      {
        q: "Does it integrate with Clio?",
        a: "Yes - Clio, Clio Grow, and most practice management platforms. Qualified leads, consults, and documents land where your team already works.",
      },
    ],
    metaDescription:
      "Automation for law firms: 24/7 inquiry intake and qualification, document summarization, and follow-up sequences. Confidentiality-first. Free audit.",
  },
] as const;

export function industryBySlug(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}

export function industriesBySegment(segment: Segment): Industry[] {
  return industries.filter((i) => i.segment === segment);
}
