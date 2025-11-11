/**
 * 静态网站生成器 - 生成 GitHub Pages 的 HTML
 */

export interface DailyNews {
  date: string;
  articles: Array<{
    title: string;
    description: string;
    link: string;
    source: string;
    summary?: string;
    keyPoints?: string[];
  }>;
}

export function generateHTML(news: DailyNews): string {
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI 日报 - ${news.date}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
        }
        .header {
            background: white;
            padding: 40px 20px;
            border-radius: 12px 12px 0 0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .header h1 {
            font-size: 32px;
            color: #333;
            margin-bottom: 10px;
        }
        .header p {
            color: #999;
            font-size: 14px;
        }
        .articles {
            background: white;
            padding: 40px 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .article {
            margin-bottom: 30px;
            padding-bottom: 30px;
            border-bottom: 1px solid #eee;
        }
        .article:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        .article-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
            line-height: 1.5;
        }
        .article-title a {
            color: #667eea;
            text-decoration: none;
        }
        .article-title a:hover {
            text-decoration: underline;
        }
        .article-meta {
            font-size: 12px;
            color: #999;
            margin-bottom: 12px;
        }
        .article-meta span {
            margin-right: 15px;
        }
        .article-description {
            color: #666;
            line-height: 1.6;
            margin-bottom: 12px;
        }
        .article-summary {
            background: #f5f7fa;
            padding: 12px;
            border-left: 3px solid #667eea;
            margin-bottom: 12px;
            border-radius: 4px;
        }
        .summary-label {
            font-size: 12px;
            font-weight: 600;
            color: #667eea;
            margin-bottom: 6px;
        }
        .summary-text {
            color: #555;
            font-size: 14px;
            line-height: 1.5;
        }
        .key-points {
            background: #fafbfc;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 12px;
        }
        .key-points-label {
            font-size: 12px;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
        }
        .key-points ul {
            list-style: none;
            padding-left: 0;
        }
        .key-points li {
            padding: 4px 0;
            color: #666;
            font-size: 13px;
            line-height: 1.4;
        }
        .key-points li:before {
            content: "▪ ";
            color: #667eea;
            font-weight: bold;
            margin-right: 6px;
        }
        .article-source {
            display: inline-block;
            background: #f0f0f0;
            color: #666;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
        }
        .footer {
            background: white;
            padding: 20px;
            border-radius: 0 0 12px 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            color: #999;
            font-size: 12px;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        @media (max-width: 640px) {
            .header h1 {
                font-size: 24px;
            }
            .article-title {
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 AI 日报</h1>
            <p>${news.date}</p>
        </div>
        <div class="articles">
            ${news.articles.map((article) => `
            <div class="article">
                <h2 class="article-title">
                    <a href="${article.link}" target="_blank" rel="noopener noreferrer">
                        ${article.title}
                    </a>
                </h2>
                <div class="article-meta">
                    <span class="article-source">${article.source}</span>
                </div>
                <p class="article-description">${article.description}</p>
                ${article.summary ? `
                <div class="article-summary">
                    <div class="summary-label">📝 AI 摘要</div>
                    <div class="summary-text">${article.summary}</div>
                </div>
                ` : ''}
                ${article.keyPoints && article.keyPoints.length > 0 ? `
                <div class="key-points">
                    <div class="key-points-label">🔑 关键点</div>
                    <ul>
                        ${article.keyPoints.map((point) => `<li>${point}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
            </div>
            `).join('')}
        </div>
        <div class="footer">
            <p>
                由 <a href="https://github.com" target="_blank">AI 日报系统</a> 自动生成
                | 更新于 ${new Date().toLocaleString('zh-CN')}
            </p>
        </div>
    </div>
</body>
</html>`;

  return html;
}

export function generateMarkdown(news: DailyNews): string {
  let md = `# AI 日报 - ${news.date}\n\n`;

  news.articles.forEach((article, index) => {
    md += `## ${index + 1}. ${article.title}\n\n`;
    md += `**来源**: ${article.source}\n\n`;
    md += `${article.description}\n\n`;

    if (article.summary) {
      md += `**AI 摘要**: ${article.summary}\n\n`;
    }

    if (article.keyPoints && article.keyPoints.length > 0) {
      md += `**关键点**:\n`;
      article.keyPoints.forEach((point) => {
        md += `- ${point}\n`;
      });
      md += `\n`;
    }

    md += `[阅读原文](${article.link})\n\n`;
    md += `---\n\n`;
  });

  md += `_由 AI 日报系统自动生成_\n`;

  return md;
}
