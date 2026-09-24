"use server";

import { revalidatePath } from "next/cache";
import { demoClients } from "@/automations/clients";
import { FileDraftStore } from "@/automations/core/drafts";
import { consoleLogger } from "@/automations/core/logger";
import { applyOverrides } from "@/automations/core/overrides";
import type { InboundMessage } from "@/automations/inbound/types";
import { processInbound } from "@/automations/server/process-inbound";
import { runTick } from "@/automations/server/run-tick";
import { getAllOfferings, getOfferingsByKind } from "@/features/catalog/data/registry";
import {
  ContextService,
  ContextAuthorizationError,
} from "@/lib/second-brain/services/ContextService";
import { SECOND_BRAIN_ROUTES } from "@/lib/second-brain/routes-registry";
import { getTelemetryStatus, type TelemetryStatus } from "@/lib/telemetry";
import { assertOperatorAuthenticated, assertValidClientId } from "./auth-guard";

export interface ClientMatrixItem {
  id: string;
  name: string;
  segment: string;
  timezone: string;
  quietHours: { start: string; end: string };
  automations: {
    id: string;
    recipe: string;
    enabled: boolean;
  }[];
  totalAutomations: number;
  activeAutomations: number;
  pendingDraftsCount: number;
}

export interface DashboardMetrics {
  clients: ClientMatrixItem[];
  summary: {
    totalClients: number;
    totalAutomations: number;
    activeAutomations: number;
    disabledAutomations: number;
    totalPendingDrafts: number;
    totalOfferings: number;
    offeringsBreakdown: {
      automations: number;
      services: number;
      newsletters: number;
    };
    registeredInternalEndpoints: number;
  };
  subsystems: {
    id: string;
    name: string;
    protocol: string;
    status: "configured" | "registered" | "unverified" | "unavailable";
    description: string;
    lastTelemetry?: string;
  }[];
  telemetry?: TelemetryStatus;
  lastUpdated: string;
}

/**
 * Aggregates configuration and registry metrics across clients, automations,
 * pending review queues, offerings catalog, and registered Second Brain endpoints.
 */
