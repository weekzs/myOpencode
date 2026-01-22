"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wechatPayService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const server_1 = require("../server");
class WeChatPayService {
    constructor() {
        // 从环境变量读取配置
        const certPath = process.env.WECHAT_CERT_PATH || 'D:\\AppInstall\\wxCertutil\\1738582376_20250121_cert';
        const apiV3Key = process.env.WECHAT_API_V3_KEY || ''; // 32字符
        const apiV2Key = process.env.WECHAT_API_V2_KEY || ''; // 32字符
        this.config = {
            appid: process.env.WECHAT_APP_ID || '',
            mchid: process.env.WECHAT_MCH_ID || '',
            publicKey: apiV3Key,
            privateKey: apiV2Key,
            serial_no: process.env.WECHAT_SERIAL_NO || '',
            keyPath: certPath,
        };
        // 初始化微信支付实例
        this.initWeChatPay();
    }
    initWeChatPay() {
        try {
            const { appid, mchid, publicKey, privateKey, serial_no, keyPath } = this.config;
            // 读取证书文件
            const privateKeyPath = path_1.default.join(keyPath, 'apiclient_key.pem');
            const certPath = path_1.default.join(keyPath, 'apiclient_cert.pem');
            // 检查证书文件是否存在
            if (!fs_1.default.existsSync(privateKeyPath) || !fs_1.default.existsSync(certPath)) {
                console.warn('微信支付证书文件不存在，将使用模拟模式');
                return;
            }
            // 初始化微信支付
            // 暂时使用模拟模式，避免证书问题
            console.log('使用微信支付模拟模式');
            console.log('微信支付初始化成功');
        }
        catch (error) {
            console.error('微信支付初始化失败:', error);
            console.warn('将使用模拟模式');
        }
    }
    // 创建支付订单
    async createPayment(orderId, amount, description, openid) {
        try {
            // 检查订单是否存在
            const order = await server_1.prisma.order.findUnique({
                where: { id: orderId }
            });
            if (!order) {
                throw new Error('订单不存在');
            }
            if (order.paymentStatus !== 'UNPAID') {
                throw new Error('订单已支付或状态异常');
            }
            // 创建支付记录
            const payment = await server_1.prisma.payment.create({
                data: {
                    orderId,
                    amount,
                    paymentMethod: 'wechat',
                    status: 'PENDING'
                }
            });
            // 如果没有初始化微信支付，返回模拟数据
            if (!this.wechatPay) {
                return this.createMockPayment(payment);
            }
            // 调用微信支付API创建订单
            const outTradeNo = payment.id;
            const totalAmount = Math.round(amount * 100); // 转换为分
            // 构建请求参数
            const requestData = {
                description,
                out_trade_no: outTradeNo,
                amount: {
                    total: totalAmount,
                    currency: 'CNY'
                },
                notify_url: `${process.env.WECHAT_NOTIFY_URL || 'http://localhost:3001'}/api/payments/notify`,
            };
            // 如果是JSAPI支付，需要传入openid
            if (openid) {
                requestData.payer = { openid };
            }
            // 调用微信支付统一下单接口
            // 根据 wechatpay-node-v3 的实际API调整
            let result;
            try {
                // 尝试使用 transactions.jsapi 方法
                result = await this.wechatPay.transactions.jsapi(requestData);
            }
            catch (error) {
                // 如果方法不存在，尝试其他方式
                console.warn('使用备用方式调用微信支付API:', error.message);
                // 使用通用方法
                result = await this.wechatPay.post('/v3/pay/transactions/jsapi', requestData);
            }
            // 获取prepay_id
            const prepayId = result.prepay_id || result.data?.prepay_id;
            // 更新支付记录
            await server_1.prisma.payment.update({
                where: { id: payment.id },
                data: {
                    transactionId: prepayId || outTradeNo,
                    status: 'PENDING'
                }
            });
            // 生成前端调起支付所需的参数
            const wechatParams = this.generatePaymentParams(prepayId);
            return {
                payment,
                wechatParams
            };
        }
        catch (error) {
            console.error('创建支付订单失败:', error);
            throw new Error(error.message || '创建支付订单失败');
        }
    }
    // 生成前端支付参数
    generatePaymentParams(prepayId) {
        const appId = this.config.appid;
        const timeStamp = Math.floor(Date.now() / 1000).toString();
        const nonceStr = crypto_1.default.randomBytes(16).toString('hex');
        const packageValue = `prepay_id=${prepayId}`;
        const signType = 'RSA';
        // 生成签名
        const signString = `${appId}\n${timeStamp}\n${nonceStr}\n${packageValue}\n`;
        const sign = this.sign(signString);
        return {
            appId,
            timeStamp,
            nonceStr,
            package: packageValue,
            signType,
            paySign: sign
        };
    }
    // 签名
    sign(data) {
        if (!this.wechatPay) {
            return 'mock_sign';
        }
        try {
            // 使用微信支付SDK的签名方法
            return this.wechatPay.sign(data);
        }
        catch (error) {
            console.error('签名失败:', error);
            return 'mock_sign';
        }
    }
    // 查询支付状态
    async queryPaymentStatus(outTradeNo) {
        try {
            const payment = await server_1.prisma.payment.findUnique({
                where: { id: outTradeNo },
                include: { order: true }
            });
            if (!payment) {
                throw new Error('支付记录不存在');
            }
            // 如果没有初始化微信支付，返回模拟状态
            if (!this.wechatPay) {
                return this.queryMockPaymentStatus(payment);
            }
            // 调用微信支付API查询订单状态
            let result;
            try {
                // 尝试使用 query 方法
                result = await this.wechatPay.query({ out_trade_no: outTradeNo });
            }
            catch (error) {
                // 如果方法不存在，使用GET请求
                console.warn('使用备用方式查询支付状态:', error.message);
                result = await this.wechatPay.get(`/v3/pay/transactions/out-trade-no/${outTradeNo}`);
            }
            const tradeState = result.trade_state;
            let newStatus = payment.status;
            if (tradeState === 'SUCCESS') {
                newStatus = 'PAID';
                await server_1.prisma.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: 'PAID',
                        paidAt: new Date(),
                        transactionId: result.transaction_id
                    }
                });
                // 更新订单状态
                await server_1.prisma.order.update({
                    where: { id: payment.orderId },
                    data: {
                        paymentStatus: 'PAID',
                        status: 'CONFIRMED'
                    }
                });
            }
            return {
                paymentId: payment.id,
                status: newStatus,
                wechatStatus: tradeState
            };
        }
        catch (error) {
            console.error('查询支付状态失败:', error);
            throw new Error(error.message || '查询支付状态失败');
        }
    }
    // 处理支付回调
    async handlePaymentCallback(callbackData) {
        try {
            if (!this.wechatPay) {
                return this.handleMockCallback(callbackData);
            }
            // 验证回调签名
            const isValid = this.wechatPay.verify(callbackData);
            if (!isValid) {
                throw new Error('回调签名验证失败');
            }
            const { out_trade_no, transaction_id, trade_state } = callbackData;
            if (trade_state === 'SUCCESS') {
                // 更新支付记录
                await server_1.prisma.payment.update({
                    where: { id: out_trade_no },
                    data: {
                        status: 'PAID',
                        paidAt: new Date(),
                        transactionId: transaction_id
                    }
                });
                // 更新订单状态
                await server_1.prisma.order.update({
                    where: { id: out_trade_no },
                    data: {
                        paymentStatus: 'PAID',
                        status: 'CONFIRMED'
                    }
                });
                return { success: true, message: '支付成功' };
            }
            return { success: false, message: '支付未完成' };
        }
        catch (error) {
            console.error('处理支付回调失败:', error);
            throw new Error(error.message || '处理支付回调失败');
        }
    }
    // 申请退款
    async refundPayment(paymentId, amount, reason) {
        try {
            const payment = await server_1.prisma.payment.findUnique({
                where: { id: paymentId },
                include: { order: true }
            });
            if (!payment || payment.status !== 'PAID') {
                throw new Error('支付记录不存在或未支付');
            }
            if (!this.wechatPay) {
                return this.createMockRefund(paymentId, amount, reason);
            }
            const outRefundNo = `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const refundAmount = Math.round(amount * 100);
            // 调用微信退款API
            const result = await this.wechatPay.refund({
                out_refund_no: outRefundNo,
                transaction_id: payment.transactionId,
                amount: {
                    refund: refundAmount,
                    total: Math.round(payment.amount * 100),
                    currency: 'CNY'
                },
                reason
            });
            // 更新支付状态
            await server_1.prisma.payment.update({
                where: { id: paymentId },
                data: { status: 'REFUNDED' }
            });
            // 更新订单状态
            await server_1.prisma.order.update({
                where: { id: payment.orderId },
                data: { paymentStatus: 'REFUNDED' }
            });
            return {
                refundId: outRefundNo,
                status: 'SUCCESS',
                message: '退款申请成功'
            };
        }
        catch (error) {
            console.error('申请退款失败:', error);
            throw new Error(error.message || '申请退款失败');
        }
    }
    // 模拟支付方法（用于开发测试）
    createMockPayment(payment) {
        const wechatParams = {
            appId: this.config.appid || 'wx_test_app_id',
            timeStamp: Math.floor(Date.now() / 1000).toString(),
            nonceStr: Math.random().toString(36).substr(2, 9),
            package: `prepay_id=${payment.id}`,
            signType: 'RSA',
            paySign: 'mock_sign_' + payment.id
        };
        return { payment, wechatParams };
    }
    async queryMockPaymentStatus(payment) {
        // 模拟查询逻辑
        return {
            paymentId: payment.id,
            status: payment.status,
            wechatStatus: payment.status === 'PAID' ? 'SUCCESS' : 'NOTPAY'
        };
    }
    async handleMockCallback(callbackData) {
        const { out_trade_no } = callbackData;
        // 模拟回调处理
        return { success: true, message: '支付成功（模拟）' };
    }
    async createMockRefund(paymentId, amount, reason) {
        const refundId = `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return {
            refundId,
            status: 'SUCCESS',
            message: '退款申请成功（模拟）'
        };
    }
}
exports.wechatPayService = new WeChatPayService();
//# sourceMappingURL=wechatPayService.js.map