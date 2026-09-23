# TSC REDESIGN — TICKET 004
## Interactive Demonstration — Deterministic Recommendation Proof Experience

### Status
APPROVED FOR IMPLEMENTATION

### Priority
P0

### Dependency
Tickets 001, 001A, 002, 002A, and 003 are accepted and verified.

### Scope
Stage 03 Substage — Solution / Demonstration (`stage === "solution"`)

This ticket replaces the temporary Solution placeholder with an interactive, deterministic system demonstration.

It introduces:
- A small reusable set of 4 demonstration archetypes (`pipeline-stream`, `decision-router`, `system-spec`, `educational-artifact`)
- Typed configuration mapping all 19 canonical `OpportunityId`s to their corresponding demonstration archetype
- Deterministic step-by-step system execution:
  `INPUT → INTERPRETATION → BUSINESS RULE → SYSTEM ACTION → RESULT / EXCEPTION`
- Multiple deterministic scenarios per demonstration (standard path vs. alternate/exception path)
- Interactive runner controls (step-through, run all, replay, switch scenario)
- Educational artifact demonstrations for all 4 Learn paths (`learning-orientation`, `learning-guide`, `learning-toolkit`, `learning-briefing`)
- Strict privacy: No transmission of visitor `freeformProblem` text
- Reversibility: Seamless return to Opportunity diagnosis (`← Return to opportunity`)
- Non-promotional, honest engineering presentation with clear illustrative disclaimers

It does NOT introduce:
- AI or LLM runtime calls
- Stage 04 Plan (Plan remains inactive until future approved specification)
- Contact forms, lead capture, or booking funnels
- Fabricated ROI, customer metrics, or production claims
- Third-party UI or animation dependencies
- Persistence of derived simulation state into `JourneyContext`

---

# 1. OBJECTIVE

After viewing their prioritized Opportunity diagnosis in Stage 03, the visitor clicks:
`See how this would work →`

The goal is to make the diagnosis concrete:
Show the system working rather than explaining it through marketing prose.

The demonstration must feel like an actual technical artifact, operational inspection, or engineering blueprint:
- Real-world input
- System interpretation
- Applied business rule
- Executed action
- Concrete result or exception handling

For Learn visitors:
Show the exact structure, decision framework, and curriculum of the educational format without pretending to be a sales funnel.

---

# 2. CORE ARCHITECTURE

## 2.1 Reusable Demonstration Archetypes

Rather than building 19 bespoke views, the system implements 4 archetypes:

| Archetype | Description | Mapped Opportunities |
| :--- | :--- | :--- |
| `pipeline-stream` | Ingest → Parse → Validate → Execute → Result stream | `communication-automation`, `admin-automation`, `scheduling-orchestration`, `response-conversion`, `systems-integration` |
| `decision-router` | Condition evaluation & rule routing matrix | `workflow-orchestration`, `follow-up-system`, `retention-system`, `reporting-intelligence`, `conversion-optimization` |
| `system-spec` | Layered architecture (Interface, Boundary, Logic, Data) | `customer-product`, `internal-software`, `ai-product-feature`, `product-modernization`, `demand-generation` |
| `educational-artifact` | Structured framework, blueprint, or briefing inspector | `learning-orientation`, `learning-guide`, `learning-toolkit`, `learning-briefing` |

## 2.2 Deterministic & Local Engine

The demonstration engine is:
- **Synchronous & Local**: Zero network requests, zero asynchronous dependencies.
- **LLM-Free**: All scenarios, steps, payloads, and rules are typed static configuration.
- **Purely Derived**: State inside the demonstration (active scenario, active step, running state) is local component state. It is **never** persisted to `localStorage` or `JourneyContext`.
- **Independently Testable**: The mapping of `OpportunityId` to demonstration config is verified through automated unit tests.

---

# 3. DEMONSTRATION STEP ANATOMY

For technical automation and system archetypes (`pipeline-stream`, `decision-router`, `system-spec`), each scenario defines a sequence of 4–5 steps:

1. **INPUT**:
   - Realistic incoming payload, event, or trigger (e.g. inbound voicemail/SMS, batch CSV, webhook, form submission).
   - Displayed with monospace font, timestamps, and payload structure.
2. **INTERPRETATION**:
   - Data extraction, schema validation, entity parsing, or intent classification.
3. **BUSINESS RULE / DECISION**:
   - The opinionated logic applied: operating hours, capacity checks, threshold comparison, routing criteria.
4. **SYSTEM ACTION**:
   - State transition, record creation, external dispatch, task queueing.
5. **RESULT / EXCEPTION**:
   - Normal path: Confirmed outcome with notifications.
   - Exception path: Conflict flagged, human escalation triggered, or graceful fallback.

---

# 4. LEARN PATH DEMONSTRATIONS

Learn paths are educational and informational. They must NOT simulate business automation pipelines.

Each Learn opportunity demonstrates its specific artifact structure:
- `learning-orientation`: Executive Landscape Map — Core concepts, What works now, What to avoid, Strategic starting point.
- `learning-guide`: Practical Implementation Blueprint — Architecture overview, Prerequisites checklist, 4-step implementation sequence, Common pitfalls.
- `learning-toolkit`: Operational Evaluation Kit — Vendor evaluation rubric, Feasibility scorecard, Build vs. buy decision tree.
- `learning-briefing`: Strategic Intelligence Briefing — Signal vs. noise analysis, Platform shift summary, Operational impact checklist.

