import type { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';
import { defaultSources } from '@daily-ai-news/config';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    // 重置内存存储
    if (globalThis.__dailyAiNewsStore) {
      globalThis.__dailyAiNewsStore = {
        sources: defaultSources.map((source) => ({ 
          ...source, 
          id: nanoid(), 
          created_at: new Date().toISOString() 
        })),
        articles: [],
        reports: []
      };
    }
    
    res.status(200).json({ 
      success: true, 
      message: '内存存储已重置',
      sources: globalThis.__dailyAiNewsStore?.sources.length || 0
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
}
