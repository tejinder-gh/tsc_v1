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
  | "journey_stage_changed";

export interface AnalyticsProps {
  location?: string;
  segment?: string;
  label?: string;
  source?: string;
  intent?: string;
  hasProblemText?: boolean;
  characterBucket?: "<50" | "50-149" | "150+";
  from?: string;
  to?: string;
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
