# Daily AI News 部署指南

## 📋 部署前准备

### 1. Supabase 数据库设置

1. 访问 [Supabase](https://supabase.com) 并创建新项目
2. 在 SQL Editor 中执行以下 SQL 创建表结构：

```sql
-- 创建订阅源表
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建文章表
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES sources(id),
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  content TEXT,
  summary TEXT,
  pub_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建日报表
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  html_content TEXT,
  publish_url TEXT,
  report_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_articles_source_id ON articles(source_id);
CREATE INDEX idx_articles_pub_date ON articles(pub_date);
CREATE INDEX idx_reports_report_date ON reports(report_date);
```

3. 获取 Supabase 连接信息：
   - 进入 Project Settings > API
   - 复制 `Project URL` (SUPABASE_URL)
   - 复制 `anon public` key (SUPABASE_ANON_KEY)
   - 复制 `service_role` key (SUPABASE_SERVICE_ROLE_KEY) - **仅用于服务端**

### 2. AI API Key 获取

#### 方案 A: Google Gemini (推荐 - 免费)
1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 点击 "Get API Key"
3. 复制 API Key

#### 方案 B: DeepSeek (可选 - 便宜)
1. 访问 [DeepSeek Platform](https://platform.deepseek.com/)
2. 注册并创建 API Key
3. 复制 API Key

### 3. GitHub Pages 配置 (可选)

如果需要自动发布日报到 GitHub Pages：

1. 创建一个新的 GitHub 仓库用于存放日报（或使用现有仓库）
2. 在 GitHub Settings > Developer settings > Personal access tokens
3. 创建新 token，权限勾选：`repo` (完整仓库访问权限)
4. 复制 token

## 🚀 Vercel 部署步骤

### 1. 连接 GitHub 仓库

1. 访问 [Vercel](https://vercel.com)
2. 点击 "Add New" > "Project"
3. 选择你的 GitHub 仓库：`daily_ai_news`
4. 点击 "Import"

### 2. 配置项目设置

在 Vercel 项目配置页面：

**Framework Preset**: Next.js

**Root Directory**: `./` (留空，使用根目录)

**Build Command**: 
```
npm run build --workspace @daily-ai-news/web
```

**Output Directory**: 
```
apps/web/.next
```

**Install Command**: 
```
npm install
```

### 3. 配置环境变量

在 Vercel 项目设置中，添加以下环境变量：

#### 必需的环境变量：

```bash
# Supabase 数据库
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI API (至少选择一个)
GEMINI_API_KEY=your_gemini_api_key
```

#### 可选的环境变量：

```bash
# DeepSeek API (如果使用 DeepSeek 而不是 Gemini)
DEEPSEEK_API_KEY=your_deepseek_api_key

# GitHub Pages 发布 (可选)
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repo_name

# 应用配置
NODE_ENV=production
```

### 4. 部署

1. 点击 "Deploy" 按钮
2. 等待构建完成（通常 1-2 分钟）
3. 部署成功后，Vercel 会提供一个访问 URL

## 📝 使用说明

部署成功后，访问 Vercel 提供的 URL：

### 1. 管理订阅源
- 点击 "订阅源管理" 标签
- 点击 "添加订阅源" 添加 RSS 源
- 可以编辑或删除现有订阅源

### 2. 抓取资讯
- 点击 "资讯列表" 标签
- 点击 "抓取资讯" 按钮
- 系统会抓取所有订阅源的今日资讯

### 3. 生成日报
- 在资讯列表中，勾选想要生成日报的文章
- 点击 "生成日报" 按钮
- AI 会自动总结并生成日报
- 如果配置了 GitHub，日报会自动发布到 GitHub Pages

### 4. 查看历史日报
- 点击 "历史日报" 标签
- 查看之前生成的所有日报

## 🔧 故障排查

### 构建失败
- 检查 Node.js 版本（需要 18+）
- 确认所有依赖已正确安装
- 查看 Vercel 构建日志

### API 错误
- 确认所有环境变量已正确设置
- 检查 Supabase 数据库表是否已创建
- 验证 AI API Key 是否有效

### 抓取失败
- 某些 RSS 源可能需要代理访问
- 检查 RSS URL 是否有效
- 查看 Vercel Functions 日志

## 📚 技术栈

- **前端**: Next.js 14 + React 18 + Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: Supabase (PostgreSQL)
- **AI**: Google Gemini / DeepSeek
- **部署**: Vercel
- **发布**: GitHub Pages (可选)

## 🔗 相关链接

- Supabase: https://supabase.com
- Vercel: https://vercel.com
- Google AI Studio: https://makersuite.google.com
- DeepSeek: https://platform.deepseek.com

## 📞 支持

如有问题，请在 GitHub 仓库提交 Issue。
