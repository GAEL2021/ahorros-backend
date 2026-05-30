import { FirebaseService } from '../../config/firebase/firebase.service';
import { BancosService } from '../bancos/bancos.service';
import { CreateProgramacionDto } from './dto/create-programacion.dto';
import { UpdateProgramacionDto } from './dto/update-programacion.dto';
import { FirebaseUser } from '../../common/guards/firebase-auth.guard';
export interface ProgramacionDocument {
    userId: string;
    carteraId: string;
    metaId: string;
    tipo: 'fijo' | 'porcentaje';
    monto?: number;
    porcentaje?: number;
    diaDelMes: number;
    activo: boolean;
    creadoEn: string;
}
export declare class ProgramacionesService {
    private readonly firebaseService;
    private readonly bancosService;
    constructor(firebaseService: FirebaseService, bancosService: BancosService);
    createProgramacion(dto: CreateProgramacionDto, user: FirebaseUser): Promise<{
        userId: string;
        carteraId: string;
        metaId: string;
        tipo: "fijo" | "porcentaje";
        monto?: number;
        porcentaje?: number;
        diaDelMes: number;
        activo: boolean;
        creadoEn: string;
        id: string;
    }>;
    getUserProgramaciones(user: FirebaseUser): Promise<{
        userId: string;
        carteraId: string;
        metaId: string;
        tipo: "fijo" | "porcentaje";
        monto?: number;
        porcentaje?: number;
        diaDelMes: number;
        activo: boolean;
        creadoEn: string;
        id: string;
    }[]>;
    updateProgramacion(id: string, dto: UpdateProgramacionDto, user: FirebaseUser): Promise<{
        id: string;
    }>;
    deleteProgramacion(id: string, user: FirebaseUser): Promise<{
        message: string;
    }>;
    toggleProgramacion(id: string, user: FirebaseUser): Promise<{
        id: string;
        activo: boolean;
    }>;
    getProgramacionesActivasDelDia(dia: number): Promise<(ProgramacionDocument & {
        id: string;
    })[]>;
}
