import { getConfig } from '@daily-ai-news/config';
import type { SummaryInput } from '../types';

/**
 * 使用 Gemini 2.0 Flash 模型生成文章摘要
 * 参考：https://ai.google.dev/gemini-api/docs/quickstart?hl=zh-cn
 */
export async function summarizeWithGemini(input: SummaryInput): Promise<string> {
  const { geminiApiKey } = getConfig();
  
  if (!geminiApiKey) {
    console.warn('⚠️ Gemini API key not configured');
    throw new Error('GEMINI_API_KEY 环境变量未配置');
  }

  // 官方推荐的最新模型列表（按优先级）
  const models = [
    'gemini-2.0-flash-exp',        // 最新实验版（推荐）
    'gemini-1.5-flash',            // 稳定版
    'gemini-1.5-flash-latest',     // 最新稳定版
    'gemini-1.5-pro'               // 高级版本
  ];

  const prompt = `请用中文总结以下AI资讯文章，生成专业的新闻摘要：

标题：${input.title}

内容：${input.content.substring(0, 3000)}

要求：
1. 用3-5句话概括核心内容和技术亮点
2. 突出实际应用价值和创新之处
3. 语言简洁专业，适合技术日报阅读
4. 控制在150-250字之间
5. 直接返回摘要内容，不要前缀说明`;

  let lastError: Error | null = null;

  // 按优先级尝试不同模型
  for (const model of models) {
    try {
      // 官方 REST API 端点格式
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      
      console.log(`🔄 尝试 Gemini 模型: ${model}`);
      
      const response = await fetch(`${endpoint}?key=${geminiApiKey}`, {
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
            maxOutputTokens: 500,
            topP: 0.95,
            topK: 40
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_ONLY_HIGH'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_ONLY_HIGH'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_ONLY_HIGH'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_ONLY_HIGH'
            }
          ]
        })
      });

      const responseText = await response.text();

      if (!response.ok) {
        const errorMsg = `HTTP ${response.status}: ${responseText.substring(0, 200)}`;
        console.error(`❌ ${model} 失败:`, errorMsg);
        lastError = new Error(errorMsg);
        continue; // 尝试下一个模型
      }

      const data = JSON.parse(responseText);
      
      // 检查是否被安全过滤器阻止
      if (data.promptFeedback?.blockReason) {
        console.warn(`⚠️ ${model} 被安全过滤器阻止: ${data.promptFeedback.blockReason}`);
        lastError = new Error(`Content blocked: ${data.promptFeedback.blockReason}`);
        continue;
      }

      // 提取生成的文本
      const candidate = data.candidates?.[0];
      const summary = candidate?.content?.parts?.[0]?.text;
      
      if (!summary || summary.trim().length < 20) {
        console.warn(`⚠️ ${model} 返回空摘要或内容过短`);
        continue;
      }

      // 检查完成原因
      const finishReason = candidate?.finishReason;
      if (finishReason === 'SAFETY' || finishReason === 'RECITATION') {
        console.warn(`⚠️ ${model} 被阻止: ${finishReason}`);
        continue;
      }

      console.log(`✅ Gemini (${model}) 总结成功: ${summary.substring(0, 50)}...`);
      return summary.trim();

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`❌ ${model} 调用异常:`, errorMsg);
      lastError = error as Error;
      continue;
    }
  }

  // 所有模型都失败，抛出详细错误
  const finalError = lastError || new Error('所有 Gemini 模型都不可用');
  console.error('❌ Gemini API 完全失败:', finalError.message);
  throw finalError;
}
