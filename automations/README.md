# Automations Engine

The product behind the marketing site. TheSkillCorner sells automations to local
businesses and professional practices; this directory is the runnable, configurable
engine that delivers them.

The design principle is **write once, sell many**: one engine, one set of recipes,
and a single config file per client. Onboarding a new paying customer is authoring a
config object — never new code.

## Run the demo (no credentials needed)

```bash
npm run automations:demo   # or: npx tsx automations/runtime/cli.ts
npm test                   # runs the full vitest suite, incl. the engine + recipes
```

The demo runs two very different clients (a salon and a dental practice) through the
whole pipeline at a fixed instant, in **dry-run** (every send prints instead of
dialing Twilio/SendGrid).

## Running it on a schedule (making it live)

The engine only acts when something calls it on an interval. `runTick` runs every enabled
automation for every known client, using the **same file-backed stores as the inbound webhook**
(`getInboundStores`), so an opt-out a customer just texted is honoured on the very next tick.

```bash
npm run automations:scheduler   # long-running worker (self-hosted VM/container)
npm run automations:tick        # one pass, then exit (cron / CI / manual)
```

Two ways to drive it:

- **Self-hosted:** run `automations:scheduler` as a process (interval = `SCHEDULER_INTERVAL_MS`,
  default 5 min). Non-overlapping loop, clean SIGTERM shutdown.
- **Serverless (Vercel):** a platform cron pings `GET /api/cron` (protected by `CRON_SECRET`,
  which Vercel Cron sends automatically). Add to `vercel.json`:
  `{ "crons": [{ "path": "/api/cron", "schedule": "*/5 * * * *" }] }` (cadence per your plan).

Each client's integrations are resolved by an `IntegrationsResolver` (the seam where real
booking/POS/CRM adapters plug in); the demo resolver returns the fixture datasets so it runs
out of the box. A client with no integrations wired is skipped, not failed.

### Operator overrides (toggle automations without a deploy)

`runTick` passes each config through `applyOverrides`, which merges a per-client JSON file at
`.automations/overrides/<clientId>.json` — a simple `{ "<automationId>": true|false }` map — onto
the config. A dashboard (or a hand edit) can switch a flow off; the next tick respects it. No code
change, no redeploy.

### Draft approvals

`draft` actions (review replies, social posts, newsletters) are persisted to a `DraftStore`
(`.automations/drafts/<clientId>.json`) instead of being sent. An approval surface reads
`getPending()`, and `remove(idempotencyKey)` clears one once a human approves and sends it.

## How it fits together

```
clients/*          ← one config object per paying client (the unit of monetization)
   │  references recipes by id, wires channels + integrations
   ▼
core/engine.ts     ← orchestrator: validate config → run each enabled recipe → collect Actions
   │
   ├─ recipes/*    ← the catalogue (booking reminders, win-back, dunning, lead responder, …)
   │     most are built on core/sequence.ts (the shared "ladder" engine)
   │
   ├─ integrations/* ← read ports (calendar, payments, CRM, reviews) + in-memory adapter
   │
   ▼
runtime/dispatch.ts ← executes Actions via channels/*, marks idempotency after each success
```

- **Engine decides, runtime sends.** Recipes are pure: they return `Action[]`. Dry-run
  and live use the identical plan; only dispatch differs.
- **Idempotent by design.** Safe to run every few minutes on cron. A send is recorded
  only *after* it succeeds, so a crash mid-batch resumes without double-texting anyone.
- **Consent + quiet hours** are enforced centrally, not per recipe.

## The catalogue (`recipes/`)

| Recipe id | Product | Pattern |
|-----------|---------|---------|
| `booking-reminders` | Booking & reminders | ladder before appointment |
| `no-show-rebook` | No-show rebooking | ladder after missed slot |
| `review-booster` | Review booster | post-visit request |
| `review-responder` | Reviews & reputation | draft reply + notify negatives |
| `win-back` | Customer win-back | ladder from lapse threshold |
| `invoice-reminders` | Invoice & payments | dunning ladder, stops on payment |
| `lead-responder` | Lead qualification | instant reply + hot-lead alert |

Most are one call to `defineSequenceRecipe` — config + "who to enroll" + "what touches".

## Closing the loop (inbound)

The outbound engine speaks; the `inbound/` layer listens, so a customer's reply changes what
happens next. A provider webhook is normalised into an `InboundMessage`, **interpreted**, and the
result is applied to shared stores the outbound side reads at dispatch.

```
webhook (Twilio/email) → InboundMessage
   │  parseTwilioInbound / parseEmailReply
   ▼
ingestInbound (inbound/handle.ts)
   ├─ interpret  → compositeInterpreter
   │      rules first (STOP/START/C/RESCHEDULE — exact, free, never an LLM)
   │      └─ escalates only the ambiguous tail to the Claude LLM interpreter
   ├─ effects → SuppressionStore (opt-out, stop-automation, confirm)
   │            ConversationStore (history + reply attribution)
   └─ actions → transactional reply + human handoff (dispatched like any Action)
```

