import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import { Source, Article } from '@daily-ai-news/db';

const parser = new Parser<{ link?: string; contentSnippet?: string; isoDate?: string }>({
  timeout: 10000, // 10秒超时
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
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

// 检查文章是否为今日发布
function isToday(dateString: string | undefined): boolean {
  if (!dateString) return false;
  
  const articleDate = new Date(dateString);
  const today = new Date();
  
  return (
    articleDate.getFullYear() === today.getFullYear() &&
    articleDate.getMonth() === today.getMonth() &&
    articleDate.getDate() === today.getDate()
  );
}

export async function fetchArticlesFromSources(sources: Source[]): Promise<Article[]> {
  const articles: Article[] = [];
  const today = new Date().toISOString().split('T')[0];

  console.log(`\n📅 开始抓取 ${today} 的资讯...\n`);

  for (const source of sources) {
    try {
      const actualUrl = convertRssHubUrl(source.url);
      console.log(`正在抓取: ${source.name} (${actualUrl})`);
      const feed = await parser.parseURL(actualUrl);
      
      let todayCount = 0;
      
      // 只保留今日发布的文章
      for (const item of feed.items) {
        if (!item.title || !item.link) {
          continue;
        }
        
        // 检查是否为今日文章
        if (!isToday(item.isoDate)) {
          continue;
        }
        
        todayCount++;
        
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
      
      console.log(`✅ 从 ${source.name} 获取到 ${todayCount} 篇今日文章`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorCode = (error as any)?.code;
      console.warn(`❌ 抓取源 ${source.name} 失败 [${errorCode || 'UNKNOWN'}]: ${errorMessage}`);
      // 继续处理其他源，不中断
    }
  }

  console.log(`\n🎉 总共抓取到 ${articles.length} 篇今日资讯\n`);
  return articles;
}
