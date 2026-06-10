/**
 * What: Pure math and formatting for the ROI calculator (annual cost of manual work).
 * Why: The calculator is the site's signature element; isolating the math makes it unit-testable
 *      and reusable by the email-report capture (inputs are sent to the webhook).
 * How: annual = hours/week x hourly cost x 52, clamped to slider bounds. Currency formatted
 *      via Intl for en-CA without decimals.
 * From Where: TheSkillCorner marketing site build brief (ROI calculator spec), 2026-06.
 * When: 2026-06; revisit if a "cost after automation" comparison line is added.
 */

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
