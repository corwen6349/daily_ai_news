import type { NextApiRequest, NextApiResponse } from 'next';
import { listArticles } from '@daily-ai-news/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
      const articles = await listArticles({ limit });
      // 确保返回数组
      const result = Array.isArray(articles) ? articles : [];
      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching articles:', error);
      res.status(500).json({ error: String(error), articles: [] });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
