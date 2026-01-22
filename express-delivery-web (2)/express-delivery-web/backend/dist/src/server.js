"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("./routes/auth"));
const orders_1 = __importDefault(require("./routes/orders"));
const stations_1 = __importDefault(require("./routes/stations"));
const addresses_1 = __importDefault(require("./routes/addresses"));
const payments_1 = __importDefault(require("./routes/payments"));
const reviews_1 = __importDefault(require("./routes/reviews"));
const uploads_1 = __importDefault(require("./routes/uploads"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// 初始化Prisma客户端
exports.prisma = new client_1.PrismaClient();
// 中间件配置
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// 速率限制
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 限制每个IP 15分钟内最多100次请求
    message: '请求过于频繁，请稍后再试'
});
app.use(limiter);
// 路由
app.use('/api/auth', auth_1.default);
app.use('/api/orders', orders_1.default);
app.use('/api/stations', stations_1.default);
app.use('/api/addresses', addresses_1.default);
app.use('/api/payments', payments_1.default);
app.use('/api/reviews', reviews_1.default);
app.use('/api/uploads', uploads_1.default);
// 健康检查
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// 错误处理中间件
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
// 启动服务器
app.listen(port, () => {
    console.log(`🚀 服务器运行在端口 ${port}`);
});
// 优雅关闭
process.on('SIGINT', async () => {
    console.log('正在关闭服务器...');
    await exports.prisma.$disconnect();
    process.exit(0);
});
exports.default = app;
//# sourceMappingURL=server.js.map