/**
 * What: Weekly Observability Report schema, contract, and builder.
 * Why: Separates telemetry WRITE paths from telemetry READ paths. Establishes an
 *      evidence-backed contract distinguishing observed facts, calculated operational
 *      ratios, and unavailable metrics without manufacturing synthetic totals.
 * How: Strongly typed contract with explicit status ("observed" | "calculated" | "unavailable").
 *      Returns "unavailable" whenever authoritative backend read paths are not connected.
 * From Where: Observability Foundation Architecture, 2026-09.
 */

export type MetricAvailability = "observed" | "calculated" | "unavailable";

export interface MetricValue<T> {
  status: MetricAvailability;
  value?: T;
  note?: string;
}

export interface GroupedErrorMetric {
  route: string;
  release: string;
  category: string;
  count: number;
}

export interface WeeklyObservabilityReport {
  period: {
    start: string;
    end: string;
  };
  leadDelivery: {
    attempts: MetricValue<number>;
    successes: MetricValue<number>;
    failures: MetricValue<number>;
    // Calculated exclusively from authoritative server delivery: successes / attempts
    deliverySuccessRate: MetricValue<number>;
  };
  errors: {
    clientErrors: MetricValue<GroupedErrorMetric[]>;
    serverErrors: MetricValue<GroupedErrorMetric[]>;
  };
  formOperations: {
    formStarts: MetricValue<number>;
    formCompletions: MetricValue<number>;
    // Coarse operational ratio; NOT a native ordered session funnel
    formCompletionRatio: MetricValue<number>;
  };
  conversions: {
    ctaClicks: MetricValue<number>;
    contactStarted: MetricValue<number>;
    bookingStarted: MetricValue<number>;
    bookingCompleted: MetricValue<number>;
  };
  sessionReplay: {
    sessionsRecorded: MetricValue<number>;
    replayReferences: MetricValue<Array<{ route: string; sessionUrl: string }>>;
  };
  generatedAt: string;
}

/**
 * Creates a truthful report schema instance where metrics lacking an authoritative
 * server read adapter are marked "unavailable" with zero manufactured data.
 */
export function createUnconnectedWeeklyReport(
  startDate: string,
  endDate: string,
): WeeklyObservabilityReport {
  const UNAVAILABLE_NOTE = "Authoritative server read adapter not yet configured";

  return {
    period: {
      start: startDate,
      end: endDate,
    },
    leadDelivery: {
      attempts: { status: "unavailable", note: UNAVAILABLE_NOTE },
      successes: { status: "unavailable", note: UNAVAILABLE_NOTE },
      failures: { status: "unavailable", note: UNAVAILABLE_NOTE },
      deliverySuccessRate: { status: "unavailable", note: UNAVAILABLE_NOTE },
    },
    errors: {
      clientErrors: { status: "unavailable", note: UNAVAILABLE_NOTE },
      serverErrors: { status: "unavailable", note: UNAVAILABLE_NOTE },
    },
    formOperations: {
      formStarts: { status: "unavailable", note: UNAVAILABLE_NOTE },
      formCompletions: { status: "unavailable", note: UNAVAILABLE_NOTE },
      formCompletionRatio: { status: "unavailable", note: UNAVAILABLE_NOTE },
    },
    conversions: {
      ctaClicks: { status: "unavailable", note: UNAVAILABLE_NOTE },
      contactStarted: { status: "unavailable", note: UNAVAILABLE_NOTE },
      bookingStarted: { status: "unavailable", note: UNAVAILABLE_NOTE },
      bookingCompleted: { status: "unavailable", note: UNAVAILABLE_NOTE },
    },
    sessionReplay: {
      sessionsRecorded: { status: "unavailable", note: UNAVAILABLE_NOTE },
      replayReferences: { status: "unavailable", note: UNAVAILABLE_NOTE },
    },
    generatedAt: new Date().toISOString(),
  };
}
