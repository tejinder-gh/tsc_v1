"use client";

/**
 * What: Scroll-reveal wrapper - fades/rises its children into view the first time they
 *       enter the viewport, with an optional stagger delay.
 * Why: Section-by-section reveals make the long marketing pages feel responsive to
 *      scrolling without an animation library.
 * How: IntersectionObserver adds .is-visible once; the hidden initial state is scoped to
 *      .js in globals.css so no-JS visitors (and crawlers) always see full content.
 *      prefers-reduced-motion short-circuits to visible immediately.
 * From Where: UX-engagement pass on the TheSkillCorner site, 2026-06.
 * When: 2026-06.
 */

import { type ReactNode, useEffect, useRef } from "react";

interface RevealProps {
  children: ReactNode;
  /** Transition delay in ms, for staggering grids of cards. */
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
