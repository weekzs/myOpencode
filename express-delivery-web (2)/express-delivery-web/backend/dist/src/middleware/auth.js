"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: '访问令牌缺失' });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: '无效的访问令牌' });
        }
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: '数据验证失败',
            errors: err.errors
        });
    }
    if (err.code === 'P2002') {
        return res.status(409).json({
            message: '数据已存在',
            field: err.meta?.target
        });
    }
    res.status(500).json({
        message: '服务器内部错误'
    });
};
exports.errorHandler = errorHandler;
const notFound = (req, res) => {
    res.status(404).json({ message: '接口不存在' });
};
exports.notFound = notFound;
//# sourceMappingURL=auth.js.map