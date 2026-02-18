import {
  Resume,
  ResumeSection,
  Header,
  Education,
  Experience,
  Project,
  Cert,
  Skills,
} from '@/app/types/resume-types';

const SECTION_PATTERNS = {
  header: /^(header|contact|contact info|links?)$/i,
  education: /^(education|academic background)$/i,
  summary: /^(summary|professional summary|profile|about me)$/i,
  experience: /^(experience|work experience|professional experience)$/i,
  projects: /^(projects|side projects|personal projects)$/i,
  skills: /^(skills|technical skills|technologies|languages|tools)$/i,
  certifications: /^(certifications?|licenses?|certs?)$/i,
};

const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PHONE_REGEX = /\+?\d[\d\s().-]{7,}\d/;
const GITHUB_REGEX = /\b(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s]+/i;
const LINKEDIN_REGEX = /\b(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[^\s]+/i;
const MONTH_REGEX =
  /\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/i;
const YEAR_REGEX = /\b(?:19|20)\d{2}\b/;
const DATE_RANGE_REGEX =
  /\b(?:(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+)?(?:19|20)\d{2}\s*(?:-|–|—|to)\s*(?:present|current|(?:(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+)?(?:19|20)\d{2})\b/i;
const DATE_VALUE_REGEX =
  /\b(?:(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+)?(?:19|20)\d{2}\b/i;
const BULLET_REGEX = /^[-*•]\s+/;

export function textToResumeParser(resume: string): Resume {
  const parsedHeader: Header = {};
  const parsedEducation: Education = {};
  const parsedExperiences: Experience[] = [];
  const parsedProjects: Project[] = [];
  const parsedUnknown: string[] = [];
  const parsedCerts: Cert[] = [];
  const parsedSummaryLines: string[] = [];
  const parsedSkills: Skills = {};

  let currentExperience: Experience | null = null;
  let currentProject: Project | null = null;
  let currentCert: Cert | null = null;

  const parsedResume: Resume = {
    header: parsedHeader,
    education: parsedEducation,
    experiences: parsedExperiences,
    projects: parsedProjects,
    skills: parsedSkills,
    certifications: parsedCerts,
    unknown: parsedUnknown,
  };

  const lines = resume.split('\n');
  let curSection: ResumeSection | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines.at(i);
    if (line == undefined) continue;

    const normalized = line.trim();
    if (normalized.length === 0) continue;

    const newSection = getSection(normalized);
    if (newSection != null) {
      if (curSection === 'experience') {
        currentExperience = pushCurrentIfPopulated(
          parsedExperiences,
          currentExperience,
        );
      }
      if (curSection === 'projects') {
        currentProject = pushCurrentIfPopulated(parsedProjects, currentProject);
      }
      if (curSection === 'certifications') {
        currentCert = pushCurrentIfPopulated(parsedCerts, currentCert);
      }
      curSection = newSection;
      continue;
    }

    if (curSection == null) {
      const consumedAsHeader = headerParser(normalized, parsedHeader);
      if (!consumedAsHeader) unknownTextParser(normalized, parsedUnknown);
      continue;
    }

    if (curSection === 'header') {
      const consumedAsHeader = headerParser(normalized, parsedHeader);
      if (!consumedAsHeader) unknownTextParser(normalized, parsedUnknown);
      continue;
    }

    if (curSection === 'summary') {
      parsedSummaryLines.push(normalized);
      continue;
    }

    if (curSection === 'skills') {
      skillsParser(normalized, parsedSkills);
      continue;
    }

    if (curSection === 'education') {
      const consumedAsEducation = educationParser(normalized, parsedEducation);
      if (!consumedAsEducation) unknownTextParser(normalized, parsedUnknown);
      continue;
    }

    if (curSection === 'experience') {
      currentExperience = experienceParser(
        normalized,
        parsedExperiences,
        currentExperience,
      );
      continue;
    }

    if (curSection === 'projects') {
      currentProject = projectParser(normalized, parsedProjects, currentProject);
      continue;
    }

    if (curSection === 'certifications') {
      currentCert = certificationParser(normalized, parsedCerts, currentCert);
      continue;
    }

    unknownTextParser(normalized, parsedUnknown);
  }

  currentExperience = pushCurrentIfPopulated(parsedExperiences, currentExperience);
  currentProject = pushCurrentIfPopulated(parsedProjects, currentProject);
  currentCert = pushCurrentIfPopulated(parsedCerts, currentCert);

  if (parsedSummaryLines.length > 0) {
    parsedResume.summary = parsedSummaryLines.join(' ');
  }
  if (!isSkillsPopulated(parsedSkills)) {
    delete parsedResume.skills;
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
  if (SECTION_PATTERNS.summary.test(normalized)) {
    return 'summary';
  }
  if (SECTION_PATTERNS.skills.test(normalized)) {
    return 'skills';
  }
  return null;
}

function headerParser(line: string, header: Header): boolean {
  let consumed = false;

  const emailMatch = line.match(EMAIL_REGEX);
  if (emailMatch) {
    header.email = emailMatch[0];
    consumed = true;
  }

  const phoneMatch = line.match(PHONE_REGEX);
  if (phoneMatch) {
    header.phoneNumber = phoneMatch[0];
    consumed = true;
  }

  const githubMatch = line.match(GITHUB_REGEX);
  if (githubMatch) {
    header.githubLink = githubMatch[0];
    consumed = true;
  }

  const linkedinMatch = line.match(LINKEDIN_REGEX);
  if (linkedinMatch) {
    header.linkedinLink = linkedinMatch[0];
    consumed = true;
  }

  if (!header.fullName && looksLikeName(line)) {
    header.fullName = line;
    consumed = true;
  }

  return consumed;
}

function educationParser(line: string, education: Education): boolean {
  let consumed = false;

  if (/university|college|institute|school/i.test(line)) {
    education.university = line;
    consumed = true;
  }

  const monthMatch = line.match(MONTH_REGEX);
  if (monthMatch) {
    education.graduationMonth = monthMatch[0];
    consumed = true;
  }

  const yearMatch = line.match(YEAR_REGEX);
  if (yearMatch) {
    education.graduationYear = yearMatch[0];
    consumed = true;
  }

  if (/gpa|grade/i.test(line)) {
    education.gpa = line;
    consumed = true;
  }

  if (
    /major|field of study|concentration|b\.?s\.?|bachelor|m\.?s\.?|master/i.test(
      line,
    )
  ) {
    education.major = line;
    consumed = true;
  }

  if (/coursework|courses|relevant coursework/i.test(line)) {
    const value = line.includes(':')
      ? line.split(':').slice(1).join(':')
      : line;
    education.relevantCoursework = value
      .split(/,|;/)
      .map((course) => course.trim())
      .filter(Boolean);
    consumed = true;
  }

  return consumed;
}

function experienceParser(
  line: string,
  experiences: Experience[],
  current: Experience | null,
): Experience | null {
  const content = stripBulletPrefix(line);
  const isBullet = content !== line;
  const dateValue = extractDateValue(line);
  if (
    !isBullet &&
    dateValue != null &&
    current != null &&
    isPopulated(current)
  ) {
    experiences.push(current);
    current = null;
  }

  if (current == null) current = {};

  if (isBullet) {
    pushBulletPoint(current, content);
    return current;
  }

  if (dateValue && !current.duration) {
    current.duration = dateValue;
  }

  const cleanedLine = dateValue
    ? line
        .replace(dateValue, '')
        .replace(/\s{2,}/g, ' ')
        .trim()
    : line;
  const parts = splitCompositeLine(cleanedLine);

  if (parts.length > 0 && !current.companyName) current.companyName = parts[0];
  if (parts.length > 1 && !current.role) current.role = parts[1];
  if (parts.length > 2 && !current.location) {
    const locationPart = parts.slice(2).find((part) => !hasDate(part));
    if (locationPart) current.location = locationPart;
  }

  if (!isPopulated(current) && cleanedLine.length > 0) {
    current.companyName = cleanedLine;
  }

  return current;
}

function projectParser(
  line: string,
  projects: Project[],
  current: Project | null,
): Project | null {
  const content = stripBulletPrefix(line);
  const isBullet = content !== line;
  const dateValue = extractDateValue(line);
  const githubMatch = line.match(GITHUB_REGEX);
  const projectTitleCue =
    !line.includes(':') &&
    !hasDate(line) &&
    !githubMatch &&
    !/tech|stack|built with|using/i.test(line) &&
    looksLikeStandaloneTitle(line);
  if (
    !isBullet &&
    current != null &&
    isPopulated(current) &&
    (dateValue != null || projectTitleCue)
  ) {
    projects.push(current);
    current = null;
  }

  if (current == null) current = {};

  if (isBullet) {
    pushBulletPoint(current, content);
    return current;
  }

  if (githubMatch && !current.githubLink) current.githubLink = githubMatch[0];
  if (dateValue && !current.createdAt) current.createdAt = dateValue;

  const cleanedLine = line
    .replace(githubMatch?.[0] ?? '', '')
    .replace(dateValue ?? '', '')
    .trim();
  const parts = splitCompositeLine(cleanedLine);

  if (parts.length > 0 && !current.projectName) current.projectName = parts[0];
  if (
    /tech|stack|built with|using/i.test(cleanedLine) &&
    !current.technologies
  ) {
    const value = cleanedLine.includes(':')
      ? cleanedLine.split(':').slice(1).join(':').trim()
      : cleanedLine;
    if (value.length > 0) current.technologies = value;
  }

  return current;
}

function certificationParser(
  line: string,
  certs: Cert[],
  current: Cert | null,
): Cert | null {
  const dateValue = extractDateValue(line);
  const titleValue = cleanToken(line.replace(dateValue ?? '', '').trim());
  if (
    current != null &&
    isPopulated(current) &&
    titleValue.length > 0 &&
    dateValue != null
  ) {
    certs.push(current);
    current = null;
  }

  if (current == null) current = {};
  if (titleValue.length > 0 && !current.certName) current.certName = titleValue;
  if (dateValue && !current.certDate) current.certDate = dateValue;

  return current;
}

function skillsParser(line: string, skills: Skills): void {
  const [label, ...rest] = line.split(':');
  const values = (rest.length > 0 ? rest.join(':') : label)
    .split(/,|;|\|/)
    .map((value) => value.trim())
    .filter(Boolean);

  if (values.length === 0) return;

  if (/language/i.test(label)) {
    skills.languages = uniqueArray([...(skills.languages ?? []), ...values]);
    return;
  }

  if (/framework|library/i.test(label)) {
    skills.frameworks = uniqueArray([...(skills.frameworks ?? []), ...values]);
    return;
  }

  if (/tool|platform|technology|tech/i.test(label)) {
    skills.tools = uniqueArray([...(skills.tools ?? []), ...values]);
    return;
  }

  skills.tools = uniqueArray([...(skills.tools ?? []), ...values]);
}

function unknownTextParser(line: string, unknown: string[]): void {
  if (line.length > 0) unknown.push(line);
}

function stripBulletPrefix(line: string): string {
  return line.replace(BULLET_REGEX, '').trim();
}

function extractDateValue(line: string): string | null {
  const rangeMatch = line.match(DATE_RANGE_REGEX);
  if (rangeMatch) return rangeMatch[0];

  const singleDateMatch = line.match(DATE_VALUE_REGEX);
  return singleDateMatch ? singleDateMatch[0] : null;
}

function hasDate(line: string): boolean {
  return DATE_RANGE_REGEX.test(line) || DATE_VALUE_REGEX.test(line);
}

function splitCompositeLine(line: string): string[] {
  return line
    .split(/\s+\|\s+|\s+•\s+|\s+·\s+|\s{2,}/)
    .map((part) => cleanToken(part))
    .filter(Boolean);
}

function cleanToken(value: string): string {
  return value.trim().replace(/^[-–—,|]+|[-–—,|]+$/g, '');
}

function pushBulletPoint(
  target: { bulletPoints?: string[] },
  value: string,
): void {
  const existing = target.bulletPoints ?? [];
  if (!existing.includes(value)) {
    target.bulletPoints = [...existing, value];
  }
}

function isPopulated(item: object): boolean {
  return Object.values(item as Record<string, unknown>).some((value) => {
    if (Array.isArray(value)) return value.length > 0;
    return typeof value === 'string' && value.trim().length > 0;
  });
}

function pushCurrentIfPopulated<T extends object>(
  destination: T[],
  current: T | null,
): null {
  if (current && isPopulated(current)) destination.push(current);
  return null;
}

function looksLikeName(line: string): boolean {
  if (/\d|@|https?:\/\//i.test(line)) return false;
  const words = line.trim().split(/\s+/);
  return words.length >= 2 && words.length <= 5;
}

function looksLikeStandaloneTitle(line: string): boolean {
  if (line.includes(':') || hasDate(line)) return false;
  const words = line.trim().split(/\s+/);
  return words.length >= 1 && words.length <= 8;
}

function uniqueArray(values: string[]): string[] {
  return [...new Set(values)];
}

function isSkillsPopulated(skills: Skills): boolean {
  return (
    (skills.languages?.length ?? 0) > 0 ||
    (skills.frameworks?.length ?? 0) > 0 ||
    (skills.tools?.length ?? 0) > 0
  );
}
