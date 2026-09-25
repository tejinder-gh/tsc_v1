"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Code2, Copy, Play, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EditorialDivider, SectionLabel } from "@/components/ui/editorial";
import { Magnetic } from "@/components/ui/MagneticButton";

interface SystemStudy {
  id: string;
  index: string;
  title: string;
  location: string;
  problem: string;
  system: string;
  expectedChange: string;
  diagramSteps: readonly {
    name: string;
    latency: string;
    subtext: string;
    telemetryPayload?: Record<string, string | number | boolean>;
  }[];
}

const SYSTEM_STUDIES: readonly SystemStudy[] = [
  {
    id: "restaurant",
    index: "01",
    title: "FAMILY RESTAURANT",
    location: "Mississauga",
    problem: "Phone went unanswered through every dinner rush; reservations went to voicemail.",
    system: "Voice intake → booking rules → reservation → exception sent to manager.",
    expectedChange: "30+ calls/month captured",
    diagramSteps: [
      {
        name: "INCOMING CALL",
        latency: "0ms",
        subtext: "Twilio voice gateway trigger",
        telemetryPayload: {
          event: "voice_call.inbound",
          gateway: "Twilio SIP Trunk v2.1",
          caller_origin: "+1 (905) 821-xxxx",
          tls_handshake: "ECDHE-RSA-AES128-GCM-SHA256",
          status: "connected",
        },
      },
      {
        name: "VOICE INTAKE & ASR",
        latency: "180ms",
        subtext: "Whisper speech-to-text model",
        telemetryPayload: {
          engine: "whisper-large-v3-turbo",
          asr_confidence: 0.984,
          detected_intent: "table_booking",
          chunk_window_ms: 160,
          party_size: 4,
          requested_time: "19:30 EDT",
        },
      },
      {
        name: "BOOKING RULES EVALUATION",
        latency: "42ms",
        subtext: "Table availability & cover check",
        telemetryPayload: {
          dining_room: "main_floor",
          active_covers: "84/102",
          table_assigned: "T-14",
          capacity_check: "passed",
          pacing_guardrail: "ok (<6 parties/15m)",
        },
      },
      {
        name: "RESERVATION COMMITTED",
        latency: "110ms",
        subtext: "Direct POS/Calendar write & SMS",
        telemetryPayload: {
          pos_integration: "Toast / 7shifts API",
          idempotency_key: "res_84920aef29b",
          database_write_ms: 22,
          sms_confirmation_dispatch: "queued_tw_msg_984",
          status: "committed",
        },
      },
      {
        name: "EXCEPTION TO MANAGER",
        latency: "65ms",
        subtext: "Staff push alert for party > 6",
        telemetryPayload: {
          rule_triggered: "party_size_exceeds_threshold",
          urgency: "standard_push",
          channel: "Slack / Operations Bot",
          wait_time_sla_sec: 45,
          escalation_active: false,
        },
      },
    ],
  },
  {
    id: "convenience",
    index: "02",
    title: "CONVENIENCE STORE",
    location: "East Toronto",
    problem: "Owner spent Sunday nights building supplier orders from memory and a notebook.",
    system:
      "Sales and stock data draft weekly orders for each supplier; owner approves via mobile.",
    expectedChange: "5 hrs/week back",
    diagramSteps: [
      {
        name: "WEEKLY ORDER TRIGGER",
        latency: "0ms",
        subtext: "Sunday 21:00 scheduled cron",
        telemetryPayload: {
          schedule: "cron(0 21 * * SUN)",
          worker_node: "tor-edge-worker-01",
          timezone: "America/Toronto",
          execution_id: "cron_94103fa",
        },
      },
      {
        name: "SALES & STOCK DATA SYNC",
        latency: "340ms",
        subtext: "POS velocity & reorder levels",
        telemetryPayload: {
          pos_source: "Lightspeed Retail API",
          sync_records_parsed: 1420,
          inventory_deficits_flagged: 38,
          turnover_velocity_score: 0.91,
        },
      },
      {
        name: "DRAFT SUPPLIER ORDERS",
        latency: "95ms",
        subtext: "Vendor SKU batch generation",
        telemetryPayload: {
          primary_vendor: "Sysco Canada",
          order_lines_compiled: 42,
          aggregate_invoice_est: "$4,280.50 CAD",
          budget_threshold_check: "passed",
        },
      },
      {
        name: "MOBILE SUMMARY DISPATCH",
        latency: "120ms",
        subtext: "Interactive WhatsApp digest",
        telemetryPayload: {
          channel: "WhatsApp Business API",
          template_id: "weekly_supplier_digest_v2",
          read_receipt: "delivered",
          action_tokens_issued: 3,
        },
      },
      {
        name: "ONE-TAP OWNER APPROVAL",
        latency: "50ms",
        subtext: "One-click webhook dispatch",
        telemetryPayload: {
          auth_signature: "hmac_sha256_verified",
          edi_orders_transmitted: 3,
          quickbooks_entry_id: "qb_po_2026_09",
          sync_status: "complete",
        },
      },
    ],
  },
  {
    id: "salon",
    index: "03",
    title: "HAIR SALON",
    location: "Two Locations",
    problem: "No-shows ran 4 to 6 per week per location; confirmation texts were sent by hand.",
    system:
      "Automated reminder ladder at 7 days, 24 hours, and 2 hours, with one-tap reschedule links.",
    expectedChange: "No-shows down roughly half",
    diagramSteps: [
      {
        name: "BOOKING SCHEDULED",
        latency: "0ms",
        subtext: "Client appointment created",
        telemetryPayload: {
          pos_provider: "Fresha / Mindbody REST API",
          service_code: "BALAYAGE_STYLE_T2",
          station_id: "CHAIR-04",
          deposit_secured: true,
        },
      },
      {
        name: "7-DAY ADVANCE NOTICE",
        latency: "80ms",
        subtext: "Preparation instructions sent",
        telemetryPayload: {
          pipeline_stage: "advance_prep",
          channel: "Transactional Email + Push",
          template_rendered: "salon_color_prep_v4",
          status: "delivered_open_tracked",
        },
      },
      {
        name: "24-HR SMS CONFIRMATION",
        latency: "95ms",
        subtext: "Two-way confirmation prompt",
        telemetryPayload: {
          carrier_sms_gateway: "Twilio Messaging Service",
          interactive_keywords: "YES/CHANGE/CANCEL",
          sentiment_classification: "positive",
          auto_response_time_ms: 48,
        },
      },
      {
        name: "2-HR WINDOW REMINDER",
        latency: "70ms",
        subtext: "Stylist station preparation",
        telemetryPayload: {
          geo_window_eta: "on_schedule",
          station_prep_alert: "station_04_ready",
          transit_delay_buffer_min: 15,
        },
      },
      {
        name: "ONE-TAP RESCHEDULE OR CONFIRM",
        latency: "35ms",
        subtext: "Automated slot reallocation",
        telemetryPayload: {
          confirmation_state: "confirmed",
          no_show_risk_model_score: 0.03,
          waitlist_cascade_state: "idle_standby",
          reschedule_token_ttl_hours: 48,
        },
      },
    ],
  },
  {
    id: "dental",
    index: "04",
    title: "DENTAL PRACTICE",
    location: "Etobicoke",
    problem: "Hygiene recalls went out by hand when staff had time, leaving 20+ open chair hours each week.",
    system: "Recall engine calculates hygiene due dates → 2-way SMS self-booking → calendar sync & insurance pre-check.",
    expectedChange: "28% more hygiene rebookings",
    diagramSteps: [
      {
        name: "RECALL COHORT COMPILED",
        latency: "0ms",
        subtext: "Nightly PMS schedule scan",
        telemetryPayload: {
          scan_schedule: "daily_at_06:00",
          pms_connector: "Dentrix Ascend / Tracker API",
          recall_eligibility_window: "6_months_due",
          patients_identified: 47,
          insurance_status: "active_coverage",
        },
      },
      {
        name: "SCHEDULE AVAILABILITY MATCH",
        latency: "140ms",
        subtext: "Chair & hygienist allocation",
        telemetryPayload: {
          operatory_type: "hygiene_chair_02_03",
          open_slots_next_14d: 38,
          slot_optimization: "fill_midday_gaps",
          pacing_buffer_min: 10,
        },
      },
      {
        name: "INTERACTIVE SMS RECALL",
        latency: "85ms",
        subtext: "Personalized secure self-booking link",
        telemetryPayload: {
          channel: "Twilio 10DLC Verified SMS",
          template_id: "hygiene_recall_due_v3",
          dispatch_batch_size: 47,
          click_through_rate: "34.2%",
          status: "delivered",
        },
      },
      {
        name: "APPOINTMENT COMMITTED",
        latency: "60ms",
        subtext: "Write back to PMS & provider roster",
        telemetryPayload: {
          pms_write_target: "operatory_03_hygiene",
          patient_id: "PT_98124_ETOB",
          procedure_code: "PROPHYLAXIS_ADULT_1110",
          conflict_check: "clean_no_overlap",
          state: "confirmed",
        },
      },
      {
        name: "INSURANCE PRE-CHECK QUEUED",
        latency: "45ms",
        subtext: "EDI 270 eligibility dispatch",
        telemetryPayload: {
          edi_transaction: "270_benefit_inquiry",
          payer: "Sun Life / Manulife Direct",
          benefit_precheck_status: "auto_verified",
          copay_estimate_cad: "$0.00 (100% preventive)",
          ready_for_intake: true,
        },
      },
    ],
  },
  {
    id: "legal",
    index: "05",
    title: "BOUTIQUE LAW FIRM",
    location: "Downtown Toronto",
    problem: "Evening and weekend inquiries waited until Monday; prospects retained other counsel first.",
    system: "24/7 inquiry intake → conflict-safe triage & screening → secure retainer consult booking.",
    expectedChange: "First response under 2 min",
    diagramSteps: [
      {
        name: "INQUIRY RECEIVED",
        latency: "0ms",
        subtext: "After-hours web form & phone trigger",
        telemetryPayload: {
          channel: "Secure Web Intake / RingCentral API",
          timestamp: "21:14:08 EDT",
          matter_category: "corporate_commercial_dispute",
          source: "referral_partner_landing",
          tls_version: "TLSv1.3",
        },
      },
      {
        name: "CONFLICT CHECK & TRIAGE",
        latency: "190ms",
        subtext: "Clio database party index search",
        telemetryPayload: {
          practice_management: "Clio Manage API v4",
          opposing_party_search: "adverse_party_hash_scan",
          preliminary_conflicts: 0,
          jurisdiction_verified: "Ontario Superior Court",
          triage_score: "high_intent_tier1",
        },
      },
      {
        name: "STRUCTURED MATTER SCREENING",
        latency: "115ms",
        subtext: "Automated qualification workflow",
        telemetryPayload: {
          practice_area: "shareholder_agreement_litigation",
          estimated_matter_value: "$150k - $300k CAD",
          limitation_period_flag: "non_urgent (>6mo)",
          client_documentation: "contract_uploaded_secure_vault",
        },
      },
      {
        name: "PARTNER CONSULT BOOKED",
        latency: "75ms",
        subtext: "Senior counsel calendar write & invite",
        telemetryPayload: {
          assigned_partner: "partner_litigation_lead",
          calendar_integration: "Microsoft 365 Exchange Online",
          consultation_format: "Secure Video Conference",
          consult_slot: "Tuesday 10:30 EDT",
          invite_sent: "verified_delivery",
        },
      },
      {
        name: "SECURE BRIEFING BRIEF DISPATCH",
        latency: "40ms",
        subtext: "Internal memo & preliminary checklist",
        telemetryPayload: {
          brief_generated: "matter_intake_memo_v2",
          internal_notification: "Slack #litigation-intake",
          audit_log_id: "audit_sec_99182",
          sla_response_time_sec: 78,
          status: "intake_complete",
        },
      },
    ],
  },
];

