import type { NextApiRequest, NextApiResponse } from 'next';
import { getConfig } from '@daily-ai-news/config';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { geminiApiKey } = getConfig();

  if (!geminiApiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY 环境变量未配置',
      hint: '请在 Vercel 中设置 GEMINI_API_KEY 环境变量'
    });
  }

  // 测试文本
  const testContent = req.body?.content || '人工智能（AI）正在改变世界，包括自然语言处理、计算机视觉和机器学习等多个领域都在快速发展。';

  // 尝试多个 API 端点
  const endpoints = [
    {
      name: 'v1/gemini-1.5-flash',
      url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`
    },
    {
      name: 'v1beta/gemini-1.5-flash-latest',
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`
    },
    {
      name: 'v1beta/gemini-pro',
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`
    }
  ];

  const results: any[] = [];

  for (const endpoint of endpoints) {
    try {
      console.log(`测试端点: ${endpoint.name}`);
      
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `请用一句话总结：${testContent}`
            }]
          }]
        })
      });

      const responseText = await response.text();

      if (response.ok) {
        const data = JSON.parse(responseText);
        const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        results.push({
          endpoint: endpoint.name,
          status: response.status,
          success: true,
          summary: summary || '(无返回内容)'
        });
      } else {
        results.push({
          endpoint: endpoint.name,
          status: response.status,
          success: false,
          error: responseText.substring(0, 500)
        });
      }
    } catch (error) {
      results.push({
        endpoint: endpoint.name,
        success: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // 检查是否有成功的端点
  const successfulEndpoint = results.find(r => r.success);

  return res.status(200).json({
    message: successfulEndpoint 
      ? '✅ Gemini API 配置正常' 
      : '❌ 所有 Gemini API 端点都失败',
    apiKeyConfigured: true,
    apiKeyPrefix: geminiApiKey.substring(0, 10) + '...',
    results,
    recommendation: successfulEndpoint
      ? `建议使用: ${successfulEndpoint.endpoint}`
      : '请检查 API Key 是否有效，或联系 Google AI Studio 获取新的 API Key'
  });
}
