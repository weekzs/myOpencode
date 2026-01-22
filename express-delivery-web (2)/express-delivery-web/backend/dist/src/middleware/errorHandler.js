"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = void 0;
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
//# sourceMappingURL=errorHandler.js.map