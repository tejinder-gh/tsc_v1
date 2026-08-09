"use client";

/**
 * What: A one-field-plus-email quick-message form - email + short message, honeypot,
 *       submits to the lead pipeline. Used on /social so someone who just met the founder
 *       can send a message in a few taps rather than working through the full two-step
 *       /contact form.
 * Why: Reuses lib/schemas.ts's quickQuestionSchema (the same shape already used by
 *      QuickActions.tsx's floating widget) rather than inventing a new schema - the shape
 *      is exactly right: email + message, nothing else required.
 * How: RHF + zod, HoneypotField, submitLead() with a caller-supplied lead_source.
 * From Where: Founder request, 2026-08 - the /social business-card landing page.
 * When: 2026-08.
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { submitLead } from "@/lib/leads";
import { type QuickQuestionValues, quickQuestionSchema } from "@/lib/schemas";
import { useSegment } from "@/lib/segment-context";
import { HoneypotField } from "./HoneypotField";

interface QuickMessageFormProps {
  leadSource: string;
}

const fieldClass =
  "w-full rounded-control border-[1.5px] border-border-input px-4 py-3.5 text-base transition-colors focus:border-blue-500 focus:outline-none focus:ring-[3px] focus:ring-blue-100";

export function QuickMessageForm({ leadSource }: QuickMessageFormProps) {
  const { segment } = useSegment();
  const emailId = useId();
  const messageId = useId();
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  const form = useForm<QuickQuestionValues>({ resolver: zodResolver(quickQuestionSchema) });

  async function onSubmit(values: QuickQuestionValues) {
    setSendError("");
    try {
      await submitLead({
        lead_source: leadSource,
        segment: segment ?? "unknown",
        email: values.email,
        message: values.message,
        website: values.website,
      });
      setSent(true);
    } catch (error) {
      setSendError(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  if (sent) {
    return (
      <p className="rounded-card bg-mist p-5 leading-relaxed" role="status">
        Got it - we reply within one business day. In a hurry, call or book above instead.
      </p>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
      <div>
        <label htmlFor={messageId} className="sr-only">
          What are you looking to build?
        </label>
        <textarea
          id={messageId}
          rows={3}
          placeholder="What are you looking to build?"
          className={fieldClass}
          {...form.register("message")}
        />
        {form.formState.errors.message ? (
          <p className="mt-1 text-sm text-danger" role="alert">
            {form.formState.errors.message.message}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor={emailId} className="sr-only">
          Email for our reply
        </label>
        <input
          id={emailId}
          type="email"
          autoComplete="email"
          placeholder="Email for our reply"
          className={fieldClass}
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="mt-1 text-sm text-danger" role="alert">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>
      {sendError ? (
        <p className="text-sm text-danger" role="alert">
          {sendError}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="rounded-control bg-blue-500 px-6 py-3.5 font-display font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
      >
        {form.formState.isSubmitting ? "Sending..." : "Send message"}
      </button>
      <HoneypotField registration={form.register("website")} />
    </form>
  );
}
