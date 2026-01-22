import { prisma } from '../server';
import { wechatPayService } from './wechatPayService';

export class PaymentService {
  // 创建支付订单
  async createPayment(orderId: string, amount: number, description: string, openid?: string) {
    try {
      return await wechatPayService.createPayment(orderId, amount, description, openid);
    } catch (error) {
      console.error('创建支付订单失败:', error);
      throw error;
    }
  }

  // 查询支付状态
  async queryPaymentStatus(paymentId: string) {
    try {
      return await wechatPayService.queryPaymentStatus(paymentId);
    } catch (error) {
      console.error('查询支付状态失败:', error);
      throw error;
    }
  }

  // 处理支付回调
  async handlePaymentCallback(callbackData: any) {
    try {
      return await wechatPayService.handlePaymentCallback(callbackData);
    } catch (error) {
      console.error('处理支付回调失败:', error);
      throw error;
    }
  }

  // 申请退款
  async refundPayment(paymentId: string, amount: number, reason: string) {
    try {
      return await wechatPayService.refundPayment(paymentId, amount, reason);
    } catch (error) {
      console.error('申请退款失败:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();