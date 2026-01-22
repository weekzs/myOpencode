import { Request, Response } from 'express';
export declare class AddressController {
    getUserAddresses(req: Request & {
        user?: any;
    }, res: Response): Promise<void>;
    createAddress(req: Request & {
        user?: any;
    }, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateAddress(req: Request & {
        user?: any;
    }, res: Response): Promise<void>;
    deleteAddress(req: Request & {
        user?: any;
    }, res: Response): Promise<void>;
    setDefaultAddress(req: Request & {
        user?: any;
    }, res: Response): Promise<void>;
    getDefaultAddress(req: Request & {
        user?: any;
    }, res: Response): Promise<void>;
}
export declare const addressController: AddressController;
//# sourceMappingURL=addressController.d.ts.map