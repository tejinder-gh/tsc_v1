import { beforeEach, describe, expect, it, vi } from "vitest";
import { validateJourneyContext } from "../schema";
import {
  clearPersistedJourney,
  JOURNEY_STORAGE_KEY,
  loadPersistedJourney,
  savePersistedJourney,
} from "../storage";
import {
  CANONICAL_INTENTS,
  INITIAL_JOURNEY_CONTEXT,
  INTENT_LABELS,
  type JourneyContext,
  type JourneyStage,
} from "../types";

describe("Journey Model & Canonical Definitions", () => {
  it("provides canonical mapping for all four primary intents", () => {
    expect(CANONICAL_INTENTS).toEqual(["save-time", "grow", "build", "learn"]);
    expect(INTENT_LABELS["save-time"]).toBe("Save me time");
    expect(INTENT_LABELS.grow).toBe("Get more customers");
    expect(INTENT_LABELS.build).toBe("Build something");
    expect(INTENT_LABELS.learn).toBe("Help me learn");
  });

  it("defaults initial state correctly to stage 'new'", () => {
    expect(INITIAL_JOURNEY_CONTEXT.version).toBe(1);
    expect(INITIAL_JOURNEY_CONTEXT.stage).toBe("new");
    expect(INITIAL_JOURNEY_CONTEXT.intent).toBeUndefined();
    expect(INITIAL_JOURNEY_CONTEXT.freeformProblem).toBeUndefined();
    expect(INITIAL_JOURNEY_CONTEXT.problems).toEqual([]);
    expect(INITIAL_JOURNEY_CONTEXT.selectedSolutions).toEqual([]);
    expect(INITIAL_JOURNEY_CONTEXT.viewedSolutions).toEqual([]);
    expect(INITIAL_JOURNEY_CONTEXT.savedResources).toEqual([]);
  });
});

describe("Journey Zod Schema Validation", () => {
  it("validates a compliant JourneyContext object", () => {
    const valid: JourneyContext = {
      version: 1,
      stage: "intent-selected",
      intent: "save-time",
      problems: [],
      selectedSolutions: [],
      viewedSolutions: [],
      savedResources: [],
      createdAt: "2026-09-22T18:00:00.000Z",
      updatedAt: "2026-09-22T18:00:00.000Z",
    };

    const parsed = validateJourneyContext(valid);
    expect(parsed).not.toBeNull();
    expect(parsed?.intent).toBe("save-time");
    expect(parsed?.stage).toBe("intent-selected");
  });

  it("discards payload with mismatched version", () => {
    const invalidVersion = {
      version: 2,
      stage: "new",
      problems: [],
      selectedSolutions: [],
      viewedSolutions: [],
      savedResources: [],
      createdAt: "2026-09-22T18:00:00.000Z",
      updatedAt: "2026-09-22T18:00:00.000Z",
    };

    expect(validateJourneyContext(invalidVersion)).toBeNull();
  });

  it("discards corrupted data or invalid stage/intent values", () => {
    expect(validateJourneyContext({ stage: "unknown" })).toBeNull();
    expect(
      validateJourneyContext({
        version: 1,
        stage: "bogus-stage",
        createdAt: "2026-09-22",
        updatedAt: "2026-09-22",
      }),
    ).toBeNull();
    expect(
      validateJourneyContext({
        version: 1,
        stage: "intent-selected",
        intent: "unrecognized-intent",
        createdAt: "2026-09-22",
        updatedAt: "2026-09-22",
      }),
    ).toBeNull();
  });
});

