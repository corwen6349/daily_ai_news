import { getConfig } from '@daily-ai-news/config';
import type { SummaryInput } from '../types';

export async function summarizeWithGemini(input: SummaryInput): Promise<string> {
  const { geminiApiKey } = getConfig();
  
  if (!geminiApiKey) {
    console.warn('Gemini API key not configured, returning original content');
    return input.content.substring(0, 200);
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `请用中文总结以下文章（不超过150字）：

标题：${input.title}

内容：${input.content.substring(0, 1000)}

要求：
1. 简洁明了，突出核心观点
2. 使用中文
3. 不超过150字`
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    return summary || input.content.substring(0, 200);
  } catch (error) {
    console.error('Gemini summarization failed:', error);
    return input.content.substring(0, 200);
  }
}
