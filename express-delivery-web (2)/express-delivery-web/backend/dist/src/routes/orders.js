"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// 创建订单
router.post('/', auth_1.authenticateToken, orderController_1.orderController.createOrder.bind(orderController_1.orderController));
// 获取用户订单列表
router.get('/', auth_1.authenticateToken, orderController_1.orderController.getUserOrders.bind(orderController_1.orderController));
// 获取订单详情
router.get('/:id', auth_1.authenticateToken, orderController_1.orderController.getOrderById.bind(orderController_1.orderController));
// 更新订单状态
router.put('/:id/status', auth_1.authenticateToken, orderController_1.orderController.updateOrderStatus.bind(orderController_1.orderController));
// 取消订单
router.put('/:id/cancel', auth_1.authenticateToken, orderController_1.orderController.cancelOrder.bind(orderController_1.orderController));
// 获取订单统计
router.get('/stats/summary', auth_1.authenticateToken, orderController_1.orderController.getOrderStats.bind(orderController_1.orderController));
exports.default = router;
//# sourceMappingURL=orders.js.map