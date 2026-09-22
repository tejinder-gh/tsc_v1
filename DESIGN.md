# Design System - The Skill Corner

Direction: **approachable precision** - trustworthy enough for a doctor, plain enough
for a store owner. No sci-fi, no robots, no gradient blobs.

## Palette

### Canonical Semantic Palette (Phase 01 / Redesign v2)
Defined in `app/globals.css` under `:root` and `@theme`. These tokens represent the single source of truth across all public and editorial interfaces:

| Token | CSS Variable | Hex | Use |
| --- | --- | --- | --- |
| `ink` | `--tsc-ink` | `#12130f` | Primary text, titles, dark sections, high-contrast borders |
| `paper` | `--tsc-paper` | `#f4f1e9` | Primary warm background canvas across pages and heroes |
| `surface` | `--tsc-surface` | `#fbf9f3` | Soft surface tint for secondary callouts, cards, inputs |
| `line` | `--tsc-line` | `#d7d2c7` | Hairline dividers, section borders, component bounds |
| `muted` | `--tsc-muted` | `#6d6b63` | Secondary text, section eyebrows, metadata labels |
| `signal` | `--tsc-signal` | `#d5ff52` | Accent lime signal for high-urgency status and active indicators |
| `action` | `--tsc-action` | `#2d51ff` | Primary interactive blue for focused actions, links, focus rings |
| `positive` | `--tsc-positive` | `#2e694e` | Success states and verified indicators |
| `white` | `--tsc-white` | `#ffffff` | Pure white for contrast accents and crisp foreground highlights |

### Legacy Palette (Backward-Compatible Aliases)
Retained in `@theme` in `app/globals.css` to support existing component markups:

| Token | Hex | Use |
| --- | --- | --- |
| `navy` | `#08215B` | Legacy headings, footer, icon ground |
| `blue` | `#2563EB` | Legacy button and accent alias |
| `blue-pressed` | `#1B49B8` | Blue hover/pressed |
| `blue-tint` | `#EAF0FE` | Soft blue backgrounds, selected states |
| `slate` | `#5A6480` | Legacy body copy on white |
| `paper` | `#FFFFFF` | Legacy pure white page background |
| `mist` | `#F2F5FA` | Alternating section background |
| `line` | `#DDE3EE` | Legacy hairline borders/dividers |
| `muted` | `#97A0B8` | Legacy de-emphasized text/icons |

Rule: the eye learns **action blue = one primary action per screen**. Roughly 70% paper canvas, 20% ink typography, 10% action/surface accents on any given page.

Tokens are defined once in `app/globals.css` under `:root` and `@theme` (Tailwind v4).

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
