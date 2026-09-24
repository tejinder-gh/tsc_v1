/**
 * What: Plausible Community Edition (CE) adapter.
 * Why: Dispatches vendor-neutral semantic events to self-hosted Plausible CE
 *      without coupling application components to vendor globals.
 * How: Verifies strict explicit self-hosted configuration (no cloud fallbacks);
 *      sanitizes event props and invokes window.plausible safely.
 * From Where: Observability Foundation Architecture, 2026-09.
 */

import { getTelemetryConfig } from "../config";
import { sanitizeObject } from "../scrubber";
import type { TelemetryEvent, TelemetryProps } from "../types";

interface PlausibleWindow extends Window {
  plausible?: (
    event: string,
    options?: {
      props?: Record<string, string | number | boolean>;
      callback?: () => void;
    },
  ) => void;
  gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
}

export function trackPlausibleEvent(event: TelemetryEvent, props?: TelemetryProps): void {
  if (typeof window === "undefined") return;

  const config = getTelemetryConfig();

  // Plausible CE path: strictly requires analytics enabled AND self-hosted configuration
  if (config.analytics.enabled && config.analytics.domain && config.analytics.scriptUrl) {
    const w = window as unknown as PlausibleWindow;
    if (typeof w.plausible === "function") {
      try {
        const sanitizedProps = props
          ? (sanitizeObject(props) as Record<string, string | number | boolean>)
          : undefined;
        w.plausible(event, { props: sanitizedProps });
      } catch {
        // Analytics must never throw or break UI interactions
      }
    }
  }

  // GA4 path: strictly requires explicit ga.enabled flag; NEVER an implicit fallback
  if (config.ga.enabled && config.ga.measurementId) {
    const w = window as unknown as PlausibleWindow;
    if (typeof w.gtag === "function") {
      try {
        const sanitizedProps = props
          ? (sanitizeObject(props) as Record<string, unknown>)
          : undefined;
        w.gtag("event", event, sanitizedProps);
      } catch {
        // Fail-open
      }
    }
  }
}
