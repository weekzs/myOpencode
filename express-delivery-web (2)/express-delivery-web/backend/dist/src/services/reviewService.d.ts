export declare class ReviewService {
    createReview(orderId: string, userId: string, reviewData: any): Promise<{
        user: {
            id: string;
            nickname: string | null;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        orderId: string;
        rating: number;
        content: string | null;
    }>;
    getOrderReview(orderId: string, userId?: string): Promise<({
        user: {
            id: string;
            nickname: string | null;
            avatar: string | null;
        };
        order: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        orderId: string;
        rating: number;
        content: string | null;
    }) | null>;
    getUserReviews(userId: string): Promise<({
        order: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        orderId: string;
        rating: number;
        content: string | null;
    })[]>;
    updateReview(reviewId: string, userId: string, reviewData: any): Promise<{
        user: {
            id: string;
            nickname: string | null;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        orderId: string;
        rating: number;
        content: string | null;
    }>;
    deleteReview(reviewId: string, userId: string): Promise<{
        success: boolean;
    }>;
    getReviewStats(): Promise<{
        total: number;
        average: number;
        distribution: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
    }>;
}
export declare const reviewService: ReviewService;
//# sourceMappingURL=reviewService.d.ts.map