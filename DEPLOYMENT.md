# 📦 部署指南

本文档详细说明如何将 AI Daily News Platform 部署到 Vercel，使用 Supabase 作为数据库。

## 📋 部署前准备

### 必需服务

1. **GitHub 账号** - 托管代码
2. **Vercel 账号** - 部署应用 (免费)
3. **Supabase 账号** - 数据库服务 (免费)
4. **AI API Key** - Google Gemini 或 DeepSeek (免费)

### 可选服务

- **GitHub Token** - 自动发布日报到 GitHub Pages

---

## 🗄️ 步骤 1: 配置 Supabase 数据库

### 1.1 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com)
2. 点击 "New Project"
3. 填写项目信息：
   - Name: `daily-ai-news`
   - Database Password: 设置一个强密码
   - Region: 选择离你最近的区域
4. 等待项目创建完成（约 2 分钟）

### 1.2 创建数据库表

在 Supabase Dashboard 中：

1. 点击左侧菜单 **SQL Editor**
2. 点击 **New Query**
3. 粘贴以下 SQL 代码并执行：

```sql
-- 创建订阅源表
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建文章表
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  link TEXT NOT NULL UNIQUE,
  content TEXT,
  summary TEXT,
  pub_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建日报表
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  html_content TEXT,
  publish_url TEXT,
  report_date DATE NOT NULL,
  article_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提升查询性能
CREATE INDEX IF NOT EXISTS idx_articles_source_id ON articles(source_id);
CREATE INDEX IF NOT EXISTS idx_articles_pub_date ON articles(pub_date DESC);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_report_date ON reports(report_date DESC);
CREATE INDEX IF NOT EXISTS idx_sources_is_active ON sources(is_active);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sources_updated_at
  BEFORE UPDATE ON sources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 添加一些默认订阅源（可选）
INSERT INTO sources (name, url, category) VALUES
  ('OpenAI Blog', 'https://openai.com/blog/rss.xml', 'AI Research'),
  ('Hugging Face Blog', 'https://huggingface.co/blog/feed.xml', 'ML/NLP'),
  ('MIT Technology Review AI', 'https://www.technologyreview.com/topic/artificial-intelligence/feed', 'AI News'),
  ('VentureBeat AI', 'https://venturebeat.com/category/ai/feed/', 'Industry'),
  ('The Verge AI', 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', 'Tech News')
ON CONFLICT DO NOTHING;
```

### 1.3 获取 Supabase 凭证

1. 点击左侧菜单 **Project Settings** (齿轮图标)
2. 点击 **API**
3. 找到并复制以下信息：

```bash
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbGc...
service_role key: eyJhbGc... (点击 "Reveal" 显示)
```

⚠️ **注意**: `service_role` key 拥有完整数据库权限，请妥善保管！

---

## 🤖 步骤 2: 获取 AI API Key

### 方案 A: Google Gemini (推荐 - 免费)

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 使用 Google 账号登录
3. 点击 **"Create API Key"**
4. 选择或创建一个 Google Cloud 项目
5. 复制生成的 API Key

**特点**:
- ✅ 完全免费
- ✅ 每分钟 60 次请求
- ✅ 每天 1500 次请求
- ✅ 性能优秀

### 方案 B: DeepSeek (可选 - 便宜)

