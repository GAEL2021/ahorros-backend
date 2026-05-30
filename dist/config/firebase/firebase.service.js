"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const firebaseAdmin = require("firebase-admin");
let FirebaseService = class FirebaseService {
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        this.firebaseApp = firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert({
                projectId: this.configService.get('FIREBASE_PROJECT_ID'),
                clientEmail: this.configService.get('FIREBASE_CLIENT_EMAIL'),
                privateKey: this.configService
                    .get('FIREBASE_PRIVATE_KEY')
                    ?.replace(/\\n/g, '\n'),
            }),
            databaseURL: this.configService.get('FIREBASE_DATABASE_URL'),
        });
    }
    get auth() {
        return firebaseAdmin.auth(this.firebaseApp);
    }
    get firestore() {
        return firebaseAdmin.firestore(this.firebaseApp);
    }
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FirebaseService);
//# sourceMappingURL=firebase.service.js.map