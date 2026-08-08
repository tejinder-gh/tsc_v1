# Audit — current site vs. the redesign brief

Written before any code changes, per the working order in the brief (step 1). This audit compares
the **existing, already-shipped** site against the brief that was just supplied. The two were
written independently: the current build follows its own `DESIGN.md` ("TheSkillCorner marketing
site build brief, 2026-06"); the new brief is a stricter, more prescriptive spec with different
numbers, different IA, and a narrower page list. Nothing below is a code change.

## 0. What kind of codebase this actually is

Not a shell. This is a working app with:
- A full marketing site (9 public routes + dynamic service/industry pages)
- A lead-capture pipeline (`lib/leads.ts`, `app/api/lead`, zod schemas, honeypot)
- A conversion-ladder system (segment-aware pricing, exit-intent modal, mobile sticky bar,
  quick-actions widget, ROI calculator) — none of which the new brief mentions
- An **operator dashboard** (`app/dashboard/*`) and a substantial **automations engine**
  (`automations/*`, ~30 files) — inbound message handling, recipes, scheduling, multi-channel
  send. This is product, not marketing site, and the new brief doesn't reference it at all.

Tests: 84/84 passing (13 files, all in `lib/`, `automations/`, and the lead API route — none of
the public pages have tests). Lint: `npm run lint` currently reports **24 errors**, entirely inside
`app/dashboard/*` (quote-style / import-order, Biome-fixable) — zero lint errors in the marketing
routes.

## 1. Route inventory vs. the brief's IA

| Brief wants | Current route | Status |
| --- | --- | --- |
| `/` | `app/page.tsx` | exists, different section set (see §5) |
| `/what-we-automate` | `app/services/page.tsx` | **exists under a different path** — rename + redirect needed |
| `/what-we-automate/[slug]` | `app/services/[slug]/page.tsx` | same — 9 services built (brief's example list only names 6) |
| `/industries/[slug]` | `app/for/[slug]/page.tsx` + `app/for/page.tsx` | same — rename + redirect needed |
| `/how-it-works` | — | doesn't exist as a page; "How it works" is a home section only |
| `/results` | — | doesn't exist; no case-study page anywhere |
| `/about` | `app/about/page.tsx` | matches |
| `/contact` | `app/contact/page.tsx` | matches |
| `/book` | `app/book/page.tsx` | matches |
| `/legal/privacy`, `/legal/terms` | `app/privacy/page.tsx`, `app/terms/page.tsx` | rename + redirect needed |
| — | `app/checklist/page.tsx` | not in brief's IA (25-task lead-magnet PDF page) |
| — | `app/dashboard/*` | not in brief's IA (internal, auth-less operator tool — see §9) |

`next.config.mjs` currently has no redirects. Route renames need `redirects()` entries or these
become dead links from anything that already indexed `/services/...`.

## 2. Design tokens — current vs. spec

`app/globals.css` (`@theme`, Tailwind v4) today:

```
--color-navy       #08215B
--color-blue       #2563EB
--color-blue-pressed  #1B49B8
--color-blue-tint  #EAF0FE
--color-slate      #5A6480
--color-paper      #FFFFFF
--color-mist       #F2F5FA
--color-line       #DDE3EE
--color-muted      #97A0B8
```

Gaps against the brief's §5.1 table:
- Missing `navy-900` (pressed navy / deep footer), `navy-500` (navy hover on navy surfaces)
- Missing `success` / `warning` / `danger` as tokens — forms currently hard-code `text-red-600`
  (Tailwind's default red, not a brand token, and not the spec's `--danger #B42318`)
- Naming: `blue-pressed`/`blue-tint` vs. spec's `blue-700`/`blue-100` — same colors, different names
- Shadows don't match: current `--shadow-sm/md/lg` use neutral black (`rgba(0,0,0,…)`); spec
  requires navy-tinted shadows (`rgb(8 33 91 / .06|.08|.12)`) at different offsets
- Radius: components use `rounded-lg` (8px) and `rounded-xl` (12px) throughout (cards, inputs,
  buttons). Spec wants `4px` controls/inputs, `6px` cards/media, `999px` pills only. This is a
  site-wide, mechanical but large find-and-replace.
- No explicit spacing-scale enforcement — Tailwind's default scale is used directly, which mostly
  aligns with the 4px base but isn't guaranteed off-scale-free.
- Fonts: loaded via `next/font/google` (Poppins, DM Sans, **and JetBrains Mono**, the last one not
  in the brief's type system at all — used today for tabular numerals in a few stat blocks). Spec
  requires self-hosted `woff2`, four files total (2 Poppins + 2 DM Sans weights), no Google Fonts
  CDN in production. This is a real, if mechanical, migration.
- Type scale: current H1 is 62/65 desktop (matches spec's `display`) but there's no separate
  `h1`/`h2`/`h3`/`h4`/`lead`/`body-sm`/`label`/`caption`/`eyebrow`/`button` token set — sizes are
  set ad hoc per component (e.g. `text-4xl`, `text-5xl`, `text-lg`) rather than from named tokens.

## 3. Component-by-component

- **Header** — sticky, has logo + nav + one CTA. Close to spec but: 64px tall not 72px, no
  scroll-triggered hairline (`border-b border-navy/10` is always on, not "appears after 24px of
  scroll"), mobile menu is an inline dropdown panel, not a full-screen overlay, no focus trap, no
  `Escape` handling, no body-scroll lock, no hamburger↔close crossfade (icon swaps instantly).
- **Footer** — 4 columns, real `mailto:` link. **No phone number in the footer at all** (spec
  requires phone as `tel:`), **no locality rail** (`TORONTO · SURREY · CALIFORNIA · LUDHIANA`) —
  this doesn't exist anywhere on the site today. Only one office (Toronto) is represented anywhere
  in content; the brief's other three cities (Surrey, California, Ludhiana) appear nowhere in the
  codebase.
- **CtaLink (Button primitive)** — one primitive already exists and is used everywhere (good — this
  is exactly the "one primitive" pattern the brief wants). But: no `disabled`/`loading`/`aria-busy`
  state, radius is 8px not 4px, min-height isn't enforced at 48px/44px, focus-visible relies on the
  global `:focus-visible` rule (present in `globals.css`, decent) rather than a per-component spec.
- **ContactForm** — real RHF+zod form, honeypot present (good). But it's a single-step form (spec
  wants two-step: identity+select first, phone+free-text second, skippable), validates on submit
  not on blur, error color is Tailwind `red-600` not a `--danger` token, no `aria-invalid` /
  `aria-describedby` wiring visible, inputs are `rounded-lg`/`border-2` not spec's `4px`/`1.5px`.
  Success state does replace the form in place with a real message (matches spec's "no bare
  /thank-you redirect" requirement) — this part is already right.
- **Faq** — accordion exists (`<details>`-based, one primitive, CSS-only open/close animation).
  Need to verify one-open-at-a-time behavior and `aria-expanded` wiring before calling it compliant.
- **RoiCalculator, PricingAnchor, ProblemStrip, QuickActions, ExitIntentModal, MobileStickyBar** —
  substantial, working conversion features with no equivalent in the new brief's component list or
  home-page section list. Not "wrong" on their own terms, but they don't fit the brief's 9-section
  home page or its component spec (§6 doesn't mention a calculator, a modal, or a segment system).
- **No component gallery route exists** (brief step 3 in the working order asks for one).
- **No tag/pill, tabs, toast, modal-as-primitive, breadcrumb, pagination, table, stat-block,
  testimonial-block, logo-strip, or skeleton-loader primitives** exist as reusable components —
  each page that needs one (e.g. the "Built on" pill list in service pages) hand-rolls its own
  markup inline instead of using a shared primitive.

## 4. Copy and voice — direct spec violations

- **`app/book/page.tsx` invents four statistics with fabricated client descriptors**: "~12 min
  saved per patient — Medical clinic, North York", "30+ calls captured per month — Restaurant,
  Mississauga", "Cut by 50% — Hair salon, two locations", "< 2 mins first response — Law firm,
  Downtown Toronto". These read as real case studies. The brief is explicit and repeated (§8.13,
  §12, §14 checklist item): never invent a statistic, client name, or case study. **This is the
  single clearest compliance violation in the codebase** and needs to come out regardless of any
  other decision.
- Contact info is placeholder, not the owner's real numbers: `content/site.ts` has
  `phone: "+1-416-555-0184"` (a 555 number — recognizably fake) and `email: "hello@theskillcorner.com"`.
  The brief supplies real values: `+1 (437) 972-4379`, `+91-79733-93949`, `info@theskillcorner.com`,
  and `Tejinder Pal Singh — Founder | Managing Director` as principal. None of this is in the repo
  today. `content/about.ts` doesn't name the founder at all ("Built by an engineer who got tired
  of...", no name).
- Pricing is published today (`$395/month` local anchor, `$7,500–$25,000` practice range) — this
  is real content, not fabricated, and the brief's §15.3 only requires the no-price fallback "if
  none is published." Not a violation, just worth flagging as a §15 decision to keep or drop.
- Voice otherwise matches the brief well: short sentences, concrete workflow names ("missed-call
  answering" language is already used), no hype adjectives spotted, buttons already state
  action+context ("Book a free automation audit" not "Get started").

## 5. Home page — section-by-section vs. the brief's 9

Current (`app/page.tsx`): Hero → ProblemStrip → RoiCalculator → ProofSection → ServicesGrid (3 of
9 services) → HowItWorks → PricingAnchor → Faq → FinalCta. That's 9 sections, but three of them
(ProblemStrip, RoiCalculator, PricingAnchor) aren't in the brief's list, and the brief's "Built for
businesses like yours" (industry pills) and "Results" (case study) sections don't exist on home at
all today.

## 6. Accessibility — spot findings (not a full pass)

- Global `:focus-visible` rule exists and is reasonable.
- Form errors use `role="alert"` (good) but aren't tied to fields via `aria-describedby`, and
  fields aren't marked `aria-invalid`.
- Mobile nav: no focus trap, no `Escape`-to-close, no scroll lock — three of the brief's explicit
  mobile-menu requirements.
- Reduced-motion is handled globally in `globals.css` (transitions/animations killed under
  `prefers-reduced-motion: reduce`) — this is already solid.
- No contrast run performed yet (needs an actual checker per brief §9, not eyeballing) — flagged
  as not yet done rather than pass/fail.

## 7. Performance — spot findings

- Fonts load from Google Fonts via `next/font/google`, which self-hosts at build time (Next
  downloads and serves the files itself, so this is *not* a runtime CDN call) — but it's still not
  the brief's literal "self-host as woff2 in the repo, subset to Latin, four files" requirement,
  and it currently ships **three** font families (Poppins, DM Sans, JetBrains Mono) where the brief
  specifies two.
- No Lighthouse run performed yet — needs a build + real run, will report actual numbers rather
  than estimate them.

## 8. SEO

- Per-route metadata exists on every page checked (title, description, canonical) — good baseline.
- `LocalBusiness` JSON-LD exists in `app/layout.tsx` but only encodes **one** address (Toronto) —
  the brief wants all four offices represented.
- No `FAQPage` schema found on the FAQ-bearing pages yet (only `serviceJsonLd`/`breadcrumbJsonLd`
  spotted on service pages).
- `sitemap.ts` and `robots.ts` both exist.

## 9. Out of brief scope, flagging rather than touching

`app/dashboard/*` and `automations/*` (operator dashboard, inbound message handling, recipe engine,
multi-channel send) are real, tested product surfaces with no mention in the new brief, which is
scoped entirely to the public marketing site. Recommend leaving these untouched unless told
otherwise — the lint errors living there are pre-existing and unrelated to this work.

## 10. Decisions this audit surfaces (not yet made)

Several brief items (§15) and one structural conflict need an explicit call before implementation
starts wide-scale changes — flagged separately, not decided here.
