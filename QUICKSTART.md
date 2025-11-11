# 快速开始指南

## 📋 前置要求

- Node.js 18+
- npm 或 pnpm
- GitHub 账户
- 一个信用卡（用于验证，不会扣费）

## 🚀 5分钟快速部署

### 第1步: Fork 项目到你的 GitHub

```bash
# 访问 https://github.com/your-repo/daily_ai_news
# 点击 Fork 按钮
```

### 第2步: 创建 Supabase 项目

1. 访问 https://supabase.com
2. 用 GitHub 账号登录
3. 创建新项目 "daily-ai-news"
4. 获取凭证：

```bash
# 在 Settings → API 找到
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

### 第3步: 创建 Gemini API Key

1. 访问 https://ai.google.dev
2. 点击 "Get API Key"
3. 创建新项目
4. 复制 API Key：

```bash
GEMINI_API_KEY=xxx
```

### 第4步: 配置 GitHub Secrets

在你的 GitHub 项目：

1. Settings → Secrets and variables → Actions
2. 添加以下 Secrets:

```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY
DAILY_PUBLISH_TIME=09:00
```

### 第5步: 启用 GitHub Pages

1. Settings → Pages
2. Source 选择 "Deploy from a branch"
3. Branch 选择 `gh-pages`
4. 保存

**完成！** 🎉

---

## 💻 本地开发

### 安装依赖

```bash
npm install
# 或
pnpm install
```

### 配置环境变量

```bash
cp .env.example .env.local
# 编辑 .env.local，填入你的 API 密钥
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 手动运行采集任务

```bash
npm run fetch:daily
```

---

## 📁 项目结构

```
daily_ai_news/
├── apps/
│   ├── web/              # Next.js 网页应用
│   ├── api/              # API 路由
│   └── scheduler/        # 定时任务脚本
├── packages/
│   ├── ai/               # AI 模型集成
│   ├── db/               # 数据库操作
│   ├── fetchers/         # RSS 采集器
│   ├── processors/       # 数据处理
│   └── publisher/        # 发布器
└── .github/
    └── workflows/        # GitHub Actions
```

---

## 🔧 常见任务

### 添加新的 RSS 源

访问 http://localhost:3000/admin，或直接调用 API：

```bash
curl -X POST http://localhost:3000/api/sources \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hacker News",
    "url": "https://news.ycombinator.com/rss",
    "category": "tech"
  }'
```

### 查看采集的文章

```bash
curl http://localhost:3000/api/articles
```

### 生成今天的日报

```bash
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-11-11",
    "selectedArticles": ["article-1", "article-2"]
  }'
```

### 查看日报

```bash
curl http://localhost:3000/api/reports?date=2024-11-11
```

---

## 📊 工作流程

### 自动流程 (每天早上9点)

```
1. GitHub Actions 触发 ⏰
2. 采集所有 RSS 源 📰
3. 去重和过滤 🔍
4. AI 摘要处理 🤖
5. 生成 HTML ✨
6. 发布到 GitHub Pages 🚀
```

### 手动流程

```
1. 访问网页应用
2. 查看采集的文章
3. 勾选 5-10 篇文章
4. 点击 "生成日报"
5. AI 自动处理和发布
```

---

## 🔐 安全建议

- ✅ **不要**在代码中暴露 API Key
- ✅ 使用环境变量
- ✅ 定期轮换 GitHub Token
- ✅ 启用 2FA

---

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
