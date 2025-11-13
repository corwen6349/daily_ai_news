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
    'gemini-2.5-flash',            // 最新、最快的模型 (2025-11)
    'gemini-2.0-flash-exp',        // 实验版
    'gemini-1.5-flash',            // 稳定版
    'gemini-1.5-flash-latest',     // 最新稳定版
    'gemini-1.5-pro'               // 高级版本
  ];

  const prompt = `请将以下 AI 资讯改写成一篇专业的科技报道（200-300字）：

**标题：** ${input.title}

**原文链接：** ${input.url}

**内容：**
${input.content.substring(0, 2000)}

**写作要求：**
1. **开头**：一句话概括核心要点（What happened / What's new）
2. **主体**：
   - 详细说明技术细节、产品特点或研究成果
   - 用具体数据或例子支撑（如：性能提升 X%、支持 Y 功能）
   - 分析对行业/用户的实际影响
3. **格式**：
   - 使用 Markdown，关键词加粗（**关键词**）
   - 如果内容涉及图片/视频/Demo，用 📊 🎬 🖼️ 等 emoji 标注
   - 段落简洁（每段 2-3 句）
4. **结尾**：必须添加 "📎 [查看原文](${input.url})"

示例结构：
---
**OpenAI 发布 GPT-5**，性能相比 GPT-4 提升 40%，推理速度快 2 倍。

新模型支持 **128K 上下文长度**，可处理约 100 页文档。测试显示在数学推理、代码生成等任务上表现更优，特别是复杂问题分解能力显著增强。📊

这将显著降低企业 AI 应用成本，加速多模态 AI 落地。OpenAI 计划于 12 月向 API 用户开放。

📎 [查看原文](https://example.com)
---

直接输出报道内容，不要标题或额外说明。`;

  let lastError: Error | null = null;

  // 按优先级尝试不同模型
  for (const model of models) {
    try {
      // 官方 REST API 端点格式
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      
      console.log(`🔄 尝试 Gemini 模型: ${model}`);
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30秒超时
      
      try {
        const response = await fetch(`${endpoint}?key=${geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: controller.signal,
          body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
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
      
      clearTimeout(timeout);

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

      } catch (fetchError) {
        clearTimeout(timeout);
        const errorMsg = fetchError instanceof Error ? fetchError.message : String(fetchError);
        console.error(`❌ ${model} 调用异常:`, errorMsg);
        lastError = fetchError as Error;
        continue;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`❌ ${model} 处理异常:`, errorMsg);
      lastError = error as Error;
      continue;
    }
  }

  // 所有模型都失败，抛出详细错误
  const finalError = lastError || new Error('所有 Gemini 模型都不可用');
  console.error('❌ Gemini API 完全失败:', finalError.message);
  throw finalError;
}
