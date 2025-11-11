# AI 新闻聚合与生成平台

一个自动化的AI新闻聚合与生成平台，使用免费或低成本的公网资源部署。

## 🎯 核心功能

1. **信息源配置**: 网页端配置RSS源、API源等
2. **自动采集**: 每日自动获取最新AI资讯
3. **内容展示**: 展示采集的资讯，支持勾选
4. **AI摘要**: 使用免费AI模型(OpenAI/Gemini/DeepSeek)进行智能摘要
5. **自动发布**: 生成静态HTML发布到GitHub Pages

## 🏗️ 架构方案（成本优化）

### 后端服务
- **运行环境**: Vercel Free / Railway Free / Render Free
- **数据库**: Supabase Free (PostgreSQL) / Firebase Free
- **存储**: 无需本地存储，全部使用云服务

### 前端应用
- **网页配置端**: Next.js / React 部署在 Vercel
- **静态日报**: GitHub Pages (免费)

### AI模型集成
- **OpenAI**: 免费trial（$5 credit）+ 付费按量（月成本 $2-5）
- **Google Gemini**: 免费额度（50请求/分钟，月150万免费tokens）
- **DeepSeek**: 免费开源模型或付费API（月成本 ¥1-2）

### 定时任务
- **GitHub Actions**: 免费（2000分钟/月公开repo）
- **Vercel Cron**: 免费（内置support）

## 📊 成本预估（月度）

| 项目 | 方案 | 成本 |
|------|------|------|
| 后端服务 | Vercel/Railway Free | ¥0 |
| 数据库 | Supabase Free | ¥0 |
| AI模型 | Gemini Free + DeepSeek | ¥0-2 |
| 域名 | GitHub Pages | ¥0 |
| CDN | 内置 | ¥0 |
| **总计** | | **¥0-2** |

## 🚀 快速开始

### 1. 环境准备
```bash
git clone <repo>
cd daily_ai_news
npm install
```

### 2. 配置环境变量
```bash
cp .env.example .env.local
```

### 3. 本地开发
```bash
npm run dev
```

### 4. 部署
- 前端: Push to GitHub → Vercel auto-deploy
- 日报: GitHub Actions 定时运行 → 发布到 gh-pages 分支

## 📁 项目结构

```
daily_ai_news/
├── apps/
│   ├── web/              # Next.js 网页配置端 (Vercel)
│   ├── api/              # API 服务 (Vercel Serverless)
│   └── publisher/        # 发布器 (GitHub Actions)
├── packages/
│   ├── fetchers/         # RSS/API 采集器
│   ├── ai/               # AI 模型集成
│   ├── processors/       # 数据处理
│   ├── types/            # TypeScript 类型
│   └── db/               # 数据库操作
├── .github/
│   └── workflows/        # GitHub Actions 工作流
└── docs/
```

## 🔧 技术栈

- **前端**: Next.js 14 + React 18 + TypeScript + TailwindCSS
- **后端**: Node.js + Express / API Routes
- **数据库**: PostgreSQL (Supabase)
- **缓存**: Redis (Upstash Free)
- **AI**: OpenAI / Gemini / DeepSeek API
- **部署**: Vercel / GitHub Pages / GitHub Actions
- **构建**: pnpm + Turbo

## 📝 使用流程

1. 管理员在网页端添加RSS源
2. 每天凌晨GitHub Actions触发采集任务
3. 采集系统调用RSS/API获取最新文章
4. 前端展示文章列表，用户勾选5-10篇
5. 选中文章发送给AI进行摘要处理
6. 生成HTML页面发布到GitHub Pages
7. 生成分享链接和RSS订阅源

## 📚 免费资源指南

### 部署平台
- [Vercel](https://vercel.com) - Next.js最佳部署平台，含免费额度
- [Railway](https://railway.app) - $5/月免费额度
- [Render](https://render.com) - 免费tier
- [GitHub Pages](https://pages.github.com) - 完全免费

### 数据库
- [Supabase](https://supabase.com) - PostgreSQL，500MB免费
- [Firebase](https://firebase.google.com) - Realtime DB，免费额度
- [Neon](https://neon.tech) - Serverless PostgreSQL，免费tier

### AI 模型
- [Google Gemini API](https://ai.google.dev) - 50请求/分钟免费
- [DeepSeek API](https://platform.deepseek.com) - 按量计费，非常便宜
- [OpenAI API](https://platform.openai.com) - 免费trial + 按量

### 定时任务
- [GitHub Actions](https://github.com/features/actions) - 2000分钟/月免费
- [Vercel Cron](https://vercel.com/docs/cron-jobs) - 免费

## 🔐 安全性

- 使用环境变量存储API密钥
- Supabase Row Level Security (RLS)
- GitHub Actions Secrets 管理敏感信息
- CORS 配置
- Rate limiting

## 📄 License

MIT
