'use server';
import { resumePrompt } from '@/lib/ai-prompts';
import { analysisPrompt } from '@/lib/ai-prompts';
import { textToResumeParser } from '@/lib/text-to-resume-parser';
import { Resume } from '@/app/types/resume-types';
import { InferenceClient } from '@huggingface/inference';

const client = new InferenceClient(process.env.HF_TOKEN);

export async function createResume(mode: string, resume: string) {
  try {
    if (resume.trim().length < 15) {
      throw new Error('Input is too short.');
    }

    const userInputtedResume = JSON.stringify(textToResumeParser(resume), null, 2);

    const prompt = resumePrompt(mode, userInputtedResume);

    const chatCompletion = await client.chatCompletion({
      model: 'meta-llama/Llama-3.2-1B-Instruct',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
    if (!chatCompletion) {
      throw new Error('The model returned an empty response.');
    }
    return chatCompletion.choices[0].message.content ?? '';
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred during resume rewriting.');
  }
}

export async function giveExplanation(parsedOld: Resume, parsedNew: Resume) {
  const prompt = analysisPrompt(parsedOld, parsedNew);

  const chatCompletion = await client.chatCompletion({
    model: 'meta-llama/Llama-3.2-1B-Instruct',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const output = chatCompletion.choices[0].message.content ?? '';

  return output;
}
