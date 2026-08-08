"use client";

/**
 * What: The two-step quick-query form on /contact (brief §8.3) - step one (name,
 *       business, email, business type) is required and submits on its own; step two
 *       (phone, free text) is optional and skippable.
 * Why: Fewer fields visible at once is the point - a visitor who just wants to say
 *      "call me" shouldn't have to write a paragraph first. Business type still drives
 *      segment routing/pricing elsewhere, so it stays required in step one rather than
 *      inventing a second, redundant "what's eating your time" category select.
 * How: RHF + zod (contactFormSchema, now fully optional at the schema level so either
 *      step can submit alone); mode:"onBlur" validates on blur. Submission is gated by a
 *      manual form.trigger() (see sendFromStepOne/goToStepTwo) rather than RHF's own
 *      handleSubmit-blocks-on-invalid flow, so RHF's built-in reValidateMode never
 *      naturally engages (it's keyed off an isSubmitted flag that manual trigger() calls
 *      don't set) - a watch() subscription re-triggers validation for whichever field just
 *      changed if that field currently has an error, so it still clears live once the user
 *      starts fixing it. Step one exposes both "Continue" (reveal step two) and "Send
 *      without extra details" (submit step-one data only) so submit is genuinely available
 *      from step one, not gated behind stepping through. Success state promises a
 *      1-business-day reply and offers booking as the faster path.
 * From Where: TheSkillCorner marketing site build brief (quick query spec), 2026-06;
 *             rebuilt to the §8.3 two-step spec 2026-08.
 * When: 2026-08.
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useId, useState } from "react";
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

const STEP_ONE_FIELDS = ["name", "business", "email", "businessType"] as const;

const fieldBaseClass =
  "mt-1 w-full rounded-control border-[1.5px] border-line px-4 py-3.5 text-base transition-colors focus:border-blue-500 focus:outline-none focus:ring-[3px] focus:ring-blue-100";
const fieldErrorClass = "border-danger focus:border-danger focus:ring-danger/20";

export function ContactForm() {
  const ids = {
    name: useId(),
    business: useId(),
    email: useId(),
    type: useId(),
    phone: useId(),
    message: useId(),
    budget: useId(),
  };
  const { setSegment } = useSegment();
  const [step, setStep] = useState<1 | 2>(1);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
  });
  const errors = form.formState.errors;

  // Clears an error the moment the user starts fixing that field (brief §8.4). Submission
  // is gated by a manual trigger() below rather than RHF's handleSubmit, so RHF's own
  // reValidateMode never engages on its own - see the file header for why.
  useEffect(() => {
    const subscription = form.watch((_values, { name }) => {
      if (name && form.formState.errors[name]) {
        form.trigger(name);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  async function submit(values: ContactFormValues) {
    setSendError("");
    const derived = segmentForBusinessType(values.businessType);
    if (derived) setSegment(derived);
    try {
      await submitLead({
        lead_source: "contact_form",
        segment: derived ?? "unknown",
        name: values.name,
        business: values.business,
        email: values.email,
        business_type: values.businessType,
        phone: values.phone || undefined,
        message: values.message || undefined,
        budget: values.budget || undefined,
        website: values.website,
      });
      setSent(true);
    } catch (error) {
      setSendError(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  async function goToStepTwo() {
    const valid = await form.trigger(STEP_ONE_FIELDS);
    if (valid) setStep(2);
  }

  async function sendFromStepOne() {
    const valid = await form.trigger(STEP_ONE_FIELDS);
    if (valid) await form.handleSubmit(submit)();
  }

  if (sent) {
    return (
      <div className="rounded-card border-[1.5px] border-blue-100 bg-mist p-7" role="status">
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

  return (
    <form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-5" noValidate>
      <ol aria-label="Progress" className="flex items-center gap-3 text-sm font-medium text-slate">
        <li className={`flex items-center gap-2 ${step === 1 ? "text-navy" : ""}`}>
          <span
            aria-hidden="true"
            className={`grid h-6 w-6 place-items-center rounded-pill text-xs font-bold ${
              step === 1 ? "bg-blue-500 text-white" : "bg-blue-100 text-navy"
            }`}
          >
            1
          </span>
          Your details
        </li>
        <li aria-hidden="true" className="h-px w-8 bg-line" />
        <li className={`flex items-center gap-2 ${step === 2 ? "text-navy" : ""}`}>
          <span
            aria-hidden="true"
            className={`grid h-6 w-6 place-items-center rounded-pill text-xs font-bold ${
              step === 2 ? "bg-blue-500 text-white" : "bg-line text-slate"
            }`}
          >
            2
          </span>
          More detail (optional)
        </li>
      </ol>

      <fieldset hidden={step !== 1} className="flex flex-col gap-5">
        <legend className="sr-only">Step 1: your details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={ids.name} className="block font-medium text-navy">
              Your name
            </label>
            <input
              id={ids.name}
              type="text"
              autoComplete="name"
              aria-invalid={errors.name ? "true" : undefined}
              aria-describedby={errors.name ? `${ids.name}-error` : undefined}
              className={`${fieldBaseClass} ${errors.name ? fieldErrorClass : ""}`}
              {...form.register("name")}
            />
            {errors.name ? (
              <p id={`${ids.name}-error`} className="mt-1 text-sm text-danger" role="alert">
                {errors.name.message}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor={ids.business} className="block font-medium text-navy">
              Business name
            </label>
            <input
              id={ids.business}
              type="text"
              autoComplete="organization"
              aria-invalid={errors.business ? "true" : undefined}
              aria-describedby={errors.business ? `${ids.business}-error` : undefined}
              className={`${fieldBaseClass} ${errors.business ? fieldErrorClass : ""}`}
              {...form.register("business")}
            />
            {errors.business ? (
              <p id={`${ids.business}-error`} className="mt-1 text-sm text-danger" role="alert">
                {errors.business.message}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor={ids.email} className="block font-medium text-navy">
            Email
          </label>
          <input
            id={ids.email}
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? `${ids.email}-error` : undefined}
            className={`${fieldBaseClass} ${errors.email ? fieldErrorClass : ""}`}
            {...form.register("email")}
          />
          {errors.email ? (
            <p id={`${ids.email}-error`} className="mt-1 text-sm text-danger" role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={ids.type} className="block font-medium text-navy">
            What kind of business do you run?
          </label>
          <select
            id={ids.type}
            defaultValue=""
            aria-invalid={errors.businessType ? "true" : undefined}
            aria-describedby={errors.businessType ? `${ids.type}-error` : undefined}
            className={`${fieldBaseClass} bg-white ${errors.businessType ? fieldErrorClass : ""}`}
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
            <p id={`${ids.type}-error`} className="mt-1 text-sm text-danger" role="alert">
              {errors.businessType.message}
            </p>
          ) : null}
        </div>

        {sendError ? (
          <p className="text-sm text-danger" role="alert">
            {sendError}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={goToStepTwo}
            className="inline-flex min-h-12 items-center justify-center rounded-control border-2 border-navy-700 bg-transparent px-6 font-display text-[15px] font-medium text-navy-700 transition-colors hover:bg-mist"
          >
            Add phone &amp; detail
          </button>
          <button
            type="button"
            onClick={sendFromStepOne}
            disabled={form.formState.isSubmitting}
            className="inline-flex min-h-12 items-center justify-center rounded-control bg-blue-500 px-6 font-display text-[15px] font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-60"
            aria-busy={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Sending..." : "Send without extra details"}
          </button>
        </div>
      </fieldset>

      <fieldset hidden={step !== 2} className="flex flex-col gap-5">
        <legend className="sr-only">Step 2: phone and free text (optional)</legend>
        <div>
          <label htmlFor={ids.phone} className="block font-medium text-navy">
            Phone <span className="font-normal text-slate">(optional)</span>
          </label>
          <input
            id={ids.phone}
            type="tel"
            autoComplete="tel"
            className={fieldBaseClass}
            {...form.register("phone")}
          />
        </div>

        <div>
          <label htmlFor={ids.message} className="block font-medium text-navy">
            What&apos;s eating your time? <span className="font-normal text-slate">(optional)</span>
          </label>
          <textarea
            id={ids.message}
            rows={5}
            placeholder="Example: I spend every Sunday night building supplier orders, and we miss calls all day Saturday."
            className={fieldBaseClass}
            {...form.register("message")}
          />
        </div>

        <div>
          <label htmlFor={ids.budget} className="block font-medium text-navy">
            Budget range <span className="font-normal text-slate">(optional)</span>
          </label>
          <select
            id={ids.budget}
            defaultValue=""
            className={`${fieldBaseClass} bg-white`}
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

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex min-h-12 items-center justify-center rounded-control border-2 border-navy-700 bg-transparent px-6 font-display text-[15px] font-medium text-navy-700 transition-colors hover:bg-mist"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="inline-flex min-h-12 items-center justify-center rounded-control bg-blue-500 px-6 font-display text-[15px] font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-60"
            aria-busy={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Sending..." : "Send my question"}
          </button>
        </div>
      </fieldset>

      <HoneypotField registration={form.register("website")} />
    </form>
  );
}
