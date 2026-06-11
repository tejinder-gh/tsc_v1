/**
 * What: Unit tests for the interactive checklist math and diagnostics.
 * Why: Ensures that hours, scores, priorities, and diagnoses are calculated correctly and do not regress.
 * How: Vitest testing of pure functions in lib/checklist.ts.
 * From Where: House testing rules (unit coverage for all lib logic), 2026-06.
 */

import { describe, expect, it } from "vitest";
import type { ChecklistItem } from "@/content/checklist";
import {
  calculateChecklistHours,
  calculateDreadScore,
  getChecklistDiagnosis,
  getTopPriorities,
} from "./checklist";

const mockItems: readonly ChecklistItem[] = [
  { id: 1, task: "Task 1", automation: "Auto 1", minHours: 2, maxHours: 4, hoursDisplay: "2-4" },
  { id: 2, task: "Task 2", automation: "Auto 2", minHours: 1, maxHours: 2, hoursDisplay: "1-2" },
  { id: 3, task: "Task 3", automation: "Auto 3", minHours: 3, maxHours: 5, hoursDisplay: "3-5" },
  { id: 4, task: "Task 4", automation: "Auto 4", minHours: 1, maxHours: 1, hoursDisplay: "1" },
];

describe("calculateChecklistHours", () => {
  it("returns 0 for empty selections", () => {
    const result = calculateChecklistHours({}, mockItems);
    expect(result.minHours).toBe(0);
    expect(result.maxHours).toBe(0);
  });

  it("sums minimum and maximum hours for selected items", () => {
    const selections = { 1: 1, 3: 2 };
    const result = calculateChecklistHours(selections, mockItems);
    expect(result.minHours).toBe(5); // 2 + 3
    expect(result.maxHours).toBe(9); // 4 + 5
  });
});

describe("calculateDreadScore", () => {
  it("returns 0 for empty selections", () => {
    const score = calculateDreadScore({}, mockItems);
    expect(score).toBe(0);
  });

  it("calculates score using (averageHours * dread)", () => {
    // Task 1: min 2, max 4 -> avg 3. Dread = 2. Score = 3 * 2 = 6
    // Task 2: min 1, max 2 -> avg 1.5. Dread = 3. Score = 1.5 * 3 = 4.5
    // Total = 10.5
    const selections = { 1: 2, 2: 3 };
    const score = calculateDreadScore(selections, mockItems);
    expect(score).toBe(10.5);
  });
});

describe("getTopPriorities", () => {
  it("returns empty array for empty selections", () => {
    const priorities = getTopPriorities({}, mockItems);
    expect(priorities).toHaveLength(0);
  });

  it("sorts by score descending, then by dread descending, capped at 3", () => {
    // Task 1: avg 3 * dread 1 = score 3
    // Task 2: avg 1.5 * dread 3 = score 4.5
    // Task 3: avg 4 * dread 2 = score 8
    // Task 4: avg 1 * dread 3 = score 3
    const selections = { 1: 1, 2: 3, 3: 2, 4: 3 };
    const priorities = getTopPriorities(selections, mockItems);

    expect(priorities).toHaveLength(3);
    // Rank 1: Task 3 (score 8)
    expect(priorities[0].item.id).toBe(3);
    // Rank 2: Task 2 (score 4.5)
    expect(priorities[1].item.id).toBe(2);
    // Rank 3: Task 4 (score 3, dread 3 beats Task 1 dread 1)
    expect(priorities[2].item.id).toBe(4);
  });
});

describe("getChecklistDiagnosis", () => {
  it("handles 0 selected items", () => {
    const diagnosis = getChecklistDiagnosis(0);
    expect(diagnosis.title).toBe("No tasks selected");
    expect(diagnosis.color).toBe("text-slate");
  });

  it("handles 1-5 selected items", () => {
    const diagnosis = getChecklistDiagnosis(3);
    expect(diagnosis.title).toBe("Running tight");
    expect(diagnosis.color).toBe("text-emerald-400");
  });

  it("handles 6-12 selected items", () => {
    const diagnosis = getChecklistDiagnosis(8);
    expect(diagnosis.title).toBe("Draining your margin");
    expect(diagnosis.color).toBe("text-yellow-400");
  });

  it("handles 13+ selected items", () => {
    const diagnosis = getChecklistDiagnosis(15);
    expect(diagnosis.title).toBe("Heavy admin burden");
    expect(diagnosis.color).toBe("text-rose-400");
  });
});
