"use client";

/**
 * What: Framer Motion scroll-reveal primitives - staggered container/item pairs plus
 *       single-element header and block reveals.
 * Why: Replaces the hand-rolled IntersectionObserver Reveal so every scroll animation
 *      shares one motion vocabulary (lib/motion.ts) with orchestrated staggers.
 * How: whileInView variants fire once at a -50px viewport margin. MotionConfig
 *      reducedMotion="user" drops transforms for prefers-reduced-motion users (the global
 *      CSS override cannot reach framer-motion's inline styles). Framer Motion serializes
 *      the hidden state (opacity:0) into SSR HTML, so every animated element carries
 *      data-reveal and globals.css forces it visible when the .js flag never lands
 *      (no-JS visitors and crawlers).
 * From Where: Framer Motion migration of the marketing-site reveals, 2026-06.
 * When: 2026-06.
 */

import { MotionConfig, motion } from "framer-motion";
import type { ReactNode } from "react";
import { TRANSITIONS } from "@/lib/motion";

const VIEWPORT = { once: true, margin: "-50px" } as const;

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // 50ms stagger
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: TRANSITIONS.entry,
  },
};

const containerTags = {
  div: motion.div,
  ol: motion.ol,
  ul: motion.ul,
} as const;

const itemTags = {
  div: motion.div,
  li: motion.li,
} as const;

interface RevealContainerProps {
  children: ReactNode;
  className?: string;
  elementType?: keyof typeof containerTags;
}

export function RevealContainer({
  children,
  className = "",
  elementType = "div",
}: RevealContainerProps) {
  const MotionComponent = containerTags[elementType];
  return (
    <MotionConfig reducedMotion="user">
      <MotionComponent
        data-reveal
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className={className}
      >
        {children}
      </MotionComponent>
    </MotionConfig>
  );
}

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  elementType?: keyof typeof itemTags;
}

/** Must be rendered inside a RevealContainer; variants propagate from the parent. */
export function RevealItem({ children, className = "", elementType = "div" }: RevealItemProps) {
  const MotionComponent = itemTags[elementType];
  return (
    <MotionComponent data-reveal variants={staggerItem} className={className}>
      {children}
    </MotionComponent>
  );
}

interface RevealChildProps {
  children: ReactNode;
  className?: string;
}

export function RevealHeader({ children, className = "" }: RevealChildProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.h2
        data-reveal
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={TRANSITIONS.entry}
        className={className}
      >
        {children}
      </motion.h2>
    </MotionConfig>
  );
}

/** Single fade-up block for intro copy that is more than a lone heading. */
export function RevealBlock({ children, className = "" }: RevealChildProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        data-reveal
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={TRANSITIONS.entry}
        className={className}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
