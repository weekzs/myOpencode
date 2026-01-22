# 后端服务启动指南

## 🚨 问题：ECONNREFUSED

**错误信息：**
```
Failed to proxy http://localhost:3001/api/stations
ECONNREFUSED
```

**原因：** 后端服务没有运行或无法连接

## ✅ 解决步骤

### 步骤1：检查后端服务是否运行

**查看后端服务状态：**
- 后端应该在端口 3001 运行
- 检查是否有进程在运行

### 步骤2：启动后端服务

**在 `backend` 目录下运行：**
```bash
cd backend
npm run dev
```

**应该看到：**
```
🚀 服务器运行在端口 3001
```

### 步骤3：检查数据库连接

**确认数据库配置：**
1. 检查 `backend/.env` 文件
2. 确认 `DATABASE_URL` 配置正确
3. 确认数据库服务正在运行

### 步骤4：初始化数据库（如果需要）

```bash
cd backend

# 生成 Prisma Client
npm run db:generate

# 推送数据库结构
npx prisma db push

# 填充测试数据
npm run db:seed
```

## 🔧 常见问题

### Q1: 端口被占用

**错误：** `Port 3001 is already in use`

**解决方法：**
1. 查找占用端口的进程：
```bash
# Windows
netstat -ano | findstr :3001

# 或者使用任务管理器结束进程
```

2. 或者修改端口（在 `backend/.env` 中）：
```env
PORT=3002
```

### Q2: 数据库连接失败

**错误：** `Can't reach database server`

**解决方法：**
1. 检查数据库服务是否运行
2. 检查 `DATABASE_URL` 配置
3. 测试数据库连接

### Q3: Prisma Client 未生成

**错误：** `PrismaClient is not configured`

**解决方法：**
```bash
cd backend
npm run db:generate
```

## 📋 启动检查清单

启动后端前，确认：

- [ ] 已进入 `backend` 目录
- [ ] 已安装依赖（`npm install`）
- [ ] 数据库服务正在运行
- [ ] `.env` 文件配置正确
- [ ] Prisma Client 已生成
- [ ] 数据库表已创建

## 🚀 完整启动流程

```bash
# 1. 进入后端目录
cd backend

# 2. 安装依赖（如果还没安装）
npm install

# 3. 生成 Prisma Client
npm run db:generate

# 4. 推送数据库结构
npx prisma db push

# 5. 填充测试数据（可选）
npm run db:seed

# 6. 启动服务
npm run dev
```

## 📝 验证服务运行

**检查后端服务：**
1. 打开浏览器访问：`http://localhost:3001/health`
2. 应该看到：`{"status":"ok","timestamp":"..."}`

**检查快递站API：**
1. 访问：`http://localhost:3001/api/stations`
2. 应该返回快递站列表

## 🆘 如果问题仍然存在

1. **查看后端控制台错误信息**
2. **检查数据库连接**
3. **确认端口没有被占用**
4. **检查防火墙设置**
