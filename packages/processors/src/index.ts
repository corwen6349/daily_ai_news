import { summarize } from '@daily-ai-news/ai';
import { Article } from '@daily-ai-news/db';

export async function enrichArticles(articles: Article[]): Promise<Article[]> {
  const enriched: Article[] = [];

  for (const article of articles) {
    try {
      const summary = await summarize({
        title: article.title,
        content: article.content ?? article.summary ?? '',
        url: article.url,
        images: article.images,
        videos: article.videos
      });
      enriched.push({ ...article, summary });
    } catch (error) {
      console.warn(`摘要生成失败: ${article.title}`, error);
      enriched.push(article);
    }
  }

  return enriched;
}

export async function buildMarkdownReport({
  date,
  articles
}: {
  date: string;
  articles: Article[];
}): Promise<string> {
  const dateObj = new Date(date);
  const displayDate = date.replace(/-/g, '/'); // YYYY/MM/DD 格式

  // 开始 Markdown 内容（不包含 Front Matter）
  let markdown = '';

  // 今日看点（摘要）
  markdown += `## 📊 今日看点\n\n`;
  markdown += `今日精选 **${articles.length} 篇** AI 行业重要资讯：\n\n`;
  
  // 列出所有文章的标题作为看点，添加锚点链接
  articles.forEach((article, index) => {
    const emoji = ['🚀', '🌍', '💬', '🔥', '⚡', '💡', '🎯', '🌟', '🔮', '⭐'][index] || '📌';
    const shortTitle = article.title;
    
    // 创建锁点链接，指向详细内容部分（不添加简短描述）
    markdown += `- ${emoji} **[${shortTitle}](#${index + 1}-${encodeURIComponent(article.title.replace(/[\s\?!,\.]/g, '-').toLowerCase())})**\n`;
  });
  
  markdown += `\n<!--more-->\n\n`;

  // 详细内容
  markdown += `## 📰 详细内容\n\n`;
  
  articles.forEach((article, index) => {
    // 标题（添加 id 用于锚点定位）
    const anchorId = `${index + 1}-${encodeURIComponent(article.title.replace(/[\s\?!,\.]/g, '-').toLowerCase())}`;
    markdown += `### ${index + 1}. ${article.title} {#${anchorId}}\n\n`;
    
    // 发布时间
    if (article.published_at) {
      const pubDate = new Date(article.published_at).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '/');
      markdown += `> 📅 **发布时间：** ${pubDate}\n\n`;
    }
    
    // 内容概要
    markdown += `#### 📝 内容概要\n\n`;
    if (article.summary) {
      // 格式化摘要内容，确保段落清晰
      const formattedSummary = article.summary
        .split('\n\n')
        .map(para => para.trim())
        .filter(para => para.length > 0)
        .join('\n\n');
      markdown += `${formattedSummary}\n\n`;
    } else if (article.content) {
      markdown += `${article.content.substring(0, 300)}...\n\n`;
    } else {
      markdown += `[在此添加内容概要]\n\n`;
    }
    
    // 原文链接
    markdown += `📎 [查看原文](${article.url})\n\n`;
    
    // 分隔线
    if (index < articles.length - 1) {
      markdown += `---\n\n`;
    }
  });

  // 页脚
  markdown += `\n---\n\n`;
  markdown += `## 💡 关于本日报\n\n`;
  markdown += `本日报由 **Daily AI News Bot** 自动生成，基于 AI 技术。\n\n`;
  markdown += `- 🤖 AI 驱动的智能摘要\n`;
  markdown += `- 📊 每日精选优质资讯\n`;
  markdown += `- 🔄 自动化采集与生成\n\n`;
  markdown += `*生成时间：${new Date().toLocaleString('zh-CN')}*\n`;
  
  return markdown;
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

  // 将 Markdown 格式的摘要转换为 HTML（简单实现）
  const markdownToHtml = (text: string): string => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // 粗体
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color: #0ea5e9; text-decoration: none;">$1</a>') // 链接
      .replace(/\n\n/g, '</p><p style="color: #cbd5e1; line-height: 1.8; margin: 12px 0;">') // 段落
      .replace(/\n/g, '<br>'); // 换行
  };

  const items = articles
    .map(
      (article, index) => `
        <article style="margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #1e293b;">
          <h2 style="font-size: 20px; margin-bottom: 12px; color: #f1f5f9;">
            ${index + 1}. <a href="${article.url}" style="color: #38bdf8; text-decoration: none; transition: color 0.2s;" 
               onmouseover="this.style.color='#0ea5e9'" 
               onmouseout="this.style.color='#38bdf8'">${article.title}</a>
          </h2>
          <div style="color: #cbd5e1; line-height: 1.8; margin: 12px 0;">
            <p style="margin: 12px 0;">
              ${markdownToHtml(article.summary ?? article.content ?? '')}
            </p>
          </div>
          <p style="font-size: 13px; color: #64748b; margin-top: 8px;">
            📅 ${article.published_at ? new Date(article.published_at).toLocaleDateString('zh-CN') : '未知'}
          </p>
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
    <style>
      * { box-sizing: border-box; }
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: #e2e8f0; 
        padding: 32px 16px;
        margin: 0;
        min-height: 100vh;
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
        background: rgba(30, 41, 59, 0.6);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        padding: 32px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }
      header {
        margin-bottom: 32px;
        border-bottom: 2px solid #38bdf8;
        padding-bottom: 16px;
      }
      h1 {
        margin: 0;
        font-size: 32px;
        background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .subtitle {
        margin: 8px 0 0;
        color: #94a3b8;
        font-size: 14px;
      }
      a { transition: all 0.2s ease; }
      a:hover { opacity: 0.8; }
      strong { color: #38bdf8; font-weight: 600; }
      footer {
        margin-top: 48px;
        padding-top: 24px;
        border-top: 1px solid #1e293b;
        font-size: 13px;
        color: #64748b;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <header>
        <h1>🤖 每日 AI 资讯</h1>
        <p class="subtitle">${formattedDate} · 共 ${articles.length} 篇精选报道</p>
      </header>
      <main>
        ${items}
      </main>
      <footer>
        <p>✨ 由 Daily AI News Bot 自动生成 · 基于 DeepSeek/Gemini AI</p>
      </footer>
    </div>
  </body>
</html>`;
}
