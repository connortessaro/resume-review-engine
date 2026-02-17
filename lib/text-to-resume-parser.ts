import {
  Resume,
  ResumeSection,
  Header,
  Education,
  Experience,
  Project,
  Cert,
} from '@/app/types/resume-types';

const SECTION_PATTERNS = {
  header: /linkedin|github|portfolio|email|@/i,
  education: /university|degree|college|education/i,
  summary: /about me|summary|about me/i,
  experience: /experience|work experience| professional experience/i,
  projects: /projects|side projects|personal projects/i,
  skills: /skills|technologies|languages|tools/i,
  certifications: /certifications|cert|certs|certification/i,
};

export function textToResumeParser(resume: string): Resume {
  const parsedHeader: Header = {};
  const parsedEducation: Education = {};
  const parsedExperiences: Experience[] = [];
  const parsedProjects: Project[] = [];
  const parsedUnknown: string[] = [];
  const parsedCerts: Cert[] = [];

  const parsedResume: Resume = {
    header: parsedHeader,
    education: parsedEducation,
    experiences: parsedExperiences,
    projects: parsedProjects,
    certifications: parsedCerts,
    unknown: parsedUnknown,
  };

  const lines = resume.split('\n');
  let curSection: ResumeSection | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines.at(i);
    if (line == undefined) continue;

    const newSection = getSection(line);
    const normalized = line.trim();

    if (curSection == null && newSection != null) {
      curSection = newSection;
    } else if (curSection != null && newSection == null) {
      if (curSection == 'header') headerParser(normalized, parsedHeader);
      if (curSection == 'certifications')
        certificationParser(normalized, parsedCerts);
      if (curSection == 'education')
        educationParser(normalized, parsedEducation);
      if (curSection == 'experience')
        experienceParser(normalized, parsedExperiences);
      if (curSection == 'projects') projectParser(normalized, parsedProjects);
    } else if (curSection == null && newSection == null) {
      unknownTextParser(normalized, parsedUnknown);
    } else if (
      curSection != null &&
      newSection != null &&
      curSection != newSection
    ) {
      curSection = newSection;
    }
  }
  return parsedResume;
}

function getSection(line: string): ResumeSection | null {
  const normalized = line
    .toLowerCase()
    .replace(/[:–—-]/g, '')
    .trim();

  if (SECTION_PATTERNS.certifications.test(normalized)) {
    return 'certifications';
  }

  if (SECTION_PATTERNS.education.test(normalized)) {
    return 'education';
  }

  if (SECTION_PATTERNS.experience.test(normalized)) {
    return 'experience';
  }

  if (SECTION_PATTERNS.header.test(normalized)) {
    return 'header';
  }

  if (SECTION_PATTERNS.projects.test(normalized)) {
    return 'projects';
  }
  return null;
}

function headerParser(line: string, header: Header): void {
  const emailCheck = line.match(/@|@gmail.com/g);
  if (emailCheck) {
    header.email = line;
    return;
  }

  const phoneCheck = line.match(/0-9/g);
  if (phoneCheck) {
    header.phoneNumber = line;
    return;
  }

  const githubCheck = line.match(/github|github.com/g);
  if (githubCheck) {
    header.githubLink = line;
    return;
  }

  const linkedinCheck = line.match(/linkedin|linkedin.com/g);
  if (linkedinCheck) {
    header.linkedinLink = line;
    return;
  }
}

function educationParser(line: string, education: Education): void {
  const uniCheck = line.match(/university|college/g);
  if (uniCheck) {
    education.university = line;
    return;
  }

  // cspell:disable-next-line
  const monthCheck = line.match(
    /^(1[0-2]|0?[1-9])$| (?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)/g,
  );

  if (monthCheck) {
    education.graduationMonth = line;
    return;
  }

  const yearCheck = line.match(/20[0-9]{2}|19[0-9]{2}/g);
  if (yearCheck) {
    education.graduationYear = line;
    return;
  }

  const gpaCheck = line.match(/gpa|grade/i);
  if (gpaCheck) {
    education.gpa = line;
    return;
  }

  const majorCheck = line.match(/major|field of study|concentration/g);
  if (majorCheck) {
    education.major = line;
    return;
  }

  const relevantCourseworkCheck = line.match(
    /coursework|courses|relevant coursework/g,
  );
  if (relevantCourseworkCheck) {
    education.relevantCoursework = line
      .split(/,|;/)
      .map((course) => course.trim());
    return;
  }
}

function experienceParser(line: string, experience: Experience): void {}

function projectParser(line: string, projects: Project): void {}

function certificationParser(line: string, cert: Cert): void {}

function unknownTextParser(line: string, unknown: string[]): void {}
