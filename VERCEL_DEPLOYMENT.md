# Vercel 部署指南

## 📋 部署前准备

### 1. 必需的账户和凭证

- ✅ GitHub 账户（已有）
- ✅ Vercel 账户（免费）
- ✅ Supabase 账户（PostgreSQL 数据库）
- ✅ Google Gemini API Key（免费）
- ✅ DeepSeek API Key（可选，便宜）

### 2. 获取所需凭证

#### 获取 Supabase 凭证

1. 访问 https://supabase.com
2. 用 GitHub 登录或注册
3. 创建新项目：
   - Project Name: `daily-ai-news`
   - Database Password: 记下来（安全）
   - Region: 选择离你最近的区域
4. 等待项目创建（2-3 分钟）
5. 在 **Settings → API** 获取：
   ```
   SUPABASE_URL = Project URL
   SUPABASE_SERVICE_ROLE_KEY = service_role 密钥（注意不是 anon_key）
   ```

#### 获取 Gemini API Key（推荐免费）

1. 访问 https://ai.google.dev
2. 点击 "Get API Key"
3. 选择 "Create API key in new Google Cloud project"
4. 复制 API Key：
   ```
   GEMINI_API_KEY = xxx
   ```
5. 免费额度：
   - 50 requests/分钟
   - 150 万 tokens/月

#### 获取 DeepSeek API Key（可选）

1. 访问 https://platform.deepseek.com
2. 注册账户
3. 获取 API Key：
   ```
   DEEPSEEK_API_KEY = xxx
   ```

### 3. 数据库初始化

在 Supabase 中创建必需的表：

```sql
-- 创建 sources 表（RSS 源）
CREATE TABLE sources (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  category VARCHAR(100),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建 articles 表（文章）
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  url TEXT NOT NULL,
  source_id INTEGER REFERENCES sources(id),
  content TEXT,
  summary TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  fetched BOOLEAN DEFAULT false,
  processed BOOLEAN DEFAULT false
);

-- 创建 reports 表（日报）
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  articles JSONB,
  html_content TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_articles_source ON articles(source_id);
CREATE INDEX idx_articles_published ON articles(published_at);
CREATE INDEX idx_reports_date ON reports(date);
```

在 Supabase SQL Editor 中执行上述 SQL。

---

## 🚀 Vercel 部署步骤

### 第 1 步：连接 GitHub 仓库

1. 访问 https://vercel.com
2. 用 GitHub 登录（关联你的 corwen6349 账户）
3. 点击 "New Project"
4. 选择 "Import Git Repository"
5. 搜索并选择 `daily_ai_news` 仓库
6. 点击 "Import"

### 第 2 步：配置项目

Vercel 会自动检测到这是一个 Next.js 项目。

**Framework**: Next.js ✅ （已自动选择）

**Root Directory**: 保持空白（单体仓库）

### 第 3 步：配置环境变量

点击 "Environment Variables"，添加以下变量：

```bash
# 必需：数据库配置
SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY = xxxxx

# 必需：AI 模型
GEMINI_API_KEY = xxxxx

# 可选：DeepSeek
DEEPSEEK_API_KEY = xxxxx

# 应用配置
NODE_ENV = production
NEXT_PUBLIC_API_URL = https://your-vercel-domain.vercel.app
AI_PROVIDER = gemini
AI_MODEL = gemini-1.5-flash
DAILY_ARTICLE_COUNT = 10
MAX_SUMMARY_TOKENS = 300
```

**注意**：不要添加 `GITHUB_TOKEN` 和 `GITHUB_REPO` 到 Vercel 环境变量（如果不需要发布到 GitHub Pages）。

### 第 4 步：部署

1. 点击 "Deploy"
2. Vercel 会自动构建和部署（约 2-3 分钟）
3. 部署完成后，会获得一个 URL：
   ```
   https://daily-ai-news.vercel.app
   ```

### 第 5 步：配置自定义域名（可选）

1. 在 Vercel Dashboard 中，选择项目
2. 点击 "Settings → Domains"
3. 添加自定义域名（如 `news.yourdomain.com`）
4. 按照提示配置 DNS 记录

---

## 🔄 设置自动定时任务

