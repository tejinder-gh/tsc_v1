"use client";

/**
 * What: The ROI calculator - the site's signature element. Two sliders (hours/week of
 *       manual work, hourly cost) compute the live annual cost of inaction, with a
 *       booking CTA and an email-the-report capture underneath.
 * Why: It converts a vague pain ("admin eats my week") into a personal dollar figure,
 *      then offers a rung for both high intent (book) and low intent (email report).
 * How: Pure math from lib/roi.ts; report capture posts inputs + result to the webhook
 *      via submitLead with lead_source "roi_calculator". RHF + zod validate the email.
 * From Where: TheSkillCorner marketing site build brief (signature element spec), 2026-06.
 * When: 2026-06.
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { CtaLink } from "@/components/CtaLink";
import { submitLead } from "@/lib/leads";
import { annualCost, formatCurrency, monthlyCost, ROI_BOUNDS } from "@/lib/roi";
import { type RoiReportValues, roiReportSchema } from "@/lib/schemas";
import { useSegment } from "@/lib/segment-context";
import { HoneypotField } from "../forms/HoneypotField";

type CaptureState = "idle" | "open" | "sending" | "sent" | "error";

export function RoiCalculator() {
  const hoursId = useId();
  const rateId = useId();
  const emailId = useId();
  const { segment } = useSegment();
  const [hours, setHours] = useState<number>(ROI_BOUNDS.hoursPerWeek.default);
  const [rate, setRate] = useState<number>(ROI_BOUNDS.hourlyCost.default);
  const [capture, setCapture] = useState<CaptureState>("idle");
  const [captureError, setCaptureError] = useState("");

  const inputs = { hoursPerWeek: hours, hourlyCost: rate };
  const annual = annualCost(inputs);
  const monthly = monthlyCost(inputs);

  const form = useForm<RoiReportValues>({ resolver: zodResolver(roiReportSchema) });

  async function onSubmit(values: RoiReportValues) {
    setCapture("sending");
    setCaptureError("");
    try {
      await submitLead({
        lead_source: "roi_calculator",
        segment: segment ?? "unknown",
        email: values.email,
        roi_hours_per_week: hours,
        roi_hourly_cost: rate,
        roi_annual_cost: annual,
        website: values.website,
      });
      setCapture("sent");
    } catch (error) {
      setCapture("error");
      setCaptureError(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <section aria-labelledby="roi-heading" className="mx-auto max-w-site px-4 py-16 sm:px-6">
      <div className="rounded-xl bg-navy p-6 sm:p-10 md:p-12">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2
              id="roi-heading"
              className="font-display text-3xl font-bold !text-white sm:text-4xl"
            >
              What does doing it by hand cost you?
            </h2>
            <p className="mt-3 text-white/75">
              Slide to roughly where your week is. Count everyone who touches the busywork - you,
              family, staff.
            </p>

            <div className="mt-8 space-y-7">
              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor={hoursId} className="font-medium text-white">
                    Hours of manual admin per week
                  </label>
                  <output
                    htmlFor={hoursId}
                    className="font-display text-xl font-bold text-white tabular-nums"
                  >
                    {hours} hrs
                  </output>
                </div>
                <input
                  id={hoursId}
                  type="range"
                  className="mt-3"
                  min={ROI_BOUNDS.hoursPerWeek.min}
                  max={ROI_BOUNDS.hoursPerWeek.max}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                />
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor={rateId} className="font-medium text-white">
                    What an hour costs (wage or your time)
                  </label>
                  <output
                    htmlFor={rateId}
                    className="font-display text-xl font-bold text-white tabular-nums"
                  >
                    ${rate}/hr
                  </output>
                </div>
                <input
                  id={rateId}
                  type="range"
                  className="mt-3"
                  min={ROI_BOUNDS.hourlyCost.min}
                  max={ROI_BOUNDS.hourlyCost.max}
                  step={5}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/5 p-6 text-center sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
              Your annual cost of inaction
            </p>
            <p
              aria-live="polite"
              className="mt-3 font-display text-5xl font-bold text-blue tabular-nums sm:text-6xl"
              style={{ color: "#60A5FA" }}
            >
              {formatCurrency(annual)}
            </p>
            <p className="mt-2 text-white/70">
              about {formatCurrency(monthly)} every month, spent on work a system can do
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <CtaLink href="/book" location="roi_calculator" variant="primaryOnDark">
                Book a call about this number
              </CtaLink>
              {capture === "sent" ? (
                <p className="rounded-lg bg-white/10 px-4 py-3 text-sm text-white" role="status">
                  Report on its way - check your inbox in the next few minutes.
                </p>
              ) : capture === "idle" ? (
                <button
                  type="button"
                  onClick={() => setCapture("open")}
                  className="rounded-lg border-2 border-white/60 px-6 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-navy"
                >
                  Email me this report
                </button>
              ) : (
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-2 sm:flex-row"
                  noValidate
                >
                  <label htmlFor={emailId} className="sr-only">
                    Email address for your ROI report
                  </label>
                  <input
                    id={emailId}
                    type="email"
                    placeholder="you@yourbusiness.ca"
                    autoComplete="email"
                    className="w-full rounded-lg border-2 border-white/30 bg-white px-4 py-3 text-navy placeholder:text-slate/60"
                    {...form.register("email")}
                  />
                  <button
                    type="submit"
                    disabled={capture === "sending"}
                    className="shrink-0 rounded-lg bg-blue px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-pressed disabled:opacity-60"
                  >
                    {capture === "sending" ? "Sending..." : "Send it"}
                  </button>
                  <HoneypotField registration={form.register("website")} />
                </form>
              )}
              {form.formState.errors.email ? (
                <p className="text-sm text-red-300" role="alert">
                  {form.formState.errors.email.message}
                </p>
              ) : null}
              {capture === "error" && captureError ? (
                <p className="text-sm text-red-300" role="alert">
                  {captureError}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
