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
