export type RewriteMode =
  | 'Action + Project/Problem + Result'
  | 'Challenge + Action + Result'
  | 'Problem, Action, Result'
  | 'Action Verb + Accomplishment + Outcome'
  | 'Situation + Task + Action + Result';

export const DEFAULT_MODE: RewriteMode = 'Action + Project/Problem + Result';

interface SectionParts {
  requiredBulletPoints?: number;
  maxWordsPerBullet?: number;
  emphasizeMetrics?: boolean; // if resume that was given included metrics
}

interface ModeParts {
  experience: SectionParts;
  projects: SectionParts;
  skills: SectionParts;
}

export const MODE_RULES: Record<RewriteMode, ModeParts> = {
  'Action + Project/Problem + Result': {
    experience: {
      requiredBulletPoints: 5,
      maxWordsPerBullet: 22,
      emphasizeMetrics: true,
    },
    projects: {
      requiredBulletPoints: 3,
      emphasizeMetrics: true,
    },
    skills: {},
  },

  'Challenge + Action + Result': {
    experience: {
      requiredBulletPoints: 4,
      emphasizeMetrics: true,
    },
    projects: {
      requiredBulletPoints: 2,
      emphasizeMetrics: true,
    },
    skills: {},
  },

  'Problem, Action, Result': {
    experience: {
      requiredBulletPoints: 4,
      maxWordsPerBullet: 24,
    },
    projects: {
      requiredBulletPoints: 2,
    },
    skills: {},
  },

  'Action Verb + Accomplishment + Outcome': {
    experience: {
      requiredBulletPoints: 5,
      emphasizeMetrics: true,
    },
    projects: {
      requiredBulletPoints: 3,
      emphasizeMetrics: true,
    },
    skills: {},
  },

  'Situation + Task + Action + Result': {
    experience: {
      requiredBulletPoints: 4,
      maxWordsPerBullet: 26,
    },
    projects: {
      requiredBulletPoints: 2,
    },
    skills: {},
  },
};
