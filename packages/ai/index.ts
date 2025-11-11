import { AIClient, AIConfig } from './types';
import { GeminiClient } from './gemini';
import { DeepSeekClient } from './deepseek';
// import { OpenAIClient } from './openai';

/**
 * AI 客户端工厂函数
 */
export function createAIClient(config: AIConfig): AIClient {
  switch (config.provider) {
    case 'gemini':
      return new GeminiClient(config);
    case 'deepseek':
      return new DeepSeekClient(config);
    // case 'openai':
    //   return new OpenAIClient(config);
    default:
      throw new Error(`Unsupported AI provider: ${config.provider}`);
  }
}

export * from './types';
export { GeminiClient } from './gemini';
export { DeepSeekClient } from './deepseek';
