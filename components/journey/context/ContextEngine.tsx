"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getContextConfig } from "@/lib/journey/context-config";
import { useJourney } from "@/lib/journey/journey-context";
import type { ContextFocus, ContextSituation, PrimaryIntent } from "@/lib/journey/types";
import { ContextConfirmation } from "./ContextConfirmation";
import { ContextQuestionView } from "./ContextQuestionView";

export function ContextEngine() {
  const { journey, setContextFocus, setContextSituation, changeGoal, completeContext } =
    useJourney();

  // If intent is missing, gracefully default to "save-time"
  const intent: PrimaryIntent = journey.intent || "save-time";
  const config = getContextConfig(intent);

  // Derive initial sub-step from current journey progress
  const getInitialStep = (): "question1" | "question2" | "confirmed" => {
    if (journey.contextFocus && journey.contextSituation) {
      return "confirmed";
    }
    if (journey.contextFocus) {
      return "question2";
    }
    return "question1";
  };

  const [subStep, setSubStep] = useState<"question1" | "question2" | "confirmed">(getInitialStep);

  // Sync subStep if journey is reset externally
  useEffect(() => {
    if (!journey.contextFocus && !journey.contextSituation && subStep !== "question1") {
      setSubStep("question1");
    }
  }, [journey.contextFocus, journey.contextSituation, subStep]);

  const handleFocusSelect = (focus: ContextFocus) => {
    setContextFocus(focus);
    setSubStep("question2");
  };

  const handleSituationSelect = (situation: ContextSituation) => {
    setContextSituation(situation);
    setSubStep("confirmed");
  };

  const handleBackToQuestion1 = () => {
    setSubStep("question1");
  };

  const handleReviewAnswers = () => {
    setSubStep("question1");
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {subStep === "question1" && (
          <ContextQuestionView<ContextFocus>
            key="context-question-1"
            stepKey="question1"
            eyebrow={config.question1.eyebrow}
            heading={config.question1.heading}
            supporting={config.question1.supporting}
            options={config.question1.options}
            selectedValue={journey.contextFocus}
            freeformProblem={journey.freeformProblem}
            onSelect={handleFocusSelect}
            onChangeGoal={changeGoal}
          />
        )}

        {subStep === "question2" && (
          <ContextQuestionView<ContextSituation>
            key="context-question-2"
            stepKey="question2"
            eyebrow={config.question2.eyebrow}
            heading={config.question2.heading}
            supporting={config.question2.supporting}
            options={config.question2.options}
            selectedValue={journey.contextSituation}
            onSelect={handleSituationSelect}
            onBack={handleBackToQuestion1}
            onChangeGoal={changeGoal}
          />
        )}

        {subStep === "confirmed" && (
          <ContextConfirmation
            key="context-confirmed"
            intent={intent}
            focus={journey.contextFocus}
            situation={journey.contextSituation}
            onShowOpportunity={completeContext}
            onReviewAnswers={handleReviewAnswers}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
