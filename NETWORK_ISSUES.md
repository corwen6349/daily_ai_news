# 网络连接问题解决方案

## 问题描述

如果您在中国大陆使用，可能会遇到 Gemini API 连接超时的问题：

```
fetch failed
ConnectTimeoutError: Connect Timeout Error
```

## 解决方案

### 方案 1：使用代理（推荐）

如果您有代理服务器，可以配置 Node.js 使用代理：

#### Windows (PowerShell)

```powershell
# 设置 HTTP 代理
$env:HTTP_PROXY="http://127.0.0.1:7890"
$env:HTTPS_PROXY="http://127.0.0.1:7890"

# 然后启动开发服务器
cd apps\web
npm run dev
```

#### Windows (CMD)

```cmd
set HTTP_PROXY=http://127.0.0.1:7890
set HTTPS_PROXY=http://127.0.0.1:7890
cd apps\web
npm run dev
```

#### Linux/macOS

```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
cd apps/web
npm run dev
```

**注意**：将 `127.0.0.1:7890` 替换为您实际的代理地址和端口。

### 方案 2：使用 DeepSeek API（国内可访问）

DeepSeek 是国内的 AI 服务，网络连接更稳定：

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/)
2. 注册并获取 API Key
3. 在 `.env` 文件中添加：

```bash
# 使用 DeepSeek 替代 Gemini
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

### 方案 3：只生成不发布

如果只想本地使用，不需要 AI 摘要，可以修改代码跳过摘要生成：

在 `apps/web/pages/api/generate-report.ts` 中，将：
```typescript
const enrichedArticles = await enrichArticles(selectedArticles);
```

改为：
```typescript
const enrichedArticles = selectedArticles; // 跳过 AI 摘要
```

### 方案 4：使用 Vercel 部署（自动解决）

将项目部署到 Vercel 后，服务器在海外，可以直接访问 Gemini API，无需代理。

## 代码优化

已经将 API 超时时间从 10 秒增加到 30 秒，增加成功率。

## 测试连接

测试 Gemini API 是否可访问：

```bash
# 在浏览器中访问
http://localhost:3000/api/test-gemini

# 或使用 curl
curl http://localhost:3000/api/test-gemini
```

## 常见代理软件端口

- **Clash**: `http://127.0.0.1:7890`
- **V2rayN**: `http://127.0.0.1:10809`
- **Shadowsocks**: `http://127.0.0.1:1080`
- **其他**: 请查看您的代理软件设置

## 推荐配置

如果您经常需要开发，建议：

1. 使用稳定的代理服务
2. 或使用 DeepSeek API（国内访问快）
3. 部署到 Vercel 用于生产环境

---

**更新时间**: 2025-11-13
