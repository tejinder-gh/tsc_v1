/**
 * What: Canonical definitions, typed models, and deterministic copy maps for Stage 03 (Opportunity Diagnostic).
 * Why: Keeps diagnostic copy, secondary relation mappings, and rationale modifiers strongly typed and
 *      immutable, separated from UI branches (Ticket 003 §3, §6–12, docs/design/ticket-003-opportunity-diagnostic.md).
 * How: Readonly dictionaries with pure TypeScript types and strict runtime guarantees.
 */

import type { ContextSituation } from "./types";

export type OpportunityId =
  // Save Time
  | "communication-automation"
  | "admin-automation"
  | "scheduling-orchestration"
  | "reporting-intelligence"
  | "workflow-orchestration"

  // Grow
  | "demand-generation"
  | "response-conversion"
  | "follow-up-system"
  | "conversion-optimization"
  | "retention-system"

  // Build
  | "customer-product"
  | "internal-software"
  | "systems-integration"
  | "ai-product-feature"
  | "product-modernization"

  // Learn
  | "learning-orientation"
  | "learning-guide"
  | "learning-toolkit"
  | "learning-briefing";

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

export const STANDARDIZED_DEFERRED_REASON = "Not a priority yet based on what you told us.";

export const OPPORTUNITY_DEFINITIONS: Readonly<Record<OpportunityId, OpportunityDefinition>> = {
  // Save Time
  "communication-automation": {
    id: "communication-automation",
    title: "Automate the first response.",
    shortLabel: "Communication automation",
    outcome:
      "Handle routine calls, messages, enquiries, updates, and follow-ups without making a person the routing layer.",
    explanation:
      "Communication becomes expensive when every request requires someone to read, interpret, respond, and move information somewhere else. The highest-leverage first step is usually to automate the predictable part while preserving human escalation for exceptions.",
    evidence: [
      "Capture the request immediately.",
      "Resolve routine cases automatically.",
      "Escalate only when judgment is actually needed.",
    ],
    avoidForNow:
      "We would not start by building a general-purpose chatbot. Fix the specific communication workflow first.",
  },

  "admin-automation": {
    id: "admin-automation",
    title: "Remove the copying.",
    shortLabel: "Admin automation",
    outcome:
      "Move routine information between forms, inboxes, documents, spreadsheets, and business systems automatically.",
    explanation:
      "Repeated data entry is rarely a people problem. It is usually evidence that two systems or steps are not connected. Start by removing the repetitive movement of information before redesigning the entire operation.",
    evidence: [
      "Capture data once.",
      "Validate it at the boundary.",
      "Write it to the systems that actually need it.",
    ],
    avoidForNow:
      "We would not replace every existing tool just because the workflow is manual. Connect the useful systems first.",
  },

  "scheduling-orchestration": {
    id: "scheduling-orchestration",
    title: "Stop coordinating the predictable.",
    shortLabel: "Scheduling orchestration",
    outcome:
      "Let availability, reminders, confirmations, handoffs, and routine rescheduling move without manual coordination.",
    explanation:
      "Scheduling friction is often caused by small decisions being passed between people. The first opportunity is to make availability and workflow rules explicit so routine coordination happens automatically.",
    evidence: [
      "Expose real availability.",
      "Automate confirmations and reminders.",
      "Escalate conflicts instead of every booking.",
    ],
    avoidForNow:
      "We would not build custom scheduling software if an existing scheduling system already handles the core calendar logic.",
  },

  "reporting-intelligence": {
    id: "reporting-intelligence",
    title: "Make the report assemble itself.",
    shortLabel: "Reporting intelligence",
    outcome:
      "Collect recurring operational data automatically and turn it into a consistent view of what changed and what needs attention.",
    explanation:
      "If people repeatedly gather the same numbers, clean them, compare them, and distribute a report, the reporting process itself has become a workflow. Automate collection and normalization before adding sophisticated analytics.",
    evidence: [
      "Collect from source systems.",
      "Normalize the recurring metrics.",
      "Surface changes and exceptions.",
    ],
    avoidForNow:
      "We would not start with an elaborate BI platform if the underlying data collection is still inconsistent.",
  },

  "workflow-orchestration": {
    id: "workflow-orchestration",
    title: "Make the handoff explicit.",
    shortLabel: "Workflow orchestration",
    outcome:
      "Turn recurring internal handoffs into a visible workflow with clear rules, ownership, and automatic movement between systems.",
    explanation:
      "Internal friction often appears as people reminding one another, forwarding information, checking status, or manually deciding what happens next. The first opportunity is to model that workflow explicitly.",
    evidence: [
      "Define the trigger.",
      "Make ownership visible.",
      "Automate predictable transitions.",
    ],
    avoidForNow:
      "We would not build a large internal platform before proving that the workflow itself is stable enough to encode.",
  },

  // Grow
  "demand-generation": {
    id: "demand-generation",
    title: "Fix discovery before automation.",
    shortLabel: "Demand generation",
    outcome:
      "Create more qualified opportunities by improving where, why, and how the right audience discovers the business.",
    explanation:
      "Automation cannot compensate for insufficient demand. If the pipeline starts too small, the first job is to improve discovery, positioning, distribution, or acquisition before optimizing follow-up.",
    evidence: [
      "Clarify who should discover you.",
      "Strengthen the path that brings them in.",
      "Measure qualified demand rather than raw traffic.",
    ],
    avoidForNow:
      "We would not begin by automating nurture sequences for a pipeline that does not yet have enough qualified demand.",
  },

  "response-conversion": {
    id: "response-conversion",
    title: "Win the first few minutes.",
    shortLabel: "Response conversion",
    outcome:
      "Acknowledge and route new enquiries immediately instead of depending on someone noticing them.",
    explanation:
      "When customers already reach out, response latency becomes a conversion problem. The first opportunity is to remove waiting from the initial response and qualification step.",
    evidence: [
      "Capture every enquiry immediately.",
      "Acknowledge it without waiting for staff.",
      "Route qualified requests to the right next step.",
    ],
    avoidForNow:
      "We would not add more lead sources until the current enquiries are being handled reliably.",
  },

  "follow-up-system": {
    id: "follow-up-system",
    title: "Do not let intent disappear.",
    shortLabel: "Follow-up system",
    outcome:
      "Create a consistent follow-up sequence so interested prospects do not depend on someone's memory.",
    explanation:
      "If interest already exists, generating more leads may simply create more leakage. The highest-leverage step is to make follow-up systematic, timely, and context-aware.",
    evidence: [
      "Record the customer's current state.",
      "Trigger the next useful follow-up.",
      "Stop when the situation changes.",
    ],
    avoidForNow:
      "We would not increase advertising spend before fixing a follow-up process that is already losing existing demand.",
  },

  "conversion-optimization": {
    id: "conversion-optimization",
    title: "Reduce friction at the decision.",
    shortLabel: "Conversion optimization",
    outcome:
      "Improve the path between interest and action instead of simply sending more people into the same funnel.",
    explanation:
      "When traffic and leads already exist, the first question is what prevents the next step. Simplify the decision path and instrument where people stop before increasing acquisition volume.",
    evidence: [
      "Identify the drop-off point.",
      "Reduce unnecessary decisions.",
      "Make the next action unmistakable.",
    ],
    avoidForNow:
      "We would not add more channels until we understand why the existing audience is not converting.",
  },

  "retention-system": {
    id: "retention-system",
    title: "Design the second interaction.",
    shortLabel: "Retention system",
    outcome:
      "Create deliberate repeat-purchase, review, referral, or re-engagement moments after the first transaction.",
    explanation:
      "Retention rarely improves because someone remembers to contact customers later. The opportunity is to define what should happen after a successful customer interaction and make it repeatable.",
    evidence: [
      "Identify the right post-purchase moment.",
      "Trigger useful follow-up.",
      "Measure repeat behavior rather than activity.",
    ],
    avoidForNow:
      "We would not launch a complicated loyalty program before establishing a reliable basic retention loop.",
  },

  // Build
  "customer-product": {
    id: "customer-product",
    title: "Build the customer path, not just the interface.",
    shortLabel: "Customer product",
    outcome:
      "Create a focused digital experience around the customer's actual task: discover, decide, book, buy, submit, or manage.",
    explanation:
      "A polished interface is not enough. The first product decision is the customer journey the software must make easier.",
    evidence: [
      "Define the user's job.",
      "Remove unnecessary steps.",
      "Build the smallest complete journey.",
    ],
    avoidForNow:
      "We would not start by designing dozens of screens before the primary customer journey is clear.",
  },

  "internal-software": {
    id: "internal-software",
    title: "Build around the operation.",
    shortLabel: "Internal software",
    outcome:
      "Create purpose-built software where generic tools are forcing the team into workarounds, duplication, or fragile processes.",
    explanation:
      "An internal tool is valuable when the workflow is important and stable enough that adapting the business to generic software costs more than encoding the real process.",
    evidence: [
      "Model the actual workflow.",
      "Make state and ownership explicit.",
      "Automate the repetitive edges.",
    ],
    avoidForNow:
      "We would not custom-build what an inexpensive existing tool already solves adequately.",
  },

  "systems-integration": {
    id: "systems-integration",
    title: "Connect the systems before replacing them.",
    shortLabel: "Systems integration",
    outcome:
      "Move information and actions reliably between the tools already carrying the business.",
    explanation:
      "Many automation problems are really integration problems. Before introducing another platform, make the existing systems exchange the right information at the right time.",
    evidence: [
      "Define the source of truth.",
      "Define the event that triggers movement.",
      "Make failures visible instead of silent.",
    ],
    avoidForNow:
      "We would not introduce another platform simply to connect tools that already expose reliable integration points.",
  },

  "ai-product-feature": {
    id: "ai-product-feature",
    title: "Give AI one real job.",
    shortLabel: "AI product feature",
    outcome:
      "Use AI where interpretation, generation, classification, or reasoning materially improves the product behavior.",
    explanation:
      "AI is most useful when it owns a clearly bounded responsibility. Start with one job whose quality can be measured rather than making the entire product vaguely 'AI-powered.'",
    evidence: [
      "Define the decision or transformation.",
      "Define what good output means.",
      "Design the fallback when confidence is insufficient.",
    ],
    avoidForNow:
      "We would not begin with autonomous agents controlling critical workflows before the bounded task is reliable.",
  },

  "product-modernization": {
    id: "product-modernization",
    title: "Fix the constraint before rewriting the product.",
    shortLabel: "Product modernization",
    outcome:
      "Improve an existing system by identifying whether the real constraint is UX, architecture, reliability, delivery speed, or accumulated complexity.",
    explanation:
      "A rewrite is an expensive diagnosis. Existing products usually benefit more from identifying the actual bottleneck and replacing the smallest layer necessary.",
    evidence: [
      "Locate the constraint.",
      "Measure its operational cost.",
      "Replace the smallest responsible boundary.",
    ],
    avoidForNow:
      "We would not authorize a full rewrite merely because the current codebase feels old or unpleasant.",
  },

  // Learn
  "learning-orientation": {
    id: "learning-orientation",
    title: "Start with orientation.",
    shortLabel: "Learning orientation",
    outcome:
      "Get the important mental model first, then decide whether the subject deserves deeper attention.",
    explanation:
      "You asked for a quick answer. The useful thing here is not more content — it is identifying the few ideas that make the rest of the topic easier to understand.",
    evidence: [
      "Find the few concepts that explain the rest.",
      "Separate what matters now from what can wait.",
      "Leave knowing what, if anything, deserves deeper study.",
    ],
    avoidForNow:
      "We would not send you into a long course or a consulting conversation for a question that may need ten focused minutes.",
  },

  "learning-guide": {
    id: "learning-guide",
    title: "Learn by applying it.",
    shortLabel: "Practical guide",
    outcome:
      "Use a structured explanation built around a real implementation rather than disconnected theory.",
    explanation:
      "You want enough depth to use the subject. The best path is a guide that connects concepts directly to decisions and implementation.",
    evidence: [
      "Follow one practical path from idea to application.",
      "See the decisions behind the implementation.",
      "Finish with something you can use or adapt.",
    ],
    avoidForNow:
      "We would not bury the practical task under a large curriculum before you can build something useful.",
  },

  "learning-toolkit": {
    id: "learning-toolkit",
    title: "Start from something usable.",
    shortLabel: "Learning toolkit",
    outcome:
      "Use a template, tool, checklist, or working example as the entry point and learn the concepts through adaptation.",
    explanation:
      "You do not need more theory first. You need a useful artifact that exposes the important decisions while you work with it.",
    evidence: [
      "Start with a usable artifact.",
      "Adapt it to a real task.",
      "Learn the important decisions while working with it.",
    ],
    avoidForNow:
      "We would not make you consume a long guide before giving you the thing you came to use.",
  },

  "learning-briefing": {
    id: "learning-briefing",
    title: "Filter the noise.",
    shortLabel: "Ongoing briefings",
    outcome:
      "Receive a recurring, opinionated summary of meaningful developments instead of monitoring the entire topic yourself.",
    explanation:
      "The challenge with ongoing learning is not access to information. It is deciding what deserves attention. A briefing should perform that filtering.",
    evidence: [
      "Filter developments by practical significance.",
      "Explain why the meaningful changes matter.",
      "Ignore noise that does not change what you should do.",
    ],
    avoidForNow:
      "We would not turn this into another high-volume newsletter that simply summarizes whatever happened this week.",
  },
} as const;

