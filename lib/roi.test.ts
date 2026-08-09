/**
 * What: Unit tests for the ROI calculator math.
 * Why: The annual-cost figure is the site's signature number and is also sent to the
 *      webhook; a silent math regression would corrupt both the pitch and the lead data.
 * How: Vitest over the pure functions in lib/roi.ts - happy path, clamping, formatting.
 * From Where: House testing rules (unit coverage for all lib logic), 2026-06.
 * When: 2026-06.
 */

import { describe, expect, it } from "vitest";
import {
  annualCost,
  clamp,
  formatCurrency,
  monthlyCost,
  PRACTICE_BUILD_FEE_RANGE,
  practicePaybackRange,
  ROI_BOUNDS,
} from "./roi";

describe("annualCost", () => {
  it("multiplies hours x rate x 52", () => {
    expect(annualCost({ hoursPerWeek: 10, hourlyCost: 35 })).toBe(18200);
  });

  it("clamps inputs below the slider minimums", () => {
    expect(annualCost({ hoursPerWeek: 0, hourlyCost: 0 })).toBe(
      ROI_BOUNDS.hoursPerWeek.min * ROI_BOUNDS.hourlyCost.min * 52,
    );
  });

  it("clamps inputs above the slider maximums", () => {
    expect(annualCost({ hoursPerWeek: 999, hourlyCost: 999 })).toBe(
      ROI_BOUNDS.hoursPerWeek.max * ROI_BOUNDS.hourlyCost.max * 52,
    );
  });
});

describe("monthlyCost", () => {
  it("is the annual cost divided by 12, rounded", () => {
    expect(monthlyCost({ hoursPerWeek: 10, hourlyCost: 35 })).toBe(Math.round(18200 / 12));
  });
});

describe("clamp", () => {
  it("returns the value when inside bounds", () => {
    expect(clamp(5, 1, 10)).toBe(5);
  });
  it("returns bounds when outside", () => {
    expect(clamp(-1, 1, 10)).toBe(1);
    expect(clamp(99, 1, 10)).toBe(10);
  });
});

describe("PRACTICE_BUILD_FEE_RANGE", () => {
  it("parses the published $1,500-$25,000 range from content/site.ts", () => {
    expect(PRACTICE_BUILD_FEE_RANGE).toEqual({ low: 1500, high: 25000 });
  });
});

describe("practicePaybackRange", () => {
  it("computes a low/high month range from the visitor's annual savings", () => {
    const annual = annualCost({ hoursPerWeek: 10, hourlyCost: 35 }); // 18200
    const monthlySavings = annual / 12;
    const result = practicePaybackRange(annual);
    expect(result).toEqual({
      lowMonths: Math.round(PRACTICE_BUILD_FEE_RANGE.low / monthlySavings),
      highMonths: Math.round(PRACTICE_BUILD_FEE_RANGE.high / monthlySavings),
    });
    expect(result?.lowMonths).toBeLessThan(result?.highMonths ?? 0);
  });

  it("returns null for zero annual savings instead of dividing by zero", () => {
    expect(practicePaybackRange(0)).toBeNull();
    expect(practicePaybackRange(-100)).toBeNull();
  });

  it("returns null when savings are so small the payback would read as nonsense", () => {
    // With the current $1,500 low end, even the slider minimum (1 hr/week at $15/hr,
    // $780/yr) clears the 60-month guard - so this exercises the guard directly with a
    // raw annual figure below what the slider can reach, rather than via annualCost().
    expect(practicePaybackRange(200)).toBeNull();
  });

  it("scales the low and high months with the low and high end of the fee range", () => {
    // 600/12 = 50 monthly savings divides both ends of the fee range evenly (1500/50=30,
    // 25000/50=500), so rounding introduces no error and the ratio is exact.
    const result = practicePaybackRange(600);
    expect(result).not.toBeNull();
    const ratio = (result?.highMonths ?? 0) / (result?.lowMonths ?? 1);
    const expectedRatio = PRACTICE_BUILD_FEE_RANGE.high / PRACTICE_BUILD_FEE_RANGE.low;
    expect(ratio).toBeCloseTo(expectedRatio, 1);
  });
});

describe("formatCurrency", () => {
  it("formats whole CAD dollars with separators", () => {
    expect(formatCurrency(18200)).toMatch(/\$18,200/);
  });
  it("never shows decimals", () => {
    expect(formatCurrency(1234.56)).not.toMatch(/\./);
  });
});
