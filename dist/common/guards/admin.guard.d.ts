import { CanActivate, ExecutionContext } from '@nestjs/common';
import { FirebaseService } from '../../config/firebase/firebase.service';
export declare class AdminGuard implements CanActivate {
    private readonly firebaseService;
    constructor(firebaseService: FirebaseService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
