import {
  Resume,
  ResumeSection,
  Header,
  Education,
  Experience,
  Project,
  Cert

} from '@/app/types/resume-types';

const SECTION_PATTERNS = {
  header: /linkedin|github|/i,
  education: /university|degree|college|education/i,
  summary: /about me|summary|about me/i,
  experience: /experience|work experience| professional experience/i,
  projects: /projects|side projects|personal projects/i,
  skills: /skills|technologies|languages|tools/i,
  certifications: /certifications|cert/i
};

export function textToResumeParser(resume: string): Resume {
  // iterate through text in resume if section
  // then we will see what specific functions to use
  // unknownSections?: string[];
}

//TODO: create helper functions for section patterns

function isSection(line: string) {
  const normalized = line
    .toLowerCase()
    .replace(/[:–—-]/g, '')
    .trim();

  if (SECTION_PATTERNS.certifications.test(normalized)) {
    return {} as Header;
  } 

  if (SECTION_PATTERNS.education.test(normalized)) {
    return {} as Education
  }

  if (SECTION_PATTERNS.experience.test(normalized)) {
    return {} as Experience
  }

  if (SECTION_PATTERNS.header.test(normalized)) {
    return {} as Header
  }

  if (SECTION_PATTERNS.projects.test(normalized)) {
    return {} as Project
  }
  
}