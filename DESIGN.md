# Design System - The Skill Corner

Direction: **approachable precision** - trustworthy enough for a doctor, plain enough
for a store owner. No sci-fi, no robots, no gradient blobs.

## Palette

| Token | Hex | Use |
| --- | --- | --- |
| `ink` | `#14242E` | Headings, dark bands (calculator, final CTA, footer) |
| `slate` | `#4A5C66` | Body text |
| `paper` | `#FBFBFA` | Page background |
| `mist` | `#ECF1EF` | Alternating section background, soft cards |
| `ledger` | `#0C7E54` | THE accent: CTAs, key numbers, slider thumbs - nothing else (darkened from the original #0E8A5C to clear WCAG AA 4.5:1 with white button text) |
| `ledger-dark` | `#0A6B47` | CTA hover/pressed |

Rule: the eye learns **green = action and dollars saved**. Never use ledger green for
decoration. (One exception: on the ink card the result figure uses a lightened
`#2FB97E` for WCAG AA contrast against `#14242E`.)

Tokens are defined once in `app/globals.css` under `@theme` (Tailwind v4).

## Typography

- Display: **Bricolage Grotesque** (`--font-display`, utility `font-display`) - headings, key numbers
- Body: **Public Sans** (`--font-body`, default on `body`)
- Scale in practice: 14 / 16 / 18 / 22 (lg) / 30 (3xl) / 36 (4xl) / 48 (5xl) / 60 (6xl)

Both load via `next/font/google` with `display: swap`.

## Layout

Single-column narrative, max width `72rem` (`max-w-site`), full-bleed alternating
paper/mist bands. Cards: white, `rounded-xl`, 2px `ink/10` borders that turn `ledger`
on hover. The only dark bands are the ROI calculator and the final CTA/footer -
deliberate bookends.

## Signature element

The ROI calculator (`components/home/RoiCalculator.tsx`): ink-dark card, oversized
tabular ledger-green annual figure, custom green slider thumbs. All boldness is spent
here; everything else stays disciplined.

## Motion

One orchestrated hero reveal (staggered 90ms rise), subtle card hover transitions,
nothing else. Everything respects `prefers-reduced-motion` (disabled in globals.css).

## Anti-template self-critique

- Not cream + serif + terracotta: sans display face, cool paper, green accent
- Not near-black + acid green: light UI; deep ledger green on light grounds; dark used
  only as bookends
- Not broadsheet hairline rules: carded, rounded, 2px borders, generous whitespace
- Accepted risk: green CTAs can read "fintech" - offset by warm copy voice and
  Bricolage's character
