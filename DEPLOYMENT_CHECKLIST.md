# ✅ 部署清单 - AI 新闻聚合平台

**项目**: AI 新闻聚合平台  
**版本**: v1.0.0  
**状态**: 🟢 准备发布  
**日期**: 2025-11-11

---

## 📋 部署前检查清单

### 第一阶段: 准备工作 (30分钟)

- [ ] 1.1 注册 Supabase 账户
- [ ] 1.2 创建 Supabase 项目 "daily-ai-news"
- [ ] 1.3 记录 Supabase 凭证:
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] 1.4 在 Supabase 中执行初始化 SQL 脚本
- [ ] 1.5 创建 Google Gemini API Key
  - [ ] 访问 https://ai.google.dev
  - [ ] Get API Key
  - [ ] 启用 Generative Language API
  - [ ] 记录 GEMINI_API_KEY
- [ ] 1.6 创建 GitHub Personal Access Token
  - [ ] 权限: repo, pages
  - [ ] 记录 GITHUB_TOKEN
- [ ] 1.7 获取 GitHub 用户信息
  - [ ] GITHUB_OWNER: 你的用户名
  - [ ] GITHUB_REPO: daily-ai-news

### 第二阶段: 本地开发 (20分钟)

- [ ] 2.1 Fork 项目到个人 GitHub
- [ ] 2.2 克隆到本地
  ```bash
  git clone https://github.com/YOUR_USERNAME/daily_ai_news.git
  ```
- [ ] 2.3 创建 `.env.local` 文件
- [ ] 2.4 填入所有环境变量
- [ ] 2.5 安装依赖
  ```bash
  pnpm install
  ```
- [ ] 2.6 启动开发服务器
  ```bash
  pnpm dev
  ```
- [ ] 2.7 验证本地功能
  - [ ] 访问 http://localhost:3000
  - [ ] 检查信息源页面
  - [ ] 检查文章页面
  - [ ] 测试 /api/health 端点

### 第三阶段: 本地测试 (15分钟)

- [ ] 3.1 测试添加信息源
  ```bash
  curl -X POST http://localhost:3000/api/sources \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Hacker News",
      "url": "https://news.ycombinator.com/rss",
      "category": "tech"
    }'
  ```
- [ ] 3.2 测试获取信息源
  ```bash
  curl http://localhost:3000/api/sources
  ```
- [ ] 3.3 测试手动采集
  ```bash
  curl -X POST http://localhost:3000/api/fetch-news
  ```
- [ ] 3.4 测试获取文章
  ```bash
  curl http://localhost:3000/api/articles
  ```
- [ ] 3.5 验证 UI 正常显示
- [ ] 3.6 验证没有控制台错误

### 第四阶段: 部署到 Vercel (10分钟)

- [ ] 4.1 访问 https://vercel.com
- [ ] 4.2 用 GitHub 登录
- [ ] 4.3 创建新项目
- [ ] 4.4 选择 fork 的 `daily_ai_news` 仓库
- [ ] 4.5 导入项目
- [ ] 4.6 在"Environment Variables"添加:
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] GEMINI_API_KEY
  - [ ] GITHUB_TOKEN
  - [ ] GITHUB_OWNER
  - [ ] GITHUB_REPO
  - [ ] DAILY_PUBLISH_TIME=09:00
- [ ] 4.7 验证构建设置
  - [ ] Framework: Next.js
  - [ ] Build Command: `pnpm build`
  - [ ] Output Directory: `apps/web/.next`
- [ ] 4.8 点击 "Deploy"
- [ ] 4.9 等待部署完成 (3-5分钟)
- [ ] 4.10 验证 Vercel 分配的 URL

### 第五阶段: GitHub Pages 配置 (5分钟)

- [ ] 5.1 访问项目 Settings → Pages
- [ ] 5.2 Source: 选择 "Deploy from a branch"
- [ ] 5.3 Branch: 选择 `gh-pages`
- [ ] 5.4 Root folder: 保持默认 `/`
- [ ] 5.5 保存

### 第六阶段: GitHub Secrets 配置 (10分钟)

- [ ] 6.1 访问项目 Settings → Secrets and variables → Actions
- [ ] 6.2 新增 "Repository secrets":
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] GEMINI_API_KEY
  - [ ] GITHUB_TOKEN
  - [ ] DAILY_PUBLISH_TIME
- [ ] 6.3 验证所有 Secrets 已保存

### 第七阶段: GitHub Actions 配置 (5分钟)

- [ ] 7.1 访问 Settings → Actions → General
- [ ] 7.2 启用 "Allow all actions and reusable workflows"
- [ ] 7.3 验证工作流文件存在: `.github/workflows/`
- [ ] 7.4 检查工作流包含 cron 计划

### 第八阶段: 生产验证 (10分钟)

