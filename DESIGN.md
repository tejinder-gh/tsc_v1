# Design System - The Skill Corner

Direction: **approachable precision** - trustworthy enough for a doctor, plain enough
for a store owner. No sci-fi, no robots, no gradient blobs.

## Palette

| Token | Hex | Use |
| --- | --- | --- |
| `navy` | `#08215B` | Headings, footer, icon ground - the logo's ink |
| `blue` | `#2563EB` | THE accent - "the dot" from the logo. Links, primary buttons, one accent per view - nothing else |
| `blue-pressed` | `#1B49B8` | Blue hover/pressed |
| `blue-tint` | `#EAF0FE` | Soft blue backgrounds, selected states |
| `slate` | `#5A6480` | Body copy on white |
| `paper` | `#FFFFFF` | Page background |
| `mist` | `#F2F5FA` | Alternating section background, soft cards |
| `line` | `#DDE3EE` | Hairline borders/dividers |
| `muted` | `#97A0B8` | De-emphasized text/icons |

Rule: the eye learns **blue = one action per screen**. Blue is the dot from the logo -
it marks the primary CTA or link, not every heading. Roughly 70% white, 20% navy, 10%
blue on any given page.

Contrast: navy on white is 14.7:1, blue on white is 5.2:1 - both pass AA for body text.
White on blue passes at 18px and above; below that use navy. On the navy ROI-calculator
card, the result figure uses a lightened `#60A5FA` (~6:1 against navy) instead of base
blue, which only clears ~3:1 on that dark ground.

Tokens are defined once in `app/globals.css` under `@theme` (Tailwind v4).

## Typography

- Display: **Poppins**, weights 500/600 only (`--font-display`, utility `font-display`) -
  headings and buttons. Matches the wordmark: geometric, near-monoline, wide apertures.
  Loses legibility below 18px, so never use it for body copy.
- Body: **DM Sans**, weights 400/700 (`--font-body`, default on `body`)
- Type scale:
  - H1: 62/65, -3% tracking
  - H2: 38/44
  - H3: 22/30
  - Body: 18/30
  - Eyebrow: DM Sans Bold, 13px, +16% tracking, all caps
- Keep numerals tabular in phone numbers and pricing (`tabular-nums`).

Both load via `next/font/google` with `display: swap`.

## Iconography

Line icons at 1.7px stroke on a 24px grid (`lucide-react`, `strokeWidth={1.7}`). Navy
strokes with one blue stroke or dot per icon - the same one-accent rule as the logo.

## Layout

Single-column narrative, max width `72rem` (`max-w-site`), full-bleed alternating
paper/mist bands. Cards: white, `rounded-xl`, 2px `navy/10` borders that turn `blue`
on hover. The only dark bands are the ROI calculator and the final CTA/footer -
deliberate bookends.

## Signature element

The ROI calculator (`components/home/RoiCalculator.tsx`): navy-dark card, oversized
tabular blue annual figure, custom blue slider thumbs. All boldness is spent here;
everything else stays disciplined.

## Motion

One orchestrated hero reveal (staggered 90ms rise), subtle card hover transitions,
nothing else. Everything respects `prefers-reduced-motion` (disabled in globals.css).

## Anti-template self-critique

- Not cream + serif + terracotta: sans display face, cool paper, blue accent
- Not near-black + acid green: light UI; deep navy on light grounds; dark used only as
  bookends; blue reserved for the single accent per view
- Not broadsheet hairline rules: carded, rounded, 2px borders, generous whitespace
- Accepted risk: navy + blue can read "fintech/SaaS" - offset by warm copy voice and
  Poppins's geometric character
