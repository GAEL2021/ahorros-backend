import { AdminService } from './admin.service';
import { Request } from 'express';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    verificar(req: Request): Promise<{
        esAdmin: boolean;
    }>;
    getAdmins(req: Request): Promise<{
        uids: string[];
    }>;
    updateAdmins(uids: string[], req: Request): Promise<{
        uids: string[];
    }>;
}
