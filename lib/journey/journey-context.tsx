"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { track } from "@/lib/analytics";
import { loadPersistedJourney, savePersistedJourney } from "./storage";
import {
  type ContextFocus,
  type ContextSituation,
  INITIAL_JOURNEY_CONTEXT,
  type JourneyContext,
  type JourneyStage,
  type PrimaryIntent,
} from "./types";

interface JourneyActions {
  selectIntent: (intent: PrimaryIntent) => void;
  setProblem: (problemText: string) => boolean;
  setStage: (stage: JourneyStage) => void;
  setContextFocus: (focus: ContextFocus) => void;
  setContextSituation: (situation: ContextSituation) => void;
  changeGoal: () => void;
  completeContext: () => void;
  resetJourney: () => void;
  continueJourney: () => void;
  markOpportunityViewed: (key: string) => boolean;
}

interface JourneyStateAndActions extends JourneyActions {
  journey: JourneyContext;
  isReady: boolean;
  hasExistingProgress: boolean;
}

type JourneyAction =
  | { type: "HYDRATE"; payload: JourneyContext }
  | { type: "SELECT_INTENT"; payload: { intent: PrimaryIntent; now: string } }
  | { type: "SET_PROBLEM"; payload: { problemText: string; now: string } }
  | { type: "SET_STAGE"; payload: { stage: JourneyStage; now: string } }
  | { type: "SET_CONTEXT_FOCUS"; payload: { focus: ContextFocus; now: string } }
  | { type: "SET_CONTEXT_SITUATION"; payload: { situation: ContextSituation; now: string } }
  | { type: "CHANGE_GOAL"; payload: { now: string } }
  | { type: "CHANGE_ANSWER"; payload: { now: string } }
  | { type: "RESET"; payload: { now: string } };

export function normalizeJourneyStage(journey: JourneyContext): JourneyContext {
  if (journey.stage === "opportunity" || journey.stage === "solution") {
    if (!journey.intent) {
      return { ...journey, stage: "new" };
    }
    if (!journey.contextFocus || !journey.contextSituation) {
      return { ...journey, stage: "context" };
    }
  }
  return journey;
}

function journeyReducer(state: JourneyContext, action: JourneyAction): JourneyContext {
  switch (action.type) {
    case "HYDRATE":
      return normalizeJourneyStage(action.payload);

    case "SELECT_INTENT":
      return {
        ...state,
        intent: action.payload.intent,
        stage: "intent-selected",
        createdAt: state.createdAt || action.payload.now,
        updatedAt: action.payload.now,
      };

    case "SET_PROBLEM":
      return {
        ...state,
        freeformProblem: action.payload.problemText,
        stage: "context",
        createdAt: state.createdAt || action.payload.now,
        updatedAt: action.payload.now,
      };

    case "SET_STAGE":
      return {
        ...state,
        stage: action.payload.stage,
        updatedAt: action.payload.now,
      };

    case "SET_CONTEXT_FOCUS": {
      const isChanging = state.contextFocus !== action.payload.focus;
      return {
        ...state,
        contextFocus: action.payload.focus,
        // Changing Question 1 clears situation (Ticket 002 §13)
        contextSituation: isChanging ? undefined : state.contextSituation,
        stage: "context",
        updatedAt: action.payload.now,
      };
    }

    case "SET_CONTEXT_SITUATION":
      return {
        ...state,
        contextSituation: action.payload.situation,
        stage: "context",
        updatedAt: action.payload.now,
      };

    case "CHANGE_GOAL":
      return {
        ...state,
        stage: "new",
        intent: undefined,
        contextFocus: undefined,
        contextSituation: undefined,
        updatedAt: action.payload.now,
      };

    case "CHANGE_ANSWER":
      return {
        ...state,
        stage: "new",
        intent: undefined,
        contextFocus: undefined,
        contextSituation: undefined,
        updatedAt: action.payload.now,
      };

    case "RESET":
      return {
        ...INITIAL_JOURNEY_CONTEXT,
        createdAt: action.payload.now,
        updatedAt: action.payload.now,
      };

    default:
      return state;
  }
}

function getCharacterBucket(length: number): "<50" | "50-149" | "150+" {
  if (length < 50) return "<50";
  if (length < 150) return "50-149";
  return "150+";
}

