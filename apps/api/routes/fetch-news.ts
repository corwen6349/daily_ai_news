/**
 * 手动触发获取今日资讯
 * POST /api/fetch-news
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSources, addArticles } from '@daily-ai-news/db';
import { fetchRSSFeed } from '@daily-ai-news/fetchers';
import { processArticles } from '@daily-ai-news/processors';

export async function POST(request: NextRequest) {
  try {
    // 获取所有启用的信息源
    const sources = await getSources();
    
    if (sources.length === 0) {
      return NextResponse.json(
        { error: '没有启用的信息源' }
      );
    }

    // 并行获取所有 RSS 源
    const feedPromises = sources.map((source) =>
      fetchRSSFeed(source.url).then((items) =>
        items.map((item) => ({
          ...item,
          sourceId: source.id,
          source: source.name,
          sourceName: source.name,
          pubDate: new Date(item.pubDate),
        }))
      )
    );

    const allFeedsResult = await Promise.all(feedPromises);
    const rawArticles = allFeedsResult.flat();

    if (rawArticles.length === 0) {
      return NextResponse.json({
        success: true,
        message: '未获取到新文章',
        count: 0,
      });
    }

    // 处理文章（去重、过滤、评分、排序）
    const processedArticles = processArticles(rawArticles, {
      deduplicate: true,
      filter: true,
      sort: true,
      recommend: false, // 不限制数量，让前端自己选择
    });

    // 转换为数据库格式
    const dbArticles = processedArticles.map((article) => ({
      title: article.title,
      description: article.description,
      link: article.link,
      sourceId: article.sourceId,
      sourceName: article.source,
      pubDate: article.pubDate,
      content: article.content,
    }));

    // 存储到数据库
    const savedArticles = await addArticles(dbArticles);

    return NextResponse.json({
      success: true,
      message: `成功获取 ${savedArticles.length} 篇新文章`,
      count: savedArticles.length,
      articles: savedArticles.slice(0, 10), // 返回前10篇预览
    });
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return NextResponse.json(
      {
        error: '获取资讯失败',
        details: error instanceof Error ? error.message : 'Unknown error',
      }
    );
  }
}