### 方案 1：使用 Vercel Cron（推荐）

**步骤 1**：更新 `vercel.json`

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs",
  "crons": [
    {
      "path": "/api/fetch-news",
      "schedule": "0 9 * * *"
    }
  ]
}
```

这会每天早上 9:00 UTC 触发一次新闻采集。

**步骤 2**：修改 `/api/fetch-news` 处理 Cron 请求

```typescript
// apps/web/pages/api/fetch-news.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 验证 Vercel Cron 请求
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // 执行新闻采集
    const result = await fetchNews();
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

在 Vercel 中添加 `CRON_SECRET` 环境变量。

### 方案 2：使用 GitHub Actions（备选）

如果使用 GitHub Actions，保持现有工作流即可。

---

## ✅ 验证部署

### 1. 检查应用状态

访问：`https://your-vercel-domain.vercel.app`

你应该看到应用的前端界面。

### 2. 测试 API 端点

```bash
# 健康检查
curl https://your-vercel-domain.vercel.app/api/health

# 获取信息源
curl https://your-vercel-domain.vercel.app/api/sources

# 获取文章
curl https://your-vercel-domain.vercel.app/api/articles

# 手动触发采集
curl -X POST https://your-vercel-domain.vercel.app/api/fetch-news \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### 3. 检查 Vercel Logs

1. 在 Vercel Dashboard 中打开项目
2. 点击 "Deployments"
3. 选择最新部署
4. 查看 "Logs" 标签页

查看是否有错误或警告。

---

## 🔧 常见问题排查

### 问题 1：构建失败

**错误信息**：`Command "pnpm build" failed`

**解决**：
- 确保 `pnpm-lock.yaml` 已上传到 GitHub
- 检查 Vercel 的 Node.js 版本 >= 18

### 问题 2：环境变量未识别

**错误信息**：`Cannot find module` 或 `undefined`

**解决**：
- 确保环境变量已在 Vercel Dashboard 中配置
- 重新部署（Settings → Redeploy）
- 检查变量名称是否完全匹配

### 问题 3：数据库连接失败

**错误信息**：`Failed to connect to Supabase`

**解决**：
- 验证 `SUPABASE_URL` 和 `SUPABASE_SERVICE_ROLE_KEY`
- 检查 Supabase 项目是否正在运行
- 查看 Supabase 的日志

### 问题 4：API 返回 500 错误

**调试**：
1. 在 Vercel Logs 中查看详细错误
2. 检查 Supabase 连接
3. 检查 API Key 配额（Gemini、DeepSeek）

---

## 📊 监控和维护

### 1. 监控部署

访问 Vercel Dashboard 查看：
- ✅ 部署历史
- ✅ 构建时间
- ✅ 函数执行时间
- ✅ 错误日志

### 2. 查看实时日志

```bash
# 使用 Vercel CLI 查看日志
vercel logs

# 或在 Dashboard 中实时查看
```

### 3. 设置告警

在 Vercel 中配置：
- 构建失败告警
- 错误率告警
- 性能告警

### 4. 定期备份

- 定期导出 Supabase 数据
- 备份 GitHub Pages 发布的日报

---

## 💰 成本预估

| 服务 | 免费额度 | 成本 |
|------|---------|------|
| **Vercel** | 无限 requests + 1GB 带宽 | ¥0（Free） |
| **Supabase** | 500MB 数据库 | ¥0（Free） |
| **Gemini API** | 50 req/分钟，150万 tokens/月 | ¥0（Free） |
| **DeepSeek** | 按量计费 | ¥0.1-1 |
| **GitHub** | 2000 min/月 Actions | ¥0（Free） |
| **总计** | | **¥0-1/月** |

---

## 🎯 后续步骤

1. ✅ 完成 Vercel 部署
2. ✅ 验证所有 API 端点
3. ✅ 配置 Cron 定时任务
4. ✅ 测试新闻采集和摘要生成
5. ✅ 配置 GitHub Pages 发布（如需要）
6. ✅ 监控日志和性能

---

## 📚 参考资源

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Gemini API 文档](https://ai.google.dev/docs)
- [Vercel Cron 文档](https://vercel.com/docs/cron-jobs)

