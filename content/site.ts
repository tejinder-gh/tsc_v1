/**
 * What: Global site content - brand identity, nav, contact details, segment pricing anchors,
 *       business-type options, and checklist lead-magnet copy.
 * Why: v1 ships with no CMS; every piece of editable copy lives in typed constants so a
 *      non-engineer can change pricing or contact info in one file without touching components.
 * How: Plain exported const objects typed with interfaces. Pricing is keyed by Segment so
 *      components can never accidentally show the practice anchor to the local segment.
 * From Where: TheSkillCorner marketing site build brief (conversion-ladder spec), 2026-06.
 * When: 2026-06; revisit when pricing changes or a CMS is introduced.
 */

export type Segment = "local" | "practice";

export interface Office {
  city: string;
  region?: string;
  country: string;
}

export const site = {
  name: "The Skill Corner",
  legalName: "The Skill Corner Inc.",
  tagline: "AI automation and digital services for local businesses and professional practices",
  description:
    "The Skill Corner builds AI automations for local businesses and professional practices - missed-call answering, booking reminders, intake processing, review responses, and follow-up that never slips - alongside website development, application development, brand design, and digital marketing.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://theskillcorner.com",
  email: "info@theskillcorner.com",
  /** Primary (North America) line - used for the main tel: link and JSON-LD `telephone`. */
  phone: "+1-437-972-4379",
  /** Secondary (India) line. */
  phoneIndia: "+91-79733-93949",
  principal: {
    name: "Tejinder Pal Singh",
    title: "Founder | Managing Director",
  },
  /** Registered/primary address, used for legal copy and the main JSON-LD address. */
  address: {
    locality: "Toronto",
    region: "ON",
    country: "CA",
  },
  /**
   * The four-office locality rail (brief §2/§7): brand furniture, not a claim of legal
   * entity per office - presented as offices in the footer rail and JSON-LD only.
   */
  offices: [
    { city: "Toronto", region: "ON", country: "CA" },
    { city: "Surrey", region: "BC", country: "CA" },
    { city: "California", region: "CA", country: "US" },
    { city: "Ludhiana", region: "PB", country: "IN" },
  ] as readonly Office[],
  sameAs: [
    // "https://www.google.com/maps?cid=YOUR_BUSINESS_ID",
    // "https://clutch.co/profile/the-skill-corner",
  ],
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const nav: readonly NavItem[] = [
  { label: "What we automate", href: "/what-we-automate" },
  { label: "Digital Services", href: "/digital-services" },
  { label: "Industries", href: "/industries" },
  { label: "About", href: "/about" },
  { label: "Free checklist", href: "/checklist" },
] as const;

export interface PricingAnchorContent {
  label: string;
  anchor: string;
  detail: string;
  compliance?: string;
}

/**
 * Segment-specific pricing anchors. Local businesses see productized fixed prices;
 * practices see engagement ranges plus the compliance note. Components must show
 * only the anchor for the known segment.
 */
export const pricing: Record<Segment, PricingAnchorContent> = {
  local: {
    label: "Starter automation",
    anchor: "From $395/month",
    detail:
      "Fixed monthly price, setup included. Most owners start with one automation and add more once the first pays for itself. Cancel any month.",
  },
  practice: {
    label: "Custom build",
    anchor: "Typical engagements run $7,500 - $25,000",
    detail:
      "Scoped and quoted after your audit, with monitoring and support from $1,500/month. You approve the scope before anything is built.",
    compliance:
      "PIPEDA/PHIPA-aware data handling. No patient or client records touch our systems without a signed agreement, and we work inside your existing tools wherever possible.",
  },
};

export interface BusinessTypeOption {
  value: string;
  label: string;
  segment: Segment;
}

/** Options for the "business type" selects; each maps to a segment for lead routing. */
export const businessTypes: readonly BusinessTypeOption[] = [
  { value: "convenience-store", label: "Convenience or retail store", segment: "local" },
  { value: "restaurant", label: "Restaurant or cafe", segment: "local" },
  { value: "salon-spa", label: "Salon, spa, or barbershop", segment: "local" },
  { value: "gym-fitness", label: "Gym or fitness studio", segment: "local" },
  { value: "construction-trades", label: "Construction or trade service", segment: "local" },
  { value: "auto-repair", label: "Auto repair or detailing shop", segment: "local" },
  { value: "pet-grooming-boarding", label: "Pet grooming or boarding salon", segment: "local" },
  { value: "residential-cleaning", label: "Residential cleaning service", segment: "local" },
  { value: "boutique-retail", label: "Boutique or specialty retail store", segment: "local" },
  { value: "photography-studio", label: "Photography studio", segment: "local" },
  { value: "catering-service", label: "Catering or event food service", segment: "local" },
  { value: "landscaping-gardening", label: "Landscaping or gardening service", segment: "local" },
  { value: "other-local", label: "Other local business", segment: "local" },
  { value: "medical-clinic", label: "Medical clinic", segment: "practice" },
  { value: "dental-office", label: "Dental office", segment: "practice" },
  { value: "law-firm", label: "Law firm", segment: "practice" },
  { value: "accounting", label: "Accounting or bookkeeping firm", segment: "practice" },
  { value: "real-estate", label: "Real estate office", segment: "practice" },
  {
    value: "veterinary-clinic",
    label: "Veterinary clinic or animal hospital",
    segment: "practice",
  },
  {
    value: "physiotherapy-clinic",
    label: "Physiotherapy or chiropractic clinic",
    segment: "practice",
  },
  { value: "optometry-clinic", label: "Optometry clinic", segment: "practice" },
  {
    value: "mental-health-practice",
    label: "Mental health or therapy practice",
    segment: "practice",
  },
  { value: "insurance-agency", label: "Insurance agency or brokerage", segment: "practice" },
  { value: "mortgage-brokerage", label: "Mortgage brokerage", segment: "practice" },
  { value: "tutoring-center", label: "Tutoring or learning center", segment: "practice" },
  { value: "other-practice", label: "Other practice or firm", segment: "practice" },
] as const;

export function segmentForBusinessType(value: string): Segment | null {
  const match = businessTypes.find((t) => t.value === value);
  return match ? match.segment : null;
}

export const checklist = {
  title: "The Automation Opportunities Checklist",
  subtitle: "25 tasks your business can stop doing by hand",
  description:
    "A plain-English checklist of the 25 most common tasks we see owners and office managers doing manually - with a note on how each one gets automated and roughly how many hours it gives back.",
  bullets: [
    "The 6 phone and inquiry tasks an AI receptionist takes over",
    "5 booking and reminder workflows that cut no-shows",
    "The paperwork and intake steps that fill themselves in",
    "Review, reputation, and social tasks you can stop dreading",
    "A scoring column to rank which one pays back fastest for you",
  ],
} as const;

export const booking = {
  calLink: process.env.NEXT_PUBLIC_CAL_LINK ?? "",
  promise:
    "30 minutes, no pitch deck. You leave with 3 automation ideas for your business whether you hire us or not.",
} as const;
