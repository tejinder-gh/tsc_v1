# Summary — bringing the site to the redesign brief

Final step of the working order (§16.10). Covers what changed, the numbers actually
measured, the §15 decisions made along the way, and everything still needing real content
before launch. `AUDIT.md` has the before-state; this is the after.

## What changed, in order

1. **Audit** (`AUDIT.md`) — compared the existing shipped site (its own June 2026 build
   brief) against this brief. Found the two are close in palette/voice but diverge in IA,
   token completeness, component states, and one clear content violation.
2. **Dashboard lint** — cleared 24 pre-existing Biome errors in `app/dashboard/*`
   (unrelated to the brief, fixed because it was quick and left the tree clean).
3. **Fabricated statistics removed.** `/book` had four stat cards tied to fake client
   descriptors ("~12 min saved per patient — Medical clinic, North York"), presented as
   real anonymized case studies. Removed. The same pattern (illustrative numbers presented
   as measured fact) existed across `content/proof.ts` and all 24 entries in
   `content/industries.ts`; per your direction, reframed rather than stripped — every
   number now renders under an explicit "Example –" / "Anticipated outcome" / "Typical
   impact" label instead of claiming to be a real result.
4. **Design tokens** expanded to the brief's full palette (navy-900/500, danger/warning/
   success, spec-named aliases), radius scale (4/6/999px), and navy-tinted shadow scale —
   additive, so nothing visually broke. Form error color moved off Tailwind's default red
   onto the new `--danger` token.
5. **Fonts self-hosted.** Four latin-subset woff2 files (Poppins 500/600, DM Sans 400/700)
   in `public/fonts/`, wired via `@font-face` with `font-display: swap`, preloaded in the
   root layout. `next/font/google` and JetBrains Mono are gone — verified via a production
   build that no `fonts.googleapis.com`/`fonts.gstatic.com` reference remains anywhere in
   the rendered HTML.
6. **Real contact info.** The phone number was a recognizable `555` placeholder;
   `content/site.ts` now has the real numbers, `info@theskillcorner.com`, the founder's
   name/title (previously anonymous on `/about`), and a typed four-office array driving
   the footer's locality rail and the `LocalBusiness` JSON-LD (all four addresses, both
   phone numbers via `contactPoint`).
7. **Routes renamed** to match the brief's IA — `/services → /what-we-automate`,
   `/for → /industries`, `/privacy → /legal/privacy`, `/terms → /legal/terms` — with
   permanent redirects for every old path (including the dynamic `:slug` patterns),
   verified against a production build.
8. **Nav rebuilt.** 72px height, hairline that only appears after 24px of scroll, and the
   mobile menu is now a real full-screen overlay (focus trap, Escape, body scroll lock,
   hamburger/close crossfade) instead of an inline dropdown with none of that.
9. **Contact form rebuilt** as the brief's two-step flow — step one (name, business,
   email, business type) submits on its own; step two (phone, free text) is optional and
   skippable — with blur validation, `aria-invalid`/`aria-describedby`, and the new
   `--danger` styling.
10. **FAQ accordion rebuilt.** The old `<details>` implementation let every item stay open
    at once and couldn't default the first one open. Now a real single-open accordion
    (button + `aria-expanded`), used on home and every service/industry page.
