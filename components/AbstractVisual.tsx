/**
 * What: Decorative abstract "automation network" graphics - one variant per page hero
 *       (nodes, orbits, pipelines, stacked checklist cards) built from divs and SVG paths.
 * Why: The heroes needed a visual anchor without stock imagery; abstract node graphs sell
 *      "systems quietly working" while staying on the slate/teal palette.
 * How: Pure server component; a small render function per variant keeps each under the
 *      function-size limit. All output is aria-hidden (wrapper and SVGs) since it carries
 *      no information. Entry uses the shared hero-reveal CSS animation; ambient motion is
 *      CSS-only (pulse/spin), so prefers-reduced-motion disables it globally.
 * From Where: Slate/teal design refresh of the marketing site, 2026-06.
 * When: 2026-06.
 */

import type { ReactNode } from "react";

export type AbstractVisualVariant =
  | "home"
  | "services"
  | "for"
  | "about"
  | "contact"
  | "book"
  | "checklist";

interface AbstractVisualProps {
  variant: AbstractVisualVariant;
  className?: string;
  /** hero-reveal animation-delay; defaults to landing after the hero copy cascade. */
  delay?: string;
}

/** Loose mesh of connected nodes - the "whole business automated" picture. */
function HomeVisual() {
  return (
    <div className="relative w-full max-w-md aspect-square">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full stroke-slate-200"
        fill="none"
        viewBox="0 0 400 400"
      >
        <path
          d="M 100 100 C 100 250, 300 150, 300 300"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-[pulse_4s_ease-in-out_infinite] stroke-ledger/30"
        />
        <path
          d="M 300 100 C 300 250, 100 150, 100 300"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-[pulse_4s_ease-in-out_infinite_1s] stroke-accent/30"
        />
      </svg>

      <div className="absolute top-[10%] left-[10%] flex h-16 w-16 items-center justify-center rounded-2xl border border-white/40 bg-white/60 shadow-lg backdrop-blur-md">
        <div className="h-4 w-4 rounded-full bg-ledger/80" />
      </div>
      <div className="absolute top-[15%] right-[10%] flex h-14 w-14 items-center justify-center rounded-2xl border border-white/40 bg-white/60 shadow-lg backdrop-blur-md">
        <div className="h-3 w-3 rounded-full bg-slate-300" />
      </div>
      <div className="absolute top-[45%] left-[40%] flex h-20 w-20 items-center justify-center rounded-3xl border border-white/50 bg-white/80 shadow-xl backdrop-blur-md">
        <div className="h-6 w-6 animate-pulse rounded-full bg-accent" />
      </div>
      <div className="absolute bottom-[10%] left-[15%] flex h-14 w-14 items-center justify-center rounded-2xl border border-white/40 bg-white/60 shadow-lg backdrop-blur-md">
        <div className="h-3 w-3 rounded-full bg-slate-300" />
      </div>
      <div className="absolute bottom-[15%] right-[15%] flex h-16 w-16 items-center justify-center rounded-2xl border border-white/40 bg-white/60 shadow-lg backdrop-blur-md">
        <div className="h-4 w-4 rounded-full bg-ledger/80" />
      </div>

      <div className="absolute -z-10 top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ledger/5 blur-3xl" />
    </div>
  );
}

