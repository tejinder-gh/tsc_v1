/**
 * What: Thin analytics wrapper - fires named events to Plausible or GA4, whichever is configured.
 * Why: The brief requires an event on every CTA click and form submit (cta_clicked /
 *      lead_captured with location + segment) without coupling components to a vendor.
 * How: Detects window.plausible or window.gtag at call time; no-ops on the server or when
 *      no provider is configured, so components can call it unconditionally.
 * From Where: TheSkillCorner marketing site build brief (analytics spec), 2026-06.
 * When: 2026-06; revisit if a second provider or server-side events are added.
 */

export type AnalyticsEvent =
  | "cta_clicked"
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

export interface AnalyticsProps {
  location?: string;
  segment?: string;
  label?: string;
  source?: string;
  intent?: string;
  focus?: string;
  situation?: string;
  primaryOpportunity?: string;
  secondaryOpportunity?: string;
  deferredOpportunity?: string;
  hasProblemText?: boolean;
  characterBucket?: "<50" | "50-149" | "150+";
  from?: string;
  to?: string;
  opportunityId?: string;
  archetype?: string;
  scenario?: string;
  [key: string]: string | number | boolean | undefined;
}

interface AnalyticsWindow {
  plausible?: (event: string, options: { props: Record<string, string> }) => void;
  gtag?: (command: "event", event: string, props: Record<string, string>) => void;
}

export function track(event: AnalyticsEvent, props: AnalyticsProps): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as AnalyticsWindow;
  const flat: Record<string, string> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v !== undefined) {
      flat[k] = String(v);
    }
  }
  try {
    if (w.plausible) w.plausible(event, { props: flat });
    if (w.gtag) w.gtag("event", event, flat);
  } catch {
    // Analytics must never break the page; failures are intentionally swallowed.
  }
}
