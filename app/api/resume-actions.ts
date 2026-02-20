'use server';
import { resumePrompt } from '@/lib/ai-prompts';
import { analysisPrompt } from '@/lib/ai-prompts';
import { textToResumeParser } from '@/lib/text-to-resume-parser';
import { Resume } from '@/app/types/resume-types';
import { InferenceClient } from '@huggingface/inference';
import { RewriteMode } from '@/app/types/mode-types';

const client = new InferenceClient(process.env.HF_TOKEN);

function requireToken() {
  if (!process.env.HF_TOKEN) {
    throw new Error('HF_TOKEN is not configured in environment variables.');
  }
}

function extractContent(
  chatCompletion: Awaited<ReturnType<InferenceClient['chatCompletion']>>,
  fallbackMessage: string,
) {
  const content = chatCompletion?.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error(fallbackMessage);
  return content;
}

export async function createResume(mode: RewriteMode, resume: string) {
  try {
    requireToken();
    if (resume.trim().length < 15) {
      throw new Error('Input is too short.');
    }

    const userInputtedResume = JSON.stringify(
      textToResumeParser(resume),
      null,
      2,
    );

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
    return extractContent(chatCompletion, 'The model returned an empty rewrite.');
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred during resume rewriting.');
  }
}

export async function giveExplanation(parsedOld: Resume, parsedNew: Resume) {
  try {
    requireToken();
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

    return extractContent(
      chatCompletion,
      'The model returned an empty explanation.',
    );
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while generating explanation.');
  }
}
