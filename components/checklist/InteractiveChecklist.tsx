"use client";

/**
 * What: Interactive checklist component where users can select manual tasks,
 *       set their dread factor (1-3), calculate weekly hours wasted, and get
 *       a live diagnosis and top 3 automation priorities.
 * Why: Replaces the static email gate with an engaging, interactive self-audit
 *      that drives high-intent lead submissions.
 * How: Stateful client component. Tracks selected tasks and dread levels. Formats results
 *      into a clean text summary and submits via submitLead to the existing webhook endpoint.
 * From Where: docs/automation-opportunities-checklist.md and checklist page spec, 2026-06.
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowRight, Check, Printer, RefreshCw } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { checklistData } from "@/content/checklist";
import { businessTypes, segmentForBusinessType } from "@/content/site";
import {
  calculateChecklistHours,
  calculateDreadScore,
  getChecklistDiagnosis,
  getTopPriorities,
} from "@/lib/checklist";
import { submitLead } from "@/lib/leads";
import { type ChecklistFormValues, checklistFormSchema } from "@/lib/schemas";
import { useSegment } from "@/lib/segment-context";
import { CtaLink } from "../CtaLink";
import { HoneypotField } from "../forms/HoneypotField";

export function InteractiveChecklist() {
  const { setSegment } = useSegment();
  // Selections map: itemId -> dreadFactor (1 | 2 | 3)
  const [selections, setSelections] = useState<Record<number, number>>({});
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  const emailId = useId();
  const typeId = useId();

  const form = useForm<ChecklistFormValues>({
    resolver: zodResolver(checklistFormSchema),
  });

  // Flat list of all items for lookups
  const allItems = checklistData.flatMap((c) => c.items);

  // Toggle selection of a task
  const handleToggleTask = (itemId: number) => {
    setSelections((prev) => {
      const next = { ...prev };
      if (next[itemId] !== undefined) {
        delete next[itemId];
      } else {
        next[itemId] = 1; // default dread factor
      }
      return next;
    });
  };

  // Set dread factor for a selected task
  const handleSetDread = (itemId: number, dread: number) => {
    setSelections((prev) => {
      if (prev[itemId] === undefined) return prev;
      return {
        ...prev,
        [itemId]: dread,
      };
    });
  };

  // Live Calculations using our lib/checklist utilities
  const selectedCount = Object.keys(selections).length;
  const { minHours, maxHours } = calculateChecklistHours(selections, allItems);
  const totalDreadScore = calculateDreadScore(selections, allItems);
  const priorityItems = getTopPriorities(selections, allItems);
  const diagnosis = getChecklistDiagnosis(selectedCount);

  // Print results
  const handlePrint = () => {
    window.print();
  };

  // Submit Lead Form with results pre-formatted in the message field
  const onSubmit = async (values: ChecklistFormValues) => {
    setSendError("");
    const derived = segmentForBusinessType(values.businessType);
    if (derived) setSegment(derived);

    // Format the checklist results into a neat text report
    const formattedPriority = priorityItems
      .map(
        (p, i) =>
          `${i + 1}. ${p.item.task} (Wasted Hours/wk: ${p.item.hoursDisplay}, Dread: ${p.dread}/3)`,
      )
      .join("\n");

    const formattedMessage = `Checklist Results:
- Tasks Checked: ${selectedCount} of 25
- Estimated Hours Wasted: ${minHours === maxHours ? `${minHours}` : `${minHours}-${maxHours}`} hours/week
- Calculated Pain Score: ${totalDreadScore.toFixed(1)} points
- Diagnosis: ${diagnosis.title}

Top 3 Priorities:
${formattedPriority || "None selected"}
`;

    try {
      await submitLead({
        lead_source: "checklist_interactive",
        segment: derived ?? "unknown",
        email: values.email,
        business_type: values.businessType,
        message: formattedMessage,
        website: values.website,
      });
      setSent(true);
    } catch (error) {
      setSendError(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-12 font-geist">
      {/* Checklist Side: 7 Columns */}
      <div className="space-y-6 lg:col-span-7 print:w-full">
        {checklistData.map((category) => (
          <div
            key={category.title}
            className="rounded-[8px] border border-[var(--tsc-line)] bg-white p-6"
          >
            <h2 className="font-geist text-lg font-bold text-[var(--tsc-ink)] border-b border-[var(--tsc-line)] pb-3">
              {category.title}
            </h2>
            <ul className="mt-4 divide-y divide-[var(--tsc-line)]">
              {category.items.map((item) => {
                const isSelected = selections[item.id] !== undefined;
                const selectedDread = selections[item.id] || 1;

                return (
                  <li key={item.id} className="py-4 first:pt-2 last:pb-2">
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => handleToggleTask(item.id)}
                        className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] border transition-all ${
                          isSelected
                            ? "border-[var(--tsc-ink)] bg-[var(--tsc-ink)] text-[var(--tsc-paper)]"
                            : "border-[var(--tsc-line-strong)] bg-white hover:border-[var(--tsc-ink)]"
                        }`}
                        aria-label={`Select task: ${item.task}`}
                        aria-pressed={isSelected}
                      >
                        {isSelected && <Check className="h-4 w-4" strokeWidth={3} />}
                      </button>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          {/* biome-ignore lint/a11y/noStaticElementInteractions: the adjacent checkbox button is the accessible control; this label click is a supplementary pointer target */}
                          {/* biome-ignore lint/a11y/useKeyWithClickEvents: keyboard users toggle via the checkbox button */}
                          <span
                            onClick={() => handleToggleTask(item.id)}
                            className={`cursor-pointer text-[15px] font-semibold leading-snug transition-colors ${
                              isSelected
                                ? "text-[var(--tsc-ink)]"
                                : "text-[var(--tsc-muted)] hover:text-[var(--tsc-ink)]"
                            }`}
                          >
                            {item.task}
                          </span>
                          <span className="shrink-0 font-mono text-xs font-semibold text-[var(--tsc-muted)]">
                            {item.hoursDisplay} hrs/wk
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-[var(--tsc-muted)] leading-relaxed">
                          {item.automation}
                        </p>

                        {/* Dread Selector (reveals when selected) */}
                        {isSelected && (
                          <div className="mt-3 rounded-[6px] bg-[var(--tsc-surface)] p-3 border border-[var(--tsc-line)]">
                            <span className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--tsc-muted)]">
                              How draining is this task?
                            </span>
                            <div className="mt-2 flex gap-2">
                              {[
                                { val: 1, label: "Annoying" },
                                { val: 2, label: "Draining" },
                                { val: 3, label: "Sunday Dread" },
                              ].map((option) => (
                                <button
                                  key={option.val}
                                  type="button"
                                  onClick={() => handleSetDread(item.id, option.val)}
                                  className={`flex-1 rounded-[4px] py-1.5 text-xs font-medium border transition-all ${
                                    selectedDread === option.val
                                      ? "bg-[var(--tsc-ink)] text-[var(--tsc-paper)] border-[var(--tsc-ink)]"
                                      : "bg-white text-[var(--tsc-muted)] border-[var(--tsc-line)] hover:bg-[var(--tsc-surface)]"
                                  }`}
                                >
                                  {option.val}: {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Sticky Calculations and Form Side: 5 Columns */}
      <div className="space-y-6 lg:sticky lg:top-28 lg:self-start lg:col-span-5 print:hidden">
        {/* Live Calculation Panel */}
        <div className="rounded-[8px] bg-[var(--tsc-ink)] p-6 text-[var(--tsc-paper)] border border-[var(--tsc-ink)]">
          <div className="flex items-center justify-between border-b border-white/15 pb-4">
            <h3 className="font-geist text-base font-bold text-[var(--tsc-paper)]">
              Your Automation Score
            </h3>
            <button
              type="button"
              onClick={() => setSelections({})}
              disabled={selectedCount === 0}
              className="flex items-center gap-1.5 font-mono text-xs font-medium text-white/70 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title="Reset checklist"
            >
              <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.7} />
              Reset
            </button>
          </div>

          {/* Large Live Counters */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="border-r border-white/15 pr-2">
              <span className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-white/70">
                Hours Wasted / Wk
              </span>
              <span className="mt-1 block font-mono text-3xl font-bold text-[var(--tsc-positive)]">
                {selectedCount === 0
                  ? "0"
                  : minHours === maxHours
                    ? `${minHours}`
                    : `${minHours}-${maxHours}`}
              </span>
            </div>
            <div className="pl-2">
              <span className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-white/70">
                Pain Index Score
              </span>
              <span className="mt-1 block font-mono text-3xl font-bold text-white">
                {totalDreadScore.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Dynamic Diagnosis */}
          <div className="mt-6 rounded-[6px] bg-white/10 p-4 border border-white/10">
            <div className="flex items-center gap-2">
              <AlertCircle className={`h-4.5 w-4.5 ${diagnosis.color}`} strokeWidth={1.7} />
              <span className={`font-geist font-bold text-sm ${diagnosis.color}`}>
                {diagnosis.title}
              </span>
            </div>
            <p className="mt-2 text-xs text-white/80 leading-relaxed">{diagnosis.body}</p>
          </div>

          {/* Top 3 Priorities */}
          {selectedCount > 0 && (
            <div className="mt-6">
              <span className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-white/70 border-b border-white/15 pb-2">
                Top Automation Priorities
              </span>
              <ul className="mt-3 space-y-3">
                {priorityItems.map((p, index) => (
                  <li key={p.item.id} className="flex gap-3 text-xs items-start leading-relaxed">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-[var(--tsc-action)] text-[10px] font-mono font-bold text-white">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-white/95">{p.item.task}</p>
                      <p className="text-[10px] font-mono text-white/70 mt-0.5">
                        Saves {p.item.hoursDisplay} hrs/wk · Dread: {p.dread}/3
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Print Action */}
          <button
            type="button"
            onClick={handlePrint}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-[8px] border border-white/20 bg-white/10 py-2.5 font-geist text-xs font-semibold text-white transition-all hover:bg-white/20"
          >
            <Printer className="h-4 w-4" strokeWidth={1.7} />
            Print Checklist Results
          </button>
        </div>

        {/* Lead Capture Form */}
        <div className="rounded-[8px] border border-[var(--tsc-line)] bg-white p-6">
          <h3 className="font-geist text-base font-bold text-[var(--tsc-ink)]">
            Get Your Results by Email
          </h3>
          <p className="mt-1.5 text-xs text-[var(--tsc-muted)] leading-relaxed">
            Submit your scores and we&apos;ll email your results - your top opportunities with the
            hours each gives back - along with the full 25-item checklist.
          </p>

          {sent ? (
            <div
              className="mt-4 rounded-[6px] bg-[var(--tsc-surface)] p-4 border border-[var(--tsc-line)]"
              role="status"
            >
              <p className="font-geist font-bold text-[var(--tsc-ink)] text-sm">
                Your results are on the way.
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--tsc-muted)]">
                Your scored results and the checklist are headed to your inbox. Check spam if they
                haven&apos;t arrived in a few minutes.
              </p>
            </div>
          ) : (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-4 flex flex-col gap-3"
              noValidate
            >
              <div>
                <label htmlFor={emailId} className="sr-only">
                  Email address
                </label>
                <input
                  id={emailId}
                  type="email"
                  placeholder="you@yourbusiness.ca"
                  autoComplete="email"
                  className="w-full rounded-[6px] border border-[var(--tsc-line-strong)] px-3 py-2 text-sm text-[var(--tsc-ink)] focus:border-[var(--tsc-ink)] focus:outline-none font-geist"
                  {...form.register("email")}
                />
                {form.formState.errors.email ? (
                  <p className="mt-1 text-xs font-mono text-red-600" role="alert">
                    {form.formState.errors.email.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor={typeId} className="sr-only">
                  What kind of business?
                </label>
                <select
                  id={typeId}
                  className="w-full rounded-[6px] border border-[var(--tsc-line-strong)] bg-white px-3 py-2 text-sm text-[var(--tsc-ink)] focus:border-[var(--tsc-ink)] focus:outline-none font-geist"
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
                  <p className="mt-1 text-xs font-mono text-red-600" role="alert">
                    {form.formState.errors.businessType.message}
                  </p>
                ) : null}
              </div>

              {sendError ? (
                <p className="text-xs font-mono text-red-600" role="alert">
                  {sendError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={form.formState.isSubmitting || selectedCount === 0}
                className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--tsc-ink)] py-2.5 text-sm font-medium font-geist text-[var(--tsc-paper)] transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {form.formState.isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Email me my results
                    <ArrowRight className="h-4 w-4" strokeWidth={1.7} />
                  </>
                )}
              </button>
              {selectedCount === 0 && (
                <span className="block text-center font-mono text-[10px] text-[var(--tsc-muted)]">
                  Select at least one task to generate report
                </span>
              )}
              <HoneypotField registration={form.register("website")} />
            </form>
          )}

          <div className="mt-4 border-t border-[var(--tsc-line)] pt-4 text-center">
            <CtaLink
              href="/book"
              location="checklist_interactive_summary"
              variant="text"
              className="text-xs"
            >
              Or book a free 30-minute audit
            </CtaLink>
          </div>
        </div>
      </div>
    </div>
  );
}