- **Two-tier interpretation.** Compliance-critical intents are deterministic and instant; the
  Claude interpreter (official Anthropic SDK, structured output) handles natural language only when
  rules can't. Default model `claude-opus-4-8`; set it to `claude-haiku-4-5` for cheap high-volume
  classification. It's injected, so tests stub it and never hit the network.
- **The loop actually closes.** `runClient(..., { suppression, conversations })` makes outbound
  honour opt-outs and per-automation stops — a contact who replies STOP is `suppressed`, not sent
  (see the closed-loop test in `__tests__/inbound.test.ts`). Solicited replies are `transactional`
  and bypass quiet-hours and suppression so the unsubscribe ack still goes out.
- **Idempotent ingestion.** Re-delivered webhooks (same provider message id) are no-ops.

Wire it behind your webhook handler: normalise → `ingestInbound(message, deps)` → `dispatch(result.actions, ...)`.

### How a reply actually reaches the app

Inbound is **provider push, not polling**. You give the provider a public URL; it POSTs each reply.

- **SMS (Twilio):** on the phone number, set *A MESSAGE COMES IN → Webhook →* `https://yourdomain.com/api/inbound`. Every customer text hits `app/api/inbound/route.ts`, which verifies the `X-Twilio-Signature`, resolves which client owns the destination number, and runs `processInbound`. In **local dev**, expose your machine with a tunnel (`ngrok http 3000` / `cloudflared`) and paste that URL into Twilio.
- **Email:** point an inbound-parse provider (SendGrid Inbound Parse, Mailgun Routes, Postmark inbound) at a sibling `/api/inbound/email` route that uses `parseEmailReply`.

The **outbound** reply (the unsubscribe ack, the AI-drafted answer) is sent by **our own `dispatch`** back through the same Twilio/SendGrid sender — it is *not* the webhook's HTTP response (that just returns empty TwiML). So the loop is: customer texts → Twilio → our route → dispatch → Twilio → customer.

### Choosing the interpreter model (any model, incl. Ollama)

`createChatModel` picks the model from env, defaulting to Claude:

```bash
# Production (default): Claude
ANTHROPIC_API_KEY=sk-ant-...            # INTERPRETER_MODEL optional (claude-opus-4-8)

# Local dev: Ollama, fully offline, no key
INTERPRETER_PROVIDER=ollama  INTERPRETER_MODEL=llama3.1  OLLAMA_HOST=http://localhost:11434

# Any OpenAI-compatible server (OpenAI, LM Studio, vLLM, Together)
INTERPRETER_PROVIDER=openai  INTERPRETER_MODEL=gpt-4o-mini  OPENAI_BASE_URL=...  OPENAI_API_KEY=...
```

The interpreter depends only on the `ChatModel` interface, so the rest of the system is identical
across providers. Whatever the model returns is re-validated against the schema — a weaker local
model degrades to a safe `handoff`, never garbage.

### Persistence

Production state lives in file-backed stores under `AUTOMATIONS_DATA_DIR` (default `./.automations`),
one set per client: `suppression.json`, `conversation.json`, `idempotency.json`, `contacts.json`.
`getInboundStores(clientId)` returns process-level singletons so the inbound route and the outbound
scheduler share the *same* state (an opt-out written by inbound is honoured by the next outbound run).
The `contacts.json` index is the identity bridge: dispatch records `address → contactId` on every
send, so an inbound phone number resolves back to the right CRM contact. Swap the `File*` stores for
DB-backed ones with the same interfaces to run multi-instance — nothing else changes.

> File stores require a persistent disk and a single instance (Node runtime, not edge/ephemeral
> serverless). On serverless, back the stores with a database via the same interfaces.

## Onboarding a client

1. Copy `clients/radiance-salon.ts`, fill in the business, channels, and `notify` map.
2. Pick automations and tune each `config` (offsets, copy, thresholds — all overridable).
3. Put secrets in env vars named by the config (`fromEnv`, `apiKeyEnv`, …) — **never** in
   the file. Keep `dryRun: true` until the plans look right, then flip it.
4. Implement the integration adapters for the client's real tools against the interfaces
   in `integrations/types.ts` (the in-memory adapter in `integrations/memory.ts` is the
   reference). Schedule `runClient(config, { integrations })` on a cron.

## Going live

- Swap the in-memory integrations for real adapters (Jane/Fresha/QuickBooks/GBP).
- Use `FileIdempotencyStore` (default) or a shared DB store for multi-instance runs.
- Replace `defaultDraftGenerator` in `review-responder.ts` with a Claude API call for
  richer on-brand copy (the seam is already there).
