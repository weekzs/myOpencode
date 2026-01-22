# Docker 一键部署指南

## 前置要求

1. 安装 Docker 和 Docker Compose
   - Docker: https://docs.docker.com/get-docker/
   - Docker Compose: 通常随 Docker Desktop 一起安装

2. 准备微信支付证书文件
   - 将 `apiclient_key.pem` 和 `apiclient_cert.pem` 放置在 `1738582376_20260121_cert` 目录中

## 快速开始

### 1. 配置环境变量

复制环境变量示例文件并修改：

```bash
cp env.example .env
```

编辑 `.env` 文件，配置以下关键信息：

```env
# 数据库配置（建议修改默认密码）
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_PASSWORD=your_secure_password

# 微信支付配置
WECHAT_APP_ID=你的微信小程序/公众号AppID
WECHAT_SERIAL_NO=你的证书序列号

# 高德地图配置
NEXT_PUBLIC_AMAP_KEY=你的高德地图API Key

# JWT密钥（生产环境必须修改）
JWT_SECRET=your-secure-jwt-secret-key
```

### 2. 准备证书文件

确保 `1738582376_20260121_cert` 目录中包含：
- `apiclient_key.pem` - 私钥文件
- `apiclient_cert.pem` - 证书文件
- `32字符串.txt` - 密钥文件（已包含）

### 3. 一键启动

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### 4. 访问服务

- 前端: http://localhost:3002
- 后端API: http://localhost:3001
- 健康检查: http://localhost:3001/health

## 常用命令

### 停止服务
```bash
docker-compose down
```

### 停止并删除数据卷（注意：会删除数据库数据）
```bash
docker-compose down -v
```

### 重新构建镜像
```bash
docker-compose build --no-cache
docker-compose up -d
```

### 查看运行状态
```bash
docker-compose ps
```

### 进入容器
```bash
# 进入后端容器
docker-compose exec backend sh

# 进入数据库容器
docker-compose exec mysql mysql -u express_user -p express_delivery
```

### 数据库迁移
```bash
# 进入后端容器执行迁移
docker-compose exec backend npx prisma db push
```

## 生产环境部署

### 1. 修改端口映射

编辑 `docker-compose.yml`，修改端口映射：

```yaml
services:
  backend:
    ports:
      - "3001:3001"  # 改为你的后端端口
  frontend:
    ports:
      - "3002:3002"  # 改为你的前端端口
  mysql:
    ports:
      - "3306:3306"  # 生产环境建议不暴露，或使用内网IP
```

### 2. 配置反向代理

建议使用 Nginx 作为反向代理：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端
    location / {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 后端API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. 配置HTTPS

使用 Let's Encrypt 或其他SSL证书配置HTTPS。

### 4. 修改微信支付回调URL

在 `.env` 文件中设置正确的回调URL：

```env
WECHAT_NOTIFY_URL=https://your-domain.com/api/payments/notify
```

## 故障排查

### 数据库连接失败

1. 检查 MySQL 容器是否正常运行：
   ```bash
   docker-compose ps mysql
   ```

2. 检查数据库连接字符串是否正确

3. 查看 MySQL 日志：
   ```bash
   docker-compose logs mysql
   ```

### 后端启动失败

1. 检查环境变量是否正确配置
2. 查看后端日志：
   ```bash
   docker-compose logs backend
   ```
3. 检查证书文件是否存在

### 前端无法连接后端

1. 检查 `NEXT_PUBLIC_API_URL` 环境变量
2. 确保后端服务正常运行
3. 检查网络连接和防火墙设置

## 数据备份

### 备份数据库

```bash
docker-compose exec mysql mysqldump -u express_user -p express_delivery > backup.sql
```

### 恢复数据库

```bash
docker-compose exec -T mysql mysql -u express_user -p express_delivery < backup.sql
```

## 更新应用

```bash
# 拉取最新代码
git pull

# 重新构建并启动
docker-compose build
docker-compose up -d

# 运行数据库迁移（如果需要）
docker-compose exec backend npx prisma db push
```
