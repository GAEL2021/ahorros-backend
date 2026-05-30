import { FirebaseService } from '../../config/firebase/firebase.service';
import { FirebaseUser } from '../../common/guards/firebase-auth.guard';
export declare class AdminService {
    private readonly firebaseService;
    constructor(firebaseService: FirebaseService);
    verificarAdmin(user: FirebaseUser): Promise<{
        esAdmin: boolean;
    }>;
    getAdmins(user: FirebaseUser): Promise<{
        uids: string[];
    }>;
    updateAdmins(uids: string[], user: FirebaseUser): Promise<{
        uids: string[];
    }>;
    private assertAdmin;
}
