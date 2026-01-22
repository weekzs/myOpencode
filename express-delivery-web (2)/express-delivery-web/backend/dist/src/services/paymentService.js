"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = exports.PaymentService = void 0;
const wechatPayService_1 = require("./wechatPayService");
class PaymentService {
    // 创建支付订单
    async createPayment(orderId, amount, description, openid) {
        try {
            return await wechatPayService_1.wechatPayService.createPayment(orderId, amount, description, openid);
        }
        catch (error) {
            console.error('创建支付订单失败:', error);
            throw error;
        }
    }
    // 查询支付状态
    async queryPaymentStatus(paymentId) {
        try {
            return await wechatPayService_1.wechatPayService.queryPaymentStatus(paymentId);
        }
        catch (error) {
            console.error('查询支付状态失败:', error);
            throw error;
        }
    }
    // 处理支付回调
    async handlePaymentCallback(callbackData) {
        try {
            return await wechatPayService_1.wechatPayService.handlePaymentCallback(callbackData);
        }
        catch (error) {
            console.error('处理支付回调失败:', error);
            throw error;
        }
    }
    // 申请退款
    async refundPayment(paymentId, amount, reason) {
        try {
            return await wechatPayService_1.wechatPayService.refundPayment(paymentId, amount, reason);
        }
        catch (error) {
            console.error('申请退款失败:', error);
            throw error;
        }
    }
}
exports.PaymentService = PaymentService;
exports.paymentService = new PaymentService();
//# sourceMappingURL=paymentService.js.map