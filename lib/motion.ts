/**
 * What: Shared Framer Motion transition tokens - entry/exit easings, micro-interactions,
 *       and a click spring.
 * Why: Every animated component pulling from one vocabulary keeps motion consistent and
 *      makes timing tweaks a one-file change.
 * How: Plain const transitions consumed by RevealCascade and any future motion component.
 *      Entry uses an ease-out-quint-style curve; exit is the steeper inverse.
 * From Where: Framer Motion migration of the marketing-site reveals, 2026-06.
 * When: 2026-06.
 */

import type { Transition } from "framer-motion";

export const TRANSITIONS = {
  entry: {
    type: "tween",
    ease: [0.16, 1, 0.3, 1],
    duration: 0.4,
  } as Transition,
  exit: {
    type: "tween",
    ease: [0.7, 0, 0.84, 0],
    duration: 0.3,
  } as Transition,
  micro: {
    type: "tween",
    ease: [0.16, 1, 0.3, 1],
    duration: 0.15,
  } as Transition,
  springClick: {
    type: "spring",
    stiffness: 400,
    damping: 25,
  } as Transition,
};
