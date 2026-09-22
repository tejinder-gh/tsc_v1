# TSC REDESIGN — TICKET 003
## Opportunity Diagnostic — Prioritized Recommendation Experience

### Status
APPROVED FOR IMPLEMENTATION

### Priority
P0

### Dependency
Tickets 001, 001A, and 002 are accepted.

### Scope
Stage 03 — Opportunity

This ticket replaces the temporary Opportunity placeholder with a real diagnostic result.

It introduces:

- deterministic opportunity diagnosis
- one primary recommendation
- one secondary opportunity
- one deliberately deferred opportunity
- reasoning tied to visitor context
- human judgment / "what we would not do yet"
- contextual evidence
- controlled next-step transition

It does NOT introduce:

- AI/LLM calls
- contact forms
- pricing
- lead capture
- service catalog browsing
- ROI estimates
- account requirements

---

# 1. OBJECTIVE

After two Context questions, the visitor should receive a useful opinion.

Not:

> "Here are six services you might like."

Instead:

> "Based on the problem shape you described, this is where we would start."

The experience should make the visitor feel:

> "They are narrowing the problem for me rather than trying to sell everything."

---

# 2. CORE PRINCIPLE

Stage 03 is a diagnostic.

It is NOT:

- a search result
- a recommendation carousel
- a service grid
- a pricing page
- a lead-generation page

The user receives:

1. ONE primary opportunity
2. ONE secondary opportunity
3. ONE explicitly deferred idea

This forces prioritization.

---

# 3. OPPORTUNITY MODEL

Add a reusable typed model.

Conceptually:

```ts
export type OpportunityId =
  | 'communication-automation'
  | 'admin-automation'
  | 'scheduling-orchestration'
  | 'reporting-intelligence'
  | 'workflow-orchestration'

  | 'demand-generation'
  | 'response-conversion'
  | 'follow-up-system'
  | 'conversion-optimization'
  | 'retention-system'

  | 'customer-product'
  | 'internal-software'
  | 'systems-integration'
  | 'ai-product-feature'
  | 'product-modernization'

  | 'learning-orientation'
  | 'learning-guide'
  | 'learning-toolkit'
  | 'learning-briefing';

export interface OpportunityDefinition {
  id: OpportunityId;

  title: string;

  shortLabel: string;

  outcome: string;

  explanation: string;

  evidence: string[];

  avoidForNow: string;

  demonstrationId?: string;

  destination?: string;
}

export interface OpportunityDiagnosis {
  primary: OpportunityId;
  secondary: OpportunityId;
  deferred: OpportunityId;

  rationaleModifier?: string;
  topicLabel?: string;
}
```

Do not put UI copy inside JSX branches.

---

# 4. DETERMINISTIC ENGINE

Create a pure function conceptually equivalent to:

```ts
diagnoseOpportunity({
  intent,
  contextFocus,
  contextSituation,
}): OpportunityDiagnosis
```

No network calls.
No AI.
No randomization.
Identical input must always produce identical output.
This function must be independently unit-testable.

---

# 5. HOW DIAGNOSIS WORKS

Use `contextFocus` as the primary determinant for `save-time`, `grow`, and `build`.
For `learn`, use `contextSituation` as the primary determinant.

Use `contextSituation` to modify:
- rationale modifier
- prioritization nuance
- secondary opportunity where relevant

The design is systematic, deterministic, and explainable.

---

# 6. SAVE-TIME OPPORTUNITIES

---

## A. CUSTOMER COMMUNICATION

Focus: `'customer-communication'`
Primary: `'communication-automation'`

### Title
Automate the first response.

### Short label
Communication automation

### Outcome
Handle routine calls, messages, enquiries, updates, and follow-ups without making a person the routing layer.

### Explanation
Communication becomes expensive when every request requires someone to read, interpret, respond, and move information somewhere else. The highest-leverage first step is usually to automate the predictable part while preserving human escalation for exceptions.

### Evidence
- Capture the request immediately.
- Resolve routine cases automatically.
- Escalate only when judgment is actually needed.

### Avoid for now
We would not start by building a general-purpose chatbot. Fix the specific communication workflow first.

Secondary: `'workflow-orchestration'`
Deferred: `'reporting-intelligence'`

---

## B. ADMIN & DATA ENTRY

Focus: `'admin-data-entry'`
Primary: `'admin-automation'`

### Title
Remove the copying.

### Short label
Admin automation

### Outcome
Move routine information between forms, inboxes, documents, spreadsheets, and business systems automatically.

