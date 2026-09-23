/**
 * What: Typed configuration and deterministic scenario models for Stage 03 Demonstration (Ticket 004).
 * Why: Makes Opportunity recommendations tangible through local, deterministic, LLM-free system simulations.
 * How: Strongly-typed readonly registries mapping all 19 canonical OpportunityIds to 4 reusable archetypes.
 */

import type { OpportunityId } from "./opportunity-config";

export type DemonstrationArchetype =
  | "pipeline-stream"
  | "decision-router"
  | "system-spec"
  | "educational-artifact";

export interface DemonstrationStep {
  id: string;
  phase: "INPUT" | "INTERPRETATION" | "BUSINESS RULE" | "SYSTEM ACTION" | "OUTCOME" | "EXCEPTION";
  title: string;
  description: string;
  annotation?: string;
  dataPayload?: Record<string, string | number | boolean | string[]>;
  statusTag?: string;
}

export interface DemonstrationScenario {
  id: string;
  name: string;
  description: string;
  isException?: boolean;
  steps: DemonstrationStep[];
  summaryOutcome: string;
}

export interface EducationalSection {
  id: string;
  title: string;
  badge: string;
  summary: string;
  bullets: string[];
  callout?: string;
}

export interface DemonstrationConfig {
  opportunityId: OpportunityId;
  archetype: DemonstrationArchetype;
  title: string;
  subtitle: string;
  systemBadge: string;
  scenarios: DemonstrationScenario[];
  educationalSections?: EducationalSection[];
}

export const DEMONSTRATION_DISCLAIMER =
  "SIMULATION / SYSTEM DEMONSTRATION — Illustrative deterministic model. No customer data or production performance is fabricated.";

// ---------------------------------------------------------------------------
// 1. PIPELINE STREAM ARCHETYPE CONFIGURATIONS
// ---------------------------------------------------------------------------

const COMMUNICATION_AUTOMATION_CONFIG: DemonstrationConfig = {
  opportunityId: "communication-automation",
  archetype: "pipeline-stream",
  title: "Inbound Communication Automation",
  subtitle: "Direct routing and structured intake without a human triage bottleneck.",
  systemBadge: "EVENT STREAM // INTAKE GATEWAY",
  scenarios: [
    {
      id: "standard-inbound",
      name: "Standard: Urgent Inbound Request",
      description: "Customer contacts practice during peak operational hours with clear intent.",
      isException: false,
      summaryOutcome:
        "Inquiry parsed, availability verified, and confirmation prepared for the visitor.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Inbound Message Ingest",
          description: "Customer SMS received on primary virtual routing line.",
          annotation: "Protocol: Webhook · Ingest: 09:14:02 EST",
          dataPayload: {
            channel: "SMS",
            caller_id: "+1-416-555-0144",
            raw_text: "Do you have availability for a consultation this Thursday afternoon?",
          },
          statusTag: "INGESTED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Intent & Entity Extraction",
          description: "System identifies intent, requested timeframe, and service domain.",
          annotation: "Deterministic Entity Parser v2.1",
          dataPayload: {
            intent: "consultation_booking",
            requested_window: "Thursday 13:00 - 17:00",
            urgency: "standard",
            classification: "clear",
          },
          statusTag: "PARSED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Availability & Buffer Evaluation",
          description: "Validates provider calendar, buffer thresholds, and booking rules.",
          annotation: "Rule: check_provider_schedule & min_buffer_30m",
          dataPayload: {
            matching_slot: "Thursday 14:30 EST",
            buffer_satisfied: true,
            provider_status: "AVAILABLE",
          },
          statusTag: "EVALUATED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Tentative Hold & Outbound Confirmation",
          description: "Slot reserved in calendar and interactive confirmation link generated.",
          annotation: "API: calendar.slots.hold · Dispatch: SMS",
          dataPayload: {
            hold_expires: "09:29:02 EST (15m window)",
            outbound_dispatch: "SMS response sent with direct one-tap reservation hold.",
          },
          statusTag: "COMMITTED",
        },
        {
          id: "step-5",
          phase: "OUTCOME",
          title: "Audit Log & State Update",
          description:
            "Operational record updated; staff dashboard notified without requiring manual intervention.",
          annotation: "Telemetry: illustrative run recorded",
          dataPayload: {
            audit_id: "tx_comm_9812",
            staff_action_required: false,
            status: "AWAITING_CLIENT_TAP",
          },
          statusTag: "COMPLETED",
        },
      ],
    },
    {
      id: "exception-ambiguous",
      name: "Exception: Ambiguous / Complex Request",
      description: "Customer sends multi-part message requiring manual human assessment.",
      isException: true,
      summaryOutcome:
        "Ambiguity detected; polite immediate acknowledgement sent while routing to staff queue.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Unstructured Inbound Query",
          description: "Incoming message contains mixed requests and unparsed constraints.",
          annotation: "Channel: Web Chat · Ingest: 11:22:15 EST",
          dataPayload: {
            raw_text:
              "I might need three teeth looked at or maybe dental surgery, plus my insurance is changing next week.",
          },
          statusTag: "INGESTED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Multi-Intent Analysis & Threshold Failure",
          description: "Classification engine detects multiple competing service categories.",
          annotation: "Rule: ambiguous classifications require triage fallback",
          dataPayload: {
            primary_intent: "clinical_inquiry",
            secondary_intent: "billing_insurance",
            automated_booking_allowed: false,
          },
          statusTag: "AMBIGUOUS",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Staff Escalation Routing",
          description:
            "Applies protocol for clinical queries: never auto-commit clinical diagnoses.",
          annotation: "Policy: Clinical Safe-Triage Rule #4",
          dataPayload: {
            escalate_to: "clinical_coordinator_queue",
            priority: "medium",
          },
          statusTag: "ROUTED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Immediate Warm Acknowledgment",
          description:
            "Informs visitor their query is in staff review and that a person will take the next step.",
          annotation: "Outbound SMS / Chat notification",
          dataPayload: {
            client_message:
              "We've received your inquiry. A clinical coordinator will review this before 1:00 PM.",
          },
          statusTag: "ACKNOWLEDGED",
        },
        {
          id: "step-5",
          phase: "EXCEPTION",
          title: "Triage Task Created on Internal Board",
          description:
            "Pre-structured ticket assigned to coordinator with extracted patient context.",
          annotation: "Ticket #T-4402 opened with client history attached",
          dataPayload: {
            ticket_id: "T-4402",
            staff_alert: "DISPATCHED",
          },
          statusTag: "ESCALATED",
        },
      ],
    },
  ],
};

const ADMIN_AUTOMATION_CONFIG: DemonstrationConfig = {
  opportunityId: "admin-automation",
  archetype: "pipeline-stream",
  title: "Structured Admin Automation",
  subtitle: "Eliminating manual rekeying, transcription, and file reconciliation.",
  systemBadge: "INGEST PIPELINE // SCHEMA NORMALIZER",
  scenarios: [
    {
      id: "standard-batch",
      name: "Standard: Batch Document Ingest",
      description: "Weekly contractor timesheet or invoice bundle processed and reconciled.",
      isException: false,
      summaryOutcome:
        "24 records normalized, matched against open purchase orders, and queued for approval.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Source Document Arrival",
          description: "Structured PDF invoice uploaded to secure intake bucket.",
          annotation: "Trigger: s3_object_created · Format: PDF/A",
          dataPayload: {
            file_name: "INV-2026-089.pdf",
            vendor_id: "VND-4019",
            file_size: "142 KB",
          },
          statusTag: "INGESTED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Deterministic Field Extraction",
          description:
            "Extracts line items, tax IDs, subtotal, and payment terms without hallucination.",
          annotation: "Schema Validator v1.4",
          dataPayload: {
            line_item_count: 3,
            subtotal_extracted: "$1,450.00",
            tax_calculated: "$188.50",
            total: "$1,638.50",
          },
          statusTag: "EXTRACTED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Three-Way Match Verification",
          description:
            "Cross-references invoice against internal Purchase Order and delivery receipt.",
          annotation: "Match Engine: PO-8812 vs Ingested Line Items",
          dataPayload: {
            matching_po: "PO-8812",
            variance_detected: "$0.00",
            approval_tier: "auto_eligible",
          },
          statusTag: "MATCHED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "ERP Ledger Entry Generation",
          description: "Draft transaction created in accounting system with digital asset linked.",
          annotation: "Ledger API: POST /accounts_payable/drafts",
          dataPayload: {
            journal_id: "JRN-99214",
            status: "DRAFT_PENDING_BATCH_SIGN",
          },
          statusTag: "RECORDED",
        },
        {
          id: "step-5",
          phase: "OUTCOME",
          title: "Reconciliation Summary",
          description: "Zero manual data entry required; vendor record marked clean.",
          annotation: "Illustrative deterministic execution path",
          dataPayload: {
            manual_entry_state: "removed from the routine path",
            manual_rekeying_required: false,
          },
          statusTag: "COMPLETED",
        },
      ],
    },
    {
      id: "exception-discrepancy",
      name: "Exception: Price Discrepancy Flag",
      description: "Line item total differs from authorized Purchase Order rate.",
      isException: true,
      summaryOutcome:
        "Variance caught before payment authorization; flagged with precise line discrepancy.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Vendor Invoice Ingest",
          description: "Invoice submitted with adjusted hourly rate.",
          annotation: "Source: Vendor email attachment",
          dataPayload: {
            invoice_num: "INV-9921",
            claimed_amount: "$3,200.00",
          },
          statusTag: "INGESTED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Field & Line Item Parsing",
          description: "Line item rate and quantity are parsed from the submitted record.",
          annotation: "Rate extracted: $160.00 / hr",
          dataPayload: {
            item: "Engineering contractor hours",
            billed_rate: 160,
          },
          statusTag: "EXTRACTED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Contract Rate Audit",
          description: "Contract table allows maximum rate of $140/hr for role tier.",
          annotation: "Rule: billed_rate <= contract_tier_max",
          dataPayload: {
            contract_max_rate: 140,
            rate_delta: "+$20.00 / hr",
            variance_amount: "$400.00",
          },
          statusTag: "FAILED_RULE",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Payment Hold Triggered",
          description:
            "Auto-approval halted; audit note generated with exact contract rate clause.",
          annotation: "Action: Lock Invoice & Notify Procurement",
          dataPayload: {
            hold_status: "RATE_VARIANCE_LOCK",
            notified_role: "procurement_lead",
          },
          statusTag: "LOCKED",
        },
        {
          id: "step-5",
          phase: "EXCEPTION",
          title: "Vendor Exception Notice Drafted",
          description: "Draft dispute notice prepared for manager review with one-click send.",
          annotation: "Audit Trail: Sec. 4.2 Rate Cap Violation",
          dataPayload: {
            draft_ready: true,
            human_action: "Review rate exception before release",
          },
          statusTag: "ESCALATED",
        },
      ],
    },
  ],
};

