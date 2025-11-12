# 🔗 Hugo 博客自动发布配置指南

本文档说明如何配置系统将生成的 AI 日报自动发布到你的 Hugo 博客。

## 📋 前置条件

- ✅ 已有 Hugo 博客仓库：`https://github.com/corwen6349/daily-ai-news-blog`
- ✅ 博客仓库包含 `content/posts/` 目录
- ✅ 博客已配置并能正常构建

## 🔧 配置步骤

### 1. 获取 GitHub Personal Access Token

1. 访问 GitHub：https://github.com/settings/tokens
2. 点击 **"Generate new token"** > **"Generate new token (classic)"**
3. 填写token信息：
   - **Note**: `Daily AI News Publisher`
   - **Expiration**: 选择有效期（建议 No expiration）
   - **Select scopes**: 勾选 **`repo`**（完整仓库访问权限）
4. 点击 **"Generate token"**
5. **重要**: 立即复制生成的 token（格式：`ghp_xxxxx...`）

### 2. 在 Vercel 中配置环境变量

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目 `daily-ai-news`
3. 进入 **Settings** > **Environment Variables**
4. 添加以下两个环境变量：

```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_REPO=corwen6349/daily-ai-news-blog
```

5. 点击 **Save**
6. 重新部署项目以应用新环境变量

### 3. 验证配置

1. 访问你的 Vercel 应用
2. 在 **"资讯列表"** 中抓取一些文章
3. 勾选几篇文章，点击 **"生成日报"**
4. 系统会：
   - 使用 AI 生成文章摘要
   - 创建 Hugo Markdown 格式的日报
   - 自动提交到你的 Hugo 博客仓库
   - 文件路径：`content/posts/YYYY-MM-DD.md`

### 4. 检查发布结果

#### 在 GitHub 仓库查看

1. 访问：https://github.com/corwen6349/daily-ai-news-blog
2. 进入 `content/posts/` 目录
3. 应该能看到新生成的 Markdown 文件（如 `2025-11-12.md`）

#### 在 Hugo 网站查看

1. 等待 GitHub Actions 自动构建完成（如果配置了）
2. 访问你的 Hugo 博客网站
3. 应该能看到新发布的日报文章

## 📝 生成的文件格式

系统会自动将日报转换为 Hugo 兼容的 Markdown 格式：

```markdown
---
title: "AI Daily News - 2025-11-12"
date: 2025-11-12T09:00:00+08:00
draft: false
tags: ["AI", "Daily News", "Technology"]
categories: ["AI Daily"]
description: "2025-11-12 的 AI 行业要闻精选"
---

## 文章标题 1

文章摘要内容...

[阅读原文](https://example.com/article1)

## 文章标题 2

文章摘要内容...

[阅读原文](https://example.com/article2)
```

## 🎨 自定义配置

### 修改 Front Matter

如需自定义文章的 Front Matter，编辑文件：
`packages/publisher/src/index.ts`

找到 `convertToHugoMarkdown` 函数中的 Front Matter 部分：

```typescript
const frontMatter = `---
title: "${title}"
date: ${date}T09:00:00+08:00
draft: false
tags: ["AI", "Daily News", "Technology"]
categories: ["AI Daily"]
description: "${date} 的 AI 行业要闻精选"
---
`;
```

可以根据你的 Hugo 主题需求修改。

### 修改文件路径

默认发布路径：`content/posts/YYYY-MM-DD.md`

如需修改，编辑 `packages/publisher/src/index.ts`：

```typescript
const fileName = `content/posts/${date}.md`; // 修改这里
```

例如，改为按年月分类：

```typescript
const year = date.substring(0, 4);
const month = date.substring(5, 7);
const fileName = `content/posts/${year}/${month}/${date}.md`;
```

## 🔍 故障排查

### 问题：发布失败，提示 "GitHub API 请求失败"

**原因**：
- Token 无效或过期
- Token 权限不足
- 仓库地址错误

**解决方法**：
1. 检查 `GITHUB_TOKEN` 是否正确
2. 确认 Token 包含 `repo` 权限
3. 验证 `GITHUB_REPO` 格式：`owner/repo`

### 问题：文件提交成功但网站没更新

**原因**：
- Hugo 网站未配置自动构建
- GitHub Actions 构建失败

**解决方法**：
1. 检查 GitHub Actions 运行状态
2. 查看构建日志
3. 确保 Hugo 配置正确

### 问题：生成的 Markdown 格式不对

**原因**：
- HTML 转 Markdown 的转换逻辑需要调整

**解决方法**：
1. 编辑 `packages/publisher/src/index.ts`
2. 修改 `convertToHugoMarkdown` 函数
3. 调整正则表达式匹配规则

## 📊 工作流程

```
用户操作
   │
   ▼
选择文章 + 点击"生成日报"
   │
   ▼
调用 AI 生成摘要
   │
   ▼
转换为 Hugo Markdown 格式
   │
   ▼
通过 GitHub API 提交到仓库
   │
   ▼
触发 Hugo 构建（如果配置了 GitHub Actions）
   │
   ▼
博客网站自动更新
```

## 🔗 相关链接

- Hugo 博客仓库：https://github.com/corwen6349/daily-ai-news-blog
- GitHub API 文档：https://docs.github.com/en/rest
- Hugo 文档：https://gohugo.io/documentation/

## 💡 最佳实践

### 1. Token 安全

- ✅ 只在 Vercel 环境变量中配置，不要提交到代码库
- ✅ 定期更换 Token
- ✅ 只授予必要的权限（repo）

### 2. 内容管理

- 📅 每天生成一份日报，避免重复
- 🏷️ 使用有意义的 tags 和 categories
- 📝 保持一致的命名格式（YYYY-MM-DD.md）

### 3. 监控

- 📊 定期检查 Vercel Functions 日志
- 🔍 查看 GitHub 仓库的 commit 历史
- 🌐 验证博客网站的更新情况

## 🆘 获取帮助

如遇问题：
1. 查看 Vercel Functions 日志
2. 检查 GitHub 仓库的 commit 记录
3. 在项目 Issues 中提问：https://github.com/corwen6349/daily_ai_news/issues

---

✅ **配置完成后，每次生成日报都会自动发布到你的 Hugo 博客！**
