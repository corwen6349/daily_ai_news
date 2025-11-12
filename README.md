# 🤖 AI Daily News Platform# 🤖 Daily AI News Platform# 🤖 AI 新闻聚合与生成平台# 🤖 AI 新闻聚合与生成平台# AI 新闻聚合与生成平台# AI 新闻聚合与生成平台



[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org/)

[![TypeScript](https://img.shields.io/badge/typescript-%3E%3D5.3.0-blue.svg)](https://www.typescriptlang.org/)> 重新实现：完全自动化的 AI 新闻采集、摘要与日报生成平台

[![Next.js](https://img.shields.io/badge/next.js-14.2-black.svg)](https://nextjs.org/)



> 一个现代化的 AI 新闻聚合平台，自动采集、智能摘要、生成日报并发布到 GitHub Pages

## ✨ 功能概要> 一个完全免费的自动化 AI 新闻聚合、内容摘要和发布平台。使用 Next.js、Supabase 和免费 AI API 构建。

## ✨ 功能特性

- 采集：支持多个 RSS/API 信息源

- 📰 **订阅源管理** - 完整的 CRUD 操作管理 RSS 订阅源

- 🔄 **智能采集** - 自动抓取订阅源的今日资讯- 摘要：接入 Google Gemini 与 DeepSeek 双路 AI

- ☑️ **多选生成** - 勾选文章，一键生成 AI 日报

- 🤖 **AI 摘要** - 集成 Google Gemini / DeepSeek 智能摘要- 存储：Supabase 数据库（无配置时使用内存 Mock）

- 📄 **日报生成** - 自动生成精美的 HTML 日报

- 📤 **自动发布** - 一键发布到 GitHub Pages- 展示：Next.js 仪表盘 + API 路由[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)> 一个完全免费的自动化 AI 新闻聚合、内容摘要和发布平台。使用 Next.js、Supabase 和免费 AI API 构建。

- 💾 **数据持久化** - Supabase 数据库存储

- 🎨 **现代化 UI** - 基于 Tailwind CSS 的美观界面- 发布：GitHub Pages 自动化发布日报



## 🏗️ 技术栈- 调度：Vercel Cron 或本地 scheduler 脚本[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org/)



### 前端

- **Next.js 14** - React 框架

- **React 18** - UI 库## 🏗️ 架构说明[![TypeScript](https://img.shields.io/badge/typescript-%3E%3D5.3.0-blue.svg)](https://www.typescriptlang.org/)

- **Tailwind CSS** - 样式框架

- **SWR** - 数据获取```



### 后端Next.js 前端 + API (apps/web)[![Next.js](https://img.shields.io/badge/next.js-%3E%3D14.0.0-black.svg)](https://nextjs.org/)

- **Next.js API Routes** - Serverless API

- **Supabase** - PostgreSQL 数据库└─ 调用 packages/db / fetchers / processors 完成数据流

- **RSS Parser** - RSS 源解析

Supabase 数据库（可选）[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)一个自动化的 AI 新闻聚合与生成平台，使用免费或低成本的公网资源部署。一个自动化的AI新闻聚合与生成平台，使用免费或低成本的公网资源部署。

### AI 服务

- **Google Gemini 1.5 Flash** - 免费 AI 模型Gemini / DeepSeek 提供摘要

- **DeepSeek Chat** - 备选 AI 模型

Scheduler 定时触发采集## ✨ 核心功能

### 部署

- **Vercel** - 前端托管Publisher 将日报发布到 GitHub Pages

- **GitHub Pages** - 日报发布

```[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org/)

## 📦 项目结构



```

daily_ai_news/## 🚀 快速开始- 📰 **信息源管理** - 添加和管理 RSS 源

├── apps/

│   ├── web/                    # Next.js 应用1. 复制 `.env.example` 为 `.env.local` 并填入密钥

│   │   ├── pages/

│   │   │   ├── api/           # API 路由2. 安装依赖：`npm install`- 🔄 **自动采集** - 每天定时采集最新资讯（完全免费）[![TypeScript](https://img.shields.io/badge/typescript-%3E%3D5.3.0-blue.svg)](https://www.typescriptlang.org/)

│   │   │   │   ├── articles.ts

│   │   │   │   ├── sources.ts3. 启动本地开发：`npm run dev`

│   │   │   │   ├── fetch-news.ts

│   │   │   │   ├── generate-report.ts4. 手动触发采集：`curl -X POST http://localhost:3000/api/fetch-news`- 📄 **文章管理** - 展示采集的文章，支持勾选和过滤

│   │   │   │   └── reports.ts

│   │   │   └── index.tsx      # 主页面5. 生成日报：`curl -X POST http://localhost:3000/api/reports -H 'Content-Type: application/json' -d '{"articleIds": ["xxx"]}'`

│   │   └── styles/            # 样式文件

│   └── scheduler/             # 定时任务（可选）- 🤖 **AI 摘要** - 使用免费 AI 模型生成文章摘要

├── packages/

│   ├── ai/                    # AI 服务封装## 📦 目录结构

│   ├── config/                # 配置管理

│   ├── db/                    # 数据库操作```- 📊 **日报生成** - 生成精美的 HTML 日报

│   ├── fetchers/              # RSS 采集器

│   ├── processors/            # 内容处理apps/

│   └── publisher/             # 发布服务

├── .env.example               # 环境变量模板  web/          # Next.js 仪表盘与 API- 📤 **自动发布** - 发布到 GitHub Pages 或其他平台## ✨ 核心功能## 🎯 核心功能## 🎯 核心功能

├── vercel.json               # Vercel 配置

├── DEPLOYMENT.md             # 部署指南  scheduler/    # 定时任务脚本

└── QUICKSTART.md             # 快速开始

```packages/- 🎯 **完全免费** - 所有服务都使用免费层



## 🚀 快速开始  ai/           # AI 摘要调用



### 1. 克隆项目  config/       # 环境配置与默认信息源



```bash  db/           # Supabase + 内存存储抽象

git clone https://github.com/corwen6349/daily_ai_news.git

cd daily_ai_news  fetchers/     # RSS 采集器## 🏗️ 架构概览

```

  processors/   # 摘要加工、日报生成

### 2. 安装依赖

  publisher/    # GitHub 发布逻辑- 📰 **信息源管理** - 添加和管理 RSS 源

```bash

npm install```

```

```

### 3. 配置环境变量

## 🧰 主要依赖

复制 `.env.example` 为 `.env.local` 并填入必要的配置：

- Next.js 14 / React 18 / SWR┌─────────────────────────────────────────────────────┐- 🔄 **自动采集** - 每天定时采集最新资讯（完全免费）

```bash

# Supabase 数据库- Typescript 5.3 / ESLint

SUPABASE_URL=https://your-project.supabase.co

SUPABASE_ANON_KEY=your_anon_key- Supabase JS SDK│          Next.js 前端应用 (Vercel)                   │

SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

- RSS Parser / nanoid

# AI API（选择其一）

GEMINI_API_KEY=your_gemini_api_key- Node 18+（支持原生 fetch）│  ┌──────────────┐    ┌──────────────┐  ┌──────────┐ │- 📄 **文章管理** - 展示采集的文章，支持勾选和过滤1. **信息源配置**: 网页端配置 RSS 源、API 源等1. **信息源配置**: 网页端配置RSS源、API源等

# 或

DEEPSEEK_API_KEY=your_deepseek_api_key



# GitHub Pages 发布（可选）## ☁️ Vercel 部署│  │ 信息源管理    │    │ 文章列表      │  │ 日报生成  │ │

GITHUB_TOKEN=your_github_token

GITHUB_OWNER=your_github_username- `vercel.json` 已配置 npm install + build

GITHUB_REPO=your_repo_name

```- Cron job 每日 09:00 UTC 调用 `/api/fetch-news`│  └──────────────┘    └──────────────┘  └──────────┘ │- 🤖 **AI 摘要** - 使用免费 AI 模型生成文章摘要



### 4. 启动开发服务器- 如需 GitHub Pages 发布，请配置 `GITHUB_TOKEN`、`GITHUB_REPO`



```bash└────────────────────┬────────────────────────────────┘

npm run dev

```## 📄 License



访问 http://localhost:3000MIT                     │- 📊 **日报生成** - 生成精美的 HTML 日报2. **自动采集**: 每日自动获取最新 AI 资讯2. **自动采集**: 每日自动获取最新AI资讯



## 📖 使用指南

        ┌────────────┼────────────┐

### 管理订阅源

        │            │            │- 📤 **自动发布** - 发布到 GitHub Pages 或其他平台

1. 打开应用，切换到 **"订阅源管理"** 标签

2. 点击 **"添加订阅源"** 按钮        ▼            ▼            ▼

3. 填写订阅源名称、URL 和分类

4. 可以编辑或删除现有订阅源   ┌────────┐  ┌────────────┐  ┌──────────┐- 🎯 **完全免费** - 所有服务都使用免费层3. **内容展示**: 展示采集的资讯，支持勾选3. **内容展示**: 展示采集的资讯，支持勾选



### 抓取资讯   │ RSS    │  │ Supabase   │  │ AI API   │



1. 切换到 **"资讯列表"** 标签   │ 源     │  │ PostgreSQL │  │ (Gemini/ │

2. 点击 **"抓取资讯"** 按钮

3. 系统会自动抓取所有订阅源的今日资讯   │采集   │  │ 数据库     │  │ DeepSeek)│



### 生成日报   └────────┘  └────────────┘  └──────────┘## 🏗️ 架构概览4. **AI 摘要**: 使用免费 AI 模型 (Google Gemini/DeepSeek) 进行智能摘要4. **AI摘要**: 使用免费AI模型(OpenAI/Gemini/DeepSeek)进行智能摘要



1. 在资讯列表中勾选要生成日报的文章        │            ▲

2. 点击 **"生成日报"** 按钮

3. AI 会自动生成摘要和日报        └────────────┼────────────┐

4. 如果配置了 GitHub，会自动发布到 GitHub Pages

                     │            │

### 查看历史日报

                     ▼            ▼```5. **自动发布**: 生成静态 HTML 发布到 GitHub Pages5. **自动发布**: 生成静态HTML发布到GitHub Pages

切换到 **"历史日报"** 标签查看所有已生成的日报

            ┌─────────────────┐  ┌────────────┐

## 🌐 部署到 Vercel

            │ 数据处理 Pipeline│  │ GitHub     │┌─────────────────────────────────────────────────────┐

详细部署步骤请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

            │ (提取/清理/总结)│  │ Pages 发布 │

### 快速部署

            └─────────────────┘  └────────────┘│          Next.js 前端应用 (Vercel)                   │

1. Fork 本仓库到你的 GitHub

2. 在 [Vercel](https://vercel.com) 导入项目```

3. 配置环境变量

4. 点击部署│  ┌──────────────┐    ┌──────────────┐  ┌──────────┐ │



## 🔧 API 接口## 🚀 快速开始



### 订阅源管理│  │ 信息源管理    │    │ 文章列表      │  │ 日报生成  │ │## 🏗️ 架构方案（成本优化）## 🏗️ 架构方案（成本优化）



- `GET /api/sources` - 获取所有订阅源### 1. 环境变量配置

- `POST /api/sources` - 添加新订阅源

- `PUT /api/sources` - 更新订阅源│  └──────────────┘    └──────────────┘  └──────────┘ │

- `DELETE /api/sources` - 删除订阅源

复制 `.env.example` 并创建 `.env.local`：

### 资讯管理

└─────────────────────────────────────────────────────┘

- `GET /api/articles` - 获取文章列表

- `POST /api/fetch-news` - 抓取最新资讯```bash



### 日报生成# API Keys                    ↓



- `POST /api/generate-report` - 生成 AI 日报NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

- `GET /api/reports` - 获取历史日报

NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key┌─────────────────────────────────────────────────────┐### 后端服务### 后端服务

## 🔑 环境变量说明

SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

| 变量名 | 必需 | 说明 |

|--------|------|------|│           Next.js API Routes (Serverless)            │

| `SUPABASE_URL` | ✅ | Supabase 项目 URL |

| `SUPABASE_ANON_KEY` | ✅ | Supabase 匿名密钥 |# AI API Keys

| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase 服务密钥 |

| `GEMINI_API_KEY` | ✅* | Google Gemini API 密钥 |GEMINI_API_KEY=your-gemini-key│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │- **运行环境**: Vercel Free- **运行环境**: Vercel Free / Railway Free / Render Free

| `DEEPSEEK_API_KEY` | ✅* | DeepSeek API 密钥 |

| `GITHUB_TOKEN` | ❌ | GitHub 个人访问令牌 |DEEPSEEK_API_KEY=your-deepseek-key

| `GITHUB_OWNER` | ❌ | GitHub 用户名 |

| `GITHUB_REPO` | ❌ | GitHub 仓库名 |│  │ /sources │ │/articles │ │/fetch... │ │ /reports │ │



\* 至少需要配置一个 AI API Key# GitHub Publishing



## 📚 相关文档GITHUB_TOKEN=your-github-token│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │- **数据库**: Supabase Free (PostgreSQL，500MB)- **数据库**: Supabase Free (PostgreSQL) / Firebase Free



- [快速开始指南](./QUICKSTART.md)GITHUB_REPO=your-username/repo-name

- [详细部署文档](./DEPLOYMENT.md)

GITHUB_BRANCH=main└─────────────────────────────────────────────────────┘

## 🛠️ 开发



### 安装依赖

# 其他配置          ↓               ↓              ↓- **存储**: 完全云存储- **存储**: 无需本地存储，全部使用云服务

```bash

npm installNODE_ENV=production

```

```    ┌───────────────┐  ┌──────────┐  ┌──────────┐

### 启动开发服务器



```bash

npm run dev### 2. 本地开发    │ Supabase DB   │  │ Gemini   │  │ DeepSeek │

```



### 构建生产版本

```bash    │ PostgreSQL    │  │ API      │  │ API      │

```bash

npm run build# 安装依赖

```

pnpm install    └───────────────┘  └──────────┘  └──────────┘### 前端应用### 前端应用

### 类型检查



```bash

npm run typecheck# 运行开发服务器```

```

pnpm dev

## 🤝 贡献

- **框架**: Next.js 14 + React 18- **网页配置端**: Next.js / React 部署在 Vercel

欢迎提交 Issue 和 Pull Request！

# 打开浏览器

## 📄 许可证

http://localhost:3000## 💰 成本预估

[MIT License](LICENSE)

```

## 🔗 相关链接

- **部署**: Vercel (自动部署)- **静态日报**: GitHub Pages (免费)

- [Supabase](https://supabase.com) - 数据库服务

- [Vercel](https://vercel.com) - 部署平台### 3. 部署到 Vercel

- [Google AI Studio](https://makersuite.google.com) - Gemini API

- [DeepSeek](https://platform.deepseek.com) - DeepSeek API| 服务 | 方案 | 成本/月 |

- [GitHub Pages](https://pages.github.com) - 静态网站托管

#### 方式 A：一键部署（推荐）

## 💡 常见问题

|------|------|---------|- **静态日报**: GitHub Pages (免费)

### 如何获取免费的 AI API Key？

点击按钮自动部署到 Vercel：

**Google Gemini**：

1. 访问 https://makersuite.google.com/app/apikey| 服务器 | Vercel Free | ¥0 |

2. 点击 "Get API Key"

3. 复制密钥```



**DeepSeek**：https://vercel.com/new?clone-url=https://github.com/corwen6349/daily_ai_news| 数据库 | Supabase Free (500MB) | ¥0 |### AI模型集成

1. 访问 https://platform.deepseek.com

2. 注册账号```

3. 创建 API Key

| AI 模型 | Gemini Free | ¥0 |

### 如何配置 GitHub Pages？

#### 方式 B：命令行部署

1. 创建一个新的 GitHub 仓库

2. 在仓库 Settings > Pages 中启用 GitHub Pages| CDN | 内置 | ¥0 |### AI 模型集成- **OpenAI**: 免费trial（$5 credit）+ 付费按量（月成本 $2-5）

3. 选择 gh-pages 分支

4. 在本项目配置 GITHUB_TOKEN 等环境变量```bash



### 数据存储在哪里？# 安装 Vercel CLI| **总计** | | **¥0** |



所有数据存储在 Supabase PostgreSQL 数据库中，包括：npm i -g vercel

- 订阅源列表

- 采集的文章- **Google Gemini**: 免费额度（50请求/分钟，150万 tokens/月）- **Google Gemini**: 免费额度（50请求/分钟，月150万免费tokens）

- 生成的日报

# 登录

## 📞 支持

vercel login## 🚀 快速开始

如有问题，请在 [GitHub Issues](https://github.com/corwen6349/daily_ai_news/issues) 提交。



---

# 部署- **DeepSeek**: 按量计费，非常便宜（¥0.1-1/月）- **DeepSeek**: 免费开源模型或付费API（月成本 ¥1-2）

⭐ 如果这个项目对你有帮助，欢迎 Star！

vercel

```### 方式 1: Vercel 一键部署（推荐）⭐



#### 方式 C：手动 Git 部署



1. Fork 仓库最快的部署方式，3 步完成：

2. 在 Vercel 连接 GitHub 账户

3. 选择仓库并配置环境变量### 定时任务### 定时任务

4. 自动部署

1. **Fork 项目**

### 4. 配置定时任务

   - 访问 [本仓库](https://github.com/corwen6349/daily_ai_news)- **Vercel Cron**: 内置支持，完全免费- **GitHub Actions**: 免费（2000分钟/月公开repo）

部署到 Vercel 后，编辑 `vercel.json` 设置每日自动采集：

   - 点击右上角 "Fork"

```json

{- **GitHub Actions**: 备选方案（2000分钟/月）- **Vercel Cron**: 免费（内置support）

  "crons": [{

    "path": "/api/fetch-news",2. **部署到 Vercel**

    "schedule": "0 9 * * *"

  }]   - 访问 [Vercel](https://vercel.com)

}

```   - 用 GitHub 账号登录



该配置会在每天 09:00 UTC 自动触发采集任务。   - 点击 "Add New" → "Project"## 📊 成本预估（月度）## 📊 成本预估（月度）



## 📡 API 文档   - 选择 Fork 的仓库 "daily_ai_news"



### GET /api/health   - 点击 "Import"



健康检查接口。



**响应：**3. **配置环境变量**| 项目 | 方案 | 成本 || 项目 | 方案 | 成本 |

```json

{   - 在 Vercel 中进入项目设置

  "status": "ok",

  "version": "1.0.0"   - 添加以下环境变量：|------|------|------||------|------|------|

}

```



### GET /api/sources```bash| 后端服务 | Vercel Free | ¥0 || 后端服务 | Vercel/Railway Free | ¥0 |



获取所有 RSS 源列表。SUPABASE_URL=https://xxxxx.supabase.co



**响应：**SUPABASE_SERVICE_ROLE_KEY=xxxxx| 数据库 | Supabase Free | ¥0 || 数据库 | Supabase Free | ¥0 |

```json

{GEMINI_API_KEY=xxxxx

  "sources": [

    {NEXT_PUBLIC_API_URL=https://your-domain.vercel.app| AI 模型 | Gemini Free | ¥0 || AI模型 | Gemini Free + DeepSeek | ¥0-2 |

      "id": 1,

      "name": "HackerNews",```

      "url": "https://news.ycombinator.com/rss",

      "category": "Tech"| CDN 和域名 | 内置 | ¥0 || 域名 | GitHub Pages | ¥0 |

    }

  ]完成！访问 Vercel 分配的 URL 🎉

}

```| **总计** | | **¥0/月** || CDN | 内置 | ¥0 |



### POST /api/sources### 方式 2: 本地开发



添加新 RSS 源。| **总计** | | **¥0-2** |



**请求体：**```bash

```json

{# 1. 克隆项目## 🚀 快速开始

  "name": "新源",

  "url": "https://example.com/rss",git clone https://github.com/corwen6349/daily_ai_news.git

  "category": "Tech"

}cd daily_ai_news## 🚀 快速开始

```



**响应：**

```json# 2. 安装依赖### 📌 方式 1：一键部署到 Vercel（推荐 ⭐）

{

  "id": 2,pnpm install

  "name": "新源",

  "url": "https://example.com/rss",### 📌 方式 1：一键部署到 Vercel（推荐）

  "category": "Tech"

}# 3. 配置环境变量

```

cp .env.example .env.local1. **Fork 本仓库**到你的 GitHub 账户

### GET /api/articles

# 编辑 .env.local 填入必需的 API 密钥

获取采集的文章列表。

2. **访问 [Vercel](https://vercel.com)** 并登录1. **Fork 本仓库**到你的 GitHub 账户

**查询参数：**

- `limit`: 返回数量（默认 20）# 4. 启动开发服务器

- `offset`: 分页偏移（默认 0）

- `source_id`: 按源过滤（可选）pnpm run dev3. **新建项目** → 选择 "Import Git Repository"



**响应：**

```json

{# 5. 打开浏览器4. **搜索并导入** `daily_ai_news` 仓库2. **访问 [Vercel](https://vercel.com)** 并登录

  "articles": [

    {# 访问 http://localhost:3000

      "id": 1,

      "title": "文章标题",```5. **配置环境变量**：

      "url": "https://example.com/article",

      "summary": "AI 生成的摘要...",

      "source_id": 1,

      "published_at": "2024-01-15T10:00:00Z"### 方式 3: Docker 部署   ```bash3. **新建项目** → 选择 "Import Git Repository"

    }

  ],

  "total": 150

}```bash   SUPABASE_URL=https://xxxxx.supabase.co

```

docker build -t daily-ai-news .

### POST /api/fetch-news

docker run -p 3000:3000 --env-file .env.local daily-ai-news   SUPABASE_SERVICE_ROLE_KEY=xxxxx4. **搜索并导入** `daily_ai_news` 仓库

手动触发新闻采集任务。

```

**响应：**

```json   GEMINI_API_KEY=xxxxx

{

  "status": "success",## 📋 环境变量配置

  "fetched": 45,

  "new_articles": 12   NEXT_PUBLIC_API_URL=https://your-domain.vercel.app5. **配置环境变量**：

}

```### 必需变量



### POST /api/reports   ```   ```bash



生成日报。| 变量 | 说明 | 获取方式 |



**请求体：**|------|------|---------|6. **点击 Deploy** - 完成！🎉   SUPABASE_URL=https://xxxxx.supabase.co

```json

{| `SUPABASE_URL` | Supabase 项目 URL | [Supabase Dashboard](https://supabase.com) → Settings → API |

  "date": "2024-01-15",

  "sources": [1, 2, 3]| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务密钥 | 同上（注意：service_role，不是 anon_key）|   SUPABASE_SERVICE_ROLE_KEY=xxxxx

}

```| `GEMINI_API_KEY` | Google Gemini API | [ai.google.dev](https://ai.google.dev) → Get API Key |



**响应：**| `NEXT_PUBLIC_API_URL` | 前端 API 地址 | 你的部署 URL |👉 **详细部署指南**: 见 [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)   GEMINI_API_KEY=xxxxx

```json

{

  "id": 1,

  "html": "<html>...</html>",### 可选变量   NEXT_PUBLIC_API_URL=https://your-domain.vercel.app

  "published_url": "https://github.io/report-2024-01-15"

}

```

| 变量 | 默认值 | 说明 |### 📌 方式 2：本地开发   ```

### GET /api/reports

|------|--------|------|

获取生成的日报列表。

| `AI_PROVIDER` | `gemini` | AI 提供商（gemini/deepseek）|

**响应：**

```json| `AI_MODEL` | `gemini-1.5-flash` | 使用的 AI 模型 |

{

  "reports": [| `DAILY_ARTICLE_COUNT` | `10` | 每日采集的文章数 |```bash6. **点击 Deploy** - 完成！🎉

    {

      "id": 1,| `MAX_SUMMARY_TOKENS` | `300` | 摘要最大 token 数 |

      "date": "2024-01-15",

      "article_count": 25,| `DEEPSEEK_API_KEY` | - | DeepSeek API 密钥（备选）|# 1. 克隆项目

      "published_url": "https://github.io/report-2024-01-15"

    }

  ]

}## 📁 项目结构git clone https://github.com/corwen6349/daily_ai_news.git👉 **详细部署指南**: 见 [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

```



## 💾 数据库架构

```cd daily_ai_news

### sources 表

daily_ai_news/

存储 RSS 源信息。

├── apps/### 📌 方式 2：本地开发

```sql

CREATE TABLE sources (│   ├── web/                    # Next.js 应用（前端 + API）

  id SERIAL PRIMARY KEY,

  name VARCHAR(255) NOT NULL,│   │   ├── pages/# 2. 安装依赖

  url TEXT NOT NULL UNIQUE,

  category VARCHAR(100),│   │   │   ├── api/           # 5 个核心 API 端点

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP│   │   │   │   ├── health.ts     # 健康检查pnpm install```bash

);

```│   │   │   │   ├── sources.ts    # 信息源管理



### articles 表│   │   │   │   ├── articles.ts   # 文章查询# 1. 环境准备



存储采集的文章。│   │   │   │   ├── fetch-news.ts # 采集资讯



```sql│   │   │   │   └── reports.ts    # 生成日报# 3. 配置环境变量git clone <repo>

CREATE TABLE articles (

  id SERIAL PRIMARY KEY,│   │   │   └── index.tsx       # 前端主界面

  source_id INTEGER REFERENCES sources(id),

  title VARCHAR(500) NOT NULL,│   │   └── next.config.jscp .env.example .env.localcd daily_ai_news

  url TEXT UNIQUE NOT NULL,

  summary TEXT,│   └── scheduler/              # 定时任务（可选）

  content TEXT,

  published_at TIMESTAMP,│# 编辑 .env.local 填入 API 密钥npm install

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);├── packages/

```

│   ├── ai/                     # AI 模型集成

### reports 表

│   ├── db/                     # 数据库操作

存储生成的日报。

│   ├── fetchers/               # RSS 采集器# 4. 启动开发服务器# 2. 配置环境变量

```sql

CREATE TABLE reports (│   ├── processors/             # 数据处理

  id SERIAL PRIMARY KEY,

  date DATE NOT NULL UNIQUE,│   ├── publisher/              # 内容发布pnpm run devcp .env.example .env.local

  html TEXT,

  published_url VARCHAR(500),│   └── config/                 # 配置管理

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);│# 访问 http://localhost:3000# 编辑 .env.local 填入 API 密钥

```

├── .github/

## 📂 项目结构

│   └── workflows/              # GitHub Actions 工作流```

```

daily_ai_news/│

├── apps/

│   ├── web/                    # Next.js 应用└── 其他配置文件# 3. 启动开发服务器

│   │   ├── pages/

│   │   │   ├── index.tsx       # 主页面 UI    ├── vercel.json             # Vercel 部署配置

│   │   │   └── api/

│   │   │       ├── health.ts   # 健康检查    ├── tsconfig.json           # TypeScript 配置### 📌 方式 3：Docker 部署npm run dev

│   │   │       ├── sources.ts  # RSS 源管理

│   │   │       ├── articles.ts # 文章获取    ├── pnpm-workspace.yaml     # pnpm 工作空间

│   │   │       ├── fetch-news.ts # 采集触发

│   │   │       └── reports.ts  # 日报生成    └── .env.example            # 环境变量示例# 访问 http://localhost:3000

│   │   ├── package.json

│   │   └── tsconfig.json```

│   └── scheduler/              # 定时任务

│       └── daily.ts```bash```

├── packages/

│   ├── ai/                     # AI 集成## 🔧 技术栈

│   │   ├── gemini.ts

│   │   ├── deepseek.tsdocker build -t daily-ai-news .

│   │   └── index.ts

│   ├── db/                     # 数据库操作### 前端

│   │   ├── index.ts

│   │   └── supabase.ts- **框架**: Next.js 14 + React 18docker run -p 3000:3000 --env-file .env.local daily-ai-news### 📌 方式 3：Docker 部署

│   ├── fetchers/               # RSS 采集器

│   │   └── rss.ts- **语言**: TypeScript

│   ├── processors/             # 数据处理

│   │   └── index.ts- **样式**: CSS (可选 TailwindCSS)```

│   ├── publisher/              # 发布模块

│   │   └── index.ts

│   └── config/                 # 配置管理

│       └── sources.ts### 后端```bash

├── vercel.json                 # Vercel 配置 + Cron 定时

├── tsconfig.json               # TypeScript 配置- **运行时**: Node.js 18+

├── pnpm-workspace.yaml         # 工作空间定义

└── README.md                   # 本文件- **API**: Next.js Serverless Functions## 📁 项目结构docker build -t daily-ai-news .

```

- **包管理**: pnpm

## 🛠️ 技术栈

- **构建**: Turbodocker run -p 3000:3000 --env-file .env.local daily-ai-news

| 技术 | 版本 | 用途 |

|------|------|------|

| Node.js | ≥18.0 | 运行时环境 |

| Next.js | ≥14.0 | Web 框架 |### 数据库``````

| React | ≥18.0 | UI 库 |

| TypeScript | ≥5.3 | 类型系统 |- **类型**: PostgreSQL

| pnpm | ≥8.0 | 包管理器 |

| Supabase | - | PostgreSQL 数据库 |- **服务**: Supabasedaily_ai_news/

| Vercel | - | 部署平台 |

| Google Gemini | - | AI 摘要 |- **驱动**: @supabase/supabase-js



## 💰 成本分析├── apps/                          # 应用程序## 📁 项目结构



完全免费运行成本分析（¥0/月）：### AI 模型



| 服务 | 免费额度 | 说明 |- **主选**: Google Gemini (免费)│   ├── web/                       # Next.js 前端 + API 后端 ⭐

|------|--------|------|

| Vercel | 100GB/月 | Next.js 部署 |- **备选**: DeepSeek (便宜)

| Supabase | 500MB 数据库 | PostgreSQL 数据库 |

| Gemini API | 150万 tokens/月 | 文章摘要生成 |│   │   ├── pages/```

| DeepSeek API | 免费额度 | 备用 AI 服务 |

| GitHub Pages | 无限 | 日报发布 |### 部署

| 总计 | **¥0/月** | 完全免费 |

- **服务器**: Vercel│   │   │   ├── api/              # API 路由（5 个端点）daily_ai_news/

## 🔧 开发指南

- **静态页面**: GitHub Pages

### 本地开发设置

- **自动化**: GitHub Actions + Vercel Cron│   │   │   │   ├── health.ts     # 健康检查├── apps/                          # 应用程序

```bash

# 1. 克隆仓库

git clone https://github.com/corwen6349/daily_ai_news.git

cd daily_ai_news## 📖 使用指南│   │   │   │   ├── sources.ts    # 管理信息源│   ├── web/                       # Next.js 前端 + API 后端



# 2. 安装依赖

pnpm install

### 1. 添加信息源│   │   │   │   ├── articles.ts   # 获取文章│   │   ├── pages/

# 3. 创建 .env.local

cp .env.example .env.local

# 编辑 .env.local 填入你的 API 密钥

1. 打开应用前端│   │   │   │   ├── fetch-news.ts # 采集资讯│   │   │   ├── api/              # API 路由（5 个端点）

# 4. 启动开发服务器

pnpm dev2. 切换到 "📰 信息源" 标签



# 5. 打开浏览器3. 填入 RSS 源信息：│   │   │   │   └── reports.ts    # 生成日报│   │   │   │   ├── health.ts     # 健康检查

# http://localhost:3000

```   - 名称: 例如 "Hacker News"



### 运行构建   - URL: RSS 源链接│   │   │   └── index.tsx         # 前端主界面│   │   │   │   ├── sources.ts    # 管理信息源



```bash   - 分类: 技术/AI/产品等

# 构建所有包

pnpm build4. 点击 "添加"│   │   ├── next.config.js│   │   │   │   ├── articles.ts   # 获取文章



# 检查构建错误5. 点击 "🔄 手动获取资讯" 立即采集

pnpm tsc --noEmit

│   │   ├── tsconfig.json│   │   │   │   ├── fetch-news.ts # 采集资讯

# 运行 linter

pnpm lint### 2. 选择文章并生成日报

```

│   │   └── package.json│   │   │   │   └── reports.ts    # 生成日报

### 添加新 RSS 源

1. 切换到 "📄 文章" 标签

1. 打开应用首页

2. 在「信息源」标签切换到「添加源」2. 查看已采集的文章列表│   └── scheduler/                 # 定时任务（可选）│   │   │   └── index.tsx         # 前端主界面

3. 输入源名称和 RSS URL

4. 点击「添加」按钮3. 勾选想要的文章（最多 10 篇）



RSS 源会自动在下次采集时被检索。4. 点击 "✨ 生成今日日报"│       └── daily.ts              # 每日定时脚本│   │   ├── next.config.js        # Next.js 配置



### 生成日报5. 等待 AI 生成摘要和日报



1. 打开「日报生成」标签├── packages/                      # 共享库│   │   ├── tsconfig.json         # TypeScript 配置

2. 选择要包含的 RSS 源

3. 点击「生成日报」### 3. 查看和发布日报

4. 生成完成后会自动发布到 GitHub Pages

│   ├── ai/                        # AI 模型集成│   │   └── package.json          # 依赖配置

## 🐛 常见问题

1. 切换到 "📊 查看日报" 标签

### Q: 如何获取 Supabase API 密钥？

2. 查看已生成的日报│   │   ├── gemini.ts            # Google Gemini 集成│   └── scheduler/                 # 定时任务（可选）

A: 访问 [supabase.com](https://supabase.com)：

1. 创建新项目3. 可选：发布到 GitHub Pages

2. 在 Settings → API 中找到 URL 和 anon key

3. 复制到 `.env.local`4. 可选：分享日报链接│   │   ├── deepseek.ts          # DeepSeek 集成│       └── daily.ts              # 每日定时脚本



### Q: Gemini API 额度用完了怎么办？



A: 系统会自动切换到 DeepSeek API。配置 `DEEPSEEK_API_KEY` 作为备用。## 🔗 API 文档│   │   └── index.ts├── packages/                      # 共享库



### Q: 如何手动触发采集任务？



A: 发送 POST 请求到 `/api/fetch-news`：### 健康检查│   ├── db/                        # 数据库操作│   ├── ai/                        # AI 模型集成

```bash

curl -X POST http://localhost:3000/api/fetch-news

```

```http│   │   ├── supabase.ts          # Supabase 客户端│   │   ├── gemini.ts            # Google Gemini

### Q: 日报为什么没有发布到 GitHub？

GET /api/health

A: 检查 `GITHUB_TOKEN` 和 `GITHUB_REPO` 是否配置正确。确保 token 有 repo 权限。

│   │   ├── types.ts             # 数据库类型定义│   │   ├── deepseek.ts          # DeepSeek

### Q: 如何添加新的 RSS 源？

响应:

A: 在前端「信息源管理」标签页添加，或调用 POST `/api/sources` 接口。

{│   │   └── index.ts│   │   └── index.ts

### Q: 可以修改定时采集时间吗？

  "status": "ok"

A: 编辑 `vercel.json` 中的 `crons` 字段，修改 `schedule` 的 cron 表达式。

}│   ├── fetchers/                  # 资讯采集器│   ├── db/                        # 数据库操作

### Q: 如何本地测试 Cron 任务？

```

A: 直接调用接口模拟：

```bash│   │   ├── rss.ts               # RSS 解析采集│   │   ├── supabase.ts          # Supabase 客户端

curl -X POST http://localhost:3000/api/fetch-news

```### 获取信息源



### Q: 部署后前端显示 404 怎么办？│   │   └── index.ts│   │   ├── types.ts             # 数据库类型



A: 确保已将环境变量配置在 Vercel 项目设置中，然后重新部署。```http



## 📝 许可证GET /api/sources│   ├── processors/                # 数据处理│   │   └── index.ts



MIT License - 详见 [LICENSE](LICENSE) 文件



## 🤝 贡献响应:│   │   └── index.ts│   ├── fetchers/                  # 资讯采集器



欢迎提交 Issue 和 Pull Request！[



## 📞 联系方式  {│   ├── publisher/                 # 内容发布│   │   ├── rss.ts               # RSS 采集



- GitHub Issues: [提交问题](https://github.com/corwen6349/daily_ai_news/issues)    "id": 1,

- 讨论区: [Discussions](https://github.com/corwen6349/daily_ai_news/discussions)

    "name": "Hacker News",│   │   └── index.ts│   │   └── index.ts

---

    "url": "https://...",

**Stars ⭐ 和 Forks 🍴 欢迎！**

    "category": "Tech",│   └── config/                    # 配置管理│   ├── processors/                # 数据处理

Made with ❤️ by [corwen6349](https://github.com/corwen6349)

    "active": true

  }│       └── sources.ts            # 信息源配置│   │   └── index.ts

]

```├── .github/│   ├── publisher/                 # 内容发布



### 添加信息源│   └── workflows/                 # GitHub Actions 工作流│   │   └── index.ts



```http├── scripts/                       # 工具脚本│   └── config/                    # 配置管理

POST /api/sources

Content-Type: application/json├── .env.example                   # 环境变量示例│       └── sources.ts            # 信息源配置



{├── package.json                   # 根 package 配置├── .github/

  "name": "Hacker News",

  "url": "https://news.ycombinator.com/rss",├── pnpm-workspace.yaml            # pnpm 工作空间│   └── workflows/                 # GitHub Actions 工作流

  "category": "Tech"

}├── tsconfig.json                  # TypeScript 配置├── scripts/                       # 工具脚本

```

├── turbo.json                     # Turbo 构建配置├── .env.example                   # 环境变量示例

### 获取文章

├── vercel.json                    # Vercel 部署配置├── package.json                   # 根 package 配置

```http

GET /api/articles?limit=20&offset=0├── README.md                      # 项目文档├── pnpm-workspace.yaml            # pnpm 工作空间



响应:└── VERCEL_DEPLOYMENT.md          # Vercel 详细部署指南├── tsconfig.json                  # 根 TypeScript 配置

[

  {```├── turbo.json                     # Turbo 构建配置

    "id": 1,

    "title": "文章标题",├── vercel.json                    # Vercel 部署配置

    "url": "https://...",

    "source_id": 1,### 📂 关键目录说明├── README.md                      # 项目文档

    "content": "文章内容",

    "summary": "AI 生成的摘要",└── VERCEL_DEPLOYMENT.md          # Vercel 部署指南

    "published_at": "2024-11-12T10:00:00Z"

  }| 目录 | 说明 |```

]

```|------|------|



### 采集资讯| **apps/web** | 主应用（Next.js 14）</br>- 前端界面与交互</br>- 5 个 Serverless API 端点 |### 📂 关键目录说明



```http| **apps/scheduler** | 定时任务脚本（可选）</br>- daily.ts 每日采集任务 |

POST /api/fetch-news

| **packages/ai** | AI 模型集成层</br>- Gemini、DeepSeek 支持</br>- 文章摘要和内容生成 || 目录 | 说明 |

响应:

{| **packages/db** | 数据库操作层</br>- Supabase PostgreSQL</br>- 数据模型和查询 ||------|------|

  "success": true,

  "count": 15,| **packages/fetchers** | 资讯采集器</br>- RSS 源采集<br>- 内容解析和清理 || **apps/web** | 主要应用（Next.js 14 + React 18）</br>- 前端界面与交互</br>- 5 个 API 端点 |

  "messages": ["采集成功", ...]

}| **.github/workflows** | 自动化工作流</br>- 可选：定时任务<br>- 可选：发布 GitHub Pages || **apps/scheduler** | 定时任务脚本（可选）</br>- daily.ts 每日采集任务 |

```

| **packages/ai** | AI 模型集成</br>- 支持 Gemini、DeepSeek</br>- 文本摘要和生成 |

### 生成日报

## 🔧 技术栈| **packages/db** | 数据库操作</br>- Supabase PostgreSQL</br>- 数据模型和查询 |

```http

POST /api/reports| **packages/fetchers** | 资讯采集器</br>- RSS 源采集</br>- 内容解析 |

Content-Type: application/json

### 前端| **.github/workflows** | 自动化工作流</br>- 可选：定时任务<br>- 可选：发布 GitHub Pages |

{

  "date": "2024-11-12",- **框架**: Next.js 14 (Pages Router) + React 18

  "selectedArticles": ["1", "2", "3"]

}- **语言**: TypeScript 5.3+## 🔧 技术栈



响应:- **样式**: 原生 CSS（可扩展 TailwindCSS）

{

  "id": 1,- **状态**: React Hooks### 前端

  "date": "2024-11-12",

  "articles_count": 3,- **框架**: Next.js 14 (Pages Router) + React 18

  "status": "published",

  "html_url": "https://..."### 后端- **语言**: TypeScript

}

```- **运行时**: Node.js 18+- **样式**: 原生 CSS（可选 TailwindCSS）



## 📊 数据库模式- **框架**: Next.js API Routes (Serverless)- **状态**: React Hooks + useState/useEffect



### sources 表- **包管理**: pnpm 8.0+



```sql- **构建工具**: Turbo### 后端

CREATE TABLE sources (

  id SERIAL PRIMARY KEY,- **运行时**: Node.js 18+

  name VARCHAR(255) NOT NULL,

  url TEXT NOT NULL,### 数据库- **框架**: Next.js API Routes (Serverless)

  category VARCHAR(100),

  active BOOLEAN DEFAULT true,- **数据库**: PostgreSQL via Supabase- **包管理**: pnpm 8.0+

  created_at TIMESTAMP DEFAULT NOW(),

  updated_at TIMESTAMP DEFAULT NOW()- **连接**: @supabase/supabase-js- **构建工具**: Turbo

);

```- **查询**: 原生 SQL



### articles 表### 数据库



```sql### AI / 模型- **数据库**: PostgreSQL via Supabase

CREATE TABLE articles (

  id SERIAL PRIMARY KEY,- **主选**: Google Gemini API (免费)- **连接**: @supabase/supabase-js

  title VARCHAR(500) NOT NULL,

  url TEXT NOT NULL,- **备选**: DeepSeek API (便宜)- **ORM**: 原生 SQL

  source_id INTEGER REFERENCES sources(id),

  content TEXT,- **功能**: 文章摘要、内容生成

  summary TEXT,

  published_at TIMESTAMP,### AI / 模型

  created_at TIMESTAMP DEFAULT NOW()

);### 部署和自动化- **主选**: Google Gemini API (免费)

```

- **服务器**: Vercel (Next.js Serverless)- **备选**: DeepSeek API (便宜)

### reports 表

- **静态页面**: GitHub Pages- **功能**: 文章摘要、内容生成

```sql

CREATE TABLE reports (- **CI/CD**: GitHub Actions

  id SERIAL PRIMARY KEY,

  date DATE NOT NULL,- **定时任务**: Vercel Cron Jobs### 部署

  articles JSONB,

  html_content TEXT,- **主服务**: Vercel (Next.js + Serverless Functions)

  published BOOLEAN DEFAULT false,

  created_at TIMESTAMP DEFAULT NOW()## 📝 工作流程- **静态页面**: GitHub Pages

);

```- **自动化**: GitHub Actions (Cron 或手动)



## 🔧 常用命令### 🔄 自动采集流程（每天早上 9:00 UTC）- **Cron 任务**: Vercel Cron Jobs



```bash

# 开发

pnpm run dev          # 启动开发服务器```### 开发工具



# 构建1. Vercel Cron 触发 → /api/fetch-news- **语言**: TypeScript 5.3+

pnpm run build        # 构建生产版本

pnpm start           # 启动生产服务器   ↓- **包管理**: pnpm



# 代码质量2. 读取所有已启用的 RSS 源- **构建**: Turbo（单仓库构建管理）

pnpm run lint        # 代码检查

pnpm run format      # 格式化代码   ↓- **配置**: vercel.json, tsconfig.json

pnpm run test        # 运行测试

```3. 采集最新文章（去重、过滤）



## 🆘 故障排除   ↓## 📝 工作流程



### 页面无法访问4. 存储到 Supabase PostgreSQL



**症状**: 访问应用返回 404   ↓### 🔄 自动采集流程（每天早上 9:00 UTC）



**解决**:5. 前端自动刷新显示新文章

1. 确保 Vercel URL 正确

2. 刷新浏览器``````

3. 检查部署是否完成

1. Vercel Cron 触发 → /api/fetch-news

### API 返回 500 错误

### 👤 用户操作流程2. 读取所有已启用的 RSS 源

**症状**: 调用 API 返回 500 Internal Server Error

3. 采集最新文章（去重、过滤）

**解决**:

1. 查看 Vercel 日志（Dashboard → Logs）```4. 存储到 Supabase PostgreSQL

2. 检查环境变量是否配置正确

3. 验证 Supabase 数据库是否运行1. 📰 信息源管理5. 前端自动刷新显示新文章



### 数据库连接失败   - 访问前端界面```



**症状**: "Failed to connect to Supabase" 错误   - 添加 RSS 源（URL、名称、分类）



**解决**:   - 启用/禁用信息源### 👤 用户操作流程

1. 验证 `SUPABASE_URL` 是否正确

2. 检查 `SUPABASE_SERVICE_ROLE_KEY` 是否有效

3. 确保数据库表已创建（查看 Supabase SQL）

2. 📄 文章选择```

### AI 摘要生成失败

   - 查看采集的文章列表1. 📰 信息源管理

**症状**: "Gemini API error" 或摘要为空

   - 按日期分组显示   - 访问前端界面

**解决**:

1. 检查 `GEMINI_API_KEY` 是否有效   - 勾选 3-10 篇文章（最多 10 篇）   - 添加 RSS 源（URL、名称、分类）

2. 查看 Google Cloud 配额是否用完

3. 尝试用 DeepSeek 作为备选   - 启用/禁用信息源



### RSS 采集没有结果3. ✨ 生成日报



**症状**: 采集后文章列表为空   - 点击"生成今日日报"2. 📄 文章选择



**解决**:   - AI 自动摘要每篇文章   - 查看采集的文章列表

1. 验证 RSS URL 是否正确（在浏览器中打开）

2. 检查 RSS 源是否有新文章   - 生成 HTML 页面   - 按日期分组显示

3. 查看应用日志中的错误信息

   - 勾选 3-10 篇文章（最多 10 篇）

## 📚 相关文档

4. 📊 查看/发布

- [Vercel 部署详细指南](./VERCEL_DEPLOYMENT.md)

- [Next.js 官方文档](https://nextjs.org/docs)   - 在平台查看日报3. ✨ 生成日报

- [Supabase 官方文档](https://supabase.com/docs)

- [Google Gemini API 文档](https://ai.google.dev/docs)   - 可选：发布到 GitHub Pages   - 点击"生成今日日报"

- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

   - 可选：分享日报链接   - AI 自动摘要每篇文章

## 🤝 贡献

```   - 生成 HTML 页面

欢迎贡献代码！请遵循以下步骤：



1. Fork 本仓库

2. 创建功能分支 (`git checkout -b feature/amazing-feature`)### 🔌 API 调用流程4. 📊 查看/发布

3. 提交你的更改 (`git commit -m 'Add amazing feature'`)

4. 推送到分支 (`git push origin feature/amazing-feature`)   - 在平台查看日报

5. 打开 Pull Request

```   - 可选：发布到 GitHub Pages

## 📄 许可证

前端 (React) → Next.js API Routes → Supabase / AI API → 返回数据   - 可选：分享日报链接

本项目采用 [MIT License](LICENSE) 许可证。

``````

## 👨‍💻 作者



- **GitHub**: [@corwen6349](https://github.com/corwen6349)

- **项目**: [daily_ai_news](https://github.com/corwen6349/daily_ai_news)## 📚 免费资源指南### 🔌 API 调用流程



## 🙏 致谢



感谢以下开源项目和服务：### 部署平台```



- [Next.js](https://nextjs.org/) - React 框架- [Vercel](https://vercel.com) - Next.js 最佳部署平台（免费）前端 (React) → Next.js API Routes → Supabase / AI API → 返回数据

- [Vercel](https://vercel.com/) - 部署平台

- [Supabase](https://supabase.com/) - 数据库服务- [GitHub Pages](https://pages.github.com) - 静态网站托管（完全免费）```

- [Google Gemini](https://ai.google.dev/) - AI 模型

- [DeepSeek](https://www.deepseek.com/) - 开源 AI 模型



## 📞 获取帮助### 数据库## 📚 免费资源指南



- 🐛 **报告问题**: [GitHub Issues](https://github.com/corwen6349/daily_ai_news/issues)- [Supabase](https://supabase.com) - PostgreSQL，500MB 免费

- 💬 **讨论功能**: [GitHub Discussions](https://github.com/corwen6349/daily_ai_news/discussions)

- 📧 **发送邮件**: 通过 GitHub 联系我- [Firebase](https://firebase.google.com) - Realtime DB，免费额度### 部署平台



---- [Vercel](https://vercel.com) - Next.js最佳部署平台，含免费额度



<div align="center">### AI 模型- [Railway](https://railway.app) - $5/月免费额度



Made with ❤️ by [@corwen6349](https://github.com/corwen6349)- [Google Gemini API](https://ai.google.dev) - 50请求/分钟免费- [Render](https://render.com) - 免费tier



[⭐ Star on GitHub](https://github.com/corwen6349/daily_ai_news) • [🐛 Report Issue](https://github.com/corwen6349/daily_ai_news/issues) • [💬 Discuss](https://github.com/corwen6349/daily_ai_news/discussions)- [DeepSeek API](https://platform.deepseek.com) - 按量计费，非常便宜- [GitHub Pages](https://pages.github.com) - 完全免费



</div>


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
