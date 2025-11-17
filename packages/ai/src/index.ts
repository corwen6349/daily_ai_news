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

export async function generateVideoScript(reportDate: string, articles: Array<{ title: string; summary?: string; url: string }>): Promise<string> {
  const { geminiApiKey } = getConfig();
  
  const formattedDate = new Date(reportDate).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const articlesContent = articles.map((article, index) => 
    `${index + 1}. ${article.title}\n${article.summary || ''}\n`
  ).join('\n');
  
  const prompt = `请为以下 AI 日报内容生成一段完整的 1 分钟视频口播稿。

日期：${formattedDate}
文章数量：${articles.length} 篇

文章列表：
${articlesContent}

要求：
1. 开场白（约 20 秒 / 60-80 字）：
   - 热情问候，点明日期
   - 快速引入今日主题
   - 可以加入引人入胜的开场
   
2. 核心内容（约 45-55 秒 / 180-220 字）：
   - 挑选 3-4 个最重要的新闻
   - 每个新闻用 12-15 秒介绍核心亮点和关键细节
   - 用转折词连接（"接下来"、"另外"、"值得关注的是"）
   - 提供足够的信息让观众理解新闻重要性
   
3. 结尾（约 15-20 秒 / 60-80 字）：
   - 总结今日 AI 领域趋势或亮点
   - 点评今日新闻的整体意义
   - 热情引导关注、期待明天
   - 给观众留下深刻印象
   
4. 语言风格：
   - 口语化、自然流畅，像对朋友聊天
   - 节奏明快，信息密度高
   - 可以使用感叹词（"哇"、"哦"、"真的吗"）
   
5. 总计字数：300-380 字（约 80-100 秒）

6. 绝对禁止：
   - 不能中途截断，必须写完三个部分
   - 不能省略结尾
   - 不能使用 "……" 或 "等等" 结束
   - 最后一句必须是完整的告别语

7. 输出格式：
   - 纯文本，每部分之间用空行分隔
   - 可以用 "/" 或 "……" 标记停顿

现在开始生成完整的口播稿，直接输出，不要添加标题。`;
  
  try {
    if (geminiApiKey) {
      console.log('Using Gemini for video script generation.');
      return await generateVideoScriptWithGemini(prompt);
    } else {
      console.log('Using DeepSeek for video script generation.');
      return await generateVideoScriptWithDeepSeek(prompt);
    }
  } catch (error) {
    console.error('Video script generation failed:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

export type { SummaryInput } from './types';
