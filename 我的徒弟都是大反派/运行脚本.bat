@echo off
chcp 65001 >nul
echo ========================================
echo 漫画爬虫脚本 - 运行工具
echo ========================================
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未找到Python，请先安装Python
    pause
    exit /b 1
)

echo [1] 检查依赖包...
python -c "import requests; import bs4" >nul 2>&1
if errorlevel 1 (
    echo [提示] 正在安装依赖包...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [错误] 依赖包安装失败
        pause
        exit /b 1
    )
) else (
    echo [成功] 依赖包已安装
)

echo.
echo [2] 开始运行爬虫脚本...
echo.
python example_usage.py

echo.
echo ========================================
echo 脚本执行完成
echo ========================================
pause
