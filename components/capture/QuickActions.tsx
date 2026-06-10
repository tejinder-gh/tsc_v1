"use client";

/**
 * What: Floating quick-action widget (bottom-right) - Book a call, Ask a question
 *       (mini form to webhook), and Free checklist. Dismissible for the session.
 * Why: Gives every scroll position an exit into the conversion ladder without a fake
 *      chatbot; the brief calls for a clean fake-door, not a bot.
 * How: Panel toggled by a launcher button; question form posts lead_source
 *      "quick_widget". Dismissal is remembered in sessionStorage (never localStorage).
 * From Where: TheSkillCorner marketing site build brief (capture system), 2026-06.
 * When: 2026-06.
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { track } from "@/lib/analytics";
import { submitLead } from "@/lib/leads";
import { type QuickQuestionValues, quickQuestionSchema } from "@/lib/schemas";
import { useSegment } from "@/lib/segment-context";
import { CtaLink } from "../CtaLink";

const DISMISS_KEY = "tsc_widget_dismissed";

type View = "menu" | "question" | "sent";

export function QuickActions() {
  const { segment } = useSegment();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("menu");
  const [sendError, setSendError] = useState("");
  const questionId = useId();
  const emailId = useId();

  const form = useForm<QuickQuestionValues>({ resolver: zodResolver(quickQuestionSchema) });

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(DISMISS_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // In-memory dismissal is enough when storage is unavailable.
    }
  }

  async function onSubmit(values: QuickQuestionValues) {
    setSendError("");
    try {
      await submitLead({
        lead_source: "quick_widget",
        segment: segment ?? "unknown",
        email: values.email,
        message: values.message,
      });
      setView("sent");
    } catch (error) {
      setSendError(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 right-4 z-40 md:bottom-6 md:right-6">
      {open ? (
        <div className="mb-3 w-72 rounded-xl border border-ink/10 bg-white p-4 shadow-xl">
          <div className="flex items-start justify-between gap-2">
            <p className="font-display font-bold text-ink">How can we help?</p>
            <button
              type="button"
              onClick={dismiss}
              className="rounded p-1 text-slate hover:text-ink"
              aria-label="Dismiss quick actions for this visit"
            >
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1 1l10 10M11 1L1 11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {view === "menu" ? (
            <div className="mt-3 flex flex-col gap-2">
              <CtaLink href="/book" location="quick_widget" className="text-center text-sm !py-2.5">
                Book a call
              </CtaLink>
              <button
                type="button"
                onClick={() => {
                  setView("question");
                  track("cta_clicked", {
                    location: "quick_widget",
                    segment: segment ?? "unknown",
                    label: "Ask a question",
                  });
                }}
                className="rounded-lg border-2 border-ink px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
              >
                Ask a question
              </button>
              <CtaLink
                href="/checklist"
                location="quick_widget"
                variant="secondary"
                className="text-center text-sm !py-2"
              >
                Free checklist
              </CtaLink>
            </div>
          ) : null}

          {view === "question" ? (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-3 flex flex-col gap-2"
              noValidate
            >
              <label htmlFor={questionId} className="sr-only">
                Your question
              </label>
              <textarea
                id={questionId}
                rows={3}
                placeholder="What's eating your time? Ask us anything."
                className="w-full rounded-lg border border-ink/20 px-3 py-2 text-sm"
                {...form.register("message")}
              />
              {form.formState.errors.message ? (
                <p className="text-xs text-red-600" role="alert">
                  {form.formState.errors.message.message}
                </p>
              ) : null}
              <label htmlFor={emailId} className="sr-only">
                Email for our reply
              </label>
              <input
                id={emailId}
                type="email"
                placeholder="Email for our reply"
                autoComplete="email"
                className="w-full rounded-lg border border-ink/20 px-3 py-2 text-sm"
                {...form.register("email")}
              />
              {form.formState.errors.email ? (
                <p className="text-xs text-red-600" role="alert">
                  {form.formState.errors.email.message}
                </p>
              ) : null}
              {sendError ? (
                <p className="text-xs text-red-600" role="alert">
                  {sendError}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="rounded-lg bg-ledger px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ledger-dark disabled:opacity-60"
              >
                {form.formState.isSubmitting ? "Sending..." : "Send question"}
              </button>
            </form>
          ) : null}

          {view === "sent" ? (
            <p className="mt-3 text-sm leading-relaxed" role="status">
              Got it - we reply within one business day. In a hurry?{" "}
              <CtaLink href="/book" location="quick_widget_sent" variant="text" className="text-sm">
                Book a call instead
              </CtaLink>
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="rounded-full bg-ink px-5 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-ledger"
        >
          {open ? "Close" : "Need a hand?"}
        </button>
      </div>
    </div>
  );
}