### Explanation
Repeated data entry is rarely a people problem. It is usually evidence that two systems or steps are not connected. Start by removing the repetitive movement of information before redesigning the entire operation.

### Evidence
- Capture data once.
- Validate it at the boundary.
- Write it to the systems that actually need it.

### Avoid for now
We would not replace every existing tool just because the workflow is manual. Connect the useful systems first.

Secondary: `'workflow-orchestration'`
Deferred: `'internal-software'`

---

## C. SCHEDULING & COORDINATION

Focus: `'scheduling-coordination'`
Primary: `'scheduling-orchestration'`

### Title
Stop coordinating the predictable.

### Short label
Scheduling orchestration

### Outcome
Let availability, reminders, confirmations, handoffs, and routine rescheduling move without manual coordination.

### Explanation
Scheduling friction is often caused by small decisions being passed between people. The first opportunity is to make availability and workflow rules explicit so routine coordination happens automatically.

### Evidence
- Expose real availability.
- Automate confirmations and reminders.
- Escalate conflicts instead of every booking.

### Avoid for now
We would not build custom scheduling software if an existing scheduling system already handles the core calendar logic.

Secondary: `'communication-automation'`
Deferred: `'internal-software'`

---

## D. REPORTING & ANALYSIS

Focus: `'reporting-analysis'`
Primary: `'reporting-intelligence'`

### Title
Make the report assemble itself.

### Short label
Reporting intelligence

### Outcome
Collect recurring operational data automatically and turn it into a consistent view of what changed and what needs attention.

### Explanation
If people repeatedly gather the same numbers, clean them, compare them, and distribute a report, the reporting process itself has become a workflow. Automate collection and normalization before adding sophisticated analytics.

### Evidence
- Collect from source systems.
- Normalize the recurring metrics.
- Surface changes and exceptions.

### Avoid for now
We would not start with an elaborate BI platform if the underlying data collection is still inconsistent.

Secondary: `'workflow-orchestration'`
Deferred: `'ai-product-feature'`

---

## E. INTERNAL WORKFLOWS

Focus: `'internal-workflows'`
Primary: `'workflow-orchestration'`

### Title
Make the handoff explicit.

### Short label
Workflow orchestration

### Outcome
Turn recurring internal handoffs into a visible workflow with clear rules, ownership, and automatic movement between systems.

### Explanation
Internal friction often appears as people reminding one another, forwarding information, checking status, or manually deciding what happens next. The first opportunity is to model that workflow explicitly.

### Evidence
- Define the trigger.
- Make ownership visible.
- Automate predictable transitions.

### Avoid for now
We would not build a large internal platform before proving that the workflow itself is stable enough to encode.

Secondary: `'admin-automation'`
Deferred: `'internal-software'`

---

# 7. GROWTH OPPORTUNITIES

---

## A. FIND MORE LEADS

Focus: `'find-more-leads'`
Primary: `'demand-generation'`

### Title
Fix discovery before automation.

### Short label
Demand generation

### Outcome
Create more qualified opportunities by improving where, why, and how the right audience discovers the business.

### Explanation
Automation cannot compensate for insufficient demand. If the pipeline starts too small, the first job is to improve discovery, positioning, distribution, or acquisition before optimizing follow-up.

### Evidence
- Clarify who should discover you.
- Strengthen the path that brings them in.
- Measure qualified demand rather than raw traffic.

### Avoid for now
We would not begin by automating nurture sequences for a pipeline that does not yet have enough qualified demand.

Secondary: `'conversion-optimization'`
Deferred: `'follow-up-system'`

---

## B. RESPOND FASTER

Focus: `'respond-faster'`
Primary: `'response-conversion'`

### Title
Win the first few minutes.

### Short label
Response conversion

### Outcome
Acknowledge and route new enquiries immediately instead of depending on someone noticing them.

### Explanation
When customers already reach out, response latency becomes a conversion problem. The first opportunity is to remove waiting from the initial response and qualification step.

### Evidence
- Capture every enquiry immediately.
- Acknowledge it without waiting for staff.
- Route qualified requests to the right next step.

### Avoid for now
We would not add more lead sources until the current enquiries are being handled reliably.

Secondary: `'follow-up-system'`
Deferred: `'demand-generation'`

---

## C. FOLLOW-UP

Focus: `'follow-up'`
Primary: `'follow-up-system'`

### Title
Do not let intent disappear.

### Short label
Follow-up system

### Outcome
Create a consistent follow-up sequence so interested prospects do not depend on someone's memory.

### Explanation
If interest already exists, generating more leads may simply create more leakage. The highest-leverage step is to make follow-up systematic, timely, and context-aware.

