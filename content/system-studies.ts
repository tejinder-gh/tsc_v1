export interface DiagramStep {
  readonly name: string;
  readonly latency: string;
  readonly subtext: string;
  readonly telemetryPayload?: Record<string, string | number | boolean>;
}

export interface SystemStudy {
  readonly id: string;
  readonly index: string;
  readonly title: string;
  readonly location: string;
  readonly problem: string;
  readonly system: string;
  readonly expectedChange: string;
  readonly diagramSteps: readonly DiagramStep[];
}

export const SYSTEM_STUDIES: readonly SystemStudy[] = [
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
    problem:
      "Hygiene recalls went out by hand when staff had time, leaving 20+ open chair hours each week.",
    system:
      "Recall engine calculates hygiene due dates → 2-way SMS self-booking → calendar sync & insurance pre-check.",
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
    problem:
      "Evening and weekend inquiries waited until Monday; prospects retained other counsel first.",
    system:
      "24/7 inquiry intake → conflict-safe triage & screening → secure retainer consult booking.",
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
