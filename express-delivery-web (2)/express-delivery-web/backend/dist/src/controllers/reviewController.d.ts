import { Request, Response } from 'express';
export declare class ReviewController {
    createReview(req: Request & {
        user?: any;
    }, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getOrderReview(req: Request & {
        user?: any;
    }, res: Response): Promise<void>;
    getUserReviews(req: Request & {
        user?: any;
    }, res: Response): Promise<void>;
    updateReview(req: Request & {
        user?: any;
    }, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteReview(req: Request & {
        user?: any;
    }, res: Response): Promise<void>;
    getReviewStats(req: Request, res: Response): Promise<void>;
}
export declare const reviewController: ReviewController;
//# sourceMappingURL=reviewController.d.ts.map