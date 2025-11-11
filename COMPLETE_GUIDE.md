# 📚 综合部署和开发完整指南

**版本**: v1.0.0 Production Ready  
**日期**: 2025-11-11  
**状态**: ✅ 生产级别

> 这个文档整合了所有开发、测试和部署信息，是你使用本项目的完整参考。

---

## 📑 快速目录

1. **[项目概览](#项目概览)** - 5 分钟了解项目
2. **[快速部署](#快速部署)** - 5 分钟部署上线
3. **[本地开发](#本地开发)** - 本地开发指南
4. **[完整部署](#完整部署)** - 详细部署步骤
5. **[故障排除](#故障排除)** - 常见问题解决
6. **[监控运维](#监控运维)** - 上线后维护

---

## 项目概览

### 🎯 是什么？

**AI 新闻聚合平台** - 一个自动化系统，每天采集 AI 新闻并生成智能摘要。

### ✨ 核心功能

| 功能 | 说明 | 状态 |
|------|------|------|
| 🔄 自动采集 | 每日定时采集 RSS 新闻 | ✅ |
| 🤖 AI 摘要 | Google Gemini 智能生成摘要 | ✅ |
| 🌐 Web UI | 可视化管理和浏览 | ✅ |
| 📄 自动发布 | 发布到 GitHub Pages | ✅ |
| 💰 完全免费 | 所有服务都在免费额度 | ✅ |

### 💰 成本分析

**月成本: ¥0（完全免费）**

| 服务 | 方案 | 成本 |
|------|------|------|
| 前端/后端 | Vercel Free | ¥0 |
| 数据库 | Supabase Free | ¥0 |
| AI 模型 | Google Gemini Free | ¥0 |
| 定时任务 | GitHub Actions | ¥0 |
| 静态网站 | GitHub Pages | ¥0 |

### 🏗️ 技术栈

```
前端: Next.js 14 + React 18 + TypeScript
后端: Node.js + Vercel Serverless
数据库: PostgreSQL (Supabase)
AI: Google Gemini API
发布: GitHub Pages
部署: Vercel + GitHub Actions
```

---

## 快速部署

### ⚡ 5 分钟快速上线

#### 1️⃣ 获取 API 密钥（10分钟）

**Supabase 数据库**
```
1. https://supabase.com
2. GitHub 登录
3. 新建项目
4. 复制: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
```

**Google Gemini API**
```
1. https://ai.google.dev
2. Get API Key
3. 复制: GEMINI_API_KEY
```

**GitHub Token**
```
1. https://github.com/settings/tokens
2. 新建 Personal Access Token
3. 权限: repo, pages
4. 复制: GITHUB_TOKEN
```

#### 2️⃣ Fork 项目

```bash
# GitHub 网站:
# 1. 访问项目页面
# 2. 点击 Fork
# 3. 选择你的账户

# 本地克隆
git clone https://github.com/YOUR_USERNAME/daily_ai_news.git
cd daily_ai_news
```

#### 3️⃣ 配置环境

创建 `.env.local`:

```bash
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
GEMINI_API_KEY=xxx
GITHUB_TOKEN=ghp_xxx
GITHUB_OWNER=your-username
GITHUB_REPO=daily-ai-news
DAILY_PUBLISH_TIME=09:00
```

#### 4️⃣ 部署到 Vercel

```bash
# 方式1: 网页 (推荐)
1. https://vercel.com
2. 导入 fork 的项目
3. 添加环境变量
4. 点击 Deploy ✅

# 方式2: CLI
npm i -g vercel
vercel
```

**完成！** 你的应用现在运行在 `https://your-app.vercel.app`

---

## 本地开发

### 安装依赖

```bash
# 使用 pnpm (推荐)
npm i -g pnpm
pnpm install

# 或使用 npm
npm install
```

### 启动开发

```bash
pnpm dev
# 访问 http://localhost:3000
```

### 常用命令

```bash
pnpm dev              # 开发服务器
pnpm build            # 生产构建
pnpm start            # 运行构建
pnpm lint             # 代码检查
pnpm format           # 代码格式化
pnpm test             # 运行测试
```

### 项目结构

```
daily_ai_news/
├── apps/web/                    # Next.js 前端
│   ├── pages/
│   │   ├── index.tsx            # 主页面
│   │   └── api/                 # API 路由
│   │       ├── sources.ts
│   │       ├── articles.ts
│   │       ├── fetch-news.ts
│   │       ├── reports.ts
│   │       └── health.ts
│   └── styles/
├── packages/
│   ├── ai/                      # AI 集成
│   ├── db/                      # 数据库操作
│   ├── fetchers/                # RSS 采集
│   └── processors/              # 数据处理
├── .github/workflows/           # GitHub Actions
├── .env.local                   # 本地环境变量
└── vercel.json                  # Vercel 配置
```

### 测试 API

```bash
# 健康检查
curl http://localhost:3000/api/health

# 获取信息源
curl http://localhost:3000/api/sources

# 添加信息源
curl -X POST http://localhost:3000/api/sources \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hacker News",
    "url": "https://news.ycombinator.com/rss",
    "category": "tech"
  }'

# 获取文章
curl http://localhost:3000/api/articles

# 手动采集
curl -X POST http://localhost:3000/api/fetch-news

# 生成日报
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-11-11",
    "selectedArticles": ["id1", "id2"]
  }'
```

---

## 完整部署

### 前置要求

- ✅ Node.js v18+
- ✅ Git
- ✅ GitHub 账户
- ✅ 信用卡（仅验证，不收费）

### 第 1 步: Supabase 数据库

1. 访问 https://supabase.com
2. GitHub 登录
3. 新建项目 "daily-ai-news"
4. 在 SQL Editor 执行初始化脚本:

```sql
-- 信息源表
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- 文章表
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  link TEXT UNIQUE NOT NULL,
  source_id UUID REFERENCES sources(id),
  source_name TEXT,
  pub_date TIMESTAMP,
  content TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- 日报表
CREATE TABLE daily_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  selected_articles UUID[] DEFAULT '{}',
  summary TEXT,
  generated_html TEXT,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- 启用 RLS
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;

-- 创建读策略
CREATE POLICY "Allow public read" ON sources FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON articles FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON daily_reports FOR SELECT USING (true);
```

5. 获取凭证: Settings → API
   - 复制 `SUPABASE_URL`
   - 复制 `SUPABASE_ANON_KEY`
   - 复制 `SUPABASE_SERVICE_ROLE_KEY`

### 第 2 步: Google Gemini API

1. 访问 https://ai.google.dev
2. 点击 "Get API Key"
3. 创建新项目或使用现有
4. 复制 `GEMINI_API_KEY`

**免费额度**: 50请求/分钟，150万tokens/月

### 第 3 步: GitHub Token

1. https://github.com/settings/tokens
2. "Generate new token"
3. 权限: `repo`, `pages`
4. 复制 `GITHUB_TOKEN`

### 第 4 步: Fork 项目

```bash
# GitHub 网站 Fork 后
git clone https://github.com/YOUR_USERNAME/daily_ai_news.git
cd daily_ai_news
```

### 第 5 步: 本地配置

创建 `.env.local`:

```bash
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# AI
GEMINI_API_KEY=AIza...
AI_PROVIDER=gemini
AI_MODEL=gemini-1.5-mini

# GitHub
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=your-username
GITHUB_REPO=daily-ai-news

# 设置
DAILY_PUBLISH_TIME=09:00
DAILY_ARTICLE_COUNT=10
MAX_SUMMARY_TOKENS=300
```

### 第 6 步: 本地测试

```bash
npm install
npm run dev
# 访问 http://localhost:3000
# 验证各功能正常
```

### 第 7 步: 部署到 Vercel

**网页部署 (推荐)**:
1. https://vercel.com/dashboard
2. "Add New" → "Project"
3. 选择 fork 的项目
4. 点击 "Import"
5. 添加环境变量
6. 点击 "Deploy"

**或使用 CLI**:
```bash
npm i -g vercel
vercel
# 按提示操作
```

### 第 8 步: GitHub Pages

1. 项目 Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: `gh-pages`
4. 保存

### 第 9 步: GitHub Secrets

1. Settings → Secrets → Actions
2. 添加 Secrets:

```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY
GITHUB_TOKEN
DAILY_PUBLISH_TIME=09:00
```

### 第 10 步: 验证

```bash
# 测试部署的 API
curl https://your-app.vercel.app/api/health

# 测试各端点
curl https://your-app.vercel.app/api/sources
curl https://your-app.vercel.app/api/articles
```

---

## 故障排除

### ❌ API 返回 404

**原因**: 路由文件不在正确位置

**解决**:
1. 检查文件存在: `apps/web/pages/api/sources.ts`
2. 重新部署: `git push`
3. 查看 Vercel 构建日志
4. 测试健康检查: `/api/health`

### ❌ Supabase 连接失败

**原因**: 环境变量或网络问题

**解决**:
1. 验证环境变量正确
2. Supabase Dashboard 确认项目在线
3. 检查 API Key 未过期
4. 检查防火墙配置

### ❌ Gemini API 错误

**原因**: API Key 或配额问题

**解决**:
1. 验证 API Key 正确
2. https://ai.google.dev 检查配额
3. Google Cloud Console 启用 API
4. 检查请求频率 (50/分钟)

### ❌ GitHub Pages 未更新

**原因**: 分支或权限问题

**解决**:
1. 检查 `gh-pages` 分支存在
2. Settings → Pages 确认配置
3. 检查 GITHUB_TOKEN 权限
4. 查看 GitHub Actions 日志

### ❌ 定时任务未执行

**原因**: Actions 未启用或 cron 错误

**解决**:
1. Settings → Actions → 启用
2. 检查 `.github/workflows/` 文件
3. 验证 cron 表达式格式
4. 查看 Actions 标签页日志

---

## 监控运维

### 日常检查

每周检查一次:

1. **Vercel Dashboard**
   - 最近部署状态
   - Function 执行情况

2. **GitHub Actions**
   - 定时任务运行日志
   - 是否有失败任务

3. **Supabase**
   - 数据库大小和行数
   - API 请求统计

### 性能监控

```bash
# 检查 API 响应时间
time curl https://your-domain.vercel.app/api/health

# 监控 Vercel 函数
vercel logs --tail
```

### 备份数据

```bash
# 导出 Supabase 数据
pg_dump postgresql://user:pass@db.supabase.co/postgres > backup.sql

# GitHub Pages 备份
git clone --branch gh-pages https://github.com/YOU/daily-ai-news backup/
```

---

## 常见问题

### Q: 真的完全免费吗？

**是的！** ✅

所有服务都在免费额度内:
- Vercel: 12 Functions
- Supabase: 500MB
- Google Gemini: 50 req/min, 1.5M tokens/month
- GitHub Actions: 2000 min/month

### Q: 如何自定义信息源？

在 Web UI 的"信息源"标签添加 RSS URL

### Q: 如何修改采集时间？

设置 `DAILY_PUBLISH_TIME` 环境变量，格式 `HH:MM`

### Q: 数据会丢失吗？

不会，所有数据持久化在 Supabase

### Q: 支持多语言吗？

目前针对中文优化，其他语言需要修改代码

### Q: 如何增加摘要质量？

1. 增加 `MAX_SUMMARY_TOKENS`
2. 改用更强的模型
3. 优化 prompt

---

## 总结

### ✅ 你已经拥有

- 完整的 AI 新闻聚合系统
- 自动采集和生成功能
- GitHub Pages 发布
- 完全免费的部署方案

### 🚀 下一步

1. **立即开始**:
   ```bash
   git clone <repo>
   cd daily_ai_news
   cp .env.example .env.local
   pnpm install && pnpm dev
   ```

2. **部署到生产**:
   - Fork 仓库
   - Vercel 导入
   - 添加环境变量
   - Deploy

3. **配置自动任务**:
   - 添加 Secrets
   - 启用 GitHub Actions
   - 验证定时执行

### 📞 获取帮助

- 📖 查看项目文档
- 🐛 提交 GitHub Issue
- 💬 GitHub Discussions

---

**祝你使用愉快！** 🚀

Last updated: 2025-11-11
