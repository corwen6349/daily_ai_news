# 技术栈和依赖清单

## 🛠️ 技术栈

### 前端
- **框架**: Next.js 14 + React 18
- **语言**: TypeScript
- **样式**: TailwindCSS / CSS-in-JS
- **状态管理**: React Hooks / Context API

### 后端
- **运行时**: Node.js 18+
- **框架**: Next.js API Routes (Serverless)
- **脚本**: TypeScript + Node.js

### 数据库
- **提供商**: Supabase (PostgreSQL)
- **ORM**: 直接使用 REST API / supabase-js
- **缓存**: Upstash Redis (可选)

### AI / ML
- **Gemini API** (Google) - 优先选择
- **DeepSeek API** - 备选方案
- **OpenAI API** - 高级选项

### 部署和 CI/CD
- **前端托管**: Vercel
- **后端**: Vercel Serverless Functions
- **静态网站**: GitHub Pages
- **定时任务**: GitHub Actions
- **域名/DNS**: Cloudflare Free (可选)

### 开发工具
- **包管理**: pnpm
- **构建**: Turbo (Monorepo)
- **代码质量**: ESLint, Prettier
- **测试**: Jest (可选)
- **版本控制**: Git + GitHub

---

## 📦 主要依赖

### 核心依赖 (必需)

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "typescript": "^5.0.0",
    "@supabase/supabase-js": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "tailwindcss": "^3.0.0",
    "turbo": "^2.0.0"
  }
}
```

### 可选依赖 (推荐)

```json
{
  "dependencies": {
    "@upstash/redis": "^1.0.0",
    "fast-xml-parser": "^4.0.0",
    "date-fns": "^2.0.0",
    "axios": "^1.0.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

---

## 🔧 环境变量清单

### 必需变量
```bash
# AI 模型配置
GEMINI_API_KEY=           # 必需：Google Gemini API Key
AI_PROVIDER=gemini        # 可选：AI 提供商 (gemini|deepseek|openai)
AI_MODEL=gemini-pro       # 可选：AI 模型名称

# 数据库配置
SUPABASE_URL=             # 必需：Supabase 项目 URL
SUPABASE_SERVICE_ROLE_KEY=  # 必需：Supabase Service Role Key
SUPABASE_ANON_KEY=        # 可选：Supabase 公开 Key

# 应用配置
NEXT_PUBLIC_API_URL=http://localhost:3000  # API 基础 URL
NODE_ENV=development      # 环境 (development|production)
```

### 可选变量
```bash
# 缓存配置
UPSTASH_REDIS_REST_URL=   # Upstash Redis URL
UPSTASH_REDIS_REST_TOKEN= # Upstash Redis Token

# GitHub 配置
GITHUB_TOKEN=             # GitHub Personal Token
GITHUB_REPO_OWNER=        # GitHub 仓库所有者
GITHUB_REPO_NAME=         # GitHub 仓库名称

# 任务配置
DAILY_PUBLISH_TIME=09:00  # 每日发布时间
DAILY_ARTICLE_COUNT=10    # 每日文章数量
MAX_SUMMARY_TOKENS=300    # 摘要最大 tokens
PUBLISH_TO_GITHUB=true    # 是否发布到 GitHub Pages

# 日志配置
LOG_LEVEL=info            # 日志级别 (debug|info|warn|error)
```

---

## 🏗️ 项目构建配置

### package.json 脚本
```json
{
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "start": "turbo run start",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "format": "turbo run format",
    "fetch:daily": "node apps/scheduler/daily.ts",
    "db:init": "bash scripts/init-db.sh",
    "db:migrate": "supabase migration up"
  }
}
```

### TypeScript 配置
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## 📊 文件大小估计

### 代码大小
- 总代码: ~5-10 MB (未压缩)
- 构建输出: ~2-3 MB (优化后)
- Next.js 优化: ~1 MB (CSS-in-JS 后)

### 数据库
- 初始数据: < 1 MB
- 月均增长: 10-50 MB
- 免费额度: 500 MB (Supabase)

### 部署
- Vercel 函数: < 100 MB
- GitHub Pages: 动态生成，无固定大小
- CDN 缓存: 10-50 MB (首月)

---

## 🔐 安全配置清单

### GitHub Secrets 设置
- ✅ 不要在代码中硬编码密钥
- ✅ 使用 GitHub Secrets 存储敏感信息
- ✅ 定期轮换 API Keys
- ✅ 使用 Service Role Key (不是 Anon Key)

### API 权限最小化
- Supabase: 使用 Row Level Security (RLS)
- Gemini: 限制 API Key 的权限范围
- GitHub: 使用最小权限 token

### HTTPS 和数据加密
- ✅ 所有通信使用 HTTPS
- ✅ 敏感数据加密存储
- ✅ 定期更新依赖和补丁

---

## 📈 性能优化

### 前端优化
- 使用 Next.js Image 优化
- Code splitting 和 lazy loading
- CSS 精简和压缩
- 浏览器缓存策略

### 后端优化
- Redis 缓存 RSS 结果
- 数据库查询优化和索引
- API 响应缓存
- 批量操作减少往返

### 网络优化
- CDN 加速 (Vercel/Cloudflare)
- 请求去重
- 响应压缩 (gzip)
- 静态资源预加载

---

## 🧪 测试策略

### 单元测试
```typescript
// 测试 RSS 采集
describe('RSS Fetcher', () => {
  it('should fetch and parse RSS', async () => {
    const items = await fetchRSSFeed(RSS_URL);
    expect(items.length).toBeGreaterThan(0);
  });
});

// 测试数据处理
describe('Processors', () => {
  it('should deduplicate articles', () => {
    const result = deduplicateArticles(articles);
    expect(result.length).toBeLessThanOrEqual(articles.length);
  });
});
```

### 集成测试
```typescript
// 测试完整流程
describe('Daily Workflow', () => {
  it('should complete daily task', async () => {
    const result = await dailyJob();
    expect(result.status).toBe('success');
  });
});
```

### 端到端测试
- 使用 Playwright 或 Cypress
- 测试用户交互流程
- 验证前后端集成

---

## 📚 部署检查清单

### 部署前
- [ ] 所有环境变量配置
- [ ] 数据库表结构创建
- [ ] API 端点测试
- [ ] 前端构建成功
- [ ] 没有 TypeScript 错误

### 部署时
- [ ] GitHub Secrets 已添加
- [ ] Vercel 连接 GitHub
- [ ] GitHub Actions 已启用
- [ ] GitHub Pages 已配置

### 部署后
- [ ] 监控错误日志
- [ ] 验证定时任务
- [ ] 测试完整工作流
- [ ] 验证 GitHub Pages 可访问

---

## 🔍 监控指标

### 应用健康
```bash
# 健康检查端点
curl https://your-app/api/health

# 返回指标
{
  "status": "ok",
  "uptime": 86400,
  "memory": "50MB",
  "lastSync": "2024-11-11T09:00:00Z"
}
```

### 数据库健康
- 查询响应时间 < 100ms
- 连接池使用率 < 80%
- 存储使用率 < 80%

### API 配额
- Gemini: < 50000 tokens/天
- GitHub Actions: < 100 分钟/天
- Vercel: < 10GB 流量/天

---

## 🚀 CI/CD 配置

### GitHub Actions Workflow
```yaml
# 定时触发 (每天 09:00 UTC+8)
schedule:
  - cron: '0 1 * * *'

# 步骤
jobs:
  1. Checkout 代码
  2. 设置 Node.js
  3. 安装依赖
  4. 构建项目
  5. 运行采集任务
  6. 生成静态网站
  7. 发布到 GitHub Pages
```

### Vercel 部署
```bash
# 自动部署配置
Production: main 分支
Preview: pull requests
Environments: 自动检测环境变量
```

---

## 📖 代码示例

### API 调用示例
```typescript
// 获取 RSS 源
const sources = await fetch('/api/sources')
  .then(r => r.json());

// 添加新源
const newSource = await fetch('/api/sources', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Example RSS',
    url: 'https://example.com/rss'
  })
}).then(r => r.json());
```

### 数据库查询示例
```typescript
// 获取今天的文章
const articles = await getArticles(
  new Date(Date.now() - 86400000),
  new Date()
);

// 创建日报
const report = await createDailyReport(
  new Date(),
  articleIds
);
```

### AI 调用示例
```typescript
// 使用 Gemini 摘要
const client = createAIClient({
  provider: 'gemini',
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-pro'
});

const result = await client.summarize({
  text: articleContent,
  maxLength: 300
});
```

---

## 💡 最佳实践

### 代码组织
- ✅ 按功能组织代码
- ✅ 使用 TypeScript 类型
- ✅ 编写清晰的注释
- ✅ 避免硬编码数据

### 性能
- ✅ 使用异步操作
- ✅ 实现缓存机制
- ✅ 优化数据库查询
- ✅ 批量处理数据

### 安全
- ✅ 验证输入数据
- ✅ 使用环境变量
- ✅ 定期更新依赖
- ✅ 启用 CORS 限制

### 可维护性
- ✅ 编写可测试的代码
- ✅ 使用日志记录
- ✅ 文档化 API
- ✅ 版本控制

---

*最后更新: 2024-11-11*
