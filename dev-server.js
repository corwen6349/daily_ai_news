/**
 * 简单的 Node.js 开发服务器
 * 提供 API 端点和静态页面服务
 */

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const PORT = 3000;

// 模拟数据存储
const db = {
  sources: [
    { id: '1', url: 'https://news.ycombinator.com/rss', name: 'Hacker News', category: 'tech', enabled: true },
    { id: '2', url: 'https://feeds.arstechnica.com/arstechnica/index', name: 'Ars Technica', category: 'tech', enabled: true },
  ],
  articles: [],
  reports: [],
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API 路由
  if (pathname === '/api/sources') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db.sources));
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const source = {
            id: Date.now().toString(),
            url: data.url,
            name: data.name,
            category: data.category || 'general',
            enabled: true,
          };
          db.sources.push(source);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(source));
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    } else if (req.method === 'PUT') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const source = db.sources.find(s => s.id === data.id);
          if (source) {
            Object.assign(source, data);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(source));
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Source not found' }));
          }
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    } else {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
    return;
  }

  if (pathname === '/api/articles') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db.articles));
    } else {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
    return;
  }

  if (pathname === '/api/fetch-news') {
    if (req.method === 'POST') {
      // 模拟获取新闻
      const newArticles = [
        {
          id: Date.now().toString(),
          title: '示例新闻 ' + new Date().toLocaleTimeString(),
          description: '这是一条测试新闻',
          link: 'https://example.com',
          sourceName: 'Test Source',
          pubDate: new Date().toISOString(),
        },
      ];
      db.articles.push(...newArticles);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        count: newArticles.length,
        message: `成功获取 ${newArticles.length} 篇新文章`,
      }));
    } else {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
    return;
  }

  if (pathname === '/api/reports') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(db.reports));
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const report = {
            id: Date.now().toString(),
            date: data.date,
            selectedArticles: data.selectedArticles,
            summary: `包含 ${data.selectedArticles.length} 篇精选文章`,
            status: 'published',
            publishedAt: new Date().toISOString(),
          };
          db.reports.push(report);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(report));
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    } else {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
    return;
  }

  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
    }));
    return;
  }

  // 静态文件和主页
  if (pathname === '/' || pathname === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI 新闻聚合平台</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      max-width: 900px;
      width: 100%;
      padding: 40px;
    }
    h1 {
      color: #333;
      margin-bottom: 10px;
      font-size: 32px;
    }
    .subtitle {
      color: #666;
      margin-bottom: 30px;
      font-size: 16px;
    }
    .tabs {
      display: flex;
      border-bottom: 2px solid #eee;
      margin-bottom: 30px;
      gap: 10px;
    }
    .tab {
      padding: 12px 20px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 14px;
      color: #666;
      font-weight: 500;
      border-bottom: 3px solid transparent;
      transition: all 0.3s;
    }
    .tab.active {
      color: #667eea;
      border-bottom-color: #667eea;
    }
    .tab-content {
      display: none;
    }
    .tab-content.active {
      display: block;
    }
    .info-box {
      background: #f5f7fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .api-list {
      list-style: none;
    }
    .api-list li {
      padding: 12px 0;
      border-bottom: 1px solid #eee;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .api-list li:last-child {
      border-bottom: none;
    }
    .badge {
      background: #667eea;
      color: white;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      min-width: 50px;
      text-align: center;
    }
    .badge.get { background: #3b82f6; }
    .badge.post { background: #10b981; }
    .badge.put { background: #f59e0b; }
    .status-box {
      background: #d1fae5;
      border: 1px solid #6ee7b7;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
      color: #047857;
    }
    .status-box.error {
      background: #fee2e2;
      border-color: #fca5a5;
      color: #dc2626;
    }
    button {
      background: #667eea;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.3s;
    }
    button:hover {
      background: #5568d3;
    }
    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    .response-box {
      background: #1e293b;
      color: #e2e8f0;
      padding: 15px;
      border-radius: 6px;
      margin-top: 15px;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 12px;
      max-height: 300px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 AI 新闻聚合平台</h1>
    <p class="subtitle">开发服务器 - API 测试模式</p>
    
    <div class="status-box">
      ✅ 服务器运行正常 | 📍 http://localhost:3000
    </div>

    <div class="tabs">
      <button class="tab active" onclick="switchTab('api')">📡 API 端点</button>
      <button class="tab" onclick="switchTab('test')">🧪 测试工具</button>
      <button class="tab" onclick="switchTab('status')">📊 状态</button>
    </div>

    <div id="api" class="tab-content active">
      <div class="info-box">
        <h3>可用的 API 端点</h3>
        <ul class="api-list">
          <li><span class="badge get">GET</span> <code>/api/sources</code> - 获取信息源列表</li>
          <li><span class="badge post">POST</span> <code>/api/sources</code> - 添加新信息源</li>
          <li><span class="badge put">PUT</span> <code>/api/sources</code> - 更新信息源</li>
          <li><span class="badge get">GET</span> <code>/api/articles</code> - 获取文章列表</li>
          <li><span class="badge post">POST</span> <code>/api/fetch-news</code> - 手动获取新闻</li>
          <li><span class="badge get">GET</span> <code>/api/reports</code> - 获取日报列表</li>
          <li><span class="badge post">POST</span> <code>/api/reports</code> - 创建日报</li>
          <li><span class="badge get">GET</span> <code>/api/health</code> - 健康检查</li>
        </ul>
      </div>
    </div>

    <div id="test" class="tab-content">
      <div class="info-box">
        <h3>🧪 API 测试工具</h3>
        <button onclick="testAPI('/api/health')">测试健康检查</button>
        <button onclick="testAPI('/api/sources')">获取信息源</button>
        <button onclick="testAPI('/api/articles')">获取文章</button>
        <button onclick="testFetchNews()">手动获取新闻</button>
        <div id="response" class="response-box" style="display:none;"></div>
      </div>
    </div>

    <div id="status" class="tab-content">
      <div class="info-box">
        <h3>📊 系统状态</h3>
        <p>✅ 后端服务: <strong>运行中</strong></p>
        <p>✅ API 端点: <strong>正常</strong></p>
        <p>✅ 数据库: <strong>模拟模式</strong></p>
        <p>📍 监听端口: <strong>3000</strong></p>
        <p>🔄 当前时间: <strong id="time"></strong></p>
      </div>
      <div class="info-box">
        <h3>📝 下一步</h3>
        <p>由于依赖安装遇到问题，我们已创建了开发服务器。</p>
        <p>您现在可以：</p>
        <ol style="margin-left: 20px; margin-top: 10px;">
          <li>测试 API 端点</li>
          <li>检查 API 是否响应</li>
          <li>查看文件 <code>apps/web/pages/api/</code> 中的新路由</li>
        </ol>
      </div>
    </div>
  </div>

  <script>
    function switchTab(name) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
      document.getElementById(name).classList.add('active');
      event.target.classList.add('active');
    }

    async function testAPI(endpoint) {
      const responseEl = document.getElementById('response');
      responseEl.style.display = 'block';
      responseEl.textContent = '加载中...';
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        responseEl.textContent = JSON.stringify(data, null, 2);
      } catch (error) {
        responseEl.textContent = '❌ 错误: ' + error.message;
      }
    }

    async function testFetchNews() {
      const responseEl = document.getElementById('response');
      responseEl.style.display = 'block';
      responseEl.textContent = '加载中...';
      try {
        const response = await fetch('/api/fetch-news', { method: 'POST' });
        const data = await response.json();
        responseEl.textContent = JSON.stringify(data, null, 2);
      } catch (error) {
        responseEl.textContent = '❌ 错误: ' + error.message;
      }
    }

    function updateTime() {
      document.getElementById('time').textContent = new Date().toLocaleString('zh-CN');
    }
    
    updateTime();
    setInterval(updateTime, 1000);
  </script>
</body>
</html>
    `);
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║  🚀 AI 新闻聚合平台 - 开发服务器              ║
╚════════════════════════════════════════════════╝

✓ 服务器运行中
✓ 监听端口: http://localhost:${PORT}
✓ 时间: ${new Date().toLocaleString('zh-CN')}

📡 可用的 API 端点:
   GET    /api/sources           获取信息源
   POST   /api/sources           添加信息源
   GET    /api/articles          获取文章
   POST   /api/fetch-news        获取新闻
   GET    /api/reports           获取日报
   POST   /api/reports           创建日报
   GET    /api/health            健康检查

🌐 访问: http://localhost:${PORT}
按 Ctrl+C 停止服务...
  `);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ 端口 ${PORT} 已被占用`);
  } else {
    console.error('服务器错误:', error);
  }
  process.exit(1);
});
