"use client";

/**
 * What: Email-gated lead-magnet form for the Automation Opportunities Checklist,
 *       used on /checklist and inside the exit-intent modal.
 * Why: The checklist is the low-intent rung of the ladder; the gate trades the checklist
 *      for an email plus business type (which maps to a segment for lead routing).
 * How: RHF + zod; derives segment from the chosen business type, stores it in context,
 *      posts to the webhook, and confirms email delivery on success.
 * From Where: TheSkillCorner marketing site build brief (lead magnet spec), 2026-06.
 * When: 2026-06.
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { businessTypes, segmentForBusinessType } from "@/content/site";
import { submitLead } from "@/lib/leads";
import { type ChecklistFormValues, checklistFormSchema } from "@/lib/schemas";
import { useSegment } from "@/lib/segment-context";
import { HoneypotField } from "./HoneypotField";

interface ChecklistFormProps {
  leadSource?: string;
  compact?: boolean;
}

// The "checklist_page" default is currently unreachable: /checklist renders
// InteractiveChecklist (lead_source "checklist_interactive") and this form's
// only live consumer is ExitIntentModal, which passes "exit_intent". The
// default stays for a future static-gate page; update README's lead_source
// list if it ever goes live again.
export function ChecklistForm({
  leadSource = "checklist_page",
  compact = false,
}: ChecklistFormProps) {
  const emailId = useId();
  const typeId = useId();
  const { setSegment } = useSegment();
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  const form = useForm<ChecklistFormValues>({ resolver: zodResolver(checklistFormSchema) });

  async function onSubmit(values: ChecklistFormValues) {
    setSendError("");
    const derived = segmentForBusinessType(values.businessType);
    if (derived) setSegment(derived);
    try {
      await submitLead({
        lead_source: leadSource,
        segment: derived ?? "unknown",
        email: values.email,
        business_type: values.businessType,
        website: values.website,
      });
      setSent(true);
    } catch (error) {
      setSendError(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl bg-mist p-5" role="status">
        <p className="font-display text-lg font-bold text-ink">It&apos;s on its way.</p>
        <p className="mt-2 leading-relaxed">
          Check your inbox in the next few minutes - the checklist will arrive by email. If you
          don&apos;t see it, check your spam folder.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
      <div>
        <label htmlFor={emailId} className={compact ? "sr-only" : "block font-medium text-ink"}>
          Email address
        </label>
        <input
          id={emailId}
          type="email"
          placeholder="you@yourbusiness.ca"
          autoComplete="email"
          className="mt-1 w-full rounded-lg border-2 border-ink/15 px-4 py-3"
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor={typeId} className={compact ? "sr-only" : "block font-medium text-ink"}>
          What kind of business?
        </label>
        <select
          id={typeId}
          className="mt-1 w-full rounded-lg border-2 border-ink/15 bg-white px-4 py-3"
          defaultValue=""
          {...form.register("businessType")}
        >
          <option value="" disabled>
            What kind of business?
          </option>
          {businessTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {form.formState.errors.businessType ? (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {form.formState.errors.businessType.message}
          </p>
        ) : null}
      </div>
      {sendError ? (
        <p className="text-sm text-red-600" role="alert">
          {sendError}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="rounded-lg bg-ledger px-6 py-3.5 font-semibold text-white transition-colors hover:bg-ledger-dark disabled:opacity-60"
      >
        {form.formState.isSubmitting ? "Sending..." : "Email me the checklist"}
      </button>
      <HoneypotField registration={form.register("website")} />
    </form>
  );
}
