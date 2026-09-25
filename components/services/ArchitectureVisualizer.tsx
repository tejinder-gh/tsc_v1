"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cpu,
  FileCheck2,
  Play,
  Shield,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { PageEyebrow } from "@/components/public/PageEyebrow";
import { Magnetic } from "@/components/ui/MagneticButton";

type WorkflowMode = "automated" | "legacy";

interface PipelineStep {
  readonly id: string;
  readonly stepNumber: string;
  readonly name: string;
  readonly actor: string;
  readonly latency: string;
  readonly description: string;
  readonly failureRisk?: string;
  readonly guarantee?: string;
}

interface WorkflowScenario {
  readonly id: string;
  readonly title: string;
  readonly industry: string;
  readonly legacyTelemetry: {
    readonly latency: string;
    readonly touchpoints: string;
    readonly errorRate: string;
    readonly afterHours: string;
  };
  readonly automatedTelemetry: {
    readonly latency: string;
    readonly touchpoints: string;
    readonly errorRate: string;
    readonly afterHours: string;
  };
  readonly legacySteps: readonly PipelineStep[];
  readonly automatedSteps: readonly PipelineStep[];
}

const SCENARIOS: readonly WorkflowScenario[] = [
  {
    id: "booking",
    title: "Inbound Call to Appointment Booking",
    industry: "Clinic & Professional Practice",
    legacyTelemetry: {
      latency: "4 hours 15 min",
      touchpoints: "4 manual interruptions",
      errorRate: "12% typo / double-booking risk",
      afterHours: "0% (Voicemails drop off)",
    },
    automatedTelemetry: {
      latency: "1.8 seconds",
      touchpoints: "0 (human exception fallback only)",
      errorRate: "0% (Idempotent lock)",
      afterHours: "100% (24/7 instant booking)",
    },
    legacySteps: [
      {
        id: "l-book-1",
        stepNumber: "01",
        name: "Unanswered Call & Voicemail Drop",
        actor: "Front Desk Staff (Busy with walk-in)",
        latency: "+45 mins",
        description:
          "Caller reaches receptionist while desk is checking in a patient. Call rolls to voicemail. 35% of callers hang up and call a competing clinic.",
        failureRisk: "High inquiry abandonment",
      },
      {
        id: "l-book-2",
        stepNumber: "02",
        name: "Voicemail Transcription & Sticky Note",
        actor: "Receptionist (Between appointments)",
        latency: "+2.5 hours",
        description:
          "Staff listens to audio voicemail, writes caller's phone number on paper sticky note, frequently mishearing name spelling or callback digits.",
        failureRisk: "Illegible notes & lost phone numbers",
      },
      {
        id: "l-book-3",
        stepNumber: "03",
        name: "Phone Tag & Availability Ping-Pong",
        actor: "Staff & Patient (Multiple attempts)",
        latency: "+1.2 hours",
        description:
          "Staff calls back, patient is now in a meeting. 2 to 3 phone tag voicemails follow before confirming a viable open calendar chair.",
        failureRisk: "Chair remains empty for days",
      },
      {
        id: "l-book-4",
        stepNumber: "04",
        name: "Manual Calendar Entry & Paper Chart",
        actor: "Admin Desk (End of day rush)",
        latency: "+15 mins",
        description:
          "Typing patient information into practice management software at 5:30 PM. Typos in email addresses lead to missed confirmation reminders.",
        failureRisk: "Double-booking & no-shows",
      },
    ],
    automatedSteps: [
      {
        id: "a-book-1",
        stepNumber: "01",
        name: "Low-Latency Inbound Webhook",
        actor: "Twilio Media Stream &middot; Audio Ingest",
        latency: "180ms",
        description:
          "Inbound call picks up on Ring 1. Real-time speech stream extracts caller intent, appointment type, and preferred time window.",
        guarantee: "Sub-250ms voice buffer",
      },
      {
        id: "a-book-2",
        stepNumber: "02",
        name: "Deterministic Calendar Slot Lock",
        actor: "EHR API Gateway &middot; Jane / Dentrix",
        latency: "420ms",
        description:
          "Queries live chair availability directly. Reserves requested time slot with temporary 15-minute idempotency lock to prevent race conditions.",
        guarantee: "Zero double-booking",
      },
      {
        id: "a-book-3",
        stepNumber: "03",
        name: "Human Exception Triage Guardrail",
        actor: "Rules Engine &middot; Anomaly Detector",
        latency: "45ms",
        description:
          "Evaluates medical acuity and VIP status. If emergency symptoms detected, instantly transfers call to duty physician; otherwise proceeds.",
        guarantee: "100% emergency safety fallback",
      },
      {
        id: "a-book-4",
        stepNumber: "04",
        name: "Two-Way SMS Confirmation Relay",
        actor: "SMS Daemon &middot; Signed Verification",
        latency: "1.15s",
        description:
          "Sends caller calendar invite with one-tap reschedule link and digital medical intake form. Writes full event transcript to audit log.",
        guarantee: "Verified HMAC SHA-256 audit log",
      },
    ],
  },
  {
    id: "intake",
    title: "Client Document Intake & Verification",
    industry: "Legal & Accounting Advisory",
    legacyTelemetry: {
      latency: "8 business days",
      touchpoints: "6 back-and-forth emails",
      errorRate: "18% wrong year / missing pages",
      afterHours: "Manual reminder fatigue",
    },
    automatedTelemetry: {
      latency: "4 minutes",
      touchpoints: "0 (Client self-service validation)",
      errorRate: "0% (Instant OCR rejection)",
      afterHours: "Active 24/7 client portal",
    },
    legacySteps: [
      {
        id: "l-int-1",
        stepNumber: "01",
        name: "Static PDF Email Checklist",
        actor: "Case Associate / Junior Accountant",
        latency: "+1 business day",
        description:
          "Associate sends an email attachment with a 15-item bulleted list of required tax forms or identity documents.",
        failureRisk: "Client overwhelmed by wall of text",
      },
      {
        id: "l-int-2",
        stepNumber: "02",
        name: "Fragmented Attachments in Email",
        actor: "Client (Over several days)",
        latency: "+4 business days",
        description:
          "Client emails phone photos of documents across 4 separate email threads. Some files are blurry or cropped.",
        failureRisk: "Missing pages & unreadable scans",
      },
      {
        id: "l-int-3",
        stepNumber: "03",
        name: "Manual Inspection & Mismatched Years",
        actor: "Associate (Manual verification)",
        latency: "+2 business days",
        description:
          "Associate discovers on day 5 that the uploaded corporate tax return is for 2023 instead of 2024. Sends awkward follow-up email.",
        failureRisk: "Engagement stalled waiting on fixes",
      },
      {
        id: "l-int-4",
        stepNumber: "04",
        name: "Manual Folder Renaming & Local Server Save",
        actor: "Admin Staff",
        latency: "+1 business day",
        description:
          "Staff downloads attachments from inbox, renames files manually, and uploads to internal document drive without encryption metadata.",
        failureRisk: "Unencrypted email compliance hazard",
      },
    ],
    automatedSteps: [
      {
        id: "a-int-1",
        stepNumber: "01",
        name: "Dynamic Magic-Link Portal Ingest",
        actor: "Next.js Portal &middot; Encrypted Session",
        latency: "220ms",
        description:
          "Client receives personalized, passwordless magic link showing a real-time progress checklist of their specific required files.",
        guarantee: "Encrypted token authentication",
      },
      {
        id: "a-int-2",
        stepNumber: "02",
        name: "Client-Side Pre-Flight OCR & Validation",
        actor: "Vision Parser &middot; Document Classifier",
        latency: "1.4s",
        description:
          "Scans uploaded PDF or photo immediately. Verifies document header, filing year, and legibility before accepting upload.",
        guarantee: "Instant rejection of wrong tax year",
      },
      {
        id: "a-int-3",
        stepNumber: "03",
        name: "Automated Cadence Shutdown",
        actor: "Sequence Daemon &middot; State Tracker",
        latency: "90ms",
        description:
          "As soon as final item is uploaded, automatic follow-up reminders instantly shut off and lead partner receives a completion memo.",
        guarantee: "Zero unnecessary spam to client",
      },
      {
        id: "a-int-4",
        stepNumber: "04",
        name: "Direct Clio / DMS Vault Ingestion",
        actor: "S3 Vault &middot; Document Management API",
        latency: "850ms",
        description:
          "Stores sanitized documents in PHIPA/SOC2-compliant vault, tagged with matter ID, document classification, and tamper-proof hash.",
        guarantee: "Immutable SHA-256 audit manifest",
      },
    ],
  },
  {
    id: "dispatch",
    title: "Field Job Completion to Reconciled Payment",
    industry: "Field Trades & Commercial Contractors",
    legacyTelemetry: {
      latency: "16 days average",
      touchpoints: "5 administrative touchpoints",
      errorRate: "14% forgotten parts billing",
      afterHours: "Zero on-site payment capture",
    },
    automatedTelemetry: {
      latency: "3 minutes 20 sec",
      touchpoints: "0 (Tech taps complete, client taps pay)",
      errorRate: "0% (BOM locked before close)",
      afterHours: "Instant mobile Apple Pay / Interac",
    },
    legacySteps: [
      {
        id: "l-dis-1",
        stepNumber: "01",
        name: "Paper Work Order & Part Notes",
        actor: "Technician in Van (Jobsite)",
        latency: "+2 hours",
        description:
          "Tech scribbles parts used (valves, filters) on paper clipboard. Coffee stains or lost carbon copies cause billable items to slip through.",
        failureRisk: "Unbilled parts leakage ($120/job)",
      },
      {
        id: "l-dis-2",
        stepNumber: "02",
        name: "Friday Clipboard Drop-off at Office",
        actor: "Technician (End of week)",
        latency: "+4 days",
        description:
          "Tech drops physical clipboard off at headquarters on Friday afternoon. Sits in billing in-tray until Monday morning.",
        failureRisk: "Massive cash flow lag",
      },
      {
        id: "l-dis-3",
        stepNumber: "03",
        name: "Manual Invoice Drafting in QuickBooks",
        actor: "Bookkeeper (Deciphering handwriting)",
        latency: "+3 days",
        description:
          "Bookkeeper attempts to decipher technician's handwriting, re-enters part SKUs into QuickBooks, and emails PDF invoice to customer.",
        failureRisk: "Billing disputes from delayed invoices",
      },
      {
        id: "l-dis-4",
        stepNumber: "04",
        name: "Net-30 Invoice Waiting & Collections Calls",
        actor: "Office Admin (Chasing checks)",
        latency: "+9 days",
        description:
          "Customer doesn't open email invoice. 2 weeks pass before office calls asking for a credit card over the phone.",
        failureRisk: "Days Sales Outstanding (DSO) > 18 days",
      },
    ],
    automatedSteps: [
      {
        id: "a-dis-1",
        stepNumber: "01",
        name: "Mobile Completion & EXIF Timestamp",
        actor: "Technician PWA &middot; Photo Capture",
        latency: "350ms",
        description:
          "Tech snaps photo of completed installation. System tags photo with GPS coordinate, timestamp, and locks itemized parts bill of materials.",
        guarantee: "Verified visual proof of work",
      },
      {
        id: "a-dis-2",
        stepNumber: "02",
        name: "Dynamic Invoice Generation Relay",
        actor: "Billing Engine &middot; Tax Rules Ingest",
        latency: "410ms",
        description:
          "Calculates local sales tax, deducts initial deposit, applies contractor discount, and formats branded PDF invoice automatically.",
        guarantee: "Zero math or SKU pricing errors",
      },
      {
        id: "a-dis-3",
        stepNumber: "03",
        name: "Instant SMS Payment Link (Apple Pay)",
        actor: "Stripe Connect &middot; Twilio SMS",
        latency: "1.2s",
        description:
          "Customer's phone buzzes before tech pulls out of driveway: 'Job complete. Review photos & pay with Apple Pay.' 74% pay on-site.",
        guarantee: "Frictionless one-tap payment",
      },
      {
        id: "a-dis-4",
        stepNumber: "04",
        name: "QuickBooks Auto-Reconciliation & Receipt",
        actor: "QBO Webhook &middot; Ledger Daemon",
        latency: "1.2s",
        description:
          "Reconciles payment against ledger, deposits funds to operating account, updates inventory stock, and sends tax receipt to customer.",
        guarantee: "Real-time ledger reconciliation",
      },
    ],
  },
];

