"use client";

/**
 * What: Invisible helper that sets the session segment when a visitor lands on a
 *       segment-specific page (e.g. ad traffic straight into /for/dental-offices).
 * Why: Industry pages are the ad-traffic engine; a visitor who lands there has
 *      self-identified, so the rest of the site should personalize without them
 *      touching the home-page router.
 * How: Calls setSegment once on mount; renders nothing. Never overwrites an existing
 *      explicit choice with a different value silently - last page visited wins, which
 *      matches how visitors actually browse.
 * From Where: TheSkillCorner marketing site build brief (segment persistence), 2026-06.
 * When: 2026-06.
 */

import { useEffect } from "react";
import type { Segment } from "@/content/site";
import { useSegment } from "@/lib/segment-context";

export function SetSegment({ segment }: { segment: Segment }) {
  const { setSegment } = useSegment();

  useEffect(() => {
    setSegment(segment);
  }, [segment, setSegment]);

  return null;
}
