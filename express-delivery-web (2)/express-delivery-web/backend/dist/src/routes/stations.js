"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("../server");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// 获取所有快递站
router.get('/', async (req, res) => {
    try {
        const stations = await server_1.prisma.deliveryStation.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ stations });
    }
    catch (error) {
        console.error('获取快递站列表失败:', error);
        res.status(500).json({ message: '获取快递站列表失败' });
    }
});
// 获取单个快递站详情
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const station = await server_1.prisma.deliveryStation.findUnique({
            where: { id }
        });
        if (!station) {
            return res.status(404).json({ message: '快递站不存在' });
        }
        res.json({ station });
    }
    catch (error) {
        console.error('获取快递站详情失败:', error);
        res.status(500).json({ message: '获取快递站详情失败' });
    }
});
// 创建快递站 (管理员功能)
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { name, address, latitude, longitude, phone, description } = req.body;
        if (!name || !address || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: '快递站名称、地址、经纬度不能为空' });
        }
        const station = await server_1.prisma.deliveryStation.create({
            data: {
                name,
                address,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                phone,
                description
            }
        });
        res.status(201).json({
            message: '快递站创建成功',
            station
        });
    }
    catch (error) {
        console.error('创建快递站失败:', error);
        res.status(500).json({ message: '创建快递站失败' });
    }
});
// 更新快递站 (管理员功能)
router.put('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, latitude, longitude, phone, description, isActive } = req.body;
        const station = await server_1.prisma.deliveryStation.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(address && { address }),
                ...(latitude !== undefined && { latitude: parseFloat(latitude) }),
                ...(longitude !== undefined && { longitude: parseFloat(longitude) }),
                ...(phone !== undefined && { phone }),
                ...(description !== undefined && { description }),
                ...(isActive !== undefined && { isActive })
            }
        });
        res.json({
            message: '快递站更新成功',
            station
        });
    }
    catch (error) {
        console.error('更新快递站失败:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: '快递站不存在' });
        }
        res.status(500).json({ message: '更新快递站失败' });
    }
});
// 删除快递站 (管理员功能)
router.delete('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await server_1.prisma.deliveryStation.delete({
            where: { id }
        });
        res.json({ message: '快递站删除成功' });
    }
    catch (error) {
        console.error('删除快递站失败:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: '快递站不存在' });
        }
        res.status(500).json({ message: '删除快递站失败' });
    }
});
exports.default = router;
//# sourceMappingURL=stations.js.map