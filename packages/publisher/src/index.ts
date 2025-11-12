import { getConfig } from '@daily-ai-news/config';

/**
 * 将 HTML 内容转换为 Hugo Markdown 格式
 */
function convertToHugoMarkdown(htmlContent: string, date: string): string {
  // 提取标题和内容
  const titleMatch = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const title = titleMatch ? titleMatch[1] : `AI Daily News - ${date}`;
  
  // 移除 HTML 标签，保留文本内容
  let content = htmlContent
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<h1[^>]*>.*?<\/h1>/gi, '')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<ul[^>]*>|<\/ul>/gi, '\n')
    .replace(/<ol[^>]*>|<\/ol>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();

  // Hugo Front Matter
  const frontMatter = `---
title: "${title}"
date: ${date}T09:00:00+08:00
draft: false
tags: ["AI", "Daily News", "Technology"]
categories: ["AI Daily"]
description: "${date} 的 AI 行业要闻精选"
---

`;

  return frontMatter + content;
}

export async function publishReport(htmlContent: string, date: string): Promise<string> {
  const config = getConfig();

  if (!config.githubToken || !config.githubRepo) {
    console.warn('未配置 GitHub，跳过发布步骤');
    return '';
  }

  // Hugo 博客使用 content/posts/ 目录存放文章
  const fileName = `content/posts/${date}.md`;
  const apiUrl = `https://api.github.com/repos/${config.githubRepo}/contents/${fileName}`;
  
  // 转换为 Hugo Markdown 格式
  const markdownContent = convertToHugoMarkdown(htmlContent, date);

  try {
    // 检查文件是否已存在
    let sha: string | undefined;
    const checkResponse = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${config.githubToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    if (checkResponse.ok) {
      const existingFile = await checkResponse.json();
      sha = existingFile.sha;
      console.log(`文件已存在，将更新: ${fileName}`);
    }

    // 创建或更新文件
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${config.githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `📰 Add AI Daily News for ${date}`,
        content: Buffer.from(markdownContent).toString('base64'),
        branch: 'main',
        ...(sha && { sha })
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API 请求失败: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    const publishUrl = `https://github.com/${config.githubRepo}/blob/main/${fileName}`;
    
    console.log(`✅ 日报已成功发布到 Hugo 博客: ${fileName}`);
    console.log(`📄 GitHub 文件地址: ${publishUrl}`);
    
    // 返回发布后的 URL（实际网站地址需要根据你的 Hugo 部署配置）
    const siteUrl = `https://${config.githubRepo.split('/')[0]}.github.io/${config.githubRepo.split('/')[1]}/posts/${date}/`;
    console.log(`🌐 预计网站地址: ${siteUrl}`);
    
    return siteUrl;
  } catch (error) {
    console.error('❌ 发布到 GitHub 失败:', error);
    throw error;
  }
}