Topic Adaptation:
The artifact automatically reflects the visitor's chosen Q1 Focus topic (`customer-communication`, `admin-data-entry`, etc.).

---

# 5. UX & DESIGN SPECIFICATION

## 5.1 Journey Placement & Stepper
- Active Journey Step: **03 OPPORTUNITY** (remains visually in Stage 03).
- Stage 04 **PLAN** remains inactive.
- Header:
  - Stepper navigation showing `03 OPPORTUNITY` highlighted.
  - Substage label: `SYSTEM DEMONSTRATION` or `EDUCATIONAL ARTIFACT` (monospace, uppercase).
  - Headline: Specific to the diagnosed opportunity (e.g., *"How automated first response works in practice"*).
  - Honest disclosure banner:
    `SIMULATION / SYSTEM DEMONSTRATION — Illustrative deterministic model. No customer data or production performance is fabricated.`

## 5.2 Controls
- **Scenario Toggle**: Switch between `Scenario 1: Standard Flow` and `Scenario 2: Exception Flow` (or alternate scenario).
- **Playback Controls**:
  - `Play / Run Simulation`
  - `Next Step →`
  - `Replay ↺`
- **Reversibility Navigation**:
  - `← Return to opportunity diagnosis`: Invokes `setStage("opportunity")` to seamlessly return to the diagnostic view without altering context or diagnosis.

## 5.3 Visual Design
- Uses canonical tokens from `globals.css`:
  - Background: `--tsc-paper` canvas with `--tsc-surface` panels and hairline rules (`--tsc-line`).
  - Active step indicator: `--tsc-ink` with `--tsc-signal` or `--tsc-action` accent points.
  - Monospace technical labels: font-mono text-xs with `tracking-[0.14em]`.
  - Zero generic cards, zero decorative drop shadows, zero cartoon animations.

---

# 6. ANALYTICS SPECIFICATION

All demonstration tracking uses the existing `track()` abstraction in `lib/analytics.ts`:
- `journey_demonstration_viewed`:
  - `opportunityId`: string
  - `archetype`: string
  - `scenario`: string
  - *(Deduplicated across component remounts)*
- `journey_demonstration_scenario_changed`:
  - `opportunityId`: string
  - `scenario`: string
- `journey_demonstration_completed`:
  - `opportunityId`: string
  - `scenario`: string
- `journey_demonstration_returned_to_opportunity`:
  - `opportunityId`: string

**Privacy Invariant**: Under no circumstance is `freeformProblem` or raw user text included in demonstration analytics payloads.

---

# 7. ACCEPTANCE CRITERIA

1. All 19 canonical `OpportunityId`s map to a valid, complete demonstration configuration.
2. Standard flow and exception/alternate flow are present and testable for every opportunity.
3. Learn opportunities render structured educational artifacts rather than automation pipelines.
4. Step transitions, scenario toggles, and replay actions work deterministically and synchronously.
5. Reversibility (`← Return to opportunity diagnosis`) returns cleanly to Stage 03 Opportunity.
6. Analytics events fire with correct metadata and strict privacy guarantees.
7. Responsive layout verified on Desktop (1440px), Desktop compact (1440×800px), Tablet (768px), and Mobile (390px).
8. All unit tests pass, TypeScript clean, Biome clean, Next.js build passes with 90/90 static routes.

---

# 8. INTERACTION, TRUTHFULNESS, AND RECOVERY

## 8.1 States and deterministic behaviour

Each demonstration begins **ready**: no flow step is completed before an explicit `Run example` action. The interaction is `READY → Run example → progressive step reveal → complete → Replay`. Visitors may choose another configured example at any point; alternate selection follows declaration order and never uses randomness or network state. `Run all steps` is a convenience action. When reduced motion is requested, it completes without a timed reveal.

The engine is local and pure. It does not call a server action, application API, database, external provider, or model.

## 8.2 Truthfulness

The disclosure appears before every scenario. Illustrations describe possible rules and outcomes only; they do not include unsupported response times, savings, ROI, revenue changes, or customer-performance claims. Technical payloads are illustrative static data, never visitor text or customer records.

## 8.3 Analytics and privacy

`journey_demonstration_viewed`, `journey_demonstration_started`, `journey_demonstration_scenario_changed`, `journey_demonstration_completed`, and `journey_demonstration_returned_to_opportunity` carry only intent, opportunity ID, archetype, and scenario ID as relevant. `freeformProblem` is never emitted. View deduplication is provider-lifecycle memory only and is never stored in local storage.

## 8.4 Recovery, accessibility, and responsive rules

- `solution` without intent recovers to `new`; missing focus or situation recovers to `context` without rendering or tracking a demonstration.
- `solution → opportunity` uses a product control and retains all canonical journey input. Stage 03 remains active and Stage 04 is excluded.
- Controls are semantic buttons with keyboard activation, visible focus, text status, and no colour-only meaning. The stable demonstration announcement is polite and avoids per-step screen-reader noise.
- At 390px the ordered experience is input, action, sequence, result. It has no intentional horizontal layout dependency; tablet and desktop retain that order.

## 8.5 Explicit exclusions and test invariants

This ticket excludes Stage 04 Plan, a fifth step, persisted demonstration UI state, LLM execution, external integrations, lead capture, dashboard changes, and customer records. Tests cover total Opportunity coverage, non-empty and unique examples, educational Learn archetypes, deterministic alternate selection, invalid state normalization, analytics privacy and deduplication, replay reset, and Stage 03 progress semantics.