export const SECONDARY_RELATION_COPY: Readonly<Partial<Record<OpportunityId, string>>> = {
  "workflow-orchestration":
    "Once the immediate task is reliable, the next leverage point is how work moves between people and systems.",
  "communication-automation":
    "The workflow becomes more valuable when routine customer communication no longer depends on manual follow-up.",
  "admin-automation":
    "The next opportunity is removing the manual movement of information around the workflow.",
  "reporting-intelligence":
    "Once execution is consistent, reporting can surface whether the process is actually improving.",
  "internal-software":
    "Custom software becomes useful only after the underlying workflow is clear enough to deserve its own interface.",
  "demand-generation":
    "Once the current funnel is working reliably, increasing qualified demand becomes more valuable.",
  "response-conversion":
    "The next leverage point is turning incoming intent into an immediate, useful response.",
  "follow-up-system":
    "Once the first interaction works, consistent follow-up protects the intent already created.",
  "conversion-optimization":
    "The next step is reducing friction between customer interest and the action you want them to take.",
  "retention-system":
    "Once acquisition is reliable, the next opportunity is deliberately designing what happens after the first transaction.",
  "customer-product":
    "The next opportunity is turning the underlying workflow into a focused customer-facing experience.",
  "systems-integration":
    "The surrounding systems need to exchange reliable state before adding more application complexity.",
  "ai-product-feature":
    "AI becomes useful after the product has a clearly bounded job where interpretation or generation creates measurable value.",
  "product-modernization":
    "Once the actual constraint is understood, the product can be modernized without replacing functioning parts unnecessarily.",
  "learning-orientation": "A concise mental model can make the deeper material easier to evaluate.",
  "learning-guide":
    "The next useful layer is a practical explanation that connects concepts to real decisions.",
  "learning-toolkit":
    "A working artifact can turn understanding into action faster than additional theory.",
  "learning-briefing":
    "Recurring filtering becomes useful once you know which developments actually matter to you.",
};

