import { summarizeWithGemini } from './providers/gemini';
import { summarizeWithDeepSeek } from './providers/deepseek';
import { SummaryInput } from './types';

export async function summarize(input: SummaryInput): Promise<string> {
  const provider = process.env.AI_PROVIDER ?? 'gemini';

  if (provider === 'deepseek') {
    return summarizeWithDeepSeek(input);
  }

  try {
    return await summarizeWithGemini(input);
  } catch (error) {
    console.warn('Gemini summarization failed, fallback to DeepSeek', error);
    return summarizeWithDeepSeek(input);
  }
}

export type { SummaryInput } from './types';
