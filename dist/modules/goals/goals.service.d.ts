import { ConfigService } from '@nestjs/config';
import { FirebaseService } from '../../config/firebase/firebase.service';
import { BancosService } from '../bancos/bancos.service';
import { ProgramacionesService } from '../programaciones/programaciones.service';
import { EmailService } from '../../common/email/email.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { ContribuirDto } from './dto/contribuir.dto';
import { FirebaseUser } from '../../common/guards/firebase-auth.guard';
export interface GoalMember {
    uid: string;
    email: string;
    cuotaMensual: number;
    saldoAportado: number;
    rol: 'creador' | 'invitado';
}
export interface GoalDocument {
    nombre: string;
    montoObjetivo: number;
    fechaLimite: string;
    montoAcumulado: number;
    mesesRestantes: number;
    estado: 'activo' | 'completado' | 'cancelado';
    creadoPor: string;
    creadoEn: string;
    codigoCompartir: string;
}
export interface ControlCuota {
    usuarioEmail: string;
    anio: number;
    mes: number;
    cuotaEsperada: number;
    fechaInicio: string;
    fechaFin: string;
    estado: 'PENDIENTE' | 'PAGADO' | 'PARCIAL';
}
export interface Hito {
    porcentaje: number;
    montoObjetivo: number;
    fechaLimiteEsperada: string;
    mesesAsignados: number;
    estado: 'PENDIENTE' | 'ALCANZADO';
}
export declare class GoalsService {
    private readonly firebaseService;
    private readonly bancosService;
    private readonly programacionesService;
    private readonly emailService;
    private readonly configService;
    constructor(firebaseService: FirebaseService, bancosService: BancosService, programacionesService: ProgramacionesService, emailService: EmailService, configService: ConfigService);
    createGoal(dto: CreateGoalDto, user: FirebaseUser): Promise<{
        id: string;
        meta: GoalDocument;
    }>;
    getUserGoals(user: FirebaseUser): Promise<(GoalDocument & {
        id: string;
    })[]>;
    getGoalById(goalId: string): Promise<{
        miembros: Array<GoalMember & {
            id: string;
        }>;
        controlCuotas: Array<ControlCuota & {
            id: string;
        }>;
        hitos: Array<Hito & {
            id: string;
        }>;
        nombre: string;
        montoObjetivo: number;
        fechaLimite: string;
        montoAcumulado: number;
        mesesRestantes: number;
        estado: "activo" | "completado" | "cancelado";
        creadoPor: string;
        creadoEn: string;
        codigoCompartir: string;
        id: string;
    } | null>;
    getGoalControlCuotas(goalId: string): Promise<(ControlCuota & {
        id: string;
    })[] | null>;
    joinGoalByCode(codigo: string, user: FirebaseUser): Promise<{
        id: string;
        nombre: string;
        montoObjetivo: number;
    }>;
    deleteGoal(goalId: string, user: FirebaseUser): Promise<{
        message: string;
    }>;
    updateGoal(goalId: string, dto: UpdateGoalDto, user: FirebaseUser): Promise<{
        nombre?: string | undefined;
        montoObjetivo?: number | undefined;
        fechaLimite?: string | undefined;
        montoAcumulado?: number | undefined;
        mesesRestantes?: number | undefined;
        estado?: "activo" | "completado" | "cancelado" | undefined;
        creadoPor?: string | undefined;
        creadoEn?: string | undefined;
        codigoCompartir?: string | undefined;
        id: string;
    }>;
    contributeToGoal(goalId: string, dto: ContribuirDto, user: FirebaseUser): Promise<{
        nuevoSaldoAportado: number;
        nuevoMontoAcumulado: number;
        metaMontoObjetivo: number;
    }>;
    private getGoalMemberEmails;
    private deleteSubcollection;
    private generarCodigoUnico;
    private calcularMeses;
}
