"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviewController_1 = require("../controllers/reviewController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// 创建评价
router.post('/orders/:orderId', auth_1.authenticateToken, reviewController_1.reviewController.createReview.bind(reviewController_1.reviewController));
// 获取订单评价
router.get('/orders/:orderId', auth_1.authenticateToken, reviewController_1.reviewController.getOrderReview.bind(reviewController_1.reviewController));
// 获取用户评价列表
router.get('/', auth_1.authenticateToken, reviewController_1.reviewController.getUserReviews.bind(reviewController_1.reviewController));
// 更新评价
router.put('/:id', auth_1.authenticateToken, reviewController_1.reviewController.updateReview.bind(reviewController_1.reviewController));
// 删除评价
router.delete('/:id', auth_1.authenticateToken, reviewController_1.reviewController.deleteReview.bind(reviewController_1.reviewController));
// 获取评价统计
router.get('/stats/overview', reviewController_1.reviewController.getReviewStats.bind(reviewController_1.reviewController));
exports.default = router;
//# sourceMappingURL=reviews.js.map