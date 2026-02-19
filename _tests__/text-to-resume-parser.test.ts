import { test, expect } from '@jest/globals';
import { textToResumeParser } from '../lib/text-to-resume-parser';

test('pushes previous experience when next dated experience line appears', () => {
  const resumeText = [
    'Experience',
    'Acme Corp | Software Engineer | Jan 2020 - Feb 2022',
    '- Built internal tooling',
    'Beta Inc | Senior Engineer | Mar 2022 - Present',
    '- Led migration to Next.js',
  ].join('\n');

  const parsed = textToResumeParser(resumeText);

  expect(parsed.experiences?.length).toEqual(2);
  expect(parsed.experiences?.[0]?.companyName).toEqual('Acme Corp');
  expect(parsed.experiences?.[0]?.duration).toEqual('Jan 2020 - Feb 2022');
  expect(parsed.experiences?.[0]?.bulletPoints).toEqual([
    'Built internal tooling',
  ]);

  expect(parsed.experiences?.[1]?.companyName).toEqual('Beta Inc');
  expect(parsed.experiences?.[1]?.duration).toEqual('Mar 2022 - Present');
  expect(parsed.experiences?.[1]?.bulletPoints).toEqual([
    'Led migration to Next.js',
  ]);
});

test('pushes previous project when next dated project line appears', () => {
  const resumeText = [
    'Projects',
    'Parser Revamp | Jan 2024',
    '- Added stateful section parsing',
    'Resume AI Copilot | Feb 2025',
    '- Implemented prompt routing',
  ].join('\n');

  const parsed = textToResumeParser(resumeText);

  expect(parsed.projects?.length).toBe(2);
  expect(parsed.projects?.[0]?.projectName?.trim()).toBe('Parser Revamp');
  expect(parsed.projects?.[0]?.createdAt).toBe('Jan 2024');
  expect(parsed.projects?.[0]?.bulletPoints).toEqual([
    'Added stateful section parsing',
  ]);

  expect(parsed.projects?.[1]?.projectName).toBe('Resume AI Copilot');
  expect(parsed.projects?.[1]?.createdAt).toBe('Feb 2025');
  expect(parsed.projects?.[1]?.bulletPoints).toEqual([
    'Implemented prompt routing',
  ]);
});

test('pushes previous certification when next dated certification line appears', () => {
  const resumeText = [
    'Certifications',
    'AWS Certified Developer | 2021',
    'Google Professional Cloud Developer | 2023',
  ].join('\n');

  const parsed = textToResumeParser(resumeText);

  expect(parsed.certifications?.length).toBe(2);
  expect(parsed.certifications?.[0]?.certName).toBe('AWS Certified Developer');
  expect(parsed.certifications?.[0]?.certDate).toBe('2021');
  expect(parsed.certifications?.[1]?.certName).toBe(
    'Google Professional Cloud Developer',
  );
  expect(parsed.certifications?.[1]?.certDate).toBe('2023');
});