### Evidence
- Record the customer's current state.
- Trigger the next useful follow-up.
- Stop when the situation changes.

### Avoid for now
We would not increase advertising spend before fixing a follow-up process that is already losing existing demand.

Secondary: `'response-conversion'`
Deferred: `'demand-generation'`

---

## D. CONVERT MORE

Focus: `'convert-more'`
Primary: `'conversion-optimization'`

### Title
Reduce friction at the decision.

### Short label
Conversion optimization

### Outcome
Improve the path between interest and action instead of simply sending more people into the same funnel.

### Explanation
When traffic and leads already exist, the first question is what prevents the next step. Simplify the decision path and instrument where people stop before increasing acquisition volume.

### Evidence
- Identify the drop-off point.
- Reduce unnecessary decisions.
- Make the next action unmistakable.

### Avoid for now
We would not add more channels until we understand why the existing audience is not converting.

Secondary: `'follow-up-system'`
Deferred: `'demand-generation'`

---

## E. RETAIN CUSTOMERS

Focus: `'retain-customers'`
Primary: `'retention-system'`

### Title
Design the second interaction.

### Short label
Retention system

### Outcome
Create deliberate repeat-purchase, review, referral, or re-engagement moments after the first transaction.

### Explanation
Retention rarely improves because someone remembers to contact customers later. The opportunity is to define what should happen after a successful customer interaction and make it repeatable.

### Evidence
- Identify the right post-purchase moment.
- Trigger useful follow-up.
- Measure repeat behavior rather than activity.

### Avoid for now
We would not launch a complicated loyalty program before establishing a reliable basic retention loop.

Secondary: `'follow-up-system'`
Deferred: `'demand-generation'`

---

# 8. BUILD OPPORTUNITIES

---

## A. CUSTOMER-FACING EXPERIENCE

Focus: `'customer-experience'`
Primary: `'customer-product'`

### Title
Build the customer path, not just the interface.

### Short label
Customer product

### Outcome
Create a focused digital experience around the customer's actual task: discover, decide, book, buy, submit, or manage.

### Explanation
A polished interface is not enough. The first product decision is the customer journey the software must make easier.

### Evidence
- Define the user's job.
- Remove unnecessary steps.
- Build the smallest complete journey.

### Avoid for now
We would not start by designing dozens of screens before the primary customer journey is clear.

Secondary: `'conversion-optimization'`
Deferred: `'ai-product-feature'`

---

## B. INTERNAL TOOL

Focus: `'internal-tool'`
Primary: `'internal-software'`

### Title
Build around the operation.

### Short label
Internal software

### Outcome
Create purpose-built software where generic tools are forcing the team into workarounds, duplication, or fragile processes.

### Explanation
An internal tool is valuable when the workflow is important and stable enough that adapting the business to generic software costs more than encoding the real process.

### Evidence
- Model the actual workflow.
- Make state and ownership explicit.
- Automate the repetitive edges.

### Avoid for now
We would not custom-build what an inexpensive existing tool already solves adequately.

Secondary: `'workflow-orchestration'`
Deferred: `'ai-product-feature'`

---

## C. AUTOMATION OR INTEGRATION

Focus: `'automation-integration'`
Primary: `'systems-integration'`

### Title
Connect the systems before replacing them.

### Short label
Systems integration

### Outcome
Move information and actions reliably between the tools already carrying the business.

### Explanation
Many automation problems are really integration problems. Before introducing another platform, make the existing systems exchange the right information at the right time.

### Evidence
- Define the source of truth.
- Define the event that triggers movement.
- Make failures visible instead of silent.

### Avoid for now
We would not introduce another platform simply to connect tools that already expose reliable integration points.

Secondary: `'workflow-orchestration'`
Deferred: `'internal-software'`

---

## D. AI PRODUCT

Focus: `'ai-product'`
Primary: `'ai-product-feature'`

### Title
Give AI one real job.

### Short label
AI product feature

### Outcome
Use AI where interpretation, generation, classification, or reasoning materially improves the product behavior.

### Explanation
AI is most useful when it owns a clearly bounded responsibility. Start with one job whose quality can be measured rather than making the entire product vaguely 'AI-powered.'

### Evidence
- Define the decision or transformation.
- Define what good output means.
- Design the fallback when confidence is insufficient.

### Avoid for now
We would not begin with autonomous agents controlling critical workflows before the bounded task is reliable.

Secondary: `'customer-product'`
Deferred: `'workflow-orchestration'`

---

## E. EXISTING PRODUCT

