"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// 创建支付订单
router.post('/create', auth_1.authenticateToken, paymentController_1.paymentController.createPayment.bind(paymentController_1.paymentController));
// 查询支付状态
router.get('/:paymentId/status', auth_1.authenticateToken, paymentController_1.paymentController.queryPaymentStatus.bind(paymentController_1.paymentController));
// 支付回调 (不需要认证)
router.post('/notify', paymentController_1.paymentController.paymentCallback.bind(paymentController_1.paymentController));
// 申请退款
router.post('/refund', auth_1.authenticateToken, paymentController_1.paymentController.refundPayment.bind(paymentController_1.paymentController));
// 获取支付记录
router.get('/history', auth_1.authenticateToken, paymentController_1.paymentController.getPaymentHistory.bind(paymentController_1.paymentController));
exports.default = router;
//# sourceMappingURL=payments.js.map