import { getConfig } from '@daily-ai-news/config';
import type { SummaryInput } from '../types';

export async function summarizeWithDeepSeek(input: SummaryInput): Promise<string> {
  const { deepseekApiKey } = getConfig();
  
  if (!deepseekApiKey) {
    throw new Error('DeepSeek API key not configured');
  }

  const imagesContext = input.images && input.images.length > 0 
    ? `\n**可用图片资源：**\n${input.images.map((img, i) => `[图片${i+1}]: ${img}`).join('\n')}\n请在文章合适位置插入图片，使用 Markdown 格式：![图片描述](图片链接)` 
    : '';

  const videosContext = input.videos && input.videos.length > 0
    ? `\n**可用视频资源：**\n${input.videos.map((vid, i) => `[视频${i+1}]: ${vid}`).join('\n')}\n请在文章合适位置插入视频链接或说明。`
    : '';

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
          content: `你是一位专业的 AI 科技记者，擅长将技术资讯改写成通俗易懂、引人入胜的专业报道。

写作风格：
- 新闻报道语气，客观专业
- 结构清晰：核心要点 → 技术细节 → 影响分析
- 用词精准，避免夸张
- 保留专业术语但加以解释

格式要求：
- 使用 Markdown 格式
- 突出关键信息（粗体、列表）
- 保持段落简洁（每段 2-3 句）

重要：如果原文是英文，必须先翻译成中文，再按上述要求改写。`
        },
        {
          role: 'user',
          content: `请将以下 AI 资讯改写成一篇专业的科技报道（200-350字）：

**标题：** ${input.title}
**原文链接：** ${input.url}
**内容：**
${input.content.substring(0, 3000)}
${imagesContext}
${videosContext}

**必须遵守的要求：**

1. **标题优化**：请为文章拟定一个吸引人的中文标题，**长度严格控制在 25 个字以内**。标题要包含核心信息点。
2. **内容结构**：
   - **第一段**：用一句话概括核心要点（What/Why）。
   - **第二段**：展开说明技术细节、产品特点，列举关键数据（加粗）。
   - **第三段**：分析影响或意义。
3. **多媒体使用**：
   - 如果提供了图片或视频资源，**必须**在文中合适的位置插入。
   - 如果没有提供资源，不要凭空捏造。
4. **格式要求**：
   - 使用 Markdown 格式
   - 关键词用粗体标注
   - 文末必须附带：📎 [查看原文](${input.url})

**输出格式：**
# [这里放你拟定的标题]

[这里是正文内容...]

直接输出报道内容，不要添加额外说明。`
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const summary = data?.choices?.[0]?.message?.content;
  
  if (!summary || summary.trim().length < 50) {
    throw new Error('DeepSeek returned an empty or too short summary.');
  }
  
  return summary;
}

export async function translateTextWithDeepSeek(text: string): Promise<string> {
  const { deepseekApiKey } = getConfig();
  
  if (!deepseekApiKey) {
    throw new Error('DeepSeek API key not configured');
  }

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
          content: '你是一个翻译引擎。如果用户输入的文本是英文，请将其翻译成中文。如果已经是中文，请原样返回。只输出翻译后的结果，不要包含任何解释或额外文本。'
        },
        {
          role: 'user',
          content: text
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    })
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const translation = data?.choices?.[0]?.message?.content;
  
  if (!translation) {
    return text; // Fallback to original
  }
  
  return translation.trim();
}
