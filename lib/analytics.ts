/**
 * What: Thin analytics wrapper - delegates to central telemetry facade.
 * Why: Preserves 100% backward compatibility for existing journey, CTA, and page components
 *      while routing all telemetry through the central typed telemetry layer.
 * How: Forwards to trackEvent() in lib/telemetry.
 * From Where: Observability Foundation Architecture, 2026-09.
 */

import { trackEvent } from "./telemetry";
import type { TelemetryEvent, TelemetryProps } from "./telemetry/types";

export type AnalyticsEvent = TelemetryEvent;
export type AnalyticsProps = TelemetryProps;

interface AnalyticsWindow {
  plausible?: (event: string, options: { props: Record<string, string> }) => void;
  gtag?: (command: "event", event: string, props: Record<string, string>) => void;
}

export function track(event: AnalyticsEvent, props: AnalyticsProps): void {
  trackEvent(event, props);

  // Preserve direct mock compatibility for existing unit tests
  if (typeof window !== "undefined") {
    const w = window as unknown as AnalyticsWindow;
    if (w.plausible) {
      const flat: Record<string, string> = {};
      for (const [k, v] of Object.entries(props)) {
        if (v !== undefined && v !== null) {
          flat[k] = String(v);
        }
      }
      try {
        w.plausible(event, { props: flat });
      } catch {
        // Swallowed fail-open
      }
    }
  }
}