const SCHEDULING_ORCHESTRATION_CONFIG: DemonstrationConfig = {
  opportunityId: "scheduling-orchestration",
  archetype: "pipeline-stream",
  title: "Scheduling & Handoff Orchestration",
  subtitle: "Multi-party calendar synchronization with autonomous reminder ladders.",
  systemBadge: "COORDINATION ENGINE // LADDER SCHEDULER",
  scenarios: [
    {
      id: "standard-booking",
      name: "Standard: Multi-Step Appointment Ladder",
      description:
        "Client reserves session; system provisions preparation checklist and 3-stage reminders.",
      isException: false,
      summaryOutcome: "Booking synced across 2 provider calendars; reminder sequence scheduled.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Booking Request Received",
          description: "Client selects 60-minute intake session.",
          annotation: "Slot: Tuesday, Oct 14 at 10:00 AM",
          dataPayload: {
            service: "Initial Operational Assessment",
            duration: "60 mins",
            client_timezone: "America/Toronto",
          },
          statusTag: "RECEIVED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Prerequisite Check",
          description: "Determines required staff roles and preliminary documents needed.",
          annotation: "Requirements: Senior Engineer + Client Briefing",
          dataPayload: {
            staff_required: ["lead_consultant"],
            documents_required: ["pre_session_intake"],
          },
          statusTag: "VERIFIED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Ladder Timing Calculation",
          description:
            "Computes staggered notification milestones based on business day intervals.",
          annotation: "Ladder Rules: 72h email · 24h SMS · 2h reminder",
          dataPayload: {
            t_minus_72h: "Saturday 10:00 AM",
            t_minus_24h: "Monday 10:00 AM",
            t_minus_2h: "Tuesday 08:00 AM",
          },
          statusTag: "SCHEDULED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Calendar Holds & Meet Link Generation",
          description: "Events created with unique secure video link and contextual notes.",
          annotation: "API: Google Calendar & Cal.com webhook",
          dataPayload: {
            event_id: "evt_meet_0991",
            video_link_created: true,
          },
          statusTag: "COMMITTED",
        },
        {
          id: "step-5",
          phase: "OUTCOME",
          title: "Active Monitoring Ladder Engaged",
          description: "Client receives immediate confirmation with one-tap calendar add.",
          annotation: "No manual calendar upkeep required",
          dataPayload: {
            status: "CONFIRMED",
            no_show_protection: "ACTIVE",
          },
          statusTag: "COMPLETED",
        },
      ],
    },
    {
      id: "exception-conflict",
      name: "Exception: Emergency Staff Outage / Reschedule",
      description: "Assigned team member marks unavailable; system initiates smooth reassignment.",
      isException: true,
      summaryOutcome:
        "Reassigned to equivalent qualified consultant without losing appointment slot.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Calendar Outage Trigger",
          description: "Assigned specialist marks emergency block on operational calendar.",
          annotation: "Trigger: internal_calendar_block",
          dataPayload: {
            specialist: "Dr. A. Vance",
            impacted_slot: "Tuesday 10:00 AM",
          },
          statusTag: "TRIGGERED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Impact Assessment",
          description: "Identifies 1 client appointment affected by the block.",
          annotation: "Client: Markham Family Practice",
          dataPayload: {
            affected_appointments: 1,
            timing_state: "within the accepted booking window",
          },
          statusTag: "FLAGGED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Qualified Peer Fallback Rule",
          description:
            "Checks if a peer specialist with equivalent credential tier is open at identical slot.",
          annotation: "Rule: match_skill_matrix(tier=Senior)",
          dataPayload: {
            candidate_found: "Dr. M. Patel",
            skill_match: "100%",
            slot_available: true,
          },
          statusTag: "RESOLVED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Silent Calendar Reassignment",
          description: "Calendar invitation updated seamlessly; brief prep notes transferred.",
          annotation: "Internal update without alarming client",
          dataPayload: {
            reassigned: true,
            client_notified: "Staff schedule update notice",
          },
          statusTag: "UPDATED",
        },
        {
          id: "step-5",
          phase: "EXCEPTION",
          title: "Continuity Preserved",
          description:
            "Appointment preserved without cancellation or manual management scrambling.",
          annotation: "Illustrative transition completed without an exception",
          dataPayload: {
            appointment_status: "PRESERVED",
            manual_calls_avoided: 1,
          },
          statusTag: "COMPLETED",
        },
      ],
    },
  ],
};

const RESPONSE_CONVERSION_CONFIG: DemonstrationConfig = {
  opportunityId: "response-conversion",
  archetype: "pipeline-stream",
  title: "Speed-to-Lead Response System",
  subtitle: "Immediate qualification and response before prospects browse competitors.",
  systemBadge: "LEAD DISPATCH // SPEED CONVERTER",
  scenarios: [
    {
      id: "standard-lead",
      name: "Standard: High-Intent Inbound Lead",
      description: "Prospective buyer requests commercial project consultation on website.",
      isException: false,
      summaryOutcome:
        "Qualified enquiry receives a tailored acknowledgement and a clear next step.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Website Form Submission",
          description: "Commercial inquiry submitted on practice website.",
          annotation: "Source: Commercial Services Inquiry Form",
          dataPayload: {
            company: "Oakville Logistics Ltd",
            project_type: "Warehouse Automation",
            estimated_budget: "$25,000+",
          },
          statusTag: "RECEIVED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "ICP Scoring & Qualification",
          description: "Evaluates company size, commercial scope, and geography against criteria.",
          annotation: "Scoring: Tier A Commercial Account",
          dataPayload: {
            geography: "Ontario (GTA)",
            qualification_score: 94,
            routing_tier: "executive_partner",
          },
          statusTag: "QUALIFIED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Speed-to-Lead SLA Rule",
          description:
            "High-intent inquiries receive tailored outreach before the lead goes unattended.",
          annotation: "SLA Rule: <180s response required",
          dataPayload: {
            response_state: "prepared",
            template: "commercial_tailored_intake",
          },
          statusTag: "APPROVED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Contextual Outreach & VIP Booking Link",
          description: "Direct personalized email dispatched with relevant case example.",
          annotation: "Dispatch: Transactional Mail Relay",
          dataPayload: {
            recipient: "operations@oakvillelogistics.ca",
            case_study_attached: "distribution-center-dispatch",
          },
          statusTag: "DISPATCHED",
        },
        {
          id: "step-5",
          phase: "OUTCOME",
          title: "CRM Pipeline Updated & Partner Alerted",
          description:
            "Lead created in CRM with rich enrichment data; partner notified via mobile.",
          annotation: "CRM ID: deal_8812 · State: INTRO_DELIVERED",
          dataPayload: {
            pipeline_stage: "Initial Outreach Complete",
            staff_action_required: false,
          },
          statusTag: "COMPLETED",
        },
      ],
    },
    {
      id: "exception-out-of-scope",
      name: "Alternate: Unqualified / Consumer Inquiry",
      description: "Inquiry is outside core capability domain (e.g. residential DIY support).",
      isException: true,
      summaryOutcome:
        "Polite autonomous referral delivered immediately, preserving sales team focus.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Consumer Inquiry Received",
          description: "Request for residential consumer troubleshooting.",
          annotation: "Scope: Home appliance fix",
          dataPayload: {
            category: "Consumer Appliance",
            location: "Out of Service Area",
          },
          statusTag: "RECEIVED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Boundary Match Failure",
          description: "System identifies service domain mismatch with B2B commercial focus.",
          annotation: "Filter: commercial_b2b_only",
          dataPayload: {
            b2b_match: false,
            commercial_scope: false,
          },
          statusTag: "DISQUALIFIED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Polite Redirection Protocol",
          description: "Never leave an inquiry hanging; deliver polite self-serve resources.",
          annotation: "Policy: Respectful Redirection Rule",
          dataPayload: {
            action: "send_referral_directory",
          },
          statusTag: "EVALUATED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Helpful Directory Email Sent",
          description: "Automated response recommends verified regional consumer providers.",
          annotation: "Customer experience preserved",
          dataPayload: {
            delivery: "Immediate polite guidance",
          },
          statusTag: "DISPATCHED",
        },
        {
          id: "step-5",
          phase: "EXCEPTION",
          title: "Filtered from Sales Pipeline",
          description: "Lead archived to prevent sales team distraction.",
          annotation: "Sales team reviews only the qualified handoff",
          dataPayload: {
            pipeline_polluted: false,
            status: "RESPECTFULLY_ARCHIVED",
          },
          statusTag: "ARCHIVED",
        },
      ],
    },
  ],
};

