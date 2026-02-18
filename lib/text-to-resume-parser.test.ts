import assert from 'node:assert/strict';
import test from 'node:test';

import { textToResumeParser } from './text-to-resume-parser';

test('pushes previous experience when next dated experience line appears', () => {
  const resumeText = [
    'Experience',
    'Acme Corp | Software Engineer | Jan 2020 - Feb 2022',
    '- Built internal tooling',
    'Beta Inc | Senior Engineer | Mar 2022 - Present',
    '- Led migration to Next.js',
  ].join('\n');

  const parsed = textToResumeParser(resumeText);

  assert.equal(parsed.experiences?.length, 2);
  assert.equal(parsed.experiences?.[0]?.companyName, 'Acme Corp');
  assert.equal(parsed.experiences?.[0]?.duration, 'Jan 2020 - Feb 2022');
  assert.deepEqual(parsed.experiences?.[0]?.bulletPoints, [
    'Built internal tooling',
  ]);

  assert.equal(parsed.experiences?.[1]?.companyName, 'Beta Inc');
  assert.equal(parsed.experiences?.[1]?.duration, 'Mar 2022 - Present');
  assert.deepEqual(parsed.experiences?.[1]?.bulletPoints, [
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

  assert.equal(parsed.projects?.length, 2);
  assert.equal(parsed.projects?.[0]?.projectName, 'Parser Revamp');
  assert.equal(parsed.projects?.[0]?.createdAt, 'Jan 2024');
  assert.deepEqual(parsed.projects?.[0]?.bulletPoints, [
    'Added stateful section parsing',
  ]);

  assert.equal(parsed.projects?.[1]?.projectName, 'Resume AI Copilot');
  assert.equal(parsed.projects?.[1]?.createdAt, 'Feb 2025');
  assert.deepEqual(parsed.projects?.[1]?.bulletPoints, [
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

  assert.equal(parsed.certifications?.length, 2);
  assert.equal(parsed.certifications?.[0]?.certName, 'AWS Certified Developer');
  assert.equal(parsed.certifications?.[0]?.certDate, '2021');
  assert.equal(
    parsed.certifications?.[1]?.certName,
    'Google Professional Cloud Developer',
  );
  assert.equal(parsed.certifications?.[1]?.certDate, '2023');
});
