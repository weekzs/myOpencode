@echo off
chcp 65001 >nul
echo ========================================
echo   快递服务系统 - Windows 启动脚本
echo ========================================
echo.

echo [0/2] 清理占用端口的进程...
echo 正在清理端口 3000 和 3001...

REM Kill processes using port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo 关闭占用端口 3000 的进程: %%a
    taskkill /f /pid %%a >nul 2>&1
)

REM Kill processes using port 3001
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    echo 关闭占用端口 3001 的进程: %%a
    taskkill /f /pid %%a >nul 2>&1
)

REM Terminate all node.exe processes
for /f "tokens=2" %%i in ('tasklist ^| findstr node.exe') do (
    echo 关闭 Node.js 进程: %%i
    taskkill /f /pid %%i >nul 2>&1
)

timeout /t 3 /nobreak >nul

echo [1/2] 启动后端服务...
start "后端服务" cmd /k "cd /d %~dp0backend && start-backend.bat"

timeout /t 3 /nobreak >nul

echo [2/2] 启动前端服务...
start "前端服务" cmd /k "cd /d %~dp0frontend && start-frontend.bat"

echo.
echo ========================================
echo   服务启动完成！
echo ========================================
echo 前端地址: http://localhost:3001
echo 后端API: http://localhost:3000
echo.
echo 按任意键关闭此窗口...
pause >nul
