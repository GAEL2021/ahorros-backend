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
exports.CatalogoBancosService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../../config/firebase/firebase.service");
let CatalogoBancosService = class CatalogoBancosService {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    async getAll() {
        const db = this.firebaseService.firestore;
        const snapshot = await db
            .collection('catalogo_bancos')
            .orderBy('nombre', 'asc')
            .get();
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
    async getPublicos() {
        const db = this.firebaseService.firestore;
        const snapshot = await db
            .collection('catalogo_bancos')
            .orderBy('nombre', 'asc')
            .get();
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            nombre: doc.data().nombre,
        }));
    }
    async create(dto) {
        const db = this.firebaseService.firestore;
        const existente = await db
            .collection('catalogo_bancos')
            .where('nombre', '==', dto.nombre.trim())
            .limit(1)
            .get();
        if (!existente.empty) {
            throw new common_1.BadRequestException('Ya existe un banco con ese nombre');
        }
        const data = {
            nombre: dto.nombre.trim(),
            color: dto.color ?? '#6b7280',
            icono: dto.icono ?? '',
            creadoEn: new Date().toISOString(),
        };
        const docRef = await db.collection('catalogo_bancos').add(data);
        return { id: docRef.id, ...data };
    }
    async update(id, dto) {
        const db = this.firebaseService.firestore;
        const docRef = db.collection('catalogo_bancos').doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException('Banco no encontrado en el catálogo');
        }
        const updates = {};
        if (dto.nombre !== undefined)
            updates.nombre = dto.nombre.trim();
        if (dto.color !== undefined)
            updates.color = dto.color;
        if (dto.icono !== undefined)
            updates.icono = dto.icono;
        if (Object.keys(updates).length === 0) {
            throw new common_1.BadRequestException('No hay campos para actualizar');
        }
        await docRef.update(updates);
        return { id, ...updates };
    }
    async delete(id) {
        const db = this.firebaseService.firestore;
        const docRef = db.collection('catalogo_bancos').doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException('Banco no encontrado en el catálogo');
        }
        await docRef.delete();
        return { message: 'Banco eliminado del catálogo' };
    }
};
exports.CatalogoBancosService = CatalogoBancosService;
exports.CatalogoBancosService = CatalogoBancosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], CatalogoBancosService);
//# sourceMappingURL=catalogo-bancos.service.js.map