export const SITUATION_RATIONALE_MODIFIERS: Readonly<Record<ContextSituation, string>> = {
  // Save Time
  "mostly-manual":
    "Because the process is mostly manual, remove repeated human execution before optimizing anything more sophisticated.",
  "fragmented-tools":
    "Because the work is split across tools, integration is part of the solution even if the visible problem appears elsewhere.",
  "works-but-slow":
    "Because the process already works, preserve the useful logic and automate the slowest repeated step first.",
  "frequent-errors":
    "Because mistakes or missed steps occur, reliability and explicit state matter as much as speed.",

  // Grow
  "not-enough-demand":
    "Your current constraint appears to begin before the customer enters the funnel.",
  "leads-go-cold":
    "There is already intent in the system; preserving that intent should come before generating more of it.",
  "slow-response":
    "The existing opportunity has a timing problem, so response latency deserves attention before additional acquisition.",
  "low-conversion":
    "Demand exists, which means the next useful question is where the decision path is breaking down.",
  "weak-retention":
    "The acquisition already happened; the unused opportunity is what occurs after the first transaction.",

  // Build
  idea: "Because this is still an idea, reduce product uncertainty before investing heavily in architecture.",
  prototype:
    "Because a prototype exists, the next step is deciding what must become reliable enough for real use.",
  "existing-system":
    "Because people already depend on the system, preserve continuity while changing the smallest responsible boundaries.",
  scaling:
    "Because the product already works, focus on the constraint created by real usage rather than redesigning what is not limiting growth.",

  // Learn situations have their rationale embedded directly in their canonical explanation
  "quick-answer": "",
  "practical-guide": "",
  "templates-tools": "",
  "ongoing-briefings": "",
};

export const GROW_SITUATION_OPPORTUNITY: Readonly<
  Record<
    "not-enough-demand" | "leads-go-cold" | "slow-response" | "low-conversion" | "weak-retention",
    OpportunityId
  >
> = {
  "not-enough-demand": "demand-generation",
  "leads-go-cold": "follow-up-system",
  "slow-response": "response-conversion",
  "low-conversion": "conversion-optimization",
  "weak-retention": "retention-system",
};

export const LEARN_TOPIC_LABELS: Readonly<
  Record<"ai-automation" | "software-product" | "growth-marketing" | "operations-systems", string>
> = {
  "ai-automation": "AI & automation",
  "software-product": "Software & product",
  "growth-marketing": "Growth & marketing",
  "operations-systems": "Operations & systems",
};