/** Hub and spoke - one engine fanning out to the six service builds. */
function ServicesVisual() {
  return (
    <div className="relative w-full max-w-md aspect-square">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full stroke-slate-200"
        fill="none"
        viewBox="0 0 400 400"
      >
        <circle
          cx="200"
          cy="200"
          r="120"
          strokeWidth="1"
          strokeDasharray="4 4"
          className="animate-[spin_20s_linear_infinite] stroke-ledger/20 origin-center"
        />
        <path
          d="M 200 200 L 200 80"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-[pulse_3s_ease-in-out_infinite] stroke-ledger/40"
        />
        <path
          d="M 200 200 L 304 260"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-[pulse_3s_ease-in-out_infinite_1s] stroke-accent/40"
        />
        <path
          d="M 200 200 L 96 260"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-[pulse_3s_ease-in-out_infinite_2s] stroke-ledger/40"
        />
      </svg>

      <div className="absolute top-[50%] left-[50%] flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl border border-white/50 bg-white/80 shadow-xl backdrop-blur-md">
        <div className="h-8 w-8 animate-pulse rounded-full bg-accent" />
      </div>
      <div className="absolute top-[20%] left-[50%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/40 bg-white/60 shadow-lg backdrop-blur-md">
        <div className="h-3 w-3 rounded-full bg-ledger" />
      </div>
      <div className="absolute top-[65%] left-[76%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/40 bg-white/60 shadow-lg backdrop-blur-md">
        <div className="h-3 w-3 rounded-full bg-ledger" />
      </div>
      <div className="absolute top-[65%] left-[24%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/40 bg-white/60 shadow-lg backdrop-blur-md">
        <div className="h-3 w-3 rounded-full bg-slate-300" />
      </div>

      <div className="absolute -z-10 top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ledger/5 blur-3xl" />
    </div>
  );
}

/** Branching tree - one engineering core adapted per industry. */
function IndustriesVisual() {
  return (
    <div className="relative w-full max-w-md aspect-square">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full stroke-slate-200"
        fill="none"
        viewBox="0 0 400 400"
      >
        <path
          d="M 50 200 C 150 200, 150 80, 250 80"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-[pulse_3s_ease-in-out_infinite] stroke-ledger/30"
        />
        <path
          d="M 50 200 C 150 200, 150 200, 250 200"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-[pulse_3s_ease-in-out_infinite_0.5s] stroke-accent/40"
        />
        <path
          d="M 50 200 C 150 200, 150 320, 250 320"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-[pulse_3s_ease-in-out_infinite_1s] stroke-ledger/30"
        />
      </svg>

      <div className="absolute top-[50%] left-[12.5%] flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl border border-white/50 bg-white/80 shadow-xl backdrop-blur-md">
        <div className="h-6 w-6 animate-pulse rounded-full bg-accent" />
      </div>
      <div className="absolute top-[20%] left-[62.5%] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/40 bg-white/60 shadow-lg backdrop-blur-md">
        <div className="h-4 w-4 rounded-full bg-ledger" />
      </div>
      <div className="absolute top-[50%] left-[62.5%] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/40 bg-white/60 shadow-lg backdrop-blur-md">
        <div className="h-4 w-4 rounded-full bg-ledger" />
      </div>
      <div className="absolute top-[80%] left-[62.5%] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/40 bg-white/60 shadow-lg backdrop-blur-md">
        <div className="h-4 w-4 rounded-full bg-slate-300" />
      </div>

      <div className="absolute -z-10 top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ledger/5 blur-3xl" />
    </div>
  );
}

/** Orbiting rings around a pulsing core - the engine that keeps running. */
function AboutVisual() {
  return (
    <div className="relative w-full max-w-sm aspect-square">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full stroke-slate-200"
        fill="none"
        viewBox="0 0 400 400"
      >
        <circle
          cx="200"
          cy="200"
          r="160"
          strokeWidth="1"
          strokeDasharray="2 6"
          className="animate-[spin_30s_linear_infinite] stroke-ledger/30 origin-center"
        />
        <circle
          cx="200"
          cy="200"
          r="100"
          strokeWidth="1"
          strokeDasharray="4 4"
          className="animate-[spin_20s_linear_infinite_reverse] stroke-accent/40 origin-center"
        />
      </svg>

      <div className="absolute top-[10%] left-[50%] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/40 bg-white/60 shadow-lg backdrop-blur-md">
        <div className="h-2 w-2 rounded-full bg-ledger" />
      </div>
      <div className="absolute top-[50%] left-[10%] flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-white/40 bg-white/60 shadow-lg backdrop-blur-md">
        <div className="h-2 w-2 rounded-full bg-slate-400" />
      </div>
      <div className="absolute top-[90%] left-[50%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/40 bg-white/60 shadow-lg backdrop-blur-md">
        <div className="h-3 w-3 rounded-full bg-ledger" />
      </div>
      <div className="absolute top-[50%] left-[50%] flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/80 shadow-2xl backdrop-blur-md">
        <div className="h-10 w-10 animate-pulse rounded-full bg-accent shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
      </div>

      <div className="absolute -z-10 top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ledger/10 blur-3xl" />
    </div>
  );
}

