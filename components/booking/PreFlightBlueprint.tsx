"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  CheckCircle2,
  Cpu,
  Layers,
  Scale,
  ShieldCheck,
  Stethoscope,
  Utensils,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { PageEyebrow } from "@/components/public/PageEyebrow";

interface BlueprintSystem {
  readonly id: string;
  readonly phase: string;
  readonly title: string;
  readonly techStack: string;
  readonly description: string;
}

interface BottleneckOption {
  readonly id: string;
  readonly label: string;
  readonly constraint: string;
  readonly targetMetrics: readonly string[];
  readonly systems: readonly BlueprintSystem[];
}

interface DomainOption {
  readonly id: string;
  readonly name: string;
  readonly icon: typeof Stethoscope;
  readonly subtext: string;
  readonly bottlenecks: readonly BottleneckOption[];
}

const DOMAINS: readonly DomainOption[] = [
  {
    id: "clinic",
    name: "Healthcare & Dental",
    icon: Stethoscope,
    subtext: "Dental practices, physiotherapy, specialized clinical offices",
    bottlenecks: [
      {
        id: "intake",
        label: "Patient Intake & Medical History",
        constraint:
          "Manual clipboard paperwork, slow transcription into EHR, missing consent signatures, and delayed check-ins.",
        targetMetrics: [
          "8.5 min/patient saved at desk",
          "Zero clipboard transcriptions",
          "99.4% first-pass chart accuracy",
        ],
        systems: [
          {
            id: "clinic-intake-1",
            phase: "TIER 01: MOBILE CAPTURE & WAIVER RELAY",
            title: "Encrypted Pre-Visit Intake Relay",
            techStack: "Twilio SMS &middot; Next.js Secure Web &middot; PHIPA/HIPAA Vault",
            description:
              "Sends automated pre-visit mobile link 24h prior. Patients complete medical history, insurance card photo OCR, and signed waivers on their own phone before arrival.",
          },
          {
            id: "clinic-intake-2",
            phase: "TIER 02: VALIDATION & DEDUPLICATION",
            title: "Rules Sanitization Engine",
            techStack: "Deterministic Rules Engine &middot; Master Patient Index",
            description:
              "Validates health card and insurer policy IDs in real time. Flags contraindications and allergies directly for the attending clinician's immediate attention.",
          },
          {
            id: "clinic-intake-3",
            phase: "TIER 03: EHR / PRACTICE RECORD SYNC",
            title: "Direct Chart & Ledger Append",
            techStack: "Dentrix / Jane / Kareo Webhook Relay &middot; Immutable Audit Log",
            description:
              "Appends sanitized PDF chart and structured discrete fields directly into your practice management software with an encrypted verification audit trail.",
          },
        ],
      },
      {
        id: "calls",
        label: "After-Hours & Rush Phone Inbound",
        constraint:
          "Front desk overwhelmed during morning rushes; patient voicemails pile up, causing delayed care and lost new inquiries.",
        targetMetrics: [
          "< 2.2s call pickup latency",
          "82% routine inquiries resolved",
          "Zero lost new-patient inquiries",
        ],
        systems: [
          {
            id: "clinic-calls-1",
            phase: "TIER 01: VOICE RECEPTION & TRIAGE",
            title: "Tactile Voice Receptionist",
            techStack: "Twilio Media Streams &middot; Whisper ASR &middot; Low-Latency TTS",
            description:
              "Answers on ring one. Converses naturally regarding office hours, accepted insurance, parking directions, and appointment scheduling availability.",
          },
          {
            id: "clinic-calls-2",
            phase: "TIER 02: CLINICAL ESCALATION GUARDRAIL",
            title: "Emergency Symptom Keyword Detector",
            techStack: "Strict Rules Classification &middot; SMS / Pager Duty Relay",
            description:
              "Detects acute symptoms (severe pain, bleeding, allergic reaction) and immediately transfers the caller to the emergency line or notifies on-call staff.",
          },
          {
            id: "clinic-calls-3",
            phase: "TIER 03: CALENDAR LOCK & SMS CONFIRMATION",
            title: "Practice Slot Hold & Confirmation",
            techStack: "Jane / NexHealth Integration &middot; Two-Way SMS Thread",
            description:
              "Locks calendar chair in real time and texts the patient instant appointment details with calendar invite and rescheduling instructions.",
          },
        ],
      },
      {
        id: "recalls",
        label: "Hygiene Recalls & Standby Fills",
        constraint:
          "Empty hygiene chairs from overdue check-ups and last-minute cancellations. Staff lacks hours to cold-call inactive rosters.",
        targetMetrics: [
          "14+ extra hygiene chairs filled/mo",
          "$5,600/mo recaptured hygiene revenue",
          "Zero staff cold-calling",
        ],
        systems: [
          {
            id: "clinic-recalls-1",
            phase: "TIER 01: OVERDUE ROSTER CRON",
            title: "Hygiene Interval Audit Daemon",
            techStack: "Nightly Cron &middot; Practice Database Reader",
            description:
              "Identifies patients 6+ months past their previous hygiene appointment with zero upcoming booking on the calendar.",
          },
          {
            id: "clinic-recalls-2",
            phase: "TIER 02: 2-WAY RECALL CONVERSATION",
            title: "Contextual Patient Prompt",
            techStack: "SMS Relay &middot; Booking Slot Deep Links",
            description:
              "Sends a warm, personalized text with direct 2-tap slot selection. Handles patient questions regarding preferred hygienist or afternoon availability.",
          },
          {
            id: "clinic-recalls-3",
            phase: "TIER 03: LAST-MINUTE STANDBY AUTO-FILL",
            title: "Same-Day Cancellation Dispatch",
            techStack: "Standby Queue &middot; Fast-Response SMS Bot",
            description:
              "When an appointment is cancelled with < 24h notice, texts the top 3 waitlist patients nearby. First responder claims the chair instantly.",
          },
        ],
      },
    ],
  },
  {
    id: "trades",
    name: "Field Trades & Dispatch",
    icon: Wrench,
    subtext: "HVAC, plumbing, electrical, roofing, and mechanical contractors",
    bottlenecks: [
      {
        id: "calls",
        label: "Emergency Inbound & Dispatch",
        constraint:
          "Techs are in attics or on jobsites; missed inbound calls cost $500–$2,500 per lost urgent repair job.",
        targetMetrics: [
          "100% emergency calls answered",
          "< 60s technician notification",
          "3.2x faster emergency dispatch",
        ],
        systems: [
          {
            id: "trades-calls-1",
            phase: "TIER 01: CALL & SMS INTERCEPTOR",
            title: "24/7 First-Ring Dispatch Assistant",
            techStack: "Twilio Voice & SMS &middot; Dynamic Address Parser",
            description:
              "Picks up instantly on ring one. Records emergency description, customer address, equipment type (furnace, AC, leak), and urgency level.",
          },
          {
            id: "trades-calls-2",
            phase: "TIER 02: GEO-PROXIMITY TECH PAGING",
            title: "Tech Routing & Pager Alert",
            techStack: "GPS / Postal Zone Matching &middot; Telegram / Push Notification",
            description:
              "Identifies closest on-duty technician with relevant license. Dispatches high-urgency audio brief and customer phone number to tech's phone.",
          },
          {
            id: "trades-calls-3",
            phase: "TIER 03: WORK ORDER CREATION",
            title: "ServiceTitan / Jobber Auto-Ticket",
            techStack: "Jobber / ServiceTitan API &middot; Automated Customer SMS",
            description:
              "Creates work order in your field management system and texts customer: 'Technician Marc is dispatched. ETA 35 minutes.'",
          },
        ],
      },
      {
        id: "quotes",
        label: "Estimate Follow-ups & Deposit Collection",
        constraint:
          "Quotes emailed after site visits sit unopened; 40% of estimates languish because technicians hate chasing customers for signatures.",
        targetMetrics: [
          "28% increase in quote close rate",
          "Zero manual follow-up phone calls",
          "Instant credit card deposit lock",
        ],
        systems: [
          {
            id: "trades-quotes-1",
            phase: "TIER 01: ENGAGEMENT TRACKER",
            title: "Estimate Open & Activity Daemon",
            techStack: "Email Webhook Ingest &middot; PDF Open Telemetry",
            description:
              "Tracks exactly when the homeowner opens the estimate. If unaccepted after 48 hours, queues an inquiry prompt.",
          },
          {
            id: "trades-quotes-2",
            phase: "TIER 02: 1-CLICK ACCEPTANCE RELAY",
            title: "Mobile Contract & Deposit Gateway",
            techStack: "Stripe Connect &middot; Mobile E-Signature Webhook",
            description:
              "Homeowner signs scope and authorizes 20% mobilization deposit on their mobile device without logging into complex portals.",
          },
          {
            id: "trades-quotes-3",
            phase: "TIER 03: DISPATCH & PARTS RESERVATION",
            title: "Procurement & Scheduling Trigger",
            techStack: "ERP / Accounting Sync &middot; Calendar Auto-Slot",
            description:
              "Upon deposit confirmation, system notifies parts coordinator and reserves technician installation window on the master calendar.",
          },
        ],
      },
      {
        id: "invoicing",
        label: "Job Completion & Immediate Invoicing",
        constraint:
          "Invoices prepared days or weeks after job completion; paper notes lost, resulting in delayed payments and cash flow drag.",
        targetMetrics: [
          "Payment collection cut from 18 days to 4 hours",
          "Zero manual PDF drafting",
          "Instant customer sign-off photos",
        ],
        systems: [
          {
            id: "trades-inv-1",
            phase: "TIER 01: FIELD PHOTO & TIME LOG",
            title: "Mobile Job Completion Relay",
            techStack: "Telegram / PWA Tech Relay &middot; EXIF Timestamp Validator",
            description:
              "Tech snaps completion photos and notes parts used. System formats verified certificate of completion with GPS timestamp.",
          },
          {
            id: "trades-inv-2",
            phase: "TIER 02: INSTANT SMS INVOICE & APPLE PAY",
            title: "One-Tap Payment Presenter",
            techStack: "Stripe SMS &middot; Apple Pay / Google Pay / Interac",
            description:
              "Customer receives instant text receipt and one-tap checkout link before technician has even pulled out of the driveway.",
          },
          {
            id: "trades-inv-3",
            phase: "TIER 03: ACCOUNTING RECONCILIATION",
            title: "QuickBooks / Xero Auto-Reconcile",
            techStack: "QBO Webhook &middot; Automated Paid Receipt Relay",
            description:
              "Marks invoice paid, balances deposit against final total, records payment fee, and emails customer tax receipt automatically.",
          },
        ],
      },
    ],
  },
  {
    id: "hospitality",
    name: "Hospitality & Dining",
    icon: Utensils,
    subtext: "Boutique restaurants, private dining, catering operations, salons",
    bottlenecks: [
      {
        id: "reservations",
        label: "Rush Hour Phone Calls & Large Parties",
        constraint:
          "Hosts can't answer ringing phones during dinner service; large party inquiries require endless email exchanges.",
        targetMetrics: [
          "Zero missed phone bookings during service",
          "85% reduction in host desk phone time",
          "Automated large party deposit holds",
        ],
        systems: [
          {
            id: "hosp-res-1",
            phase: "TIER 01: AUTONOMOUS PHONE & SMS HOST",
            title: "Virtual Front-of-House Assistant",
            techStack: "SevenRooms / OpenTable API &middot; Conversational Voice Relay",
            description:
              "Answers guest inquiries about corkage, parking, table availability, and party sizes without distracting floor staff.",
          },
          {
            id: "hosp-res-2",
            phase: "TIER 02: TABLE CAPACITY & RULES ENGINE",
            title: "Floor Pacing & Seating Guardrail",
            techStack: "POS Seating Rules &middot; Turn-Time Estimator",
            description:
              "Enforces kitchen cover caps and minimum spends for private dining rooms before confirming reservation.",
          },
          {
            id: "hosp-res-3",
            phase: "TIER 03: LARGE GROUP DEPOSIT LOCK",
            title: "Automated Stripe Guarantee",
            techStack: "Stripe Pre-Auth Relay &middot; Automated Reminder Daemon",
            description:
              "Sends SMS payment link for parties of 6+. Releases hold automatically if deposit isn't authorized within 2 hours.",
          },
        ],
      },
      {
        id: "catering",
        label: "Catering & Private Event Inquiries",
        constraint:
          "Event managers spend 4 hours drafting each custom proposal; prospective corporate clients go cold waiting for responses.",
        targetMetrics: [
          "Proposal created in 90s vs 4 hours",
          "3.1x faster corporate contract close",
          "Live equipment & food cost estimation",
        ],
        systems: [
          {
            id: "hosp-cat-1",
            phase: "TIER 01: INTERACTIVE MENU BUILDER",
            title: "Self-Serve Package Configurator",
            techStack: "Interactive Headcount & Tier Selector &middot; Dietary Ingest",
            description:
              "Organizers select guest count, bar packages, dietary preferences, and service style with live pricing feedback.",
          },
          {
            id: "hosp-cat-2",
            phase: "TIER 02: COST & MARGIN CALCULATOR",
            title: "Automatic BEO & Staffing Generator",
            techStack: "Costing Engine &middot; Dynamic Staff-to-Guest Ratio Calculator",
            description:
              "Calculates exact food cost, bartender counts, and rental requirements, generating a polished PDF Banquet Event Order (BEO).",
          },
          {
            id: "hosp-cat-3",
            phase: "TIER 03: CONTRACT LOCK & CALENDAR HOLD",
            title: "Deposit E-Signature & Kitchen Alert",
            techStack: "DocuSign / HelloSign API &middot; Master Kitchen Calendar",
            description:
              "Locks the date, collects 50% retainer, and alerts executive chef with complete prep sheet and allergen roster.",
          },
        ],
      },
    ],
  },
  {
    id: "professional",
    name: "Professional & Advisory",
    icon: Scale,
    subtext: "Law firms, accounting practices, advisory boutiques, wealth managers",
    bottlenecks: [
      {
        id: "screening",
        label: "Inbound Intake & Conflict Screening",
        constraint:
          "Senior partners waste valuable billable hours on unqualified inquiries or discovering conflict-of-interest after the call.",
        targetMetrics: [
          "4.5 billable partner hours saved/wk",
          "100% pre-call conflict verification",
          "Instant structured intake memo",
        ],
        systems: [
          {
            id: "prof-screen-1",
            phase: "TIER 01: STRUCTURED MATTER INTAKE",
            title: "Confidential Triage Form & Bot",
            techStack: "Encrypted Form &middot; Dynamic Jurisdictional Rules",
            description:
              "Captures opposing party names, jurisdiction, matter category, and budget expectations through a confidential questionnaire.",
          },
          {
            id: "prof-screen-2",
            phase: "TIER 02: CONFLICT-OF-INTEREST SCRUBBER",
            title: "Practice Database Conflict Matcher",
            techStack: "Clio / PracticePanther Reader &middot; Exact & Fuzzy Name Match",
            description:
              "Scans active and historical client databases for adverse parties and affiliates before any partner consult is scheduled.",
          },
          {
            id: "prof-screen-3",
            phase: "TIER 03: CONSULTATION MEMO & RETAINER",
            title: "Partner Briefing Sheet & Agreement",
            techStack: "Internal Brief Generator &middot; Pre-Filled Retainer Template",
            description:
              "Produces a concise 1-page matter brief for the attorney with recommended hourly rate or fixed-fee retainer agreement ready.",
          },
        ],
      },
      {
        id: "documents",
        label: "Client Document & Tax File Chase",
        constraint:
          "Engagements stall because clients trickle tax forms, corporate bylaws, and receipts across dozens of disorganized emails.",
        targetMetrics: [
          "Turnaround time accelerated by 12 days",
          "Zero manual email reminder chains",
          "Automatic document classification",
        ],
        systems: [
          {
            id: "prof-docs-1",
            phase: "TIER 01: SECURE CLIENT PORTAL",
            title: "Live Missing-Item Checklist",
            techStack: "Magic Link Portal &middot; Client-Specific Requirements Matrix",
            description:
              "Clients access a personalized, passwordless checklist showing exactly which files are received and which remain outstanding.",
          },
          {
            id: "prof-docs-2",
            phase: "TIER 02: OCR FILE CLASSIFICATION",
            title: "Document Type & Tax Year Validator",
            techStack: "Vision Document Parser &middot; Metadata Extractor",
            description:
              "Verifies uploaded file is actually a T4/W-2 or Articles of Incorporation for the correct tax year before marking complete.",
          },
          {
            id: "prof-docs-3",
            phase: "TIER 03: GENTLE CONTEXTUAL NUDGES",
            title: "Automated Cadence Reminders",
            techStack: "SMS / Email Sequence &middot; Auto-Shutdown on Upload",
            description:
              "Sends polite, progressive reminders every 5 days. Halts immediately when final outstanding file is uploaded, notifying the lead accountant.",
          },
        ],
      },
    ],
  },
];

