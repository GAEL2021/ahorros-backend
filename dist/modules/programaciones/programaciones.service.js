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
exports.ProgramacionesService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../../config/firebase/firebase.service");
const bancos_service_1 = require("../bancos/bancos.service");
let ProgramacionesService = class ProgramacionesService {
    constructor(firebaseService, bancosService) {
        this.firebaseService = firebaseService;
        this.bancosService = bancosService;
    }
    async createProgramacion(dto, user) {
        if (dto.tipo === 'fijo' && !dto.monto) {
            throw new common_1.BadRequestException('Debes proporcionar un monto para programación de tipo fijo');
        }
        if (dto.tipo === 'porcentaje' && !dto.porcentaje) {
            throw new common_1.BadRequestException('Debes proporcionar un porcentaje para programación de tipo porcentaje');
        }
        const db = this.firebaseService.firestore;
        const carteraDoc = await db.collection('bancos').doc(dto.carteraId).get();
        if (!carteraDoc.exists) {
            throw new common_1.NotFoundException('Cartera no encontrada');
        }
        const carteraData = carteraDoc.data();
        if (carteraData['uid'] !== user.uid) {
            throw new common_1.ForbiddenException('No tienes acceso a esta cartera');
        }
        const metaDoc = await db.collection('metas').doc(dto.metaId).get();
        if (!metaDoc.exists) {
            throw new common_1.NotFoundException('Meta no encontrada');
        }
        const metaData = metaDoc.data();
        if (metaData['creadoPor'] !== user.uid) {
            const miembroSnap = await metaDoc.ref
                .collection('miembros')
                .where('uid', '==', user.uid)
                .limit(1)
                .get();
            if (miembroSnap.empty) {
                throw new common_1.ForbiddenException('No eres miembro de esta meta');
            }
        }
        const now = new Date().toISOString();
        const programacionData = {
            userId: user.uid,
            carteraId: dto.carteraId,
            metaId: dto.metaId,
            tipo: dto.tipo,
            monto: dto.monto,
            porcentaje: dto.porcentaje,
            diaDelMes: dto.diaDelMes,
            activo: dto.activo ?? true,
            creadoEn: now,
        };
        const docRef = await db.collection('programaciones').add(programacionData);
        return { id: docRef.id, ...programacionData };
    }
    async getUserProgramaciones(user) {
        const db = this.firebaseService.firestore;
        const snapshot = await db
            .collection('programaciones')
            .where('userId', '==', user.uid)
            .orderBy('creadoEn', 'asc')
            .get();
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
    async updateProgramacion(id, dto, user) {
        const db = this.firebaseService.firestore;
        const docRef = db.collection('programaciones').doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException('Programación no encontrada');
        }
        const data = doc.data();
        if (data.userId !== user.uid) {
            throw new common_1.ForbiddenException('No tienes acceso a esta programación');
        }
        const updates = {};
        if (dto.tipo !== undefined)
            updates.tipo = dto.tipo;
        if (dto.monto !== undefined)
            updates.monto = dto.monto;
        if (dto.porcentaje !== undefined)
            updates.porcentaje = dto.porcentaje;
        if (dto.diaDelMes !== undefined)
            updates.diaDelMes = dto.diaDelMes;
        if (dto.activo !== undefined)
            updates.activo = dto.activo;
        if (Object.keys(updates).length === 0) {
            throw new common_1.BadRequestException('No hay campos para actualizar');
        }
        await docRef.update(updates);
        return { id, ...updates };
    }
    async deleteProgramacion(id, user) {
        const db = this.firebaseService.firestore;
        const docRef = db.collection('programaciones').doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException('Programación no encontrada');
        }
        const data = doc.data();
        if (data.userId !== user.uid) {
            throw new common_1.ForbiddenException('No tienes acceso a esta programación');
        }
        await docRef.delete();
        return { message: 'Programación eliminada correctamente' };
    }
    async toggleProgramacion(id, user) {
        const db = this.firebaseService.firestore;
        const docRef = db.collection('programaciones').doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException('Programación no encontrada');
        }
        const data = doc.data();
        if (data.userId !== user.uid) {
            throw new common_1.ForbiddenException('No tienes acceso a esta programación');
        }
        const nuevoEstado = !data.activo;
        await docRef.update({ activo: nuevoEstado });
        return { id, activo: nuevoEstado };
    }
    async getProgramacionesActivasDelDia(dia) {
        const db = this.firebaseService.firestore;
        const snapshot = await db
            .collection('programaciones')
            .where('activo', '==', true)
            .where('diaDelMes', '==', dia)
            .get();
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
};
exports.ProgramacionesService = ProgramacionesService;
exports.ProgramacionesService = ProgramacionesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        bancos_service_1.BancosService])
], ProgramacionesService);
//# sourceMappingURL=programaciones.service.js.map