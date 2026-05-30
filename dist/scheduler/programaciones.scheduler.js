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
var ProgramacionesScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramacionesScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const firebase_service_1 = require("../config/firebase/firebase.service");
const programaciones_service_1 = require("../modules/programaciones/programaciones.service");
const bancos_service_1 = require("../modules/bancos/bancos.service");
const goals_service_1 = require("../modules/goals/goals.service");
let ProgramacionesScheduler = ProgramacionesScheduler_1 = class ProgramacionesScheduler {
    constructor(firebaseService, programacionesService, bancosService, goalsService) {
        this.firebaseService = firebaseService;
        this.programacionesService = programacionesService;
        this.bancosService = bancosService;
        this.goalsService = goalsService;
        this.logger = new common_1.Logger(ProgramacionesScheduler_1.name);
    }
    async ejecutarProgramacionesDiarias() {
        const today = new Date();
        const dia = today.getDate();
        if (dia > 28) {
            this.logger.log(`Día ${dia} > 28, sin programaciones que ejecutar hoy`);
            return;
        }
        this.logger.log(`Ejecutando programaciones para el día ${dia}`);
        try {
            const programaciones = await this.programacionesService.getProgramacionesActivasDelDia(dia);
            this.logger.log(`Encontradas ${programaciones.length} programaciones activas`);
            for (const prog of programaciones) {
                try {
                    await this.ejecutarProgramacion(prog);
                }
                catch (err) {
                    this.logger.error(`Error ejecutando programacion ${prog.id} para usuario ${prog.userId}: ${err instanceof Error ? err.message : 'Error desconocido'}`);
                }
            }
            this.logger.log('Ejecucion diaria de programaciones finalizada');
        }
        catch (err) {
            this.logger.error(`Error en la ejecucion diaria: ${err instanceof Error ? err.message : 'Error desconocido'}`);
        }
    }
    async ejecutarProgramacion(prog) {
        const db = this.firebaseService.firestore;
        const carteraDoc = await db.collection('bancos').doc(prog.carteraId).get();
        if (!carteraDoc.exists) {
            this.logger.warn(`Cartera ${prog.carteraId} no encontrada, saltando programacion ${prog.id}`);
            return;
        }
        const carteraData = carteraDoc.data();
        let montoATransferir;
        if (prog.tipo === 'fijo') {
            montoATransferir = prog.monto ?? 0;
        }
        else {
            const porcentaje = prog.porcentaje ?? 0;
            montoATransferir = Math.floor(carteraData.saldo * (porcentaje / 100));
        }
        if (montoATransferir <= 0) {
            this.logger.warn(`Monto a transferir es 0 o negativo para programacion ${prog.id} (tipo=${prog.tipo}, cartera=${carteraData.nombre}, saldo=${carteraData.saldo})`);
            return;
        }
        if (carteraData.saldo < montoATransferir) {
            this.logger.warn(`Saldo insuficiente en cartera "${carteraData.nombre}" (${carteraData.saldo}) para transferir ${montoATransferir} a meta ${prog.metaId}`);
            return;
        }
        const goalDoc = await db.collection('metas').doc(prog.metaId).get();
        if (!goalDoc.exists) {
            this.logger.warn(`Meta ${prog.metaId} no encontrada, saltando programacion ${prog.id}`);
            return;
        }
        const goalData = goalDoc.data();
        if (goalData['estado'] !== 'activo') {
            this.logger.warn(`Meta ${prog.metaId} no esta activa, saltando programacion ${prog.id}`);
            return;
        }
        const miembrosSnapshot = await goalDoc.ref
            .collection('miembros')
            .where('uid', '==', prog.userId)
            .limit(1)
            .get();
        if (miembrosSnapshot.empty) {
            this.logger.warn(`Usuario ${prog.userId} no es miembro de la meta ${prog.metaId}, saltando programacion ${prog.id}`);
            return;
        }
        const miembroDoc = miembrosSnapshot.docs[0];
        const miembroData = miembroDoc.data();
        const now = new Date().toISOString();
        const nuevoSaldoCartera = carteraData.saldo - montoATransferir;
        const nuevoMontoAcumulado = goalData['montoAcumulado'] + montoATransferir;
        const nuevoSaldoMiembro = miembroData.saldoAportado + montoATransferir;
        await carteraDoc.ref.update({ saldo: nuevoSaldoCartera });
        await goalDoc.ref.update({ montoAcumulado: nuevoMontoAcumulado });
        await miembroDoc.ref.update({ saldoAportado: nuevoSaldoMiembro });
        await carteraDoc.ref.collection('transacciones').add({
            carteraId: prog.carteraId,
            userId: prog.userId,
            tipo: 'aporte_meta',
            monto: montoATransferir,
            metaId: prog.metaId,
            descripcion: `Aporte automatico a meta (programacion ${prog.id})`,
            fecha: now,
        });
        const cuotasSnapshot = await goalDoc.ref
            .collection('control_cuotas')
            .where('usuarioEmail', '==', miembroData.email)
            .where('estado', '==', 'PENDIENTE')
            .get();
        const cuotasOrdenadas = cuotasSnapshot.docs
            .map((cDoc) => ({ ref: cDoc.ref, data: cDoc.data() }))
            .sort((a, b) => a.data.anio - b.data.anio || a.data.mes - b.data.mes);
        let remaining = montoATransferir;
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
        this.logger.log(`Transferencia automatica: $${montoATransferir} de cartera "${carteraData.nombre}" -> meta "${goalData['nombre']}" (programacion ${prog.id})`);
    }
};
exports.ProgramacionesScheduler = ProgramacionesScheduler;
__decorate([
    (0, schedule_1.Cron)('5 0 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProgramacionesScheduler.prototype, "ejecutarProgramacionesDiarias", null);
exports.ProgramacionesScheduler = ProgramacionesScheduler = ProgramacionesScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        programaciones_service_1.ProgramacionesService,
        bancos_service_1.BancosService,
        goals_service_1.GoalsService])
], ProgramacionesScheduler);
//# sourceMappingURL=programaciones.scheduler.js.map