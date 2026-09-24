/**
 * What: Telemetry type definitions for TheSkillCorner observability foundation.
 * Why: Centralizing event names, property constraints, and error categories ensures
 *      consistent, typed, and PII-free telemetry across product code and vendor adapters.
 * How: Declares canonical events, allowed property values (strictly non-PII, no payment data),
 *      error category taxonomies, and provider status contracts.
 * From Where: Observability Foundation Architecture (Plausible CE, GlitchTip, OpenReplay), 2026-09.
 */

/**
 * Semantic event names supported across the platform.
 * Follows an engine-neutral taxonomy so any telemetry collector can consume them.
 */
export type TelemetryEvent =
  // Form lifecycle
  | "form_started"
  | "form_completed"
  // Lead submission & delivery lifecycle (distinct client submit vs server delivery)
  | "lead_submit_attempted"
  | "lead_submit_accepted"
  | "lead_delivery_succeeded"
  | "lead_delivery_failed"
  // Interactions & conversions
  | "cta_clicked"
  | "contact_started"
  | "booking_viewed"
  | "booking_started"
  | "booking_completed"
  // Legacy & preserved journey events (for backward compatibility)
  | "lead_captured"
  | "journey_started"
  | "journey_intent_selected"
  | "journey_problem_entered"
  | "journey_stage_changed"
  | "journey_context_focus_selected"
  | "journey_context_situation_selected"
  | "journey_context_completed"
  | "journey_opportunity_viewed"
  | "journey_opportunity_solution_started"
  | "journey_context_reviewed"
  | "journey_demonstration_viewed"
  | "journey_demonstration_started"
  | "journey_demonstration_scenario_changed"
  | "journey_demonstration_completed"
  | "journey_demonstration_returned_to_opportunity";

/**
 * Prohibited properties denylist: Payment data, credit card numbers, personal contact details,
 * or free-text inputs MUST NOT be passed into event properties.
 */
export type ProhibitedTelemetryKey =
  | "creditCard"
  | "cardNumber"
  | "card"
  | "cvv"
  | "pan"
  | "expiry"
  | "email"
  | "phone"
  | "name"
  | "message"
  | "password"
  | "token"
  | "secret";

/**
 * Allowed event properties map. Primitive scalar values only.
 */
export type TelemetryProps = Record<string, string | number | boolean | null | undefined>;

/**
 * Safe error categorization tags for GlitchTip / Sentry.
 */
export type ErrorCategory =
  | "network"
  | "validation"
  | "server"
  | "client_render"
  | "unhandled"
  | "webhook"
  | "lead_delivery"
  | "rate_limit"
  | "auth";

/**
 * Telemetry error capture context.
 */
export interface ErrorCaptureContext {
  category?: ErrorCategory;
  route?: string;
  correlationId?: string;
  release?: string;
  extra?: Record<string, unknown>;
}

/**
 * Global telemetry runtime context.
 */
export interface TelemetryContext {
  route?: string;
  release?: string;
  environment?: string;
  correlationId?: string;
}

/**
 * Operational telemetry status returned for dashboard and diagnostics.
 */
export interface TelemetryProviderStatus {
  enabled: boolean;
  configured: boolean;
  status: "configured" | "unverified" | "unavailable";
  endpointOrDomain?: string;
  details?: string;
}

export interface TelemetryStatus {
  analytics: TelemetryProviderStatus;
  errorMonitoring: TelemetryProviderStatus;
  sessionReplay: TelemetryProviderStatus;
  releaseId: string;
  environment: string;
}
