import { Resume } from '@/app/types/resume-types';

function joinOrFallback(values: string[] | undefined): string {
  return values && values.length > 0 ? values.join(', ') : 'N/A';
}

function cleanLine(value: string | undefined): string {
  return value && value.trim().length > 0 ? value.trim() : 'N/A';
}

export function formatResumeForDisplay(resume: Resume): string {
  const lines: string[] = [];

  const h = resume.header;
  if (h) {
    lines.push('HEADER');
    lines.push(`Name: ${cleanLine(h.fullName)}`);
    lines.push(`Email: ${cleanLine(h.email)}`);
    lines.push(`Phone: ${cleanLine(h.phoneNumber)}`);
    lines.push(`GitHub: ${cleanLine(h.githubLink)}`);
    lines.push(`LinkedIn: ${cleanLine(h.linkedinLink)}`);
    lines.push('');
  }

  if (resume.summary) {
    lines.push('SUMMARY');
    lines.push(resume.summary);
    lines.push('');
  }

  const e = resume.education;
  if (e) {
    lines.push('EDUCATION');
    lines.push(`School: ${cleanLine(e.university)}`);
    lines.push(`Major: ${cleanLine(e.major)}`);
    lines.push(`Graduation: ${[e.graduationMonth, e.graduationYear].filter(Boolean).join(' ') || 'N/A'}`);
    lines.push(`GPA: ${cleanLine(e.gpa)}`);
    if (e.relevantCoursework?.length) {
      lines.push(`Coursework: ${e.relevantCoursework.join(', ')}`);
    }
    lines.push('');
  }

  if (resume.experiences?.length) {
    lines.push('EXPERIENCE');
    for (const exp of resume.experiences) {
      lines.push(`${cleanLine(exp.companyName)} | ${cleanLine(exp.role)} | ${cleanLine(exp.duration)}`);
      if (exp.location) lines.push(`Location: ${exp.location}`);
      for (const bullet of exp.bulletPoints ?? []) lines.push(`- ${bullet}`);
      lines.push('');
    }
  }

  if (resume.projects?.length) {
    lines.push('PROJECTS');
    for (const proj of resume.projects) {
      lines.push(`${cleanLine(proj.projectName)} | ${cleanLine(proj.createdAt)}`);
      if (proj.technologies) lines.push(`Technologies: ${proj.technologies}`);
      if (proj.githubLink) lines.push(`GitHub: ${proj.githubLink}`);
      for (const bullet of proj.bulletPoints ?? []) lines.push(`- ${bullet}`);
      lines.push('');
    }
  }

  const s = resume.skills;
  if (s) {
    lines.push('SKILLS');
    lines.push(`Languages: ${joinOrFallback(s.languages)}`);
    lines.push(`Frameworks: ${joinOrFallback(s.frameworks)}`);
    lines.push(`Tools: ${joinOrFallback(s.tools)}`);
    lines.push('');
  }

  if (resume.certifications?.length) {
    lines.push('CERTIFICATIONS');
    for (const cert of resume.certifications) {
      lines.push(`${cleanLine(cert.certName)} | ${cleanLine(cert.certDate)}`);
    }
    lines.push('');
  }

  if (resume.unknown?.length) {
    lines.push('OTHER');
    lines.push(...resume.unknown);
    lines.push('');
  }

  return lines.join('\n').trim();
}

export function resumePreview(resume: Resume, maxLength = 120): string {
  const compact = formatResumeForDisplay(resume).replace(/\s+/g, ' ').trim();
  return compact.slice(0, maxLength);
}