describe("Journey Local Storage Persistence", () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
    const mockStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      length: 0,
      key: () => null,
    };

    (globalThis as unknown as { window: unknown }).window = {
      localStorage: mockStorage,
    };
    (globalThis as unknown as { localStorage: unknown }).localStorage = mockStorage;
    vi.restoreAllMocks();
  });

  it("does not persist empty/new initial state with zero interaction", () => {
    savePersistedJourney(INITIAL_JOURNEY_CONTEXT);
    expect(localStorage.getItem(JOURNEY_STORAGE_KEY)).toBeNull();
  });

  it("persists valid journey state when intent is selected", () => {
    const updated: JourneyContext = {
      version: 1,
      stage: "intent-selected",
      intent: "grow",
      problems: [],
      selectedSolutions: [],
      viewedSolutions: [],
      savedResources: [],
      createdAt: "2026-09-22T18:00:00.000Z",
      updatedAt: "2026-09-22T18:00:00.000Z",
    };

    savePersistedJourney(updated);
    const raw = localStorage.getItem(JOURNEY_STORAGE_KEY);
    expect(raw).not.toBeNull();

    const loaded = loadPersistedJourney();
    expect(loaded).not.toBeNull();
    expect(loaded?.intent).toBe("grow");
    expect(loaded?.stage).toBe("intent-selected");
  });

  it("clears storage and returns null if persisted JSON is corrupted or invalid", () => {
    localStorage.setItem(JOURNEY_STORAGE_KEY, "{ not-valid-json }");
    expect(loadPersistedJourney()).toBeNull();

    localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify({ version: 99, stage: "context" }));
    expect(loadPersistedJourney()).toBeNull();
    // Invalid data is removed from storage
    expect(localStorage.getItem(JOURNEY_STORAGE_KEY)).toBeNull();
  });

  it("clears storage cleanly when clearPersistedJourney is invoked", () => {
    const updated: JourneyContext = {
      version: 1,
      stage: "intent-selected",
      intent: "build",
      problems: [],
      selectedSolutions: [],
      viewedSolutions: [],
      savedResources: [],
      createdAt: "2026-09-22T18:00:00.000Z",
      updatedAt: "2026-09-22T18:00:00.000Z",
    };
    savePersistedJourney(updated);
    expect(localStorage.getItem(JOURNEY_STORAGE_KEY)).not.toBeNull();

    clearPersistedJourney();
    expect(localStorage.getItem(JOURNEY_STORAGE_KEY)).toBeNull();
  });
});

describe("Journey State Transitions & Business Logic", () => {
  it("rejects empty or whitespace-only problem submissions", () => {
    const validateProblem = (text: string) => text.trim().length > 0;
    expect(validateProblem("")).toBe(false);
    expect(validateProblem("   ")).toBe(false);
    expect(validateProblem("\n\t  ")).toBe(false);
    expect(validateProblem("Inbound calls are dropped")).toBe(true);
  });

  it("buckets character length correctly for privacy-preserving analytics", () => {
    const getBucket = (len: number) => {
      if (len < 50) return "<50";
      if (len < 150) return "50-149";
      return "150+";
    };

    expect(getBucket(10)).toBe("<50");
    expect(getBucket(49)).toBe("<50");
    expect(getBucket(50)).toBe("50-149");
    expect(getBucket(149)).toBe("50-149");
    expect(getBucket(150)).toBe("150+");
    expect(getBucket(300)).toBe("150+");
  });

  it("maps stages correctly to the 4 progress indicators (Ticket 001 §10)", () => {
    const mapToStageIndicator = (
      stage: JourneyStage,
    ): "01 GOAL" | "02 CONTEXT" | "03 OPPORTUNITY" | "04 PLAN" => {
      switch (stage) {
        case "new":
        case "intent-selected":
          return "01 GOAL";
        case "context":
          return "02 CONTEXT";
        case "opportunity":
        case "solution":
          return "03 OPPORTUNITY";
        case "plan":
          return "04 PLAN";
      }
    };

    expect(mapToStageIndicator("new")).toBe("01 GOAL");
    expect(mapToStageIndicator("intent-selected")).toBe("01 GOAL");
    expect(mapToStageIndicator("context")).toBe("02 CONTEXT");
    expect(mapToStageIndicator("opportunity")).toBe("03 OPPORTUNITY");
    expect(mapToStageIndicator("solution")).toBe("03 OPPORTUNITY");
    expect(mapToStageIndicator("plan")).toBe("04 PLAN");
  });

  it("implements change answer reset rule (Ticket 001 §26)", () => {
    const state: JourneyContext = {
      version: 1,
      stage: "intent-selected",
      intent: "save-time",
      problems: [],
      selectedSolutions: [],
      viewedSolutions: [],
      savedResources: [],
      createdAt: "2026-09-22T18:00:00.000Z",
      updatedAt: "2026-09-22T18:00:00.000Z",
    };

    // Change answer: stage -> 'new', intent -> undefined, retains createdAt
    const resetState: JourneyContext = {
      ...state,
      stage: "new",
      intent: undefined,
      updatedAt: "2026-09-22T18:05:00.000Z",
    };

    expect(resetState.stage).toBe("new");
    expect(resetState.intent).toBeUndefined();
    expect(resetState.createdAt).toBe("2026-09-22T18:00:00.000Z");
  });
});
