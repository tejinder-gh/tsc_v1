"use client";

/**
 * What: Desktop exit-intent modal offering the checklist (the low-commitment rung),
 *       shown at most once per session.
 * Why: An exiting visitor is low-intent; asking for the smaller commitment (an email
 *      for the checklist) converts better than pushing a call.
 * How: mouseout toward the top of the viewport on pointer:fine devices triggers it;
 *      sessionStorage flag prevents repeats. Escape and backdrop close it. Submits via
 *      the shared ChecklistForm with lead_source "exit_intent".
 * From Where: TheSkillCorner marketing site build brief (exit-intent spec), 2026-06.
 * When: 2026-06.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { checklist } from "@/content/site";
import { ChecklistForm } from "../forms/ChecklistForm";

const SHOWN_KEY = "tsc_exit_shown";

export function ExitIntentModal() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const isDesktopPointer = window.matchMedia("(pointer: fine) and (min-width: 768px)").matches;
    if (!isDesktopPointer) return;
    try {
      if (sessionStorage.getItem(SHOWN_KEY)) return;
    } catch {
      return;
    }

    function onMouseOut(event: MouseEvent) {
      if (event.relatedTarget || event.clientY > 8) return;
      try {
        if (sessionStorage.getItem(SHOWN_KEY)) return;
        sessionStorage.setItem(SHOWN_KEY, "1");
      } catch {
        // Fall through: still show once for this page load.
      }
      setOpen(true);
    }

    document.addEventListener("mouseout", onMouseOut);
    return () => document.removeEventListener("mouseout", onMouseOut);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    // :not([tabindex="-1"]) keeps autofocus off the hidden honeypot input -
    // focusing it would lead real users to type their email into the trap.
    dialogRef.current?.querySelector<HTMLInputElement>('input:not([tabindex="-1"])')?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  if (!open) return null;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop click-to-close is supplementary; Escape and the close button cover keyboard users
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape already closes the dialog for keyboard users
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-modal-heading"
        className="w-full max-w-md rounded-xl bg-white p-7 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="exit-modal-heading" className="font-display text-2xl font-bold">
            Before you go - take the checklist
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="rounded p-1 text-slate hover:text-ink"
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <p className="mt-3 leading-relaxed">
          {checklist.title}: {checklist.subtitle}. Free, useful in ten minutes, and no call
          required.
        </p>
        <div className="mt-5">
          <ChecklistForm leadSource="exit_intent" compact />
        </div>
      </div>
    </div>
  );
}
