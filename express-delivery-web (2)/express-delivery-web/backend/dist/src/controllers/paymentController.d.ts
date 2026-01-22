import { Request, Response } from 'express';
export declare class PaymentController {
    createPayment(req: Request & {
        user?: any;
    }, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    queryPaymentStatus(req: Request & {
        user?: any;
    }, res: Response): Promise<void>;
    paymentCallback(req: Request, res: Response): Promise<void>;
    refundPayment(req: Request & {
        user?: any;
    }, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getPaymentHistory(req: Request & {
        user?: any;
    }, res: Response): Promise<void>;
}
export declare const paymentController: PaymentController;
//# sourceMappingURL=paymentController.d.ts.map