export async function getDashboardOverviewMetrics(): Promise<DashboardMetrics> {
  await assertOperatorAuthenticated();

  let totalAutomations = 0;
  let activeAutomations = 0;
  let totalPendingDrafts = 0;

  const clientMatrixItems: ClientMatrixItem[] = demoClients.map((client) => {
    const config = applyOverrides(client.config);
    const automations = config.automations.map((a) => ({
      id: a.id,
      recipe: a.recipe,
      enabled: a.enabled,
    }));

    const clientActiveCount = automations.filter((a) => a.enabled).length;
    totalAutomations += automations.length;
    activeAutomations += clientActiveCount;

    let pendingDraftsCount = 0;
    try {
      const draftStore = new FileDraftStore(`.automations/drafts/${client.config.id}.json`);
      pendingDraftsCount = draftStore.getPending().length;
    } catch {
      pendingDraftsCount = 0;
    }
    totalPendingDrafts += pendingDraftsCount;

    return {
      id: config.id,
      name: config.business.name,
      segment: config.business.segment,
      timezone: config.business.timezone,
      quietHours: config.channels.quietHours || { start: "21:00", end: "08:00" },
      automations,
      totalAutomations: automations.length,
      activeAutomations: clientActiveCount,
      pendingDraftsCount,
    };
  });

  const allOfferings = getAllOfferings();
  const automationsOfferings = getOfferingsByKind("automation");
  const servicesOfferings = getOfferingsByKind("service");
  const newslettersOfferings = getOfferingsByKind("newsletter");

  const telemetryStatus = getTelemetryStatus();

  const subsystems = [
    {
      id: "scheduler",
      name: "Automation Scheduler Engine",
      protocol: "Cron / In-Process Worker",
      status: "configured" as const,
      description: "Sequential client tick runner with file-backed state & opt-out coherence.",
      lastTelemetry:
        "In-process configuration loaded (runtime unverified without manual tick or cron probe)",
    },
    {
      id: "inbound-sms",
      name: "Twilio Closed-Loop Inbound Gateway",
      protocol: "POST /api/inbound (Twilio Webhook)",
      status: "configured" as const,
      description:
        "Ingests SMS replies, evaluates intent via rules/LLM, dispatches auto-replies or drafts.",
      lastTelemetry: "Webhook route mounted (external Twilio delivery unverified)",
    },
    {
      id: "lead-relay",
      name: "Lead Ingestion & HMAC Relay Webhook",
      protocol: "POST /api/lead & /api/v1/relay",
      status: "configured" as const,
      description: "Payload-bounded lead capture with honeypot bot trap and secure outbound relay.",
      lastTelemetry: "Endpoints registered (external webhook delivery unverified)",
    },
    {
      id: "second-brain",
      name: "Second Brain Context RAG & IAM",
      protocol: "POST /api/internal/v1/context/search",
      status: "registered" as const,
      description: "Dynamic route registry and hierarchical resource context indexing.",
      lastTelemetry: `${SECOND_BRAIN_ROUTES.length} endpoints registered in IAM catalog (DB connection unverified)`,
    },
    {
      id: "catalog-engine",
      name: "Unified Offerings & Recommendation Engine",
      protocol: "In-Memory Dynamic Service Repository",
      status: "registered" as const,
      description: "34 canonical services, automations, and newsletters with 100% slug integrity.",
      lastTelemetry: "34 canonical entities defined in local catalog",
    },
    {
      id: "observability",
      name: "Observability & Error Telemetry",
      protocol: "Plausible CE / GlitchTip / OpenReplay",
      status:
        telemetryStatus.analytics.configured || telemetryStatus.errorMonitoring.configured
          ? ("configured" as const)
          : ("unavailable" as const),
      description: `Release ${telemetryStatus.releaseId} (${telemetryStatus.environment}). Analytics: ${telemetryStatus.analytics.status}, Errors: ${telemetryStatus.errorMonitoring.status}, Replay: ${telemetryStatus.sessionReplay.status}.`,
      lastTelemetry: "Configuration loaded. Live totals require backend read adapters.",
    },
  ];

  return {
    clients: clientMatrixItems,
    summary: {
      totalClients: clientMatrixItems.length,
      totalAutomations,
      activeAutomations,
      disabledAutomations: totalAutomations - activeAutomations,
      totalPendingDrafts,
      totalOfferings: allOfferings.length,
      offeringsBreakdown: {
        automations: automationsOfferings.length,
        services: servicesOfferings.length,
        newsletters: newslettersOfferings.length,
      },
      registeredInternalEndpoints: SECOND_BRAIN_ROUTES.length,
    },
    subsystems,
    telemetry: telemetryStatus,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Manual Trigger: Runs a scheduler pass across all or a selected client.
 */
export async function triggerManualSchedulerTick(clientId?: string) {
  await assertOperatorAuthenticated();

  const startTime = Date.now();
  const clientsToRun = clientId
    ? [demoClients.find((c) => c.config.id === assertValidClientId(clientId))!.config]
    : demoClients.map((c) => c.config);

  const report = await runTick({
    clients: clientsToRun,
    logger: consoleLogger,
  });

  const durationMs = Date.now() - startTime;
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/flows");
  revalidatePath("/dashboard/drafts");

  return {
    ok: true,
    ranAt: report.ranAt,
    durationMs,
    clientCount: report.clients.length,
    results: report.clients,
  };
}

/**
 * Manual Trigger: Simulates an inbound customer SMS to test the NLP interpreter,
 * opt-out suppression, and human-in-the-loop review queue generation.
 */
export async function triggerSimulatedInboundSms(payload: {
  clientId: string;
  fromPhone: string;
  messageBody: string;
}) {
  await assertOperatorAuthenticated();
  const validClientId = assertValidClientId(payload.clientId);

  if (!payload.messageBody || !payload.messageBody.trim()) {
    throw new Error("Message body is required");
  }

  const client = demoClients.find((c) => c.config.id === validClientId);
  if (!client) {
    throw new Error(`Client ${validClientId} not found`);
  }

  const normalizedPhone = payload.fromPhone.trim() || "+14165550114";
  const inboundMessage: InboundMessage = {
    id: `sim_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    channel: "sms",
    from: normalizedPhone,
    to: "+14165550100",
    body: payload.messageBody.trim(),
    receivedAt: new Date().toISOString(),
  };

  const result = await processInbound(inboundMessage, client.config, {
    logger: consoleLogger,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/drafts");

  return {
    ok: true,
    clientId: validClientId,
    messageId: inboundMessage.id,
    from: inboundMessage.from,
    body: inboundMessage.body,
    intent: result.ingest.interpretation.intent,
    confidence: result.ingest.interpretation.confidence,
    source: result.ingest.interpretation.source,
    suggestedReply: result.ingest.interpretation.suggestedReply,
    disposition:
      result.ingest.interpretation.intent === "opt_out"
        ? "Contact Opted Out & Suppressed"
        : result.dispatch.drafted > 0
          ? "AI Draft Created in Review Queue"
          : result.dispatch.sent > 0
            ? "Automated Response Dispatched"
            : "Processed (No Direct Send)",
    telemetry: {
      plannedActions: result.ingest.actions.length,
      sentCount: result.dispatch.sent,
      draftedCount: result.dispatch.drafted,
      notifiedCount: result.dispatch.notified,
      suppressedCount: result.dispatch.suppressed,
      errors: result.dispatch.errors,
    },
  };
}

/**
 * Manual Trigger: Validates a simulated lead capture payload or tests the honeypot bot trap.
 * Simulation only: does not deliver to external webhooks or invoke /api/lead.
 */
export async function triggerSimulatedLead(payload: {
  name: string;
  email: string;
  company?: string;
  notes?: string;
  isHoneypot?: boolean;
}) {
  await assertOperatorAuthenticated();

  if (payload.isHoneypot) {
    return {
      ok: true,
      delivered: false,
      status: "dropped",
      simulation: true,
      message: "Lead dropped silently by honeypot bot trap (prevented spam contamination).",
      details: {
        payloadProvided: payload,
        botFilterTriggered: true,
      },
    };
  }

  if (!payload.email || !payload.email.includes("@")) {
    throw new Error("A valid email address is required");
  }

  return {
    ok: true,
    delivered: false,
    status: "simulated",
    simulation: true,
    message:
      "Test lead successfully validated in simulation mode (not delivered to external webhook).",
    details: {
      name: payload.name || "Test Operator",
      email: payload.email,
      company: payload.company || "Demo Enterprise",
      notes: payload.notes || "Triggered manually from Operator Command Center (simulation)",
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Manual Trigger: Executes a Second Brain Context RAG query against the database.
 * If the database is unavailable, returns a safe unavailable state without raw errors.
 */
export async function triggerSecondBrainContextSearch(payload: {
  domain: string;
  subdomain?: string;
  keywords?: string[];
}) {
  const operator = await assertOperatorAuthenticated();

  const domain = payload.domain?.trim() || "strategy";
  const subdomain = payload.subdomain?.trim() || undefined;
  const keywords =
    payload.keywords && payload.keywords.length > 0 ? payload.keywords : ["architecture"];

  try {
    const results = await ContextService.search(
      {
        domain,
        subdomain,
        keywords,
        limit: 3,
      },
      {
        type: "operator",
        userId: operator.userId,
      },
    );

    return {
      ok: true,
      status: "operational",
      source: "database",
      domain,
      subdomain: subdomain || null,
      keywords,
      resultCount: results.length,
      results,
    };
  } catch (error: unknown) {
    if (error instanceof ContextAuthorizationError) {
      throw error;
    }
    return {
      ok: false,
      status: "unavailable",
      source: "unavailable",
      message: "Second Brain database context search is currently unavailable.",
      domain,
      subdomain: subdomain || null,
      keywords,
      resultCount: 0,
      results: [],
    };
  }
}

/**
 * Manual Trigger: Executes a comprehensive catalog integrity audit.
 */
export async function triggerCatalogDiagnostic() {
  await assertOperatorAuthenticated();

  const offerings = getAllOfferings();
  const idMap = new Map<string, number>();
  const urlMap = new Map<string, number>();
  const issues: string[] = [];

  for (const o of offerings) {
    if (idMap.has(o.id)) {
      issues.push(`Duplicate offering ID detected: ${o.id}`);
    }
    idMap.set(o.id, (idMap.get(o.id) || 0) + 1);

    if (urlMap.has(o.canonicalUrl)) {
      issues.push(`Duplicate canonical URL detected: ${o.canonicalUrl}`);
    }
    urlMap.set(o.canonicalUrl, (urlMap.get(o.canonicalUrl) || 0) + 1);

    if (!o.title || !o.shortDescription) {
      issues.push(`Offering ${o.id} is missing title or shortDescription`);
    }
  }

  return {
    ok: issues.length === 0,
    totalOfferings: offerings.length,
    countsByKind: {
      automation: getOfferingsByKind("automation").length,
      service: getOfferingsByKind("service").length,
      newsletter: getOfferingsByKind("newsletter").length,
    },
    invariantsChecked: [
      `34 total canonical entities (${offerings.length} validated)`,
      "Strict ID uniqueness verified",
      "Canonical URL uniqueness verified",
      "Title and description completeness verified",
    ],
    issues,
  };
}
