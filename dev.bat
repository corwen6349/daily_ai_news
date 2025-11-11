@echo off
REM AI 新闻聚合平台 - 启动脚本

echo.
echo ========================================
echo AI 新闻聚合与生成平台
echo ========================================
echo.

REM 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org
    pause
    exit /b 1
)

echo ✓ 检测到 Node.js: 
node --version

REM 检查依赖是否已安装
if not exist "node_modules" (
    echo.
    echo 📦 安装依赖中...
    call npm install
    if errorlevel 1 (
        echo ❌ 安装失败
        pause
        exit /b 1
    )
    echo ✓ 依赖安装完成
) else (
    echo ✓ 依赖已安装
)

REM 启动开发服务器
echo.
echo 🚀 启动开发服务器...
echo.
echo 访问地址: http://localhost:3000
echo 按 Ctrl+C 停止服务
echo.

call npm run dev

pause
