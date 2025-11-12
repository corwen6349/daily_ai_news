import type { NextApiRequest, NextApiResponse } from 'next';
import { listSources, createSource, updateSource, deleteSource } from '@daily-ai-news/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const sources = await listSources();
      // 确保返回数组
      const result = Array.isArray(sources) ? sources : [];
      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching sources:', error);
      res.status(500).json({ error: String(error), sources: [] });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, url, category } = req.body;
      if (!name || !url) {
        return res.status(400).json({ error: 'name and url are required' });
      }
      const source = await createSource({ name, url, category });
      res.status(201).json(source);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const { name, url, category } = req.body;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'id is required' });
      }
      const source = await updateSource(id, { name, url, category });
      res.status(200).json(source);
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'id is required' });
      }
      await deleteSource(id);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
