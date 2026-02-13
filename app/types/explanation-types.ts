import { RewriteMode } from "./mode-types";

export interface Explanation {
  summary: string;
  changes: string[];
  reasoning: string[];
  tradeoffs?: string[];
}

interface ExplanationRules {
  minChanges: number;
  minReasoningPoints: number;
  requireTradeoffs: boolean;
  forbidGenericPhrases: boolean;
}

const EXPLANATION_RULES: Record<RewriteMode, ExplanationRules> = {
  'Action + Project/Problem + Result': {
    minChanges: 3,
    minReasoningPoints: 2,
    requireTradeoffs: false,
    forbidGenericPhrases: true,
  },

  'Challenge + Action + Result': {
    minChanges: 3,
    minReasoningPoints: 2,
    requireTradeoffs: true,
    forbidGenericPhrases: true,
  },

  'Problem, Action, Result': {
    minChanges: 2,
    minReasoningPoints: 2,
    requireTradeoffs: false,
    forbidGenericPhrases: true,
  },

  'Action Verb + Accomplishment + Outcome': {
    minChanges: 3,
    minReasoningPoints: 2,
    requireTradeoffs: true,
    forbidGenericPhrases: true,
  },

  'Situation + Task + Action + Result': {
    minChanges: 3,
    minReasoningPoints: 2,
    requireTradeoffs: false,
    forbidGenericPhrases: true,
  },
};
