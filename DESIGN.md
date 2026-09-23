# Design System — The Skill Corner

Direction: **approachable precision** — an editorial technical journal for automated systems. Trustworthy enough for a medical clinic or law firm, clear and direct enough for a busy store or trade owner. No generic SaaS gradients, no robot illustrations, and no vague sci-fi tropes.

---

## 1. Palette

### 1.1 Canonical Semantic Palette (Phase 01 / Editorial Redesign)
Defined in `app/globals.css` under `:root` and `@theme`. These tokens represent the single source of truth across all public, catalog, and journey interfaces:

| Token | CSS Variable | Hex | Role & Usage |
| --- | --- | --- | --- |
| `ink` | `--tsc-ink` | `#12130f` | Primary text, titles, dark sections, high-contrast buttons, active borders |
| `paper` | `--tsc-paper` | `#f4f1e9` | Primary warm editorial background canvas across pages and heroes |
| `surface` | `--tsc-surface` | `#fbf9f3` | Soft surface tint for secondary callouts, cards, and input wells |
| `line` | `--tsc-line` | `#d7d2c7` | Hairline dividers, non-interactive section borders, structural rules |
| `line-strong` | `--tsc-line-strong` | `#817e74` | High-contrast interactive borders (inputs, search, controls) meeting WCAG AA 3:1 |
| `muted` | `--tsc-muted` | `#6d6b63` | Secondary text, section eyebrows, metadata labels, search icons |
| `signal` | `--tsc-signal` | `#d5ff52` | Accent lime signal for high-urgency status, active pills, and live indicators |
| `action` | `--tsc-action` | `#2d51ff` | Primary interactive blue for focused actions, active links, and focus rings |
| `positive` | `--tsc-positive` | `#2e694e` | Verified outcomes, completed progress, and positive metrics |
| `white` | `--tsc-white` | `#ffffff` | Pure white for crisp contrast accents, elevated cards, and input grounds |

### 1.2 Legacy Palette (Backward-Compatible Aliases)
Retained in `@theme` in `app/globals.css` to support existing component markups during progressive enhancement:

| Token | Hex | Role |
| --- | --- | --- |
| `navy` | `#08215B` | Legacy headings, footer, icon ground |
| `blue` | `#2563EB` | Legacy button and accent alias |
| `blue-pressed` | `#1B49B8` | Blue hover/pressed |
| `blue-tint` | `#EAF0FE` | Soft blue backgrounds, selected states |
| `slate` | `#5A6480` | Legacy body copy on white |
| `border-input` | `#848CA0` | Legacy form input borders (WCAG AA compliant on white) |
| `mist` | `#F2F5FA` | Alternating section background |
| `line` | `#DDE3EE` | Legacy hairline borders/dividers |
| `muted` | `#97A0B8` | Legacy de-emphasized text/icons |

**Composition Rule:** The eye learns **action blue / ink = one primary action per screen**. Roughly 70% warm paper canvas, 20% ink typography, 10% signal / action / surface accents on any given page.

---

## 2. Typography

The application utilizes **Geist** and **Geist Mono** loaded via `next/font/google` (`app/layout.tsx`), mapped to CSS variables `--font-geist-sans` and `--font-geist-mono` with utility `font-geist`.

- **Primary Sans (`Geist`, `--font-geist`):**
  - Headings: Bold / Semi-bold (weights 600/700), tight tracking (`tracking-[-0.035em]`), disciplined leading.
  - Body Copy: Regular / Medium (weights 400/500), comfortable reading line-height.
- **Monospace Technical Accents (`Geist Mono`, `--font-geist-mono`):**
  - Section Eyebrows & Labels: Uppercase, tracking-widest (`tracking-[0.14em]`), font-mono.
  - Telemetry & Metadata: Timestamps, status codes, scenario indices, pricing numbers (`tabular-nums`).
- **Type Scale:**
  - Hero Cover H1: 62–84px, leading-[0.95], tracking-[-0.035em]
  - Section Title H2: 36–48px, leading-[1.05], tracking-[-0.025em]
  - Card Title H3: 18–24px, leading-[1.2]
  - Body: 15–18px, leading-[1.6]
  - Eyebrows & Metadata: 11–13px, font-mono, uppercase

*(Note: Self-hosted Poppins and DM Sans woff2 files are preserved in `/fonts/` as legacy fallbacks).*

---

## 3. Iconography & Graphical Primitives

- Icons: Line icons at 1.5–1.7px stroke on a 24px grid (`lucide-react`, `strokeWidth={1.5}` or `1.7`).
- Status Indicators: 8px circular signal dots with subtle ring borders (e.g. `ring-4 ring-[var(--tsc-line)] bg-[var(--tsc-signal)]`).
- Dividers: Crisp hairline rules (`border-[var(--tsc-line)]`).
- Focus Rings: High-contrast focus outlines (`focus-visible:outline-2 focus-visible:outline-[var(--tsc-action)]` or `focus:ring-2 focus:ring-[var(--tsc-ink)]`).

---

## 4. Layout & Grid

- Max site container: `1440px` (`max-w-[1440px] px-6 lg:px-16`) for editorial full-bleed experiences, and `max-w-site` (`72rem`) for legacy reading templates.
- Cards & Containers: Crisp, disciplined radius (`rounded-[4px]` to `rounded-[8px]`), hairline borders (`border-[var(--tsc-line)]`), with high-contrast input boundaries (`border-[var(--tsc-line-strong)]`).
- Surface Hierarchy: Pure white elevated cards floating on warm paper background canvas (`--tsc-paper`).

---

## 5. Anti-Template Self-Critique

- **Not generic SaaS:** Replaces generic dark gradients and purple glowing blobs with a grounded, editorial print feel (warm paper canvas + deep carbon ink).
- **Not ungrounded broadsheet:** Balances editorial structure with interactive live tools (the deterministic Opportunity Diagnostic and System Demonstration).
- **Accessibility by design:** Text and interactive elements meet WCAG 2.1 AA standards; inputs use `--tsc-line-strong` (>=3:1 contrast against both paper and white).
- **Disciplined Motion:** Interactions use fast, micro-transitions (150–200ms); respects `prefers-reduced-motion`.
