export function resumePrompt(mode: string, resume: string) {
  return `Rewrite this resume in ${mode} style:\n\n${resume}`;
}

export function explanationPrompt(oldResume: string, newResume: string) {
  return `Explain why the improvements made from the following old resume to the new resume are beneficial.\n\nOld Resume:\n${oldResume}\n\nNew Resume:\n${newResume}`;
}