# 500 内部服务器错误调试指南

## 🔍 错误信息

```
服务器返回非JSON响应: 500 Internal Server Error
POST http://localhost:3002/api/orders
```

## ✅ 已修复的问题

### 1. **数据验证和类型转换**
- ✅ 确保所有必需字段都有值
- ✅ 改进了价格计算，确保返回有效的数字
- ✅ 处理了可选字段（pickupCode, deliveryLat, deliveryLng, remarks）

### 2. **错误处理改进**
- ✅ 添加了详细的错误日志
- ✅ 改进了错误信息返回
- ✅ 在开发环境下返回错误堆栈

## 🔧 调试步骤

### 步骤1：查看后端控制台日志

**后端应该输出以下日志：**
```
收到创建订单请求: { body: {...}, user: {...} }
开始创建订单，用户ID: "...", 订单数据: {...}
开始创建订单，参数: { userId: "...", orderData: {...} }
获取快递站信息，ID: "..."
快递站信息: {...}
价格计算结果: {...}
准备创建的订单数据: {...}
```

**如果看到错误：**
- 查看完整的错误堆栈
- 注意错误代码（如 P2002, P2003 等）
- 查看错误消息

### 步骤2：检查数据库连接

**确认数据库配置：**
1. 检查 `backend/.env` 文件中的 `DATABASE_URL`
2. 确认数据库服务正在运行
3. 测试数据库连接：
```bash
cd backend
npm run db:studio
```

### 步骤3：检查数据库表结构

**确认表已创建：**
```bash
cd backend
npx prisma db push
```

**或者运行迁移：**
```bash
cd backend
npm run db:migrate
```

### 步骤4：检查快递站数据

**确认有快递站数据：**
```bash
cd backend
npm run db:seed
```

**或者手动检查：**
- 打开 Prisma Studio: `npm run db:studio`
- 查看 `delivery_stations` 表
- 确认有至少一条记录

### 步骤5：检查提交的数据

**在浏览器控制台查看：**
```javascript
// 查看提交的数据
console.log('提交订单数据:', submitData);
```

**确认数据格式：**
```javascript
{
  deliveryStationId: "xxx",  // 必须是有效的快递站ID
  recipientName: "xxx",
  recipientPhone: "xxx",
  deliveryAddress: "xxx",
  serviceType: "STANDARD" | "EXPRESS" | "PREMIUM",
  isUrgent: true | false,
  deliveryLat: number (可选),
  deliveryLng: number (可选),
  pickupCode: string (可选),
  remarks: string (可选)
}
```

## 🐛 常见错误原因

### 1. **数据库连接失败**
**错误信息：** `Can't reach database server`
**解决方法：**
- 检查数据库服务是否运行
- 检查 `DATABASE_URL` 配置
- 检查网络连接

### 2. **表不存在**
**错误信息：** `Table 'xxx' doesn't exist`
**解决方法：**
```bash
cd backend
npx prisma db push
```

### 3. **外键约束失败**
**错误信息：** `Foreign key constraint failed`
**可能原因：**
- `deliveryStationId` 不存在
- `userId` 不存在
**解决方法：**
- 确认快递站ID有效
- 确认用户已登录且ID有效

### 4. **数据类型不匹配**
**错误信息：** `Incorrect type`
**可能原因：**
- 字段类型不匹配（如字符串传给数字字段）
- 必需字段为 null
**解决方法：**
- 检查提交的数据类型
- 确认所有必需字段都有值

### 5. **Prisma Client 未生成**
**错误信息：** `PrismaClient is not configured`
**解决方法：**
```bash
cd backend
npm run db:generate
```

## 📋 检查清单

提交订单前，确认：

- [ ] 后端服务正在运行（端口 3001）
- [ ] 数据库服务正在运行
- [ ] 数据库表已创建（运行 `npx prisma db push`）
- [ ] 有快递站数据（运行 `npm run db:seed`）
- [ ] 用户已登录（localStorage 中有 token）
- [ ] 提交的数据格式正确
- [ ] 快递站ID有效（存在于数据库中）

## 🚀 快速修复命令

```bash
# 1. 进入后端目录
cd backend

# 2. 生成 Prisma Client
npm run db:generate

# 3. 推送数据库结构
npx prisma db push

# 4. 填充测试数据
npm run db:seed

# 5. 重启后端服务
npm run dev
```

## 📝 查看详细错误

**在后端控制台查看：**
- 完整的错误堆栈
- 错误代码（Prisma错误代码）
- 错误消息

**常见Prisma错误代码：**
- `P2002`: 唯一约束冲突
- `P2003`: 外键约束失败
- `P2014`: 必需字段缺失
- `P2025`: 记录不存在

## 🆘 如果问题仍然存在

1. **查看后端控制台的完整错误信息**
2. **检查数据库连接**
3. **确认数据库表结构正确**
4. **提供以下信息以便进一步调试：**
   - 后端控制台的完整错误堆栈
   - 提交的订单数据（隐藏敏感信息）
   - 数据库配置（隐藏密码）
