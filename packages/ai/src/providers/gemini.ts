import { getConfig } from '@daily-ai-news/config';
import type { SummaryInput } from '../types';

async function executeGeminiRequest(prompt: string, maxTokens: number, systemInstruction?: string): Promise<string> {
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
      
      const body: any = {
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
      };

      if (systemInstruction) {
        body.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      const response = await fetch(`${endpoint}?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify(body)
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
  const systemInstruction = `你是一位资深的科技媒体主编，擅长用通俗易懂、客观中立但又不失深度的语言报道 AI 领域的最新进展。
你的写作风格：
1.  **去 AI 味**：拒绝机械的翻译腔（如“首先”、“总之”、“此外”的滥用），拒绝空洞的形容词（如“革命性”、“颠覆性”）。
2.  **人话写作**：像给朋友讲故事一样，自然流畅。多用短句，少用长难句。
3.  **信息密度高**：直击要害，不废话。
4.  **结构清晰**：重点突出，逻辑顺畅。

你的任务是将输入的 AI 资讯改写成一篇中文科技报道。`;

  const imagesContext = input.images && input.images.length > 0 
    ? `\n**可用图片资源：**\n${input.images.map((img, i) => `[图片${i+1}]: ${img}`).join('\n')}\n请在文章合适位置插入图片，使用 Markdown 格式：![图片描述](图片链接)` 
    : '';
    
  const videosContext = input.videos && input.videos.length > 0
    ? `\n**可用视频资源：**\n${input.videos.map((vid, i) => `[视频${i+1}]: ${vid}`).join('\n')}\n请在文章合适位置插入视频链接或说明。`
    : '';

  const prompt = `请改写以下资讯：

**标题：** ${input.title}
**原文链接：** ${input.url}
**内容：**
${input.content.substring(0, 3000)}
${imagesContext}
${videosContext}

**改写要求：**
1.  **标题优化**：请为文章拟定一个吸引人的中文标题，**长度严格控制在 25 个字以内**。标题要包含核心信息点。
2.  **核心摘要**：文章开头直接用一句话概括“发生了什么”以及“为什么重要”。
3.  **深度解读**：
    *   解释技术原理或产品功能时，多用类比。
    *   如果有具体数据（性能提升、参数量等），必须保留并加粗。
    *   分析这对普通用户或开发者意味着什么。
4.  **多媒体使用**：
    *   如果提供了图片或视频资源，**必须**在文中合适的位置插入。
    *   如果没有提供资源，不要凭空捏造。
5.  **格式规范**：
    *   使用 Markdown 格式。
    *   **关键词**（如模型名称、公司名、核心数据）使用加粗。
    *   文末必须附带：📎 [查看原文](${input.url})
6.  **篇幅**：200-350 字。

**输出格式：**
# [这里放你拟定的标题]

[这里是正文内容...]

请开始改写：`;

  return executeGeminiRequest(prompt, 1000, systemInstruction);
}
