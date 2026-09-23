"use client";

/**
 * What: Modal dialog for requesting staff review / engineering follow-up on an
 *       interactive demonstration specification (T-013).
 * Why: Truth-in-advertising: v1 does not auto-generate or email blueprints (the backend
 *      only forwards leads to a webhook). A truthful human-consultation request
 *      preserves trust while capturing high-intent prospects.
 * How: Uses useFocusTrap for ARIA dialog roles, focus trap, and Escape key dismissal;
 *      submits via submitLead with lead_source "demonstration_architecture_request" and
 *      minimal validated journey_context { opportunityId, scenarioId, scenarioTitle }.
 *      Displays an inline confirmation on success without resetting the journey state.
 * When: 2026-09 (T-013).
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { submitLead } from "@/lib/leads";
import { type ArchitectureRequestValues, architectureRequestSchema } from "@/lib/schemas";
import { useSegment } from "@/lib/segment-context";
import { useFocusTrap } from "@/lib/use-focus-trap";

interface BlueprintCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityId: string;
  scenarioId: string;
  scenarioTitle: string;
}

const fieldClass =
  "w-full rounded-[3px] border border-[var(--tsc-line-strong)] bg-white px-3.5 py-2.5 text-sm text-[var(--tsc-ink)] transition-colors placeholder:text-[var(--tsc-muted)] focus:border-[var(--tsc-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--tsc-ink)]";

export function BlueprintCaptureModal({
  isOpen,
  onClose,
  opportunityId,
  scenarioId,
  scenarioTitle,
}: BlueprintCaptureModalProps) {
  const { segment } = useSegment();
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameId = useId();
  const emailId = useId();
  const businessId = useId();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const form = useForm<ArchitectureRequestValues>({
    resolver: zodResolver(architectureRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      business: "",
      website: "",
    },
  });

  useFocusTrap(isOpen, dialogRef, onClose);

  if (!isOpen) return null;

  async function onSubmit(values: ArchitectureRequestValues) {
    setSubmitError("");
    try {
      await submitLead({
        lead_source: "demonstration_architecture_request",
        segment: segment ?? "unknown",
        name: values.name,
        email: values.email,
        business: values.business,
        journey_context: {
          opportunityId,
          scenarioId,
          scenarioTitle,
        },
        website: values.website,
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong sending your request.",
      );
    }
  }

  function handleClose() {
    onClose();
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop click-to-close is supplementary; Escape and close button cover keyboard users
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape closes dialog via useFocusTrap
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[var(--tsc-ink)]/60 p-4 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="blueprint-modal-title"
        aria-describedby="blueprint-modal-desc"
        className="w-full max-w-lg rounded-[4px] border border-[var(--tsc-line)] bg-white p-6 sm:p-8 shadow-2xl font-geist text-[var(--tsc-ink)]"
      >
        {/* Header bar with Close Button */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--tsc-line)] pb-4">
          <div>
            <div className="text-[10px] sm:text-[11px] font-mono font-semibold tracking-wider text-[var(--tsc-muted)] uppercase mb-1">
              SPECIFICATION CONSULTATION
            </div>
            <h2
              id="blueprint-modal-title"
              className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]"
            >
              Request this architecture
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="rounded-[2px] p-1 text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tsc-ink)] cursor-pointer"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 2l12 12M14 2L2 14"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Selected Scenario Context Callout */}
        <div className="my-4 rounded-[3px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)] p-3 text-xs">
          <span className="font-mono text-[10px] font-semibold text-[var(--tsc-muted)] uppercase block mb-0.5">
            DEMONSTRATION SPECIFICATION
          </span>
          <span className="font-semibold text-[var(--tsc-ink)]">{scenarioTitle}</span>
        </div>

        {submitted ? (
          <div className="space-y-4 pt-2">
            <div
              className="rounded-[3px] border border-[var(--tsc-positive)]/30 bg-[var(--tsc-positive)]/5 p-4 text-sm text-[var(--tsc-ink)] leading-relaxed"
              role="status"
            >
              <div className="font-semibold text-[var(--tsc-positive)] flex items-center gap-1.5 mb-1">
                <span>✓</span>
                <span>Request received</span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--tsc-ink)]/90">
                Our engineering team will review the system specification for{" "}
                <span className="font-medium text-[var(--tsc-ink)]">"{scenarioTitle}"</span> and
                follow up directly to schedule a technical walkthrough.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-[3px] bg-[var(--tsc-ink)] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[var(--tsc-ink)]/90 cursor-pointer"
              >
                Return to demonstration
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-1" noValidate>
            <p
              id="blueprint-modal-desc"
              className="text-xs sm:text-sm text-[var(--tsc-ink)]/80 leading-relaxed"
            >
              Our engineering team will evaluate your operational constraints and follow up
              directly. We do not send automated documents; each review is prepared by a senior
              engineer.
            </p>

            {/* Full Name */}
            <div>
              <label
                htmlFor={nameId}
                className="block text-xs font-mono font-semibold uppercase text-[var(--tsc-ink)] mb-1"
              >
                Full Name <span className="text-[var(--tsc-danger)]">*</span>
              </label>
              <input
                id={nameId}
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                className={fieldClass}
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="mt-1 text-xs text-[var(--tsc-danger)]" role="alert">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Work Email */}
            <div>
              <label
                htmlFor={emailId}
                className="block text-xs font-mono font-semibold uppercase text-[var(--tsc-ink)] mb-1"
              >
                Work Email <span className="text-[var(--tsc-danger)]">*</span>
              </label>
              <input
                id={emailId}
                type="email"
                autoComplete="email"
                placeholder="jane@company.com"
                className={fieldClass}
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="mt-1 text-xs text-[var(--tsc-danger)]" role="alert">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Business Type / Name */}
            <div>
              <label
                htmlFor={businessId}
                className="block text-xs font-mono font-semibold uppercase text-[var(--tsc-ink)] mb-1"
              >
                Business Type / Name <span className="text-[var(--tsc-danger)]">*</span>
              </label>
              <input
                id={businessId}
                type="text"
                autoComplete="organization"
                placeholder="e.g. Dental Practice, Acme Logistics, or SaaS"
                className={fieldClass}
                {...form.register("business")}
              />
              {form.formState.errors.business && (
                <p className="mt-1 text-xs text-[var(--tsc-danger)]" role="alert">
                  {form.formState.errors.business.message}
                </p>
              )}
            </div>

            {submitError && (
              <p
                className="text-xs text-[var(--tsc-danger)] bg-red-50 p-2.5 rounded-[2px]"
                role="alert"
              >
                {submitError}
              </p>
            )}

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-[var(--tsc-line)]">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)] transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-[3px] bg-[var(--tsc-ink)] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[var(--tsc-ink)]/90 disabled:opacity-50 cursor-pointer"
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit request →"}
              </button>
            </div>

            <HoneypotField registration={form.register("website")} />
          </form>
        )}
      </div>
    </div>
  );
}
