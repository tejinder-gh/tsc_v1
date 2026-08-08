"use client";

/**
 * What: The quick-query form on /contact - name, email, business type, "what's eating
 *       your time", optional budget.
 * Why: The second rung of the ladder for visitors not ready to book; business type maps
 *      to a segment so the webhook can route and the session personalizes.
 * How: RHF + zod (contactFormSchema); success state promises a 1-business-day reply and
 *      offers booking as the faster path.
 * From Where: TheSkillCorner marketing site build brief (quick query spec), 2026-06.
 * When: 2026-06.
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { businessTypes, segmentForBusinessType } from "@/content/site";
import { submitLead } from "@/lib/leads";
import { type ContactFormValues, contactFormSchema } from "@/lib/schemas";
import { useSegment } from "@/lib/segment-context";
import { CtaLink } from "../CtaLink";
import { HoneypotField } from "./HoneypotField";

const budgetOptions = [
  "Under $500/month",
  "$500 - $1,500/month",
  "$1,500+/month",
  "One-time project budget",
  "Not sure yet",
] as const;

export function ContactForm() {
  const ids = {
    name: useId(),
    email: useId(),
    type: useId(),
    message: useId(),
    budget: useId(),
  };
  const { setSegment } = useSegment();
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  const form = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });

  async function onSubmit(values: ContactFormValues) {
    setSendError("");
    const derived = segmentForBusinessType(values.businessType);
    if (derived) setSegment(derived);
    try {
      await submitLead({
        lead_source: "contact_form",
        segment: derived ?? "unknown",
        name: values.name,
        email: values.email,
        business_type: values.businessType,
        message: values.message,
        budget: values.budget || undefined,
        website: values.website,
      });
      setSent(true);
    } catch (error) {
      setSendError(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl border-2 border-blue/30 bg-mist p-7" role="status">
        <h2 className="font-display text-2xl font-bold">Got it. We reply within 1 business day.</h2>
        <p className="mt-3 leading-relaxed">
          Want answers faster? The free audit call usually beats email by a couple of days - and you
          leave with three automation ideas either way.
        </p>
        <div className="mt-5">
          <CtaLink href="/book" location="contact_success">
            Book the free audit instead
          </CtaLink>
        </div>
      </div>
    );
  }

  const errors = form.formState.errors;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={ids.name} className="block font-medium text-navy">
            Your name
          </label>
          <input
            id={ids.name}
            type="text"
            autoComplete="name"
            className="mt-1 w-full rounded-lg border-2 border-navy/15 px-4 py-3"
            {...form.register("name")}
          />
          {errors.name ? (
            <p className="mt-1 text-sm text-danger" role="alert">
              {errors.name.message}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor={ids.email} className="block font-medium text-navy">
            Email
          </label>
          <input
            id={ids.email}
            type="email"
            autoComplete="email"
            className="mt-1 w-full rounded-lg border-2 border-navy/15 px-4 py-3"
            {...form.register("email")}
          />
          {errors.email ? (
            <p className="mt-1 text-sm text-danger" role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor={ids.type} className="block font-medium text-navy">
          What kind of business do you run?
        </label>
        <select
          id={ids.type}
          className="mt-1 w-full rounded-lg border-2 border-navy/15 bg-white px-4 py-3"
          defaultValue=""
          {...form.register("businessType")}
        >
          <option value="" disabled>
            Pick the closest match
          </option>
          {businessTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {errors.businessType ? (
          <p className="mt-1 text-sm text-danger" role="alert">
            {errors.businessType.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={ids.message} className="block font-medium text-navy">
          What&apos;s eating your time?
        </label>
        <textarea
          id={ids.message}
          rows={5}
          placeholder="Example: I spend every Sunday night building supplier orders, and we miss calls all day Saturday."
          className="mt-1 w-full rounded-lg border-2 border-navy/15 px-4 py-3"
          {...form.register("message")}
        />
        {errors.message ? (
          <p className="mt-1 text-sm text-danger" role="alert">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={ids.budget} className="block font-medium text-navy">
          Budget range <span className="font-normal text-slate">(optional)</span>
        </label>
        <select
          id={ids.budget}
          className="mt-1 w-full rounded-lg border-2 border-navy/15 bg-white px-4 py-3"
          defaultValue=""
          {...form.register("budget")}
        >
          <option value="">Prefer not to say</option>
          {budgetOptions.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {sendError ? (
        <p className="text-sm text-danger" role="alert">
          {sendError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="self-start rounded-lg bg-blue px-6 py-3.5 font-semibold text-white transition-colors hover:bg-blue-pressed disabled:opacity-60"
      >
        {form.formState.isSubmitting ? "Sending..." : "Send my question"}
      </button>
      <HoneypotField registration={form.register("website")} />
    </form>
  );
}
