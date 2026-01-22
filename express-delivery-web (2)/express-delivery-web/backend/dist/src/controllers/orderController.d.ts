import { Request, Response } from 'express';
export declare class OrderController {
    createOrder(req: Request & {
        user?: any;
    }, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getUserOrders(req: Request & {
        user?: any;
    }, res: Response): Promise<void>;
    getOrderById(req: Request & {
        user?: any;
    }, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateOrderStatus(req: Request & {
        user?: any;
    }, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    cancelOrder(req: Request & {
        user?: any;
    }, res: Response): Promise<void>;
    getOrderStats(req: Request & {
        user?: any;
    }, res: Response): Promise<void>;
}
export declare const orderController: OrderController;
//# sourceMappingURL=orderController.d.ts.map