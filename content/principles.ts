/**
 * What: The four architectural guardrails and operating principles.
 * Why: Forms Section 02 (How We Decide) of the homepage editorial manifesto;
 *      defines the engineering rules of engagement before recommending or building software.
 * How: Exported typed array of principles containing core thesis, in-practice scenario,
 *      studio guardrail rule, and telemetry metadata.
 * From Where: TheSkillCorner Manifesto & System Architecture, 2026-06.
 */

export interface Principle {
  number: string;
  tag: string;
  label: string;
  headline: string;
  thesis: string;
  inPractice: string;
  guardrail: string;
  iconName: "Target" | "Workflow" | "ShieldCheck" | "LineChart";
  metric: string;
  tags: readonly string[];
}

export const PRINCIPLES: readonly Principle[] = [
  {
    number: "01",
    tag: "TRIAGE",
    label: "START WITH THE BOTTLENECK",
    headline: "Fix what constrains the work, not what sounds clever.",
    thesis:
      "Most digital initiatives fail because they start with an exciting technology rather than an expensive operational constraint. We begin where revenue leaks, response times stall, or skilled attention gets drained.",
    inPractice:
      "If a dental clinic loses 10 hygiene slots a week to cancellations or a restaurant misses calls during peak dinner rush, solve that constraint first before touching back-office archiving.",
    guardrail:
      "Never build for hypothetical friction when verified operational drag already exists.",
    iconName: "Target",
    metric: "Direct Bottleneck Resolution",
    tags: ["BOTTLENECK ISOLATION", "NO SPECULATIVE SOFTWARE"],
  },
  {
    number: "02",
    tag: "INTEROPERABILITY",
    label: "KEEP WHAT ALREADY WORKS",
    headline: "Wire into existing tools. Avoid costly platform rewrites.",
    thesis:
      "Replacing software your team already knows introduces organizational friction you pay for twice. If your current POS, EMR, or practice management tool does its core job, we connect directly through webhooks and APIs.",
    inPractice:
      "We integrate with Toast, Jane, Clio, Dentrix, or QuickBooks without forcing staff into new interfaces. Your team stays in their familiar rhythm while the system runs quietly underneath.",
    guardrail: "New software must earn the operational complexity it introduces.",
    iconName: "Workflow",
    metric: "Zero Staff Retraining",
    tags: ["API & WEBHOOK INTEGRATION", "WORKFLOW PRESERVATION"],
  },
  {
    number: "03",
    tag: "DELEGATION",
    label: "AUTOMATE THE PREDICTABLE",
    headline: "Automate rules and handoffs. Keep human judgment sacred.",
    thesis:
      "Repetitive routing, appointment confirmations, intake transcription, and supplier drafting are ideal automation candidates. Nuanced clinical, legal, or guest-facing judgment stays with your experienced staff.",
    inPractice:
      "Two-way SMS scheduling, inventory reorders, and preliminary conflict scans execute in milliseconds. Any ambiguity or custom request escalates immediately to a human manager with full context.",
    guardrail: "Human-in-the-loop escalation on every edge case and exception.",
    iconName: "ShieldCheck",
    metric: "Human-in-the-Loop SLA",
    tags: ["DETERMINISTIC ROUTING", "EDGE-CASE ESCALATION"],
  },
  {
    number: "04",
    tag: "OBSERVABILITY",
    label: "MEASURE THE CHANGE",
    headline: "Measure return in returned hours and captured revenue.",
    thesis:
      "A system is only as good as the verifiable return it produces. We reject vanity metrics and vague efficiency claims in favor of hard operational numbers: hours returned to the floor, response speed, and error reduction.",
    inPractice:
      "Every deployment ships with transparent telemetry: live latency tracking, booking conversion rates, and hours saved per week. You see exactly what the system handled and what it returned.",
    guardrail: "If a system cannot prove its operational return, it should not exist.",
    iconName: "LineChart",
    metric: "Telemetry Instrumented",
    tags: ["HOURS RETURNED TRACKING", "HARD OPERATIONAL ROI"],
  },
];
