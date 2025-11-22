import { summarizeWithGemini } from './providers/gemini';
import { summarizeWithDeepSeek, translateTextWithDeepSeek } from './providers/deepseek';
import { SummaryInput } from './types';
import { getConfig } from '@daily-ai-news/config';

export async function summarize(input: SummaryInput): Promise<string> {
  const { geminiApiKey } = getConfig();

  try {
    if (geminiApiKey) {
      console.log('Using Gemini for summarization.');
      return await summarizeWithGemini(input);
    } else {
      console.log('Using DeepSeek for summarization.');
      return await summarizeWithDeepSeek(input);
    }
  } catch (error) {
    console.error('AI summarization failed:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

export async function translateText(text: string): Promise<string> {
  // Currently only using DeepSeek for translation as it is cheaper/better for this
  try {
    return await translateTextWithDeepSeek(text);
  } catch (error) {
    console.warn('Translation failed:', error);
    return text; // Fallback to original text
  }
}

export type { SummaryInput } from './types';
