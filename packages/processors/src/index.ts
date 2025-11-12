import { summarize } from '@daily-ai-news/ai';
import { Article } from '@daily-ai-news/db';

export async function enrichArticles(articles: Article[]): Promise<Article[]> {
  const enriched: Article[] = [];

  for (const article of articles) {
    try {
      const summary = await summarize({
        title: article.title,
        content: article.content ?? article.summary ?? '',
        url: article.url
      });
      enriched.push({ ...article, summary });
    } catch (error) {
      console.warn(`摘要生成失败: ${article.title}`, error);
      enriched.push(article);
    }
  }

  return enriched;
}

export async function buildHtmlReport({
  date,
  articles
}: {
  date: string;
  articles: Article[];
}): Promise<string> {
  const formattedDate = new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const items = articles
    .map(
      (article, index) => `
        <article style="margin-bottom: 24px;">
          <h2 style="font-size: 20px; margin-bottom: 8px;">
            ${index + 1}. <a href="${article.url}" style="color: #0ea5e9; text-decoration: none;">${article.title}</a>
          </h2>
          <p style="color: #64748b; line-height: 1.6;">${article.summary ?? article.content ?? ''}</p>
          <p style="font-size: 12px; color: #94a3b8;">发布时间：${article.published_at ?? '未知'}</p>
        </article>
      `
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>AI 日报 - ${formattedDate}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background: #0f172a; color: #e2e8f0; padding: 32px;">
    <header style="margin-bottom: 32px;">
      <h1 style="margin: 0; font-size: 32px; color: #38bdf8;">每日 AI 日报</h1>
      <p style="margin: 8px 0 0; color: #94a3b8;">${formattedDate}</p>
    </header>
    <main>
      ${items}
    </main>
    <footer style="margin-top: 48px; font-size: 12px; color: #475569;">Made with ❤️ by Daily AI News Bot</footer>
  </body>
</html>`;
}
