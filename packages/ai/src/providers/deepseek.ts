import { getConfig } from '@daily-ai-news/config';
import type { SummaryInput } from '../types';

export async function summarizeWithDeepSeek(input: SummaryInput): Promise<string> {
  const { deepseekApiKey } = getConfig();
  
  if (!deepseekApiKey) {
    console.warn('DeepSeek API key not configured, returning original content');
    return input.content.substring(0, 200);
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekApiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的文章摘要助手，擅长用简洁的中文总结技术文章。'
          },
          {
            role: 'user',
            content: `请用中文总结以下文章（不超过150字）：

标题：${input.title}

内容：${input.content.substring(0, 1000)}

要求：
1. 简洁明了，突出核心观点
2. 使用中文
3. 不超过150字`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const summary = data?.choices?.[0]?.message?.content;
    
    return summary || input.content.substring(0, 200);
  } catch (error) {
    console.error('DeepSeek summarization failed:', error);
    return input.content.substring(0, 200);
  }
}
