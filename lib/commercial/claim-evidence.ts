/**
 * Claim Evidence & Provenance Registry for The Skill Corner
 *
 * Strict Red-Team Invariants:
 * - If a quantitative claim has verifiable proof in production: keep verified-production with source, sample size, and date.
 * - If unsupported by empirical production data in repo: DOWNGRADE to illustrative or target.
 * - Never infer measured customer outcomes from illustrative marketing copy.
 * - Retain limitations, calculation methodology, and qualification text.
 */

import type { ClaimEvidence } from "./types";

export const CLAIM_REGISTRY: readonly ClaimEvidence[] = [
  {
    id: "claim_intake_paperwork_saved",
    claim: "Paperwork time reduction in clinical intake",
    evidenceType: "illustrative",
    qualificationText: "Illustrative operational scenario · Modeled workflow assumption",
    source:
      "Illustrative calculation assuming 25 monthly intakes at 30 minutes of manual handling each.",
    limitations:
      "Model calculation for scenario comparison; actual handling time depends on practice volume and existing intake software.",
  },
  {
    id: "claim_call_pickup_latency",
    claim: "Automated voice receptionist call pickup target",
    evidenceType: "target",
    qualificationText: "Engineering architecture target · Webhook dispatch pipeline",
    source: "Architecture specification for webhook ingestion and streaming SIP dispatch.",
    limitations:
      "Engineering target; live telephony connection latency depends on carrier call setup and network conditions.",
  },
  {
    id: "claim_quote_close_improvement",
    claim: "Trade contractor estimate follow-up turnaround",
    evidenceType: "illustrative",
    qualificationText: "Illustrative operational scenario · Modeled trade workflow",
    source: "Illustrative workflow model assuming automated same-day SMS follow-up on sent quotes.",
    limitations:
      "Model calculation; response and close rates depend on trade category, pricing competitiveness, and customer relationship.",
  },
  {
    id: "claim_hygiene_recall_rebookings",
    claim: "Lapsed patient recall outreach",
    evidenceType: "illustrative",
    qualificationText: "Illustrative operational scenario · Modeled patient re-engagement",
    source:
      "Illustrative operational model assuming automated 3-touch SMS sequence for unbooked hygiene intervals.",
    limitations:
      "Model scenario; rebooking outcomes depend on patient list recency and accurate contact details.",
  },
  {
    id: "claim_conflict_screening",
    claim: "Rule-based intake conflict matching",
    evidenceType: "illustrative",
    qualificationText:
      "Illustrative architectural pattern · Database query against declared parties",
    source: "Architecture design for indexed lookup against active and historical matter parties.",
    limitations:
      "Rule-based matching covers exact name and declared entity lookups; complex corporate affiliations require manual review.",
  },
  {
    id: "claim_system_study_trace",
    claim: "Multi-location practice workflow automation",
    evidenceType: "illustrative",
    qualificationText: "Illustrative architecture composite · Sample operational event flow",
    source:
      "Composite systems engineering blueprint modeling appointment, intake, and notification routing.",
    limitations:
      "Architectural blueprint showing simulated event sequences and integration schemas; not live client telemetry.",
  },
  {
    id: "claim_deterministic_extraction",
    claim: "Schema-invalid structured outputs fail closed before downstream execution",
    evidenceType: "verified-implementation",
    qualificationText: "Verified codebase implementation · Strict Zod runtime schema validation",
    measuredAt: "2026-09-28",
    source:
      "Skill Corner TypeScript Codebase (`relay/`, `lib/schemas.ts`, `lib/telemetry/validation.ts`) & Vitest test suite",
    limitations:
      "Validates schema shape and type boundaries; schema validity does not prove semantic factual correctness of source content.",
  },
  {
    id: "claim_turnaround_target",
    claim: "Standard automation deployment timeline",
    evidenceType: "target",
    qualificationText: "Operational target · Turnkey system deployment",
    source: "Skill Corner implementation delivery targets for standard automation packages.",
    limitations:
      "Delivery timeline target; contingent on client providing required third-party API credentials and scope confirmation.",
  },
];

export function getClaimEvidence(id: string): ClaimEvidence | undefined {
  return CLAIM_REGISTRY.find((c) => c.id === id);
}

export function formatClaimQualification(id: string): string {
  const claim = getClaimEvidence(id);
  if (!claim) return "";
  return claim.qualificationText;
}

export const CLAIM_EVIDENCE_REGISTRY = CLAIM_REGISTRY;
export const getClaimEvidenceById = getClaimEvidence;
