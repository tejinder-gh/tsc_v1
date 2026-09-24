"use client";

/**
 * What: Client telemetry bootstrap and route watcher component.
 * Why: Sets up unhandled browser error listeners, tracks current client route in telemetry
 *      context, and initiates OpenReplay only when allowlisted.
 * How: Renders null; runs inside root layout; fail-open.
 * From Where: Observability Foundation Architecture, 2026-09.
 */

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { captureError, setTelemetryContext, startReplayIfAllowed } from "@/lib/telemetry";
import { initGlitchTip } from "@/lib/telemetry/providers/glitchtip";

export function TelemetryClient() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Initialize GlitchTip error monitoring if enabled
    initGlitchTip();

    // 2. Set current route in telemetry context
    setTelemetryContext({ route: pathname });

    // 3. Conditionally start OpenReplay only if enabled and route is allowlisted
    startReplayIfAllowed(pathname);

    // 4. Attach unhandled error and rejection listeners
    function handleError(event: ErrorEvent) {
      captureError(event.error || new Error(event.message), {
        category: "client_render",
        route: pathname,
      });
    }

    function handleRejection(event: PromiseRejectionEvent) {
      captureError(event.reason, {
        category: "unhandled",
        route: pathname,
      });
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, [pathname]);

  return null;
}
