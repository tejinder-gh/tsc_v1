# Observability Architecture & Operations Guide

> **Scope**: Observability foundation for TheSkillCorner marketing platform and application, incorporating **Plausible Community Edition (CE)**, **GlitchTip**, and **OpenReplay**.
> **Guiding Principle**: Privacy-first, default-OFF, fail-open, and strictly bounded.

---

## 1. Executive Summary & Stack Architecture

TheSkillCorner observability foundation decouples application code from vendor SDKs via a central internal telemetry abstraction (`lib/telemetry`):

```
                        ┌──────────────────────────────────────────────┐
                        │              Application Code                │
                        │ (Forms, CTAs, Booking, API Routes, Workflow) │
                        └──────────────────────┬───────────────────────┘
                                               │
                        ┌──────────────────────▼───────────────────────┐
                        │          lib/telemetry (Facade)              │
                        │ trackEvent(), captureError(), setContext().. │
                        └───────┬──────────────┬──────────────┬────────┘
                                │              │              │
                   ┌────────────▼───┐   ┌──────▼──────┐   ┌───▼────────────┐
                   │  Plausible CE  │   │  GlitchTip  │   │   OpenReplay   │
                   │ (Traffic/Goals)│   │ (Sentry SDK)│   │ (Replay/Allow) │
                   └────────────────┘   └─────────────┘   └────────────────┘
```

1. **Plausible Community Edition (CE)**: Self-hosted privacy-oriented web traffic, custom goals, and conversion measurement without cookies or cross-site tracking.
2. **GlitchTip**: Self-hosted Sentry-compatible client and server error monitoring, performance telemetry, releases, and source-map correlation.
3. **OpenReplay**: Self-hosted usability investigation and session replay, gated behind a deny-by-default public route allowlist, running in strict Private Mode.

---

## 2. Activation Order & Rollout Policy

Observability components MUST be activated sequentially according to the following phased rollout:

1. **Phase 1: GlitchTip Error Telemetry**
   - Activate first across staging and production.
   - Purpose: Establish release tracking and baseline error capture.
   - Enables triage of unhandled runtime exceptions and server-side webhook delivery failures.
2. **Phase 2: Plausible CE Analytics**
   - Activate second once the self-hosted Plausible CE container and site domain are provisioned.
   - Purpose: Track anonymous traffic attribution, CTA clicks, form lifecycles, and conversions.
3. **Phase 3: OpenReplay Session Replay (Staging Verification First)**
   - **Production replay remains DISABLED initially.**
   - Enable first in a staging environment to audit and verify that Private Mode, input masking, and structural route exclusions operate as intended.
   - Activate in production ONLY after privacy behavior has been audited and signed off.

---

## 3. Core Operating Invariants

### 3.1 Default State: OFF (Fail-Open)
All integrations are fail-open and disabled unless explicitly configured via environment variables:
- Missing configuration MUST NEVER throw, fail rendering, or prevent lead capture.
- Missing configuration MUST NEVER output noisy console errors or leak secrets.
- Missing configuration reports `status: "unavailable"` in operational matrices.

### 3.2 No Implicit Cloud Fallbacks
- `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL` does NOT default to `plausible.io`. If unset, Plausible CE no-ops.
- Google Analytics 4 (GA4) requires its own explicit toggle (`NEXT_PUBLIC_GA_ENABLED="true"`). GA4 NEVER activates as an implicit fallback when Plausible is unconfigured.

### 3.3 Client vs. Server Secret Separation
- Public client environment variables (`NEXT_PUBLIC_*`) are restricted to public client DSNs, project keys, and script URLs.
- Sensitive credentials (e.g. `GLITCHTIP_AUTH_TOKEN`, source-map upload keys, server DSNs, webhook secrets, database connection strings) MUST NEVER use `NEXT_PUBLIC_*` prefixes.

### 3.4 Data Retention Targets
Data retention is managed at the infrastructure layer (cron / database retention policies). The application does not hard-code or depend on retention periods:
- **Session Replay (OpenReplay)**: Operating target maximum **14 days**.
- **Error Telemetry (GlitchTip)**: Operating target **30 days**.

---

## 4. Privacy Boundaries & Defensive Scrubbing

### 4.1 GlitchTip Error Sanitization
GlitchTip uses the official `@sentry/nextjs` SDK configured with an assertive `beforeSend` lifecycle hook (`lib/telemetry/scrubber.ts`):
- **Stack Trace Integrity**: Preserves stack frames, file names, lines, columns, and symbol structures intact for debugging. Does not broadly regex-rewrite stack trace lines.
- **Prohibited Field Denylist**: Strips all occurrences of:
  `email`, `phone`, `name`, `message`, `password`, `token`, `authorization`, `cookie`, `set-cookie`, `secret`, `key`, `payload`, `body`, `database_url`, `card`, `creditcard`, `cvv`, `pan`.
