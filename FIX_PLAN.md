# FIX PLAN — Approved Ticket Backlog

**Project:** The Skill Corner (`theskillcorner.com`)  
**Pipeline:** AUTO-FIX (Phase 2 Output)  
**Standard:** $200,000 Enterprise-Grade Digital Systems Studio  

---

## 1. REQUIREMENTS OF RECORD (USER GATE ANSWERS)

1. **Tickets Approved:** Approved all 10 tickets (T-001 through T-010) as scoped.
2. **Ambiguity Confirmations:** Confirmed enterprise pricing re-anchoring, interactive booking pre-flight form, and non-intrusive exit intent modal.
3. **Execution Approval:** User issued explicit go ("approve n cont") to proceed with implementation.

---

## 2. ORDERED TICKET BACKLOG

| Ticket | Title | Assigned Tier | Effort | Severity | Dependencies | Target Outcome |
|---|---|---|---|---|---|---|
| **[T-001](tickets/T-001.md)** | Replace dead-end `/book` fallback with interactive pre-flight appointment scheduler | **SENIOR** | 3.5h | P0 | None | Eliminates booking drop-off; captures high-ticket leads even without Cal.com key |
| **[T-002](tickets/T-002.md)** | Re-anchor site pricing models and copy to enterprise tiers ($15k–$200k) | **INTERMEDIATE** | 1.5h | P1 | None | Removes $395 anchor drag; positions agency for high-ticket contracts |
| **[T-003](tickets/T-003.md)** | Build and mount `ExitIntentModal` with 25-task checklist lead capture | **INTERMEDIATE** | 2.5h | P1 | None | Recaptures 8-12% of bouncing traffic with automated checklist delivery |
| **[T-004](tickets/T-004.md)** | Add branded App Router `error.tsx` recovery boundary | **INTERMEDIATE** | 1.5h | P1 | None | Prevents unstyled Next.js crash screens; ensures high-trust resilience |
| **[T-005](tickets/T-005.md)** | Eliminate runtime DDL `CREATE TABLE` from `lib/rate-limit.ts` | **SENIOR** | 1.5h | P1 | None | Hardens security; eliminates permission errors against least-privilege DB role |
| **[T-006](tickets/T-006.md)** | Configure Neon connection pooler endpoint for serverless scale | **SENIOR** | 1.5h | P1 | None | Prevents Postgres connection limit exhaustion under serverless traffic spikes |
| **[T-007](tickets/T-007.md)** | Expand `Footer.tsx` with global offices rail, phone lines, and full sitemap index | **INTERMEDIATE** | 2.0h | P1 | None | Establishes institutional gravity and improves technical SEO crawl depth |
| **[T-008](tickets/T-008.md)** | Add `lastModified` timestamps to dynamic `sitemap.ts` | **INTERMEDIATE** | 1.0h | P1 | None | Accelerates search engine and AI crawler (Perplexity/ChatGPT) indexation |
| **[T-009](tickets/T-009.md)** | Purge orphaned `SolutionPlaceholder.tsx` and legacy font definitions | **INTERMEDIATE** | 1.0h | P3 | None | Eliminates dead code bloat and unused font parsing |
| **[T-010](tickets/T-010.md)** | Build on-page interactive Enterprise ROI & Payback Calculator | **SENIOR** | 3.5h | P1 | T-002 | Allows enterprise buyers to dynamically calculate and prove economic payback |

---

## 3. EFFORT ESTIMATE BY TIER

- **Senior Tier:** 4 tickets &middot; **10.0 hours total** (T-001, T-005, T-006, T-010)
  - Covers blast radius: booking state, database security/DDL, connection pooling, and financial ROI models.
- **Intermediate Tier:** 6 tickets &middot; **9.5 hours total** (T-002, T-003, T-004, T-007, T-008, T-009)
  - Covers blast radius: isolated UI components, error boundaries, SEO sitemaps, copy constants, and cleanup.
- **Total Backlog Effort:** **19.5 hours**

---

## 4. LOAD-BEARING ASSUMPTIONS REQUIRING USER CONFIRMATION

1. **Pricing Model Re-alignment:** We assume enterprise tiers ($15k–$75k deployments, $2.5k–$12.5k/mo retainers) are preferred over retaining the "$395/month" starter copy.
2. **Booking Strategy:** We assume that when `NEXT_PUBLIC_CAL_LINK` is empty, presenting a rich interactive pre-flight appointment scheduler (with organization, current tools, and timeline picker) is strictly superior to the current "calendar being initialized" error box.
3. **Exit-Intent Behavior:** We assume a non-intrusive modal triggering on desktop mouse-out (once per session, dismissed via Escape/backdrop) is approved to capture email leads for the 25-task checklist.

---

## 5. DELIBERATELY DEFERRED (DO-NOT-BUILD)

| Feature | Why Deferred | Trigger to Revisit |
|---|---|---|
| **Custom In-House Calendar Engine** | Unnecessary reinvention; Cal.com embed handles multi-timezone, ICS, and calendar syncing flawlessly. | Only revisit if enterprise clients demand on-premise HIPAA calendar hosting. |
| **Headless CMS (Sanity / Contentful)** | Typed TS files provide 0ms latency, zero API costs, and git rollbacks. A CMS adds maintenance friction without value. | Revisit when non-technical staff publish >10 blog posts/week. |
| **Heavy 3D WebGL / Spline Animations** | Drains battery, degrades mobile responsiveness, and contradicts the clean editorial journal aesthetic. | Never. Micro-interactions and SVG waveforms are faster and more professional. |
