import type { NextApiRequest, NextApiResponse } from 'next';
import { listSources } from '@daily-ai-news/db';
import { fetchArticlesFromSources } from '@daily-ai-news/fetchers';
import { storeArticles } from '@daily-ai-news/db';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Starting fetch-news...');
    
    const sources = await listSources();
    console.log(`Found ${sources.length} sources`);
    
    if (sources.length === 0) {
      return res.status(200).json({ success: true, count: 0, message: 'No sources configured' });
    }
    
    const articles = await fetchArticlesFromSources(sources);
    console.log(`Fetched ${articles.length} articles`);
    
    const result = await storeArticles(articles);
    console.log(`Stored articles:`, result);
    
    res.status(200).json({ 
      success: true, 
      count: articles.length,
      inserted: result.inserted,
      updated: result.updated
    });
  } catch (error) {
    console.error('Error in fetch-news:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}