const SYSTEMS_INTEGRATION_CONFIG: DemonstrationConfig = {
  opportunityId: "systems-integration",
  archetype: "pipeline-stream",
  title: "Bi-Directional Systems Integration",
  subtitle: "Bridging isolated SaaS platforms and databases with reliable event sync.",
  systemBadge: "INTEGRATION BRIDGE // RELAY ADAPTER",
  scenarios: [
    {
      id: "standard-sync",
      name: "Standard: Real-Time Webhook Relay",
      description:
        "Field service software completes job; syncs invoice to QuickBooks and inventory to ERP.",
      isException: false,
      summaryOutcome:
        "Normalized payload dispatched to 2 downstream systems with idempotent delivery.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Upstream Webhook Emitted",
          description: "Jobber marks work order #8491 'COMPLETED' in field.",
          annotation: "Event: work_order.completed",
          dataPayload: {
            work_order_id: "WO-8491",
            technician: "T. Kowalski",
            parts_used: ["Sensor-44", "Cable-10m"],
            labor_hours: 2.5,
          },
          statusTag: "INGESTED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Schema Translation & Validation",
          description: "Translates proprietary webhook payload into canonical system model.",
          annotation: "Zod Schema: WorkOrderCanonicalSchema",
          dataPayload: {
            canonical_id: "cw_8491",
            validation_passed: true,
          },
          statusTag: "NORMALIZED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Idempotency & Deduplication Check",
          description: "Ensures duplicate webhook emissions do not cause double billing.",
          annotation: "Check: key_exists(wo_8491_v1)",
          dataPayload: {
            previously_processed: false,
            lock_acquired: true,
          },
          statusTag: "VERIFIED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Parallel Fan-Out Dispatch",
          description:
            "Dispatches accounting invoice and updates warehouse stock levels simultaneously.",
          annotation: "Fan-out: QuickBooks API + Inventory ERP",
          dataPayload: {
            accounting_status: "201 Created (INV-4910)",
            inventory_status: "200 Updated (-1 Sensor, -10m Cable)",
          },
          statusTag: "COMMITTED",
        },
        {
          id: "step-5",
          phase: "OUTCOME",
          title: "Dual Sync Verified",
          description: "Both platforms reconcile their shared state without manual reconciliation.",
          annotation: "Audit ledger recorded",
          dataPayload: {
            sync_health: "HEALTHY",
            errors: 0,
          },
          statusTag: "COMPLETED",
        },
      ],
    },
    {
      id: "exception-downstream-retry",
      name: "Exception: Downstream API Outage with Exponential Backoff",
      description: "Accounting API returns 503 error; integration queues with exponential backoff.",
      isException: true,
      summaryOutcome:
        "Payload safely dead-letter queued and retried automatically without data loss.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Job Completion Event",
          description: "Work order completed in field.",
          annotation: "Event: work_order.completed",
          dataPayload: {
            job_id: "WO-9912",
          },
          statusTag: "INGESTED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Canonical Normalization",
          description: "Payload validated and prepared for accounting sync.",
          annotation: "Zod Validation: Passed",
          dataPayload: {
            amount: "$850.00",
          },
          statusTag: "VALIDATED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Dispatch Attempt & 503 Catch",
          description: "Accounting service endpoint temporarily unresponsive.",
          annotation: "HTTP 503 Service Unavailable",
          dataPayload: {
            http_status: 503,
            retryable: true,
          },
          statusTag: "RETRYABLE_ERROR",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Dead-Letter Queue & Backoff Policy",
          description: "Pushes job to durable queue with backoff: 30s, 2m, 10m.",
          annotation: "Queue: redis_retry_stream",
          dataPayload: {
            retry_count: 1,
            next_attempt: "after the configured retry window",
            data_loss_prevented: true,
          },
          statusTag: "QUEUED",
        },
        {
          id: "step-5",
          phase: "EXCEPTION",
          title: "Auto-Recovered on Retry",
          description:
            "Secondary attempt succeeds when the upstream system recovers; the exception is recorded.",
          annotation: "Succeeded at retry #2 (32s later)",
          dataPayload: {
            final_status: "SUCCESS_RECOVERED",
          },
          statusTag: "COMPLETED",
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// 2. DECISION ROUTER ARCHETYPE CONFIGURATIONS
// ---------------------------------------------------------------------------

const WORKFLOW_ORCHESTRATION_CONFIG: DemonstrationConfig = {
  opportunityId: "workflow-orchestration",
  archetype: "decision-router",
  title: "Multi-Stage Workflow Orchestration",
  subtitle: "Automating handoffs, stage dependencies, and accountability across roles.",
  systemBadge: "ORCHESTRATION ENGINE // STATE MACHINE",
  scenarios: [
    {
      id: "standard-handoff",
      name: "Standard: Seamless Role Handoff",
      description:
        "Intake form submitted -> compliance check -> specialist assignment -> client portal open.",
      isException: false,
      summaryOutcome: "Project workflow is provisioned with explicit ownership across departments.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "New Client Engagement Trigger",
          description: "Signed engagement letter received via electronic signature.",
          annotation: "Event: agreement.signed",
          dataPayload: {
            client: "Aurora Medical Group",
            service_tier: "Comprehensive Audit",
            value: "$18,000",
          },
          statusTag: "TRIGGERED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Dependency Graph Computation",
          description:
            "Identifies prerequisite sequence: KYC verification must precede billing setup.",
          annotation: "Engine: Directed Acyclic Graph (DAG)",
          dataPayload: {
            phase_1: "KYC & Conflict Check (Blocking)",
            phase_2: "Billing & Retainer Hold",
            phase_3: "Project Workspace Provisioning",
          },
          statusTag: "PLANNED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Role & Capacity Balancing Rule",
          description: "Checks team availability matrix for qualified engagement lead.",
          annotation: "Rule: specialist_workload < 80%",
          dataPayload: {
            assigned_lead: "Sarah Chen, P.Eng.",
            current_utilization: "62%",
          },
          statusTag: "ASSIGNED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Automated Environment Provisioning",
          description: "Shared workspace, secure folder structure, and client checklist created.",
          annotation: "API: Internal Vault & Project Hub",
          dataPayload: {
            workspace_id: "PRJ-AUR-2026",
            portal_access_sent: true,
          },
          statusTag: "COMMITTED",
        },
        {
          id: "step-5",
          phase: "OUTCOME",
          title: "Workflow Active & Auditable",
          description: "All three roles notified with respective action items and deadlines.",
          annotation: "Zero administrative onboarding delay",
          dataPayload: {
            active_stage: "PHASE_1_KYC",
            handoff_state: "ready for governed rollout",
          },
          statusTag: "COMPLETED",
        },
      ],
    },
    {
      id: "exception-sla-breach",
      name: "Exception: Stage SLA Exceeded Auto-Escalation",
      description:
        "Prerequisite task stalls; system detects delay and re-routes before client notices.",
      isException: true,
      summaryOutcome:
        "Bottleneck flagged; backup reviewer is assigned and the manager is notified.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Cron SLA Evaluation Tick",
          description: "Workflow monitor inspects active stages across all open projects.",
          annotation: "Cron: */15 * * * *",
          dataPayload: {
            task: "Document Compliance Review",
            queue_state: "waiting beyond the configured review window",
          },
          statusTag: "EVALUATED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "SLA Threshold Comparison",
          description: "Task has exceeded its configured review window and requires escalation.",
          annotation: "Rule: task_elapsed > sla_target (48h)",
          dataPayload: {
            target: "48h",
            actual: "52h",
            severity: "AMBER",
          },
          statusTag: "BREACH_DETECTED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Auto-Reassignment Matrix",
          description: "Primary reviewer unavailable; reassign to secondary compliance officer.",
          annotation: "Rule: auto_reroute_on_breach",
          dataPayload: {
            original_assignee: "Officer A",
            escalated_to: "Officer B (Senior)",
          },
          statusTag: "ROUTED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Notification & Priority Bump",
          description: "Task priority elevated to HIGH; alert posted to department channel.",
          annotation: "Dispatch: Internal notification",
          dataPayload: {
            priority_updated: "HIGH",
            slack_alert_sent: true,
          },
          statusTag: "DISPATCHED",
        },
        {
          id: "step-5",
          phase: "EXCEPTION",
          title: "SLA Recovery in Motion",
          description: "Project timeline preserved without client experiencing delivery slip.",
          annotation: "Audit logged to project record",
          dataPayload: {
            risk_mitigated: true,
          },
          statusTag: "RESOLVED",
        },
      ],
    },
  ],
};

const FOLLOW_UP_SYSTEM_CONFIG: DemonstrationConfig = {
  opportunityId: "follow-up-system",
  archetype: "decision-router",
  title: "Persistent Follow-Up System",
  subtitle:
    "Ensuring unclosed quotes and unresponsive leads receive structured multi-channel follow-up.",
  systemBadge: "PERSISTENCE LADDER // MILESTONE TRACKER",
  scenarios: [
    {
      id: "standard-ladder",
      name: "Standard: Unresponsive Quote Follow-Up Ladder",
      description:
        "Quote has not received a response; system evaluates client interaction signals.",
      isException: false,
      summaryOutcome:
        "Contextual nudge delivered referencing specific project scope, leading to proposal revisit.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Milestone Trigger: Day 5 No-Response",
          description: "Quote #Q-3021 sent 5 business days ago remains viewed but unapproved.",
          annotation: "Signal: quote_opened_count = 2",
          dataPayload: {
            quote_id: "Q-3021",
            amount: "$12,400",
            last_activity: "viewed without a response",
          },
          statusTag: "TRIGGERED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Signal Context Assessment",
          description: "Client opened the proposal twice but hasn't responded to initial email.",
          annotation: "Condition: high_interest_no_reply",
          dataPayload: {
            buyer_temperature: "ENGAGED_BUT_PAUSED",
            follow_up_tier: "Stage 2 Nudge",
          },
          statusTag: "CLASSIFIED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Timing & Frequency Restraint Rule",
          description:
            "Ensure no other marketing emails are active; send only relevant technical clarification.",
          annotation: "Rule: silence_marketing_during_active_quote",
          dataPayload: {
            marketing_suppressed: true,
            selected_template: "scope_clarification_prompt",
          },
          statusTag: "APPROVED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Tailored Executive Note Dispatched",
          description:
            "A short, helpful note offers a 10-minute scope Q&A rather than aggressive sales pitch.",
          annotation: "From: Lead Consultant",
          dataPayload: {
            subject: "Quick question regarding the warehouse timeline for Q-3021",
          },
          statusTag: "SENT",
        },
        {
          id: "step-5",
          phase: "OUTCOME",
          title: "Pipeline Status Maintained",
          description: "Quote prevented from going cold; response event listener primed.",
          annotation: "Next milestone scheduled: Day 10 if still silent",
          dataPayload: {
            deal_health: "ACTIVE",
          },
          statusTag: "COMPLETED",
        },
      ],
    },
    {
      id: "exception-opt-out",
      name: "Alternate: Client Declines or Postpones",
      description: "Client indicates project postponed to next quarter.",
      isException: true,
      summaryOutcome:
        "Immediate suppression of sales sequence and scheduling of polite long-term review.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Inbound Client Reply",
          description: "Client emails: 'We love this but our board froze capital until Q3.'",
          annotation: "Reply to follow-up note",
          dataPayload: {
            sentiment: "positive_postponed",
          },
          statusTag: "RECEIVED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Intent Parsing: Postponement",
          description: "Extracts target resumption window (Q3 2026).",
          annotation: "Entity: target_date = 2026-07-01",
          dataPayload: {
            status: "POSTPONED",
            resume_month: "July 2026",
          },
          statusTag: "PARSED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Immediate Sequence Suppression",
          description:
            "Halts all automated sales touches instantly to avoid spamming the prospect.",
          annotation: "Rule: halt_active_ladder_on_postpone",
          dataPayload: {
            active_ladder_cancelled: true,
          },
          statusTag: "SUPPRESSED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Future Reminder Scheduled",
          description: "Places warm check-in reminder on account manager's radar for late June.",
          annotation: "Task: Check in with Aurora regarding Q3 capital allocation",
          dataPayload: {
            remind_date: "2026-06-20",
          },
          statusTag: "SCHEDULED",
        },
        {
          id: "step-5",
          phase: "EXCEPTION",
          title: "Clean CRM State",
          description: "Relationship preserved with dignity and zero high-pressure sales spam.",
          annotation: "Account health: HIGH_RESPECT",
          dataPayload: {
            stage: "NURTURE_Q3",
          },
          statusTag: "COMPLETED",
        },
      ],
    },
  ],
};

