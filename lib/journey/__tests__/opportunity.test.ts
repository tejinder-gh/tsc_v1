import { describe, expect, it } from "vitest";
import { diagnoseOpportunity } from "../diagnose-opportunity";
import {
  OPPORTUNITY_DEFINITIONS,
  type OpportunityId,
  SECONDARY_RELATION_COPY,
  SITUATION_RATIONALE_MODIFIERS,
} from "../opportunity-config";
import type { ContextFocus, ContextSituation, PrimaryIntent } from "../types";

describe("Deterministic Opportunity Diagnosis Engine", () => {
  describe("Canonical Primary Mappings (Ticket 003 §6–9)", () => {
    it("diagnoses all 5 Save Time focus values accurately", () => {
      const cases: Array<{
        focus: ContextFocus;
        situation: ContextSituation;
        expectedPrimary: OpportunityId;
        expectedSecondary: OpportunityId;
        expectedDeferred: OpportunityId;
      }> = [
        {
          focus: "customer-communication",
          situation: "mostly-manual",
          expectedPrimary: "communication-automation",
          expectedSecondary: "workflow-orchestration",
          expectedDeferred: "reporting-intelligence",
        },
        {
          focus: "admin-data-entry",
          situation: "fragmented-tools",
          expectedPrimary: "admin-automation",
          expectedSecondary: "workflow-orchestration",
          expectedDeferred: "internal-software",
        },
        {
          focus: "scheduling-coordination",
          situation: "works-but-slow",
          expectedPrimary: "scheduling-orchestration",
          expectedSecondary: "communication-automation",
          expectedDeferred: "internal-software",
        },
        {
          focus: "reporting-analysis",
          situation: "frequent-errors",
          expectedPrimary: "reporting-intelligence",
          expectedSecondary: "workflow-orchestration",
          expectedDeferred: "ai-product-feature",
        },
        {
          focus: "internal-workflows",
          situation: "mostly-manual",
          expectedPrimary: "workflow-orchestration",
          expectedSecondary: "admin-automation",
          expectedDeferred: "internal-software",
        },
      ];

      for (const c of cases) {
        const result = diagnoseOpportunity({
          intent: "save-time",
          contextFocus: c.focus,
          contextSituation: c.situation,
        });

        expect(result).not.toBeNull();
        expect(result?.primary).toBe(c.expectedPrimary);
        expect(result?.secondary).toBe(c.expectedSecondary);
        expect(result?.deferred).toBe(c.expectedDeferred);
        expect(result?.rationaleModifier).toBe(SITUATION_RATIONALE_MODIFIERS[c.situation]);
      }
    });

    it("diagnoses all 5 Build focus values accurately", () => {
      const cases: Array<{
        focus: ContextFocus;
        situation: ContextSituation;
        expectedPrimary: OpportunityId;
        expectedSecondary: OpportunityId;
        expectedDeferred: OpportunityId;
      }> = [
        {
          focus: "customer-experience",
          situation: "idea",
          expectedPrimary: "customer-product",
          expectedSecondary: "conversion-optimization",
          expectedDeferred: "ai-product-feature",
        },
        {
          focus: "internal-tool",
          situation: "existing-system",
          expectedPrimary: "internal-software",
          expectedSecondary: "workflow-orchestration",
          expectedDeferred: "ai-product-feature",
        },
        {
          focus: "automation-integration",
          situation: "scaling",
          expectedPrimary: "systems-integration",
          expectedSecondary: "workflow-orchestration",
          expectedDeferred: "internal-software",
        },
        {
          focus: "ai-product",
          situation: "prototype",
          expectedPrimary: "ai-product-feature",
          expectedSecondary: "customer-product",
          expectedDeferred: "workflow-orchestration",
        },
        {
          focus: "existing-product",
          situation: "existing-system",
          expectedPrimary: "product-modernization",
          expectedSecondary: "systems-integration",
          expectedDeferred: "ai-product-feature",
        },
      ];

      for (const c of cases) {
        const result = diagnoseOpportunity({
          intent: "build",
          contextFocus: c.focus,
          contextSituation: c.situation,
        });

        expect(result).not.toBeNull();
        expect(result?.primary).toBe(c.expectedPrimary);
        expect(result?.secondary).toBe(c.expectedSecondary);
        expect(result?.deferred).toBe(c.expectedDeferred);
        expect(result?.rationaleModifier).toBe(SITUATION_RATIONALE_MODIFIERS[c.situation]);
      }
    });

    it("diagnoses all 4 Learn situations as primary determinant and extracts topic", () => {
      const cases: Array<{
        focus: ContextFocus;
        situation: ContextSituation;
        expectedPrimary: OpportunityId;
        expectedSecondary: OpportunityId;
        expectedDeferred: OpportunityId;
        expectedTopic: string;
      }> = [
        {
          focus: "ai-automation",
          situation: "quick-answer",
          expectedPrimary: "learning-orientation",
          expectedSecondary: "learning-guide",
          expectedDeferred: "learning-briefing",
          expectedTopic: "AI & automation",
        },
        {
          focus: "software-product",
          situation: "practical-guide",
          expectedPrimary: "learning-guide",
          expectedSecondary: "learning-toolkit",
          expectedDeferred: "learning-briefing",
          expectedTopic: "Software & product",
        },
        {
          focus: "growth-marketing",
          situation: "templates-tools",
          expectedPrimary: "learning-toolkit",
          expectedSecondary: "learning-guide",
          expectedDeferred: "learning-briefing",
          expectedTopic: "Growth & marketing",
        },
        {
          focus: "operations-systems",
          situation: "ongoing-briefings",
          expectedPrimary: "learning-briefing",
          expectedSecondary: "learning-guide",
          expectedDeferred: "learning-orientation",
          expectedTopic: "Operations & systems",
        },
      ];

      for (const c of cases) {
        const result = diagnoseOpportunity({
          intent: "learn",
          contextFocus: c.focus,
          contextSituation: c.situation,
        });

        expect(result).not.toBeNull();
        expect(result?.primary).toBe(c.expectedPrimary);
        expect(result?.secondary).toBe(c.expectedSecondary);
        expect(result?.deferred).toBe(c.expectedDeferred);
        expect(result?.topicLabel).toBe(c.expectedTopic);
        expect(result?.rationaleModifier).toBeUndefined();
      }
    });
  });

  describe("Growth Contradiction Resolution (Ticket 003 Amendment 4)", () => {
    it("appends situation modifier when Grow situation matches primary", () => {
      const result = diagnoseOpportunity({
        intent: "grow",
        contextFocus: "find-more-leads",
        contextSituation: "not-enough-demand",
      });

      expect(result).not.toBeNull();
      expect(result?.primary).toBe("demand-generation");
      expect(result?.secondary).toBe("conversion-optimization");
      expect(result?.deferred).toBe("follow-up-system");
      expect(result?.rationaleModifier).toBe(
        "Your current constraint appears to begin before the customer enters the funnel.",
      );
    });

    it("case 1: find-more-leads + leads-go-cold -> secondary follow-up-system with no contradictory modifier", () => {
      const result = diagnoseOpportunity({
        intent: "grow",
        contextFocus: "find-more-leads",
        contextSituation: "leads-go-cold",
      });

      expect(result).not.toBeNull();
      expect(result?.primary).toBe("demand-generation");
      expect(result?.secondary).toBe("follow-up-system");
      // Original deferred was follow-up-system, so it falls back to defaultSecondary:
      expect(result?.deferred).toBe("conversion-optimization");
      expect(result?.rationaleModifier).toBeUndefined();
    });

    it("case 2: follow-up + not-enough-demand -> secondary demand-generation with no contradictory modifier", () => {
      const result = diagnoseOpportunity({
        intent: "grow",
        contextFocus: "follow-up",
        contextSituation: "not-enough-demand",
      });

      expect(result).not.toBeNull();
      expect(result?.primary).toBe("follow-up-system");
      expect(result?.secondary).toBe("demand-generation");
      // Original deferred was demand-generation, falls back to defaultSecondary:
      expect(result?.deferred).toBe("response-conversion");
      expect(result?.rationaleModifier).toBeUndefined();
    });

    it("case 3: respond-faster + low-conversion -> secondary conversion-optimization", () => {
      const result = diagnoseOpportunity({
        intent: "grow",
        contextFocus: "respond-faster",
        contextSituation: "low-conversion",
      });

      expect(result).not.toBeNull();
      expect(result?.primary).toBe("response-conversion");
      expect(result?.secondary).toBe("conversion-optimization");
      expect(result?.deferred).toBe("demand-generation");
      expect(result?.rationaleModifier).toBeUndefined();
    });

    it("case 4: convert-more + slow-response -> secondary response-conversion", () => {
      const result = diagnoseOpportunity({
        intent: "grow",
        contextFocus: "convert-more",
        contextSituation: "slow-response",
      });

      expect(result).not.toBeNull();
      expect(result?.primary).toBe("conversion-optimization");
      expect(result?.secondary).toBe("response-conversion");
      expect(result?.deferred).toBe("demand-generation");
      expect(result?.rationaleModifier).toBeUndefined();
    });
  });

  describe("Global Invariants Across ALL Combinations", () => {
    const saveTimeFoci: ContextFocus[] = [
      "customer-communication",
      "admin-data-entry",
      "scheduling-coordination",
      "reporting-analysis",
      "internal-workflows",
    ];
    const saveTimeSituations: ContextSituation[] = [
      "mostly-manual",
      "fragmented-tools",
      "works-but-slow",
      "frequent-errors",
    ];

    const growFoci: ContextFocus[] = [
      "find-more-leads",
      "respond-faster",
      "follow-up",
      "convert-more",
      "retain-customers",
    ];
    const growSituations: ContextSituation[] = [
      "not-enough-demand",
      "leads-go-cold",
      "slow-response",
      "low-conversion",
      "weak-retention",
    ];

    const buildFoci: ContextFocus[] = [
      "customer-experience",
      "internal-tool",
      "automation-integration",
      "ai-product",
      "existing-product",
    ];
    const buildSituations: ContextSituation[] = ["idea", "prototype", "existing-system", "scaling"];

    const learnFoci: ContextFocus[] = [
      "ai-automation",
      "software-product",
      "growth-marketing",
      "operations-systems",
    ];
    const learnSituations: ContextSituation[] = [
      "quick-answer",
      "practical-guide",
      "templates-tools",
      "ongoing-briefings",
    ];

    const allCombinations: Array<{
      intent: PrimaryIntent;
      focus: ContextFocus;
      situation: ContextSituation;
    }> = [
      ...saveTimeFoci.flatMap((focus) =>
        saveTimeSituations.map((situation) => ({
          intent: "save-time" as const,
          focus,
          situation,
        })),
      ),
      ...growFoci.flatMap((focus) =>
        growSituations.map((situation) => ({
          intent: "grow" as const,
          focus,
          situation,
        })),
      ),
      ...buildFoci.flatMap((focus) =>
        buildSituations.map((situation) => ({
          intent: "build" as const,
          focus,
          situation,
        })),
      ),
      ...learnFoci.flatMap((focus) =>
        learnSituations.map((situation) => ({
          intent: "learn" as const,
          focus,
          situation,
        })),
      ),
    ];

    it("verifies all 81 combinations produce valid, non-colliding diagnoses and existing definitions", () => {
      expect(allCombinations.length).toBe(20 + 25 + 20 + 16); // 81 total combinations

      for (const comb of allCombinations) {
        const diag = diagnoseOpportunity({
          intent: comb.intent,
          contextFocus: comb.focus,
          contextSituation: comb.situation,
        });

        expect(diag, `Failed for ${comb.intent}/${comb.focus}/${comb.situation}`).not.toBeNull();
        if (!diag) continue;

        // Invariant 1: All three IDs exist
        expect(diag.primary).toBeDefined();
        expect(diag.secondary).toBeDefined();
        expect(diag.deferred).toBeDefined();

        // Invariant 2: Mutually distinct IDs
        expect(
          diag.primary !== diag.secondary,
          `Primary and secondary collided: ${diag.primary} for ${comb.intent}/${comb.focus}/${comb.situation}`,
        ).toBe(true);
        expect(
          diag.primary !== diag.deferred,
          `Primary and deferred collided: ${diag.primary} for ${comb.intent}/${comb.focus}/${comb.situation}`,
        ).toBe(true);
        expect(
          diag.secondary !== diag.deferred,
          `Secondary and deferred collided: ${diag.secondary} for ${comb.intent}/${comb.focus}/${comb.situation}`,
        ).toBe(true);

        // Invariant 3: Definitions exist for all 3
        const primaryDef = OPPORTUNITY_DEFINITIONS[diag.primary];
        const secondaryDef = OPPORTUNITY_DEFINITIONS[diag.secondary];
        const deferredDef = OPPORTUNITY_DEFINITIONS[diag.deferred];

        expect(primaryDef).toBeDefined();
        expect(secondaryDef).toBeDefined();
        expect(deferredDef).toBeDefined();

        // Invariant 4: Primary definition has non-empty fields
        expect(primaryDef.title.length).toBeGreaterThan(0);
        expect(primaryDef.shortLabel.length).toBeGreaterThan(0);
        expect(primaryDef.outcome.length).toBeGreaterThan(0);
        expect(primaryDef.explanation.length).toBeGreaterThan(0);
        expect(primaryDef.evidence.length).toBe(3);
        expect(primaryDef.avoidForNow.length).toBeGreaterThan(0);

        // Invariant 5: Secondary relation copy exists for the diagnosed secondary ID
        const secondaryRelation = SECONDARY_RELATION_COPY[diag.secondary];
        expect(
          secondaryRelation,
          `Missing secondary relation copy for ${diag.secondary}`,
        ).toBeDefined();
        expect(secondaryRelation?.length).toBeGreaterThan(0);
      }
    });

    it("safely returns null for incomplete or invalid inputs", () => {
      expect(diagnoseOpportunity({})).toBeNull();
      expect(diagnoseOpportunity({ intent: "save-time" })).toBeNull();
      expect(
        diagnoseOpportunity({
          intent: "save-time",
          contextFocus: "customer-communication",
        }),
      ).toBeNull();
      expect(
        diagnoseOpportunity({
          intent: "save-time",
          contextSituation: "mostly-manual",
        }),
      ).toBeNull();
    });
  });

  describe("Exact Canonical Copy Integrity (§6–9, 13)", () => {
    it("contains exact title and outcome for communication-automation", () => {
      const def = OPPORTUNITY_DEFINITIONS["communication-automation"];
      expect(def.title).toBe("Automate the first response.");
      expect(def.shortLabel).toBe("Communication automation");
      expect(def.outcome).toBe(
        "Handle routine calls, messages, enquiries, updates, and follow-ups without making a person the routing layer.",
      );
      expect(def.evidence).toEqual([
        "Capture the request immediately.",
        "Resolve routine cases automatically.",
        "Escalate only when judgment is actually needed.",
      ]);
      expect(def.avoidForNow).toBe(
        "We would not start by building a general-purpose chatbot. Fix the specific communication workflow first.",
      );
    });

    it("contains exact Learn evidence bullets for all four Learn opportunities", () => {
      expect(OPPORTUNITY_DEFINITIONS["learning-orientation"].evidence).toEqual([
        "Find the few concepts that explain the rest.",
        "Separate what matters now from what can wait.",
        "Leave knowing what, if anything, deserves deeper study.",
      ]);

      expect(OPPORTUNITY_DEFINITIONS["learning-guide"].evidence).toEqual([
        "Follow one practical path from idea to application.",
        "See the decisions behind the implementation.",
        "Finish with something you can use or adapt.",
      ]);

      expect(OPPORTUNITY_DEFINITIONS["learning-toolkit"].evidence).toEqual([
        "Start with a usable artifact.",
        "Adapt it to a real task.",
        "Learn the important decisions while working with it.",
      ]);

      expect(OPPORTUNITY_DEFINITIONS["learning-briefing"].evidence).toEqual([
        "Filter developments by practical significance.",
        "Explain why the meaningful changes matter.",
        "Ignore noise that does not change what you should do.",
      ]);
    });
  });
});
