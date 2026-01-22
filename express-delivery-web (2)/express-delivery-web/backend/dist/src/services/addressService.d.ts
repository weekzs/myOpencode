export declare class AddressService {
    getUserAddresses(userId: string): Promise<{
        id: string;
        name: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        phone: string;
        createdAt: Date;
        userId: string;
        province: string;
        city: string;
        district: string;
        isDefault: boolean;
    }[]>;
    createAddress(userId: string, addressData: any): Promise<{
        id: string;
        name: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        phone: string;
        createdAt: Date;
        userId: string;
        province: string;
        city: string;
        district: string;
        isDefault: boolean;
    }>;
    updateAddress(addressId: string, userId: string, addressData: any): Promise<{
        id: string;
        name: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        phone: string;
        createdAt: Date;
        userId: string;
        province: string;
        city: string;
        district: string;
        isDefault: boolean;
    }>;
    deleteAddress(addressId: string, userId: string): Promise<{
        success: boolean;
    }>;
    setDefaultAddress(addressId: string, userId: string): Promise<{
        id: string;
        name: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        phone: string;
        createdAt: Date;
        userId: string;
        province: string;
        city: string;
        district: string;
        isDefault: boolean;
    }>;
    getDefaultAddress(userId: string): Promise<{
        id: string;
        name: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        phone: string;
        createdAt: Date;
        userId: string;
        province: string;
        city: string;
        district: string;
        isDefault: boolean;
    } | null>;
}
export declare const addressService: AddressService;
//# sourceMappingURL=addressService.d.ts.map