const REPORTING_INTELLIGENCE_CONFIG: DemonstrationConfig = {
  opportunityId: "reporting-intelligence",
  archetype: "decision-router",
  title: "Automated Reporting Intelligence",
  subtitle: "Synthesizing disparate operational logs into actionable management summaries.",
  systemBadge: "ANALYTICS ENGINE // SYNTHESIS PIPELINE",
  scenarios: [
    {
      id: "standard-summary",
      name: "Standard: Monday Morning Executive Digest",
      description: "Aggregates operating, delivery, and pipeline signals across connected systems.",
      isException: false,
      summaryOutcome: "Unified executive brief is generated with the agreed anomaly checks.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Weekly Scheduled Trigger",
          description: "Weekly cron initiates data extraction from Stripe, Jira, and CRM.",
          annotation: "Cron: 0 06 * * 1",
          dataPayload: {
            sources: ["stripe", "jira", "hubspot", "warehouse_db"],
            period: "Last 7 Days",
          },
          statusTag: "EXTRACTING",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Metric Normalization & Aggregation",
          description: "Calculates agreed billing, delivery, and operating measures.",
          annotation: "Aggregator v3.0",
          dataPayload: {
            billing_signal: "available for comparison",
            delivery_signal: "available for comparison",
            cycle_signal: "available for comparison",
          },
          statusTag: "CALCULATED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Variance & Anomaly Scan",
          description: "Compares current measures against the agreed baseline.",
          annotation: "Rule: flag changes outside the agreed review band",
          dataPayload: {
            billing_variance: "within the review band",
            cycle_variance: "change surfaced for review",
            anomaly_state: "none in this illustration",
          },
          statusTag: "CLEAN",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Digest Compilation & PDF Generation",
          description: "Generates a concise human-readable brief with visual summary charts.",
          annotation: "Output: HTML & PDF Executive Digest",
          dataPayload: {
            delivered_to: "authorized leadership group",
          },
          statusTag: "GENERATED",
        },
        {
          id: "step-5",
          phase: "OUTCOME",
          title: "Zero Manual Assembly Required",
          description: "Removes the recurring manual spreadsheet assembly step.",
          annotation: "Delivered to inboxes at 06:02 AM",
          dataPayload: {
            reporting_state: "assembled automatically",
          },
          statusTag: "COMPLETED",
        },
      ],
    },
    {
      id: "exception-anomaly",
      name: "Exception: Anomaly Alert Triggered",
      description: "Sudden spike in customer cancellation requests flagged mid-week.",
      isException: true,
      summaryOutcome: "Immediate flash alert delivered to operational team with root-cause links.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Continuous Metric Monitor",
          description: "Log ingestion detects a cancellation pattern that merits review.",
          annotation: "Threshold: > 2 cancellations / 24h",
          dataPayload: {
            cancellations_detected: 4,
            normal_rate: "0.4 / day",
          },
          statusTag: "TRIGGERED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Common Factor Clustering",
          description: "All 4 cancellations linked to recent software update on service portal.",
          annotation: "Cluster Analysis: 100% correlation with Release v4.2",
          dataPayload: {
            root_cause_hypothesis: "Portal login failure post-release",
          },
          statusTag: "CLUSTERED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "High-Severity Alert Condition Met",
          description: "Severity classified as P1 Operational Warning.",
          annotation: "Policy: Customer Retention Warning Rule #1",
          dataPayload: {
            severity: "P1_ALERT",
            requires_immediate_ack: true,
          },
          statusTag: "ALERT_CONFIRMED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Flash Alert Broadcast",
          description: "Push notification dispatched to Product Manager and Customer Success lead.",
          annotation: "Dispatch: SMS + PagerDuty notification",
          dataPayload: {
            incident_id: "INC-8812",
          },
          statusTag: "BROADCAST",
        },
        {
          id: "step-5",
          phase: "EXCEPTION",
          title: "Early Containment Enabled",
          description: "Issue is surfaced for review before it is buried in a later report.",
          annotation: "Churn risk prevented",
          dataPayload: {
            escalation_state: "review requested",
          },
          statusTag: "CONTAINED",
        },
      ],
    },
  ],
};

const RETENTION_SYSTEM_CONFIG: DemonstrationConfig = {
  opportunityId: "retention-system",
  archetype: "decision-router",
  title: "Client Retention & Lifecycle System",
  subtitle:
    "Detecting declining engagement before customers churn, triggering timely interventions.",
  systemBadge: "LIFECYCLE ENGINE // RETENTION MONITOR",
  scenarios: [
    {
      id: "standard-retention",
      name: "Standard: Milestone Check-In Sequence",
      description: "Client passes 90-day mark; system triggers value delivery review.",
      isException: false,
      summaryOutcome:
        "Quarterly impact report generated and sent with request for honest feedback.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Lifecycle Milestone Reached",
          description: "Account marks Day 90 of continuous engagement.",
          annotation: "Trigger: account_age == 90d",
          dataPayload: {
            account: "Huron Dental Partners",
            plan: "Managed Practice Automation",
          },
          statusTag: "TRIGGERED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Quarterly Performance Compilation",
          description: "Collects the agreed call, booking, and availability signals for review.",
          annotation: "Data synthesis complete",
          dataPayload: {
            calls_handled: 184,
            measurement_state: "requires local baseline",
          },
          statusTag: "COMPILED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Account Health Classification",
          description: "Account health score evaluated at 96/100 (Strong).",
          annotation: "Criteria: usage_regularity & positive_feedback",
          dataPayload: {
            health_score: 96,
            tier: "CHURN_RISK_LOW",
          },
          statusTag: "HEALTHY",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Impact Summary Dispatched",
          description: "Delivers executive summary of work performed to practice owner.",
          annotation: "Outbound quarterly report",
          dataPayload: {
            subject: "Your 90-day systems summary at Huron Dental",
          },
          statusTag: "SENT",
        },
        {
          id: "step-5",
          phase: "OUTCOME",
          title: "Relationship Value Re-anchored",
          description: "Reinforces measurable return on investment before renewal window.",
          annotation: "Contract renewal probability elevated",
          dataPayload: {
            renewal_status: "STRONG",
          },
          statusTag: "COMPLETED",
        },
      ],
    },
    {
      id: "exception-inactivity",
      name: "Exception: Sudden Inactivity Drop Detected",
      description: "Key user login activity drops 75% in a two-week window.",
      isException: true,
      summaryOutcome:
        "Early churn risk detected; partner outreach task provisioned before contract lapse.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Telemetry Inactivity Trigger",
          description: "Account logins drop from 12/week to 2/week.",
          annotation: "Signal: rolling_14d_logins < threshold",
          dataPayload: {
            prior_activity: "12 logins/wk",
            current_activity: "2 logins/wk",
          },
          statusTag: "TRIGGERED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Root-Cause Diagnostic",
          description: "Detects key office manager changed, creating training gap.",
          annotation: "Profile update: new user email added",
          dataPayload: {
            hypothesis: "New staff member needs training",
          },
          statusTag: "CLASSIFIED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Proactive Support Protocol",
          description:
            "Never wait for customer to complain; offer proactive onboarding assistance.",
          annotation: "Rule: churn_prevention_offer_training",
          dataPayload: {
            action_type: "proactive_onboarding_call",
          },
          statusTag: "TRIGGERED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Support Lead Alert & Calendar Link",
          description:
            "Account lead prompted to reach out with personalized 'Need a refresher?' note.",
          annotation: "Task created for Client Success Manager",
          dataPayload: {
            action_deadline: "within the configured response window",
          },
          statusTag: "TASK_CREATED",
        },
        {
          id: "step-5",
          phase: "EXCEPTION",
          title: "Account Recovered",
          description: "New staff member onboarded; account returns to active engagement.",
          annotation: "Churn risk mitigated early",
          dataPayload: {
            health_restored: true,
          },
          statusTag: "RESOLVED",
        },
      ],
    },
  ],
};

