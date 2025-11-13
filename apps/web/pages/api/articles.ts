import type { NextApiRequest, NextApiResponse } from 'next';
import { listArticles } from '@daily-ai-news/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 50;
      const offset = (page - 1) * pageSize;
      
      const articles = await listArticles({ limit: pageSize, offset });
      
      // 按日期分组
      const groupedByDate = articles.reduce((acc, article) => {
        const date = article.published_at 
          ? new Date(article.published_at).toLocaleDateString('zh-CN')
          : '未知日期';
        
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(article);
        return acc;
      }, {} as Record<string, typeof articles>);
      
      // 确保返回数组和分组数据
      const result = Array.isArray(articles) ? articles : [];
      res.status(200).json({
        articles: result,
        groupedByDate,
        pagination: {
          page,
          pageSize,
          hasMore: result.length === pageSize
        }
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      console.error('Error fetching articles:', errorMsg, errorStack);
      res.status(500).json({ 
        error: errorMsg,
        stack: errorStack,
        articles: [] 
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
