"use client";

/**
 * What: React context for the visitor's audience segment ("local" | "practice"),
 *       persisted in sessionStorage.
 * Why: The segment router on the home page personalizes testimonials, problems, and
 *      pricing anchors everywhere else; the brief mandates sessionStorage (never
 *      localStorage) so personalization resets per visit.
 * How: Provider hydrates from sessionStorage after mount (SSR-safe: server renders the
 *      neutral state); setSegment writes state + storage. Consumers re-render on change.
 * From Where: TheSkillCorner marketing site build brief (segmentation spec), 2026-06.
 * When: 2026-06; revisit if segments grow beyond two.
 */

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import type { Segment } from "@/content/site";

const STORAGE_KEY = "tsc_segment";

interface SegmentContextValue {
  segment: Segment | null;
  setSegment: (segment: Segment) => void;
}

const SegmentContext = createContext<SegmentContextValue>({
  segment: null,
  setSegment: () => undefined,
});

function readStoredSegment(): Segment | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw === "local" || raw === "practice" ? raw : null;
  } catch {
    return null;
  }
}

export function SegmentProvider({ children }: { children: ReactNode }) {
  const [segment, setSegmentState] = useState<Segment | null>(null);

  useEffect(() => {
    const stored = readStoredSegment();
    if (stored) setSegmentState(stored);
  }, []);

  const setSegment = useCallback((next: Segment) => {
    setSegmentState(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private-mode storage failures degrade to in-memory state only.
    }
  }, []);

  return (
    <SegmentContext.Provider value={{ segment, setSegment }}>{children}</SegmentContext.Provider>
  );
}

export function useSegment(): SegmentContextValue {
  return useContext(SegmentContext);
}
