/**
 * What: The nineteen service offerings - index cards plus full detail-page content.
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
    relatedIndustries: [
      "convenience-stores",
      "restaurants",
      "medical-clinics",
      "law-firms",
      "gyms-fitness",
      "real-estate",
      "construction-trades",
      "veterinary-clinics",
      "auto-repair",
      "physiotherapy-clinics",
      "pet-grooming-boarding",
      "residential-cleaning",
      "boutique-retail",
      "photography-studios",
      "catering-services",
      "landscaping-gardening",
      "optometry-clinics",
      "mental-health-practices",
      "insurance-agencies",
      "mortgage-brokerages",
      "tutoring-centers",
    ],
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
    relatedIndustries: [
      "salons-spas",
      "dental-offices",
      "medical-clinics",
      "restaurants",
      "gyms-fitness",
      "real-estate",
      "accounting-firms",
      "construction-trades",
      "veterinary-clinics",
      "auto-repair",
      "physiotherapy-clinics",
      "pet-grooming-boarding",
      "residential-cleaning",
      "photography-studios",
      "optometry-clinics",
      "mental-health-practices",
      "tutoring-centers",
    ],
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
    relatedIndustries: [
      "medical-clinics",
      "dental-offices",
      "law-firms",
      "accounting-firms",
      "veterinary-clinics",
      "physiotherapy-clinics",
      "photography-studios",
      "catering-services",
      "optometry-clinics",
      "mental-health-practices",
      "insurance-agencies",
      "mortgage-brokerages",
      "tutoring-centers",
    ],
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
    relatedIndustries: [
      "restaurants",
      "salons-spas",
      "convenience-stores",
      "gyms-fitness",
      "construction-trades",
      "auto-repair",
      "pet-grooming-boarding",
      "residential-cleaning",
      "boutique-retail",
      "photography-studios",
      "catering-services",
      "landscaping-gardening",
    ],
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
      "Nothing waits on someone remembering. Businesses typically see 10 to 20 percent of stalled quotes close after a proper sequence, and win-back campaigns typically rebook 8 to 12 percent of lapsed customers.",
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
    relatedIndustries: [
      "law-firms",
      "salons-spas",
      "dental-offices",
      "gyms-fitness",
      "accounting-firms",
      "real-estate",
      "construction-trades",
      "veterinary-clinics",
      "auto-repair",
      "physiotherapy-clinics",
      "pet-grooming-boarding",
      "photography-studios",
      "catering-services",
      "landscaping-gardening",
      "insurance-agencies",
      "tutoring-centers",
    ],
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
    relatedIndustries: [
      "convenience-stores",
      "restaurants",
      "medical-clinics",
      "gyms-fitness",
      "accounting-firms",
      "construction-trades",
      "auto-repair",
      "physiotherapy-clinics",
      "pet-grooming-boarding",
      "residential-cleaning",
      "boutique-retail",
      "catering-services",
      "landscaping-gardening",
      "optometry-clinics",
      "mental-health-practices",
      "insurance-agencies",
      "mortgage-brokerages",
      "tutoring-centers",
    ],
  },
  {
    slug: "inventory-and-supplier-ordering",
    name: "Inventory & supplier ordering",
    title: "Orders that draft themselves",
    excerpt:
      "Automate order drafting from POS sales data, send formatted orders directly to vendors on schedule, and track stock thresholds automatically.",
    problem:
      "Walking the aisles with a notepad, cross-checking what sold, and emailing four suppliers before the cutoff. Doing supplier orders by hand eats hours of ownership time and risks out-of-stock items or over-ordering.",
    whatWeBuild: [
      "Automatic data connection that reads sales and inventory levels from your POS system",
      "Supplier order drafting: a scheduled script calculates exactly what needs to be ordered to meet your stock thresholds",
      "One-click approval: a draft order is compiled and sent to you. You review, click approve, and it goes out to your suppliers formatted exactly how they want it",
      "Low-stock and discrepancy alerts sent to your phone before it affects your customers",
    ],
    tools: ["Square", "Clover", "Lightspeed POS", "Google Sheets", "Make or n8n", "Twilio SMS"],
    timeline: "1 to 2 weeks to live",
    outcome:
      "Supplier orders take minutes instead of evenings. You maintain optimal stock levels without manual walks, and reduce capital tied up in excess inventory.",
    faq: [
      {
        q: "Does it work with legacy suppliers who do not have APIs?",
        a: "Yes. The system compiles the orders and formats them as standard emails or PDFs, sending them automatically to whatever email or ordering portal your supplier uses.",
      },
      {
        q: "What if sales spike and I need to override the draft?",
        a: "You stay in full control. The draft order is sent to you first. You can easily tweak quantities or add custom items on your phone before approving it.",
      },
      {
        q: "How does it handle partial shipments or backorders?",
        a: "We set up a simple checklist in your dashboard or spreadsheet. When shipments arrive, staff mark what was received, and the system automatically flags discrepancies to the supplier.",
      },
    ],
    relatedIndustries: [
      "convenience-stores",
      "restaurants",
      "salons-spas",
      "boutique-retail",
      "catering-services",
    ],
  },
  {
    slug: "client-onboarding-portals",
    name: "Client onboarding & portals",
    title: "Welcome every client, instantly and perfectly",
    excerpt:
      "Zero-touch client onboarding that sets up folders, sends welcome details, requests missing details, and schedules kickoff calls automatically.",
    problem:
      "A new client signs a contract or books a first visit. Then comes the manual chore: creating folders in Google Drive, setting up their card in your CRM, sending the welcome email, and chasing them for onboarding information. It's hours of admin per client.",
    whatWeBuild: [
      "Automatic folder structure creation in Google Drive, SharePoint, or your document manager the moment they sign up",
      "A branded onboarding portal where clients can upload files, see their project checklist, and schedule their kickoff",
      "Automatic follow-ups for outstanding intake details until their profile is 100% complete",
      "Internal setup: team members are assigned their tasks and notified in Slack or Teams automatically",
    ],
    tools: [
      "Google Workspace / Microsoft 365",
      "PandaDoc / DocuSign",
      "HubSpot / Clio",
      "Typeform / Jotform",
      "Make or n8n",
    ],
    timeline: "1 to 2 weeks to live",
    outcome:
      "Onboarding happens instantly, 24/7. Clients feel handled from second one, and your team starts the first meeting with all the files and info they need, without manual setup.",
    faq: [
      {
        q: "Can we customize the onboarding flow per client type?",
        a: "Yes. The system reads the contract or intake questionnaire and triggers different folders, checklists, and welcome emails based on what they bought.",
      },
      {
        q: "Is this secure for sensitive client information?",
        a: "Absolutely. We build inside your existing secure cloud storage (like Google Drive or OneDrive) and use encrypted connections. We do not store your client's files.",
      },
      {
        q: "How does it handle client communication?",
        a: "It drafts welcome messages, links to portals, and reminders in your brand and voice, sending them via email or SMS as appropriate.",
      },
    ],
    relatedIndustries: [
      "accounting-firms",
      "law-firms",
      "real-estate",
      "gyms-fitness",
      "medical-clinics",
      "dental-offices",
      "physiotherapy-clinics",
      "veterinary-clinics",
      "photography-studios",
      "optometry-clinics",
      "mental-health-practices",
      "insurance-agencies",
      "mortgage-brokerages",
      "tutoring-centers",
    ],
  },
  {
    slug: "dispatch-and-routing",
    name: "Dispatch & routing",
    title: "Dispatched in seconds, not hours",
    excerpt:
      "Automatically route new service requests to technicians based on location and skill, with real-time ETA updates sent to customers.",
    problem:
      "Calls come in while technicians are on jobs. Scheduling the right person, planning their route, and letting the customer know when they'll arrive takes a constant stream of phone calls and manual map lookups.",
    whatWeBuild: [
      "Automatic job routing based on technician location, availability, and skills",
      "Real-time SMS updates with ETA tracking links sent to customers when the technician is en route",
      "Automatic sync between your dispatch board, Google Maps, and your invoicing tool",
      "Post-job check-in: automatic texts requesting photos of the completed work for the client portal and quality assurance",
    ],
    tools: ["Housecall Pro", "Jobber", "Google Maps API", "Twilio SMS", "Make or n8n"],
    timeline: "2 to 3 weeks to live",
    outcome:
      "Technicians spend more time on jobs and less time driving. Customers get Uber-like visibility, leading to higher satisfaction and fewer 'Where is my tech?' calls.",
    faq: [
      {
        q: "Can it handle emergency calls differently?",
        a: "Yes. Emergency tickets are automatically flagged and routed to the on-call technician immediately, overriding normal routing.",
      },
      {
        q: "Does it work with our existing calendars?",
        a: "Yes, we integrate with Google Calendar, Outlook, and specialized service calendars like Jobber or Housecall Pro.",
      },
      {
        q: "What if plans change on the fly?",
        a: "The dispatcher dashboard lets you manually drag-and-drop jobs to override routing at any time, instantly recalculating and notifying technicians and customers.",
      },
    ],
    relatedIndustries: [
      "construction-trades",
      "auto-repair",
      "physiotherapy-clinics",
      "pet-grooming-boarding",
      "residential-cleaning",
      "landscaping-gardening",
    ],
  },
  {
    slug: "invoice-and-payments",
    name: "Invoice & payments",
    title: "Get paid on time, without the awkward chase",
    excerpt:
      "Send invoices automatically when jobs are completed, and trigger automated polite reminder text/emails past due until settled.",
    problem:
      "Sending invoices manually is slow, and calling customers for unpaid bills is awkward. You end up carrying high accounts receivable and hurting your cash flow.",
    whatWeBuild: [
      "Automatic invoice generation triggered from job completions in your booking software",
      "A friendly, spaced reminder ladder by text and email at 3, 7, 14, and 30 days past due",
      "One-tap payment links (Stripe, Apple Pay, credit card) embedded directly in reminders",
      "Automated receipts and paid confirmation notifications sent to clients and your accountant",
    ],
    tools: ["QuickBooks", "Xero", "Stripe", "Jobber / Jane App", "Make or n8n"],
    timeline: "1 week to live",
    outcome:
      "Invoices go out immediately and are typically paid 8-10 days faster. Accounts receivable balances often drop by 30-40% without you making a single manual phone call.",
    faq: [
      {
        q: "Can it handle custom invoice terms?",
        a: "Yes. The system reads the due date from your accounting software and schedules reminders relative to that date (e.g. 3 days past due).",
      },
      {
        q: "Will it stop sending reminders once they pay?",
        a: "Yes. The system checks payment status in real-time before sending any reminder, stopping the sequence immediately.",
      },
    ],
    relatedIndustries: [
      "convenience-stores",
      "restaurants",
      "salons-spas",
      "gyms-fitness",
      "construction-trades",
      "auto-repair",
      "pet-grooming-boarding",
      "medical-clinics",
      "dental-offices",
      "law-firms",
      "accounting-firms",
      "real-estate",
      "veterinary-clinics",
      "physiotherapy-clinics",
      "residential-cleaning",
      "boutique-retail",
      "photography-studios",
      "catering-services",
      "landscaping-gardening",
      "optometry-clinics",
      "mental-health-practices",
      "insurance-agencies",
      "mortgage-brokerages",
      "tutoring-centers",
    ],
  },
  {
    slug: "lead-qualification",
    name: "Lead qualification & triage",
    title: "Qualify leads instantly, 24/7",
    excerpt:
      "Automate responses to website contact forms or ad leads, asking qualification questions and booking consultations on the spot.",
    problem:
      "Leads go cold in minutes. If you respond to a website inquiry hours or days later, the prospect has already hired someone else. Chasing unqualified leads eats broker and owner hours.",
    whatWeBuild: [
      "Instant SMS and email response flows that engage new leads within two minutes",
      "A conversational qualification questionnaire that filters by budget, scope, and timeline",
      "Self-booking calendar links sent only to leads that meet your qualification criteria",
      "Real-time alerts in Slack or your inbox for high-value leads that need human attention",
    ],
    tools: ["HubSpot", "Typeform", "Twilio SMS", "Cal.com / Google Calendar", "Make or n8n"],
    timeline: "1 to 2 weeks to live",
    outcome:
      "Every lead is engaged in seconds. You screen out unqualified inquiries automatically, and qualified leads show up directly in your calendar with full context.",
    faq: [
      {
        q: "What if a lead doesn't meet the qualification criteria?",
        a: "They are sent a polite automated email redirecting them to self-serve resources, keeping your calendar clear for hot leads.",
      },
      {
        q: "Can it integrate with Facebook or Google ads?",
        a: "Yes. We connect lead forms from ads directly to the instant responder sequence.",
      },
    ],
    relatedIndustries: [
      "gyms-fitness",
      "construction-trades",
      "auto-repair",
      "law-firms",
      "accounting-firms",
      "real-estate",
      "insurance-agencies",
      "mortgage-brokerages",
      "photography-studios",
      "catering-services",
      "landscaping-gardening",
    ],
  },
  {
    slug: "social-media-automation",
    name: "Social media autopilot",
    title: "A month of posts in one click",
    excerpt:
      "Draft and schedule custom social media updates from your project photos, specials, or reviews automatically.",
    problem:
      "You know you need to post consistently to rank on local maps, but finding time to write posts and upload photos at the end of a long service day never happens.",
    whatWeBuild: [
      "Automatic draft post generation using your weekly project photos or customer reviews",
      "A centralized approval queue where you can review, tweak, and schedule a month of posts in 10 minutes",
      "Multi-platform publishing to Google Business Profile, Instagram, and Facebook on a schedule",
      "Local hashtags and SEO keywords researched and appended to every post automatically",
    ],
    tools: [
      "Google Business Profile API",
      "Buffer / Hootsuite",
      "Claude API",
      "Instagram/Facebook API",
    ],
    timeline: "1 week to live",
    outcome:
      "Consistent local social presence that boosts map rankings. You typically save 3-4 hours of marketing management a week, keeping your brand fresh on autopilot.",
    faq: [
      {
        q: "Do I have to write the posts?",
        a: "No. The AI drafts the captions based on your recent work details or customer reviews in your voice. You just review and approve.",
      },
      {
        q: "Does it post automatically without my review?",
        a: "You can toggle auto-publishing for standard reviews, but custom project posts are always queued for your one-tap approval.",
      },
    ],
    relatedIndustries: [
      "convenience-stores",
      "restaurants",
      "salons-spas",
      "gyms-fitness",
      "construction-trades",
      "auto-repair",
      "pet-grooming-boarding",
      "boutique-retail",
      "photography-studios",
      "catering-services",
      "landscaping-gardening",
      "residential-cleaning",
    ],
  },
  {
    slug: "feedback-and-reviews",
    name: "Review booster",
    title: "Turn satisfied clients into review stars",
    excerpt:
      "Request Google reviews via text the moment jobs are marked completed, and intercept negative feedback before it hits the web.",
    problem:
      "Unhappy customers write reviews without being asked. Happy ones forget. Chasing reviews manually feels needy, but they are the single most important factor for ranking on Google Maps.",
    whatWeBuild: [
      "Automatic SMS review requests sent immediately after service completion or payment",
      "Smart feedback routing: 5-star responses go straight to Google; 1 to 3-star feedback goes to a private manager alert for resolution",
      "Branded QR code signs for your counter or truck that direct customers to the review flow",
      "Monthly analytics tracking review growth and overall Google ranking improvements",
    ],
    tools: ["Google Business Profile API", "Twilio SMS", "Make or n8n", "Your booking software"],
    timeline: "1 week to live",
    outcome:
      "Google Maps review volume typically doubles or triples in 90 days, pushing you higher in local search results and capturing reviews when clients are happiest.",
    faq: [
      {
        q: "Is it safe to filter reviews?",
        a: "We ask for honest reviews while providing a direct channel for dissatisfied customers to reach a manager, ensuring compliance with review guidelines.",
      },
      {
        q: "Can it integrate with Yelp or Facebook reviews?",
        a: "Yes. We can direct users to the review site where you need the most growth.",
      },
    ],
    relatedIndustries: [
      "convenience-stores",
      "restaurants",
      "salons-spas",
      "gyms-fitness",
      "construction-trades",
      "auto-repair",
      "pet-grooming-boarding",
      "medical-clinics",
      "dental-offices",
      "law-firms",
      "accounting-firms",
      "real-estate",
      "veterinary-clinics",
      "physiotherapy-clinics",
      "residential-cleaning",
      "boutique-retail",
      "photography-studios",
      "catering-services",
      "landscaping-gardening",
      "optometry-clinics",
      "mental-health-practices",
      "tutoring-centers",
    ],
  },
  {
    slug: "customer-win-back",
    name: "Customer win-back",
    title: "Fill gaps with past customers",
    excerpt:
      "Identify clients who haven't booked in their usual timeframe and invite them back with personalized specials automatically.",
    problem:
      "Regular clients quietly slip away because life gets busy and they forget to rebook. Tracking down lapsed clients is tedious spreadsheet work that staff rarely have time for.",
    whatWeBuild: [
      "Automated database monitoring that flags lapsed clients based on their historical purchase or booking patterns",
      "Friendly, personalized win-back SMS or email sequences ('We haven't seen you in 3 months, Buddy is overdue for a groom!')",
      "Special rebooking offer codes and booking links embedded directly in campaigns",
      "Exclusion lists: the sequence stops instantly the moment they book or reply",
    ],
    tools: ["Mailchimp", "Klaviyo", "Twilio", "Your POS / CRM database", "Make or n8n"],
    timeline: "1 to 2 weeks to live",
    outcome:
      "Typically re-engages 8% to 15% of lapsed clients automatically. Your schedule stays fuller, and you recover lost customer lifetime value without manual email campaigns.",
    faq: [
      {
        q: "Can we control the discount or offer?",
        a: "Yes. You set the rules for the offer, or choose to send a simple check-in message without any discount.",
      },
      {
        q: "Will it email people who recently booked?",
        a: "Never. The system cross-checks your live calendar daily and excludes anyone with an upcoming appointment.",
      },
    ],
    relatedIndustries: [
      "convenience-stores",
      "restaurants",
      "salons-spas",
      "gyms-fitness",
      "construction-trades",
      "auto-repair",
      "pet-grooming-boarding",
      "medical-clinics",
      "dental-offices",
      "veterinary-clinics",
      "physiotherapy-clinics",
      "residential-cleaning",
      "boutique-retail",
      "photography-studios",
      "catering-services",
      "landscaping-gardening",
      "optometry-clinics",
      "mental-health-practices",
      "tutoring-centers",
    ],
  },
  {
    slug: "newsletter-compiler",
    name: "Newsletter compiler",
    title: "Newsletters that write themselves",
    excerpt:
      "Automatically compile your recent projects, blogs, and customer reviews into a monthly newsletter, ready for approval.",
    problem:
      "You want to keep in touch with your list, but spending hours in Mailchimp writing copy, uploading photos, and adjusting layouts is the last thing you want to do on a weekend.",
    whatWeBuild: [
      "Automated content scraper that pulls your recent project summaries, photos, and reviews into a draft template",
      "AI content writing that drafts the newsletter body in your brand voice",
      "A preview portal where you review the newsletter, swap images, and schedule the blast",
      "Automatic list cleaning: bounces and unsubscribes are scrubbed to keep deliverability high",
    ],
    tools: ["Mailchimp / HubSpot / ActiveCampaign", "Claude API", "Make or n8n"],
    timeline: "1 week to live",
    outcome:
      "Engaging monthly newsletters delivered to your client database on schedule. You typically save 3-5 hours of writing and template design every month.",
    faq: [
      {
        q: "Can I edit the draft before it sends?",
        a: "Yes. The newsletter is saved as a draft in your email marketing platform (e.g. Mailchimp). Nothing sends without your approval.",
      },
      {
        q: "What if we don't have new projects every month?",
        a: "The system can curate industry tips, highlight your popular services, or display seasonal maintenance advice instead.",
      },
    ],
    relatedIndustries: [
      "convenience-stores",
      "restaurants",
      "salons-spas",
      "gyms-fitness",
      "construction-trades",
      "auto-repair",
      "pet-grooming-boarding",
      "medical-clinics",
      "dental-offices",
      "law-firms",
      "accounting-firms",
      "real-estate",
      "veterinary-clinics",
      "physiotherapy-clinics",
      "residential-cleaning",
      "boutique-retail",
      "photography-studios",
      "catering-services",
      "landscaping-gardening",
      "optometry-clinics",
      "mental-health-practices",
      "insurance-agencies",
      "mortgage-brokerages",
      "tutoring-centers",
    ],
  },
  {
    slug: "contract-automation",
    name: "Contract & agreement signatures",
    title: "Get contracts signed in seconds",
    excerpt:
      "Send agreements, quotes, or consent forms automatically, with automated reminders that chase clients until signed.",
    problem:
      "Chasing clients for signed documents slows down projects, delays treatments, and causes clutter. Brokers and coordinators spend hours emailing 'Just following up on the agreement'.",
    whatWeBuild: [
      "Automated contract generation populated with intake data the moment a deal moves or bookings are made",
      "Multi-channel delivery (SMS + email) with secure signature links",
      "A reminder ladder that sends polite nudges every 48 hours to unsigned parties",
      "Automatic file archival: signed contracts are saved directly to your client folder in Google Drive or CRM",
    ],
    tools: ["PandaDoc / DocuSign / SignWell", "HubSpot", "Google Drive", "Make or n8n"],
    timeline: "1 week to live",
    outcome:
      "Contracts are typically signed 3-5 days faster. Admin staff stop checking signatures manually, and projects start without paperwork delays.",
    faq: [
      {
        q: "Are these electronic signatures legally binding?",
        a: "Yes. We use standard e-sign providers that comply with UETA, ESIGN Act, and Canadian PIPEDA laws.",
      },
      {
        q: "Can it support multiple signers?",
        a: "Yes. The workflow can route the document to the client first, then to your team for countersigning automatically.",
      },
    ],
    relatedIndustries: [
      "law-firms",
      "accounting-firms",
      "real-estate",
      "insurance-agencies",
      "mortgage-brokerages",
      "construction-trades",
      "photography-studios",
      "catering-services",
      "landscaping-gardening",
    ],
  },
  {
    slug: "expense-matching",
    name: "Expense & receipt matching",
    title: "Receipts that match themselves",
    excerpt:
      "Text or email receipt photos to your bookkeeping folder, where they are matched to bank transactions automatically.",
    problem:
      "Receipts fade, get lost, or sit in gloveboxes until tax season. Then you spend hours matching credit card statements to crumbled paper receipt photos.",
    whatWeBuild: [
      "A dedicated email or text number where crews submit receipt photos on the road",
      "AI data extraction: reads vendor, date, total, and tax details from the image",
      "Automatic transaction matching against credit card or bank feed records in your accounting software",
      "Alerts for missing receipts: flags bank transactions that lack matching receipt attachments",
    ],
    tools: ["Dext / Hubdoc", "QuickBooks / Xero", "Twilio SMS", "Claude API (OCR)", "Make or n8n"],
    timeline: "1 to 2 weeks to live",
    outcome:
      "A clean expense ledger every month. T4/T5 season takes minutes instead of weekends, and you maximize tax write-offs without missing paper trails.",
    faq: [
      {
        q: "Does it work with fuel and hardware store receipts?",
        a: "Yes. The AI extracts details from fuel receipts, hardware purchases, or restaurant bills, categorizing them automatically.",
      },
      {
        q: "Is it secure for company credit card details?",
        a: "Yes. It only reads the receipt total and matches it to your accounting bank feed; it never accesses or stores credit card numbers.",
      },
    ],
    relatedIndustries: [
      "convenience-stores",
      "restaurants",
      "construction-trades",
      "auto-repair",
      "accounting-firms",
      "catering-services",
      "landscaping-gardening",
      "residential-cleaning",
    ],
  },
  {
    slug: "staff-scheduling",
    name: "Staff roster scheduling",
    title: "Weekly rosters that write themselves",
    excerpt:
      "Generate crew schedules based on booking volume, client preferences, and staff availability, with SMS roster alerts.",
    problem:
      "Scheduling 5 to 15 cleaners, therapists, or technicians weekly is a giant puzzle. Factoring in holiday requests, travel times, and customer preference takes a manager hours of spreadsheet work.",
    whatWeBuild: [
      "Schedule drafting script that balances booking capacity against roster availability and client preferences",
      "Automatic roster publication and SMS/email alerts sent to all employees on schedule",
      "Shift swapping portal: staff request swaps which are approved or routed automatically according to center rules",
      "Timesheet matching: compares rosters against POS log-ins for payroll prep",
    ],
    tools: ["7shifts / Deputy / When I Work", "Square POS", "Twilio SMS", "Make or n8n"],
    timeline: "2 weeks to live",
    outcome:
      "Schedule building takes minutes. Shifts are distributed instantly, crew members swap shifts without manager phone tag, and payroll prep time typically drops by up to 80%.",
    faq: [
      {
        q: "Can it handle part-time availability limits?",
        a: "Yes. The scheduler enforces weekly hour caps and custom availability profiles for each employee.",
      },
      {
        q: "Can managers override drafts?",
        a: "Absolutely. The roster is saved as a draft for manager review and manual overrides before publishing to the team.",
      },
    ],
    relatedIndustries: [
      "restaurants",
      "salons-spas",
      "gyms-fitness",
      "medical-clinics",
      "dental-offices",
      "veterinary-clinics",
      "physiotherapy-clinics",
      "residential-cleaning",
      "pet-grooming-boarding",
      "tutoring-centers",
    ],
  },
  {
    slug: "client-notifications",
    name: "Custom notifications",
    title: "Keep clients in the loop",
    excerpt:
      "Trigger automatic, personalized service stage updates (parts ordered, technician en route, ready for pickup) to clients.",
    problem:
      "Clients phone your office constantly to ask: 'Is my report ready?' 'Is my dog done?' 'Are the parts in?' Every call interrupts productive work and slows down service.",
    whatWeBuild: [
      "Automatic status triggers tied to card movements in your CRM or project board",
      "Branded text and email alerts sent to customers at key stages of their service",
      "Self-serve status tracking links showing progress and estimated completion time",
      "Staff notification alerts when a customer replies directly to a status update",
    ],
    tools: ["Twilio SMS", "HubSpot / Jobber / Jane", "SendGrid", "Make or n8n"],
    timeline: "1 to 2 weeks to live",
    outcome:
      "Office phone inquiries typically decrease by 40-50%. Clients feel constantly updated, increasing trust and satisfaction without staff manually calling them.",
    faq: [
      {
        q: "Can we write our own status messages?",
        a: "Yes. You have full control over the template wording, variables (like client name, car model), and tone of every message.",
      },
      {
        q: "Does it support two-way texting?",
        a: "Yes. If a client replies to a status update, their reply is routed directly to the manager's phone or dashboard.",
      },
    ],
    relatedIndustries: [
      "convenience-stores",
      "salons-spas",
      "construction-trades",
      "auto-repair",
      "pet-grooming-boarding",
      "medical-clinics",
      "dental-offices",
      "law-firms",
      "accounting-firms",
      "real-estate",
      "veterinary-clinics",
      "physiotherapy-clinics",
      "residential-cleaning",
      "boutique-retail",
      "photography-studios",
      "catering-services",
      "landscaping-gardening",
      "optometry-clinics",
      "mental-health-practices",
      "insurance-agencies",
      "mortgage-brokerages",
      "tutoring-centers",
    ],
  },
] as const;

export function serviceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
