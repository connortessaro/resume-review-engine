import { RewriteMode } from '@/app/types/mode-types';

interface Explanation {
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

export interface StoredEntry {
  id: number;
  original: Resume;
  improved: Resume;
  mode: RewriteMode;
  timestamp: string;
  explanation?: Explanation;
}

const RESUME_SECTIONS = [
  'header',
  'summary',
  'contact',
  'education',
  'objective',
  'experience',
  'projects',
  'skills',
  'leadership',
  'activities',
  'certifications',
  'awards',
  'honors',
] as const;

export type ResumeSection = (typeof RESUME_SECTIONS)[number];

export const RESUME_SECTION_SET = new Set(RESUME_SECTIONS);

// leave as string[] because parsing inputted text
export interface Resume {
  header?: string[];
  education?: string[];
  summary?: string[];
  experience?: string[];
  projects?: string[];
  skills?: string[];
  certifications?: string[];
  awards?: string[];
}
