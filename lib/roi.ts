/**
 * What: Pure math and formatting for the ROI calculator (annual cost of manual work).
 * Why: The calculator is the site's signature element; isolating the math makes it unit-testable
 *      and reusable by the email-report capture (inputs are sent to the webhook).
 * How: annual = hours/week x hourly cost x 52, clamped to slider bounds. Currency formatted
 *      via Intl for en-CA without decimals. The practice-segment payback estimate divides the
 *      visitor's own monthly savings into the published practice build-fee range from
 *      content/site.ts (parsed from its anchor copy so the dollar figures stay single-sourced).
 * From Where: TheSkillCorner marketing site build brief (ROI calculator spec), 2026-06.
 * When: 2026-06; practice payback estimate added 2026-08 (T-005).
 */

import { pricing } from "@/content/site";

export interface RoiInputs {
  hoursPerWeek: number;
  hourlyCost: number;
}

export const ROI_BOUNDS = {
  hoursPerWeek: { min: 1, max: 60, default: 10 },
  hourlyCost: { min: 15, max: 200, default: 35 },
} as const;

const WEEKS_PER_YEAR = 52;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function annualCost(inputs: RoiInputs): number {
  const hours = clamp(
    inputs.hoursPerWeek,
    ROI_BOUNDS.hoursPerWeek.min,
    ROI_BOUNDS.hoursPerWeek.max,
  );
  const rate = clamp(inputs.hourlyCost, ROI_BOUNDS.hourlyCost.min, ROI_BOUNDS.hourlyCost.max);
  return Math.round(hours * rate * WEEKS_PER_YEAR);
}

export function monthlyCost(inputs: RoiInputs): number {
  return Math.round(annualCost(inputs) / 12);
}

const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

function parsePracticeBuildFeeRange(anchor: string): { low: number; high: number } {
  const amounts = anchor.match(/\$[\d,]+/g) ?? [];
  const [low, high] = amounts.map((amount) => Number(amount.replace(/[$,]/g, "")));
  return { low, high };
}

/** The published practice build-fee range ($7,500-$25,000), parsed from content/site.ts. */
export const PRACTICE_BUILD_FEE_RANGE = parsePracticeBuildFeeRange(pricing.practice.anchor);

/** Above this, a raw month count reads as noise rather than a useful estimate. */
const MAX_REASONABLE_PAYBACK_MONTHS = 60;

export interface PaybackRangeMonths {
  lowMonths: number;
  highMonths: number;
}

/**
 * Projected payback period (in whole months) for the practice build-fee range, given the
 * visitor's own annual savings figure. Returns null when savings are zero/negative or so small
 * that even the low end of the fee range would take unreasonably long to pay back - callers
 * should fall back to a qualitative "several years" framing rather than a raw number.
 */
export function practicePaybackRange(annualSavings: number): PaybackRangeMonths | null {
  if (annualSavings <= 0) return null;
  const monthlySavings = annualSavings / 12;
  const lowMonths = PRACTICE_BUILD_FEE_RANGE.low / monthlySavings;
  if (lowMonths > MAX_REASONABLE_PAYBACK_MONTHS) return null;
  const highMonths = PRACTICE_BUILD_FEE_RANGE.high / monthlySavings;
  return {
    lowMonths: Math.max(1, Math.round(lowMonths)),
    highMonths: Math.max(1, Math.round(highMonths)),
  };
}
