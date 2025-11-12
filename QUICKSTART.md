# 🚀 快速开始指南# 🚀 快速部署指南# 快速开始指南



本指南帮助你在 5 分钟内完成 AI Daily News Platform 的部署和配置。



## 📋 前置条件## ✅ 已完成## 📋 前置要求



- ✅ GitHub 账号

- ✅ Vercel 账号（可使用 GitHub 登录）

- ✅ Supabase 账号（可使用 GitHub 登录）1. ✅ 代码已提交到 GitHub: https://github.com/corwen6349/daily_ai_news- Node.js 18+

- ✅ 10 分钟时间

2. ✅ 项目配置文件已准备好（vercel.json, .env.example）- npm 或 pnpm

## 🎯 三步快速部署

3. ✅ 现代化 UI 界面（Tailwind CSS）- GitHub 账户

### 第 1 步：准备数据库（3 分钟）

4. ✅ 完整功能实现（订阅源管理、资讯抓取、AI 日报生成）- 一个信用卡（用于验证，不会扣费）

1. **创建 Supabase 项目**

   - 访问 https://supabase.com

   - 点击 "New Project"

   - 填写项目名称和密码## 📋 下一步部署到 Vercel## 🚀 5分钟快速部署

   - 等待创建完成



2. **创建数据表**

   - 进入项目 Dashboard### 步骤 1: 设置 Supabase 数据库### 第1步: Fork 项目到你的 GitHub

   - 点击 SQL Editor

   - 复制下面的 SQL 并执行：



```sql1. 访问 https://supabase.com 注册/登录```bash

-- 订阅源表

CREATE TABLE sources (2. 创建新项目# 访问 https://github.com/your-repo/daily_ai_news

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name TEXT NOT NULL,3. 在 SQL Editor 中执行以下 SQL（详见 DEPLOYMENT.md）:# 点击 Fork 按钮

  url TEXT NOT NULL,

  category TEXT,```

  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),```sql

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);-- 创建订阅源表### 第2步: 创建 Supabase 项目



-- 文章表CREATE TABLE sources (

CREATE TABLE articles (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),1. 访问 https://supabase.com

  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,

  title TEXT NOT NULL,  name TEXT NOT NULL,2. 用 GitHub 账号登录

  link TEXT NOT NULL UNIQUE,

  content TEXT,  url TEXT NOT NULL,3. 创建新项目 "daily-ai-news"

  summary TEXT,

  pub_date TIMESTAMP WITH TIME ZONE,  category TEXT,4. 获取凭证：

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);  is_active BOOLEAN DEFAULT true,



-- 日报表  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),```bash

CREATE TABLE reports (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()# 在 Settings → API 找到

  title TEXT NOT NULL,

  content TEXT NOT NULL,);SUPABASE_URL=https://xxx.supabase.co

  html_content TEXT,

  publish_url TEXT,SUPABASE_ANON_KEY=xxx

  report_date DATE NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()-- 创建文章表SUPABASE_SERVICE_ROLE_KEY=xxx

);

CREATE TABLE articles (```

-- 创建索引

CREATE INDEX idx_articles_source_id ON articles(source_id);  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

CREATE INDEX idx_articles_pub_date ON articles(pub_date DESC);

CREATE INDEX idx_reports_report_date ON reports(report_date DESC);  source_id UUID REFERENCES sources(id),### 第3步: 创建 Gemini API Key



-- 默认订阅源  title TEXT NOT NULL,

