export declare class PaymentService {
    createPayment(orderId: string, amount: number, description: string, openid?: string): Promise<{
        payment: any;
        wechatParams: {
            appId: string;
            timeStamp: string;
            nonceStr: string;
            package: string;
            signType: string;
            paySign: string;
        };
    }>;
    queryPaymentStatus(paymentId: string): Promise<{
        paymentId: any;
        status: any;
        wechatStatus: string;
    } | {
        paymentId: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        wechatStatus: any;
    }>;
    handlePaymentCallback(callbackData: any): Promise<{
        success: boolean;
        message: string;
    }>;
    refundPayment(paymentId: string, amount: number, reason: string): Promise<{
        refundId: string;
        status: string;
        message: string;
    }>;
}
export declare const paymentService: PaymentService;
//# sourceMappingURL=paymentService.d.ts.map