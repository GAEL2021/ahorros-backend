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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../../config/firebase/firebase.service");
let AdminService = class AdminService {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    async verificarAdmin(user) {
        const db = this.firebaseService.firestore;
        const adminDoc = await db.collection('config').doc('admins').get();
        if (!adminDoc.exists) {
            return { esAdmin: false };
        }
        const { uids } = adminDoc.data();
        return { esAdmin: uids?.includes(user.uid) ?? false };
    }
    async getAdmins(user) {
        await this.assertAdmin(user);
        const db = this.firebaseService.firestore;
        const adminDoc = await db.collection('config').doc('admins').get();
        if (!adminDoc.exists) {
            return { uids: [] };
        }
        return adminDoc.data();
    }
    async updateAdmins(uids, user) {
        await this.assertAdmin(user);
        const db = this.firebaseService.firestore;
        const uniqueUids = [...new Set(uids)];
        await db
            .collection('config')
            .doc('admins')
            .set({
            uids: uniqueUids,
            actualizadoPor: user.uid,
            actualizadoEn: new Date().toISOString(),
        });
        return { uids: uniqueUids };
    }
    async assertAdmin(user) {
        if (!user?.uid) {
            throw new common_1.ForbiddenException('No autenticado');
        }
        const db = this.firebaseService.firestore;
        const adminDoc = await db.collection('config').doc('admins').get();
        const uids = adminDoc.exists
            ? adminDoc.data().uids ?? []
            : [];
        if (!uids.includes(user.uid)) {
            throw new common_1.ForbiddenException('No tienes permisos de administrador');
        }
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], AdminService);
//# sourceMappingURL=admin.service.js.map