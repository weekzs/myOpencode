# 快递服务系统

一个基于 Next.js + Express.js 的全栈快递代取服务应用。

## 🚀 功能特性

- ✅ 用户注册登录（JWT认证）
- ✅ 快递站选择和管理
- ✅ 订单创建和价格计算
- ✅ 订单状态跟踪
- ✅ 个人中心和统计
- ✅ 响应式设计
- ✅ 中文界面

## 🏗️ 技术栈

### 前端
- **Next.js 14** - React全栈框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 实用优先的CSS框架
- **React Hook Form** - 表单处理
- **TanStack Query** - 数据获取和缓存

### 后端
- **Node.js + Express.js** - 服务端框架
- **TypeScript** - 类型安全
- **Prisma** - ORM和数据库管理
- **MySQL** - 关系型数据库
- **JWT** - 用户认证
- **bcryptjs** - 密码加密

## 📁 项目结构

```
express-delivery-web/
├── frontend/                 # Next.js前端应用
│   ├── src/app/             # Next.js App Router页面
│   │   ├── auth/           # 认证页面（登录/注册）
│   │   ├── order/          # 订单创建页面
│   │   ├── orders/         # 订单列表页面
│   │   └── profile/        # 个人中心页面
│   ├── src/components/     # 可复用组件
│   ├── src/utils/          # 工具函数和API客户端
│   └── src/types/          # TypeScript类型定义
├── backend/                 # Express.js后端服务
│   ├── src/
│   │   ├── controllers/    # 路由处理器
│   │   ├── models/         # 数据模型（Prisma）
│   │   ├── routes/         # API路由
│   │   ├── middleware/     # 中间件
│   │   └── utils/          # 工具函数
│   ├── prisma/             # 数据库模式和种子数据
│   └── uploads/            # 文件上传目录
└── database/               # 数据库相关文件
```

## 🛠️ 安装和运行

### 环境要求
- Node.js 18+
- MySQL 8.0+
- npm 或 yarn

### 1. 克隆项目
```bash
git clone <repository-url>
cd express-delivery-web
```

### 2. 安装依赖

#### 后端
```bash
cd backend
npm install
```

#### 前端
```bash
cd ../frontend
npm install
```

### 3. 数据库设置

#### 配置环境变量
复制并编辑后端环境文件：
```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件：
```env
# 数据库配置
DATABASE_URL="mysql://root:123456@localhost:3306/express_delivery"

# JWT配置
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# 服务器配置
PORT=3001
NODE_ENV="development"
```

#### 初始化数据库
```bash
# 生成Prisma客户端
npm run db:generate

# 推送数据库模式
npm run db:push

# 运行种子数据
npm run db:seed
```

### 4. 启动服务

#### 启动后端服务
```bash
cd backend
npm run dev
```
后端服务将在 `http://localhost:3001` 启动

#### 启动前端服务
```bash
cd frontend
npm run dev
```
前端应用将在 `http://localhost:3000` 启动

## 🔗 API 接口

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户信息
- `PUT /api/auth/profile` - 更新用户信息

### 快递站相关
- `GET /api/stations` - 获取快递站列表
- `GET /api/stations/:id` - 获取快递站详情

### 订单相关（开发中）
- `GET /api/orders` - 获取订单列表
- `POST /api/orders` - 创建订单
- `GET /api/orders/:id` - 获取订单详情

## 📱 页面路由

- `/` - 首页
- `/auth/login` - 登录页面
- `/auth/register` - 注册页面
- `/order` - 创建订单页面
- `/orders` - 订单列表页面
- `/profile` - 个人中心页面

## 🔒 安全特性

- JWT token认证
- 密码bcrypt加密
- 请求频率限制
- CORS配置
- 输入验证

## 🚀 部署

### Docker 一键部署（推荐）

项目已支持 Docker 一键部署，使用 Docker Compose 管理所有服务。

#### 快速开始

1. **配置环境变量**
   ```bash
   cp env.example .env
   # 编辑 .env 文件，配置微信支付、高德地图等参数
   ```

2. **准备证书文件**
   将微信支付证书文件放置在 `1738582376_20260121_cert` 目录：
   - `apiclient_key.pem` - 私钥文件
   - `apiclient_cert.pem` - 证书文件

3. **一键启动**
   ```bash
   # Windows
   docker-start.bat
   
   # Linux/Mac
   chmod +x docker-start.sh
   ./docker-start.sh
   
   # 或直接使用 docker-compose
   docker-compose up -d
   ```

4. **访问服务**
   - 前端: http://localhost:3002
   - 后端API: http://localhost:3001

详细部署说明请查看 [DOCKER_DEPLOY.md](./DOCKER_DEPLOY.md)

### 开发环境部署
项目已配置为前后端分离，可以分别部署：

#### 前端部署
```bash
cd frontend
npm run build
npm start
```

#### 后端部署
```bash
cd backend
npm run build
npm start
```

### 生产环境建议
- 使用 Docker Compose 进行容器化部署（推荐）
- 或使用PM2管理Node.js进程
- 配置Nginx反向代理
- 设置SSL证书
- 配置数据库连接池
- 启用日志记录

## 📊 数据库模型

### 用户 (User)
- 基本信息：手机号、昵称、头像
- 时间戳：创建时间、更新时间

### 快递站 (DeliveryStation)
- 位置信息：名称、地址、经纬度
- 联系方式：电话
- 状态：是否激活

### 订单 (Order)
- 关联：用户ID、快递站ID
- 收件信息：姓名、电话、取件码
- 送达信息：地址、经纬度
- 服务配置：类型、是否加急
- 价格信息：基础价、距离费、加急费、总价
- 状态：订单状态、支付状态

### 支付 (Payment)
- 关联：订单ID
- 支付信息：金额、支付方式、交易号
- 状态：支付状态

### 评价 (Review)
- 关联：订单ID、用户ID
- 评价内容：评分、文字评价

## 🔄 开发计划

### 已完成 ✅
- [x] 项目基础架构搭建
- [x] 用户认证系统（注册/登录）
- [x] 数据库设计和初始化
- [x] 前端基础页面和组件
- [x] 订单创建流程
- [x] 订单列表和详情
- [x] 个人中心页面
- [x] 微信支付系统集成
- [x] Docker 一键部署支持

### 计划中 📋
- [ ] 移动端适配优化
- [ ] 推送通知
- [ ] 数据统计和分析
- [ ] 多语言支持

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

本项目仅用于学习和演示目的。

## 📞 联系方式

如有问题，请提交GitHub Issue。