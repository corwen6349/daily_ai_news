/**
 * 获取和创建日报
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { 
  getDailyReport, 
  createDailyReport, 
  publishDailyReport,
  getArticles,
  updateDailyReport,
} from '@daily-ai-news/db';
import { generateHTML, generateMarkdown } from '@daily-ai-news/publisher';
import { createAIClient } from '@daily-ai-news/ai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { date } = req.query;

      if (date) {
        // 获取特定日期的日报
        const report = await getDailyReport(new Date(date as string));
        if (!report) {
          return res.status(404).json({ error: 'Report not found' });
        }
        return res.status(200).json(report);
      } else {
        // 获取所有日报
        return res.status(200).json([]);
      }
    } catch (error) {
      console.error('Failed to get report:', error);
      return res.status(500).json({ error: 'Failed to get report' });
    }
  } else if (req.method === 'POST') {
    try {
      const { date, selectedArticles } = req.body;

      if (!selectedArticles || selectedArticles.length === 0) {
        return res.status(400).json({ error: '必须选择至少一篇文章' });
      }

      // 创建日报记录
      const report = await createDailyReport(new Date(date), selectedArticles);

      // 获取选中的文章详情
      const articles = await getArticles();
      const selectedArticleDetails = articles.filter((a) =>
        selectedArticles.includes(a.id)
      );

      // 为每篇文章生成 AI 摘要
      let articlesWithSummary = selectedArticleDetails;
      try {
        const aiClient = createAIClient({
          provider: 'gemini',
          apiKey: process.env.GEMINI_API_KEY || '',
          model: 'gemini-1.5-mini',
        });

        articlesWithSummary = await Promise.all(
          selectedArticleDetails.map(async (article) => {
            try {
              const result = await aiClient.summarize({
                text: `${article.title}\n${article.description}`,
                maxLength: 100,
                language: 'zh',
              });
              return {
                ...article,
                summary: result.summary,
                keyPoints: result.keyPoints,
              };
            } catch (error) {
              console.warn(`Failed to summarize article ${article.id}:`, error);
              return article;
            }
          })
        );
      } catch (error) {
        console.warn('Failed to initialize AI client:', error);
        // 继续进行，不因为 AI 失败而中断
      }

      // 生成 HTML 和 Markdown
      const newsData = {
        date: new Date(date).toLocaleDateString('zh-CN'),
        articles: articlesWithSummary.map((a) => ({
          title: a.title,
          description: a.description,
          link: a.link,
          source: a.sourceName,
          summary: (a as any).summary,
          keyPoints: (a as any).keyPoints,
        })),
      };

      const generatedHtml = generateHTML(newsData);
      const generatedMarkdown = generateMarkdown(newsData);

      // 更新日报
      const updatedReport = await updateDailyReport(report.id, {
        summary: `包含 ${selectedArticleDetails.length} 篇精选文章`,
        generatedHtml,
        status: 'published',
        publishedAt: new Date(),
      });

      // 发布到 GitHub Pages（异步进行）
      publishToGitHub(updatedReport, generatedHtml).catch((error) => {
        console.error('Failed to publish to GitHub:', error);
      });

      return res.status(200).json(updatedReport);
    } catch (error) {
      console.error('Failed to create report:', error);
      return res.status(500).json({
        error: 'Failed to create report',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { id } = req.body;
      const report = await publishDailyReport(id);
      return res.status(200).json(report);
    } catch (error) {
      console.error('Failed to publish report:', error);
      return res.status(500).json({ error: 'Failed to publish report' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

/**
 * 发布到 GitHub Pages
 */
async function publishToGitHub(report: any, htmlContent: string) {
  const repoToken = process.env.GITHUB_TOKEN;
  const repoOwner = process.env.GITHUB_OWNER;
  const repoName = process.env.GITHUB_REPO;

  if (!repoToken || !repoOwner || !repoName) {
    console.warn('GitHub credentials not configured, skipping publish');
    return;
  }

  try {
    const dateStr = new Date(report.date).toISOString().split('T')[0];
    const filePath = `docs/reports/${dateStr}.html`;

    // 获取当前文件内容（如果存在）
    const getResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        headers: {
          'Authorization': `token ${repoToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      } as any
    );

    let sha = '';
    if ((getResponse as any).status === 200) {
      const data = (await (getResponse as any).json()) as any;
      sha = data.sha;
    }

    // 创建或更新文件
    const content = Buffer.from(htmlContent).toString('base64');
    const response = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${repoToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `发布日报: ${dateStr}`,
          content,
          ...(sha && { sha }),
        }),
      } as any
    );

    if (!(response as any).ok) {
      throw new Error(`GitHub API returned ${(response as any).status}`);
    }

    console.log(`Successfully published report to GitHub: ${filePath}`);
  } catch (error) {
    console.error('Error publishing to GitHub:', error);
    throw error;
  }
}
