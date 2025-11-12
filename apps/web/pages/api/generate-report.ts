import type { NextApiRequest, NextApiResponse } from 'next';
import { getArticlesByIds, saveReport } from '@daily-ai-news/db';
import { enrichArticles, buildHtmlReport } from '@daily-ai-news/processors';
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

    // 4. 发布到 GitHub Pages
    console.log(`🚀 正在发布到 GitHub Pages...`);
    await publishReport(htmlContent, reportDate);
    console.log(`✅ 发布完成`);

    // 5. 保存报告记录
    const githubRepo = process.env.GITHUB_REPO || 'your-username/your-repo';
    const githubUrl = `https://${githubRepo.split('/')[0]}.github.io/${githubRepo.split('/')[1]}/reports/${reportDate}.html`;
    
    const report = await saveReport({
      date: reportDate,
      html: htmlContent,
      articleIds: articleIds,
      publishedUrl: githubUrl
    });

    console.log(`\n🎉 日报生成成功！\n`);

    res.status(200).json({
      success: true,
      report,
      url: githubUrl
    });
  } catch (error) {
    console.error('生成日报失败:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
}
