"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressController = exports.AddressController = void 0;
const addressService_1 = require("../services/addressService");
class AddressController {
    // 获取用户地址列表
    async getUserAddresses(req, res) {
        try {
            const addresses = await addressService_1.addressService.getUserAddresses(req.user.id);
            res.json({ addresses });
        }
        catch (error) {
            console.error('获取地址列表失败:', error);
            res.status(500).json({ message: '获取地址列表失败' });
        }
    }
    // 创建地址
    async createAddress(req, res) {
        try {
            const addressData = req.body;
            // 验证必填字段
            const requiredFields = ['name', 'phone', 'province', 'city', 'district', 'address'];
            for (const field of requiredFields) {
                if (!addressData[field]) {
                    return res.status(400).json({ message: `${field}不能为空` });
                }
            }
            const address = await addressService_1.addressService.createAddress(req.user.id, addressData);
            res.status(201).json({
                success: true,
                address
            });
        }
        catch (error) {
            console.error('创建地址失败:', error);
            res.status(500).json({ message: error.message || '创建地址失败' });
        }
    }
    // 更新地址
    async updateAddress(req, res) {
        try {
            const { id } = req.params;
            const addressData = req.body;
            const address = await addressService_1.addressService.updateAddress(id, req.user.id, addressData);
            res.json({
                success: true,
                address
            });
        }
        catch (error) {
            console.error('更新地址失败:', error);
            res.status(500).json({ message: error.message || '更新地址失败' });
        }
    }
    // 删除地址
    async deleteAddress(req, res) {
        try {
            const { id } = req.params;
            await addressService_1.addressService.deleteAddress(id, req.user.id);
            res.json({ success: true, message: '地址删除成功' });
        }
        catch (error) {
            console.error('删除地址失败:', error);
            res.status(500).json({ message: error.message || '删除地址失败' });
        }
    }
    // 设置默认地址
    async setDefaultAddress(req, res) {
        try {
            const { id } = req.params;
            const address = await addressService_1.addressService.setDefaultAddress(id, req.user.id);
            res.json({
                success: true,
                address
            });
        }
        catch (error) {
            console.error('设置默认地址失败:', error);
            res.status(500).json({ message: error.message || '设置默认地址失败' });
        }
    }
    // 获取默认地址
    async getDefaultAddress(req, res) {
        try {
            const address = await addressService_1.addressService.getDefaultAddress(req.user.id);
            res.json({ address });
        }
        catch (error) {
            console.error('获取默认地址失败:', error);
            res.status(500).json({ message: '获取默认地址失败' });
        }
    }
}
exports.AddressController = AddressController;
exports.addressController = new AddressController();
//# sourceMappingURL=addressController.js.map