import { getConfig } from '@daily-ai-news/config';
import type { SummaryInput } from '../types';

export async function summarizeWithGemini(input: SummaryInput): Promise<string> {
  const { geminiApiKey } = getConfig();
  
  if (!geminiApiKey) {
    console.warn('Gemini API key not configured, returning original content');
    return input.content.substring(0, 200);
  }

  // 尝试多个 API 版本
  const endpoints = [
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`
  ];

  const prompt = `请用中文总结以下AI资讯文章，生成专业的新闻摘要：

标题：${input.title}

内容：${input.content.substring(0, 2000)}

要求：
1. 用3-5句话概括核心内容
2. 突出技术亮点和实际应用价值
3. 语言简洁专业，适合技术日报
4. 不超过200字
5. 只返回摘要内容，不要额外说明`;

  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    try {
      console.log(`尝试 Gemini API: ${endpoint.split('?')[0]}`);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
            topP: 0.8,
            topK: 40
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_NONE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_NONE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_NONE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_NONE'
            }
          ]
        })
      });

      const responseText = await response.text();
      console.log(`Gemini API 响应状态: ${response.status}`);

      if (!response.ok) {
        console.error(`Gemini API 错误响应: ${responseText}`);
        lastError = new Error(`Gemini API error: ${response.status} - ${responseText}`);
        continue; // 尝试下一个端点
      }

      const data = JSON.parse(responseText);
      const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (summary && summary.trim().length > 20) {
        console.log(`✅ Gemini 总结成功: ${summary.substring(0, 50)}...`);
        return summary.trim();
      }

      console.warn('Gemini 返回空摘要，尝试下一个端点');
    } catch (error) {
      console.error(`Gemini API 调用失败 (${endpoint.split('?')[0]}):`, error);
      lastError = error as Error;
      continue;
    }
  }

  // 所有端点都失败，抛出错误让上层处理降级
  console.error('所有 Gemini API 端点都失败');
  throw lastError || new Error('Gemini API 不可用');
}
