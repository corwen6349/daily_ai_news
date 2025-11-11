/**
 * 每日运行脚本 - 采集、摘要、发布
 */

import { fetchMultipleRSSFeeds, RSSSource } from '@daily-ai-news/fetchers';
import { createAIClient } from '@daily-ai-news/ai';
import {
  getSources,
  addArticles,
  isDuplicateArticle,
  createDailyReport,
  getDailyReport,
  updateDailyReport,
  publishDailyReport,
} from '@daily-ai-news/db';
import {
  processArticles,
  Article as ProcessedArticle,
} from '@daily-ai-news/processors';
import { generateHTML, DailyNews } from '@daily-ai-news/publisher';

interface FetchConfig {
  aiProvider: 'gemini' | 'deepseek' | 'openai';
  aiApiKey: string;
  aiModel: string;
  publishToGithub: boolean;
}

async function main() {
  console.log('[Daily Job] 开始采集 AI 新闻...');

  // 1. 获取配置的信息源
  const sources = await getSources();
  console.log(`[Daily Job] 找到 ${sources.length} 个信息源`);

  // 2. 采集所有信息源的内容
  const rawArticles = await fetchMultipleRSSFeeds(sources as RSSSource[]);
  console.log(`[Daily Job] 采集到 ${rawArticles.length} 条原始文章`);

  // 3. 去重和过滤
  const uniqueArticles = [];
  for (const article of rawArticles) {
    const isDuplicate = await isDuplicateArticle(article.link);
    if (!isDuplicate) {
      uniqueArticles.push(article);
    }
  }
  console.log(
    `[Daily Job] 去重后 ${uniqueArticles.length} 条新文章, 已去除 ${rawArticles.length - uniqueArticles.length} 条重复`
  );

  // 4. 处理文章（排序、过滤、推荐）
  const processedArticles = processArticles(uniqueArticles as ProcessedArticle[], {
    deduplicate: true,
    filter: true,
    sort: true,
    recommend: true,
    count: parseInt(process.env.DAILY_ARTICLE_COUNT || '10'),
  });
  console.log(`[Daily Job] 推荐 ${processedArticles.length} 条精选文章`);

  // 5. 存储文章到数据库
  const dbArticles = await addArticles(
    processedArticles.map((a) => ({
      title: a.title,
      description: a.description,
      link: a.link,
      sourceId: a.sourceId,
      sourceName: a.source,
      pubDate: a.pubDate,
      content: a.content,
      author: 'Unknown',
    }))
  );
  console.log(`[Daily Job] 已存储 ${dbArticles.length} 条文章到数据库`);

  // 6. AI 摘要处理
  const aiClient = createAIClient({
    provider: (process.env.AI_PROVIDER || 'gemini') as any,
    apiKey: process.env.AI_API_KEY || '',
    model: process.env.AI_MODEL || 'gemini-pro',
  });

  const articlesWithSummary = [];
  for (const article of dbArticles) {
    try {
      const result = await aiClient.summarize({
        text: `${article.title}\n\n${article.description}`,
        maxLength: parseInt(process.env.MAX_SUMMARY_TOKENS || '300'),
      });

      articlesWithSummary.push({
        ...article,
        summary: result.summary,
        keyPoints: result.keyPoints,
      });
      console.log(`✓ 已摘要: ${article.title.substring(0, 50)}...`);
    } catch (error) {
      console.error(`✗ 摘要失败: ${article.title}`, error);
      articlesWithSummary.push(article);
    }
  }

  // 7. 生成日报
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  let dailyReport = await getDailyReport(today);

  if (!dailyReport) {
    dailyReport = await createDailyReport(today, dbArticles.map((a) => a.id));
  } else {
    await updateDailyReport(dailyReport.id, {
      selectedArticles: dbArticles.map((a) => a.id),
    });
  }

  // 8. 生成 HTML
  const dailyNews: DailyNews = {
    date: todayStr,
    articles: articlesWithSummary.map((a) => ({
      title: a.title,
      description: a.description,
      link: a.link,
      source: a.sourceName,
      summary: (a as any).summary,
      keyPoints: (a as any).keyPoints,
    })),
  };

  const html = generateHTML(dailyNews);

  // 9. 发布到 GitHub Pages (可选)
  if (process.env.PUBLISH_TO_GITHUB === 'true') {
    console.log('[Daily Job] 发布到 GitHub Pages...');
    // TODO: 实现 GitHub Pages 发布逻辑
  }

  console.log('[Daily Job] ✅ 完成！');
  return dailyReport;
}

// 错误处理
main().catch((error) => {
  console.error('[Daily Job] ❌ 错误:', error);
  process.exit(1);
});
