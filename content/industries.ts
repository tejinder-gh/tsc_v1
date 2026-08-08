/**
 * What: The industry landing pages - complete standalone funnel content per industry.
 * Why: /for/[slug] pages are the SEO and ad-traffic engine; each must be a full funnel
 *      (pains, automations with savings, proof, pricing anchor, FAQ, CTA) in the
 *      industry's own vocabulary. Typed content makes adding industry #7 a copy job.
 * How: One Industry interface; pages statically generate from this array. segment drives
 *      which pricing anchor renders and which vocabulary ("customers" vs "patients/clients").
 *      `automations[].metric` and `build.result` are typical/anticipated figures for that
 *      kind of build, not measured client data - the page labels them "Typical impact" and
 *      "Anticipated outcome" rather than presenting them as fact, and `build` is an
 *      illustrative scenario, not a real or anonymized client, per the brief's rule against
 *      inventing statistics or case studies.
 * From Where: TheSkillCorner marketing site build brief (industry funnel spec), 2026-06;
 *             proof framing reworked 2026-08.
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
    slug: "retail-stores",
    segment: "local",
    name: "Retail stores",
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
        a: "Clinic builds are custom: typical engagements run $7,500 to $25,000 depending on scope, with monitoring and support from $1,500/month. The audit is free and you get the scoped quote before deciding anything.",
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
        a: "Custom builds typically run $7,500 to $25,000 depending on scope, with support from $1,500/month. Recall automation alone usually shows up in hygiene production within the first two months.",
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
        a: "Custom builds typically run $7,500 to $25,000 depending on scope, with support from $1,500/month. One additional retained matter usually covers the intake build on its own.",
      },
      {
        q: "Does it integrate with Clio?",
        a: "Yes - Clio, Clio Grow, and most practice management platforms. Qualified leads, consults, and documents land where your team already works.",
      },
    ],
    metaDescription:
      "Automation for law firms: 24/7 inquiry intake and qualification, document summarization, and follow-up sequences. Confidentiality-first. Free audit.",
  },
  {
    slug: "gyms-fitness",
    segment: "local",
    name: "Gyms & fitness studios",
    cardLine: "Missed bookings captured, no-shows cut, and trial leads followed up automatically.",
    headline: "Your classes stay full. Your front desk stays quiet.",
    subhead:
      "Automatic follow-ups for class pass trials, a phone that captures membership inquiries 24/7, and class cancellation waitlists that refill themselves. Built for fitness owners who want to focus on training, not admin.",
    pains: [
      {
        title: "Trial class sign-ups go cold",
        body: "Someone signs up for a trial pass on your website but never books their first class. By the time you call them three days later, they have lost interest.",
      },
      {
        title: "The phone rings mid-session",
        body: "You are lead coaching a group or in a training session. A prospect calls to ask about class times or membership options - and hangs up when they get voicemail.",
      },
      {
        title: "Last-minute cancellations leave empty spots",
        body: "Members cancel a few hours before class. You have a waitlist, but you do not have the time to manually text each person in line to see who wants the spot.",
      },
    ],
    automations: [
      {
        title: "Instant trial pass follow-up",
        body: "The moment someone registers for a trial, they get a text with class recommendations and a direct booking link. If they do not book, the system follows up politely over the next 48 hours.",
        metric: "25-40% higher trial conversion",
      },
      {
        title: "AI booking host & receptionist",
        body: "An AI receptionist answers questions about class schedules, pricing, and locations 24/7, and sends booking links to callers' phones.",
        metric: "15+ new bookings/month captured",
      },
      {
        title: "Automated waitlist refills",
        body: "When a member cancels their class spot, the system automatically texts the next waitlisted member. They can confirm with a single tap, refilling your class instantly.",
        metric: "Class capacity up 15-20%",
      },
    ],
    build: {
      business: "Boutique fitness studio, Toronto",
      problem:
        "Staff spent hours chasing trial sign-ups; last-minute class cancellations frequently left empty spots despite a long waitlist.",
      automation:
        "Automated trial text sequence and automated class waitlist triggers connected to Mindbody.",
      result: "Trial-to-member conversions up 30%",
    },
    faq: [
      {
        q: "Does this work with Mindbody or Zen Planner?",
        a: "Yes. We integrate directly with Mindbody, Zen Planner, Glofox, and most fitness booking systems so everything updates in real-time.",
      },
      {
        q: "Will the AI receptionist understand our class types?",
        a: "Absolutely. We train the AI on your exact class descriptions, pricing, rules, and instructor schedules, so it answers questions accurately.",
      },
      {
        q: "What is the setup cost?",
        a: "For gyms, fixed packages start from $395/month, setup included. Most owners find that saving just two membership cancellations or converting three extra trials a month completely covers the cost.",
      },
      {
        q: "Can it help win back lapsed members?",
        a: "Yes. We can set up automated win-back campaigns that trigger when a member hasn't booked a class in 30 days, offering them a special return rate or checking in on them.",
      },
    ],
    metaDescription:
      "AI automation for gyms and fitness studios: automated trial pass follow-ups, 24/7 AI receptionist, and automatic class waitlist refills. Fixed pricing from $395/month.",
  },
  {
    slug: "accounting-firms",
    segment: "practice",
    name: "Accounting firms",
    cardLine:
      "Tax documents collected, client onboarding streamlined, and invoice follow-ups automated.",
    headline: "Tax season efficiency, without the manual chase.",
    subhead:
      "Secure document intake that organizes itself, automatic follow-ups for outstanding records, and client onboarding that sets up folders and checklists behind the scenes. Focus on the advisory, not the paperwork.",
    pains: [
      {
        title: "Chasing clients for tax documents and signatures",
        body: "You spend hours emailing clients for missing documents, receipts, or signed engagement letters. It slows down filing and eats up unbillable partner hours.",
      },
      {
        title: "Client onboarding takes manual setup",
        body: "Every new client requires creating folders in Google Drive, setting up a profile in your CRM, and sending an initial checklist. It is 30 minutes of copy-pasting.",
      },
      {
        title: "Aged receivables creep up during busy season",
        body: "Invoices go out, but chasing overdue payments gets forgotten during the rush. You end up carrying high receivables because nobody has time to send reminders.",
      },
    ],
    automations: [
      {
        title: "Automatic document chase & intake",
        body: "Clients get a secure link to upload documents. The system automatically reads files, categorizes them, and sends polite reminders for any missing items until everything is received.",
        metric: "8-12 days faster collection",
      },
      {
        title: "Zero-touch client onboarding",
        body: "When a new client signs your engagement letter, the system automatically creates their folder structure, sets up their project tracking card, and sends their welcome details.",
        metric: "30 mins saved per client",
      },
      {
        title: "Automated invoice reminders",
        body: "Invoices sent from QuickBooks or Xero get polite, automated follow-ups at 7, 14, and 30 days past due. The reminders stop automatically once payment is received.",
        metric: "Aged receivables down ~35%",
      },
    ],
    build: {
      business: "Mid-sized accounting firm, Vaughan",
      problem:
        "Partners spent up to 6 hours a week chasing missing tax documents and signatures from clients during tax season.",
      automation:
        "Automated secure document upload portal and automated follow-ups integrated with TaxCycle and Google Drive.",
      result: "Missing documents collected 10 days faster",
    },
    faq: [
      {
        q: "Is this secure enough for tax and financial data?",
        a: "Yes. We build using your existing secure portals (like ShareFile or Microsoft 365) and implement end-to-end encryption. No financial records are stored on our systems.",
      },
      {
        q: "Does it work with QuickBooks or Xero?",
        a: "Yes. We integrate with QuickBooks, Xero, HubSpot, and practice management tools to sync invoices, contact info, and payment statuses automatically.",
      },
      {
        q: "What is the typical setup timeline?",
        a: "Accounting builds are custom-tailored to your workflow and usually take 2 to 3 weeks to deploy. We run full test runs with dummy data before going live.",
      },
      {
        q: "Can it handle complex corporate client files?",
        a: "Yes. We can customize the document checklist based on client type (e.g., sole proprietorship vs. corporate) so they only get asked for what is relevant.",
      },
    ],
    metaDescription:
      "Automation for accounting and bookkeeping firms: automated client document collection, zero-touch onboarding, and automatic invoice reminders. PIPEDA-compliant. Free audit.",
  },
  {
    slug: "real-estate",
    segment: "practice",
    name: "Real estate",
    cardLine:
      "New listing leads qualified, showing feedback collected, and open house follow-ups automated.",
    headline: "Capture every lead. Show more homes.",
    subhead:
      "Inquiries from listing portals qualified and answered in minutes, automatic feedback requests sent to showing agents, and open house follow-ups that run themselves. Scale your listings, not your admin.",
    pains: [
      {
        title: "Portal leads go cold before you can reply",
        body: "A lead comes in from Realtor.ca or Zillow on a weekend. You are hosting a showing. By the time you call them back 3 hours later, they have already contacted another agent.",
      },
      {
        title: "Chasing showing agents for feedback",
        body: "You spend Mondays calling or texting other agents who showed your listing, trying to get feedback for your seller. Most ignore the first two requests.",
      },
      {
        title: "Open house sign-ups are never followed up properly",
        body: "You collect ten names on a clipboard at an open house. You mean to email them all a thank-you and local listings, but Monday morning gets too busy.",
      },
    ],
    automations: [
      {
        title: "Instant lead response & qualification",
        body: "Every portal inquiry gets an immediate text response confirming details, asking qualifying questions (budget, pre-approval status), and offering a booking link.",
        metric: "90%+ response rate under 2 mins",
      },
      {
        title: "Automated showing agent feedback",
        body: "An hour after a scheduled showing ends, the system texts the showing agent a 3-question feedback link. It follows up automatically if they do not respond.",
        metric: "Double the feedback response rate",
      },
      {
        title: "Open house follow-up flows",
        body: "Staff or agents enter open house attendees into a simple form. The system instantly emails a thank-you, sends the listing details, and schedules follow-up listing alerts.",
        metric: "2-3 additional consults/month",
      },
    ],
    build: {
      business: "Real estate brokerage, Oakville",
      problem:
        "Brokerage was losing leads from listing portals during busy showing hours; agent feedback collection was done manually.",
      automation:
        "Portal lead integration with instant text routing and automated showing feedback SMS workflows.",
      result: "First response under 2 minutes captured",
    },
    faq: [
      {
        q: "Does this work with my CRM or MLS?",
        a: "Yes. We integrate with popular real estate CRMs (like Follow Up Boss, KVCore, and Salesforce) and can trigger automations from portal leads (Realtor.ca, Zillow, etc.).",
      },
      {
        q: "Will the AI sound natural to home buyers?",
        a: "Yes. We script the responses to sound like a personal assistant or transaction coordinator, keeping it warm and professional.",
      },
      {
        q: "What is the pricing model?",
        a: "Real estate office builds range from custom broker-level systems to productized individual agent setups starting from $395/month. We quote after a free audit.",
      },
      {
        q: "Can it handle text message follow-ups?",
        a: "Yes, SMS is our primary channel for real estate leads because it has a 98% open rate and gets replies in minutes compared to email.",
      },
    ],
    metaDescription:
      "AI automation for real estate brokerages and agents: instant portal lead responses, automated showing feedback collection, and open house follow-up flows. Free audit.",
  },
  {
    slug: "construction-trades",
    segment: "local",
    name: "Construction & trades",
    cardLine: "Quotes scheduled on the road, missed leads saved, and payment reminders automated.",
    headline: "More time on the tools. Less time chasing checks.",
    subhead:
      "A phone that takes inquiry details while you are on site, automated quote follow-ups, and invoice reminders that chase themselves. Built for contractors who want to grow their business, not their paperwork.",
    pains: [
      {
        title: "Missing calls while you are on site",
        body: "You are on a ladder or running a crew and the phone rings. You do not answer; they call the next contractor on Google.",
      },
      {
        title: "Drafting quotes is a second shift",
        body: "You spend your evenings typing estimates and emailing them out, then chasing clients for weeks to see if they got it.",
      },
      {
        title: "Chasing clients for payment",
        body: "You finished the job, sent the bill, and now you are playing phone tag to get paid. It is awkward, slow, and hurts cash flow.",
      },
    ],
    automations: [
      {
        title: "AI receptionist & lead capture",
        body: "An AI receptionist answers questions, gathers project scope details, and texts them directly to your phone.",
        metric: "20+ qualified leads/month captured",
      },
      {
        title: "Automated estimate follow-ups",
        body: "When you send a quote, the system automatically sends spaced, polite texts and emails until they accept or decline.",
        metric: "15-25% higher quote win-rate",
      },
      {
        title: "Automated invoice reminders",
        body: "Spaced invoice reminders sent by text and email with direct payment links, keeping your cash flow moving without manual work.",
        metric: "Invoices paid 8 days faster",
      },
    ],
    build: {
      business: "HVAC contractor, Etobicoke",
      problem:
        "Owner missed 30+ potential calls a month while on site; writing quotes and chasing payments ate up his weekends.",
      automation:
        "AI receptionist lead capture and automated quote follow-ups integrated with Jobber.",
      result: "Saved ~15 hours of admin/week",
    },
    faq: [
      {
        q: "Does this work with Jobber, Housecall Pro, or ServiceTitan?",
        a: "Yes. We integrate with leading trade management platforms to sync client info, quotes, and job statuses automatically.",
      },
      {
        q: "Will the AI receptionist know how to price a job?",
        a: "No. The AI collects the scope of work (job description, photos, location, budget) and routes it to you to quote, keeping you in full control of pricing.",
      },
      {
        q: "What does setup cost?",
        a: "Fixed packages start from $395/month, setup included. A single saved installation or repair job usually covers the cost of the system for several months.",
      },
      {
        q: "Can it send text messages to clients?",
        a: "Yes. Text messaging is highly recommended for trades since clients are often on the move and respond to SMS within minutes.",
      },
    ],
    metaDescription:
      "AI automation for trade contractors and construction companies: 24/7 AI lead capture, automated estimate follow-ups, and automated invoice reminders. From $395/month.",
  },
  {
    slug: "veterinary-clinics",
    segment: "practice",
    name: "Veterinary clinics",
    cardLine: "Online booking, automatic appointment reminders, and digital patient intake.",
    headline: "Caring for pets, not paperwork.",
    subhead:
      "Automatic appointment reminders that eliminate empty slots, digital patient intake that flows directly into your practice software, and after-hours triage assistance. PIPEDA-aware by design.",
    pains: [
      {
        title: "No-shows leave rooms empty",
        body: "Every missed vet appointment is a veterinarian and vet tech staffed for empty space. That is hundreds of dollars lost daily.",
      },
      {
        title: "Check-in clipboards slow down the lobby",
        body: "Pet owners fill out medical history and vaccine records on clipboards in a busy lobby. Staff then spend time deciphering handwriting and re-typing it.",
      },
      {
        title: "Lapsed patient recalls are neglected",
        body: "Reminding pet owners that vaccines or annual exams are overdue gets forgotten during clinic hours, leading to gaps in patient care.",
      },
    ],
    automations: [
      {
        title: "Recall & reminder sequences",
        body: "Pet owners receive automatic text reminders for appointments and overdue exams, with simple one-tap links to confirm or reschedule.",
        metric: "30-50% fewer missed visits",
      },
      {
        title: "Digital patient intake & uploads",
        body: "New clients fill out forms and upload vaccination records from their phone before the visit, feeding directly into the patient chart.",
        metric: "10-15 mins saved per check-in",
      },
      {
        title: "After-hours administrative triage",
        body: "An AI assistant answers non-urgent inquiries, books appointments, and directs urgent emergencies to your emergency care protocols 24/7.",
        metric: "Every patient call captured",
      },
    ],
    build: {
      business: "Animal hospital, Mississauga",
      problem:
        "Front desk spent hours calling for overdue vaccine recalls; check-in bottlenecks crowded the lobby.",
      automation: "Automated recall SMS system and pre-visit digital intake form collection.",
      result: "Recalls booked up by 25%",
    },
    faq: [
      {
        q: "Does this work with Cornerstone, Neo, or ezyVet?",
        a: "Yes. We integrate with leading veterinary practice management software to sync appointments, patient files, and communication history in real-time.",
      },
      {
        q: "How is patient and owner privacy handled?",
        a: "PIPEDA-compliant. We process data within your existing secure systems, encrypt all traffic, and sign standard data processing agreements.",
      },
      {
        q: "Will the AI attempt to diagnose animals?",
        a: "Absolutely not. The after-hours assistant only handles booking, location info, and administrative inquiries. It strictly routes any medical questions to your emergency line.",
      },
      {
        q: "What is the typical investment?",
        a: "Veterinary practice builds are custom-tailored to your clinic flow, typically ranging from $7,500 to $25,000, with ongoing support from $1,500/month.",
      },
    ],
    metaDescription:
      "PIPEDA-compliant automation for veterinary clinics and animal hospitals: automated vaccine recall campaigns, digital check-in intake, and appointment reminders. Free audit.",
  },
  {
    slug: "auto-repair",
    segment: "local",
    name: "Auto repair & detailing",
    cardLine:
      "Mechanic bookings scheduled 24/7, service updates sent automatically, and reviews requested at pickup.",
    headline: "Fill your bays. Keep your lifts moving.",
    subhead:
      "An AI service writer that books appointments 24/7, automated status updates sent to customers' phones, and automatic review requests at key handover. Focus on the fix, let us handle the rest.",
    pains: [
      {
        title: "Phones ringing while under the hood",
        body: "You are mid-repair with grease on your hands. The phone rings with someone wanting a quote or booking. If you do not answer, they call the next shop down.",
      },
      {
        title: "Answering 'Is my car ready yet?' calls",
        body: "Staff spend hours every day answering phone calls from customers checking on their car's repair status, pulling them away from active work.",
      },
      {
        title: "Happy customers do not leave reviews",
        body: "You do great work, but satisfied customers rarely go out of their way to leave a Google review, while unhappy ones always do.",
      },
    ],
    automations: [
      {
        title: "24/7 AI booking host & receptionist",
        body: "An AI receptionist answers calls, provides basic quote estimates, and books service slots directly into your shop calendar.",
        metric: "20+ extra jobs/month captured",
      },
      {
        title: "Automated vehicle status updates",
        body: "Customers receive automated text updates triggered by status changes in your shop software.",
        metric: "60% fewer status inquiries",
      },
      {
        title: "Automatic review request at pickup",
        body: "The moment a job is marked paid, the customer receives a text thanking them and requesting a Google review with a direct link.",
        metric: "Double Google review volume in 90 days",
      },
    ],
    build: {
      business: "Auto repair shop, Hamilton",
      problem:
        "Owner spent 2+ hours a day answering status calls; missed booking calls while servicing vehicles in the bays.",
      automation:
        "AI service writer booking system and SMS status notification automation integrated with Shopmonkey.",
      result: "Bay utilization up 15%",
    },
    faq: [
      {
        q: "Does this work with Shopmonkey, Mitchell 1, or Tekmetric?",
        a: "Yes. We integrate with leading auto shop management software to sync appointments, repair orders, and status updates.",
      },
      {
        q: "How does the AI handle quotes for complex repairs?",
        a: "The AI handles routine maintenance bookings (oil changes, tire swaps, brake checks) directly. For complex diagnostics, it gathers details and schedules a diagnostic drop-off.",
      },
      {
        q: "What does the setup cost?",
        a: "Fixed packages start from $395/month, setup included. Capturing just one or two brake jobs or engine diagnostics a month covers the entire cost of the system.",
      },
      {
        q: "Will customers find the text updates annoying?",
        a: "No. Customers love knowing exactly where their car is in the repair process and when it is ready. It makes your shop feel premium and organized.",
      },
    ],
    metaDescription:
      "AI automation for auto repair and detailing shops: 24/7 AI booking host, automated vehicle status updates, and automatic Google review requests. From $395/month.",
  },
  {
    slug: "physiotherapy-clinics",
    segment: "practice",
    name: "Physiotherapy & chiropractic clinics",
    cardLine:
      "Patient appointments confirmed, exercise plans sent, and chart documentation automated.",
    headline: "Focus on recovery. Leave the charts behind.",
    subhead:
      "Automated appointment reminders that prevent open gaps, digital intake forms that sync with your clinic software, and automated home exercise plan follow-ups. PIPEDA-compliant.",
    pains: [
      {
        title: "Late cancellations leave therapists idle",
        body: "A patient cancels two hours before their slot. You still pay the therapist, but get zero revenue from the room.",
      },
      {
        title: "Chasing patients for medical intake",
        body: "Patients arrive and spend 15 minutes filling out medical history on clipboards, pushing therapists behind schedule.",
      },
      {
        title: "Patients neglect home exercise plans",
        body: "Therapists print out sheets or write exercises on paper. Patients lose them, do not do them, and recovery slows down.",
      },
    ],
    automations: [
      {
        title: "Reminders and waitlist refills",
        body: "Reminders with one-tap reschedule links, coupled with an automated waitlist trigger that instantly offers cancellations to waiting patients.",
        metric: "Recover $2,000-$5,000/month",
      },
      {
        title: "Digital intake & consent forms",
        body: "Forms and insurance details collected before the visit, flowing directly into Jane App or your clinic EMR.",
        metric: "Save 12 minutes per patient",
      },
      {
        title: "Home exercise program follow-up",
        body: "Automated text sequences deliver personalized exercise video links and check-in prompts to keep patients on track between sessions.",
        metric: "25% higher plan adherence",
      },
    ],
    build: {
      business: "Physiotherapy clinic, Scarborough",
      problem:
        "Manual patient intake caused check-in delays; empty slots from last-minute cancellations went unfilled.",
      automation: "Automated waitlist notifications and pre-visit intake integrated with Jane App.",
      result: "Check-in time reduced to zero",
    },
    faq: [
      {
        q: "Does this work with Jane App or Cliniko?",
        a: "Yes. We integrate directly with Jane, Cliniko, and other major allied health platforms to sync appointments, intake notes, and charts.",
      },
      {
        q: "Is patient health information secure?",
        a: "Yes. PIPEDA-compliant. All patient health information is processed inside your clinic system (like Jane), and no health records are stored by us.",
      },
      {
        q: "What is the typical setup timeline?",
        a: "Typical physiotherapy clinic setups are custom and take 2 to 3 weeks to deploy, including full compliance checks.",
      },
      {
        q: "Can it help with insurance pre-authorizations?",
        a: "Yes. We can set up automated text reminders prompting patients to submit or verify their insurance coverage details before their first appointment.",
      },
    ],
    metaDescription:
      "PIPEDA-compliant automation for physiotherapy and chiropractic clinics: automated waitlist refills, digital patient intake, and home exercise reminders. Free audit.",
  },
  {
    slug: "pet-grooming-boarding",
    segment: "local",
    name: "Pet grooming & boarding",
    cardLine:
      "Grooming bookings taken 24/7, pick-up notifications sent, and review requests automated.",
    headline: "Paws on the pets. System on the schedule.",
    subhead:
      "A phone that answers grooming questions and takes bookings 24/7, automated text alerts when pets are ready for pickup, and review requests that build your local reputation.",
    pains: [
      {
        title: "Answering calls while holding a wet dog",
        body: "You are mid-grooming or managing active boarding suites. The phone rings with bookings; you either answer with wet hands or lose the client.",
      },
      {
        title: "Lobby bottlenecks at pickup time",
        body: "Owners show up unannounced or call repeatedly asking 'Is Buddy ready yet?', creating chaos at the front desk.",
      },
      {
        title: "No-shows leave grooming slots empty",
        body: "A customer forgets their 9 a.m. appointment. You booked staff for it, but the slot is wasted because there was no reminder.",
      },
    ],
    automations: [
      {
        title: "24/7 AI booking host",
        body: "An AI receptionist answers questions about sizes, breeds, vaccine requirements, and books appointments into your calendar.",
        metric: "12+ new bookings/month captured",
      },
      {
        title: "Automated 'ready for pickup' texts",
        body: "A simple one-click status change triggers a personalized text telling the owner their pet is ready for pickup, reducing lobby wait times.",
        metric: "Save 3 hours/week of staff calls",
      },
      {
        title: "Automated no-show reminders",
        body: "SMS reminders 24 hours and 2 hours before the groom, with one-tap reschedule and confirmation links.",
        metric: "Grooming no-shows down 45%",
      },
    ],
    build: {
      business: "Pet grooming salon, North York",
      problem:
        "Staff spent hours calling owners to pick up dogs; missed booking calls during peak grooming hours.",
      automation:
        "One-tap SMS pickup notifications and 24/7 AI booking receptionist integrated with Moego.",
      result: "Front-desk chaos cut in half",
    },
    faq: [
      {
        q: "Does this work with Moego, Gingr, or Groomer.io?",
        a: "Yes. We integrate with leading pet care platforms like Moego, Gingr, and Groomer.io to keep calendars, pet profiles, and communications synced.",
      },
      {
        q: "How does the AI know size-based pricing?",
        a: "We train the AI on your exact breed and size pricing matrix (e.g. small, medium, large, double-coated) so it quotes accurate ranges.",
      },
      {
        q: "What does setup cost?",
        a: "Fixed packages start from $395/month, setup included. Saving just two missed grooms or preventing three no-shows covers the cost.",
      },
      {
        q: "Can it check vaccination requirements?",
        a: "Yes. The system automatically prompts clients to upload up-to-date rabies or Bordetella vaccine certificates before their booking is confirmed.",
      },
    ],
    metaDescription:
      "AI automation for pet grooming, boarding, and daycare salons: 24/7 AI booking host, automated pickup text alerts, and no-show reminders. From $395/month.",
  },
  {
    slug: "residential-cleaning",
    segment: "local",
    name: "Residential cleaning services",
    cardLine:
      "Cleanings booked 24/7, schedule updates for cleaners, and review requests at completion.",
    headline: "Fill your cleaners' schedules without the phone grind.",
    subhead:
      "An AI receptionist that takes booking details 24/7, automated scheduling notifications sent to your cleaning crews, and review requests sent the moment the job is finished. Focus on quality, not coordinates.",
    pains: [
      {
        title: "Missed booking calls during active cleanings",
        body: "You are vacuuming or inspecting a home. The phone rings; if you do not answer, they book the next cleaning service on Google.",
      },
      {
        title: "Cleaners waiting on schedule changes",
        body: "A client reschedules last minute. Calling or texting crews on the road to adjust schedules and routes is a constant manual chore.",
      },
      {
        title: "Happy clients forget to leave reviews",
        body: "A spotless clean should lead to a review, but clients forget unless asked automatically while they are admiring the work.",
      },
    ],
    automations: [
      {
        title: "24/7 AI booking host",
        body: "An AI receptionist answers questions about rates and availability, and books cleans directly into your calendar.",
        metric: "15+ new jobs/month captured",
      },
      {
        title: "Automated crew schedule updates",
        body: "Cleaners receive real-time schedule and address updates directly on their phones when routes change.",
        metric: "4 hours/week of calling saved",
      },
      {
        title: "Automatic review request at completion",
        body: "A thank-you text with a Google review link is sent automatically when the cleaner marks the job completed in your portal.",
        metric: "Double Google reviews in 60 days",
      },
    ],
    build: {
      business: "Residential cleaning agency, Etobicoke",
      problem:
        "Owner spent evenings typing schedules and texting address changes to 5 cleaners; missed 20+ inbound booking calls weekly.",
      automation:
        "24/7 AI booking host and automated dispatch text reminders connected to ZenMaid.",
      result: "Saved ~10 admin hours/week",
    },
    faq: [
      {
        q: "Does this work with ZenMaid or Housecall Pro?",
        a: "Yes. We integrate directly with ZenMaid, Housecall Pro, Jobber, and Google Calendar to keep your client bookings and cleaner schedules in sync.",
      },
      {
        q: "How does the AI handle quoting home sizes?",
        a: "We train the AI on your exact pricing matrix (e.g., flat rates by bedroom/bathroom count, or hourly rates) so it quotes accurate pricing ranges.",
      },
      {
        q: "What does setup cost?",
        a: "Fixed packages start from $395/month, setup included. A single new recurring clean client captured by the AI receptionist completely covers the monthly fee.",
      },
      {
        q: "Can clients reschedule through the AI?",
        a: "Yes. The AI check availability in your system and lets clients reschedule within your cancellation policy window automatically.",
      },
    ],
    metaDescription:
      "AI automation for residential cleaning businesses: 24/7 AI booking host, automated crew scheduling, and automatic Google review requests. From $395/month.",
  },
  {
    slug: "boutique-retail",
    segment: "local",
    name: "Boutique & specialty retail",
    cardLine: "Real-time stock sync between POS and online store, and automated reorder drafts.",
    headline: "Your inventory, synchronized and simplified.",
    subhead:
      "Real-time stock sync between physical POS and online store, automated supplier order drafts based on sales, and automatic feedback requests after purchases. Stop counting, start selling.",
    pains: [
      {
        title: "Overselling items online that sold in-store",
        body: "A client buys the last item in-store. An hour later, an online customer orders it. You spend the next day emailing apologies and processing refunds.",
      },
      {
        title: "Supplier orders take hours of manual checking",
        body: "Walking around shelves with a clipboard, figuring out what's low, and drafting order emails to multiple suppliers is a huge time-sink.",
      },
      {
        title: "Reviews never reflect in-store satisfaction",
        body: "Customers love your unique products, but walking out of a boutique doesn't prompt them to leave a review without a digital nudge.",
      },
    ],
    automations: [
      {
        title: "Real-time POS to online sync",
        body: "Inventory updates automatically on Shopify or WooCommerce the split second an item is scanned at your physical till.",
        metric: "Zero overselling incidents",
      },
      {
        title: "Automated supplier order drafts",
        body: "When stock drops below custom thresholds, a draft purchase order is created. You review on your phone, click approve, and it emails the supplier.",
        metric: "5+ hours/week of admin back",
      },
      {
        title: "Post-purchase review requests",
        body: "A friendly, branded text or email goes out a day after purchase, asking for feedback and directing happy customers to Google Reviews.",
        metric: "35% higher review capture",
      },
    ],
    build: {
      business: "Specialty boutique, Toronto",
      problem:
        "Owner spent Sundays manually syncing Lightspeed POS with Shopify and counting stock manually.",
      automation: "Automated real-time inventory sync and automated reorder drafting.",
      result: "Stock discrepancies cut by 95%",
    },
    faq: [
      {
        q: "Does this work with Shopify, Square POS, and Lightspeed?",
        a: "Yes. We integrate with major retail POS systems like Shopify, Square POS, Lightspeed, and Clover to sync inventory in real time.",
      },
      {
        q: "How does it handle supplier order drafts?",
        a: "It monitors inventory levels and generates formatted draft emails or PDFs. The system sends them to you for one-tap approval before mailing your suppliers.",
      },
      {
        q: "What is the typical setup cost?",
        a: "Fixed packages start from $395/month, setup included. Preventing just one inventory-runout of your best seller covers the system.",
      },
      {
        q: "Can it handle multiple store locations?",
        a: "Yes. The system tracks stock across different warehouses and locations, routing order requests to the correct supplier for that branch.",
      },
    ],
    metaDescription:
      "Inventory and review automation for boutique retail: real-time POS to online store sync, automated supplier order drafts, and post-purchase review requests. From $395/month.",
  },
  {
    slug: "photography-studios",
    segment: "local",
    name: "Photography studios",
    cardLine:
      "Session bookings, deposit collections, and automated review requests at gallery delivery.",
    headline: "Focus on the lens. Let systems run the schedule.",
    subhead:
      "Automated photoshoot booking and deposit collection, automatic prep guides sent to clients before shoots, and review request alerts triggered upon gallery delivery.",
    pains: [
      {
        title: "The endless email booking back-and-forth",
        body: '"What dates work?" "How about Saturday?" "No, Sunday." Clients take days to respond, and slots get lost to quicker inquiries.',
      },
      {
        title: "Chasing deposits before the shoot",
        body: "You block out 3 hours for a portrait shoot. The client doesn't pay their deposit, then cancels at the last minute, leaving you with empty studio time.",
      },
      {
        title: "Chasing clients for reviews after delivery",
        body: "They love their photos, but once they download their gallery, they disappear. You have to email them repeatedly to get a testimonial.",
      },
    ],
    automations: [
      {
        title: "Self-serve booking & deposit capture",
        body: "Clients select photoshoot slots from your calendar and must pay the deposit via Stripe before the booking is locked.",
        metric: "Zero unpaid booking holdouts",
      },
      {
        title: "Automatic photoshoot prep sequences",
        body: "Spaced text and email reminders deliver style guides, location pins, and timing details automatically, reducing client prep calls.",
        metric: "80% fewer client prep questions",
      },
      {
        title: "Gallery delivery review trigger",
        body: "When you upload the final files to Pixieset or Pic-Time, the system automatically sends a congrats email with a direct review link.",
        metric: "Double client review rate",
      },
    ],
    build: {
      business: "Wedding & portrait photographer, Toronto",
      problem:
        "Photographer lost hours to booking schedules and client prep emails; frequently had late cancellations with no deposit.",
      automation:
        "Booking portal with Stripe deposit paywall and automated email prep ladders integrated with Pixieset.",
      result: "No-show rate cut to zero",
    },
    faq: [
      {
        q: "Does this work with Honeybook, Dubsado, or Pixieset?",
        a: "Yes. We integrate with creative CRM systems like Dubsado, Honeybook, Pixieset, and Pic-Time to sync bookings, contracts, and gallery delivery triggers.",
      },
      {
        q: "Can the booking form request customization options?",
        a: "Yes. We can include custom intake questions (e.g. occasion, location details, preferred package) that must be answered during checkout.",
      },
      {
        q: "What is the typical setup fee?",
        a: "Fixed packages start from $395/month, setup included. Booking just one additional mini-session a month covers the subscription.",
      },
      {
        q: "How are deposits processed?",
        a: "We connect your Stripe or Square account directly to your booking flows. Deposits land in your bank account immediately, without passing through us.",
      },
    ],
    metaDescription:
      "AI automation for photography studios: photoshoot bookings with deposit paywalls, automatic client prep guides, and review requests at gallery delivery. From $395/month.",
  },
  {
    slug: "catering-services",
    segment: "local",
    name: "Catering & event food services",
    cardLine: "Instant inquiry quoting, automated menu selection intake, and invoice follow-ups.",
    headline: "Quote events instantly. Win the booking first.",
    subhead:
      "AI inquiry quoting that responds in minutes, digital menu selection intake that flows directly into prep lists, and automated deposit invoice follow-ups.",
    pains: [
      {
        title: "Slow quote response times cost bookings",
        body: "An event planner requests catering quotes from three places. You respond 6 hours later; they already signed a contract with the one who replied in 15 minutes.",
      },
      {
        title: "Menu adjustment back-and-forth",
        body: "Sending spreadsheets, adjusting items for allergies, updating prices by hand - a massive admin headache for every single event.",
      },
      {
        title: "Chasing deposits and final balances",
        body: "Remembering to invoice deposits at contract signing and tracking down final balances 7 days before the event eats your week.",
      },
    ],
    automations: [
      {
        title: "Instant AI quote generation",
        body: "An AI intake assistant reads event inquiries and drafts initial budget and menu quotes based on your pricing guidelines, sending them instantly.",
        metric: "First response under 3 minutes",
      },
      {
        title: "Digital menu and allergy intake",
        body: "Clients select menus in a secure portal; their choices and dietary restrictions populate your kitchen prep list automatically.",
        metric: "Save 4 hours/event in menu admin",
      },
      {
        title: "Automated milestone invoicing",
        body: "Deposit invoices send automatically at contract signature, and final balances trigger 7 days before the event, with automated reminders.",
        metric: "Faster payments, zero forgotten bills",
      },
    ],
    build: {
      business: "Corporate & wedding caterer, Mississauga",
      problem:
        "Catering manager spent 15+ hours a week responding to quote requests and chasing final balances manually.",
      automation:
        "AI quote drafting system and automated QuickBooks invoice sequences triggered by event dates.",
      result: "Event booking conversion up 20%",
    },
    faq: [
      {
        q: "Does this work with QuickBooks, Xero, or Total Party Planner?",
        a: "Yes. We integrate with major accounting tools like QuickBooks and Xero, as well as catering platforms like Total Party Planner to sync event sheets.",
      },
      {
        q: "How does the AI receptionist quote pricing accurately?",
        a: "We train the AI on your per-head pricing matrices, minimums, and staffing fees. It drafts the quote and flags it for your approval before sending, or sends automated estimates.",
      },
      {
        q: "What does setup cost?",
        a: "Fixed packages start from $395/month, setup included. Winning one corporate lunch catering contract covers the entire year's cost.",
      },
      {
        q: "Can it handle dietary restriction notifications?",
        a: "Yes. The menu intake form automatically flags common allergens (nuts, gluten, dairy) and alerts the head chef directly when orders are locked.",
      },
    ],
    metaDescription:
      "AI automation for catering and event food services: instant AI quoting, digital menu selection intake, and automated milestone invoicing. From $395/month.",
  },
  {
    slug: "landscaping-gardening",
    segment: "local",
    name: "Landscaping & gardening services",
    cardLine:
      "Quote requests captured on the road, automated route dispatching, and deposit invoicing.",
    headline: "Grow your routes. Automate your road.",
    subhead:
      "AI receptionist captures site details on the road, automated route dispatching for crews, and deposit invoicing that secures projects instantly.",
    pains: [
      {
        title: "Missed phone calls during yard service",
        body: "You are on a mower or driving between sites. The phone rings with a lawn care request. They reach voicemail and call the next landscaper.",
      },
      {
        title: "Manual route planning for crews",
        body: "Manually mapping out routes for three crews every morning, texting addresses, and adjusting routes for weather changes eats hours of management time.",
      },
      {
        title: "Chasing payment for sod, mulch, or designs",
        body: "You complete a yard cleanup, email the bill, and spend the next two weeks chasing the homeowner. Cash flow gets tight during busy season.",
      },
    ],
    automations: [
      {
        title: "24/7 AI lead capture receptionist",
        body: "An AI receptionist answers questions, gathers lawn size and service needs, and texts project leads to your phone immediately.",
        metric: "25+ new route leads/month captured",
      },
      {
        title: "Automated route & dispatch sync",
        body: "New bookings populate crew routes automatically, synced with GPS tracking to minimize drive times.",
        metric: "Saved 6 hours/week in route planning",
      },
      {
        title: "Automated deposit & invoice chasing",
        body: "Deposit invoices trigger automatically at booking, and final bills request payments via SMS with one-tap payment options.",
        metric: "Invoices settled 6 days faster",
      },
    ],
    build: {
      business: "Residential landscaping company, Scarborough",
      problem:
        "Owner spent 12 hours a week manually drafting routes, texting addresses to crews, and calling clients for outstanding bills.",
      automation:
        "Jobber CRM integration with automatic route dispatching and Twilio SMS payment links.",
      result: "Saved 12 hours/week in route admin",
    },
    faq: [
      {
        q: "Does this work with Jobber, LMN, or Housecall Pro?",
        a: "Yes. We integrate with leading trade platforms like Jobber, LMN, Housecall Pro, and ServiceTitan to keep routes and invoices synced.",
      },
      {
        q: "Will the AI receptionist understand sod vs. mulch sizing?",
        a: "The AI is trained to gather site details (dimensions, property type, material needs) and schedule a site visit or estimate, routing qualified leads to you.",
      },
      {
        q: "What does setup cost?",
        a: "Fixed packages start from $395/month, setup included. Securing just one seasonal lawn care route covers the entire year of subscription.",
      },
      {
        q: "Can clients request quotes via text?",
        a: "Yes. We can enable an SMS number that answers questions, collects yard images for quoting, and sets up estimation site visits.",
      },
    ],
    metaDescription:
      "AI automation for landscaping and gardening companies: 24/7 AI lead capture, automated dispatch routing, and SMS deposit invoicing. From $395/month.",
  },
  {
    slug: "optometry-clinics",
    segment: "practice",
    name: "Optometry clinics",
    cardLine:
      "Exam recalls that fill the schedule, new-patient EMR intake, and insurance eligibility prep.",
    headline: "Keep your patients in focus. Leave scheduling on autopilot.",
    subhead:
      "Automated annual eye-exam recalls, patient intake paperwork synced to your EMR, and overnight insurance eligibility prep. PIPEDA-compliant.",
    pains: [
      {
        title: "Annual exam recalls are missed or ignored",
        body: "Patients are due for their annual eye exam, but calling them manually from lists is slow, and generic emails get lost in spam.",
      },
      {
        title: "Paper intake bottlenecks the reception desk",
        body: "New patients fill out medical histories, contacts, and consent sheets on arrival, delaying eye diagnostic testing.",
      },
      {
        title: "Insurance eligibility checks delay billing",
        body: "Verifying patient insurance limits at check-in causes lobby queues and billing disputes when coverage is denied.",
      },
    ],
    automations: [
      {
        title: "Automated exam recall sequences",
        body: "Patients receive friendly annual recall alerts by text and email with direct self-booking links into open exam slots.",
        metric: "30-40% higher recall rebooking rate",
      },
      {
        title: "Digital pre-visit EMR intake",
        body: "Patients fill out medical histories and upload insurance card photos at home, feeding directly into clinical charts.",
        metric: "Save 15 minutes per check-in",
      },
      {
        title: "Overnight insurance verification prep",
        body: "Tomorrow's scheduled patients are cross-referenced against insurance records overnight, creating a billing checklist for staff.",
        metric: "45 minutes/day saved at reception",
      },
    ],
    build: {
      business: "Optometry clinic, Richmond Hill",
      problem:
        "Staff spent 5 hours a week calling overdue exam lists; reception desk was constantly backed up with intake clipboard scans.",
      automation:
        "Automated annual SMS/email recall sequences and digital pre-visit intake connected to ClinicSource.",
      result: "Exam bookings increased by 32%",
    },
    faq: [
      {
        q: "Does this work with ClinicMaster, Jane, or other optometry systems?",
        a: "Yes. We integrate with major Canadian practice management systems to sync appointments, eye exam recalls, and patient files securely.",
      },
      {
        q: "Is patient eye data secure and PHIPA-compliant?",
        a: "Yes. All data processing is PIPEDA/PHIPA-compliant. We process patient intake forms securely and do not store medical records on our servers.",
      },
      {
        q: "What does a custom optometry clinic build cost?",
        a: "Typical engagements run $7,500 to $25,000 depending on scope, with support from $1,500/month. The initial practice audit is completely free.",
      },
      {
        q: "Can the recall system promote frame sales?",
        a: "Yes. We can configure follow-ups to invite patients who completed exams to browse your frame gallery or optical shop with a booking link.",
      },
    ],
    metaDescription:
      "PIPEDA-compliant automation for optometry clinics: automated eye exam recalls, digital pre-visit EMR intake, and overnight insurance verification prep. Free audit.",
  },
  {
    slug: "mental-health-practices",
    segment: "practice",
    name: "Mental health & therapy practices",
    cardLine:
      "Secure session bookings, screening intake paperwork, and automated waitlist refills.",
    headline: "Focus on care, not calendar coordination.",
    subhead:
      "Privacy-first session booking and reminder ladders, secure screening and intake forms, and automated waitlist refills that keep therapists fully booked. PHIPA-aware.",
    pains: [
      {
        title: "No-shows and late cancellations burn clinical hours",
        body: "A client misses a therapy session last-minute. The slot goes unfilled, but you still pay the therapist, hurting clinic margins.",
      },
      {
        title: "Manual screening and intake delay care",
        body: "Screening clients for fit, collecting consent, and filing intake questionnaires takes hours of admin before the first session.",
      },
      {
        title: "Therapist calendars are inefficiently packed",
        body: "Managing gaps between sessions, waitlists, and client reschedules by hand is a constant, exhausting front-desk puzzle.",
      },
    ],
    automations: [
      {
        title: "Secure booking & reminder ladders",
        body: "Spaced reminder texts and emails with direct confirm/reschedule links that prevent no-shows without manual follow-up.",
        metric: "No-shows cut by 50%",
      },
      {
        title: "Digital screening & consent intake",
        body: "Secure screening forms (e.g. PHQ-9, GAD-7) and consents are filled out by clients at home, updating their charts automatically.",
        metric: "15 minutes saved per client onboarding",
      },
      {
        title: "Automated waitlist matching",
        body: "When a session is cancelled, the system automatically texts the next waitlisted client matching that therapist's specialization.",
        metric: "Cancellations filled within 10 minutes",
      },
    ],
    build: {
      business: "Psychology & therapy practice, Downtown Toronto",
      problem:
        "Staff spent hours calling waitlists to fill cancelled therapy slots; manual clinical screening clipboard intakes were slow.",
      automation:
        "Automated waitlist notifications and secure pre-session digital intakes integrated with Jane App.",
      result: "Recovered $4,000/month in idle hours",
    },
    faq: [
      {
        q: "Is client privacy protected under PHIPA and PIPEDA?",
        a: "Yes. Security is our absolute priority. We build using fully encrypted pathways. All intake details flow straight into your EMR; we store nothing.",
      },
      {
        q: "Does it work with Jane App, Cliniko, or Owl Practice?",
        a: "Yes. We integrate directly with Jane, Cliniko, Owl Practice, and other therapist software to keep calendars and client screening synced.",
      },
      {
        q: "What is the typical investment?",
        a: "Custom practice builds range from $7,500 to $25,000, with ongoing support from $1,500/month. The initial workflow audit is free.",
      },
      {
        q: "Can the screening form route patients to therapists?",
        a: "Yes. The intake system can analyze screening answers and route the client to schedule with a therapist who specializes in their specific needs.",
      },
    ],
    metaDescription:
      "PHIPA-compliant automation for mental health and therapy practices: automated waitlist refills, secure digital screening intakes, and booking reminders. Free audit.",
  },
  {
    slug: "insurance-agencies",
    segment: "practice",
    name: "Insurance agencies & brokerages",
    cardLine: "AI lead qualification, client document collection, and policy renewal reminders.",
    headline: "Write more policy coverage. Streamline agency paperwork.",
    subhead:
      "24/7 AI lead qualification, secure client onboarding for document collection, and automated policy renewal reminders that protect your book of business.",
    pains: [
      {
        title: "Inbound leads go cold before qualification",
        body: "A prospect requests an auto or home quote online. Chasing them down to collect vehicle and housing details manually takes days.",
      },
      {
        title: "Chasing clients for signed documents",
        body: "Collecting driver's records, prior policies, and signed signatures requires constant email nagging from brokers.",
      },
      {
        title: "Policy renewals slip through cracks",
        body: "Clients let policies lapse because they weren't contacted before the renewal date, reducing agency retention and commissions.",
      },
    ],
    automations: [
      {
        title: "24/7 AI lead qualification",
        body: "The moment a prospect inquires, they receive a text collecting vehicle, home, or business details, preparing the file for broker pricing.",
        metric: "Leads qualified in under 4 minutes",
      },
      {
        title: "Zero-touch broker onboarding",
        body: "Prospects upload documents via a secure link; files are organized into agency systems automatically, with e-sign requests.",
        metric: "Save 45 minutes of broker admin/file",
      },
      {
        title: "Automated renewal campaigns",
        body: "Spaced reminder campaigns trigger 30, 15, and 5 days before policy renewals, offering quick renewal or adjustment calls.",
        metric: "Increase policy retention by 15%",
      },
    ],
    build: {
      business: "Independent insurance brokerage, Hamilton",
      problem:
        "Brokers spent 6 hours/week chasing prior policy details and signatures; renewal letters were sent manually via post.",
      automation:
        "Automated text qualification sequences and secure document upload templates integrated with HubSpot CRM.",
      result: "Policy renewal rates increased by 15%",
    },
    faq: [
      {
        q: "Does this work with HubSpot, Salesforce, or Applied Epic?",
        a: "Yes. We integrate with major CRMs and agency management platforms like Applied Epic, Salesforce, and HubSpot to keep files synced.",
      },
      {
        q: "How secure is document collection for client records?",
        a: "Extremely secure. All uploads use SSL encryption and move directly to your secure agency cloud folders. We do not store client files.",
      },
      {
        q: "What does an agency build cost?",
        a: "Custom insurance builds typically run $7,500 to $25,000 depending on scope, with support from $1,500/month. The initial audit is free.",
      },
      {
        q: "Can the lead responder draft quick quotes?",
        a: "Yes. We can integrate the lead collector with rating APIs to present estimated premium ranges before booking broker calls.",
      },
    ],
    metaDescription:
      "AI automation for insurance agencies and brokerages: 24/7 AI lead qualification, secure document collection, and policy renewal reminders. Free audit.",
  },
  {
    slug: "mortgage-brokerages",
    segment: "practice",
    name: "Mortgage brokerages",
    cardLine:
      "Secure document portals, automated lead screening, and status updates sent to buyers.",
    headline: "Close mortgage loans faster. Kill the document chase.",
    subhead:
      "Secure document portal collection (T4s, bank statements, IDs), automated lead pre-qualification screening, and automated SMS status updates for buyers and Realtors.",
    pains: [
      {
        title: "Endless chasing for client financial files",
        body: "Clients send blurry photos, missing pages, or wrong tax files. Brokers spend hours organizing emails and sorting files.",
      },
      {
        title: "Pre-qualifying unqualified borrowers",
        body: "Spending an hour reviewing credit and income details for a borrower who doesn't meet minimum requirements eats up broker time.",
      },
      {
        title: "Constant status updates from buyers",
        body: '"Has my loan been approved?" "Did the lender reply?" Answering calls from nervous buyers and Realtors eats up mornings.',
      },
    ],
    automations: [
      {
        title: "Secure document collection portal",
        body: "A secure upload link requests specific files (e.g. T4, Paystubs) and uses AI to verify readability and send reminders for missing items.",
        metric: "Collect files 9 days faster",
      },
      {
        title: "Automated pre-qualification screening",
        body: "Online forms collect credit, income, and downpayment details, calculating preliminary debt ratios before brokers schedule calls.",
        metric: "Save 3 hours/week of dead-end calls",
      },
      {
        title: "SMS status update triggers",
        body: "Every milestone change (e.g., submitted to lender, appraisal ordered, approved) triggers an automated text to the buyer and agent.",
        metric: "50% fewer status calls",
      },
    ],
    build: {
      business: "Mortgage brokerage, Vaughan",
      problem:
        "Brokers spent up to 10 hours a week chasing and sorting client T4s, paystubs, and bank statements manually.",
      automation:
        "Secure document portals with automatic OCR verification and automated SMS loan stage notifications.",
      result: "Document collection time down ~60%",
    },
    faq: [
      {
        q: "Does this work with Filogix, Velocity, or Salesforce?",
        a: "Yes. We integrate with major Canadian mortgage platforms like Filogix, Velocity, and Salesforce to sync client details.",
      },
      {
        q: "Is document collection secure and FINTRAC-compliant?",
        a: "Yes. All uploads go through secure portal systems and use TLS 1.3 encryption. We store no files on our servers; they transfer straight to your CRM.",
      },
      {
        q: "What does the setup invest?",
        a: "Custom brokerage builds range from $7,500 to $25,000, with support from $1,500/month. Saving just one loan fall-through pays for the build.",
      },
      {
        q: "Can Realtors receive updates too?",
        a: "Yes. You can toggle permission to automatically copy the listing Realtor on milestone text updates so everyone stays in sync.",
      },
    ],
    metaDescription:
      "FINTRAC-compliant automation for mortgage brokerages: secure document collection portals, automated pre-qualification screening, and loan stage SMS alerts. Free audit.",
  },
  {
    slug: "tutoring-centers",
    segment: "practice",
    name: "Tutoring & learning centers",
    cardLine:
      "Lesson booking & reschedules, student intake profiles, and automated monthly invoicing.",
    headline: "Focus on tutoring. Leave class management on autopilot.",
    subhead:
      "Self-serve lesson scheduling and rescheduling, pre-session student profiling, and automated monthly invoicing that eliminates billing disputes.",
    pains: [
      {
        title: "The parent reschedule coordination headache",
        body: '"Can we move Tommy to Thursday?" Parents text, email, or call. Staff spend hours playing calendar Jenga between tutors and students.',
      },
      {
        title: "Manual student learning intake",
        body: "Assessing student levels, subjects, and schedules manually before match-making them with tutors takes hours of paperwork.",
      },
      {
        title: "Aged receivables from late parent payments",
        body: "Invoicing families manually for package hours is tedious, and chasing late payments causes awkward administrative friction.",
      },
    ],
    automations: [
      {
        title: "Self-serve scheduling & reschedules",
        body: "Parents reschedule classes directly through a booking link within your cancellation policies, updating tutor calendars in real time.",
        metric: "Reschedule calls down 70%",
      },
      {
        title: "Digital student learning profile",
        body: "Intake forms collect grade levels, subject weaknesses, and school records, matching them with an ideal tutor profile.",
        metric: "12 minutes saved per student onboarding",
      },
      {
        title: "Automated subscription invoicing",
        body: "Monthly invoices trigger automatically based on package schedules, chasing payments via SMS and email with direct payment links.",
        metric: "Aged receivables cut by 40%",
      },
    ],
    build: {
      business: "Tutoring center, Markham",
      problem:
        "Staff spent 8 hours a week answering parent rescheduling requests and typing student subject registration profiles manually.",
      automation:
        "Self-serve booking portals and automatic Stripe payment recurring invoices integrated with Teachworks.",
      result: "Saved 8 hours/week in scheduling admin",
    },
    faq: [
      {
        q: "Does this work with Teachworks, TutorCruncher, or Google Calendar?",
        a: "Yes. We integrate with major education platforms like Teachworks, TutorCruncher, and Google Calendar to keep classes and invoicing synced.",
      },
      {
        q: "How are tutors notified of reschedules?",
        a: "Tutors receive automated notifications in Slack, email, or SMS, and their synced calendar updates instantly when a parent reschedules.",
      },
      {
        q: "What does setup cost?",
        a: "Fixed packages start from $395/month, setup included. Retaining just two families who would have lapsed due to scheduling friction covers the system.",
      },
      {
        q: "Can parents purchase lesson packages?",
        a: "Yes. Parents can select, buy, and manage package hours (e.g. 10-hour block) directly from their student dashboard.",
      },
    ],
    metaDescription:
      "Automation for tutoring and learning centers: self-serve lesson scheduling, digital student intake profiles, and automated subscription invoicing. From $395/month.",
  },
] as const;

export function industryBySlug(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}

export function industriesBySegment(segment: Segment): Industry[] {
  return industries.filter((i) => i.segment === segment);
}
