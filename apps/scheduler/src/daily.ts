import { listSources, storeArticles } from '@daily-ai-news/db';
import { fetchArticlesFromSources } from '@daily-ai-news/fetchers';

async function main() {
  try {
    console.log('🚀 开始抓取今日资讯...');
    
    const sources = await listSources();
    console.log('📡 已加载', sources.length, '个 RSS 源');
    
    const rawArticles = await fetchArticlesFromSources(sources);
    console.log('📰 抓取到', rawArticles.length, '篇原始文章');
    
    await storeArticles(rawArticles);
    console.log('✅ 文章已存储到数据库');
    
    console.log('✨ 任务完成！');
  } catch (error) {
    console.error('❌ 任务失败:', error);
    process.exit(1);
  }
}

main();