const JourneyReactContext = createContext<JourneyStateAndActions | null>(null);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [journey, dispatch] = useReducer(journeyReducer, INITIAL_JOURNEY_CONTEXT);
  const [isReady, setIsReady] = useState(false);
  const [hasExistingProgress, setHasExistingProgress] = useState(false);
  const startedTrackedRef = useRef(false);
  const viewedOpportunityKeysRef = useRef(new Set<string>());

  // Initialize and safely hydrate from client storage
  useEffect(() => {
    const persisted = loadPersistedJourney();
    if (persisted) {
      const normalized = normalizeJourneyStage(persisted);
      dispatch({ type: "HYDRATE", payload: normalized });
      if (normalized.stage !== persisted.stage) {
        savePersistedJourney(normalized);
      }
      startedTrackedRef.current = true;

      // Section 27: If stage >= context, note existing progress for continuation affordance
      if (
        normalized.stage === "context" ||
        normalized.stage === "opportunity" ||
        normalized.stage === "solution" ||
        normalized.stage === "plan"
      ) {
        setHasExistingProgress(true);
      }
    }
    setIsReady(true);
  }, []);

  const ensureJourneyStarted = useCallback(() => {
    if (!startedTrackedRef.current) {
      startedTrackedRef.current = true;
      track("journey_started", { source: "homepage" });
    }
  }, []);

  const selectIntent = useCallback(
    (intent: PrimaryIntent) => {
      ensureJourneyStarted();
      const now = new Date().toISOString();
      const fromStage = journey.stage;

      dispatch({ type: "SELECT_INTENT", payload: { intent, now } });
      savePersistedJourney({
        ...journey,
        intent,
        stage: "intent-selected",
        createdAt: journey.createdAt || now,
        updatedAt: now,
      });

      track("journey_intent_selected", { intent });
      if (fromStage !== "intent-selected") {
        track("journey_stage_changed", { from: fromStage, to: "intent-selected" });
      }
    },
    [ensureJourneyStarted, journey],
  );

  const setProblem = useCallback(
    (problemText: string): boolean => {
      const trimmed = problemText.trim();
      if (!trimmed) {
        return false;
      }

      ensureJourneyStarted();
      const now = new Date().toISOString();
      const fromStage = journey.stage;

      dispatch({ type: "SET_PROBLEM", payload: { problemText: trimmed, now } });
      savePersistedJourney({
        ...journey,
        freeformProblem: trimmed,
        stage: "context",
        createdAt: journey.createdAt || now,
        updatedAt: now,
      });

      track("journey_problem_entered", {
        hasProblemText: true,
        characterBucket: getCharacterBucket(trimmed.length),
      });

      if (fromStage !== "context") {
        track("journey_stage_changed", { from: fromStage, to: "context" });
      }

      return true;
    },
    [ensureJourneyStarted, journey],
  );

  const setStage = useCallback(
    (stage: JourneyStage) => {
      const fromStage = journey.stage;
      if (fromStage === stage) return;

      const now = new Date().toISOString();
      dispatch({ type: "SET_STAGE", payload: { stage, now } });
      savePersistedJourney({
        ...journey,
        stage,
        updatedAt: now,
      });

      track("journey_stage_changed", { from: fromStage, to: stage });
    },
    [journey],
  );

  const setContextFocus = useCallback(
    (focus: ContextFocus) => {
      const now = new Date().toISOString();
      const isChanging = journey.contextFocus !== focus;
      const nextState: JourneyContext = {
        ...journey,
        contextFocus: focus,
        contextSituation: isChanging ? undefined : journey.contextSituation,
        stage: "context",
        updatedAt: now,
      };

      dispatch({ type: "SET_CONTEXT_FOCUS", payload: { focus, now } });
      savePersistedJourney(nextState);

      if (journey.intent) {
        track("journey_context_focus_selected", {
          intent: journey.intent,
          focus,
        });
      }
    },
    [journey],
  );

  const setContextSituation = useCallback(
    (situation: ContextSituation) => {
      const now = new Date().toISOString();
      const nextState: JourneyContext = {
        ...journey,
        contextSituation: situation,
        stage: "context",
        updatedAt: now,
      };

      dispatch({ type: "SET_CONTEXT_SITUATION", payload: { situation, now } });
      savePersistedJourney(nextState);

      if (journey.intent && journey.contextFocus) {
        track("journey_context_situation_selected", {
          intent: journey.intent,
          focus: journey.contextFocus,
          situation,
        });

        track("journey_context_completed", {
          intent: journey.intent,
          focus: journey.contextFocus,
          situation,
        });
      }
    },
    [journey],
  );

  const changeGoal = useCallback(() => {
    const now = new Date().toISOString();
    const fromStage = journey.stage;
    const nextState: JourneyContext = {
      ...journey,
      stage: "new",
      intent: undefined,
      contextFocus: undefined,
      contextSituation: undefined,
      updatedAt: now,
    };

    dispatch({ type: "CHANGE_GOAL", payload: { now } });
    savePersistedJourney(nextState);

    track("journey_stage_changed", { from: fromStage, to: "new" });
  }, [journey]);

  const completeContext = useCallback(() => {
    const fromStage = journey.stage;
    const now = new Date().toISOString();
    const nextState: JourneyContext = {
      ...journey,
      stage: "opportunity",
      updatedAt: now,
    };

    dispatch({ type: "SET_STAGE", payload: { stage: "opportunity", now } });
    savePersistedJourney(nextState);

    track("journey_stage_changed", { from: fromStage, to: "opportunity" });
  }, [journey]);

  const resetJourney = useCallback(() => {
    const now = new Date().toISOString();
    dispatch({ type: "CHANGE_ANSWER", payload: { now } });
    savePersistedJourney({
      ...journey,
      stage: "new",
      intent: undefined,
      contextFocus: undefined,
      contextSituation: undefined,
      updatedAt: now,
    });
  }, [journey]);

  const continueJourney = useCallback(() => {
    // Dismisses continuation prompt and keeps active journey stage
    setHasExistingProgress(false);
  }, []);

  const markOpportunityViewed = useCallback((key: string): boolean => {
    if (viewedOpportunityKeysRef.current.has(key)) {
      return false;
    }
    viewedOpportunityKeysRef.current.add(key);
    return true;
  }, []);

  const value = useMemo(
    () => ({
      journey,
      isReady,
      hasExistingProgress,
      selectIntent,
      setProblem,
      setStage,
      setContextFocus,
      setContextSituation,
      changeGoal,
      completeContext,
      resetJourney,
      continueJourney,
      markOpportunityViewed,
    }),
    [
      journey,
      isReady,
      hasExistingProgress,
      selectIntent,
      setProblem,
      setStage,
      setContextFocus,
      setContextSituation,
      changeGoal,
      completeContext,
      resetJourney,
      continueJourney,
      markOpportunityViewed,
    ],
  );

  return <JourneyReactContext.Provider value={value}>{children}</JourneyReactContext.Provider>;
}

export function useJourney(): JourneyStateAndActions {
  const context = useContext(JourneyReactContext);
  if (!context) {
    throw new Error("useJourney must be used within a JourneyProvider");
  }
  return context;
}
