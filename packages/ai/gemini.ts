import { AIClient, AIConfig, SummarizeOptions, SummarizeResult } from './types';

/**
 * Google Gemini API 客户端
 * 免费额度: 50请求/分钟, 150万tokens/月
 */
export class GeminiClient extends AIClient {
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

  constructor(config: AIConfig) {
    super(config);
    if (!config.apiKey) {
      throw new Error('GEMINI_API_KEY is required');
    }
  }

  async summarize(options: SummarizeOptions): Promise<SummarizeResult> {
    const prompt = `
请简洁地总结以下AI新闻，并提取3个关键点。

原文:
${options.text}

请按以下JSON格式回复:
{
  "summary": "一句话总结",
  "keyPoints": ["关键点1", "关键点2", "关键点3"]
}
    `.trim();

    const response = await fetch(
      `${this.baseUrl}/${this.config.model}:generateContent?key=${this.config.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            maxOutputTokens: options.maxLength || 300,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('No content in Gemini response');
    }

    try {
      const parsed = JSON.parse(content);
      return {
        summary: parsed.summary,
        keyPoints: parsed.keyPoints,
      };
    } catch {
      return {
        summary: content.substring(0, 200),
        keyPoints: [],
      };
    }
  }

  async generateTitle(content: string): Promise<string> {
    const prompt = `为以下AI新闻生成一个简洁的标题（不超过20字）:\n\n${content}`;

    const response = await fetch(
      `${this.baseUrl}/${this.config.model}:generateContent?key=${this.config.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 50,
          },
        }),
      }
    );

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '新闻标题';
  }
}