export function PreFlightBlueprint() {
  const [selectedDomainId, setSelectedDomainId] = useState<string>("clinic");
  const [selectedBottleneckId, setSelectedBottleneckId] = useState<string>("intake");
  const [pinned, setPinned] = useState<boolean>(false);

  const activeDomain = DOMAINS.find((d) => d.id === selectedDomainId) ?? DOMAINS[0];
  const activeBottleneck =
    activeDomain.bottlenecks.find((b) => b.id === selectedBottleneckId) ??
    activeDomain.bottlenecks[0];

  const handleDomainChange = (domainId: string) => {
    setSelectedDomainId(domainId);
    const domain = DOMAINS.find((d) => d.id === domainId);
    if (domain && domain.bottlenecks.length > 0) {
      setSelectedBottleneckId(domain.bottlenecks[0].id);
    }
    setPinned(false);
  };

  const handleBottleneckChange = (bottleneckId: string) => {
    setSelectedBottleneckId(bottleneckId);
    setPinned(false);
  };

  const scrollToCalendar = () => {
    setPinned(true);
    const calendarEl = document.getElementById("booking-calendar");
    if (calendarEl) {
      calendarEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="blueprint-configurator"
      aria-label="Pre-Flight Architecture Configurator"
      className="mb-14 rounded-[8px] border border-[var(--tsc-line)] bg-white p-6 sm:p-8 lg:p-10 shadow-[var(--shadow-warm-md)] font-geist"
    >
      {/* Eyebrow & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--tsc-line)] pb-6 mb-8">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <PageEyebrow>PRE-FLIGHT SCOPING</PageEyebrow>
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-[var(--tsc-signal)]/15 border border-[var(--tsc-signal)]/40 text-[var(--tsc-ink)] font-bold">
              Interactive
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[var(--tsc-ink)]">
            Explore the 3-part architecture for your operation.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--tsc-muted)] leading-relaxed">
            Select your industry and primary operational bottleneck below to see the exact system
            components and anticipated benchmarks we review during your 30-minute discovery call.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--tsc-muted)] self-start md:self-auto shrink-0 bg-[var(--tsc-surface)] px-3 py-1.5 rounded-[6px] border border-[var(--tsc-line)]">
          <ShieldCheck className="h-4 w-4 text-[var(--tsc-action)] shrink-0" strokeWidth={1.7} />
          <span>Scoped for your stack &middot; Zero sales fluff</span>
        </div>
      </div>

      {/* Step 1: Industry Vertical Selection */}
      <div className="space-y-3 mb-8">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--tsc-muted)] font-semibold block">
          Step 1: Select Your Practice or Business Vertical
        </span>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {DOMAINS.map((domain) => {
            const Icon = domain.icon;
            const isSelected = domain.id === selectedDomainId;
            return (
              <button
                key={domain.id}
                type="button"
                onClick={() => handleDomainChange(domain.id)}
                aria-pressed={isSelected}
                className={`p-3.5 rounded-[8px] text-left transition-all border cursor-pointer ${
                  isSelected
                    ? "border-[var(--tsc-action)] bg-[var(--tsc-surface)] shadow-[var(--shadow-warm-sm)]"
                    : "border-[var(--tsc-line)] bg-white hover:border-[var(--tsc-line-strong)] hover:bg-[var(--tsc-surface)]/50"
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div
                    className={`h-7 w-7 rounded-[6px] flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-[var(--tsc-action)] text-white"
                        : "bg-[var(--tsc-surface)] text-[var(--tsc-muted)] border border-[var(--tsc-line)]"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.7} />
                  </div>
                  <span className="font-semibold text-xs text-[var(--tsc-ink)] leading-snug line-clamp-1">
                    {domain.name}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--tsc-muted)] line-clamp-1 leading-tight">
                  {domain.subtext}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Primary Bottleneck Selection */}
      <div className="space-y-3 mb-8">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--tsc-muted)] font-semibold block">
          Step 2: Choose Your Primary Operational Bottleneck
        </span>
        <div className="flex flex-wrap gap-2">
          {activeDomain.bottlenecks.map((bottleneck) => {
            const isSelected = bottleneck.id === activeBottleneck.id;
            return (
              <button
                key={bottleneck.id}
                type="button"
                onClick={() => handleBottleneckChange(bottleneck.id)}
                aria-pressed={isSelected}
                className={`px-3.5 py-2 rounded-[6px] text-xs font-medium transition-all border cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? "border-[var(--tsc-ink)] bg-[var(--tsc-ink)] text-[var(--tsc-paper)] shadow-[var(--shadow-warm-sm)]"
                    : "border-[var(--tsc-line)] bg-[var(--tsc-surface)] text-[var(--tsc-ink)] hover:border-[var(--tsc-line-strong)]"
                }`}
              >
                <span>{bottleneck.label}</span>
                {isSelected && (
                  <CheckCircle2
                    className="h-3.5 w-3.5 text-[var(--tsc-signal)] shrink-0"
                    strokeWidth={1.7}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Dynamic Architecture Blueprint Card */}
      <div className="rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] p-6 sm:p-8 space-y-6">
        {/* Bottleneck Summary & Benchmarks */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-[var(--tsc-line)] pb-6">
          <div className="space-y-2 max-w-xl">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)] font-semibold block">
              IDENTIFIED OPERATIONAL CONSTRAINT
            </span>
            <p className="text-sm text-[var(--tsc-ink)] font-medium leading-relaxed">
              {activeBottleneck.constraint}
            </p>
          </div>

          <div className="space-y-2 lg:text-right shrink-0">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)] font-semibold block">
              TARGET BENCHMARKS
            </span>
            <div className="flex flex-wrap lg:justify-end gap-2">
              {activeBottleneck.targetMetrics.map((metric) => (
                <span
                  key={metric}
                  className="font-mono text-[11px] font-semibold text-[var(--tsc-action)] bg-white px-2.5 py-1 rounded-[4px] border border-[var(--tsc-line)] shadow-xs"
                >
                  {metric}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3-Tier Architecture Flow */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--tsc-muted)] uppercase tracking-wider">
            <span className="flex items-center gap-1.5 font-semibold text-[var(--tsc-ink)]">
              <Layers className="h-3.5 w-3.5 text-[var(--tsc-action)]" strokeWidth={1.7} />
              Engineered 3-Tier Architecture Walkthrough
            </span>
            <span>Production Blueprint</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AnimatePresence mode="wait">
              {activeBottleneck.systems.map((system) => (
                <motion.div
                  key={system.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-[8px] border border-[var(--tsc-line)] bg-white p-5 space-y-3 flex flex-col justify-between shadow-xs"
                >
                  <div className="space-y-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--tsc-muted)] font-semibold block">
                      {system.phase}
                    </span>
                    <h4 className="font-semibold text-sm text-[var(--tsc-ink)]">{system.title}</h4>
                    <p className="text-xs text-[var(--tsc-muted)] leading-relaxed">
                      {system.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[var(--tsc-line)]">
                    <span className="font-mono text-[10px] text-[var(--tsc-ink)] font-medium block">
                      Stack: {system.techStack}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Bar: Pin to Discovery Call */}
        <div className="pt-4 border-t border-[var(--tsc-line)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[var(--tsc-muted)]">
            <Cpu className="h-4 w-4 text-[var(--tsc-action)] shrink-0" strokeWidth={1.7} />
            <span>
              Typical turnaround: <strong>10–14 business days</strong> &middot; Idempotent retry
              logic &middot; Human-in-the-loop exception fallback
            </span>
          </div>

          <button
            type="button"
            onClick={scrollToCalendar}
            className="group flex items-center justify-center gap-2 rounded-[6px] bg-[var(--tsc-action)] px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-[var(--tsc-ink)] shadow-[var(--shadow-warm-sm)] cursor-pointer shrink-0"
          >
            <span>Review this blueprint on our call</span>
            <ArrowDown
              className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5"
              strokeWidth={1.7}
            />
          </button>
        </div>
      </div>

      {/* Pinned Feedback Alert */}
      {pinned && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 p-3.5 rounded-[8px] bg-[var(--tsc-action)] text-white flex items-center justify-between text-xs font-mono"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[var(--tsc-signal)] shrink-0" strokeWidth={1.7} />
            <span>
              Pinned for your audit: <strong>{activeDomain.name}</strong> &mdash;{" "}
              <em>{activeBottleneck.label}</em>
            </span>
          </div>
          <span className="text-[10px] text-white/80 hidden sm:inline">
            Scroll down to select your time slot &darr;
          </span>
        </motion.div>
      )}
    </section>
  );
}
