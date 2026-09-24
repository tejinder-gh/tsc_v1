# Automation Systems Architecture & Runtime Boundaries

This document records the exact relationship, boundaries, operational state, and persistence mechanisms between the two distinct automation systems in TheSkillCorner repository:

1. **File-backed Customer Messaging Engine (`automations/`, `.automations/*`)**
2. **Neon Automation OS (`lib/second-brain/repositories/AutomationRepository.ts`, `/api/internal/v1/automations/*`)**

---

## 1. Subsystem Comparison

| Concern | File-backed automation engine (`automations/`, `.automations/*`) | Neon Automation OS (`AutomationRepository.ts`, `/api/internal/v1/automations/*`) |
| :--- | :--- | :--- |
| **Entry points** | `automations/runtime/cli.ts`, `automations/runtime/scheduler.ts`, `automations/server/run-tick.ts`, `app/api/cron/route.ts`, `app/api/inbound/sms/route.ts`, `app/dashboard/actions.ts` | `app/api/internal/v1/automations/status/route.ts`, `due-jobs/route.ts`, `jobs/[key]/route.ts`, `occurrences/ensure/route.ts`, `claims/acquire/route.ts`, `claims/release/route.ts`, `attempts/start/route.ts`, `attempts/finish/route.ts`, `cycles/upsert/route.ts` |
| **Scheduler** | In-process timer (`automations:scheduler`), external Vercel Cron pinging `GET /api/cron`, manual trigger via operator dashboard (`triggerManualSchedulerTick`) | Autonomous external machine runner loop polling `GET /due-jobs` and managing lifecycle via `acquire`, `start`, `finish`, `release` |
| **State owned** | Client marketing recipes, appointment reminders, review requests, no-show re-engagement, customer opt-outs, pending review drafts, operator runtime flow toggles | Machine job registry, recurring schedules, execution policies, distributed execution claims with TTL, occurrence attempt records, runner cycle logs |
| **Consumers** | Operator Command Center dashboard (`/dashboard`), marketing site demonstration clients (`radiance-salon`, `brightsmile-dental`), local SMB end customers | External autonomous runner agents, machine orchestrators, background workers authenticated via IAM credentials (`X-Agent-Key` or Bearer) |
| **External callers** | Twilio webhook (`POST /api/inbound/sms`), Vercel Cron (`GET /api/cron`) | Autonomous agent runners (`EXTERNAL CONSUMER UNVERIFIED` — contracts verified via 9 internal API routes and IAM security definer functions, but no external runner configuration is checked into this repository) |
| **Persistence** | Local JSON files in `.automations/` (`.automations/optouts.json`, `.automations/history.json`, `.automations/drafts/<clientId>.json`, `.automations/overrides/<clientId>.json`) | PostgreSQL / Neon relational database (`public.jobs_automation`, `schedules_automation`, `execution_claims_automation`, `occurrences_automation`, etc.) |
| **Source of truth** | Git-versioned TypeScript configs in `automations/clients/` merged at runtime with `.automations/overrides/<clientId>.json` | Neon database tables managed by PostgreSQL migrations (`db/migrations/001_second_brain_security.sql`, `002_security_definer_functions.sql`) |
| **Overlap** | None in runtime data or state. Shared conceptual domain of "scheduled work", but file engine executes SMB client customer messaging, while Neon OS executes multi-agent runner coordination | None in runtime data or state. Both subsystems currently operate as independent parallel architectures |
| **Removal impact** | Immediate catastrophic breakdown of SMB client automation product, dashboard flow matrix, inbound SMS reply handling, and draft approval workflow | Breaks autonomous agent runner orchestration, distributed claim locking, and internal machine execution observability |

---

## 2. Precise Operational Statuses

### File-backed Automation Engine
- **Status:** `ACTIVE` / `LEGACY BUT ACTIVE`
- **Justification:** Actively consumed by:
  - Dashboard overview matrix (`app/dashboard/actions.ts:getDashboardOverviewMetrics`)
  - Flow toggles (`app/dashboard/flows/actions.ts:toggleFlow`)
  - Vercel Cron (`app/api/cron/route.ts:GET`)
  - Twilio inbound SMS processing (`app/api/inbound/sms/route.ts:POST`)
  - 9 automated test suites (`automations/__tests__/*`, 62 passing unit/integration tests)
- **Constraint:** Retains file-based storage (`.automations/*.json`) which requires persistent disk in long-running container deployments or will reset ephemeral serverless instances on Vercel unless migrated to durable database storage.

### Neon Automation OS
- **Status:** `ACTIVE` / `EXTERNAL CONSUMER UNVERIFIED`
- **Justification:**
  - Actively exposed via 9 authenticated internal routes under `/api/internal/v1/automations/*`.
  - Protected by strict Zod input validation schemas and machine IAM authorization (`withAgentApi`).
  - Backed by relational state tables in PostgreSQL (`jobs_automation`, `execution_claims_automation`).
  - Tested by contract verification suites (`lib/second-brain/__tests__/automations-http.test.ts`, `automation-os.test.ts`, 24 passing contract tests).
  - External caller status is `EXTERNAL CONSUMER UNVERIFIED` because while the API contract is maintained and verified, no positive evidence of a specific external runner invocation or production caller configuration is stored inside this repository.
- **Internal Reference Status:** `UNREFERENCED INTERNALLY` (by frontend pages and dashboard actions).
  - Note: In accordance with global architectural rules, `UNREFERENCED INTERNALLY` **MUST NOT** be equated with `SAFE TO REMOVE`. The API contract is designed for external autonomous agents and worker runners operating outside the Next.js process boundary.

---

## 3. Convergence Direction (Future Roadmap)

While neither system should be migrated or deleted during the current remediation, the long-term architectural convergence path is:

1. **State Persistence Consolidation (Phase 1):**
   - Migrate file-backed client stores (`.automations/optouts.json`, `.automations/drafts/`, `.automations/overrides/`) into Neon PostgreSQL tables (e.g. `client_automations`, `client_opt_outs`, `client_drafts`).
   - Replace filesystem I/O (`fs.promises`) with repository access via Neon connection pool, resolving serverless filesystem ephemerality.

2. **Runner Convergence (Phase 2):**
   - Register client automation tasks (e.g. `radiance-salon:reminders`) as canonical entries in `public.jobs_automation`.
   - Leverage Neon Automation OS's atomic claim acquisition (`acquireClaim`) and occurrence logging (`startAttempt` / `finishAttempt`) instead of process-local timers, ensuring zero race conditions across distributed instances.

3. **Unified Operator Surface (Phase 3):**
   - Unify the operator command center (`/dashboard`) to display both client marketing sequences and autonomous machine runner cycles on a single pane of glass.
