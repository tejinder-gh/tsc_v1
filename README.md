# The Skill Corner - Marketing Site

Conversion-focused marketing site for The Skill Corner, an AI automation agency serving
local businesses (stores, restaurants, salons) and professional practices (clinics,
dental offices, law firms).

Every page surfaces at least two rungs of the conversion ladder:

1. Book a free automation audit (`/book`, Cal.com embed)
2. Send a quick query (`/contact`)
3. Download the Automation Opportunities Checklist (`/checklist`, email-gated)
4. Get the ROI report emailed (home-page calculator capture)

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS v4 (theme tokens live in `app/globals.css`, no config file)
- React Hook Form + Zod (shared schemas validate client and server)
- Biome (lint + format), Vitest (unit tests)
- No CMS, no database - all copy in typed constants under `/content`

## Setup

```bash
npm install
cp .env.example .env.local   # fill in values below
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run format`, `npm test`.

Deploys to Vercel with zero config - import the repo, set the env vars, done.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `LEAD_WEBHOOK_URL` | Yes (prod) | Zapier/Make/n8n catch hook. Every form POSTs JSON here. Without it, leads return `delivered:false` and log a server warning (dev-friendly). |
| `NEXT_PUBLIC_CAL_LINK` | Yes (prod) | Cal.com event link, e.g. `yourname/automation-audit`. Without it, `/book` shows an email fallback. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | One of these | Plausible site domain. Takes precedence over GA4. |
| `NEXT_PUBLIC_GA_ID` | One of these | GA4 measurement ID (`G-XXXX`). |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Canonical URL for metadata, sitemap, JSON-LD. |
| `NEXT_PUBLIC_CHECKLIST_PDF_URL` | Yes (prod) | Hosted checklist PDF shown after the email gate. |

## Webhook payload

Every submission posts JSON with at minimum:

```json
{
  "lead_source": "contact_form | checklist_page | exit_intent | quick_widget | roi_calculator",
  "segment": "local | practice | unknown",
  "page": "/for/dental-offices",
  "submitted_at": "2026-06-09T20:00:00.000Z"
}
```

Plus form-specific fields (`name`, `email`, `business_type`, `message`, `budget`,
`roi_hours_per_week`, `roi_hourly_cost`, `roi_annual_cost`). Schemas: `lib/schemas.ts`.

Note: the ROI "Email me this report" capture sends the inputs and result to the webhook;
your Zapier/Make scenario is responsible for actually emailing the report (a simple
templated email using the `roi_*` fields).

## Editing content

All copy lives in `/content` - no component changes needed:

- `content/site.ts` - brand, nav, contact, **pricing anchors**, business-type options, checklist copy
- `content/home.ts` - hero, segment router cards, problem strips, how-it-works
- `content/industries.ts` - the six industry funnel pages
- `content/services.ts` - the six service pages
- `content/proof.ts` - "Recent builds" grid (replace with testimonials when permissioned)
- `content/faq.ts` - home FAQ
- `content/about.ts` - founder story

### Adding an industry page

1. Add an object to the `industries` array in `content/industries.ts` (copy an existing
   one; the `Industry` type enforces completeness - headline, 3 pains, 3 automations
   with metrics, a proof build, FAQ, meta description, and `segment`).
2. That's it. The page (`/for/<slug>`), the `/for` index card, footer link, and sitemap
   entry all generate from the array. Optionally reference the slug from a service's
   `relatedIndustries`.

## Segmentation

- The home-page router cards set the visitor's segment; landing on any `/for/[slug]`
  page sets it too (ad traffic self-identifies).
- Stored in `sessionStorage` (`tsc_segment`) - never localStorage, resets per visit.
- Personalizes: problem strip, proof ordering, and pricing anchors. Where the segment is
  known, only that segment's pricing anchor is ever rendered (practices see the
  PIPEDA/PHIPA compliance note; local businesses see fixed packages).

## Swapping the booking provider

Cal.com is the default (`components/BookingEmbed.tsx`). To use Calendly instead:

1. `npm uninstall @calcom/embed-react`
2. In `BookingEmbed.tsx`, replace the `<Cal />` element with Calendly's inline widget:
   `<div className="calendly-inline-widget" data-url={url} style={{ minWidth: "320px", height: "700px" }} />`
   plus their script tag via `next/script` (`https://assets.calendly.com/assets/external/widget.js`).
3. Point the env var at your Calendly URL (rename it if you like; it is read in
   `content/site.ts`).

## Analytics events

Two events fire everywhere, with `location` and `segment` properties:

- `cta_clicked` - every CTA (header, hero, segment router, widget, sticky bar, pricing, final banners)
- `lead_captured` - every successful form submit (fired client-side after the API accepts)

`lib/analytics.ts` no-ops when no provider is configured.

## Tests

`npm test` runs Vitest over the pure logic: ROI math (`lib/roi.test.ts`) and the
lead/form validation schemas (`lib/schemas.test.ts`). The API route delegates all
validation to those schemas.

## Project layout

```
app/          routes (App Router), API route, sitemap, robots
components/   shared UI; home/ sections; capture/ widgets; forms/
content/      all editable copy (typed)
lib/          analytics, segment context, ROI math, zod schemas, lead client
```
