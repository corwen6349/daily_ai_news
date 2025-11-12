# AI 新闻聚合与生成平台# AI 新闻聚合与生成平台



一个自动化的 AI 新闻聚合与生成平台，使用免费或低成本的公网资源部署。一个自动化的AI新闻聚合与生成平台，使用免费或低成本的公网资源部署。



## 🎯 核心功能## 🎯 核心功能



1. **信息源配置**: 网页端配置 RSS 源、API 源等1. **信息源配置**: 网页端配置RSS源、API源等

2. **自动采集**: 每日自动获取最新 AI 资讯2. **自动采集**: 每日自动获取最新AI资讯

3. **内容展示**: 展示采集的资讯，支持勾选3. **内容展示**: 展示采集的资讯，支持勾选

4. **AI 摘要**: 使用免费 AI 模型 (Google Gemini/DeepSeek) 进行智能摘要4. **AI摘要**: 使用免费AI模型(OpenAI/Gemini/DeepSeek)进行智能摘要

5. **自动发布**: 生成静态 HTML 发布到 GitHub Pages5. **自动发布**: 生成静态HTML发布到GitHub Pages



## 🏗️ 架构方案（成本优化）## 🏗️ 架构方案（成本优化）



### 后端服务### 后端服务

- **运行环境**: Vercel Free- **运行环境**: Vercel Free / Railway Free / Render Free

- **数据库**: Supabase Free (PostgreSQL，500MB)- **数据库**: Supabase Free (PostgreSQL) / Firebase Free

- **存储**: 完全云存储- **存储**: 无需本地存储，全部使用云服务



### 前端应用### 前端应用

- **框架**: Next.js 14 + React 18- **网页配置端**: Next.js / React 部署在 Vercel

- **部署**: Vercel (自动部署)- **静态日报**: GitHub Pages (免费)

- **静态日报**: GitHub Pages (免费)

### AI模型集成

### AI 模型集成- **OpenAI**: 免费trial（$5 credit）+ 付费按量（月成本 $2-5）

- **Google Gemini**: 免费额度（50请求/分钟，150万 tokens/月）- **Google Gemini**: 免费额度（50请求/分钟，月150万免费tokens）

- **DeepSeek**: 按量计费，非常便宜（¥0.1-1/月）- **DeepSeek**: 免费开源模型或付费API（月成本 ¥1-2）



### 定时任务### 定时任务

- **Vercel Cron**: 内置支持，完全免费- **GitHub Actions**: 免费（2000分钟/月公开repo）

- **GitHub Actions**: 备选方案（2000分钟/月）- **Vercel Cron**: 免费（内置support）



## 📊 成本预估（月度）## 📊 成本预估（月度）



| 项目 | 方案 | 成本 || 项目 | 方案 | 成本 |

|------|------|------||------|------|------|

| 后端服务 | Vercel Free | ¥0 || 后端服务 | Vercel/Railway Free | ¥0 |

| 数据库 | Supabase Free | ¥0 || 数据库 | Supabase Free | ¥0 |

| AI 模型 | Gemini Free | ¥0 || AI模型 | Gemini Free + DeepSeek | ¥0-2 |

| CDN 和域名 | 内置 | ¥0 || 域名 | GitHub Pages | ¥0 |

| **总计** | | **¥0/月** || CDN | 内置 | ¥0 |

| **总计** | | **¥0-2** |

## 🚀 快速开始

## 🚀 快速开始

### 📌 方式 1：一键部署到 Vercel（推荐 ⭐）

### 📌 方式 1：一键部署到 Vercel（推荐）

1. **Fork 本仓库**到你的 GitHub 账户

