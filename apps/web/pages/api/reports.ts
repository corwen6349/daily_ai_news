import type { NextApiRequest, NextApiResponse } from 'next';
import { listReports } from '@daily-ai-news/db';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const reports = await listReports();
    // 确保返回数组
    const result = Array.isArray(reports) ? reports : [];
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: String(error), reports: [] });
  }
}
