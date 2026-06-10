/**
 * What: The six service offerings - index cards plus full detail-page content.
 * Why: Services are the "what we automate" engine; typed content keeps /services and
 *      /services/[slug] in sync and trivially editable.
 * How: One Service interface; pages statically generate from this array. relatedIndustries
 *      holds industry slugs and must match content/industries.ts.
 * From Where: TheSkillCorner marketing site build brief (services list), 2026-06.
 * When: 2026-06; revisit when the service catalogue changes.
 */

import type { FaqItem } from "./faq";

export interface Service {
  slug: string;
  name: string;
  title: string;
  excerpt: string;
  problem: string;
  whatWeBuild: string[];
  tools: string[];
  timeline: string;
  outcome: string;
  faq: FaqItem[];
  relatedIndustries: string[];
}

export const services: readonly Service[] = [
  {
    slug: "ai-receptionist",
    name: "AI receptionist",
    title: "Never miss another call",
    excerpt:
      "An AI receptionist that answers every call and inquiry - hours, prices, bookings, messages - 24/7, and texts you anything that needs a human.",
    problem:
      "Calls land while you are serving someone, after closing, or during the rush. Voicemail converts almost nobody: most callers hang up and try the next place. For a business taking 20 to 40 calls a week, even two missed jobs a month is real money.",
    whatWeBuild: [
      "A phone and web-chat receptionist that greets callers, answers your common questions (hours, prices, directions, availability), and never puts anyone on hold",
      "Booking and message-taking wired into your calendar or booking system, so callers get a slot instead of a callback promise",
      "Urgent-call rules: anything matching your escalation list rings through to a human immediately",
      "A text or email summary of every conversation, so you always know what happened",
    ],
    tools: ["Twilio", "Your existing phone number", "Cal.com / your booking system", "Claude API"],
    timeline: "3 to 7 days to live",
    outcome:
      "Every call answered in two rings, around the clock. Owners typically capture 20 to 40 previously missed calls a month, and callers get answers in seconds instead of voicemail.",
    faq: [
      {
        q: "Will it sound like a robot?",
        a: "It sounds natural, speaks your scripts in your tone, and discloses that it is an assistant. Anything it cannot handle goes straight to a human - it never bluffs.",
      },
      {
        q: "What about emergencies or angry callers?",
        a: "You define escalation rules. Calls matching them (your keywords, repeated calls, distress) ring through to a real phone immediately, day or night.",
      },
      {
        q: "Do I have to change my phone number?",
        a: "No. We forward your existing number, and you can turn forwarding off any time.",
      },
    ],
    relatedIndustries: ["convenience-stores", "restaurants", "medical-clinics", "law-firms"],
  },
  {
    slug: "booking-and-reminders",
    name: "Booking & reminders",
    title: "Fill the calendar. Kill the no-shows.",
    excerpt:
      "Online booking plus an automatic reminder ladder with one-tap reschedule links - the single fastest fix for no-shows.",
    problem:
      "No-shows are not a discipline problem, they are a reminder problem. A practice losing five slots a week at $150 each is losing close to $40,000 a year - and most of it comes back with a properly timed reminder sequence.",
    whatWeBuild: [
      "Online booking connected to your real availability, so clients book without calling",
      "A reminder ladder by text and email - typically 7 days, 24 hours, and 2 hours out - with one-tap confirm and reschedule links",
      "Waitlist autofill: when someone cancels, the next person on the list gets offered the slot automatically",
      "No-show tracking so you can see the number actually drop",
    ],
    tools: ["Cal.com", "Jane", "Fresha", "Square Appointments", "Twilio SMS"],
    timeline: "1 to 2 weeks to live",
    outcome:
      "Businesses running the full ladder typically cut no-shows by 30 to 60 percent in the first month, and cancelled slots refill themselves from the waitlist.",
    faq: [
      {
        q: "My booking system already sends one reminder. Is this different?",
        a: "Yes. One email the day before is the minimum, not a system. The ladder (multiple touches, SMS, one-tap reschedule, waitlist refill) is what moves the number.",
      },
      {
        q: "Will my clients find automated texts annoying?",
        a: "Reminders are short, branded as you, and easy to opt out of. In practice clients prefer them - missing an appointment is worse for them too.",
      },
    ],
    relatedIndustries: ["salons-spas", "dental-offices", "medical-clinics", "restaurants"],
  },
  {
    slug: "intake-and-documents",
    name: "Intake & documents",
    title: "Paperwork that fills itself in",
    excerpt:
      "Digital intake forms and document extraction that put information where it belongs - without anyone re-typing it.",
    problem:
      "Someone fills a form out by hand; someone on your staff types it into the system; someone later fixes the typo. Intake, referrals, insurance cards, IDs, contracts - the same data entered two or three times, at 10 to 20 minutes per client.",
    whatWeBuild: [
      "Digital intake forms sent before the visit, feeding answers straight into your records system",
      "Document extraction: photos or scans of IDs, insurance cards, and referrals become structured fields automatically",
      "Validation rules that flag anything suspicious for a human instead of guessing",
      "An exceptions inbox so staff review the 5 percent that needs judgment, not the 95 percent that does not",
    ],
    tools: [
      "Claude API (structured extraction)",
      "Your EMR / PMS / CRM",
      "Jotform / Typeform",
      "Make or n8n",
    ],
    timeline: "2 to 4 weeks to live",
    outcome:
      "Staff stop re-typing. Records get more accurate, not less. A practice intaking 10 new patients or clients a week typically gets back 8 to 12 staff hours.",
    faq: [
      {
        q: "Is this safe for medical or legal documents?",
        a: "This is exactly where the compliance design matters. We process inside your systems where possible, store nothing without a signed agreement, and walk through the data flow with you in plain English before building.",
      },
      {
        q: "What if the extraction gets something wrong?",
        a: "Low-confidence fields are flagged for human review rather than auto-filled. The system is designed to hand judgment calls to people, not hide them.",
      },
    ],
    relatedIndustries: ["medical-clinics", "dental-offices", "law-firms"],
  },
  {
    slug: "reviews-and-reputation",
    name: "Reviews & reputation",
    title: "Every review answered. Every time.",
    excerpt:
      "Review monitoring, drafted responses in your voice, and automatic review requests after every visit.",
    problem:
      "Unanswered reviews cost twice: the unhappy customer stays unhappy in public, and the next hundred people who read the page see that you did not respond. Meanwhile your happiest customers were never asked to leave a review at all.",
    whatWeBuild: [
      "Monitoring across Google, Yelp, and the platforms that matter for your business",
      "Drafted responses in your voice, queued for one-tap approval - or auto-published for straightforward five-star thank-yous",
      "Post-visit review requests by text, timed and worded to actually get clicked",
      "A monthly snapshot: rating trend, volume, and the themes customers keep mentioning",
    ],
    tools: ["Google Business Profile", "Yelp", "Twilio SMS", "Claude API"],
    timeline: "Under a week to live",
    outcome:
      "Every review gets a response within a day, and steady review requests typically double monthly review volume within a quarter - which moves where you rank on the map.",
    faq: [
      {
        q: "Will the responses sound canned?",
        a: "No. Each response is drafted against the actual review in your tone, and you approve anything sensitive before it posts.",
      },
      {
        q: "Can it handle a bad review?",
        a: "It drafts a calm, professional response and always routes negative reviews to you for approval first. You stay in control of anything with teeth.",
      },
    ],
    relatedIndustries: ["restaurants", "salons-spas", "convenience-stores"],
  },
  {
    slug: "follow-up-automation",
    name: "Follow-up & CRM",
    title: "Follow-ups that never slip",
    excerpt:
      "Every lead, quote, and lapsed customer gets followed up automatically - so revenue stops leaking out of your inbox.",
    problem:
      "Most businesses do not lose deals to competitors; they lose them to silence. The quote that was never chased, the consult that never got a second email, the regular who quietly stopped coming. None of it is hard - there is just no system doing it.",
    whatWeBuild: [
      "Lead capture from your website, phone, and inbox into one place automatically",
      "Follow-up sequences for quotes, estimates, and consultations - polite, persistent, and in your voice",
      "Win-back campaigns for customers, patients, or clients who have lapsed",
      "Alerts when someone replies or a lead goes hot, so a human takes over at the right moment",
    ],
    tools: ["HubSpot", "Mailchimp", "Clio Grow", "Your inbox", "Make or n8n"],
    timeline: "1 to 3 weeks to live",
    outcome:
      "Nothing waits on someone remembering. Businesses typically see 10 to 20 percent of stalled quotes close after a proper sequence, and win-back campaigns reliably rebook 8 to 12 percent of lapsed customers.",
    faq: [
      {
        q: "I do not have a CRM. Is that a problem?",
        a: "No - we can start from a shared inbox and a spreadsheet, or set up a lightweight CRM as part of the build. The sequence matters more than the software.",
      },
      {
        q: "Will my clients feel spammed?",
        a: "Sequences are short, spaced, and stop the moment someone replies or books. The goal is to sound like a conscientious human, because that is what it replaces.",
      },
    ],
    relatedIndustries: ["law-firms", "salons-spas", "dental-offices"],
  },
  {
    slug: "reporting-dashboards",
    name: "Reporting dashboards",
    title: "Your numbers, every Monday morning",
    excerpt:
      "Sales, bookings, no-shows, and margins pulled from your tools into one dashboard or a weekly email - no spreadsheet building.",
    problem:
      "The numbers exist - in the POS, the booking system, the accounting software - but pulling them together takes an evening you do not have. So decisions get made on gut feel, and problems show up weeks after they started.",
    whatWeBuild: [
      "Automatic pulls from your POS, booking system, and accounting software",
      "One live dashboard, or a plain-English summary emailed every Monday morning",
      "Alerts for the numbers you care about: margin dips, no-show spikes, unusually slow weeks",
      "Per-location breakdowns if you run more than one site",
    ],
    tools: ["Looker Studio", "Google Sheets", "QuickBooks", "Square / Clover", "Make or n8n"],
    timeline: "1 to 2 weeks to live",
    outcome:
      "You open one email and know how the business is doing. Owners typically spot one margin or staffing problem in the first month that pays for the dashboard by itself.",
    faq: [
      {
        q: "I am not a numbers person. Will I actually use this?",
        a: "That is who it is for. The Monday email is written in sentences, not pivot tables: what went up, what went down, and what to look at.",
      },
      {
        q: "Can it include my accountant's reports?",
        a: "Yes - QuickBooks and most accounting tools connect directly, and we can give your accountant read access.",
      },
    ],
    relatedIndustries: ["convenience-stores", "restaurants", "medical-clinics"],
  },
] as const;

export function serviceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
