import { generateVideoScriptWithGemini, summarizeWithGemini } from './providers/gemini';
import { generateVideoScriptWithDeepSeek, summarizeWithDeepSeek } from './providers/deepseek';
import { SummaryInput } from './types';
import { getConfig } from '@daily-ai-news/config';

export async function summarize(input: SummaryInput): Promise<string> {
  const { geminiApiKey } = getConfig();

  try {
    if (geminiApiKey) {
      console.log('Using Gemini for summarization.');
      return await summarizeWithGemini(input);
    } else {
      console.log('Using DeepSeek for summarization.');
      return await summarizeWithDeepSeek(input);
    }
  } catch (error) {
    console.error('AI summarization failed:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

export async function generateVideoScript(reportDate: string, articles: Array<{ title: string; summary?: string; url: string }>): Promise<{ title: string; script: string }> {
  const { geminiApiKey } = getConfig();
  
  const formattedDate = new Date(reportDate).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const articlesContent = articles.map((article, index) => 
    `${index + 1}. ${article.title}\n${article.summary || ''}\n`
  ).join('\n');

  // Step 1: Generate the explosive title
  const titlePrompt = `从以下 AI 资讯中，提炼出一个最能吸引眼球的“爆点标题”。
标题要像一个结论或一个惊人的功能点。
例如：“OpenAI 发布了全新的图像生成模型，速度提升 50%！”

资讯列表：
${articlesContent}

直接输出标题，不要任何多余的文字。`;

  let explosiveTitle = '';
  try {
    if (geminiApiKey) {
      console.log('Using Gemini for video script title.');
      explosiveTitle = await generateVideoScriptWithGemini(titlePrompt);
    } else {
      console.log('Using DeepSeek for video script title.');
      explosiveTitle = await generateVideoScriptWithDeepSeek(titlePrompt);
    }
  } catch (error) {
    console.error('Video script title generation failed, using default title.', error);
    explosiveTitle = `${formattedDate} AI 前沿动态`;
  }
  
  const scriptPrompt = `请为以下 AI 日报内容生成一段完整的、符合 TikTok/Shorts 风格的 1 分钟视频口播稿。

**爆点标题：** ${explosiveTitle}

**日期：** ${formattedDate}
**文章数量：** ${articles.length} 篇

**文章列表：**
${articlesContent}

**脚本要求 (TikTok/Shorts 风格):**
1.  **第一句话必须是钩子 (Hook)**：
    *   直接使用或围绕“爆点标题”展开，用一个问题或一个惊人的结论激起观众的好奇心。
    *   例如：“AI 一天，人间一年！今天又有哪些大事发生？”

2.  **核心内容 (快节奏、高信息密度)**：
    *   挑选 2-3 个最炸裂的新闻。
    *   每个新闻用 1-2 句话讲清楚核心亮点，语速要快。
    *   使用“首先”、“接着”、“还有这个”等口语化转折词。
    *   口吻要激动人心，充满激情！

3.  **结尾必须是行动号召 (Call to Action)**：
    *   用一句话总结今天最激动人心的点。
    *   明确引导用户操作，例如：“想每天跟上 AI 最新动态，赶紧关注我！”或“你最期待哪个功能？评论区告诉我！”

**硬性要求：**
*   **语速**：快！感觉像在追赶时间。
*   **口吻**：激动人心！想象你在分享一个天大的好消息。
*   **总时长**：控制在 50-60 秒。
*   **禁止**：不能平淡，不能中途结束，必须有明确的行动号召。
*   **输出**：纯文本，不要标题。

现在，开始生成这段激动人心的口播稿！`;
  
  try {
    let script = '';
    if (geminiApiKey) {
      console.log('Using Gemini for video script generation.');
      script = await generateVideoScriptWithGemini(scriptPrompt);
    } else {
      console.log('Using DeepSeek for video script generation.');
      script = await generateVideoScriptWithDeepSeek(scriptPrompt);
    }
    return { title: explosiveTitle.replace(/["“]/g, ''), script };
  } catch (error) {
    console.error('Video script generation failed:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

export type { SummaryInput } from './types';