2. **访问 [Vercel](https://vercel.com)** 并登录1. **Fork 本仓库**到你的 GitHub 账户

3. **新建项目** → 选择 "Import Git Repository"

4. **搜索并导入** `daily_ai_news` 仓库2. **访问 [Vercel](https://vercel.com)** 并登录

5. **配置环境变量**：

   ```bash3. **新建项目** → 选择 "Import Git Repository"

   SUPABASE_URL=https://xxxxx.supabase.co

   SUPABASE_SERVICE_ROLE_KEY=xxxxx4. **搜索并导入** `daily_ai_news` 仓库

   GEMINI_API_KEY=xxxxx

   NEXT_PUBLIC_API_URL=https://your-domain.vercel.app5. **配置环境变量**：

   ```   ```bash

6. **点击 Deploy** - 完成！🎉   SUPABASE_URL=https://xxxxx.supabase.co

   SUPABASE_SERVICE_ROLE_KEY=xxxxx

👉 **详细部署指南**: 见 [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)   GEMINI_API_KEY=xxxxx

   NEXT_PUBLIC_API_URL=https://your-domain.vercel.app

### 📌 方式 2：本地开发   ```



```bash6. **点击 Deploy** - 完成！🎉

# 1. 克隆项目

git clone https://github.com/corwen6349/daily_ai_news.git👉 **详细部署指南**: 见 [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

cd daily_ai_news

### 📌 方式 2：本地开发

# 2. 安装依赖

pnpm install```bash

# 1. 环境准备

# 3. 配置环境变量git clone <repo>

cp .env.example .env.localcd daily_ai_news

# 编辑 .env.local 填入 API 密钥npm install



# 4. 启动开发服务器# 2. 配置环境变量

pnpm run devcp .env.example .env.local

# 访问 http://localhost:3000# 编辑 .env.local 填入 API 密钥

```

# 3. 启动开发服务器

### 📌 方式 3：Docker 部署npm run dev

# 访问 http://localhost:3000

```bash```

docker build -t daily-ai-news .

docker run -p 3000:3000 --env-file .env.local daily-ai-news### 📌 方式 3：Docker 部署

```

```bash

## 📁 项目结构docker build -t daily-ai-news .

docker run -p 3000:3000 --env-file .env.local daily-ai-news

``````

daily_ai_news/

├── apps/                          # 应用程序## 📁 项目结构

│   ├── web/                       # Next.js 前端 + API 后端 ⭐

│   │   ├── pages/```

│   │   │   ├── api/              # API 路由（5 个端点）daily_ai_news/

│   │   │   │   ├── health.ts     # 健康检查├── apps/                          # 应用程序

│   │   │   │   ├── sources.ts    # 管理信息源│   ├── web/                       # Next.js 前端 + API 后端

│   │   │   │   ├── articles.ts   # 获取文章│   │   ├── pages/

│   │   │   │   ├── fetch-news.ts # 采集资讯│   │   │   ├── api/              # API 路由（5 个端点）

│   │   │   │   └── reports.ts    # 生成日报│   │   │   │   ├── health.ts     # 健康检查

│   │   │   └── index.tsx         # 前端主界面│   │   │   │   ├── sources.ts    # 管理信息源

│   │   ├── next.config.js│   │   │   │   ├── articles.ts   # 获取文章

│   │   ├── tsconfig.json│   │   │   │   ├── fetch-news.ts # 采集资讯

│   │   └── package.json│   │   │   │   └── reports.ts    # 生成日报

│   └── scheduler/                 # 定时任务（可选）│   │   │   └── index.tsx         # 前端主界面

│       └── daily.ts              # 每日定时脚本│   │   ├── next.config.js        # Next.js 配置

├── packages/                      # 共享库│   │   ├── tsconfig.json         # TypeScript 配置

│   ├── ai/                        # AI 模型集成│   │   └── package.json          # 依赖配置

│   │   ├── gemini.ts            # Google Gemini 集成│   └── scheduler/                 # 定时任务（可选）

│   │   ├── deepseek.ts          # DeepSeek 集成│       └── daily.ts              # 每日定时脚本

│   │   └── index.ts├── packages/                      # 共享库

│   ├── db/                        # 数据库操作│   ├── ai/                        # AI 模型集成

│   │   ├── supabase.ts          # Supabase 客户端│   │   ├── gemini.ts            # Google Gemini

│   │   ├── types.ts             # 数据库类型定义│   │   ├── deepseek.ts          # DeepSeek

│   │   └── index.ts│   │   └── index.ts

│   ├── fetchers/                  # 资讯采集器│   ├── db/                        # 数据库操作

│   │   ├── rss.ts               # RSS 解析采集│   │   ├── supabase.ts          # Supabase 客户端

│   │   └── index.ts│   │   ├── types.ts             # 数据库类型

│   ├── processors/                # 数据处理│   │   └── index.ts

│   │   └── index.ts│   ├── fetchers/                  # 资讯采集器

│   ├── publisher/                 # 内容发布│   │   ├── rss.ts               # RSS 采集

│   │   └── index.ts│   │   └── index.ts

│   └── config/                    # 配置管理│   ├── processors/                # 数据处理

│       └── sources.ts            # 信息源配置│   │   └── index.ts

├── .github/│   ├── publisher/                 # 内容发布

│   └── workflows/                 # GitHub Actions 工作流│   │   └── index.ts

├── scripts/                       # 工具脚本│   └── config/                    # 配置管理

├── .env.example                   # 环境变量示例│       └── sources.ts            # 信息源配置

├── package.json                   # 根 package 配置├── .github/

├── pnpm-workspace.yaml            # pnpm 工作空间│   └── workflows/                 # GitHub Actions 工作流

├── tsconfig.json                  # TypeScript 配置├── scripts/                       # 工具脚本

├── turbo.json                     # Turbo 构建配置├── .env.example                   # 环境变量示例

├── vercel.json                    # Vercel 部署配置├── package.json                   # 根 package 配置

├── README.md                      # 项目文档├── pnpm-workspace.yaml            # pnpm 工作空间

└── VERCEL_DEPLOYMENT.md          # Vercel 详细部署指南├── tsconfig.json                  # 根 TypeScript 配置

```├── turbo.json                     # Turbo 构建配置

├── vercel.json                    # Vercel 部署配置

### 📂 关键目录说明├── README.md                      # 项目文档

└── VERCEL_DEPLOYMENT.md          # Vercel 部署指南

| 目录 | 说明 |```

|------|------|

| **apps/web** | 主应用（Next.js 14）</br>- 前端界面与交互</br>- 5 个 Serverless API 端点 |### 📂 关键目录说明

| **apps/scheduler** | 定时任务脚本（可选）</br>- daily.ts 每日采集任务 |

| **packages/ai** | AI 模型集成层</br>- Gemini、DeepSeek 支持</br>- 文章摘要和内容生成 || 目录 | 说明 |

| **packages/db** | 数据库操作层</br>- Supabase PostgreSQL</br>- 数据模型和查询 ||------|------|

| **packages/fetchers** | 资讯采集器</br>- RSS 源采集<br>- 内容解析和清理 || **apps/web** | 主要应用（Next.js 14 + React 18）</br>- 前端界面与交互</br>- 5 个 API 端点 |

| **.github/workflows** | 自动化工作流</br>- 可选：定时任务<br>- 可选：发布 GitHub Pages || **apps/scheduler** | 定时任务脚本（可选）</br>- daily.ts 每日采集任务 |

| **packages/ai** | AI 模型集成</br>- 支持 Gemini、DeepSeek</br>- 文本摘要和生成 |

## 🔧 技术栈| **packages/db** | 数据库操作</br>- Supabase PostgreSQL</br>- 数据模型和查询 |

| **packages/fetchers** | 资讯采集器</br>- RSS 源采集</br>- 内容解析 |

### 前端| **.github/workflows** | 自动化工作流</br>- 可选：定时任务<br>- 可选：发布 GitHub Pages |

- **框架**: Next.js 14 (Pages Router) + React 18

- **语言**: TypeScript 5.3+## 🔧 技术栈

- **样式**: 原生 CSS（可扩展 TailwindCSS）

- **状态**: React Hooks### 前端

- **框架**: Next.js 14 (Pages Router) + React 18

### 后端- **语言**: TypeScript

- **运行时**: Node.js 18+- **样式**: 原生 CSS（可选 TailwindCSS）

- **框架**: Next.js API Routes (Serverless)- **状态**: React Hooks + useState/useEffect

- **包管理**: pnpm 8.0+

- **构建工具**: Turbo### 后端

- **运行时**: Node.js 18+

### 数据库- **框架**: Next.js API Routes (Serverless)

- **数据库**: PostgreSQL via Supabase- **包管理**: pnpm 8.0+

- **连接**: @supabase/supabase-js- **构建工具**: Turbo

- **查询**: 原生 SQL

### 数据库

### AI / 模型- **数据库**: PostgreSQL via Supabase

- **主选**: Google Gemini API (免费)- **连接**: @supabase/supabase-js

- **备选**: DeepSeek API (便宜)- **ORM**: 原生 SQL

- **功能**: 文章摘要、内容生成

### AI / 模型

### 部署和自动化- **主选**: Google Gemini API (免费)

- **服务器**: Vercel (Next.js Serverless)- **备选**: DeepSeek API (便宜)

- **静态页面**: GitHub Pages- **功能**: 文章摘要、内容生成

- **CI/CD**: GitHub Actions

- **定时任务**: Vercel Cron Jobs### 部署

- **主服务**: Vercel (Next.js + Serverless Functions)

## 📝 工作流程- **静态页面**: GitHub Pages

- **自动化**: GitHub Actions (Cron 或手动)

### 🔄 自动采集流程（每天早上 9:00 UTC）- **Cron 任务**: Vercel Cron Jobs



```### 开发工具

1. Vercel Cron 触发 → /api/fetch-news- **语言**: TypeScript 5.3+

   ↓- **包管理**: pnpm

2. 读取所有已启用的 RSS 源- **构建**: Turbo（单仓库构建管理）

   ↓- **配置**: vercel.json, tsconfig.json

3. 采集最新文章（去重、过滤）

   ↓## 📝 工作流程

4. 存储到 Supabase PostgreSQL

   ↓### 🔄 自动采集流程（每天早上 9:00 UTC）

5. 前端自动刷新显示新文章

``````

1. Vercel Cron 触发 → /api/fetch-news

### 👤 用户操作流程2. 读取所有已启用的 RSS 源

3. 采集最新文章（去重、过滤）

```4. 存储到 Supabase PostgreSQL

1. 📰 信息源管理5. 前端自动刷新显示新文章

   - 访问前端界面```

   - 添加 RSS 源（URL、名称、分类）

   - 启用/禁用信息源### 👤 用户操作流程



2. 📄 文章选择```

   - 查看采集的文章列表1. 📰 信息源管理

   - 按日期分组显示   - 访问前端界面

   - 勾选 3-10 篇文章（最多 10 篇）   - 添加 RSS 源（URL、名称、分类）

   - 启用/禁用信息源

3. ✨ 生成日报

   - 点击"生成今日日报"2. 📄 文章选择

   - AI 自动摘要每篇文章   - 查看采集的文章列表

   - 生成 HTML 页面   - 按日期分组显示

   - 勾选 3-10 篇文章（最多 10 篇）

4. 📊 查看/发布

   - 在平台查看日报3. ✨ 生成日报

   - 可选：发布到 GitHub Pages   - 点击"生成今日日报"

   - 可选：分享日报链接   - AI 自动摘要每篇文章

```   - 生成 HTML 页面



### 🔌 API 调用流程4. 📊 查看/发布

   - 在平台查看日报

```   - 可选：发布到 GitHub Pages

前端 (React) → Next.js API Routes → Supabase / AI API → 返回数据   - 可选：分享日报链接

``````



## 📚 免费资源指南### 🔌 API 调用流程



### 部署平台```

- [Vercel](https://vercel.com) - Next.js 最佳部署平台（免费）前端 (React) → Next.js API Routes → Supabase / AI API → 返回数据

- [GitHub Pages](https://pages.github.com) - 静态网站托管（完全免费）```



### 数据库## 📚 免费资源指南

- [Supabase](https://supabase.com) - PostgreSQL，500MB 免费

- [Firebase](https://firebase.google.com) - Realtime DB，免费额度### 部署平台

- [Vercel](https://vercel.com) - Next.js最佳部署平台，含免费额度

### AI 模型- [Railway](https://railway.app) - $5/月免费额度

- [Google Gemini API](https://ai.google.dev) - 50请求/分钟免费- [Render](https://render.com) - 免费tier

- [DeepSeek API](https://platform.deepseek.com) - 按量计费，非常便宜- [GitHub Pages](https://pages.github.com) - 完全免费



### 定时任务### 数据库

- [Vercel Cron](https://vercel.com/docs/cron-jobs) - 免费- [Supabase](https://supabase.com) - PostgreSQL，500MB免费

- [GitHub Actions](https://github.com/features/actions) - 2000分钟/月免费- [Firebase](https://firebase.google.com) - Realtime DB，免费额度

- [Neon](https://neon.tech) - Serverless PostgreSQL，免费tier

## 🔐 安全性

### AI 模型

- ✅ 使用环境变量存储 API 密钥- [Google Gemini API](https://ai.google.dev) - 50请求/分钟免费

- ✅ Supabase Row Level Security (RLS)- [DeepSeek API](https://platform.deepseek.com) - 按量计费，非常便宜

- ✅ GitHub Actions Secrets 管理敏感信息- [OpenAI API](https://platform.openai.com) - 免费trial + 按量

- ✅ CORS 配置

- ✅ 避免在代码中暴露敏感信息### 定时任务

- [GitHub Actions](https://github.com/features/actions) - 2000分钟/月免费

## 🎯 快速参考- [Vercel Cron](https://vercel.com/docs/cron-jobs) - 免费



### API 端点详解## 🔐 安全性



```bash- 使用环境变量存储API密钥

# 健康检查- Supabase Row Level Security (RLS)

GET /api/health- GitHub Actions Secrets 管理敏感信息

响应: { status: "ok" }- CORS 配置

- Rate limiting

# 获取所有信息源

GET /api/sources## 🎯 快速参考

响应: [{ id, name, url, category, active, created_at }]

### API 端点详解

# 添加新信息源

POST /api/sources```bash

请求体: { name: "Hacker News", url: "https://...", category: "Tech" }# 健康检查（验证应用是否运行）

GET /api/health

# 获取文章列表响应: { status: "ok" }

GET /api/articles?limit=20&offset=0

# 获取所有信息源

# 手动采集资讯GET /api/sources

POST /api/fetch-news响应: [{ id, name, url, category, active, created_at }]



# 生成日报# 添加新信息源

POST /api/reportsPOST /api/sources

请求体: { date: "2024-11-12", selectedArticles: ["id1", "id2"] }请求体: { name: "Hacker News", url: "https://...", category: "Tech" }

响应: { id, name, url, category }

# 获取日报列表

GET /api/reports?date=2024-11-12# 获取文章列表

```GET /api/articles

查询参数: ?source_id=1&limit=20&offset=0

### 环境变量完整列表响应: [{ id, title, url, source_id, content, summary, published_at }]



| 变量 | 必需 | 说明 |# 手动触发资讯采集（需授权）

|------|------|------|POST /api/fetch-news

| `SUPABASE_URL` | ✅ | Supabase 项目 URL |请求体: { sources: [1, 2, 3] } (可选指定源)

| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase 服务角色密钥 |响应: { success: true, count: 15, messages: [...] }

| `GEMINI_API_KEY` | ✅ | Google Gemini API 密钥 |

| `DEEPSEEK_API_KEY` | ❌ | DeepSeek API 密钥（备选） |# 生成日报

| `NEXT_PUBLIC_API_URL` | ✅ | 前端访问 API 的 URL |POST /api/reports

| `NODE_ENV` | ❌ | 运行环境（production/development） |请求体: { date: "2024-11-12", selectedArticles: ["id1", "id2", ...] }

| `AI_PROVIDER` | ❌ | AI 提供商（gemini/deepseek） |响应: { id, date, articles_count, html_url, status: "published" }

| `DAILY_ARTICLE_COUNT` | ❌ | 每日默认文章数 |

| `MAX_SUMMARY_TOKENS` | ❌ | 摘要最大 token 数 |# 获取日报列表

GET /api/reports

### 常用命令查询参数: ?date=2024-11-12 或 ?status=published

响应: [{ id, date, articles_count, published, created_at }]

```bash```

# 本地开发

pnpm run dev### 数据库表结构



# 构建生产版本```sql

pnpm run build-- 信息源表

sources:

# 启动生产服务器  - id (PK)

pnpm start  - name (VARCHAR)

  - url (TEXT)

# 代码检查  - category (VARCHAR)

pnpm run lint  - active (BOOLEAN)

  - created_at (TIMESTAMP)

# 代码格式化

pnpm run format-- 文章表

```articles:

  - id (PK)

## 👨‍💻 开发指南  - title (VARCHAR)

  - url (TEXT)

### 本地开发环境设置  - source_id (FK)

  - content (TEXT)

```bash  - summary (TEXT)

# 1. Clone 项目  - published_at (TIMESTAMP)

git clone https://github.com/corwen6349/daily_ai_news.git  - created_at (TIMESTAMP)

cd daily_ai_news

-- 日报表

# 2. 安装依赖reports:

pnpm install  - id (PK)

  - date (DATE)

# 3. 配置环境变量  - articles (JSONB)

cp .env.example .env.local  - html_content (TEXT)

  - published (BOOLEAN)

# 4. 启动开发服务器  - created_at (TIMESTAMP)

pnpm run dev```



# 5. 打开浏览器访问### 环境变量完整列表

# http://localhost:3000

```| 变量 | 值示例 | 必需 | 说明 |

|------|--------|------|------|

### 添加新的 RSS 源| `SUPABASE_URL` | `https://xxxxx.supabase.co` | ✅ | Supabase 项目 URL |

| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` | ✅ | Supabase 服务角色密钥 |

1. 找到有效的 RSS URL| `GEMINI_API_KEY` | `AIzaSyD...` | ✅ | Google Gemini API 密钥 |

2. 在前端界面点击"📰 信息源"标签| `DEEPSEEK_API_KEY` | `sk-xxx` | ❌ | DeepSeek API 密钥（备选） |

3. 填入源名称、URL、分类| `NEXT_PUBLIC_API_URL` | `https://xxx.vercel.app` | ✅ | 前端访问 API 的 URL |

4. 点击"添加"| `NODE_ENV` | `production` | ❌ | 运行环境（production/development） |

5. 点击"🔄 手动获取资讯"立即采集| `AI_PROVIDER` | `gemini` | ❌ | AI 提供商（gemini/deepseek，默认 gemini） |

| `AI_MODEL` | `gemini-1.5-flash` | ❌ | AI 模型名称 |

### 项目文件导航| `DAILY_ARTICLE_COUNT` | `10` | ❌ | 每日默认文章数 |

| `MAX_SUMMARY_TOKENS` | `300` | ❌ | 摘要最大 token 数 |

- **前端页面**: `apps/web/pages/index.tsx` - 主交互界面

- **API 端点**: `apps/web/pages/api/*.ts` - 5 个核心 API### 常用命令

- **数据库**: `packages/db/` - 数据库操作层

- **AI 集成**: `packages/ai/` - 文本摘要生成```bash

- **RSS 采集**: `packages/fetchers/` - RSS 解析采集# 本地开发（同时启动所有服务）

npm run dev

## 🆘 故障排除# 访问 http://localhost:3000



### 常见问题# 构建生产版本

npm run build

| 问题 | 症状 | 解决方案 |

|------|------|--------|# 启动生产服务器

| **页面 404** | 访问返回 404 | 检查 Vercel URL 是否正确 |npm start

| **API 错误** | API 返回 500 | 查看 Vercel Logs，检查环境变量 |

| **数据库连接失败** | "Failed to connect" | 验证 SUPABASE_URL 和 KEY |# 代码检查（ESLint）

| **AI 摘要失败** | "Gemini API error" | 检查 API Key 有效性和配额 |npm run lint

| **RSS 采集失败** | "Failed to fetch" | 检查 RSS URL 是否可访问 |

| **本地启动失败** | `pnpm run dev` 报错 | 运行 `pnpm install`，Node.js >= 18 |# 代码格式化

npm run format

### 调试技巧

# 运行测试

**查看应用日志**npm run test

```bash```

# 本地

pnpm run dev## 👨‍💻 开发指南



# 生产（Vercel）### 本地开发环境设置

# https://vercel.com/dashboard → 项目 → Deployments → Logs

``````bash

# 1. Clone 项目

**检查数据库**git clone https://github.com/corwen6349/daily_ai_news.git

```bashcd daily_ai_news

# 访问 Supabase Dashboard

# SQL Editor 执行查询# 2. 安装依赖

SELECT * FROM sources;pnpm install

SELECT * FROM articles LIMIT 10;

SELECT * FROM reports ORDER BY created_at DESC;# 3. 配置环境变量

```cp .env.example .env.local



## 📚 相关文档# 4. 在 .env.local 中填入你的 API 密钥

# SUPABASE_URL=...

- 📖 [Vercel 部署指南](./VERCEL_DEPLOYMENT.md) - 详细的部署步骤# SUPABASE_SERVICE_ROLE_KEY=...

- 🔗 [Next.js 文档](https://nextjs.org/docs)# GEMINI_API_KEY=...

- 🗄️ [Supabase 文档](https://supabase.com/docs)# NEXT_PUBLIC_API_URL=http://localhost:3000

- 🤖 [Gemini API 文档](https://ai.google.dev/docs)

- ⏰ [Vercel Cron 文档](https://vercel.com/docs/cron-jobs)# 5. 启动开发服务器

pnpm run dev

## 🤝 贡献指南

# 6. 打开浏览器

欢迎贡献代码！请遵循以下步骤：# http://localhost:3000

```

1. Fork 本仓库

2. 创建功能分支 (`git checkout -b feature/amazing-feature`)### 添加新的 RSS 源

3. 提交你的更改 (`git commit -m 'Add amazing feature'`)

4. 推送到分支 (`git push origin feature/amazing-feature`)1. 找到一个有效的 RSS URL（例如 `https://feeds.example.com/rss`）

5. 开启 Pull Request2. 在前端界面点击"📰 信息源"标签

3. 填入源名称、URL、分类

## 📄 许可证4. 点击"添加"

5. 点击"🔄 手动获取资讯"立即采集

本项目采用 MIT 许可证。

### 手动测试 API

## 👨‍💻 作者

```bash

- GitHub: [@corwen6349](https://github.com/corwen6349)# 获取信息源列表

- 项目地址: https://github.com/corwen6349/daily_ai_newscurl http://localhost:3000/api/sources



## 🙏 致谢# 手动采集资讯

curl -X POST http://localhost:3000/api/fetch-news

感谢以下开源项目和服务：

- **Next.js** - React 框架# 获取文章列表

- **Vercel** - 部署平台curl http://localhost:3000/api/articles

- **Supabase** - 开源数据库

- **Google Gemini** - AI 模型# 生成日报

- **DeepSeek** - 备选 AI 模型curl -X POST http://localhost:3000/api/reports \

  -H "Content-Type: application/json" \

---  -d '{

    "date": "2024-11-12",

**如有问题，欢迎在 [GitHub Issues](https://github.com/corwen6349/daily_ai_news/issues) 中提出！** 🎉    "selectedArticles": ["article-id-1", "article-id-2"]

  }'
```

### 项目文件导航

- **前端页面**: `apps/web/pages/index.tsx` - 主交互界面
- **API 端点**: `apps/web/pages/api/*.ts` - 5 个核心 API 
- **数据库**: `packages/db/` - 数据库操作层
- **AI 集成**: `packages/ai/` - 文本摘要生成
- **RSS 采集**: `packages/fetchers/` - RSS 解析和采集

## 🆘 故障排除

### 常见问题

| 问题 | 症状 | 解决方案 |
|------|------|--------|
| **页面 404** | 访问应用返回 404 | 检查 Vercel URL 是否正确，刷新浏览器 |
| **API 错误** | 调用 API 返回 500 | 查看 Vercel Logs，检查环境变量配置 |
| **数据库连接失败** | "Failed to connect" | 验证 SUPABASE_URL 和 KEY 是否正确 |
| **AI 摘要失败** | "Gemini API error" | 检查 GEMINI_API_KEY 是否有效，配额是否用完 |
| **RSS 采集失败** | "Failed to fetch RSS" | 检查 RSS URL 是否可访问，格式是否正确 |
| **本地开发启动失败** | `pnpm run dev` 报错 | 运行 `pnpm install`，确保 Node.js >= 18 |
| **前端显示空白** | 页面加载但无内容 | 打开浏览器开发者工具，查看 Console 错误 |
| **文章列表为空** | 采集后无文章显示 | 检查 RSS 源是否有效，Supabase 是否有数据 |

### 调试技巧

**查看应用日志**

```bash
# 本地开发
pnpm run dev
# 在控制台查看实时输出

# 生产环境（Vercel）
# 访问 https://vercel.com/dashboard
# 选择项目 → Deployments → Logs
```

**检查数据库**

```bash
# 访问 Supabase Dashboard
# 打开 SQL Editor
# 查询数据：

SELECT * FROM sources;
SELECT * FROM articles LIMIT 10;
SELECT * FROM reports ORDER BY created_at DESC;
```

**测试 API 响应**

```bash
# 使用 curl 测试
curl -v http://localhost:3000/api/health

# 使用 VS Code REST Client 扩展
# 创建 test.http 文件：
GET http://localhost:3000/api/health
GET http://localhost:3000/api/sources
GET http://localhost:3000/api/articles
```
