/**
 * 获取信息源列表
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { getSources, addSource, updateSource } from '@daily-ai-news/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const sources = await getSources();
      res.status(200).json(sources);
    } catch (error) {
      console.error('Failed to get sources:', error);
      res.status(500).json({ error: 'Failed to get sources' });
    }
  } else if (req.method === 'POST') {
    try {
      const { url, name, category } = req.body;
      const source = await addSource({
        url,
        name,
        category: category || 'general',
        enabled: true,
      });
      res.status(201).json(source);
    } catch (error) {
      console.error('Failed to add source:', error);
      res.status(500).json({ error: 'Failed to add source' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, ...updateData } = req.body;
      const source = await updateSource(id, updateData);
      res.status(200).json(source);
    } catch (error) {
      console.error('Failed to update source:', error);
      res.status(500).json({ error: 'Failed to update source' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
