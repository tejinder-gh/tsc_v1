"use client";

/**
 * What: Cal.com inline booking embed with a graceful fallback when no event link is set.
 * Why: Booking is the top rung of the conversion ladder; the embed keeps it on-site.
 *      The fallback keeps /book useful before Cal.com is configured (and documents the
 *      Calendly swap path in the README).
 * How: @calcom/embed-react inline component reading NEXT_PUBLIC_CAL_LINK; fallback card
 *      offers email + quick query so the page never dead-ends.
 * From Where: TheSkillCorner marketing site build brief (booking spec), 2026-06.
 * When: 2026-06.
 */

import Cal, { getCalApi } from "@calcom/embed-react";
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { booking, businessTypes, site } from "@/content/site";
import { submitLead } from "@/lib/leads";
import { trackEvent } from "@/lib/telemetry";

export function BookingEmbed() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    business: "",
    businessType: "medical-clinic",
    timeframe: "this-week-morning",
    currentTools: "",
    bottleneck: "",
    website: "", // honeypot
  });

  useEffect(() => {
    if (!booking.calLink) return;

    trackEvent("booking_viewed", { location: "booking_embed" });

    let unmounted = false;
    (async () => {
      try {
        const cal = await getCalApi();
        if (unmounted) return;

        cal("on", {
          action: "eventTypeSelected",
          callback: () => {
            trackEvent("booking_started", { location: "booking_embed" });
          },
        });

        cal("on", {
          action: "bookingSuccessful",
          callback: () => {
            trackEvent("booking_completed", { location: "booking_embed" });
          },
        });
      } catch {
        // Fail-open: booking telemetry must never disrupt embed
      }
    })();

    return () => {
      unmounted = true;
    };
  }, []);

  const handlePreflightSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      setError("Please provide a valid work email.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const selectedType = businessTypes.find((b) => b.value === formData.businessType);
      const messageBody = [
        `Preferred Timeframe: ${formData.timeframe}`,
        formData.currentTools ? `Current Tools: ${formData.currentTools}` : null,
        formData.bottleneck ? `Primary Constraint: ${formData.bottleneck}` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      await submitLead({
        lead_source: "audit_preflight",
        segment: selectedType?.segment ?? "unknown",
        name: formData.name || undefined,
        email: formData.email,
        business: formData.business || undefined,
        business_type: formData.businessType,
        message: messageBody,
        website: formData.website || undefined,
      });

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit request";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!booking.calLink) {
    if (submitted) {
      return (
        <div className="rounded-[10px] border border-[var(--tsc-action)] bg-white p-8 sm:p-10 shadow-[var(--shadow-warm-sm)] font-geist">
          <div className="flex items-center gap-3 text-[var(--tsc-action)]">
            <CheckCircle2 className="h-6 w-6 shrink-0" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider">
              AUDIT REQUEST RECEIVED
            </span>
          </div>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-[var(--tsc-ink)]">
            Your engineering audit intake is confirmed.
          </h3>
          <p className="mt-2 text-sm text-[var(--tsc-muted)] leading-relaxed max-w-xl">
            We will review your operational bottleneck and email you directly at{" "}
            <strong className="text-[var(--tsc-ink)] font-semibold">{formData.email}</strong> with
            confirmed calendar invite times within 4 business hours.
          </p>

          <div className="mt-6 rounded-[8px] border border-[var(--tsc-line)] bg-[var(--tsc-surface)]/60 p-4 font-mono text-xs text-[var(--tsc-ink)] space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[var(--tsc-muted)]">Target Organization:</span>
              <span className="font-medium">{formData.business || "Direct Practice"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--tsc-muted)]">Preferred Window:</span>
              <span className="font-medium capitalize">
                {formData.timeframe.replace(/-/g, " ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--tsc-muted)]">Audit Deliverable:</span>
              <span className="font-medium text-[var(--tsc-action)]">3 Scoped Architectures</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--tsc-line)] flex items-center justify-between text-xs text-[var(--tsc-muted)]">
            <span>Direct engineering line: {site.email}</span>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="text-[var(--tsc-action)] hover:underline font-medium"
            >
              Modify request
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-[10px] border border-[var(--tsc-line)] bg-white p-6 sm:p-8 lg:p-10 shadow-[var(--shadow-warm-sm)] font-geist">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--tsc-line)] pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--tsc-action)] animate-pulse" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--tsc-action)]">
                DIRECT TECHNICAL AUDIT SCHEDULER
              </span>
            </div>
            <h3 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-[var(--tsc-ink)]">
              Reserve your 30-minute discovery consultation.
            </h3>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--tsc-muted)] bg-[var(--tsc-surface)] px-3 py-1.5 rounded-[6px] border border-[var(--tsc-line)]">
            <Clock className="h-3.5 w-3.5 text-[var(--tsc-action)]" />
            <span>30m &middot; Direct with Founder/Engineer</span>
          </div>
        </div>

        <form onSubmit={handlePreflightSubmit} className="space-y-5">
          {/* Honeypot */}
          <div aria-hidden="true" className="sr-only">
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="preflight-name"
                className="block text-xs font-mono font-medium text-[var(--tsc-muted)] uppercase mb-1.5"
              >
                Your Name
              </label>
              <input
                id="preflight-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dr. Emily Chen"
                className="w-full rounded-[6px] border border-[var(--tsc-line-strong)] bg-white px-3.5 py-2.5 text-sm text-[var(--tsc-ink)] placeholder-[var(--tsc-muted)]/60 focus:outline-none focus:border-[var(--tsc-ink)] focus:ring-1 focus:ring-[var(--tsc-ink)]"
              />
            </div>

            <div>
              <label
                htmlFor="preflight-email"
                className="block text-xs font-mono font-medium text-[var(--tsc-muted)] uppercase mb-1.5"
              >
                Work Email <span className="text-[var(--tsc-action)]">*</span>
              </label>
              <input
                id="preflight-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. emily@oakridgeclinic.ca"
                className="w-full rounded-[6px] border border-[var(--tsc-line-strong)] bg-white px-3.5 py-2.5 text-sm text-[var(--tsc-ink)] placeholder-[var(--tsc-muted)]/60 focus:outline-none focus:border-[var(--tsc-ink)] focus:ring-1 focus:ring-[var(--tsc-ink)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="preflight-business"
                className="block text-xs font-mono font-medium text-[var(--tsc-muted)] uppercase mb-1.5"
              >
                Organization / Practice Name
              </label>
              <input
                id="preflight-business"
                type="text"
                value={formData.business}
                onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                placeholder="e.g. Oakridge Health Centre"
                className="w-full rounded-[6px] border border-[var(--tsc-line-strong)] bg-white px-3.5 py-2.5 text-sm text-[var(--tsc-ink)] placeholder-[var(--tsc-muted)]/60 focus:outline-none focus:border-[var(--tsc-ink)] focus:ring-1 focus:ring-[var(--tsc-ink)]"
              />
            </div>

            <div>
              <label
                htmlFor="preflight-type"
                className="block text-xs font-mono font-medium text-[var(--tsc-muted)] uppercase mb-1.5"
              >
                Sector / Business Type
              </label>
              <select
                id="preflight-type"
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full rounded-[6px] border border-[var(--tsc-line-strong)] bg-white px-3.5 py-2.5 text-sm text-[var(--tsc-ink)] focus:outline-none focus:border-[var(--tsc-ink)] focus:ring-1 focus:ring-[var(--tsc-ink)]"
              >
                {businessTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="preflight-timeframe"
                className="block text-xs font-mono font-medium text-[var(--tsc-muted)] uppercase mb-1.5"
              >
                Preferred Meeting Timeframe
              </label>
              <select
                id="preflight-timeframe"
                value={formData.timeframe}
                onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                className="w-full rounded-[6px] border border-[var(--tsc-line-strong)] bg-white px-3.5 py-2.5 text-sm text-[var(--tsc-ink)] focus:outline-none focus:border-[var(--tsc-ink)] focus:ring-1 focus:ring-[var(--tsc-ink)]"
              >
                <option value="this-week-morning">
                  This Week &middot; Morning (9am - 12pm ET)
                </option>
                <option value="this-week-afternoon">
                  This Week &middot; Afternoon (1pm - 5pm ET)
                </option>
                <option value="next-week-morning">
                  Next Week &middot; Morning (9am - 12pm ET)
                </option>
                <option value="next-week-afternoon">
                  Next Week &middot; Afternoon (1pm - 5pm ET)
                </option>
                <option value="custom">Flexible / Suggest in reply</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="preflight-tools"
                className="block text-xs font-mono font-medium text-[var(--tsc-muted)] uppercase mb-1.5"
              >
                Current Software / Systems (Optional)
              </label>
              <input
                id="preflight-tools"
                type="text"
                value={formData.currentTools}
                onChange={(e) => setFormData({ ...formData, currentTools: e.target.value })}
                placeholder="e.g. Jane App, Toast POS, Clio, QuickBooks"
                className="w-full rounded-[6px] border border-[var(--tsc-line-strong)] bg-white px-3.5 py-2.5 text-sm text-[var(--tsc-ink)] placeholder-[var(--tsc-muted)]/60 focus:outline-none focus:border-[var(--tsc-ink)] focus:ring-1 focus:ring-[var(--tsc-ink)]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="preflight-bottleneck"
              className="block text-xs font-mono font-medium text-[var(--tsc-muted)] uppercase mb-1.5"
            >
              Primary Bottleneck to Address
            </label>
            <textarea
              id="preflight-bottleneck"
              rows={3}
              value={formData.bottleneck}
              onChange={(e) => setFormData({ ...formData, bottleneck: e.target.value })}
              placeholder="e.g. Missed incoming calls during clinical procedures, manual appointment reminders, or intake data re-entry…"
              className="w-full rounded-[6px] border border-[var(--tsc-line-strong)] bg-white px-3.5 py-2.5 text-sm text-[var(--tsc-ink)] placeholder-[var(--tsc-muted)]/60 focus:outline-none focus:border-[var(--tsc-ink)] focus:ring-1 focus:ring-[var(--tsc-ink)]"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="text-xs font-mono text-red-600 bg-red-50 p-2.5 rounded border border-red-200"
            >
              {error}
            </p>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-[var(--tsc-muted)]">
              <ShieldCheck className="h-4 w-4 text-[var(--tsc-action)] shrink-0" />
              <span>
                PIPEDA/PHIPA-aware &middot; No sales pitch deck &middot; 3 Scoped Architectures
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[var(--tsc-ink)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[var(--tsc-action)] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <span>Locking in request…</span>
              ) : (
                <>
                  <span>Request Engineering Audit</span>
                  <span aria-hidden="true">&rarr;</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-[640px] overflow-hidden rounded-[8px] border border-[var(--tsc-line)] bg-white shadow-sm">
      <Cal
        calLink={booking.calLink}
        style={{ width: "100%", height: "100%", minHeight: "640px" }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
}
