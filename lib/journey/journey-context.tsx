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
  INITIAL_JOURNEY_CONTEXT,
  type JourneyContext,
  type JourneyStage,
  type PrimaryIntent,
} from "./types";

interface JourneyActions {
  selectIntent: (intent: PrimaryIntent) => void;
  setProblem: (problemText: string) => boolean;
  setStage: (stage: JourneyStage) => void;
  resetJourney: () => void;
  continueJourney: () => void;
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
  | { type: "CHANGE_ANSWER"; payload: { now: string } }
  | { type: "RESET"; payload: { now: string } };

function journeyReducer(state: JourneyContext, action: JourneyAction): JourneyContext {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;

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

    case "CHANGE_ANSWER":
      return {
        ...state,
        stage: "new",
        intent: undefined,
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

  // Initialize and safely hydrate from client storage
  useEffect(() => {
    const persisted = loadPersistedJourney();
    if (persisted) {
      dispatch({ type: "HYDRATE", payload: persisted });
      startedTrackedRef.current = true;

      // Section 27: If stage >= context, note existing progress for continuation affordance
      if (
        persisted.stage === "context" ||
        persisted.stage === "opportunity" ||
        persisted.stage === "solution" ||
        persisted.stage === "plan"
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

  const resetJourney = useCallback(() => {
    const now = new Date().toISOString();
    dispatch({ type: "CHANGE_ANSWER", payload: { now } });
    savePersistedJourney({
      ...journey,
      stage: "new",
      intent: undefined,
      updatedAt: now,
    });
  }, [journey]);

  const continueJourney = useCallback(() => {
    // Dismisses continuation prompt and keeps active journey stage
    setHasExistingProgress(false);
  }, []);

  const value = useMemo(
    () => ({
      journey,
      isReady,
      hasExistingProgress,
      selectIntent,
      setProblem,
      setStage,
      resetJourney,
      continueJourney,
    }),
    [
      journey,
      isReady,
      hasExistingProgress,
      selectIntent,
      setProblem,
      setStage,
      resetJourney,
      continueJourney,
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
