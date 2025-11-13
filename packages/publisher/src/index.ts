import { getConfig } from '@daily-ai-news/config';

/**
 * 将 HTML 内容转换为 Hugo Markdown 格式
 */
function convertToHugoMarkdown(htmlContent: string, date: string): string {
  // 提取标题
  const titleMatch = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '') : `🤖 每日 AI 资讯`;
  
  // 更好的 HTML 转 Markdown 逻辑
  let content = htmlContent
    // 移除 style 和 script
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, '')
    
    // 移除整个 header 和 footer
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
    
    // 处理 article 标签内容
    .replace(/<article[^>]*>/gi, '\n')
    .replace(/<\/article>/gi, '\n---\n')
    
    // 处理标题
    .replace(/<h1[^>]*>.*?<\/h1>/gi, '')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    
    // 处理链接（先处理，避免后续被段落标签影响）
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    
    // 处理文本格式
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    
    // 处理段落和换行
    .replace(/<div[^>]*>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    
    // 处理列表
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<ul[^>]*>|<\/ul>/gi, '\n')
    .replace(/<ol[^>]*>|<\/ol>/gi, '\n')
    
    // 移除所有剩余的 HTML 标签
    .replace(/<[^>]+>/g, '')
    
    // HTML 实体转换
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    
    // 清理多余空行（保留最多 2 个连续换行）
    .replace(/\n{4,}/g, '\n\n\n')
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

export async function publishReport(markdownOrHtml: string, date: string): Promise<string> {
  const config = getConfig();

  console.log('📋 GitHub 配置检查:');
  console.log(`  - GITHUB_TOKEN: ${config.githubToken ? '已配置 (长度: ' + config.githubToken.length + ')' : '❌ 未配置'}`);
  console.log(`  - GITHUB_REPO: ${config.githubRepo || '❌ 未配置'}`);
  console.log(`  - GITHUB_BRANCH: ${config.githubBranch || 'main (默认)'}`);

  if (!config.githubToken || !config.githubRepo) {
    console.warn('⚠️  未配置 GitHub Token 或 Repo，跳过发布步骤');
    console.warn('提示：在 Vercel Dashboard 中设置环境变量：');
    console.warn('  - GITHUB_TOKEN: 你的 GitHub Personal Access Token');
    console.warn('  - GITHUB_REPO: corwen6349/daily-ai-news-blog');
    console.warn('  - GITHUB_BRANCH: master 或 main (可选，默认 main)');
    return '';
  }

  // 先检测仓库的默认分支
  let branch = config.githubBranch || 'main';
  console.log(`🔍 检测仓库分支...`);
  
  try {
    const repoApiUrl = `https://api.github.com/repos/${config.githubRepo}`;
    const repoResponse = await fetch(repoApiUrl, {
      headers: {
        Authorization: `Bearer ${config.githubToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    
    if (repoResponse.ok) {
      const repoData = await repoResponse.json();
      branch = repoData.default_branch || branch;
      console.log(`✅ 检测到默认分支: ${branch}`);
    } else {
      console.warn(`⚠️  无法检测默认分支，使用配置的分支: ${branch}`);
    }
  } catch (error) {
    console.warn(`⚠️  分支检测失败，使用配置的分支: ${branch}`, error);
  }

  // Hugo 博客使用 content/posts/ 目录存放文章
  const fileName = `content/posts/${date}.md`;
  const apiUrl = `https://api.github.com/repos/${config.githubRepo}/contents/${fileName}`;
  
  console.log(`📝 准备发布到: ${apiUrl} (分支: ${branch})`);
  
  // 判断输入是 HTML 还是 Markdown
  let markdownContent: string;
  if (markdownOrHtml.trim().startsWith('<!DOCTYPE') || markdownOrHtml.trim().startsWith('<html')) {
    // 是 HTML，需要转换
    console.log('🔄 检测到 HTML 内容，转换为 Markdown...');
    markdownContent = convertToHugoMarkdown(markdownOrHtml, date);
  } else {
    // 已经是 Markdown，直接使用并添加 Front Matter
    console.log('✅ 检测到 Markdown 内容，添加 Hugo Front Matter...');
    const frontMatter = `---
title: "🤖 每日 AI 资讯"
date: ${date}T09:00:00+08:00
draft: false
tags: ["AI", "Daily News", "Technology"]
categories: ["AI Daily"]
description: "${date} 的 AI 行业要闻精选"
---

`;
    markdownContent = frontMatter + markdownOrHtml;
  }
  
  console.log(`📄 Markdown 内容长度: ${markdownContent.length} 字符`);

  try {
    // 检查文件是否已存在
    let sha: string | undefined;
    console.log(`🔍 检查文件是否已存在...`);
    const checkResponse = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${config.githubToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    console.log(`检查响应状态: ${checkResponse.status}`);
    
    if (checkResponse.ok) {
      const existingFile = await checkResponse.json();
      sha = existingFile.sha;
      console.log(`✅ 文件已存在，将更新: ${fileName} (SHA: ${sha?.substring(0, 7)}...)`);
    } else {
      console.log(`📄 文件不存在，将创建新文件`);
    }

    // 创建或更新文件
    console.log(`🚀 ${sha ? '更新' : '创建'}文件中...`);
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
        branch: branch,  // 使用检测到的分支
        ...(sha && { sha })
      })
    });

    console.log(`GitHub API 响应状态: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ GitHub API 错误响应:`, errorText);
      throw new Error(`GitHub API 请求失败: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    const publishUrl = `https://github.com/${config.githubRepo}/blob/${branch}/${fileName}`;
    
    console.log(`✅ 日报已成功发布到 Hugo 博客: ${fileName}`);
    console.log(`📄 GitHub 文件地址: ${publishUrl}`);
    console.log(`📝 提交 SHA: ${result.commit?.sha || 'N/A'}`);
    
    // 返回发布后的 URL（实际网站地址需要根据你的 Hugo 部署配置）
    const siteUrl = `https://${config.githubRepo.split('/')[0]}.github.io/${config.githubRepo.split('/')[1]}/posts/${date}/`;
    console.log(`🌐 预计网站地址: ${siteUrl}`);
    
    return siteUrl;
  } catch (error) {
    console.error('❌ 发布到 GitHub 失败:', error);
    if (error instanceof Error) {
      console.error('错误详情:', error.message);
      console.error('错误堆栈:', error.stack);
    }
    throw error;
  }
}
