/**
 * AI 模型集成 - 支持多个提供商
 */

export interface AIConfig {
  provider: 'openai' | 'gemini' | 'deepseek';
  apiKey: string;
  model: string;
  maxTokens?: number;
}

export interface SummarizeOptions {
  text: string;
  maxLength?: number;
  language?: string;
}

export interface SummarizeResult {
  summary: string;
  keyPoints: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export abstract class AIClient {
  protected config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  abstract summarize(options: SummarizeOptions): Promise<SummarizeResult>;
  abstract generateTitle(content: string): Promise<string>;
}
