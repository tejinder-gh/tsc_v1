"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

export function LiveSystemExample() {
  const shouldReduceMotion = useReducedMotion();
  const [mobileExpanded, setMobileExpanded] = useState(false);

  // Motion timing: panel (0s) -> incoming call (0.4s) -> transition annotation (0.9s) -> action (1.4s) -> metrics (1.9s)
  const itemVariant = (delay: number) => ({
    hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.35,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  });

  return (
    <div className="w-full">
      {/* Desktop / Tablet Full System Event Log */}
      <div className="hidden sm:block rounded-[6px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] p-6 lg:p-7 shadow-[0_4px_20px_rgba(18,19,15,0.04)] font-geist">
        {/* Terminal / System Header */}
        <div className="flex items-center justify-between border-b border-[var(--tsc-line)] pb-4 text-xs font-mono tracking-wider text-[var(--tsc-muted)] uppercase">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full bg-[var(--tsc-positive)] ring-4 ring-[var(--tsc-positive)]/15"
              aria-hidden="true"
            />
            <span className="font-semibold text-[var(--tsc-ink)]">LIVE SYSTEM</span>
          </div>
          <div>RESTAURANT / 19:42</div>
        </div>

        {/* Narrative Headline */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariant(0.1)}
          className="mt-5 text-[22px] lg:text-[26px] font-semibold leading-[1.2] tracking-tight text-[var(--tsc-ink)]"
        >
          A missed call becomes
          <br />a confirmed table.
        </motion.div>

        {/* Event Timeline */}
        <div className="mt-6 space-y-4">
          {/* Step 1: Incoming Call */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariant(0.4)}
            className="rounded-[4px] border border-[var(--tsc-line)] bg-white p-4"
          >
            <div className="text-[11px] font-mono tracking-wider text-[var(--tsc-muted)] uppercase">
              19:42:03 • INCOMING CALL
            </div>
            <div className="mt-2 text-sm text-[var(--tsc-ink)] leading-relaxed italic">
              &ldquo;Table for four around 8:30 — do you have anything?&rdquo;
            </div>
          </motion.div>

          {/* Transition Annotation */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariant(0.9)}
            className="flex items-center gap-3 px-2 text-xs font-mono text-[var(--tsc-muted)]"
          >
            <div className="h-4 w-px bg-[var(--tsc-line)] ml-4" aria-hidden="true" />
            <div className="flex items-center gap-1.5 text-[11px] tracking-tight">
              <span className="text-[var(--tsc-ink)] font-medium">↓</span>
              <span>intent recognized · availability checked</span>
            </div>
          </motion.div>

          {/* Step 2: Action Executed */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariant(1.4)}
            className="rounded-[4px] border border-[var(--tsc-line)] bg-white p-4"
          >
            <div className="text-[11px] font-mono tracking-wider text-[var(--tsc-muted)] uppercase flex items-center justify-between">
              <span>19:42:11 • ACTION</span>
              <span className="text-[10px] text-[var(--tsc-positive)] font-semibold uppercase tracking-widest bg-[var(--tsc-positive)]/10 px-1.5 py-0.5 rounded">
                COMPLETED
              </span>
            </div>
            <div className="mt-2 text-sm font-medium text-[var(--tsc-ink)] leading-relaxed">
              Reservation created for 4 at 8:30 PM.
              <br />
              <span className="text-[13px] font-normal text-[var(--tsc-muted)]">
                Confirmation text sent.
              </span>
            </div>
          </motion.div>
        </div>

        {/* Metrics Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariant(1.9)}
          className="mt-6 grid grid-cols-2 gap-4 border-t border-[var(--tsc-line)] pt-5 font-mono"
        >
          <div>
            <div className="text-2xl font-bold tracking-tight text-[var(--tsc-ink)]">11 sec</div>
            <div className="mt-0.5 text-[10px] tracking-wider text-[var(--tsc-muted)] uppercase">
              CALL → BOOKING
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-[var(--tsc-ink)]">0</div>
            <div className="mt-0.5 text-[10px] tracking-wider text-[var(--tsc-muted)] uppercase">
              STAFF INTERRUPTIONS
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Condensed Preview (Section 18) */}
      <div className="sm:hidden rounded-[6px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] p-4 font-geist">
        <div className="flex items-center justify-between text-xs font-mono tracking-wider text-[var(--tsc-muted)] uppercase">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--tsc-positive)]"
              aria-hidden="true"
            />
            <span className="font-semibold text-[var(--tsc-ink)] text-[11px]">LIVE SYSTEM</span>
          </div>
          <span className="text-[10px]">RESTAURANT / 19:42</span>
        </div>

        <div className="mt-2 text-base font-semibold text-[var(--tsc-ink)]">
          A missed call becomes a confirmed table.
        </div>

        {/* Condensed flow */}
        <div className="mt-3 rounded-[4px] border border-[var(--tsc-line)] bg-white p-3 text-xs font-mono space-y-1.5">
          <div className="text-[var(--tsc-muted)] flex items-center justify-between">
            <span>Incoming call</span>
            <span className="text-[10px]">19:42:03</span>
          </div>
          <div className="text-[var(--tsc-ink)] text-[11px] pl-2 border-l border-[var(--tsc-line)]">
            Availability checked
          </div>
          <div className="text-[var(--tsc-positive)] font-medium flex items-center justify-between pt-0.5">
            <span>Reservation confirmed</span>
            <span className="text-[10px]">19:42:11</span>
          </div>
        </div>

        {/* Mobile metrics */}
        <div className="mt-3 flex items-center justify-between border-t border-[var(--tsc-line)] pt-2.5 text-[11px] font-mono text-[var(--tsc-muted)]">
          <span>
            <strong className="text-[var(--tsc-ink)] font-bold">11 sec</strong> · Call to booking
          </span>
          <span>
            <strong className="text-[var(--tsc-ink)] font-bold">0</strong> staff interrupts
          </span>
        </div>

        {/* Optional expand for details */}
        {mobileExpanded ? (
          <div className="mt-3 pt-3 border-t border-[var(--tsc-line)] text-xs text-[var(--tsc-muted)] space-y-2">
            <p className="italic text-[var(--tsc-ink)]">
              &ldquo;Table for four around 8:30 — do you have anything?&rdquo;
            </p>
            <p>
              Autonomous voice intake confirmed open table in reservation software and dispatched
              SMS confirmation without cashier or front-of-house intervention.
            </p>
            <button
              type="button"
              onClick={() => setMobileExpanded(false)}
              className="text-[11px] font-mono text-[var(--tsc-action)] hover:underline pt-1 block"
            >
              Hide details ↑
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setMobileExpanded(true)}
            className="mt-2 text-[11px] font-mono text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)] block w-full text-center py-1"
          >
            Show full log details ↓
          </button>
        )}
      </div>
    </div>
  );
}
