import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import { Source, Article } from '@daily-ai-news/db';

const parser = new Parser<{ link?: string; contentSnippet?: string; isoDate?: string }>({
  timeout: 10000, // 10秒超时
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/xml, text/xml, application/rss+xml, */*',
  }
});

// 从网页提取图片 URL
async function extractImagesFromUrl(url: string): Promise<string[]> {
  try {
    console.log(`  🖼️  正在提取图片: ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: AbortSignal.timeout(5000) // 5秒超时
    });

    if (!response.ok) {
      console.warn(`  ⚠️  HTTP ${response.status}: ${url}`);
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const images: string[] = [];

    // 提取文章主体中的图片（优先级排序）
    const selectors = [
      'article img',           // 文章内图片
      '.content img',          // 内容区域图片
      '.post-content img',     // 文章内容图片
      'main img',              // 主要内容区图片
      'img[src*="upload"]',    // 上传的图片
      'img[src*="content"]',   // 内容图片
      'img'                    // 所有图片（最后备选）
    ];

    for (const selector of selectors) {
      $(selector).each((_, elem) => {
        const src = $(elem).attr('src') || $(elem).attr('data-src');
        if (src) {
          // 转换相对路径为绝对路径
          let imgUrl = src;
          if (src.startsWith('//')) {
            imgUrl = 'https:' + src;
          } else if (src.startsWith('/')) {
            const urlObj = new URL(url);
            imgUrl = urlObj.origin + src;
          } else if (!src.startsWith('http')) {
            const urlObj = new URL(url);
            imgUrl = urlObj.origin + '/' + src;
          }

          // 过滤掉小图标、logo、广告等
          const width = parseInt($(elem).attr('width') || '0');
          const height = parseInt($(elem).attr('height') || '0');
          const isSmallIcon = (width > 0 && width < 100) || (height > 0 && height < 100);
          const isIconOrLogo = src.includes('icon') || src.includes('logo') || src.includes('avatar');
          
          if (!isSmallIcon && !isIconOrLogo && !images.includes(imgUrl)) {
            images.push(imgUrl);
          }
        }
      });

      // 找到图片就停止（优先使用最相关的选择器）
      if (images.length > 0) break;
    }

    console.log(`  ✅ 提取到 ${images.length} 张图片`);
    return images.slice(0, 5); // 最多返回 5 张
  } catch (error) {
    console.warn(`  ❌ 图片提取失败: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

// 转换 rsshub:// 协议到实际 HTTP URL
function convertRssHubUrl(url: string): string {
  // 如果是 rsshub:// 协议，转换为 https://rsshub.app/
  if (url.startsWith('rsshub://')) {
    const path = url.replace('rsshub://', '');
    return `https://rsshub.app/${path}`;
  }
  return url;
}

// 测试单个 RSS 源是否可用
export async function testRssSource(url: string): Promise<{ success: boolean; error?: string }> {
  try {
    const actualUrl = convertRssHubUrl(url);
    await parser.parseURL(actualUrl);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
}

// 检查文章是否在过去12小时内发布
function isWithinLast12Hours(dateString: string | undefined): boolean {
  if (!dateString) {
    // 如果没有日期，跳过
    console.log('    ⚠️  无日期信息，跳过');
    return false;
  }
  
  const articleDate = new Date(dateString);
  const now = new Date();
  const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000); // 12小时前的时间点

  // 检查文章发布日期是否在12小时内
  return articleDate >= twelveHoursAgo;
}

import { fetchTweets } from './twitter';
import { fetchFolo } from './folo';
import { translateText } from '@daily-ai-news/ai';

// Simple heuristic to check if text is English
function isEnglish(text: string): boolean {
  if (!text) return false;
  const sample = text.substring(0, 100);
  // Count English letters
  const englishChars = sample.match(/[a-zA-Z]/g)?.length || 0;
  // If more than 40% of characters are English letters, assume it's English
  return englishChars > sample.length * 0.4;
}

function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Remove common tracking parameters
    const paramsToRemove = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'];
    paramsToRemove.forEach(param => urlObj.searchParams.delete(param));
    // Remove trailing slash
    let cleanUrl = urlObj.toString();
    if (cleanUrl.endsWith('/')) {
      cleanUrl = cleanUrl.slice(0, -1);
    }
    return cleanUrl;
  } catch {
    return url;
  }
}

function deduplicateArticles(articles: Article[]): Article[] {
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const uniqueArticles: Article[] = [];

  for (const article of articles) {
    const normalizedUrl = normalizeUrl(article.url);
    // Use a simplified title for deduplication (ignore case, whitespace, and translation suffix)
    const normalizedTitle = article.title.split('(')[0].toLowerCase().trim();

    if (seenUrls.has(normalizedUrl)) {
      console.log(`  ⚠️  Duplicate URL removed: ${article.title}`);
      continue;
    }
    if (seenTitles.has(normalizedTitle)) {
      console.log(`  ⚠️  Duplicate Title removed: ${article.title}`);
      continue;
    }

    seenUrls.add(normalizedUrl);
    seenTitles.add(normalizedTitle);
    uniqueArticles.push(article);
  }
  return uniqueArticles;
}

export async function fetchAllArticles(sources: Source[]): Promise<Article[]> {
  console.log(`\n📅 开始抓取资讯...\n`);

  // 分离 RSS 源、Twitter 源和 Folo 源
  const twitterSources = sources.filter(s => s.url.includes('nitter.net'));
  const foloSources = sources.filter(s => s.url.includes('app.folo.is'));
  const rssSources = sources.filter(s => !s.url.includes('nitter.net') && !s.url.includes('app.folo.is'));

  const rssArticlesPromise = fetchArticlesFromRss(rssSources);
  const tweetArticlesPromise = fetchTweets(twitterSources);
  const foloArticlesPromise = fetchFolo(foloSources);

  const [rssArticles, tweetArticles, foloArticles] = await Promise.all([
    rssArticlesPromise,
    tweetArticlesPromise,
    foloArticlesPromise,
  ]);

  let allArticles = [...rssArticles, ...tweetArticles, ...foloArticles];
  
  // Deduplicate articles
  console.log(`\n🧹 正在去重 (原始数量: ${allArticles.length})...`);
  allArticles = deduplicateArticles(allArticles);
  console.log(`✅ 去重完成 (剩余数量: ${allArticles.length})`);
  
  // Translate English articles
  console.log(`\n🌍 正在检查并翻译英文资讯 (共 ${allArticles.length} 篇)...`);
  
  // Process in chunks to avoid rate limits
  const chunkSize = 5;
  const processedArticles: Article[] = [];
  
  for (let i = 0; i < allArticles.length; i += chunkSize) {
    const chunk = allArticles.slice(i, i + chunkSize);
    const chunkPromises = chunk.map(async (article) => {
      try {
        // Check title
        if (isEnglish(article.title)) {
          console.log(`  Translating title: ${article.title.substring(0, 30)}...`);
          const translatedTitle = await translateText(article.title);
          // Append translation to title
          article.title = `${article.title} (${translatedTitle})`;
          
          // Check summary/content
          const contentToTranslate = article.summary || article.content;
          if (contentToTranslate && isEnglish(contentToTranslate)) {
             // Only translate if it's not too long to save tokens/time, or truncate
             const textToTranslate = contentToTranslate.substring(0, 1000);
             const translatedContent = await translateText(textToTranslate);
             
             const translationBlock = `\n\n--- 中文翻译 ---\n${translatedContent}`;
             
             if (article.summary) article.summary += translationBlock;
             if (article.content) article.content += translationBlock;
          }
        }
      } catch (e) {
        console.error(`  Translation failed for ${article.title.substring(0, 20)}...`, e);
      }
      return article;
    });
    
    const processedChunk = await Promise.all(chunkPromises);
    processedArticles.push(...processedChunk);
  }
  
  console.log(`\n🎉 总共抓取到 ${processedArticles.length} 篇资讯 (${rssArticles.length} 篇来自 RSS, ${tweetArticles.length} 篇来自 Twitter, ${foloArticles.length} 篇来自 Folo)\n`);
  return processedArticles;
}

// 保持原函数名为 fetchArticlesFromRss，但不再导出
async function fetchArticlesFromRss(sources: Source[]): Promise<Article[]> {
  const articles: Article[] = [];
  
  console.log(`\n📡 开始抓取 RSS 源...`);

  for (const source of sources) {
    try {
      const actualUrl = convertRssHubUrl(source.url);
      console.log(`\n  正在抓取: ${source.name}`);
      console.log(`    URL: ${actualUrl}`);
      const feed = await parser.parseURL(actualUrl);
      
      const recentItems = feed.items.slice(0, 10);
      console.log(`    获取到 ${feed.items.length} 条RSS项，只处理最近 ${recentItems.length} 条`);
      let todayCount = 0;
      let skippedCount = 0;
      
      // 只保留过去12小时内发布的文章
      for (const item of recentItems) {
        if (!item.title || !item.link) {
          skippedCount++;
          continue;
        }
        
        // 检查是否在过去12小时内
        if (!isWithinLast12Hours(item.isoDate)) {
          skippedCount++;
          const pubDate = item.isoDate ? new Date(item.isoDate).toLocaleString('zh-CN') : '无日期';
          console.log(`      ⏭️  跳过12小时前的文章: ${item.title.substring(0, 30)}... (${pubDate})`);
          continue;
        }
        
        todayCount++;
        console.log(`      ✅ [${todayCount}] ${item.title}`);
        
        // 提取图片（异步）
        const images = await extractImagesFromUrl(item.link);
        
        articles.push({
          source_id: source.id,
          title: item.title,
          url: item.link,
          summary: item.contentSnippet ?? '',
          content: item.contentSnippet ?? '',
          images: images.length > 0 ? images : undefined,
          published_at: item.isoDate ?? new Date().toISOString(),
          created_at: new Date().toISOString()
        });
      }
      
      console.log(`    📊 ${source.name}: 保留 ${todayCount} 篇，跳过 ${skippedCount} 篇`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorCode = (error as any)?.code;
      console.warn(`  ❌ 抓取源 ${source.name} 失败 [${errorCode || 'UNKNOWN'}]: ${errorMessage}`);
      // 继续处理其他源，不中断
    }
  }
  return articles;
}