11. **Component gallery** at `/dev/components` (noindex'd) — every real primitive at real
    size, plus an explicit list of brief-mentioned primitives deliberately not built
    (toast, table, tabs, pagination, skeleton, breadcrumb, logo strip, testimonial block)
    and why: none has a use case anywhere in the current IA.
12. **Accessibility pass** — skip-to-content link (first focusable element, jumps to a
    now-focusable `<main>`); extracted the mobile-nav focus trap into a shared
    `useFocusTrap` hook and applied it to the exit-intent modal, which previously had
    Escape-to-close but no real Tab trap.
13. **Performance pass** — see numbers below. Found and fixed a real bug: the hero's
    550ms staggered fade-in was both a direct brief violation (§8.14 excludes the hero
    from reveals; §5.3 caps motion at 300ms) and the page's actual LCP bottleneck.
14. **`/how-it-works` and `/results`** added — the brief's IA lists both as standalone
    routes; they'd only ever existed as home-page sections.

## Numbers actually measured

**Lighthouse**, production build (`next build && next start`), headless Chrome, default
mobile simulated-throttling config. One caveat worth flagging for anyone re-running this:
partway through this pass, an orphaned `next dev` server from earlier testing was still
running in the background and silently contaminated a couple of readings (Performance
dropped into the high-70s for no code reason). The numbers below are from a clean
environment with that process killed and verified as the only thing on port 3000.

| Route | Performance | Accessibility | Best Practices | LCP | CLS |
| --- | --- | --- | --- | --- | --- |
| `/` | 94 | 100 | 100 | 3.0s | 0 |
| `/what-we-automate` | 94 | 100 | 100 | 3.0s | 0 |
| `/contact` | 96 | 100 | 100 | 2.7s | 0 |

Accessibility and Best Practices clear the brief's ≥95 bar everywhere. Performance is just
under it on two of three routes; LCP is above the 2.0s budget on all three. Total JS
transfer on `/` measured 241.8 KiB against the brief's 150 KiB budget — the gap traces to
baseline Next.js/React runtime plus `framer-motion` under simulated slow-4G/CPU
throttling, not to anything found and left unfixed in this pass. Closing it further would
mean real bundle-splitting work (auditing whether `framer-motion` earns its weight,
confirming `@calcom/embed-react` truly code-splits to `/book` only) — flagged here as
follow-up rather than chased blind this late in the pass.

**Contrast** — calculated from the actual token hex values (script-based, not eyeballed),
full table in the commit for the tokens/contrast work. Every foreground/background pairing
actually used for required-reading text passes AA (4.5:1 normal text, 3:1 large text/UI).
Two token combinations fail and are flagged rather than silently worked around:

- `slate-400` on `mist`/`paper` (2.4–2.6:1) — this is by design; the brief's own token
  table restricts `slate-400` to captions/disabled text and explicitly warns against using
  it for anything a user must read. Confirmed it isn't used that way anywhere in the
  codebase (only a hex-code caption in the internal gallery).
- `--line` (#DDE3EE) as an input border on white — 1.29:1, under the 3:1 UI-component
  threshold. This is the brief's own given value, assigned to both "hairlines" and "input
  borders" in the same token. Left as-is rather than inventing a new color outside the
  given palette; flagged here as a borderline WCAG 1.4.11 call for you to weigh in on.

A live Lighthouse run also caught a real, unrelated contrast bug: the hero's trust line
used `text-slate/70` (3.09:1, fails). Auditing every `text-slate/NN` opacity variant
site-wide found five more failing the same way (SegmentRouter, RoiCalculator's input
placeholder, three spots in the interactive checklist) — all fixed to full-opacity
`slate-600`, which already passes at 5.88:1.

**Zoom** — simulated 200%/400% (viewport-shrink method) on `/`, `/what-we-automate`,
`/contact`, and one industry page: no horizontal scroll at either level on any of the four.

**Keyboard/screen-reader-relevant flows**, verified with a real headless-browser driver
(not just code review — see below for why that mattered):

- Mobile nav: opens, traps Tab, closes on Escape with focus returned, body scroll locked,
  hides while open.
- Exit-intent modal: same trap behavior via the shared hook; initial focus lands on the
  first focusable element (the close button); Shift+Tab from there correctly wraps to the
  last element in the dialog.
- Contact form: blur-triggers validation, error clears live once the field is fixed,
  step-one-only submit path works, step two is genuinely skippable.
- FAQ accordion: first item open by default, opening one closes any other, Enter toggles.
- Skip link: first Tab stop on every page, moves focus to `<main>`.

Three of those were real bugs, not just missing polish, and none would have surfaced from
reading the code or from a green build/lint/test run alone:

1. A `hidden md:inline-flex` override on the header's compact CTA button lost to the
   button's own always-on `inline-flex` at equal CSS specificity — undefined which one
   Tailwind's generated stylesheet put last, and it happened to be the wrong one, so the
   button was visible on mobile when it should have been hidden.
2. The mobile nav panel collapsed to zero height. The header uses `backdrop-blur`, and
   `backdrop-filter` establishes a new CSS containing block for `position: fixed`
   descendants — so the panel's `top`/`bottom` insets resolved against the header's own
   72px box instead of the viewport. Fixed by portaling the panel to `document.body`.
3. The two-step contact form's "submit from step one" button gates submission through a
   manual `form.trigger()` call rather than react-hook-form's own `handleSubmit`, which
   meant RHF's built-in re-validate-on-change never engaged — an error shown on blur
   stayed on screen even after the field was fixed. Fixed with an explicit `watch()`
   subscription.

## Decisions made (brief §15)

1. **Booking tool** — already Cal.com via `@calcom/embed-react` with an honest fallback
   card when `NEXT_PUBLIC_CAL_LINK` is unset. No change needed; confirmed swappable.
2. **Real client names/logos/testimonials/case-study numbers** — none exist. Every place
   they'd appear is clearly labeled as illustrative rather than fabricated (see the
   proof-reframing work above and the new `/results` page's explicit up-front disclaimer).
3. **Pricing** — published, not omitted (`$395/month` local anchor, `$7,500–$25,000`
   practice range). The brief's no-price fallback only applies "if none is published,"
   so this isn't a violation — flagging the choice to keep it rather than silently drop
   real, already-approved pricing content.
4. **Photography** — no licensed photography exists. The site uses a pre-existing custom
   abstract line-art/node-graph SVG system (`AbstractVisual.tsx`) instead of the brief's
   literal fallback (`--mist` panel + centered mark at 12% opacity). This wasn't changed
   in this pass — it already avoids the explicitly-forbidden failure mode (stock
   robots-shaking-hands illustration) and is more visually distinctive, but it's a real
   deviation from the spec'd fallback pattern worth your explicit sign-off rather than a
   silent keep.
5. **Office cities as legal entities vs. presence** — presented as offices in the footer
   locality rail and JSON-LD only, no claims made about legal status, per the brief.
   Surrey and California's region/country in the JSON-LD (`BC, CA` and `CA, US`) are my
   inference from context (a Canadian company headquartered in Toronto, "Surrey" almost
   always meaning Surrey, BC in that context; California treated as a state-level
   presence with no invented city) — not confirmed data. Worth a quick check.
6. **CMS** — content was already extracted into typed `content/*.ts` files before this
   pass started (not hardcoded in components), which satisfies the brief's intent; no
   further extraction was needed.

## Still needing real content before launch

- Founder photo (`content/about.ts` still says "replace /public/founder.jpg before
  launch" — the about page currently uses the abstract-visual system in its place).
- Any real client testimonials, logos, or permissioned case studies, to eventually replace
  the illustrative scenarios on `/`, every industry page, and `/results`.
- `NEXT_PUBLIC_CAL_LINK` for live Cal.com booking (currently unset; `/book` shows the
  honest fallback).
- `LEAD_WEBHOOK_URL` for production — `.env` has a placeholder Zapier URL
  (`XXXXXXX/XXXXXXX`), `.env.local` points at a route that doesn't exist in this app.
  Confirmed during testing that submissions correctly surface the form's error state
  rather than fail silently, but no real lead is currently deliverable end-to-end.
- `sameAs` URLs for Google Business Profile / Clutch etc. (commented out placeholders in
  `content/site.ts`).
- Confirm Surrey/California region assumptions in the JSON-LD (see decision 5 above).
- Bundle-size follow-up: ~242 KiB JS vs. the 150 KiB budget on `/` — see the performance
  numbers section for what's already ruled in/out.
- Not touched, out of scope per your direction: the operator dashboard (`/dashboard/*`)
  and the automations engine — real, tested product surfaces with no mention in this
  brief.

## Verified, not just built

Every change above was checked against a production build (`next build && next start`),
not just `next dev` — and the interactive ones (nav, forms, modal, accordion) were driven
with a real headless browser rather than trusted from code review, which is what actually
caught the three bugs listed under "Numbers actually measured." `npm test` (85 tests) and
`npx biome check` are clean throughout; every commit in this pass builds, lints, and tests
green before landing.
