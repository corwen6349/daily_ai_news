# Gemini API 集成指南

## 🆕 已更新到官方推荐方式

根据 [Google AI Studio 官方文档](https://ai.google.dev/gemini-api/docs/quickstart?hl=zh-cn)，已使用最新的 Gemini API 规范。

## 🎯 支持的模型

系统会按优先级自动尝试以下模型：

1. **gemini-2.5-flash** ⭐ - 最新、最快的模型 (2025-11)
   - 官方首推，性价比极高
   - 适合大规模、低延迟任务

2. **gemini-2.0-flash-exp** - 实验版
   - 包含最新功能
   - 速度快

3. **gemini-1.5-flash** - 稳定版
   - 经过充分测试
   - 生产环境推荐

4. **gemini-1.5-flash-latest** - 最新稳定版
   - 持续更新
   - 平衡性能和稳定性

5. **gemini-1.5-pro** - 高级版本
   - 更强推理能力
   - 适合复杂任务
   - 成本较高

## 🔧 修复内容

### 1. 使用官方推荐的模型
- 主要使用 **gemini-2.5-flash**（最新、最快的模型），并自动降级到其他稳定版本。
- 完全符合官方 REST API 规范。

### 2. 多模型自动切换
- 按优先级尝试 5 个不同的 Gemini 模型，确保最佳性能和可用性：
  `gemini-2.5-flash` → `gemini-2.0-flash-exp` → `gemini-1.5-flash` → `gemini-1.5-flash-latest` → `gemini-1.5-pro`

### 3. 三层降级策略
- 即使在极端情况下，也能保证服务不中断：
  ```
   Gemini API (5个模型自动切换)
       ↓ 失败
  DeepSeek API (如果配置)
       ↓ 失败
  智能文本截取 (提取原文摘要)
  ```

### 4. 增强的错误处理和日志
- **详细日志**：记录每次 API 调用的模型、状态和错误信息，方便快速排查。
- **智能错误处理**：能识别并处理安全阻止、空返回等多种异常情况。

## 🧪 测试 API 配置

部署后访问测试接口：
```
https://your-domain.vercel.app/api/test-gemini
```

或使用 POST 方法测试自定义内容：
```bash
curl -X POST https://your-domain.vercel.app/api/test-gemini \
  -H "Content-Type: application/json" \
  -d '{"content": "测试文本内容"}'
```

## 📋 响应示例

### 成功响应
```json
{
  "message": "✅ Gemini API 配置正常",
  "apiKeyConfigured": true,
  "apiKeyPrefix": "AIzaSyB3x...",
  "results": [
    {
      "endpoint": "v1/gemini-1.5-flash",
      "status": 200,
      "success": true,
      "summary": "这是AI生成的摘要"
    }
  ],
  "recommendation": "建议使用: v1/gemini-1.5-flash"
}
```

### 失败响应
```json
{
  "message": "❌ 所有 Gemini API 端点都失败",
  "apiKeyConfigured": true,
  "apiKeyPrefix": "AIzaSyB3x...",
  "results": [
    {
      "endpoint": "v1/gemini-1.5-flash",
      "status": 404,
      "success": false,
      "error": "模型不存在或API Key无效"
    }
  ],
  "recommendation": "请检查 API Key 是否有效"
}
```

## 🔑 获取新的 Gemini API Key

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 点击 "Create API Key"
3. 选择或创建 Google Cloud 项目
4. 复制生成的 API Key
5. 在 Vercel 项目设置中更新 `GEMINI_API_KEY` 环境变量

## ⚙️ Vercel 环境变量配置

确保在 Vercel 项目中配置了以下环境变量：

```bash
# 必需
GEMINI_API_KEY=AIzaSy...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=eyJ...

# 可选 (用于降级)
DEEPSEEK_API_KEY=sk-...

# Hugo 发布相关
GITHUB_TOKEN=ghp_...
GITHUB_REPO=username/repo-name
GITHUB_BRANCH=master  # 可选，默认自动检测
```

## 🚀 部署后操作

1. **测试 API 连接**
   ```
   访问: https://your-domain.vercel.app/api/test-gemini
   ```

2. **查看部署日志**
   - 在 Vercel Dashboard 中查看函数日志
   - 搜索 "Gemini API" 关键词
   - 检查是否有 API 调用成功

3. **测试日报生成**
   - 在前端抓取资讯
   - 选择几篇文章
   - 点击"生成日报"
   - 观察控制台日志

## 🐛 常见问题

### Q: 仍然返回 404 错误
**A:** 可能原因：
1. API Key 无效或过期 → 重新生成
2. Google Cloud 项目没有启用 Generative AI API → 在控制台启用
3. API Key 配额用尽 → 检查 Google Cloud 配额

### Q: 所有端点都失败
**A:** 系统会自动降级：
1. 首先尝试 DeepSeek（如果配置了 API Key）
2. 最后使用智能文本截取（提取原文前几句话）

### Q: 摘要质量不佳
**A:** 优化建议：
1. 确保 RSS 源返回完整文章内容
2. 调整 prompt 提示词（在 `packages/ai/src/providers/gemini.ts`）
3. 增加 `maxOutputTokens` 参数

## 📊 监控和优化

### 日志关键词
```
✅ Gemini 总结成功     # API 调用成功
尝试 Gemini API       # 正在尝试端点
AI 总结失败           # 触发降级策略
使用降级摘要          # 使用文本截取
```

### 性能优化
- 批量处理文章可能较慢（每篇文章独立调用 API）
- 考虑实现批量总结接口
- 添加缓存机制避免重复总结

## 🔗 相关链接

- [Google AI Studio](https://makersuite.google.com/)
- [Gemini API 文档](https://ai.google.dev/docs)
- [Vercel 环境变量](https://vercel.com/docs/environment-variables)
- [Supabase 控制台](https://supabase.com/dashboard)

---

**更新时间**: 2025-11-13  
**版本**: v1.0.0
