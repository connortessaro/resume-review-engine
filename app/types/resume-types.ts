import { RewriteMode } from '@/app/types/mode-types';
import { Explanation } from '@/app/types/explanation-types'

export interface StoredEntry {
  id: number;
  original: Resume;
  improved: Resume;
  mode: RewriteMode;
  timestamp: string;
  explanation?: Explanation;
}

export const RESUME_SECTIONS = [
  'header',
  'summary',
  'education',
  'skills',
  'certifications',
  'experience',
  'projects',
] as const;

export type ResumeSection = (typeof RESUME_SECTIONS)[number];

export const RESUME_SECTION_SET = new Set(RESUME_SECTIONS);

export interface Resume {
  header?: Header;
  education?: Education;
  summary?: string;
  experiences?: Experience[];
  projects?: Project[];
  skills?: Skills;
  certifications?: Cert[];
  unknown?: string[];
}

export interface Header {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  githubLink?: string;
  linkedinLink?: string;
}

export interface Education {
  university?: string;
  graduationMonth?: string;
  graduationYear?: string;
  major?: string;
  gpa?: string;
  relevantCoursework?: string[];
}

export interface Experience {
  companyName?: string;
  role?: string;
  location?: string;
  bulletPoints?: string[];
  duration?: string;
}
export interface Project {
  projectName?: string;
  githubLink?: string;
  technologies?: string;
  createdAt?: string;
  bulletPoints?: string[];
}

export interface Cert {
  certName?: string;
  certDate?: string;
}

export interface Skills {
  frameworks?: string[];
  languages?: string[];
  tools?: string[];
}