export function ArchitectureVisualizer() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("booking");
  const [mode, setMode] = useState<WorkflowMode>("automated");
  const [simulating, setSimulating] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);

  const scenario = SCENARIOS.find((s) => s.id === selectedScenarioId) ?? SCENARIOS[0];
  const steps = mode === "automated" ? scenario.automatedSteps : scenario.legacySteps;
  const telemetry = mode === "automated" ? scenario.automatedTelemetry : scenario.legacyTelemetry;

  const handleSimulate = () => {
    if (simulating) return;
    setSimulating(true);
    setActiveStepIndex(0);

    const stepIntervals = [0, 600, 1200, 1800, 2400];
    stepIntervals.forEach((delay, idx) => {
      setTimeout(() => {
        if (idx < 4) {
          setActiveStepIndex(idx);
        } else {
          setActiveStepIndex(-1);
          setSimulating(false);
        }
      }, delay);
    });
  };

  return (
    <section
      id="architecture-visualizer"
      aria-label="Interactive Architecture Comparison"
      className="rounded-[8px] border border-[var(--tsc-line)] bg-white p-6 sm:p-8 lg:p-12 shadow-[var(--shadow-warm-md)] font-geist"
    >
      {/* Top Header & Context */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[var(--tsc-line)] pb-8 mb-8">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <PageEyebrow>SYSTEM ARCHITECTURE COMPARISON</PageEyebrow>
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-[var(--tsc-signal)]/15 border border-[var(--tsc-signal)]/40 text-[var(--tsc-ink)] font-bold">
              Interactive Trace
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--tsc-ink)]">
            Legacy manual friction vs. automated event relay.
          </h2>
          <p className="text-sm sm:text-base text-[var(--tsc-muted)] leading-relaxed">
            See how targeted event architecture eliminates manual transcription, phone tag, and data
            leakage while preserving strict human exception guardrails.
          </p>
        </div>

        {/* Workflow Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-[8px] bg-[var(--tsc-surface)] border border-[var(--tsc-line)] self-start lg:self-auto shrink-0">
          <button
            type="button"
            onClick={() => {
              setMode("automated");
              setActiveStepIndex(-1);
            }}
            aria-pressed={mode === "automated"}
            className={`px-3.5 py-2 rounded-[6px] text-xs font-mono tracking-tight transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === "automated"
                ? "bg-[var(--tsc-action)] text-white font-bold shadow-[var(--shadow-warm-sm)]"
                : "text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)]"
            }`}
          >
            <Zap className="h-3.5 w-3.5" strokeWidth={1.7} />
            <span>Automated Event Relay</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("legacy");
              setActiveStepIndex(-1);
            }}
            aria-pressed={mode === "legacy"}
            className={`px-3.5 py-2 rounded-[6px] text-xs font-mono tracking-tight transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === "legacy"
                ? "bg-[var(--tsc-ink)] text-[var(--tsc-paper)] font-bold shadow-[var(--shadow-warm-sm)]"
                : "text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)]"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" strokeWidth={1.7} />
            <span>Legacy Manual Path</span>
          </button>
        </div>
      </div>

      {/* Scenario Filter Pills */}
      <div className="space-y-2 mb-8">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)] block">
          Select Workflow Scenario to Inspect:
        </span>
        <div className="flex flex-wrap gap-2.5">
          {SCENARIOS.map((s) => {
            const isSelected = s.id === selectedScenarioId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSelectedScenarioId(s.id);
                  setActiveStepIndex(-1);
                }}
                aria-pressed={isSelected}
                className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all border cursor-pointer ${
                  isSelected
                    ? "border-[var(--tsc-ink)] bg-[var(--tsc-ink)] text-[var(--tsc-paper)] shadow-xs"
                    : "border-[var(--tsc-line)] bg-[var(--tsc-surface)] text-[var(--tsc-ink)] hover:border-[var(--tsc-line-strong)]"
                }`}
              >
                <span>{s.title}</span>
                <span className="ml-1.5 text-[10px] opacity-70 font-mono">({s.industry})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scenario Telemetry Bar */}
      <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          className={`p-4 rounded-[8px] border transition-colors ${
            mode === "automated"
              ? "bg-[var(--tsc-surface)] border-[var(--tsc-line)]"
              : "bg-amber-500/5 border-amber-500/20"
          }`}
        >
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[var(--tsc-muted)] mb-1">
            <Clock className="h-3 w-3" strokeWidth={1.7} />
            <span>End-to-End Latency</span>
          </div>
          <div
            className={`text-lg sm:text-xl font-bold font-mono tabular-nums ${
              mode === "automated" ? "text-[var(--tsc-action)]" : "text-amber-800"
            }`}
          >
            {telemetry.latency}
          </div>
        </div>

        <div
          className={`p-4 rounded-[8px] border transition-colors ${
            mode === "automated"
              ? "bg-[var(--tsc-surface)] border-[var(--tsc-line)]"
              : "bg-amber-500/5 border-amber-500/20"
          }`}
        >
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[var(--tsc-muted)] mb-1">
            <Cpu className="h-3 w-3" strokeWidth={1.7} />
            <span>Human Touchpoints</span>
          </div>
          <div
            className={`text-lg sm:text-xl font-bold font-mono tabular-nums ${
              mode === "automated" ? "text-[var(--tsc-ink)]" : "text-amber-800"
            }`}
          >
            {telemetry.touchpoints}
          </div>
        </div>

        <div
          className={`p-4 rounded-[8px] border transition-colors ${
            mode === "automated"
              ? "bg-[var(--tsc-surface)] border-[var(--tsc-line)]"
              : "bg-amber-500/5 border-amber-500/20"
          }`}
        >
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[var(--tsc-muted)] mb-1">
            <Shield className="h-3 w-3" strokeWidth={1.7} />
            <span>Data / Typo Exposure</span>
          </div>
          <div
            className={`text-lg sm:text-xl font-bold font-mono tabular-nums ${
              mode === "automated" ? "text-[var(--tsc-action)]" : "text-amber-800"
            }`}
          >
            {telemetry.errorRate}
          </div>
        </div>

        <div
          className={`p-4 rounded-[8px] border transition-colors ${
            mode === "automated"
              ? "bg-[var(--tsc-surface)] border-[var(--tsc-line)]"
              : "bg-amber-500/5 border-amber-500/20"
          }`}
        >
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[var(--tsc-muted)] mb-1">
            <FileCheck2 className="h-3 w-3" strokeWidth={1.7} />
            <span>After-Hours Capture</span>
          </div>
          <div
            className={`text-lg sm:text-xl font-bold font-mono tabular-nums ${
              mode === "automated" ? "text-[var(--tsc-action)]" : "text-amber-800"
            }`}
          >
            {telemetry.afterHours}
          </div>
        </div>
      </div>

      {/* 4-Step Pipeline Flow */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-[var(--tsc-muted)] pb-2 border-b border-[var(--tsc-line)]">
          <span className="uppercase tracking-wider">
            {mode === "automated" ? "Engineered Event Sequence" : "Legacy Friction Sequence"}
          </span>
          {mode === "automated" && (
            <Magnetic pullFactor={0.16}>
              <button
                type="button"
                onClick={handleSimulate}
                disabled={simulating}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[6px] bg-[var(--tsc-action)] text-white hover:bg-[var(--tsc-ink)] transition-colors cursor-pointer text-xs font-mono font-semibold shadow-[var(--shadow-warm-xs)]"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>{simulating ? "Simulating Event Ingest..." : "Run Live Trace"}</span>
              </button>
            </Magnetic>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="wait">
            {steps.map((step, idx) => {
              const isSimActive = activeStepIndex === idx;
              const isSimPast = activeStepIndex > idx;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-[8px] border p-5 flex flex-col justify-between space-y-4 transition-all ${
                    isSimActive
                      ? "border-[var(--tsc-action)] bg-[var(--tsc-surface)] ring-2 ring-[var(--tsc-action)]/30 scale-[1.02] shadow-[var(--shadow-warm-md)]"
                      : isSimPast
                        ? "border-[var(--tsc-action)]/40 bg-white"
                        : mode === "automated"
                          ? "border-[var(--tsc-line)] bg-white shadow-xs"
                          : "border-amber-200 bg-amber-50/30"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[var(--tsc-line)] pb-2.5">
                      <span className="font-mono text-xs font-bold text-[var(--tsc-muted)]">
                        STEP {step.stepNumber}
                      </span>
                      <span
                        className={`font-mono text-[11px] px-2 py-0.5 rounded-[4px] font-semibold ${
                          mode === "automated"
                            ? "bg-[var(--tsc-surface)] text-[var(--tsc-action)] border border-[var(--tsc-line)]"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {step.latency}
                      </span>
                    </div>

                    <h4 className="font-semibold text-sm text-[var(--tsc-ink)] leading-snug">
                      {step.name}
                    </h4>

                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)] block">
                      Actor: {step.actor}
                    </span>

                    <p className="text-xs text-[var(--tsc-muted)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--tsc-line)] text-[11px] font-mono">
                    {mode === "automated" ? (
                      <div className="flex items-center gap-1.5 text-[var(--tsc-action)] font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" strokeWidth={1.7} />
                        <span>{step.guarantee}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" strokeWidth={1.7} />
                        <span>{step.failureRisk}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
