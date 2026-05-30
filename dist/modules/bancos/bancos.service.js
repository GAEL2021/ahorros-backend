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
exports.BancosService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const firebase_service_1 = require("../../config/firebase/firebase.service");
const email_service_1 = require("../../common/email/email.service");
function generarCodigoUnico() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}
let BancosService = class BancosService {
    constructor(firebaseService, emailService, configService) {
        this.firebaseService = firebaseService;
        this.emailService = emailService;
        this.configService = configService;
    }
    async createBanco(dto, user) {
        const db = this.firebaseService.firestore;
        if (!user.email) {
            throw new common_1.BadRequestException('El usuario autenticado no tiene email registrado');
        }
        const catalogoDoc = await db
            .collection('catalogo_bancos')
            .doc(dto.catalogoBancoId)
            .get();
        if (!catalogoDoc.exists) {
            throw new common_1.NotFoundException('Banco no encontrado en el catálogo');
        }
        const catalogoData = catalogoDoc.data();
        const nombre = catalogoData['nombre'];
        const color = catalogoData['color'] ?? '#6b7280';
        const tipo = dto.tipo ?? 'personal';
        const now = new Date().toISOString();
        const codigoCompartir = generarCodigoUnico();
        const todosLosEmails = tipo === 'compartida'
            ? [user.email, ...(dto.invitadosEmails ?? [])]
            : [user.email];
        const emailsUnicos = [...new Set(todosLosEmails)];
        const bancoData = {
            uid: user.uid,
            catalogoBancoId: dto.catalogoBancoId,
            nombre,
            color,
            saldo: dto.saldoInicial ?? 0,
            descripcion: dto.descripcion ?? '',
            tipo,
            creadoPor: user.uid,
            creadoEn: now,
            codigoCompartir,
        };
        const docRef = await db.collection('bancos').add(bancoData);
        const id = docRef.id;
        for (let i = 0; i < emailsUnicos.length; i++) {
            const email = emailsUnicos[i];
            const miembro = {
                uid: i === 0 ? user.uid : '',
                email,
                saldoAportado: 0,
                rol: i === 0 ? 'creador' : 'invitado',
            };
            await docRef.collection('miembros').doc(email).set(miembro);
        }
        if (bancoData.saldo > 0) {
            await docRef.collection('transacciones').add({
                carteraId: id,
                userId: user.uid,
                tipo: 'deposito',
                monto: bancoData.saldo,
                descripcion: 'Saldo inicial',
                fecha: now,
            });
        }
        if (tipo === 'compartida' && dto.invitadosEmails) {
            const appUrl = this.configService.get('APP_URL') ?? 'http://localhost:5173';
            const inviterName = user.email?.split('@')[0] ?? 'Alguien';
            for (const invitedEmail of dto.invitadosEmails) {
                this.emailService
                    .sendInviteToWallet(invitedEmail, inviterName, nombre, codigoCompartir, appUrl)
                    .catch(() => { });
            }
        }
        return { id, ...bancoData };
    }
    async getUserBancos(user) {
        const db = this.firebaseService.firestore;
        const propiosSnapshot = await db
            .collection('bancos')
            .where('uid', '==', user.uid)
            .orderBy('creadoEn', 'asc')
            .get();
        const bancos = [];
        for (const doc of propiosSnapshot.docs) {
            const data = doc.data();
            bancos.push({ id: doc.id, ...data });
        }
        if (user.email) {
            const allBancos = await db.collection('bancos').get();
            for (const bancoDoc of allBancos.docs) {
                if (bancos.some((b) => b.id === bancoDoc.id))
                    continue;
                const miembrosSnapshot = await bancoDoc.ref
                    .collection('miembros')
                    .where('email', '==', user.email)
                    .limit(1)
                    .get();
                if (!miembrosSnapshot.empty) {
                    const data = bancoDoc.data();
                    bancos.push({ id: bancoDoc.id, ...data });
                }
            }
        }
        return bancos;
    }
    async getBancoById(bancoId, user) {
        const db = this.firebaseService.firestore;
        const doc = await db.collection('bancos').doc(bancoId).get();
        if (!doc.exists)
            return null;
        const data = doc.data();
        const miembroSnap = await doc.ref
            .collection('miembros')
            .where('uid', '==', user.uid)
            .limit(1)
            .get();
        if (miembroSnap.empty) {
            throw new common_1.ForbiddenException('No tienes acceso a esta cartera');
        }
        const [miembrosSnapshot, transaccionesSnapshot] = await Promise.all([
            doc.ref.collection('miembros').get(),
            doc.ref.collection('transacciones').orderBy('fecha', 'desc').limit(50).get(),
        ]);
        const miembros = miembrosSnapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
        }));
        const transacciones = transaccionesSnapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
        }));
        return { id: doc.id, ...data, miembros, transacciones };
    }
    async updateBanco(bancoId, dto, user) {
        const db = this.firebaseService.firestore;
        const docRef = db.collection('bancos').doc(bancoId);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException('Cartera no encontrada');
        }
        const data = doc.data();
        if (data.creadoPor !== user.uid) {
            throw new common_1.ForbiddenException('Solo el creador puede editar la cartera');
        }
        const updates = {};
        if (dto.descripcion !== undefined)
            updates.descripcion = dto.descripcion;
        if (Object.keys(updates).length === 0) {
            throw new common_1.BadRequestException('No hay campos para actualizar');
        }
        await docRef.update(updates);
        return { id: bancoId, ...updates };
    }
    async deleteBanco(bancoId, user) {
        const db = this.firebaseService.firestore;
        const docRef = db.collection('bancos').doc(bancoId);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException('Cartera no encontrada');
        }
        const data = doc.data();
        if (data.creadoPor !== user.uid) {
            throw new common_1.ForbiddenException('Solo el creador puede eliminar la cartera');
        }
        if (data.saldo > 0) {
            throw new common_1.BadRequestException('No puedes eliminar una cartera con saldo positivo. Retira el dinero primero.');
        }
        await this.deleteSubcollection(docRef.collection('miembros'));
        await this.deleteSubcollection(docRef.collection('transacciones'));
        await docRef.delete();
        return { message: 'Cartera eliminada correctamente' };
    }
    async joinBancoByCode(codigo, user) {
        const db = this.firebaseService.firestore;
        if (!user.email) {
            throw new common_1.BadRequestException('El usuario autenticado no tiene email registrado');
        }
        const bancosSnapshot = await db
            .collection('bancos')
            .where('codigoCompartir', '==', codigo)
            .limit(1)
            .get();
        if (bancosSnapshot.empty) {
            throw new common_1.NotFoundException('Cartera no encontrada con ese código');
        }
        const bancoDoc = bancosSnapshot.docs[0];
        const bancoData = bancoDoc.data();
        const miembroExistente = await bancoDoc.ref
            .collection('miembros')
            .doc(user.email)
            .get();
        if (miembroExistente.exists) {
            throw new common_1.BadRequestException('Ya eres miembro de esta cartera');
        }
        const nuevoMiembro = {
            uid: user.uid,
            email: user.email,
            saldoAportado: 0,
            rol: 'invitado',
        };
        await bancoDoc.ref.collection('miembros').doc(user.email).set(nuevoMiembro);
        const memberEmails = await this.getBancoMemberEmails(bancoDoc.ref);
        const newMemberName = user.email?.split('@')[0] ?? 'Alguien';
        this.emailService
            .notifyWalletMemberJoined(memberEmails.filter((e) => e !== user.email), user.email, newMemberName, bancoData.nombre)
            .catch(() => { });
        return {
            id: bancoDoc.id,
            nombre: bancoData.nombre,
        };
    }
    async depositar(bancoId, dto, user) {
        const db = this.firebaseService.firestore;
        const docRef = db.collection('bancos').doc(bancoId);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException('Cartera no encontrada');
        }
        const data = doc.data();
        await this.assertMember(docRef, user);
        const nuevoSaldo = data.saldo + dto.monto;
        const now = new Date().toISOString();
        await docRef.update({ saldo: nuevoSaldo });
        await docRef.collection('transacciones').add({
            carteraId: bancoId,
            userId: user.uid,
            tipo: 'deposito',
            monto: dto.monto,
            descripcion: dto.descripcion ?? 'Depósito',
            fecha: now,
        });
        if (user.email) {
            const miembroRef = docRef.collection('miembros').doc(user.email);
            const miembroDoc = await miembroRef.get();
            if (miembroDoc.exists) {
                const miembroData = miembroDoc.data();
                await miembroRef.update({
                    saldoAportado: miembroData.saldoAportado + dto.monto,
                });
            }
        }
        if (data.tipo === 'compartida') {
            const memberEmails = await this.getBancoMemberEmails(docRef);
            this.emailService
                .notifyWalletDeposit(memberEmails, user.email, user.email?.split('@')[0] ?? 'Alguien', data.nombre, dto.monto, nuevoSaldo)
                .catch(() => { });
        }
        return { saldoAnterior: data.saldo, nuevoSaldo, monto: dto.monto };
    }
    async retirar(bancoId, dto, user) {
        const db = this.firebaseService.firestore;
        const docRef = db.collection('bancos').doc(bancoId);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException('Cartera no encontrada');
        }
        const data = doc.data();
        await this.assertMember(docRef, user);
        if (data.saldo < dto.monto) {
            throw new common_1.BadRequestException('Saldo insuficiente');
        }
        const nuevoSaldo = data.saldo - dto.monto;
        const now = new Date().toISOString();
        await docRef.update({ saldo: nuevoSaldo });
        await docRef.collection('transacciones').add({
            carteraId: bancoId,
            userId: user.uid,
            tipo: 'retiro',
            monto: dto.monto,
            descripcion: dto.descripcion ?? 'Retiro',
            fecha: now,
        });
        if (data.tipo === 'compartida') {
            const memberEmails = await this.getBancoMemberEmails(docRef);
            this.emailService
                .notifyWalletWithdraw(memberEmails, user.email, user.email?.split('@')[0] ?? 'Alguien', data.nombre, dto.monto, nuevoSaldo)
                .catch(() => { });
        }
        return { saldoAnterior: data.saldo, nuevoSaldo, monto: dto.monto };
    }
    async deducirDeCartera(bancoId, monto, metaId, user) {
        const db = this.firebaseService.firestore;
        const docRef = db.collection('bancos').doc(bancoId);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException('Cartera no encontrada');
        }
        const data = doc.data();
        await this.assertMember(docRef, user);
        if (data.saldo < monto) {
            throw new common_1.BadRequestException(`Saldo insuficiente en "${data.nombre}". Disponible: $${data.saldo.toLocaleString()}`);
        }
        const nuevoSaldo = data.saldo - monto;
        const now = new Date().toISOString();
        await docRef.update({ saldo: nuevoSaldo });
        await docRef.collection('transacciones').add({
            carteraId: bancoId,
            userId: user.uid,
            tipo: 'aporte_meta',
            monto,
            metaId,
            descripcion: `Aporte a meta ${metaId}`,
            fecha: now,
        });
        return { saldoAnterior: data.saldo, nuevoSaldo };
    }
    async assertMember(docRef, user) {
        const data = (await docRef.get()).data();
        if (data.tipo === 'compartida') {
            if (user.email) {
                const miembroDoc = await docRef
                    .collection('miembros')
                    .doc(user.email)
                    .get();
                if (miembroDoc.exists)
                    return;
            }
            throw new common_1.ForbiddenException('No eres miembro de esta cartera compartida');
        }
        if (data.uid !== user.uid) {
            throw new common_1.ForbiddenException('No tienes acceso a esta cartera');
        }
    }
    async getBancoMemberEmails(docRef) {
        const miembrosSnap = await docRef.collection('miembros').get();
        return miembrosSnap.docs.map((d) => d.data().email);
    }
    async deleteSubcollection(collectionRef) {
        const snapshot = await collectionRef.get();
        const batch = this.firebaseService.firestore.batch();
        snapshot.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
    }
};
exports.BancosService = BancosService;
exports.BancosService = BancosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        email_service_1.EmailService,
        config_1.ConfigService])
], BancosService);
//# sourceMappingURL=bancos.service.js.map