import { AIClient, AIConfig, SummarizeOptions, SummarizeResult } from './types';

/**
 * DeepSeek API 客户端
 * 价格: ¥0.0005/1000 tokens (极便宜)
 */
export class DeepSeekClient extends AIClient {
  private baseUrl = 'https://api.deepseek.com/chat/completions';

  constructor(config: AIConfig) {
    super(config);
    if (!config.apiKey) {
      throw new Error('DEEPSEEK_API_KEY is required');
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

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: options.maxLength || 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in DeepSeek response');
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

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 50,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '新闻标题';
  }
}
