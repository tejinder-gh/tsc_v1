import { describe, expect, it } from "vitest";
import { createUnconnectedWeeklyReport } from "../report";

describe("Weekly Observability Report Contract", () => {
  it("creates a truthful report where unconnected metrics report unavailable status", () => {
    const report = createUnconnectedWeeklyReport("2026-09-01", "2026-09-07");

    expect(report.period.start).toBe("2026-09-01");
    expect(report.period.end).toBe("2026-09-07");

    // Lead delivery metrics must be unavailable without authoritative read adapter
    expect(report.leadDelivery.attempts.status).toBe("unavailable");
    expect(report.leadDelivery.successes.status).toBe("unavailable");
    expect(report.leadDelivery.failures.status).toBe("unavailable");
    expect(report.leadDelivery.deliverySuccessRate.status).toBe("unavailable");
    expect(report.leadDelivery.attempts.value).toBeUndefined();

    // Error telemetry must be unavailable
    expect(report.errors.clientErrors.status).toBe("unavailable");
    expect(report.errors.serverErrors.status).toBe("unavailable");

    // Form operations must be unavailable
    expect(report.formOperations.formStarts.status).toBe("unavailable");
    expect(report.formOperations.formCompletions.status).toBe("unavailable");
    expect(report.formOperations.formCompletionRatio.status).toBe("unavailable");

    // Conversions must be unavailable
    expect(report.conversions.ctaClicks.status).toBe("unavailable");
    expect(report.conversions.contactStarted.status).toBe("unavailable");
    expect(report.conversions.bookingStarted.status).toBe("unavailable");
    expect(report.conversions.bookingCompleted.status).toBe("unavailable");

    // Replays must be unavailable
    expect(report.sessionReplay.sessionsRecorded.status).toBe("unavailable");
    expect(report.sessionReplay.replayReferences.status).toBe("unavailable");
  });

  it("never manufactures synthetic health scores or fake totals", () => {
    const report = createUnconnectedWeeklyReport("2026-09-01", "2026-09-07");

    // Report must not have any numeric fabrication when status is unavailable
    const values = [
      report.leadDelivery.attempts.value,
      report.leadDelivery.successes.value,
      report.leadDelivery.failures.value,
      report.leadDelivery.deliverySuccessRate.value,
      report.formOperations.formStarts.value,
      report.formOperations.formCompletions.value,
      report.formOperations.formCompletionRatio.value,
      report.conversions.ctaClicks.value,
    ];

    for (const val of values) {
      expect(val).toBeUndefined();
    }
  });
});