- [ ] 8.1 访问 Vercel 分配的 URL
- [ ] 8.2 验证主页能加载
- [ ] 8.3 测试 API 端点:
  ```bash
  curl https://YOUR_DOMAIN.vercel.app/api/health
  curl https://YOUR_DOMAIN.vercel.app/api/sources
  curl https://YOUR_DOMAIN.vercel.app/api/articles
  ```
- [ ] 8.4 验证没有 CORS 错误
- [ ] 8.5 测试添加信息源功能
- [ ] 8.6 测试手动采集功能
- [ ] 8.7 检查 Supabase 数据库有新数据

### 第九阶段: 定时任务验证 (可选)

- [ ] 9.1 访问项目 Actions 标签页
- [ ] 9.2 找到定时工作流 (Daily News Fetch)
- [ ] 9.3 点击"Run workflow"手动触发一次
- [ ] 9.4 等待执行完成
- [ ] 9.5 查看执行日志
- [ ] 9.6 验证 Supabase 数据库被更新

### 第十阶段: 文档完成 (5分钟)

- [ ] 10.1 阅读 COMPLETE_GUIDE.md
- [ ] 10.2 阅读 DEPLOYMENT_GUIDE.md
- [ ] 10.3 保存 API 文档
- [ ] 10.4 整理常见问题答案

---

## 🎯 部署成功标志

部署成功时，你应该看到:

✅ **Vercel 仪表板**
- [ ] 项目状态: "Production"
- [ ] 最后部署: "Deployed"
- [ ] 没有错误提示

✅ **应用功能**
- [ ] 访问 https://your-domain.vercel.app 能打开页面
- [ ] 页面显示"🚀 AI 新闻聚合平台"
- [ ] 有"信息源"、"文章"、"查看日报"三个 Tab
- [ ] 没有控制台错误

✅ **API 端点**
- [ ] GET /api/health → 返回 `{ status: "ok" }`
- [ ] GET /api/sources → 返回信息源列表
- [ ] GET /api/articles → 返回文章列表
- [ ] POST /api/fetch-news → 返回 `{ success: true }`
- [ ] POST /api/reports → 返回日报

✅ **数据库**
- [ ] Supabase 中有数据
- [ ] sources 表有记录
- [ ] articles 表有记录

✅ **GitHub**
- [ ] GitHub Pages 已启用
- [ ] gh-pages 分支存在
- [ ] Actions 工作流正常

---

## 🚨 常见部署失败原因

| 问题 | 原因 | 解决 |
|------|------|------|
| 404 错误 | API 路由未找到 | 检查 `apps/web/pages/api/` |
| Supabase 连接失败 | 环境变量错误 | 验证环境变量设置 |
| Gemini API 错误 | API Key 无效 | 重新生成 API Key |
| GitHub Pages 不更新 | 权限或分支问题 | 检查 Settings 配置 |
| 定时任务未运行 | Actions 未启用 | Settings → Actions 启用 |

---

## 📞 如何获取帮助

### 遇到问题时:

1. **查看日志**
   - Vercel: Dashboard → Deployments → Logs
   - GitHub Actions: Actions 标签页
   - Supabase: Logs 标签页

2. **查阅文档**
   - COMPLETE_GUIDE.md - 完整指南
   - DEPLOYMENT_GUIDE.md - 部署指南
   - TROUBLESHOOTING.md - 故障排除

3. **提交 Issue**
   - GitHub Issues: 描述问题和错误日志
   - 包含环境信息和复现步骤

---

## 📊 部署后的关键指标

部署后定期检查:

### 周检查 (每周一)

- [ ] Vercel 部署状态正常
- [ ] GitHub Actions 定时任务运行成功
- [ ] Supabase 数据库有新数据
- [ ] 没有错误告警

### 月检查 (每月 1 号)

- [ ] 回顾本月数据采集情况
- [ ] 检查 API 性能指标
- [ ] 清理过期数据（可选）
- [ ] 备份重要数据

### 季度检查 (每季度末)

- [ ] 总结运行状态报告
- [ ] 规划新功能
- [ ] 优化 prompt 和 AI 参数
- [ ] 更新文档

---

## 🎉 部署完成!

当你完成所有检查项时，恭喜你! 🎊

你现在拥有了一个**完全免费**、**自动化**、**24/7 运行** 的 AI 新闻聚合平台!

### 下一步推荐

1. **优化** - 调整 AI 摘要长度和质量
2. **扩展** - 添加更多数据源
3. **分享** - 分享 GitHub Pages URL
4. **监控** - 定期检查运行状态

---

## 📝 记录你的部署信息

保存以下信息以备后用:

```
项目名称: ________________
Vercel URL: ________________
GitHub URL: ________________
Supabase 项目 ID: ________________
GitHub Pages URL: ________________

API Keys:
SUPABASE_URL: ________________
GITHUB_OWNER: ________________
GITHUB_REPO: ________________

部署日期: ________________
部署负责人: ________________
最后更新: ________________
```

---

**部署日期**: 2025-11-11  
**版本**: v1.0.0  
**状态**: ✅ 准备发布

祝部署顺利! 🚀