Focus: `'existing-product'`
Primary: `'product-modernization'`

### Title
Fix the constraint before rewriting the product.

### Short label
Product modernization

### Outcome
Improve an existing system by identifying whether the real constraint is UX, architecture, reliability, delivery speed, or accumulated complexity.

### Explanation
A rewrite is an expensive diagnosis. Existing products usually benefit more from identifying the actual bottleneck and replacing the smallest layer necessary.

### Evidence
- Locate the constraint.
- Measure its operational cost.
- Replace the smallest responsible boundary.

### Avoid for now
We would not authorize a full rewrite merely because the current codebase feels old or unpleasant.

Secondary: `'systems-integration'`
Deferred: `'ai-product-feature'`

---

# 9. LEARN OPPORTUNITIES

---

## A. SITUATION: QUICK ANSWER

Situation: `'quick-answer'`
Primary: `'learning-orientation'`

### Title
Start with orientation.

### Short label
Learning orientation

### Outcome
Get the important mental model first, then decide whether the subject deserves deeper attention.

### Explanation
You asked for a quick answer. The useful thing here is not more content — it is identifying the few ideas that make the rest of the topic easier to understand.

### Evidence
- Find the few concepts that explain the rest.
- Separate what matters now from what can wait.
- Leave knowing what, if anything, deserves deeper study.

### Avoid for now
We would not send you into a long course or a consulting conversation for a question that may need ten focused minutes.

Secondary: `'learning-guide'`
Deferred: `'learning-briefing'`

---

## B. SITUATION: PRACTICAL GUIDE

Situation: `'practical-guide'`
Primary: `'learning-guide'`

### Title
Learn by applying it.

### Short label
Practical guide

### Outcome
Use a structured explanation built around a real implementation rather than disconnected theory.

### Explanation
You want enough depth to use the subject. The best path is a guide that connects concepts directly to decisions and implementation.

### Evidence
- Follow one practical path from idea to application.
- See the decisions behind the implementation.
- Finish with something you can use or adapt.

### Avoid for now
We would not bury the practical task under a large curriculum before you can build something useful.

Secondary: `'learning-toolkit'`
Deferred: `'learning-briefing'`

---

## C. SITUATION: TEMPLATES OR TOOLS

Situation: `'templates-tools'`
Primary: `'learning-toolkit'`

### Title
Start from something usable.

### Short label
Learning toolkit

### Outcome
Use a template, tool, checklist, or working example as the entry point and learn the concepts through adaptation.

### Explanation
You do not need more theory first. You need a useful artifact that exposes the important decisions while you work with it.

### Evidence
- Start with a usable artifact.
- Adapt it to a real task.
- Learn the important decisions while working with it.

### Avoid for now
We would not make you consume a long guide before giving you the thing you came to use.

Secondary: `'learning-guide'`
Deferred: `'learning-briefing'`

---

## D. SITUATION: ONGOING BRIEFINGS

Situation: `'ongoing-briefings'`
Primary: `'learning-briefing'`

### Title
Filter the noise.

### Short label
Ongoing briefings

### Outcome
Receive a recurring, opinionated summary of meaningful developments instead of monitoring the entire topic yourself.

### Explanation
The challenge with ongoing learning is not access to information. It is deciding what deserves attention. A briefing should perform that filtering.

### Evidence
- Filter developments by practical significance.
- Explain why the meaningful changes matter.
- Ignore noise that does not change what you should do.

### Avoid for now
We would not turn this into another high-volume newsletter that simply summarizes whatever happened this week.

Secondary: `'learning-guide'`
Deferred: `'learning-orientation'`

---

# 10. LEARN TOPIC CONTEXT

For Learn, `contextFocus` represents the subject:
- `'ai-automation'`: "AI & automation"
- `'software-product'`: "Software & product"
- `'growth-marketing'`: "Growth & marketing"
- `'operations-systems'`: "Operations & systems"

Display it prominently under TOPIC.
The primary diagnosis comes from `contextSituation`.

For `intent === 'learn'`, render the evidence section label as:
`WHAT YOU'LL GET`
For all other intents, retain:
`WHAT IT CHANGES`

---

# 11. SITUATION-BASED RATIONALE MODIFIERS

## SAVE-TIME MODIFIERS
- `mostly-manual`: "Because the process is mostly manual, remove repeated human execution before optimizing anything more sophisticated."
- `fragmented-tools`: "Because the work is split across tools, integration is part of the solution even if the visible problem appears elsewhere."
- `works-but-slow`: "Because the process already works, preserve the useful logic and automate the slowest repeated step first."
- `frequent-errors`: "Because mistakes or missed steps occur, reliability and explicit state matter as much as speed."