1. 访问 [DeepSeek Platform](https://platform.deepseek.com/)
2. 注册账号
3. 点击 **API Keys**
4. 创建新的 API Key
5. 复制 API Key

**特点**:
- ✅ 价格便宜 (约 $0.14/百万 tokens)
- ✅ 中文支持好
- ✅ 无请求限制

---

## 🚀 步骤 3: 部署到 Vercel

### 3.1 导入 GitHub 仓库

1. 访问 [Vercel](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 **"Add New Project"**
4. 选择你的 GitHub 仓库：`corwen6349/daily_ai_news`
   - 如果没有看到，点击 "Adjust GitHub App Permissions"
5. 点击 **"Import"**

### 3.2 配置构建设置

在 "Configure Project" 页面：

| 配置项 | 值 |
|--------|-----|
| Framework Preset | Next.js |
| Root Directory | `./` (默认) |
| Build Command | `npm run build --workspace @daily-ai-news/web` |
| Output Directory | `apps/web/.next` |
| Install Command | `npm install` |

### 3.3 添加环境变量

点击 **"Environment Variables"**，添加以下变量：

#### 必需变量

```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
GEMINI_API_KEY=your_gemini_api_key_here
```

#### 可选变量 (Hugo 博客自动发布)

```bash
GITHUB_TOKEN=ghp_xxxxx
GITHUB_REPO=corwen6349/daily-ai-news-blog
```

**获取 GitHub Token**:
1. 访问 GitHub Settings > Developer settings > Personal access tokens
2. 点击 "Generate new token (classic)"
3. 勾选 `repo` 权限（完整仓库访问）
4. 生成并复制 token

**配置 Hugo 博客仓库**:
1. 你的 Hugo 博客仓库: `https://github.com/corwen6349/daily-ai-news-blog`
2. 确保仓库有 `content/posts/` 目录
3. 日报将自动发布为 Markdown 文件到该目录
4. Hugo 会自动构建并发布到网站

### 3.4 部署

1. 点击 **"Deploy"**
2. 等待构建完成（约 2-3 分钟）
3. 部署成功后，Vercel 会提供一个域名，如：
   ```
   https://daily-ai-news.vercel.app
   ```

---

## ✅ 步骤 4: 验证部署

### 4.1 访问应用

打开 Vercel 提供的 URL，你应该看到：
- 现代化的界面
- 三个标签页：订阅源管理、资讯列表、历史日报

### 4.2 测试功能

1. **添加订阅源**
   - 切换到"订阅源管理"
   - 点击"添加订阅源"
   - 填写信息并保存

2. **抓取资讯**
   - 切换到"资讯列表"
   - 点击"抓取资讯"
   - 等待抓取完成

3. **生成日报**
   - 勾选几篇文章
   - 点击"生成日报"
   - 查看生成的日报

---

## 🔧 故障排查

### 构建失败

**问题**: `Error: Cannot find module...`

**解决**:
1. 检查 `vercel.json` 配置是否正确
2. 确认 Build Command 为: `npm run build --workspace @daily-ai-news/web`
3. 查看构建日志，找出具体错误

### API 错误 500

**问题**: API 请求返回 500 错误

**解决**:
1. 检查 Vercel 环境变量是否全部设置
2. 确认 Supabase URL 和 Key 是否正确
3. 查看 Vercel Functions 日志

### Supabase 连接失败

**问题**: `Error: Invalid Supabase credentials`

**解决**:
1. 确认 `SUPABASE_URL` 格式正确（https://xxxxx.supabase.co）
2. 重新生成并更新 API Keys
3. 确认 Supabase 项目处于活跃状态

### AI 摘要失败

**问题**: 生成日报时报错

**解决**:
1. 检查 `GEMINI_API_KEY` 或 `DEEPSEEK_API_KEY` 是否有效
2. 确认 API 配额未超限
3. 尝试切换到另一个 AI 提供商

### RSS 抓取失败

**问题**: 某些订阅源抓取不到内容

**解决**:
1. 验证 RSS URL 是否有效（在浏览器中访问）
2. 某些网站可能需要代理
3. 检查网站是否有反爬限制

---

## 🎨 自定义域名（可选）

### 添加自定义域名

1. 在 Vercel Project 中点击 **Settings** > **Domains**
2. 输入你的域名（如 `news.example.com`）
3. 按照提示配置 DNS 记录：
   ```
   Type: CNAME
   Name: news
   Value: cname.vercel-dns.com
   ```
4. 等待 DNS 生效（通常几分钟）

---

## 📊 监控与日志

### 查看应用日志

1. 在 Vercel 项目页面点击 **Logs**
2. 选择 **Functions** 查看 API 日志
3. 选择 **Build** 查看构建日志

### 性能监控

1. 点击 **Analytics** 查看访问统计
2. 点击 **Speed Insights** 查看性能指标

---

## 🔄 更新部署

### 自动部署

推送代码到 GitHub master 分支，Vercel 会自动重新部署：

```bash
git add .
git commit -m "feat: add new feature"
git push origin master
```

### 手动部署

1. 在 Vercel 项目页面点击 **Deployments**
2. 点击最新部署右侧的三个点
3. 选择 **Redeploy**

---

## 📚 下一步

- [快速开始指南](./QUICKSTART.md) - 了解基本使用
- [GitHub Pages 发布配置](#github-pages-配置) - 自动发布日报
- [定时任务配置](#定时任务配置) - 自动化采集

---

## 🆘 获取帮助

- 查看 [README.md](./README.md) 了解项目详情
- 在 [GitHub Issues](https://github.com/corwen6349/daily_ai_news/issues) 提问
- 查看 Vercel 和 Supabase 官方文档

---

## 📝 环境变量完整清单

| 变量名 | 必需 | 说明 | 示例 |
|--------|------|------|------|
| `SUPABASE_URL` | ✅ | Supabase 项目 URL | `https://xxxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | ✅ | Supabase 匿名密钥 | `eyJhbGc...` |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase 服务密钥 | `eyJhbGc...` |
| `GEMINI_API_KEY` | ✅* | Google Gemini API 密钥 | `AIzaSy...` |
| `DEEPSEEK_API_KEY` | ✅* | DeepSeek API 密钥 | `sk-...` |
| `GITHUB_TOKEN` | ❌ | GitHub 个人访问令牌 | `ghp_...` |
| `GITHUB_REPO` | ❌ | Hugo 博客仓库 (格式: owner/repo) | `corwen6349/daily-ai-news-blog` |
| `NODE_ENV` | ❌ | 环境模式 | `production` |

\* 至少需要配置一个 AI API Key

---

✅ **部署完成！** 现在你可以开始使用 AI Daily News Platform 了。
