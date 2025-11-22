import type { NextApiRequest, NextApiResponse } from 'next';
import { getArticlesByIds, saveReport } from '@daily-ai-news/db';
import { enrichArticles, buildHtmlReport, buildMarkdownReport } from '@daily-ai-news/processors';
import { publishReport } from '@daily-ai-news/publisher';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { articleIds, date } = req.body;
    
    if (!articleIds || !Array.isArray(articleIds) || articleIds.length === 0) {
      return res.status(400).json({ error: 'articleIds is required' });
    }

    console.log(`\n📝 开始生成日报...`);
    console.log(`选中 ${articleIds.length} 篇文章`);

    // 1. 获取选中的文章
    const articles = await getArticlesByIds(articleIds);
    console.log(`✅ 获取到 ${articles.length} 篇文章详情`);

    // 2. 使用 AI 生成摘要
    console.log(`🤖 正在使用 AI 生成摘要...`);
    const enriched = await enrichArticles(articles);
    console.log(`✅ AI 摘要生成完成`);

    // 3. 生成 HTML 日报
    const reportDate = date || new Date().toISOString().split('T')[0];
    console.log(`📄 正在生成 HTML 日报...`);
    const htmlContent = await buildHtmlReport({ date: reportDate, articles: enriched });
    console.log(`✅ HTML 日报生成完成`);

    // 3.5 生成 Markdown 日报（用于 Hugo 博客）
    console.log(`📝 正在生成 Markdown 日报...`);
    const markdownContent = await buildMarkdownReport({ date: reportDate, articles: enriched });
    console.log(`✅ Markdown 日报生成完成`);

    // 4. 发布到 GitHub Hugo 博客（使用 Markdown 而不是 HTML）
    console.log(`🚀 正在发布到 Hugo 博客...`);
    let publishUrl = '';
    let publishError = '';
    
    try {
      publishUrl = await publishReport(markdownContent, reportDate);
      if (publishUrl) {
        console.log(`✅ 发布完成: ${publishUrl}`);
      } else {
        console.log(`⚠️  未发布（可能未配置 GitHub）`);
      }
    } catch (error) {
      publishError = error instanceof Error ? error.message : String(error);
      console.error(`❌ 发布失败:`, publishError);
      // 不中断流程，继续保存报告
    }

    // 5. 保存报告记录
    const report = await saveReport({
      date: reportDate,
      html: htmlContent,
      articleIds: articleIds,
      publishedUrl: publishUrl || `https://github.com/${process.env.GITHUB_REPO}/blob/main/content/posts/${reportDate}.md`
    });

    console.log(`\n🎉 日报生成成功！\n`);

    res.status(200).json({
      success: true,
      report,
      url: publishUrl,
      published: !!publishUrl,
      publishError: publishError || undefined
    });
  } catch (error) {
    console.error('生成日报失败:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    res.status(500).json({ 
      error: errorMessage,
      stack: errorStack
    });
  }
}
