import { listSources, storeArticles, saveReport, listArticles } from '@daily-ai-news/db';
import { fetchArticlesFromSources } from '@daily-ai-news/fetchers';
import { enrichArticles, buildHtmlReport } from '@daily-ai-news/processors';
import { publishReport } from '@daily-ai-news/publisher';

async function main() {
  try {
    console.log('开始每日任务...');
    
    const sources = await listSources();
    console.log('已加载', sources.length, '个 RSS 源');
    
    const rawArticles = await fetchArticlesFromSources(sources);
    console.log('抓取到', rawArticles.length, '篇原始文章');
    
    await storeArticles(rawArticles);
    console.log('文章已存储到数据库');
    
    const recentArticles = await listArticles({ limit: 10 });
    const enriched = await enrichArticles(recentArticles);
    console.log('已为', enriched.length, '篇文章生成摘要');
    
    const date = new Date().toISOString().split('T')[0];
    const htmlContent = await buildHtmlReport({ date, articles: enriched });
    console.log('已生成 HTML 日报');
    
    const publishedUrl = await publishReport(htmlContent, date);
    console.log('日报已发布');
    
    const report = await saveReport({
      date,
      html: htmlContent,
      publishedUrl,
      articleIds: enriched.map(a => a.id)
    });
    
    console.log('任务完成！日报 ID:', report.id);
  } catch (error) {
    console.error('任务失败:', error);
    process.exit(1);
  }
}

main();
