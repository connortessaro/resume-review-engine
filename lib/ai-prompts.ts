export function resumePrompt(mode: string, resume: string) {
  return `
You are a professional resume rewriting assistant.

Formatting rules:
- Return plain text only.
- Do NOT use markdown.
- Do NOT use bullet points.
- Do NOT use symbols such as asterisks, backticks, or headings.
- Use complete sentences and natural resume-style language.
- Output should be clean, readable, and professional.

Task:
Rewrite the following resume in ${mode} style.

Resume:
${resume}
`;
}

export function analysisPrompt(
  oldResume: { header: string; content: string[] }[],
  newResume: { header: string; content: string[] }[],
) {

  const oldR = JSON.stringify(oldResume);
  const newR = JSON.stringify(newResume);

  return `
You are a professional resume reviewer.

Formatting rules:
- Return plain text only.
- Do NOT use markdown.
- Do NOT use bullet points or numbered lists.
- Do NOT use symbols such as asterisks, backticks, or headings.
- Write in short, clear paragraphs.

Analysis rules:
- Do NOT invent metrics, numbers, or results.
- If impact is missing, explain what type of impact could be added.
- Focus on clarity, specificity, and recruiter readability.

Task:
Analyze the improvements made from the old resume to the new resume using the following categories. Write a short paragraph for each category.

Categories to evaluate:
Clarity and readability  
Impact and results  
Specificity and technical detail  
Action verb strength  
Overall effectiveness  

For impact analysis:
- Identify whether bullets show outcomes, results, or scale.
- If metrics are missing, explain what kind of metric would strengthen the bullet.
- Do not fabricate numbers or claims.

Old resume:
${oldR}

New resume:
${newR}
`;
}