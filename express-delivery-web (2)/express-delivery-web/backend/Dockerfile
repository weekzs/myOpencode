# 后端 Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./
COPY prisma ./prisma/

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 生成 Prisma Client
# 注意：prisma generate 不需要真实的数据库连接，只需要 schema 文件
# 设置一个占位符 DATABASE_URL 以满足 prisma.config.ts 的要求
ENV DATABASE_URL="mysql://user:password@localhost:3306/database"
RUN npx prisma generate

# 构建 TypeScript
RUN npm run build

# 生产环境镜像
FROM node:20-alpine

WORKDIR /app

# 复制 package 文件
COPY package*.json ./
COPY prisma ./prisma/

# 只安装生产依赖
RUN npm ci --only=production

# 从构建阶段复制构建产物
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# 注意：证书目录需要在 docker-compose.yml 中通过 volume 挂载

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["npm", "start"]
