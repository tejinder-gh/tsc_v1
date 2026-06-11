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
