import { getConfig } from '@daily-ai-news/config';
import type { SummaryInput } from '../types';

export async function summarizeWithDeepSeek(input: SummaryInput): Promise<string> {
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
          content: `请将以下 AI 资讯改写成一篇专业的科技报道（450-600字）：

**标题：** ${input.title}

**内容：**
${input.content.substring(0, 3000)}

**必须遵守的要求：**

1. **第一段（约 120-150 字）**：
   - 如果内容是英文，先翻译成中文
   - 用 3-4 句话概括核心要点
   - 回答 What/Why/When
   - 必须有引人入胜的开头

2. **第二段（约 230-300 字）**：
   - 展开说明技术细节、产品特点或具体内容
   - 列举 2-3 个关键点（可使用加粗或列表）
   - 如有多媒体内容，用 emoji 标注
   - 内容必须充实、具体，提供足够细节

3. **第三段（约 130-170 字）**：
   - 分析对行业的影响或意义
   - 展望未来发展趋势
   - 必须有总结性的结尾句
   - 给读者完整的阅读体验

4. **格式要求**：
   - 使用 Markdown 格式
   - 关键词用粗体标注
   - 段落之间用空行分隔
   - 总字数：450-600 字

5. **绝对禁止**：
   - 不能中途截断，必须写完第三段
   - 不能使用 "……" 或 "等等" 结尾
   - 最后一句必须是完整的总结

直接输出报道内容，不要添加标题或额外说明。现在开始生成完整的三段内容：`
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

export async function generateVideoScriptWithDeepSeek(prompt: string): Promise<string> {
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
        { role: 'system', content: '你是一位专业的短视频内容创作者，擅长撰写完整、简洁有力、节奏明快的口播稿。每个口播稿都必须有开头、中间、结尾，内容完整。' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1200,
      temperature: 0.8
    })
  });
  
  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status} ${await response.text()}`);
  }
  
  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const script = data?.choices?.[0]?.message?.content;

  if (!script || script.trim().length < 50) {
    throw new Error('DeepSeek returned an empty or too short video script.');
  }

  return script;
}
