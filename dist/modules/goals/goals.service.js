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
exports.GoalsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const firebase_service_1 = require("../../config/firebase/firebase.service");
const bancos_service_1 = require("../bancos/bancos.service");
const programaciones_service_1 = require("../programaciones/programaciones.service");
const email_service_1 = require("../../common/email/email.service");
const HITO_PORCENTAJES = [25, 50, 75, 100];
let GoalsService = class GoalsService {
    constructor(firebaseService, bancosService, programacionesService, emailService, configService) {
        this.firebaseService = firebaseService;
        this.bancosService = bancosService;
        this.programacionesService = programacionesService;
        this.emailService = emailService;
        this.configService = configService;
    }
    async createGoal(dto, user) {
        const db = this.firebaseService.firestore;
        if (!user.email) {
            throw new common_1.BadRequestException('El usuario autenticado no tiene email registrado');
        }
        const fechaLimite = new Date(dto.fechaLimite);
        const ahora = new Date();
        if (fechaLimite <= ahora) {
            throw new common_1.BadRequestException('La fecha límite debe ser futura');
        }
        const todosLosEmails = [user.email, ...(dto.invitadosEmails ?? [])];
        const emailsUnicos = [...new Set(todosLosEmails)];
        const totalParticipantes = emailsUnicos.length;
        const mesesRestantes = this.calcularMeses(ahora, fechaLimite);
        const cuotaPorMiembro = Math.ceil(dto.montoObjetivo / totalParticipantes / mesesRestantes);
        const goalId = db.collection('metas').doc().id;
        const codigoCompartir = this.generarCodigoUnico();
        try {
            const result = await db.runTransaction(async (transaction) => {
                const miembros = emailsUnicos.map((email, index) => ({
                    uid: index === 0 ? user.uid : '',
                    email,
                    cuotaMensual: cuotaPorMiembro,
                    saldoAportado: 0,
                    rol: index === 0 ? 'creador' : 'invitado',
                }));
                const goalRef = db.collection('metas').doc(goalId);
                const goalData = {
                    nombre: dto.nombre,
                    montoObjetivo: dto.montoObjetivo,
                    fechaLimite: dto.fechaLimite,
                    montoAcumulado: 0,
                    mesesRestantes,
                    estado: 'activo',
                    creadoPor: user.uid,
                    creadoEn: ahora.toISOString(),
                    codigoCompartir,
                };
                transaction.set(goalRef, goalData);
                const miembrosCollection = goalRef.collection('miembros');
                miembros.forEach((m) => {
                    transaction.set(miembrosCollection.doc(m.email), m);
                });
                const cuotasCollection = goalRef.collection('control_cuotas');
                for (const miembro of miembros) {
                    for (let i = 0; i < mesesRestantes; i++) {
                        const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth() + i, 1);
                        const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + i + 1, 0);
                        const docId = `${miembro.email}_${inicioMes.getFullYear()}_${inicioMes.getMonth() + 1}`;
                        const cuota = {
                            usuarioEmail: miembro.email,
                            anio: inicioMes.getFullYear(),
                            mes: inicioMes.getMonth() + 1,
                            cuotaEsperada: cuotaPorMiembro,
                            fechaInicio: inicioMes.toISOString(),
                            fechaFin: finMes.toISOString(),
                            estado: 'PENDIENTE',
                        };
                        transaction.set(cuotasCollection.doc(docId), cuota);
                    }
                }
                const hitosCollection = goalRef.collection('hitos');
                for (const porcentaje of HITO_PORCENTAJES) {
                    const mesesAsignados = Math.max(1, Math.ceil(mesesRestantes * (porcentaje / 100)));
                    const fechaHito = new Date(ahora.getFullYear(), ahora.getMonth() + mesesAsignados, 0);
                    const montoHito = Math.ceil(dto.montoObjetivo * (porcentaje / 100));
                    const hito = {
                        porcentaje,
                        montoObjetivo: montoHito,
                        fechaLimiteEsperada: fechaHito.toISOString(),
                        mesesAsignados,
                        estado: 'PENDIENTE',
                    };
                    transaction.set(hitosCollection.doc(`hito_${porcentaje}`), hito);
                }
                return { id: goalId, meta: goalData };
            });
            if (dto.modoAporte === 'automatico' && dto.carteraId) {
                await this.programacionesService.createProgramacion({
                    carteraId: dto.carteraId,
                    metaId: goalId,
                    tipo: dto.programacionTipo ?? 'fijo',
                    monto: dto.programacionMonto,
                    porcentaje: dto.programacionPorcentaje,
                    diaDelMes: dto.programacionDia ?? 1,
                    activo: true,
                }, user);
            }
            if (dto.invitadosEmails && dto.invitadosEmails.length > 0) {
                const appUrl = this.configService.get('APP_URL') ?? 'http://localhost:5173';
                const inviterName = user.email?.split('@')[0] ?? 'Alguien';
                for (const invitedEmail of dto.invitadosEmails) {
                    this.emailService
                        .sendInviteToGoal(invitedEmail, inviterName, dto.nombre, codigoCompartir, appUrl)
                        .catch(() => { });
                }
            }
            return result;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error al crear la meta: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }
    async getUserGoals(user) {
        const db = this.firebaseService.firestore;
        const creadosSnapshot = await db
            .collection('metas')
            .where('creadoPor', '==', user.uid)
            .get();
        const goals = [];
        for (const doc of creadosSnapshot.docs) {
            const data = doc.data();
            goals.push({ id: doc.id, ...data });
        }
        if (user.email) {
            const allMetas = await db.collection('metas').get();
            for (const metaDoc of allMetas.docs) {
                if (goals.some((g) => g.id === metaDoc.id))
                    continue;
                const miembrosSnapshot = await metaDoc.ref
                    .collection('miembros')
                    .where('email', '==', user.email)
                    .limit(1)
                    .get();
                if (!miembrosSnapshot.empty) {
                    const data = metaDoc.data();
                    goals.push({ id: metaDoc.id, ...data });
                }
            }
        }
        return goals;
    }
    async getGoalById(goalId) {
        const db = this.firebaseService.firestore;
        const goalDoc = await db.collection('metas').doc(goalId).get();
        if (!goalDoc.exists)
            return null;
        const goalData = goalDoc.data();
        const [miembrosSnapshot, cuotasSnapshot, hitosSnapshot] = await Promise.all([
            goalDoc.ref.collection('miembros').get(),
            goalDoc.ref.collection('control_cuotas').get(),
            goalDoc.ref.collection('hitos').get(),
        ]);
        return {
            id: goalDoc.id,
            ...goalData,
            miembros: miembrosSnapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            })),
            controlCuotas: cuotasSnapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            })),
            hitos: hitosSnapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            })),
        };
    }
    async getGoalControlCuotas(goalId) {
        const db = this.firebaseService.firestore;
        const goalDoc = await db.collection('metas').doc(goalId).get();
        if (!goalDoc.exists)
            return null;
        const cuotasSnapshot = await goalDoc.ref
            .collection('control_cuotas')
            .get();
        return cuotasSnapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
        }));
    }
    async joinGoalByCode(codigo, user) {
        const db = this.firebaseService.firestore;
        if (!user.email) {
            throw new common_1.BadRequestException('El usuario autenticado no tiene email registrado');
        }
        const metasSnapshot = await db
            .collection('metas')
            .where('codigoCompartir', '==', codigo)
            .limit(1)
            .get();
        if (metasSnapshot.empty) {
            throw new common_1.NotFoundException('Código inválido. No se encontró ninguna meta con ese código.');
        }
        const goalDoc = metasSnapshot.docs[0];
        const goalData = goalDoc.data();
        const miembroExistente = await goalDoc.ref
            .collection('miembros')
            .doc(user.email)
            .get();
        if (miembroExistente.exists) {
            throw new common_1.BadRequestException('Ya eres miembro de esta meta.');
        }
        const ahora = new Date();
        const cuotaPorMiembro = Math.ceil(goalData.montoObjetivo /
            (1 + (await goalDoc.ref.collection('miembros').get()).size) /
            goalData.mesesRestantes);
        const nuevoMiembro = {
            uid: user.uid,
            email: user.email,
            cuotaMensual: cuotaPorMiembro,
            saldoAportado: 0,
            rol: 'invitado',
        };
        await goalDoc.ref.collection('miembros').doc(user.email).set(nuevoMiembro);
        const cuotasBatch = db.batch();
        for (let i = 0; i < goalData.mesesRestantes; i++) {
            const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth() + i, 1);
            const finMes = new Date(ahora.getFullYear(), ahora.getMonth() + i + 1, 0);
            const docId = `${user.email}_${inicioMes.getFullYear()}_${inicioMes.getMonth() + 1}`;
            const cuota = {
                usuarioEmail: user.email,
                anio: inicioMes.getFullYear(),
                mes: inicioMes.getMonth() + 1,
                cuotaEsperada: cuotaPorMiembro,
                fechaInicio: inicioMes.toISOString(),
                fechaFin: finMes.toISOString(),
                estado: 'PENDIENTE',
            };
            cuotasBatch.set(goalDoc.ref.collection('control_cuotas').doc(docId), cuota);
        }
        await cuotasBatch.commit();
        const memberEmails = await this.getGoalMemberEmails(goalDoc.ref);
        const newMemberName = user.email?.split('@')[0] ?? 'Alguien';
        this.emailService
            .notifyGoalMemberJoined(memberEmails.filter((e) => e !== user.email), user.email, newMemberName, goalData.nombre)
            .catch(() => { });
        return {
            id: goalDoc.id,
            nombre: goalData.nombre,
            montoObjetivo: goalData.montoObjetivo,
        };
    }
    async deleteGoal(goalId, user) {
        const db = this.firebaseService.firestore;
        const goalRef = db.collection('metas').doc(goalId);
        const goalDoc = await goalRef.get();
        if (!goalDoc.exists) {
            throw new common_1.NotFoundException('Meta no encontrada');
        }
        const goalData = goalDoc.data();
        if (goalData.creadoPor !== user.uid) {
            throw new common_1.ForbiddenException('Solo el creador puede eliminar la meta');
        }
        await this.deleteSubcollection(goalRef.collection('miembros'));
        await this.deleteSubcollection(goalRef.collection('control_cuotas'));
        await this.deleteSubcollection(goalRef.collection('hitos'));
        await goalRef.delete();
        return { message: 'Meta eliminada correctamente' };
    }
    async updateGoal(goalId, dto, user) {
        const db = this.firebaseService.firestore;
        const goalRef = db.collection('metas').doc(goalId);
        const goalDoc = await goalRef.get();
        if (!goalDoc.exists) {
            throw new common_1.NotFoundException('Meta no encontrada');
        }
        const goalData = goalDoc.data();
        if (goalData.creadoPor !== user.uid) {
            throw new common_1.ForbiddenException('Solo el creador puede editar la meta');
        }
        const updates = {};
        if (dto.nombre !== undefined)
            updates.nombre = dto.nombre;
        if (dto.montoObjetivo !== undefined)
            updates.montoObjetivo = dto.montoObjetivo;
        if (dto.fechaLimite !== undefined)
            updates.fechaLimite = dto.fechaLimite;
        if (Object.keys(updates).length === 0) {
            throw new common_1.BadRequestException('No hay campos para actualizar');
        }
        await goalRef.update(updates);
        const cambios = [];
        if (dto.nombre !== undefined)
            cambios.push(`Nombre cambiado a "${dto.nombre}"`);
        if (dto.montoObjetivo !== undefined)
            cambios.push(`Monto objetivo: $${dto.montoObjetivo.toLocaleString()}`);
        if (dto.fechaLimite !== undefined)
            cambios.push(`Fecha límite: ${dto.fechaLimite}`);
        if (cambios.length > 0) {
            const memberEmails = await this.getGoalMemberEmails(goalRef);
            this.emailService
                .notifyGoalUpdated(memberEmails, user.email, user.email?.split('@')[0] ?? 'Alguien', goalData.nombre, cambios)
                .catch(() => { });
        }
        return { id: goalId, ...updates };
    }
    async contributeToGoal(goalId, dto, user) {
        const db = this.firebaseService.firestore;
        if (!user.email) {
            throw new common_1.BadRequestException('El usuario autenticado no tiene email registrado');
        }
        const goalRef = db.collection('metas').doc(goalId);
        const goalDoc = await goalRef.get();
        if (!goalDoc.exists) {
            throw new common_1.NotFoundException('Meta no encontrada');
        }
        const goalData = goalDoc.data();
        if (goalData.estado !== 'activo') {
            throw new common_1.BadRequestException('Solo se puede aportar a metas activas');
        }
        const miembroRef = goalRef.collection('miembros').doc(user.email);
        const miembroDoc = await miembroRef.get();
        if (!miembroDoc.exists) {
            throw new common_1.BadRequestException('No eres miembro de esta meta');
        }
        const miembroData = miembroDoc.data();
        if (dto.carteraId) {
            await this.bancosService.deducirDeCartera(dto.carteraId, dto.monto, goalId, user);
        }
        const nuevoSaldo = miembroData.saldoAportado + dto.monto;
        const nuevoAcumulado = goalData.montoAcumulado + dto.monto;
        await goalRef.update({ montoAcumulado: nuevoAcumulado });
        await miembroRef.update({ saldoAportado: nuevoSaldo });
        const cuotasSnapshot = await goalRef
            .collection('control_cuotas')
            .where('usuarioEmail', '==', user.email)
            .where('estado', '==', 'PENDIENTE')
            .get();
        const cuotasOrdenadas = cuotasSnapshot.docs
            .map((doc) => ({ ref: doc.ref, data: doc.data() }))
            .sort((a, b) => a.data.anio - b.data.anio || a.data.mes - b.data.mes);
        let remaining = dto.monto;
        const batch = db.batch();
        for (const cuota of cuotasOrdenadas) {
            if (remaining <= 0)
                break;
            if (remaining >= cuota.data.cuotaEsperada) {
                batch.update(cuota.ref, { estado: 'PAGADO' });
                remaining -= cuota.data.cuotaEsperada;
            }
            else {
                batch.update(cuota.ref, { estado: 'PARCIAL' });
                remaining = 0;
            }
        }
        if (cuotasOrdenadas.length > 0) {
            await batch.commit();
        }
        if (remaining > 0) {
            const parcialSnapshot = await goalRef
                .collection('control_cuotas')
                .where('usuarioEmail', '==', user.email)
                .where('estado', '==', 'PARCIAL')
                .get();
            const parcialesOrdenadas = parcialSnapshot.docs
                .map((doc) => ({ ref: doc.ref, data: doc.data() }))
                .sort((a, b) => a.data.anio - b.data.anio || a.data.mes - b.data.mes);
            const batch2 = db.batch();
            for (const cuota of parcialesOrdenadas) {
                if (remaining <= 0)
                    break;
                batch2.update(cuota.ref, { estado: 'PAGADO' });
                remaining -= cuota.data.cuotaEsperada;
            }
            if (parcialesOrdenadas.length > 0) {
                await batch2.commit();
            }
        }
        const memberEmails = await this.getGoalMemberEmails(goalRef);
        this.emailService
            .notifyGoalContribution(memberEmails, user.email, user.email?.split('@')[0] ?? 'Alguien', goalData.nombre, dto.monto, nuevoAcumulado, goalData.montoObjetivo)
            .catch(() => { });
        return {
            nuevoSaldoAportado: nuevoSaldo,
            nuevoMontoAcumulado: nuevoAcumulado,
            metaMontoObjetivo: goalData.montoObjetivo,
        };
    }
    async getGoalMemberEmails(goalRef) {
        const miembrosSnap = await goalRef.collection('miembros').get();
        return miembrosSnap.docs.map((d) => d.data().email);
    }
    async deleteSubcollection(collectionRef) {
        const snapshot = await collectionRef.get();
        const batch = this.firebaseService.firestore.batch();
        snapshot.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
    }
    generarCodigoUnico() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }
    calcularMeses(desde, hasta) {
        const diffAnios = hasta.getFullYear() - desde.getFullYear();
        const diffMeses = hasta.getMonth() - desde.getMonth();
        const total = diffAnios * 12 + diffMeses;
        return Math.max(1, total);
    }
};
exports.GoalsService = GoalsService;
exports.GoalsService = GoalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        bancos_service_1.BancosService,
        programaciones_service_1.ProgramacionesService,
        email_service_1.EmailService,
        config_1.ConfigService])
], GoalsService);
//# sourceMappingURL=goals.service.js.map