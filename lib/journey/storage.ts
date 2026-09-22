import { validateJourneyContext } from "./schema";
import type { JourneyContext } from "./types";

export const JOURNEY_STORAGE_KEY = "tsc:journey:v1";

/**
 * Safely loads persisted journey context from localStorage/sessionStorage.
 * Returns null if running on server, storage is unavailable, or data is invalid.
 */
export function loadPersistedJourney(): JourneyContext | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(JOURNEY_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    const validated = validateJourneyContext(parsed);
    if (!validated) {
      // Discard invalid or corrupted data
      window.localStorage.removeItem(JOURNEY_STORAGE_KEY);
      return null;
    }
    return validated;
  } catch {
    // Graceful fallback for privacy mode or storage read exceptions
    return null;
  }
}

/**
 * Persists journey context to localStorage.
 * Only called after meaningful interaction (intent selection, problem submission, stage progression).
 */
export function savePersistedJourney(context: JourneyContext): void {
  if (typeof window === "undefined") {
    return;
  }

  // Only persist once interaction has actually happened (beyond blank 'new' initial state)
  const isBlankInitial =
    context.stage === "new" &&
    !context.intent &&
    !context.freeformProblem &&
    context.problems.length === 0 &&
    !context.createdAt &&
    !context.updatedAt;

  if (isBlankInitial) {
    return;
  }

  try {
    window.localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(context));
  } catch {
    // Gracefully handle storage quota or permissions failures
  }
}

/**
 * Clears persisted journey storage.
 */
export function clearPersistedJourney(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(JOURNEY_STORAGE_KEY);
  } catch {
    // Swallowed safely
  }
}
