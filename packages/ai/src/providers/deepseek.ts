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
            content: `请将以下 AI 资讯改写成一篇专业的科技报道（200-300字）：

**标题：** ${input.title}

**原文链接：** ${input.url}

**内容：**
${input.content.substring(0, 2000)}

**要求：**
1. 如果以上内容是英文，先将其翻译成中文，再按以下要求改写
2. 开头用一句话概括核心要点（What/Why）
3. 展开说明技术细节或产品特点
4. 分析对行业的影响或意义
5. 必须在文末保留 "📎 [查看原文](${input.url})" 链接
6. 如果内容提到图片、Demo、视频等多媒体，用 "🎬" "📊" "🖼️" 等 emoji 标注
7. 使用 Markdown 格式，突出关键词（粗体）
8. 200-300字，分 2-3 段

直接输出报道内容，不要添加标题或额外说明。`
          }
        ],
        max_tokens: 800,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const summary = data?.choices?.[0]?.message?.content;
    
    return summary || input.content.substring(0, 200);
  } catch (error) {
    console.error('DeepSeek summarization failed:', error);
    return input.content.substring(0, 200);
  }
}
