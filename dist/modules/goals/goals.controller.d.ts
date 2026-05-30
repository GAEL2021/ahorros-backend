import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { JoinGoalDto } from './dto/join-goal.dto';
import { ContribuirDto } from './dto/contribuir.dto';
import { Request } from 'express';
export declare class GoalsController {
    private readonly goalsService;
    constructor(goalsService: GoalsService);
    create(dto: CreateGoalDto, req: Request): Promise<{
        id: string;
        meta: import("./goals.service").GoalDocument;
    }>;
    getUserGoals(req: Request): Promise<(import("./goals.service").GoalDocument & {
        id: string;
    })[]>;
    joinByCode(dto: JoinGoalDto, req: Request): Promise<{
        id: string;
        nombre: string;
        montoObjetivo: number;
    }>;
    getGoalById(id: string): Promise<{
        miembros: (import("./goals.service").GoalMember & {
            id: string;
        })[];
        controlCuotas: (import("./goals.service").ControlCuota & {
            id: string;
        })[];
        hitos: (import("./goals.service").Hito & {
            id: string;
        })[];
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
    }>;
    updateGoal(id: string, dto: UpdateGoalDto, req: Request): Promise<{
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
    deleteGoal(id: string, req: Request): Promise<{
        message: string;
    }>;
    contribute(id: string, dto: ContribuirDto, req: Request): Promise<{
        nuevoSaldoAportado: number;
        nuevoMontoAcumulado: number;
        metaMontoObjetivo: number;
    }>;
    getControlCuotas(id: string): Promise<(import("./goals.service").ControlCuota & {
        id: string;
    })[]>;
}
