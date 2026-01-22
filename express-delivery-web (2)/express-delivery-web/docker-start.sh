#!/bin/bash

echo "===================================="
echo "快递服务系统 Docker 一键启动"
echo "===================================="
echo ""

# 检查是否存在 .env 文件
if [ ! -f .env ]; then
    echo "[提示] 未找到 .env 文件，正在从 env.example 创建..."
    cp env.example .env
    echo "[提示] 请编辑 .env 文件配置相关参数"
    echo ""
    read -p "按回车键继续..."
fi

# 检查证书目录
if [ ! -d "1738582376_20260121_cert" ]; then
    echo "[警告] 证书目录不存在: 1738582376_20260121_cert"
    echo "[提示] 请确保证书文件已放置在正确位置"
    echo ""
fi

# 检查 Docker 是否运行
echo "[检查] 正在检查 Docker 状态..."
if ! docker info > /dev/null 2>&1; then
    echo "[错误] Docker 未运行或无法连接"
    echo "[提示] 请确保 Docker 服务已启动"
    exit 1
fi
echo "[成功] Docker 运行正常"
echo ""

# 启动 Docker Compose
echo "[信息] 正在启动 Docker 服务..."
docker compose up -d --build

if [ $? -eq 0 ]; then
    echo ""
    echo "===================================="
    echo "启动成功！"
    echo "===================================="
    echo "前端地址: http://localhost:3002"
    echo "后端地址: http://localhost:3001"
    echo ""
    echo "查看日志: docker compose logs -f"
    echo "停止服务: docker compose down"
    echo "===================================="
else
    echo ""
    echo "[错误] 启动失败，请检查 Docker 是否正常运行"
    echo ""
fi