const CONVERSION_OPTIMIZATION_CONFIG: DemonstrationConfig = {
  opportunityId: "conversion-optimization",
  archetype: "decision-router",
  title: "Funnel Conversion Optimization",
  subtitle: "Systematically removing friction points and drop-offs across customer journey stages.",
  systemBadge: "CONVERSION ENGINE // FUNNEL TRACKER",
  scenarios: [
    {
      id: "standard-optimization",
      name: "Standard: Drop-Off Friction Identification",
      description:
        "Analyzes 500 visitor sessions to isolate the single highest drop-off interaction.",
      isException: false,
      summaryOutcome:
        "Isolates friction to redundant phone number requirement on initial booking step.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Funnel Telemetry Stream",
          description: "Aggregated user step data collected across 500 booking sessions.",
          annotation: "Dataset: 500 intent sessions",
          dataPayload: {
            step_1_intent: "500 visitors (100%)",
            step_2_context: "410 visitors (82%)",
            step_3_booking: "160 visitors (32%)",
          },
          statusTag: "INGESTED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Bottleneck Node Isolation",
          description: "Drop-off is concentrated between Step 2 and Step 3 (50% drop).",
          annotation: "Analysis: 250 visitors abandon at field 'business_tax_id'",
          dataPayload: {
            culprit_field: "business_tax_id",
            friction_signal: "repeated exit before completion",
          },
          statusTag: "ISOLATED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Friction Removal Recommendation",
          description: "Move tax ID requirement to post-booking onboarding step.",
          annotation: "Rule: progressive_disclosure_best_practice",
          dataPayload: {
            proposed_change: "Remove field from intake; collect during agreement signing",
          },
          statusTag: "PLANNED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Streamlined Flow Simulation",
          description: "Tests simplified 2-step booking flow against baseline.",
          annotation: "Simulation: progressive disclosure flow",
          dataPayload: {
            form_fields_reduced: "From 6 to 3 fields",
          },
          statusTag: "SIMULATED",
        },
        {
          id: "step-5",
          phase: "OUTCOME",
          title: "Friction Eliminated",
          description: "Projected completion rate increases without compromising lead quality.",
          annotation: "Demonstration outcome verified",
          dataPayload: {
            projected_recovery: "40+ additional completed inquiries",
          },
          statusTag: "COMPLETED",
        },
      ],
    },
    {
      id: "alternate-mobile",
      name: "Alternate: Mobile Viewport Abandonment",
      description: "Session data shows mobile users abandoning due to desktop-first table layouts.",
      isException: true,
      summaryOutcome:
        "Identifies horizontal scroll overflow on mobile screens; converts to vertical card flow.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Device Segmentation Query",
          description: "Segmenting conversion rates by viewport width.",
          annotation: "Data: Mobile (<600px) vs Desktop (>1024px)",
          dataPayload: {
            desktop_conversion: "4.8%",
            mobile_conversion: "0.9%",
          },
          statusTag: "INGESTED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Layout Failure Inspection",
          description:
            "Wide comparison table causes 140px horizontal scroll on 390px mobile screens.",
          annotation: "CSS Check: overflow-x triggered on iPhone 14/15",
          dataPayload: {
            viewport_tested: "390px",
            content_width: "530px",
          },
          statusTag: "DIAGNOSED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Responsive Stacking Rule",
          description: "Replace horizontal table with stacked key-value pairs on mobile screens.",
          annotation: "Rule: mobile_first_single_column",
          dataPayload: {
            change: "Apply flex-col below 768px",
          },
          statusTag: "RULE_READY",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Mobile Layout Adaptation Applied",
          description: "Viewport verified with zero horizontal overflow.",
          annotation: "Audit: viewport_overflow == 0",
          dataPayload: {
            touch_targets: "All >= 48px",
          },
          statusTag: "VERIFIED",
        },
        {
          id: "step-5",
          phase: "EXCEPTION",
          title: "Mobile Parity Achieved",
          description:
            "Mobile visitors receive intentional layout tailored for handheld interaction.",
          annotation: "Clean responsive presentation",
          dataPayload: {
            mobile_parity: "RESTORED",
          },
          statusTag: "COMPLETED",
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// 3. SYSTEM SPEC ARCHETYPE CONFIGURATIONS
// ---------------------------------------------------------------------------

const CUSTOMER_PRODUCT_CONFIG: DemonstrationConfig = {
  opportunityId: "customer-product",
  archetype: "system-spec",
  title: "Client-Facing Software Architecture",
  subtitle: "Designing bespoke digital products that clients interact with directly.",
  systemBadge: "SYSTEM ARCHITECTURE // COMPONENT SPEC",
  scenarios: [
    {
      id: "architecture-overview",
      name: "Architecture: Tiered Multi-Tenant Platform",
      description: "Full-stack client portal architecture with role isolation and audit logging.",
      isException: false,
      summaryOutcome:
        "End-to-end architecture verified: Next.js edge frontend + Postgres Row-Level Security.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Client Interaction Layer",
          description:
            "Next.js App Router client interface with responsive typography and accessible components.",
          annotation: "Layer: Presentation Tier",
          dataPayload: {
            framework: "Next.js 16 + React 19",
            styling: "Tailwind CSS v4 Semantic Tokens",
            auth_provider: "Session Token / JWT",
          },
          statusTag: "LAYER_1",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "API Gateway & Boundary Enforcement",
          description:
            "Edge middleware validates session, rate limits per IP, and enforces tenant scoping.",
          annotation: "Layer: Boundary & Security",
          dataPayload: {
            rate_limit: "100 req / minute",
            schema_validation: "Zod strict schemas",
            tenant_isolation: "Enforced at gateway",
          },
          statusTag: "LAYER_2",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Business Logic Domain Core",
          description: "Pure domain services encapsulate business rules without vendor lock-in.",
          annotation: "Layer: Core Services",
          dataPayload: {
            state_management: "Deterministic finite state machine",
            side_effects: "Durable queue jobs",
          },
          statusTag: "LAYER_3",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Data Persistence & Row-Level Security",
          description:
            "Postgres database with tenant RLS guarantees zero cross-client data leakage.",
          annotation: "Layer: Persistence Tier",
          dataPayload: {
            database: "PostgreSQL 16",
            rls_enabled: true,
            encryption_at_rest: "AES-256",
          },
          statusTag: "LAYER_4",
        },
        {
          id: "step-5",
          phase: "OUTCOME",
          title: "Complete System Specification",
          description: "Ready for production implementation with documented API contracts.",
          annotation: "Maintainable, testable, proprietary asset",
          dataPayload: {
            architecture_status: "VERIFIED",
          },
          statusTag: "COMPLETED",
        },
      ],
    },
    {
      id: "architecture-offline",
      name: "Alternate: Offline-First Local Data Sync",
      description:
        "Mobile application functions fully offline with background sync upon reconnect.",
      isException: true,
      summaryOutcome:
        "Local SQLite database reconciles with central database using CRDT conflict resolution.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Field User Operates Offline",
          description: "Technician records job notes with zero cellular reception.",
          annotation: "Status: Network Offline",
          dataPayload: {
            network: "DISCONNECTED",
            local_store: "IndexedDB / SQLite",
          },
          statusTag: "OFFLINE",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Local Mutation Queueing",
          description: "Updates queued locally with deterministic timestamps.",
          annotation: "Queue: 4 pending mutations",
          dataPayload: {
            mutations_pending: 4,
          },
          statusTag: "QUEUED_LOCALLY",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Network Reconnection Event",
          description: "Device detects connection; triggers sync reconciliation.",
          annotation: "Trigger: window.ononline",
          dataPayload: {
            network: "RESTORED",
          },
          statusTag: "CONNECTING",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "CRDT Conflict Resolution",
          description:
            "Sync engine merges offline edits with server records without overwriting newer data.",
          annotation: "Algorithm: Last-Write-Wins with Entity Locking",
          dataPayload: {
            conflicts_resolved: 0,
            synced_records: 4,
          },
          statusTag: "SYNCED",
        },
        {
          id: "step-5",
          phase: "EXCEPTION",
          title: "Full Consistency Restored",
          description: "Central database updated without data loss or user disruption.",
          annotation: "Field reliability guaranteed",
          dataPayload: {
            sync_health: "CONSISTENT",
          },
          statusTag: "COMPLETED",
        },
      ],
    },
  ],
};

const INTERNAL_SOFTWARE_CONFIG: DemonstrationConfig = {
  opportunityId: "internal-software",
  archetype: "system-spec",
  title: "Custom Operational Software Spec",
  subtitle: "Internal tools tailored precisely to proprietary operating workflows.",
  systemBadge: "INTERNAL TOOLS // OPERATIONAL CONSOLE",
  scenarios: [
    {
      id: "operations-console",
      name: "Spec: Dispatch & Operations Console",
      description:
        "Custom operational dashboard replacing 5 spreadsheet tabs and manual SMS threads.",
      isException: false,
      summaryOutcome: "Unified operations console architecture providing single source of truth.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Operational Data Aggregation",
          description:
            "Integrates orders, staff rosters, and equipment availability onto one canvas.",
          annotation: "Single pane of glass interface",
          dataPayload: {
            active_crews: 6,
            open_work_orders: 14,
          },
          statusTag: "SPEC_INPUT",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Real-Time State Subscriptions",
          description:
            "WebSocket connection delivers live job status changes without page refreshes.",
          annotation: "Protocol: Secure WebSockets (WSS)",
          dataPayload: {
            response_state: "available",
            connection: "PERSISTENT",
          },
          statusTag: "REALTIME",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Permission & Authority Matrix",
          description:
            "Restricts sensitive financial data to managers while dispatchers view operational slots.",
          annotation: "RBAC: Role-Based Access Control",
          dataPayload: {
            roles_defined: ["Dispatcher", "Field Technician", "General Manager"],
          },
          statusTag: "SECURED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "One-Click Operational Actions",
          description:
            "Dispatch crews, adjust schedules, and generate customer alerts with one click.",
          annotation: "Atomic database transactions",
          dataPayload: {
            action_execution: "Instant optimistic UI with backend confirmation",
          },
          statusTag: "STREAMLINED",
        },
        {
          id: "step-5",
          phase: "OUTCOME",
          title: "Operational Velocity Multiplier",
          description: "Replaces fragmented manual coordination with reliable internal tooling.",
          annotation: "Proprietary software asset",
          dataPayload: {
            owner_action: "review only exceptions",
          },
          statusTag: "COMPLETED",
        },
      ],
    },
    {
      id: "audit-logging",
      name: "Spec: Immutable Audit Ledger",
      description:
        "Every modification tracked with user ID, timestamp, and previous state snapshot.",
      isException: true,
      summaryOutcome:
        "Complete compliance auditability for sensitive clinical or financial records.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Sensitive Field Modification",
          description: "Manager changes billing rate on historical project record.",
          annotation: "Event: record.update(billing_rate)",
          dataPayload: {
            old_value: "$120.00",
            new_value: "$140.00",
          },
          statusTag: "CAPTURED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Delta Extraction",
          description: "Computes JSON diff between previous record and updated record.",
          annotation: "Diff Engine: json_patch_v2",
          dataPayload: {
            modified_by: "user_usr_902",
            timestamp: "2026-09-22T20:15:00Z",
          },
          statusTag: "EXTRACTED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Audit Requirement Enforcement",
          description: "Financial fields require signed reason code before committing.",
          annotation: "Rule: financial_mod_requires_reason",
          dataPayload: {
            reason_provided: "Rate amendment per signed Addendum B",
          },
          statusTag: "VERIFIED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Append-Only Ledger Write",
          description:
            "Writes to immutable log table with cryptographically hashed previous entry.",
          annotation: "Storage: audit_log_append_only",
          dataPayload: {
            hash_chain_valid: true,
            tamper_proof: true,
          },
          statusTag: "COMMITTED",
        },
        {
          id: "step-5",
          phase: "EXCEPTION",
          title: "Compliance Verified",
          description: "Audit trail fully preserved for accounting or regulatory inspection.",
          annotation: "Zero ambiguous record disputes",
          dataPayload: {
            compliance_ready: true,
          },
          statusTag: "COMPLETED",
        },
      ],
    },
  ],
};

const AI_PRODUCT_FEATURE_CONFIG: DemonstrationConfig = {
  opportunityId: "ai-product-feature",
  archetype: "system-spec",
  title: "AI-Assisted Product Feature Spec",
  subtitle:
    "Narrow, bounded, deterministic AI capabilities integrated safely into existing software.",
  systemBadge: "AI BOUNDARY // TOOL CALL SPEC",
  scenarios: [
    {
      id: "bounded-ai",
      name: "Architecture: Guardrailed Tool-Calling Engine",
      description:
        "AI extracts unstructured user inputs into strict Zod schemas with zero hallucination.",
      isException: false,
      summaryOutcome: "AI bounded strictly to schema validation and structured tool calling.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Unstructured Natural Language Input",
          description:
            "User dictates field notes: 'Replaced fan belt on HVAC unit 3, tested at 45 PSI, runs quiet.'",
          annotation: "Input: raw_voice_transcript",
          dataPayload: {
            raw_text: "Replaced fan belt on HVAC unit 3, tested at 45 PSI, runs quiet.",
          },
          statusTag: "INPUT_RECEIVED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Strict Extraction Prompt & Function Calling",
          description: "Model given strict JSON schema with zero creative license.",
          annotation: "Temperature: 0.0 · Model: Claude / Anthropic Tool Call",
          dataPayload: {
            target_function: "record_work_order_completion",
            schema_enforced: true,
          },
          statusTag: "CALLING_TOOL",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Zod Runtime Schema Validation",
          description:
            "Extracted parameters validated against application TypeScript schemas before database hit.",
          annotation: "Layer: Application Boundary Guard",
          dataPayload: {
            equipment_id: "HVAC-UNIT-3",
            component: "fan_belt",
            psi_reading: 45,
            status: "OPERATIONAL",
          },
          statusTag: "SCHEMA_VALIDATED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Deterministic Database Insertion",
          description:
            "Standard SQL insert executed using validated types; no prompt text touches DB.",
          annotation: "Query: INSERT INTO maintenance_logs ...",
          dataPayload: {
            record_id: "ml_8892",
            created_at: "2026-09-22T20:18:00Z",
          },
          statusTag: "COMMITTED",
        },
        {
          id: "step-5",
          phase: "OUTCOME",
          title: "Safe, Bounded AI Utility",
          description:
            "Technician avoids duplicate typing while the database boundary remains strict.",
          annotation: "Zero hallucination risk",
          dataPayload: {
            integrity_guaranteed: true,
          },
          statusTag: "COMPLETED",
        },
      ],
    },
    {
      id: "ai-hallucination-rejection",
      name: "Exception: Schema Rejection & Human Fallback",
      description:
        "Model attempts to populate field not present in business schema; boundary catches it.",
      isException: true,
      summaryOutcome:
        "Invalid AI output blocked by boundary validator; prompts user for clarification.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Ambiguous Audio Input",
          description: "Technician speaks indistinctly with background machinery noise.",
          annotation: "Audio quality: Degraded",
          dataPayload: {
            raw_text: "Checked unit, might need something soon.",
          },
          statusTag: "INPUT_RECEIVED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Model Emits Speculative Data",
          description: "Model attempts to guess missing unit ID.",
          annotation: "Speculative guess detected",
          dataPayload: {
            guessed_unit: "HVAC-UNIT-1",
            classification_state: "insufficient evidence",
          },
          statusTag: "FLAGGED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Schema Gate Rejection",
          description: "Gate rejects any extraction that lacks the required evidence.",
          annotation: "Policy: Never guess operational equipment IDs",
          dataPayload: {
            gate_status: "REJECTED",
          },
          statusTag: "GATE_BLOCKED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Clarification Prompt Dispatched",
          description:
            "Interface immediately asks technician: 'Which unit did you inspect?' with one-tap list.",
          annotation: "Safe fallback interface",
          dataPayload: {
            prompt: "Please select unit inspected from list",
          },
          statusTag: "FALLBACK_PROMPTED",
        },
        {
          id: "step-5",
          phase: "EXCEPTION",
          title: "Data Integrity Preserved",
          description: "Database protected from speculative AI hallucinations.",
          annotation: "System correctness enforced",
          dataPayload: {
            database_corrupted: false,
          },
          statusTag: "SAFE",
        },
      ],
    },
  ],
};

