import type { NextApiRequest, NextApiResponse } from 'next';
import { listReports } from '@daily-ai-news/db';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const reports = await listReports();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
}
