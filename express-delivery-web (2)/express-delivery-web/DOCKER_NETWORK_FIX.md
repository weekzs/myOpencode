# Docker 网络连接问题解决方案

## 问题描述

如果遇到以下错误：

**错误 1: TLS 握手超时**
```
failed to fetch oauth token: Post "https://auth.docker.io/token": net/http: TLS handshake timeout
```

**错误 2: EOF 连接中断（镜像源问题）**
```
failed to resolve source metadata for docker.io/library/node:20-alpine: 
failed to do request: Head "https://docker.mirrors.ustc.edu.cn/...": EOF
```

这通常是由于网络连接问题导致的，特别是在中国大陆地区访问 Docker Hub 可能会很慢或失败。EOF 错误通常表示镜像源连接中断。

## 解决方案

### 方案 1: 配置 Docker 镜像加速器（推荐）

#### Windows (Docker Desktop)

1. 打开 Docker Desktop
2. 点击右上角的设置图标（齿轮）
3. 进入 **Docker Engine** 设置
4. 在 JSON 配置中添加以下内容：

```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
```

5. 点击 **Apply & Restart** 重启 Docker

#### 常用国内镜像源

如果某个镜像源连接失败（EOF 错误），可以尝试其他镜像源：

**方案 A - 中科大镜像（推荐）**
```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
```

**方案 B - 网易镜像**
```json
{
  "registry-mirrors": [
    "https://hub-mirror.c.163.com"
  ]
}
```

**方案 C - 百度云镜像**
```json
{
  "registry-mirrors": [
    "https://mirror.baidubce.com"
  ]
}
```

**方案 D - 多个镜像源（推荐，自动切换）**
```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
```

**方案 E - 阿里云镜像（需要登录获取）**
1. 访问 https://cr.console.aliyun.com/
2. 登录后获取专属加速地址
3. 添加到配置中

**如果所有镜像源都失败，可以尝试：**
- 使用代理
- 手动拉取镜像（见下方）
- 稍后重试（可能是临时网络问题）

### 方案 2: 使用代理

如果你有可用的代理：

1. 打开 Docker Desktop 设置
2. 进入 **Resources** > **Proxies**
3. 配置代理设置

### 方案 3: 手动拉取镜像

如果镜像加速器配置后仍有问题（如 EOF 错误），可以尝试手动拉取镜像：

**Windows:**
```bash
# 运行提供的脚本
pull-images.bat
```

**Linux/Mac:**
```bash
# 拉取 Node.js 镜像
docker pull node:20-alpine

# 拉取 MySQL 镜像
docker pull mysql:8.0
```

**如果手动拉取也失败，可以尝试：**
1. 更换镜像源（见上方方案 A-E）
2. 使用代理
3. 稍后重试（可能是临时网络问题）
4. 检查防火墙设置

### 方案 4: 检查网络连接

1. 检查网络连接是否正常
2. 尝试访问 https://auth.docker.io 看是否能正常访问
3. 检查防火墙设置
4. 检查公司网络是否有限制

### 方案 5: 使用本地构建（如果镜像已存在）

如果之前已经成功拉取过镜像，可以尝试：

```bash
# 查看本地镜像
docker images

# 如果镜像存在，直接构建
docker compose build --no-cache
```

## 验证配置

配置完成后，运行以下命令验证：

```bash
docker info | grep -A 10 "Registry Mirrors"
```

应该能看到配置的镜像源。

## 重新构建

配置完成后，重新运行：

```bash
docker-start.bat
```

或

```bash
docker compose up -d --build
```
