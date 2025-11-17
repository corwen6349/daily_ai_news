import { getConfig } from '@daily-ai-news/config';
import type { SummaryInput } from '../types';

async function executeGeminiRequest(prompt: string, maxTokens: number): Promise<string> {
  const { geminiApiKey } = getConfig();
  
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY 环境变量未配置');
  }

  // 官方推荐的最新模型列表（按优先级）
  const models = [
    'gemini-1.5-flash', // 替代 -latest
    'gemini-1.5-pro'    // 替代 -latest
  ];

  let lastError: Error | null = null;

  for (const model of models) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30秒超时

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      console.log(`🔄 尝试 Gemini 模型: ${model}`);
      
      const response = await fetch(`${endpoint}?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: maxTokens,
            topP: 0.95,
            topK: 40
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
          ]
        })
      });
      
      clearTimeout(timeout);
      const responseText = await response.text();

      if (!response.ok) {
        const errorMsg = `HTTP ${response.status}: ${responseText.substring(0, 200)}`;
        console.error(`❌ ${model} 失败:`, errorMsg);
        lastError = new Error(errorMsg);
        continue;
      }

      const data = JSON.parse(responseText);
      
      if (data.promptFeedback?.blockReason) {
        const blockReason = data.promptFeedback.blockReason;
        console.warn(`⚠️ ${model} 被安全过滤器阻止: ${blockReason}`);
        lastError = new Error(`Content blocked: ${blockReason}`);
        continue;
      }

      const candidate = data.candidates?.[0];
      const content = candidate?.content?.parts?.[0]?.text;
      
      if (!content || content.trim().length < 20) {
        console.warn(`⚠️ ${model} 返回空内容或内容过短`);
        lastError = new Error('Empty or too short content returned');
        continue;
      }

      const finishReason = candidate?.finishReason;
      if (finishReason && finishReason !== 'STOP') {
        console.warn(`⚠️ ${model} 未正常完成: ${finishReason}`);
        lastError = new Error(`Incomplete generation: ${finishReason}`);
        continue;
      }

      console.log(`✅ Gemini (${model}) 生成成功: ${content.substring(0, 50)}...`);
      return content.trim();

    } catch (fetchError) {
      clearTimeout(timeout);
      const errorMsg = fetchError instanceof Error ? fetchError.message : String(fetchError);
      if (errorMsg.includes('aborted')) {
        console.error(`❌ ${model} 调用超时`);
        lastError = new Error(`Request timed out for model ${model}`);
      } else {
        console.error(`❌ ${model} 调用异常:`, errorMsg);
        lastError = fetchError as Error;
      }
      continue;
    }
  }

  const finalError = lastError || new Error('所有 Gemini 模型都不可用');
  console.error('❌ Gemini API 完全失败:', finalError.message);
  throw finalError;
}


/**
 * 使用 Gemini 模型生成文章摘要
 */
export async function summarizeWithGemini(input: SummaryInput): Promise<string> {
  const prompt = `请将以下 AI 资讯改写成一篇专业的科技报道（200-300字）：

**标题：** ${input.title}

**原文链接：** ${input.url}

**内容：**
${input.content.substring(0, 3000)}

**写作要求：**
0. **重要：如果以上内容是英文，必须先将其翻译成中文，再按下面要求改写**
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

  return executeGeminiRequest(prompt, 800);
}

/**
 * 使用 Gemini 模型生成视频口播稿
 */
export async function generateVideoScriptWithGemini(prompt: string): Promise<string> {
  const systemInstruction = '你是一位专业的短视频内容创作者，擅长撰写完整、简洁有力、节奏明快的口播稿。每个口播稿都必须有开头、中间、结尾，内容完整。';
  const fullPrompt = `${systemInstruction}\n\n${prompt}`;
  return executeGeminiRequest(fullPrompt, 1200);
}
