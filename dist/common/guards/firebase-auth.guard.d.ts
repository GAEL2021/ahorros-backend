import { CanActivate, ExecutionContext } from '@nestjs/common';
import { FirebaseService } from '../../config/firebase/firebase.service';
export interface FirebaseUser {
    uid: string;
    email?: string;
    email_verified?: boolean;
}
declare global {
    namespace Express {
        interface Request {
            user: FirebaseUser;
        }
    }
}
export declare class FirebaseAuthGuard implements CanActivate {
    private readonly firebaseService;
    constructor(firebaseService: FirebaseService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
