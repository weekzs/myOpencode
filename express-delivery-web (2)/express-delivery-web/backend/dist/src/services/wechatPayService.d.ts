declare class WeChatPayService {
    private wechatPay;
    private config;
    constructor();
    private initWeChatPay;
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
    private generatePaymentParams;
    private sign;
    queryPaymentStatus(outTradeNo: string): Promise<{
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
    private createMockPayment;
    private queryMockPaymentStatus;
    private handleMockCallback;
    private createMockRefund;
}
export declare const wechatPayService: WeChatPayService;
export {};
//# sourceMappingURL=wechatPayService.d.ts.map