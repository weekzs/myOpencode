import { OrderStatus } from '@prisma/client';
export declare class OrderService {
    createOrder(userId: string, orderData: any): Promise<{
        deliveryStation: {
            id: string;
            name: string;
            address: string;
            latitude: number;
            longitude: number;
            phone: string | null;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        user: {
            id: string;
            phone: string;
            nickname: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deliveryStationId: string;
        recipientName: string;
        recipientPhone: string;
        pickupCode: string | null;
        deliveryAddress: string;
        deliveryLat: number | null;
        deliveryLng: number | null;
        serviceType: import(".prisma/client").$Enums.ServiceType;
        isUrgent: boolean;
        remarks: string | null;
        basePrice: number;
        distance: number;
        distancePrice: number;
        urgentFee: number;
        totalPrice: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paidAt: Date | null;
        completedAt: Date | null;
        userId: string;
    }>;
    private calculatePrice;
    getUserOrders(userId: string, status?: OrderStatus): Promise<({
        deliveryStation: {
            id: string;
            name: string;
            address: string;
            latitude: number;
            longitude: number;
            phone: string | null;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        payment: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            paidAt: Date | null;
            amount: number;
            paymentMethod: string;
            transactionId: string | null;
            orderId: string;
        } | null;
        review: {
            id: string;
            createdAt: Date;
            userId: string;
            orderId: string;
            rating: number;
            content: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deliveryStationId: string;
        recipientName: string;
        recipientPhone: string;
        pickupCode: string | null;
        deliveryAddress: string;
        deliveryLat: number | null;
        deliveryLng: number | null;
        serviceType: import(".prisma/client").$Enums.ServiceType;
        isUrgent: boolean;
        remarks: string | null;
        basePrice: number;
        distance: number;
        distancePrice: number;
        urgentFee: number;
        totalPrice: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paidAt: Date | null;
        completedAt: Date | null;
        userId: string;
    })[]>;
    getOrderById(orderId: string, userId?: string): Promise<({
        deliveryStation: {
            id: string;
            name: string;
            address: string;
            latitude: number;
            longitude: number;
            phone: string | null;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        user: {
            id: string;
            phone: string;
            nickname: string | null;
        };
        payment: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            paidAt: Date | null;
            amount: number;
            paymentMethod: string;
            transactionId: string | null;
            orderId: string;
        } | null;
        review: {
            id: string;
            createdAt: Date;
            userId: string;
            orderId: string;
            rating: number;
            content: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deliveryStationId: string;
        recipientName: string;
        recipientPhone: string;
        pickupCode: string | null;
        deliveryAddress: string;
        deliveryLat: number | null;
        deliveryLng: number | null;
        serviceType: import(".prisma/client").$Enums.ServiceType;
        isUrgent: boolean;
        remarks: string | null;
        basePrice: number;
        distance: number;
        distancePrice: number;
        urgentFee: number;
        totalPrice: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paidAt: Date | null;
        completedAt: Date | null;
        userId: string;
    }) | null>;
    updateOrderStatus(orderId: string, status: OrderStatus, userId?: string): Promise<{
        deliveryStation: {
            id: string;
            name: string;
            address: string;
            latitude: number;
            longitude: number;
            phone: string | null;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        payment: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            paidAt: Date | null;
            amount: number;
            paymentMethod: string;
            transactionId: string | null;
            orderId: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deliveryStationId: string;
        recipientName: string;
        recipientPhone: string;
        pickupCode: string | null;
        deliveryAddress: string;
        deliveryLat: number | null;
        deliveryLng: number | null;
        serviceType: import(".prisma/client").$Enums.ServiceType;
        isUrgent: boolean;
        remarks: string | null;
        basePrice: number;
        distance: number;
        distancePrice: number;
        urgentFee: number;
        totalPrice: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paidAt: Date | null;
        completedAt: Date | null;
        userId: string;
    }>;
    cancelOrder(orderId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deliveryStationId: string;
        recipientName: string;
        recipientPhone: string;
        pickupCode: string | null;
        deliveryAddress: string;
        deliveryLat: number | null;
        deliveryLng: number | null;
        serviceType: import(".prisma/client").$Enums.ServiceType;
        isUrgent: boolean;
        remarks: string | null;
        basePrice: number;
        distance: number;
        distancePrice: number;
        urgentFee: number;
        totalPrice: number;
        status: import(".prisma/client").$Enums.OrderStatus;
        paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
        paidAt: Date | null;
        completedAt: Date | null;
        userId: string;
    }>;
    private canTransitionStatus;
    getOrderStats(userId: string): Promise<{
        total: number;
        pending: number;
        completed: number;
        cancelled: number;
        totalSpent: number;
    }>;
}
export declare const orderService: OrderService;
//# sourceMappingURL=orderService.d.ts.map