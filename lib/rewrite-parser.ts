export function rewriteParser(resume: string) {
  const resumeHeaders = [
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
  ];
  const lines = resume.split(/\r?\n/);
  const resumeParts = [];
  let currPart: { header: string, content: string[] } | null = null

  for (const line of lines) {
    if (isHeader(line)) {
      if (currPart != null) {
        resumeParts.push(currPart);
        currPart = {header: line, content: []}
        continue
      } else {
        currPart = { header: line, content: [] };
      }
    }

    if (currPart != null) {
      currPart.content.push(line);
    }
  }

  function isHeader(line: string): boolean {
    const normalized = line
      .toLowerCase()
      .replace(/[:–—-]/g, '')
      .trim();

    if (resumeHeaders.includes(normalized)) {
      return true;
    }
    return false;
  }
  return resumeParts;
}