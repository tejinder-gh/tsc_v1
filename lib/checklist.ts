/**
 * What: Pure functions for calculating checklist hours, dread scores, priorities, and diagnoses.
 * Why: Keeps calculation logic clean, reusable, and testable outside of the React lifecycle.
 * How: Exported pure functions taking selections map and items list.
 * From Where: docs/automation-opportunities-checklist.md, 2026-06.
 */

import type { ChecklistItem } from "@/content/checklist";

/** Calculate min and max hours wasted per week based on selections */
export function calculateChecklistHours(
  selections: Record<number, number>,
  allItems: readonly ChecklistItem[]
) {
  let minHours = 0;
  let maxHours = 0;

  for (const itemIdStr of Object.keys(selections)) {
    const id = Number(itemIdStr);
    const item = allItems.find((i) => i.id === id);
    if (item) {
      minHours += item.minHours;
      maxHours += item.maxHours;
    }
  }

  return { minHours, maxHours };
}

/** Calculate the dread score: sum of (averageHours * dreadFactor) for each selected item */
export function calculateDreadScore(
  selections: Record<number, number>,
  allItems: readonly ChecklistItem[]
) {
  let totalScore = 0;

  for (const itemIdStr of Object.keys(selections)) {
    const id = Number(itemIdStr);
    const dread = selections[id];
    const item = allItems.find((i) => i.id === id);
    if (item && dread) {
      const avgHours = (item.minHours + item.maxHours) / 2;
      totalScore += avgHours * dread;
    }
  }

  return totalScore;
}

export interface PriorityEntry {
  item: ChecklistItem;
  dread: number;
  score: number;
}

/** Get top 3 priority items sorted by their score (averageHours * dread), then by dread level */
export function getTopPriorities(
  selections: Record<number, number>,
  allItems: readonly ChecklistItem[]
): PriorityEntry[] {
  return Object.keys(selections)
    .map((itemIdStr) => {
      const id = Number(itemIdStr);
      const item = allItems.find((i) => i.id === id);
      const dread = selections[id];
      if (!item || !dread) return null;
      const avgHours = (item.minHours + item.maxHours) / 2;
      const score = avgHours * dread;
      return { item, dread, score };
    })
    .filter((entry): entry is PriorityEntry => entry !== null)
    .sort((a, b) => b.score - a.score || b.dread - a.dread)
    .slice(0, 3);
}

export interface ChecklistDiagnosis {
  title: string;
  body: string;
  color: string;
}

/** Get diagnostic results and descriptions based on number of tasks selected */
export function getChecklistDiagnosis(selectedCount: number): ChecklistDiagnosis {
  if (selectedCount === 0) {
    return {
      title: "No tasks selected",
      body: "Check every task you (or your team) still do by hand on the left to evaluate your admin burden.",
      color: "text-slate",
    };
  }
  if (selectedCount <= 5) {
    return {
      title: "Running tight",
      body: "You're running relatively lean, but those few manual tasks are still eating hours. Automating your top scorer will bank you a full morning every week.",
      color: "text-emerald-400",
    };
  }
  if (selectedCount <= 12) {
    return {
      title: "Draining your margin",
      body: "You're paying roughly a part-time salary in manual admin work. The top three scorers usually pay for themselves in the first month.",
      color: "text-yellow-400",
    };
  }
  return {
    title: "Heavy admin burden",
    body: "Your team's week is mostly administrative tasks. This is a severe drag on growth and margin. This is exactly the situation a free automation audit is built for.",
    color: "text-rose-400",
  };
}
