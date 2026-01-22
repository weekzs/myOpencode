"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = exports.PaymentController = void 0;
const paymentService_1 = require("../services/paymentService");
const server_1 = require("../server");
class PaymentController {
    // 创建支付订单
    async createPayment(req, res) {
        try {
            const { orderId } = req.body;
            if (!orderId) {
                return res.status(400).json({ message: '订单ID不能为空' });
            }
            // 获取订单信息
            const order = await server_1.prisma.order.findUnique({
                where: { id: orderId, userId: req.user.id },
                include: { deliveryStation: true }
            });
            if (!order) {
                return res.status(404).json({ message: '订单不存在' });
            }
            if (order.paymentStatus !== 'UNPAID') {
                return res.status(400).json({ message: '订单已支付或状态异常' });
            }
            const description = `快递服务 - ${order.deliveryStation?.name}`;
            const result = await paymentService_1.paymentService.createPayment(orderId, order.totalPrice, description);
            res.json({
                success: true,
                payment: result.payment,
                wechatParams: result.wechatParams
            });
        }
        catch (error) {
            console.error('创建支付订单失败:', error);
            res.status(500).json({ message: error.message || '创建支付订单失败' });
        }
    }
    // 查询支付状态
    async queryPaymentStatus(req, res) {
        try {
            const { paymentId } = req.params;
            const result = await paymentService_1.paymentService.queryPaymentStatus(paymentId);
            res.json({
                success: true,
                ...result
            });
        }
        catch (error) {
            console.error('查询支付状态失败:', error);
            res.status(500).json({ message: error.message || '查询支付状态失败' });
        }
    }
    // 支付回调
    async paymentCallback(req, res) {
        try {
            const callbackData = req.body;
            const result = await paymentService_1.paymentService.handlePaymentCallback(callbackData);
            // 返回微信要求的响应格式
            res.json({
                code: 'SUCCESS',
                message: result.message
            });
        }
        catch (error) {
            console.error('处理支付回调失败:', error);
            res.status(500).json({
                code: 'FAIL',
                message: error.message || '处理支付回调失败'
            });
        }
    }
    // 申请退款
    async refundPayment(req, res) {
        try {
            const { paymentId, amount, reason } = req.body;
            if (!paymentId || !amount) {
                return res.status(400).json({ message: '支付ID和退款金额不能为空' });
            }
            // 检查支付记录归属
            const payment = await server_1.prisma.payment.findUnique({
                where: { id: paymentId },
                include: { order: true }
            });
            if (!payment || payment.order.userId !== req.user.id) {
                return res.status(404).json({ message: '支付记录不存在' });
            }
            const result = await paymentService_1.paymentService.refundPayment(paymentId, amount, reason || '用户申请退款');
            res.json({
                success: true,
                ...result
            });
        }
        catch (error) {
            console.error('申请退款失败:', error);
            res.status(500).json({ message: error.message || '申请退款失败' });
        }
    }
    // 获取支付记录列表
    async getPaymentHistory(req, res) {
        try {
            const payments = await server_1.prisma.payment.findMany({
                where: {
                    order: {
                        userId: req.user.id
                    }
                },
                include: {
                    order: {
                        include: {
                            deliveryStation: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
            res.json({ payments });
        }
        catch (error) {
            console.error('获取支付记录失败:', error);
            res.status(500).json({ message: '获取支付记录失败' });
        }
    }
}
exports.PaymentController = PaymentController;
exports.paymentController = new PaymentController();
//# sourceMappingURL=paymentController.js.map