# Git 中文显示配置

## 已自动配置的设置

以下 Git 配置已经设置好，确保中文正确显示：

```bash
# 提交信息编码
git config --global i18n.commitencoding utf-8

# 日志输出编码
git config --global i18n.logoutputencoding utf-8

# 禁用路径引用（正确显示中文文件名）
git config --global core.quotepath false
```

## PowerShell 中查看中文的方法

如果在 PowerShell 中仍然看到乱码，请使用以下命令：

```powershell
# 设置控制台为 UTF-8
chcp 65001

# 查看日志（使用 --no-pager 避免分页器问题）
git --no-pager log --oneline -10
```

## 历史提交中的乱码说明

之前的提交信息已经保存在 Git 历史中，无法修改（除非重写历史）。但从现在开始，所有新的提交都会正确显示中文。

历史提交的实际内容：
- `fdf5335` - chore: 更新.gitignore和.env.example
- `b3b5dc4` - fix: 修复TypeScript ESLint错误，替换any类型为明确的接口定义
- `a1ed129` - feat: 升级Gemini模型到最新的gemini-2.5-flash
- `05954be` - feat: 升级Gemini API到官方推荐方式
- `5d38311` - docs: 添加Gemini API故障排查文档
- `902f1c5` - fix: 修复Gemini API 404错误并增强降级策略
- `36f0632` - feat: 优化历史日报展示界面，支持点击跳转到Hugo静态网站

## VS Code 终端推荐设置

在 VS Code 的 `settings.json` 中添加：

```json
{
  "terminal.integrated.defaultProfile.windows": "PowerShell",
  "terminal.integrated.profiles.windows": {
    "PowerShell": {
      "source": "PowerShell",
      "args": ["-NoExit", "-Command", "chcp 65001"]
    }
  }
}
```

这样每次打开终端都会自动使用 UTF-8 编码。
