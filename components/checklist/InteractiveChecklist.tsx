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
    <div className="grid items-start gap-8 lg:grid-cols-12">
      {/* Checklist Side: 7 Columns */}
      <div className="space-y-8 lg:col-span-7 print:w-full">
        {checklistData.map((category) => (
          <div
            key={category.title}
            className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm"
          >
            <h2 className="font-display text-xl font-bold tracking-tight text-ink border-b border-ink/10 pb-3">
              {category.title}
            </h2>
            <ul className="mt-4 divide-y divide-ink/5">
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
                        className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 transition-all ${
                          isSelected
                            ? "border-ledger bg-ledger text-white"
                            : "border-ink/15 bg-white hover:border-ledger"
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
                              isSelected ? "text-ink" : "text-slate hover:text-ink"
                            }`}
                          >
                            {item.task}
                          </span>
                          <span className="shrink-0 font-mono text-xs font-semibold text-slate/85">
                            {item.hoursDisplay} hrs/wk
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate/80 leading-relaxed">
                          {item.automation}
                        </p>

                        {/* Dread Selector (reveals when selected) */}
                        {isSelected && (
                          <div className="mt-3 animate-pop rounded-lg bg-mist/60 p-3 border border-ink/5">
                            <span className="block text-xs font-semibold uppercase tracking-wider text-slate/80">
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
                                  className={`flex-1 rounded-md py-1.5 text-xs font-bold border transition-all ${
                                    selectedDread === option.val
                                      ? "bg-ledger text-white border-ledger shadow-sm"
                                      : "bg-white text-slate border-ink/10 hover:bg-mist"
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
      <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-5 print:hidden">
        {/* Live Calculation Panel */}
        <div className="rounded-xl bg-ink p-6 text-white shadow-lg border border-white/5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-display text-lg font-bold tracking-tight text-white">
              Your Automation Score
            </h3>
            <button
              type="button"
              onClick={() => setSelections({})}
              disabled={selectedCount === 0}
              className="flex items-center gap-1.5 text-xs font-medium text-slate hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title="Reset checklist"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          {/* Large Live Counters */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="border-r border-white/10 pr-2">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate">
                Hours Wasted / Wk
              </span>
              <span className="mt-1 block font-display text-3xl font-extrabold text-[#2FB97E]">
                {selectedCount === 0
                  ? "0"
                  : minHours === maxHours
                    ? `${minHours}`
                    : `${minHours}-${maxHours}`}
              </span>
            </div>
            <div className="pl-2">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate">
                Pain Index Score
              </span>
              <span className="mt-1 block font-display text-3xl font-extrabold text-white">
                {totalDreadScore.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Dynamic Diagnosis */}
          <div className="mt-6 rounded-lg bg-white/5 p-4 border border-white/5">
            <div className="flex items-center gap-2">
              <AlertCircle className={`h-4.5 w-4.5 ${diagnosis.color}`} />
              <span className={`font-display font-bold text-sm ${diagnosis.color}`}>
                {diagnosis.title}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate/90 leading-relaxed">{diagnosis.body}</p>
          </div>

          {/* Top 3 Priorities */}
          {selectedCount > 0 && (
            <div className="mt-6">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate border-b border-white/5 pb-2">
                Top Automation Priorities
              </span>
              <ul className="mt-3 space-y-3">
                {priorityItems.map((p, index) => (
                  <li key={p.item.id} className="flex gap-3 text-xs items-start leading-relaxed">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-ledger text-[10px] font-bold text-white">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-white/95">{p.item.task}</p>
                      <p className="text-[10px] text-slate mt-0.5">
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
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/10"
          >
            <Printer className="h-4 w-4" />
            Print Checklist Results
          </button>
        </div>

        {/* Lead Capture Form */}
        <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
          <h3 className="font-display text-lg font-bold tracking-tight text-ink">
            Get Your Results by Email
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed">
            Submit your scores and we&apos;ll email your results - your top opportunities with the
            hours each gives back - along with the full 25-item checklist.
          </p>

          {sent ? (
            <div className="mt-4 rounded-lg bg-mist p-4 border border-ink/5" role="status">
              <p className="font-display font-bold text-ink text-sm">
                Your results are on the way.
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate">
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
                  className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus:border-ledger focus:outline-none"
                  {...form.register("email")}
                />
                {form.formState.errors.email ? (
                  <p className="mt-1 text-xs text-red-600" role="alert">
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
                  className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm focus:border-ledger focus:outline-none"
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
                  <p className="mt-1 text-xs text-red-600" role="alert">
                    {form.formState.errors.businessType.message}
                  </p>
                ) : null}
              </div>

              {sendError ? (
                <p className="text-xs text-red-600" role="alert">
                  {sendError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={form.formState.isSubmitting || selectedCount === 0}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-ledger py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ledger-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {form.formState.isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Email me my results
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              {selectedCount === 0 && (
                <span className="block text-center text-[10px] text-slate/80">
                  Select at least one task to generate report
                </span>
              )}
              <HoneypotField registration={form.register("website")} />
            </form>
          )}

          <div className="mt-4 border-t border-ink/10 pt-4 text-center">
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
