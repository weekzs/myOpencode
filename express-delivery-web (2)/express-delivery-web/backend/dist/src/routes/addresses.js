"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const addressController_1 = require("../controllers/addressController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// 获取用户地址列表
router.get('/', auth_1.authenticateToken, addressController_1.addressController.getUserAddresses.bind(addressController_1.addressController));
// 创建地址
router.post('/', auth_1.authenticateToken, addressController_1.addressController.createAddress.bind(addressController_1.addressController));
// 更新地址
router.put('/:id', auth_1.authenticateToken, addressController_1.addressController.updateAddress.bind(addressController_1.addressController));
// 删除地址
router.delete('/:id', auth_1.authenticateToken, addressController_1.addressController.deleteAddress.bind(addressController_1.addressController));
// 设置默认地址
router.put('/:id/default', auth_1.authenticateToken, addressController_1.addressController.setDefaultAddress.bind(addressController_1.addressController));
// 获取默认地址
router.get('/default', auth_1.authenticateToken, addressController_1.addressController.getDefaultAddress.bind(addressController_1.addressController));
exports.default = router;
//# sourceMappingURL=addresses.js.map