const PRODUCT_MODERNIZATION_CONFIG: DemonstrationConfig = {
  opportunityId: "product-modernization",
  archetype: "system-spec",
  title: "Legacy Software Modernization Spec",
  subtitle: "Incrementally replacing aging monoliths with modern services without downtime.",
  systemBadge: "STRANGLER PATTERN // SERVICE BOUNDARY",
  scenarios: [
    {
      id: "strangler-pattern",
      name: "Architecture: Strangler Fig Migration Pattern",
      description:
        "Routing proxy intercepts legacy calls; serves modernized endpoints progressively.",
      isException: false,
      summaryOutcome:
        "New modern API takes 30% of traffic seamlessly while legacy backend continues running.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Legacy Client Request",
          description: "Client application calls /api/v1/orders/create.",
          annotation: "Target: Legacy On-Premise Monolith",
          dataPayload: {
            endpoint: "/api/v1/orders/create",
            client_version: "2018.4",
          },
          statusTag: "REQUEST_INGESTED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Reverse Proxy Route Inspection",
          description:
            "Edge proxy checks routing table: /orders is migrated to modern microservice.",
          annotation: "Proxy Rule: Path match /orders -> new_service",
          dataPayload: {
            route_target: "modern_next_service",
            legacy_fallback_available: true,
          },
          statusTag: "ROUTED_MODERN",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Dual-Write Data Sync Rule",
          description:
            "Writes to new Postgres schema first, then syncs backwards to legacy SQL Server.",
          annotation: "Pattern: Dual-write with shadow verification",
          dataPayload: {
            primary_write: "Postgres (Modern)",
            shadow_write: "SQL Server (Legacy)",
          },
          statusTag: "SYNCING",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "High-Performance Response",
          description:
            "Modern endpoint responds through the supported contract instead of a legacy adapter.",
          annotation: "Compatibility path selected",
          dataPayload: {
            transport: "supported endpoint",
            status: 200,
          },
          statusTag: "RESPONDED",
        },
        {
          id: "step-5",
          phase: "OUTCOME",
          title: "Migration Completion Demonstrated",
          description:
            "Legacy users experience instant performance lift with zero business interruption.",
          annotation: "Strangler pattern verified",
          dataPayload: {
            migration_state: "cutover complete",
          },
          statusTag: "COMPLETED",
        },
      ],
    },
    {
      id: "shadow-traffic-verification",
      name: "Alternate: Shadow Traffic Verification",
      description: "New service receives mirror copy of real production traffic to verify parity.",
      isException: true,
      summaryOutcome:
        "10,000 requests mirrored and verified with 100% parity before live switchover.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Production Traffic Mirrored",
          description: "Incoming live traffic cloned at proxy layer.",
          annotation: "Mirroring: 100% of /billing traffic",
          dataPayload: {
            mirrored_requests: 10000,
          },
          statusTag: "MIRRORED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Shadow Execution in Sandbox",
          description:
            "Modern service executes logic against staging database; ignores outbound side-effects.",
          annotation: "Mode: Read-only shadow",
          dataPayload: {
            side_effects_suppressed: true,
          },
          statusTag: "EXECUTING",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Parity Comparison Engine",
          description:
            "Compares legacy response payload with modern response payload byte-for-byte.",
          annotation: "Tolerance: Exact semantic equivalence",
          dataPayload: {
            matches: 10000,
            mismatches: 0,
          },
          statusTag: "PARITY_100%",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Verified Classification Committed",
          description: "System verifies modern service is safe for live promotion.",
          annotation: "Audit signed off by system",
          dataPayload: {
            safe_to_promote: true,
          },
          statusTag: "VERIFIED",
        },
        {
          id: "step-5",
          phase: "EXCEPTION",
          title: "Derisked Cutover Ready",
          description: "Engineering team switches traffic with proof of zero regressions.",
          annotation: "Zero business risk",
          dataPayload: {
            risk_level: "MINIMAL",
          },
          statusTag: "COMPLETED",
        },
      ],
    },
  ],
};

const DEMAND_GENERATION_CONFIG: DemonstrationConfig = {
  opportunityId: "demand-generation",
  archetype: "system-spec",
  title: "Systematic Demand Generation Pipeline",
  subtitle: "Engineering predictable customer discovery without relying on sporadic ad spend.",
  systemBadge: "DISCOVERY PIPELINE // AUDIENCE SYNC",
  scenarios: [
    {
      id: "content-asset-pipeline",
      name: "Architecture: Technical Asset Distribution Engine",
      description:
        "High-value regulatory or industry checklist distributed across search and industry channels.",
      isException: false,
      summaryOutcome: "Delivers qualified inbound interest directly to diagnostic tool.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Specialized Search Intent Ingest",
          description:
            "Business owner searches: 'Ontario commercial heating inspection regulations 2026'.",
          annotation: "Intent: High-value commercial compliance",
          dataPayload: {
            query: "Ontario commercial heating inspection regulations 2026",
            intent_tier: "RESEARCHING_COMPLIANCE",
          },
          statusTag: "SEARCH_CAPTURED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Canonical Asset Matching",
          description: "System matches search query to verified, authoritative regulatory guide.",
          annotation: "Resource: Ontario HVAC Compliance Blueprint v3",
          dataPayload: {
            matching_guide: "regulatory-hvac-ontario-2026",
          },
          statusTag: "ASSET_SERVED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Educational Diagnostic Invitation",
          description:
            "Rather than aggressive sales popup, offers practical 2-minute compliance self-assessment.",
          annotation: "Tone: Editorial studio guidance",
          dataPayload: {
            cta: "Run self-diagnostic check",
          },
          statusTag: "ENGAGED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Context Pre-Seeding into Journey",
          description:
            "Visitor arrives at The Skill Corner with regulatory context already understood.",
          annotation: "Pre-seeded intent: save-time / compliance",
          dataPayload: {
            friction_reduced: true,
          },
          statusTag: "SEEDED",
        },
        {
          id: "step-5",
          phase: "OUTCOME",
          title: "High-Intent Discovery Established",
          description: "Attracts serious commercial decision-makers searching for real answers.",
          annotation: "Organic, sustainable discovery pipeline",
          dataPayload: {
            ad_spend_required: "$0",
          },
          statusTag: "COMPLETED",
        },
      ],
    },
    {
      id: "syndication-engine",
      name: "Alternate: Weekly Industry Briefing Syndication",
      description: "Automated distribution of weekly industry briefs to verified subscriber list.",
      isException: true,
      summaryOutcome:
        "Briefing compiled, verified, and sent to 450 regional operators with 54% open rate.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Curated Briefing Release",
          description: "New weekly briefing published to library.",
          annotation: "Document: Tech Founder Briefing #42",
          dataPayload: {
            title: "Autonomous Agent Security Standards in Healthcare",
          },
          statusTag: "PUBLISHED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Subscriber Audience Filtering",
          description: "Segments subscribers by industry tag to prevent irrelevant notifications.",
          annotation: "Segment: Healthcare & Clinical Practice Owners",
          dataPayload: {
            targeted_recipients: 450,
          },
          statusTag: "SEGMENTED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Anti-Spam Frequency Cap Rule",
          description: "Limits email delivery to maximum 1 editorial briefing per week.",
          annotation: "Policy: Respect Subscriber Inboxes",
          dataPayload: {
            frequency_cap_satisfied: true,
          },
          statusTag: "APPROVED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Clean Plaintext-First Dispatch",
          description: "Delivers clean, legible briefing with zero marketing fluff.",
          annotation: "High deliverability, zero tracking bloat",
          dataPayload: {
            delivery_status: "100% delivered to inbox",
          },
          statusTag: "DISPATCHED",
        },
        {
          id: "step-5",
          phase: "EXCEPTION",
          title: "Sustained Editorial Trust",
          description: "High authority established without aggressive outbound sales pitching.",
          annotation: "Reputation-driven growth",
          dataPayload: {
            unsubscribes: 0,
          },
          statusTag: "COMPLETED",
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// 4. EDUCATIONAL ARTIFACT ARCHETYPE CONFIGURATIONS (LEARN PATHS)
// ---------------------------------------------------------------------------

const LEARNING_ORIENTATION_CONFIG: DemonstrationConfig = {
  opportunityId: "learning-orientation",
  archetype: "educational-artifact",
  title: "Executive Orientation Blueprint",
  subtitle:
    "A structured mental model of where automation creates real leverage vs. where it fails.",
  systemBadge: "EDUCATIONAL ARTIFACT // EXECUTIVE BLUEPRINT",
  scenarios: [
    {
      id: "orientation-curriculum",
      name: "Format: Executive Landscape Map",
      description:
        "The complete orientation structure designed for business owners new to automation.",
      isException: false,
      summaryOutcome: "Provides a clear framework to evaluate systems before spending capital.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Section 1: The Three Layers of Small Business Systems",
          description:
            "Differentiating between task automation, data orchestration, and custom software.",
          annotation: "Orientation Module 1",
          dataPayload: {
            reading_time: "8 mins",
            format: "Conceptual Framework",
          },
          statusTag: "FOUNDATION",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Section 2: What Works Now vs. What Fails",
          description:
            "Honest appraisal of current AI and automation capabilities; dispelling marketing hype.",
          annotation: "Orientation Module 2",
          dataPayload: {
            focus: "Boundary evaluation & failure modes",
          },
          statusTag: "TRUTHFULNESS",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Section 3: The 'Where to Start' Decision Rubric",
          description: "Five diagnostic questions to identify your highest-return starting point.",
          annotation: "Orientation Module 3",
          dataPayload: {
            tool: "Interactive Decision Matrix",
          },
          statusTag: "RUBRIC",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Section 4: Common Vendor Pitfalls to Avoid",
          description:
            "How to avoid vendor lock-in, recurring tool creep, and fragile no-code chains.",
          annotation: "Orientation Module 4",
          dataPayload: {
            guidance: "Vendor Independence Checklist",
          },
          statusTag: "PROTECTION",
        },
        {
          id: "step-5",
          phase: "OUTCOME",
          title: "Educational Outcome",
          description:
            "Walk away with an objective viewpoint and the exact questions to ask any provider.",
          annotation: "Non-sales educational blueprint",
          dataPayload: {
            deliverable: "Personalized Study Guide (PDF)",
          },
          statusTag: "READY",
        },
      ],
    },
    {
      id: "orientation-rubric",
      name: "Artifact: The 5-Point Feasibility Rubric",
      description: "A quick self-audit to determine if a workflow is ready for automation.",
      isException: true,
      summaryOutcome:
        "Score any internal process from 1–5 to prevent automating chaotic procedures.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Criterion 1: Rule Clarity",
          description:
            "Can the decision logic be written down without saying 'it depends on my mood'?",
          annotation: "Scoring: 1 to 5",
          dataPayload: {
            weight: "25%",
          },
          statusTag: "EVALUATED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Criterion 2: Input Cleanliness",
          description:
            "Is incoming data structured (forms, fields) or unpredictable (rambling voicemails)?",
          annotation: "Scoring: 1 to 5",
          dataPayload: {
            weight: "25%",
          },
          statusTag: "EVALUATED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Criterion 3: Error Tolerance",
          description:
            "What happens if a mistake occurs? Low risk (marketing note) vs High risk (clinical file).",
          annotation: "Scoring: 1 to 5",
          dataPayload: {
            weight: "20%",
          },
          statusTag: "EVALUATED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Criterion 4: Frequency & Volume",
          description: "Does this happen 5 times a day or 2 times a month?",
          annotation: "Scoring: 1 to 5",
          dataPayload: {
            weight: "15%",
          },
          statusTag: "EVALUATED",
        },
        {
          id: "step-5",
          phase: "EXCEPTION",
          title: "Total Score & Recommendation",
          description:
            "Scores > 18: Automate immediately. Scores < 14: Standardize manually first.",
          annotation: "Prevents wasted engineering spend",
          dataPayload: {
            decision: "Automate vs Standardize",
          },
          statusTag: "OUTCOME",
        },
      ],
    },
  ],
  educationalSections: [
    {
      id: "sec-1",
      title: "Core Foundation",
      badge: "LAYER 1",
      summary:
        "Understanding the difference between fragile point-to-point scripts and durable system architecture.",
      bullets: [
        "Why 5-tool Zapier chains break when one API changes",
        "How a single state database prevents duplicate executions",
        "The difference between customer-facing and back-office automation",
      ],
      callout:
        "Rule of thumb: If failure creates an immediate angry customer call, do not use no-code toys.",
    },
    {
      id: "sec-2",
      title: "Strategic Decision Rubric",
      badge: "DECISION TREE",
      summary:
        "How to prioritize internal candidate workflows before writing a single line of code.",
      bullets: [
        "Which small recurring tasks accumulate into meaningful operational drag?",
        "Separating deterministic rules from human judgment calls",
        "When to keep a human in the loop as the final verification step",
      ],
    },
    {
      id: "sec-3",
      title: "Avoiding Tool Fatigue",
      badge: "OPERATIONAL DISCIPLINE",
      summary:
        "Keeping your technology stack lean, predictable, and manageable without dedicated engineers.",
      bullets: [
        "Why adding a new SaaS subscription is rarely the right answer",
        "How to audit current software capabilities before buying new tools",
        "Designing systems your non-technical team can operate comfortably",
      ],
    },
  ],
};

