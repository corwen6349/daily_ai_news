# 项目贡献指南

## 🤝 欢迎贡献！

本项目欢迎任何形式的贡献，包括：

- 🐛 Bug 报告和修复
- ✨ 新功能提议
- 📝 文档改进
- 🎨 UI/UX 改进
- 🚀 性能优化

## 📋 行为准则

请遵循以下准则：

- 尊重其他贡献者
- 在讨论中保持建设性态度
- 欢迎多样化的观点和想法

## 🐛 报告 Bug

提交 Bug 报告时，请包含：

1. **现象描述**: 发生了什么
2. **重现步骤**: 如何重现问题
3. **预期行为**: 应该发生什么
4. **实际行为**: 实际发生什么
5. **环境信息**:
   - Node 版本
   - 操作系统
   - 浏览器版本（如果相关）

### Bug 报告示例

```
标题: RSS 采集失败，显示 "Connection timeout"

现象描述:
当添加某些 RSS 源时，系统在采集时超时

重现步骤:
1. 访问 http://localhost:3000
2. 添加 RSS 源 "https://example.com/rss"
3. 点击采集按钮
4. 等待 30 秒

预期:
应该在 10 秒内完成采集

实际:
显示错误 "Connection timeout"

环境:
- Node v18.0.0
- Windows 11
- Chrome 120
```

## ✨ 提议新功能

新功能提议应包含：

1. **功能描述**: 这个功能做什么
2. **使用场景**: 为什么需要它
3. **实现思路**: 如何实现（可选）

### 功能提议示例

```
标题: 支持邮件订阅日报

描述:
用户可以订阅每日日报，通过邮件接收最新的 AI 新闻摘要

使用场景:
某些用户更喜欢通过邮件接收信息，而不是访问网站

实现思路:
- 添加邮件订阅页面
- 集成邮件服务（如 Resend、SendGrid）
- 每日发送预生成的 HTML 邮件
```

## 🔀 提交 Pull Request

### 前置步骤

1. Fork 项目

```bash
git clone https://github.com/your-username/daily_ai_news.git
cd daily_ai_news
```

2. 创建分支

```bash
git checkout -b feature/my-feature
# 或
git checkout -b fix/my-bug-fix
```

3. 创建更改

```bash
npm install
npm run dev
```

### 提交 PR 前的检查

```bash
# 运行测试
npm run test

# 检查代码质量
npm run lint

# 格式化代码
npm run format

# 构建项目
npm run build
```

### PR 描述模板

```markdown
## 描述
简要描述这个 PR 做了什么

## 类型
- [ ] 🐛 Bug 修复
- [ ] ✨ 新功能
- [ ] 📝 文档
- [ ] 🎨 样式
- [ ] 🚀 性能

## 相关 Issue
修复 #123

## 检查清单
- [ ] 我的代码遵循项目风格
- [ ] 我已经运行了 lint 和格式化
- [ ] 我已经添加了测试
- [ ] 我已经更新了文档
- [ ] 没有新的警告

## 截图（如果相关）
<!-- 粘贴截图 -->
```

## 📝 代码风格

### 命名约定

```typescript
// ✅ 好的命名
const articleTitle = 'My Article'
const isLoading = false
function fetchArticles() {}
class ArticleProcessor {}

// ❌ 避免
const at = 'My Article'
const loading = false
function fetch_articles() {}
class article_processor {}
```

### 代码风格

```typescript
// ✅ 使用 const/let，避免 var
const x = 5
let y = 10

// ✅ 使用箭头函数
const add = (a, b) => a + b

// ✅ 使用模板字符串
const message = `Hello, ${name}`

// ✅ 使用 async/await
async function fetchData() {
  const data = await api.get('/articles')
  return data
}

// ✅ 添加类型注解
function process(articles: Article[]): ProcessedArticle[] {
  return articles.map(transform)
}
```

## 📚 项目结构

```
daily_ai_news/
├── apps/              # 应用
├── packages/          # 共享包
├── .github/          # GitHub 配置
├── scripts/          # 工具脚本
└── docs/             # 文档
```

## 🚀 发布流程

本项目使用语义化版本控制：

- `1.2.3` = 主版本.次版本.修订号
- 主版本: 不兼容的 API 更改
- 次版本: 向后兼容的新功能
- 修订号: 向后兼容的 bug 修复

### 版本发布

1. 更新 `package.json` 中的版本号
2. 更新 `CHANGELOG.md`
3. 创建 git tag: `git tag v1.2.3`
4. Push tag: `git push origin v1.2.3`

## 💬 讨论和问题

- 使用 GitHub Discussions 讨论想法
- 使用 GitHub Issues 报告 bug
- 使用邮件联系核心维护者

## 📖 文档

如果添加新功能，请更新相应的文档：

- `README.md`: 项目概览
- `ARCHITECTURE.md`: 架构设计
- `QUICKSTART.md`: 快速开始
- `docs/`: 详细文档

## 🙏 致谢

感谢所有为这个项目做出贡献的人！

---

**祝贡献愉快！** 🎉
