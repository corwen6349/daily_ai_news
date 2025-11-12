import Parser from 'rss-parser';
import { Source, Article } from '@daily-ai-news/db';

const parser = new Parser<{ link?: string; contentSnippet?: string; isoDate?: string }>({
  timeout: 10000, // 10秒超时
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
});

// 测试单个 RSS 源是否可用
export async function testRssSource(url: string): Promise<{ success: boolean; error?: string }> {
  try {
    await parser.parseURL(url);
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
      console.log(`正在抓取: ${source.name} (${source.url})`);
      const feed = await parser.parseURL(source.url);
      
      let todayCount = 0;
      
      // 只保留今日发布的文章
      feed.items.forEach((item) => {
        if (!item.title || !item.link) {
          return;
        }
        
        // 检查是否为今日文章
        if (!isToday(item.isoDate)) {
          return;
        }
        
        todayCount++;
        articles.push({
          source_id: source.id,
          title: item.title,
          url: item.link,
          summary: item.contentSnippet ?? '',
          content: item.contentSnippet ?? '',
          published_at: item.isoDate ?? new Date().toISOString(),
          created_at: new Date().toISOString()
        });
      });
      
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