const LEARNING_GUIDE_CONFIG: DemonstrationConfig = {
  opportunityId: "learning-guide",
  archetype: "educational-artifact",
  title: "Practical Implementation Blueprint",
  subtitle: "Step-by-step engineering guides with clear technical architectures and prerequisites.",
  systemBadge: "PRACTICAL GUIDE // IMPLEMENTATION SPEC",
  scenarios: [
    {
      id: "guide-overview",
      name: "Format: Engineering Blueprint Structure",
      description: "A complete technical walkthrough of building an automated intake gateway.",
      isException: false,
      summaryOutcome:
        "Detailed implementation sequence with code snippets, schemas, and verification tests.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Step 1: Ingest Webhook & Payload Definition",
          description:
            "Setting up a secure HTTPS webhook endpoint with cryptographic signature verification.",
          annotation: "Technical Specification",
          dataPayload: {
            code_sample: "verifyTwilioSignature(req)",
            schema: "TwilioInboundSchema",
          },
          statusTag: "SPEC_READY",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Step 2: Zod Schema Normalization Layer",
          description:
            "Normalizing heterogeneous provider webhooks into a clean internal domain type.",
          annotation: "Type Safety Guard",
          dataPayload: {
            type: "InboundMessageCanonical",
          },
          statusTag: "TYPED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Step 3: Business Hours & Routing FSM",
          description:
            "Writing pure, testable decision functions for open/closed hours and staff routing.",
          annotation: "Unit Testable Logic",
          dataPayload: {
            test_coverage: "100% pure function",
          },
          statusTag: "TESTED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Step 4: Dispatch & Outbound State Sync",
          description: "Connecting to SMS providers and CRM APIs with retry handling.",
          annotation: "Idempotency Guaranteed",
          dataPayload: {
            retry_strategy: "Exponential backoff",
          },
          statusTag: "CONNECTED",
        },
        {
          id: "step-5",
          phase: "OUTCOME",
          title: "Implementation Checklist Complete",
          description:
            "Full guide equips internal developers or trusted contractors to build correctly.",
          annotation: "Ready for development",
          dataPayload: {
            estimated_build_time: "12–16 engineering hours",
          },
          statusTag: "COMPLETED",
        },
      ],
    },
    {
      id: "guide-checklist",
      name: "Artifact: Production Readiness Checklist",
      description: "10-point inspection before launching any automation to real customers.",
      isException: true,
      summaryOutcome:
        "Comprehensive quality checklist covering privacy, failover, and rate limits.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Check 1: Secret Management",
          description:
            "Zero API keys hardcoded; all secrets loaded from secure runtime environment.",
          annotation: "Security Verification",
          dataPayload: {
            env_vars_isolated: true,
          },
          statusTag: "VERIFIED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Check 2: PII Privacy Scrubbing",
          description:
            "Sensitive customer data excluded from logs, error reports, and analytics payloads.",
          annotation: "Compliance Guard",
          dataPayload: {
            pii_in_logs: "NONE",
          },
          statusTag: "CLEAN",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Check 3: Rate Limiting & Abuse Protection",
          description: "Endpoints rate limited to prevent runaway costs or denial of service.",
          annotation: "Boundary Protection",
          dataPayload: {
            rate_limit_active: true,
          },
          statusTag: "ACTIVE",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Check 4: Graceful Degradation Fallback",
          description:
            "When APIs fail, polite human fallback message sent rather than silent error.",
          annotation: "Failure Handling",
          dataPayload: {
            fallback_tested: true,
          },
          statusTag: "TESTED",
        },
        {
          id: "step-5",
          phase: "EXCEPTION",
          title: "Check 5: Monitoring & Alert Thresholds",
          description:
            "Immediate alert triggered if error rate exceeds 2% in any 15-minute window.",
          annotation: "Operational Observability",
          dataPayload: {
            alerts_configured: true,
          },
          statusTag: "READY",
        },
      ],
    },
  ],
  educationalSections: [
    {
      id: "guide-sec-1",
      title: "Prerequisites & Stack Choices",
      badge: "ARCHITECTURE",
      summary:
        "Selecting technologies that minimize maintenance overhead and provide long-term stability.",
      bullets: [
        "Why standard TypeScript + Postgres outlasts proprietary low-code platforms",
        "Setting up local simulation environments before touching production",
        "Managing API credentials with strict read-only least-privilege roles",
      ],
    },
    {
      id: "guide-sec-2",
      title: "The Step-by-Step Implementation Sequence",
      badge: "EXECUTION",
      summary:
        "Follow a tested 4-step sequence from webhook setup to live production verification.",
      bullets: [
        "Phase 1: Ingestion and cryptographic signature verification",
        "Phase 2: Zod schema parsing and normalization",
        "Phase 3: Pure business rule logic (100% unit tested)",
        "Phase 4: Side effect execution with idempotency locks",
      ],
    },
  ],
};

