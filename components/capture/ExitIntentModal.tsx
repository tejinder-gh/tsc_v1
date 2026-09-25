"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, FileCheck2, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { businessTypes, checklist, segmentForBusinessType } from "@/content/site";
import { submitLead } from "@/lib/leads";
import type { ChecklistFormValues } from "@/lib/schemas";
import { useFocusTrap } from "@/lib/use-focus-trap";

const STORAGE_KEY = "tsc_exit_intent_dismissed_at";
const DISMISS_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const MIN_DWELL_TIME_MS = 12000;

export function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountTimeRef = useRef<number>(Date.now());
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChecklistFormValues>({
    defaultValues: {
      email: "",
      businessType: "medical-clinic",
      website: "",
    },
  });

  const dismiss = useCallback(() => {
    setIsOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {
      // Ignore storage access errors
    }
  }, []);

  useFocusTrap(isOpen, modalRef, dismiss);

  useEffect(() => {
    if (
      process.env.NODE_ENV === "development" &&
      !window.location.search.includes("preview_exit=1")
    ) {
      return;
    }

    try {
      const dismissedAt = localStorage.getItem(STORAGE_KEY);
      if (dismissedAt) {
        const timestamp = Number.parseInt(dismissedAt, 10);
        if (!Number.isNaN(timestamp) && Date.now() - timestamp < DISMISS_DURATION_MS) {
          return;
        }
      }
    } catch {
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse moves out through the top of the viewport
      if (e.clientY <= 0 && Date.now() - mountTimeRef.current >= MIN_DWELL_TIME_MS) {
        setIsOpen(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const onSubmit = async (values: ChecklistFormValues) => {
    setSubmitting(true);
    setError(null);

    try {
      const segment = segmentForBusinessType(values.businessType) ?? "unknown";
      await submitLead({
        lead_source: "exit_intent_modal",
        segment,
        email: values.email,
        business_type: values.businessType,
        website: values.website,
      });

      setSubmitted(true);
      try {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      } catch {
        // Ignore
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to deliver checklist");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-geist">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={dismiss}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[8px] border border-[var(--tsc-line-strong)] bg-[var(--tsc-paper)] p-6 sm:p-8 text-[var(--tsc-ink)] shadow-[0_24px_50px_rgba(18,19,15,0.25)] z-10"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={dismiss}
              className="absolute right-4 top-4 p-1.5 rounded-[6px] text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)] hover:bg-[var(--tsc-surface)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tsc-action)]"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" strokeWidth={1.7} />
            </button>

            {submitted ? (
              <div className="space-y-4 py-2 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--tsc-positive)]/10 text-[var(--tsc-positive)]">
                  <CheckCircle2 className="h-6 w-6" strokeWidth={1.7} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]">
                  Checklist on its way.
                </h3>
                <p className="text-sm text-[var(--tsc-muted)] leading-relaxed max-w-sm mx-auto">
                  We&apos;ve dispatched the 25-task Automation Opportunities Checklist to your
                  inbox.
                </p>
                <div className="pt-2">
                  <Link
                    href="/checklist"
                    onClick={dismiss}
                    className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[var(--tsc-ink)] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[var(--tsc-action)] transition-colors"
                  >
                    View Interactive Checklist Online &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[var(--tsc-action)] mb-2">
                  <FileCheck2 className="h-4 w-4" strokeWidth={1.7} />
                  <span>01 / BEFORE YOU LEAVE</span>
                </div>

                <h2
                  id="exit-modal-title"
                  className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-[var(--tsc-ink)]"
                >
                  {checklist.title}
                </h2>

                <p className="mt-2 text-sm text-[var(--tsc-muted)] leading-relaxed">
                  {checklist.subtitle}. A plain-English evaluation of the tasks clinic managers,
                  firm partners, and owners can stop doing by hand.
                </p>

                {/* Bullets */}
                <div className="my-5 rounded-[8px] border border-[var(--tsc-line)] bg-white/70 p-3.5 space-y-2 text-xs text-[var(--tsc-ink)]">
                  {checklist.bullets.slice(0, 3).map((bullet) => (
                    <div key={bullet} className="flex items-start gap-2">
                      <CheckCircle2
                        className="h-4 w-4 text-[var(--tsc-action)] shrink-0 mt-0.5"
                        strokeWidth={1.7}
                      />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
                  <HoneypotField registration={register("website")} />

                  <div>
                    <label
                      htmlFor="exit-email"
                      className="block text-xs font-mono font-medium text-[var(--tsc-muted)] uppercase mb-1"
                    >
                      Work Email
                    </label>
                    <input
                      id="exit-email"
                      type="email"
                      {...register("email", { required: "Work email is required" })}
                      placeholder="e.g. partner@firm.ca"
                      className="w-full rounded-[6px] border border-[var(--tsc-line-strong)] bg-white px-3.5 py-2.5 text-sm text-[var(--tsc-ink)] placeholder-[var(--tsc-muted)]/60 focus:outline-none focus:border-[var(--tsc-ink)] focus:ring-1 focus:ring-[var(--tsc-ink)]"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600 font-mono">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="exit-type"
                      className="block text-xs font-mono font-medium text-[var(--tsc-muted)] uppercase mb-1"
                    >
                      Organization Type
                    </label>
                    <select
                      id="exit-type"
                      {...register("businessType")}
                      className="w-full rounded-[6px] border border-[var(--tsc-line-strong)] bg-white px-3.5 py-2.5 text-sm text-[var(--tsc-ink)] focus:outline-none focus:border-[var(--tsc-ink)] focus:ring-1 focus:ring-[var(--tsc-ink)]"
                    >
                      {businessTypes.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <p className="text-xs text-red-600 font-mono bg-red-50 p-2 rounded-[4px] border border-red-200">
                      {error}
                    </p>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 rounded-[8px] bg-[var(--tsc-ink)] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[var(--tsc-action)] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? "Sending checklist…" : "Send Free 25-Task Checklist →"}
                    </button>
                  </div>

                  <p className="text-[11px] font-mono text-center text-[var(--tsc-muted)]">
                    Zero spam &middot; No sales call &middot; Instant plain-text guide
                  </p>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
