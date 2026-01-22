# 前端 Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 设置构建时的环境变量（如果需要）
# Next.js 构建时可能需要这些变量
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_AMAP_KEY
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:3001}
ENV NEXT_PUBLIC_AMAP_KEY=${NEXT_PUBLIC_AMAP_KEY:-}

# 设置字体加载超时（毫秒），如果无法访问 Google Fonts 会增加等待时间
ENV NEXT_FONT_LOAD_TIMEOUT=60000

# 构建 Next.js 应用
# 如果 Google Fonts 无法访问，会使用配置的回退字体（system-ui 等）
RUN npm run build

# 生产环境镜像
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# 复制 package 文件
COPY package*.json ./

# 只安装生产依赖
RUN npm ci --only=production

# 从构建阶段复制构建产物
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# 暴露端口
EXPOSE 3002

# 启动命令
CMD ["npm", "start"]
