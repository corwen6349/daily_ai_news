import type { NextApiRequest, NextApiResponse } from 'next';
import { listSources } from '@daily-ai-news/db';
import { fetchArticlesFromSources } from '@daily-ai-news/fetchers';
import { storeArticles } from '@daily-ai-news/db';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const sources = await listSources();
    const articles = await fetchArticlesFromSources(sources);
    await storeArticles(articles);
    res.status(200).json({ success: true, count: articles.length });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
}
