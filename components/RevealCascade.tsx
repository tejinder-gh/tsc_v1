"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { TRANSITIONS } from "@/lib/motion";

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

interface RevealContainerProps {
  children: ReactNode;
  className?: string;
  elementType?: "div" | "ol" | "ul";
}

export function RevealContainer({
  children,
  className = "",
  elementType = "div",
}: RevealContainerProps) {
  const MotionComponent = motion[elementType as "div"] || motion.div;
  return (
    <MotionComponent
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}

interface RevealItemProps {
  children: ReactNode;
  className?: string;
  elementType?: "div" | "li";
}

export function RevealItem({ children, className = "", elementType = "div" }: RevealItemProps) {
  const MotionComponent = motion[elementType as "div"] || motion.div;
  return (
    <MotionComponent variants={staggerItem} className={className}>
      {children}
    </MotionComponent>
  );
}

export function RevealHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={TRANSITIONS.entry}
      className={className}
    >
      {children}
    </motion.h2>
  );
}
