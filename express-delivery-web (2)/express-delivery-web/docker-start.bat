@echo off
echo ====================================
echo 快递服务系统 Docker 一键启动
echo ====================================
echo.

REM 检查 Docker 是否运行
echo [检查] 正在检查 Docker 状态...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] Docker 未运行或无法连接
    echo [提示] 请确保 Docker Desktop 已启动
    echo [提示] 如果已安装 Docker Desktop，请启动它后重试
    echo.
    pause
    exit /b 1
)
echo [成功] Docker 运行正常
echo.

REM 检查是否存在 .env 文件
if not exist .env (
    echo [提示] 未找到 .env 文件，正在从 env.example 创建...
    copy env.example .env
    echo [提示] 请编辑 .env 文件配置相关参数
    echo.
    pause
)

REM 检查证书目录
if not exist "1738582376_20260121_cert" (
    echo [警告] 证书目录不存在: 1738582376_20260121_cert
    echo [提示] 请确保证书文件已放置在正确位置
    echo.
)

REM 启动 Docker Compose
echo [信息] 正在启动 Docker 服务...
docker compose up -d --build

if %errorlevel% equ 0 (
    echo.
    echo ====================================
    echo 启动成功！
    echo ====================================
    echo 前端地址: http://localhost:3002
    echo 后端地址: http://localhost:3001
    echo.
    echo 查看日志: docker compose logs -f
    echo 停止服务: docker compose down
    echo ====================================
) else (
    echo.
    echo [错误] 启动失败
    echo.
    echo [可能的原因]
    echo 1. 网络连接问题 - 无法从 Docker Hub 拉取镜像
    echo 2. Docker 镜像源连接中断（EOF 错误）
    echo 3. 镜像源暂时不可用
    echo.
    echo [快速解决方案]
    echo.
    echo 方案 1: 手动拉取镜像（推荐）
    echo    pull-images.bat
    echo    然后重新运行: docker-start.bat
    echo.
    echo 方案 2: 更换镜像源
    echo    - 打开 Docker Desktop
    echo    - 进入 Settings ^> Docker Engine
    echo    - 尝试其他镜像源（参考 DOCKER_NETWORK_FIX.md）
    echo    - 点击 Apply ^& Restart
    echo.
    echo 方案 3: 稍后重试
    echo    - 可能是临时网络问题
    echo    - 等待几分钟后重试
    echo.
    echo 详细解决方案请查看: DOCKER_NETWORK_FIX.md
    echo.
)

pause
