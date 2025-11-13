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

export type { SummaryInput } from './types';
