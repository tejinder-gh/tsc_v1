"use client";

/**
 * What: Hook that tweens a displayed number toward its target value (ease-out cubic).
 * Why: The ROI calculator's annual figure feels alive when it counts toward the new
 *      value as sliders move, instead of snapping - it is the signature element.
 * How: requestAnimationFrame loop over ~350ms from the previously displayed value;
 *      cancelled on re-render or unmount. prefers-reduced-motion jumps instantly.
 * From Where: UX-engagement pass on the TheSkillCorner site, 2026-06.
 * When: 2026-06.
 */

import { useEffect, useRef, useState } from "react";

export function useAnimatedNumber(target: number, durationMs = 350): number {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fromRef.current = target;
      setDisplay(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - t) ** 3;
      const value = Math.round(from + (target - from) * eased);
      fromRef.current = value;
      setDisplay(value);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return display;
}
