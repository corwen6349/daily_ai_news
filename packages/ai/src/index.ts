import { summarizeWithGemini } from './providers/gemini';
import { summarizeWithDeepSeek } from './providers/deepseek';
import { SummaryInput } from './types';

export async function summarize(input: SummaryInput): Promise<string> {
  const provider = process.env.AI_PROVIDER ?? 'gemini';

  try {
    if (provider === 'deepseek') {
      return await summarizeWithDeepSeek(input);
    }

    // 默认使用 Gemini
    return await summarizeWithGemini(input);
  } catch (error) {
    console.warn('AI 总结失败，使用降级策略:', error);
    
    // 降级策略1: 尝试 DeepSeek
    try {
      console.log('尝试 DeepSeek 降级...');
      return await summarizeWithDeepSeek(input);
    } catch (deepSeekError) {
      console.warn('DeepSeek 也失败，使用原始内容:', deepSeekError);
    }

    // 降级策略2: 智能截取原始内容
    const content = input.content || input.title;
    const cleanContent = content
      .replace(/<[^>]*>/g, '') // 移除 HTML 标签
      .replace(/\s+/g, ' ')     // 合并空白字符
      .trim();

    // 尝试提取前几句话
    const sentences = cleanContent.split(/[。！？.!?]/);
    let summary = '';
    
    for (const sentence of sentences) {
      if (summary.length + sentence.length < 250) {
        summary += sentence + '。';
      } else {
        break;
      }
    }

    if (summary.length < 50) {
      // 如果句子太少，直接截取
      summary = cleanContent.substring(0, 200) + '...';
    }

    console.log(`使用降级摘要: ${summary.substring(0, 50)}...`);
    return summary;
  }
}

export async function generateVideoScript(reportDate: string, articles: Array<{ title: string; summary?: string; url: string }>): Promise<string> {
  const provider = process.env.AI_PROVIDER ?? 'gemini';
  
  const formattedDate = new Date(reportDate).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // 构建文章列表内容
  const articlesContent = articles.map((article, index) => 
    `${index + 1}. ${article.title}\n${article.summary || ''}\n`
  ).join('\n');
  
  const prompt = `请为以下 AI 日报内容生成一段 1 分钟左右的视频口播稿。

日期：${formattedDate}
文章数量：${articles.length} 篇

文章列表：
${articlesContent}

要求：
1. 开场白：简短有力，点明日期和主题（15秒）
2. 核心内容：挑选 3-4 个最重要的新闻，每个用 10-15 秒介绍核心要点
3. 结尾：总结今日AI领域趋势，引导关注（10秒）
4. 语言风格：
   - 口语化、自然流畅
   - 节奏明快，信息密度高
   - 适合短视频场景
   - 避免生硬的书面语
5. 总时长：约 60 秒（约 200-250 字）
6. 格式：纯文本，分段清晰，标注停顿位置

直接输出口播稿，不要添加标题或额外说明。`;
  
  try {
    if (provider === 'deepseek') {
      return await generateVideoScriptWithDeepSeek(prompt);
    }
    return await generateVideoScriptWithGemini(prompt);
  } catch (error) {
    console.error('视频口播稿生成失败:', error);
    // 返回简单的降级版本
    return `大家好！今天是 ${formattedDate}，欢迎收看今日 AI 资讯。\n\n今天为您精选了 ${articles.length} 条重要新闻。${articles.slice(0, 2).map(a => a.title).join('；')}。\n\n以上就是今天的 AI 资讯，我们明天见！`;
  }
}

async function generateVideoScriptWithDeepSeek(prompt: string): Promise<string> {
  const { getConfig } = await import('@daily-ai-news/config');
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
        { role: 'system', content: '你是一位专业的短视频内容创作者，擅长撰写简洁有力、节奏明快的口播稿。' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 600,
      temperature: 0.8
    })
  });
  
  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status}`);
  }
  
  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  return data?.choices?.[0]?.message?.content || '';
}

async function generateVideoScriptWithGemini(prompt: string): Promise<string> {
  const { getConfig } = await import('@daily-ai-news/config');
  const { geminiApiKey } = getConfig();
  
  if (!geminiApiKey) {
    throw new Error('Gemini API key not configured');
  }
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 600
        }
      })
    }
  );
  
  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }
  
  const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export type { SummaryInput } from './types';