/** Linear three-step pipeline - reach out, talk, done. Shared by contact and book. */
function PipelineVisual() {
  return (
    <div className="relative w-full max-w-md aspect-4/3 flex items-center">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full stroke-slate-200"
        fill="none"
        viewBox="0 0 400 300"
      >
        <path
          d="M 50 150 L 350 150"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-[pulse_3s_ease-in-out_infinite] stroke-ledger/40"
        />
      </svg>

      <div className="absolute left-[12.5%] flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-2xl border border-white/40 bg-white/60 shadow-lg backdrop-blur-md">
        <div className="h-4 w-4 rounded-full bg-slate-300" />
      </div>
      <div className="absolute left-[50%] flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-3xl border border-white/50 bg-white/80 shadow-xl backdrop-blur-md">
        <div className="h-6 w-6 animate-pulse rounded-full bg-accent" />
      </div>
      <div className="absolute left-[87.5%] flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-2xl border border-white/40 bg-white/60 shadow-lg backdrop-blur-md">
        <div className="h-4 w-4 rounded-full bg-ledger" />
      </div>

      <div className="absolute -z-10 top-1/2 left-1/2 h-48 w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-ledger/5 blur-3xl" />
    </div>
  );
}

/** Scattered checklist rows, one ticking - the emailed audit list. */
function ChecklistVisual() {
  return (
    <div className="relative w-full max-w-sm aspect-square">
      <div className="absolute top-[20%] left-[20%] flex h-24 w-48 -translate-x-1/2 -translate-y-1/2 items-center rounded-2xl border border-white/40 bg-white/40 shadow-sm backdrop-blur-md p-4 -rotate-12">
        <div className="h-4 w-4 rounded-sm bg-ledger/40 mr-3" />
        <div className="h-2 w-20 rounded-full bg-slate-300/60" />
      </div>
      <div className="absolute top-[50%] left-[50%] flex h-24 w-48 -translate-x-1/2 -translate-y-1/2 items-center rounded-2xl border border-white/50 bg-white/60 shadow-md backdrop-blur-md p-4 rotate-[5deg]">
        <div className="h-4 w-4 rounded-sm bg-accent/80 mr-3 animate-pulse" />
        <div className="h-2 w-24 rounded-full bg-slate-400/80" />
      </div>
      <div className="absolute top-[80%] left-[80%] flex h-24 w-48 -translate-x-1/2 -translate-y-1/2 items-center rounded-2xl border border-white/40 bg-white/40 shadow-sm backdrop-blur-md p-4 rotate-15">
        <div className="h-4 w-4 rounded-sm bg-slate-300/40 mr-3" />
        <div className="h-2 w-16 rounded-full bg-slate-300/60" />
      </div>
      <div className="absolute -z-10 top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ledger/5 blur-3xl" />
    </div>
  );
}

const visuals: Record<AbstractVisualVariant, () => ReactNode> = {
  home: HomeVisual,
  services: ServicesVisual,
  for: IndustriesVisual,
  about: AboutVisual,
  contact: PipelineVisual,
  book: PipelineVisual,
  checklist: ChecklistVisual,
};

export function AbstractVisual({ variant, className = "", delay = "450ms" }: AbstractVisualProps) {
  const Visual = visuals[variant];
  return (
    <div
      className={`hero-reveal relative flex h-full min-h-[300px] w-full items-center justify-center ${className}`}
      style={{ animationDelay: delay }}
      aria-hidden="true"
    >
      <Visual />
    </div>
  );
}
