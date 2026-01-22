@echo off
echo ====================================
echo 手动拉取 Docker 镜像
echo ====================================
echo.
echo [提示] 如果镜像加速器配置失败，可以尝试手动拉取镜像
echo.

REM 检查 Docker 是否运行
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] Docker 未运行
    pause
    exit /b 1
)

echo [信息] 正在拉取 Node.js 镜像...
docker pull node:20-alpine
if %errorlevel% neq 0 (
    echo [警告] Node.js 镜像拉取失败，请检查网络连接
) else (
    echo [成功] Node.js 镜像拉取成功
)

echo.
echo [信息] 正在拉取 MySQL 镜像...
docker pull mysql:8.0
if %errorlevel% neq 0 (
    echo [警告] MySQL 镜像拉取失败，请检查网络连接
) else (
    echo [成功] MySQL 镜像拉取成功
)

echo.
echo ====================================
echo 镜像拉取完成
echo ====================================
echo.
echo 如果镜像拉取成功，可以运行: docker-start.bat
echo.

pause
