/**
 * What: The four digital-services offerings (website development, application development,
 *       rebranding/brand design, digital marketing) - a second line of business alongside
 *       the AI-automation catalog in content/services.ts.
 * Why: These don't share the automation-specific shape of content/services.ts's Service
 *      interface (tools/timeline/relatedIndustries are built for individual automation
 *      detail pages), and there's no real process/timeline/pricing detail for these four
 *      lines yet - so they get one lightweight overview shape, rendered on a single
 *      /digital-services page rather than four individual detail pages with invented
 *      specifics. Pricing follows the site's existing "quoted after a free audit" pattern
 *      (see content/site.ts's pricing.practice) - no numbers here.
 * How: Plain typed const array; consumed by /digital-services and the homepage teaser.
 * From Where: Founder request, 2026-08 - the site was AI-automation-only until this point.
 * When: 2026-08.
 */

export interface DigitalService {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  bullets: string[];
}

export const digitalServices: readonly DigitalService[] = [
  {
    slug: "website-development",
    name: "Website Development",
    tagline: "A site that loads fast, reads clearly, and gets you found.",
    description:
      "Marketing sites, business sites, and custom builds - designed and built from scratch, not templated. Every site is fast, mobile-first, and set up to actually rank.",
    bullets: [
      "Custom design, not a stock theme",
      "Built for speed and mobile first",
      "SEO fundamentals done right from day one",
      "You own the site - no lock-in",
    ],
  },
  {
    slug: "application-development",
    name: "Application Development",
    tagline: "Web and mobile apps built around how your business actually runs.",
    description:
      "Custom web and mobile applications - internal tools, customer-facing apps, or a system that connects the two. Built to fit your process, not the other way around.",
    bullets: [
      "Web and mobile, single codebase where it makes sense",
      "Connects to the tools you already use",
      "Built to scale with real usage, not a demo",
      "You get the source - no black box",
    ],
  },
  {
    slug: "rebranding",
    name: "Rebranding & Brand Design",
    tagline: "A brand that looks like the business you actually run.",
    description:
      "Logo, visual identity, and brand guidelines - for a business outgrowing its first-draft look, or one that never had a real one. Consistent across your site, cards, and signage.",
    bullets: [
      "Logo and visual identity",
      "Brand guidelines your team can actually use",
      "Consistent look across site, print, and social",
      "Built to carry across everything you build next",
    ],
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    tagline: "Get found by the people already looking for you.",
    description:
      "SEO, paid ads, and social media management - set up and run so your marketing spend goes toward people who are actually ready to buy, not just clicks.",
    bullets: [
      "SEO built on the site work, not bolted on after",
      "Paid ads managed and reported on plainly",
      "Social media that stays consistent without eating your week",
      "Clear monthly reporting - what worked, what didn't",
    ],
  },
] as const;