## GROW MODIFIERS
- `not-enough-demand`: "Your current constraint appears to begin before the customer enters the funnel."
- `leads-go-cold`: "There is already intent in the system; preserving that intent should come before generating more of it."
- `slow-response`: "The existing opportunity has a timing problem, so response latency deserves attention before additional acquisition."
- `low-conversion`: "Demand exists, which means the next useful question is where the decision path is breaking down."
- `weak-retention`: "The acquisition already happened; the unused opportunity is what occurs after the first transaction."

## BUILD MODIFIERS
- `idea`: "Because this is still an idea, reduce product uncertainty before investing heavily in architecture."
- `prototype`: "Because a prototype exists, the next step is deciding what must become reliable enough for real use."
- `existing-system`: "Because people already depend on the system, preserve continuity while changing the smallest responsible boundaries."
- `scaling`: "Because the product already works, focus on the constraint created by real usage rather than redesigning what is not limiting growth."

---

# 12. SECONDARY RELATION COPY

- `workflow-orchestration`: "Once the immediate task is reliable, the next leverage point is how work moves between people and systems."
- `communication-automation`: "The workflow becomes more valuable when routine customer communication no longer depends on manual follow-up."
- `admin-automation`: "The next opportunity is removing the manual movement of information around the workflow."
- `reporting-intelligence`: "Once execution is consistent, reporting can surface whether the process is actually improving."
- `internal-software`: "Custom software becomes useful only after the underlying workflow is clear enough to deserve its own interface."
- `demand-generation`: "Once the current funnel is working reliably, increasing qualified demand becomes more valuable."
- `response-conversion`: "The next leverage point is turning incoming intent into an immediate, useful response."
- `follow-up-system`: "Once the first interaction works, consistent follow-up protects the intent already created."
- `conversion-optimization`: "The next step is reducing friction between customer interest and the action you want them to take."
- `retention-system`: "Once acquisition is reliable, the next opportunity is deliberately designing what happens after the first transaction."
- `customer-product`: "The next opportunity is turning the underlying workflow into a focused customer-facing experience."
- `systems-integration`: "The surrounding systems need to exchange reliable state before adding more application complexity."
- `ai-product-feature`: "AI becomes useful after the product has a clearly bounded job where interpretation or generation creates measurable value."
- `product-modernization`: "Once the actual constraint is understood, the product can be modernized without replacing functioning parts unnecessarily."
- `learning-orientation`: "A concise mental model can make the deeper material easier to evaluate."
- `learning-guide`: "The next useful layer is a practical explanation that connects concepts to real decisions."
- `learning-toolkit`: "A working artifact can turn understanding into action faster than additional theory."
- `learning-briefing`: "Recurring filtering becomes useful once you know which developments actually matter to you."

---

# 13. DEFERRED OPPORTUNITY RULE

Under `LATER, IF IT EARNS ITS PLACE`, always display:
- short label
- exact text: `"Not a priority yet based on what you told us."`
Do NOT make it clickable.

The primary recommendation's own `NOT YET` block continues using its approved `avoidForNow`.

---

# 14. SOLUTION STAGE & PLACEHOLDER RULE

`solution` belongs to visual progress Stage 03 (`03 OPPORTUNITY`).
`04 PLAN` remains untouched.

Primary CTA on Opportunity screen is exactly:
`See how this would work →`

Clicking transitions stage to `'solution'`.

When `stage === 'solution'`, render exactly:
```text
SOLUTION

Let's make it concrete.

The interactive demonstration is the next part of this experience.
```
No CTA. No "← Back to opportunity" link. Ticket 004 owns demonstration navigation.

---

# 15. REVIEW CONTEXT SEMANTICS

`← Review context` must be a semantic `<button type="button">`.
It sets `stage = 'context'` without erasing answers.
ContextEngine displays its confirmed state.
Analytics emits `journey_context_reviewed` with `{ from: 'opportunity' }`.

---

# 16. ANALYTICS SPECIFICATION

- `journey_opportunity_viewed`:
  Payload: `{ intent, focus, situation, primaryOpportunity, secondaryOpportunity, deferredOpportunity }`
  Deduplicated against key `${intent}:${contextFocus}:${contextSituation}:${primary}`.
  Never include `freeformProblem`.
- `journey_opportunity_solution_started`:
  Payload: `{ primaryOpportunity }`
- `journey_context_reviewed`:
  Payload: `{ from: 'opportunity' }`
