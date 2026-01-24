'use server';
import { resumePrompt } from '@/lib/prompts';
import { explanationPrompt } from '@/lib/prompts';
import { InferenceClient } from '@huggingface/inference';

const client = new InferenceClient(process.env.HF_TOKEN);

export async function createResume(mode: string, resume: string) {
  try {
    if (resume.trim().length < 50) {
      throw new Error('Please provide a valid resume.');
    }
    const prompt = resumePrompt(mode, resume);

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

export async function giveExplanation(oldResume: string, newResume: string) {
  const prompt = explanationPrompt(oldResume, newResume);

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
