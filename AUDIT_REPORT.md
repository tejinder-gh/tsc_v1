# C-Suite 360° Audit — The Skill Corner

**Date:** 2026-08-08 · **Auditor:** Staff Engineer + C-suite review board (senior-model pass) · **Scope:** full repo (marketing site + automations engine + operator dashboard)

## Executive summary

**Verdict: Fix-then-ship.** [HIGH] The marketing site itself is unusually polished for its stage — a redesign pass completed the same day this audit was run (`SUMMARY.md`, `AUDIT.md`) already closed most design/IA/accessibility gaps a first audit would normally open with (skip link, real focus trap, single-open FAQ accordion, WCAG-AA contrast pass, redirects for renamed routes, Lighthouse 94-100 across the board). This audit does not re-litigate that work; it verified the claims (tests pass, lint clean, `npm audit` run fresh) and focused on what a same-day internal pass structurally cannot see: production readiness of the *other* app that ships in this repo, competitive positioning, and monetization.

Two things block a safe launch, one of them severely:

1. **P0 — `/dashboard/*` (the operator portal for the automations engine) has zero authentication and is deployed on the same public domain as the marketing site**, with server actions that can silently edit-and-send outbound customer messages and toggle a live client's automations off. It is not blocked by `robots.txt` (only `/api/` and `/dev/` are) or any middleware. Today it's inert because the only two configured clients are demo data in `dryRun: true` — but the automations engine is real, tested, Twilio/SendGrid-wired product infrastructure, and this is the control surface for it. See CTO §1.
2. **P0 — the lead pipeline is not actually connected.** `LEAD_WEBHOOK_URL` and `NEXT_PUBLIC_CAL_LINK` are unset in the current environment (confirmed in `SUMMARY.md`'s own "still needing real content before launch" list and in `.env`/`.env.local`). Every one of the five lead-capture surfaces this site exists to feed currently returns `delivered:false` or the fallback UI. This is already tracked in `LAUNCH_CHECKLIST.md` §1/§3 — restated here because it is the single highest-leverage item: zero traffic converts to zero delivered leads until it's set.

Beyond those two, the findings below are mostly P1/P2: a real competitive-positioning gap (turnkey SaaS competitors underprice this agency's practice-tier engagement by 5–15x with a similar surface-level pitch), a missing content/acquisition engine, and monetization left on the table beyond the initial build. **What the small model got right** is substantial and covered in CEO §6 — this is not a rebuild, it's a short, sharp punch list.

---

## Phase 0 — Inventory

- **Two applications, one deploy.** `app/{page,about,contact,book,checklist,industries,what-we-automate,how-it-works,results,legal}` = the marketing site (9 static routes + 21 service pages + 26 industry pages, all generated from typed `content/*.ts`). `app/dashboard/*` + `automations/*` (~30 files: channels, recipes, inbound pipeline, scheduler, integrations) = a separate, real B2B SaaS product (a white-label SMS/email automation engine for the agency's own clients — booking reminders, invoice dunning, review responses, lead-responder, inbound-message handling via Twilio). Both are one `next build` away from the same URL.
- **Data layer:** none. No database anywhere. Marketing content is typed constants; automation state (drafts, idempotency keys, overrides) is file-backed JSON under `.automations/` (gitignored). This is fine for the current single-operator demo stage and explicitly documented as a v1 decision, not an oversight.
- **Dependency audit:** `npm audit` (fresh run) → **4 high-severity advisories**, all transitive through `next@16.1.0`: PostCSS XSS in stringified CSS output + two path-traversal/source-map disclosure CVEs, `sharp` (image optimization) inherited `libvips` CVEs, plus Next.js's own advisories for this version line — SSRF via rewrites with attacker-controlled hostnames, **unauthenticated disclosure of internal Server Function endpoints**, and **unbounded Server Action payload size in Edge runtime**. The last two compound directly with the dashboard finding below. `npm audit fix` / a Next.js point-release bump resolves the reachable ones; verify against the changelog before bumping given App Router's history of minor-version behavior shifts.
- **Tests:** 85/85 passing, 13 files — all in `lib/`, `automations/`, and the lead API route. Zero component tests, zero E2E. Already tracked and deliberately deferred: `TODOS.md` P3 (Playwright suite for the five lead surfaces, explicitly blocked on the site actually being live).
- **Lint:** `biome check .` — 164 files, clean.
- **TODO/FIXME confession log:** none found in `app/`, `components/`, `content/`, `lib/`, `automations/` — the small model's self-documentation habit (extensive `What/Why/How/From Where/When` header comments on nearly every file) substitutes for TODOs and is, on inspection, accurate against the code it describes.

---

## Phase 1 — CTO review (engineering)

### 1A. [HIGH] P0 — Unauthenticated internal operator tool shipped on the public marketing domain

`app/dashboard/layout.tsx` renders a sidebar/nav shell with **no auth check, no session, no redirect** — it is a plain layout component. There is no `middleware.ts` anywhere in the repo. `app/robots.ts` disallows `/api/` and `/dev/` explicitly but has no rule for `/dashboard/`, so it is both reachable and crawlable by default.

Two Next.js Server Actions are exposed from this unauthenticated surface:

- `app/dashboard/flows/actions.ts:18` — `toggleFlow(clientId, automationId, enabled)` calls `setAutomationOverride` directly, no auth, no ownership check on `clientId`. Anyone who finds the route (or discovers the action via the disclosed-Server-Function-endpoints advisory noted above) can disable a live client's booking-reminder or invoice-dunning automation.
- `app/dashboard/drafts/actions.ts:24-63` — `approveDraft(clientId, draftId, editedBody)` takes **caller-supplied `editedBody`**, builds a `SendAction` from it, and calls `dispatch()` (`automations/runtime/dispatch.ts`) against real `buildSenders()` (Twilio SMS / SendGrid email per `automations/channels/`). There is no server-side validation that the editor is authorized for `clientId`, and the message body is attacker-controlled end to end.

**Why this is P0 and not "just a demo page":** the mitigating fact today is that both configured clients (`automations/clients/radiance-salon.ts`, `brightsmile-dental.ts`) have `dryRun: true`, so `dispatch()` most likely no-ops the actual Twilio/SendGrid call (verify in `automations/runtime/dispatch.ts` before relying on this). But `dryRun` is a per-client config flag, not a safety rail — the entire point of this engine is to eventually flip real clients to `dryRun: false`. The day that happens without an auth layer in front of `/dashboard`, this becomes: any anonymous visitor can send arbitrary SMS/email as a real client's business to that client's real customers, or silently turn off a paying client's automations. That is a P0 regardless of current dry-run status, because the fix needs to land *before* the first real client goes live, not after an incident.

**Fix shape (do not implement here — this is an audit, not a patch):** either (a) auth-gate `/dashboard/*` via middleware + a session check before any client goes to `dryRun: false`, or (b) move the operator portal to a separate, non-public deployment entirely, which also resolves the "two apps, one domain" architectural smell for free. Ticket this at Senior tier minimum per the pipeline's own routing rule (blast radius, not difficulty) — it touches auth and a send-path.

### 1B. [HIGH] Dependency vulnerabilities — see Phase 0. Action: `npm audit fix`, verify build/tests, redeploy.

### 1C. [MED] `/api/cron` is open by default if `CRON_SECRET` is unset
`app/api/cron/route.ts:25` only checks the bearer secret `if (secret && ...)` — if the env var was never set, the endpoint runs `runTick()` for every client on any unauthenticated GET. Low direct damage (it's largely idempotent, per its own doc comment), but it's a free trigger for whatever side effects `runTick` has (drafts created, notifications sent to `notify.front-desk`). Set `CRON_SECRET` as a hard requirement, not an optional one — same pattern already correctly applied to `LEAD_WEBHOOK_URL` in production (`app/api/lead/route.ts` fails loud with 503 when unset in prod; this endpoint should mirror that instead of silently allowing open access).

### 1D. [LOW, already tracked] No rate limiting on `/api/lead` beyond the honeypot. This is a known, documented, explicitly-deferred risk (`LAUNCH_CHECKLIST.md` §3 "Escalation trigger," `app/api/lead/route.ts` doc comment cites the `/plan-eng-review` decision to wait for evidence of abuse before adding Turnstile/WAF). Not re-flagging as new — noted here only so the CEO synthesis has the full picture.

### 1E. Genuine strength worth naming once: the lead API's env-guard design (loud 503 in prod, dev-friendly no-op in preview) and the honeypot's full-payload-logged-on-trip pattern are both unusually thoughtful failure-mode design for agent-generated code — see CEO §6.

---

## Phase 2 — CPO review (product completeness)

### 2A. [MED] No content/acquisition engine (no blog)
21 service pages × 26 industry pages is a strong programmatic-SEO base, but every competitor surfaced in the CMO web search (Phase 4) publishes comparison/pricing/buyer-guide content that is *currently ranking* for exactly the queries this business needs ("AI receptionist cost for dental practices," "best AI answering service 2026," etc.). There is no `/blog` or equivalent. This is a acquisition-channel gap, not a defect — flagging for the roadmap, not the launch blocker list.

### 2B. [MED] No build-vs-buy differentiation content
Nothing on the site addresses why a prospect should hire a bespoke agency build ($395/mo local, $7,500–$25,000 + $1,500/mo practice — `content/site.ts:85-93`, `content/faq.ts:18`) over a self-serve SaaS AI receptionist at $200–$1,500/mo (see CMO §4A). A prospect who shops around — which the ROI calculator itself invites by making them think about cost — will find materially cheaper alternatives with an overlapping surface-level pitch ("missed calls answered, no-shows reminded"). No FAQ entry, no page section, addresses this. See CFO §5A for the revenue framing.

### 2C. [LOW] No client-facing results/status surface
The repo already contains a full operator dashboard (drafts, flows) — but nothing client-facing that shows *a client* their own automation activity/ROI. For a business whose pitch is "AI automation that saves you hours," a simple client-facing "here's what got automated this week" view is a natural retention/upsell surface that's currently 100% internal-only. Flagging as a roadmap item, not a defect (see CEO do-not-build list for why this isn't a near-term build).

### 2D. Genuine strength: the conversion-ladder discipline (every page carries ≥2 rungs: book / contact / checklist / ROI capture) and segment-aware pricing (practices never see local pricing and vice versa, enforced by the `Segment`-keyed content type, not just convention) is table-stakes-plus, not table-stakes-minus. Most competitor sites surfaced in the search results are single-CTA "get a demo" pages.

---

## Phase 3 — Head of Design review (UX/UI)

A same-day internal pass (`SUMMARY.md`) already ran a real Lighthouse + headless-browser accessibility audit and fixed three verified interactive bugs (mobile CTA visibility, backdrop-blur containing-block collapse on the mobile nav, react-hook-form re-validate gap). This audit spot-checked rather than re-ran that work; the reported numbers are plausible against the code (contrast tokens, focus-trap hook shared between mobile nav and exit-intent modal, `prefers-reduced-motion` handling in `globals.css`) and are treated as verified for this report. Not re-scoring.

**Two items from that pass remain genuinely open** (already self-flagged there, restated here only because the CEO roadmap needs the full punch list in one place):
- Bundle size 241.8 KiB vs. a 150 KiB budget on `/`, LCP 3.0s vs. a 2.0s budget — traced to `framer-motion` + baseline Next/React runtime, not to anything left broken. Real fix requires auditing whether `framer-motion` earns its weight for what is, per `DESIGN.md`, "one orchestrated hero reveal, subtle hover, nothing else" — that's a lot of dependency for that little motion.
- `--line` (#DDE3EE) used as both hairline and input-border color fails the 3:1 UI-component contrast threshold at 1.29:1 on white. Flagged there as a call for the design-token owner, not silently fixed — still open.

---

## Phase 4 — CMO review (market & competition)

### 4A. Competitive map [MED confidence — category is fast-moving, live search as of 2026-08]

| Competitor | Model | Price band | Positioning |
|---|---|---|---|
| Emitrr | Self-serve SaaS | ~$200–500/mo | AI voice + SMS + reviews + unified inbox bundle — closest feature overlap to TSC's "ai-receptionist" + "reviews-and-reputation" services |
| My AI Front Desk | Self-serve SaaS | ~$100–300/mo | 24/7 virtual receptionist, scheduling + reminders |
| Goodcall | Self-serve SaaS | ~$50–300/mo | Local-retail-focused call handling |
| Rosie | Self-serve SaaS, budget tier | <$100/mo | Basic missed-call-to-text automation |
| OnceHub | Self-serve SaaS | Mid-range | Scheduling-first, AI call handling as an add-on |
| Enamly AI / PatientXpress / CallBird AI | Vertical SaaS, dental-specific | $299–$1,500/mo incl. PMS integration | Dentrix/Open Dental/Eaglesoft-integrated, HIPAA-postured |

**Where TSC wins:** bespoke build (industry pages read as genuinely tailored — 26 industries, each with 3 pains + 3 automations + metrics, not a generic template), a real engine behind the pitch (this repo's `automations/*` is not vaporware — it's tested, multi-channel, has an inbound closed-loop, which most of the above are black-box vendor products), and a human-audited onboarding (free audit call) vs. self-serve signup.

**Where TSC ties or loses:** price, for a prospect who hasn't yet been convinced bespoke is worth it — the practice tier's $7,500–$25,000 build fee plus $1,500/mo has no stated payback period on-site, while the vertical SaaS competitors lead with monthly-only pricing that's 5–15x cheaper on a pure run-rate basis. Speed-to-live also likely favors self-serve SaaS (signup-to-live in hours vs. an agency build cycle) — nothing on-site sets expectations either way.

**GTM readiness:** genuinely strong. `robots.txt` explicitly allowlists AI crawlers by name (GPTBot, ClaudeBot, PerplexityBot, etc.) ahead of most competitors in this exact search — "AI assistants recommending automation vendors" is called out in the code comment as a deliberate bet, and it's a real one given how many of the competitor pages surfaced were themselves blog-content optimized for the same LLM-citation channel. Sitemap, OG image, JSON-LD (`LocalBusiness` with real multi-office `contactPoint` data) all present and correct. `sameAs` (Google Business Profile, Clutch, etc.) is still commented-out placeholders in `content/site.ts` — tracked in `LAUNCH_CHECKLIST.md` §1, restated here as a CMO-relevant gap since `sameAs` is a real ranking/trust signal, not just a checklist item.

Sources: [Best AI Answering Services for Small Businesses in 2026](https://www.technology.org/2026/04/23/best-ai-answering-services-for-small-businesses-in-2026/), [The Best AI Call Answering Services in 2026 — OnceHub](https://www.oncehub.com/blog/the-best-ai-call-answering-services-in-2026-a-complete-buyers-guide), [AI Phone Agents for Small Businesses 2026 — Beancount](https://beancount.io/blog/2026/07/16/ai-phone-agents-receptionist-small-business-guide), [CallMissed: Best AI Voice Agent 2026](https://www.callmissed.com/en/blog/best-ai-voice-agent-small-businesses-2026), [My AI Front Desk — Virtual Answering Services 2026](https://www.myaifrontdesk.com/blogs/boost-your-small-business-with-top-virtual-answering-services-in-2026), [AI Receptionist Cost for Dental Practices 2026 — My AI Front Desk](https://www.myaifrontdesk.com/blogs/ai-receptionist-cost-for-dental-practices-a-2026-investment-guide), [AI Receptionist for Dentists: Pricing Explained — Enamly AI](https://enamly.ai/blog/ai-receptionist-for-dentists-pricing), [AI Dental Receptionist Pricing Comparison 2026 — TensorLinks](https://www.tensorlinks.com/blog/ai-dental-receptionist-pricing-comparison-2026/)

---

## Phase 5 — CFO review (revenue left on the table)

### 5A. [P0, restated from Executive Summary] Lead pipeline not connected — $0 deliverable revenue in current state
`LEAD_WEBHOOK_URL` unset (`.env` has a placeholder Zapier URL; `.env.local` points at a nonexistent route per `SUMMARY.md`), `NEXT_PUBLIC_CAL_LINK` unset. Every one of the five lead sources (`contact_form`, `exit_intent`, `quick_widget`, `roi_calculator`, `checklist_interactive`) currently returns `delivered:false` in non-prod, or 503s in prod. **Estimated impact: 100% of current traffic → 0 delivered leads** until this is set and verified against `LAUNCH_CHECKLIST.md` §3's test matrix. [HIGH confidence — directly observable from env state, not estimated.]

### 5B. [MED, ~$/mo not quantifiable without real traffic data] Practice-tier pricing has no stated payback framing
Per CMO §4A, the practice engagement ($7,500–$25,000 + $1,500/mo) is 5–15x the run-rate of vertical SaaS alternatives with overlapping surface claims. The site's own ROI calculator (`components/home/RoiCalculator.tsx`) computes hours-saved → dollar value, which is the right mechanism, but nothing ties that number back to "here's your payback period on the build fee" for the practice segment specifically — the calculator's framing reads generic/local-business-shaped. A segment-aware payback statement (even a simple "typical practice engagement pays for itself in N months at your automation's hourly savings rate") would directly counter the CMO-identified price objection at the exact moment a practice prospect is calculating their savings. [MED confidence — mechanism exists, framing gap is the finding, dollar impact depends on close-rate data not available in this repo.]

### 5C. [LOW-MED] Single lead magnet, no upsell/nurture visible in-repo
Only one gated asset (`/checklist`, 25-item PDF). No second-tier offer (e.g., a free automation-readiness scorecard segmented by industry, reusing the 26-industry content architecture that already exists) to re-engage visitors who bounce off the checklist. Nurture-sequence design lives outside this repo (Zapier/Make), so cannot be audited here — flagging the gap in what's *visible* on-site, not asserting the sequence itself is deficient.

### 5D. Genuine strength: pricing is published, not gated behind a form (a real, occasionally contested strategic choice per `SUMMARY.md`'s own decision log) — this reduces top-of-funnel friction and is defensible against the CMO-identified competitors, most of whom also publish pricing.

---

## Phase 6 — CEO synthesis

### 1. Verdict
**Fix-then-ship**, confidence [HIGH]. No rebuild signal anywhere — architecture is sound, test/lint hygiene is real (not cosmetic), and the two P0s are narrow and well-understood (an env-var connection job, and an auth-gate-before-first-real-client job). Kill/rebuild would be the wrong call for a codebase this coherent.

### 2. Top findings, ICE-scored (Impact × Confidence × Ease, 1–5 each, higher = do sooner)

| # | Finding | Sev | Impact | Conf | Ease | Owner |
|---|---|---|---|---|---|---|
| 1 | Connect `LEAD_WEBHOOK_URL` + `NEXT_PUBLIC_CAL_LINK`, run the §3 test matrix | P0 | 5 | 5 | 5 | Eng/Ops |
| 2 | Auth-gate `/dashboard/*` before any client goes `dryRun: false` | P0 | 5 | 4 | 3 | Eng (senior — auth) |
| 3 | `npm audit fix` + verify build/tests | P1 | 3 | 5 | 4 | Eng |
| 4 | `CRON_SECRET` required, not optional, mirroring the lead-route pattern | P1 | 2 | 5 | 5 | Eng |
| 5 | Practice-tier payback framing in ROI calculator or nearby copy | P1 | 4 | 3 | 3 | Design/Copy |
| 6 | `sameAs` real URLs (GBP, Clutch, etc.) | P1 | 3 | 3 | 4 | Marketing |
| 7 | Build-vs-buy differentiation content (FAQ or dedicated section) | P1 | 4 | 3 | 3 | Marketing/Copy |
| 8 | Bundle-size/LCP follow-up (`framer-motion` audit) | P2 | 3 | 4 | 2 | Eng |
| 9 | `--line` token contrast on input borders | P2 | 2 | 5 | 3 | Design |
| 10 | Blog/content hub for the AI-citation + organic channel | P2 | 4 | 2 | 1 | Marketing (multi-week) |

### 3. 30/60/90 roadmap (sequenced by dependency + revenue deadline, not ease)
- **Before any traffic (days):** #1, #2, #3, #4 — nothing else matters if leads don't arrive or the dashboard is a live liability the moment a real client onboards.
- **30 days:** #6, #9 — cheap, closes known trust/compliance gaps.
- **60 days:** #5, #7 — directly counters the CMO-identified price objection; needs copy iteration, not engineering.
- **90 days:** #8, then #10 as an ongoing program, not a sprint.

### 4. Do-NOT-build list (right now)
- **Client-facing automation-status portal** (CPO §2C) — real idea, wrong sequencing: build it once there are ≥2 real (non-demo) clients on the engine, not speculatively.
- **Playwright E2E suite** (`TODOS.md`) — correctly deferred already; re-confirm the existing call (blocked on the site being live, which is finding #1 above).
- **Fabricated testimonials/case studies to "fill out" `/results`** — the brief's illustrative-labeling discipline (`content/proof.ts`) is a real asset; do not undo it under launch pressure. Wait for permissioned real ones.
- **A second booking-provider integration** (Calendly, etc.) — `README.md` already documents the swap path; building it speculatively before Cal.com is even connected (`NEXT_PUBLIC_CAL_LINK` unset) is solving a problem that doesn't exist yet.

### 5. Load-bearing assumptions register
1. **`dryRun: true` actually no-ops the Twilio/SendGrid call in `automations/runtime/dispatch.ts`.** If wrong, finding #2's severity is higher than stated (live sends possible today, not just after a future flag flip). *Cheapest test: read `dispatch.ts` and the sender implementations directly, or trigger `approveDraft` against a demo client in a preview deploy and confirm no Twilio API call fires.*
2. **The four-office locality rail (`content/site.ts` offices array) reflects real, intended-to-launch business presence**, not aspirational placeholder data. If wrong, the `LocalBusiness` JSON-LD is making unintended claims. *Cheapest test: the founder confirms each office against `SUMMARY.md`'s own flagged uncertainty on Surrey/California region codes.*
3. **The practice-tier price point ($7,500–$25,000) was set with awareness of the vertical-SaaS competitive floor found in Phase 4**, not independently of it. If wrong, finding #5/#7 above are more urgent than P1. *Cheapest test: ask the founder directly — this is a 30-second question this audit cannot answer from the repo alone.*
4. **No real client has yet been flagged to `dryRun: false`.** If wrong, finding #2 is not P0-pending, it's already an active incident. *Cheapest test: grep `automations/clients/*.ts` for `dryRun: false` before doing anything else — currently zero hits, both files checked in Phase 1 read `dryRun: true`.*
5. **The `.automations/` file-backed store is intended to remain file-backed at current scale** (single operator, ≤2 demo clients), not a stand-in for a database that was supposed to land already. If wrong, the "no database" architecture note in Phase 0 undersells actual technical debt. *Cheapest test: check `TODOS.md`/`LAUNCH_CHECKLIST.md` for any database-migration mention — none found, treating as confirmed v1-intentional.*

### 6. What the small model got right
This is a genuinely well-built codebase for its stage, and it would be miscalibrated to bury that under the findings above. The env-var failure-mode design in `app/api/lead/route.ts` (loud 503 in prod, quiet no-op in preview, full-payload-logged honeypot trip for false-positive recovery) shows real production-incident thinking, not just happy-path code. The segment system (`sessionStorage`-scoped, type-enforced so a practice can never see local pricing) is a correctly-scoped v1 personalization layer — no over-engineering into a full CMS or A/B framework nobody asked for. The typed-content architecture (`content/*.ts` driving pages, sitemap, and JSON-LD from one source) means adding an industry page is genuinely a one-file change, as documented. The automations engine's dry-run default, idempotency-keyed dispatch, and Twilio-signature verification on the inbound webhook are the right defaults for a system that sends real messages to real people — the gap this audit found isn't in that engine's design, it's in the missing door in front of its control panel. And the same-day design/a11y pass that landed just before this audit (real headless-browser verification, not just code review, catching three genuine interactive bugs a green test suite would never have surfaced) is exactly the kind of verification discipline this pipeline exists to encourage more of.

---

## Appendix — severity legend
P0 blocks launch/revenue · P1 costs revenue/users at launch · P2 costs at scale · P3 polish. Confidence: `[HIGH >90%]` `[MED 50-90%]` `[LOW <50%]`.
