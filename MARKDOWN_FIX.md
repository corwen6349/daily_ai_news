# Markdown 格式优化和图片提取功能

## 🎯 问题修复

### 1. Markdown 文件格式混乱
**问题：** 生成的 `.md` 文件中混杂了 HTML 标签，导致格式不正确

**解决方案：**
- 新增 `buildMarkdownReport()` 函数，直接生成纯净的 Markdown 格式
- 改进 HTML 转 Markdown 的转换逻辑，彻底清除 HTML 标签残留
- 在 `generate-report.ts` 中分别生成 HTML（用于预览）和 Markdown（用于 Hugo 博客）

### 2. 缺少文章配图
**问题：** 没有从原文中提取图片

**解决方案：**
- 添加 `extractImagesFromUrl()` 函数，使用 cheerio 库解析 HTML 提取图片
- 智能过滤小图标、logo、广告图（根据尺寸和文件名）
- 优先提取文章主体中的图片（通过多个选择器）
- 最多提取 5 张图片，并转换为绝对 URL

## 📦 新增依赖

需要安装 `cheerio` 库用于 HTML 解析：

```bash
# 在项目根目录执行
npm install

# 或者单独安装到 fetchers 包
cd packages/fetchers
npm install cheerio@1.0.0-rc.12
```

**如果 PowerShell 脚本执行被禁用：**
```powershell
# 方案1：临时允许脚本执行
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# 方案2：使用 CMD
cmd
cd packages\fetchers
npm install cheerio@1.0.0-rc.12
exit
```

## 🔄 文件修改清单

### 1. `packages/processors/src/index.ts`
- ✅ 新增 `buildMarkdownReport()` - 直接生成 Markdown 格式
- ✅ 优化 `buildHtmlReport()` - HTML 预览使用

### 2. `packages/publisher/src/index.ts`
- ✅ 改进 `convertToHugoMarkdown()` - 更彻底的 HTML 清理
- ✅ 修改 `publishReport()` - 支持直接接收 Markdown 或 HTML

### 3. `apps/web/pages/api/generate-report.ts`
- ✅ 同时生成 HTML 和 Markdown
- ✅ 发布到 Hugo 使用 Markdown 而不是转换后的内容

### 4. `packages/fetchers/src/index.ts`
- ✅ 新增 `extractImagesFromUrl()` - 智能提取文章图片
- ✅ 修改 `fetchArticlesFromSources()` - 抓取时自动提取图片

### 5. `packages/fetchers/package.json`
- ✅ 添加 cheerio 依赖

### 6. `packages/db/src/types.ts`
- ✅ Article 接口已包含 `images` 和 `videos` 字段

## 📝 生成的 Markdown 格式示例

```markdown
# 🤖 每日 AI 资讯

**2025年11月13日** · 共 3 篇精选报道

---

## 1. 市值近 600 亿元，安克创新拟赴港上市并发行 H 股股票

🔗 **原文链接：** [https://www.ithome.com/0/897/104.htm](https://www.ithome.com/0/897/104.htm)

![市值近 600 亿元，安克创新拟赴港上市并发行 H 股股票 - 图1](https://img.ithome.com/newsuploadfiles/2025/11/xxx.jpg)

**安克创新拟赴港二次上市，加速全球化战略布局**。这家市值近600亿元的消费电子企业...

📅 **发布时间：** 2025/11/13

---

## 2. 百度萝卜快跑服务次数全球第一...

...
```

## 🚀 使用方法

### 1. 安装依赖
```bash
npm install
```

### 2. 执行数据库迁移（如果还没有）
在 Supabase SQL Editor 执行 `DATABASE_MIGRATION.sql`：
```sql
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS videos TEXT[] DEFAULT '{}';
```

### 3. 重启开发服务器
```bash
cd apps/web
npm run dev
```

### 4. 重新抓取和生成日报
1. 访问 http://localhost:3000/api/fetch-news 抓取文章（会自动提取图片）
2. 勾选文章，点击"生成日报"
3. 查看生成的 Markdown 文件（`content/posts/YYYY-MM-DD.md`）

## 📊 功能对比

| 功能 | 优化前 | 优化后 |
|------|--------|--------|
| Markdown 格式 | ❌ 混杂 HTML 标签 | ✅ 纯净 Markdown |
| 图片提取 | ❌ 无 | ✅ 自动提取（最多5张） |
| 原文链接 | ⚠️ 隐藏在内容中 | ✅ 明确标注在开头 |
| Front Matter | ✅ 有但简单 | ✅ 完整的 Hugo 配置 |
| 图片过滤 | - | ✅ 智能过滤小图标/logo |
| 相对路径处理 | - | ✅ 自动转换为绝对 URL |

## 🔧 图片提取配置

### 提取策略（按优先级）
1. `article img` - 文章标签内的图片
2. `.content img` - 内容区域图片
3. `.post-content img` - 文章内容图片
4. `main img` - 主要内容区
5. `img[src*="upload"]` - 上传的图片
6. `img` - 所有图片（兜底）

### 过滤规则
- ❌ 宽度或高度 < 100px
- ❌ 文件名包含 `icon`、`logo`、`avatar`
- ✅ 最多提取 5 张

### 自定义选择器
编辑 `packages/fetchers/src/index.ts` 的 `selectors` 数组：
```typescript
const selectors = [
  'article img',
  '.your-custom-selector img',  // 添加你的选择器
  // ...
];
```

## 🐛 故障排查

### 1. 图片未提取
**可能原因：**
- 网站需要登录或有反爬虫机制
- 图片是动态加载（JavaScript 渲染）
- 网站响应超时（>5秒）

**解决方案：**
- 检查控制台日志中的错误信息
- 增加超时时间：`signal: AbortSignal.timeout(10000)`
- 手动添加图片 URL 到数据库

### 2. Markdown 仍有 HTML 标签
**可能原因：**
- 使用了旧的 `publishReport(htmlContent, date)`

**解决方案：**
- 确保 `generate-report.ts` 传递的是 `markdownContent`
- 检查 `buildMarkdownReport()` 是否正确导出

### 3. cheerio 安装失败
**解决方案：**
```bash
# 使用淘宝镜像
npm install --registry=https://registry.npmmirror.com cheerio@1.0.0-rc.12

# 或使用 yarn
yarn add cheerio@1.0.0-rc.12
```

## 📚 相关文档

- [AI_PROMPT_OPTIMIZATION.md](./AI_PROMPT_OPTIMIZATION.md) - AI 提示词优化
- [DATABASE_MIGRATION.sql](./DATABASE_MIGRATION.sql) - 数据库迁移脚本
- [README.md](./README.md) - 项目完整文档
