"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = exports.ReviewController = void 0;
const reviewService_1 = require("../services/reviewService");
class ReviewController {
    // 创建评价
    async createReview(req, res) {
        try {
            const { orderId } = req.params;
            const { rating, content } = req.body;
            if (!rating || rating < 1 || rating > 5) {
                return res.status(400).json({ message: '评分必须在1-5之间' });
            }
            const review = await reviewService_1.reviewService.createReview(orderId, req.user.id, {
                rating,
                content
            });
            res.status(201).json({
                success: true,
                review
            });
        }
        catch (error) {
            console.error('创建评价失败:', error);
            res.status(500).json({ message: error.message || '创建评价失败' });
        }
    }
    // 获取订单评价
    async getOrderReview(req, res) {
        try {
            const { orderId } = req.params;
            const review = await reviewService_1.reviewService.getOrderReview(orderId, req.user.id);
            res.json({ review });
        }
        catch (error) {
            console.error('获取订单评价失败:', error);
            res.status(500).json({ message: '获取订单评价失败' });
        }
    }
    // 获取用户评价列表
    async getUserReviews(req, res) {
        try {
            const reviews = await reviewService_1.reviewService.getUserReviews(req.user.id);
            res.json({ reviews });
        }
        catch (error) {
            console.error('获取用户评价失败:', error);
            res.status(500).json({ message: '获取用户评价失败' });
        }
    }
    // 更新评价
    async updateReview(req, res) {
        try {
            const { id } = req.params;
            const { rating, content } = req.body;
            if (rating && (rating < 1 || rating > 5)) {
                return res.status(400).json({ message: '评分必须在1-5之间' });
            }
            const review = await reviewService_1.reviewService.updateReview(id, req.user.id, {
                rating,
                content
            });
            res.json({
                success: true,
                review
            });
        }
        catch (error) {
            console.error('更新评价失败:', error);
            res.status(500).json({ message: error.message || '更新评价失败' });
        }
    }
    // 删除评价
    async deleteReview(req, res) {
        try {
            const { id } = req.params;
            await reviewService_1.reviewService.deleteReview(id, req.user.id);
            res.json({ success: true, message: '评价删除成功' });
        }
        catch (error) {
            console.error('删除评价失败:', error);
            res.status(500).json({ message: error.message || '删除评价失败' });
        }
    }
    // 获取评价统计
    async getReviewStats(req, res) {
        try {
            const stats = await reviewService_1.reviewService.getReviewStats();
            res.json({ stats });
        }
        catch (error) {
            console.error('获取评价统计失败:', error);
            res.status(500).json({ message: '获取评价统计失败' });
        }
    }
}
exports.ReviewController = ReviewController;
exports.reviewController = new ReviewController();
//# sourceMappingURL=reviewController.js.map