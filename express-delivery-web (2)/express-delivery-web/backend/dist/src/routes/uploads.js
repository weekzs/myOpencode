"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// 文件上传路由 - 暂时返回开发中
router.get('/', (req, res) => {
    res.json({ message: '文件上传功能开发中' });
});
exports.default = router;
//# sourceMappingURL=uploads.js.map