const LEARNING_TOOLKIT_CONFIG: DemonstrationConfig = {
  opportunityId: "learning-toolkit",
  archetype: "educational-artifact",
  title: "Operator's Evaluation Toolkit",
  subtitle: "Rubrics, vendor evaluation scorecards, and cost/benefit models for business owners.",
  systemBadge: "TOOLKIT // EVALUATION SUITE",
  scenarios: [
    {
      id: "toolkit-scorecard",
      name: "Format: Vendor Audit Scorecard",
      description:
        "How to evaluate technology agencies, SaaS platforms, and consultants objectively.",
      isException: false,
      summaryOutcome:
        "Weighted evaluation scorecard scoring security, data portability, and contract lock-in.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Audit Category 1: Data Portability",
          description:
            "Can you export all raw historical data in standard CSV/JSON format at any time?",
          annotation: "Scoring Weight: 30%",
          dataPayload: {
            pass_criteria: "Automated daily export without paying export fees",
          },
          statusTag: "CRITICAL",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Audit Category 2: Proprietary IP Ownership",
          description:
            "Do you own the custom code, schemas, and configurations built for your business?",
          annotation: "Scoring Weight: 30%",
          dataPayload: {
            pass_criteria: "Full intellectual property assigned in written agreement",
          },
          statusTag: "CRITICAL",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Audit Category 3: SLA & Downtime Guarantees",
          description:
            "What financial remedies exist if the automation goes offline during business hours?",
          annotation: "Scoring Weight: 20%",
          dataPayload: {
            pass_criteria: "Clear SLA with credits for downtime exceeding 0.5%",
          },
          statusTag: "EVALUATED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Audit Category 4: Ongoing Maintenance Burden",
          description:
            "What recurring internal maintenance will this system realistically require?",
          annotation: "Scoring Weight: 20%",
          dataPayload: {
            pass_criteria: "Documented runbook with a reviewable upkeep plan",
          },
          statusTag: "EVALUATED",
        },
        {
          id: "step-5",
          phase: "OUTCOME",
          title: "Vendor Readiness Verdict",
          description: "Generate an objective scorecard before signing multi-year agreements.",
          annotation: "Protects business sovereignty",
          dataPayload: {
            toolkit_outcome: "Objective vendor ranking matrix ready",
          },
          statusTag: "COMPLETED",
        },
      ],
    },
    {
      id: "toolkit-roi",
      name: "Artifact: True Cost-of-Ownership Calculator",
      description:
        "Documenting implementation, maintenance, and tool-licensing costs before a decision.",
      isException: true,
      summaryOutcome: "Reveals hidden software seat licensing and API overage costs before commit.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Cost Factor 1: Initial Engineering & Setup",
          description: "One-time cost to design, build, test, and integrate the system.",
          annotation: "CapEx Assessment",
          dataPayload: {
            estimate_range: "obtain a supplier-specific estimate",
          },
          statusTag: "INPUT_RECORDED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Cost Factor 2: Recurring Platform Subscriptions",
          description: "Monthly tool costs (e.g. database hosting, messaging APIs, compute).",
          annotation: "OpEx Assessment",
          dataPayload: {
            estimate_range: "obtain a supplier-specific operating estimate",
          },
          statusTag: "CALCULATED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Cost Factor 3: Ongoing Upkeep & API Evolution",
          description: "Budgeting for API version deprecations and third-party schema shifts.",
          annotation: "Reserve Planning",
          dataPayload: {
            recommended_reserve: "define a documented change reserve",
          },
          statusTag: "BUDGETED",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Benefit Factor: Verified Operational Change",
          description: "Quantifying reclaimed management hours and captured missed calls.",
          annotation: "Value Equation",
          dataPayload: {
            recovery_basis: "measure locally before making a decision",
          },
          statusTag: "QUANTIFIED",
        },
        {
          id: "step-5",
          phase: "EXCEPTION",
          title: "Honest Payback Horizon",
          description:
            "Compare the measured operating cost against the change the team can verify.",
          annotation: "Realistic, unexaggerated financial projection",
          dataPayload: {
            payback_window: "not assumed; measure before deciding",
          },
          statusTag: "COMPLETED",
        },
      ],
    },
  ],
  educationalSections: [
    {
      id: "tool-sec-1",
      title: "Vendor Evaluation Checklist",
      badge: "CHECKLIST",
      summary: "Crucial questions to ask any developer or agency before signing a contract.",
      bullets: [
        "Who owns the Git repository and production deployment pipelines?",
        "What happens if an external API changes three months after launch?",
        "Are you locked into proprietary agency hosting or standard cloud infrastructure?",
      ],
    },
    {
      id: "tool-sec-2",
      title: "Build vs. Buy Matrix",
      badge: "DECISION AID",
      summary:
        "When to adopt an off-the-shelf SaaS tool vs. when to invest in proprietary automation.",
      bullets: [
        "Buy off-the-shelf for standard commodity functions (e.g. payroll processing)",
        "Build proprietary systems where your competitive advantage or unique workflow lives",
        "The hidden cost of forcing your business to fit rigid generic software",
      ],
    },
  ],
};

const LEARNING_BRIEFING_CONFIG: DemonstrationConfig = {
  opportunityId: "learning-briefing",
  archetype: "educational-artifact",
  title: "Executive Strategic Briefing",
  subtitle:
    "Curated intelligence on emerging automation and AI shifts relevant to business operators.",
  systemBadge: "BRIEFING // INTELLIGENCE DIGEST",
  scenarios: [
    {
      id: "briefing-sample",
      name: "Format: Quarterly Intelligence Briefing",
      description: "An unvarnished editorial analysis of current shifts in business technology.",
      isException: false,
      summaryOutcome:
        "Concise 6-minute executive briefing separating legitimate progress from promotional hype.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "Topic 1: Autonomous Agents in Customer-Facing Roles",
          description:
            "Where autonomous voice and chat agents work reliably today and where they risk brand damage.",
          annotation: "Signal vs Noise Analysis",
          dataPayload: {
            verdict: "Voice intake for appointments: VIABLE. Open-ended support: HIGH RISK.",
          },
          statusTag: "VERIFIED",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "Topic 2: The Demise of Fragile Multi-Tool Stacks",
          description:
            "Why businesses are consolidating away from 8-tool Zapier webs toward single-database systems.",
          annotation: "Industry Trend Analysis",
          dataPayload: {
            trend: "Consolidation toward standard TypeScript runtimes",
          },
          statusTag: "ANALYZED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Topic 3: Canadian Privacy & PIPEDA Compliance",
          description:
            "What small business owners must know about storing customer conversation records locally.",
          annotation: "Regulatory Assessment",
          dataPayload: {
            rule: "Canadian data residency best practices for customer records",
          },
          statusTag: "COMPLIANCE",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Topic 4: What We Would Build First",
          description:
            "Our current opinion on the highest-leverage system for regional operators this quarter.",
          annotation: "Actionable Recommendation",
          dataPayload: {
            recommendation: "Immediate first-response intake and calendar coordination",
          },
          statusTag: "OPINION",
        },
        {
          id: "step-5",
          phase: "OUTCOME",
          title: "Curated Perspective Gained",
          description:
            "Operator stays ahead of technology developments without reading 40 newsletters.",
          annotation: "Direct, truthful editorial judgment",
          dataPayload: {
            reading_time: "short briefing",
          },
          statusTag: "COMPLETED",
        },
      ],
    },
    {
      id: "briefing-deepdive",
      name: "Artifact: Deep Dive — Voice AI in Local Services",
      description:
        "A forensic analysis of voice intake reliability across 1,000 real-world customer calls.",
      isException: true,
      summaryOutcome:
        "Detailed failure-mode analysis revealing why 85% accuracy is unacceptable for clinical practices.",
      steps: [
        {
          id: "step-1",
          phase: "INPUT",
          title: "The 85% Accuracy Trap",
          description:
            "Why benchmark 'accuracy' numbers cited by vendors hide catastrophic edge cases.",
          annotation: "Forensic Analysis",
          dataPayload: {
            finding: "1 wrong reservation out of 10 causes severe customer friction",
          },
          statusTag: "CRITICAL",
        },
        {
          id: "step-2",
          phase: "INTERPRETATION",
          title: "The Proper Architecture: Constrained Triage",
          description:
            "Voice agent must only collect and confirm; never negotiate or improvise pricing.",
          annotation: "Architectural Rule",
          dataPayload: {
            rule: "Strict boundary constraints prevent embarrassing bot quotes",
          },
          statusTag: "ARCHITECTED",
        },
        {
          id: "step-3",
          phase: "BUSINESS RULE",
          title: "Immediate Human Escalation Trigger",
          description:
            "The moment a caller sounds frustrated or asks twice, escalate to human team instantly.",
          annotation: "Brand Protection Guard",
          dataPayload: {
            escalation_threshold: "2 unrecognized intents",
          },
          statusTag: "SAFEGUARD",
        },
        {
          id: "step-4",
          phase: "SYSTEM ACTION",
          title: "Operator Recommendation",
          description:
            "Deploy voice agents solely for routine after-hours capture with instant SMS follow-up.",
          annotation: "Pragmatic deployment",
          dataPayload: {
            recommended_posture: "Narrow, safe, and transparent",
          },
          statusTag: "RECOMMENDED",
        },
        {
          id: "step-5",
          phase: "EXCEPTION",
          title: "Honest Technology Posture",
          description: "The Skill Corner's commitment to telling business owners what NOT to buy.",
          annotation: "Integrity over vendor sales",
          dataPayload: {
            strategic_value: "HIGH",
          },
          statusTag: "COMPLETED",
        },
      ],
    },
  ],
  educationalSections: [
    {
      id: "brief-sec-1",
      title: "Signal vs. Hype",
      badge: "EDITORIAL REVIEW",
      summary:
        "Cutting through marketing promises to assess what technology actually delivers today.",
      bullets: [
        "Why 'Fully Autonomous Businesses' remain a venture capital fantasy",
        "The practical power of small, reliable, deterministic workflows",
        "Why business owners who master simple systems outperform those chasing trends",
      ],
    },
    {
      id: "brief-sec-2",
      title: "Regulatory & Compliance Realities",
      badge: "CANADIAN CONTEXT",
      summary: "Practical guidance on privacy regulations and customer data handling in Ontario.",
      bullets: [
        "Ensuring customer communication records meet privacy standards",
        "Avoiding cloud services that route customer voice data overseas unexpectedly",
        "Simple data retention rules that keep your business protected",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// 5. REGISTRY MAP ACROSS ALL 19 CANONICAL OPPORTUNITY IDS
// ---------------------------------------------------------------------------

export const DEMONSTRATION_REGISTRY: Readonly<Record<OpportunityId, DemonstrationConfig>> = {
  // Save Time (5)
  "communication-automation": COMMUNICATION_AUTOMATION_CONFIG,
  "admin-automation": ADMIN_AUTOMATION_CONFIG,
  "scheduling-orchestration": SCHEDULING_ORCHESTRATION_CONFIG,
  "reporting-intelligence": REPORTING_INTELLIGENCE_CONFIG,
  "workflow-orchestration": WORKFLOW_ORCHESTRATION_CONFIG,

  // Grow (5)
  "demand-generation": DEMAND_GENERATION_CONFIG,
  "response-conversion": RESPONSE_CONVERSION_CONFIG,
  "follow-up-system": FOLLOW_UP_SYSTEM_CONFIG,
  "conversion-optimization": CONVERSION_OPTIMIZATION_CONFIG,
  "retention-system": RETENTION_SYSTEM_CONFIG,

  // Build (5)
  "customer-product": CUSTOMER_PRODUCT_CONFIG,
  "internal-software": INTERNAL_SOFTWARE_CONFIG,
  "systems-integration": SYSTEMS_INTEGRATION_CONFIG,
  "ai-product-feature": AI_PRODUCT_FEATURE_CONFIG,
  "product-modernization": PRODUCT_MODERNIZATION_CONFIG,

  // Learn (4)
  "learning-orientation": LEARNING_ORIENTATION_CONFIG,
  "learning-guide": LEARNING_GUIDE_CONFIG,
  "learning-toolkit": LEARNING_TOOLKIT_CONFIG,
  "learning-briefing": LEARNING_BRIEFING_CONFIG,
};

export function getDemonstrationConfig(opportunityId: OpportunityId): DemonstrationConfig {
  const config = DEMONSTRATION_REGISTRY[opportunityId];
  if (!config) {
    throw new Error(`No demonstration configuration registered for opportunity: ${opportunityId}`);
  }
  return config;
}
