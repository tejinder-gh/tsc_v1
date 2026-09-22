/**
 * What: Deterministic opportunity diagnostic engine.
 * Why: Transforms visitor intent, focus, and situation into an opinionated, prioritized diagnosis
 *      without network calls, AI, or runtime side effects (Ticket 003 §4–10, docs/design/ticket-003-opportunity-diagnostic.md).
 * How: Pure function with strict 1:1 deterministic mapping, Growth conflict reconciliation,
 *      and guaranteed uniqueness of primary, secondary, and deferred recommendations.
 */

import {
  GROW_SITUATION_OPPORTUNITY,
  LEARN_TOPIC_LABELS,
  type OpportunityDiagnosis,
  type OpportunityId,
  SITUATION_RATIONALE_MODIFIERS,
} from "./opportunity-config";
import type { ContextFocus, ContextSituation, PrimaryIntent } from "./types";

export interface DiagnoseOpportunityInput {
  intent?: PrimaryIntent;
  contextFocus?: ContextFocus;
  contextSituation?: ContextSituation;
}

interface DeterministicOpportunityBase {
  primary: OpportunityId;
  secondary: OpportunityId;
  deferred: OpportunityId;
}

const SAVE_TIME_MAP: Record<string, DeterministicOpportunityBase> = {
  "customer-communication": {
    primary: "communication-automation",
    secondary: "workflow-orchestration",
    deferred: "reporting-intelligence",
  },
  "admin-data-entry": {
    primary: "admin-automation",
    secondary: "workflow-orchestration",
    deferred: "internal-software",
  },
  "scheduling-coordination": {
    primary: "scheduling-orchestration",
    secondary: "communication-automation",
    deferred: "internal-software",
  },
  "reporting-analysis": {
    primary: "reporting-intelligence",
    secondary: "workflow-orchestration",
    deferred: "ai-product-feature",
  },
  "internal-workflows": {
    primary: "workflow-orchestration",
    secondary: "admin-automation",
    deferred: "internal-software",
  },
};

const GROW_MAP: Record<string, DeterministicOpportunityBase> = {
  "find-more-leads": {
    primary: "demand-generation",
    secondary: "conversion-optimization",
    deferred: "follow-up-system",
  },
  "respond-faster": {
    primary: "response-conversion",
    secondary: "follow-up-system",
    deferred: "demand-generation",
  },
  "follow-up": {
    primary: "follow-up-system",
    secondary: "response-conversion",
    deferred: "demand-generation",
  },
  "convert-more": {
    primary: "conversion-optimization",
    secondary: "follow-up-system",
    deferred: "demand-generation",
  },
  "retain-customers": {
    primary: "retention-system",
    secondary: "follow-up-system",
    deferred: "demand-generation",
  },
};

const BUILD_MAP: Record<string, DeterministicOpportunityBase> = {
  "customer-experience": {
    primary: "customer-product",
    secondary: "conversion-optimization",
    deferred: "ai-product-feature",
  },
  "internal-tool": {
    primary: "internal-software",
    secondary: "workflow-orchestration",
    deferred: "ai-product-feature",
  },
  "automation-integration": {
    primary: "systems-integration",
    secondary: "workflow-orchestration",
    deferred: "internal-software",
  },
  "ai-product": {
    primary: "ai-product-feature",
    secondary: "customer-product",
    deferred: "workflow-orchestration",
  },
  "existing-product": {
    primary: "product-modernization",
    secondary: "systems-integration",
    deferred: "ai-product-feature",
  },
};

const LEARN_SITUATION_MAP: Record<string, DeterministicOpportunityBase> = {
  "quick-answer": {
    primary: "learning-orientation",
    secondary: "learning-guide",
    deferred: "learning-briefing",
  },
  "practical-guide": {
    primary: "learning-guide",
    secondary: "learning-toolkit",
    deferred: "learning-briefing",
  },
  "templates-tools": {
    primary: "learning-toolkit",
    secondary: "learning-guide",
    deferred: "learning-briefing",
  },
  "ongoing-briefings": {
    primary: "learning-briefing",
    secondary: "learning-guide",
    deferred: "learning-orientation",
  },
};

export function diagnoseOpportunity(input: DiagnoseOpportunityInput): OpportunityDiagnosis | null {
  const { intent, contextFocus, contextSituation } = input;

  if (!intent || !contextFocus || !contextSituation) {
    return null;
  }

  switch (intent) {
    case "save-time": {
      const base = SAVE_TIME_MAP[contextFocus];
      if (!base) return null;

      const modifier = SITUATION_RATIONALE_MODIFIERS[contextSituation];
      return {
        primary: base.primary,
        secondary: base.secondary,
        deferred: base.deferred,
        rationaleModifier: modifier || undefined,
      };
    }

    case "grow": {
      const base = GROW_MAP[contextFocus];
      if (!base) return null;

      const situationOpp =
        GROW_SITUATION_OPPORTUNITY[contextSituation as keyof typeof GROW_SITUATION_OPPORTUNITY];

      let secondary = base.secondary;
      let deferred = base.deferred;
      let rationaleModifier: string | undefined;

      // Growth contradiction handling (Ticket 003 amendment 4)
      if (situationOpp === base.primary) {
        // Matching: append approved Grow situation rationale modifier
        rationaleModifier = SITUATION_RATIONALE_MODIFIERS[contextSituation] || undefined;
      } else if (situationOpp) {
        // Mismatch: do not append contradictory modifier; use situation opp as secondary
        secondary = situationOpp;
        // Guarantee primary !== secondary !== deferred
        if (deferred === secondary) {
          deferred = base.secondary;
        }
      }

      return {
        primary: base.primary,
        secondary,
        deferred,
        rationaleModifier,
      };
    }

    case "build": {
      const base = BUILD_MAP[contextFocus];
      if (!base) return null;

      const modifier = SITUATION_RATIONALE_MODIFIERS[contextSituation];
      return {
        primary: base.primary,
        secondary: base.secondary,
        deferred: base.deferred,
        rationaleModifier: modifier || undefined,
      };
    }

    case "learn": {
      // Primary diagnosis comes from contextSituation for Learn
      const base = LEARN_SITUATION_MAP[contextSituation];
      if (!base) return null;

      const topicLabel =
        LEARN_TOPIC_LABELS[contextFocus as keyof typeof LEARN_TOPIC_LABELS] || contextFocus;

      return {
        primary: base.primary,
        secondary: base.secondary,
        deferred: base.deferred,
        topicLabel,
      };
    }

    default:
      return null;
  }
}
