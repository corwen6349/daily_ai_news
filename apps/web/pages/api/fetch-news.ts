import type { NextApiRequest, NextApiResponse } from 'next';
import { listSources, deleteOldArticles } from '@daily-ai-news/db';
import { fetchAllArticles } from '@daily-ai-news/fetchers';
import { storeArticles } from '@daily-ai-news/db';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Starting fetch-news...');
    
    const sources = await listSources();
    console.log(`Found ${sources.length} sources`, sources);
    
    if (sources.length === 0) {
      return res.status(200).json({ success: true, count: 0, message: 'No sources configured' });
    }
    
    console.log('Fetching articles from all sources (RSS + Twitter)...');
    const articles = await fetchAllArticles(sources);
    console.log(`Fetched ${articles.length} articles`);
    
    if (articles.length === 0) {
      return res.status(200).json({ success: true, count: 0, message: 'No articles found today' });
    }
    
    console.log('Storing articles...');
    const result = await storeArticles(articles);
    console.log(`Stored articles:`, result);

    // 删除过期数据
    console.log('Deleting old articles...');
    const deleted = await deleteOldArticles();
    console.log(`Deleted ${deleted} old articles`);
    
    res.status(200).json({ 
      success: true, 
      count: articles.length,
      inserted: result.inserted,
      updated: result.updated,
      deletedOld: deleted
    });
  } catch (error) {
    console.error('Error in fetch-news:', error);
    
    // 详细的错误序列化
    let errorMessage = 'Unknown error';
    let errorDetails: Record<string, unknown> = {};
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    } else if (typeof error === 'object' && error !== null) {
      try {
        errorMessage = JSON.stringify(error);
        errorDetails = error as Record<string, unknown>;
      } catch {
        errorMessage = String(error);
      }
    } else {
      errorMessage = String(error);
    }
    
    console.error('Serialized error:', errorDetails);
    
    res.status(500).json({ 
      success: false,
      error: errorMessage,
      details: errorDetails
    });
  }
}
