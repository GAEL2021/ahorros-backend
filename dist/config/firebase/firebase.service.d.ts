import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as firebaseAdmin from 'firebase-admin';
export declare class FirebaseService implements OnModuleInit {
    private readonly configService;
    private firebaseApp;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    get auth(): firebaseAdmin.auth.Auth;
    get firestore(): firebaseAdmin.firestore.Firestore;
}
