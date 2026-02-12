import {
  Resume,
  RESUME_SECTION_SET,
  ResumeSection,
} from '@/app/types/resume-types';

export function textToResumeParser(resume: string): Resume {
  const lines = resume.split(/\r?\n/);
  let currPart: { section: string; content: string[] } | null = null;
  const parsed: Resume = {};

  for (const line of lines) {
    if (isSection(line)) {
      if (currPart != null) {
        parsed[line as keyof Resume] = currPart.content;
        currPart = { section: line, content: [] };
        continue;
      } else {
        currPart = { section: line, content: [] };
      }
    }

    if (currPart != null) {
      currPart.content.push(line);
    }
  }

  return parsed;
}

function isSection(line: string): boolean {
  const normalized = line
    .toLowerCase()
    .replace(/[:–—-]/g, '')
    .trim();

  if (RESUME_SECTION_SET.has(normalized as ResumeSection)) {
    return true;
  }
  return false;
}