export function SystemStudies() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(2);
  const [isSimulating, setIsSimulating] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const activeStudy = SYSTEM_STUDIES[selectedIndex];

  // Run automated pipeline animation when simulation is triggered
  useEffect(() => {
    if (!isSimulating) return;

    let current = 0;
    setActiveStepIndex(0);

    const interval = setInterval(() => {
      current += 1;
      if (current >= activeStudy.diagramSteps.length) {
        setIsSimulating(false);
        setActiveStepIndex(activeStudy.diagramSteps.length - 1);
        clearInterval(interval);
      } else {
        setActiveStepIndex(current);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [isSimulating, activeStudy]);

  const handleStudyChange = (idx: number) => {
    setSelectedIndex(idx);
    setActiveStepIndex(SYSTEM_STUDIES[idx].diagramSteps.length - 1);
    setIsSimulating(false);
    setExpandedStep(null);
  };

  const handleCopyPayload = (
    e: React.MouseEvent,
    stepIdx: number,
    payload: Record<string, string | number | boolean>,
  ) => {
    e.stopPropagation();
    try {
      navigator.clipboard?.writeText(JSON.stringify(payload, null, 2));
      setCopiedStep(stepIdx);
      setTimeout(() => setCopiedStep(null), 1500);
    } catch {
      // ignore clipboard failures
    }
  };

  const triggerSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setExpandedStep(null);
  };

  return (
    <section
      aria-labelledby="system-studies-heading"
      className="bg-[var(--tsc-paper)] border-b border-[var(--tsc-line)] py-16 sm:py-20 lg:py-24 font-geist"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <SectionLabel className="mb-4">03 / SYSTEM STUDIES</SectionLabel>
          <h2
            id="system-studies-heading"
            className="text-[32px] sm:text-[44px] lg:text-[52px] font-bold leading-[1.04] tracking-[-0.03em] text-[var(--tsc-ink)]"
          >
            A few examples of where
            <br className="hidden sm:inline" /> small systems change the work.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--tsc-muted)] leading-relaxed">
            These are illustrative scenarios, not client case studies. The point is the shape of
            the problem: repetitive work, a clear trigger, and a system that handles the
            predictable part.
          </p>
          <div className="mt-6">

          </div>
        </div>

        {/* Desktop Layout: Asymmetric 7 / 5 Editorial Index */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-14 xl:gap-16 items-start">
          {/* Left Column: Interactive Editorial Rows (~7 cols) */}
          <div className="lg:col-span-7">
            <EditorialDivider />
            <div className="divide-y divide-[var(--tsc-line)]">
              {SYSTEM_STUDIES.map((study, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={study.id}
                    type="button"
                    onClick={() => handleStudyChange(idx)}
                    aria-pressed={isSelected}
                    className={`w-full group cursor-pointer py-6 transition-all duration-200 text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--tsc-action)] rounded-[6px] px-3.5 -mx-3.5 border-l-[3px] ${isSelected
                      ? "bg-white border-[var(--tsc-action)] shadow-[var(--shadow-warm-sm)]"
                      : "border-transparent hover:bg-white/60"
                      }`}
                  >
                    {/* Top Row: Index + Title + Location + Live Badge */}
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)]">
                          {study.index}
                        </span>
                        <h3 className="font-semibold text-base sm:text-lg text-[var(--tsc-ink)] tracking-tight">
                          {study.title}
                        </h3>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-[var(--tsc-signal)]/15 border border-[var(--tsc-signal)]/40 text-[10px] font-mono text-[var(--tsc-ink)] font-semibold uppercase tracking-wider">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--tsc-action)] animate-pulse" />
                            Active Pipeline
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs text-[var(--tsc-muted)]">
                        {study.location}
                      </span>
                    </div>

                    {/* Content Columns */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-[13px] leading-relaxed">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)] mb-1">
                          PROBLEM
                        </div>
                        <p className="text-[var(--tsc-ink)]/90">{study.problem}</p>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)] mb-1">
                          SYSTEM
                        </div>
                        <p className="text-[var(--tsc-ink)]/90">{study.system}</p>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)] mb-1">
                          EXPECTED CHANGE
                        </div>
                        <p className="font-semibold text-[var(--tsc-action)]">
                          {study.expectedChange}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {/* Section Footer: See more examples across industries */}
            <div className="mt-12 lg:mt-16 pt-8 border-t border-[var(--tsc-line)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="font-mono text-xs font-semibold tracking-wider text-[var(--tsc-muted)] uppercase">
                  SECTOR DIRECTORY &middot; 24 INDUSTRIES
                </div>
                <p className="text-sm text-[var(--tsc-muted)]">
                  Explore concrete systems tailored for local businesses and professional practices.
                </p>
              </div>
              <Link
                href="/industries"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--tsc-ink)] hover:text-[var(--tsc-action)] transition-colors group"
              >
                <span>See more examples</span>
                <span
                  className="font-mono transition-transform duration-150 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  &rarr;
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: Dynamic Living Flow Diagram (~5 cols) */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="rounded-[14px] border border-[var(--tsc-line)] bg-white p-6 lg:p-7 shadow-[var(--shadow-warm-md)] transition-all duration-300">
              <div className="flex items-center justify-between border-b border-[var(--tsc-line)] pb-3 text-xs font-mono text-[var(--tsc-muted)] uppercase">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--tsc-positive)] animate-pulse" />
                  <span className="tracking-wider text-[11px] font-semibold text-[var(--tsc-ink)]">
                    EXECUTION PIPELINE
                  </span>
                </div>

                {/* Simulation Control */}
                <Magnetic pullFactor={0.16}>
                  <button
                    type="button"
                    onClick={triggerSimulation}
                    disabled={isSimulating}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] hover:bg-[var(--tsc-paper)] text-[10px] font-mono uppercase text-[var(--tsc-ink)] transition-colors disabled:opacity-50 cursor-pointer shadow-[var(--shadow-warm-xs)]"
                  >
                    {isSimulating ? (
                      <>
                        <RotateCcw className="h-2.5 w-2.5 animate-spin text-[var(--tsc-action)]" />
                        <span>Running…</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-2.5 w-2.5 fill-current text-[var(--tsc-action)]" />
                        <span>Simulate Flow</span>
                      </>
                    )}
                  </button>
                </Magnetic>
              </div>

              {/* Animated Pipeline Nodes */}
              <div className="mt-6 space-y-3 font-mono">
                {activeStudy.diagramSteps.map((step, stepIdx) => {
                  const isLast = stepIdx === activeStudy.diagramSteps.length - 1;
                  const isCompleted = stepIdx < activeStepIndex;
                  const isCurrent = stepIdx === activeStepIndex;
                  const isExpanded = expandedStep === stepIdx;

                  return (
                    <div key={step.name} className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() => setExpandedStep(isExpanded ? null : stepIdx)}
                        className={`w-full text-left group/step flex items-start justify-between gap-3 p-2.5 rounded-[6px] border transition-all duration-300 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--tsc-action)] ${isCurrent
                          ? "border-[var(--tsc-action)] bg-[var(--tsc-surface)] shadow-[var(--shadow-warm-sm)]"
                          : isCompleted
                            ? "border-[var(--tsc-line)]/70 bg-white hover:border-[var(--tsc-ink)]/30"
                            : "border-transparent bg-transparent opacity-60 hover:opacity-100"
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] border text-[11px] font-bold transition-all duration-300 ${isCurrent
                              ? "border-[var(--tsc-action)] bg-[var(--tsc-action)] text-white"
                              : isCompleted
                                ? "border-[var(--tsc-positive)]/40 bg-[var(--tsc-positive)]/10 text-[var(--tsc-positive)]"
                                : "border-[var(--tsc-line)] bg-white text-[var(--tsc-muted)]"
                              }`}
                          >
                            {isCompleted ? (
                              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                            ) : (
                              stepIdx + 1
                            )}
                          </span>

                          <div>
                            <div
                              className={`text-xs font-semibold tracking-wide transition-colors ${isCurrent
                                ? "text-[var(--tsc-ink)]"
                                : isCompleted
                                  ? "text-[var(--tsc-ink)]/90"
                                  : "text-[var(--tsc-muted)]"
                                }`}
                            >
                              {step.name}
                            </div>
                            <div className="text-[10px] text-[var(--tsc-muted)] font-normal mt-0.5">
                              {step.subtext}
                            </div>
                          </div>
                        </div>

                        {/* Step Telemetry Status & Trace Trigger */}
                        <div className="text-right shrink-0 flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1.5">
                            {step.telemetryPayload && (
                              <span
                                className={`flex items-center gap-0.5 text-[9px] font-mono px-1 py-0.5 rounded transition-colors ${isExpanded
                                  ? "text-[var(--tsc-action)] bg-[var(--tsc-action)]/10 font-medium"
                                  : "text-[var(--tsc-muted)] group-hover/step:text-[var(--tsc-ink)]"
                                  }`}
                              >
                                <Code2 className="h-2.5 w-2.5" />
                                <span>{isExpanded ? "close" : "trace"}</span>
                              </span>
                            )}
                            <span
                              className={`inline-block text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${isCurrent
                                ? "text-[var(--tsc-action)] border-[var(--tsc-action)]/30 bg-[var(--tsc-action)]/5"
                                : isCompleted
                                  ? "text-[var(--tsc-positive)] border-[var(--tsc-positive)]/20 bg-green-50/50"
                                  : "text-[var(--tsc-muted)]/60 border-[var(--tsc-line)]/50"
                                }`}
                            >
                              {isCurrent ? "RUNNING" : isCompleted ? "PASS" : "IDLE"}
                            </span>
                          </div>
                          <div className="text-[9px] text-[var(--tsc-muted)] tabular-nums">
                            {step.latency}
                          </div>
                        </div>
                      </button>

                      {/* Expandable Technical Telemetry Inspector */}
                      <AnimatePresence>
                        {isExpanded && step.telemetryPayload && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <div className="rounded-[6px] border border-[var(--tsc-line)] bg-[#0C0F14] text-[#E2E8F0] p-3 text-[11px] font-mono shadow-inner my-1">
                              <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2 text-[10px] text-zinc-400">
                                <div className="flex items-center gap-1.5">
                                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--tsc-action)] animate-pulse" />
                                  <span className="uppercase tracking-wider font-semibold text-zinc-300">
                                    {"EVENT TRACE // "}
                                    {step.name}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    if (step.telemetryPayload) {
                                      handleCopyPayload(e, stepIdx, step.telemetryPayload);
                                    }
                                  }}
                                  className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white transition-colors px-1.5 py-0.5 rounded hover:bg-white/10 cursor-pointer"
                                  title="Copy JSON Payload"
                                >
                                  {copiedStep === stepIdx ? (
                                    <>
                                      <Check className="h-3 w-3 text-emerald-400" />
                                      <span className="text-emerald-400">Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="text-[10px] leading-relaxed text-zinc-300 overflow-x-auto whitespace-pre font-mono">
                                {JSON.stringify(step.telemetryPayload, null, 2)}
                              </pre>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {!isLast && (
                        <div
                          className="relative ml-5 h-3.5 w-px bg-[var(--tsc-line)]"
                          aria-hidden="true"
                        >
                          {isCurrent && (
                            <span className="absolute -left-[2px] top-0 h-1.5 w-1.5 rounded-full bg-[var(--tsc-action)] animate-ping" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Anticipated Outcome Bar */}
              <div className="mt-6 border-t border-[var(--tsc-line)] pt-4 flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-[var(--tsc-muted)] uppercase tracking-wider text-[11px] block">
                    ANTICIPATED OUTCOME
                  </span>
                  <span className="text-[10px] text-[var(--tsc-muted)]/80">
                    Engineered operational return
                  </span>
                </div>
                <span className="font-bold text-sm text-[var(--tsc-positive)] px-2.5 py-1 rounded bg-[var(--tsc-surface)] border border-[var(--tsc-line)]">
                  {activeStudy.expectedChange}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sequential Stream */}
        <div className="lg:hidden space-y-8">
          {SYSTEM_STUDIES.map((study) => (
            <div
              key={study.id}
              className="rounded-[12px] border border-[var(--tsc-line)] bg-white p-5 space-y-4 shadow-[var(--shadow-warm-sm)]"
            >
              {/* Header */}
              <div className="flex items-baseline justify-between border-b border-[var(--tsc-line)] pb-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs font-semibold text-[var(--tsc-muted)]">
                    {study.index}
                  </span>
                  <h3 className="font-semibold text-base text-[var(--tsc-ink)]">{study.title}</h3>
                </div>
                <span className="font-mono text-xs text-[var(--tsc-muted)]">{study.location}</span>
              </div>

              {/* Data Rows */}
              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)]">
                    PROBLEM
                  </div>
                  <p className="mt-0.5 text-[var(--tsc-ink)]">{study.problem}</p>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)]">
                    SYSTEM
                  </div>
                  <p className="mt-0.5 text-[var(--tsc-ink)]">{study.system}</p>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)]">
                    EXPECTED CHANGE
                  </div>
                  <p className="mt-0.5 font-semibold text-[var(--tsc-action)]">
                    {study.expectedChange}
                  </p>
                </div>
              </div>

              {/* Sequential Flow */}
              <div className="border-t border-[var(--tsc-line)] pt-3 font-mono text-[11px] space-y-2 text-[var(--tsc-muted)]">
                {study.diagramSteps.map((step, idx) => (
                  <div key={step.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-4 w-4 items-center justify-center rounded-[3px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] text-[9px] font-bold text-[var(--tsc-ink)]">
                        {idx + 1}
                      </span>
                      <span className="text-[var(--tsc-ink)] text-xs">{step.name}</span>
                    </div>
                    <span className="text-[10px] text-[var(--tsc-muted)]">{step.latency}</span>
                  </div>
                ))}
              </div>


            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