INSERT INTO sources (name, url, category) VALUES

  ('OpenAI Blog', 'https://openai.com/blog/rss.xml', 'AI Research'),  link TEXT NOT NULL,1. 访问 https://ai.google.dev

  ('Hugging Face Blog', 'https://huggingface.co/blog/feed.xml', 'ML/NLP'),

  ('MIT Technology Review', 'https://www.technologyreview.com/topic/artificial-intelligence/feed', 'AI News'),  content TEXT,2. 点击 "Get API Key"

  ('VentureBeat AI', 'https://venturebeat.com/category/ai/feed/', 'Industry'),

  ('The Verge AI', 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', 'Tech News');  summary TEXT,3. 创建新项目

```

  pub_date TIMESTAMP WITH TIME ZONE,4. 复制 API Key：

3. **获取连接信息**

   - 点击 Settings (齿轮图标) > API  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

   - 复制以下三个值：

     - Project URL);```bash

     - anon public key

     - service_role key（点击 Reveal 显示）GEMINI_API_KEY=xxx



### 第 2 步：获取 AI API Key（2 分钟）-- 创建日报表```



**推荐：Google Gemini（免费）**CREATE TABLE reports (



1. 访问 https://makersuite.google.com/app/apikey  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),### 第4步: 配置 GitHub Secrets

2. 登录 Google 账号

3. 点击 "Create API Key"  title TEXT NOT NULL,

4. 复制 API Key

  content TEXT NOT NULL,在你的 GitHub 项目：

**备选：DeepSeek（便宜）**

- 访问 https://platform.deepseek.com  html_content TEXT,

- 注册并创建 API Key

  publish_url TEXT,1. Settings → Secrets and variables → Actions

### 第 3 步：部署到 Vercel（5 分钟）

  report_date DATE NOT NULL,2. 添加以下 Secrets:

1. **导入项目**

   - 访问 https://vercel.com  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

   - 点击 "Add New Project"

   - 选择 GitHub 仓库：`daily_ai_news`);```

   - 点击 "Import"

```SUPABASE_URL

2. **配置构建**

   SUPABASE_SERVICE_ROLE_KEY

   | 配置项 | 值 |

   |--------|-----|4. 从 Project Settings > API 获取：GEMINI_API_KEY

   | Framework | Next.js |

   | Build Command | `npm run build --workspace @daily-ai-news/web` |   - Project URLDAILY_PUBLISH_TIME=09:00

   | Output Directory | `apps/web/.next` |

   - anon public key```

3. **设置环境变量**

      - service_role key

   点击 "Environment Variables"，添加：

### 第5步: 启用 GitHub Pages

   ```bash

   # Supabase（从第1步获取）### 步骤 2: 获取 AI API Key

   SUPABASE_URL=https://xxxxx.supabase.co

   SUPABASE_ANON_KEY=eyJhbGc...1. Settings → Pages

   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

   **推荐使用 Google Gemini (免费):**2. Source 选择 "Deploy from a branch"

   # AI API（从第2步获取）

   GEMINI_API_KEY=AIzaSy...1. 访问 https://makersuite.google.com/app/apikey3. Branch 选择 `gh-pages`

   ```

2. 点击 "Get API Key"4. 保存

4. **点击 Deploy**

   3. 复制 API Key

   等待 2-3 分钟，部署完成！

**完成！** 🎉

## 🎉 完成！开始使用

### 步骤 3: 部署到 Vercel

访问 Vercel 提供的 URL（如 `https://your-app.vercel.app`）

---

### 基本操作

1. 访问 https://vercel.com

#### 1️⃣ 添加订阅源

2. 点击 "Add New" > "Project"## 💻 本地开发

- 切换到 **"订阅源管理"** 标签

- 点击 **"添加订阅源"**3. 选择 GitHub 仓库: `corwen6349/daily_ai_news`

- 填写：

  - 名称：如 "OpenAI 博客"4. 配置项目:### 安装依赖

  - URL：RSS 订阅地址

  - 分类：如 "AI Research"   - Framework: Next.js

- 点击 **"保存"**

   - Build Command: `npm run build --workspace @daily-ai-news/web````bash

#### 2️⃣ 抓取资讯

   - Output Directory: `apps/web/.next`npm install

- 切换到 **"资讯列表"** 标签

- 点击 **"抓取资讯"**# 或

- 等待几秒，系统会抓取所有订阅源的今日资讯

5. 添加环境变量:pnpm install

#### 3️⃣ 生成日报

```

- 在资讯列表中 **勾选** 想要的文章（建议 3-5 篇）

- 点击 **"生成日报"**```bash

- AI 会自动生成摘要并创建日报

- 在 **"历史日报"** 标签查看结果# 必需### 配置环境变量



## 🎨 可选配置SUPABASE_URL=https://your-project.supabase.co



### 配置 GitHub Pages 自动发布SUPABASE_ANON_KEY=your_anon_key```bash



如果想自动发布日报到 GitHub Pages：SUPABASE_SERVICE_ROLE_KEY=your_service_role_keycp .env.example .env.local



1. **创建 GitHub Token**GEMINI_API_KEY=your_gemini_api_key# 编辑 .env.local，填入你的 API 密钥

   - 访问 GitHub Settings > Developer settings > Personal access tokens

   - 生成新 token，勾选 `repo` 权限```



2. **添加环境变量**# 可选 - GitHub Pages 发布

   

   在 Vercel 项目设置中添加：GITHUB_TOKEN=your_github_token### 启动开发服务器

   ```bash

   GITHUB_TOKEN=ghp_xxxxxGITHUB_OWNER=your_github_username

   GITHUB_OWNER=your_username

   GITHUB_REPO=your_repo_nameGITHUB_REPO=your_repo_name```bash

   ```

```npm run dev

3. **启用 GitHub Pages**

   - 在目标仓库 Settings > Pages```

   - 选择 `gh-pages` 分支

   - 保存6. 点击 "Deploy"



### 推荐 RSS 订阅源访问 http://localhost:3000



#### AI/ML 研究### 步骤 4: 使用应用

- OpenAI Blog: `https://openai.com/blog/rss.xml`

- Google AI Blog: `https://ai.googleblog.com/feeds/posts/default`### 手动运行采集任务

- Hugging Face: `https://huggingface.co/blog/feed.xml`

部署成功后:

#### 科技新闻

- MIT Tech Review: `https://www.technologyreview.com/topic/artificial-intelligence/feed`1. 访问 Vercel 提供的 URL```bash

- VentureBeat AI: `https://venturebeat.com/category/ai/feed/`

- The Verge AI: `https://www.theverge.com/rss/ai-artificial-intelligence/index.xml`2. 在 "订阅源管理" 添加 RSS 源npm run fetch:daily



#### 中文资源3. 在 "资讯列表" 抓取今日资讯```

- 机器之心: `https://www.jiqizhixin.com/rss`

- 量子位: `https://www.qbitai.com/rss`4. 选择文章生成 AI 日报



## 💡 使用技巧---



### 文章筛选## 📚 详细文档

- 优先选择标题清晰、内容完整的文章

- 建议每次生成日报选择 3-5 篇文章## 📁 项目结构

- 可以混合不同类别的订阅源

完整部署说明请查看: [DEPLOYMENT.md](./DEPLOYMENT.md)

### 订阅源管理

- 定期检查并删除失效的订阅源```

- 为订阅源添加清晰的分类

- 暂时禁用某些源：编辑时取消勾选 "启用"## 🎨 功能特性daily_ai_news/



### 日报优化├── apps/

- 选择相关性高的文章一起生成

- 标题会自动生成为 "AI Daily - YYYY-MM-DD"- ✨ 现代化 Tailwind UI 界面│   ├── web/              # Next.js 网页应用

- 可以在历史记录中查看所有日报

- 📰 订阅源 CRUD 管理（增删改）│   ├── api/              # API 路由

## 🔧 常见问题

- 🔍 自动抓取今日资讯│   └── scheduler/        # 定时任务脚本

### ❓ 抓取失败怎么办？

- ☑️ 多选文章生成日报├── packages/

**可能原因**：

- RSS 源地址错误或失效- 🤖 AI 智能摘要（Gemini/DeepSeek）│   ├── ai/               # AI 模型集成

- 网络问题

- 订阅源网站反爬限制- 📄 自动发布到 GitHub Pages│   ├── db/               # 数据库操作



**解决方法**：- 💾 Supabase 数据持久化│   ├── fetchers/         # RSS 采集器

- 检查 URL 是否正确（在浏览器中访问）

- 删除失效的订阅源│   ├── processors/       # 数据处理

- 等待几分钟后重试

## 🔗 相关链接│   └── publisher/        # 发布器

### ❓ AI 生成日报失败？

└── .github/

**可能原因**：

- API Key 无效或过期- GitHub: https://github.com/corwen6349/daily_ai_news    └── workflows/        # GitHub Actions

- API 配额用完

- 文章内容为空- Supabase: https://supabase.com```



**解决方法**：- Vercel: https://vercel.com

- 检查 Vercel 环境变量中的 API Key

- 确认 API 配额（Gemini 每天 1500 次免费）- Google AI Studio: https://makersuite.google.com---

- 选择内容较完整的文章



### ❓ 如何查看错误日志？## 🔧 常见任务



1. 登录 Vercel Dashboard### 添加新的 RSS 源

2. 选择你的项目

3. 点击 **Logs** > **Functions**访问 http://localhost:3000/admin，或直接调用 API：

4. 查看 API 调用日志

```bash

### ❓ 能本地运行吗？curl -X POST http://localhost:3000/api/sources \

  -H "Content-Type: application/json" \

可以！按照以下步骤：  -d '{

    "name": "Hacker News",

```bash    "url": "https://news.ycombinator.com/rss",

# 克隆仓库    "category": "tech"

git clone https://github.com/corwen6349/daily_ai_news.git  }'

cd daily_ai_news```



# 安装依赖### 查看采集的文章

npm install

```bash

# 创建 .env.local 文件curl http://localhost:3000/api/articles

cp .env.example .env.local```

# 编辑 .env.local，填入你的配置

### 生成今天的日报

# 启动开发服务器

npm run dev```bash

curl -X POST http://localhost:3000/api/reports \

# 访问 http://localhost:3000  -H "Content-Type: application/json" \

```  -d '{

    "date": "2024-11-11",

## 📚 进阶功能    "selectedArticles": ["article-1", "article-2"]

  }'

### 定时自动抓取（进阶）```



使用 Vercel Cron Jobs：### 查看日报



1. 在 `vercel.json` 中添加：```bash

```jsoncurl http://localhost:3000/api/reports?date=2024-11-11

{```

  "crons": [{

    "path": "/api/fetch-news",---

    "schedule": "0 9 * * *"

  }]## 📊 工作流程

}

```### 自动流程 (每天早上9点)



2. 每天 9:00 UTC 自动抓取```

1. GitHub Actions 触发 ⏰

### 自定义域名2. 采集所有 RSS 源 📰

3. 去重和过滤 🔍

1. 在 Vercel 项目设置中点击 **Domains**4. AI 摘要处理 🤖

2. 添加你的域名5. 生成 HTML ✨

3. 配置 DNS CNAME 记录6. 发布到 GitHub Pages 🚀

4. 等待生效```



## 🔗 相关资源### 手动流程



- [完整部署文档](./DEPLOYMENT.md) - 详细配置说明```

- [项目 README](./README.md) - 项目介绍和 API 文档1. 访问网页应用

- [GitHub 仓库](https://github.com/corwen6349/daily_ai_news) - 源代码2. 查看采集的文章

3. 勾选 5-10 篇文章

## 🆘 需要帮助？4. 点击 "生成日报"

5. AI 自动处理和发布

- 📖 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解详细配置```

- 💬 在 [GitHub Issues](https://github.com/corwen6349/daily_ai_news/issues) 提问

- 🌟 给项目 Star 支持我们！---



---## 🔐 安全建议



**预计总时间：10 分钟**- ✅ **不要**在代码中暴露 API Key

- ✅ 使用环境变量

✅ Supabase 设置 (3 分钟)  - ✅ 定期轮换 GitHub Token

✅ 获取 AI API Key (2 分钟)  - ✅ 启用 2FA

✅ 部署到 Vercel (5 分钟)

---

开始你的 AI 新闻之旅吧！ 🚀

## 📈 监控和调试

### 查看 GitHub Actions 日志

1. 访问 GitHub 项目
2. Actions 标签页
3. 点击最新的 workflow
4. 查看详细日志

### 查看 Vercel 日志

1. 访问 https://vercel.com/dashboard
2. 选择项目
3. Logs 标签页

### 查看 Supabase 日志

1. 访问 https://supabase.com
2. 选择项目
3. Database → Logs 或 Functions → Logs

---

## 🚨 故障排除

### RSS 采集失败

**问题**: "Failed to fetch RSS"

**解决**:
1. 检查 RSS URL 是否正确
2. 检查网络连接
3. 尝试在浏览器中打开链接

### AI 摘要失败

**问题**: "Gemini API error"

**解决**:
1. 检查 GEMINI_API_KEY 是否正确
2. 查看 Gemini API 额度是否用完
3. 查看 API 文档: https://ai.google.dev/docs

### 数据库连接失败

**问题**: "Failed to connect to Supabase"

**解决**:
1. 检查 SUPABASE_URL 和 KEY
2. 确保数据库已创建
3. 检查 Supabase 项目状态

### GitHub Pages 不更新

**问题**: "Pages not deployed"

**解决**:
1. 检查 `gh-pages` 分支是否存在
2. 检查 GitHub Actions 是否成功运行
3. 在 Settings → Pages 检查部署状态

---

## 📚 更多资源

- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Google Gemini API](https://ai.google.dev/docs)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Vercel 文档](https://vercel.com/docs)

---

## 💬 获取帮助

- GitHub Issues: 提交 bug 和功能请求
- Discussions: 讨论想法和改进
- Email: 发送邮件

---

## 📝 License

MIT - 免费使用和修改

---

## 🤝 贡献

欢迎提交 Pull Request！

1. Fork 项目
2. 创建 feature 分支
3. Commit 更改
4. Push 到分支
5. 提交 Pull Request

---

**祝你使用愉快！** 🎉
