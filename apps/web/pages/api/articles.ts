/**
 * 获取文章列表
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { getArticles } from '@daily-ai-news/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { startDate, endDate } = req.query;

      const articles = await getArticles(
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      res.status(200).json(articles);
    } catch (error) {
      console.error('Failed to get articles:', error);
      res.status(500).json({ error: 'Failed to get articles' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
