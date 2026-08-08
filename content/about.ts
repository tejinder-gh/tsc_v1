/**
 * What: About-page copy - founder story and credibility markers.
 * Why: Founder-led trust content changes rarely but must be editable without touching layout.
 * How: Plain typed constants consumed by app/about/page.tsx.
 * From Where: TheSkillCorner marketing site build brief, 2026-06.
 * When: 2026-06; replace placeholder bio details and photo before launch.
 */

export const about = {
  headline: "Built by an engineer who got tired of watching good businesses drown in admin.",
  founder: {
    name: "Tejinder Pal Singh",
    title: "Founder | Managing Director",
  },
  story: [
    "The Skill Corner started with a simple observation: the owners working the hardest were spending the least time on the work that actually grows a business. A store owner rebuilding supplier orders every Sunday night. A clinic front desk re-typing forms patients had already filled out. A lawyer answering the same intake questions for the tenth time that week.",
    "None of that work needs a person anymore. After fifteen years building software systems - from small-business tools to platforms handling millions of requests - I started The Skill Corner to bring that same engineering discipline to the businesses that never get it: the storefronts, clinics, and firms that big software companies fly right over.",
    "We are deliberately small, deliberately local, and deliberately boring about technology. We use proven tools, we connect to what you already have, and we measure success in one unit: hours handed back to you and your staff.",
  ],
  credibility: [
    "15+ years building production software systems",
    "Full-stack engineering: integrations, AI/LLM systems, and the unglamorous plumbing between them",
    "Builds on proven platforms - Twilio, Cal.com, Make, the Claude API - not science projects",
    "PIPEDA/PHIPA-aware delivery for clinics, dental offices, and law firms",
    "Every build monitored and supported - nothing is handed over and forgotten",
  ],
  photoCaption: "Founder photo - replace /public/founder.jpg before launch.",
} as const;