- **Payment & Card Data Prohibition**: Credit card and payment account numbers (13–19 digit patterns) are strictly prohibited from telemetry and scrubbed to `[REDACTED_PAYMENT_DATA]`.
- **Session Tracking Disabled**: `autoSessionTracking: false` is configured to prevent non-standard endpoint errors on GlitchTip.
- **Conservative Tracing**: Production performance sample rate is capped at `0.05` (`tracesSampleRate: 0.05`).

### 4.2 OpenReplay Privacy & Route Allowlist
- **Deny-by-Default Route Allowlist**: OpenReplay is structurally restricted to public marketing routes (`REPLAY_ALLOWLISTED_ROUTES`).
- **Pre-Import Verification**: Route eligibility is verified BEFORE dynamically importing `@openreplay/tracker`. On non-allowlisted pages, zero OpenReplay code is downloaded or executed.
- **Operator & Authenticated Route Exclusion**:
  `/dashboard*`, `/sign-in*`, `/login*`, `/api*`, and `/dev*` are structurally excluded. Replay will NEVER initialize on these routes regardless of environment flags.
- **Private Mode & Input Hiding**:
  - `defaultInputMode: 2` (Hidden: all input field values are masked/hidden by default).
  - Explicit selector exclusions: `input, textarea, select, [data-mask], [data-private], .private`.
  - Network request/response bodies are not recorded (`network: { sessionTokenHeader: false, failuresOnly: true }`).
  - Console logs containing application data are disabled (`consoleMethods: null`).
  - **Zero User Identity**: `tracker.setUserID` and `tracker.identify` are strictly prohibited.

---

## 5. Semantic Event Taxonomy

Application code uses a vendor-neutral event taxonomy (`lib/telemetry/types.ts`):

| Event Name | Layer | Purpose / Meaning |
| :--- | :--- | :--- |
| `form_started` | Client (UI) | User initiated interaction with a form. |
| `form_completed` | Client (UI) | Form submission workflow succeeded. |
| `lead_submit_attempted` | Client (Fetch) | User submitted lead form; outbound HTTP request initiated. |
| `lead_submit_accepted` | Client (Fetch) | Local API endpoint (`/api/lead`) accepted submission (HTTP 200). |
| `lead_delivery_succeeded` | Server (API) | **Authoritative**: Downstream CRM/webhook responded with 2xx. |
| `lead_delivery_failed` | Server (API) | **Authoritative**: Downstream webhook responded non-2xx, timed out, or unconfigured. |
| `cta_clicked` | Client (UI) | User clicked an interactive CTA button or link. |
| `contact_started` | Client (UI) | User engaged with the contact enquiry interface. |
| `booking_viewed` | Client (UI) | Booking schedule embed was rendered on screen. |
| `booking_started` | Client (SDK) | User selected an event type or interaction slot in Cal.com. |
| `booking_completed` | Client (SDK) | **Authoritative**: Cal.com SDK emitted `bookingSuccessful` callback. |

> [!NOTE]
> **Plausible CE Funnel Distinction**
> Plausible CE does not natively compute multi-step ordered session funnels. A calculated `form_started -> form_completed` ratio is reported as a coarse operational rate, never labeled as a native session funnel.

---

## 6. Separation of WRITE vs. READ Paths & Reporting

Telemetry writers record events and errors. However, until an authoritative server read adapter queries self-hosted Plausible/GlitchTip APIs:
- The operator dashboard exposes **configuration states, release information, and deployment status**, but DOES NOT manufacture event counts, conversion rates, or health scores.
- The Weekly Observability Report (`lib/telemetry/report.ts`) implements a strict schema distinguishing:
  1. `observed`: Factually verified from active telemetry.
  2. `calculated`: Calculated from verified facts (e.g. `lead_delivery_succeeded / delivery attempts`).
  3. `unavailable`: Authoritative data source not yet connected (never estimated or guessed).

---

## 7. Self-Hosted Infrastructure Endpoints

| Service | Recommended Image | Exposed Port | Configuration Key |
| :--- | :--- | :--- | :--- |
| **Plausible CE** | `ghcr.io/plausible/community-edition` | `8000` | `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` |
| **GlitchTip** | `glitchtip/glitchtip` | `8000` | `NEXT_PUBLIC_GLITCHTIP_DSN`, `GLITCHTIP_DSN` |
| **OpenReplay** | Single-node / SaaS self-hosted | `443` | `NEXT_PUBLIC_OPENREPLAY_PROJECT_KEY`, `NEXT_PUBLIC_OPENREPLAY_INGEST_POINT` |
