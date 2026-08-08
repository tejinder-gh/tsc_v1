"use client";

/**
 * What: Shared focus-trap behavior for full-screen/modal overlays (brief §6/§9) - traps
 *       Tab cycling inside the panel while open, Escape closes and returns focus to
 *       whatever triggered the overlay, and body scroll is locked while open.
 * Why: The mobile nav overlay and the exit-intent modal both need identical trap/Escape/
 *      scroll-lock behavior; one hook keeps them from drifting apart as each evolves.
 * How: Pass the open state, a ref to the panel, and a close callback. On open, focuses
 *      the first focusable element inside the panel, locks body scroll, and listens for
 *      Tab (wraps at the panel edges) and Escape (closes and restores focus to
 *      document.activeElement captured at open time).
 * From Where: Extracted from Header's mobile nav overlay, 2026-08.
 * When: 2026-08.
 */

import { type RefObject, useEffect } from "react";

// Every clause excludes tabindex="-1" so an intentionally-unfocusable element (e.g. a
// honeypot input) is never picked as the initial-focus target or included in the trap,
// regardless of which element type it is.
const FOCUSABLE_SELECTOR =
  'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), textarea:not([tabindex="-1"]), input:not([tabindex="-1"]), select:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(
  open: boolean,
  panelRef: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: onClose/panelRef are stable enough for this trap's lifecycle; re-running per-render would refocus on every keystroke
  useEffect(() => {
    if (!open) return;

    const triggerElement = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusables = panel
      ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      : [];
    focusables[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        triggerElement?.focus();
        return;
      }
      if (event.key !== "Tab" || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);
}
